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

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));

require_once ('Net/SSH2.php');

// interface
interface UserControllerInterface
{
  // Get the User ID for a username
  static public function getID($username);
  // Get all users
  static public function get();
  // Login
  static public function login($username, $password);
  // Create new user
  static public function create($username, $password, $email);
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
   * Get all usernames.
   *
   * @return array
   */
  static public function get() {

    $userMapper = new Mapper('User');
    $userResults = $userMapper->get();

    $usernames = array();

    foreach ($userResults['User'] as $key => $value) {
      if ($value->id != 0) {
        $usernames[] = $value->username;
      }
    }

    return $usernames;

  }

  /**
   * Try to login a user using a username and a cleartext password.
   *
   * @param string $username The username.
   * @param string $password The password in cleartext.
   * @return number The user ID of the user or -1 on failure.
   */
  static public function login($username, $password) {

    if (!isset($username) || !isset($password)) return -1;

    $ssh = new Net_SSH2(CLUSTER_HOST);
    if ($ssh->login($username, $password)) {

      // the user credentials are valid!

      // make sure this user is also allowed to access chris by checking the user table and grabbing the user id

      $userMapper = new Mapper('User');
      $userMapper->filter('username=(?)', $username);
      $userResults = $userMapper->get();

      if(isset($userResults['User'][0])) {

        // valid user
        return $userResults['User'][0]->id;

      }

    }

    // invalid credentials
    return -1;

  }

  /**
   * Create a new user.
   *
   * @param string $username
   * @param string $password
   * @param string $email
   */
  static public function create($username, $password, $email) {

    // create user and add it to db
    $userObject = new User();
    $userObject->username = $username;
    $userObject->password = $password;
    $userObject->email = $email;
    return Mapper::add($userObject);

  }

}
?>