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

// include the models
require_once (joinPaths(CHRIS_VIEW_FOLDER, 'feed.view.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'meta.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed_data.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user_data.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_patient.model.php'));

// interface
interface FeedControllerInterface
{
  // get HTML representation of the nth last feeds
  static public function getHTML($user_id, $nb_feeds);
  // probe database to return new feeds to the client
  static public function updateClient($user_id, $feed_new);
  // create a feed given a user id, an action and the related details
  static public function create($user, $plugin, $name);
  // return the number of feeds for a user
  static public function getCount($userid);
  // return the number of running jobs for a user
  static public function getRunningCount($userid);
  // merge two feeds
  static public function mergeFeeds($master_id, $slave_id, &$ssh_connection);
  // update feed name
  static public function updateName($id, $name, &$ssh_connection);
  // cancel the job
  static public function cancel($id, &$ssh_connection);
}

/**
 * Feed controller class
 */
class FeedC implements FeedControllerInterface {

  /**
   * Get HTML representation of the last nth feeds.
   * @param int $nb_feeds number of html feeds to be returned
   * @return string
   */
  static public function getAllHTML($user_id){
    $t = new Template('feed_all.html');
    $t -> replace('FEED_FAV', FeedC::getHTML($user_id, 'favorites'));
    $t -> replace('FEED_RUN', FeedC::getHTML($user_id, 'running'));
    $t -> replace('FEED_FIN', FeedC::getHTML($user_id, 'finished', 20));
    return $t;
  }

  static public function getHTML($user_id, $type, $nb_feeds = -1){
    $feed_content = '';

    // get feeds objects ordered by creation time
    $feedMapper = new Mapper('Feed');
    if($user_id){
      $feedMapper->filter('user_id = (?)', $user_id);
      $feedMapper->filter('archive = (?)', '0');
    }
    // different conditions depending on filter type
    switch ($type){
      case "favorites":
        $feedMapper->filter('favorite = (?)', '1');
        break;
      case "running":
        $feedMapper->filter('status < (?)', '100');
        break;
      case "finished":
        $feedMapper->filter('status >= (?)', '100');
        break;
      default:
        break;
    }

    $feedMapper->order('time');
    $feedResult = $feedMapper->get();

    // if some feeds are available, loop through them
    if(count($feedResult['Feed']) >= 1){
      // get html for the last $nb_feeds
      $i = 0;
      foreach ($feedResult['Feed'] as $key => $value) {
        // exist the loop once we have the required nb of feeds
        if($i >= $nb_feeds && $nb_feeds >= 0){
          break;
        }
        // get only feeds that are not favorites if in "running" or "finished"
        if($type != "favorites"){
          if($value->favorite == 0){
            $feed_content .= FeedV::getHTML($value);
          }
        }
        else{
          // get HTML representation of a feed object with the view class
          $feed_content .= FeedV::getHTML($value);
        }
        $i++;
      }
    }
    else{
      $feed_content .= '';
    }
    return $feed_content;
  }

  /**
   * Get HTML representation of the feed which have not been uploaded to the client
   * and get status information about the feeds which have been uploaded and must be updated.
   *
   * @return array Array containing html for the new feeds and update information for the feeds
   * to be updated.
   * @todo update to support "result" feed, need a "type subarray in progress"
   */
  static public function updateClient($user_id, $feed_new){
    $feed_update = Array();
    $feed_update['new'] = Array();
    $feed_update['new']['id'] = Array();
    $feed_update['new']['content'] = Array();
    $feed_update['new']['status'] = Array();

    // get new time stamps
    // get full html
    $new_ids = Array();

    $feedMapper = new Mapper('Feed');
    if($user_id){
      $feedMapper->filter('user_id = (?)', $user_id);
    }
    $feedMapper->filter('archive = (?)', '0');
    $feedMapper->filter('time > (?)',$feed_new);
    $feedMapper->order('time');
    $feedResult = $feedMapper->get();

    if(count($feedResult['Feed']) >= 1){
      // store latest feed updated at this point
      $old_time = $feed_new;
      // store latest feed updated after this function returns
      $feed_new = $feedResult['Feed'][0]->time;
      // get all feeds which have been created since last upload
      foreach ($feedResult['Feed'] as $key => $value) {
        if($value->time <= $old_time){
          break;
        }
        $feed_update['new']['id'][] = $value->id;
        $feed_update['new']['content'][] = (string)FeedV::getHTML($value);
        $feed_update['new']['status'][] = $value->status;
        $new_ids[] = $value->id;
      }
    }

    // get running feed
    // get status
    $feed_update['running'] = Array();
    $feed_update['running']['id'] = Array();
    $feed_update['running']['content'] = Array();

    $feedMapper = new Mapper('Feed');
    if($user_id){
      $feedMapper->filter('user_id = (?)', $user_id);
    }
    $feedMapper->filter('archive = (?)', '0');
    $feedMapper->filter('status < (?)','100');
    $feedMapper->order('time');
    $feedResult = $feedMapper->get();

    if(count($feedResult['Feed']) >= 1){
      // get all feeds that are still running and that are not new
      foreach ($feedResult['Feed'] as $key => $value) {
        // check id to make sure this is not a new feed
        if(! in_array($value->id, $new_ids)){
          $feed_update['running']['id'][] = $value->id;
          $feed_update['running']['content'][] = $value->status;
          $new_ids[] = $value->id;
        }
      }
    }

    $feed_update['feed_new'] = $feed_new;

    return $feed_update;
  }

  static public function scrollClient($user_id, $feed_old, $nb_feeds = -1){
    $feed_update = Array();
    $feed_update['content'] = Array();

    // get new time stamps
    // get full html
    $count = 0;

    $feedMapper = new Mapper('Feed');
    if($user_id){
      $feedMapper->filter('user_id = (?)', $user_id);
    }
    $feedMapper->filter('archive = (?)', '0');
    $feedMapper->filter('favorite = (?)', '0');
    $feedMapper->filter('time < (?)',$feed_old);
    $feedMapper->filter('status >= (?)', '100');
    $feedMapper->order('time');
    $feedResult = $feedMapper->get();

    if(count($feedResult['Feed']) >= 1){

      foreach ($feedResult['Feed'] as $key => $value) {
        if($nb_feeds >= 0 && $count >= $nb_feeds){
          break;
        }
        $feed_update['content'][] = (string)FeedV::getHTML($value);

        // store latest feed updated after this function returns
        $feed_old = $value->time;

        $count++;
      }
    }

    $feed_update['feed_old'] = $feed_old;

    return $feed_update;
  }

  static public function searchClient($user_id, $searchString, $type="OR"){
    $feed_update = Array();
    $feed_update['content'] = Array();

    $pattern = explode(' ', $searchString);
    $fields = Array();
    $fields[] = 'plugin';
    $fields[] = 'name';
    $fields[] = 'status';

    $feedMapper = new Mapper('Feed');
    $feedMapper->filter('', '', 0, $type);

    $count = 1;
    foreach($fields as $k0 => $v0){
      foreach($pattern as $k1 =>$v1){
        $feedMapper->filter('user_id = (?)', $user_id, $count);
        $feedMapper->filter($v0.' LIKE CONCAT("%",?,"%")', $v1, $count);
        $count++;
      }
    }
    $feedMapper->order('plugin');
    $feedResult = $feedMapper->get();

    if(count($feedResult['Feed']) >= 1){
      // get all feeds which have been created since last upload
      foreach ($feedResult['Feed'] as $key => $value) {
        $feed_update['content'][] = (string)FeedV::getHTML($value);
      }
    }

    return $feed_update;
  }

  static public function share($feed_id, $ownerid, $ownername, $targetname, &$ssh_connection){
    // get target user id
    $userMapper = new Mapper('User');
    $userMapper->filter('username = (?)', $targetname);
    $userResult = $userMapper->get();

    if(count($userResult['User']) >= 1){
      // get feed to be shared
      $feedMapper = new Mapper('Feed');
      $feedMapper->filter('id = (?)', $feed_id);
      $feedResult = $feedMapper->get();

      if(count($feedResult['Feed']) >= 1){
        $feedResult['Feed'][0]->user_id = $userResult['User'][0]->id;
        $feedResult['Feed'][0]->time = microtime(true);
        $feedResult['Feed'][0]->favorite = 0;
        $new_id = Mapper::add($feedResult['Feed'][0]);

        // get parameters, owner meta information
        $metaMapper = new Mapper('Meta');
        // OR confiton between all filters
        $metaMapper->filter('', '', 0, 'OR');
        // first filters
        $metaMapper->filter('name = (?)', 'root_id', 1);
        $metaMapper->filter('target_id = (?)', $feed_id, 1);
        $metaMapper->filter('target_type = (?)', 'feed', 1);
        // second filters
        $metaMapper->filter('name = (?)', 'parameters', 2);
        $metaMapper->filter('target_id = (?)', $feed_id, 2);
        $metaMapper->filter('target_type = (?)', 'feed', 2);
        // second filters
        $metaMapper->filter('name = (?)', 'pid', 3);
        $metaMapper->filter('target_id = (?)', $feed_id, 3);
        $metaMapper->filter('target_type = (?)', 'feed', 3);
        // get results
        $metaResult = $metaMapper->get();
        // for earch result, create same meta with different target id
        if(count($metaResult['Meta']) >= 1){
          foreach($metaResult['Meta'] as $k0 => $v0){
            $v0->target_id = $new_id;

            // make sure to properly update the root_id
            if ($v0->name == 'root_id') {
              $v0->value = $feed_id;
            }

            Mapper::add($v0);
          }
        }

        // add sharer
        FeedC::addMetaS($new_id, 'sharer_id', (string)$ownerid, 'simple');

        // link files on file system
        $targetDirectory = CHRIS_USERS.$ownername.'/'.$feedResult['Feed'][0]->plugin.'/'.$feedResult['Feed'][0]->name.'-'.$feedResult['Feed'][0]->id;

        $destinationDirectory = CHRIS_USERS.$targetname.'/'.$feedResult['Feed'][0]->plugin;
        if(!is_dir($destinationDirectory)){
          // 777? 775
          $old = umask();
          umask(0000);
          mkdir($destinationDirectory, 0775, true);
          umask($old);
        }

        $destinationDirectory .= '/'.$feedResult['Feed'][0]->name.'-'.$new_id;

        // just a link?
        symlink($targetDirectory, $destinationDirectory);

        // we need to change the permission of the target directory to 777 (as the owner)
        // so that the other user can write to this folder
        // but only if the targetDirectory is a directory and not a link (a link means it was re-shared)
        if (is_dir($targetDirectory)) {
          $ssh_connection->exec('chmod -R 777 '.$targetDirectory);
        }

        //if(!is_dir($destinationDirectory)){
        //  recurse_copy($targetDirectory, $destinationDirectory);
        //}
      }
      else{
        return "Invalid feed id: ". $feed_id;
      }
      return '';
    }
    else{
      return "Invalid target name: ". $targetname;
    }
  }

  /**
   * Create a feed given a user id, an action and the related details
   * @param string $user owner of the action
   * @param string $action feed action to be created
   * @param string $details details of the feed action to be created
   */

  static public function addMeta($feed_id, $meta){
    // parse metadata and update db
    foreach($meta as $values){
      $metaObject = new Meta();
      foreach($values as $key => $value){
        $metaObject->$key = $value;
      }
      $metaObject->target_id = $feed_id;
      $metaObject->target_type = 'feed';

      $meta_id = Mapper::add($metaObject);
    }
  }

  static public function addMetaS($feed_id, $name, $value, $type){
    // parse metadata and update db
    $metaObject = new Meta();
    $metaObject->name = $name;
    $metaObject->value = $value;
    $metaObject->type = $type;
    $metaObject->target_id = $feed_id;
    $metaObject->target_type = 'feed';

    return Mapper::add($metaObject);
  }

  static public function setStatus($feed_id, $status){

    $feedResult = Mapper::getStatic('Feed', $feed_id);
    $feedResult['Feed'][0]->status = $status;
    return Mapper::update($feedResult['Feed'][0], $feed_id);

  }

  static public function favorite($feed_id){

    $feedResult = Mapper::getStatic('Feed', $feed_id);
    $invert = (int)!$feedResult['Feed'][0]->favorite;
    $feedResult['Feed'][0]->favorite = $invert;
    Mapper::update($feedResult['Feed'][0], $feed_id);
    return $invert;

  }

  static public function archive($feed_id){

    $feedResult = Mapper::getStatic('Feed', $feed_id);
    $invert = (int)!$feedResult['Feed'][0]->archive;
    $feedResult['Feed'][0]->archive = $invert;
    Mapper::update($feedResult['Feed'][0], $feed_id);
    return $invert;

  }

  static public function create($user_id, $plugin, $name, $status=0){
    // get user id from name or user_id
    //$user_id = FeedC::_GetUserID($user);

    // create feed and add it to db
    $feedObject = new Feed();
    $feedObject->user_id = $user_id;
    $feedObject->name = $name;
    $feedObject->plugin = $plugin;
    $feedObject->time = microtime(true);
    $feedObject->status = $status;
    return Mapper::add($feedObject);
    // new data
    /*     $dataObject = new Data();
    $dataObject->plugin = $plugin;
    $dataObject->time = date("Y-m-d H:i:s");
    $data_id = Mapper::add($dataObject); */

    // new link - feed<->data

    // new link - patient<->data

    // new link - user<->data

    // if plugin == pacs_pull, special action
    // create additional datasets

    // if plugin == drag and drop, check param to create add datasets

    // create feed depending on the actions
    /*     switch($action){
    case "data-down-mrn":
    FeedC::_createDataDownMRN($user_id, $details);
    return $action." sucessfully created";
    break;
    default:
    return "Cannot create feed from unknown action";
    break;
    } */
  }

  /**
   * Convenient method to get a user id from a string.
   * If string can be evaluated as a number, this number is returned.
   *
   * @param string $user username or user id.
   * @return int user id in db
   */
  // get user id from name or user_id
  static private function _getUserID(&$user){
    // if name is not a number, get the matching id
    if(! is_numeric($user)){
      $userMapper = new Mapper('User');
      // retrieve the data
      $userMapper->filter('username = (?)',$user);
      $userResult = $userMapper->get();

      // if nothing in DB yet, return -1
      if(count($userResult['User']) == 0)
      {
        return -1;
      }
      else{
        return $userResult['User'][0]->id;
      }
    }
    else{
      return intval($user);
    }
  }

  /**
   * Return the number of feeds for a user.
   *
   * @param string $userid The user id.
   */
  static public function getCount($userid) {

    if ($userid == 0) {
      // special case for the admin
      $results = DB::getInstance()->execute('SELECT COUNT(*) FROM feed');
    } else {
      $results = DB::getInstance()->execute('SELECT COUNT(*) FROM feed WHERE user_id=(?)',Array($userid));
    }

    return $results[0][0][1];

  }

  /**
   * Return the number of running jobs for a user.
   *
   * @param string $userid The user id.
   */
  static public function getRunningCount($userid) {

    if ($userid == 0) {
      // special case for the admin
      $results = DB::getInstance()->execute('SELECT COUNT(*) FROM feed WHERE status < (?)',Array('100'));
    } else {
      $results = DB::getInstance()->execute('SELECT COUNT(*) FROM feed WHERE user_id=(?) AND status < (?)',Array($userid,'100'));
    }

    return $results[0][0][1];

  }

  /**
   * Merge a slave feed into a master feed. After merging, the slave feed gets
   * archived.
   *
   * @param int $master_id The master feed id (target for merge).
   * @param int $slave_id The slave feed id.
   */
  static public function mergeFeeds($master_id, $slave_id, &$ssh_connection) {

    $username = $_SESSION['username'];

    // grab the master feed folder
    $masterfeedMapper = new Mapper('Feed');
    $masterfeedMapper->filter('id = (?)', $master_id);
    $masterfeedResult = $masterfeedMapper->get();
    $masterfeedDirectory = joinPaths(CHRIS_USERS.$username, $masterfeedResult['Feed'][0]->plugin, $masterfeedResult['Feed'][0]->name.'-'.$masterfeedResult['Feed'][0]->id);

    // grab the slave feed folder
    $slavefeedMapper = new Mapper('Feed');
    $slavefeedMapper->filter('id = (?)', $slave_id);
    $slavefeedResult = $slavefeedMapper->get();
    $slavefeedDirectory = joinPaths(CHRIS_USERS.$username, $slavefeedResult['Feed'][0]->plugin, $slavefeedResult['Feed'][0]->name.'-'.$slavefeedResult['Feed'][0]->id);


    // find the slave feed folders
    $slavefeedSubfolders = scandir($slavefeedDirectory);
    natcasesort($slavefeedSubfolders);
    // always remove . and ..
    unset($slavefeedSubfolders[0]);
    unset($slavefeedSubfolders[1]);
    // find notes.html
    $notes = array_search('notes.html', $slavefeedSubfolders);
    if ($notes) {
      // remove this entry - we don't want to touch it
      unset($slavefeedSubfolders[$notes]);
    }
    // find index.html
    $index = array_search('index.html', $slavefeedSubfolders);
    if ($index) {
      // remove this entry - we don't want to touch it
      unset($slavefeedSubfolders[$index]);
    }

    // try "smart" renaming, if not working, user did something and we do
    // solve collision in a dummy way

    // get number of directories in master directory
    $masterfeedSubfolders = scandir($masterfeedDirectory);
    $startindex = count($masterfeedSubfolders) - 2;

    // link all job directories of the slave in the master folder
    foreach($slavefeedSubfolders as $key => $value) {
      // split name
      $index = explode('_', $value, 2);
      if(count($index) != 2 || !is_numeric($index[0])){
        $index = array('0', $value);
      }
      $slaveindex = intval($index[0]);
      $dest = strval($startindex+$slaveindex).'_'.$index[1];

      while(file_exists($masterfeedDirectory.'/'.$dest)){
        $slaveindex++;
        $dest = strval($startindex+$slaveindex).'_'.$index[1];
      }

      // if doesnt exist
      if (!file_exists($masterfeedDirectory.'/'.$dest)) {
        $ssh_connection->exec('ln -s '.$slavefeedDirectory.'/'.$value.' '.$masterfeedDirectory.'/'.$dest);
      }
      else{
        // uh-oh! collision!
        return false;
      }
    }
    return true;
  }

  /**
   * Cancel a running feed.
   *
   * Returns TRUE if feed is not running anymore.
   *
   * @param int $id The feed id.
   */
  static public function cancel($id, &$ssh_connection) {

    // check if feed status is running
    $feedResult = Mapper::getStatic('Feed', $id);

    if($feedResult['Feed'][0]->status != 100) {

      // job is running or queued
      $cluster_kill_command = str_replace("{FEED_ID}", $feedResult['Feed'][0]->id, CLUSTER_KILL);
      $ssh_connection->exec($cluster_kill_command);

      // set status to canceled
      $status = 101;

      $startTime = $feedResult['Feed'][0]->time;
      $endTime = microtime(true);
      $duration = $endTime - $startTime;

      $feedResult['Feed'][0]->time = $endTime;
      $feedResult['Feed'][0]->duration = $duration;
      $feedResult['Feed'][0]->status = $status;

      // push to the db
      Mapper::update($feedResult['Feed'][0], $id);

      // find all shared versions of this feed
      $metaMapper = new Mapper('Meta');
      $metaMapper->filter('value = (?)', $id);
      $metaMapper->filter('name = (?)', 'root_id');
      $metaMapper->filter('target_id != (?)', $id);
      $metaResult = $metaMapper->get();

      // adjust all statuses
      if(count($metaResult['Meta']) >= 1){
        foreach($metaResult['Meta'] as $key => $value) {

          $feed = Mapper::getStatic('Feed', $value->target_id);

          $feed['Feed'][0]->time = $endTime;
          $feed['Feed'][0]->duration = $duration;
          $feed['Feed'][0]->status = $status;

          // push to the db
          Mapper::update($feed['Feed'][0], $value->target_id);

        }

      }

    }

    return true;

  }

  /**
   * Set the name of a specific feed.
   *
   * @param int $id The feed id.
   * @param string $name The feed name to set.
   */
  static public function updateName($id, $name, &$ssh_connection) {

    $username = $_SESSION['username'];

    $safe_name = sanitize($name);

    // rename feed
    $feedResult = Mapper::getStatic('Feed', $id);
    $old_name = $feedResult['Feed'][0]->name;
    $feedResult['Feed'][0]->name = $safe_name;
    Mapper::update($feedResult['Feed'][0], $id);

    // rename feed folder
    $old_path = joinPaths(CHRIS_USERS.$username, $feedResult['Feed'][0]->plugin, $old_name.'-'.$feedResult['Feed'][0]->id);
    $new_path = joinPaths(CHRIS_USERS.$username, $feedResult['Feed'][0]->plugin, $safe_name.'-'.$feedResult['Feed'][0]->id);

    if(!is_link($new_path) and !file_exists($new_path)){
      $ssh_connection->exec('ln -s '.$old_path.' '.$new_path);
    }

    // find all shared versions of this feed
    $metaMapper = new Mapper('Meta');
    $metaMapper->filter('value = (?)', $id);
    $metaMapper->filter('name = (?)', 'root_id');
    $metaMapper->filter('target_id != (?)', $id);
    $metaResult = $metaMapper->get();

    // adjust all links to the new folder
    if(count($metaResult['Meta']) >= 1){
      foreach($metaResult['Meta'] as $key => $value) {

        $feed = Mapper::getStatic('Feed', $value->target_id);
        $feed = $feed['Feed'][0];

        $user = Mapper::getStatic('User', $feed->user_id);
        $user = $user['User'][0];

        $link_path = joinPaths(CHRIS_USERS.$user->username, $feed->plugin, $feed->name.'-'.$feed->id);

        // remove old link
        unlink($link_path);
        // create new link
        symlink($new_path, $link_path);
      }
    }

    $results = Array();
    $results[] = $safe_name;
    $results[] = joinPaths($username, $feedResult['Feed'][0]->plugin, $safe_name.'-'.$feedResult['Feed'][0]->id);

    return $results;

  }

}
?>