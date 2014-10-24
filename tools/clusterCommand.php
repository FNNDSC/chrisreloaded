#!/usr/bin/php

<?php

if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
require_once (dirname(dirname(__FILE__)).'/config.inc.php');
require_once ('Net/SSH2.php');

// define the options
$shortopts = "u:p:f::m::c::";
$longopts  = array(
  "username:",
  "password:",
  "feedid::",
  "memory::",
  "command::"
);

$options = getopt($shortopts, $longopts);

//if no username provided, exit
$username = '';
if( array_key_exists('u', $options))
{
  $username = $options['u'];
}
elseif (array_key_exists('username', $options))
{
  $username = $options['username'];
}
else{
  echo "no username provided!";
  echo "\n";
  return;
}

//if no passwrod provided, exit
$password = '';
if( array_key_exists('p', $options))
{
  $password = $options['p'];
}
elseif (array_key_exists('password', $options))
{
  $password = $options['password'];
}
else{
  echo "no password provided!";
  echo "\n";
  return;
}

// feedid is optional
$feed_id = '999';
if( array_key_exists('f', $options))
{
  $feed_id = $options['f'];
}
elseif (array_key_exists('feedid', $options))
{
  $feed_id = $options['feedid'];
}

// memory is optional
$memory = '128';
if( array_key_exists('m', $options))
{
  $memory = $options['m'];
}
elseif (array_key_exists('memory', $options))
{
  $memory = $options['memory'];
}

// command is optional
$command = '/usr/bin/sleep 60';
if( array_key_exists('c', $options))
{
  $command = $options['c'];
}
elseif (array_key_exists('command', $options))
{
  $command = $options['command'];
}


////////
// START THE REAL WORK HERE
////////

$sshCluster = new Net_SSH2(CLUSTER_HOST);
if (!$sshCluster->login($username, $password)) {
  die('Server login Failed');
}

$cluster_command = str_replace("{MEMORY}", $memory, CLUSTER_RUN);
$cluster_command = str_replace("{FEED_ID}", $feed_id, $cluster_command);
$cluster_command = str_replace("{COMMAND}", $command, $cluster_command);

echo "*===============\n";
echo "* RUN SEQUENCE\n";
echo "*===============\n\n";

echo '-> run command:'.PHP_EOL.$cluster_command.PHP_EOL.PHP_EOL;
echo '-> after bash wrapper:'.PHP_EOL.bash($cluster_command).PHP_EOL.PHP_EOL;
$pid = trim($sshCluster->exec(bash($cluster_command)));
echo '-> output (pid):'.PHP_EOL.$pid.PHP_EOL;

$cluster_command = str_replace("{PID}", $pid, CLUSTER_KILL);
$cluster_command = str_replace("{FEED_ID}", $feed_id, $cluster_command);

echo "\n\n*===============\n";
echo "* KILL SEQUENCE\n";
echo "*===============\n\n";

echo '-> kill command:'.PHP_EOL.$cluster_command.PHP_EOL.PHP_EOL;
echo '-> after bash wrapper:'.PHP_EOL.bash($cluster_command).PHP_EOL.PHP_EOL;
$pid = trim($sshCluster->exec(bash($cluster_command)));
echo '-> output:'.PHP_EOL.$pid.PHP_EOL;

?>
