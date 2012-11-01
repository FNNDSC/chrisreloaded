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

// include the controller
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'data.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'plugin.controller.php'));

// Create a feed given a user id, an action and details about the action.
// metadata instead of param?
// create folder on file system
$feed_id = FeedC::create($_POST['FEED_USER'], $_POST['FEED_PLUGIN']);
FeedC::addMeta($feed_id, $_POST['FEED_META']);
// feed location on filesystem
// FeedC::addMeta($feed_id, $_POST['FEED_META']);

// get username
$userMapper= new Mapper('User');
$userMapper->filter('id=(?)', $_POST['FEED_USER']);
$userResults = $userMapper->get();
$username = $userResults['User'][0]->username;

// Create the feed directory
$feed_path = joinPaths(CHRIS_DATA, $username, $_POST['FEED_PLUGIN'], $feed_id);
if(!mkdir($feed_path, 0777, true)){
  return "Couldn't create the feed directory on filesystem: ".$feed_path;
}

// feed <-> data
$data_id = DataC::create($_POST['FEED_PLUGIN']);
DataC::addUser($data_id, $_POST['FEED_USER']);

//PluginC::run($feed_id, $data_id);
// implement here for now....
// metadata is one line, passed as arguments for preprocess, run, postprocess
// create command to run on cluster
// cd /feed/dir && command
$arguments = ' -l '.$feed_path;
$arguments .= ' -c "/bin/touch done.txt"';
/*$arguments .= joinPaths(CHRIS_PLUGINS_FOLDER,$_POST['FEED_PLUGIN']);
 foreach($_POST['FEED_META'] as $key => $value){
  $arguments .= ' --'.$value['name'].' '.$value['value'];
} */
//$arguments .= '"';
// run on cluster and return pid
$process_command = joinPaths(CHRIS_CONTROLLER_FOLDER, CHRIS_CLUSTER.'_run.php '.$arguments);
$output = shell_exec($process_command);
echo $output;
// attach pid to feed
?>