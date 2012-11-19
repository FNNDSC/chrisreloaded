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

// include pacs helper
require_once 'pacs.class.php';

$shortopts = "f:";
$longopts  = array(
    "feed:"
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
    $feed_dataMapper = new Mapper('Data');
    $feed_dataMapper->filter('id = (?)',$key->data_id);
    $feed_dataMapper->filter('nb_files = status','');
    $feedDataResult = $feed_dataMapper->get();
    if(count($feedDataResult['Data']) == 0){
      $tmp_array[] = $key;
    }
    else{
      // create the links
      //echo $feedDataResult['Data'][0]->nb_files.' - '. $feedDataResult['Data'][0]->status.PHP_EOL;
      
      // update feed status
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