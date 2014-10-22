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
require_once (dirname(dirname(dirname(dirname(__FILE__)))).'/config.inc.php');

// convenience method to check if variable is set or not
function is_set($variable, $value = '') {
  return isset($variable)?$variable:$value;
}

// exact match on subjectname
$name = is_set($_POST['FINDS_e']);
// session id substring match
$session_id = is_set($_POST['FINDS_i']);
// subject id
$subject_id = is_set($_POST['FINDS_I']);
// project
$project = is_set($_POST['FINDS_p']);
// session on date
$date_on = is_set($_POST['FINDS_o']);
// session in last 4 month
$date_past_4_months = is_set($_POST['FINDS_r']);
// session since
$date_since = is_set($_POST['FINDS_s']);
// today 
$date_today = is_set($_POST['FINDS_t']);
// experimenter
$experimenter = is_set($_POST['FINDS_x']);
// verbose
$verbose = 1;//is_set($_POST['FINDS_v']);
// session script
$script = is_set($_POST['FINDS_SCRIPT']);

// we silent the Output Buffer
// if not, query.php returns the json output + "#!/usr/bin/php"
// the json output is then corrupted
// then the pacs.js do not understand the answer
ob_start();
include('query.php');
ob_end_clean();

echo json_encode($formated_output);

?>
