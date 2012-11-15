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
  
  // action command show on focus
  jQuery('#action_command').focusin(function() {
    
    jQuery('#action_ui').show();
    
  });
  jQuery('#action_command').focusout(function() {
    
    if (jQuery('#action_run').attr('data-hover')=='true') return;
    jQuery('#action_ui').hide();
    
  });
  jQuery('#action_run').hover(function() {
    
    jQuery('#action_run').attr('data-hover','true');
    
  },function() {
    
    jQuery('#action_run').attr('data-hover','false');
    
  });
  jQuery('#action_run').click(function() {
  
    jQuery('#action_ui').hide();
    
  });
  
  
});

// activate backstretch
jQuery.backstretch('view/gfx/background1.jpg');