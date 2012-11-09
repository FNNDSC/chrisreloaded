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

// include the pacs pull configuration
require_once ('config.inc.php');
// include pacs helper
require_once 'pacs.class.php';

/*
// define the options
$shortopts = "c:u::f::h";
$longopts  = array(
    "command:",     // Required value
    "username::",    // Optional value
    "feedname::",    // Optional value
    "help",    // Optional value
);

$options = getopt($shortopts, $longopts);

//print help if required
if( array_key_exists('h', $options) || array_key_exists('help', $options))
{
  echo "this is the help!";
  echo "\n";
  return;
}

//if no command provided, exit
$command = '';
if( array_key_exists('c', $options))
{
  $command = $options['c'];
}
elseif (array_key_exists('command', $options))
{
  $command = $options['command'];
}
else{
  echo "no command provided!";
  echo "\n";
  return;
}
*/

$pacs_level = 'STUDY';
$pacs_study_date = '';
$pacs_accession_number = '';
$pacs_modality = 'MR';
$pacs_study_description = '';
$pacs_name = '';
$pacs_mrn = '4524909';
$pacs_birthday = '';
$pacs_study_uid = '';
$pacs_serie_uid = '';

// not needed
// 1- create data
// 2- attach it to feed
// 3- from data we can retrieve feed location on listener side
//$output

$pacs = new PACS(PACS_SERVER, PACS_PORT, PACS_AETITLE);

if($pacs_level == 'STUDY'){
  $pacs->addParameter('StudyDate', $pacs_study_date);
  $pacs->addParameter('AccessionNumber', $pacs_accession_number);
  $pacs->addParameter('RetrieveAETitle', PACS_AETITLE);
  $pacs->addParameter('ModalitiesInStudy', $pacs_modality);
  $pacs->addParameter('StudyDescription', $pacs_study_description);
  $pacs->addParameter('PatientName', $pacs_name);
  $pacs->addParameter('PatientID', $pacs_mrn);
  $pacs->addParameter('PatientBirthDate', $pacs_birthday);
  $pacs->addParameter('StudyInstanceUID', $pacs_study_uid);
  echo $pacs->moveStudy();
}
else{
  // check if series already there
  // retrieve the data
  $dataMapper = new Mapper('Data');
  $dataMapper->filter('uid = (?)',$pacs_serie_uid);
  $dataResult = $dataMapper->get();

  // if data already there, do not do anything!
  if(count($dataResult['Data']) > 0)
  {
    echo json_encode('Data already there');
    return;
  }

  $pacs->addParameter('StudyInstanceUID', $pacs_study_uid);
  $pacs->addParameter('SeriesInstanceUID', $pacs_serie_uid);
  echo $pacs->moveSeries();
}
?>