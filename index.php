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

// include the classes
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'security.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'template.class.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'plugin.controller.php'));
require_once (joinPaths(CHRIS_VIEW_FOLDER, 'plugin.view.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'data.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'tag.controller.php'));

// create the login page
function loginPage() {
  // create the login page
  $t = new Template('login.html');
  $t -> replace('CSS', 'css.html');
  $t -> replace('FOOTER', 'footer.html');
  $t -> replace('JAVASCRIPT_LIBS', 'javascript.libs.php');

  if (CHRIS_MAINTENANCE) {
    $t -> replace('MAINTENANCE', 'display:block');
  } else {
    $t -> replace('MAINTENANCE', 'display:none');
  }

  return $t;
}

// create the homepage
function homePage() {

  $t = new Template('home.html');
  $t -> replace('BACKGROUND', $_SESSION['userconf']['general']['background']);
  $t -> replace('CSS', 'css.html');
  $t -> replace('NAVBAR', 'navbar.html');
  $t -> replace('DATA_COUNT', DataC::getCount($_SESSION['userid']));
  $t -> replace('FEED_COUNT', FeedC::getCount($_SESSION['userid']));
  $t -> replace('RUNNING_COUNT', FeedC::getRunningCount($_SESSION['userid']));
  $t -> replace('PLUGIN', PluginC::getHTML());
  $t -> replace('FEED_ALL', FeedC::getAllHTML($_SESSION['userid']));
  $t -> replace('MODAL_DDROP', 'modal_ddrop.html');
  $t -> replace('MODAL_TAG', 'modal_tag.html');
  $t -> replace('TAGS_LIST', TagC::getTagsList());
  $t -> replace('PLUGINS_LIST', PluginC::getPluginsList());
  $t -> replace('MODAL_PREVIEW', 'feed_data_preview.html');
  $t -> replace('FOOTER', 'footer.html');
  $t -> replace('JAVASCRIPT_LIBS', 'javascript.libs.php');
  $t -> replace('JAVASCRIPT_CHRIS', 'javascript.chris.html');
  $t -> replace('USERNAME', ucfirst($_SESSION['username']));
  $t -> replace('CHRIS_VERSION', CHRIS_VERSION);
  // ui
  $t -> replace('CHRIS_UI_CHECKBOX', 'ui_checkbox.html');

  if (CHRIS_MAINTENANCE) {
    $t -> replace('MAINTENANCE', 'display:block');
  } else {
    $t -> replace('MAINTENANCE', 'display:none');
  }

  return $t;
}

// check if this is a logout attempt
if (SecurityC::logout_attempt()) {
  echo 'LOGOUT ATTEMP'.PHP_EOL;
  // perform the logout
  SecurityC::logout();
  exit();

}

// check if this is a login attempt
if (SecurityC::login_attempt()) {

  // login could be requested using a session or a post request

  // perform the login
  if (!SecurityC::login()) {

    // invalid credentials

    // destroy the session
    session_destroy();
    // .. and forward to the sorry page
    header('Location: ?sorry');
    exit();

  }

  // check if query required
  $parsed_url = parse_url($_SERVER["REQUEST_URI"]);
  // we have args, let's have a look at them
  if(isset($parsed_url['query']) && !empty($parsed_url['query'])){
    // if anything, might want to CURL it :)
    foreach (explode('&', $parsed_url['query']) as $chunk) {
      $param = explode("=", $chunk);

      if ($param) {
        $parameter_name = urldecode($param[0]);
        $$parameter_name = urldecode($param[1]);
      }
    }
    
    if(isset($launch_plugin) && $launch_plugin == 1){
      // need the following defined
      //echo $plugin.PHP_EOL;
      //echo $script.PHP_EOL;
      //echo $feedname.PHP_EOL;
      //echo $directory.PHP_EOL;
      $command = PluginC::getExecutable(sanitize($plugin.PHP_EOL));
      $command .= ' --dir \"'.$directory.'\"';
      $command .= ' --output {OUTPUT}/';
      //echo $command.PHP_EOL;
      $status = 100;
      $username = $_SESSION['username'];
      $password = $_SESSION['password'];
      $feed_id = -1;
      $jobid = '';
      $memory = 2048; 

      // import launcher.php
      include('controller/launcher.php');
    }

    // then clean URL, back to main entry point
    header("Location: ?");
    exit();
  }

  // update user-specific configuration
  // BACKGROUND
  if(isset($_SESSION['userconf']['general']) && isset($_SESSION['userconf']['general']['background'])){
    $prefix = '';
    if(dirname($_SESSION['userconf']['general']['background']) == '.'){
      $prefix .= 'users/' . $_SESSION['username'] . '/'.CHRIS_USERS_CONFIG_DIR.'/';
    }
    $_SESSION['userconf']['general']['background'] = $prefix.$_SESSION['userconf']['general']['background'];
  }
  else{
    $_SESSION['userconf']['general']['background'] = "view/gfx/fnndsc_1920x1200.jpg";
  }

  // EMAIL ADDRESS
  if(isset($_SESSION['userconf']['general']) && isset($_SESSION['userconf']['general']['email'])){
    UserC::setEmail($_SESSION['userid'], $_SESSION['userconf']['general']['email']);
  }
  

  // show the homepage
  echo homePage();
  exit();

}

// otherwise show the login screen
echo loginPage();

?>
