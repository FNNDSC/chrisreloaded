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

// we define a valid entry point
if (!defined('__CHRIS_ENTRY_POINT__'))
  define('__CHRIS_ENTRY_POINT__', 666);

//define('CHRIS_CONFIG_DEBUG',true);

// include the configuration

if (!defined('CHRIS_CONFIG_PARSED'))
  require_once (dirname(dirname(dirname(__FILE__))).'/config.inc.php');
// include the simpletest chris framework
require_once (SIMPLETEST_CHRIS);
SimpleTest_Chris::setPreference();

// include all the tests
// data related models
require_once ('test.data.model.php');
require_once ('test.data_patient.model.php');
// user related models
require_once ('test.user.model.php');
require_once ('test.user_data.model.php');
// feed related projects
require_once ('test.feed.model.php');
require_once ('test.feed_data.model.php');
//other models
require_once ('test.meta.model.php');
require_once ('test.patient.model.php');


?>