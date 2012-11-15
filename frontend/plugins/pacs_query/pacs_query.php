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
require_once ('../../config.inc.php');
// include chris db interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'db.class.php'));
// include chris mapper interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'mapper.class.php'));

// include the pacs pull configuration
require_once ('config.inc.php');
// include pacs helper
require_once 'pacs.class.php';

$pacs_level = 'STUDY';
$pacs_study_date = '';
$pacs_accession_number = '';
$pacs_modality = 'MR';
$pacs_study_description = '';
$pacs_series_description = '';
$pacs_name = '';
$pacs_mrn = '4524909';
$pacs_birthday = '';
$pacs_study_uid = '';
$pacs_serie_uid = '';
$chris_json = '';
$chris_performed_station_aet = '';

$pacs = new PACS(PACS_SERVER, PACS_PORT, PACS_AETITLE);

// set values to be filtered out after pacs query
$post_filter = Array();
$post_filter['PerformedStationAETitle'] = $chris_performed_station_aet;

if($pacs_level == 'STUDY'){
  $pacs->addParameter('StudyDate', $pacs_study_date);
  $pacs->addParameter('AccessionNumber', $pacs_accession_number);
  $pacs->addParameter('RetrieveAETitle', PACS_AETITLE);
  $pacs->addParameter('ModalitiesInStudy', $pacs_modality);
  $pacs->addParameter('StudyDescription', $pacs_study_description);
  $pacs->addParameter('PatientName', $pacs_name);
  $pacs->addParameter('PatientID', $pacs_mrn);
  $pacs->addParameter('PatientBirthDate', $pacs_birthday);
  $pacs->addParameter('StudyInstanceUID', $pacs_study_uid);
  $pacs->addParameter('PerformedStationAETitle', $chris_performed_station_aet);
  $chris_json .= json_encode(PACS::postFilter("study", $pacs->queryStudy(), $post_filter));
}
elseif ($pacs_level == 'SERIES'){
  $pacs->addParameter('RetrieveAETitle', PACS_AETITLE);
  $pacs->addParameter('StudyInstanceUID', $pacs_study_uid);
  $pacs->addParameter('SeriesDescription', $pacs_series_description);
  $pacs->addParameter('SeriesInstanceUID', $pacs_serie_uid);
  $pacs->addParameter('NumberOfSeriesRelatedInstances', '');
  $pacs->addParameter('PerformedStationAETitle', $chris_performed_station_aet);
  $chris_json .= json_encode($pacs->querySeries());
}
elseif ($pacs_level == 'IMAGE'){
  $pacs->addParameter('RetrieveAETitle', PACS_AETITLE);
  $pacs->addParameter('StudyInstanceUID', $pacs_study_uid);
  $pacs->addParameter('SeriesInstanceUID', $pacs_serie_uid);
  $pacs->addParameter('ProtocolName', '');
  $pacs->addParameter('PerformedStationAETitle', $chris_performed_station_aet);
  $chris_json .= json_encode($pacs->queryImage());
}
else{
  $study_parameter = Array();
  $study_parameter['PatientID'] = $pacs_mrn;
  $study_parameter['PatientName'] = $pacs_name;
  $study_parameter['PatientBirthDate'] = $pacs_birthday;
  $study_parameter['StudyDate'] = $pacs_study_date;
  $study_parameter['StudyDescription'] = $pacs_study_description;
  $study_parameter['ModalitiesInStudy'] = $pacs_modality;
  $study_parameter['PerformedStationAETitle'] = $chris_performed_station_aet;

  $series_parameter = Array();
  $series_parameter['NumberOfSeriesRelatedInstances'] = '';
  $series_parameter['SeriesDescription'] = '';
  /*
   $image_parameter = Array();
  $image_parameter['NumberOfSeriesRelatedInstances'] = '';
  $image_parameter['DeviceSerialNumber']= '';
  $image_parameter['ProtocolName']= '';  */
  //$image_parameter['SOPInstanceUID']= '';

  $chris_json .= json_encode(PACS::postFilter("all", $pacs->queryAll($study_parameter, $series_parameter, null), $post_filter));
}

// need full path!
$myFile = "study.json";
$fh = fopen($myFile, 'w') or die("can't open file");
fwrite($fh, $chris_json);
fclose($fh);
?>