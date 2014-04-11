#!/usr/bin/php
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
 *
 * Quick example:
 *
 *      ./query.php --studydate=20130416 --modality=MR
 *
 *
 */

if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);

// main function
$shortopts = "f:r:tp";
$options = getopt($shortopts);

if(isset($options['f'])){
    $file = $options['f'];
    require_once ($file);
}
else{
    require_once (dirname(dirname(dirname(dirname(__FILE__)))).'/config.inc.php');
}

$remote = '';
if(isset($options['r'])){

    $remote = $options['r'];
    $chris_remote_addresses = unserialize(CHRIS_REMOTE_ADD);
    $chris_remote_sources = unserialize(CHRIS_REMOTE_SRC);

    if(array_key_exists($remote, $chris_remote_addresses)){
        echo $chris_remote_addresses[$remote].PHP_EOL;
        echo $chris_remote_sources[$remote].PHP_EOL;
    }
}

if(isset($options['t'])){
    echo CHRIS_TMP.PHP_EOL;
}

if(isset($options['p'])){
    echo CHRIS_PLUGINS_FOLDER.PHP_EOL;
}

?>
