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

// check if we are invoked by commandline
$commandline_mode = (php_sapi_name() == 'cli');

if ($commandline_mode) {

  // this is a valid entry point
  if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);

}

// include the configuration
require_once (dirname(dirname(__FILE__)).'/config.inc.php');

// in commandline mode, echo the environment variables
// so a bash command like
//  $ eval `php setupEnv.sh`
// defines the environment variables
if ($commandline_mode) {

  if (defined('CHRIS_PACKAGES')) {
    $packages = unserialize(CHRIS_PACKAGES);

    foreach ($packages as $name=>$path) {

       echo 'export '.$name.'='.$path.';'.PHP_EOL;

    }
  }

}

// in include mode, we can just use the following functions

/**
 * Configure the list of CHRIS_PACKAGES. This should be called only once
 * since the constant filtering is expensive.
 */
function buildEnvironment() {

  $packages = array();

  foreach (get_defined_constants() as $constant=>$value) {

    // check if this is an external package configuration
    if (substr($constant,0,4)=="ENV_") {

      if($constant == "ENV_PYTHONPATH"){

        $constant = "PYTHONPATH";

      }

      // this is a package env variable

      $packages[$constant] = $value;

    }

  }

  return $packages;

}

/**
 * Set all known package environment variables in the current context.
 */
function setupEnvironment() {

  $packages = unserialize(CHRIS_PACKAGES);

  foreach ($packages as $name=>$path) {

    putenv($name.'='.$path);

  }

}


?>
