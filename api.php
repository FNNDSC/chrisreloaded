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
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'file.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'user.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'tag.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'token.controller.php'));

// ssh - to be removed when user::controller works
require_once ('Net/SSH2.php');

// enable cross origin requests
header("Access-Control-Allow-Origin: *");

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

//
// validate the credentials
//
// check if a token was passed
$loggedIn = false;

if (isset($_GET['token'])){
  $token = $_GET['token'];
} else if (isset($_POST['token'])) {
  $token = $_POST['token'];
}

if (isset($token)) {

  // token provided

  $loggedIn = TokenC::validate($token);

} else {

  // no token provided

  // if we don't have a token, we need to login
  $loggedIn = SecurityC::login();

}

if (!$loggedIn) {

  // invalid credentials

  // destroy the session
  session_destroy();

  $result['status'] = 'access denied';

} else {

  // propagate user attributes
  if (isset($_SESSION['username'])) {
    $result['username'] = $_SESSION['username'];
  }

  if (isset($_SESSION['userid'])) {
    $result['userid'] = $_SESSION['userid'];
  }

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

    // check if maintenance is active
    if (CHRIS_MAINTENANCE) {

      $action = "maintenance";

    }

    // valid minimal parameters

    // check actions
    switch($action) {
      case "add":
        if ($what == 'file') {
          $result['result'] = FileC::add($_POST['targetFeed'], $_FILES);
        } else if($what == 'tag'){
          // user_id, tagname, tagcolor
          $result['result'] = TagC::add($_SESSION['userid'], $_POST['tagname'], $_POST['tagcolor']);
        }
        break;
      case "remove":
        if($what == 'tag'){
          // user_id, tag_id
          $result['result'] = TagC::remove($_SESSION['userid'], $_POST['tagid']);
        }
        break;
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
        if($what == 'feed_status'){
          $result['result'] = FeedC::status($_POST['feedid'], $_POST['status'], $_POST['op']);
        }
       if($what == 'tag'){
          $result['result'] = FeedC::tag($_POST['feedid'], $_POST['tagid'], $_POST['remove']);
        }
        else if ($what == 'feed_favorite') {
          $result['result'] = FeedC::favorite($id);
        }
        else if($what == 'feed_share'){
          $result['result'] = FeedC::share($id, $result['userid'], $result['username'], $parameters);
        }
        else if($what == 'feed_archive'){
          $result['result'] = FeedC::archive($id);
        }
        else if($what == 'feed_cancel'){
          // CANCEL ON THE CLUSTER
          $ssh_connection = new Net_SSH2(SERVER_TO_CLUSTER_HOST, SERVER_TO_CLUSTER_PORT);
          if (!$ssh_connection->login($_SESSION['username'], $_SESSION['password'])) {
            die('Login Failed');
          }

          $result['result'] = FeedC::cancel($id, $ssh_connection);

        }
        else if($what == 'file') {
          // READ FROM SERVER
          $ssh_connection = new Net_SSH2(CHRIS_HOST);
          if (!$ssh_connection->login($_SESSION['username'], $_SESSION['password'])) {
            die('Login Failed');
          }

          // here we store content to a file
          $name = joinPaths(CHRIS_USERS, $parameters[0]);

          // make sure to escape line breaks etc.
          $content = escapeshellarg($parameters[1]);

          // replace file contents
          $ssh_connection->exec("echo ".$content." > ".$name);

          $result['result'] = $name.' written.';

        } else if($what == 'feed_merge') {
          // merge on server
          $ssh_connection = new Net_SSH2(CHRIS_HOST);
          if (!$ssh_connection->login($_SESSION['username'], $_SESSION['password'])) {
            die('Login Failed');
          }
          // grab the master id
          $master_feed_id = $id;
          // .. and the slave id
          $slave_feed_id = $parameters;

          // merge the feeds
          $merged = FeedC::mergeFeeds($master_feed_id, $slave_feed_id, $ssh_connection);

          if ($merged) {
            // and archive the slave
            FeedC::archive($slave_feed_id);

            $result['result'] = 'done';

          } else {

            // feeds not merged since there was a collision
            $result['result'] = 'error';

          }

        } else if($what == 'feed_name') {
          // rename on server
          $ssh_connection = new Net_SSH2(CHRIS_HOST);
          if (!$ssh_connection->login($_SESSION['username'], $_SESSION['password'])) {
            die('Login Failed');
          }
          $result['result'] = FeedC::updateName($id, $parameters, $ssh_connection);

        }
        break;
      case "get":
        if ($what == 'feed_updates') {
          $result['result'] = FeedC::updateClient($_SESSION['userid'], $parameters[0]);
        } else if($what == 'feed_previous'){
          $result['result'] = FeedC::scrollClient($_SESSION['userid'], $parameters[0], $parameters[1]);
        } else if($what == 'feed_search'){
          // if 'TAGPLUGIN flan, we do a quick search'
          if(isset ($parameters[1]) && $parameters[1] == 'TAGPLUGIN' ){
            $result['result'] = FeedC::searchTagPlugin($_SESSION['userid'], $parameters[0]);
            }
          else{
            $result['result'] = FeedC::searchClient($_SESSION['userid'], $parameters[0]);
          }
        } else if($what == 'file') {
          $name = joinPaths(CHRIS_USERS, $parameters);

          // enable cross origin requests
          header("Access-Control-Allow-Origin: *");

          // if the file does not exist, just die
          if (!is_file($name)) {
            die();
          }

          $fp = fopen($name, 'rb');

          fpassthru($fp);

          die();

        } else if($what == 'users') {

          $result['result'] = UserC::get();

        } else if($what == 'tag'){

          $result['result'] = TagC::get($_SESSION['userid']);

        } else if($what == 'directory_content'){
          
          // user connects
          // $ssh_connection = new Net_SSH2(CLUSTER_HOST);
          // if (!$ssh_connection->login($_SESSION['username'], $_SESSION['password'])) {
          //   die('Login Failed');
          // }
          //$result['result'] = $ssh_connection->exec('/usr/bin/php5 '.CHRIS_CONTROLLER_FOLDER.'/feed.browser.connector.php -d '.$_POST['dir']);
          //echo $_POST["dir"];
          $output = array();
          exec('/usr/bin/php5 '.CHRIS_CONTROLLER_FOLDER.'/feed.browser.connector.php -d '.$_POST['dir'], $output);
          $result['result'] =  implode($output);

        } else if($what == 'token') {

          $result['result'] = TokenC::create();

        } else if($what == 'dicomscene') {

          $name = joinPaths(CHRIS_USERS, $parameters);

          // this only works with directories
          if (!is_dir($name)) {
            die();
          }

          $dicom_files = glob($name."/{*.dcm,*.dicom}",GLOB_BRACE);

          $output = array("volume"=>array("file"=>array()));

          foreach ($dicom_files as &$df) {

            // 1. create a token
            $token = TokenC::create();
            // 2. generate url (including the token)
            $url = CHRIS_TRANSFER_PROTOCOL."://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF']."?token=".$token."&action=download&what=file&parameters=".joinPaths($parameters,basename($df));
            // 3. attach to output
            $output['volume']['file'][] = $url;

          }

          // return JSON encoded output
          die(json_encode($output));

        }

        break;
      case "download":
        if($what == 'file') {

          // here we don't create JSON but just pass thru the file content
          $name = joinPaths(CHRIS_USERS, $parameters);

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

        }
      case "help":
        $result['result'] = 'Perform actions on ChRIS.. Examples: COUNT: ?action=count&what=feed --- GET: ?action=get&what=feed&id=3 --- All parameters can be GET or POST.';
        break;
      case "maintenance":

        // this is maintenance mode
        $result['result'] = 'maintenance';
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
