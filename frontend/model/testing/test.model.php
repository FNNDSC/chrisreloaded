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
// data related models
require_once ('test.data.class.php');
require_once ('test.data_project.class.php');
// group related models
require_once ('test.group.class.php');
require_once ('test.group_data.class.php');
require_once ('test.group_project.class.php');
// result related models
require_once ('test.result.class.php');
require_once ('test.result_data.class.php');
require_once ('test.result_project.class.php');
// user related models
require_once ('test.user.class.php');
require_once ('test.user_data.class.php');
require_once ('test.user_group.class.php');
require_once ('test.user_project.class.php');
require_once ('test.user_result.class.php');
//other models
require_once ('test.patient.class.php');
require_once ('test.project.class.php');

/**
 *
 * The test suite which includes all tests for the model classes.
 *
 */
class TestModel extends TestSuite {

  function __construct() {

    parent::__construct();
    // data related models
    $this -> add(new TestDataClass());
    $this -> add(new TestDataProjectClass());
    // group related models
    $this -> add(new TestGroupClass());
    $this -> add(new TestGroupDataClass());
    $this -> add(new TestGroupProjectClass());
    // result related models
    $this -> add(new TestResultClass());
    $this -> add(new TestResultDataClass());
    $this -> add(new TestResultProjectClass());
    // user related models
    $this -> add(new TestUserClass());
    $this -> add(new TestUserDataClass());
    $this -> add(new TestUserGroupClass());
    $this -> add(new TestUserProjectClass());
    $this -> add(new TestUserResultClass());
    // other models
    $this -> add(new TestPatientClass());
    $this -> add(new TestProjectClass());

  }

}
?>