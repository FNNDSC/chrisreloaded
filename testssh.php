<?php

// we define a valid entry point
define('__CHRIS_ENTRY_POINT__', 666);

//define('CHRIS_CONFIG_DEBUG', true);

// include the configuration
require_once ('config.inc.php');

require_once ('Net/SSH2.php');

$ssh = new Net_SSH2(CLUSTER_HOST);
if (!$ssh->login('bahtam', 'melody')) {
  exit('Login Failed');
}

echo $ssh->exec('nohup mosbatch -q -b mostestload -t 120 < /dev/null & echo $!');


?>
