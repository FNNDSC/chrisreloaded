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
if (!defined('__CHRIS_ENTRY_POINT__'))
  die('Invalid access.');

// include the configuration
require_once (dirname(dirname(__FILE__)).'/config.inc.php');

// include the object view interface
require_once ('object.view.php');

// include the controllers to interact with the database
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'template.class.php'));

// include the models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'result.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.model.php'));

/**
 * View class to get different representations of the Feed object.
 */
class FeedV implements ObjectViewInterface {

  /**
   * Get HTML representation of the given object.
   * @param Feed $object object to be converted to HMTL.
   * @return string HTML representation of the object
   */
  public static function getHTML($object){
    // Format username
    $username = FeedV::_getUsername($object->user_id);
    // Format time
    $time = FeedV::_getTime($object->time);

    switch($object->action){
      case "data-down":
        return FeedV::_getHTMLDataDown($username, $object->id, $object->model_id, $time, $object->status);
        break;
      case "data-up":
        break;
      case "results":
        break;
      default:
        return "Unknown feed action";
        break;
    }

  }

  /**
   * Get username from user id.
   * @param int $userid user ID
   * @return string username
   */
  private static function _getUsername($userid){
    // get user name
    $userMapper = new Mapper('User');

    $userMapper->filter('id = (?)',$userid);
    $userResult = $userMapper->get();
    $username = "Unknown user";

    if(count($userResult['User']) == 1){
      $username = $userResult['User'][0]->username;
    }

    return $username;
  }

  /**
   * Get feed creation time in an easy to manipulate format.
   * 2012-09-09 12:12:12   => 2012_09_09_12_12_12
   * @param string $time time to be converted
   * @return string formated time stamp
   */
  private static function _getTime($time){
    $formated_time = str_replace(" ", "_", $time);
    $formated_time = str_replace(":", "_", $formated_time);
    $formated_time = str_replace("-", "_", $formated_time);
    $formated_time .= "_time";
    return $formated_time;
  }

  /**
   * Get HTML for the data_down action
   *
   * @param string $username username of the action owner.
   * @param int $id id of the feed
   * @param string $model_id id of the models contained in the feed
   * @param string $time formated feed creation time
   * @param string $status feed status
   *
   * @return string Formtaed HTML representing the given action.
   */
  private static function _getHTMLDataDown($username, $id, $model_id, $time, $status){
    // required patient information
    $patient_id = '';
    $patient_name = '';
    $patient_sex = '';
    $patient_dob = '';
    $patient_real_id = '';
    // requiered data information
    $data_id = explode(";", $model_id);
    $data_status = array_fill(0, count($data_id) -1, 0);
    $data_name = Array();
    $data_db_id = Array();
    $data_real_id = Array();
    $data_time = '';
    // requiered feed information
    $feed_status = 'feed_done';
    $feed_image = '';
    $feed_action_desc = '';
    $feed_what_desc = '';
    $feed_percent = 0;
    $feed_details = '';

    if($status != 'done'){
      $data_status = str_split($status);
      $feed_status = 'feed_progress';
    }

    foreach ($data_id as $key => $value) {
      // get data
      $dataMapper = new Mapper('Data');
      $dataMapper->filter('id = (?)',$value);
      $dataResult = $dataMapper->get();
      // if data is there, get relevant information
      if(count($dataResult['Data']) == 1){
        $data_name[] = $dataResult['Data'][0]->name;
        $data_real_id[] = $dataResult['Data'][0]->unique_id;
        $data_db_id[] = $dataResult['Data'][0]->id;
        $data_time = $dataResult['Data'][0]->time;
        $data_nb_files[] = $dataResult['Data'][0]->nb_files;
        $feed_percent += $data_status[$key];
        // get patient information
        if($patient_name == ''){
          $patientMapper = new Mapper('Patient');
          $patientMapper->filter('id = (?)',$dataResult['Data'][0]->patient_id);
          $patientResult = $patientMapper->get();
          // if patient is there, get relevant information
          if(count($patientResult['Patient']) == 1){
            $patient_real_id = $dataResult['Data'][0]->patient_id;
            $patient_name = $patientResult['Patient'][0]->name;
            $patient_dob = $patientResult['Patient'][0]->dob;
            $patient_sex = $patientResult['Patient'][0]->sex;
            $patient_id = $patientResult['Patient'][0]->patient_id;
          }
        }
      }
    }

    $feed_image = CHRIS_VIEW_FOLDER_RELATIVE.'/gfx/jigsoar-icons/dark/48_download.png';
    $feed_action_desc = 'PACS Pull';
    if ($feed_status == 'feed_done'){
      $feed_what_desc = 'Data for <b>MRN '. $patient_id .'</b> was added.';
      $feed_progress = '<font color="green">Done</font>';
    }
    else{
      $feed_percent = round((1 - $feed_percent/(count($data_id)-1))*100);
      $feed_what_desc = 'Retrieving data for <b>MRN '. $patient_id .'</b>';
      $feed_progress = '<font color="red">'.$feed_percent.'%</font>';
      //$feed_what_desc = 'started to download data from <b>Patient ID '. $patient_id .' <FONT COLOR="RED">IN PROGRESS <span class="feed_progress_status">'.$feed_percent.'%</span></FONT> </b> ';
    }

    // create HTML with templates
    $t = new Template('feed.html');
    $t -> replace('ID', $id.'_'.$feed_status);
    $t -> replace('IMAGE_SRC', $feed_image);
    $t -> replace('USERNAME', $username);
    $t -> replace('WHAT', $feed_what_desc);
    $t -> replace('TIME_FORMATED', $time);
    $t -> replace('ACTION', $feed_action_desc);
    $t -> replace('MORE', 'Show details');
    $t -> replace('STATUS', $feed_status);
    $t -> replace('PROGRESS', $feed_progress);

    // we want to extract the scan date and calculate the age at the time of scan
    $scan_date_array = explode(' ', $data_time);
    $scan_date_as_datetime = new DateTime($scan_date_array[0]);
    $patient_dob_as_datetime = new DateTime($patient_dob);
    $scan_age = $scan_date_as_datetime -> diff($patient_dob_as_datetime);
    $scan_age = $scan_age->y.' yr '.$scan_age->m.' m';

    // add patient information
    $d = new Template('feed_data_patient.html');
    $d -> replace('NAME', $patient_name);
    $d -> replace('DOB', $patient_dob);
    $d -> replace('SEX', $patient_sex);
    $d -> replace('ID', $patient_id);
    $d -> replace('SCANDATE', $scan_date_array[0]);
    $d -> replace('SCANAGE', $scan_age);
    $feed_details .= $d;

    $d = new Template('feed_data_browser.html');
    $d -> replace('FOLDER', $patient_id.'-'.$patient_real_id);
    $d -> replace('PATIENT_ID', $patient_id);
    $d -> replace('DATA_ID', $data_db_id[0]);
    $feed_details .= $d;

    // add data information
    foreach ($data_name as $key => $value) {
      $d = new Template('feed_data.html');
      if($data_status[$key] == 0){
        $d -> replace('VISIBILITY', 'inline');
      }
      else{
        $d -> replace('VISIBILITY', 'none');
      }
      $d -> replace('DATA', $value);
      $d -> replace('DATA_ID', $data_db_id[$key]);
      $d -> replace('PATIENT_ID', $patient_id);
      $d -> replace('NB_FILES', $data_nb_files[$key]);
      $d -> replace('FULL_ID', str_replace ('.', '_', $data_real_id[$key]));
      //$feed_details .= $d;
    }

    $t -> replace('FEED_DETAILS', $feed_details);
    return $t -> __toString();
  }

  /**
   * Create the JSON code
   */
  public static function getJSON($object){
    // not implemented
  }
}
?>