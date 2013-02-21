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
 */
// we define a valid entry point
if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);
// include the configuration file
if(!defined('CHRIS_CONFIG_PARSED'))
  require_once(dirname(dirname(__FILE__)).'/config.inc.php');

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'meta.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));

# inputs
#  feed id
#  status increase

if (count($argv)<3) {
  die("USAGE: set_status.php FEED_ID STATUS or +STATUS_INCREASE\n");
}

$feed_id = $argv[1];
$status = $argv[2];

// grab the feed
$feedResult = Mapper::getStatic('Feed', $feed_id);

if (count($feedResult['Feed']) == 0) {
  die('Invalid feed id.');
}

if ($status{0} == '+') {

  // increasing mode

  echo "Increasing status of feed $feed_id by $status...\n";

  # grab old status
  $old_status = $feedResult['Feed'][0]->status;

  # increase status
  $status = $old_status + $status;

} else {

  // set mode

  echo "Setting status of feed $feed_id to $status...\n";

}

# clamp the addition
if ($status > 100) {
  $status = 100;
}


# send email if status == 100
if ($status == 100) {

  // user's email
  $userMapper = new Mapper('User');
  $userMapper->filter('user.id = (?)', $feedResult['Feed'][0]->user_id);
  $userResult = $userMapper->get();

  // if nothing in DB yet, return -1
  if(count($userResult['User']) > 0)
  {

    $subject = "ChRIS2 - " . $feedResult['Feed'][0]->plugin ." plugin finished";

    $message = "Hello " . $userResult['User'][0]->username . "," . PHP_EOL. PHP_EOL;
    $message .= "Your results are available at:" . PHP_EOL;
    $message .= joinPaths(CHRIS_USERS, $userResult['User'][0]->username, $feedResult['Feed'][0]->plugin, $feedResult['Feed'][0]->name.'-'.$feedResult['Feed'][0]->id) . PHP_EOL. PHP_EOL;
    $message .= "Thank you for using ChRIS.";

    echo "Sending email to ".$userResult['User'][0]->email." since the status == 100.\n";

    // get user email address
    email(CHRIS_PLUGIN_EMAIL_FROM, $userResult['User'][0]->email, $subject, $message);

    //return $userResult['User'][0]->id;
  }


}

# push to database
$feedResult['Feed'][0]->status = $status;
Mapper::update($feedResult['Feed'][0], $feed_id);

echo "New status == $status. Done.\n";

?>