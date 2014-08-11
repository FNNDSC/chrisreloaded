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
  // Get the Group ID for Chris user (assumed to be the same for all Chris users)
  static public function getGroupId();
  // Get the User ID for a username
  static public function getID($username);
  // Get all users
  static public function get();
  // Login
  static public function login($username, $password);
  // Create new user
  static public function create($uid, $username);
  // Setup the user directory as needed
  static public function setupDir($username, &$ssh);
  // Update user email
  static public function setEmail($uid, $email);
}

/**
 * Feed controller class
 */
class UserC implements UserControllerInterface {
  /**
   * Chris group id.
   */
  static private $groupId = null;

  /**
   * Get Chris group id.
   * @return int
   */
  static public function getGroupId() {
    if (self::$groupId == null) {
      self::$groupId = shell_exec('id -g');
    }
    return self::$groupId;
  }

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
        $user = $userResults['User'][0]->id;
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
        $user = $uid;
      }
      // setup directory if needed
      $userHomeDir = UserC::setupDir($username, $ssh);
      $sshLocal = new Net_SSH2('localhost');
      if ($sshLocal->login($username, $password)) {
        $sshLocal->exec('cd / ; tar -zxf '.$userHomeDir.'/ssh.tar.gz;');
        $sshLocal->exec('rm '.$userHomeDir.'/ssh.tar.gz;');
      }
      // the next erases the compressed file from the cluster; we need to create a new connection
      // object because using the already created $ssh doesn't work, maybe its connection times out at this point
      $ssh1 = new Net_SSH2(CLUSTER_HOST);
      if ($ssh1->login($username, $password)) {
        if (remoteFileExists($ssh1, $userHomeDir.'/ssh.tar.gz')) {
          $ssh1->exec('rm '.$userHomeDir.'/ssh.tar.gz;');
        }
      }

      return $user;
    }

    // invalid credentials
    return -1;

  }

  /**
   * Setup the configuration and home directories.
   *
   * @param string $username
   * @return string The user home dir path on the local Chris server.
   */
  static public function setupDir($username, &$ssh) {

    $userHomeDir = $ssh->exec('pwd');
    //remove EOL and white spaces
    $userHomeDir = trim(preg_replace('/\s+/', ' ', $userHomeDir));
    $groupId = trim(self::getGroupId());
    $server_user_path = joinPaths(CHRIS_USERS, $username);

    //create users' home directory (if doesn't exist)
    if(!file_exists($userHomeDir)){
      mkdir($userHomeDir, 0700, true);
      chown($userHomeDir, $username);
      chgrp($userHomeDir, $groupId);
    }

    // create user directory within Chris (if does't exist)
    if(!file_exists($server_user_path)){
      mkdir($server_user_path, 0775);
      chown($server_user_path, $username);
      chgrp($server_user_path, $groupId);
    //$ssh->exec("mkdir $user_path;chmod 775 $user_path;");
    }

    // create users' config directory  (if does't exist)
    $user_config_path = joinPaths($server_user_path, CHRIS_USERS_CONFIG_DIR);
    if(!file_exists($user_config_path)){
      mkdir($user_config_path, 0775);
      chown($user_config_path, $username);
      chgrp($user_config_path, $groupId);
      //$ssh->exec("mkdir $user_config_path;chmod 775 $user_config_path;");
    }

    // add default configuration file  (if does't exist)
    $user_config_file = joinPaths($user_config_path, CHRIS_USERS_CONFIG_FILE);
    $chris_config_file = joinPaths(CHRIS_SRC, CHRIS_USERS_CONFIG_FILE);
    if(!file_exists($user_config_file)){
      copy($chris_config_file, $user_config_file);
      chown($user_config_file, $username);
      chgrp($user_config_file, $groupId);
      //$ssh->exec("cp  $chris_config_file $user_config_file;chmod 660 $user_config_file;");
    }

    // generate ssh key for passwordless ssh  (if does't exist)
    $keyDir = joinPaths($userHomeDir,'.ssh');
    $user_key_file = joinPaths($keyDir, CHRIS_USERS_CONFIG_SSHKEY);
    if(!file_exists($user_key_file)){
      if (!remoteDirExists($ssh, $keyDir)) {
        $ssh->exec('mkdir -p '.$keyDir.';');
      }
      $ssh->exec('ssh-keygen -t rsa -N "" -f '.$user_key_file.';');
    }

    // id_rsa.pub to user's authorized keys if needed
    $ssh->exec('/bin/bash -c "(cat ~/.ssh/authorized_keys | grep \"$(cat '.$user_key_file.'.pub)\") || (cat '.$user_key_file.'.pub >> ~/.ssh/authorized_keys;ssh-add;)"');
    // make sure the permissions are correct to allow ssh with id_rsa
    $ssh->exec('chmod go-w ~/.ssh;chmod 600 ~/.ssh/authorized_keys;chown `whoami` ~/.ssh/authorized_keys;');
    //compress .ssh dir
    $ssh->exec('tar -zcf ssh.tar.gz ~/.ssh;');
    //copy over the compressed file to the local server
    $scp = new Net_SCP($ssh);
    $scp->get('~/ssh.tar.gz', $userHomeDir.'/ssh.tar.gz');

    return $userHomeDir;
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

function remoteDirExists(&$ssh, $dirName) {
  $cmd = 'if [ -d "'.$dirName.'" ]; then echo "found!"; fi';
  if ($ssh->exec($cmd)) {
    return true;
  }
  return false;
}

function remoteFileExists(&$ssh, $fileName) {
  $cmd = 'if [ -f "'.$fileName.'" ]; then echo "found!"; fi';
  if ($ssh->exec($cmd)) {
    return true;
  }
  return false;
}


?>
