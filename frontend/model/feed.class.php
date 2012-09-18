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
   * The action which describes the feed
   *
   * @var string $action
   */
  public $action = null;

  /**
   * The model the feed is related to.
   *
   * @var string $model
   */
  public $model = null;

  /**
   * The model id the feed is related to.
   *
   * @var string $model_id
   */
  public $model_id = '';

  /**
   * The time of the feed creation
   *
   * @var string $time
   */
  public $time = '';

  /**
   * The status of the feed: 0-100
   * -1: failure
   *
   * @var int $status
   */
  public $status = 0;

}
?>