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
    $username_displayed = ucwords($username);
    // Format time
    //$time = FeedV::_getTime(date("Y-m-d H:i:s", $object->time));
    // Format simple meta feed
    $feedMetaSimpleMapper= new Mapper('Feed');
    $feedMetaSimpleMapper->ljoin('Meta', 'meta.target_id = feed.id')->filter('meta.target_type=(?)', 'feed')->filter('meta.target_id=(?)', $object->id)->filter('meta.type=(?)', 'simple');
    $feedMetaSimpleResults = $feedMetaSimpleMapper->get();
    $feed_meta_simple = '';

    foreach($feedMetaSimpleResults['Meta'] as $key => $value){
      $feed_meta_simple .= ' <b>'.$value->name.':</b> '.$value->value. '</br>';
      if($value->name == "sharer_id"){
        $username_displayed = 'Shared by '.ucwords(FeedV::_getUsername($value->value));
      }
    }

    // Format advanced meta feed
    $feedMetaAdvancedMapper= new Mapper('Feed');
    $feedMetaAdvancedMapper->ljoin('Meta', 'meta.target_id = feed.id')->filter('meta.target_type=(?)', 'feed')->filter('meta.target_id=(?)', $object->id)->filter('meta.type=(?)', 'advanced');
    $feedMetaAdvancedResults = $feedMetaAdvancedMapper->get();
    $feed_meta_advanced = $feed_meta_simple;

    foreach($feedMetaAdvancedResults['Meta'] as $key => $value){
      $feed_meta_advanced .= ' <b>'.$value->name.' :</b> '.$value->value;
    }

    // create the status text
    $status_text = '<font color=red>Running <i class="icon-refresh rotating_class"></i></font>';
    // ('.$object->status.'%)
    $share_text = '';
    if ($object->status == 100) {
      $status_text = '<font color=green>Done</font>';
      $share_text = '<i class="icon-share-alt"></i>';
    }

    $edit_icon = '';
    if ($object->status == 100) {
      $edit_icon = "<img class='feed_edit_icon show_me focus' src='view/gfx/jigsoar-icons/dark/16_edit_page2.png' onclick='_FEED_.activate_feed_name_edit($(this),event)'>";
    }

    $archive_text = '<i class="icon-remove"></i>';
    if ($object->archive == '1') {
      $archive_text = '<i class="icon-plus"></i>';
    }

    $favorite_text = '<i class="icon-star-empty"></i>';
    if ($object->favorite == '1') {
      $favorite_text = '<i class="icon-star"></i>';
    }

    $t = new Template('feed.html');
    $t -> replace('ID', $object->id);
    $feed_gfx64 = 'plugins/'.$object->plugin.'/feed.png';
    if(!is_file(joinPaths(CHRIS_WWWROOT, $feed_gfx64))){
      $feed_gfx64 = 'http://placehold.it/48x48';
    }
    $t -> replace('IMAGE_SRC', $feed_gfx64);
    $t -> replace('USERNAME', $username_displayed);
    $t -> replace('FEED_NAME', $object->name);
    $t -> replace('FEED_META_CONTENT', $feed_meta_advanced);
    $t -> replace('TIME_FORMATED', $object->time);
    $t -> replace('PLUGIN', ucwords(str_replace('_',' ',$object->plugin)));
    $t -> replace('MORE', '<i class="icon-chevron-right"></i>');
    $t -> replace('STATUS', $object->status);
    $t -> replace('STATUS_TEXT', $status_text);
    $t -> replace('SHARE_TEXT', $share_text);
    $t -> replace('EDIT_ICON', $edit_icon);
    $t -> replace('ARCHIVE_TEXT', $archive_text);
    $t -> replace('FAVORITE_TEXT', $favorite_text);
    // set data browser
    $d = new Template('feed_data_browser.html');
    $feed_folder = joinPaths($username,$object->plugin, $object->name.'-'.$object->id);
    $feed_subfolders = scandir(CHRIS_USERS.$feed_folder);
    natcasesort($feed_subfolders);

    // get rid of eventual notes.html or index.html files
    // find notes.html
    $notes = array_search('notes.html', $feed_subfolders);
    if ($notes) {
      // remove this entry - we don't want to touch it
      unset($feed_subfolders[$notes]);
    }
    // find index.html
    $index = array_search('index.html', $feed_subfolders);
    if ($index) {
      // remove this entry - we don't want to touch it
      unset($feed_subfolders[$index]);
    }

    $d -> replace('FOLDER', $feed_folder);
    $d -> replace('PATIENT_ID', 'fake_patient_id');
    $d -> replace('DATA_ID', 'fake_data_id');
    $t -> replace('DATA_BROWSER', $d);

    // notes
    $n = new Template('feed_notes.html');
    $n -> replace('PATH', joinPaths($username,$object->plugin, $object->name.'-'.$object->id, 'notes.html'));
    $t -> replace('NOTES', $n);

    // set html viewer if "index.html" exists in username/plugin/feed-id/
    if(is_file(joinPaths(CHRIS_USERS, $username,$object->plugin, $object->name.'-'.$object->id, 'index.html' ))){
      $t -> replace('FEED_HTML', 'feed_html.html');
      $t -> replace('HTML_VIEWER', joinPaths('api.php?action=get&what=file&parameters=', $username, $object->plugin, $object->name.'-'.$object->id, 'index.html' ));
    } else{
      $t -> replace('FEED_HTML', '');
    }

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