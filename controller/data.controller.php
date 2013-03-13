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

// include the controllers
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'db.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'mapper.class.php'));

// include the models
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'data.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user_data.model.php'));

// interface
interface DataControllerInterface
{
  // return the number of data sets for a specific user
  static public function getCount($user_id);
}

/**
 * Data controller class
 */
class DataC implements DataControllerInterface {

  /**
  * Return the number of datasets (series) available for a specific user.
  *
  * @var int $user_id
  */
  static public function getCount($user_id) {

    // if we are logged in as admin, we want to see all the datasets
//     if ($user_id == 0) {

      $results = DB::getInstance()->execute('SELECT COUNT(*) FROM data');
      return $results[0][0][1];

//     } else {

//       $dataMapper = new Mapper('Data');
//       $dataMapper->join('User_Data', 'data.id = user_data.data_id');
//       $dataMapper->filter('user_data.user_id=(?)', $user_id);
//       $results = $dataMapper->get();

//       return count($results['Data']);

//     }

  }

}
?>