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
 * The database mapper helps to interface between the Objects and the Database
 * to ensure good Model View Controller (MVC) pratice.
 *
 */
class Mapper {
  /**
   * The base object's name.
   *
   * @var string $objectname
   */
  private $objectname = null;

  /**
   *  The join string.
   *
   * @var string $joins
   */
  private $joins = '';

  /**
   * Array containing the filter() information to create the "WHERE" statement
   *
   * @var string $where
   */
  private $where = Array();

  /**
   * Convenience variable to list all the objects which will be returned
   * (if tables are joined)
   *
   * @var string() $objects
   */
  private $objects = Array();

  /**
   * Convenience variable to group sql results by something
   *
   * @var string $group
   */
  private $group = '';

  /**
   * The constructor
   *
   * @param[in] $object Base object for the mapper.
   */
  public function __construct($object) {
    $this->objectname = $this->_getName($object);
    Array_push($this->objects, $this->objectname);
    Array_push($this->where, '');
  }

  /**
   * Convenience variable to list all the objects which will be returned
   * (if tables are joined)
   *
   * @var string() $objects
   *
   */
  private function _getName($object) {
    if (gettype($object) == 'string') {
      $name = $object;
    } else {
      $name = $object->objectname;
    }
    return $name;
  }

  /**
   * Helper to generate a clean "WHERE" condition.
   * If no "WHERE" condition is provided, returns an empty string.
   * If "WHERE" condition is provided, returns a clean "WHERE (condition)"
   * string
   *
   * @return string with correct "WHERE" condition.
   */
  private function _getWhere() {
    print_r($this->where);
    $count = count($this->where);
    echo '====COUNT=====';
    echo $count;
    if ($count < 2) {
      return '';
    } else {
      // base case
      $wherecondition = ' WHERE ( ('.$this->where[1].' ) ';

      // add other filters
      for ($i = 2; $i < $count && $count >= 3; $i++) {
        $wherecondition .= $this->where[0].' ('.$this->where[$i].' ) ';
      }

      // finish query
      $wherecondition .= ' )';
      print_r($wherecondition);
      return $wherecondition;
    }
  }

  /**
   * The method to input where inside a database query.
   * Index 0 should be filled with the condition which will link the "sub-WHERE"
   * Index 1+ contains and formats the subconditions with $operator
   *
   * @param[in] $condition Condition to filter the database results.
   * @param[in] $index Condition to filter the database results.
   * @param[in] $operator Condition to filter the database results.
   */

  // advanced
  public function filter($condition, $index = 1, $operator = 'AND') {
    // dont need the "AND" statement for the first condition
    $count = count($this->where);
    if ($index >= $count) {
      array_push($this->where, '');
      echo 'PUSH!';
      echo count($this->where);
    } else {
      $this->where[$index] .= ' '.$operator.' ';
    }

    // update the condition string
    $this->where[$index] .= strtolower($condition);
          echo count($this->where);
    //print_r($this->where);
    return $this;
  }

  /**
   * The method to input join inside a database query.
   * It prepares and format a nice "JOIN $tableObject, ON $joinCondition"
   * If no $joinCondition is provided, the default join condition will be
   * " JOIN $tableObject ON $baseObject.$tableObject_id=$tableObject.id"
   * You can combine several join conditions:
   * mapper->join(objectA, 'conditionA')->join(objectB)->objects();
   * Doesn't query the database. See @objects()
   *
   * @param[in] $tableObject New object we want to join to the base object.
   * @param[in] $joinCondition Join condition.
   * @return $this Pointer to current mapper
   */

  public function join($tableObject, $joinCondition = '') {
    $tableName = $this->_getName($tableObject);

    // default join condition
    if (empty($joinCondition)) {
      $joinCondition = strtolower($tableName).'.id ='.strtolower($this->objectname).'.'.strtolower($tableName).'_id';
    }

    // update the join string
    $this->joins .= ' JOIN '.strtolower($tableName).' ON '.strtolower($joinCondition);
    // store table name in array for conveniency to return objects
    Array_push($this->objects, $tableName);

    return $this;
  }

  /**
   * Group a result by condition.
   * You could group results by project.name.
   * It will not return duplicate project.name.
   *
   * @param[in] $condition New object we want to join to the base object.
   * @return $this Pointer to current mapper
   */
  public function group($condition) {
    $this->group = ' GROUP BY '.strtolower($condition);

    return $this;
  }

  /**
   * Execute the sql query with the previously defined join and where
   * conditions.
   * If some input is provided, it will overwritte the "WHERE" conditions
   * provided by previous join().
   * // good
   * mapper->join(objectA, 'conditionA')->join(objectB)->objects();
   * // good
   * mapper->objects(2);
   * // warning
   * "mapper->join(objectB)->objects(2);" EQUALS "mapper->objects(2);"
   * \return Array of type (Object(Instance, Instance, etc.), Object(Instance, Instance, etc.), Object(Instance, Instance, etc.))
   *
   * @param[in] $id Id of the object we want to fetch from DB. If something is
   * provided, it will overwritte the "WHERE" conditions provided by previous
   * join().
   */
  public function objects($id = -1) {
    if ($id != -1) {
      // append to existing - might be an issue?
      $this->filter(strtolower($this->objectname).'.id ='.$id);
    }

    // query the database
    $results = DB::getInstance()->execute('SELECT * FROM '.strtolower($this->objectname).strtolower($this->joins).strtolower($this->_getWhere()).$this->group);

    // create an array to store the objects
    $objects = Array();

    // create one column per object (multpiple objects returned for joins)
    foreach ($this->objects as $object) {
      $objects[$object] = Array();
    }

    // create objects and map all the attributes
    foreach ($results as $result) {

      // localid
      $localid = 0;
      $object = null;

      // parse on result
      foreach ($result as $field) {
        // if we reach a "id" field, create new object
        if ($field[0] == 'id') {
          // if there is an object existing, push it to right location and update localid
          // we only push the object once it has been filled!
          if (!empty($object)) {
            array_push($objects[$this->objects[$localid]], $object);
            ++$localid;
          }
          // create new object
          $object = new $this->objects[$localid]();
        }
        // update fields
        $object->$field[0] = $field[1];
      }
      // push last object to the right location
      // we only push the object once it has been filled!
      if (!empty($object)) {
        array_push($objects[$this->objects[$localid]], $object);
      }
    }
    return $objects;
  }

}
?>