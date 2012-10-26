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

// include the controllers
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));

// include the models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user_data.model.php'));

// interface
interface DataControllerInterface
{
  // get the relative location of the data on the filesyten, given its series uid.
  static public function getLocation($series_uid);

  static public function create($user);
  static public function addUser($data_id, $user_id);
}

/**
 * Data controller class
 */
class DataC implements DataControllerInterface {

  /**
   * Get the relative location of the data on the filesyten, given its series uid.
   * getLocation(1233213123) returns "MRN-ID/SERIES_DESC-ID".
   * getLocation(1233213123) returnrs "" if data was not found.
   * Use CHRIS_DATA to get absolute file location:
   * CHRIS_DATA.getLocation(1233213123)
   * @param string $series_uid series uid of the dataset we are looking for
   * @return string the returned string is empty if the data was not found.
   */
  static public function getLocation($series_uid){
    // retrieve the data
    $dataMapper = new Mapper('Data');
    $dataMapper->filter('unique_id = (?)',$series_uid);
    $dataResult = $dataMapper->get();

    // if nothing in DB yet, return empty string
    if(count($dataResult['Data']) == 0)
    {
      return "";
    }

    // get data and patient UIDs
    $data_uid = $dataResult['Data'][0]->id;
    $patient_uid = $dataResult['Data'][0]->patient_id;

    // find the data and the patient location
    // find patient
    $patient_entry = '';
    if ($handle = opendir(CHRIS_DATA)) {
      while (false !== ($entry = readdir($handle))) {
        if($entry != "." && $entry != ".."){
          if (preg_match('/\-'.$patient_uid.'$/', $entry)) {
            // patient directory
            $patient_entry = $entry;
            break;
          }
        }
      }
      closedir($handle);
    }

    // find data
    $data_entry = '';
    if ($handle2 = opendir(CHRIS_DATA.$patient_entry)) {
      while (false !== ($entry2 = readdir($handle2))) {
        if($entry2 != "." && $entry2 != ".."){
          if (preg_match('/\-'.$data_uid.'$/', $entry2)) {
            $data_entry = $entry2;
            break;
          }
        }
      }
      closedir($handle2);
    }

    return $patient_entry.'/'.$data_entry;
  }

  static public function create($plugin){
    $dataObject = new Data();
    $dataObject->plugin = $plugin;
    $dataObject->time = date("Y-m-d H:i:s");
    return Mapper::add($dataObject);
  }

  static public function addUser($data_id, $user_id){
    $user_dataObject = new User_Data();
    $user_dataObject->user_id = $user_id;
    $user_dataObject->data_id = $data_id;
    Mapper::add($user_dataObject);
  }
}
?>