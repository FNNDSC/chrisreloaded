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

/**
 *
 * The database mapper.
 *
 */
class Mapper {

	/**
	 * The name of the object to be mapped
	 *
	 * @var string $objectname
	 */
	private $objectname = null;

	/**
	 * The name of the object to be mapped
	 *
	 * @var array $targetids list of the target object ids
	 */
	private $targetids = Array();

	// t1, t2, condition
	private $joins = '';

	/**
	 * The constructor.
	 *
	 */
	public function __construct($name) {
		$this -> objectname = $name;
	}

	// helpers
	private function getTarget($id = -1) {
		if ($id != -1) {
			Array_push($this -> targetids, $id);
		}

		if (empty($this -> targetids)) {
			$this -> getAll();
		}

		// array ti string
		$comma = implode(",", $this -> targetids);
		return $comma;
	}

	private function updateTarget($results) {
		//clean the array
		unset($this -> targetids);
		// new array
		$this -> targetids = Array();

		foreach ($results as $key => $value) {
			Array_push($this -> targetids, $value['id']);
		}
	}

	// update list
	public function getAll() {

		$results = DB::getInstance() -> execute('SELECT ' . strtolower($this -> objectname) .'.id FROM ' . strtolower($this -> objectname) . strtolower($this -> joins));
		$this -> updateTarget($results);
		return $this;
	}

	public function filter($condition) {
		// do join, etc....
		$results = DB::getInstance() -> execute('SELECT ' . strtolower($this -> objectname) .'.id FROM ' . strtolower($this -> objectname) . strtolower($this -> joins) . ' WHERE (' . strtolower($this -> objectname) .'.id IN (' . strtolower($this -> getTarget() . ')) AND (' . strtolower($condition) . ')'));
		$this -> updateTarget($results);
	
		return $this;
	}

	public function join($table, $joinCondition) {
		// add join condition
		$this->joins .= ' JOIN '. strtolower($table) . ' ON ' . strtolower($joinCondition);

		return $this;
	}

	// get objects
	public function object($id = -1) {
		if ($id == -1) {
		} else {
			$this -> getTarget($id);
		}

		// do join, etc....
		$results = DB::getInstance() -> execute('SELECT * FROM ' . strtolower($this -> objectname) . strtolower($this -> joins) . ' WHERE ' . strtolower($this -> objectname) .'.id=(?)', array(0 => $id));
		// return all objects...
	}

	// get fields
	public function getField($field) {
		// do join, etc.

		$results = DB::getInstance() -> execute('SELECT ' . strtolower($this -> objectname) .'.' . strtolower($field) . ' FROM ' . strtolower($this -> objectname) . strtolower($this -> joins) . ' WHERE ' . strtolower($this -> objectname) .'.id IN (' . strtolower($this -> getTarget()) . ')');
		return $this;
	}

}
?>