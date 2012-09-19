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
require_once ($_SERVER['DOCUMENT_ROOT_NICOLAS'].'/config.inc.php');

// include the template class
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'template.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));
// inclue the
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, '_session.inc.php'));

// include the feed object and view
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.class.php'));
require_once (joinPaths(CHRIS_VIEW_FOLDER, 'model/feed.view.class.php'));

// store session data
$_SESSION['username'] = 'Ellen';
$_SESSION['feed_id'] = '0';

// shouldnt be there!
function getFeeds($nb_feeds){
  $feed_content = '';
  $i = 0;

  // get feed objects
  $feedMapper = new Mapper('Feed');
  $feedMapper->order('id');
  $feedResult = $feedMapper->get();

  if(count($feedResult['Feed']) >= 1){

    $_SESSION['feed_id'] = $feedResult['Feed'][0]->id;

    // for each
    foreach ($feedResult['Feed'] as $key => $value) {
      if($i >= $nb_feeds){
        break;
      }
      $view = new FeedView($value);
      $feed_content .= $view->getHTML();
      $i++;
    }
  }
  else{
    $feed_content .= 'No feed found.';
  }

  return $feed_content;
}

function homePage() {
  $t = new Template('home.html');
  $t -> replace('CSS', 'css.html');
  $t -> replace('USERNAME', $_SESSION['username']);
  $t -> replace('NAVBAR', 'navbar.html');
  // get last 10 feeds
  $t -> replace('FEED_CONTENT', getFeeds(10));
  $t -> replace('FEED_ID', 'LAST FEED ID: '.$_SESSION['feed_id']);
  $t -> replace('FOOTER', 'footer.html');
  $t -> replace('JAVASCRIPT', 'javascript.html');
  return $t;
}

// execute the test
echo homePage();

?>