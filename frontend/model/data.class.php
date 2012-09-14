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
if (!defined('__CHRIS_ENTRY_POINT__'))
  die('Invalid access.');

// grab the super class for all entities
require_once 'object.class.php';

/**
 *
 * The Data class which describes the Data entity of the database.
 *
 */
class Data extends Object {

  /**
   * The patient_id of this scan.
   *
   * @var int $patient_id
   */
  public $patient_id = -1;

  /**
   * The data unique ID.
   * We use it to make sure data we will add to the database doesn't already exists.
   *
   * @var string $unique_id
   */
  public $unique_id = null;

  /**
   * The name of the data.
   * Text file name, dicom protocol, etc...
   *
   * @var string $name
   */
  public $name = null;

  /**
   * The time of the data creation.
   *
   * @var string $time
   */
  public $time = null;

  /**
   * Extra information for this data. (spacing, size...)
   *
   * @var string $meta_information
   */
  public $meta_information = null;

}
?>