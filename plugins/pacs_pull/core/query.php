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

// include the configuration
require_once (dirname(dirname(dirname(dirname(__FILE__)))).'/config.inc.php');
require_once '../pacs.class.php';

// check if we are invoked by commandline
$commandline_mode = (php_sapi_name() == 'cli');

if ($commandline_mode) {

  // parse the options if we are in commandline mode

  // define the options
  $shortopts = "s:p:a:i::n::d::m::t::y::e::h";
  $longopts  = array(
      "serverip:",     // Required value
      "serverport",    // Required value
      "aetitle",       // Required value
      "patientid::",   // Optional value
      "username::",    // Optional value
      "studydate::",
      "modality::",    // Optional value
      "studydescription::",    // Optional value
      "seriesdescription::",    // Optional value
      "station::",
      "help"    // Optional value
  );

  $options = getopt($shortopts, $longopts);

  if( array_key_exists('h', $options) || array_key_exists('help', $options))
  {
    echo "this is the help!";
    echo "\n";
    return;
  }
  
  //if no command provided, exit
  $serverip = '';
  if( array_key_exists('s', $options))
  {
    $serverip = $options['s'];
  }
  elseif (array_key_exists('$serverip', $options))
  {
    $serverip = $options['$serverip'];
  }
  else{
    echo "no serverip provided!";
    echo "\n";
    return;
  }
  
  //if no command provided, exit
  $serverport = '';
  if( array_key_exists('p', $options))
  {
    $serverport = $options['p'];
  }
  elseif (array_key_exists('$serverport', $options))
  {
    $serverport = $options['$serverport'];
  }
  else{
    echo "no serverport provided!";
    echo "\n";
    return;
  }
  
  //if no command provided, exit
  $aetitle = '';
  if( array_key_exists('a', $options))
  {
    $aetitle = $options['a'];
  }
  elseif (array_key_exists('$aetitle', $options))
  {
    $aetitle = $options['$aetitle'];
  }
  else{
    echo "no aetitle provided!";
    echo "\n";
    return;
  }
  
  //if no command provided, exit
  $patientid = '';
  if( array_key_exists('i', $options))
  {
    $patientid = $options['i'];
  }
  elseif (array_key_exists('patientid', $options))
  {
    $patientid = $options['patientid'];
  }

  // is $patientname given?
  $patientname = '';
  if( array_key_exists('n', $options))
  {
    $patientname = $options['n'];
  }
  elseif (array_key_exists('patientname', $options))
  {
    $patientname = $options['username'];
  }

  // is $studydate given?
  $studydate = '';
  if( array_key_exists('d', $options))
  {
    $studydate = $options['d'];
  }
  elseif (array_key_exists('studydate', $options))
  {
    $studydate = $options['studydate'];
  }

  // is $modality given?
  $modality = '';
  if( array_key_exists('m', $options))
  {
    $modality = sanitize($options['m']);
  }
  elseif (array_key_exists('modality', $options))
  {
    $modality = sanitize($options['modality']);
  }
  
  // is $station given?
  $station = '';
  if( array_key_exists('t', $options))
  {
    $station = sanitize($options['t']);
  }
  elseif (array_key_exists('station', $options))
  {
    $station = sanitize($options['station']);
  }
  
  // is $station given?
  $studydescription = '';
  if( array_key_exists('y', $options))
  {
    $studydescription = sanitize($options['y']);
  }
  elseif (array_key_exists('studydescription', $options))
  {
    $studydescription = sanitize($options['studydescription']);
  }
  
  // is $station given?
  $seriesdescription = '';
  if( array_key_exists('e', $options))
  {
    $seriesdescription = sanitize($options['e']);
  }
  elseif (array_key_exists('seriesdescription', $options))
  {
    $seriesdescription = sanitize($options['seriesdescription']);
  }

}

// instantiate PACS class
$pacs = new PACS($serverip, $serverport, $useraetitle);

// create study filters
$study_parameter = Array();
$study_parameter['PatientID'] = $patientid;
$study_parameter['PatientName'] = $patientname;
$study_parameter['PatientBirthDate'] = '';
$study_parameter['StudyDate'] = $studydate;
$study_parameter['StudyDescription'] = '';
$study_parameter['ModalitiesInStudy'] = $modality;
$study_parameter['PerformedStationAETitle'] = '';

// create series filters
$series_parameter = Array();
$series_parameter['NumberOfSeriesRelatedInstances'] = '';
$series_parameter['SeriesDescription'] = '';

// run query
$all_query = $pacs->queryAll($study_parameter, $series_parameter, null);

// post filter
$post_filter = Array();
$post_filter['PerformedStationAETitle'] = $station;
$post_filter['StudyDescription'] = $studydescription;
$post_filter['SeriesDescription'] = $seriesdescription;

if($commandline_mode){
  // output to file?
}
else{
  echo json_encode(PACS::postFilter("all",$all_query, $post_filter));
}
?>