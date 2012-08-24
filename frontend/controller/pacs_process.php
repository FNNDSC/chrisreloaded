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
// we define a valid entry point
if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);
// include the configuration file
// requires the full path
$confFile = dirname(__FILE__).'/../config.inc.php';
if(!defined('CHRIS_CONFIG_PARSED')) require_once($confFile);

// include the controller classes
require_once 'db.class.php';
require_once 'mapper.class.php';
require_once 'pacs.class.php';

// include the model classes
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.class.php'));


// define command line arguments
$shortopts = "";
$shortopts .= "p:"; // Incoming file location
$shortopts .= "f:"; // Incoming file name

$options = getopt($shortopts);

$p = $options['p'];
$f = $options['f'];
/*  $p = '/chb/users/chris/data/4387255-361/AX_T2_BLADE-498';
 $f = 'NoFileName.dcm';  */
$tmpfile = $p.'/'.$f;

$result = PACS::process($tmpfile);

// initiate variables
$patient_chris_id = -1;
$data_chris_id = -1;
$image_chris_id = -1;
$protocol_name = 'NoProtocolName';

// start patient table lock
$db = DB::getInstance();
$db->lock('patient', 'WRITE');

if (array_key_exists('PatientName',$result) && array_key_exists('PatientID',$result))
{
  $patientMapper = new Mapper('Patient');
  $patientMapper->filter('name = (?)',$result['PatientName'][0]);
  $patientMapper->filter('patient_id = (?)',$result['PatientID'][0]);
  $patientResult = $patientMapper->get();

  if(count($patientResult['Patient']) == 0)
  {
    // create patient model
    $patientObject = new Patient();
    $patientObject->name = $result['PatientName'][0];
    if(array_key_exists('PatientBirthDate',$result))
    {
      $date = $result['PatientBirthDate'][0];
      $datetime =  substr($date, 0, 4).'-'.substr($date, 4, 2).'-'.substr($date, 6, 2);
      $patientObject->dob = $datetime;
    }
    else{
      $patientObject->dob = '0000-00-00';
    }
    $patientObject->sex = $result['PatientSex'][0];
    $patientObject->patient_id = $result['PatientID'][0];

    // add the patient model and get its id
    $patient_chris_id = Mapper::add($patientObject);
  }
  else {
    // get patient id
    $patient_chris_id = $patientResult['Patient'][0]->id;
  }
}
else {
  echo 'PatientName or PatientMRN not there';
  // finish patient table lock
  $db->unlock();
  return;
}
// finish patient table lock
$db->unlock();

// start data table lock
$db->lock('data', 'WRITE');
// Does data exist: SeriesInstanceUID
if (array_key_exists('SeriesInstanceUID',$result))
{
  // does data (series) exist??
  $dataMapper = new Mapper('Data');
  $value = $result['SeriesInstanceUID'][0];
  $dataMapper->filter('unique_id = (?)',$value );
  $dataResult = $dataMapper->get();

  // if doesnt exist, create data
  if(count($dataResult['Data']) == 0)
  {
    // create data model
    $dataObject = new Data();
    $dataObject->patient_id = $patient_chris_id;
    $dataObject->unique_id = $result['SeriesInstanceUID'][0];
    // remove potential white spaces
    if(array_key_exists('ProtocolName',$result))
    {
      $protocol_name = str_replace (' ', '_', $result['ProtocolName'][0]);
      $protocol_name = str_replace ('/', '_', $protocol_name);
    }
    $dataObject->name = $protocol_name;
    $date = $result['ContentDate'][0];
    $datemysql =  substr($date, 0, 4).'-'.substr($date, 4, 2).'-'.substr($date, 6, 2);
    $time = $result['ContentTime'][0];
    $timemysql = substr($time, 0, 2).':'.substr($time, 2, 2).':'.substr($time, 4, 2);
    $datetimemysql = $datemysql.' '. $timemysql;
    $dataObject->time = $datetimemysql;
    $dataObject->meta_information = '';

    // add the data model and get its id
    $data_chris_id = Mapper::add($dataObject);
  }
  // else get data name and id
  else{
    $protocol_name = $dataResult['Data'][0]->name;
    $data_chris_id = $dataResult['Data'][0]->id;
  }
}
else {
  echo 'SOPInstanceUID or SeriesInstanceUID not there';
  // finish data table lock
  $db->unlock();
  return;
}
// finish data table lock
$db->unlock();

// FILESYSTEM Processing
$patientdirname = '/chb/users/chris/data/'.$result['PatientID'][0].'-'.$patient_chris_id;
// create folder if doesnt exists
if(!is_dir($patientdirname)){
  mkdir($patientdirname);
}

$datadirname = $patientdirname.'/'.$protocol_name.'-'.$data_chris_id;

// create folder if doesnt exists
if(!is_dir($datadirname)){
  mkdir($datadirname);
}

// cp file over if doesnt exist
$filenum = $result['InstanceNumber'][0];
$filename = $datadirname .'/'.$filenum.'.dcm';
if(!is_file($filename)){
  copy($tmpfile, $filename);
}

// delete tmp file
unlink($tmpfile);

// delete tmp dir if dir is empty
$files = scandir($p);
if(count($files) <= 2){
  rmdir($p);
}
?>