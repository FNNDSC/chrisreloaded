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

//define('CHRIS_CONFIG_DEBUG', true);

// include the configuration
require_once ('config.inc.php');

// include the template class
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'template.class.php'));

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, '_session.inc.php'));

function pacsPage() {
  // create the login page
  $t = new Template('pacs.html');
  $t -> replace('CSS', 'css.html');
  $t -> replace('NAVBAR', 'pacs_navbar.html');
  /* $t -> replace('CART', 'cart.html');
   $t -> replace('USERNAME', $_SESSION['username']); */
  $t -> replace('FOOTER', 'footer.html');
  $t -> replace('JAVASCRIPT', 'javascript.html');
  return $t;
}

// execute the test
echo pacsPage();

?>