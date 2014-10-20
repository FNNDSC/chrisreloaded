!#/usr/bin/php

<?php

$chrisInput_path = ${CHRISINPUT_PATH};
$chris_bin = ${CHRIS_BIN};
$chris_scrips = ${CHRIS_SCRIPTS};

$dir_iter = new RecursiveDirectoryIterator($chrisInput_path, RecursiveDirectoryIterator::SKIP_DOTS);
$iter = new RecursiveIteratorIterator(\$dir_iter, RecursiveIteratorIterator::SELF_FIRST);
$dir_array = array($chrisInput_path);
foreach ($iter as $dir => $dirObj) {
    if ($dirObj->isDir()) {
        $dir_array[] = $dir;
    }
}
                  
//for each subdirectory in the tree find out if it contains dicom files and if so then run anonymization
//the output goes to the same directory overwriting the previous dicom file

foreach ($dir_array as $dir) {
    $dicomFiles = glob($dir."/*.dcm");
        if (count($dicomFiles)) {
		shell_exec("PATH=$chris_bin:$chris_scripts:\$PATH; dcmanon_meta.bash -P -O " . $dir . " -D " . $dir);
	}
}	

?>
		  
