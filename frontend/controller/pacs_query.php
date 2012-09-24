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
require_once (dirname(dirname(__FILE__)).'/config.inc.php');
require_once 'pacs.class.php';

$pacs = new PACS($_POST['SERVER_IP'], $_POST['SERVER_POR'], $_POST['USER_AET']);

if($_POST['PACS_LEV'] == 'STUDY'){
  $pacs->addParameter('StudyDate', $_POST['PACS_DAT']);
  $pacs->addParameter('AccessionNumber', $_POST['PACS_ACC_NUM']);
  $pacs->addParameter('RetrieveAETitle', $_POST['USER_AET']);
  $pacs->addParameter('ModalitiesInStudy', $_POST['PACS_MOD']);
  $pacs->addParameter('StudyDescription', $_POST['PACS_STU_DES']);
  $pacs->addParameter('StudyDate', $_POST['PACS_DAT']);
  $pacs->addParameter('PatientName', $_POST['PACS_NAM']);
  $pacs->addParameter('PatientID', $_POST['PACS_MRN']);
  $pacs->addParameter('PatientBirthDate', '');
  $pacs->addParameter('StudyInstanceUID', $_POST['PACS_STU_UID']);
  echo json_encode($pacs->queryStudy());
}
elseif ($_POST['PACS_LEV'] == 'SERIES'){
  $pacs->addParameter('RetrieveAETitle', '');
  $pacs->addParameter('StudyInstanceUID', $_POST['PACS_STU_UID']);
  $pacs->addParameter('SeriesDescription', $_POST['PACS_SER_DES']);
  $pacs->addParameter('SeriesInstanceUID', '');
  $pacs->addParameter('NumberOfSeriesRelatedInstances', '');
  echo json_encode($pacs->querySeries());
}
elseif ($_POST['PACS_LEV'] == 'IMAGE'){
  $pacs->addParameter('RetrieveAETitle', '');
  $pacs->addParameter('StudyInstanceUID', $_POST['PACS_STU_UID']);
  $pacs->addParameter('SeriesInstanceUID', $_POST['PACS_SER_UID']);
  $pacs->addParameter('ProtocolName', '');
  echo json_encode($pacs->queryImage());
}
else{
  $study_parameter = Array();
  $study_parameter['PatientID'] = $_POST['PACS_MRN'];
  $study_parameter['PatientName'] = $_POST['PACS_NAM'];
  $study_parameter['PatientBirthDate'] = '';
  $study_parameter['StudyDate'] = $_POST['PACS_DAT'];
  $study_parameter['StudyDescription'] = $_POST['PACS_STU_DES'];
  $study_parameter['ModalitiesInStudy'] = $_POST['PACS_MOD'];

  $series_parameter = Array();
  $series_parameter['NumberOfSeriesRelatedInstances'] = '';
  $series_parameter['SeriesDescription'] = '';
/* 
  $image_parameter = Array();
  $image_parameter['NumberOfSeriesRelatedInstances'] = '';
  $image_parameter['DeviceSerialNumber']= '';
  $image_parameter['ProtocolName']= '';  */
  //$image_parameter['SOPInstanceUID']= '';

  echo json_encode($pacs->queryAll($study_parameter, $series_parameter, null));
}
?>