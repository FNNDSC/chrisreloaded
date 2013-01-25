<?php
/**
*
* sSSs .S S. .S_sSSs .S sSSs
* d%%SP .SS SS. .SS~YS%%b .SS d%%SP
* d%S' S%S S%S S%S `S%b S%S d%S'
* S%S S%S S%S S%S S%S S%S S%|
* S&S S%S SSSS%S S%S d* S S&S S&S
* S&S S&S SSS&S S&S .S* S S&S Y&Ss
* S&S S&S S&S S&S_sdSSS S&S `S&&S
* S&S S&S S&S S&S~YSY%b S&S `S*S
* S*b S*S S*S S*S `S%b S*S l*S
* S*S. S*S S*S S*S S%S S*S .S*P
* SSSbs S*S S*S S*S S&S S*S sSS*S
* YSSP SSS S*S S*S SSS S*S YSS'
* SP SP SP
* Y Y Y
*
* R E L O A D E D
*
* (c) 2012 Fetal-Neonatal Neuroimaging & Developmental Science Center
* Boston Children's Hospital
*
* http://childrenshospital.org/FNNDSC/
* dev@babyMRI.org
*
*/
define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
require_once (dirname(dirname(dirname(__FILE__))).'/config.inc.php');
require_once '../pacs_pull/pacs.class.php';

$pacs = new PACS($_POST['SERVER_IP'], $_POST['SERVER_POR'], $_POST['USER_AET']);

// set values to be filtered out after pacs query
$post_filter = Array();
$post_filter['PerformedStationAETitle'] = $_POST['PACS_PSAET'];

if($_POST['PACS_LEV'] == 'ALL'){
  $study_parameter = Array();
  $study_parameter['PatientID'] = $_POST['PACS_MRN'];
  $study_parameter['PatientName'] = $_POST['PACS_NAM'];
  $study_parameter['PatientBirthDate'] = '';
  $study_parameter['StudyDate'] = $_POST['PACS_DAT'];
  $study_parameter['StudyDescription'] = $_POST['PACS_STU_DES'];
  $study_parameter['ModalitiesInStudy'] = $_POST['PACS_MOD'];
  $study_parameter['PerformedStationAETitle'] = '';

  $series_parameter = Array();
  $series_parameter['NumberOfSeriesRelatedInstances'] = '';
  $series_parameter['SeriesDescription'] = '';

  echo json_encode(PACS::postFilter("all", $pacs->queryAll($study_parameter, $series_parameter, null), $post_filter));
}
else{

}
?>