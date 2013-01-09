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

// include pacs helper
require_once (joinPaths(CHRIS_PLUGINS_FOLDER, 'pacs_pull/pacs.class.php'));

// define the options
$shortopts = "o:n:d:i:s:1:2:3:4:5";

$options = getopt($shortopts);

$output_dir = $options['o'];

if(isset($options['n'])){
  $name = $options['n'];
}
if(isset($options['d'])){
  $dob = $options['d'];
}
if(isset($options['i'])){
  $id = $options['i'];
}
if(isset($options['s'])){
  $sex = $options['s'];
}
if(isset($options['1'])){
  $description = $options['1'];
}
if(isset($options['2'])){
  $location = $options['2'];
}
if(isset($options['3'])){
  $age = $options['3'];
}
if(isset($options['4'])){
  $modality = $options['4'];
}
if(isset($options['5'])){
  $date = $options['5'];
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

$mapper = new Mapper($type);

//
// 2- Build search conditions MAPPER CLASS
//
$conditionLog = '======================================='.PHP_EOL;
$conditionLog .= date('Y-m-d h:i:s'). ' ---> Build search conditions...'.PHP_EOL;

$conditionLog .= 'type: '. $type.PHP_EOL;
if(isset($name)){
  $mapper->filter('name LIKE CONCAT("%",?,"%")', $name);
  $conditionLog .= 'name: '. $name.PHP_EOL;
}

if(isset($dob)){
  $mapper->filter('dob LIKE CONCAT("%",?,"%")', $dob);
  $conditionLog .= 'dob: '. $dob.PHP_EOL;
}

if(isset($id)){
  $mapper->filter('uid LIKE CONCAT("%",?,"%")', $id);
  $conditionLog .= 'uid: '. $id.PHP_EOL;
}

if(isset($sex)){
  $mapper->filter('sex LIKE CONCAT("%",?,"%")', $sex);
  $conditionLog .= 'sex: '. $sex.PHP_EOL;
}


$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $conditionLog);
fclose($fh);

//
// 3- Run Database query
//
$runLog = '======================================='.PHP_EOL;
$runLog .= date('Y-m-d h:i:s'). ' ---> Run search...'.PHP_EOL;

$mapperResults = $mapper->get();

$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $runLog);
fclose($fh);


//
// 4- Process results
//
$processLog = '======================================='.PHP_EOL;
$processLog .= date('Y-m-d h:i:s'). ' ---> Process search results...'.PHP_EOL;

if(count($mapperResults[$type]) >= 1){
  $processLog .= date('Y-m-d h:i:s'). count($mapperResults[$type]).' match(es) in the database'.PHP_EOL;

  // create links in output directory!
  foreach ($mapperResults[$type] as $key => $value) {
    // if we have matches on patient, look for matches on the data!
    // get all data for patient and link it to its study
    // with search conditions
    $study_mapper = new Mapper('Patient');
    $study_mapper->ljoin('Data_Patient', 'patient.id = Data_Patient.patient_id')->ljoin('Data', 'Data_Patient.data_id = data.id')->ljoin('Data_Study', 'data.id = Data_Study.data_id')->ljoin('Study', 'Data_Study.study_id = study.id');
    if(isset($description)){
      $study_mapper->filter('study.description LIKE CONCAT("%",?,"%")', $description);
      $processLog .= 'description: '. $description.PHP_EOL;
    }
    
    if(isset($location)){
      $study_mapper->filter('study.location LIKE CONCAT("%",?,"%")', $location);
      $processLog .= 'location: '. $location.PHP_EOL;
    }
    
    if(isset($age)){
      $study_mapper->filter('study.age LIKE CONCAT("%",?,"%")', $age);
      $processLog .= 'age: '. $age.PHP_EOL;
    }
    
    if(isset($modality)){
      $study_mapper->filter('study.modality LIKE CONCAT("%",?,"%")', $modality);
      $processLog .= 'modality: '. $modality.PHP_EOL;
    }
    
    if(isset($date)){
      $study_mapper->filter('study.date LIKE CONCAT("%",?,"%")', $date);
      $processLog .= 'date: '. $date.PHP_EOL;
    }
    
    $study_results = $study_mapper->get();
    if(count($study_results['Data']) >= 1){
      print_r($study_results['Data']);
    }
    // loop through results and create links
    //$processLog .= date('Y-m-d h:i:s').' Creates soft link for Patient'.PHP_EOL;
    // create data soft links
    //$target = CHRIS_DATA.$value->uid.'-'.$value->id;
    //$destination = $output_dir.$value->uid.'-'.$value->id;

    // create sof link
    //symlink($target, $destination);
  }

}
else{
  $processLog .= date('Y-m-d h:i:s'). ' No match in the database'.PHP_EOL;
}

$fh = fopen($logFile, 'a')  or die("can't open file");
fwrite($fh, $processLog);
fclose($fh);

exit(0);
?>