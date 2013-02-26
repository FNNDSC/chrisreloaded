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
if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);

//define('CHRIS_CONFIG_DEBUG',true);

// include the configuration
if(!defined('CHRIS_CONFIG_PARSED'))
  require_once(dirname(dirname(dirname(__FILE__))).'/config.inc.php');

// include the simpletest chris framework
require_once (SIMPLETEST_CHRIS);
SimpleTest_Chris::setPreference();

// include the db class
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));

class TestDBClass extends UnitTestCase {

  /**
   * Test the singleton pattern and the getInstance method.
   */
  public function testGetInstance() {

    // get an instance of the DB class
    $db = DB::getInstance();

    // and another one
    $db2 = DB::getInstance();

    // should be the same
    $this->assertEqual($db, $db2);

    // and of course should be a DB object
    $this->assertEqual(get_class($db), 'DB');

  }

  /**
   * Test execution of a simple SQL query.
   */
  public function testExecute() {

    // get an instance of the DB class
    $db = DB::getInstance();

    $rows = $db->execute('SELECT * FROM patient');

    // check if the first returned row matches (lastname check)
    //this->assertEqual($rows[0][1][1],'Haehn');

  }

  /**
   * Test execution of a simple SQL query with a variable.
   */
  public function testExecute2() {

    // get an instance of the DB class
    $db = DB::getInstance();

    $rows = $db->execute('SELECT * FROM patient WHERE id=(?)', array(0=>1));

    // check if the first returned row matches (lastname check)
    //$this->assertEqual($rows[0][1][1],'Haehn');

  }

  /**
   * Test execution of a simple SQL query with no matches.
   */
  public function testExecute3() {

    // get an instance of the DB class
    $db = DB::getInstance();

    $rows = $db->execute('SELECT * FROM patient WHERE id=(?)', array(0=>-1000));

    // check if the returned rows are NULL
    //$this->assertEqual($rows, NULL);

  }

  /**
   * Test execution of a simple SQL query with two parameters.
   */
  public function testExecute4() {

    // get an instance of the DB class
    $db = DB::getInstance();

    $rows = $db->execute("SELECT * FROM patient WHERE id=(?) AND name=?", array(0=>1,1=>'Haehn'));

    // check if the first returned row matches (lastname check)
   // $this->assertEqual($rows[0][1][1],'Haehn');

  }


}

?>