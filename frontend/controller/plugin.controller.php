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


require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, '_session.inc.php'));

// include the view
require_once (joinPaths(CHRIS_VIEW_FOLDER, 'plugin.view.php'));

// interface
interface PluginControllerInterface
{
  // get HTML representation of the plugins widget
  static public function getHTML();

  // discover all available plugins
  static public function discover();
}

/**
 * Feed controller class
 */
class PluginC implements PluginControllerInterface {

  /**
   * Get HTML representation of the plugins widget
   * @return string
   */
  static public function getHTML(){
    $plugin_content = '';
    // update caroussel
    $plugin_content .= PluginV::getCarousel();

    // get content (input and parameters)
    //foreach
    // += PluginV::getHTML('plugin');
    // create all divs
    return $plugin_content;
  }

  /**
   * Discover all available plugins and query
   * them for their logo, parameters etc.
   */
  static public function discover(){

    $plugins = array();

    // the names of all plugins which are subfolders
    // in the plugin folder
    $plugin_names = scandir(CHRIS_PLUGINS_FOLDER);

    // loop through the names
    foreach ($plugin_names as $p) {
      if ($p === '.' or $p === '..') continue;

      $p_folder = CHRIS_PLUGINS_FOLDER . DIRECTORY_SEPARATOR . $p;
      $p_folder_relative = CHRIS_PLUGINS_FOLDER_RELATIVE . DIRECTORY_SEPARATOR . $p;
      $p_executable = $p_folder . DIRECTORY_SEPARATOR . $p;

      if (is_dir($p_folder) && is_file($p_executable)) {

        // plugins are only valid if they are subfolders
        // and contain a $PLUGINNAME executable file
        // (can be script or binary)

        // get the path to the plugin icon
        $p_icon = $p_folder_relative . DIRECTORY_SEPARATOR . 'gfx.png';

        // probe for the ui xml
        $p_xml = array();
        // note: we also redirect stderr here to get the full output
        exec($p_executable.' --xml 2>&1', $p_xml);

        // create a plugin entry
        $plugin_entry = array();
        $plugin_entry['name'] = $p;
        $plugin_entry['executable'] = $p_executable;
        $plugin_entry['icon'] = $p_icon;
        $plugin_entry['xml'] = implode($p_xml); // merge the xml to a string

        // .. and store it
        $plugins[] = $plugin_entry;

      }

    } // foreach

    return $plugins;

  }

}
?>