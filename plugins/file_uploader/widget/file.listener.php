if(count($_FILES['uploads']['filesToUpload'])) {
	foreach ($_FILES['uploads']['filesToUpload'] as $file) {
	    
		//do your upload stuff here
		echo $file;
		
	}
}