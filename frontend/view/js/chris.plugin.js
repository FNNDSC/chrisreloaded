/**
 * Define the PLUGIN namespace
 */
var _PLUGIN_ = _PLUGIN_ || {};
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  // set default plugin to the first one
  var _first_plugin = jQuery(".carousel-inner").children(':first');
  var _first_plugin_id = _first_plugin.attr('id');
  // .. activate it in the carousel
  _first_plugin.addClass("active");
  // .. and show it's panel
  jQuery('#panel_'+_first_plugin_id).show();
  
  // turn off automated rotation
  jQuery('#pipelines').carousel({
    interval : false
  });
  
  // show/hide panels on sliding of the carousel
  
  // the old one
  jQuery('#pipelines').bind('slide', function() {
    // update UI
    var _old_plugin_id = jQuery(".carousel-inner").children('.active').attr('id');
    // by hiding the old plugin
    jQuery('#panel_'+_old_plugin_id).hide();
  });
  // the new one
  jQuery('#pipelines').bind('slid', function() {
    // update UI
    var _new_plugin_id = jQuery(".carousel-inner").children('.active').attr('id');
    // by showing the new plugin
    jQuery('#panel_'+_new_plugin_id).show();
    
  });  
  
  // setup droppable item
  jQuery(".parameter_dropzone").droppable({
    activeClass : "parameter_dropzone_active",
    hoverClass : "parameter_dropzone_hover",
    tolerance : "pointer",
    accept : ":not(.ui-sortable-helper)",
    drop : function(event, ui) {
      
      // grab the data name dom element
      var _data_name = ui.draggable;
      
      // now we can grab the MRN
      var _mrn = _data_name.closest('.file_browser').attr('data-patient-id');
      
      // and the data id
      var _data_id = _data_name.closest('.file_browser').attr('data-id');
      
      // and the full path
      var _full_path = _data_name.attr('data-full-path');
      
      // and create a new representation
      var _new_span = jQuery('<span></span>');
      _new_span.html('<b>MRN '+_mrn+'</b> '+_data_name.text());
      _new_span.attr('data-patient-id', _mrn);
      _new_span.attr('data-id', _data_id);
      _new_span.attr('data-full-path', _full_path);
      
      // throw everything old away
      jQuery(this).empty();
      // .. and attach the new thingie
      jQuery(this).append(_new_span);
      
    }
  });
  
  jQuery('#plugin_cancel').on('click', function(e) {
    
    // reset all parameters to default values
    
    // prevent scrolling up
    e.preventDefault();
    
    // grab the visible plugin panel
    var _visible_panel = jQuery('.plugin_panel :visible');
    
    _parameter_rows = _visible_panel.children('.parameter_row');
    
    // loop through all parameter rows
    _parameter_rows.each(function(i) {
       
      // and restore all inputs to the default values
      var _input_field = jQuery(_parameter_rows[i]).children('.parameter_input');
      var _default_value = _input_field.attr('data-default');
      _input_field.html(_default_value);
      
    });
    
  });
  
  jQuery('#plugin_submit').on('click', function(e){
    
    // fire it up!!
    
    // prevent scrolling up
    e.preventDefault();
    
    // TODO validate
    
    // TODO perform the action
    
    alert('Job submitted!');
    
  });
  
  jQuery('.panelgroup').accordion({ heightStyle: "content", animate: false  });
  jQuery('.parameter_spinner').spinner();
  jQuery('.parameter_spinner_double').spinner({ numberFormat: "n" });
  
});
