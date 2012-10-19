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

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'template.class.php'));

/**
 * View class to get different representations of the Plugin object.
 */
class PluginV implements ObjectViewInterface {

  /**
   * get HTML representation of the carousel
   */
  public static function getCarousel(){
    // carousel template
    $t = new Template('plugin_carousel.html');

    $plugin_carousel_items  = '';

    // loop through directories to get all images
    $results = scandir(CHRIS_PLUGINS_FOLDER);

    foreach ($results as $result) {
      if ($result === '.' or $result === '..') continue;

      if (is_dir(CHRIS_PLUGINS_FOLDER . '/' . $result)) {
        // new template
        $v = new Template('plugin_carousel_item.html');
        $v-> replace('SOURCE', CHRIS_PLUGINS_FOLDER.'/' . $result .'/gfx.png');
        $v-> replace('PLUGIN_NAME', $result);
        $plugin_carousel_items .= $v->__toString();
      }
    }
    // replace in template
    $t -> replace('PLUGIN_CAROUSEL_ITEMS', $plugin_carousel_items);

    return $t-> __toString();
  }

  public static function getHTML($object){
    // not implemented
  }

  public static function getJSON($object){
    // not implemented
  }
}
?>