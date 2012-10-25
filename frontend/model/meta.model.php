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
require_once 'object.model.php';

/**
 *
 * The Meta class which describes the Meta entity of the database.
 *
 */
class Meta extends Object {

  /**
   * The name of the metadata.
   *
   * @var string $name
   */
  public $name = '';

  /**
   * The value of the metadata.
   *
   * @var string $value
   */
  public $value = '';

  /**
   * The type of the metadata.
   * simple, advanced, input, etc.
   *
   * @var string $type
   */
  public $type = '';

  /**
   * The group of the metadata.
   * patient, image, plugin, project, etc
   *
   * @var string $group
   */
  public $group = '';
  
  /**
   * The target id of the metadata.
   *
   * @var int $target_id
   */
  public $target_id = -1;
  
  /**
   * The target type of the metadata.
   *
   * @var string $target_type
   */
  public $target_type = '';
}
?>