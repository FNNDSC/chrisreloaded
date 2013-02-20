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
//define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
require_once (dirname(dirname(__FILE__)).'/config.inc.php');
//require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'security.controller.php'));

// include the controller
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'user.controller.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));

require_once ('Net/SSH2.php');

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
// $memory
// $status
// *****************


// get the name of the executable as plugin name
$plugin_command_array = explode ( ' ' , $command );
$plugin_name_array = explode ( '/' , $plugin_command_array[0]);
$plugin_name = end($plugin_name_array);
array_shift($plugin_command_array);
$parameters = implode(' ', $plugin_command_array);

// get user if from username
$user_id = UserC::getID($username);


// create the feed if first batch job

if($feed_id == -1){
  $feed_id = FeedC::create($user_id, $plugin_name, $feedname, $status);
}

// create the feed directory
$feed_path = joinPaths(CHRIS_USERS, $username, $plugin_name, $feedname.'-'.$feed_id);
// SINCE WE CREATE ALL JOB FOLDERS, WE DO NOT NEED TO CREATE THE FEED FOLDER
//$mkdir_command = "sshpass -p '".$password."' ssh ".$username."@localhost 'mkdir -p ".$feed_path."'";
//exec($mkdir_command);
//umask(022);
//mkdir($feed_path, 0777, true);

// create job directory
$job_path = $feed_path;
if($jobid != ''){
  $job_path .= '/'.$jobid;
  //$mkdir_command = "sshpass -p '".$password."' ssh ".$username."@localhost 'mkdir -p ".$job_path."'";
  //exec($mkdir_command);
}

// replace ${OUTPUT} pattern in the command and in the parameters
$command = str_replace("{OUTPUT}", $job_path, $command);
$command = str_replace("{FEED_ID}", $feed_id, $command);
$command = str_replace("{USER_ID}", $user_id, $command);
$parameters = str_replace("{OUTPUT}", $job_path, $parameters);
$parameters = str_replace("{FEED_ID}", $feed_id, $parameters);
$parameters = str_replace("{USER_ID}", $user_id, $parameters);

// create chris.param file
//$fp = fopen(joinPaths($job_path, 'chris.param'), 'w');
//fwrite($fp, $parameters);
//fclose($fp);
// WE DO NOT NEED THE .param FILE ANYMORE - everything is in the chris.run file
//$write_command = "sshpass -p '".$password."' ssh ".$username."@localhost 'echo \"".$parameters."\" > ".joinPaths($job_path, 'chris.param')."'";
//exec($write_command);

// add meta information to the feed
FeedC::addMetaS($feed_id, 'parameters', $parameters, 'simple');
// add owner
FeedC::addMetaS($feed_id, 'root_id', (string)$feed_id, 'extra');

// append the log files to the command
$command .= ' > '.$job_path.'/chris.log 2> '.$job_path.'/chris.err';

// create the chris.run file
$runfile = joinPaths($job_path, 'chris.run');
$host = CLUSTER_HOST;

if ($status == 100) {
  $host = 'localhost';
}

$ssh = new Net_SSH2($host);
if (!$ssh->login($username, $password)) {
  die('Login Failed');
}

$ssh->exec('mkdir -p '.$job_path);
$ssh->exec('echo "'.$command.'" > '.$runfile);
$ssh->exec("echo 'chmod 755 $feed_path; cd $feed_path ; find . -type d -exec chmod o+rx,g+rx {} \; ; find . -type f -exec chmod o+r,g+r {} \;' >> $runfile");
$ssh->exec("chmod +x $runfile;");


$arguments = ' -l '.$job_path;
$arguments .= ' -m '.$memory;
//$arguments .= ' -c "'.$command.'"';
$arguments .= ' -c "'.$runfile.'"';
$arguments .= ' -u "'.$username.'"';
$arguments .= ' -p "'.$password.'"';
$arguments .= ' -o "'.$feed_path.'"';
if ($status == 100) {
  // run locally
  $ssh->exec($runfile);
  $pid = -1;
  //$process_command = joinPaths(CHRIS_CONTROLLER_FOLDER, 'run_local.php '.$arguments);
} else {
  // run on cluster and return pid
  $cluster_command = str_replace("{MEMORY}", $memory, CLUSTER_SCHEDULER);
  $cluster_command = str_replace("{COMMAND}", $runfile, $cluster_command);
  $pid = $ssh->exec($cluster_command." < /dev/null & echo $!;");
  //$process_command = joinPaths(CHRIS_CONTROLLER_FOLDER, 'run_mosix.php '.$arguments);
}

//$output = Array();
//exec($process_command, $output);
//$output = $output[0];

// attach pid to feed
$metaObject = new Meta();
$metaObject->name = "pid";
$metaObject->value = $pid;
FeedC::addMeta($feed_id, Array(0 => $metaObject));

//echo $output;

echo $feed_id;
?>
