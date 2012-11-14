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
require_once ('../../config.inc.php');
// include chris db interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'db.class.php'));
// include chris mapper interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'mapper.class.php'));
// include chris data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));
// include chris patient models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.model.php'));
// include chris data_patient models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_patient.model.php'));
// include chris feed_data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed_data.model.php'));

// include pacs helper
require_once '/chb/users/nicolas.rannou/gitroot/chrisreloaded/frontend/plugins/pacs_pull/pacs.class.php';

// define the options
$shortopts = "u:f:m:s:p:a:h";
$longopts  = array(
    "user:",    // Required value
    "feed:",    // Required value
    "mrn:",     // Required value
    "server:",  // Required value
    "port:",    // Required value
    "aetitle:", // Required value
    "help",     // No value
);

$options = getopt($shortopts, $longopts);

define('CHRIS_DCMTK', '/usr/bin/');
echo "in pre_process.php";

$user_id = $options['u'];
$feed_chris_id = $options['f'];
$details = $options['m'];
$server = $options['s'];
$port = $options['p'];
$aetitle = $options['a'];

// get all information related to a patient
$pacs = new PACS($server, $port, $aetitle);
$study_parameter = Array();
$study_parameter['PatientID'] = $details;
$study_parameter['PatientName'] = '';
$study_parameter['PatientBirthDate'] = '';
$study_parameter['PatientSex'] = '';
$series_parameter = Array();
$series_parameter['SeriesDescription'] = '';
$series_parameter['NumberOfSeriesRelatedInstances'] = '';
$results = $pacs->queryAll($study_parameter, $series_parameter, null);

// if no data available, return null
if(count($results[1]) == 0)
{
  return "No data available from pacs for: MRN - ".$details;
}

// LOCK DB Patient on write so no patient will be added in the meanwhile
$db = DB::getInstance();
$db->lock('patient', 'WRITE');

// look for the patient
$patientMapper = new Mapper('Patient');
$patientMapper->filter('uid = (?)',$results[0]['PatientID'][0]);
$patientResult = $patientMapper->get();
$patient_chris_id = -1;
// create patient if doesn't exist
if(count($patientResult['Patient']) == 0)
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
}

// unlock patient table
$db->unlock();

// loop through all data to be downloaded
// if data not there, create row in the data db table
// update the feed ids and status

$data_chris_id = -1;
$feed_status = '';
foreach ($results[1]['SeriesInstanceUID'] as $key => $value){
  // lock data db so no data added in the meanwhile
  $db = DB::getInstance();
  $db->lock('data', 'WRITE');
  $map = false;

  // retrieve the data
  $dataMapper = new Mapper('Data');
  $dataMapper->filter('uid = (?)',$value);
  $dataResult = $dataMapper->get();
  // if nothing in DB yet, add it
  if(count($dataResult['Data']) == 0)
  {
    // add data and get its id
    $dataObject = new Data();
    $dataObject->uid = $value;
    $dataObject->nb_files = $results[1]['NumberOfSeriesRelatedInstances'][$key];
    $dataObject->name = sanitize($results[1]['SeriesDescription'][$key]);
    $data_chris_id = Mapper::add($dataObject);
    $map = true;
  }
  // else get its id
  else{
    $data_chris_id = $dataResult['Data'][0]->id;
    // update the links if data is already there!
    // HERE!
  }
  $db->unlock();

  if($map){
    // MAP DATA TO PATIENT
    $dataPatientObject = new Data_Patient();
    $dataPatientObject->data_id = $data_chris_id;
    $dataPatientObject->patient_id = $patient_chris_id;
    Mapper::add($dataPatientObject);
  }

  // MAP DATA TO FEED
  $feedDataObject = new Feed_Data();
  $feedDataObject->feed_id = $feed_chris_id;
  $feedDataObject->data_id = $data_chris_id;
  Mapper::add($feedDataObject);
}
?>