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

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'pacs.class.php'));

// include the models
require_once (joinPaths(CHRIS_VIEW_FOLDER, 'feed.view.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));

// interface
interface FeedControllerInterface
{
  // get HTML representation of the feed
  static public function getHTML($nb_feeds);
  static public function update();

  static public function create($user, $action, $details);
  static public function updateDB(&$object, $data_id);
}

/**
 * Feed controller class
 */
class FeedC implements FeedControllerInterface {

  static public function getHTML($nb_feeds){
    $feed_content = '';
    $i = 0;

    // get feed objects
    $feedMapper = new Mapper('Feed');
    //$feedMapper->filter('status = (?)','0');
    $feedMapper->order('time');
    $feedResult = $feedMapper->get();

    if(count($feedResult['Feed']) >= 1){

      $_SESSION['feed_time'] = $feedResult['Feed'][0]->time;
      $_SESSION['feed_id'] = $feedResult['Feed'][0]->id;

      // for each
      foreach ($feedResult['Feed'] as $key => $value) {
        if($i >= $nb_feeds){
          break;
        }
        $view = new FeedV($value);
        $feed_content .= $view->getHTML();
        $i++;
      }
    }
    else{
      $feed_content .= 'No feed found.';
    }
    return $feed_content;
  }

  static public function update(){
    $feed_update_all = Array();
    $feed_update_all['done']['id'] = Array();
    $feed_update_all['done']['content'] = Array();
    $feed_update_all['progress']['id'] = Array();
    $feed_update_all['progress']['content'] = Array();

    $feed_id = $_SESSION['feed_id'];
    $feed_time = $_SESSION['feed_time'];
    $feed_content = '';

    // get feed objects which are ready
    $feedMapper = new Mapper('Feed');
    //$feedMapper->filter('status = (?)','0');
    $feedMapper->order('time');
    $feedResult = $feedMapper->get();

    // get new feeds
    if(count($feedResult['Feed']) >= 1 && strtotime($feedResult['Feed'][0]->time) > strtotime($feed_time)){
      $old_id = $feed_id;
      $old_time = $feed_time;
      $_SESSION['feed_id'] = $feedResult['Feed'][0]->id;
      $_SESSION['feed_time'] = $feedResult['Feed'][0]->time;
      // for each
      foreach ($feedResult['Feed'] as $key => $value) {
        if(strtotime($value->time) <= strtotime($old_time)){
          break;
        }
        $view = new FeedV($value);
        $feed_update_all['done']['id'][] = $value->id;
        $feed_update_all['done']['content'][] = $view->getHTML();
      }
    }

    // get feeds to be updated
    $feedMapper = new Mapper('Feed');
    $feedMapper->filter('status != (?)','done');
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

  static public function create($user, $action, $details){
    // get user id from name or user_id
    $user_id = FeedC::_GetUserID($user);

    switch($action){
      case "data-down-mrn":
        FeedC::_createDataDownMRN($user_id, $details);
        break;
      default:
        return "Cannot create feed from unknown action";
        break;
    }
  }


  // duplications with PACS PROCESS
  static private function _createDataDownMRN($user_id,$details){
    // details = MRN
    // get information about this MRN for this action
    $results = FeedC::_queryPACS("data-down-mrn", $details);

    // if no data available, return null
    if(count($results[1]) == 0)
    {
      return "No data available from pacs for: ".$action." - ".$details;
    }

    // LOCK DB PAtient on write so no patient will be added in the meanwhile
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
    // if data not there, create it
    // update the feed ids and status
    $feed_ids = '';
    $feed_status = '';
    foreach ($results[1]['SeriesInstanceUID'] as $key => $value){
      // if data not there, create new data and add it
      // if name is not a number, get the matching id

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
        $series_description = str_replace (' ', '_', $results[1]['SeriesDescription'][$key]);
        $series_description = str_replace ('/', '_', $series_description);
        $series_description = str_replace ('?', '_', $series_description);
        $series_description = str_replace ('&', '_', $series_description);
        $series_description = str_replace ('#', '_', $series_description);
        $series_description = str_replace ('\\', '_', $series_description);
        $series_description = str_replace ('%', '_', $series_description);
        $series_description = str_replace ('(', '_', $series_description);
        $series_description = str_replace (')', '_', $series_description);
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

  static private function _getUserID(&$user){
    // if name is not a number, get the matching id
    if(! is_numeric($user)){
      $userMapper = new Mapper('User');
      // retrieve the data
      $userMapper->filter('username = (?)',$user);
      $userResult = $userMapper->get();

      // if nothing in DB yet, return null
      if(count($userResult['User']) == 0)
      {
        return null;
      }
      else{
        return $userResult['User'][0]->id;
      }
    }
  }

  static private function _queryPACS($action, &$details){
    switch ($action){
      case "data-down-mrn":
        // details is mrn in this action
        // get information from the PACS
        $pacs = new PACS(PACS_SERVER, PACS_PORT, CHRIS_AETITLE);
        $study_parameter = Array();
        $study_parameter['PatientID'] = $details;
        $study_parameter['PatientName'] = '';
        $study_parameter['PatientBirthDate'] = '';
        $study_parameter['PatientSex'] = '';
        $series_parameter = Array();
        $series_parameter['SeriesDescription'] = '';
        $series_parameter['NumberOfSeriesRelatedInstances'] = '';
        return $pacs->queryAll($study_parameter, $series_parameter, null);
        break;
      default:
        return "Cannot query pacs for unknown unknown action";
        break;
    }

  }

  static public function updateDB(&$object, $data_id){
    // if feed contains this data id
    $ids = explode(';', $object->model_id);
    $location = array_search($data_id, $ids);
    if($location >= 0){
      $status_array = str_split($object->status);
      $status_array[$location] = '0';
      $object->status = implode('', $status_array);
      // for debugging
      //$object->action .= $location.'-';
      if(intval($object->status) == 0){
        // delete previous object
        //Mapper::delete('Feed', $object->id);
        // create new object with "ready status"
        //$object->action = 'data-down';
        $object->status = 'done';
        $object->time = date("Y-m-d H:i:s");
      }
      Mapper::update($object,  $object->id);
    }

  }
}
?>