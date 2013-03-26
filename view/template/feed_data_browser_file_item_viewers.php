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
<img
	src='view/gfx/slicedrop.png' title='Open with Slice:Drop'
	class='slicedrop_icon focus' onclick='var e = arguments[0] || window.event; e.stopPropagation(); _FEED_.slicedrop(e);' style='position: absolute; right: 30px;'>
<?php

}

?>