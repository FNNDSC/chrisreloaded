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

if (!defined('CHRIS_CONFIG_PARSED'))
  require_once ('../../config.inc.php');
// include the simpletest framework
require_once (SIMPLETEST);

// include all the tests
require_once ('test.data.class.php');
require_once ('test.data_project.class.php');
require_once ('test.group.class.php');
require_once ('test.group_data.class.php');
require_once ('test.group_project.class.php');
require_once ('test.patient.class.php');
require_once ('test.result_configuration.class.php');
require_once ('test.result.class.php');


/**
 *
 * The test suite which includes all tests for the model classes.
 *
 */
class TestModel extends TestSuite {

  function __construct() {

    parent::__construct();

    $this -> add(new TestInstitutionClass());
    $this -> add(new TestModalityClass());
    $this -> add(new TestPatientClass());
    $this -> add(new TestResult_configurationClass());
    $this -> add(new TestResultClass());
    $this -> add(new TestScanClass());

  }

}
?>