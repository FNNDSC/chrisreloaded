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
require_once ('config.inc.php');
//require_once 'object.template.class.php';

// include the controllers to interact with the database
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'template.class.php'));

// include the models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.class.php'));

// interface
interface FeedViewInterface
{
  // constructor feed object as parameter
  public function __construct($feedObject);
  // get HTML representation of the feed
  public function getHTML();
  // get JSON representation of the feed
  public function getJSON();
}

/**
 * View class to get different representations of the Feed object
 */
class FeedView implements FeedViewInterface {

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
    $this->username = $userResult['User'][0]->username;

    // get feed creation time
    $this->time = $this->feed_object->time;

    // prepare the Details array
    $this->details['Name'] = Array();

    // loop though models and get useful information
    $singleID = explode(";", $this->feed_object->model_id);
    foreach ($singleID as $id) {
      if($this->feed_object->model == 'data'){
        $dataMapper = new Mapper('Data');
        $dataMapper->filter('id = (?)',$id);
        $dataResult = $dataMapper->get();
        $name = $dataResult['Data'][0]->name;
        $this->details['Name'][] = $name;
      }
      else{
        // only data for now
      }
    }

    // get action and its image
    $this->action = $this->feed_object->action;
    switch ($this->action) {
      case "data-up":
        $this->image_src = 'view/gfx/upload500.png';
        $this->action_sentence = 'Data downloaded from the PACS.';
        break;
      case "data-down":
        $this->image_src = 'view/gfx/download500.png';
        $this->action_sentence = 'Data uploaded to the PACS.';
        break;
      case "pipeline-start":
        $this->image_src = 'view/gfx/play500.png';
        $this->action_sentence = 'Pipeline started.';
        break;
      case "pipeline-finish":
        $this->image_src = 'view/gfx/play500.png';
        $this->action_sentence = 'Pipeline finished.';
        break;
      default:
        $this->action_sentence = 'Unkown action.';
        break;
    }
  }

  /**
   * Create the Feed HTML code
   */
  public function getHTML(){
    $this->_format();
    // create the html file
    $t = new Template('model/template/feed.html');
    $t -> replace('IMAGE_SRC', $this->image_src);
    $t -> replace('USERNAME', $this->username);
    $t -> replace('TIME', $this->time);
    $t -> replace('MAIN', $this->action_sentence);
    $t -> replace('MORE', 'More');
    // loop through DATA
    $feed_data = '';

    foreach ($this->details['Name'] as $key => $value) {
      $d = new Template('model/template/feed_data.html');
      $d -> replace('DATA', $value);
      $feed_data .= $d;
    }
    $t -> replace('FEED_DATA', $feed_data);
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