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

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'meta.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));

// Get pids in mosix queue
$mosix_command = "ssh ".CLUSTER_USERNAME."@".CLUSTER_HOST." '/bin/mosq listall'";
$output = shell_exec($mosix_command);
$lines = explode("\n", $output);

// get array containing all running PIDs
$pids = Array();
foreach($lines as $key => $value){
  $pid = explode(' ', trim($value));
  if(isset($pid[0]) && $pid[0] != ''){
    $pids[$pid[0]] = '';
  }
}

// get all feeds where status =! 100
$feedMapper = new Mapper('Meta');
$feedMapper->ljoin('Feed', 'meta.target_id = feed.id')->filter('meta.name = (?)', 'pid')->filter('feed.status != (?)','100');
$feedResult = $feedMapper->get();

// keep track of how many pids are connected to 1 feed (batch)
$count = Array();
// map pid to feed
$map = Array();
// keep feed index in memory for fast access to object
$index = Array();
foreach($feedResult['Meta'] as $key => $value){
  $map[$value->value] = $value->target_id;
  isset($count[$value->target_id])?$count[$value->target_id]++:$count[$value->target_id]=1;
  !isset($index[$value->target_id])?$index[$value->target_id] = $key:'Key already set...'.PHP_EOL;
}

// get pids which are finished:
// status != 100 but do not exist anymore
$finished =  array_diff_key ( $map, $pids );

// update count of running pids for each feed
foreach($finished as $key => $value){
  isset($count[$value])?$count[$value]--:'ERROR: value not set - '.__LINE__.'-'.$value.PHP_EOL ;
}

// if no more running pids for a feed, it has terminate
foreach($count as $key => $value){
  if($value == 0){
    // all feeds lined to this feed
    $startTime = $feedResult['Feed'][$index[$key]]->time;
    $endTime = microtime(true);
    $duration = $endTime - $startTime;
    $feedResult['Feed'][$index[$key]]->status = 100;
    $feedResult['Feed'][$index[$key]]->time = $endTime;
    $feedResult['Feed'][$index[$key]]->duration = (int)$duration;
    echo Mapper::update($feedResult['Feed'][$index[$key]],  $feedResult['Feed'][$index[$key]]->id);

    // user's email
    $userMapper = new Mapper('User');
    $userMapper->filter('user.id = (?)', $feedResult['Feed'][$index[$key]]->user_id);
    $userResult = $userMapper->get();

    // if nothing in DB yet, return -1
    if(count($userResult['User']) == 0)
    {
      return -1;
    }
    else{

      $subject = "ChRIS2 - " . $feedResult['Feed'][$index[$key]]->plugin ." plugin finished";

      $message = "Hello " . $userResult['User'][0]->username . "," . PHP_EOL. PHP_EOL;
      $message .= "Your results available at:" . PHP_EOL;
      $message .= joinPaths(CHRIS_USERS, $userResult['User'][0]->username, $feedResult['Feed'][$index[$key]]->plugin, $feedResult['Feed'][$index[$key]]->name.'-'.$feedResult['Feed'][$index[$key]]->id) . PHP_EOL. PHP_EOL;
      $message .= "Thank you for using ChRIS,";

      // get user email address
      email(CHRIS_PLUGIN_EMAIL_FROM, $userResult['User'][0]->email, $subject, $message);

      return $userResult['User'][0]->id;
    }
  }
}
?>