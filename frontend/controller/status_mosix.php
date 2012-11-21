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

// Get unfinished feeds (status != 100)
$feedMapper = new Mapper('Meta');
$feedMapper->ljoin('Feed', 'meta.target_id = feed.id')->filter('meta.name = (?)', 'pid')->filter('feed.status != (?)','100');
$feedResult = $feedMapper->get();

// Get pids in mosix queue
$mosix_command = "ssh chris@rc-goldfinger '/bin/mosq listall'";
$output = shell_exec($mosix_command);
$lines = explode("\n", $output);

// loop through unfinished feeds in db
foreach($feedResult['Meta'] as $key0 => $value0){
  $found = false;
  foreach($lines as $key => $value){
    $pid = explode(' ', $value);
    //print_r($pid);
    if(isset($pid[0]) && $pid[0] != ''){
      if($value0->value == $pid[0]){
        $found = true;
        break;
      }
    }
  }

  // if no match, job has finished => update feed status!
  if($found == false){
    $feedResult['Feed'][$key0]->status = 100;
    $feedResult['Feed'][$key0]->end = date("Y-m-d H:i:s");
    Mapper::update($feedResult['Feed'][$key0],  $feedResult['Feed'][$key0]->id);
  }
}
?>