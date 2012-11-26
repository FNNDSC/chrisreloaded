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
if (!defined('__CHRIS_ENTRY_POINT__')) die('Invalid access.');

// include the configuration
require_once (dirname(dirname(__FILE__)).'/config.inc.php');


require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, '_session.inc.php'));

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));

// interface
interface UserControllerInterface
{
  // Get the User ID for a username
  static public function getID($username);
  // Hash a cleartext password
  static public function hashPassword($cleartext);
  // Login
  static public function login($username, $password);
}

/**
 * Feed controller class
 */
class UserC implements UserControllerInterface {

  /**
   * Get user id from username. Returns -1 if no match.
   * @return int
   */
  static public function getID($username) {
    $userMapper = new Mapper('User');
    $userMapper->filter('username=(?)', $username);
    $userResults = $userMapper->get();

    if(isset($userResults['User'][0])){
      return $userResults['User'][0]->id;
    }

    return -1;
  }

  /**
   * Hash a clear text password.
   *
   * @param string $cleartext The cleartext password.
   */
  static public function hashPassword($cleartext) {

    return crypt($cleartext);

  }

  /**
   * Try to login a user using a username and a cleartext password.
   *
   * @param string $username The username.
   * @param string $password The password in cleartext.
   * @return number The user ID of the user or -1 on failure.
   */
  static public function login($username, $password) {

    $userMapper = new Mapper('User');
    $userMapper->filter('username=(?)', $username);
    $userMapper->filter('password=(?)', UserC::hashPassword($password));
    $userResults = $userMapper->get();

    if(isset($userResults['User'][0])) {
      // valid user
      return $userResults['User'][0]->id;
    }

    return -1;

  }

}
?>