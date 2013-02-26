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
// do not assume FEED_PARAM is set
$parameters = isset($_POST['FEED_PARAM'])?$_POST['FEED_PARAM']:array(0 => "");

// validate the credentials
if (!SecurityC::login()) {

  // invalid credentials

  // destroy the session
  session_destroy();
  // .. and forward to the sorry page
  header('Location: ?sorry');
  exit();

}

$status_step = number_format (100 / count($parameters), 2);

foreach($parameters as $k0 => $v0){

  // launcher.php compliant
  // user?
  $username = $_SESSION['username'];
  $password = $_SESSION['password'];
  $feedname = sanitize($_POST['FEED_NAME']);

  if (isset($_POST['FEED_STATUS'])) {
    // status, if we don't want to start with status=0
    $status = sanitize($_POST['FEED_STATUS']);
  }
  else{
    $status = 0;
  }

  if (isset($_POST['FEED_MEMORY'])){
    // memory, if we don't want to start with memory=256
    $memory = sanitize($_POST['FEED_MEMORY']);
  }
  else{
    $memory = 2048;
  }

  // plugin name?
  $command = PluginC::getExecutable(sanitize($_POST['FEED_PLUGIN']));
  // parameters?
  $parentFolder = null;
  if(is_array($v0)){
    foreach($v0 as $key => $value){

      if ($value['type'] == 'dropzone' && $value['value'] != '') {

        $value['value'] = joinPaths(CHRIS_USERS, $value['value']);

        if (!$parentFolder) {

          // no parent folder set yet, so let's grab this value
          if (is_dir($value['value'])) {
            // this is already the directory
            $parentFolder = $value['value'];
          } else {
            $parentFolder = dirname($value['value']);
          }

        }

      }

      if ($value['name']) {
        // support for parameters without a flag
        $value['name'] = '--'.$value['name'];
      }

      $command .= ' '.$value['name'].' '.$value['value'];
    }
  }

  // the subfoldertail can be
  // if an input parameter is a dropzone
  // a) the parent directory of the first dropzone
  // b) information parsed from a 0.info file of the first dropzone
  // if there is no dropzone
  // c) the current timestamp
  $subfoldertail = "";
  if ($parentFolder) {

    // check for a 0.info in the $parentFolder
    $info_file = joinPaths($parentFolder,'0.info');

    if (is_file($info_file)) {

      // case b)

      $patientId = "";
      $patientAge = "";
      $patientSex = "";

      // found one, let's parse it
      $file_handle = fopen($info_file, "r");
      while (!feof($file_handle)) {
        $line = fgets($file_handle);

        // split the line at :
        $arr = explode(":", $line);

        if (trim($arr[0]) == "PatientID") {
          $patientId = trim($arr[1]);
        } else if (trim($arr[0]) == "PatientAge") {
          $patientAge = trim($arr[1]);
        } else if (trim($arr[0]) == "PatientSex") {
          $patientSex = trim($arr[1]);
        }

      }
      fclose($file_handle);

      $subfoldertail = sanitize($patientId)."-".sanitize($patientAge)."-".sanitize($patientSex);

    } else {

      // there is no 0.info file -> case a)
      $subfoldertail = basename($parentFolder);

    }


  } else {
    // no parent folder set yet, this is case c)
    $subfoldertail = date('Y-m-d-H-i-s');
  }

  // always provide a job id
  $jobid = $k0.'_'.$subfoldertail;

  // output?
  $output = ' {OUTPUT}/';

  if(is_array($_POST['FEED_OUTPUT'])
      && array_key_exists($k0, $_POST['FEED_OUTPUT'])
      && is_array($_POST['FEED_OUTPUT'][$k0])){
    foreach($_POST['FEED_OUTPUT'][$k0] as $key => $value){

      if ($value['name']) {
        // support for parameters without a flag
        $value['name'] = '--'.sanitize($value['name']);
      }

      $command .= ' '.$value['name'].$output.sanitize($value['value']);
    }
  }

  // The following variables have to be defined to be picked up
  // by launcher.php
  // $command
  // $username
  // $password
  // $feedname
  // $feed_id
  // $jobid
  // $memory
  // $status
  // $status_step
  include('launcher.php');

}

?>