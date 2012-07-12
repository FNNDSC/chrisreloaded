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
 * The Patient class which describes the Patient entity of the database.
 *
 */
class Scan extends Object {

	/**
	 * The unique of this scan.
	 *
	 * @var int
	 */
	public $id = -1;

	/**
	 * The patient_id of this scan.
	 *
	 * @var int
	 */
	public $patient_id = -1;

	/**
	 * The modality_id of this scan.
	 *
	 * @var int
	 */
	public $modality_id = -1;

	/**
	 * The scanner_id of this scan.
	 *
	 * @var int
	 */
	public $scanner_id = -1;

	/**
	 * The name of the scan.
	 *
	 * @var string
	 */
	public $name = null;

	/**
	 * The time of the scan.
	 *
	 * @var string
	 */
	public $time = null;

	/**
	 * The dimension of the scan.
	 *
	 * @var string
	 */
	public $dimensions = null;

	/**
	 * The spacings of the scan.
	 *
	 * @var string
	 */
	public $spacings = null;

}
?>