<?php

switch(strtoupper($GLOBALS['ext'])) {

  case 'NII':
  case 'MGH':
  case 'MGZ':
  case 'NII':
  case 'GZ':
  case 'NRRD':
  case 'TRK':
  case 'FSM':
  case 'SMOOTHWM':
  case 'PIAL':
  case 'INFLATED':
  case 'SPHERE':
  case 'ORIG':
  case 'VTK':
  case 'STL':

    ?>
<span class="feed_view" style="float:right;position:absolute; right:10px;" onclick='var e = arguments[0] || window.event; var self = this; _FEED_.feed_view_action(e, self)'>
  <i class="icon-eye-open focus"></i>
</span>
<?php

}

?>
