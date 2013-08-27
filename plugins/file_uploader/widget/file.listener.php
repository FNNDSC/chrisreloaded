<?php

// we define a valid entry point
if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);
// include the configuration file
// if(!defined('CHRIS_CONFIG_PARSED'))
//   require_once(dirname(dirname ( __FILE__ )).'/config.inc.php');

  // $headers = getallheaders();
  // // create the object and assign property
  // $file = new stdClass;
  // $file->name = basename($headers['X-File-Name']);
  // $file->size = $headers['X-File-Size'];
  // $file->content = file_get_contents("php://input");
  // if everything is ok, save the file somewhere
    // if everything is ok, save the file somewhere

  // find target path

  // write file there
$target_path = "/tmp/";


foreach ($_FILES as $key => $value) {
 $target_path = $target_path . basename( $value['name']); 

 if(move_uploaded_file($value['tmp_name'], $target_path)) {
     echo "The file ".  basename( $value['name']). 
     " has been uploaded";
 } else{
     echo "There was an error uploading the file, please try again!";
 }

 $target_path = "/tmp/";
}



?>