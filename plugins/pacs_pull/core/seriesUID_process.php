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
// include pacs helper
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'pacs.helper.php'));

// convenience method to check if variable is set or not
function is_set($variable, $value = '') {
  return isset($variable)?$variable:$value;
}


// uniqueID
$uniqueID = is_set($_POST['UNIQUEID']);

// seriesUIDlist
$dataList = is_set($_POST['DATA']);


if($uniqueID != '') {
    $str_fileName = ENV_CLUSTER_TMP_DIR . '/' . $uniqueID;
    $FH = fopen($str_fileName, 'w');
    fclose($FH);
}

if($dataList != '') {
    $str_fileName = ENV_CLUSTER_TMP_DIR . '/' . $uniqueID;
    file_put_contents($str_fileName, $dataList);
    
}

echo $str_fileName;

?>