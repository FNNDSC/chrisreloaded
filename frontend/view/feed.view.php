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
    // Format simple meta feed
    $metasMapper= new Mapper('Meta');
    $metasMapper->ljoin('Feed', 'meta.target_id = feed.id')->filter('meta.target_type=(?)', 'feed')->filter('meta.target_id=(?)', $object->id)->filter('meta.type=(?)', 'simple');
    $metasResults = $metasMapper->get();
    $meta_simple = '';

    foreach($metasResults['Meta'] as $key => $value){
      $meta_simple .= ' <b>'.$value->name.' :</b> '.$value->value;
    }
    // Format advanced meta feed
    $metaaMapper= new Mapper('Meta');
    $metaaMapper->ljoin('Feed', 'meta.target_id = feed.id')->filter('meta.target_type=(?)', 'feed')->filter('meta.target_id=(?)', $object->id)->filter('meta.type=(?)', 'advanced');
    $metaaResults = $metaaMapper->get();
    $meta_advanced = $meta_simple;

    foreach($metaaResults['Meta'] as $key => $value){
      $meta_advanced .= ' <b>'.$value->name.' :</b> '.$value->value;
    }

    // Format simple meta data
    $datasMapper= new Mapper('Meta');
    $datasMapper->ljoin('Data', 'meta.target_id = data.id')->filter('meta.target_type=(?)', 'data')->filter('meta.target_id=(?)', $object->id)->filter('meta.type=(?)', 'simple');
    $datasResults = $datasMapper->get();
    $data_simple = '';

    foreach($datasResults['Meta'] as $key => $value){
      $data_simple .= ' <b>'.$value->name.' :</b> '.$value->value;
    }

    // Format advanced meta data
    $dataaMapper= new Mapper('Meta');
    $dataaMapper->ljoin('Data', 'meta.target_id = data.id')->filter('meta.target_type=(?)', 'data')->filter('meta.target_id=(?)', $object->id)->filter('meta.type=(?)', 'advanced');
    $dataaResults = $dataaMapper->get();
    $data_advanced = $data_simple;

    foreach($dataaResults['Meta'] as $key => $value){
      $data_advanced .= ' <b>'.$value->name.' :</b> '.$value->value;
    }

    $t = new Template('feed.html');
    // set id
    //$t -> replace('ID', $id.'_'.$feed_status);
    $gfx64 = 'plugins/'.$object->plugin.'/gfx64.png';
    if(!is_file(joinPaths(CHRIS_WWWROOT, $gfx64))){
      $gfx64 = 'http://placehold.it/64x64';
    }
    $t -> replace('IMAGE_SRC', $gfx64);
    $t -> replace('USERNAME', $username);
    $t -> replace('FEED_META_SIMPLE', $meta_simple);
    $t -> replace('FEED_META_CONTENT', $meta_advanced);
    $t -> replace('DATA_META_CONTENT', $data_advanced);
    $t -> replace('TIME_FORMATED', $time);
    $t -> replace('PLUGIN', $object->plugin);
    $t -> replace('MORE', 'Show details');
    $t -> replace('STATUS', $object->status);
    // set data browser
    // set html viewer

    return $t;
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
   * Create the JSON code
   */
  public static function getJSON($object){
    // not implemented
  }
}
?>