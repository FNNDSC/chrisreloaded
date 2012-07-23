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
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'patient.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'scan.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'modality.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'result_scan.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'result.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'result_project.class.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'project.class.php'));

class Search {

  private static $instance = null;

  private $project = null;
  private $projectSearchFields = null;

  private $result = null;
  private $resultSearchFields = null;

  private $data = null;
  private $dataSearchFields = null;

  private $pipeline = null;
  private $pipelineSearchFields = null;

  private function __construct() {
    $this->dataMapperInit();
    $this->resultMapperInit();
    $this->projectMapperInit();
  }

  public static function getInstance() {

    if (!self::$instance) {

      // first call, create an instance
      self::$instance = new Search();

    }

    // return the new or existing instance
    return self::$instance;

  }

  private function projectMapperInit() {
    $this->project = new Mapper('Scan');
    $this->project->join('Patient')
    ->join('Result_Scan', 'scan.id = Result_Scan.scan_id')
    ->join('Result', 'result.id = Result_Scan.result_id')
    ->join('Result_Project', 'Result_Project.result_id = result.id')
    ->join('Project', 'project.id = Result_Project.project_id');

    $this->projectSearchFields = Array(0 => 'firstname', 1 => 'lastname', 2 => 'project.name');
  }

  private function resultMapperInit() {
    $this->result = new Mapper('Scan');
    $this->result->join('Patient')->join('Result_Scan', 'scan.id = Result_Scan.scan_id')->join('Result', 'result.id = Result_Scan.result_id');

    $this->resultSearchFields = Array(0 => 'firstname', 1 => 'lastname', 2 => 'plugin');
  }

  private function dataMapperInit() {
    $this->data = new Mapper('Scan');
    $this->data->join('Patient');

    $this->dataSearchFields = Array(0 => 'firstname', 1 => 'lastname');

  }

  public function advancedSearch($searchField) {
    $singleField = explode(" ", $searchField);

    // set index 0, to join the sub filters

    $this->data->filter('AND', 0);
    $this->result->filter('AND', 0);
    $this->project->filter('AND', 0);

    $i = 1;
    foreach ($singleField as $single) {

      $match = preg_match('/[\W]+/', $single);

      if ($match) {

        foreach ($this->dataSearchFields as $field) {
          $this->data->filter($single, $i, 'OR');
        }

        foreach ($this->resultSearchFields as $field) {
          $this->result->filter($single, $i, 'OR');
        }
        
        //
        foreach ($this->projectSearchFields as $field) {
        $this->project->filter($single, $i, 'OR');
        }

      } else {
        // build query
        foreach ($this->dataSearchFields as $field) {
          $this->data->filter($field.' like \'%'.$single.'%\'', $i, 'OR');
        }

        foreach ($this->resultSearchFields as $field) {
          $this->result->filter($field.' like \'%'.$single.'%\'', $i, 'OR');
        }

        foreach ($this->projectSearchFields as $field) {
        $this->project->filter($field.' like \'%'.$single.'%\'', $i, 'OR');
        }
      }

      $i++;
    }

    $data = $this->data->objects();
    $result = $this->result->objects();
    $project = $this->project->objects();

    $all = Array();
    // $all['Project'] = Array();
    // array_push($all['Project'], $project);

    $all['Data'] = $data;
    $all['Result'] = $result;
    $all['Project'] = $project;
    echo json_encode($all);

  }

}

$searchField = $_POST['field'];
$search = Search::getInstance();
$search->advancedSearch($searchField);
?>