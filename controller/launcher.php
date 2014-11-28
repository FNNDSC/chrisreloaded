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

// append the log files to the command
$command .= ' >> '.$job_path_output.'/chris.std 2> '.$job_path_output.'/chris.err';



//
//
//
// create the file containing the chris env variables which are required by the plugin
// and fill it
//
// localChris:
// - $path == /tmp/....
// - $remoteHost == null
// - $remoteUser == null
//
// immediate:
// - $path == /neuro/....
// - $remoteHost == null
// - $remoteUser == null
//
// separated:
// - $path == /cluster/....
// - $remoteHost == login02
// - $remoteUser == rpienaar
//
// shared:
// - $path == /neuro/....
// - $remoteHost == login02
// - $remoteUser == rpienaar
//
//
//

function createChrisEnv(&$ssh, $path, $runtimePath = '',  $remoteHost = null, $remoteUser = null) {
  $envfile = joinPaths($path, '_chrisRun', 'chris.env');
  if($runtimePath == ''){
    $runtimePath = $path;
  }

  $ssh->exec(bash('echo "export ENV_CHRISRUN_DIR='.$runtimePath.'/_chrisRun_" >>  '.$envfile));
  $ssh->exec(bash('echo "export ENV_CLUSTERTYPE='.CLUSTER_TYPE.'" >>  '.$envfile));
  if($remoteHost != null){
    $ssh->exec(bash('echo "export ENV_REMOTEHOST='.$remoteHost.'" >>  '.$envfile));
  }
  if($remoteHost != null){
    $ssh->exec(bash('echo "export ENV_REMOTEUSER='.$remoteUser.'" >>  '.$envfile));
  }
  // add python libraries that might be missing on the cluster
  // no plugin-specific library should be there
  $ssh->exec(bash('echo "export PYTHONPATH='.joinPaths(CLUSTER_CHRIS, 'lib', 'py').':\$PYTHONPATH" >>  '.$envfile));
  // add ChRIS binaries/libraries that are needed by the plugins
  $ssh->exec(bash('echo "export PATH='.joinPaths(CLUSTER_CHRIS, 'bin').':\$PATH" >>  '.$envfile));
  $ssh->exec(bash('echo "export LD_LIBRARY_PATH='.joinPaths(CLUSTER_CHRIS, 'lib').':\$LD_LIBRARY_PATH" >>  '.$envfile));
  $ssh->exec(bash('echo "umask 0002" >> '.$envfile));
  // make sure to update the permissions of the file
  $ssh->exec("chmod 644 $envfile");
}

// set remoteHost and $remoteUser if we want it to be created
//  if ($status != 100 && !$force_chris_local) {dd
//    $cluster_internal_host = $sshCluster->exec('hostname -s 2>/dev/null | tail -n 1');
//    $cluster_internal_host = trim($cluster_internal_host);
//createChrisEnv($sshLocal, $job_path_output);
// or
// createChrisEnv($sshLocal, $job_path_output, $remoteHost, $remoteUser);
//


function createCommand($jobType, $pluginCommandArray, $path, $runtimePath){

  $executable = $pluginCommandArray[0];
  array_shift($pluginCommandArray);
  $pluginParametersArray = $pluginCommandArray;

  // update output for localChris and separated
  if($jobType == 'localChris' || $jobType == 'separated'){
    $outputKey = array_search('output', $pluginParametersArray);
    if($outputKey !== false){
      $pluginParametersArray[$outputKey + 1] = $runtimePath;
    }
  }

  // all that should probably be in the chris.run
  //
  // update inputs for separated (use _chrisInput_)
  // also update location of plugin binary
  if($jobType == 'separated'){
    $inputOptions = $ssh->exec($executable.' --inputs');
    $inputOptions = trim(preg_replace('/\s+/', ' ', $inputOptions));
    $inputOptionsArray = explode(',', $inputOptions);
    foreach ($inputOptionsArray as $in) {
      $inputKey = array_search($in, $pluginParametersArray);
      if($inputKey !== false){
        $valueKey = $inputKey + 1;
        $value = $pluginCommandArray[$valueKey];
        $value = rtim($value, "/");
	$localValue = joinPaths($path, '_chrisInput_', $value);
        $ssh->exec('mkdir -p ' . $localValue  . '; cp -Lrn ' . $value . ' ' . $localValue);
	$pluginCommandArray[$valueKey] = joinPaths($runtimePath, '_chrisInput_', $value);
      }
    }

    // update executable location
    $executableArray = explode( '/' , $executable);
    $executableName = end($executableArray);
    $executable = joinPaths(CLUSTER_CHRIS, '/src/chrisrelaoded/plugin/', executableName, '/', executableName);
  }

  $parameters = implode(' ', $pluginParametersArray);

  // return new command
  return $executable . ' ' . $parameters;
}
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
// $path is directory containing _chrisRun_ and _chrisInput_

// DO EVERYTHING WITH LOCAL PATH to be able to write file and add ${REMOTEPATH}
function createChrisRun(&$ssh, $path, $runtimePath = '', $feedId, $status, $statusStep, $jobType, $username, $userId, $groupId, $pluginCommandArray){
  $runfile = joinPaths($path, '_chrisRun_', 'chris.run');
  if($runtimePath == ''){
    $runtimePath = $path;
  }

  // 1- log HOSTNAME and time
  $ssh->exec(bash('echo "echo \"\$(date) Running on \$HOSTNAME\" > '.$runtimePath.'/_chrisRun_/chris.std" >> '.$runfile));

  // 2- source the environment
  $ssh->exec(bash('echo "source '.$runtimePath . '/_chrisRun_/chris.env;" >> '.$runfile));

  // 3- RUN command, need some work!
  $command = createCommand($jobType, $pluginCommandArray, $path, $runtimePath);
  $ssh->exec(bash('echo "'.$command.'" >> '.$runfile));

  // 4- update permission after plugin ran
  // to be tested to make sure this is enough
  // needs a bash wrapper for consistency
  $ssh->exec("echo 'chmod 755 $runtimePath; cd $runtimePath ; find . -type d -exec chmod o+rx,g+rx {} \; ; find . -type f -exec chmod o+r,g+r {} \;' >> $runfile;");  
  $ssh->exec("chmod 755 $runfile");


  //
  // customize chris.run based on job type
  //
  //  $setStatus .= '/bin/sleep $(( RANDOM%=10 )) ; /usr/bin/curl --retry 5 --retry-delay 5 --connect-timeout 5 --max-time 30 -v -k --data ';
  $setStatus = '/usr/bin/curl -k --data ';

  //
  switch($jobType){
    case 'localChris':
      echo 'local custom';
      $ssh->exec("echo 'sudo chmod -R 755 $runtimePath;' >> $runfile;");
      $ssh->exec("echo 'sudo chown -R $userId:$groupId $runtimePath;' >> $runfile;");
      $ssh->exec("echo 'sudo su $username -c \"cp -rfp $runtimePath $path\";' >> $runfile;");
      $viewer_plugin = CHRIS_PLUGINS_FOLDER.'/viewer/viewer';
      $ssh->exec("echo 'sudo su $username  -c \"$viewer_plugin --directory $path --output $path/..\";' >> $runfile;");
      // rm job_path directory
      $ssh->exec("echo 'sudo rm -rf $runtimePath;' >> $runfile;");

      // update status to 100%
      if($status != 100){
        // prepend
        $startToken = TokenC::create();
        $ssh->exec('sed -i "1i sudo su '.$username.' -c \"'.$setStatus.'\'action=set&what=feed_status&feedid='.$feedId.'&op=set&status=1&token='.$startToken.'\' '.CHRIS_URL.'/api.php > '.$path.'/_chrisRun_/curlA.std 2> '.$path.'/_chrisRun_/curlA.err"\" '.$runfile);

        // append
        // we need sudo su to run it at the right location after the data has been copied back
        $endToken = TokenC::create();
        $ssh->exec('echo "sudo su '.$username.' -c \"'.$setStatus.'\'action=set&what=feed_status&feedid='.$feedId.'&op=inc&status=+'.$statusStep.'&token='.$endToken.'\' '.CHRIS_URL.'/api.php > '.$path.'/_chrisRun_/curlB.std 2> '.$path.'/_chrisRun_/curlB.err\"" >> '.$runfile);
      }
      
      break;
    case 'immediate':
      echo 'immediate';
      // nothing
      break;
    case 'shared':
      echo 'shared';
      // curl stuff
      // anonym
    case 'separated':
      echo 'separated';
      // scp
      // curl
      // anonym
    default:
      echo 'unknown $jobtype';
  }

}
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

    $groupID =  $sshLocal->exec("id -g");
    $groupID = trim($groupID);

    $runtimePath = str_replace($plugin_path, CHRIS_TMP, $job_path);

    // create chris.env in the /neuro/../_chrisRun-/
    createChrisEnv($sshLocal, $plugin_path, $runtimePath);

    // create chris.run in the /neuro/.../_chrisRun_/
    //function createChrisRun(&$ssh, $path, $runtimePath = '', $feedId, $status, $statusStep, $jobType, $username, $userId, $groupId, $pluginCommandArray){
    createChrisRun($sshLocal, $plugin_path, $runtimePath, $feed_id, $status, $status_step, $jobType, $username, $user_id, $groupID, $plugin_command_array);

    // copy things to runtimePath..
    //
    mkdir($runtimePath);
    // was feed_path...?
    // we trim last / just in case, to ensure we copy the right directory....
    shell_exec("cp -R " . rtim($job_path, "/") . " " . CHRIS_TMP);

    //run!
    $command = "/bin/bash umask 0002;/bin/bash $runfile;";
    $nohup_wrap = 'bash -c \'nohup bash -c "'.$command.'" > /dev/null 2>&1 &\'';
    shell_exec($nohup_wrap);
    $pid = -1;
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
