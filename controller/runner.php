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
// prevent direct calls
if (!defined('__CHRIS_ENTRY_POINT__')) die('Invalid access.');

/**
 * Runner class. Provides all the common functionnalities for a runner.
 * A runner is an object that can run a job in a given location given a set of inputs.
 */
class Runner{

  // directory where we store/retrive the job on the server
  // it contains a _chrisRun_ directory
  public $path = '';
  // directory where we run the job (local or remote)
  // it contains a _chrisRun_ directory
  public $runtimePath = '';
  // array containing of the parts of the command
  // ['plugin_executable', '--input', 'inputvalue', '-output', 'outputvalue', ....]
  public $pluginCommandArray = null;
  public $userId = -1;
  public $groupId = -1;
  public $username = '';
  public $feedId = -1;
  public $status = -1;
  public $statusStep = -1;
  public $pid = -1;

  /**
   * Create the default chris.env file in the $path
   */
  public function createEnv(){

    $envfile = joinPaths($this->path, '_chrisRun_', 'chris.env');

    shell_exec('sudo su '.$this->username.' -c "echo \'export ENV_CHRISRUN_DIR='.$this->runtimePath.'/_chrisRun_\' >> '.$envfile.'"');
    shell_exec('sudo su '.$this->username.' -c "echo \'export ENV_CLUSTERTYPE='.CLUSTER_TYPE.'\' >> '.$envfile.'"');
    // add python libraries that might be missing on the cluster
    // no plugin-specific library should be there
    shell_exec('sudo su '.$this->username.' -c "echo \'export PYTHONPATH='.joinPaths(CLUSTER_CHRIS, 'lib', 'py').':\$PYTHONPATH\' >> '.$envfile.'"');
    // add ChRIS binaries/libraries that are needed by the plugins
    shell_exec('sudo su '.$this->username.' -c "echo \'export PATH='.joinPaths(CLUSTER_CHRIS, 'bin').':\$PATH\' >> '.$envfile.'"');
    shell_exec('sudo su '.$this->username.' -c "echo \'export LD_LIBRARY_PATH='.joinPaths(CLUSTER_CHRIS, 'lib').':\$LD_LIBRARY_PATH\' >> '.$envfile.'"');
    shell_exec('sudo su '.$this->username.' -c "echo \'umask 0002\' >> '.$envfile.'"');
    // make sure to update the permissions of the file
    shell_exec('sudo su '.$this->username.' -c "chmod 644 '.$envfile.'"');
  }

  /**
   * Create the default chris.run file in the $path
   * buildCommand might have to be overloaded if you need to tweek the command.
   * in the separated FS, it also copies data. This should NOT be happenning. Copy should happen in the chris.run.
   */
  public function createRun(){

    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');

    // 1- log HOSTNAME and time
    shell_exec('sudo su '.$this->username.' -c "echo \'echo \"\'\'\$(date) Running on \$HOSTNAME\'\'\" > '.$this->runtimePath.'/_chrisRun_/chris.std\' >> '.$runfile.'"');

    // 2- source the environment
    shell_exec('sudo su '.$this->username.' -c "echo \'source '.$this->runtimePath.'/_chrisRun_/chris.env;\' >> '.$runfile.'"');

    // 3- RUN command, need some work!
    $command = $this->buildCommand();
    $command = preg_replace('/ "/', '"\'', $command);
    $command = preg_replace('/" /', '\'"', $command);
    $command = preg_replace('/\n/', '', $command);
    shell_exec('sudo su '.$this->username.' -c "echo \''.$command.' >> '.$this->runtimePath.'/_chrisRun_/chris.std 2> '.$this->runtimePath.'/_chrisRun_/chris.err\' >> '.$runfile.'"');

    // 4- update permission after plugin ran
    // to be tested to make sure this is enough
    // needs a bash wrapper for consistency
    shell_exec('sudo su '.$this->username.' -c "echo \'chmod 755 '.$this->runtimePath.'; cd '.$this->runtimePath.' ; find . -type d -exec chmod o+rx,g+rx {} \; ; find . -type f -exec chmod o+r,g+r {} \;\' >> '.$runfile.'"');
    // also update permissions of parent directory. it is useful in case the directory containing the runpath was creating with incorrect permissions
    shell_exec('sudo su '.$this->username.' -c "echo \'chmod g+rx,o+rx '.$this->runtimePath.'/..\' >> '.$runfile.'"');

    // make sure to update the permissions of the file
    shell_exec('sudo su '.$this->username.' -c "chmod 755 '.$runfile.'"');
  }

  /**
   * Return the command to be executed to actually run the job.
   */
   public function buildCommand(){

    $executable = $this->pluginCommandArray[0];

    $pluginParametersArray = $this->pluginCommandArray;
    array_shift($pluginParametersArray);

    // update output location to runtime path
    $outputKey = array_search('--output', $pluginParametersArray);
    if($outputKey !== false){
      $pluginParametersArray[$outputKey + 1] = $this->runtimePath;
    }

    // update all inputs location to somthing within the _chrisInput_ directory
    // in the chris.run, the first step will be to copy the _chrisInput_ directory over to the remote location
    $inputOptions = shell_exec($executable.' --inputs');
    $inputOptions = preg_replace('/\n/', '', $inputOptions);
    $inputOptions = shell_exec($executable.' --inputs');
    $inputOptions = trim(preg_replace('/\s+/', ' ', $inputOptions));
    $inputOptionsArray = explode(',', $inputOptions);
    foreach ($inputOptionsArray as $in) {
      $inputKey = array_search($in, $pluginParametersArray);
      // if we find match and if match not empty
      if($inputKey !== false && $in != ''){
        $valueKey = $inputKey + 1;
        $value = $pluginParametersArray[$valueKey];
        $value = rtrim($value, "/");
	$localValue = joinPaths($this->path, '_chrisInput_', $value);
        shell_exec('sudo su '.$this->username.' -c "umask 002; mkdir -p '.dirname($localValue) .'; cp -rn '.$value.' '.$localValue.'"');
	$pluginParametersArray[$valueKey] = joinPaths($this->runtimePath, '_chrisInput_', $value);
      }
    }

    // update executable location to something accessible on the remote location
    $executableArray = explode( '/' , $executable);
    $executableName = end($executableArray);
    $executable = joinPaths(CHRIS_HOME, CHRIS_SRC, 'plugins/', $executableName, '/', $executableName);

    $parameters = implode(' ', $pluginParametersArray);
    // return new command
    return $executable . ' ' . $parameters;
  }

  /**
   * Prepare the system before running. In general nothing has to be done.
   * On a separated FS for instance, we have to copy the chris.run to the cluster before actually running.
   */
  public function prepare(){
    // does nothing, to be overloaded in childrens...
  }

  /**
   * Command to run the job. Schedule it, run it in bash, etc.
   */
  public function run(){
    // does nothing, to be overloaded in childrens...
  }
}

/**
 * Runner running on the local server.
 */
class ServerRunner extends Runner{

  public function run(){
    // run the job in plain bash
    $runfile = joinPaths($this->runtimePath, '_chrisRun_', 'chris.run');

    $command = "umask 0002;/bin/bash $runfile;";
    $nohup_wrap = 'bash -c \'nohup bash -c \"'.$command.'\" > /dev/null 2>&1& printf $!\'';
    $this->pid = shell_exec('sudo su '.$this->username.' -c "'.$nohup_wrap.'"');
    shell_exec('sudo su '.$this->username.' -c "echo ' . $this->pid . ' > '.$this->path.'/_chrisRun_/' . $this->pid  . '.immediate.joblist"');
  }

}

/**
 *  Runs on local server as chris.
 *  See https://github.com/FNNDSC/chrisreloaded/wiki/JobSubmission#local
 */
class LocalRunner extends ServerRunner{

  public function prepare(){
    // we copy the _chrisRun_ directory to the runtime path before running.
    mkdir($this->runtimePath, 0755, true);
    shell_exec("cp -R " . rtrim($this->path, "/") . "/* " . $this->runtimePath);
  }

  public  function createRun(){

    parent::createRun();

    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');

    // run the viewer plugin to generate the JSON scene
    $viewer_plugin = CHRIS_PLUGINS_FOLDER.'/viewer/viewer';
    shell_exec('sudo su '.$this->username.' -c "echo \'sudo chown -R '.$this->userId.':'.$this->groupId.' '.$this->runtimePath.';\' >> '.$runfile.';"');
    shell_exec('sudo su '.$this->username.' -c "echo \'sudo su '.$this->username.' -c \"cp -rfp '.$this->runtimePath.'/* '.$this->path.'\"\' >> '.$runfile.'"');
    shell_exec('sudo su '.$this->username.' -c "echo \'sudo su '.$this->username.' -c \"'.$viewer_plugin.' --directory '.$this->path.' --output '.$this->path.'/..\"\' >> '.$runfile.'"');
    $executable = $this->pluginCommandArray[0];
    /*if( substr($executable, -9) == 'pacs_pull'){
      $pluginViewerIndex = CHRIS_PLUGINS_FOLDER.'/pacs_pull/viewer/index.html';
      $this->ssh->exec("echo 'sudo su $this->username -c \"cp $pluginViewerIndex $this->path/..\";' >> $runfile;");
      $this->ssh->exec("echo 'sudo su $this->username -c \"sed -i s/\\\\\\\${FEEDID}/$this->feedId/g $this->path/../index.html\";' >> $runfile;");
      $chris_rel_path = str_replace(CHRIS_USERS, "/", $this->path);
      $chris_rel_path_escaped  = str_replace("/", "\\\\\\\/", $chris_rel_path."/..");
      $this->ssh->exec("echo 'sudo su $this->username -c \"sed -i s/\\\\\\\${FEEDDIR}/$chris_rel_path_escaped/g $this->path/../index.html\";' >> $runfile;");
    }
     */
    // rm job_path directory
    shell_exec('sudo su '.$this->username.' -c "echo \'sudo rm -rf '.$this->runtimePath.';\' >> '.$runfile.'"');

    // status update if needed
    // if a job is local and immediate, we run it as local to ensure it works
    $setStatus = '/usr/bin/curl --retry 5 --retry-delay 5 --connect-timeout 5 --max-time 30 -v -k --data ';
    // update status to 100%
    if($this->status != 100){
      // prepend
      $startToken = TokenC::create();
      // create curlA.sh
      shell_exec('sudo su '.$this->username.' -c "echo \'#!/bin/bash\' > '.$this->path.'/_chrisRun_/curlA.run"');
      shell_exec('sudo su '.$this->username.' -c "echo \''.$setStatus.'\"action=set&what=feed_status&feedid='.$this->feedId.'&op=set&status=1&token='.$startToken.'\" '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curlA.std 2> '.$this->path.'/_chrisRun_/curlA.err\' > '.$this->path.'/_chrisRun_/curlA.run"');
      shell_exec('sudo su '.$this->username.' -c "sed -i \'1i sudo su '.$this->username.' -c \"bash '.$this->path.'/_chrisRun_/curlA.run\"\' '.$runfile.';"');

      // append
      // we need sudo su to run it at the right location after the data has been copied back
      $endToken = TokenC::create();
      shell_exec('sudo su '.$this->username.' -c "echo \'#!/bin/bash\' > '.$this->path.'/_chrisRun_/curlB.run"');
      shell_exec('sudo su '.$this->username.' -c "echo \''.$setStatus.'\"action=set&what=feed_status&feedid='.$this->feedId.'&op=set&status=+'.$this->statusStep.'&token='.$startToken.'\" '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curlB.std 2> '.$this->path.'/_chrisRun_/curlB.err\' > '.$this->path.'/_chrisRun_/curlB.run"');
      shell_exec('sudo su '.$this->username.' -c "sed -i \'1i sudo su '.$this->username.' -c \"bash '.$this->path.'/_chrisRun_/curlB.run\"\' '.$runfile.';"');
    }   
  }

  public function run(){
    // run the job in plain bash
    $runfile = joinPaths($this->runtimePath, '_chrisRun_', 'chris.run');

    $command = "umask 0002;/bin/bash $runfile;";
    $nohup_wrap = 'bash -c \'nohup bash -c "'.$command.'" > /dev/null 2>&1& printf $!;\'';
    $this->pid = shell_exec($nohup_wrap);
    shell_exec('sudo su '.$this->username.' -c "echo '.$this->pid.' > '.$this->path.'/_chrisRun_/'.$this->pid .'.local.joblist"');
  }

}

/**
 *  Runs on local server as user.
 *  See https://github.com/FNNDSC/chrisreloaded/wiki/JobSubmission#immediate
 */
class ImmediateRunner extends ServerRunner{
  function createRun(){

    parent::createRun();

    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');

    // run the viewer plugin to generate the JSON scene
    $viewer_plugin = CHRIS_PLUGINS_FOLDER.'/viewer/viewer';
    shell_exec('sudo su '.$this->username.' -c "echo \''.$viewer_plugin.' --directory '.$this->path.' --output '.$this->path.'/..;\' >> '.$runfile.'"');
  }
}

/**
 * Runner running off a remote location
 */
class RemoteRunner extends Runner{
  public $remoteHost = '';
  public $remoteUser = '';
  public $remoteSsh = '';

  public function createEnv(){

    parent::createEnv();
    $envfile = joinPaths($this->path, '_chrisRun_', 'chris.env');

    shell_exec('sudo su '.$this->username.' -c "echo \'export ENV_REMOTEHOST='.$this->remoteHost.'\' >> '.$envfile.'"');
    shell_exec('sudo su '.$this->username.' -c "echo \'export ENV_REMOTEUSER='.$this->remoteUser.'\' >> '.$envfile.'"');
  }
  public  function createRun(){
    
    parent::createRun();
    
    $envfile = joinPaths($this->runtimePath, '_chrisRun_', 'chris.env');
    $runfile = joinPaths($this->runtimePath, '_chrisRun_', 'chris.run');
    $tunnel_host = $this->remoteHost;
    
    $crunWrap = joinPaths(CLUSTER_CHRIS, CHRIS_SRC, 'lib/_common/crun.py');
    $crunWrap = $crunWrap . ' -u ' . $this->remoteUser . ' --out ' . $this->runtimePath . '/_chrisRun_ --err '. $this->runtimePath . '/_chrisRun_ --host ' . $tunnel_host . ' -s ' . CLUSTER_TYPE . ' --saveJobID ' . $this->runtimePath . '/_chrisRun_';
    
    shell_exec('sudo su '.$this->username.' -c "echo \'#!/bin/bash\' >> '.$this->path.'/_chrisRun_/chris.schedule.run"');
    shell_exec('sudo su '.$this->username.' -c "echo \'source '.$envfile.';\' >> '.$this->path.'/_chrisRun_/chris.schedule.run"');
    shell_exec('sudo su '.$this->username.' -c "echo \''.$crunWrap.' -c \"/bin/bash '.$runfile.'\";\' >> '.$this->path.'/_chrisRun_/chris.schedule.run"');
    shell_exec('sudo su '.$this->username.' -c "chmod 755 '.$this->path.'/_chrisRun_/chris.schedule.run"');
  
  }
  public function run(){

    $pid = -1;
    
    if(CHRIS_CLUSTER_USER != "self" && CLUSTER_SHARED_FS == false){
      $cmd = 'nohup /bin/bash ' . $this->runtimePath.'/_chrisRun_/chris.schedule.run'  . ' </dev/null &>/dev/null &';
      $pid = shell_exec('sudo su '.CHRIS_CLUSTER_USER.' -c " ssh -p ' .SERVER_TO_CLUSTER_PORT. ' ' . SERVER_TO_CLUSTER_HOST . ' \' '. $cmd .' \'"');
    }else{
      $cmd = 'nohup /bin/bash ' . $this->path.'/_chrisRun_/chris.schedule.run'  . ' </dev/null &>/dev/null &';
      $pid = $this->remoteSsh->exec($cmd);
    }
  }
}

/**
 * Runs on a remote cluster, with a separated file system
 * See https://github.com/FNNDSC/chrisreloaded/wiki/JobSubmission#separated
 */
class SeparatedRunner extends RemoteRunner{
  /**
  * Tweeks are:
  * -L option in the copy command
  * executable location
  */
  public function buildCommand(){

    $executable = $this->pluginCommandArray[0];

    $pluginParametersArray = $this->pluginCommandArray;
    array_shift($pluginParametersArray);

    // update output location to runtime path
    $outputKey = array_search('--output', $pluginParametersArray);
    if($outputKey !== false){
      $pluginParametersArray[$outputKey + 1] = $this->runtimePath;
    }

    // update all inputs location to somthing within the _chrisInput_ directory
    // in the chris.run, the first step will be to copy the _chrisInput_ directory over to the remote location
    $inputOptions = shell_exec($executable.' --inputs');
    $inputOptions = trim(preg_replace('/\s+/', ' ', $inputOptions));
    $inputOptionsArray = explode(',', $inputOptions);
    foreach ($inputOptionsArray as $in) {
      $inputKey = array_search($in, $pluginParametersArray);
      // if we find match and if match not empty
      if($inputKey !== false && $in != ''){
        $valueKey = $inputKey + 1;
        $value = $pluginParametersArray[$valueKey];
        $value = rtrim($value, "/");
	$localValue = joinPaths($this->path, '_chrisInput_', $value);
        shell_exec('sudo su '.$this->username.' -c "umask 002; mkdir -p '.dirname($localValue).'; cp -rn '.$value.' '.$localValue.'"');
        shell_exec('sudo su '.$this->username.' -c "umask 002; mkdir -p '.dirname($localValue).'; cp -Lrn '.$value.' '.$localValue.'"');
	$pluginParametersArray[$valueKey] = joinPaths($this->runtimePath, '_chrisInput_', $value);
      }
    }

    // update executable location to something accessible on the remote location
    $executableArray = explode( '/' , $executable);
    $executableName = end($executableArray);
    $executable = joinPaths(CLUSTER_CHRIS, CHRIS_SRC, 'plugins/', $executableName, '/', $executableName);

    $parameters = implode(' ', $pluginParametersArray);
    // return new command
    return $executable . ' ' . $parameters;
  }

  public function createRun(){

    parent::createRun();
    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');

    // get the contents of chris.run
    $runfile_str = file_get_contents($runfile);
    //
    // MOVE DATA ($chrisInputDirectory) FROM SERVER TO CLUSTER
    //

    if (CLUSTER_TO_SERVER_PORT==22) {
      $tunnel_host = CLUSTER_TO_SERVER_HOST;
    } else {
      $tunnel_host = $this->remoteHost;
    }
    
    // command to compress _chrisInput_ dir on the chris server
    $cmd = "";
    if(CHRIS_CLUSTER_USER == "self"){
      $cmd = 'umask 002;cd '.$this->path.'; tar -zcf _chrisInput_.tar.gz _chrisInput_;';
    }else{
      $cmd = 'sudo su '.$this->username.' -c \\\\\"umask 002;cd '.$this->path.'; tar -zcf _chrisInput_.tar.gz _chrisInput_;\\\\\"';
    }
    $cmd = 'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -p ' .CLUSTER_TO_SERVER_PORT. ' -o StrictHostKeyChecking=no ' . $this->remoteUser.'@'.$tunnel_host. ' \''.$cmd.'\' >> ' .$this->runtimePath.'/_chrisRun_/chris.std 2> ' .$this->runtimePath. '/_chrisRun_/chris.err';

    // command to copy over the compressed _chrisIput_ dir to the cluster
    $cmd = $cmd.PHP_EOL.'scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -P ' .CLUSTER_TO_SERVER_PORT. ' ' . $this->remoteUser.'@'.$tunnel_host.':'.$this->path.'/_chrisInput_.tar.gz ' .$this->runtimePath.' >> ' .$this->runtimePath.'/_chrisRun_/chris.std 2> ' .$this->runtimePath. '/_chrisRun_/chris.err;';

    // command to remove the compressed file on the chris server
    $tmpcmd = "";
    if(CHRIS_CLUSTER_USER == "self"){
      $tmpcmd = 'rm '.$this->path.'/_chrisInput_.tar.gz';
    }else{
      $tmpcmd = 'sudo su '.$this->username.' -c \\\\\"rm '.$this->path.'/_chrisInput_.tar.gz\\\\\"';
    }
    $cmd = $cmd.PHP_EOL.'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -p ' .CLUSTER_TO_SERVER_PORT. ' ' . $this->remoteUser.'@'.$tunnel_host . ' \''.$tmpcmd.'\' >> ' .$this->runtimePath.'/_chrisRun_/chris.std 2> ' .$this->runtimePath. '/_chrisRun_/chris.err;';

    // command to uncompress the compressed file on the cluster
    $cmd = $cmd.PHP_EOL.'cd '.$this->runtimePath.'; tar -zxf _chrisInput_.tar.gz;';

    // command to remove the compressed file from the cluster
    $cmd = $cmd.PHP_EOL.'cd '.$this->runtimePath.'; rm _chrisInput_.tar.gz;';

    //
    // MOVE DATA ($job_path directory) FROM CLUSTER TO SERVER
    //

    // command to compress $cluster_job_path dir on the cluster (excluding _chrisInput_ dir)
    $data = basename($this->runtimePath);
    $cmd2 = 'umask 002; cd '.$this->runtimePath.'/..; tar -zcf '.$data.'.tar.gz '.$data.' --exclude ' . $this->runtimePath. '/_chrisInput_;';

    // command to copy over the compressed $cluster_job_path dir to the chris server
    $tmpcmd = 'scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -P ' .CLUSTER_TO_SERVER_PORT. ' ' . $this->runtimePath.'/../'.$data.'.tar.gz ' . $this->remoteUser.'@'.$tunnel_host.':'.CHRIS_TMP.'  >> ' .$this->runtimePath.'/_chrisRun_/chris.std 2> ' .$this->runtimePath. '/_chrisRun_/chris.err;';
    $cmd2 .= PHP_EOL.$tmpcmd;

    // command to uncompress and remove the compressed file on the chris server
    if(CHRIS_CLUSTER_USER == "self"){
      $tmpcmd = 'umask 002; cd '.CHRIS_TMP.'; tar -zxf '.$data.'.tar.gz -C '.$this->path.'/..; cd '.CHRIS_TMP.';rm '.$data.'.tar.gz;';
    }else{
      $tmpcmd = 'sudo su '.$this->username.' -c \\\\\" umask 002; cd '.CHRIS_TMP.'; tar -zxf '.$data.'.tar.gz -C '.$this->path.'/..;\\\\\"; cd '.CHRIS_TMP.';rm '.$data.'.tar.gz;';
    }
    $cmd2 .= PHP_EOL.'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -p ' .CLUSTER_TO_SERVER_PORT. ' ' . $this->remoteUser.'@'.$tunnel_host . ' \''.$tmpcmd.'\'  >> ' .$this->runtimePath.'/_chrisRun_/chris.std 2> ' .$this->runtimePath. '/_chrisRun_/chris.err';

    // command to remove the compressed file from the cluster
    $cmd2 .= PHP_EOL.'rm '.$this->runtimePath.'.tar.gz &';

    //
    // CREATE VIEWER SCENE
    //

    $viewer_plugin = CHRIS_PLUGINS_FOLDER.'/viewer/viewer';
    $tmpcmd = "";
    if(CHRIS_CLUSTER_USER == "self"){
      $tmpcmd = 'umask 002; '.$viewer_plugin.' --directory '.$this->path.' --output '.$this->path.'/..;';
    }else{
      $tmpcmd = 'sudo su '.$this->username.' -c \\\\\"umask 002; '.$viewer_plugin.' --directory '.$this->path.' --output '.$this->path.'/..;\\\\\"';
    }
    $cmd2 .= PHP_EOL.'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -p ' .CLUSTER_TO_SERVER_PORT. ' ' .$this->remoteUser.'@'.$tunnel_host . ' \''.$tmpcmd.'\'  >> ' .$this->runtimePath.'/_chrisRun_/chris.std 2> ' .$this->runtimePath. '/_chrisRun_/chris.err';
    
    // SHOULD WE CALL THAT FROM CHRIS>RUN OR BEFORE SCHEDULING THE JOB?
    // might not be able to sudo su from CHRIS_CLUSTER_USER to $username
    //ANONYMIZATION
    if (ANONYMIZE_DICOM) {
      $anonfile = joinPaths($this->path, '_chrisRun_', 'chris.anon');
      // copy template over
      shell_exec('sudo su '.$this->username.' -c "cp '.joinPaths(CHRIS_HOME, CHRIS_SRC, "controller/anonymize.php").' '.$anonfile.'"');
      // update template content
      $chrisInput_path_escaped  = str_replace("/", "\/", $this->path.'/_chrisInput_');
      shell_exec('sudo su '.$this->username.' -c "sed -i \'s/\${CHRISINPUT_PATH}/'.$chrisInput_path_escaped.'/g\' '.$anonfile.'"');

      $chris_bin = joinPaths(CHRIS_HOME, "bin");
      $chris_bin_escaped  = str_replace("/", "\/", $chris_bin);
      shell_exec('sudo su '.$this->username.' -c "sed -i \'s/\${CHRIS_BIN}/'.$chris_bin_escaped.'/g\' '.$anonfile.'"');

      $chris_freesurfer_escaped = str_replace("/", "\/", CHRIS_ENV_FREESURFER);
      shell_exec('sudo su '.$this->username.' -c "sed -i \'s/\${CHRIS_FREESURFER}/'.$chris_freesurfer_escaped.'/g\' '.$anonfile.'"');

      $chris_scripts = joinPaths(CHRIS_HOME, "src", "scripts");
      $chris_scripts_escaped  = str_replace("/", "\/", $chris_scripts);
      shell_exec('sudo su '.$this->username.' -c "sed -i \'s/\${CHRIS_SCRIPTS}/'.$chris_scripts_escaped.'/g\' '.$anonfile.'"');
      shell_exec('sudo su '.$this->username.' -c "chmod 755 '.$anonfile.'"');
     
      if(CHRIS_CLUSTER_USER == "self"){
        $tmpcmd = 'php '.$anonfile.';';
      }else{
        $tmpcmd = 'sudo su '.$this->username.' -c \\\\\"php '.$anonfile.';\\\\\"';
      }

      $anoncmd = "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -p " .CLUSTER_TO_SERVER_PORT. " $this->remoteUser@$tunnel_host \'$tmpcmd\' >> $this->runtimePath/_chrisRun_/chris.std 2> $this->runtimePath/_chrisRun_/chris.err";
      $cmd = $anoncmd.PHP_EOL.$cmd;
    }
    //
    // UPDATE FEED STATUS
    //
    $setStatus = '/usr/bin/curl --retry 5 --retry-delay 5 --connect-timeout 5 --max-time 30 -v -k --data ';

    // prepend
    $startToken = TokenC::create();
    // create curlA.sh
    shell_exec('sudo su '.$this->username.' -c "echo \'#!/bin/bash\' > '.$this->path.'/_chrisRun_/curl.start.run"');
    shell_exec('sudo su '.$this->username.' -c "echo \''.$setStatus.'\"action=set&what=feed_status&feedid='.$this->feedId.'&op=set&status=1&token='.$startToken.'\" '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curl.start.std 2> '.$this->path.'/_chrisRun_/curl.start.err\' >> '.$this->path.'/_chrisRun_/curl.start.run"');
    shell_exec('sudo su '.$this->username.' -c "chmod 755 '.$this->path.'/_chrisRun_/curl.start.run"');
    $tmpcmd = "";
    if(CHRIS_CLUSTER_USER == "self"){
      $tmpcmd = 'bash '.$this->path.'/_chrisRun_/curl.start.run;';
    }else{
      $tmpcmd = 'sudo su '.$this->username.' -c \\\\\"bash '.$this->path.'/_chrisRun_/curl.start.run;\\\\\"';
    }
    $curlstartcmd = "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -p ".CLUSTER_TO_SERVER_PORT." $this->remoteUser@$tunnel_host \'$tmpcmd\'";
    $cmd = $curlstartcmd.PHP_EOL.$cmd;
    
    // append
    // we need sudo su to run it at the right location after the data has been copied back
    $endToken = TokenC::create();
    shell_exec('sudo su '.$this->username.' -c "echo \'#!/bin/bash\' > '.$this->path.'/_chrisRun_/curl.stop.run"');
    shell_exec('sudo su '.$this->username.' -c "echo \''.$setStatus.'\"action=set&what=feed_status&feedid='.$this->feedId.'&op=set&status=+'.$this->statusStep.'&token='.$endToken.'\" '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curl.stop.std 2> '.$this->path.'/_chrisRun_/curl.stop.err\' >> '.$this->path.'/_chrisRun_/curl.stop.run"');
    shell_exec('sudo su '.$this->username.' -c "chmod 755 '.$this->path.'/_chrisRun_/curl.stop.run"');
    $tmpcmd = "";
    if(CHRIS_CLUSTER_USER == "self"){
      $tmpcmd = 'bash '.$this->path.'/_chrisRun_/curl.stop.run;';
    }else{
      $tmpcmd = 'sudo su '.$this->username.' -c \\\\\"bash '.$this->path.'/_chrisRun_/curl.stop.run;\\\\\"';
    }
    $curlstopcmd = "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -p " .CLUSTER_TO_SERVER_PORT. " $this->remoteUser@$tunnel_host \'$tmpcmd\'";
    $cmd2 .= PHP_EOL.$curlstopcmd;

    ////
    // DELETE REMOTE JOB PATH AFTER ALL THE DATA AS BEEN COPIED BACK
    /////
    // DO IF AFTER, if not can not test separated FS on shared FS
    $cmd2 .= PHP_EOL.'rm -rf '.$this->runtimePath.' &';

    shell_exec('sudo su '.$this->username.' -c "cp '.$runfile.' '.$runfile.'.tmp"');
    shell_exec('sudo su '.$this->username.' -c "printf \"'.$cmd.'\" > '.$runfile.'"');
    shell_exec('sudo su '.$this->username.' -c "cat '.$runfile.'.tmp >> '.$runfile.'"');
    shell_exec('sudo su '.$this->username.' -c "rm '.$runfile.'.tmp"');
    shell_exec('sudo su '.$this->username.' -c "printf \"'.$cmd2.'\" >> '.$runfile.'"');
    shell_exec('sudo su '.$this->username.' -c "chmod 755 '.$runfile.'"');
  }

  public function prepare(){
    // create a script, then run it a remoteUser
    $chrisRun = joinPaths($this->runtimePath, '_chrisRun_');
    $chrisRunLocal = joinPaths($this->path, '_chrisRun_');
    $chrisRunFiles = $chrisRunLocal.'/*';
    // move env file to the cluster
    $preparefile = $this->path.'/_chrisRun_/chris.prepare.run';

    shell_exec('sudo su '.$this->username.' -c "echo \'#!/bin/bash\' > '.$preparefile.'"');
    shell_exec('sudo su '.$this->username.' -c "echo \'ssh -p ' .SERVER_TO_CLUSTER_PORT. ' ' . SERVER_TO_CLUSTER_HOST . ' \"umask 022; mkdir -p '.$chrisRun.'\"\' >> '.$preparefile.'"');
    shell_exec('sudo su '.$this->username.' -c "echo \'ssh -p ' .SERVER_TO_CLUSTER_PORT. ' ' . SERVER_TO_CLUSTER_HOST . ' \"scp -P '.CLUSTER_TO_SERVER_PORT.' '. CLUSTER_TO_SERVER_HOST.':'.$chrisRunFiles.' '.$chrisRun.'\"\' >> '.$preparefile.'"');
    shell_exec('sudo su '.$this->username.' -c "chmod 755 '.$preparefile.'"');
    
    // append how we will run this script
    //shell_exec('sudo su '.$this->username.' -c "echo \'# shell_exec\n# sudo su '.$this->remoteUser.' -c \"bash '.$preparefile.'\"\n#\' >> '.$preparefile.'"');

    shell_exec('sudo su '.$this->remoteUser.' -c "bash '.$preparefile.'"');
  }

}

/**
 * Runs on a remote cluster, with a shared file system
 * See https://github.com/FNNDSC/chrisreloaded/wiki/JobSubmission#shared
 */
class SharedRunner extends RemoteRunner{

  public function createRun(){

    parent::createRun();

    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');

    $viewer_plugin = CHRIS_PLUGINS_FOLDER.'/viewer/viewer';
    shell_exec('sudo su '.$this->username.' -c "echo \''.$viewer_plugin.' --directory '.$this->path.' --output '.$this->path.'/..;\' >> '.$runfile.';');

    if (CLUSTER_TO_SERVER_PORT==22) {
      $tunnel_host = CLUSTER_TO_SERVER_HOST;
    } else {
      $tunnel_host = $this->remoteHost;
    }

    // update status
    $setStatus = '/usr/bin/curl --retry 5 --retry-delay 5 --connect-timeout 5 --max-time 30 -v -k --data ';
    
    // prepend
    $startToken = TokenC::create();
    // create curlA.sh
    shell_exec('sudo su '.$this->username.' -c "echo \'#!/bin/bash\' > '.$this->path.'/_chrisRun_/curlA.run"');
    shell_exec('sudo su '.$this->username.' -c "echo \''.$setStatus.'\"action=set&what=feed_status&feedid='.$this->feedId.'&op=set&status=1&token='.$startToken.'\" '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curlA.std 2> '.$this->path.'/_chrisRun_/curlA.err\' >> '.$this->path.'/_chrisRun_/curlA.run"');
    shell_exec('sudo su '.$this->username.' -c "sed -i \'1i ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -p '.CLUSTER_TO_SERVER_PORT.' '.$this->username.'@'.$tunnel_host.' \"bash '.$this->path.'/_chrisRun_/curlA.run\"\' '.$runfile.';');

    // append
    // we need sudo su to run it at the right location after the data has been copied back
    $endToken = TokenC::create();
    shell_exec('sudo su '.$this->username.' -c "echo \'#!/bin/bash\' > '.$this->path.'/_chrisRun_/curlB.run"');
    shell_exec('sudo su '.$this->username.' -c "echo \''.$setStatus.'\"action=set&what=feed_status&feedid='.$this->feedId.'&op=set&status=+'.$this->statusStep.'&token='.$endToken.'\" '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curlB.std 2> '.$this->path.'/_chrisRun_/curlB.err\' >> '.$this->path.'/_chrisRun_/curlB.run"');
    shell_exec('sudo su '.$this->username.' -c "echo \'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -p '.CLUSTER_TO_SERVER_PORT.' '.$this->username.'@'.$tunnel_host.' \"bash '.$this->path.'/_chrisRun_/curlB.run\"\' >> '.$runfile.';');
  } 
}


?>
