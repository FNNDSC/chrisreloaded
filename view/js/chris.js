/**
 * Define the CHRIS namespace
 */
var _CHRIS_ = _CHRIS_ || {};

_CHRIS_.showTips = function(){
  jQuery('#firstlogin').show();
            
  // install the callbacks for the tutorial
  _TUTORIAL_ = 1;


  $(document).off('click', '#tutcancel').on('click', '#tutcancel', function() {$('#firstlogin').hide()});
  $(document).off('click', '#tutnext').on('click', '#tutnext',function() {
              
    $('#tut'+_TUTORIAL_).hide();
    _TUTORIAL_++;
              
    if (_TUTORIAL_>3) {
      _TUTORIAL_ = 1;
    }              
              
    $('#tut'+_TUTORIAL_).show();
            
            
  });
  $(document).off('click', '#tutprev').on('click', '#tutprev',function() {
              
    $('#tut'+_TUTORIAL_).hide();
              _TUTORIAL_--;
              
    if (_TUTORIAL_<1) {
      _TUTORIAL_ = 3;
    }              
              
    $('#tut'+_TUTORIAL_).show();
              
  });
}

_CHRIS_.updateStatistics = function() {
  
  jQuery.ajax({
    type : "GET",
    url : "api.php?action=count&what=datafeedrunning",
    dataType : "json",
    success : function(data) {
      
      if (data['result'] == 'maintenance') {
        
        // we are in maintenance mode
        // lock the screen
        $('#maintenance').show();
        return;
        
      }

      // update data count
      jQuery('#data_count').html(data['result'][0]);
      // update feed count
      jQuery('#feed_count').html(data['result'][1]);      
      // update running count
      jQuery('#running_count').html(data['result'][2]);
      
    }
  });
  
}

_CHRIS_.scalePanels = function() {

  // configure screen size related parameters
  var _pluginpanelsize = jQuery(window).height()-417;

  var _feedcontentsize = jQuery(window).height()-129;  
  var _interactivepluginsize = jQuery(window).height()-129;
  // right panel: 300px + well: 40px
  // left panel: 450px + well: 40px
  var _interactivepluginwidth = jQuery(window).width()-300 - 450 - 40 - 40;
  var _opaqueoverlaywidth = jQuery(window).width()- 40;
  
  if (jQuery(window).height() <= 600) {
    // hide the statistics panel
    jQuery('#information').hide();
    _pluginpanelsize += 131;
  } else {
    // show it
    jQuery('#information').show();
  }
  
  jQuery('.plugin_panel').css('min-height', _pluginpanelsize);
  jQuery('.plugin_panel').css('height', _pluginpanelsize);
  jQuery('.plugin_panel').css('max-height', _pluginpanelsize);
  jQuery('.feed_content').css('min-height', _feedcontentsize);
  jQuery('.feed_content').css('height', _feedcontentsize);
  jQuery('.feed_content').css('max-height', _feedcontentsize);
  jQuery('.interactive_plugin_content').css('min-height', _interactivepluginsize);
  jQuery('.interactive_plugin_content').css('height', _interactivepluginsize);
  jQuery('.interactive_plugin_content').css('max-height', _interactivepluginsize);
  jQuery('#center').css('min-width', _interactivepluginwidth);
  jQuery('#center').css('width', _interactivepluginwidth);
  jQuery('#center').css('max-width', _interactivepluginwidth);
  if(jQuery('#center').is(":visible")){
    // resize opaque overlay if interactive plugin (#center) is visible
    jQuery('#opaqueoverlay').css('width', _opaqueoverlaywidth);
  }
  
};

jQuery(document).ready(function() {
  
  // watch for the resize event
  jQuery(window).resize(function() {_CHRIS_.scalePanels()});
  // also call it once
  _CHRIS_.scalePanels();
  
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
  setInterval(_CHRIS_.updateStatistics, 5000); 

  function format(state) {
    var originalOption = state.element;
    //return '<span style="color:'+$(originalOption).data('color')+'; background-color:'+$(originalOption).data('backgroundcolor')+';">'+state.text+'</span>';
    return '<span data-fontcolor='+$(originalOption).data("color")+' style="padding-left:2px; border-left: thick solid '+$(originalOption).data('backgroundcolor')+';">'+state.text+'</span>';
  }

  $("#filtertagplugin").select2({
            placeholder: "Filter feeds",
            allowClear: true,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function(m) { return m; }
  });
  
});