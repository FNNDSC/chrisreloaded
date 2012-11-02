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

  // get the UI of a plugin (HTML/JS)
  static public function getUI($plugin);

  // get the executable path of a plugin
  static public function getExecutable($plugin);

  // get the icon of a plugin
  static public function getIcon($plugin);

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

    // discover the plugins and create the plugin widget
    return PluginV::getHTML(PluginC::discover());

  }

  /**
   * Discover all available plugins and returns an array of plugin names.
   *
   * @return array The discovered plugins.
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

        // create a plugin entry
        $plugin_entry = array();
        $plugin_entry['name'] = $p;

        // .. and store it
        $plugins[] = $plugin_entry;

      }

    } // foreach

    return $plugins;

  }

  /**
   * Get the UI of a given plugin.
   *
   * This queries the plugin executable for a XML
   * representation (Slicer Execution Model) and converts
   * it to HTML/JS.
   *
   * @param string $plugin The plugin name.
   * @return string The resulting HTML UI representation.
   */
  static public function getUI($plugin) {

    $p_executable = PluginC::getExecutable($plugin);

    // probe for the ui xml
    $p_xml = array();
    // note: we also redirect stderr here to get the full output
    exec($p_executable.' --xml 2>&1', $p_xml);

    $p_xml = implode($p_xml);

    // thanks to http://www.tonymarston.net/php-mysql/xsl.html
    // requires sudo apt-get install php5-xsl

    // we need a XSLT processor
    $xp = new XSLTProcessor();

    // load the XSL stylesheet
    $xsl = new DOMDocument;
    $xsl->load(CHRIS_PLUGINS_FOLDER . DIRECTORY_SEPARATOR . 'sem2html.xsl');

    // attach it to the processor
    $xp->importStylesheet($xsl);

    // ..transform the XML to HTML
    $html = $xp->transformToXML(new SimpleXMLElement($p_xml));

    // replace plugin name variable
    $html = str_replace('${PLUGIN_NAME}', $plugin, $html);

    return $html;

  }

  /**
   * Get the executable of a given plugin.
   *
   * @param string $plugin The plugin name.
   * @return string The full path to the plugin executable.
   */
  static public function getExecutable($plugin) {

    $p_folder = CHRIS_PLUGINS_FOLDER . DIRECTORY_SEPARATOR . $plugin;
    $p_executable = $p_folder . DIRECTORY_SEPARATOR . $plugin;

    return $p_executable;

  }

  /**
   * Get the icon of a given plugin.
   *
   * @param unknown $plugin
   * @return string The relative path to the plugin icon.
   */
  static public function getIcon($plugin) {

    $p_folder_relative = CHRIS_PLUGINS_FOLDER_RELATIVE . DIRECTORY_SEPARATOR . $plugin;

    // get the path to the plugin icon
    $p_icon = $p_folder_relative . DIRECTORY_SEPARATOR . 'plugin.png';

    return $p_icon;

  }

}
?>