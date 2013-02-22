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
 * Join multiple file paths.
 * From: http://stackoverflow.com/questions/1091107/how-to-join-filesystem-path-strings-in-php
 *
 * @param array|string $args Multiple file paths.
 *
 */
function joinPaths($args) {
  $args = func_get_args();
  $paths = array();
  foreach ($args as $arg) {
    $paths = array_merge($paths, (array)$arg);
  }

  $paths = array_map(create_function('$p', 'return rtrim($p, "/");'), $paths);
  $paths = array_filter($paths);
  return join('/', $paths);
}

/**
 * Remove invalid characters from a string and replace it by '_'
 * @param string $dirty
 * @todo use regular expressions to replace everything in one command
 */
function sanitize($dirty){

  $dangerous_characters = array(' ', '>', '<', '/', '?', '&', '#', '\\', '%', '(', ')', ',', '+', '*', '-', ':', '^');
  $clean = str_replace ($dangerous_characters, '_', $dirty);

  return $clean;
}

/**
 * Convert number of days into more meaninful description
 * @param int $raw_age
 */
function formatAge($raw_age){
  $years = intval($raw_age/365.25);
  if( $years > 0){
    return sprintf('%03d', $years).'Y';
  }
  else{
    $months = intval($raw_age/30.42);
    if( $months > 0){
      return sprintf('%03d', $months).'M';
    }
    else{
      $weeks = intval($raw_age/7);
      if( $weeks > 0){
        return sprintf('%03d', $weeks).'W';
      }
      else{
        return sprintf('%03d', $raw_age).'D';
      }
    }
  }
}

/**
 * Format study folder name in a consitent manner
 * @param string $raw_date
 * @param int $raw_age
 * @param string $raw_description
 */
function formatStudy($raw_date, $raw_age, $raw_description){
  $date = str_replace('-', '.', $raw_date);
  $age = formatAge($raw_age);
  $description = sanitize($raw_description);
  return $date.'-'.$age.'-'.$description;
}

/**
 * Based on http://php.net/manual/en/function.copy.php
 * Modified to handle symlinks properly
 * @param unknown_type $src
 * @param unknown_type $dst
 */
function recurse_copy($src,$dst) {
  $dir = opendir($src);
  @mkdir($dst);
  while(false !== ( $file = readdir($dir)) ) {
    if (( $file != '.' ) && ( $file != '..' )) {
      if( is_link($src . '/' . $file) ){
        // create sof link
        symlink(readlink($src . '/' . $file), $dst . '/' . $file);
      }
      elseif ( is_dir($src . '/' . $file) ) {
        recurse_copy($src . '/' . $file,$dst . '/' . $file);
      }
      else {
        copy($src . '/' . $file,$dst . '/' . $file);
      }
    }
  }
  closedir($dir);
}

/**
 * Convenience method to send emails
 * @param string $from sender
 * @param string $to receiver
 * @param string $subj subject
 * @param string $msg message
 */
function email($from, $to, $subj, $msg) {

  $headers = 'From: '.$from . "\r\n" .
          'Reply-To: chris@babymri.org' . "\r\n" .
          'X-Mailer: PHP/' . phpversion();
  mail ($to, $subj, $msg, $headers);

//   // email admins
//   $command = joinPaths(CHRIS_PLUGINS_FOLDER, 'mail/mail');
//   $command .= ' --output ' . CHRIS_TMP;
//   $command .= ' --to ' . $to;
//   $command .= ' --from ' . $from;
//   $command .= ' --subj "'. $subj.'"';
//   $command .= ' --msg "'.$msg.'"' ;

//   shell_exec($command);

//   // mv output/mail.log
//   // to output/date-mail.log
//   $old_name = joinPaths(CHRIS_TMP,'mail.log');
//   $new_name = joinPaths(CHRIS_LOG,date('YmdHis').'-mail.log');
//   while(!file_exists($new_name)){
//     if(rename($old_name, $new_name)){
//       break;
//     }
//     $new_name = joinPaths(CHRIS_LOG,date('YmdHis').'-mail.log');
//   }
}

?>
