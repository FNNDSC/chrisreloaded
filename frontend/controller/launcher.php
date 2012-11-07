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

// include the configuration
require_once (dirname(dirname(__FILE__)).'/config.inc.php');
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, '_session.inc.php'));

// include the controller
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'user.controller.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));

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

// is username given?
$username = 'cli_user';
if( array_key_exists('u', $options))
{
  $username = $options['u'];
}
elseif (array_key_exists('username', $options))
{
  $username = $options['username'];
}

// is feedname given?
$feedname = 'cli_feed';
if( array_key_exists('f', $options))
{
  $feedname = sanitize($options['f']);
}
elseif (array_key_exists('feedname', $options))
{
  $feedname = sanitize($options['feedname']);
}

// get the name of the executable as plugin name
$plugin_command_array = explode ( ' ' , $command );
$plugin_name_array = explode ( '/' , $plugin_command_array[0]);
$plugin_name = end($plugin_name_array);
array_shift($plugin_command_array);
$parameters = implode(' ', $plugin_command_array);

//echo $parameters;

// get user if from username
$userid = UserC::getID($username);

// create the feed
$feed_id = FeedC::create($userid, $plugin_name, $feedname);

// create the feed directory
$feed_path = joinPaths(CHRIS_DATA, $username, $plugin_name, $feedname.'-'.$feed_id);
if(!mkdir($feed_path, 0777, true)){
  return "Couldn't create the feed directory on filesystem: ".$feed_path;
}

// replace ${OUTPUT} pattern in the command
$format_parameters = str_replace("{OUTPUT}", $feed_path , $parameters);

// add meta information to the feed
FeedC::addMetaS($feed_id, 'parameters', $format_parameters, 'simple');

// crun

// update the feed if crun returned sth

//return print_r($options);

// Create a feed given a user id, an action and details about the action.
// metadata instead of param?
// create folder on file system

/* FEED_PLUGIN : 'pacs_pull',
 FEED_NAME : 'name of the feed',
FEED_PARAM : metas,
FEED_OUTPUT: metas */
/*
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
$arguments .= ' -c "/bin/mostestload -t 60"';
*/
//$arguments .= ' -c "/bin/touch done.txt"';
// format parameters command
/*$arguments .= joinPaths(CHRIS_PLUGINS_FOLDER,$_POST['FEED_PLUGIN']);
 foreach($_POST['FEED_META'] as $key => $value){
$arguments .= ' --'.$value['name'].' '.$value['value'];
} */
// format output command
// ...
/*
 //$arguments .= '"';
// run on cluster and return pid
$process_command = joinPaths(CHRIS_CONTROLLER_FOLDER, 'run_'.CHRIS_CLUSTER.'.php '.$arguments);
$output = shell_exec($process_command);

// attach pid to feed
$metaObject = new Meta();
$metaObject->name = "pid";
$metaObject->value = $output;
FeedC::addMeta($feed_id, Array(0 => $metaObject));
*/
?>