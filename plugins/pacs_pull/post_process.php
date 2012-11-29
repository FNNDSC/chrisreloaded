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

$options = getopt($shortopts);

$feed_id = $options['f'];
$output_dir = $options['o'];

//
// 1- CREATE POST-PROCESS LOG FILE
//
$logFile = $output_dir.'post_process.log';

//
// 2- GET ALL DATA LINKED TO OUR FEED
//
$feedDataLog = '======================================='.PHP_EOL;
$feedDataLog .= date('Y-m-d h:i:s'). ' ---> Get data linked to our feed...'.PHP_EOL;
$feedDataLog .= 'DB Table: Feed_Data'.PHP_EOL;
$feedDataLog .= 'Feed_id: '.$feed_id.PHP_EOL;

$feed_dataMapper = new Mapper('Feed_Data');
$feed_dataMapper->filter('feed_id = (?)',$feed_id);
$feedDataResult = $feed_dataMapper->get();

// check if there is anny match
// if not, we have a problem...
if(count($feedDataResult['Feed_Data']) == 0){
  $feedDataLog .= "No match in DB".PHP_EOL;
  $feedDataLog .= "Stopping post_process.php Line: ".__LINE__.PHP_EOL;
  $feedDataLog .= "EXIT CODE 1".PHP_EOL;
  $fh = fopen($logFile, 'a')  or die("can't open file");
  fwrite($fh, $feedDataLog);
  fclose($fh);
  exit(1);
}

$feedDataLog .= count($feedDataResult['Feed_Data'])." match(es) in DB".PHP_EOL;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $feedDataLog);
fclose($fh);

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
      //
      // DATA HAS ARRIVED
      //
      $dataLog = '======================================='.PHP_EOL;
      $dataLog .= date('Y-m-d h:i:s'). ' ---> New data has arrived...'.PHP_EOL;

      // get patient
      $patientMapper = new Mapper('Data_Patient');
      $patientMapper->ljoin('Patient','Patient.id = Data_Patient.patient_id');
      $patientMapper->filter('Data_Patient.data_id = (?)', $key->data_id);
      $patientResult = $patientMapper->get();

      // create feed patient directories
      // mkdir if dir doesn't exist
      // create folder if doesnt exists
      if(count($patientResult['Patient']) == 0){
        $dataLog .= "Could find patient related to the data...".PHP_EOL;
        $dataLog .= "Data_id: ".$key->data_id;
        $dataLog .= "Stopping post_process.php Line: ".__LINE__.PHP_EOL;
        $dataLog .= "EXIT CODE 1".PHP_EOL;
        $fh = fopen($logFile, 'a')  or die("can't open file");
        fwrite($fh, $dataLog);
        fclose($fh);
        exit(1);
      }

      $dataLog .= count($patientResult['Patient'])." patient(s) related to the data found...".PHP_EOL;
      $dataLog .= "-- Patient information --".PHP_EOL;
      $dataLog .= "Patient UID: ".$patientResult['Patient'][0]->uid.PHP_EOL;
      $dataLog .= "Patient CHRIS ID: ".$patientResult['Patient'][0]->id.PHP_EOL;
      $dataLog .= "-- Data information --".PHP_EOL;
      $dataLog .= "Data name: ".$dataResult['Data'][0]->name.PHP_EOL;
      $dataLog .= "Data CHRIS ID: ".$key->data_id.PHP_EOL;

      $datadirname = $output_dir.'/'.$patientResult['Patient'][0]->uid.'-'.$patientResult['Patient'][0]->id;
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
      $patientdirname = $output_dir.'/../../data';
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

      /**
       * @todo Update the feed status
       */
      // update feed status?
      $fh = fopen($logFile, 'a')  or die("can't open file");
      fwrite($fh, $dataLog);
      fclose($fh);
    }
  }

  if(empty($tmp_array)){
    $waiting = false;
  }
  else{
    sleep(2);
  }
}

$finishLog = '======================================='.PHP_EOL;
$finishLog .= date('Y-m-d h:i:s'). ' ---> All data has arrived...'.PHP_EOL;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $finishLog);
fclose($fh);

// update feed status in db
$feedMapper = new Mapper('Feed');
$feedMapper->filter('id = (?)',$feed_id);
$feedResult = $feedMapper->get();
$feedResult['Feed'][0]->status = 99;
Mapper::update($feedResult['Feed'][0],  $feedResult['Feed'][0]->id);

exit(0);
?>