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
 * The Feed class which describes the Feed entity of the database.
 *
 */
class Feed extends Object {

  /**
   * The user_id who owns this feed.
   *
   * @var int $user_id
   */
  public $user_id = -1;

  /**
   * The name of the feed
   *
   * @var string $name
   */
  public $name = '';

  /**
   * The plugin that generated the feed.
   *
   * @var string $plugin
   */
  public $plugin = '';

  /**
   * The time of the feed creation
   *
   * @var string $start
   */
  public $time = '0.0';

  /**
   * The time of the feed termination
   *
   * @var int $duration
   */
  public $duration = -1;

  /**
   * The status of the feed. Goes from 0 to 100.
   *
   * @var float $status
   */
  public $status = 0;

  /**
   * Is feed marked as favorite
   *
   * @var bool $favorite
   */
  public $favorite = false;

  /**
   * Is feed marked as archive
   *
   * @var bool $archive
   */
  public $archive = false;
}
?>