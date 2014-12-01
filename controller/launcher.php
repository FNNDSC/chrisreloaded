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

$command = str_replace("{OUTPUT}", $job_path, $command);
$command = str_replace("{FEED_ID}", $feed_id, $command);
$command = str_replace("{USER_ID}", $user_id, $command);

//
////
//
//
//
//  WARNING, {OUTPUT} .... NOT REPLACEDin pluginCommandArray, only in the $command string....
//
//
//

function getJobType($name, $status){
  if(in_array($plugin_name,explode(',', CHRIS_RUN_AS_CHRIS_LOCAL))){
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

$jobType = getJobType();

switch($jobType){
  case 'localChris':
    echo 'localChris!';
    
    // instantiate a local run
    $localRun  = new LocalRunner();

    // get all required variables
    $groupId =  $sshLocal->exec("id -g");
    $groupId= trim($groupId);
    $runtimePath = str_replace($plugin_path, CHRIS_TMP, $job_path);

    // set all variables here!
    $localRun->ssh = $sshLocal;
    $localRun->path = $jobPath;
    $localRun->runtimePath = $runtimePath;
    $localRun->pluginCommandArray = $pluginCommandArray;
    $localRun->userId = $user_id;
    $localRun->groupId = $groupId;
    $localRun->username = $username;
    $localRun->feedId = $feed_id;
    $localRun->status = $status;
    $localRun->statusStep = $status_step;
    $localRun->pid = $pid;

    // run all steps
    $localRun->createEnv();
    $localRun->createRun();
    $localRun->prepare();
    $localRun->run();

    // return pid
    $pid = $localRun->pid;
    break;
  case 'immediate':
    // create the json db for the viewer plugin once the data is in its final location
    $viewer_plugin = CHRIS_PLUGINS_FOLDER.'/viewer/viewer';
    $sshLocal->exec("echo '$viewer_plugin --directory $job_path --output $job_path/..;' >> $runfile;");

    // run locally
    $sshLocal->exec('bash -c \' /bin/bash '.$runfile.'\'');
    $pid = -1;
    echo 'immediate!';
    break;
  case 'shared':
    /*if ($status != 100 && !$force_chris_local) {
      $sshCluster  = new Net_SSH2(CLUSTER_HOST);
      if (!$sshCluster->login($username, $password)) {
        die('Cluster login Failed');
      }
    }
    */
    echo 'shared';
    break;
  case 'separated':
    /*if ($status != 100 && !$force_chris_local) {
      $sshCluster  = new Net_SSH2(CLUSTER_HOST);
      if (!$sshCluster->login($username, $password)) {
        die('Cluster login Failed');
      }
    }
    */
    echo 'separated';
    break;
  default:
    echo 'unknown job type...';
}

/*
  } else { //
    // run on cluster and return pid
    //
    if (!CLUSTER_SHARED_FS) {
      $cluster_user_path = joinPaths(CLUSTER_CHRIS, 'users', $username);
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


      // get the contents of chris.run
      $runfile_str = file_get_contents($runfile);


      // replace chris server plugin paths with cluster's paths
      $runfile_str = str_replace(CHRIS_PLUGINS_FOLDER, CHRIS_PLUGINS_FOLDER_NET, $runfile_str);

      //
      // MOVE DATA ($chrisInputDirectory) FROM SERVER TO CLUSTER
      //

      if (CLUSTER_PORT==22) {
        $tunnel_host = CHRIS_HOST;
      } else {
        $tunnel_host = $cluster_internal_host;
      }

      // command to compress _chrisInput_ dir on the chris server
      $cmd = '\"cd '.$job_path.'; tar -zcf '.$chrisInputDirectory.'.tar.gz '.$chrisInputDirectory.';\"';
      $cmd = 'ssh -p ' .CLUSTER_PORT. ' -o StrictHostKeyChecking=no ' . $username.'@'.$tunnel_host. ' '.$cmd;

      // command to copy over the compressed _chrisIput_ dir to the cluster
      $cmd = $cmd.PHP_EOL.'scp -P ' .CLUSTER_PORT. ' ' . $username.'@'.$tunnel_host.':'.$job_path.'/'.$chrisInputDirectory.'.tar.gz ' .$cluster_job_path.';';

      // command to remove the compressed file on the chris server
      $cmd = $cmd.PHP_EOL.'ssh -p ' .CLUSTER_PORT. ' ' . $username.'@'.$tunnel_host . ' rm '.$job_path.'/'.$chrisInputDirectory.'.tar.gz;';

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
      $cmd = 'scp -P ' .CLUSTER_PORT. ' ' . $cluster_feed_path.'/'.$data.'.tar.gz ' . $username.'@'.$tunnel_host.':'.$feed_path.';';
      $runfile_str = $runfile_str.PHP_EOL.$cmd;

      // command to uncompress and remove the compressed file on the chris server
      $cmd = '\"cd '.$feed_path.'; tar -zxf '.$data.'.tar.gz; rm '.$data.'.tar.gz;\"';
      $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $username.'@'.$tunnel_host . ' '.$cmd;
      $runfile_str = $runfile_str.PHP_EOL.$cmd;

      // command to remove the compressed file from the cluster
      $cmd = 'cd '.$cluster_feed_path.'; rm '.$data.'.tar.gz &';
      $runfile_str = $runfile_str.PHP_EOL.$cmd;

      //
      // CREATE VIEWER SCENE
      //

      $viewer_plugin = CHRIS_PLUGINS_FOLDER.'/viewer/viewer';
      $cmd = '\"'.$viewer_plugin.' --directory '.$job_path.' --output '.$job_path.'/..;\"';
      $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $username.'@'.$tunnel_host . ' '.$cmd;
      $runfile_str = $runfile_str.PHP_EOL.$cmd;

      //ANONYMIZATION
      if (ANONYMIZE_DICOM) {
        $anonfile = joinPaths($job_path_output, 'chris.anon');
        // copy template over
        $sshLocal->exec("cp ".joinPaths(CHRIS_SRC, "controller/anonymize.php")." $anonfile");
        // update template content
        $chrisInput_path_escaped  = str_replace("/", "\/", $chrisInput_path);
        $sshLocal->exec("sed -i 's/\${CHRISINPUT_PATH}/$chrisInput_path_escaped/g' $anonfile");

        $chris_bin = joinPaths(CHRIS_HOME, "bin");
        $chris_bin_escaped  = str_replace("/", "\/", $chris_bin);
        $sshLocal->exec("sed -i 's/\${CHRIS_BIN}/$chris_bin_escaped/g' $anonfile");

        $chris_scripts = joinPaths(CHRIS_SRC, "../scripts");
        $chris_scripts_escaped  = str_replace("/", "\/", $chris_scripts);
        $sshLocal->exec("sed -i 's/\${CHRIS_SCRIPTS}/$chris_scripts_escaped/g' $anonfile");

        $sshLocal->exec('chmod 755 '.$anonfile);

        $cmd = '\"php '.$anonfile.';\"';
        $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $username.'@'.$tunnel_host . ' '.$cmd;
        $runfile_str = $cmd.PHP_EOL.$runfile_str;
      }

      //
      // UPDATE FEED STATUS
      //
      $start_token = TokenC::create();
      $cmd = '\"'.$setStatus.'\'action=set&what=feed_status&feedid='.$feed_id.'&op=set&status=1&token='.$start_token.'\' '.CHRIS_URL.'/api.php > '.$job_path_output.'/curlA.std 2> '.$job_path_output.'/curlA.err;\"';
      $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $username.'@'.$tunnel_host . ' '.$cmd;
      $runfile_str = $cmd.PHP_EOL.$runfile_str;

      $end_token = TokenC::create();
      $cmd = '\"'.$setStatus.'\'action=set&what=feed_status&feedid='.$feed_id.'&op=inc&status=+'.$status_step.'&token='.$end_token.'\' '.CHRIS_URL.'/api.php > '.$job_path_output.'/curlB.std 2> '.$job_path_output.'/curlB.err;\"';
      $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $username.'@'.$tunnel_host . ' '.$cmd;
      $runfile_str = $runfile_str.PHP_EOL.$cmd;

      ////
      // DELETE REMOTE JOB PATH AFTER ALL THE DATA AS BEEN COPIED BACK
      /////
      $cmd = 'rm -rf '.$cluster_job_path.' &;';
      $runfile_str = $runfile_str.PHP_EOL.$cmd;

      $runfile = joinPaths($cluster_job_path_output, 'chris.run');
      $sshCluster->exec('echo "'.$runfile_str.'"'.' > '.$runfile);
      $sshCluster->exec('chmod 775 '.$runfile);
    } else {
      $escaped_chris_plugin = str_replace("/", "\/", CHRIS_PLUGINS_FOLDER);
      $escaped_chris_net_plugin  = str_replace("/", "\/", CHRIS_PLUGINS_FOLDER_NET);
      $sshLocal->exec("sed -i 's/$escaped_chris_plugin/$escaped_chris_net_plugin/g' $runfile");

      // create the json db for the viewer plugin once the data is in its final location
      $viewer_plugin = CHRIS_PLUGINS_FOLDER_NET.'/viewer/viewer';
      $sshLocal->exec("echo '$viewer_plugin --directory $job_path --output $job_path/..;' >> $runfile;");

      //
      // UPDATE FEED STATUS
      //

      if (CLUSTER_PORT==22) {
        $tunnel_host = CHRIS_HOST;
      } else {
        $tunnel_host = $cluster_internal_host;
      }

      $start_token = TokenC::create();
      $cmd = '\"'.$setStatus.'\'action=set&what=feed_status&feedid='.$feed_id.'&op=set&status=1&token='.$start_token.'\' '.CHRIS_URL.'/api.php > '.$job_path_output.'/curlA.std 2> '.$job_path_output.'/curlA.err;\"';
      $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $username.'@'.$tunnel_host . ' '.$cmd;
      $sshLocal->exec('sed -i "1i '.$cmd.'" '.$runfile);

      $end_token = TokenC::create();
      $cmd = '\"'.$setStatus.'\'action=set&what=feed_status&feedid='.$feed_id.'&op=inc&status=+'.$status_step.'&token='.$end_token.'\' '.CHRIS_URL.'/api.php > '.$job_path_output.'/curlB.std 2> '.$job_path_output.'/curlB.err;\"';
      $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $username.'@'.$tunnel_host . ' '.$cmd;
      $sshLocal->exec('echo "'.$cmd.'" >> '.$runfile);
    }

    $crun_str = joinPaths(CLUSTER_CHRIS_SRC,'lib/_common/crun.py');
    $crun_str = $crun_str . ' -u ' . $username . ' --host ' . $cluster_internal_host . ' -s ' . CLUSTER_TYPE . ' --saveJobID ' . $cluster_job_path_output;
    $cluster_command = 'nohup /bin/bash -c " source ' . $envfile . ' && ' . $crun_str . ' -c \'\\\'\' /bin/bash ' . $runfile . ' \'\\\'\' "  </dev/null &>/dev/null &';
    $pid = $sshCluster->exec(bash($cluster_command));
  }

*/
  // attach pid to feed
  $metaObject = new Meta();
  $metaObject->name = "pid";
  $metaObject->value = $pid;
  FeedC::addMeta($feed_id, Array(0 => $metaObject));

  echo $feed_id;
  ?>
