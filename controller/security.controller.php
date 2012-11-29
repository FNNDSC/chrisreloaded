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

// prevent direct calls
if(!defined('__CHRIS_ENTRY_POINT__')) die('Invalid access.');

// include the configuration
require_once (dirname(dirname(__FILE__)).'/config.inc.php');

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'user.controller.php'));

interface SecurityControllerInterface
{

  static public function login_attempt();
  static public function logout_attempt();

  static public function login();
  static public function logout();

}

// here, we always need a session started
session_start();

/**
 * Security controller class
 */
class SecurityC implements SecurityControllerInterface {

  static public function login_attempt() {

    return (isset($_SESSION['username']) || isset($_POST['username']));

  }

  static public function logout_attempt() {

    return (isset($_GET['logout']));

  }

  static public function login() {

    $username = null;
    $password = null;

    if (isset($_SESSION['username']) && isset($_SESSION['password'])) {
      // a session is active
      $username = $_SESSION['username'];
      $password = $_SESSION['password'];
    } else if (isset($_POST['username']) && isset($_POST['password'])) {
      // a login is requested via HTTP POST
      $username = $_POST['username'];
      $password = $_POST['password'];
    }

    // validate the credentials
    $user_id = UserC::login($username, $password);

    if ($user_id == -1) {

      // invalid credentials

      // destroy the session
      session_destroy();
      // .. and forward to the sorry page
      header('Location: ?sorry');
      exit();

    }

    // valid credentials
    // so store everything as part of the session
    $_SESSION['username'] = $username;
    $_SESSION['password'] = $password;
    $_SESSION['userid'] = $user_id;

    $_SESSION['feed_new'] = '00.00';
    $_SESSION['feed_old'] = microtime(true);
    
    return true;

  }

  static public function logout() {

    // destroy the session
    session_destroy();
    // .. and forward to the logged out page
    header('Location: ?logged_out');
    exit();

  }

}


?>