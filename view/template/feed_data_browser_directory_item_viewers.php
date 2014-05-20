<?php

  $fullpath = $GLOBALS['fullpath'];


  //
  // check for dicom files
  //

  $dicom_files = glob($fullpath."/{*.dcm,*.dicom}",GLOB_BRACE);

  if (count($dicom_files) > 0) {

?>
<span class="feed_view" style="float:right;" onclick='var e = arguments[0] || window.event; var self = this; _FEED_.feed_view_action(e, self)'>
  <i class="icon-eye-open focus"></i>
</span>
<?php

  }

  //
  // check for freesurfer folder
  //

  $freesurfer_meshes = glob($fullpath."/surf/{lh.*,rh.*}", GLOB_BRACE);

  if (count($freesurfer_meshes) > 0) {

?>
<span style='float:right'></span>
<?php

  }

?>
