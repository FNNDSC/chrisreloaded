<?php

  $fullpath = $GLOBALS['fullpath'];

  $dicom_files = glob($fullpath."/{*.dcm,*.dicom}",GLOB_BRACE);

  if (count($dicom_files) > 0) {

    // this folder contains dicoms
    // -> show the slicedrop logo

?>
<img
	src='view/gfx/slicedrop.png' title='Open with Slice:Drop'
	class='slicedrop_icon focus' onclick='var e = arguments[0] || window.event; e.stopPropagation(); _FEED_.slicedrop(e);' style='position: absolute; right: 10px;'>
<?php

  }

?>