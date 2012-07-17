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

	$mapper = new Mapper('Patient');
	$objects = $mapper -> join('Scan', 'scan.patient_id=patient.id') -> join('Modality', 'scan.modality_id=modality.id') -> filter('modality.type= \'Structural\'')-> getObject();

	echo '<br />';
	echo '<br />';

	for ($j = 0; $j < count($objects[0]); $j++) {
		foreach ($objects as $object) {
			print $object[$j];
			echo '<br />';
		}

		echo '<br />';
	}

	echo '<br />';
	echo '<br />';

	$mapper2 = new Mapper('Patient');
	$objects2 = $mapper2 -> filter('patient.dob < \'2000\'') -> getObject();

	echo '<br />';
	echo '<br />';

	foreach ($objects2[0] as $object) {
		print $object;

		echo '<br />';
		echo '<br />';
	}

	echo '<br />';
	echo '<br />';

	$mapper3 = new Mapper('Patient');
	$objects3 = $mapper3 -> getObject(2);

	echo '<br />';
	echo '<br />';

	foreach ($objects3[0] as $object) {
		print $object;

		echo '<br />';
		echo '<br />';
	}

}

// TODO use php unit testing framework
// TODO more tests regarding failures

// execute the test
testMapperClass();
?>