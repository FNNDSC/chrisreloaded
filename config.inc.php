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

// version
define('CHRIS_VERSION', '2.8-experimental');
define('CHRIS_TIMEZONE', 'America/New_York');
date_default_timezone_set(CHRIS_TIMEZONE);

// maintenance mode
define('CHRIS_MAINTENANCE', false);

define('CHRIS_HOME', '/neuro/users/chris/dev');
define('CHRIS_TRANSFER_PROTOCOL', 'http');
define('CHRIS_URL', CHRIS_TRANSFER_PROTOCOL.'://chris/nicolas');

// admin email
define('CHRIS_MAIL_SUFFIX', '@childrens.harvard.edu');
define('CHRIS_ADMIN_EMAIL', 'chris@babymri.org');
define('CHRIS_PLUGIN_EMAIL_FROM', 'plugin@chris.org');
define('CHRIS_DICOM_EMAIL_FROM', 'dicom@chris.org');
define('CHRIS_DICOM_EMAIL_TO', 'nicolas.rannou@childrens.harvard.edu');

// MYSQL configuration
define('SQL_HOST', 'chris');
define('SQL_USERNAME', 'chris');
define('SQL_PASSWORD', 'YOURPASSWORD');
define('SQL_DATABASE', 'chrisdev');

// chris file system

define('CHRIS_SRC', joinPaths(CHRIS_HOME, 'nicolas'));
define('CHRIS_DATA', joinPaths(CHRIS_HOME, 'data'));
define('CHRIS_TMP', joinPaths(CHRIS_HOME, 'tmp'));
define('CHRIS_USERS', joinPaths(CHRIS_HOME, 'users'));
define('CHRIS_LOG', joinPaths(CHRIS_HOME, 'log'));
define('CHRIS_LIBS', joinPaths(CHRIS_HOME, 'lib'));

// chris user configuration
define('CHRIS_USERS_CONFIG_DIR', 'config');
define('CHRIS_USERS_CONFIG_FILE', '.chris.conf');
define('CHRIS_USERS_CONFIG_SSHKEY', 'id_rsa');

// PATH configuration
define('CHRIS_WWWROOT', dirname(__FILE__));
define('CHRIS_MODEL_FOLDER', joinPaths(CHRIS_WWWROOT,'model'));
define('CHRIS_VIEW_FOLDER', joinPaths(CHRIS_WWWROOT,'view'));
define('CHRIS_TEMPLATE_FOLDER', joinPaths(CHRIS_VIEW_FOLDER,'template'));
define('CHRIS_CONTROLLER_FOLDER', joinPaths(CHRIS_WWWROOT,'controller'));
define('CHRIS_LIB_FOLDER', joinPaths(CHRIS_WWWROOT,'lib'));
define('CHRIS_PLUGINS_FOLDER', joinPaths(CHRIS_WWWROOT,'plugins'));
define('CHRIS_PLUGINS_FOLDER_NET', joinPaths(CHRIS_SRC,'plugins'));
define('CHRIS_PLUGINS_FOLDER_RELATIVE', 'plugins');
define('CHRIS_RUN_AS_CHRIS_LOCAL', 'pacs_pull,search,pacs_push,chris_push');

// known scanners and contact information
define('CHRIS_SCANNERS', serialize(array(
"MRC25948" => "borjan.gagoski@childrens.harvard.edu",
"MRWAL2" => "borjan.gagoski@childrens.harvard.edu",
"MR1" => "borjan.gagoski@childrens.harvard.edu")));

// cluster
define('CLUSTER_HOST', 'rc-golden');
// Cluster type: crun_hpc_mosix or crun_hpc_lsf or crun_hpc_launchpad or local 
define('CLUSTER_TYPE', 'crun_hpc_mosix');
define('CLUSTER_USERNAME', 'chris');
// we replace {MEMORY} with a memory requirement
// and {COMMAND} with the command to schedule
define('CLUSTER_RUN', 'nohup /bin/mosbatch -q -b -J{FEED_ID} -m{MEMORY} {COMMAND} < /dev/null & echo $!;');
define('CLUSTER_KILL', 'moskillall -9 -J{FEED_ID}');

// DICOM LISTENER
define('DICOM_DESTINATION_AETITLE', 'FNNDSC-CHRISDEV');
define('DICOM_DCMTK_FINDSCU', '/usr/bin/findscu');
define('DICOM_DCMTK_MOVESCU', '/usr/bin/movescu');
define('DICOM_DCMTK_ECHOSCU', '/usr/bin/echoscu');

// remote chris
define('CHRIS_REMOTES', serialize(array(
"MGH" => serialize(array(
    "sshhost" => "fnndsc",
    "sshport" => "1148",
    "dicomhost" => "fnndsc",
    "dicomport" => "1148",
    "src"  => "/home/chris/src/chrisreloaded")),
"BCH" => serialize(array(
    "sshhost" => "localhost",
    "sshport" => "22",
    "dicomhost" => "pretoria",
    "dicomport" => "10401",
    "src"  => "/neuro/users/chris/dev/nicolas"))
)));

//
// ENVIRONMENT CONFIGURATION
//
# globals
define('ENV_TMP_DIR', '/neuro/tmp');
define('ENV_CLUSTER_TMP_DIR', '/neuro/tmp');
define('ENV_PYTHONPATH', joinPaths(CHRIS_LIBS, 'pymodules/:$PYTHONPATH'));


define('ENV_SCRIPT_DIR', '/neuro/arch/scripts');
define('ENV_FREESURFER_SCRIPT', '/neuro/arch/scripts/neuro-fs');
define('ENV_SLICER_DIR', '/neuro/arch/Linux64/packages/Slicer4/current');
define('ENV_DTK_DIR', '/neuro/arch/x86_64-Linux/bin');
# pacs push
define('ENV_DICOMDIRSEND_SCRIPT', '/neuro/arch/scripts/dicom_dirSend.bash');
# tractography
define('ENV_TRACTOGRAPHY_SCRIPT', '/neuro/arch/scripts/tract_meta.bash');
# connectome pipeline
define('ENV_CONNECTOME_SCRIPT', '/neuro/arch/scripts/chb-connectome');
define('ENV_CONNECTOME_META_SCRIPT', '/neuro/arch/scripts/connectome_meta.bash');
define('ENV_MRICRON_DIR', '/neuro/arch/x86_64-Linux/packages/mricron');
define('ENV_CMP_DIR', '/neuro/arch/packages/x86_64-Linux/cmp110/lib/python');
define('ENV_FSL_SCRIPT', '/neuro/arch/x86_64-Linux/packages/fsl/etc/fslconf/fsl.sh');
#fyborg
define('ENV_FYBORG_DIR', '/neuro/arch/scripts');
# fetal moco
define('ENV_FETALMOCO_DIR', '/neuro/arch/Linux64/packages/fetal_moco');



// TESTING
define('SIMPLETEST_CHRIS', joinPaths(CHRIS_WWWROOT,'testing/simpletest_chris.php'));
define('SIMPLETEST_HTML_CHRIS', joinPaths(CHRIS_WWWROOT,'testing/html_chris.php'));
define('SIMPLETEST_XML_CHRIS', joinPaths(CHRIS_WWWROOT,'testing/xml_chris.php'));
define('SIMPLETEST_SIMPLETEST', joinPaths(CHRIS_WWWROOT,'lib/simpletest/simpletest.php'));
define('SIMPLETEST_AUTORUN', joinPaths(CHRIS_WWWROOT,'lib/simpletest/autorun.php'));

// GOOGLE ANALYTICS
define('ANALYTICS_ACCOUNT', 'UA-39303022-1');

// if CHRIS_DEBUG is defined, print all constants
if(defined('CHRIS_CONFIG_DEBUG')) {
  $all_constants = get_defined_constants(true);
  print_r($all_constants['user']);
}

// setup phpseclib for SSH access
set_include_path(get_include_path() . PATH_SEPARATOR . joinPaths(CHRIS_LIB_FOLDER, 'phpseclib', 'phpseclib'));

// generate CHRIS_PACKAGES (this has to happen after PACKAGE_SLICER_DIR etc. were configured
require_once(joinPaths(CHRIS_PLUGINS_FOLDER,'env.php'));
define('CHRIS_PACKAGES', serialize(buildEnvironment()));

// FLAG showing that the config was parsed
define('CHRIS_CONFIG_PARSED', true);


?>
