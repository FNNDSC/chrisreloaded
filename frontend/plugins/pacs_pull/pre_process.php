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
// include chris data_patient models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_patient.model.php'));
// include chris feed_data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed_data.model.php'));
// include chris user_data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user_data.model.php'));

// include pacs helper
require_once (joinPaths(CHRIS_PLUGINS_FOLDER, 'pacs_pull/pacs.class.php'));

// define the options
$shortopts = "u:f:m:s:p:a:o:";
/*$longopts  = array(
 "user:",    // Required value
    "feed:",    // Required value
    "mrn:",     // Required value
    "server:",  // Required value
    "port:",    // Required value
    "aetitle:" // Required value
);*/

$options = getopt($shortopts);

$user_id = $options['u'];
$feed_chris_id = $options['f'];
$details = $options['m'];
$server = $options['s'];
$port = $options['p'];
$aetitle = $options['a'];
$ouput_dir = $options['o'];

//
// 1- CREATE PRE-PROCESS LOG FILE
//
$logFile = $ouput_dir.'/pre_process.log';

//
// 3- INSTANTIATE PACS CLASS
//
$instateLog = '======================================='.PHP_EOL;
$instateLog .= date('Y-m-d h:i:s'). ' ---> Instantiate PACS class...'.PHP_EOL;
$instateLog .= 'Server: '.$server.PHP_EOL;
$instateLog .= 'Port: '.$port.PHP_EOL;
$instateLog .= 'AEtitle: '.$aetitle.PHP_EOL;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $instateLog);
fclose($fh);

$pacs = new PACS($server, $port, $aetitle);

//
// 4- TEST CONNECTION
//
$connectionLog = '======================================='.PHP_EOL;
$connectionLog .= date('Y-m-d h:i:s'). ' ---> Test connection to server...'.PHP_EOL;
$connectionLog .= 'Server: '.$server.PHP_EOL;
$connectionLog .= 'Port: '.$port.PHP_EOL;

$ping_result = $pacs->ping();

if(is_array($ping_result)){
  $connectionLog .= "Cannot connect to the server....".PHP_EOL;
  $connectionLog .= "Stopping pre_process.php "."Line: ".__LINE__.PHP_EOL;
  $connectionLog .= "EXIT CODE 1".PHP_EOL;
  $fh = fopen($logFile, 'a')  or die("can't open file");
  fwrite($fh, $connectionLog);
  fclose($fh);
  exit(1);
}

$connectionLog .= "Active connection to the server....".PHP_EOL;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $connectionLog);
fclose($fh);

//
// 5- QUERY ALL INFORMATION
//
$queryAllLog = '======================================='.PHP_EOL;
$queryAllLog .= date('Y-m-d h:i:s'). ' ---> Query all information...'.PHP_EOL;
$queryAllLog .= 'AETitle: '.$aetitle.PHP_EOL;
$queryAllLog .= 'MRN: '.$details.PHP_EOL;

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
  $queryAllLog .= 'No matching series where found...'.PHP_EOL;
  $queryAllLog .= 'Make sure AETitle and MRN are correct...'.PHP_EOL;
  $queryAllLog .= 'Make sure server and port are correct...'.PHP_EOL;
  $queryAllLog .= "Stopping pre_process.php "."Line: ".__LINE__.PHP_EOL;
  $queryAllLog .= "EXIT CODE 1".PHP_EOL;
  $fh = fopen($logFile, 'a')  or die("can't open file");
  fwrite($fh, $queryAllLog);
  fclose($fh);
  exit(1);
}

$queryAllLog .= count($results[1]['SeriesInstanceUID'])." matching serie(s) where found...".PHP_EOL;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $queryAllLog);
fclose($fh);

//
// 6-  ADD PATIENT TO DB
//
$addPatientLog = '======================================='.PHP_EOL;
$addPatientLog .= date('Y-m-d h:i:s'). ' ---> Add patient to DB...'.PHP_EOL;
// LOCK DB Patient on write so no patient will be added in the meanwhile
$db = DB::getInstance();
$db->lock('patient', 'WRITE');

$addPatientLog .= 'Patient table locked on WRITE...'.PHP_EOL;

// look for the patient
$addPatientLog .= 'Find patient in DB...'.PHP_EOL;

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

  $addPatientLog .= 'Patient doesn\'t exist...'.PHP_EOL;
}
// else get its id
else{
  $patient_chris_id = $patientResult['Patient'][0]->id;
  $addPatientLog .= 'Patient already exists...'.PHP_EOL;
}

// unlock patient table
$db->unlock();

$addPatientLog .= 'ID: '.$patient_chris_id.PHP_EOL;
$addPatientLog .= 'Patient table unlocked on WRITE...'.PHP_EOL;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $addPatientLog);
fclose($fh);

//
// 7- ADD DATA TO DB
//
$addDataLog = '======================================='.PHP_EOL;
$addDataLog .= date('Y-m-d h:i:s'). ' ---> Add data to DB...'.PHP_EOL;
// loop through all data to be downloaded
// if data not there, create row in the data db table
// update the feed ids and status

$data_chris_id = -1;
$feed_status = '';

foreach ($results[1]['SeriesInstanceUID'] as $key => $value){
  // lock data db so no data added in the meanwhile
  $db->lock('data', 'WRITE');
  $map = false;

  $addDataLog .= '********'.PHP_EOL;
  $addDataLog .= 'Data table locked on WRITE...'.PHP_EOL;
  $addDataLog .= 'Data uid: '.$value.PHP_EOL;

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

    $dataObject->plugin = 'pacs_pull';
    $data_chris_id = Mapper::add($dataObject);
    $map = true;

    $addDataLog .= 'Data doesn\'t exist...'.PHP_EOL;
  }
  // else get its id
  else{
    $data_chris_id = $dataResult['Data'][0]->id;
    $addDataLog .= 'Data exists...'.PHP_EOL;
    // if no nb_files provided, update this field in db
    if($dataResult['Data'][0]->nb_files == 0){
      // get a patient by id
      $dataObject = new Data();
      $dataObject->uid = $dataResult['Data'][0]->uid;
      $dataObject->name = $dataResult['Data'][0]->name;
      $dataObject->time = $dataResult['Data'][0]->time;
      $dataObject->nb_files = $dataResult['Data'][0]->nb_files;
      $dataObject->status = $dataResult['Data'][0]->status;
      $dataObject->plugin = $dataResult['Data'][0]->plugin;
      // Update database and get object
      Mapper::update($dataObject, $data_chris_id);
      $addDataLog .= 'Update data number of files...'.PHP_EOL;
      $addDataLog .= '0 -> '.$dataResult['Data'][0]->nb_files.PHP_EOL;
    }
  }
  $db->unlock();

  $addDataLog .= 'Data id:'.$data_chris_id.PHP_EOL;
  $addDataLog .= 'User id:'.$user_id.PHP_EOL;
  $addDataLog .= 'Feed id:'.$feed_chris_id.PHP_EOL;
  $addDataLog .= 'Data table unlocked on WRITE...'.PHP_EOL;

  // Map data to patient if it is anew data set
  if($map){
    // MAP DATA TO PATIENT
    $dataPatientObject = new Data_Patient();
    $dataPatientObject->data_id = $data_chris_id;
    $dataPatientObject->patient_id = $patient_chris_id;
    Mapper::add($dataPatientObject);
    $addDataLog .= 'Map data to its patient...'.PHP_EOL;
  }

  // map data to feed if this data hasn't already been mapper to this feed
  // MAP DATA TO FEED
  $feedDataMapper = new Mapper('Feed_Data');
  $feedDataMapper->filter('feed_id = (?)',$feed_chris_id);
  $feedDataMapper->filter('data_id = (?)',$data_chris_id);
  $feedDataResult = $feedDataMapper->get();
  if(count($feedDataResult['Feed_Data']) == 0)
  {
    $feedDataObject = new Feed_Data();
    $feedDataObject->feed_id = $feed_chris_id;
    $feedDataObject->data_id = $data_chris_id;
    Mapper::add($feedDataObject);
    $addDataLog .= 'Map feed to its data...'.PHP_EOL;
  }

  // map data to user if this data hasn't already been mapper to this user
  // MAP USER TO DATA
  $userDataMapper = new Mapper('User_Data');
  $userDataMapper->filter('user_id = (?)',$user_id);
  $userDataMapper->filter('data_id = (?)',$data_chris_id);
  $userDataResult = $userDataMapper->get();
  if(count($userDataResult['User_Data']) == 0)
  {
    $userDataObject = new User_Data();
    $userDataObject->user_id = $user_id;
    $userDataObject->data_id = $data_chris_id;
    Mapper::add($userDataObject);
    $addDataLog .= 'Map user to its data...'.PHP_EOL;
  }
}

$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $addDataLog);
fclose($fh);

exit(0);
?>