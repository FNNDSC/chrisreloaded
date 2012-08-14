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
if (!defined('__CHRIS_ENTRY_POINT__'))
  define('__CHRIS_ENTRY_POINT__', 666);

//define('CHRIS_CONFIG_DEBUG',true);

// include the configuration
require_once ('config.inc.php');

// include the simpletest framework
require_once (SIMPLETEST_TEMPLATE);
require_once (SIMPLETEST_SIMPLETEST);
SimpleTest::prefer(new ShowPasses());
require_once (SIMPLETEST_AUTORUN);


// include all the tests suites
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'testing/test.controller.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'testing/test.model.php'));

/**
 *
 * The test suite which includes all tests for the model classes.
 *
 */
/* class TestChris extends TestSuite {

  function __construct() {

    parent::__construct();

    $this->add(new TestController());
    $this->add(new TestModel());
  }

} */
?>