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
if(!defined('__CHRIS_ENTRY_POINT__')) die('Invalid access.');

// include the utilities
require_once(dirname(__FILE__).'/controller/_util.inc.php');

// MYSQL configuration
define('SQL_HOST', 'chris');
define('SQL_USERNAME', 'chris');
define('SQL_PASSWORD', 'YOURPASSWORD');
define('SQL_DATABASE', 'chrisdev');

// PATH configuration
define('CHRIS_WWWROOT', dirname(__FILE__));
define('CHRIS_MODEL_FOLDER', joinPaths(CHRIS_WWWROOT,'model'));
define('CHRIS_VIEW_FOLDER', joinPaths(CHRIS_WWWROOT,'view'));
define('CHRIS_TEMPLATE_FOLDER', joinPaths(CHRIS_VIEW_FOLDER,'template'));
define('CHRIS_CONTROLLER_FOLDER', joinPaths(CHRIS_WWWROOT,'controller'));

// PACS
// folder containing dcmtk binaries
define('CHRIS_DCMTK', '/usr/bin/');
// chris file system
define('CHRIS_DATA', '/chb/users/chris/dev/data/');
define('CHRIS_TMP', '/chb/users/chris/dev/tmp/');
define('CHRIS_AETITLE', 'FNNDSC-CHRISDEV');
define('PACS_SERVER', '134.174.12.21');
define('PACS_PORT', '104');

// TESTING
define('SIMPLETEST_CHRIS', joinPaths(CHRIS_WWWROOT,'testing/simpletest_chris.php'));
define('SIMPLETEST_HTML_CHRIS', joinPaths(CHRIS_WWWROOT,'testing/html_chris.php'));
define('SIMPLETEST_XML_CHRIS', joinPaths(CHRIS_WWWROOT,'testing/xml_chris.php'));
define('SIMPLETEST_SIMPLETEST', joinPaths(CHRIS_WWWROOT,'lib/simpletest/simpletest.php'));
define('SIMPLETEST_AUTORUN', joinPaths(CHRIS_WWWROOT,'lib/simpletest/autorun.php'));


// if CHRIS_DEBUG is defined, print all constants
if(defined('CHRIS_CONFIG_DEBUG')) {
  $all_constants = get_defined_constants(true);
  print_r($all_constants['user']);
}


// FLAG showing that the config was parsed
define('CHRIS_CONFIG_PARSED', true);


?>