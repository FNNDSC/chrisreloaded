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

    return Mapper::add($tagObject);
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

}
?>