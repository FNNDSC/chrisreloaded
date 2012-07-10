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
 * The generic test class for all entities.
 *
 */
class TestObjectClass extends UnitTestCase {

  /**
   * Transform a test class name like TestXClass to X.
   */
  private function getClassname() {

    $classname = get_called_class();

    // transform the TestXClass to just X
    $classname = str_replace('Test', '', $classname);
    $classname = str_replace('Class', '', $classname);

    // return null if this is not a child class
    if ($classname == 'Object') {

      return null;

    }

    // else wise return the pure classname to test
    return $classname;

  }

  /**
   * Test the string representation.
   */
  public function testToString() {

    $classname = $this->getClassname();

    // exit if the classname is null since this means we are not testing a child class
    if (!$classname) return;

    // create a new instance
    $o = new $classname();
    $string_representation = (string)$o;

    // check if all class attributes are part of the __toString function
    foreach($o as $key => $value) {

      $this->assertTrue(strpos($string_representation, $key));

    }

  }

  /**
   * Test to get one entity from the database.
   */
  public function testGet() {

    $classname = $this->getClassname();

    // exit if the classname is null since this means we are not testing a child class
    if (!$classname) return;

    // grab the test dataset (first one in the table)
    $groundtruths = DB::getInstance()->execute("SELECT * FROM ".strtolower($classname)." WHERE id=(?)",array(0=>1));

    $groundtruth = $groundtruths[0];

    // now try to grab the same data set using the convenience function
    $i = $classname::get(1);

    foreach($groundtruth as $key => $value) {

      $this->assertEqual($value, $i->$key);

    }

  }

  /**
   * Test to get a not existing entity from the database.
   */
  public function testGetNotExisting() {

    $classname = $this->getClassname();

    // exit if the classname is null since this means we are not testing a child class
    if (!$classname) return;


    $i = $classname::get(-3);
    $this->assertNull($i);
  }

}

?>