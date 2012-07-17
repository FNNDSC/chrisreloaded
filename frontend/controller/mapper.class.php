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
   * \var string $objectname
   * \brief The base object's name.
   */
  private $objectname = null;

  /**
   * \var string $joins
   * \brief The join string.
   */
  private $joins = '';

  /**
   * \var string $joins
   * \brief The where string.
   */
  private $where = '';

  /**
   * \var string() $objects
   * \brief Convenience variable to list all the objects which will be returned
   * (if tables are joined)
   */
  private $objects = Array();

  /**
   * \param[in] $object Base object for the mapper.
   * \brief The constructor.
   */
  public function __construct($object) {
    $this -> objectname = get_class($object);
    Array_push($this -> objects, $this -> objectname);
  }

  /**
   * \brief Helper to generate a clean "WHERE" condition.
   * If no "WHERE" condition is provided, returns an empty string.
   * If "WHERE" condition is provided, returns a clean "WHERE (condition)"
   * string
   * \return string with correct "WHERE" condition.
   */
  private function _getWhere() {
    if (empty($this -> where)) {
      return '';
    } else {
      return ' WHERE (' . strtolower($this -> where) . ')';
    }
  }

  /**
   * \param[in] $condition Condition to filter the database results.
   * \brief The method to input where inside a database query.
   * It prepares and format a nice "WHERE( $condition )".
   * You can combine several filter conditions:
   * mapper->filter('conditionA')->filter('conditionB')->objects();
   * Doesn't query the database. See @objects()
   */
  public function filter($condition) {
    // dont need the "AND" statement for the first condition
    if (!empty($this -> where)) {
      $this -> where .= ' AND ';
    }
    // update the condition string
    $this -> where .= strtolower($condition);
    return $this;
  }

  /**
   * \param[in] $tableObject New object we want to join to the base object.
   * \param[in] $joinCondition Join condition.
   * \brief The method to input join inside a database query.
   * It prepares and format a nice "JOIN $tableObject, ON $joinCondition"
   * If no $joinCondition is provided, the default join condition will be
   * " JOIN $tableObject ON $baseObject.$tableObject_id=$tableObject.id"
   * You can combine several join conditions:
   * mapper->join(objectA, 'conditionA')->join(objectB)->objects();
   * Doesn't query the database. See @objects()
   * \return $this Pointer to current mapper
   */
  public function join($tableObject, $joinCondition = '') {
    $tableName = get_class($tableObject);
    if (empty($joinCondition)) {
      $this -> joins .= ' JOIN ' . strtolower($tableName) . ' ON ' . strtolower($tableName) . '.id =' . strtolower($this -> objectname) . '.' . strtolower($tableName) . '_id';
    } else {
      // update the join string
      $this -> joins .= ' JOIN ' . strtolower($tableName) . ' ON ' . strtolower($joinCondition);
    }
    // store table name in array for conveniency to return objects
    Array_push($this -> objects, $tableName);

    return $this;
  }

  /**
   * \param[in] $id Id of the object we want to fetch from DB. If something is
   * provided, it will overwritte the "WHERE" conditions provided by previous
   * join().
   * \brief Execute the sql query with the previously defined join and where
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
   */
  public function objects($id = -1) {
    $condition = '';
    if ($id != -1) {
      $this -> where = strtolower($this -> objectname) . '.id =' . $id;
    }

    $results = DB::getInstance() -> execute('SELECT * FROM ' . strtolower($this -> objectname) . strtolower($this -> joins) . strtolower($this -> _getWhere()));
    // return all objects...
    // create the new object
    $objects = Array();

    // create good number of columns
    foreach ($this->objects as $object) {
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
          $object = new $this->objects[$i]();

        }
        $object -> $key[0] = $key[1];
      }
      if (!empty($object)) {
        array_push($objects[$i], $object);
      }
    }
    return $objects;
  }

  /**
   * \param[in] $filed Field to be returned
   * Get special field of a given SQL request.
   * Sometimes it is more convenient/efficient to deal with a single string
   * than the full object.
   */
  public function fields($field) {
    $results = DB::getInstance() -> execute('SELECT ' . strtolower($field) . ' FROM ' . strtolower($this -> objectname) . strtolower($this -> joins) . strtolower($this -> _getWhere()));
    return $results;
  }

}
?>