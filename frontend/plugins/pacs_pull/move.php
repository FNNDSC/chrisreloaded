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

// include pacs helper
require_once (joinPaths(CHRIS_PLUGINS_FOLDER, 'pacs_pull/pacs.class.php'));

$shortopts = "d:";

$options = getopt($shortopts);

$study_directory = $options['d'];

// open log file
$logFile = joinPaths(CHRIS_LOG, 'pacs_pull_listen_test.log');
$fh = fopen($logFile, 'a')  or die("can't open file");

// move all files from this directory to centralized data
// 1 file of 1 serie at once
if ($handle = opendir($study_directory)) {
  while (false !== ($entry = readdir($handle))) {
    if($entry != "." && $entry != ".."){
      if (is_dir($study_directory.'/'.$entry)) {
        // loop through subdirectory
        if ($sub_handle = opendir($study_directory.'/'.$entry)) {
          while (false !== ($sub_entry = readdir($sub_handle))) {
            if($sub_entry != "." && $sub_entry != ".." && is_file($study_directory.'/'.$entry.'/'.$sub_entry)){
              $process_file = PACS::process($study_directory.'/'.$entry.'/'.$sub_entry);
              
              //get patient id
              
              //get data id
              
              // do we have a match? (patient AND data exist)
              $match = true;
              if($match){
                fwrite($fh, 'got one match! '.PHP_EOL);
                fwrite($fh, $study_directory.'/'.$entry.'/'.$sub_entry.PHP_EOL);
                // move file at good location
                // CHRIS_DATA/MRN-UID/SERIESDESC-UID/index.dcm
                
                // +1 increase data status
                
                // create nifti??
                
                // delete file
                unlink($study_directory.'/'.$entry.'/'.$sub_entry);
              }
              else{
                // add to log
                // go to next tmp subdirectory
              }
            }
          }
          closedir($sub_handle);
          // delete directory
          rmdir($study_directory.'/'.$entry);
        }
      }
    }
  }
  closedir($handle);
  // delete directory
  rmdir($study_directory);
}

fclose($fh); 
?>