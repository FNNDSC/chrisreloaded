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

// maintenance mode
define('CHRIS_MAINTENANCE', false);

// admin email
define('CHRIS_ADMIN_EMAIL', 'chris@babymri.org');
define('CHRIS_PLUGIN_EMAIL_FROM', 'plugin@chris.org');
define('CHRIS_DICOM_EMAIL_FROM', 'dicom@chris.org');
define('CHRIS_DICOM_EMAIL_TO', 'nicolas.rannou@childrens.harvard.edu,rudolph.pienaar@childrens.harvard.edu');

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
define('CHRIS_LIB_FOLDER', joinPaths(CHRIS_WWWROOT,'lib'));
define('CHRIS_PLUGINS_FOLDER', joinPaths(CHRIS_WWWROOT,'plugins'));
define('CHRIS_PLUGINS_FOLDER_RELATIVE', 'plugins');

// chris file system
define('CHRIS_DATA', '/chb/users/chris/dev/data/');
define('CHRIS_TMP', '/chb/users/chris/dev/tmp/');
define('CHRIS_USERS', '/chb/users/chris/dev/users/');
define('CHRIS_LOG', '/chb/users/chris/dev/log/');

// known scanners and contact information
define('CHRIS_SCANNERS', serialize(array(
    "MRC25948" => "borjan.gagoski@childrens.harvard.edu",
    "MRWAL2" => "borjan.gagoski@childrens.harvard.edu",
    "MR1" => "borjan.gagoski@childrens.harvard.edu")));

// cluster
define('CLUSTER_HOST', 'rc-goldfinger');
define('CLUSTER_USERNAME', 'chris');
// we replace {MEMORY} with a memory requirement
// and {COMMAND} with the command to schedule
define('CLUSTER_RUN', 'nohup /bin/mosbatch -q -b -J{FEED_ID} -m{MEMORY} {COMMAND}');
define('CLUSTER_KILL', 'moskillall -9 -J{FEED_ID}');

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

// setup phpseclib for SSH access
set_include_path(get_include_path() . PATH_SEPARATOR . joinPaths(CHRIS_LIB_FOLDER, 'phpseclib', 'phpseclib'));


// FLAG showing that the config was parsed
define('CHRIS_CONFIG_PARSED', true);


?>
