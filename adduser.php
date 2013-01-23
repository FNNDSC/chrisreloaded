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

// include the configuration
require_once ('config.inc.php');

// include the template class
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'security.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'data.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'user.controller.php'));


// validate the credentials
if (!SecurityC::login()) {

  // invalid credentials

  // destroy the session
  session_destroy();

  die("Access denied.");

}

// now we have the user_id, make sure it is 0
if ($_SESSION['userid'] != 0) {

  die("Access denied.");

}

// now the logic
if (isset($_POST['doit'])) {

  if ($_POST["password"] != $_POST["password2"]) {

    die("Passwords don't match!");

  }

  UserC::create($_POST['username'], crypt($_POST['password']), $_POST['email']);

  die("User added.");

}


?>
<html>
<head><title>Add a ChRIS user</title></head>
<body>
<form action="" method="POST">
<input type="hidden" name="doit" value="yes">
Username: <input type="text" name="username">
<br>
Password: <input type="password" name="password">
<br>
Password (again): <input type="password" name="password2">
<br>
E-Mail: <input type="text" name="email">
<br>
<input type="submit" value="Add user">
</form>
</body>
</html>
