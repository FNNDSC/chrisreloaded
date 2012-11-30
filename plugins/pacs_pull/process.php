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
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));

// include pacs helper
require_once 'pacs.class.php';

$shortopts = "m:s:p:a:o:f:";

$options = getopt($shortopts);

$pacs_mrn = $options['m'];
$server = $options['s'];
$port = $options['p'];
$aetitle = $options['a'];
$ouput_dir = $options['o'];
$feed_chris_id = $options['f'];

//
// 1- CREATE PROCESS LOG FILE
//
$logFile = $ouput_dir.'process.log';

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
// 2- MOVE MRN
//
$moveLog = '======================================='.PHP_EOL;
$moveLog .= date('Y-m-d h:i:s'). ' ---> Move MRN...'.PHP_EOL;
$moveLog .= 'MRN: '.$pacs_mrn.PHP_EOL;
$moveLog .= 'Server: '.$server.PHP_EOL;
$moveLog .= 'Port: '.$port.PHP_EOL;
$moveLog .= 'AEtitle: '.$aetitle.PHP_EOL;

//$pacs_level = 'STUDY';
$pacs_modality = '';
$pacs_study_date = '';
$pacs_accession_number = '';
$pacs_study_description = '';
$pacs_name = '';
$pacs_birthday = '';
$pacs_study_uid = '';
$pacs_serie_uid = '';

//if($pacs_level == 'STUDY'){
$pacs->addParameter('StudyDate', $pacs_study_date);
$pacs->addParameter('AccessionNumber', $pacs_accession_number);
$pacs->addParameter('RetrieveAETitle', $aetitle);
$pacs->addParameter('ModalitiesInStudy', $pacs_modality);
$pacs->addParameter('StudyDescription', $pacs_study_description);
$pacs->addParameter('PatientName', $pacs_name);
$pacs->addParameter('PatientID', $pacs_mrn);
$pacs->addParameter('PatientBirthDate', $pacs_birthday);
$pacs->addParameter('StudyInstanceUID', $pacs_study_uid);
$command =  $pacs->moveStudy();

$moveLog .= implode(PHP_EOL, $command);

$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $moveLog);
fclose($fh);

//
// 3- FINISH MOVING
//
$finishMoveLog = PHP_EOL.'======================================='.PHP_EOL;
$finishMoveLog .= date('Y-m-d h:i:s'). ' ---> Finish moving all studies...'.PHP_EOL;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $finishMoveLog);
fclose($fh);

$feedMapper = new Mapper('Feed');
$feedMapper->filter('id = (?)',$feed_chris_id);
$feedResult = $feedMapper->get();
$feedResult['Feed'][0]->status = 66;
Mapper::update($feedResult['Feed'][0],  $feedResult['Feed'][0]->id);

exit(0);

//}
//else{
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
//}
?>