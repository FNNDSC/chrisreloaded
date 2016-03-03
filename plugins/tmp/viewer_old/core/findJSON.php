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

// TODO FIX RELATIVE PATH ISSUE TO ENSURE WE CAN ACCESS/ DOWNLOAD THE DATA

// exact match on subjectname
$feed_id = is_set($_POST['FEED_ID']);
$directory = is_set($_POST['DIRECTORY']);
$content = '';

if($feed_id != ''){
    // there should be a json file
    // go through users' viewer feeds and find the matching ID!
    $viewerFeeds = CHRIS_USERS."/$directory";

    // echo "$viewerFeeds/.chris.json";
    if (file_exists("$viewerFeeds/.chris.json")){
        $content = file_get_contents("$viewerFeeds/.chris.json");
    }
    else{
        $content = exec(escapeshellcmd(CHRIS_PLUGINS_FOLDER."/viewer/viewer --directory $viewerFeeds --output $viewerFeeds --nottofile"));
    }
}
else{
    // index files in directory and return a json file
    $content = exec(escapeshellcmd(CHRIS_PLUGINS_FOLDER."/viewer/viewer --directory $directory --output $directory --nottofile"));
}

// break on space
$comm = explode(' ', $content);
// replace 1st occurence
$escaped_user = str_replace("/", "\/", CHRIS_USERS);
$rel_comm = preg_replace('/'.$escaped_user.'/', 'users', $comm, 1);
// put it back together
$relative_content = implode(' ', $rel_comm);
//$relative_content = str_replace(CHRIS_USERS, 'users', $content, &$count);
echo json_encode($relative_content);
?>
