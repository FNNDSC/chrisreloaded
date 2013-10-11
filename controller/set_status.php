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
if(!defined('CHRIS_CONFIG_PARSED'))
  require_once(dirname(dirname(__FILE__)).'/config.inc.php');

if (count($argv)<3) {
  die("USAGE: set_status.php FEED_ID STATUS or +STATUS_INCREASE\n");
}

$feed_id = $argv[1];
$status = $argv[2];


if(function_exists("curl_init")){

  echo "Using curl...\n";
  $myvars = 'action=set';
  $myvars = '&what=feed_status';
  $myvars = '&feedid='.$feed_id;
  $myvars = '&status='.$status;

  $ch = curl_init( CHRIS_URL.'/api.php' );
  curl_setopt( $ch, CURLOPT_POST, 1);
  curl_setopt( $ch, CURLOPT_POSTFIELDS, $myvars);
  curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
  curl_setopt( $ch, CURLOPT_HEADER, 0);
  curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

  $response = curl_exec( $ch );
}
else if(function_exists("mysqli_init")){

  echo "Using mysqli...\n";
  // curl not working, thry to set status though controller
  require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
  FeedC::status($feed_id, $status);

}
else{

  echo "Using nothing...\n";
  die('Can not set the status.');

}
echo "New status == $status. Done.\n";
?>