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
  static public function getHTML($nb_feeds);
  // probe database to return new feeds to the client
  static public function updateClient();
  // create a feed given a user id, an action and the related details
  static public function create($user, $plugin, $name);
  // return the number of feeds for a user
  static public function getCount($userid);
  // return the number of running jobs for a user
  static public function getRunningCount($userid);
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
  static public function getHTML($type, $nb_feeds = -1){
    $feed_content = '';

    // get feeds objects ordered by creation time
    $feedMapper = new Mapper('Feed');

    // different conditions depending on filter type
    switch ($type){
      case "favorites":
        $feedMapper->filter('favorite = (?)', '1');
        break;
      case "running":
        $feedMapper->filter('favorite != (?)', '1');
        $feedMapper->filter('status != (?)', '100');
        break;
      case "finished":
        $feedMapper->filter('favorite != (?)', '1');
        $feedMapper->filter('status = (?)', '100');
        break;
      default:
        break;
    }

    $feedMapper->order('time');
    $feedResult = $feedMapper->get();

    switch ($type){
      case "favorites":
        $_SESSION['feed_fav'] = $feedResult['Feed'][0]->time;
        break;
      case "running":
        $_SESSION['feed_run'] = $feedResult['Feed'][0]->time;
        break;
      case "finished":
        $_SESSION['feed_fin'] = $feedResult['Feed'][0]->time;
        break;
      default:
        break;
    }

    // if some feeds are available, loop through them
    if(count($feedResult['Feed']) >= 1){
      // get html for the last $nb_feeds
      $i = 0;
      foreach ($feedResult['Feed'] as $key => $value) {
        // exist the loop once we have the required nb of feeds
        if($i >= $nb_feeds && $nb_feeds >= 0){
          break;
        }
        // get HTML representation of a feed object with the view class
        $feed_content .= FeedV::getHTML($value);
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
  static public function updateClient(){
    $feed_update_all = Array();
    /*     $feed_update_all['fav']['id'] = Array();
     $feed_update_all['fav']['content'] = Array(); */
    $feed_update_all['run']['new'] = Array();
    $feed_update_all['run']['new']['id'] = Array();
    $feed_update_all['run']['new']['content'] = Array();
    $feed_update_all['run']['update'] = Array();
    $feed_update_all['run']['update']['id'] = Array();
    $feed_update_all['run']['update']['content'] = Array();
    $feed_update_all['fin']['id'] = Array();
    $feed_update_all['fin']['content'] = Array();

    // get the value of the last finished feed
    $feed_fin = $_SESSION['feed_fin'];
    $feed_content = '';

    // get last feed objects order by creation date
    $feedMapper = new Mapper('Feed');
    $feedMapper->filter('favorite != (?)','1');
    $feedMapper->filter('status = (?)','100');
    $feedMapper->order('time');
    $feedResult = $feedMapper->get();

    // get new feeds
    if(count($feedResult['Feed']) >= 1 && strtotime($feedResult['Feed'][0]->time) > strtotime($feed_fin)){
      // store latest feed updated at this point
      $old_time = $feed_fin;
      // store latest feed updated after this function returns
      $_SESSION['feed_fin'] = $feedResult['Feed'][0]->time;
      // get all feeds which have been created since last upload
      foreach ($feedResult['Feed'] as $key => $value) {
        if(strtotime($value->time) <= strtotime($old_time)){
          break;
        }
        $feed_update_all['fin']['id'][] = $value->id;
        $feed_update_all['fin']['content'][] = (string)FeedV::getHTML($value);
      }
    }

    // get favorites feeds
    // get the value of the last uploaded fav feed
    $feed_run = $_SESSION['feed_run'];
    $feed_content = '';

    // get running feeds
    $feedMapper = new Mapper('Feed');
    $feedMapper->filter('favorite != (?)', '1');
    $feedMapper->filter('status != (?)','100');
    $feedMapper->order('time');
    $feedResult = $feedMapper->get();
    // get new feeds
    if(count($feedResult['Feed']) >= 1){
      // store latest feed updated at this point
      $old_time = $feed_run;
      // store latest feed updated after this function returns
      $_SESSION['feed_run'] = $feedResult['Feed'][0]->time;
      // get all feeds which have been created since last upload
      foreach ($feedResult['Feed'] as $key => $value) {
        if(strtotime($value->time) <= strtotime($old_time)){
          $feed_update_all['run']['update']['id'][] = $value->id;
          $feed_update_all['run']['update']['content'][] = $value->status;
        }
        else{
          $feed_update_all['run']['new']['id'][] = $value->id;
          $feed_update_all['run']['new']['content'][] = (string)FeedV::getHTML($value);
        }
      }
    }

    /*     // get favorites feeds
     // get the value of the last uploaded fav feed
    $feed_fav = $_SESSION['feed_fav'];
    $feed_content = '';

    // get last feed objects order by creation date
    $feedMapper = new Mapper('Feed');
    $feedMapper->filter('favorite = (?)','1');
    $feedMapper->order('time');
    $feedResult = $feedMapper->get();

    // get new feeds
    if(count($feedResult['Feed']) >= 1 && strtotime($feedResult['Feed'][0]->time) > strtotime($feed_fav)){
    // store latest feed updated at this point
    $old_time = $feed_fav;
    // store latest feed updated after this function returns
    $_SESSION['feed_fav'] = $feedResult['Feed'][0]->time;
    // get all feeds which have been created since last upload
    foreach ($feedResult['Feed'] as $key => $value) {
    if(strtotime($value->time) <= strtotime($old_time)){
    break;
    }
    $feed_update_all['fav']['id'][] = $value->id;
    $feed_update_all['fav']['content'][] = (string)FeedV::getHTML($value);
    }
    } */


    return $feed_update_all;
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

  static public function setFavorite($feed_id, $favorite="1"){

    $feedResult = Mapper::getStatic('Feed', $feed_id);
    $invert = (int)!$feedResult['Feed'][0]->favorite;
    $feedResult['Feed'][0]->favorite = $invert;
    Mapper::update($feedResult['Feed'][0], $feed_id); 
    return $invert;

  }

  static public function create($user_id, $plugin, $name){
    // get user id from name or user_id
    //$user_id = FeedC::_GetUserID($user);

    // create feed and add it to db
    $feedObject = new Feed();
    $feedObject->user_id = $user_id;
    $feedObject->name = $name;
    $feedObject->plugin = $plugin;
    $feedObject->time = date("Y-m-d H:i:s");
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

    $results = DB::getInstance()->execute('SELECT COUNT(*) FROM feed WHERE user_id=(?)',Array($userid));

    return $results[0][0][1];

  }

  /**
   * Return the number of running jobs for a user.
   *
   * @param string $userid The user id.
   */
  static public function getRunningCount($userid) {

    $results = DB::getInstance()->execute('SELECT COUNT(*) FROM feed WHERE user_id=(?) AND status=(?)',Array($userid,'0'));

    return $results[0][0][1];

  }

}
?>