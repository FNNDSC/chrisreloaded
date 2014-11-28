<?php

class Runner{
      
  public $shh = null;
  public $path = '';
  public $runtimePath = '';
  public $pluginCommandArray = [];
  public $userId = -1;
  public $groupId = -1;
  public $username = '';
  public $feedId = -1;
  public $status = -1;
  public $statusStep = -1;
  public $pid = -1;

  public function createEnv(){
      
    $envfile = joinPaths($this->path, '_chrisRun', 'chris.env');

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
    $ssh->exec(bash('echo "'.$command.'" >> '.$runfile));

    // 4- update permission after plugin ran
    // to be tested to make sure this is enough
    // needs a bash wrapper for consistency
    $ssh->exec("echo 'chmod 755 $runtimePath; cd $runtimePath ; find . -type d -exec chmod o+rx,g+rx {} \; ; find . -type f -exec chmod o+r,g+r {} \;' >> $runfile;");  

    $this->customizeRun();

    $ssh->exec("chmod 755 $runfile");
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
      
    mkdir($this->runtimePath);
    shell_exec("cp -R " . rtim($this->path, "/") . " " . CHRIS_TMP);
  }	

  public function run(){
      
    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');
      
    $command = "/bin/bash umask 0002;/bin/bash $runfile;";
    $nohup_wrap = 'bash -c \'nohup bash -c "'.$command.'" > /dev/null 2>&1 &\'';
    shell_exec($nohup_wrap);
    $this->pid = -1;
  }
      
  public function buildCommand(){
       
    $executable = $this->pluginCommandArray[0];
    $pluginParametersArray = $this->pluginCommandArray;
    array_shift($pluginParameterArray);
    
    $outputKey = array_search('output', $pluginParametersArray);
    if($outputKey !== false){
      $pluginParametersArray[$outputKey + 1] = $runtimePath;
    }

    $parameters = implode(' ', $pluginParametersArray);
    // return new command
    return $executable . ' ' . $parameters;
  }

  function customizeRun(){
      
    $runfile = joinPaths($this->path, '_chrisRun_', 'chris.run');
  
    $this->ssh->exec("echo 'sudo chmod -R 755 $this->runtimePath;' >> $runfile;");
    $this->ssh->exec("echo 'sudo chown -R $this->userId:$this->groupId $this->runtimePath;' >> $runfile;");
    $this->ssh->exec("echo 'sudo su $this->username -c \"cp -rfp $this->runtimePath $this->path\";' >> $runfile;");
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

}

class RemoteRunner extends Runner{
  public $remoteHost = '';
  public $remoteUser = '';

  public function createEnv(){
      
    parent::createEnv();

    $ssh->exec(bash('echo "export ENV_REMOTEHOST='.$remoteHost.'" >>  '.$envfile));
    $ssh->exec(bash('echo "export ENV_REMOTEUSER='.$remoteUser.'" >>  '.$envfile));
  }
}

class SeparatedRunner extends RemoteRunner{
}

class SharedRunner extends RemoteRunner{
      
  public function buildCommand(){
      
    $executable = $this->pluginCommandArray[0];
    $pluginParametersArray = $this->pluginCommandArray;
    array_shift($pluginParameterArray);
    
    $outputKey = array_search('output', $pluginParametersArray);
    if($outputKey !== false){
      $pluginParametersArray[$outputKey + 1] = $runtimePath;
    }

    $inputOptions = $this->ssh->exec($executable.' --inputs');
    $inputOptions = trim(preg_replace('/\s+/', ' ', $inputOptions));
    $inputOptionsArray = explode(',', $inputOptions);
    foreach ($inputOptionsArray as $in) {
      $inputKey = array_search($in, $pluginParametersArray);
      if($inputKey !== false){
        $valueKey = $inputKey + 1;
        $value = $pluginCommandArray[$valueKey];
        $value = rtim($value, "/");
	$localValue = joinPaths($this->path, '_chrisInput_', $value);
        $ssh->exec('mkdir -p ' . $localValue  . '; cp -Lrn ' . $value . ' ' . $localValue);
	$pluginCommandArray[$valueKey] = joinPaths($this->runtimePath, '_chrisInput_', $value);
      }
    }

    // update executable location
    $executableArray = explode( '/' , $executable);
    $executableName = end($executableArray);
    $executable = joinPaths(CLUSTER_CHRIS, '/src/chrisrelaoded/plugin/', executableName, '/', executableName);

    $parameters = implode(' ', $pluginParametersArray);
    // return new command
    return $executable . ' ' . $parameters;
  }

}


?>
