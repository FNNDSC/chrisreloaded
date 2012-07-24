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
if(!defined('__CHRIS_ENTRY_POINT__')) die('Invalid access.');


/**
 *
 * The database connector.
 *
 */
class DB {

  /**
   *
   * The instance reference for the singleton pattern.
   *
   * @var DB
   */
  private static $instance = null;

  /**
   * The link to the MySQL database.
   *
   * @var mysqli|null
   */
  private $link = null;

  /**
   * The constructor which also opens a connection to the database.
   *
   * This constructor is private and can not be called. All access must
   * happen through the static DB::getInstance() method to apply the singleton
   * pattern.
   *
   * The login credentials are defined in the ChRIS config.inc.php file.
   *
   * @throws Exception An exception if the database connection fails.
   */
  private function __construct() {

    $link = new mysqli(SQL_HOST, SQL_USERNAME, SQL_PASSWORD, SQL_DATABASE);

    if ($link->connect_errno) {

      throw new Exception('Failed to connect to database: '.$link->connect_error);

    }

    // store the link
    $this->link = $link;

  }

  /**
   * Get the instance of the database connector. This always creates a valid
   * instance by either creating a new one or by returning an existing one.
   *
   * @return DB The instance to use.
   */
  public static function getInstance() {

    if (!self::$instance) {

      // first call, create an instance
      self::$instance = new DB();

    }

    // return the new or existing instance
    return self::$instance;

  }

  /**
   * Execute an SQL query as a prepared statement. This protects against SQL injections.
   *
   * <i>Example usage</i>:
   * <pre>
   * DB::getInstance()->execute('SELECT * FROM patient WHERE id=(?)',array(0=>$id));
   * </pre>
   * In this case, the (?) question mark gets replaced by the value of the $id variable. The
   * type of the $id variable gets automatically detected based on its php type.
   *
   * @param string $query The SQL query to execute.
   * @param array|null $variables An array of variables to bind as parameters in the SQL query.
   *                              The type of the variables gets automatically detected.
   * @return An array of rows representing each resulting dataset. This can be an empty array,
   *               if the query does not result in any datasets.
   * @throws Exception An exception if the query can not be prepared or executed.
   */
  public function execute($query, $variables=null) {
 echo $query;
    $link = $this->link;

    // prepare the query
    if (!($statement = $link->prepare($query))) {

      throw new Exception('Failed to prepare query: '.$link->error);

    }

    // bind the parameters
    if ($variables != null) {
      foreach($variables as $variable) {

        // detect the type and store the first letter
        // i for integer
        // d for double
        // s for string etc.
        $type = gettype($variable);

        $statement->bind_param($type{0}, $variable);

      }
    }

    // execute the query
    $statement->execute();

    // grab the meta data of the query
    $result = $statement->result_metadata();

    // check which fields are expected
    $fields = array();
    $resultFields = array();
    while ($field = $result->fetch_field()) {

      $fields[] = $field->name;
      $resultFields[] = &${$field->name};
    
        }
    
    // call $statement->bind_result for each of the expected fields
    call_user_func_array(array($statement, 'bind_result'), $resultFields);

    // grab the results
    $results = array();
    $i = 0; // results counter
    while ($statement->fetch()) {
      $j = 0;
      // loop through all fields for each result
      foreach($fields as $field){

        // save field name
        $results[$i][$j][0] = $field;
        //save field value
        $results[$i][$j][1] = $$field;
        $j++;
      }
      $i++;
    }

    // return the results
    return $results;

  }

}

?>