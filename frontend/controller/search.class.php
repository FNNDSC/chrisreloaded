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

// prevent direct calls
// if (!defined('__CHRIS_ENTRY_POINT__'))
// die('Invalid access.');
define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
require_once ('../config.inc.php');

// include the mapper class
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));
// include the template class
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));

// include the patient class
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'scan.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'modality.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'result_scan.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'result.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'result_project.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'project.model.php'));

class Search {

  /**
   *
   * The instance reference for the singleton pattern.
   *
   * @var Search $instance
   */
  private static $instance = null;

  /**
   *
   * The project mapper.
   *
   * @var Mapper $project
   */
  private $project = null;

  /**
   *
   * The project search field.
   *
   * @var string $projectSearchFields
   */
  private $projectSearchFields = null;

  /**
   *
   * The result mapper.
   *
   * @var Mapper $result
   */
  private $result = null;

  /**
   *
   * The result search field.
   *
   * @var string $resultSearchFields
   */
  private $resultSearchFields = null;

  /**
   *
   * The data mapper.
   *
   * @var Mapper $data
   */
  private $data = null;

  /**
   *
   * The data search field.
   *
   * @var string $dataSearchFields
   */
  private $dataSearchFields = null;

  /**
   * This constructor is private and can not be called. All access must
   * happen through the static Search::getInstance() method to apply the singleton
   * pattern.
   * Creates the mappers and sets the search fields.
   */
  private function __construct() {
    $this->dataMapperInit();
    $this->resultMapperInit();
    $this->projectMapperInit();
  }

  /**
   * Get the instance of the Search class. This always creates a valid
   * instance by either creating a new one or by returning an existing one.
   *
   * @return Search The instance to use.
   */
  public static function getInstance() {
    if (!self::$instance) {
      // first call, create an instance
      self::$instance = new Search();
    }
    // return the new or existing instance
    return self::$instance;
  }

  /**
   * Initiate the project mapper and the project search field
   */
  private function projectMapperInit() {
    $this->project = new Mapper('Scan');
    $this->project->ljoin('Patient')->ljoin('Result_Scan', 'scan.id = Result_Scan.scan_id')->ljoin('Result', 'result.id = Result_Scan.result_id')->ljoin('Result_Project', 'Result_Project.result_id = result.id')->ljoin('Project', 'project.id = Result_Project.project_id');
    $this->project->group('project.name');
    $this->projectSearchFields = Array(0 => 'patient.firstname', 1 => 'patient.lastname', 2 => 'result.plugin', 3 => 'project.name');
  }

  /**
   * Initiate the result mapper and the result search field
   */
  private function resultMapperInit() {
    $this->result = new Mapper('Scan');
    $this->result->join('Patient')->join('Result_Scan', 'scan.id = Result_Scan.scan_id')->join('Result', 'result.id = Result_Scan.result_id');
    $this->resultSearchFields = Array(0 => 'patient.firstname', 1 => 'patient.lastname', 2 => 'result.plugin');
  }

  /**
   * Initiate the data mapper and the data search field
   */
  private function dataMapperInit() {
    $this->data = new Mapper('Scan');
    $this->data->join('Patient');
    $this->dataSearchFields = Array(0 => 'scan.name', 1 => 'patient.firstname', 2 => 'patient.lastname');

  }

  /**
   * Seach for matches given a input string.
   * String is splitted on white spaces.
   * If special character is detected we use it directly.
   *
   * @param[in] $searchField the search input string
   */
  public function advancedSearch($searchField) {
    //split input stringon white spaces
    // might need trim
    $singleField = explode(" ", $searchField);

    // set index 0, to join the sub filters
    $this->data->filter('', '', 0);
    $this->result->filter('', '', 0);
    $this->project->filter('', '', 0);

    $i = 1;
    foreach ($singleField as $single) {

      if ($single != '') {
        $match = preg_match('/[\W]+/', $single);
        // if special character has been detected
        if ($match) {
          // foreach ($this->dataSearchFields as $field) {
          // $this->data->filter($single, $i, 'OR');
          // }
          // foreach ($this->resultSearchFields as $field) {
          // $this->result->filter($single, $i, 'OR');
          // }
          // foreach ($this->projectSearchFields as $field) {
          // $this->project->filter($single, $i, 'OR');
          // }
          // if NO special character has been detected - simple string
        } else {
          foreach ($this->dataSearchFields as $field) {
            $condition = strtolower($field).' LIKE CONCAT("%",?,"%")';
            $this->data->filter($condition, $single, $i, 'OR');
          }
          foreach ($this->resultSearchFields as $field) {
            $condition = strtolower($field).' LIKE CONCAT("%",?,"%")';
            $this->result->filter($condition, $single, $i, 'OR');
          }
          foreach ($this->projectSearchFields as $field) {
            $condition = strtolower($field).' LIKE CONCAT("%",?,"%")';
            $this->project->filter($condition, $single, $i, 'OR');
          }
        }
      }
      $i++;
    }

    // get objects from mapper
    $data = $this->data->get();
    $result = $this->result->get();
    $project = $this->project->get();

    // push objects to array
    $all = Array();
    $all['Project'] = $project;
    $all['Data'] = $data;
    $all['Result'] = $result;

    //jsonify
    echo json_encode($all);
  }

}

$searchField = $_POST['field'];
// sanitize $searchField

$search = Search::getInstance();
$search->advancedSearch($searchField);
?>