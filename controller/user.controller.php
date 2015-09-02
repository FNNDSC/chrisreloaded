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
require_once ('Net/SCP.php');

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
  // Setup the user server directory as needed
  static public function setupServerDir($username, &$ssh);
  // Update user email
  static public function setEmail($uid, $email);
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

    $sshCluster = new Net_SSH2(SERVER_TO_CLUSTER_HOST, SERVER_TO_CLUSTER_PORT);
    if ($sshCluster->login($username, $password)) {

      // the user credentials are valid on the cluster!
      $sshLocal = new Net_SSH2('localhost');
      if ($sshLocal->login($username, $password)) {

        // the user credentials are valid on the chris server!
        // make sure this user is also allowed to access chris by checking the user table and grabbing the user id

        $userMapper = new Mapper('User');
        $userMapper->filter('username=(?)', $username);
        $userResults = $userMapper->get();

        // if user exist, return its id
        if(isset($userResults['User'][0])) {
          // valid user
          $user = $userResults['User'][0]->id;
        }
        // else add user in the database
        else{
          $uid = $sshLocal->exec(bash('id -u '.$username));

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
          self::create($uid, $username);
          $user = $uid;
        }

        // setup server directories if needed
        self::setupServerDir($username, $sshLocal);
      } else {
        // invalid chris server credentials
        $user = -1;
      }

      return $user;
    }

    // invalid cluster credentials
    return -1;

  }

  /**
  * Setup the configuration and home directories on the local Chris server.
  *
  * @param string $username
  */
  static public function setupServerDir($username, &$ssh) {

    $user_path = joinPaths(CHRIS_USERS, $username);
    $user_config_path = joinPaths($user_path, CHRIS_USERS_CONFIG_DIR);

    // create user directory within Chris (if does't exist)
    if(!file_exists($user_config_path)){
      mkdir($user_config_path, 0777, true);      
    }

    // make sure user's directory is open enough
    chmod($user_path, 0777);      
    chmod($user_config_path, 0777);      

    // add default configuration file  (if does't exist)
    $user_config_file = joinPaths($user_config_path, CHRIS_USERS_CONFIG_FILE);
    $chris_config_file = joinPaths(CHRIS_HOME, CHRIS_SRC, CHRIS_USERS_CONFIG_FILE);
    if(!file_exists($user_config_file)){
      $ssh->exec('cp  '.$chris_config_file.' '.$user_config_file. ';chmod 664  '.$user_config_file.';');
    }

    $ssh->exec("sed -i 's/\${USERNAME}/$username/g' $user_config_file");
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

  /**
  * Set a user email address.
  *
  * @param string $uid
  * @param string $email
  */
  static public function setEmail($uid, $email) {

    $userMapper = new Mapper('User');
    $userMapper->filter('id=(?)', $uid);
    $userResults = $userMapper->get();

    // if user exist, return its id
    if(isset($userResults['User'][0])) {

      // update email address
      $userResults['User'][0]->email = $email;
      Mapper::update($userResults['User'][0], $uid);

    }

  }

}


?>
