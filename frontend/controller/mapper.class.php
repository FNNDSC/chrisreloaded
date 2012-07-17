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

	private $objectname = null;
	private $targetids = Array();
	private $joins = '';
	private $selects = '';

	private $joinObjects = Array();

	/**
	 * The constructor.
	 *
	 */
	public function __construct($name) {
		$this -> objectname = $name;
		Array_push($this -> joinObjects, $name);
	}
	
	private function _getCondition()
	{
		if(empty($this->selects)){
			return '';
		}
		else{
		return ' WHERE (' . strtolower($this->selects) . ')';
		}
	}

	public function filter($condition) {
		// dont need the "AND" statement for the first condition
		if (!empty($this -> selects)) {
			$this -> selects .= ' AND ';
		}
		// update the condition string
		$this -> selects .= strtolower($condition);
		return $this;
	}

	public function join($table, $joinCondition) {
		// update the join string
		$this -> joins .= ' JOIN ' . strtolower($table) . ' ON ' . strtolower($joinCondition);

		// store table name in array for conveniency to return objects
		Array_push($this -> joinObjects, $table);

		return $this;
	}

	// get objects
	public function getObject($id = -1) {
		$condition = '';
		if ($id != -1) {
			$this -> selects = strtolower($this -> objectname) . '.id =' . $id;
		}

		$results = DB::getInstance() -> execute('SELECT * FROM ' . strtolower($this -> objectname) . strtolower($this -> joins) . strtolower($this -> _getCondition()));
		// return all objects...
		// create the new object
		$objects = Array();

		// create good number of columns
		foreach ($this->joinObjects as $object) {
			array_push($objects, Array());
		}

		// map all the attributes
		foreach ($results as $line) {
			$i = 0;
			$object = null;

			foreach ($line as $key) {
				if ($key[0] == 'id') {

					if (!empty($object)) {
						array_push($objects[$i], $object);
						++$i;
					}
					$object = new $this->joinObjects[$i]();

				}
				$object -> $key[0] = $key[1];
			}
			if (!empty($object)) {
				array_push($objects[$i], $object);
			}
		}
		return $objects;
	}

	// get fields
	public function getField($field) {
		$results = DB::getInstance() -> execute('SELECT ' . strtolower($field) . ' FROM ' . strtolower($this -> objectname) . strtolower($this -> joins) . strtolower($this -> _getCondition()));
		return $results;
	}

}
?>