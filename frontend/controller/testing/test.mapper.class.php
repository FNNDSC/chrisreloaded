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

// include the configuration
require_once ('../../config.inc.php');

// include the db class
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));

// include the mapper class
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));

// include the patient class
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'scan.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'modality.class.php'));

function testMapperClass() {
  
  $patientObject = new Patient();
  $scanObject = new Scan();
  $modalityObject = new Modality();

  echo '=====================================================================';
  echo '<br />';
  echo '<br />';

  $mapper = new Mapper($patientObject);
  $objects = $mapper -> join($scanObject, 'scan.patient_id=patient.id') -> join($modalityObject, 'scan.modality_id=modality.id') -> filter('modality.type= \'Structural\'') -> getObject();

  for ($j = 0; $j < count($objects[0]); $j++) {
    foreach ($objects as $object) {
      print $object[$j];
      echo '<br />';
    }

    echo '<br />';
  }

  echo '=====================================================================';
  echo '<br />';
  echo '<br />';

  $mapper2 = new Mapper($patientObject);
  $objects2 = $mapper2 -> filter('patient.dob < \'2000\'') -> getObject();

  for ($j = 0; $j < count($objects2[0]); $j++) {
    foreach ($objects2 as $object) {
      print $object[$j];
      echo '<br />';
    }

    echo '<br />';
  }

  echo '=====================================================================';
  echo '<br />';
  echo '<br />';

  $mapper3 = new Mapper($patientObject);
  $objects3 = $mapper3 -> getObject(2);

  for ($j = 0; $j < count($objects3[0]); $j++) {
    foreach ($objects3 as $object) {
      print $object[$j];
      echo '<br />';
    }

    echo '<br />';
  }

  echo '=====================================================================';
  echo '<br />';
  echo '<br />';

  $mapper4 = new Mapper($patientObject);
  $objects4 = $mapper4 -> getField('patient_id');

  for ($j = 0; $j < count($objects4[0]); $j++) {
    foreach ($objects4 as $object) {
      echo $object[$j][1];
      echo '<br />';
    }

    echo '<br />';
  }

}

// execute the test
testMapperClass();
?>