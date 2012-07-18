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
    //$this->resultMapperInit();
    // $this->projectMapperInit();
    $this->dataMapperInit();
    // $this->pipelineMapperInit();
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
    $this->project = new Mapper('Project');
    //$this->project->join();
  }

  private function resultMapperInit() {
    $this->result = new Mapper('Result');
  }

  private function dataMapperInit() {
    $this->data = new Mapper('Scan');
    $this->data->join('Patient')->join('Modality');

    $this->dataSearchFields = Array(0 => 'firstname', 1 => 'lastname', 2 => 'subtype');

  }

  private function pipelineMapperInit() {
    $this->data = new Mapper('Pipeline');
  }

  public function search($searchField) {
    // AND condition on explode!!
    $singleField = explode(" ", $searchField);
    
    // set index 0
    $this->data->advancedfilter('AND', 0);
    $i = 1;
    foreach ($singleField as $single) {
      
      // build query
      foreach ($this->dataSearchFields as $field) {
        //$this->data->filter($field.' like \'%'.$single.'%\'', 'OR');
        $this->data->advancedfilter($field.' like \'%'.$single.'%\'', $i, 'OR');
      }
      $i++;
    }
    $results = $this->data->objects();

    // search!
    echo '<br />';
    echo '<br />';
    for ($j = 0; $j < count($results[0]); $j++) {
      foreach ($results as $object) {
        print $object[$j];
        echo '<br />';
      }
      echo '<br />';
    }
  }

}

$searchField = $_GET['field'];
// SELECT * FROM scan join patient on patient.id =scan.patient_id join modality on modality.id =scan.modality_id where (firstname like '%Diffusion%') OR (lastname like '%N%') OR (subtype like '%T%')
$search = Search::getInstance();
$search->search($searchField);
?>