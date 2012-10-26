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

// include the controller
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'data.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'plugin.controller.php'));

// Create a feed given a user id, an action and details about the action.
// metadata instead of param?
$feed_id = FeedC::create($_POST['FEED_USER'], $_POST['FEED_PLUGIN']);
FeedC::addMeta($feed_id, $_POST['FEED_META']);

// plugin might be duplicate - to be investigated....
$data_id = DataC::create($_POST['FEED_PLUGIN']);
DataC::addUser($data_id, $_POST['FEED_USER']);
//DataC::addMeta() ??

//PluginC::run($feed_id, $data_id);
// implement here for now....
// metadata is one line, passed as arguments for preprocess, run, postprocess
$arguments = '';
$arguments .= ' --user '.$_POST['FEED_USER'];
foreach($_POST['FEED_META'] as $key => $value){
  $arguments .= ' --'.$key.' '.$value;
}

// blocking process
// run()
// plugin . $args

// status 100% for the feed!

// reminder: in feed_update, special case to handle interactive plugins
// should be flexible (chiran)
// special php view
// special js things
?>