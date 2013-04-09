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

// include the configuration
require_once (dirname(dirname(dirname(dirname(__FILE__)))).'/config.inc.php');
require_once '../pacs.class.php';

// convenience method to check if variable is set or not
function is_set($variable, $value = '') {
  return isset($variable)?$variable:$value;
}
// server ip
$serverip = is_set($_POST['SERVER_IP'],'134.174.12.21');
// server port
$serverport = is_set($_POST['SERVER_POR'],'104');
// user aetitle
$useraetitle = is_set($_POST['USER_AET'],'FNNDSC-CHRISTEST');
// instantiate PACS class
$pacs = new PACS($serverip, $serverport, $useraetitle);

// create study filters
$study_parameter = Array();
$study_parameter['PatientID'] = is_set($_POST['PACS_MRN']);
$study_parameter['PatientName'] = is_set($_POST['PACS_NAM']);
$study_parameter['PatientBirthDate'] = '';
$study_parameter['StudyDate'] = is_set($_POST['PACS_DAT']);
$study_parameter['StudyDescription'] = '';
$study_parameter['ModalitiesInStudy'] = is_set($_POST['PACS_MOD']);
$study_parameter['PerformedStationAETitle'] = '';

// create series filters
$series_parameter = Array();
$series_parameter['NumberOfSeriesRelatedInstances'] = '';
$series_parameter['SeriesDescription'] = '';

// run query
$all_query = $pacs->queryAll($study_parameter, $series_parameter, null);

// post filter
$post_filter = Array();
$post_filter['PerformedStationAETitle'] = is_set($_POST['PACS_PSAET']);
$post_filter['StudyDescription'] = is_set($_POST['PACS_STU_DES']);
$post_filter['SeriesDescription'] = is_set($_POST['PACS_SER_DES']);

// @todo write json file for a nice plugin

// return value
echo json_encode(PACS::postFilter("all",$all_query, $post_filter));

?>