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
require_once ('../../config.inc.php');
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
    $this->$feed_object = $feed_object;
    $this->details = new Array();
  }

  /**
   * Get the requiered elements from the database
   *
   */
  private function _format()
  {
    // get user name
    $userMapper = new Mapper('User');
    $userMapper->filter('id = (?)',$this->$feed_object->id);
    $userResult = $userMapper->get();
    $this->username = $userResult['User'][0]->username;

    // get feed creation time
    $this->time = $this->$feed_object->time;

    // prepare the Details array
    $details['Name'] = new Array();

    // loop though models and get useful information
    $singleID = explode(";", $this->$feed_object->model_id);

    foreach ($singleID as $id) {
      if($this->$feed_object->model == 'Data'){
        $dataMapper = new Mapper('Data');
        $dataMapper->filter('id = (?)',$id);
        $dataResult = $dataMapper->get();
        $name = $userResult['Data'][0]->name;
        $details['Name'][] = $name;
      }
      else{
        // only data for now
      }
    }

    // get action and its image
    $this->action = $this->$feed_object->action;
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
   * Ping the PACS.
   *
   * Ping the PACS to make sure the provided address and port are correct.
   *
   * @param[in] int $timeout number of seconds before timeout.
   * @return json string 1 if server has been successfully responded. 0 if server didn't answer within time.
   *
   * @snippet test.pacs.class.php testPing()
   */
  public function getHTML(){
    $this->_format();
    // create the html file
    $t = new Template('template/feed.html');
    $t -> replace('IMAGE_SRC', $this->image_src);
    $t -> replace('USERNAME', $this->username);
    $t -> replace('TIME', $this->time);
    $t -> replace('MAIN', $this->action_sentence);
    $t -> replace('MORE', 'More');
    return $t;
  }

  /**
   * Add parameter to the command to be executed.
   *
   * @param[in] string $name Name of the parameter.
   * @param[in] string $value Value of the parameter.
   * @param[in] boolean $force Replace parameter if it is already defined.
   *
   * @snippet test.pacs.class.php testAddParameter()
   */
  public function getJSON(){
    $this->_format();
    // not implemented
  }
}
?>