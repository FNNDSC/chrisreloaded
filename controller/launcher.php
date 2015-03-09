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
if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
require_once (dirname(dirname(__FILE__)).'/config.inc.php');
//require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'security.controller.php'));

// include the controller
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'user.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'runner.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'token.controller.php'));

require_once ('Net/SSH2.php');
require_once('Crypt/RSA.php');

// tempnam actually creates a file in addition to
// generating a name.
//$of = tempnam(sys_get_temp_dir(), 'PHPconsole-');
//if (file_exists($tempfile)) { unlink($tempfile); }


// check if we are invoked by commandline
$commandline_mode = (php_sapi_name() == 'cli');

if ($commandline_mode) {

  // parse the options if we are in commandline mode

  // define the options
  $shortopts = "c:u::f::i::j::h";
  $longopts  = array(
    "command:",     // Required value
    "username::",    // Optional value
    "password::",
    "feedname::",    // Optional value
    "feedid::",    // Optional value
    "jobid::",    // Optional value
    "status::", // Optional value
    "statusstep::",
    "memory::", // Optional value
    "help"    // Optional value
  );

  $options = getopt($shortopts, $longopts);

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

  // is password given?
  $password = 'secret';
  if( array_key_exists('p', $options))
  {
    $username = $options['p'];
  }
  elseif (array_key_exists('password', $options))
  {
    $password = $options['password'];
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
  // is there a job id
  $jobid = '';
  if( array_key_exists('j', $options))
  {
    $jobid = $options['j'];
  }
  elseif (array_key_exists('jobid', $options))
  {
    $jobid = $options['jobid'];
  }

  $feed_id = -1;
  $feed_id = $options['feedid'];

  // set the initial status, if --status is provided, use this value
  $status = 0;
  if (array_key_exists('status', $options)) {
    $status = $options['status'];
  }

  // set the initial status, if --status is provided, use this value
  $status_step = 100;
  if (array_key_exists('statusstep', $options)) {
    $status_step = $options['statusstep'];
  }

  // set the initial memory, if --status is provided, use this value
  $memory = 2048;
  if (array_key_exists('memory', $options)) {
    $memory = $options['memory'];
  }

}


// *****************
// here we either entered via CLI or via PHP
// meaning that the following variables must have been set
// $command
// $username
// $password
// $feedname
// $feed_id
// $jobid
// $memory ??
// $status
// $status_step
// *****************

//
// TEST SSH CONNECTION TO LOCAL SERVER!
//

$sshLocal = new Net_SSH2('localhost');
if (!$sshLocal->login($username, $password)) {
  die('Server login Failed');
}


//
// FIRST WE GET ALL THE GENERAL INFORMATION
//

// GET THE PLUGIN NAME
$plugin_command_array = explode ( ' ' , $command );
$plugin_name_array = explode ( '/' , $plugin_command_array[0]);
$plugin_name = end($plugin_name_array);

//
// GET USER ID
//
$user_id = UserC::getID($username);

//
// create the feed in the database if first batch job
// if $feed_id has already been defined (batch job), we do not generate a new id
//

if($feed_id == -1){
  $feed_id = FeedC::create($user_id, $plugin_name, $feedname, $status);
}
FeedC::addMetaS($feed_id, 'root_id', (string)$feed_id, 'extra');

//
// CREATE DIRECTORY TREE ON LOCAL SERVER
//

$user_path = joinPaths(CHRIS_USERS, $username);
$plugin_path = joinPaths($user_path, $plugin_name);
$feed_path = joinPaths($plugin_path, $feedname.'-'.$feed_id);

// create job directory
$job_path = $feed_path;
if($jobid != ''){
  $job_path .= '/'.$jobid;
}
$job_path_output = createDir($sshLocal, $job_path);


//
// replace ${OUTPUT} pattern in the command and in the parameters
//

$plugin_command_array = str_replace("{OUTPUT}", $job_path, $plugin_command_array);
$plugin_command_array = str_replace("{FEED_ID}", $feed_id, $plugin_command_array);
$plugin_command_array = str_replace("{USER_ID}", $user_id, $plugin_command_array);

//
//
//

if( !function_exists('getJobType')){
	
  function getJobType($name, $status){
    if(in_array($name,explode(',', CHRIS_RUN_AS_CHRIS_LOCAL))){
      return 'localChris';
    }
    if($status == 100){
      return 'immediate';
    }
    if(CLUSTER_SHARED_FS){
      return 'shared';
    }
    else{
      return 'separated';
    }
  }
}

$jobType = getJobType($plugin_name, $status);

switch($jobType){
  case 'localChris':
    // instantiate a local run
    $localRun  = new LocalRunner();

    // get all required variables
    $groupId =  $sshLocal->exec("id -g");
    $groupId= trim($groupId);
    $runtimePath = str_replace($plugin_path, CHRIS_TMP, $job_path);

    // set all variables here!
    $localRun->ssh = $sshLocal;
    $localRun->path = $job_path;
    $localRun->runtimePath = $runtimePath;
    $localRun->pluginCommandArray = $plugin_command_array;
    $localRun->userId = $user_id;
    $localRun->groupId = $groupId;
    $localRun->username = $username;
    $localRun->feedId = $feed_id;
    $localRun->status = $status;
    $localRun->statusStep = $status_step;

    // run all steps
    $localRun->createEnv();
    $localRun->createRun();
    $localRun->prepare();
    $localRun->run();

    // return pid
    $pid = $localRun->pid;
    break;
  case 'immediate':
    // instantiate a immediate run
    $immediateRun  = new ImmediateRunner();

    // set all variables here!
    $immediateRun->ssh = $sshLocal;
    $immediateRun->path = $job_path;
    $immediateRun->runtimePath = $job_path;
    $immediateRun->pluginCommandArray = $plugin_command_array;

    // run all steps
    $immediateRun->createEnv();
    $immediateRun->createRun();
    $immediateRun->run();

    // return pid
    $pid = $immediateRun->pid;

    break;
  case 'shared':
    // instantiate a shared run
    $sharedRun  = new SharedRunner();

    // set all variables here!
    $sharedRun->ssh = $sshLocal;
    // remote ssh
    $sharedRun->remoteSsh = new Net_SSH2(CLUSTER_HOST);
    if (!$sharedRun->remoteSsh->login($username, $password)) {
      die('Cluster login Failed');
    }

    $sharedRun->remoteHost = trim($sharedRun->remoteSsh->exec('hostname -s 2>/dev/null | tail -n 1'));
    $sharedRun->remoteUser = $username;
    $sharedRun->username = $username;
    $sharedRun->path = $job_path;
    $sharedRun->runtimePath = $job_path;
    $sharedRun->pluginCommandArray = $plugin_command_array;
    $sharedRun->feedId = $feed_id;
    $sharedRun->status = $status;
    $sharedRun->statusStep = $status_step;

    // run all steps
    $sharedRun->createEnv();
    $sharedRun->createRun();
    $sharedRun->run();

    // return pid
    $pid = $sharedRun->pid;
    break;
  case 'separated':
    // instantiate a shared run
    $separatedRun  = new SeparatedRunner();

    // set all variables here!
    $separatedRun->ssh = $sshLocal;
    // remote ssh
    $separatedRun->remoteSsh = new Net_SSH2(CLUSTER_HOST);
    if (!$separatedRun->remoteSsh->login($username, $password)) {
      die('Cluster login Failed');
    }

    $separatedRun->remoteHost = trim($separatedRun->remoteSsh->exec('hostname -s 2>/dev/null | tail -n 1'));
    $separatedRun->remoteUser = $username;
    $separatedRun->username = $username;
    $separatedRun->path = $job_path;
    $runtimePath = str_replace($plugin_path, CLUSTER_CHRIS.'/users/'.$username, $job_path);
    $separatedRun->runtimePath = $runtimePath;
    $separatedRun->pluginCommandArray = $plugin_command_array;
    $separatedRun->feedId = $feed_id;
    $separatedRun->status = $status;
    $separatedRun->statusStep = $status_step;

    // run all steps
    $separatedRun->createEnv();
    $separatedRun->createRun();
    $separatedRun->prepare();
    $separatedRun->run();

    // return pid
    $pid = $separatedRun->pid;
    break;
  default:
    echo 'unknown job type...';
  }

  // attach pid to feed
  $metaObject = new Meta();
  $metaObject->name = "pid";
  $metaObject->value = $pid;
  FeedC::addMeta($feed_id, Array(0 => $metaObject));

  // in case the output buffer was silcenced, reactivate it
  ob_end_clean();

  $feedInfo = array(
    "feedId" => $feed_id
  );
  $jsonFeedInfo = json_encode($feedInfo);

  echo $jsonFeedInfo;
?>
