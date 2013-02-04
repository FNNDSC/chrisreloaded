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
$shortopts = "o:n:d:i:s:1:2:3:4:5:6:7:";

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
  $agemin = $options['3'];
}
if(isset($options['4'])){
  $agemax = $options['4'];
}
if(isset($options['5'])){
  $modality = $options['5'];
}
if(isset($options['6'])){
  $datemin = $options['6'];
}
if(isset($options['7'])){
  $datemax = $options['7'];
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
    $study_mapper->filter('patient.id = (?)', $value->id);
    if(isset($description)){
      $study_mapper->filter('study.description LIKE CONCAT("%",?,"%")', $description);
      $processLog .= 'description: '. $description.PHP_EOL;
    }

    if(isset($location)){
      $study_mapper->filter('study.location LIKE CONCAT("%",?,"%")', $location);
      $processLog .= 'location: '. $location.PHP_EOL;
    }

    if(isset($agemin)){
      $study_mapper->filter('study.age >= (?)', $agemin);
      $processLog .= 'agemin: '. $agemin.PHP_EOL;
    }

    if(isset($agemax)){
      $study_mapper->filter('study.age <= (?)', $agemax);
      $processLog .= 'agemax: '. $agemax.PHP_EOL;
    }

    if(isset($modality)){
      $study_mapper->filter('study.modality LIKE CONCAT("%",?,"%")', $modality);
      $processLog .= 'modality: '. $modality.PHP_EOL;
    }

    if(isset($datemin)){
      $study_mapper->filter('study.date >= (?)', $datemin);
      $processLog .= 'datemin: '. $datemin.PHP_EOL;
    }

    if(isset($datemax)){
      $study_mapper->filter('study.date <= (?)', $datemax);
      $processLog .= 'datemax: '. $datemax.PHP_EOL;
    }

    $study_results = $study_mapper->get();
    if(count($study_results['Data']) >= 1){
      foreach($study_results['Data'] as $key => $value){
        $processLog .= $study_results['Patient'][$key]->id.PHP_EOL;

        // create patient directory
        $fs_location = $study_results['Patient'][$key]->uid.'-'.$study_results['Patient'][$key]->id;
        $patientdir = $output_dir.$fs_location;

        // create study directory
        $fs_location .= '/'.formatStudy($study_results['Study'][$key]->date, $study_results['Study'][$key]->age, $study_results['Study'][$key]->description).'-'.$study_results['Study'][$key]->id;
        $studydir = $output_dir.$fs_location;

        // create data symlink
        // loop through results and create links
        $processLog .= date('Y-m-d h:i:s').' Creates soft link for Patient'.PHP_EOL;
        // create data soft links
        $dataObject->description.'-'.$dataObject->name;
        $name = '';
        if(file_exists(CHRIS_DATA.$fs_location.'/'.$value->description.'-'.$value->name.'-'.$value->id))
        {
          $name = $value->description.'-'.$value->name.'-'.$value->id;
        }
        else if(file_exists(CHRIS_DATA.$fs_location.'/'.$value->name.'-'.$value->id)){
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

          $target = CHRIS_DATA.$fs_location.'/'.$name;
          $destination = $studydir.'/'.$name;

          $processLog .= CHRIS_DATA.$fs_location.'/'.$name.PHP_EOL;
          $processLog .= $studydir.'/'.$name.PHP_EOL;

          // create sof link
          echo $target.PHP_EOL;
          echo $destination.PHP_EOL;
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