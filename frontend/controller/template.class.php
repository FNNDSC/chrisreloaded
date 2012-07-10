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
if(!defined('__CHRIS_ENTRY_POINT__')) die('Invalid access.');


/**
 *
 * The Template class which gets initialized with a template name
 * and offers methods to replace ${TAGS} with either string content
 * or other files.
 *
 */
class Template {

  /**
   * The template name.
   *
   * @var string
   */
  private $name = '';

  /**
   * The template content after replacing tags.
   *
   * @var string
   */
  private $content = '';

  /**
   * Initialize a template using a template name. The matching template file
   * gets automatically read.
   *
   * @param string $name
   */
  public function __construct($name) {

    $this->name = $name;

    $file_path = joinPaths(CHRIS_VIEW_FOLDER, $name);

    // look up if we have the requested template in our view folder
    if (!file_exists($file_path)) {

      throw new Exception('The requested template '.$name.' was not found.');

    }

    $this->content = file_get_contents($file_path);

  }

  /**
   * Parse an ASCII file and return its contents. Eventual PHP code in the file gets executed.
   *
   * @param string $file
   * @return string
   */
  private function parse($file) {

    // buffer the output of the include function
    ob_start();
    include($file);
    $buffer = ob_get_contents();
    ob_end_clean();

    return $buffer;

  }

  /**
   * Replace a ${TAG} in the template with either the content of a file or a string.
   *
   * @param string $tag The tag to replace, f.e. MENU.
   * @param string $content The content to replace the tag with: either a file path or a string.
   */
  public function replace($tag, $content) {

    // check if the content is a file
    if (file_exists($content)) {

      // yes, it is
      $content = $this->parse($content);

    }

    // here the $content is for sure a string
    // so we can replace teh ${tag} with the $content
    $this->content = str_replace('${'.$tag.'}', $content, $this->content);

  }

  /**
   * Return the current template content which includes all replacements.
   *
   * @return string
   */
  public function __toString() {

    return $this->content;

  }

}

?>