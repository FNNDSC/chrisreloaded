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
require_once (dirname(dirname(__FILE__)).'/config.inc.php');
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, '_session.inc.php'));

// include the controller
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'data.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'plugin.controller.php'));

require_once (joinPaths(CHRIS_MODEL_FOLDER, 'meta.model.php'));

// Create a feed given a user id, an action and details about the action.
// metadata instead of param?
// create folder on file system

/* FEED_PLUGIN : 'pacs_pull',
 FEED_NAME : 'name of the feed',
FEED_PARAM : metas,
FEED_OUTPUT: metas */

$username = $_SESSION['username'];
$userid = $_SESSION['userid'];
$feed_name = sanitize($_POST['FEED_NAME']);
$feed_id = FeedC::create($userid, $_POST['FEED_PLUGIN'], $feed_name);
FeedC::addMeta($feed_id, $_POST['FEED_PARAM']);
FeedC::addMeta($feed_id, $_POST['FEED_OUTPUT']);

// Create the feed directory
$feed_path = joinPaths(CHRIS_DATA, $username, $_POST['FEED_PLUGIN'], $feed_name.'-'.$feed_id);
if(!mkdir($feed_path, 0777, true)){
  return "Couldn't create the feed directory on filesystem: ".$feed_path;
}

// create data
$data_id = DataC::create($_POST['FEED_PLUGIN']);
DataC::addUser($data_id, $userid);

// link feed to data


$arguments = ' -l '.$feed_path;
$arguments .= ' -c "/bin/mostestload -t 120"';

//$arguments .= ' -c "/bin/touch done.txt"';
// format parameters command
/*$arguments .= joinPaths(CHRIS_PLUGINS_FOLDER,$_POST['FEED_PLUGIN']);
 foreach($_POST['FEED_META'] as $key => $value){
$arguments .= ' --'.$value['name'].' '.$value['value'];
} */
// format output command
// ...

//$arguments .= '"';
// run on cluster and return pid
$process_command = joinPaths(CHRIS_CONTROLLER_FOLDER, 'run_'.CHRIS_CLUSTER.'.php '.$arguments);
$output = shell_exec($process_command);

// attach pid to feed
$metaObject = new Meta();
$metaObject->name = "pid";
$metaObject->value = $output;
FeedC::addMeta($feed_id, Array(0 => $metaObject));

?>