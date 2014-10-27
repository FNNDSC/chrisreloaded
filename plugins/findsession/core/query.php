#!/usr/bin/php
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
 *
 * Quick example:
 *
 *      ./query.php --studydate=20130416 --modality=MR
 *
 *
 */

if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
require_once (dirname(dirname(dirname(dirname(__FILE__)))).'/config.inc.php');

// check if we are invoked by commandline
$commandline_mode = (php_sapi_name() == 'cli');

if ($commandline_mode) {

  // parse the options if we are in commandline mode

  // define the options
  $shortopts = "u:c:e:i:I:p:o:s:x:rtvh";
  $longopts  = array(
      "username:",
      "script:",
      "name:",
      "sessionid:",
      "subjectid:",
      "project:",
      "dateon:",
      "datesince:",
      "experimenter:",
      "datepast:",
      "datetoday:",
      "verbose",
      "help"    // Optional value
  );

  $options = getopt($shortopts, $longopts);

var_dump($options);

  if( array_key_exists('h', $options) || array_key_exists('help', $options))
  {
    echo "this is the help!";
    echo "\n";
    return;
  }

  $username = '';
  if( array_key_exists('u', $options))
  {
    $script = $options['u'];
  }
  elseif (array_key_exists('username', $options))
  {
    $script = $options['username'];
  }

  $script = '';
  if( array_key_exists('c', $options))
  {
    $script = $options['c'];
  }
  elseif (array_key_exists('script', $options))
  {
    $script = $options['script'];
  }


  $name = '';
  if( array_key_exists('e', $options))
  {
    $name = $options['e'];
  }
  elseif (array_key_exists('name', $options))
  {
    $name = $options['name'];
  }

  $session_id = '';
  if( array_key_exists('i', $options))
  {
    $session_id = $options['i'];
  }
  elseif (array_key_exists('sessionid', $options))
  {
    $session_id = $options['sessionid'];
  }

  $subject_id = '';
  if( array_key_exists('I', $options))
  {
    $subject_id = $options['I'];
  }
  elseif (array_key_exists('subjectid', $options))
  {
    $subject_id = $options['subjectid'];
  }

  $project = '';
  if( array_key_exists('p', $options))
  {
    $project = $options['p'];
  }
  elseif (array_key_exists('project', $options))
  {
    $project = $options['project'];
  }

  $date_on = '';
  if( array_key_exists('o', $options))
  {
    $date_on = $options['o'];
  }
  elseif (array_key_exists('dateon', $options))
  {
    $date_on = $options['dateon'];
  }

  $date_past_4_months = '';
  if( array_key_exists('r', $options))
  {
    $date_past_4_months = true;
  }
  elseif (array_key_exists('datepast', $options))
  {
    $date_past_4_months = true;
  }

  $date_since = '';
  if( array_key_exists('s', $options))
  {
    $date_since = $options['s'];
  }
  elseif (array_key_exists('datesince', $options))
  {
    $date_since = $options['datesince'];
  }

  $date_today = '';
  if( array_key_exists('t', $options))
  {
    $date_today = true;
  }
  elseif (array_key_exists('datetoday', $options))
  {
    $date_today = true;
  }

  $experimenter = '';
  if( array_key_exists('x', $options))
  {
    $experimenter = sanitize($options['x']);
  }
  elseif (array_key_exists('experimenter', $options))
  {
    $experimenter = sanitize($options['experimenter']);
  }

  $verbose = '';
  if( array_key_exists('v', $options))
  {
    $verbose = true;
  }
  elseif (array_key_exists('verbose', $options))
  {
    $verbose = true;
  }

}

// build command
$command = $script;

$command .= ($name != '')?' -e '.$name:'';
$command .= ($session_id != '')?' -i '.$session_id:'';
$command .= ($subject_id != '')?' -I '.$subject_id:'';
$command .= ($project != '')?' -p '.$project:'';
$command .= ($date_on != '')?' -o '.$date_on:'';
$command .= ($date_past_4_months != '')?' -r':'';
$command .= ($date_since != '')?' -s '.$date_since:'';
$command .= ($date_today != '')?' -t':'';
$command .= ($experimenter != '')?' -x '.$experimenter:'';
$command .= ($verbose != '')?' -v':'';

exec($command, $output);

$formated_output = array(
//		"sEcho" => intval($_GET['sEcho']),
//		"iTotalRecords" => 863,
//		"iTotalDisplayRecords" => 100,
		"aaData" => array()
	);

$index = 0;

$user_groups = shell_exec('id -G ' . $username);
$user_group_arr = explode( ' ', $user_groups);
foreach( $output as $key => $value){
  // skip decorator
  if($value != "======="){

    // split string on first semi-colon
    $split = explode(':', $value, 2);
    $formated_output['aaData'][$index - 1][] = trim($split[1]);

    if(trim($split[0]) == "PATH"){
      $path = trim($split[1]);

      if (checkDirGroupAccessible($user_group_arr, $path)) {
        unset($formated_output['aaData'][$index - 1]);
        $index--;
      }
      else{
      echo 'OK: '.$path.PHP_EOL;
     }
    }

  }
  else{

  $formated_output['aaData'][$index] = '';
  $index++;

  }
}

if($commandline_mode){
  echo json_encode($formated_output);
}


?>
