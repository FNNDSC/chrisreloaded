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

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'plugin.controller.php'));

/**
 * View class to get different representations of the Plugin object.
 */
class PluginV implements ObjectViewInterface {

  /**
   * get HTML representation of the carousel
   */
  public static function getCarousel($plugins){

    // create the carousel items
    $plugin_carousel_items  = '';

    // by looping through all plugins
    foreach ($plugins as $p) {

      // new template for each plugin
      $v = new Template('plugin_carousel_item.html');
      $v-> replace('IMAGE', PluginC::getIcon($p['name']));
      $v-> replace('PLUGIN_NAME', $p['name']);
      $plugin_carousel_items .= $v;

    }

    // carousel template
    $t = new Template('plugin_carousel.html');
    // replace in template
    $t -> replace('PLUGIN_CAROUSEL_ITEMS', $plugin_carousel_items);

    return $t;

  }

  public static function getHTML($object){
    // not implemented

    $t = new Template('plugin.html');
    $t -> replace('PLUGIN_CAROUSEL', PluginV::getCarousel($object));

    $plugin_parameters = '';
    foreach ($object as $p) {

      $plugin_parameters .= PluginC::getUI($p['name']);

    }

    $t -> replace('PLUGIN_PARAMETERS', $plugin_parameters);


    return $t;

  }

  public static function getJSON($object){
    // not implemented
  }
}
?>