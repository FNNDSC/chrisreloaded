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
require_once ($_SERVER['DOCUMENT_ROOT_NICOLAS'].'/config.inc.php');

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

/**
 * View class to get different representations of the Feed object
 */
class FeedV implements ObjectViewInterface {

  /**
   * Base feed object
   *
   * @var Feed $user_aet
   */
  private $feed_object = null;
  private $username = '';
  private $action = '';
  private $action_sentence = '';
  private $time = '';
  private $details = null;
  private $image_src = '';

  /**
   * The constructor.
   * Copy given object to local instance.
   *
   * @param[in] $feed_object The feed base object to be converted.
   */
  public function __construct($feed_object) {
    $this->feed_object = $feed_object;
    $this->details = Array();
  }

  /**
   * Get the requiered elements from the database
   *
   */
  private function _format()
  {
    // get user name
    $userMapper = new Mapper('User');

    $userMapper->filter('id = (?)',$this->feed_object->user_id);
    $userResult = $userMapper->get();
    // proceed if user has been found
    if(count($userResult['User']) == 1){
      $this->username = $userResult['User'][0]->username;

      // get feed creation time and format it
      $this->time = str_replace(" ", "_", $this->feed_object->time);
      $this->time = str_replace(":", "_", $this->time);
      $this->time = str_replace("-", "_", $this->time);
      $this->time .= "_time";

      // loop though models and get useful information
      // data details
      if($this->feed_object->model == 'data'){
        // prepare the Details array
        $this->details['Name'] = Array();
        $singleID = explode(";", $this->feed_object->model_id);
        foreach ($singleID as $id) {
          $dataMapper = new Mapper('Data');
          $dataMapper->filter('id = (?)',$id);
          $dataResult = $dataMapper->get();
          if(count($dataResult['Data']) == 1){
            $name = $dataResult['Data'][0]->name;
            $this->details['Name'][] = $name;
          }
        }
      }
      else{
        // result details
        $resultMapper = new Mapper('Result');
        $resultMapper->filter('id = (?)',$this->feed_object->model_id);
        $resultResult = $resultMapper->get();
        if(count($resultResult['Result']) == 1){
          $plugin = $resultResult['Result'][0]->plugin;
          $this->details['Plugin'][] = $plugin;
          $status = $resultResult['Result'][0]->status;
          $this->details['Status'][] = $status;
        }
      }

      // get action and its image
      $this->action = $this->feed_object->action;
      switch ($this->action) {
        case "data-up":
          $this->image_src = 'view/gfx/jigsoar-icons/dark/64_upload.png';
          $this->action_sentence = 'Data uploaded to the PACS.';
          break;
        case "data-down":
          $this->image_src = 'view/gfx/jigsoar-icons/dark/64_download.png';
          $this->action_sentence = 'Data downloaded from the PACS.';
          break;
        case "result-start":
          $this->image_src = 'view/gfx/jigsoar-icons/dark/64_settings.png';
          $this->action_sentence = 'Pipeline started.';
          break;
        case "result-success":
          $this->image_src = 'view/gfx/jigsoar-icons/dark/64_settings.png';
          $this->action_sentence = 'Pipeline finished.';
          break;
        case "result-failure":
          $this->image_src = 'view/gfx/jigsoar-icons/dark/64_settings.png';
          $this->action_sentence = 'Pipeline finished with errors.';
          break;
        default:
          $this->image_src = 'view/gfx/jigsoar-icons/dark/64_close.png';
          $this->action_sentence = '<font color="red">error: Action not known: '.$this->action.'</font>';
          break;
      }
    }
  }

  /**
   * Create the Feed HTML code
   */
  public function getHTML(){
    $this->_format();
    // if user not found, do not return anything
    if($this->username == ''){
      return '';
    }
    // create the html file
    $t = new Template('feed.html');
    $t -> replace('IMAGE_SRC', $this->image_src);
    $t -> replace('USERNAME', $this->username);
    $t -> replace('TIME_FORMATED', $this->time);
    $t -> replace('MAIN', $this->action_sentence);
    $t -> replace('MORE', 'Show details');
    // loop through details
    $feed_details = '';
    if($this->feed_object->model == 'data')
    {
      if(array_key_exists('Name',$this->details) && count($this->details['Name']) > 0){
        foreach ($this->details['Name'] as $key => $value) {
          $d = new Template('feed_data.html');
          $d -> replace('DATA', $value);
          $feed_details .= $d;
        }
      }
      else{
        $feed_details = '<font color="red">error: Data not found: '.$this->feed_object->model_id.'</font>';
      }
    }
    else if($this->feed_object->model == 'result'){
      if(array_key_exists('Plugin',$this->details) && count($this->details['Plugin']) > 0){
        $r = new Template('feed_result.html');
        $r -> replace('PLUGIN', $this->details['Plugin'][0]);
        $r -> replace('STATUS', $this->details['Status'][0]);
        $feed_details .= $r;
      }
      else{
        $feed_details = '<font color="red">error: Plugin not found: '.$this->feed_object->model_id.'</font>';
      }
    }
    else{
      $feed_details = '<font color="red">error: Model not known: '.$this->feed_object->model.'</font>';
    }
    $t -> replace('FEED_DETAILS', $feed_details);
    return $t;
  }

  /**
   * Create the JSON code
   */
  public function getJSON(){
    $this->_format();
    // not implemented
  }
}
?>