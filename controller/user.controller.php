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
  static public function create($uid, $username);
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

      // if user exist, return its id
      if(isset($userResults['User'][0])) {

        // valid user
        return $userResults['User'][0]->id;

      }
      // else add user in the database
      else{
        $uid = $ssh->exec('id -u '.$username);

        $report = "=========================================". PHP_EOL;
        $report .= date('Y-m-d h:i:s'). ' ---> New user logging in...'. PHP_EOL;
        $report .= $username. PHP_EOL;
        $report .= $uid. PHP_EOL;

        // log logging information
        $logFile = joinPaths(CHRIS_LOG,'new_user.log');
        $fh = fopen($logFile, 'a')  or die("can't open file");
        fwrite($fh, $report);
        fclose($fh);

        // returns 0 since the user table doesnt have auto increment
        UserC::create($uid, $username);

        $user_path = joinPaths(CHRIS_USERS, $username);
        // create home directory (if does't exist)
        if(!file_exists($user_path)){

          $ssh->exec("mkdir $user_path;chmod 775 $user_path;");

        }

        // create config directory
        $user_config_path = joinPaths($user_path, CHRIS_USERS_CONFIG_DIR);
        if(!file_exists($user_config_path)){

          $ssh->exec("mkdir $user_config_path;chmod 775 $user_config_path;");

        }

        // add default configuration file
        $user_config_file = joinPaths($user_config_path, CHRIS_USERS_CONFIG_FILE);
        $chris_config_file = joinPaths(CHRIS_SRC, CHRIS_USERS_CONFIG_FILE);
        if(!file_exists($user_config_file)){

          $ssh->exec("cp  $chris_config_file $user_config_file;chmod 660 $user_config_file;");

        }
        
        return $uid;
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
  static public function create($uid, $username) {

    // create user and add it to db
    $userObject = new User();
    $userObject->id = strval($uid);
    $userObject->username = $username;
    $userObject->password = 'password';
    $userObject->email = $username.CHRIS_MAIL_SUFFIX;
    return Mapper::add($userObject);

  }

}
?>