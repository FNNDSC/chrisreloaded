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

// include chris db interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'db.class.php'));
// include chris mapper interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'mapper.class.php'));
// include pacs helper
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));

require_once ('Net/SSH2.php');

// interface
interface FileControllerInterface
{
  // Add file in given feed
  static public function add($feedID, $files);
  // Remove file from given feed
  static public function remove($feedID, $files, $ssh_connection);
}

/**
 * Feed controller class
 */
class FileC implements FileControllerInterface {

  /**
   * Add file in given feed
   * @return bool
   */
  static public function add($feedID, $files) {

    // get feed path
    $mapper = new Mapper('Feed');
    $mapper->get($feedID);
    $resultsFeed = $mapper->get();

    $mapper = new Mapper('User');
    $mapper->get($resultsFeed['Feed'][0]->user_id);
    $resultsUser = $mapper->get();

    // Misc information
    $userID = $resultsFeed['Feed'][0]->user_id;
    $userName = $resultsUser['User'][0]->username;
    $groupID = shell_exec("sudo su $userName -c 'id -g';");

    $dir = CHRIS_USERS.'/'.$userName.'/file_browser/'.$resultsFeed['Feed'][0]->name.'-'.$resultsFeed['Feed'][0]->id.'/';

    foreach ($files as $key => $value) {
      // escape name first of all!
      $name = sanitize($value['name']);
      $target_tmp_path = '/tmp/'.basename( $name );
      $target_path = $dir.basename( $name );

      if(move_uploaded_file($value['tmp_name'], $target_tmp_path)) {
        // all good, set ownership/permissions correctly
	shell_exec("sudo chown -R $userID:$groupID $target_tmp_path;");
	shell_exec("sudo su $userName -c 'cp -rvp $target_tmp_path $target_path';");
	shell_exec("sudo su $userName -c 'chmod -R 755 $target_path';");
	shell_exec("sudo su $userName -c 'rm -rv $dir/.chris.json';");
	shell_exec("sudo rm -rf $target_tmp_path;");
      } else{
        // oops.... something went wrong
        return $value['error'];
      }

    }

    // all files uploaded successfully
   return 0;
  }

    /**
   * Remove file in given feed
   * @return bool
   */
  static public function remove($feedID, $files, $ssh_connection) {
    // $userMapper = new Mapper('User');
    // $userMapper->filter('username=(?)', $username);
    // $userResults = $userMapper->get();

    // if(isset($userResults['User'][0])){
    //   return $userResults['User'][0]->id;
    // }

    // succeed or not...
    return -1;
  }

}
?>
