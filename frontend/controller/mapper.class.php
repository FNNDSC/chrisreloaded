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
 * Interface between the Objects and the Database
 * to ensure good Model View Controller (MVC) pratice.
 *
 * @example test.mapper.class.php
 *
 */
class Mapper {
  /**
   * Base object name.
   *
   * @var string $objectname
   */
  private $objectname = null;

  /**
   *  Join string.
   *
   * @var string $joins
   */
  private $joins = '';

  /**
   * Filter Array.
   * Array containing the filter() information to create the "WHERE" statement.
   *
   * @var string $where
   */
  private $where = Array();

  /**
   * Param Array
   * Array containing the params() information to handle prepared queries
   *
   * @var string $where
   */
  private $param = Array();

  /**
   * Objects Array.
   * Array listing all the objects which will be returned.
   * (if tables are joined, we potentially return N objects).
   *
   * @var string $objects
   */
  private $objects = Array();

  /**
   * Group string.
   * Convenience variable to group sql results by something
   *
   * @var string $group
   */
  private $group = '';

  /**
   * The constructor.
   * Instantiate a mapper for a given object type.
   *
   * @param[in] $object Base object for the mapper.
   */
  public function __construct($object) {
    $this->objectname = $this->_getName($object);
    $this->objects[] = $this->objectname;
    $this->where[] = '';
  }

  /**
   * Convenience method to get the name of the input.
   * If input is a string just return the string.
   * If input is an object, get its name.
   *
   * @param[in] string() $objects
   *
   * @return string Name of the input object
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
   * Convenience method to generate a clean "WHERE" condition.
   * If no "WHERE" condition is provided, returns an empty string.
   * If "WHERE" condition is provided, returns a clean "WHERE" statement.
   *
   * @return string with correct "WHERE" condition.
   */
  private function _getWhere() {
    // if we have applied a filter
    // count($this->where) should be >= 2
    $count = count($this->where);
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
      return $wherecondition;
    }
  }

  /**
   * Convenience method  to generate a clean Array() ready to use in the
   * prepared statement.
   *
   * @return Array() clean prepared statement array
   */
  private function _getParam() {
    // return null if we dont use prepared statements
    if ($this->param == null) {
      return null;
    }
    // else return nice prepared statements
    else {
      $param = Array();
      foreach ($this->param as $filter) {
        foreach ($filter as $condition) {
          $param[] = $condition;
        }

      }
      return $param;
    }
  }

  /**
   * Input filter conditions to sql query.
   *
   * Index 0 should be filled with the condition which will link the "sub-WHERE"
   * Index 1+ contains and formats the subconditions with $operator
   *
   * @param[in] $condition Condition to filter the database results.
   * @param[in] $param Condition to filter the database results.
   * @param[in] $index Condition to filter the database results.
   * @param[in] $operator Condition to filter the database results.
   *
   * @snippet test.mapper.class.php testFilter()
   */

  // advanced
  public function filter($condition, $param, $index = 1, $operator = 'AND') {
    // dont need the "AND" statement for the first condition
    $count = count($this->where);
    if ($index >= $count) {
      $this->where[] = '';
    } else {
      $this->where[$index] .= ' '.$operator.' ';
    }

    // update the condition string
    $this->where[$index] .= strtolower($condition);

    // deal with the parameters
    if ($index > 0) {
      if ($param != '') {
        if ($index > count($this->param)) {
          $this->param[] = Array();
        }
        $this->param[$index - 1][] = $param;
      }
    }

    return $this;
  }

  /**
   * Input join condition to sql query.
   * 
   * If no $joinCondition is provided, the default join condition will be
   * " JOIN $tableObject ON $baseObject.$tableObject_id=$tableObject.id"
   *
   * @param[in] $tableObject New object we want to join to the base object.
   * @param[in] $joinCondition Join condition.
   * @return $this Pointer to current mapper
   *
   * @snippet test.mapper.class.php testJoin()
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
    $this->objects[] = $tableName;

    return $this;
  }

  /**
   * Input left join condition to sql query.
   * 
   * If no $joinCondition is provided, the default join condition will be
   * " LEFT JOIN $tableObject ON $baseObject.$tableObject_id=$tableObject.id"
   *
   * @param[in] $tableObject New object we want to join to the base object.
   * @param[in] $joinCondition Join condition.
   * @return $this Pointer to current mapper
   *
   * @snippet test.mapper.class.php testLjoin()
   */
  public function ljoin($tableObject, $joinCondition = '') {
    $tableName = $this->_getName($tableObject);

    // default join condition
    if (empty($joinCondition)) {
      $joinCondition = strtolower($tableName).'.id ='.strtolower($this->objectname).'.'.strtolower($tableName).'_id';
    }

    // update the join string
    $this->joins .= ' LEFT JOIN '.strtolower($tableName).' ON '.strtolower($joinCondition);
    // store table name in array for conveniency to return objects
    $this->objects[] = $tableName;

    return $this;
  }

  /**
   * Input group condition to sql query.
   *
   * @param[in] $condition New object we want to join to the base object.
   * @return $this Pointer to current mapper
   *
   * @snippet test.mapper.class.php testGroup()
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
   *
   * @snippet test.mapper.class.php testObjects()
   */
  public function objects($id = -1) {
    if ($id != -1) {
      // append to existing - might be an issue?
      $this->filter(strtolower($this->objectname).'.id ='.$id);
    }

    // query the database
    $results = DB::getInstance()->execute('SELECT * FROM '.strtolower($this->objectname).strtolower($this->joins).strtolower($this->_getWhere()).$this->group, $this->_getParam());

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
            $objects[$this->objects[$localid]][] = $object;
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
        $objects[$this->objects[$localid]][] = $object;
      }
    }
    return $objects;
  }

}
?>