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

// include the configuration
require_once (dirname(dirname(dirname(dirname(__FILE__)))).'/config.inc.php');
// include pacs helper
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'pacs.helper.php'));

// convenience method to check if variable is set or not
function is_set($variable, $value = '') {
  return isset($variable)?$variable:$value;
}
// server ip
$serverip = is_set($_POST['SERVER_IP'],'134.174.12.21');
// server port
$serverport = is_set($_POST['SERVER_POR'],'104');
// user aetitle
$useraetitle = is_set($_POST['USER_AET'],'FNNDSC-CHRISTEST');
// user caetitle
$useraec = is_set($_POST['USER_AEC'],'ANY');
// patient id
$patientid = is_set($_POST['PACS_MRN']);
// patient name
$patientname = is_set($_POST['PACS_NAM']);
// patient sex
$patientsex = is_set($_POST['PACS_SEX']);
// study date
$studydate = is_set($_POST['PACS_DAT']);
// modality
$modality = is_set($_POST['PACS_MOD']);
// station
$station = is_set($_POST['PACS_PSAET']);
// study description
$studydescription = is_set($_POST['PACS_STU_DES']);
// series description
$seriesdescription = is_set($_POST['PACS_SER_DES']);

// could split date/mrns here!
// but status not updated in real time on client side....

// The following variables have to be defined to be picked up
// by launcher.php
// $serverip
// $serverport
// $useraetitle
// $patientid
// $patientname
// $patientsex
// $studydate
// $modality
// $station
// $studydescription
// $studydescription

// we silent the Output Buffer
// if not, query.php returns the json output + "#!/usr/bin/php"
// the json output is then corrupted
// then the pacs.js do not understand the answer
ob_start();
include('query.php');
ob_end_clean();

echo $output;
?>