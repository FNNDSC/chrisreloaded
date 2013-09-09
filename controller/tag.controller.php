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

// include chris db interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'db.class.php'));
// include chris mapper interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'mapper.class.php'));
// include pacs helper
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'tag.model.php'));

// interface
interface TagControllerInterface
{
  // Add tag to DB, return its ID
  static public function add($userID, $tagName, $tagColor);
  // Remove tag from DB
  static public function remove($userID, $tagId);
  // Update tag in DB
  static public function update($userID, $tagId, $tagName, $tagColor);
  // Get all tags for one user
  static public function get($userID);

}

/**
 * Tag controller class
 */
class TagC implements TagControllerInterface {

  /**
   */
  static public function add($userID, $tagName, $tagColor) {

    $tagObject = new Tag();
    $tagObject->user_id = $userID;
    $tagObject->name = $tagName;
    $tagObject->color = $tagColor;
    $tagsID = Mapper::add($tagObject);

    $tags = '';
    // loop through results and create html
    $n = new Template('feed_tag.html');
    $n->replace('USER_ID', $userID);
    $n->replace('TAG_ID', $tagsID);
    $n->replace('TAG_NAME', $tagName);
    $n->replace('TAG_COLOR', $tagColor);
    $n->replace('TEXT_COLOR', invertColor($tagColor));
    $n->replace('LOCATION', 'inmodal');
    $tags .= $n;

    return array('tagshtml'=>$tags, 'tags'=>$tagsID);
  }

    /**
   * Remove file in given feed
   * @return bool
   */
  static public function remove($userID, $tagId) {
    // delete same patient
        return Mapper::delete('Tag', $tagId);
  }

  /**
   *
   */
  static public function update($userID, $tagId, $tagName, $tagColor){

    return -1;
  }

  /**
   *
   */
  static public function get($userID){

    $tagMapper = new Mapper('Tag');
    $tagMapper->filter('user_id=(?)', $userID);
    $tagresults = $tagMapper->get();

    $tags = '';
    // loop through results and create html
    if(count($tagresults['Tag']) >= 1){
      foreach($tagresults['Tag'] as $key => $value){
        $n = new Template('feed_tag.html');
        $n->replace('USER_ID', $userID);
        $n->replace('TAG_ID', $value->id);
        $n->replace('TAG_NAME', $value->name);
        $n->replace('TAG_COLOR', $value->color);
        $n->replace('TEXT_COLOR', invertColor($value->color));
        $n->replace('LOCATION', 'inmodal');
        $tags .= $n;
      }
    }

    return array('tagshtml'=>$tags, 'tags'=>$tagresults);
  }

}
?>