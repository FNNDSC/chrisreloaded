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
define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
require_once (dirname(dirname(__FILE__)).'/config.inc.php');
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'security.controller.php'));

// include the controller
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'data.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'plugin.controller.php'));

require_once (joinPaths(CHRIS_MODEL_FOLDER, 'meta.model.php'));

// format session variables and post variable into a command line format
$feed_id = -1;
$parameters = $_POST['FEED_PARAM'];

foreach($parameters as $k0 => $v0){

  // launcher.php compliant
  $launch_command = './launcher.php ';
  // user?
  $launch_command .= '--username=\''.$_SESSION['username'].'\' ';
  // feed name?
  $launch_command .= '--feedname=\''.sanitize($_POST['FEED_NAME']).'\' ';
  // feed id?
  $launch_command .= '--feedid=\''.$feed_id.'\' ';
  // job id?
  if(count($parameters) > 1){
    $launch_command .= '--jobid=\''.$k0.'\' ';
  }
  // plugin name?
  $command = PluginC::getExecutable(sanitize($_POST['FEED_PLUGIN']));
  // parameters?
  foreach($v0 as $key => $value){

    if ($value['type'] == 'dropzone' && $value['value'] != '') {

      $value['value'] = joinPaths(CHRIS_USERS, $value['value']);

    }

    $command .= ' --'.$value['name'].' '.$value['value'];
  }
  // output?
  $output = ' {OUTPUT}/';

  foreach($_POST['FEED_OUTPUT'][$k0] as $key => $value){
    $command .= ' --'.sanitize($value['name']).$output.sanitize($value['value']);
  }
  $launch_command .= '--command \''.$command.'\' ';

  // return output
  echo $launch_command;
  $feed_id = shell_exec($launch_command);
  echo PHP_EOL.$feed_id.PHP_EOL;
}

?>