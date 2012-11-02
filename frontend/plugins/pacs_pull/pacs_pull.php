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
require_once 'db.class.php';
require_once 'mapper.class.php';
require_once 'pacs.class.php';

// include the models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));

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
  echo json_encode($pacs->moveStudy());
}
else{

  // if chris1.0, push data to chris1.0 as well for the preview
  if($_POST['USER_AET'] == 'FNNDSC-CHRIS'){
    $pacs->addParameter('StudyInstanceUID', $_POST['PACS_STU_UID']);
    $pacs->addParameter('SeriesInstanceUID', $_POST['PACS_SER_UID']);
    $pacs->moveSeries();

    // check if series already there
    // retrieve the data
    $dataMapper = new Mapper('Data');
    $dataMapper->filter('unique_id = (?)',$_POST['PACS_SER_UID']);
    $dataResult = $dataMapper->get();

    // if data already there, do not do anything!
    if(count($dataResult['Data']) > 0)
    {
      echo json_encode('');
      return;
    }

    $pacs2 = new PACS($_POST['SERVER_IP'], $_POST['SERVER_POR'], 'FNNDSC-CHRISTEST');
    $pacs2->addParameter('StudyInstanceUID', $_POST['PACS_STU_UID']);
    $pacs2->addParameter('SeriesInstanceUID', $_POST['PACS_SER_UID']);
    echo json_encode($pacs2->moveSeries());
  }
  else{
    // check if series already there
    // retrieve the data
    $dataMapper = new Mapper('Data');
    $dataMapper->filter('unique_id = (?)',$_POST['PACS_SER_UID']);
    $dataResult = $dataMapper->get();

    // if data already there, do not do anything!
    if(count($dataResult['Data']) > 0)
    {
      echo json_encode('Data already there');
      return;
    }

    $pacs2 = new PACS($_POST['SERVER_IP'], $_POST['SERVER_POR'], $_POST['USER_AET']);
    $pacs2->addParameter('StudyInstanceUID', $_POST['PACS_STU_UID']);
    $pacs2->addParameter('SeriesInstanceUID', $_POST['PACS_SER_UID']);
    echo json_encode($pacs2->moveSeries());
  }

}
?>