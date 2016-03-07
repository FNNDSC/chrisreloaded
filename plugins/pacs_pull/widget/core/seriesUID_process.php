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

if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);

// we want the location of the local tmp directory
require_once (dirname(dirname(dirname(dirname(__FILE__)))).'/config.inc.php');

// convenience method to check if variable is set or not
function is_set($variable, $value = '') {
  return isset($variable)?$variable:$value;
}


// uniqueID
$uniqueID = is_set($_POST['UNIQUEID']);

// seriesUIDlist
$dataList = is_set($_POST['DATA']);

// clustertmpdir
//$clusterTmpDir = is_set($_POST['CLUSTER']);
// local tmp directory
$clusterTmpDir = is_set(CHRIS_TMP);;


if($uniqueID != '') {
    $str_fileName = $clusterTmpDir . '/' . $uniqueID;
    $FH = fopen($str_fileName, 'w');
    fclose($FH);
}

if($dataList != '') {
    $str_fileName = $clusterTmpDir . '/' . $uniqueID;
    file_put_contents($str_fileName, $dataList);
    
}

echo $str_fileName;

?>
