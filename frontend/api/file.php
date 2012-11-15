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

/* // get location
// feedname-feedid
$feed_directory = $_POST['FEED_DIRECTORY'];
// plugin name
$feed_plugin =  $_POST['FEED_PLUGIN'];
// file name
$name = $_POST['FILENAME'];

//$location = joinPaths(CHRIS_DATA_FOLDER, $_SESSION['username'], $feed_plugin, $feed_directory, $name);
$location = '/chb/users/nicolas.rannou/gitroot/chrisreloaded/frontend/plugins/pacs_query/study.json';
 */
// location:

// return required type (JSON, RAW, etc.)
/* if($_POST['TYPE'] == 'JSON'){
  echo $location;
}
else{
  echo 'unknown type';
} */
//$json_data = file_get_contents('data.txt');
echo file_get_contents('/chb/users/nicolas.rannou/gitroot/chrisreloaded/frontend/plugins/pacs_query/study.json');
?>