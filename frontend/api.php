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
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'data.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));

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
        'result' => null);

// TODO here the session has to be verified, actually this should happen in _session.inc.php
// right now, we just check if the session contains a username
if (!isset($_SESSION['username'])) {

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
    $what = 'dont_know';
  }

  if (isset($_GET['id'])){
    $id = $_GET['id'];
  } else if (isset($_POST['id'])) {
    $id = $_POST['id'];
  } else {
    $id = '*';
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
          $result['result'] = DataC::getCount();
        } else if ($what == 'running') {
          $result['result'] = FeedC::getRunningCount($_SESSION['userid']);
        }
        break;
      case "get":
        $result['result'] = 'Not implemented yet.';
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

  $result['status'] = 'done';

}



// return the results
$end_time = new DateTime();
$execution_time = $end_time->diff($start_time);
$result['timestamp'] = $end_time->format('Y-m-d H:i:s');
$result['execution_time'] = $execution_time->format('%s seconds');
echo json_encode($result);

?>