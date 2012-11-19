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



?>