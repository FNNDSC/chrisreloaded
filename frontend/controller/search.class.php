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
    $this->resultMapperInit();
    $this->projectMapperInit();
    $this->dataMapperInit();
    $this->pipelineMapperInit();
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
    $this->project->join('Patient');

    $this->projectSearchFields = Array(0 => 'firstname');
  }

  private function resultMapperInit() {
    $this->result = new Mapper('Patient');

    $this->resultSearchFields = Array(0 => 'firstname', 1 => 'lastname');
  }

  private function dataMapperInit() {
    $this->data = new Mapper('Scan');
    $this->data->join('Patient')->join('Modality');

    $this->dataSearchFields = Array(0 => 'firstname', 1 => 'lastname', 2 => 'subtype');

  }

  private function pipelineMapperInit() {
    $this->pipeline = new Mapper('Scan');
    $this->pipeline->join('Modality');

    $this->pipelineSearchFields = Array(0 => 'subtype');
  }

  public function advancedSearch($searchField) {
    $singleField = explode(" ", $searchField);

    // set index 0, to join the sub filters
    $this->project->filter('AND', 0);
    $this->result->filter('AND', 0);
    $this->data->filter('AND', 0);
    $this->pipeline->filter('AND', 0);

    $i = 1;
    foreach ($singleField as $single) {

      // build query
      foreach ($this->projectSearchFields as $field) {
        $this->project->filter($field.' like \'%'.$single.'%\'', $i, 'OR');
      }

      foreach ($this->resultSearchFields as $field) {
        $this->result->filter($field.' like \'%'.$single.'%\'', $i, 'OR');
      }

      foreach ($this->dataSearchFields as $field) {
        $this->data->filter($field.' like \'%'.$single.'%\'', $i, 'OR');
      }

      foreach ($this->pipelineSearchFields as $field) {
        $this->pipeline->filter($field.' like \'%'.$single.'%\'', $i, 'OR');
      }
      $i++;
    }

    $project = $this->project->objects();
    $result = $this->result->objects();
    $data = $this->data->objects();
    $pipeline = $this->pipeline->objects();

    $all = Array();
    // $all['Project'] = Array();
    // array_push($all['Project'], $project);
    $all['Project'] = $project;
    $all['Result'] = $result;
    $all['Data'] = $data;
    $all['Pipeline'] = $pipeline;
    echo json_encode($all);

  }

}

$searchField = $_POST['field'];
$search = Search::getInstance();
$search->advancedSearch($searchField);
?>