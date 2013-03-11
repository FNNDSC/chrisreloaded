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
// include chris data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_study.model.php'));
// include chris patient models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.model.php'));
// include chris user_data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_patient.model.php'));
// include chris data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));

// include pacs helper
require_once (joinPaths(CHRIS_PLUGINS_FOLDER, 'pacs_pull/pacs.class.php'));


// send email to admin
// should be more generic to email user after plugins has finished too

function sendEmail(&$patientInfo, &$dataLocation, &$emailTo){
  // start email:
  $message = 'Dear ChRIS user,'.PHP_EOL;
  $message .= 'You have a new incoming series available at:'.PHP_EOL.PHP_EOL;
  $message .= 'Output directory: '.$dataLocation.PHP_EOL.PHP_EOL;

  // patient information
  $message .= '===== Patient ====='.PHP_EOL;
  $message .= 'ID: '.$patientInfo['PatientID'][0].PHP_EOL;
  $message .= 'Name: '.$patientInfo['PatientName'][0].PHP_EOL;
  $message .= 'Sex: '.$patientInfo['PatientSex'][0].PHP_EOL;
  $message .= 'BirthDate: '.$patientInfo['PatientBirthDate'][0].PHP_EOL.PHP_EOL;

  // patient information
  $message .= '===== Data ====='.PHP_EOL;
  $message .= 'Study Date: '.$patientInfo['StudyDate'][0].PHP_EOL;
  $message .= 'Study Description: '.$patientInfo['StudyDescription'][0].PHP_EOL;
  $message .= 'Series Description: '.$patientInfo['SeriesDescription'][0].PHP_EOL;
  $message .= 'Protocol: '.$patientInfo['ProtocolName'][0].PHP_EOL;
  $message .= 'Station: '.$patientInfo['StationName'][0].PHP_EOL.PHP_EOL.PHP_EOL;

  $message .= "Thank you for using ChRIS.";

  email(CHRIS_DICOM_EMAIL_FROM, $emailTo, "New dicom series has been received", $message);
}

// main function
$shortopts = "d:";

$options = getopt($shortopts);

$study_directory = $options['d'];
$emailTo = CHRIS_DICOM_EMAIL_TO;

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

              // MAP DATA TO STUDY
              $dataStudyMapper = new Mapper('Data_Study');
              $dataStudyMapper->filter('data_id = (?)',$data_chris_id);
              $dataStudyMapper->filter('study_id = (?)',$study_chris_id);
              $dataStudyResult = $dataStudyMapper->get();
              if(count($dataStudyResult['Data_Study']) == 0)
              {
                $dataStudyObject = new Data_Study();
                $dataStudyObject->data_id = $data_chris_id;
                $dataStudyObject->study_id = $study_chris_id;
                $mapping_data_study_id = Mapper::add($dataStudyObject);

                $logFile .= 'data study id: '.$mapping_data_study_id.PHP_EOL;
              }
              else{
                $logFile .= 'Study already mapped to data...'.PHP_EOL;
                $logFile .= 'data study id: '.$dataStudyResult['Data_Study'][0]->id.PHP_EOL;
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
                
                $myFile = $datadirname.'/0.info';
                $fh = fopen($myFile, 'a');
                
                // Add Patient information
                fwrite($fh, '---------------------------'.PHP_EOL.'    GENERAL INFORMATION    '.PHP_EOL.'---------------------------'.PHP_EOL);
                foreach($process_file as $key => $value)
                  fwrite($fh, $key.' : '.$value[0].PHP_EOL);
                
                // Add Image information
                fwrite($fh, PHP_EOL.'---------------------------'.PHP_EOL.'    IMAGE INFORMATION    '.PHP_EOL.'---------------------------'.PHP_EOL);
                // create the 0.info file, which contains more information about the data
                // build command
                $command = '/bin/bash -c  "';
                $command .= 'source /chb/arch/scripts/chb-fs stable  2>&1 ; mri_info '.$study_directory.'/'.$entry.'/'.$sub_entry.' ;';
                $command .= '"';
                $command_output = shell_exec($command);
                fwrite($fh, $command_output);
                
                
                fclose($fh);
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
              $instance_nb = sprintf('%04d', intval($process_file['InstanceNumber'][0]));
              $filename = $datadirname .'/'.$instance_nb.'-'. $process_file['SOPInstanceUID'][0] . '.dcm';
              if(!is_file($filename)){
                copy($study_directory.'/'.$entry.'/'.$sub_entry, $filename);
                $logFile .= 'COPY: '.$filename.PHP_EOL;
                // if file doesnt exist, +1 status
                // +1 increase data status
                //to do in pacs class (less sql queries)
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
              unlink($study_directory.'/'.$entry.'/'.$sub_entry);
            }
          }
          closedir($sub_handle);
          // delete directory
          $logFile .= 'delete: '.$study_directory.'/'.$entry.PHP_EOL;
          rmdir($study_directory.'/'.$entry);
        }
      }
    }
  }
  closedir($handle);

  // parse files in directory to know who we should email
  if ($handle2 = opendir($study_directory)) {
    /* This is the correct way to loop over the directory. */
    // make an array from scanners name/conact
    $chris_scanners = unserialize(CHRIS_SCANNERS);
    while (false !== ($entry2 = readdir($handle2))) {
      if($entry2 != "." && $entry2 != ".."){
        // if known scanner
        if(array_key_exists($entry2, $chris_scanners)){
          $emailTo .= ','.$chris_scanners[$entry2];
        }
        else{
          // if user exists, add him to the mailing list
          $userMapper = new Mapper('User');
          $userMapper->filter('username = (?)',$entry2);
          $userResult = $userMapper->get();

          if(count($userResult['User']) != 0)
          {
            $emailTo .= ','.$userResult['User'][0]->email;
          }
        }
        // delete the temp file
        unlink($study_directory.'/'.$entry2);
      }
    }
  }
  closedir($handle2);

  // delete directory
  $logFile .= 'delete: '.$study_directory.PHP_EOL;
  rmdir($study_directory);
}

// add warning if we didn't receive all the expected files
// todo: all queries at once
foreach($received as $key => $value){
  $dataMapper = new Mapper('Data');
  $dataMapper->filter('id = (?)',$value);
  $dataResult = $dataMapper->get();

  if($dataResult['Data'][0]->status != $dataResult['Data'][0]->nb_files){
    $logFile .= 'WARNING => DATA ID : '.$dataResult['Data'][0]->id.'('.$dataResult['Data'][0]->status.'/'.$dataResult['Data'][0]->nb_files.')'.$entry.PHP_EOL;
    // update db to unlock plugin
    if($dataResult['Data'][0]->nb_files == -1){
      $dataResult['Data'][0]->nb_files = $dataResult['Data'][0]->status;
    }
    else{
      $dataResult['Data'][0]->status = min($dataResult['Data'][0]->status, $dataResult['Data'][0]->nb_files);
      $dataResult['Data'][0]->nb_files = $dataResult['Data'][0]->status;
    }
    Mapper::update($dataResult['Data'][0], $dataResult['Data'][0]->id);
  }
}

sendEmail($process_file, $datadirname, $emailTo);

echo $logFile;

return;
?>
