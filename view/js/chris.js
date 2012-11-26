/**
 * Define the CHRIS namespace
 */
var _CHRIS_ = _CHRIS_ || {};

_CHRIS_.updateStatistics = function() {
  
  jQuery.ajax({
    type : "GET",
    url : "api.php?action=count&what=running",
    dataType : "json",
    success : function(data) {
      
      // update running count
      jQuery('#running_count').html(data['result']);
      
    }
  });
  
  jQuery.ajax({
    type : "GET",
    url : "api.php?action=count&what=feed",
    dataType : "json",
    success : function(data) {
      
      // update feed count
      jQuery('#feed_count').html(data['result']);
      
    }
  });
  
  jQuery.ajax({
    type : "GET",
    url : "api.php?action=count&what=data",
    dataType : "json",
    success : function(data) {
      
      // update data count
      jQuery('#data_count').html(data['result']);
      
    }
  });  
  
}

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
  
  // activate polling of new statistics
  setInterval(_CHRIS_.updateStatistics, 1000);
  
  
});

// activate backstretch
jQuery.backstretch('view/gfx/background1.jpg');