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
require_once ($_SERVER['DOCUMENT_ROOT_NICOLAS'].'/config.inc.php');
require_once ('_session.inc.php');
require_once 'db.class.php';
require_once 'mapper.class.php';

// include the models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.class.php'));
// include the view
require_once (joinPaths(CHRIS_VIEW_FOLDER, 'model/feed.view.class.php'));

$feed_id = $_SESSION['feed_id'];
$feed_content = '';

// get feed objects
$feedMapper = new Mapper('Feed');
$feedMapper->order('id');
$feedResult = $feedMapper->get();

if(count($feedResult['Feed']) >= 1 && $feedResult['Feed'][0]->id > $feed_id){
  $old_id = $feed_id;
  $_SESSION['feed_id'] = $feedResult['Feed'][0]->id > $feed_id;
  // for each
  foreach ($feedResult['Feed'] as $key => $value) {
    if($value->id > $old_id){
      break;
    }
    $view = new FeedView($value);
    $feed_content .= $view->getHTML();
  }
}

//echo $feed_content;
echo $_SESSION['feed_id'];
?>