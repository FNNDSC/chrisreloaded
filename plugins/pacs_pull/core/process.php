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
require_once (dirname(dirname(dirname(dirname ( __FILE__ )))).'/config.inc.php');
// include chris db interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'db.class.php'));
// include chris mapper interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'mapper.class.php'));
// include pacs helper
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'pacs.helper.php'));
// include chris data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));
// include chris study models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'study.model.php'));
// include chris patient models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.model.php'));
// include chris data_patient models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_patient.model.php'));
// include chris data_study models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_study.model.php'));
// include chris feed_data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed_data.model.php'));
// include chris user_data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user_data.model.php'));

require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));

// define the options
$shortopts = "u:f:m:s:p:a:c:o:d:e:y:";

$options = getopt($shortopts);

$user_id = $options['u'];
$feed_chris_id = $options['f'];
$details = "";
if(isset($options['m'])){
  $details = $options['m'];
}
$server = $options['s'];
$port = $options['p'];
$aetitle = $options['a'];
$aec = $options['c'];
$output_dir = $options['o'];

$study_uid = "";
if(isset($options['d'])){
  $study_uid = $options['d'];
}

$series_uid = "";
if(isset($options['e'])){
  $series_uid = $options['e'];
}

$modality = "";
if(isset($options['y'])){
  $modality = $options['y'];
}

//
// 1- CREATE PRE-PROCESS LOG FILE
//
$logFile = $output_dir.'process.log';

//
// 2- INSTANTIATE PACS CLASS
//
$instateLog = '======================================='.PHP_EOL;
$instateLog .= date('Y-m-d h:i:s'). ' ---> Instantiate PACS class...'.PHP_EOL;
$instateLog .= 'Server: '.$server.PHP_EOL;
$instateLog .= 'Port: '.$port.PHP_EOL;
$instateLog .= 'AEtitle: '.$aetitle.PHP_EOL;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $instateLog);
fclose($fh);

$pacs = new PACS($server, $port, $aetitle, $aec);

//
// 3- TEST CONNECTION
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
// 4- QUERY ALL INFORMATION
// This step allows us to get all studies uids and series uids
// Other information which is collected might be useful later on
// (to monitor the progress in real time, to know if a dataset is corrupted, etc)

$queryAllLog = '======================================='.PHP_EOL;
$queryAllLog .= date('Y-m-d h:i:s'). ' ---> Query all information...'.PHP_EOL;
$queryAllLog .= 'AETitle: '.$aetitle.PHP_EOL;
$queryAllLog .= 'MRN: '.$details.PHP_EOL;
$queryAllLog .= 'StudyUID: '.$study_uid.PHP_EOL;
$queryAllLog .= 'SeriesUID: '.$series_uid.PHP_EOL;

$study_parameter = Array();
$study_parameter['StudyInstanceUID'] = $study_uid;
$study_parameter['PatientID'] = $details;
$study_parameter['PatientName'] = '';
$study_parameter['PatientBirthDate'] = '';
$study_parameter['PatientSex'] = '';
$series_parameter = Array();
$series_parameter['SeriesInstanceUID'] = $series_uid;
$series_parameter['SeriesDescription'] = '';
$series_parameter['StudyDescription'] = '';
$series_parameter['NumberOfSeriesRelatedInstances'] = '';
$series_parameter['InstanceNumber'] = '';
$series_parameter['Modality'] = $modality;
$results = $pacs->queryAll($study_parameter, $series_parameter, null);

// if no series data available, return null
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
// 5-  ADD PATIENT TO DB
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
$patientIDSanitized = sanitize($results[0]['PatientID'][0]);
$patientMapper->filter('uid = (?)',$patientIDSanitized);
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
$patientObject->uid = $patientIDSanitized;
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
// 6- ADD DATA TO DB
//
// loop through all data to be downloaded
// if data not there, create row in the data db table
// update the feed ids, status and counter

$data_chris_id = -1;
$feed_status = '';
$counter = 1;
$total = count($results[1]['SeriesInstanceUID']);

foreach ($results[1]['SeriesInstanceUID'] as $key => $value){
// lock data db so no data added in the meanwhile
$db->lock('data', 'WRITE');
$map_data = false;
$request_data = true;

$addDataLog = '======================================='.PHP_EOL;
$addDataLog .= date('Y-m-d h:i:s'). ' ---> Add data to DB...'.PHP_EOL;
$addDataLog .= '********'.PHP_EOL;
$addDataLog .= 'Data table locked on WRITE...'.PHP_EOL;
$addDataLog .= 'Data uid: '.$value.PHP_EOL;
$addDataLog .= 'Study uid: '.$results[1]['StudyInstanceUID'][$key].PHP_EOL;

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
if($results[1]['NumberOfSeriesRelatedInstances'][$key] != "nvp"){
  $dataObject->nb_files = $results[1]['NumberOfSeriesRelatedInstances'][$key];
}
else if($results[1]['InstanceNumber'][$key]){
  $dataObject->nb_files = $results[1]['InstanceNumber'][$key];
}
else{
  $dataObject->nb_files = 1;
}
$dataObject->description = sanitize($results[1]['SeriesDescription'][$key]);
$dataObject->plugin = 'pacs_pull';
$data_chris_id = Mapper::add($dataObject);
$map_data = true;

$addDataLog .= 'Data doesn\'t exist...'.PHP_EOL;
}
// else get its id
else{
$data_chris_id = $dataResult['Data'][0]->id;
$addDataLog .= 'Data exists...'.PHP_EOL;
// always update nb of files for safety (sometimes the pacs returns smaller number of file...)
// if no nb_files provided, update this field in db
//if($dataResult['Data'][0]->nb_files == 0 && $results[1]['NumberOfSeriesRelatedInstances'][$key] > 0){
if($results[1]['NumberOfSeriesRelatedInstances'][$key] != "nvp"){
  $dataResult['Data'][0]->nb_files = $results[1]['NumberOfSeriesRelatedInstances'][$key];
}
else if($results[1]['InstanceNumber'][$key]){
  $dataResult['Data'][0]->nb_files = $results[1]['InstanceNumber'][$key];
}
else{
  $dataResult['Data'][0]->nb_files = 1;
}
// Update database and get object
Mapper::update($dataResult['Data'][0], $data_chris_id);
$addDataLog .= 'Update data number of files...'.PHP_EOL;
$addDataLog .= '0 -> '.$dataResult['Data'][0]->nb_files.PHP_EOL;
//}
// if data is there and files have been received, we will not query it
if($dataResult['Data'][0]->nb_files == $dataResult['Data'][0]->status){
$request_data = false;
}
}
$db->unlock();

$addDataLog .= 'Data id:'.$data_chris_id.PHP_EOL;
$addDataLog .= 'User id:'.$user_id.PHP_EOL;
$addDataLog .= 'Feed id:'.$feed_chris_id.PHP_EOL;
$addDataLog .= 'Data table unlocked on WRITE...'.PHP_EOL;

// Map data to patient if it is a new data set
if($map_data){
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

// CREATE STUDY IF DOESNT EXIST
$study_chris_id = 0;

$studyMapper = new Mapper('Study');
$studyMapper->filter('uid = (?)',$results[1]['StudyInstanceUID'][$key]);
$studyResult = $studyMapper->get();
if(count($studyResult['Study']) == 0)
{
$studyObject = new Study();
$studyObject->uid = $results[1]['StudyInstanceUID'][$key];
$study_chris_id = Mapper::add($studyObject);
$addDataLog .= 'Study created..'.PHP_EOL;
}
else{
$study_chris_id = $studyResult['Study'][0]->id;
$addDataLog .= 'Study already exists..'.PHP_EOL;
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
Mapper::add($dataStudyObject);
$addDataLog .= 'Map data to its study...'.PHP_EOL;
}

// move series (data)
$try = 0;
while($request_data && ($try < 5)){
$pacs2 = new PACS($server, $port, $aetitle, $aec);
echo $server.PHP_EOL;
echo $port.PHP_EOL;
echo $aetitle.PHP_EOL;
$pacs2->addParameter('StudyInstanceUID', $results[1]['StudyInstanceUID'][$key]);
$pacs2->addParameter('SeriesInstanceUID', $results[1]['SeriesInstanceUID'][$key]);
$push_request = $pacs2->moveSeries();
$addDataLog .= $push_request['command'].PHP_EOL;
if($push_request['output'] == ''){
$addDataLog .= 'Move data success...'.PHP_EOL;
$request_data = False;
}
else{
$addDataLog .= 'Move data failure...'.PHP_EOL;
$addDataLog .= $push_request['output'].PHP_EOL;
$addDataLog .= 'New attemp in 5 seconds...'.PHP_EOL;
sleep(5);
$try++;
}
}

if($try == 5){
$addDataLog .= 'Data could not be pushed...'.PHP_EOL;
continue;
}

$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $addDataLog);
fclose($fh);

// process series (data)
// wait for all files to be received
$waiting = true;
while($waiting){
echo '.';
// check if *ALL* data is there
$dataMapper = new Mapper('Data');
$dataMapper->filter('id = (?)',$data_chris_id);
$dataMapper->filter('nb_files = status','');
$dataResult = $dataMapper->get();
if(count($dataResult['Data']) > 0){
//
// DATA HAS ARRIVED
//
$dataLog = '======================================='.PHP_EOL;
$dataLog .= date('Y-m-d h:i:s'). ' ---> New data has arrived... ('.$counter.'/'.$total.')'.PHP_EOL;

// get patient
$patientMapper = new Mapper('Data_Patient');
$patientMapper->ljoin('Patient','Patient.id = Data_Patient.patient_id');
$patientMapper->filter('Data_Patient.data_id = (?)', $data_chris_id);
$patientResult = $patientMapper->get();

// create feed patient directories
// mkdir if dir doesn't exist
// create folder if doesnt exists
if(count($patientResult['Patient']) == 0){
$dataLog .= "Could find patient related to the data...".PHP_EOL;
$dataLog .= "Data_id: ".$data_chris_id;
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
$dataLog .= "Data CHRIS ID: ".$data_chris_id.PHP_EOL;

$datadirname = $output_dir.'/'.$patientResult['Patient'][0]->uid.'-'.$patientResult['Patient'][0]->id;
if(!is_dir($datadirname)){
  mkdir($datadirname);
}

// study directory
// get study description
$studyMapper = new Mapper('Study');
$studyMapper->filter('id = (?)', $study_chris_id);
$studyResult = $studyMapper->get();
$study_dir_name = formatStudy($studyResult['Study'][0]->date, $studyResult['Study'][0]->age, $studyResult['Study'][0]->description).'-'.$study_chris_id;
$studydirname = $datadirname.'/'.$study_dir_name;
if(!is_dir($studydirname)){
  mkdir($studydirname);
}

// create data soft links
$targetbase = CHRIS_DATA.'/'.$patientResult['Patient'][0]->uid.'-'.$patientResult['Patient'][0]->id;
$series_dir_name = $dataResult['Data'][0]->description .'-'. $dataResult['Data'][0]->name;
$seriesdirnametarget = $targetbase .'/'.$study_dir_name .'/'.$series_dir_name.'-'.$dataResult['Data'][0]->id;
$seriesdirnamelink = $datadirname .'/'.$study_dir_name .'/'.$series_dir_name.'-'.$dataResult['Data'][0]->id;
if(file_exists($seriesdirnametarget)){
  if(!is_link($seriesdirnamelink)){
    // create sof link
    symlink($seriesdirnametarget, $seriesdirnamelink);
  }
}
else{
  $dataLog .= "ERROR: Directory does not exist: ".$seriesdirnametarget.PHP_EOL;
}
// update feed status?
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $dataLog);
fclose($fh);

$waiting = false;
}
else{
sleep(2);
}
}
// update status
$counter++;
}

// update feed status in db
$feedMapper = new Mapper('Feed');
$feedMapper->filter('id = (?)',$feed_chris_id);
$feedResult = $feedMapper->get();
$feedResult['Feed'][0]->status = 99;
Mapper::update($feedResult['Feed'][0],  $feedResult['Feed'][0]->id);
exit(0);
?>
