jQuery(document).ready(function() {
  jQuery('.dropdown-toggle').dropdown();
  jQuery("[rel=bottom_tooltip]").tooltip({
    placement : 'bottom'
  });
  jQuery("[rel=right_tooltip]").tooltip({
    placement : 'right'
  });
  jQuery("[rel=left_tooltip]").tooltip({
    placement : 'left'
  });  
});

// activate backstretch
jQuery.backstretch('view/gfx/background1.jpg');