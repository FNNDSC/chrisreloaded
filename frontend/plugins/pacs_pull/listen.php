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
 * (c) 2012 Fetal-Neonatal Neuroimaging & Developmental Science Center4352490
 *                   Boston Children's Hospital
 *
 *              http://childrenshospital.org/FNNDSC/
 *                        dev@babyMRI.org
 *
 */
// we define a valid entry point
if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);
// include the configuration file
if(!defined('CHRIS_CONFIG_PARSED'))
  require_once(dirname(dirname(dirname ( __FILE__ ))).'/config.inc.php');

// open log file
$logFile = joinPaths(CHRIS_LOG, 'pacs_pull_listen.log');
$fullReport = '';

// CREATE UNIQUE DIRECTORY
$tmpdirname = CHRIS_TMP.date('Ymdhis');

while(!is_dir($tmpdirname)){
  if(mkdir($tmpdirname)){
    break;
  }
  $tmpdirname .= date('s');
}
//write log
$startReportPretty = "=========================================". PHP_EOL;
$report = date('Y-m-d h:i:s'). ' ---> Create unique tmp directory...'. PHP_EOL;
$report .= $tmpdirname. PHP_EOL;
$fullReport .= $report;
$startReportPretty .= $report;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $startReportPretty);
fclose($fh);


// we now have a unique directory to be processed
$listen_command = '/usr/bin/storescp -id -od "' . $tmpdirname . '" -pm -ss RX';
//write log
$startReportPretty = "=========================================". PHP_EOL;
$report = date('Y-m-d h:i:s'). ' ---> Start receiving data...'. PHP_EOL;
$report .= $listen_command. PHP_EOL;
$fullReport .= $report;
$startReportPretty .= $report;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $startReportPretty);
fclose($fh);
// execute the command
$output = exec($listen_command);

// move data from output directory!
$move_command = dirname ( __FILE__ ).'/move.php -d '.$tmpdirname;
// write log
$startReportPretty = "=========================================". PHP_EOL;
$report = date('Y-m-d h:i:s'). ' ---> Start moving data...'. PHP_EOL;
$report .= $move_command. PHP_EOL;
$fullReport .= $report;
$startReportPretty .= $report;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $startReportPretty);
fclose($fh);
// execute the command
$output2 = exec($move_command);

// finish listening
// write log
$startReportPretty = "************************************************". PHP_EOL;
$fullReport .= date('Y-m-d h:i:s'). ' ---> Finish moving data...'. PHP_EOL;
$startReportPretty .= $fullReport;
$startReportPretty .= "************************************************". PHP_EOL;
$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $startReportPretty);
fclose($fh);
?>