<?php

// we define a valid entry point
define('__CHRIS_ENTRY_POINT__', 666);

//define('CHRIS_CONFIG_DEBUG', true);

// include the configuration
require_once ('config.inc.php');

require_once ('Net/SSH2.php');

$username = 'bahtam';
$password = 'melody';
$feed_path = '/tmp/chris/test/';
$job_path = '/tmp/chris/test/job';
$command = 'testcommand';
$command .= ' > '.$job_path.'/chris.log 2> '.$job_path.'/chris.err';
$runfile = $job_path.'/chris.run';

$ssh = new Net_SSH2("localhost");
if (!$ssh->login($username, $password)) {
  die('Login Failed');
}

echo $ssh->exec('mkdir -p '.$job_path);
echo $ssh->exec('echo "'.$command.'" > '.$runfile);
echo $ssh->exec("echo 'chmod 755 $feed_path; cd $feed_path ; find . -type d -exec chmod o+rx,g+rx {} \; ; find . -type f -exec chmod o+r,g+r {} \;' >> $runfile; chmod +x $runfile;");

$ssh2 = new Net_SSH2("rc-drno");
if (!$ssh2->login($username, $password)) {
  die('Login Failed');
}

echo $ssh2->exec('cat /etc/hostname');


?>
