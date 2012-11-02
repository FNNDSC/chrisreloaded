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

/**
 * Create data download from MRN feed.
 * Details is the MRN to be downloaded.
 * @param int $user_id owner of the action
 * @param string $details details of the action: "MRN to be downloaded"
 * @return string
 * @todo couple of duplication with pacs_process.php
 */
static private function _createDataDownMRN($user_id,$details){
  // get PACS information about this MRN for this action
  $results = FeedC::_queryPACS("data-down-mrn", $details);

  // if no data available, return null
  if(count($results[1]) == 0)
  {
    return "No data available from pacs for: data-down-mrn - ".$details;
  }

  // LOCK DB Patient on write so no patient will be added in the meanwhile
  $db = DB::getInstance();
  $db->lock('patient', 'WRITE');

  // look for the patient
  $patientMapper = new Mapper('Patient');
  $patientMapper->filter('patient_id = (?)',$results[0]['PatientID'][0]);
  $patientResult = $patientMapper->get();
  $patient_chris_id = -1;
  // create patient if doesn't exist
  if(count($patientResult['Patient']) == 0)
  {
    // create patient model
    $patientObject = new Patient();
    $patientObject->name = $results[0]['PatientName'][0];
    $date = $results[0]['PatientBirthDate'][0];
    $datetime =  substr($date, 0, 4).'-'.substr($date, 4, 2).'-'.substr($date, 6, 2);
    $patientObject->dob = $datetime;
    $patientObject->sex = $results[0]['PatientSex'][0];
    $patientObject->patient_id = $results[0]['PatientID'][0];
    // add the patient model and get its id
    $patient_chris_id = Mapper::add($patientObject);
  }
  // else get its id
  else{
    $patient_chris_id = $patientResult['Patient'][0]->id;
  }

  // unlock patient table
  $db->unlock();

  // loop through all data to be downloaded
  // if data not there, create rown in the data db table
  // update the feed ids and status
  $feed_ids = '';
  $feed_status = '';
  foreach ($results[1]['SeriesInstanceUID'] as $key => $value){
    // lock data db so no data added in the meanwhile
    $db = DB::getInstance();
    $db->lock('data', 'WRITE');

    // retrieve the data
    $dataMapper = new Mapper('Data');
    $dataMapper->filter('unique_id = (?)',$value);
    $dataResult = $dataMapper->get();
    // if nothing in DB yet, add it
    if(count($dataResult['Data']) == 0)
    {
      // add data and get its id
      $dataObject = new Data();
      $dataObject->unique_id = $value;
      $dataObject->nb_files = $results[1]['NumberOfSeriesRelatedInstances'][$key];
      // set series description
      // check if available...
      $dataObject->patient_id = $patient_chris_id;
      $dataObject->name = '';

      // make sure all fiels are provided
      $series_description = sanitize($results[1]['SeriesDescription'][$key]);
      $dataObject->name .= $series_description;
      $dataObject->time = '';
      $dataObject->meta_information = '';
      // add data in db
      $feed_ids .= Mapper::add($dataObject) . ';';
    }
    // else get its id
    else{
      $feed_ids .= $dataResult['Data'][0]->id . ';';
    }
    $feed_status .= '1';
    $db->unlock();
  }

  // create feed and add it to db
  $feedObject = new Feed();
  $feedObject->user_id = $user_id;
  $feedObject->action = 'data-down';
  $feedObject->model = 'data';
  $feedObject->model_id = $feed_ids;
  $feedObject->time = date("Y-m-d H:i:s");
  $feedObject->status = $feed_status;
  Mapper::add($feedObject);

}

/**
 * Convenience method to get information from the PACS for a give action.
 * Access patient information without need to download data.
 * Information such as "NumberOfSeriesRelatedInstances" are only accessible though PACS query.
 *
 * @param string $action action name
 * @param string $details action details
 * @return array
 */
// get PACS information about this MRN for this action
static private function _queryPACS($action, &$details){
  switch ($action){
    case "data-down-mrn":
      // details is mrn in this action
      // get information from the PACS
      $pacs = new PACS(PACS_SERVER, PACS_PORT, CHRIS_AETITLE);
      $study_parameter = Array();
      $study_parameter['PatientID'] = $details;
      $study_parameter['PatientName'] = '';
      $study_parameter['PatientBirthDate'] = '';
      $study_parameter['PatientSex'] = '';
      $series_parameter = Array();
      $series_parameter['SeriesDescription'] = '';
      $series_parameter['NumberOfSeriesRelatedInstances'] = '';
      return $pacs->queryAll($study_parameter, $series_parameter, null);
      break;
    default:
      return "Cannot query pacs for unknown unknown action";
      break;
  }

}
?>