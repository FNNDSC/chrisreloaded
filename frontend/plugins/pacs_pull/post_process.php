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

// include pacs helper
require_once 'pacs.class.php';

$shortopts = "m:s:p:a:h";
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

$pacs_mrn = $options['m'];
$server = $options['s'];
$port = $options['p'];
$aet = $options['a'];

$pacs_level = 'STUDY';
$pacs_modality = 'MR';

$pacs_study_date = '';
$pacs_accession_number = '';
$pacs_study_description = '';
$pacs_name = '';
$pacs_birthday = '';
$pacs_study_uid = '';
$pacs_serie_uid = '';

define('CHRIS_DCMTK', '/usr/bin/');

// all data should be in tm directory

// retrieve patient information
$pacs = new PACS($server, $port, $aet);
$study_parameter = Array();
$study_parameter['PatientID'] = $pacs_mrn;
$study_parameter['PatientName'] = '';
$study_parameter['PatientBirthDate'] = '';
$study_parameter['PatientSex'] = '';
$series_parameter = Array();
$series_parameter['SeriesDescription'] = '';
$series_parameter['NumberOfSeriesRelatedInstances'] = '';
$results = $pacs->queryAll($study_parameter, $series_parameter, null);

// create directories and soft link data over


//$pacs = new PACS($server, $port, $aet);
if($pacs_level == 'STUDY'){
  /*
   $pacs->addParameter('StudyDate', $pacs_study_date);
  $pacs->addParameter('AccessionNumber', $pacs_accession_number);
  $pacs->addParameter('RetrieveAETitle', $aet);
  $pacs->addParameter('ModalitiesInStudy', $pacs_modality);
  $pacs->addParameter('StudyDescription', $pacs_study_description);
  $pacs->addParameter('PatientName', $pacs_name);
  $pacs->addParameter('PatientID', $pacs_mrn);
  $pacs->addParameter('PatientBirthDate', $pacs_birthday);
  $pacs->addParameter('StudyInstanceUID', $pacs_study_uid);
  echo $pacs->moveStudy();*/
}
else{
  /*
   // check if series already there
  // retrieve the data
  $dataMapper = new Mapper('Data');
  $dataMapper->filter('uid = (?)',$pacs_serie_uid);
  $dataResult = $dataMapper->get();

  // if data already there, do not do anything!
  // should update the links!
  if(count($dataResult['Data']) > 0)
  {
  echo json_encode('Data already there');
  return;
  }

  $pacs->addParameter('StudyInstanceUID', $pacs_study_uid);
  $pacs->addParameter('SeriesInstanceUID', $pacs_serie_uid);
  echo $pacs->moveSeries();*/
}

/*
 // define command line arguments
$shortopts = "";
$shortopts .= "p:"; // Incoming file location
$shortopts .= "f:"; // Incoming file name

$options = getopt($shortopts);

$p = $options['p'];
$f = $options['f'];
//$p = '/chb/users/chris/data/4524909-476/T1_COR__POST_FS-2529';
//$f = '2.dcm';
$tmpfile = $p.'/'.$f;

$result = PACS::process($tmpfile);

// initiate variables
$patient_chris_id = -1;
$data_chris_id = -1;
$data_nb_files = -1;
$image_chris_id = -1;
$series_description = 'NoSeriesDescription';

// start patient table lock
$db = DB::getInstance();
$db->lock('patient', 'WRITE');

if (array_key_exists('PatientName',$result) && array_key_exists('PatientID',$result))
{
$patientMapper = new Mapper('Patient');
$patientMapper->filter('name = (?)',$result['PatientName'][0]);
$patientMapper->filter('uid = (?)',$result['PatientID'][0]);
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
$patientObject->uid = $result['PatientID'][0];

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
$dataMapper->filter('uid = (?)',$value );
$dataResult = $dataMapper->get();

// if doesnt exist, add data
if(count($dataResult['Data']) == 0)
{
// create object
// create data model
$dataObject = new Data();
$dataObject->uid = $result['SeriesInstanceUID'][0];
// remove potential white spaces
if(array_key_exists('SeriesDescription',$result))
{
$series_description = sanitize($result['SeriesDescription'][0]);
}
$dataObject->name = $series_description;
$date = $result['ContentDate'][0];
$datemysql =  substr($date, 0, 4).'-'.substr($date, 4, 2).'-'.substr($date, 6, 2);
$time = $result['ContentTime'][0];
$timemysql = substr($time, 0, 2).':'.substr($time, 2, 2).':'.substr($time, 4, 2);
$datetimemysql = $datemysql.' '. $timemysql;
$dataObject->time = $datetimemysql;
$dataObject->meta_information = '';
// get nb of files in data
$pacs = new PACS(PACS_SERVER, PACS_PORT, CHRIS_AETITLE);
$pacs->addParameter('RetrieveAETitle', '');
$pacs->addParameter('StudyInstanceUID', $result['StudyInstanceUID'][0]);
$pacs->addParameter('SeriesInstanceUID', $result['SeriesInstanceUID'][0]);
$pacs->addParameter('NumberOfSeriesRelatedInstances', '');
$all_results = $pacs->querySeries();
$dataObject->nb_files = $all_results['NumberOfSeriesRelatedInstances'][0];
// add the data model and get its id
$data_chris_id = Mapper::add($dataObject);
$data_nb_files = $dataObject->nb_files;
}
// else update data
else{
// date not accessible from pacs so can't be created with feed
$date = $result['ContentDate'][0];
$datemysql =  substr($date, 0, 4).'-'.substr($date, 4, 2).'-'.substr($date, 6, 2);
$time = $result['ContentTime'][0];
$timemysql = substr($time, 0, 2).':'.substr($time, 2, 2).':'.substr($time, 4, 2);
$datetimemysql = $datemysql.' '. $timemysql;
$dataResult['Data'][0]->time = $datetimemysql;
Mapper::update($dataResult['Data'][0], $dataResult['Data'][0]->id);
// update it
$series_description = $dataResult['Data'][0]->name;
$data_chris_id = $dataResult['Data'][0]->id;
$data_nb_files = $dataResult['Data'][0]->nb_files;
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
$patientdirname = CHRIS_DATA.$result['PatientID'][0].'-'.$patient_chris_id;
// create folder if doesnt exists
if(!is_dir($patientdirname)){
mkdir($patientdirname);
}

$datadirname = $patientdirname.'/'.$series_description.'-'.$data_chris_id;

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

// delete tmp dir if dir is empty when all files have arrived
$files = scandir($p);
if(count($files) <= 2){
rmdir($p);
}
*/
?>