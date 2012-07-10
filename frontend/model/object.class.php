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
 * The super class for all entities.
 *
 */
class Object {

  /**
   * Represent this entity as a string.
   *
   * @return A string representation of this entity.
   */
  public function __toString() {

    $classname = get_class($this);
    $output = $classname."\n";

    // make a fancy line (======)
    for ($i=0; $i<strlen($classname); $i++) {

      $output .= '=';

    }
    $output .= "\n";

    // get all attributes
    foreach ($this as $key => $value) {

      $output .= $key.': '.$value."\n";

    }

    return $output;

  }

  /**
   * Grab the entity with a specific id.
   *
   * @param int $id The id of the requested entity.
   * @return An instance representing the requested entity or null if nothing was found.
   * @throws Exception An exception if the query resulted in more than one entity which should never happen.
   */
  public static function get($id) {

    $classname = get_called_class();

    $results = DB::getInstance()->execute('SELECT * FROM '.strtolower($classname).' WHERE id=(?)',array(0=>$id));

    if (count($results) == 0) {

      // we didn't find anything
      return null;

    }

    if (count($results) != 1) {

      throw new Exception('Result was not unique - something went terribly wrong when search '.$classname.' with id='.$id.'!');

    }

    // create the new object
    $object = new $classname();

    // map all the attributes from the first result
    foreach ($object as $key => $value) {

      $object->$key = $results[0][$key];

    }

    return $object;

  }

}

?>