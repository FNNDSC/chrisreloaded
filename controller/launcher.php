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
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'token.controller.php'));

require_once ('Net/SSH2.php');
require_once('Crypt/RSA.php');

// tempnam actually creates a file in addition to
// generating a name.
$of = tempnam(sys_get_temp_dir(), 'PHPconsole-');
if (file_exists($tempfile)) { unlink($tempfile); }


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
// $memory
// $status
// $status_step
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
$user_path = joinPaths(CHRIS_USERS, $username);
$plugin_path = joinPaths($user_path, $plugin_name);
$feed_path = joinPaths($plugin_path, $feedname.'-'.$feed_id);

// create job directory
$job_path = $feed_path;
if($jobid != ''){
  $job_path .= '/'.$jobid;
}

// Setup directories (including ssh/host vars)
// do we force this plugin to run locally as chris?
$force_chris_local = in_array($plugin_name,explode(',', CHRIS_RUN_AS_CHRIS_LOCAL));
$host = CLUSTER_HOST;
if ($status == 100 || $force_chris_local) {
  $host = 'localhost';
}
$ssh = new Net_SSH2($host);
if (!$ssh->login($username, $password)) {
  die('Login Failed');
}
$ssh->exec('umask 0002 ; mkdir -p '.$job_path);
// dprint($of, "job_path = $job_path\n");
$job_path_output = tempdir($ssh, $job_path);
// dprint($of, "job_path_output = $job_path_output\n");

// replace ${OUTPUT} pattern in the command and in the parameters
$command = str_replace("{OUTPUT}", $job_path, $command);
$command = str_replace("{FEED_ID}", $feed_id, $command);
$command = str_replace("{USER_ID}", $user_id, $command);
$parameters = str_replace("{OUTPUT}", $job_path, $parameters);
$parameters = str_replace("{FEED_ID}", $feed_id, $parameters);
$parameters = str_replace("{USER_ID}", $user_id, $parameters);

// add meta information to the feed
FeedC::addMetaS($feed_id, 'parameters', $parameters, 'simple');
// add owner
FeedC::addMetaS($feed_id, 'root_id', (string)$feed_id, 'extra');

// append the log files to the command
$command .= ' >> '.$job_path_output.'/chris.std 2> '.$job_path_output.'/chris.err';

// create the chris.env and chris.run file
$envfile = joinPaths($job_path_output, 'chris.env');
$runfile = joinPaths($job_path_output, 'chris.run');

// dprint($of, "command = $command\n");
// dprint($of, "runfile = $runfile\n");


$setStatus = '';
// retry 5 times with a 5 seconds delay
// connection timeout: 5s
// max query time: 30
if ($status != 100) {
//  $setStatus .= '/bin/sleep $(( RANDOM%=10 )) ; /usr/bin/curl --retry 5 --retry-delay 5 --connect-timeout 5 --max-time 30 -v -k --data ';
  $setStatus .= '/bin/sleep $(( RANDOM%=10 )) ; /usr/bin/curl -k --data ';
}

// also the actual chris.run dir
$ssh->exec('bash -c \' echo "export ENV_CHRISRUN_DIR='.$job_path_output.'" >>  '.$envfile.'\'');
$ssh->exec('bash -c \' echo "export ENV_REMOTEUSER='.$username.'" >>  '.$envfile.'\'');
$ssh->exec('bash -c \' echo "export ENV_CLUSTERTYPE='.CLUSTER_TYPE.'" >>  '.$envfile.'\'');
$ssh->exec('bash -c \' echo "export ENV_REMOTEHOST='.CLUSTER_HOST.'" >>  '.$envfile.'\'');
$user_key_file = joinPaths(CHRIS_USERS, $username, CHRIS_USERS_CONFIG_DIR, CHRIS_USERS_CONFIG_SSHKEY);
$ssh->exec('bash -c \' echo "export ENV_REMOTEUSERIDENTITY='.$user_key_file.'" >>  '.$envfile.'\'');
$ssh->exec('bash -c \' echo "export PYTHONPATH=$PYTHONPATH:'.CHRIS_ENV_PYTHONPATH.'" >>  '.$envfile.'\'');
$ssh->exec('bash -c \' echo "umask 0002" >> '.$envfile.'\'');

// make sure to update the permissions of the file
$ssh->exec("chmod 644 $envfile");

$ssh->exec('bash -c \' echo "source '.$envfile.';" >> '.$runfile.'\'');

if($status != 100){
  $start_token = TokenC::create();
  $ssh->exec('echo "'.$setStatus.'\'action=set&what=feed_status&feedid='.$feed_id.'&op=set&status=1&token='.$start_token.'\' '.CHRIS_URL.'/api.php > '.$job_path_output.'/curlA.std 2> '.$job_path_output.'/curlA.err" >> '.$runfile);
}

$ssh->exec('bash -c \'echo "echo \"\$(date) Running on \$HOSTNAME\" > '.$job_path_output.'/chris.std" >> '.$runfile.'\'');
$ssh->exec('bash -c \' echo "'.$command.'" >> '.$runfile.'\'');

// generate the db.json file
// to generate the db.json, we just call the viewer plugin with the correct input and ouput directories, $feed_path
$viewer_plugin = CHRIS_PLUGINS_FOLDER_NET.'/viewer/viewer';
$ssh->exec("echo '$viewer_plugin --directory $job_path --output $job_path/..;' >> $runfile;");

if($status != 100){
  $end_token = TokenC::create();
  $ssh->exec('echo "'.$setStatus.'\'action=set&what=feed_status&feedid='.$feed_id.'&op=inc&status=+'.$status_step.'&token='.$end_token.'\' '.CHRIS_URL.'/api.php > '.$job_path_output.'/curlB.std 2> '.$job_path_output.'/curlB.err" >> '.$runfile);
}

// make sure to update file permissions
$ssh->exec("echo 'chmod 775 $user_path $plugin_path; chmod 755 $feed_path; cd $feed_path ; find . -type d -exec chmod o+rx,g+rx {} \; ; find . -type f -exec chmod o+r,g+r {} \;' >> $runfile;");

$ssh->exec("chmod 755 $runfile");

$arguments = ' -l '.$job_path;
$arguments .= ' -m '.$memory;
$arguments .= ' -c "'.$runfile.'"';
$arguments .= ' -u "'.$username.'"';
$arguments .= ' -p "'.$password.'"';
$arguments .= ' -o "'.$feed_path.'"';

if ($force_chris_local) {
  // get user group id
  $groupID =  $ssh->exec("id -g");
  $groupID = trim($groupID);
  // open permissions so user can see its plugin running
  $local_command = "/bin/chgrp -R $groupID $feed_path; /bin/chmod g+rxw -R $feed_path";
  $ssh->exec($local_command);

  unset($ssh);

  # run command as locally ChRIS!
  $ssh2 = new Net_SSH2('localhost');
  $key = new Crypt_RSA();
  $sshkey = joinPaths(CHRIS_HOME, '.ssh/id_rsa');
  $key->loadKey(file_get_contents($sshkey));
  if (!$ssh2->login('chris', $key)) {
    exit('Login as ChRIS local user failed...!');
  }

  $local_command = "/bin/bash umask 0002;/bin/bash $runfile;";
  $nohup_wrap = 'bash -c \'nohup bash -c "'.$local_command.'" > /dev/null 2>&1 &\'';
  $ssh2->exec($nohup_wrap);
  $pid = -1;
} else if ($status == 100 ) {
  // run locally
  $ssh->exec('bash -c \' /bin/bash '.$runfile.'\'');
  $pid = -1;
}
else
{
  // run on cluster and return pid
  $cluster_command = str_replace("{MEMORY}", $memory, CLUSTER_RUN);
  $cluster_command = str_replace("{FEED_ID}", $feed_id, $cluster_command);
  $cluster_command = str_replace("{COMMAND}", "/bin/bash ".$runfile, $cluster_command);
  $pid = $ssh->exec('bash -c \''.$cluster_command.'\'');
}

// attach pid to feed
$metaObject = new Meta();
$metaObject->name = "pid";
$metaObject->value = $pid;
FeedC::addMeta($feed_id, Array(0 => $metaObject));

echo $feed_id;
?>
