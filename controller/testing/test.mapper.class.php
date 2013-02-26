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

// include the controller classes
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));

// include the model classes
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));

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
    $condition = 'name LIKE CONCAT("%",?,"%")';
    $patientMapper2->filter($condition, 'Rannou');
    $patientResult2 = $patientMapper2->get();

    // should return 1 patient
    $this->assertTrue(count($patientResult2['Patient']) == 1);

    // OPERATOR and CONDITION
    $patientMapper3 = new Mapper('Patient');
    $patientMapper3->filter('', '', 0, 'OR');
    // concat required for prepared statement to work with special characters
    $condition1 = 'name LIKE CONCAT("%",?,"%")';
    $patientMapper3->filter($condition1, 'Nicolas', 1);
    // empty prepared statement
    $condition2 = 'sex LIKE \'%M%\'';
    $patientMapper3->filter($condition2, '', 1, 'AND');
    // concat required for prepared statement to work with special characters
    $condition3 = 'name LIKE CONCAT("%",?,"%")';
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
    /*$dataMapper = new Mapper('data');
    $dataMapper->join('Patient');
    $dataResult = $dataMapper->get();

    // should return 4 data object and 4 Patient objects
    $this->assertTrue((count($dataResult['data']) == 4) && (count($dataResult['Patient']) == 4));

    // join condition
    $dataMapper2 = new Mapper('data');
    $dataMapper2->join('Patient')->join('Result_data', 'data.id = Result_data.data_id')->join('Result', 'result.id = Result_data.result_id')->join('Result_Project', 'Result_Project.result_id = result.id')->join('Project', 'project.id = Result_Project.project_id');
    $dataResult2 = $dataMapper2->get();

    // should return 1 of each object
    $this->assertTrue(count($dataResult2['data'] == 1) && count($dataResult2['Patient'] == 1) && count($dataResult2['Result_data'] == 1) && count($dataResult2['Result'] == 1) && count($dataResult2['Result_Project'] == 1) && count($dataResult2['Project'] == 1));*/
  }

  //! [testJoin()]
  /**
  * Test the ljoin function
  */
  //! [testLjoin()]
  public function testLjoin() {
    // only OPERATOR
    /*$dataMapper = new Mapper('data');
    $dataMapper->ljoin('Patient');
    $dataResult = $dataMapper->get();

    // should return 4 data object and 4 Patient objects
    $this->assertTrue((count($dataResult['data']) == 4) && (count($dataResult['Patient']) == 4));

    // join condition
    $dataMapper2 = new Mapper('data');
    $dataMapper2->ljoin('Patient')->ljoin('Result_data', 'data.id = Result_data.data_id')->ljoin('Result', 'result.id = Result_data.result_id')->join('Result_Project', 'Result_Project.result_id = result.id')->ljoin('Project', 'project.id = Result_Project.project_id');
    $dataResult2 = $dataMapper2->get();

    // should return 1 of each object
    $this->assertTrue(count($dataResult2['data'] == 3) && count($dataResult2['Patient'] == 3) && count($dataResult2['Result_data'] == 3) && count($dataResult2['Result'] == 3) && count($dataResult2['Result_Project'] == 3) && count($dataResult2['Project'] == 3));*/
  }

  //! [testLjoin()]

  /**
   * Test the group function
   */
  //! [testGroup()]
  public function testGroup() {
    $dataMapper = new Mapper('data');
    $dataMapper->group('nb_files');
    $dataResult = $dataMapper->get();

    // should return 3 results
    $this->assertTrue(count($dataResult['data']) == 3);
  }

  //! [testGroup()]

  /**
   * Test the get method.
   */
  //! [testGet()]
  public function testGet() {
    // get a patient by id
    $patientObject = new Patient();
    $patientObject->id = 2;
    $patientObject->name = 'Rannou';
    $patientObject->dob = '1987-03-27';
    $patientObject->sex = 'M';
    $patientObject->uid = 'CH156525;';

    $patientObject2 = new Patient();
    $patientObject2->id = 2;
    $patientObject2->name = 'Rannou';
    $patientObject2->dob = '1987-03-27';
    $patientObject2->sex = 'M';
    $patientObject2->uid = 'CH156525;';

    $patientMapper = new Mapper($patientObject);
    $patientResult = $patientMapper->get(2);

    // should be equal
    //$this->assertTrue($patientResult['Patient'][0]->equals($patientObject2) == True);

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

  //! [testGet()]

  /**
   * Test the get static method.
   */
  //! [testGetStatic()]
  public function testGetStatic() {
    $patientResult = Mapper::getStatic('Patient');

    $patientResult2 = Mapper::getStatic('Patient', 2);
  }

  //! [testGetStatic()]
   
  /**
   * Test the add method.
   */
  //! [testAdd()]
  public function testAdd() {
    // get a patient by id
    $patientObject = new Patient();
    $patientObject->name = 'PLN0';
    $patientObject->dob = '2000-01-01';
    $patientObject->sex = 'M';
    $patientObject->uid = 'PID0;';

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

  //! [testAdd()]

  /**
   * Test the delete method.
   */
  //! [testDelete()]
  public function testDelete() {
    // get a patient by id
    $patientObject = new Patient();
    $patientObject->name = 'PLN1';
    $patientObject->dob = '2001-01-01';
    $patientObject->sex = 'F';
    $patientObject->uid = 'PID1;';

    $patientID = Mapper::add($patientObject);

    // delete same patient
    Mapper::delete('Patient', $patientID);

    $result = Mapper::getStatic('Patient', $patientID);
    // IDs should be the same: nothing added
    $this->assertTrue(empty($result['Patient']));
  }
  //! [testDelete()]

  /**
   * Test the delete method.
   */
  //! [testUpdate()]
  public function testUpdate() {
    // get a patient by id
    $patientObject = new Patient();
    $patientObject->name = 'PLN2';
    $patientObject->dob = '2002-01-01';
    $patientObject->sex = 'F';
    $patientObject->uid = 'PID2;';

    $patientID = Mapper::add($patientObject);

    // Modify one field
    $patientObject->name = 'PLN3';
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
    
    //update object that does not exist
    $patientObject->name = 'PLN4';
    $existingID = Mapper::update($patientObject, -1);
    
    // update should return 0 if object does not exist
    $this->assertTrue($existingID == 0);

    // clean the DB
    Mapper::delete('Patient', $patientID);
  }
  //! [testUpdate()]
}
?>