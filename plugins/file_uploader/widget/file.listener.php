<?php

// we define a valid entry point
if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
require_once (dirname(dirname(dirname(dirname(__FILE__)))).'/config.inc.php');

// include chris db interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'db.class.php'));
// include chris mapper interface
require_once(joinPaths(CHRIS_CONTROLLER_FOLDER,'mapper.class.php'));
// include pacs helper
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'feed.model.php'));
require_once (joinPaths(CHRIS_MODEL_FOLDER, 'user.model.php'));

// get feed path
$mapper = new Mapper('Feed');
$mapper->get($_POST['targetFeed']);
$resultsFeed = $mapper->get();

$mapper = new Mapper('User');
$mapper->get($resultsFeed['Feed'][0]->user_id);
$resultsUser = $mapper->get();

// write 1 level down
$target_path = CHRIS_USERS.'/'.$resultsUser['User'][0]->username.'/file_uploader/'.$resultsFeed['Feed'][0]->name.'-'.$resultsFeed['Feed'][0]->id.'/';
$dirs = array_filter(glob($target_path.'/*'), 'is_dir');

foreach ($_FILES as $key => $value) {
 $target_path = $dirs[0] . '/'.basename( $value['name']); 

 if(move_uploaded_file($value['tmp_name'], $target_path)) {
     echo "The file ".  basename( $value['name']). 
     " has been uploaded";
 } else{
     echo "There was an error uploading the file, please try again!";
 }

}

?>