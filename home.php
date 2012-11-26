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

// we define a valid entry point
define('__CHRIS_ENTRY_POINT__', 666);

//define('CHRIS_CONFIG_DEBUG', true);

// include the configuration
require_once ('config.inc.php');

// include the template class
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, '_session.inc.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'template.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'plugin.controller.php'));
require_once (joinPaths(CHRIS_VIEW_FOLDER, 'plugin.view.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'data.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));

// init session data
$_SESSION['username'] = 'Ellen';
$_SESSION['userid'] = '4';
$_SESSION['feed_fin'] = '0000-00-00 00:00:00';
$_SESSION['feed_run'] = '0000-00-00 00:00:00';
$_SESSION['feed_fav'] = '0000-00-00 00:00:00';

function homePage() {
  $t = new Template('home.html');
  $t -> replace('CSS', 'css.html');
  $t -> replace('NAVBAR', 'navbar.html');
  $t -> replace('DATA_COUNT', DataC::getCount());
  $t -> replace('FEED_COUNT', FeedC::getCount($_SESSION['userid']));
  $t -> replace('RUNNING_COUNT', FeedC::getRunningCount($_SESSION['userid']));
  $t -> replace('PLUGIN', PluginC::getHTML());
  $t -> replace('FEED_FAV', FeedC::getHTML('favorites'));
  $t -> replace('FEED_RUN', FeedC::getHTML('running'));
  $t -> replace('FEED_FIN', FeedC::getHTML('finished',20));
  $t -> replace('FEED_DATA_PREVIEW', 'feed_data_preview.html');
  $t -> replace('FOOTER', 'footer.html');
  $t -> replace('JAVASCRIPT', 'javascript.html');
  $t -> replace('USERNAME', $_SESSION['username']);
  return $t;
}

// execute the test
echo homePage();

?>