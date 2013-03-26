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
if (!defined('__CHRIS_ENTRY_POINT__')) die('Invalid access.');

// include the configuration
require_once (dirname(dirname(__FILE__)).'/config.inc.php');

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));

require_once (joinPaths(CHRIS_MODEL_FOLDER, 'token.model.php'));

require_once ('Net/SSH2.php');

// interface
interface TokenControllerInterface
{
  // Create a new token and return it.
  static public function create();
  // Validate a token.
  static public function validate($token);

}

/**
 * Feed controller class
 */
class TokenC implements TokenControllerInterface {

  /**
   * Create a new token and return it.
   */
  static public function create() {

    $value = uniqid();

    $tokenObject = new Token();
    $tokenObject->value = $value;
    Mapper::add($tokenObject);

    return $value;

  }

  /**
   * Validate a token. Returns the result and deletes the token if valid.
   *
   * @param string $token The token
   * @return boolean
   */
  static public function validate($token) {

    $tokenMapper = new Mapper('Token');
    $tokenMapper->filter('value=(?)', $token);
    $tokenResults = $tokenMapper->get();

    if(count($tokenResults['Token']) == 0) {
      return false;
    }

    // we found the token
    Mapper::delete($tokenResults['Token'][0],$tokenResults['Token'][0]->id);

    return true;

  }

}
?>