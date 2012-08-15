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

// define command line arguments
$shortopts = "";
$shortopts .= "p:"; // Full path
$shortopts .= "f:"; // File name
$shortopts .= "a:"; // File name
$shortopts .= "c:"; // Optional value

$options = getopt($shortopts);
var_dump($options);

$command = '/bin/mv '.$options['p'].'/'.$options['f'].' '.CHRIS_DATA.$options['f'];

$output = shell_exec ( $command );

$myFile = "/chb/tmp/pacs_process.txt";
$fh = fopen($myFile, 'w') or die("can't open file");
$command .= '\n';
fwrite($fh, $command);
fclose($fh);

// pacs->process($filename, $tmp, $data);

//dcmdump +C +P PatientID +P StudyID +P PatientSex +P PatientAge +P Modality +P Manufacturer +P InstitutionName +P InstitutionAddress +P PatientName +P PatientBirthDate MR.1.2.124.113532.132.183.50.218.20081216.82750.18430913
?>