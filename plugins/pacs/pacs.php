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

// we define a valid entry point
define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
require_once ('../../config.inc.php');

// include the template class
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'security.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'template.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));

// validate the credentials
if (!SecurityC::login()) {
  // invalid credentials
  // destroy the session
  session_destroy();
  die("Access denied.");
}

// create the pacs query page
function queryPage() {
  $t = new Template('template/pacs.html');
  $t -> replace('CSS_CHRIS', 'css.chris.html', 'template');
  $t -> replace('CSS_PACS', 'css.pacs.html', 'template');
  $t -> replace('JS_CHRIS', 'js.chris.html', 'template');
  $t -> replace('JS_PACS', 'js.pacs.html', 'template');
  $t -> replace('RESULTS', 'results.html', 'template');
  return $t;
}

echo queryPage();
?>
