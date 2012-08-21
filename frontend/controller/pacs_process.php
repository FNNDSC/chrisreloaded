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
$tmpfile = $p.'/'.$f;

$result = PACS::process($tmpfile);

$patient_chris_id = -1;
$data_chris_id = -1;
$image_chris_id = -1;
$protocol_name = 'NoProtocolName';

// start lock
$db = DB::getInstance();
$db->lock('patient', 'WRITE');

if (array_key_exists('PatientName',$result))
{
  $patientMapper = new Mapper('Patient');
  $patientMapper->filter('name = (?)',$result['PatientName'][0] );
  $patientResult = $patientMapper->get();

  if(count($patientResult['Patient']) == 0)
  {
    // create patient model
    $patientObject = new Patient();
    $patientObject->name = $result['PatientName'][0];
    $patientObject->dob = '0000-00-00';
    $patientObject->sex = $result['PatientSex'][0];
    $patientObject->patient_id = $result['PatientID'][0].';';

    // add the patient model and get its id
    $patient_chris_id = Mapper::add($patientObject);
  }
  else {
    // get patient id
    $patient_chris_id = $patientResult['Patient'][0]->id;

    // update MRN field if MRN provided
    if(array_key_exists('PatientID',$result)){
      $patient_mrn = $patientResult['Patient'][0]->patient_id;
      $list_patient_mrn = explode(';', $patient_mrn);
      // and if not already there...!
      if(!in_array($result['PatientID'][0], $list_patient_mrn)){
        // create patient model
        $patientObject = new Patient();
        $patientObject->name = $patientResult['Patient'][0]->name;
        $patientObject->dob = $patientResult['Patient'][0]->dob;
        $patientObject->sex = $patientResult['Patient'][0]->sex;
        // previous MRN list
        $patientObject->patient_id = $patientResult['Patient'][0]->patient_id;
        // add new MRN
        $patientObject->patient_id .= $result['PatientID'][0].';';

        Mapper::update($patientObject, $patient_chris_id);
      }
    }
  }
}
else {
  echo 'PatientName or PatientBirthdate not there';
  $db->unlock();
  return;
}
$db->unlock();

$db->lock('data', 'WRITE');
// Does Image exist: SOPInstanceUID
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
    $dataObject->time = $result['ContentTime'][0];
    $dataObject->meta_information = '';

    // add the data model and get its id
    $data_chris_id = Mapper::add($dataObject);
  }
  // else get data id
  else{
    $protocol_name = $dataResult['Data'][0]->name;
    $data_chris_id = $dataResult['Data'][0]->id;
  }
}
else {
  echo 'SOPInstanceUID or SeriesInstanceUID not there';
  $db->unlock();
  return;
}
$db->unlock();

// FILESYSTEM STUFF
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
$filename = $datadirname .'/'.$f;
if(!is_file($filename)){
  copy($tmpfile, $filename);
}

// delete tmp file
unlink($tmpfile);
?>