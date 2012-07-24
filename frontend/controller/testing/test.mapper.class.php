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

//define('CHRIS_CONFIG_DEBUG',true);

if (!defined('CHRIS_CONFIG_PARSED'))
  require_once ('../../config.inc.php');
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

  // public function testGetName() {
  // // give string
  // $stringMapper = new Mapper('IamAString');
  // $this->assertTrue($stringMapper->objectname == 'IamAString');
  //
  // // give object.
  // $patientObject = new Patient();
  // $objectMapper = new Mapper($patientObject);
  // $this->assertTrue($objectMapper->objectname == $patientObject->objectname);
  // }

  public function testFilter() {
    // only OPERATOR
    $patientMapper = new Mapper('Patient');
    $patientMapper->filter('', 0);
    $patientResult = $patientMapper->objects();

    // only CONDITION
    $patientMapper2 = new Mapper('Patient');
    $condition = 'firstname like \'%Nicolas%\'';
    $patientMapper2->filter($condition);
    $patientResult2 = $patientMapper2->objects();

    // OPERATOR and CONDITION
    $patientMapper3 = new Mapper('Patient');
    $condition1 = 'firstname like \'%Nicolas%\'';
    $condition2 = 'lastname like \'%Rannou%\'';
    $condition3 = 'lastname like \'%Haehn%\'';
    $patientMapper3->filter('', 0, 'OR');
    $patientMapper3->filter($condition1, 1);
    $patientMapper3->filter($condition2, 1, 'AND');
    $patientMapper3->filter($condition3, 2);
    $patientResult3 = $patientMapper3->objects();
  }

  public function testJoin() {
    // only OPERATOR
    $scanMapper = new Mapper('Scan');
    $scanMapper->join('Patient');
    $scanResult = $scanMapper->objects();

    // join condition
    $scanMapper2 = new Mapper('Scan');
    $scanMapper2->join('Patient')->join('Result_Scan', 'scan.id = Result_Scan.scan_id')->join('Result', 'result.id = Result_Scan.result_id')->join('Result_Project', 'Result_Project.result_id = result.id')->join('Project', 'project.id = Result_Project.project_id');
    $scanResult2 = $scanMapper2->objects();
  }

  public function testGroup() {
    $scanMapper = new Mapper('Scan');
    $scanMapper->group('patient_id');
    $scanResult = $scanMapper->objects();

    print_r($scanResult);
  }

  /**
   * Test to get one entity from the database and compare to original object.
   */
  public function testObjects() {
    // $patientObject = new Patient();
    // $patientObject->id = 2;
    // $patientObject->lastname = 'Rannou';
    // $patientObject->firstname = 'Nicolas';
    // $patientObject->dob = '1987-03-27';
    // $patientObject->sex = 'M';
    // $patientObject->patient_id = 'CH156525;';
    //
    // $patientObject2 = new Patient();
    // $patientObject2->id = 2;
    // $patientObject2->lastname = 'Rannou';
    // $patientObject2->firstname = 'Nicolas';
    // $patientObject2->dob = '1987-03-27';
    // $patientObject2->sex = 'M';
    // $patientObject2->patient_id = 'CH156525;';
    //
    // $mapper = new Mapper($patientObject);
    // $objects = $mapper->objects(2);
    //
    // $this->assertTrue($objects['Patient'][0]->equals($patientObject2) == 1);
  }

  //
  // /**
  // * Test to get a not existing entity from the database.
  // */
  // public function testGetNotExisting() {
  //
  // $classname = $this->getClassname();
  //
  // // exit if the classname is null since this means we are not testing a child class
  // if (!$classname) return;
  //
  //
  // $i = $classname::get(-3);
  // $this->assertNull($i);
  // }
  //
  // function testAll() {
  //
  // $patientObject = new Patient();
  // $scanObject = new Scan();
  // $modalityObject = new Modality();
  //
  // echo '=====================================================================';
  // echo '<br />';
  // echo '<br />';
  //
  // $mapper = new Mapper($patientObject);
  // $objects = $mapper -> join($scanObject, 'scan.patient_id=patient.id') -> join($modalityObject, 'scan.modality_id=modality.id') -> filter('modality.type= \'Structural\'') -> objects();
  //
  // for ($j = 0; $j < count($objects[0]); $j++) {
  // foreach ($objects as $object) {
  // print $object[$j];
  // echo '<br />';
  // }
  //
  // echo '<br />';
  // }
  //
  // echo '=====================================================================';
  // echo '<br />';
  // echo '<br />';
  //
  // $mapper2 = new Mapper($patientObject);
  // $objects2 = $mapper2 -> filter('patient.dob < \'2000\'') -> objects();
  //
  // for ($j = 0; $j < count($objects2[0]); $j++) {
  // foreach ($objects2 as $object) {
  // print $object[$j];
  // echo '<br />';
  // }
  //
  // echo '<br />';
  // }
  //
  // echo '=====================================================================';
  // echo '<br />';
  // echo '<br />';
  //
  // $mapper3 = new Mapper($patientObject);
  // $objects3 = $mapper3 -> objects(2);
  //
  // for ($j = 0; $j < count($objects3[0]); $j++) {
  // foreach ($objects3 as $object) {
  // print $object[$j];
  // echo '<br />';
  // }
  //
  // echo '<br />';
  // }
  //
  // echo '=====================================================================';
  // echo '<br />';
  // echo '<br />';
  //
  // $mapper4 = new Mapper($patientObject);
  // $objects4 = $mapper4 -> objects('patient_id');
  //
  // for ($j = 0; $j < count($objects4[0]); $j++) {
  // foreach ($objects4 as $object) {
  // echo $object[$j][1];
  // echo '<br />';
  // }
  //
  // echo '<br />';
  // }
  //
  // }

}
?>