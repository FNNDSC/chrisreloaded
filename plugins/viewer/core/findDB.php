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

// here, we always need a session started to access username
session_start();

// exact match on subjectname
$feed_id = is_set($_POST['FEED_ID']);

// go through users' viewer feeds and find the matching ID!
$username = $_SESSION['username'];
$viewerFeeds = CHRIS_USERS.'/'.$username.'/viewer/';

// Find relevant id
$targetFeed = '';
if ($handle = opendir($viewerFeeds)) {
    while (false !== ($file = readdir($handle))) {
    	// if match, we return!
        if (preg_match("/-".$feed_id."/", $file)) {
            $targetFeed = $file;
            break;
        }
    }
    closedir($handle);
}

// return relative path as well


// return the db.json file content
$content = '';
if( $targetFeed != ''){
	$dh  = opendir($viewerFeeds.'/'.$targetFeed);
    while (false !== ($filename = readdir($dh))) {
	    if($filename != '.' && $filename != '..'){
		    $content = file_get_contents($viewerFeeds.'/'.$targetFeed.'/'.$filename.'/db.json');
		    break;
	    }
    }
}

echo json_encode($content);

?>
