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
require_once ('../config.inc.php');
require_once 'pacs.class.php';

$pacs = new PACS($_POST['SERVER_IP'], $_POST['SERVER_POR'], $_POST['USER_AET']);

if($_POST['PACS_LEV'] == 'STUDY'){
  $pacs->addParameter('StudyDate', $_POST['PACS_DAT']);
  $pacs->addParameter('AccessionNumber', $_POST['PACS_ACC_NUM']);
  $pacs->addParameter('RetrieveAETitle', $_POST['USER_AET']);
  $pacs->addParameter('ModalitiesInStudy', $_POST['PACS_MOD']);
  $pacs->addParameter('StudyDescription', $_POST['PACS_STU_DES']);
  $pacs->addParameter('PatientName', $_POST['PACS_NAM']);
  $pacs->addParameter('PatientID', $_POST['PACS_MRN']);
  $pacs->addParameter('PatientBirthDate', '');
  $pacs->addParameter('StudyInstanceUID', $_POST['PACS_STU_UID']);
  echo json_encode($pacs->queryStudy());
}
else{
  $pacs->addParameter('RetrieveAETitle', '');
  $pacs->addParameter('StudyInstanceUID', $_POST['PACS_STU_UID']);
  $pacs->addParameter('SeriesInstanceUID', '');
  $pacs->addParameter('NumberOfSeriesRelatedInstances', '');
  echo json_encode($pacs->querySeries());
}
?>