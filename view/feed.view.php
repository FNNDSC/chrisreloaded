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
  public static function getHTML($object, $shine = ''){
    // Format username
    $username = FeedV::_getUsername($object->user_id);
    $username_displayed = ucwords($username);
    $shared_feed = false;
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
        $shared_feed = true;
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

    $feed_status = 'feed_success';
    $feed_folder = joinPaths(CHRIS_USERS, $username,$object->plugin, $object->name.'-'.$object->id);
    if ($handle = opendir($feed_folder)) {

      while (false !== ($entry = readdir($handle))) {

        if($entry != "." && $entry != ".."){

          $match = glob($feed_folder.'/'.$entry.'/_chrisRun_/ERR*');
          if(count($match)){
            $feed_status = 'feed_failure';
            break;
          }

          if($feed_status == 'feed_failure'){
            break;
          }

        }
      }
    }

    // create the status text
    $status_text = '<span style="background-color: #009DE9;color: #fff;padding: 1px 2px;">Running<i class="icon-refresh rotating_class"></i></span>';
    // ('.$object->status.'%)
    if ($feed_status == 'feed_failure') {
      $status_text = '<span style="background-color: #E90000;color: #fff;padding: 1px 2px;">Errors</span>';
      $feed_status = 'feed_success';
    }else if($object->status == 100){
      $status_text = '<span style="background-color: #41E900;color: #fff;padding: 1px 2px;">Success</span>';
    }else if ($object->status == 101) {
      $status_text = '<span style="background-color: #E95D00;color: #fff;padding: 1px 2px;">Canceled</span>';
    }

    $share_icon = 'icon-share-alt';

    $tag_icon = 'icon-tag';

    $archive_icon = 'icon-remove';
    $archive_text = 'Archive';
    if ($object->archive == '1') {
      $archive_icon = 'icon-plus';
      $archive_text = 'Restore';
    }

    $favorite_icon = 'icon-star-empty';
    $favorite_text = 'Favorite';
    if ($object->favorite == '1') {
      $favorite_icon = 'icon-star';
      $favorite_text = '<b>Favorited</b>';
    }

    $edit_icon = '';
    $cancel = '';
    if ($object->status >= 100 || $shared_feed) {
      $edit_icon = "<img class='feed_edit_icon show_me focus' src='view/gfx/jigsoar-icons/dark/16_edit_page2.png'>";

      // if the job is not queued or running, don't display the cancel icon
      // also if the feed was shared
      $cancel = "display:none";
    }

    $t = new Template('feed.html');
    $t -> replace('ID', $object->id);
    $feed_gfx64 = 'plugins/'.$object->plugin.'/feed.png';
    if(!is_file(joinPaths(CHRIS_WWWROOT, $feed_gfx64))){
      $feed_gfx64 = 'http://placehold.it/48x48';
    }
    $t -> replace('IMAGE_SRC', $feed_gfx64);
    $t -> replace('USERNAME', $username_displayed);
   // $t -> replace('FEED_STATUS', $feed_status);
    $t -> replace('FEED_NAME', $object->name);
    $t -> replace('FEED_META_CONTENT', $feed_meta_advanced);
    $t -> replace('TIME_FORMATED', $object->time);
    $t -> replace('PLUGIN', ucwords(str_replace('_',' ',$object->plugin)));
    $t -> replace('STATUS', $object->status);
    $t -> replace('STATUS_TEXT', $status_text);
    $t -> replace('SHARE_ICON', $share_icon);
    $t -> replace('TAG_ICON', $tag_icon);
    $t -> replace('ARCHIVE_ICON', $archive_icon);
    $t -> replace('ARCHIVE_TEXT', $archive_text);
    $t -> replace('FAVORITE_ICON', $favorite_icon);
    $t -> replace('FAVORITE_TEXT', $favorite_text);
    $t -> replace('CANCEL', $cancel);
    $t -> replace('EDIT_ICON', $edit_icon);
    $t -> replace('FEED_SHINE', $shine);
    // set data browser
    $d = new Template('feed_data_browser.html');
    $feed_folder = joinPaths($username,$object->plugin, $object->name.'-'.$object->id);
    if (file_exists($feed_folder)) {
      $feed_subfolders = scandir(CHRIS_USERS.'/'.$feed_folder);
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
      }

    $d -> replace('FOLDER', $feed_folder);
    $d -> replace('PATIENT_ID', 'fake_patient_id');
    $d -> replace('DATA_ID', 'fake_data_id');
    $t -> replace('DATA_BROWSER', $d);

    // set tags
    $feedtagMapper= new Mapper('Feed_Tag');
    $feedtagMapper->join('Tag', 'feed_tag.tag_id = tag.id')->filter('feed_tag.feed_id=(?)', $object->id);
    $feedtagResults = $feedtagMapper->get();
    $feedtags = '';
    if(count($feedtagResults['Feed_Tag']) >= 1){
      foreach($feedtagResults['Tag'] as $key => $value){
        $n = new Template('feed_tag.html');
        $n->replace('USER_ID', $object->user_id);
        $n->replace('TAG_ID', $value->id);
        $n->replace('TAG_NAME', $value->name);
        $n->replace('TAG_COLOR', $value->color);
        $n->replace('TEXT_COLOR', invertColor($value->color));
        $n->replace('LOCATION', 'infeed');
        $feedtags .= $n;
      }
    }

    $t -> replace('TAGS', $feedtags);

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
