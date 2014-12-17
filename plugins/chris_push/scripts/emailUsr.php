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

require_once (dirname(dirname(dirname(dirname(__FILE__)))).'/config.inc.php');

require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'mapper.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));

// main function
$shortopts = "u:z:";
$options = getopt($shortopts);

$username = '';
if(isset($options['u'])){
    $username = $options['u'];
}

$zipfile = '';
if(isset($options['z'])){
    $zipfile = $options['z'];
}

// Get username
$userMapper = new Mapper('User');
$userMapper->filter('username = (?)',$username);
$userResult = $userMapper->get();

$emailTo = '';
if(count($userResult['User']) != 0){
    $emailTo = $userResult['User'][0]->email;
}

// Build message and link:
$link = CHRIS_URL."/index.php?";
$link .= "launch_plugin=1";
$link .= "&plugin=zip";
$feedname = "ChRIS_Pushed";
$link .= "&feedname=$feedname";
$link .= "&status=0";
$link .= "&status_step=100";
$command = "--input $zipfile --unzip";
$link .= "&ncommand=".urlencode($command);

$message = "Please click on the following link to create a new feed for this data: ".PHP_EOL;
$message .= $link;

email(CHRIS_DICOM_EMAIL_FROM, $emailTo, "New data has been received", $message);
?>
