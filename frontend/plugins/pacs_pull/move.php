#!/usr/bin/php
<?php
/**
 *
 *            sSSs   .S    S.    .S_sSSs     .S    sSSs
 *           d%%SP  .SS    SS.  .SS~YS%%b   .SS   d%%SP
 *          d%S'    S%S    S%S  S%S   `S%b  S%S  d%S'
 *          S%S     S%S    S%S  S%S    S%S  S%S  S%|
 *          S&S     S%S SSSS%S  S%S    d* S  S&S  S&S
 *          S&S     S&S  SSS&S  S&S   .S* S  S&S  Y&Ss
 *          S&S     S&S    S&S  S&S_sdSSS   S&S  `S&&S
 *          S&S     S&S    S&S  S&S~YSY%b   S&S    `S*S
 *          S*b     S*S    S*S  S*S   `S%b  S*S     l*S
 *          S*S.    S*S    S*S  S*S    S%S  S*S    .S*P
 *           SSSbs  S*S    S*S  S*S    S&S  S*S  sSS*S
 *            YSSP  SSS    S*S  S*S    SSS  S*S  YSS'
 *                         SP   SP          SP
 *                         Y    Y           Y
 *
 *                     R  E  L  O  A  D  E  D
 *
 * (c) 2012 Fetal-Neonatal Neuroimaging & Developmental Science Center
 *                   Boston Children's Hospital
 *
 *              http://childrenshospital.org/FNNDSC/
 *                        dev@babyMRI.org
 *
 */
define('__CHRIS_ENTRY_POINT__', 666);

// include the chris configuration
require_once (dirname(dirname(dirname ( __FILE__ ))).'/config.inc.php');
// include chris db interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'db.class.php'));
// include chris mapper interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'mapper.class.php'));
// include chris data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));
// include chris patient models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.model.php'));
// include chris user_data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_patient.model.php'));

// include pacs helper
require_once (joinPaths(CHRIS_PLUGINS_FOLDER, 'pacs_pull/pacs.class.php'));

$shortopts = "d:";

$options = getopt($shortopts);

$study_directory = $options['d'];

// open log file
$logFile = '';

// move all files from this directory to centralized data
// 1 file of 1 serie at once
if ($handle = opendir($study_directory)) {
  while (false !== ($entry = readdir($handle))) {
    if($entry != "." && $entry != ".."){
      if (is_dir($study_directory.'/'.$entry)) {
        // loop through subdirectory
        if ($sub_handle = opendir($study_directory.'/'.$entry)) {
          while (false !== ($sub_entry = readdir($sub_handle))) {
            if($sub_entry != "." && $sub_entry != ".." && is_file($study_directory.'/'.$entry.'/'.$sub_entry)){
              $process_file = PACS::process($study_directory.'/'.$entry.'/'.$sub_entry);

              $db = DB::getInstance();

              //get patient id
              $logFile .= 'getting patient id...'.PHP_EOL;
              $patient_chris_id = -1;
              //$db, $process_file, $patient_chris_id
              $p_success = PACS::AddPatient($db, $process_file, $patient_chris_id);
              if($p_success == 0){
                echo $logFile;
                return;
              }

              $logFile .= 'patient id: '.$patient_chris_id.PHP_EOL;

              //get data id
              $data_chris_id = -1;
              $series_description = '';
              $d_success = PACS::AddData($db, $process_file, $data_chris_id, $series_description);
              if($d_success == 0){
                echo $logFile;
                return;
              }

              $logFile .= 'data id: '.$data_chris_id.PHP_EOL;

              // map data to user if this data hasn't already been mapper to this user
              // MAP USER TO DATA
              $dataPatientMapper = new Mapper('Data_Patient');
              $dataPatientMapper->filter('patient_id = (?)',$patient_chris_id);
              $dataPatientMapper->filter('data_id = (?)',$data_chris_id);
              $dataPatientResult = $dataPatientMapper->get();
              if(count($dataPatientResult['Data_Patient']) == 0)
              {
                $dataPatientObject = new Data_Patient();
                $dataPatientObject->patient_id = $patient_chris_id;
                $dataPatientObject->data_id = $data_chris_id;
                Mapper::add($dataPatientObject);
              }

              // FILESYSTEM Processing
              //
              // Create the patient directory
              //
              $patientdirname = CHRIS_DATA.$process_file['PatientID'][0].'-'.$patient_chris_id;
              // create folder if doesnt exists
              if(!is_dir($patientdirname)){
                mkdir($patientdirname);
              }

              //
              // Create the data directory
              //
              $datadirname = $patientdirname.'/'.$series_description.'-'.$data_chris_id;

              // create folder if doesnt exists
              if(!is_dir($datadirname)){
                mkdir($datadirname);
              }

              // move file at good location
              // CHRIS_DATA/MRN-UID/SERIESDESC-UID/index.dcm
              // cp file over if doesnt exist
              $filenum = $process_file['InstanceNumber'][0];
              $filename = $datadirname .'/'.$filenum.'.dcm';
              if(!is_file($filename)){
                copy($study_directory.'/'.$entry.'/'.$sub_entry, $filename);
                // if file doesnt exist, +1 status
                // +1 increase data status
                $dataMapper = new Mapper('Data');
                $dataMapper->filter('id = (?)',$data_chris_id);
                $dataResult = $dataMapper->get();

                $dataObject = new Data();
                $dataObject->uid = $dataResult['Data'][0]->uid;
                $dataObject->name = $dataResult['Data'][0]->name;
                $dataObject->time = $dataResult['Data'][0]->time;
                $dataObject->nb_files = $dataResult['Data'][0]->nb_files + 1;
                $dataObject->status = $dataResult['Data'][0]->status;
                $dataObject->plugin = $dataResult['Data'][0]->plugin;
                // Update database and get object
                Mapper::update($dataObject, $data_chris_id);
              }

              // delete file
              //unlink($study_directory.'/'.$entry.'/'.$sub_entry);
            }
          }
          closedir($sub_handle);
          // delete directory
          //rmdir($study_directory.'/'.$entry);
        }
      }
    }
  }
  closedir($handle);
  // delete directory
  //rmdir($study_directory);
}

echo $logFile;
return;
?>