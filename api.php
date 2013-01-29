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
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'security.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'data.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'user.controller.php'));

// return values
$start_time = new DateTime();
$result = array(
    'status' => 'not-processed',
    'username' => 'unknown',
    'userid' => -1,
    'timestamp' => '',
    'execution_time' => 0,
    'action' => null,
    'what' => null,
    'id' => null,
    'parameters' => null,
    'result' => null);


// validate the credentials
if (!SecurityC::login()) {

  // invalid credentials

  // destroy the session
  session_destroy();

  $result['status'] = 'access denied';

} else {

  // propagate user attributes
  $result['username'] = $_SESSION['username'];
  $result['userid'] = $_SESSION['userid'];

  //
  // API FUNCTIONS
  //
  if (isset($_GET['action'])){
    $action = $_GET['action'];
  } else if (isset($_POST['action'])) {
    $action = $_POST['action'];
  } else {
    $action = 'ping';
  }

  if (isset($_GET['what'])){
    $what = $_GET['what'];
  } else if (isset($_POST['what'])) {
    $what = $_POST['what'];
  } else {
    $what = '*';
  }

  if (isset($_GET['id'])){
    $id = $_GET['id'];
  } else if (isset($_POST['id'])) {
    $id = $_POST['id'];
  } else {
    $id = '*';
  }

  if (isset($_GET['parameters'])){
    $parameters = $_GET['parameters'];
  } else if (isset($_POST['parameters'])) {
    $parameters = $_POST['parameters'];
  } else {
    $parameters = Array();
  }

  // validate inputs, we need at least action + what
  if ($action != 'ping' && $action != 'help' && $what == 'dont_know') {

    // this is an error
    $result['status'] = 'error';
    $result['result'] = 'parameter "what" required';

  } else {

    // valid minimal parameters

    // check actions
    switch($action) {
      case "count":
        if ($what == 'feed') {
          $result['result'] = FeedC::getCount($_SESSION['userid']);
        } else if ($what == 'data') {
          $result['result'] = DataC::getCount($_SESSION['userid']);
        } else if ($what == 'running') {
          $result['result'] = FeedC::getRunningCount($_SESSION['userid']);
        } else if ($what == 'datafeedrunning') {
          $result['result'] = Array();
          $result['result'][] = DataC::getCount($_SESSION['userid']);
          $result['result'][] = FeedC::getCount($_SESSION['userid']);
          $result['result'][] = FeedC::getRunningCount($_SESSION['userid']);
        }
        break;
      case "set":
        if ($what == 'feed_favorite') {
          $result['result'] = FeedC::favorite($id);
        }
        else if($what == 'feed_share'){
          $result['result'] = FeedC::share($id, $result['userid'], $result['username'], $parameters[0]);
        }
        else if($what == 'feed_archive'){
          $result['result'] = FeedC::archive($id);
        }
        else if($what == 'file') {

          // here we store content to a file
          $name = joinPaths(CHRIS_USERS, $parameters[0]);

          $fp = fopen($name, 'w');

          fwrite($fp, $parameters[1]);
          $result['result'] = $name.' written.';

        } else if($what == 'feed_merge') {

          // grab the master id
          $master_feed_id = $id;
          // .. and the slave id
          $slave_feed_id = $parameters;

          // merge the feeds
          FeedC::mergeFeeds($master_feed_id, $slave_feed_id);

          // and archive the slave
          FeedC::archive($slave_feed_id);

          $result['result'] = 'done';

        }
        break;
      case "get":
        if ($what == 'feed_updates') {
          $result['result'] = FeedC::updateClient($_SESSION['userid'], $parameters[0]);
        } else if($what == 'feed_previous'){
          $result['result'] = FeedC::scrollClient($_SESSION['userid'], $parameters[0], 5);
        } else if($what == 'feed_search'){
          $result['result'] = FeedC::searchClient($_SESSION['userid'], $parameters[0]);
        } else if($what == 'file') {

          // here we don't create JSON but just pass thru the file content
          $name = joinPaths(CHRIS_USERS, $parameters);

          // enable cross origin requests
          header("Access-Control-Allow-Origin: *");

          // if the file does not exist, just die
          if (!is_file($name)) {
            die();
          }

          $fp = fopen($name, 'rb');

          header("Content-Length: " . filesize($name));
          header("Content-Type: application/octet-stream");
          header("Content-Disposition: attachment; filename=\"".basename($name)."\"");

          fpassthru($fp);

          die();

        } else if($what == 'users') {

          $result['result'] = UserC::get();

        }

        break;
      case "help":
        $result['result'] = 'Perform actions on ChRIS.. Examples: COUNT: ?action=count&what=feed --- GET: ?action=get&what=feed&id=3 --- All parameters can be GET or POST.';
        break;
      case "ping":
      default:
        // this is a ping
        $result['result'] = 'Up and running.';
    }

  }

  $result['action'] = $action;
  $result['what'] = $what;
  $result['id'] = $id;
  $result['parameters'] = $parameters;

  $result['status'] = 'done';

}



// return the results
$end_time = new DateTime();
$execution_time = $end_time->diff($start_time);
$result['timestamp'] = $end_time->format('Y-m-d H:i:s');
$result['execution_time'] = $execution_time->format('%s seconds');
echo json_encode($result);

?>