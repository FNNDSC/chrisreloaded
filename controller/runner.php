<?php

class Runner{
      
  public $shh = null;
  public $path = '';
  public $runtimePath = '';
  public $pluginCommandArray = null;
  public $userId = -1;
  public $groupId = -1;
  public $username = '';
  public $feedId = -1;
  public $status = -1;
  public $statusStep = -1;
  public $pid = -1;

  public function createEnv(){
      
    $envfile = joinPaths($this->path, '_chrisRun_', 'chris.env');

    if($this->runtimePath == ''){
      $this->runtimePath = $this->path;
    }

    $this->ssh->exec(bash('echo "export ENV_CHRISRUN_DIR='.$this->runtimePath.'/_chrisRun_" >>  '.$envfile));
    $this->ssh->exec(bash('echo "export ENV_CLUSTERTYPE='.CLUSTER_TYPE.'" >>  '.$envfile));
    // add python libraries that might be missing on the cluster
    // no plugin-specific library should be there
    $this->ssh->exec(bash('echo "export PYTHONPATH='.joinPaths(CLUSTER_CHRIS, 'lib', 'py').':\$PYTHONPATH" >>  '.$envfile));
   // add ChRIS binaries/libraries that are needed by the plugins
    $this->ssh->exec(bash('echo "export PATH='.joinPaths(CLUSTER_CHRIS, 'bin').':\$PATH" >>  '.$envfile));
    $this->ssh->exec(bash('echo "export LD_LIBRARY_PATH='.joinPaths(CLUSTER_CHRIS, 'lib').':\$LD_LIBRARY_PATH" >>  '.$envfile));
    $this->ssh->exec(bash('echo "umask 0002" >> '.$envfile));
    // make sure to update the permissions of the file
    $this->ssh->exec("chmod 644 $envfile");
  }

  public function createRun(){
      
    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');
 
    if($this->runtimePath == ''){
      $this->runtimePath = $this->path;
    }

    // 1- log HOSTNAME and time
    $this->ssh->exec(bash('echo "echo \"\$(date) Running on \$HOSTNAME\" > '.$this->runtimePath.'/_chrisRun_/chris.std" >> '.$runfile));

    // 2- source the environment
    $this->ssh->exec(bash('echo "source '.$this->runtimePath . '/_chrisRun_/chris.env;" >> '.$runfile));

    // 3- RUN command, need some work!
    $command = $this->buildCommand();
    $this->ssh->exec(bash('echo "'.$command.' >> ' .$this->runtimePath.'/_chrisRun_/chris.std 2> ' .$this->runtimePath. '/_chrisRun_/chris.err" >> '.$runfile));

    // 4- update permission after plugin ran
    // to be tested to make sure this is enough
    // needs a bash wrapper for consistency
    $this->ssh->exec("echo 'chmod 755 $this->runtimePath; cd $this->runtimePath ; find . -type d -exec chmod o+rx,g+rx {} \; ; find . -type f -exec chmod o+r,g+r {} \;' >> $runfile;");  

    $this->customizeRun();

    $this->ssh->exec("chmod 755 $runfile");
  }

  public function buildCommand(){
    return implode(' ' , $this->pluginCommandArray);
  }

  public function prepare(){
    // does nothing, to beoverloaded in childrens...
  }	  

  public function customizeRun(){
    // does nothing, to beoverloaded in childrens...
  }

  public function run(){
    // does nothing, to beoverloaded in childrens...
  }
}

class LocalRunner extends Runner{
  public function prepare(){
    mkdir($this->runtimePath, 0755, true);
    shell_exec("cp -R " . rtrim($this->path, "/") . "/* " . $this->runtimePath);
  }	

  public function run(){
      
    $runfile = joinPaths($this->runtimePath, '_chrisRun_', 'chris.run');
      
    $command = "/bin/bash umask 0002;/bin/bash $runfile;";
    $nohup_wrap = 'bash -c \'nohup bash -c "'.$command.'" > /dev/null 2>&1 &\'';
    shell_exec($nohup_wrap);
    $this->pid = -1;
  }
      
  public function buildCommand(){
       
    $executable = $this->pluginCommandArray[0];
    $pluginParametersArray = $this->pluginCommandArray;
    array_shift($pluginParametersArray);
    
    $outputKey = array_search('--output', $pluginParametersArray);
    if($outputKey !== false){
      $pluginParametersArray[$outputKey + 1] = $this->runtimePath;
    }

    $parameters = implode(' ', $pluginParametersArray);
    // return new command
    return $executable . ' ' . $parameters;
  }

  public  function customizeRun(){
      
    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');
  
    $this->ssh->exec("echo 'sudo chmod -R 755 $this->runtimePath;' >> $runfile;");
    $this->ssh->exec("echo 'sudo chown -R $this->userId:$this->groupId $this->runtimePath;' >> $runfile;");
    $this->ssh->exec("echo 'sudo su $this->username -c \"cp -rfp $this->runtimePath/* $this->path\";' >> $runfile;");
    $viewer_plugin = CHRIS_PLUGINS_FOLDER.'/viewer/viewer';
    $this->ssh->exec("echo 'sudo su $this->username  -c \"$viewer_plugin --directory $this->path --output $this->path/..\";' >> $runfile;");
    // rm job_path directory
    $this->ssh->exec("echo 'sudo rm -rf $this->runtimePath;' >> $runfile;");

    $setStatus = '/usr/bin/curl --retry 5 --retry-delay 5 --connect-timeout 5 --max-time 30 -v -k --data ';

    // update status to 100%
    if($this->status != 100){
      // prepend
      $startToken = TokenC::create();
     $this->ssh->exec('sed -i "1i sudo su '.$this->username.' -c \"'.$setStatus.'\'action=set&what=feed_status&feedid='.$this->feedId.'&op=set&status=1&token='.$startToken.'\' '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curlA.std 2> '.$this->path.'/_chrisRun_/curlA.err"\" '.$runfile);

      // append
      // we need sudo su to run it at the right location after the data has been copied back
      $endToken = TokenC::create();
      $this->ssh->exec('echo "sudo su '.$this->username.' -c \"'.$setStatus.'\'action=set&what=feed_status&feedid='.$this->feedId.'&op=inc&status=+'.$this->statusStep.'&token='.$endToken.'\' '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curlB.std 2> '.$this->path.'/_chrisRun_/curlB.err\"" >> '.$runfile);
    }   
  }
}

class ImmediateRunner extends Runner{
  function customizeRun(){
      
    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');
  
    $viewer_plugin = CHRIS_PLUGINS_FOLDER.'/viewer/viewer';
    $this->ssh->exec("echo '$viewer_plugin --directory $this->path --output $this->path/..;' >> $runfile;");
  }

  public function run(){
      
    $runfile = joinPaths($this->runtimePath, '_chrisRun_', 'chris.run');
      
    $command = "umask 0002;/bin/bash $runfile;";
    $nohup_wrap = 'bash -c \'nohup bash -c "'.$command.'" > /dev/null 2>&1 &\'';
    $this->ssh->exec($nohup_wrap);
    $this->pid = -1;
  }
      
}

class RemoteRunner extends Runner{
  public $remoteHost = '';
  public $remoteUser = '';
  public $remoteSsh = '';

  public function createEnv(){
    
    parent::createEnv();

    $envfile = joinPaths($this->path, '_chrisRun_', 'chris.env');

    $this->ssh->exec(bash('echo "export ENV_REMOTEHOST='.$this->remoteHost.'" >>  '.$envfile));
    $this->ssh->exec(bash('echo "export ENV_REMOTEUSER='.$this->remoteUser.'" >>  '.$envfile));
  }

  public function run(){

    $envfile = joinPaths($this->runtimePath, '_chrisRun_', 'chris.env');
    $runfile = joinPaths($this->runtimePath, '_chrisRun_', 'chris.run');

    if (CLUSTER_PORT==22) {
      $tunnel_host = CLUSTER_HOST;
    } else {
      $tunnel_host = $this->remoteHost;
    }

    // update status to 100%

    $crunWrap = joinPaths(CLUSTER_CHRIS, CHRIS_SRC, 'lib/_common/crun.py');
    $crunWrap = $crunWrap . ' -u ' . $this->username . ' --host ' . $tunnel_host . ' -s ' . CLUSTER_TYPE . ' --saveJobID ' . $this->runtimePath . '/_chrisRun_';
    $cmd = 'nohup /bin/bash -c " source ' . $envfile . ' && ' . $crunWrap . ' -c \'\\\'\' /bin/bash ' . $runfile . ' \'\\\'\' "  </dev/null &>/dev/null &';
    echo PHP_EOL.$cmd.PHP_EOL;
    $pid = $this->remoteSsh->exec(bash($cmd));
  }
}

class SeparatedRunner extends RemoteRunner{
  public function buildCommand(){
      
    $executable = $this->pluginCommandArray[0];

    $pluginParametersArray = $this->pluginCommandArray;
    array_shift($pluginParametersArray);
    
    $outputKey = array_search('--output', $pluginParametersArray);
    if($outputKey !== false){
      $pluginParametersArray[$outputKey + 1] = $this->runtimePath;
    }

    $inputOptions = $this->ssh->exec($executable.' --inputs');
    $inputOptions = trim(preg_replace('/\s+/', ' ', $inputOptions));
    $inputOptionsArray = explode(',', $inputOptions);
    foreach ($inputOptionsArray as $in) {
      $inputKey = array_search($in, $pluginParametersArray);
      if($inputKey !== false){
        $valueKey = $inputKey + 1;
        $value = $pluginParametersArray[$valueKey];
        $value = rtrim($value, "/");
	$localValue = joinPaths($this->path, '_chrisInput_', $value);
        $this->ssh->exec('mkdir -p ' . dirname($localValue)  . '; cp -Lrn ' . $value . ' ' . $localValue);
	$pluginParametersArray[$valueKey] = joinPaths($this->runtimePath, '_chrisInput_', $value);
      }
    }

    // update executable location
    $executableArray = explode( '/' , $executable);
    $executableName = end($executableArray);
    $executable = joinPaths(CLUSTER_CHRIS, CHRIS_SRC, 'plugins/', $executableName, '/', $executableName);

    $parameters = implode(' ', $pluginParametersArray);
    // return new command
    return $executable . ' ' . $parameters;
  }

  public function customizeRun(){
    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');

    // get the contents of chris.run
    $runfile_str = file_get_contents($runfile);

    //
    // MOVE DATA ($chrisInputDirectory) FROM SERVER TO CLUSTER
    //

    if (CLUSTER_PORT==22) {
      $tunnel_host = CHRIS_HOST;
    } else {
      $tunnel_host = $this->remoteHost;
    }

    // command to compress _chrisInput_ dir on the chris server
    $cmd = '\"cd '.$this->path.'; tar -zcf _chrisInput_.tar.gz _chrisInput_;\"';
    $cmd = 'ssh -p ' .CLUSTER_PORT. ' -o StrictHostKeyChecking=no ' . $this->username.'@'.$tunnel_host. ' '.$cmd;

    // command to copy over the compressed _chrisIput_ dir to the cluster
    $cmd = $cmd.PHP_EOL.'scp -P ' .CLUSTER_PORT. ' ' . $this->username.'@'.$tunnel_host.':'.$this->path.'/_chrisInput_.tar.gz ' .$this->runtimePath.';';

    // command to remove the compressed file on the chris server
    $cmd = $cmd.PHP_EOL.'ssh -p ' .CLUSTER_PORT. ' ' . $this->username.'@'.$tunnel_host . ' rm '.$this->path.'/_chrisInput_.tar.gz;';

    // command to uncompress the compressed file on the cluster
    $cmd = $cmd.PHP_EOL.'cd '.$this->runtimePath.'; tar -zxf _chrisInput_.tar.gz;';

    // command to remove the compressed file from the cluster
    $cmd = $cmd.PHP_EOL.'cd '.$this->runtimePath.'; rm _chrisInput_.tar.gz;';
    $runfile_str = $cmd.PHP_EOL.$runfile_str;

    //
    // MOVE DATA ($job_path directory) FROM CLUSTER TO SERVER
    //

    // command to compress $cluster_job_path dir on the cluster (excluding _chrisInput_ dir)
    $data = basename($this->runtimePath);
    $cmd = 'cd '.$this->runtimePath.'/..; tar -zcf '.$data.'.tar.gz '.$data.' --exclude ' . $this->runtimePath. '/_chrisInput_;';
    $runfile_str = $runfile_str.$cmd;

    // command to copy over the compressed $cluster_job_path dir to the chris server
    $cmd = 'scp -P ' .CLUSTER_PORT. ' ' . $this->runtimePath.'/../'.$data.'.tar.gz ' . $this->username.'@'.$tunnel_host.':'.$this->path.'/..;';
    $runfile_str = $runfile_str.PHP_EOL.$cmd;

    // command to uncompress and remove the compressed file on the chris server
    $cmd = '\"cd '.$this->path.'/..; tar -zxf '.$data.'.tar.gz; rm '.$data.'.tar.gz;\"';
    $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $this->username.'@'.$tunnel_host . ' '.$cmd;
    $runfile_str = $runfile_str.PHP_EOL.$cmd;

    // command to remove the compressed file from the cluster
    $cmd = 'cd '.$this->runtimePath.'; rm '.$data.'.tar.gz &';
    $runfile_str = $runfile_str.PHP_EOL.$cmd;

    //
    // CREATE VIEWER SCENE
    //

    $viewer_plugin = CHRIS_PLUGINS_FOLDER.'/viewer/viewer';
    $cmd = '\"'.$viewer_plugin.' --directory '.$this->path.' --output '.$this->path.'/..;\"';
    $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $this->username.'@'.$tunnel_host . ' '.$cmd;
    $runfile_str = $runfile_str.PHP_EOL.$cmd;

    //ANONYMIZATION
    if (ANONYMIZE_DICOM) {
      $anonfile = joinPaths($this->path, '_chrisRun_', 'chris.anon');
      // copy template over
      $this->ssh->exec("cp ".joinPaths(CHRIS_HOME, CHRIS_SRC, "controller/anonymize.php")." $anonfile");
      // update template content
      $chrisInput_path_escaped  = str_replace("/", "\/", $this->path.'/_chrisInput_');
      $this->ssh->exec("sed -i 's/\${CHRISINPUT_PATH}/$chrisInput_path_escaped/g' $anonfile");

      $chris_bin = joinPaths(CHRIS_HOME, "bin");
      $chris_bin_escaped  = str_replace("/", "\/", $chris_bin);
      $this->ssh->exec("sed -i 's/\${CHRIS_BIN}/$chris_bin_escaped/g' $anonfile");

      $chris_scripts = joinPaths(CHRIS_HOME, "scripts");
      $chris_scripts_escaped  = str_replace("/", "\/", $chris_scripts);
      $this->ssh->exec("sed -i 's/\${CHRIS_SCRIPTS}/$chris_scripts_escaped/g' $anonfile");

      $this->ssh->exec('chmod 755 '.$anonfile);

      $cmd = '\"php '.$anonfile.';\"';
      $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $this->username.'@'.$tunnel_host . ' '.$cmd;
      $runfile_str = $cmd.PHP_EOL.$runfile_str;
    }

    //
    // UPDATE FEED STATUS
    //
    $setStatus = '/usr/bin/curl --retry 5 --retry-delay 5 --connect-timeout 5 --max-time 30 -v -k --data ';

    $startToken = TokenC::create();
    $cmd = '\"'.$setStatus.'\'action=set&what=feed_status&feedid='.$this->feedId.'&op=set&status=1&token='.$startToken.'\' '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curlA.std 2> '.$this->path.'/_chrisRun_/curlA.err;\"';
    $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $this->username.'@'.$tunnel_host . ' '.$cmd;
    $runfile_str = $cmd.PHP_EOL.$runfile_str;

    $endToken = TokenC::create();
    $cmd = '\"'.$setStatus.'\'action=set&what=feed_status&feedid='.$this->feedId.'&op=inc&status=+'.$this->statusStep.'&token='.$endToken.'\' '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curlB.std 2> '.$this->path.'/_chrisRun_/curlB.err;\"';
    $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $this->username.'@'.$tunnel_host . ' '.$cmd;
    $runfile_str = $runfile_str.PHP_EOL.$cmd;

    ////
    // DELETE REMOTE JOB PATH AFTER ALL THE DATA AS BEEN COPIED BACK
    /////
    // DO IF AFTER, if not can not test separated FS on shared FS
    $cmd = 'rm -rf '.$this->runtimePath.' &;';
    $runfile_str = $runfile_str.PHP_EOL.$cmd;

    $this->ssh->exec('echo "'.$runfile_str.'"'.' > '.$runfile);
    $this->ssh->exec('chmod 775 '.$runfile);

  }
  
  public function prepare(){
    createDir($this->remoteSsh, $this->runtimePath);

    // move env file to the cluster
    $envfile = joinPaths($this->path, '_chrisRun_', 'chris.env');
    $envfile2 = joinPaths($this->runtimePath, '_chrisRun_', 'chris.env');
    $envfile_str = file_get_contents($envfile);
    $this->remoteSsh->exec('echo "'.$envfile_str.'"'.' > '.$envfile2);
    $this->remoteSsh->exec('chmod 775 '.$envfile2);

    // move run file to the cluster
    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');
    $runfile2 = joinPaths($this->runtimePath, '_chrisRun_', 'chris.run');
    $runfile_str = file_get_contents($runfile);
    $runfile_str = str_replace("\"", "\\\"", $runfile_str);
    $this->remoteSsh->exec('echo "'.$runfile_str.'"'.' > '.$runfile2);
    $this->remoteSsh->exec('chmod 775 '.$runfile2);

  }

}

class SharedRunner extends RemoteRunner{
  public function customizeRun(){
    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');
  
    $viewer_plugin = CHRIS_PLUGINS_FOLDER.'/viewer/viewer';
    $this->ssh->exec("echo $viewer_plugin --directory $this->path --output $this->path/..;' >> $runfile;");

    $setStatus = '/usr/bin/curl --retry 5 --retry-delay 5 --connect-timeout 5 --max-time 30 -v -k --data ';

    if (CLUSTER_PORT==22) {
      $tunnel_host = CHRIS_HOST;
    } else {
      $tunnel_host = $this->remoteHost;
    }

    // update status to 100%
    // prepend
    $startToken = TokenC::create();
    $cmd = '\"'.$setStatus.'\'action=set&what=feed_status&feedid='.$this->feedId.'&op=set&status=1&token='.$startToken.'\' '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curlA.std 2> '.$this->path.'/_chrisRun_/curlA.err;\"';
    $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $this->username.'@'.$tunnel_host . ' '.$cmd;
    $this->ssh->exec('sed -i "1i '.$cmd.'" '.$runfile);

    // append
    // we need sudo su to run it at the right location after the data has been copied back
    $endToken = TokenC::create();
    $cmd = '\"'.$setStatus.'\'action=set&what=feed_status&feedid='.$this->feedId.'&op=inc&status=+'.$this->statusStep.'&token='.$endToken.'\' '.CHRIS_URL.'/api.php > '.$this->path.'/_chrisRun_/curlB.std 2> '.$this->path.'/_chrisRun_/curlB.err;\"';
    $cmd = 'ssh -p ' .CLUSTER_PORT. ' ' . $this->username.'@'.$tunnel_host . ' '.$cmd;
    $this->ssh->exec('echo "'.$cmd.'" >> '.$runfile);

  } 

}


?>
