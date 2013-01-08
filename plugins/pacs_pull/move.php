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
// include chris data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'study.model.php'));
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

// keep track of dataset received
$received = Array();

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
              $logFile .= '**** DB processing ****'.PHP_EOL;
              //get patient id
              $logFile .= 'getting patient id...'.PHP_EOL;
              $logFile .= 'PatientID exists...? -> '.array_key_exists('PatientID',$process_file).PHP_EOL;
              
              $patient_chris_id = -1;
              //$db, $process_file, $patient_chris_id
              $p_success = PACS::AddPatient($db, $process_file, $patient_chris_id);
              if($p_success == 0){
                echo $logFile;
                return;
              }
              $logFile .= 'patient success: '.$p_success.PHP_EOL;
              $logFile .= 'patient id: '.$patient_chris_id.PHP_EOL;

              $logFile .= 'getting data id...'.PHP_EOL;

              //get data id
              $data_chris_id = -1;
              $series_description = '';
              $d_success = PACS::AddData($db, $process_file, $data_chris_id, $series_description);
              if($d_success == 0){
                echo $logFile;
                return;
              }
              
              // keep track of processed series
              if(!in_array($data_chris_id, $received)){
                array_push($received, $data_chris_id);
              }

              $logFile .= 'data success: '.$d_success.PHP_EOL;
              $logFile .= 'data id: '.$data_chris_id.PHP_EOL;
              
              // get study id
              $studyMapper = new Mapper('Study');
              $studyMapper->filter('uid = (?)',$process_file['StudyInstanceUID'][0] );
              $studyResult = $studyMapper->get();
              
              // if doesnt exist, add data
              $study_chris_id = -1;
              $study_description = '';
              $s_success = PACS::AddStudy($db, $process_file, $study_chris_id, $study_description);
              if($s_success == 0){
                echo $logFile;
                return;
              }
              
              $logFile .= 'study success: '.$d_success.PHP_EOL;
              $logFile .= 'study id: '.$study_chris_id.PHP_EOL;
              $logFile .= 'study description: '.$study_description.PHP_EOL;
              
              // MAP PATIENT TO DATA
              $dataPatientMapper = new Mapper('Data_Patient');
              $dataPatientMapper->filter('patient_id = (?)',$patient_chris_id);
              $dataPatientMapper->filter('data_id = (?)',$data_chris_id);
              $dataPatientResult = $dataPatientMapper->get();
              if(count($dataPatientResult['Data_Patient']) == 0)
              {
                $logFile .= 'Mapping patient to data...'.PHP_EOL;
                $dataPatientObject = new Data_Patient();
                $dataPatientObject->patient_id = $patient_chris_id;
                $dataPatientObject->data_id = $data_chris_id;
                $mapping_id = Mapper::add($dataPatientObject);

                $logFile .= 'patient data id: '.$mapping_id.PHP_EOL;
              }
              else{
                $logFile .= 'Patient already mapped to data...'.PHP_EOL;
                $logFile .= 'patient data id: '.$dataPatientResult['Data_Patient'][0]->id.PHP_EOL;
              }

              // FILESYSTEM Processing
              //
              // Create the patient directory
              //
              $logFile .= '**** FILESYSTEM processing ****'.PHP_EOL;
              $patientdirname = CHRIS_DATA.$process_file['PatientID'][0].'-'.$patient_chris_id;
              // create folder if doesnt exists
              if(!is_dir($patientdirname)){
                mkdir($patientdirname);
                $logFile .= 'MKDIR: '.$patientdirname.PHP_EOL;
              }
              else{
                $logFile .= $patientdirname.' already exists'.PHP_EOL;
              }
              
              //
              // Create the study directory
              //
              $patientdirname .= '/'.$study_description.'-'.$study_chris_id;
              if(!is_dir($patientdirname)){
                mkdir($patientdirname);
                $logFile .= 'MKDIR: '.$patientdirname.PHP_EOL;
              }
              else{
                $logFile .= $patientdirname.' already exists'.PHP_EOL;
              }

              //
              // Create the data directory
              //
              $datadirname = $patientdirname.'/'.$series_description.'-'.$data_chris_id;

              // create folder if doesnt exists
              if(!is_dir($datadirname)){
                mkdir($datadirname);
                $logFile .= 'MKDIR: '.$datadirname.PHP_EOL;
              }
              else{
                $logFile .= $datadirname.' already exists'.PHP_EOL;
              }

              // move file at good location
              // CHRIS_DATA/MRN-UID/STUDYDESC-UID/SERIESDESC-UID/index.dcm
              // cp file over if doesnt exist
              // it happens than some dicom file have more than 1 instance number
              // it appears to be 0 and the real instance number
              //$intanceNumber = max($process_file['InstanceNumber']);
              // different naming based on 
              $intanceNumber = $process_file['SOPInstanceUID'][0];
              $filename = $datadirname .'/'.$intanceNumber.'.dcm';
              if(!is_file($filename)){
                copy($study_directory.'/'.$entry.'/'.$sub_entry, $filename);
                $logFile .= 'COPY: '.$filename.PHP_EOL;
                // if file doesnt exist, +1 status
                // +1 increase data status
                $dataMapper = new Mapper('Data');
                $dataMapper->filter('id = (?)',$data_chris_id);
                $dataResult = $dataMapper->get();

                //
                // update time if time == '0000-00-00 00:00:00'
                //
                if($dataResult['Data'][0]->time == '0000-00-00 00:00:00'){
                  $dataResult['Data'][0]->time = PACS::getTime($process_file);
                }
                
                // update status
                $dataResult['Data'][0]->status += 1;
                // Update database and get object
                Mapper::update($dataResult['Data'][0], $data_chris_id);

                $logFile .= '+1 STATUS: '.$filename.PHP_EOL;
              }
              else{
                $logFile .= $filename.' already exists'.PHP_EOL;
              }

              // delete file
              $logFile .= 'delete: '.$study_directory.'/'.$entry.'/'.$sub_entry.PHP_EOL;
              //unlink($study_directory.'/'.$entry.'/'.$sub_entry);
            }
          }
          closedir($sub_handle);
          // delete directory
          $logFile .= 'delete: '.$study_directory.'/'.$entry.PHP_EOL;
          //rmdir($study_directory.'/'.$entry);
        }
      }
    }
  }
  closedir($handle);
  // delete directory
  $logFile .= 'delete: '.$study_directory.PHP_EOL;
  //rmdir($study_directory);
}

// add warning if we didn't receive all the expected files
foreach($received as $key => $value){
  $dataMapper = new Mapper('Data');
  $dataMapper->filter('id = (?)',$value);
  $dataResult = $dataMapper->get();
  
  if($dataResult['Data'][0]->status != $dataResult['Data'][0]->nb_files){
    // warning in log
    $logFile .= 'WARNING => DATA ID : '.$dataResult['Data'][0]->id.'('.$dataResult['Data'][0]->status.'/'.$dataResult['Data'][0]->nb_files.')'.$entry.PHP_EOL;
    // update db to unlock plugin
    $dataResult['Data'][0]->status = min($dataResult['Data'][0]->status, $dataResult['Data'][0]->nb_files);
    $dataResult['Data'][0]->nb_files = $dataResult['Data'][0]->status;
    Mapper::update($dataResult['Data'][0], $dataResult['Data'][0]->id);
  }
}

echo $logFile;
return;
?>