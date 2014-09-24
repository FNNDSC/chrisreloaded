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
// $memory
// $status
// $status_step
// *****************


//
// get the name of the executable as plugin name
// get the list of parameters
//

$plugin_command_array = explode ( ' ' , $command );
$plugin_name_array = explode ( '/' , $plugin_command_array[0]);
$plugin_name = end($plugin_name_array);
array_shift($plugin_command_array);
$parameters = implode(' ', $plugin_command_array);


//
// initiate ssh connection
//

$sshLocal = new Net_SSH2('localhost');
if (!$sshLocal->login($username, $password)) {
  die('Server login Failed');
}
$force_chris_local = in_array($plugin_name,explode(',', CHRIS_RUN_AS_CHRIS_LOCAL));
if ($status == 100 || $force_chris_local) {
  $host = 'localhost';
} else {
  $host = CLUSTER_HOST;
  $sshCluster  = new Net_SSH2($host);
  if (!$sshCluster->login($username, $password)) {
    die('Cluster login Failed');
  }
}


//
// get username's id
//
$user_id = UserC::getID($username);

//
// create the feed in the database if first batch job
// if $feed_id has already been defined (bash job), we do not generate a new id
//

if($feed_id == -1){
  $feed_id = FeedC::create($user_id, $plugin_name, $feedname, $status);
}


//
// create the feed directory
//

$user_path = joinPaths(CHRIS_USERS, $username);
$plugin_path = joinPaths($user_path, $plugin_name);
$feed_path = joinPaths($plugin_path, $feedname.'-'.$feed_id);

// create job directory
$job_path = $feed_path;
if($jobid != ''){
  $job_path .= '/'.$jobid;
}
//$job_path_output = createDir($sshLocal, $job_path, '');
$job_path_output = createDir($sshLocal, $job_path);

//
// replace ${OUTPUT} pattern in the command and in the parameters
//

$command = str_replace("{OUTPUT}", $job_path, $command);
$command = str_replace("{FEED_ID}", $feed_id, $command);
$command = str_replace("{USER_ID}", $user_id, $command);
$parameters = str_replace("{OUTPUT}", $job_path, $parameters);
$parameters = str_replace("{FEED_ID}", $feed_id, $parameters);
$parameters = str_replace("{USER_ID}", $user_id, $parameters);

// append the log files to the command
$command .= ' >> '.$job_path_output.'/chris.std 2> '.$job_path_output.'/chris.err';


//
// add meta information to the feed in the database
//

FeedC::addMetaS($feed_id, 'parameters', $parameters, 'simple');
FeedC::addMetaS($feed_id, 'root_id', (string)$feed_id, 'extra');


//
// create the file containing the chris env variables which are required by the plugin
// and fill it
//

$envfile = joinPaths($job_path_output, 'chris.env');
$sshLocal->exec(bash('echo "export ENV_CHRISRUN_DIR='.$job_path_output.'" >>  '.$envfile));
$sshLocal->exec(bash('echo "export ENV_REMOTEUSER='.$username.'" >>  '.$envfile));
$sshLocal->exec(bash('echo "export ENV_CLUSTERTYPE='.CLUSTER_TYPE.'" >>  '.$envfile));
$sshLocal->exec(bash('echo "export ENV_REMOTEHOST='.CLUSTER_HOST.'" >>  '.$envfile));
// should be renamed CLUSTER_CHRIS_PYTHONPATH
$sshLocal->exec(bash('echo "export PYTHONPATH=$PYTHONPATH:'.CHRIS_ENV_PYTHONPATH.'" >>  '.$envfile));
$sshLocal->exec(bash('echo "export PATH=$PATH:'.CLUSTER_CHRIS_BIN.'" >>  '.$envfile));
$sshLocal->exec(bash('echo "umask 0002" >> '.$envfile));

// make sure to update the permissions of the file
$sshLocal->exec("chmod 644 $envfile");


//
// create the file containing the chris run commannds
// and fill it
// 1- source en
// 2- set status to 1
// 3- log date/hostname
// 4- run plugin
// 5- generate json scene for the viewer
// 6- set status to 100
// 7- update permissions of the files
//

$runfile = joinPaths($job_path_output, 'chris.run');

// the set status command, to update a job status through curl
$setStatus = '';
// retry 5 times with a 5 seconds delay
// connection timeout: 5s
// max query time: 30
if ($status != 100) {
//  $setStatus .= '/bin/sleep $(( RANDOM%=10 )) ; /usr/bin/curl --retry 5 --retry-delay 5 --connect-timeout 5 --max-time 30 -v -k --data ';
  $setStatus .= '/bin/sleep $(( RANDOM%=10 )) ; /usr/bin/curl -k --data ';
}

// 1- source the environment
$sshLocal->exec(bash('echo "source '.$envfile.';" >> '.$runfile));

// 2- set status to 1 if necessary
// status == 1 means the job has started
// status == 100 means this a 'non-blocking' plugin that is just gonna run without scheduling
// this is defined in the plugin's configuration
// for instance, the file_browser is a non-blocking plugin
if($status != 100){
  $start_token = TokenC::create();
  $sshLocal->exec('echo "'.$setStatus.'\'action=set&what=feed_status&feedid='.$feed_id.'&op=set&status=1&token='.$start_token.'\' '.CHRIS_URL.'/api.php > '.$job_path_output.'/curlA.std 2> '.$job_path_output.'/curlA.err" >> '.$runfile);
}

// 3- log to the chris.std the time and machine on which the plugin is running (useful for debugging)
$sshLocal->exec(bash('echo "echo \"\$(date) Running on \$HOSTNAME\" > '.$job_path_output.'/chris.std" >> '.$runfile));

// 4- run the actual plugin
$sshLocal->exec(bash('echo "'.$command.'" >> '.$runfile));

// 5- generate the db.json file
// it generates a scene for the job after is finishes. It is useful for the viewer plugin.
// it is useful performance-wise because if this file already exists, we do not have to re-generate it in javascript when we open the viewer plugin.
// to generate the db.json, we just call the viewer plugin with the correct input and ouput directories, $feed_path
$viewer_plugin = CHRIS_PLUGINS_FOLDER_NET.'/viewer/viewer';
$sshLocal->exec("echo '$viewer_plugin --directory $job_path --output $job_path/..;' >> $runfile;");

// 6- set status to 100 if necessary
// status == 100 means the job has finished
if($status != 100){
  $end_token = TokenC::create();
  $sshLocal->exec('echo "'.$setStatus.'\'action=set&what=feed_status&feedid='.$feed_id.'&op=inc&status=+'.$status_step.'&token='.$end_token.'\' '.CHRIS_URL.'/api.php > '.$job_path_output.'/curlB.std 2> '.$job_path_output.'/curlB.err" >> '.$runfile);
}

// 7- make sure to update file permissions
$sshLocal->exec("echo 'chmod 775 $user_path $plugin_path; chmod 755 $feed_path; cd $feed_path ; find . -type d -exec chmod o+rx,g+rx {} \; ; find . -type f -exec chmod o+r,g+r {} \;' >> $runfile;");


//
// the chris.run is ready now
// execute the chris.run how it is supposed to (local, remote, as chris, etc.)
// update the chris.run file permissions to be executable
//

$sshLocal->exec("chmod 755 $runfile");

$arguments = ' -l '.$job_path;
$arguments .= ' -m '.$memory;
$arguments .= ' -c "'.$runfile.'"';
$arguments .= ' -u "'.$username.'"';
$arguments .= ' -p "'.$password.'"';
$arguments .= ' -o "'.$feed_path.'"';

if ($force_chris_local) {
  // get user group id
  $groupID =  $sshLocal->exec("id -g");
  $groupID = trim($groupID);
  // open permissions so user can see its plugin running
  $local_command = "/bin/chgrp -R $groupID $feed_path; /bin/chmod g+rxw -R $feed_path";
  $sshLocal->exec($local_command);

  unset($sshLocal);

  # run command as locally ChRIS!
  $sshLocal2 = new Net_SSH2('localhost');
  $key = new Crypt_RSA();
  $sshLocalkey = joinPaths(CHRIS_HOME, '.ssh/id_rsa');
  $key->loadKey(file_get_contents($sshLocalkey));
  if (!$sshLocal2->login('chris', $key)) {
    exit('Login as ChRIS local user failed...!');
  }

  $local_command = "/bin/bash umask 0002;/bin/bash $runfile;";
  $nohup_wrap = 'bash -c \'nohup bash -c "'.$local_command.'" > /dev/null 2>&1 &\'';
  $sshLocal2->exec($nohup_wrap);
  $pid = -1;
} else if ($status == 100 ) {
  // run locally
  $sshLocal->exec('bash -c \' /bin/bash '.$runfile.'\'');
  $pid = -1;
}
else
{ //
  // run on cluster and return pid
  //
  if (!CLUSTER_SHARED_FS) {
    $cluster_user_path = joinPaths(CLUSTER_CHRIS_USERS, $username);
    $cluster_plugin_path = joinPaths($cluster_user_path, $plugin_name);
    $cluster_feed_path = joinPaths($cluster_plugin_path, $feedname.'-'.$feed_id);
    // create job directory
    $cluster_job_path = $cluster_feed_path;
    if($jobid != ''){
      $cluster_job_path .= '/'.$jobid;
    }
    $cluster_job_path_output = createDir($sshCluster, $cluster_job_path);

    // replace chris server's paths in chris.env by cluster's paths
    $envfile_str = file_get_contents($envfile);
    $envfile_str = str_replace($job_path_output, $cluster_job_path_output, $envfile_str);
    $envfile = joinPaths($cluster_job_path_output, 'chris.env');
    $sshCluster->exec('echo "'.$envfile_str.'"'.' > '.$envfile);

    // create _chrisInput_ dir
    $chrisInputDirectory = '_chrisInput_';
    $sshLocal->exec('cd ' . $job_path.'; mkdir '.$chrisInputDirectory.'; chmod 755 '.$chrisInputDirectory);

    // run the plugin with the --inputs switch on the chris server
    $plugin_command_array = explode(' ', $command);
    // $inputs_options is a string containing a list of input options separated by comma
    $input_options = $sshLocal->exec($plugin_command_array[0].' --inputs');
    //remove EOL and white spaces
    $input_options = trim(preg_replace('/\s+/', ' ', $input_options));
    $input_options_array = explode(',', $input_options);

    // replace chris server's paths in chris.run by cluster's paths
    $runfile_str = file_get_contents($runfile);
    $runfile_str = str_replace($user_path, $cluster_user_path, $runfile_str);
    foreach ($input_options_array as $in) {
      // get location of input in the command array
      $input_key = array_search($in, $plugin_command_array);
      if($input_key !== false){
        // get value of the input in the command array
        // the value of the input should be the next element in the $command_array
        $value_key = $input_key + 1;
        $value = $plugin_command_array[$value_key];
        if (is_dir($value)) {
          $value_dirname = $value;
        } else {
          $value_dirname = dirname($value);
        }
        // need to add the full absolute path to make it unique
        $value_chris_path = joinPaths($job_path,$chrisInputDirectory, $value_dirname);
        $sshLocal->exec('mkdir -p ' . $value_chris_path);
        // -n to not overwrite file if already there
        $sshLocal->exec('cp -rn ' . $value_dirname . ' ' . dirname($value_chris_path));
        $value = str_replace($user_path, $cluster_user_path, $value);
        $runfile_str = str_replace($plugin_command_array[$input_key].' '.$value, $plugin_command_array[$input_key].' '.joinPaths($cluster_job_path,$chrisInputDirectory, $value_dirname), $runfile_str);
      }
    }
    $runfile_str = str_replace(CHRIS_PLUGINS_FOLDER, CHRIS_PLUGINS_FOLDER_NET, $runfile_str);


    //
    // MOVE DATA ($chrisInputDirectory) FROM SERVER TO CLUSTER
    //

    // command to compress _chrisInput_ dir on the chris server
    $cmd = '\"cd '.$job_path.'; tar -zcf '.$chrisInputDirectory.'.tar.gz '.$chrisInputDirectory.';\"';
    $cmd = 'ssh -o StrictHostKeyChecking=no ' . $username.'@'.CHRIS_HOST . ' '.$cmd;

    // command to copy over the compressed _chrisIput_ dir to the cluster
    $cmd = $cmd.PHP_EOL.'scp ' . $username.'@'.CHRIS_HOST.':'.$job_path.'/'.$chrisInputDirectory.'.tar.gz ' .$cluster_job_path.';';

    // command to remove the compressed file on the chris server
    $cmd = $cmd.PHP_EOL.'ssh ' . $username.'@'.CHRIS_HOST . ' rm '.$job_path.'/'.$chrisInputDirectory.'.tar.gz;';

    // command to uncompress the compressed file on the cluster
    $cmd = $cmd.PHP_EOL.'cd '.$cluster_job_path.'; tar -zxf '.$chrisInputDirectory.'.tar.gz;';

    // command to remove the compressed file from the cluster
    $cmd = $cmd.PHP_EOL.'cd '.$cluster_job_path.'; rm '.$chrisInputDirectory.'.tar.gz;';
    $runfile_str = $cmd.PHP_EOL.$runfile_str;

    //
    // MOVE DATA ($job_path directory) FROM CLUSTER TO SERVER
    //

    // command to compress $cluster_job_path dir on the cluster (excluding _chrisInput_ dir)
    $data = basename($job_path);
    $cmd = 'cd '.$cluster_feed_path.'; tar -zcf '.$data.'.tar.gz '.$data.' --exclude ' . joinPaths($data, $chrisInputDirectory). ';';
    $runfile_str = $runfile_str.$cmd;

    // command to copy over the compressed $cluster_job_path dir to the chris server
    $cmd = 'scp ' . $cluster_feed_path.'/'.$data.'.tar.gz ' . $username.'@'.CHRIS_HOST.':'.$feed_path.';';
    $runfile_str = $runfile_str.PHP_EOL.$cmd;

    // command to uncompress and remove the compressed file on the chris server
    $cmd = '\"cd '.$feed_path.'; tar -zxf '.$data.'.tar.gz; rm '.$data.'.tar.gz;\"';
    $cmd = 'ssh ' . $username.'@'.CHRIS_HOST . ' '.$cmd;
    $runfile_str = $runfile_str.PHP_EOL.$cmd;

    // command to remove the compressed file from the cluster
    $cmd = 'cd '.$cluster_feed_path.'; rm '.$data.'.tar.gz &';
    $runfile_str = $runfile_str.PHP_EOL.$cmd;

    //dprint('/neuro/users/chris/console.log', $runfile_str);

    $runfile = joinPaths($cluster_job_path_output, 'chris.run');
    $sshCluster->exec('echo "'.$runfile_str.'"'.' > '.$runfile);
  }

  $cluster_command = str_replace("{MEMORY}", $memory, CLUSTER_RUN);
  $cluster_command = str_replace("{FEED_ID}", $feed_id, $cluster_command);
  $cluster_command = str_replace("{COMMAND}", "/bin/bash ".$runfile, $cluster_command);
  //dprint('/neuro/users/chris/console.log', 'bash -c \''.$cluster_command.'\'');
  $pid = $sshCluster->exec(bash($cluster_command));
}

// attach pid to feed
$metaObject = new Meta();
$metaObject->name = "pid";
$metaObject->value = $pid;
FeedC::addMeta($feed_id, Array(0 => $metaObject));

echo $feed_id;
?>
