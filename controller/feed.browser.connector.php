<?php
//
// jQuery File Tree PHP Connector
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 24 March 2008
//
// History:
//
// 1.01 - updated to work with foreign characters in directory/file names (12 April 2008)
// 1.00 - released (24 March 2008)
//
// Output a list of files for jQuery File Tree
//

// we define a valid entry point
define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
require_once (dirname(dirname(__FILE__)).'/config.inc.php');

require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'security.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'template.class.php'));

$_POST['dir'] = urldecode($_POST['dir']);
$root = CHRIS_USERS;
$path = $root . $_POST['dir'];

if( is_dir($path) ) {
  $files = scandir($path);
  natcasesort($files);
  if( count($files) > 2 ) { /* The 2 accounts for . and .. */

    echo "<ul class=\"jqueryFileTree\" style=\"display: none;\">";
    // All dirs
    foreach( $files as $file ) {

      if( $file{0} == '.') {
        // skip hidden files and folders
        continue;
      }

      $fullpath = $path . $file;
      if( file_exists($fullpath) && $file != '.' && $file != '..' ) {
        if(is_dir($fullpath)){
          $t = new Template('feed_data_browser_directory_item.html');
          $t->replace('CLASSES', 'directory collapsed');
          $t->replace('FULLPATH', $fullpath);
          $t->replace('RELATIVEPATH', htmlentities($_POST['dir'] . $file . '/'));
          $t->replace('FILENAME', htmlentities($file));
          echo $t;
        }
        elseif(is_file($fullpath)){
          $ext = preg_replace('/^.*\./', '', $file);
          
          $t = new Template('feed_data_browser_file_item.html');
          $t->replace('CLASSES', 'file ext_'.$ext);
          $t->replace('FULLPATH', $fullpath);
          $t->replace('RELATIVEPATH', htmlentities($_POST['dir'] . $file));
          $t->replace('FILENAME', htmlentities($file));
          echo $t;
        }
      }
    }

    echo "</ul>";
  }
}

?>