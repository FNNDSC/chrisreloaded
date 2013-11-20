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
require_once (dirname(dirname( __FILE__ )).'/config.inc.php');
// include chris db interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'db.class.php'));
// include chris mapper interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'mapper.class.php'));
// include pacs helper
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'pacs.helper.php'));
// include chris data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));
// include chris data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'study.model.php'));
// include chris data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_study.model.php'));
// include chris patient models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.model.php'));
// include chris user_data models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data_patient.model.php'));



// main function
$shortopts = "d:";
$options = getopt($shortopts);

// local vars
$output_directory = $options['d'];
$study_directory = $options['d'].'/input';

// parse files in directory to know who we should email
if ($handle2 = opendir($study_directory)) {
  /* This is the correct way to loop over the directory. */
  // make an array from scanners name/conact
  while (false !== ($entry2 = readdir($handle2))) {
    if($entry2 != "." && $entry2 != ".."){
      // get DCM file information
      $process_file = PACS::process($study_directory.'/'.$entry);
      
      // find location in DB
      // process series (data)
      // wait for all files to be received
      $waiting = true;
      $counter = 0;
      while($waiting && $counter < 20){
        // check if *ALL* data is there
        $dataMapper = new Mapper('Data');
        $dataMapper->filter('uid = (?)',$process_file['SeriesInstanceUID'][0]);
        $dataMapper->filter('nb_files = status','');
        $dataResult = $dataMapper->get();
        if(count($dataResult['Data']) > 0){
          //
          // DATA HAS ARRIVED
          //
          // get patient
          $patientMapper = new Mapper('Data_Patient');
          $patientMapper->ljoin('Patient','Patient.id = Data_Patient.patient_id');
          $patientMapper->filter('Data_Patient.data_id = (?)', $dataResult['Data'][0]->id);
          $patientResult = $patientMapper->get();

          // create feed patient directories
          // mkdir if dir doesn't exist
          // create folder if doesnt exists

          $datadirname = $output_directory.'/'.$patientResult['Patient'][0]->uid.'-'.$patientResult['Patient'][0]->id;
          if(!is_dir($datadirname)){
            mkdir($datadirname);
          }

          // study directory
          // get study description
          $studyMapper = new Mapper('Study');
          $studyMapper->filter('uid = (?)', $process_file['StudyInstanceUID'][0]);
          $studyResult = $studyMapper->get();
          $study_dir_name = formatStudy($studyResult['Study'][0]->date, $studyResult['Study'][0]->age, $studyResult['Study'][0]->description).'-'.$studyResult['Study'][0]->id;
          $studydirname = $datadirname.'/'.$study_dir_name;
          if(!is_dir($studydirname)){
            mkdir($studydirname);
          }

          // create data soft links
          $targetbase = CHRIS_DATA.'/'.$patientResult['Patient'][0]->uid.'-'.$patientResult['Patient'][0]->id;
          $series_dir_name = $dataResult['Data'][0]->description .'-'. $dataResult['Data'][0]->name;
          $seriesdirnametarget = $targetbase .'/'.$study_dir_name .'/'.$series_dir_name.'-'.$dataResult['Data'][0]->id;
          $seriesdirnamelink = $datadirname .'/'.$study_dir_name .'/'.$series_dir_name.'-'.$dataResult['Data'][0]->id;
          if(!is_link($seriesdirnamelink)){
            // create sof link
            symlink($seriesdirnametarget, $seriesdirnamelink);
          }

          $waiting = false;
        }
        else{
          sleep(2);
          $counter++;
        }
      }
    }
  }
}
closedir($handle2);

return;

?>
