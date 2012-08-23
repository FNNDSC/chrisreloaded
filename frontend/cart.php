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

// we define a valid entry point
define('__CHRIS_ENTRY_POINT__', 666);

//define('CHRIS_CONFIG_DEBUG', true);
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, '_session.inc.php'));

// include the configuration
require_once ('config.inc.php');

class Cart {
  static function add($item = null){
    // if item provided
    if(!isset($item)){
      // if item not inside the cart
      if( !array_key_exists($item, $_SESSION['cart'])){
        $_SESSION['cart'][$item]=$item;
      }
    }
  }

  static function remove($item = null){
    // if item provided
    if(!isset($item)){
      // remove it from the cart
      if( !array_key_exists($item, $_SESSION['cart'])){
        unset($_SESSION['cart'][$item]);
      }
    }
  }

  static function visibility($visibility = false){
    $_SESSION['cart']['visibility'] = $visibility;
  }

  static function draw(){
    // go though cart

    // return html
  }
}

?>