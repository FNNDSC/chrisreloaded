#!/usr/bin/php
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

define('__CHRIS_ENTRY_POINT__', 666);

// include the chris configuration
require_once (dirname(dirname(dirname ( __FILE__ ))).'/config.inc.php');
// include chris db interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'db.class.php'));
// include chris mapper interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'mapper.class.php'));
// include pacs helper^M
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'pacs.helper.php'));
// include chris data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));
// include chris patient models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.model.php'));
// include chris data_patient models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_patient.model.php'));
// include chris feed_data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed_data.model.php'));
// include chris user_data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user_data.model.php'));

require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));

require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_study.model.php'));

require_once (joinPaths(CHRIS_MODEL_FOLDER, 'study.model.php'));

// define the options
$shortopts = "o:i:";

$options = getopt($shortopts);

$output_dir = $options['o'];

$input = '';
if(isset($options['i'])){
  $input = $options['i'];
}

//
// 1- CREATE PRE-PROCESS LOG FILE
//
$type = 'Patient';
$logFile = $output_dir.'search.log';

//
// 2- INSTANTIATE MAPPER CLASS
//
$instateLog = '======================================='.PHP_EOL;
$instateLog .= date('Y-m-d h:i:s'). ' ---> Instantiate MAPPER class...'.PHP_EOL;

$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $instateLog);
fclose($fh);

$processLog = '======================================='.PHP_EOL;
$processLog .= date('Y-m-d h:i:s'). ' ---> Create SQL query...'.PHP_EOL;

// if we have matches on patient, look for matches on the data!
// get all data for patient and link it to its study
// with search conditions
$mapper = new Mapper('Patient');
$mapper->ljoin('Data_Patient', 'patient.id = Data_Patient.patient_id')->ljoin('Data', 'Data_Patient.data_id = data.id')->ljoin('Data_Study', 'data.id = Data_Study.data_id')->ljoin('Study', 'Data_Study.study_id = study.id');

$mapper->filter('', '', 0, 'OR');

 $mapper->filter('patient.name LIKE CONCAT("%",?,"%")', $input, 1, 'OR');
$processLog .= 'name: '. $input.PHP_EOL;

$mapper->filter('patient.dob LIKE CONCAT("%",?,"%")', $input, 2, 'OR');
$processLog .= 'dob: '. $input.PHP_EOL;

$mapper->filter('patient.uid LIKE CONCAT("%",?,"%")', $input, 3, 'OR');
$processLog .= 'uid: '. $input.PHP_EOL;

$mapper->filter('patient.sex LIKE CONCAT("%",?,"%")', $input, 4, 'OR');
$processLog .= 'sex: '. $input.PHP_EOL;

$mapper->filter('data.description LIKE CONCAT("%",?,"%")', $input, 5, 'OR');
$processLog .= 'description: '. $input.PHP_EOL;

$mapper->filter('study.location LIKE CONCAT("%",?,"%")', $input, 6, 'OR');
$processLog .= 'location: '. $input.PHP_EOL;

$mapper->filter('study.modality LIKE CONCAT("%",?,"%")', $input, 7, 'OR');
$processLog .= 'modality: '. $input.PHP_EOL; 

$mapper->filter('study.date LIKE CONCAT("%",?,"%")', $input, 8, 'OR');
$processLog .= 'date: '. $input.PHP_EOL;

$mapper->filter('study.age LIKE CONCAT("%",?,"%")', $input, 9, 'OR');
$processLog .= 'age: '. $input.PHP_EOL;

/* $mapper->filter('study.age >= (?)', $input);
$processLog .= 'agemin: '. $input.PHP_EOL;

$mapper->filter('study.age <= (?)', $input);
$processLog .= 'agemax: '. $input.PHP_EOL; */

/*   $mapper->filter('study.date >= (?)', $input);
 $processLog .= 'datemin: '. $input.PHP_EOL;

$mapper->filter('study.date <= (?)', $input);
$processLog .= 'datemax: '. $input.PHP_EOL; */

$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $processLog);
fclose($fh);

$processLog = '======================================='.PHP_EOL;
$processLog .= date('Y-m-d h:i:s'). ' ---> Process results...'.PHP_EOL;

$results = $mapper->get();

if(count($results['Data']) >= 1){
  foreach($results['Data'] as $key => $value){
    $processLog .= $results['Patient'][$key]->id.PHP_EOL;

    // create patient directory
    $fs_location = $results['Patient'][$key]->uid.'-'.$results['Patient'][$key]->id;
    $patientdir = $output_dir.$fs_location;

    // create study directory
    $fs_location .= '/'.formatStudy($results['Study'][$key]->date, $results['Study'][$key]->age, $results['Study'][$key]->description).'-'.$results['Study'][$key]->id;
    $studydir = $output_dir.$fs_location;

    // create data symlink
    // loop through results and create links
    $processLog .= date('Y-m-d h:i:s').' Creates soft link for Patient'.PHP_EOL;
    // create data soft links
    $name = '';
    if(file_exists(CHRIS_DATA.'/'.$fs_location.'/'.$value->description.'-'.$value->name.'-'.$value->id))
    {
      $name = $value->description.'-'.$value->name.'-'.$value->id;
    }
    else if(file_exists(CHRIS_DATA.'/'.$fs_location.'/'.$value->name.'-'.$value->id)){
      // legacy, old dicom listener
      $name = $value->name.'-'.$value->id;
    }

    if($name != ''){
      if(!is_dir($patientdir)){
        mkdir($patientdir);
      }

      if(!is_dir($studydir)){
        mkdir($studydir);
      }

      $target = CHRIS_DATA.'/'.$fs_location.'/'.$name;
      $destination = $studydir.'/'.$name;

      $processLog .= CHRIS_DATA.'/'.$fs_location.'/'.$name.PHP_EOL;
      $processLog .= $studydir.'/'.$name.PHP_EOL;

      // create sof link
      symlink($target, $destination);
    }
    else{
      $message = "Target series doesn't exists".PHP_EOL;
      $message .= "File System: ".$fs_location.PHP_EOL;
      $message .= "Description: ".$value->description.PHP_EOL;
      $message .= "Name: ".$value->name.PHP_EOL;
      $message .= "Id: ".$value->id.PHP_EOL;

      $processLog .= $message;
      echo $message;
    }
  }
}

$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $processLog);
fclose($fh);

exit(0);
?>
