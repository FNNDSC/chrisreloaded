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
//require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'pacs.class.php'));

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
  // update feeds which contain given data_id
  static public function updateDB(&$object, $data_id);
  // create a feed given a user id, an action and the related details
  static public function create($user, $plugin, $name);
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
  static public function getHTML($nb_feeds){
    $feed_content = '';

    // get feeds objects ordered by creation time
    $feedMapper = new Mapper('Feed');
    $feedMapper->order('time');
    $feedResult = $feedMapper->get();

    // if some feeds are available, loop through them
    if(count($feedResult['Feed']) >= 1){
      // store creation date of the most up to date feed
      $_SESSION['feed_time'] = $feedResult['Feed'][0]->time;
      // get html for the last $nb_feeds
      $i = 0;
      foreach ($feedResult['Feed'] as $key => $value) {
        // exist the loop once we have the required nb of feeds
        if($i >= $nb_feeds){
          break;
        }
        // get HTML representation of a feed object with the view class
        $feed_content .= FeedV::getHTML($value);
        $i++;
      }
    }
    else{
      $feed_content .= 'No feed available.';
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
    $feed_update_all['done']['id'] = Array();
    $feed_update_all['done']['content'] = Array();
    $feed_update_all['progress']['id'] = Array();
    $feed_update_all['progress']['content'] = Array();

    // get the value of the last uploaded feed
    $feed_time = $_SESSION['feed_time'];
    $feed_content = '';

    // get last feed objects order by creation date
    $feedMapper = new Mapper('Feed');
    $feedMapper->order('time');
    $feedResult = $feedMapper->get();

    // get new feeds
    if(count($feedResult['Feed']) >= 1 && strtotime($feedResult['Feed'][0]->time) > strtotime($feed_time)){
      // store latest feed updated at this point
      $old_time = $feed_time;
      // store latest feed updated after this function returns
      $_SESSION['feed_time'] = $feedResult['Feed'][0]->time;
      // get all feeds which have been created since last upload
      foreach ($feedResult['Feed'] as $key => $value) {
        if(strtotime($value->time) <= strtotime($old_time)){
          break;
        }
        $feed_update_all['done']['id'][] = $value->id;
        $feed_update_all['done']['content'][] = (string)FeedV::getHTML($value);
      }
    }

    // get feeds to be updated
    $feedMapper = new Mapper('Feed');
    $feedMapper->filter('status != (?)','100');
    $feedMapper->order('time');
    $feedResult = $feedMapper->get();
    if(count($feedResult['Feed']) >= 1){
      foreach ($feedResult['Feed'] as $key => $value) {
        $feed_update_all['progress']['id'][] = $value->id;
        $feed_update_all['progress']['content'][] = $value->status;
      }
    }

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

    Mapper::add($metaObject);
  }

  static public function setStatus($feed_id, $status){

    $feedResult = Mapper::getStatic('Feed', $feed_id);
    $feedResult['Feed'][0]->status = $status;
    Mapper::update($feedResult['Feed'][0], $feed_id);

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
   * Create data download from MRN feed.
   * Details is the MRN to be downloaded.
   * @param int $user_id owner of the action
   * @param string $details details of the action: "MRN to be downloaded"
   * @return string
   * @todo couple of duplication with pacs_process.php
   */
  static private function _createDataDownMRN($user_id,$details){
    // get PACS information about this MRN for this action
    $results = FeedC::_queryPACS("data-down-mrn", $details);

    // if no data available, return null
    if(count($results[1]) == 0)
    {
      return "No data available from pacs for: data-down-mrn - ".$details;
    }

    // LOCK DB Patient on write so no patient will be added in the meanwhile
    $db = DB::getInstance();
    $db->lock('patient', 'WRITE');

    // look for the patient
    $patientMapper = new Mapper('Patient');
    $patientMapper->filter('patient_id = (?)',$results[0]['PatientID'][0]);
    $patientResult = $patientMapper->get();
    $patient_chris_id = -1;
    // create patient if doesn't exist
    if(count($patientResult['Patient']) == 0)
    {
      // create patient model
      $patientObject = new Patient();
      $patientObject->name = $results[0]['PatientName'][0];
      $date = $results[0]['PatientBirthDate'][0];
      $datetime =  substr($date, 0, 4).'-'.substr($date, 4, 2).'-'.substr($date, 6, 2);
      $patientObject->dob = $datetime;
      $patientObject->sex = $results[0]['PatientSex'][0];
      $patientObject->patient_id = $results[0]['PatientID'][0];
      // add the patient model and get its id
      $patient_chris_id = Mapper::add($patientObject);
    }
    // else get its id
    else{
      $patient_chris_id = $patientResult['Patient'][0]->id;
    }

    // unlock patient table
    $db->unlock();

    // loop through all data to be downloaded
    // if data not there, create rown in the data db table
    // update the feed ids and status
    $feed_ids = '';
    $feed_status = '';
    foreach ($results[1]['SeriesInstanceUID'] as $key => $value){
      // lock data db so no data added in the meanwhile
      $db = DB::getInstance();
      $db->lock('data', 'WRITE');

      // retrieve the data
      $dataMapper = new Mapper('Data');
      $dataMapper->filter('unique_id = (?)',$value);
      $dataResult = $dataMapper->get();
      // if nothing in DB yet, add it
      if(count($dataResult['Data']) == 0)
      {
        // add data and get its id
        $dataObject = new Data();
        $dataObject->unique_id = $value;
        $dataObject->nb_files = $results[1]['NumberOfSeriesRelatedInstances'][$key];
        // set series description
        // check if available...
        $dataObject->patient_id = $patient_chris_id;
        $dataObject->name = '';

        // make sure all fiels are provided
        $series_description = sanitize($results[1]['SeriesDescription'][$key]);
        $dataObject->name .= $series_description;
        $dataObject->time = '';
        $dataObject->meta_information = '';
        // add data in db
        $feed_ids .= Mapper::add($dataObject) . ';';
      }
      // else get its id
      else{
        $feed_ids .= $dataResult['Data'][0]->id . ';';
      }
      $feed_status .= '1';
      $db->unlock();
    }

    // create feed and add it to db
    $feedObject = new Feed();
    $feedObject->user_id = $user_id;
    $feedObject->action = 'data-down';
    $feedObject->model = 'data';
    $feedObject->model_id = $feed_ids;
    $feedObject->time = date("Y-m-d H:i:s");
    $feedObject->status = $feed_status;
    Mapper::add($feedObject);

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
   * Update feed in database for the given data id.
   * If feed contains data id, update it.
   * @param Feed $object
   * @param int $data_id
   */
  static public function updateDB(&$object, $data_id){
    // convert list of data ids to array
    $ids = explode(';', $object->model_id);
    // look for data_id in array
    $location = array_search($data_id, $ids);
    // if data is there, update db
    if($location >= 0){
      $status_array = str_split($object->status);
      $status_array[$location] = '0';
      $object->status = implode('', $status_array);
      if(intval($object->status) == 0){
        $object->status = 'done';
        $object->time = date("Y-m-d H:i:s");
      }
      Mapper::update($object,  $object->id);
    }
  }
}
?>