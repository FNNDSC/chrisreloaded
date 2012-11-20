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
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed_data.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_patient.model.php'));

// include pacs helper
require_once 'pacs.class.php';

$shortopts = "f:o:";
$longopts  = array(
    "feed:",
    "output:"
);

$options = getopt($shortopts, $longopts);

$feed_id = $options['f'];

// get all data_id to be linked
// look for the patient
$feed_dataMapper = new Mapper('Feed_Data');
$feed_dataMapper->filter('feed_id = (?)',$feed_id);
$feedDataResult = $feed_dataMapper->get();

//print_r($feedDataResult);

//echo $feedDataResult['Feed_Data'][0]->id;
// init array
//while not done
// copy array for loop
// delete array
$waiting = true;
$tmp_array = $feedDataResult['Feed_Data'];

while($waiting){
  $loop_array = $tmp_array;
  unset($tmp_array);
  $tmp_array = Array();

  foreach($loop_array as $key){
    // check if *ALL* data is there
    $dataMapper = new Mapper('Data');
    $dataMapper->filter('id = (?)',$key->data_id);
    $dataMapper->filter('nb_files = status','');
    $dataResult = $dataMapper->get();
    if(count($dataResult['Data']) == 0){
      $tmp_array[] = $key;
    }
    else{
      // get feed
      $feedMapper = new Mapper('Feed');
      $feedMapper->filter('id = (?)',$key->feed_id);
      $feedResult = $feedMapper->get();

      // get patient
      $patientMapper = new Mapper('Data_Patient');
      $patientMapper->ljoin('Patient','Patient.id = Data_Patient.patient_id');
      $patientMapper->filter('data_id = (?)', $key->data_id);
      $patientResult = $patientMapper->get();

      // create feed patient directories
      // mkdir if dir doesn't exist
      // create folder if doesnt exists
      $datadirname = $options['o'].'/'.$patientResult['Patient'][0]->uid.'-'.$patientResult['Patient'][0]->id;
      //print_r($patientResult);
      //echo $datadirname;
      if(!is_dir($datadirname)){
        mkdir($datadirname);
      }

      // create data soft links
      $targetbase = CHRIS_DATA.$patientResult['Patient'][0]->uid.'-'.$patientResult['Patient'][0]->id;
      $seriesdirnametarget = $targetbase .'/'.$dataResult['Data'][0]->name.'-'.$dataResult['Data'][0]->id;
      $seriesdirnamelink = $datadirname .'/'.$dataResult['Data'][0]->name.'-'.$dataResult['Data'][0]->id;
      if(!is_link($seriesdirnamelink)){
        // create sof link
        symlink($seriesdirnametarget, $seriesdirnamelink);
      }
      
      // create user patient directory
      $patientdirname = $options['o'].'/../../data';
      if(!is_dir($patientdirname)){
        mkdir($patientdirname);
      }
      
      $padidirname = $patientdirname.'/'.$patientResult['Patient'][0]->uid.'-'.$patientResult['Patient'][0]->id;
      if(!is_dir($padidirname)){
        mkdir($padidirname);
      }
      
      $padidirnamelink = $padidirname.'/'.$dataResult['Data'][0]->name.'-'.$dataResult['Data'][0]->id;
      if(!is_link($padidirnamelink)){
        // create sof link
        symlink($seriesdirnametarget, $padidirnamelink);
      }
      //.$patientResult['Patient'][0]->uid.'-'.$patientResult['Patient'][0]->id;
      // create data directory
      
      // update feed status?
    }
  }

  if(empty($tmp_array)){
    $waiting = false;
  }
  else{
    sleep(1);
  }
}
// create patient if doesn't exist
/* if(count($feedDataResult['Patient']) == 0)
 {
// create patient model
$patientObject = new Patient();
$patientObject->name = $results[0]['PatientName'][0];
$date = $results[0]['PatientBirthDate'][0];
$datetime =  substr($date, 0, 4).'-'.substr($date, 4, 2).'-'.substr($date, 6, 2);
$patientObject->dob = $datetime;
$patientObject->sex = $results[0]['PatientSex'][0];
$patientObject->uid = $results[0]['PatientID'][0];
// add the patient model and get its id
$patient_chris_id = Mapper::add($patientObject);
}
// else get its id
else{
$patient_chris_id = $patientResult['Patient'][0]->id;
} */

// link series we are expecting when status == nb of files
//   // MAP DATA TO FEED

?>