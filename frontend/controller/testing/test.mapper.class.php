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
if(!defined('CHRIS_CONFIG_PARSED')) require_once('../../config.inc.php');

// include the simpletest framework
require_once (SIMPLETEST);

// include the controller classes
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));

// include the model classes
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'scan.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'result_scan.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'result.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'result_project.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'project.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'modality.class.php'));

class TestMapperClass extends UnitTestCase {

  /**
   * Test the filter function
   */

  //! [testFilter()]
  public function testFilter() {
    // only OPERATOR
    $patientMapper = new Mapper('Patient');
    $patientMapper->filter('', '', 0);
    $patientResult = $patientMapper->get();

    // should return 6 patients
    $this->assertTrue(count($patientResult['Patient']) == 6);

    // only CONDITION
    $patientMapper2 = new Mapper('Patient');
    // concat required for prepared statement to work with special characters
    $condition = 'firstname LIKE CONCAT("%",?,"%")';
    $patientMapper2->filter($condition, 'Nicolas');
    $patientResult2 = $patientMapper2->get();

    // should return 1 patient
    $this->assertTrue(count($patientResult2['Patient']) == 1);

    // OPERATOR and CONDITION
    $patientMapper3 = new Mapper('Patient');
    $patientMapper3->filter('', '', 0, 'OR');
    // concat required for prepared statement to work with special characters
    $condition1 = 'firstname LIKE CONCAT("%",?,"%")';
    $patientMapper3->filter($condition1, 'Nicolas', 1);
    // empty prepared statement
    $condition2 = 'lastname LIKE \'%Rannou%\'';
    $patientMapper3->filter($condition2, '', 1, 'AND');
    // concat required for prepared statement to work with special characters
    $condition3 = 'lastname LIKE CONCAT("%",?,"%")';
    $patientMapper3->filter($condition3, 'Haehn', 2);
    $patientResult3 = $patientMapper3->get();

    // should return 2 patients
    $this->assertTrue(count($patientResult3['Patient']) == 2);
  }

  //! [testFilter()]

  /**
   * Test the join function
   */
  //! [testJoin()]
  public function testJoin() {
    // only OPERATOR
    $scanMapper = new Mapper('Scan');
    $scanMapper->join('Patient');
    $scanResult = $scanMapper->get();

    // should return 4 Scan object and 4 Patient objects
    $this->assertTrue((count($scanResult['Scan']) == 4) && (count($scanResult['Patient']) == 4));

    // join condition
    $scanMapper2 = new Mapper('Scan');
    $scanMapper2->join('Patient')->join('Result_Scan', 'scan.id = Result_Scan.scan_id')->join('Result', 'result.id = Result_Scan.result_id')->join('Result_Project', 'Result_Project.result_id = result.id')->join('Project', 'project.id = Result_Project.project_id');
    $scanResult2 = $scanMapper2->get();

    // should return 1 of each object
    $this->assertTrue(count($scanResult2['Scan'] == 1) && count($scanResult2['Patient'] == 1) && count($scanResult2['Result_Scan'] == 1) && count($scanResult2['Result'] == 1) && count($scanResult2['Result_Project'] == 1) && count($scanResult2['Project'] == 1));
  }

  //! [testJoin()]
  /**
  * Test the ljoin function
  */
  //! [testLjoin()]
  public function testLjoin() {
    // only OPERATOR
    $scanMapper = new Mapper('Scan');
    $scanMapper->ljoin('Patient');
    $scanResult = $scanMapper->get();

    // should return 4 Scan object and 4 Patient objects
    $this->assertTrue((count($scanResult['Scan']) == 4) && (count($scanResult['Patient']) == 4));

    // join condition
    $scanMapper2 = new Mapper('Scan');
    $scanMapper2->ljoin('Patient')->ljoin('Result_Scan', 'scan.id = Result_Scan.scan_id')->ljoin('Result', 'result.id = Result_Scan.result_id')->join('Result_Project', 'Result_Project.result_id = result.id')->ljoin('Project', 'project.id = Result_Project.project_id');
    $scanResult2 = $scanMapper2->get();

    // should return 1 of each object
    $this->assertTrue(count($scanResult2['Scan'] == 3) && count($scanResult2['Patient'] == 3) && count($scanResult2['Result_Scan'] == 3) && count($scanResult2['Result'] == 3) && count($scanResult2['Result_Project'] == 3) && count($scanResult2['Project'] == 3));
  }

  //! [testLjoin()]

  /**
   * Test the group function
   */
  //! [testGroup()]
  public function testGroup() {
    $scanMapper = new Mapper('Scan');
    $scanMapper->group('patient_id');
    $scanResult = $scanMapper->get();

    // should return 3 results
    $this->assertTrue(count($scanResult['Scan']) == 3);
  }

  //! [testGroup()]

  /**
   * Test the get method.
   */
  //! [testget()]
  public function testGet() {
    // get a patient by id
    $patientObject = new Patient();
    $patientObject->id = 2;
    $patientObject->lastname = 'Rannou';
    $patientObject->firstname = 'Nicolas';
    $patientObject->dob = '1987-03-27';
    $patientObject->sex = 'M';
    $patientObject->patient_id = 'CH156525;';

    $patientObject2 = new Patient();
    $patientObject2->id = 2;
    $patientObject2->lastname = 'Rannou';
    $patientObject2->firstname = 'Nicolas';
    $patientObject2->dob = '1987-03-27';
    $patientObject2->sex = 'M';
    $patientObject2->patient_id = 'CH156525;';

    $patientMapper = new Mapper($patientObject);
    $patientResult = $patientMapper->get(2);

    // should be equal
    $this->assertTrue($patientResult['Patient'][0]->equals($patientObject2) == True);

    $patientMapper2 = new Mapper('Patient');
    $patientResult2 = $patientMapper2->get(-3);

    // should return nothing
    $this->assertTrue(count($patientResult2['Patient']) == 0);

    // get all
    $patientMapper3 = new Mapper($patientObject);
    $patientMapper3->filter('AND', '', 0);
    $patientResult3 = $patientMapper3->get();

    // should return 6 patients
    $this->assertTrue(count($patientResult3['Patient']) == 6);
  }

  //! [testget()]

  /**
   * Test the get static method.
   */
  //! [testgetstatic()]
  public function testGetStatic() {
    $patientResult = Mapper::getStatic('Patient');

    $patientResult2 = Mapper::getStatic('Patient', 2);
  }

  //! [testgetstatic()]
   
  /**
   * Test the add method.
   */
  //! [testadd()]
  public function testAdd() {
    // get a patient by id
    $patientObject = new Patient();
    $patientObject->lastname = 'PLN0';
    $patientObject->firstname = 'PFN0';
    $patientObject->dob = '2000-01-01';
    $patientObject->sex = 'M';
    $patientObject->patient_id = 'PID0;';

    $patientID = Mapper::add($patientObject);
    $patientResult = Mapper::getStatic($patientObject, $patientID);

    // compared object we just added with its "base" object
    $this->assertTrue($patientResult['Patient'][0]->equals($patientObject) == True);

    $patientID2 = Mapper::add($patientObject);

    // IDs should be the same: nothing added
    $this->assertTrue($patientID == $patientID2);
    
    // clean the DB
    Mapper::delete('Patient', $patientID);
  }

  //! [testadd()]

  /**
   * Test the delete method.
   */
  //! [testdelete()]
  public function testDelete() {
    // get a patient by id
    $patientObject = new Patient();
    $patientObject->lastname = 'PLN1';
    $patientObject->firstname = 'PFN1';
    $patientObject->dob = '2001-01-01';
    $patientObject->sex = 'F';
    $patientObject->patient_id = 'PID1;';

    $patientID = Mapper::add($patientObject);

    // delete same patient
    Mapper::delete('Patient', $patientID);

    $result = Mapper::getStatic('Patient', $patientID);
    // IDs should be the same: nothing added
    $this->assertTrue(empty($result['Patient']));
  }
  //! [testdelete()]

  /**
   * Test the delete method.
   */
  //! [testupdate()]
  public function testUpdate() {
    // get a patient by id
    $patientObject = new Patient();
    $patientObject->lastname = 'PLN2';
    $patientObject->firstname = 'PFN2';
    $patientObject->dob = '2002-01-01';
    $patientObject->sex = 'F';
    $patientObject->patient_id = 'PID2;';

    $patientID = Mapper::add($patientObject);

    // Modify one field
    $patientObject->lastname = 'PLN3';
    // Update database and get object
    Mapper::update($patientObject, $patientID);
    $patientResult = Mapper::getStatic('Patient', $patientID);

    // compared object we just added with its "base" object
    // we make sure id match
    $patientObject->id = $patientID;
    $this->assertTrue($patientResult['Patient'][0]->equals($patientObject) == True);

    // update "silly" object to create one object which alread exists
    $existingID = Mapper::update($patientObject, -1);

    // should return the id of the object which already exists
    $this->assertTrue($patientID == $existingID);

    // clean the DB
    Mapper::delete('Patient', $patientID);
  }
  //! [testupdate()]
}
?>