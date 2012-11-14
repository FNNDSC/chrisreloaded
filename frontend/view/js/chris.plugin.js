/**
 * Define the PLUGIN namespace
 */
var _PLUGIN_ = _PLUGIN_ || {};
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(
    function() {

      // set default plugin to the first one
      var _first_plugin = jQuery(".carousel-inner").children(':first');
      var _first_plugin_id = _first_plugin.attr('id');
      // .. activate it in the carousel
      _first_plugin.addClass("active");
      // .. and show it's panel
      jQuery('#panel_' + _first_plugin_id).show();
      
      // turn off automated rotation
      jQuery('#pipelines').carousel({
        interval: false
      });
      
      // show/hide panels on sliding of the carousel
      
      // the old one
      jQuery('#pipelines').bind(
          'slide',
          function() {

            // update UI
            var _old_plugin_id = jQuery(".carousel-inner").children('.active')
                .attr('id');
            // by hiding the old plugin
            jQuery('#panel_' + _old_plugin_id).hide();
          });
      // the new one
      jQuery('#pipelines').bind(
          'slid',
          function() {

            // update UI
            var _new_plugin_id = jQuery(".carousel-inner").children('.active')
                .attr('id');
            // by showing the new plugin
            jQuery('#panel_' + _new_plugin_id).show();
            
          });
      
      // setup droppable item
      jQuery(".parameter_dropzone").droppable(
          {
            activeClass: "parameter_dropzone_active",
            hoverClass: "parameter_dropzone_hover",
            tolerance: "pointer",
            accept: ":not(.ui-sortable-helper)",
            drop: function(event, ui) {

              // grab the data name dom element
              var _data_name = ui.draggable;
              
              // now we can grab the MRN
              var _mrn = _data_name.closest('.file_browser').attr(
                  'data-patient-id');
              
              // and the data id
              var _data_id = _data_name.closest('.file_browser')
                  .attr('data-id');
              
              // and the full path
              var _full_path = _data_name.attr('data-full-path');
              
              // and create a new representation
              var _new_span = jQuery('<span></span>');
              _new_span.html('<b>MRN ' + _mrn + '</b> ' + _data_name.text());
              _new_span.attr('data-patient-id', _mrn);
              _new_span.attr('data-id', _data_id);
              _new_span.attr('data-full-path', _full_path);
              
              // throw everything old away
              jQuery(this).empty();
              // .. and attach the new thingie
              jQuery(this).append(_new_span);
              
            }
          });
      
      jQuery('#plugin_cancel').on(
          'click',
          function(e) {

            // reset all parameters to default values
            
            // prevent scrolling up
            e.preventDefault();
            
            // grab the visible plugin panel
            var _visible_panel = jQuery('.plugin_panel :visible');
            
            _parameter_rows = _visible_panel.find('.parameter_row');
            
            // loop through all parameter rows
            _parameter_rows.each(function(i) {

              // and restore all inputs to the default values
              
              // dropzones
              var _dropzone_field = jQuery(_parameter_rows[i]).find(
                  '.parameter_dropzone');
              var _default_value = _dropzone_field.attr('data-default');
              _dropzone_field.html(_default_value);
              
              // spinners
              var _spinner = jQuery(_parameter_rows[i]).find(
                  '.parameter_spinner');
              _default_value = _spinner.attr('data-default');
              _spinner.spinner("value", _default_value);
              
              // checkboxes
              var _checkbox = jQuery(_parameter_rows[i]).find(
                  '.parameter_checkbox');
              _default_value = _checkbox.attr('data-default');
              _checkbox.prop('checked', (_default_value == 'true'));
              
            });
            
          });
      
      jQuery('#plugin_submit').on(
          'click',
          function(e) {

            // fire it up!!
            
            // prevent scrolling up
            e.preventDefault();
            
            // grab the visible plugin panel
            var _visible_panel = jQuery('.plugin_panel :visible');
            var _plugin_name = _visible_panel.parent().attr('id').replace('panel_', '');
            var _parameter_rows = _visible_panel.find('.parameter_row');
            var _output_rows = _visible_panel.find('.output_row');
            
            var _parameters = [];
            var _outputs = [];
            
            // loop through all output rows
            _output_rows.each(function(i) {

              var _parameter_output = jQuery(_output_rows[i]).find(
                  '.parameter_output');
              var _flag = _parameter_output.attr('data-flag');
              var _type = _parameter_output.attr('data-type');
              
              var _output = null;
              
              // strip possible --
              _flag = _flag.replace(/-/g, '');
              
              var _value;
              
              if (_type == 'directory') {
                _value = '';
              } else if (_type == 'image') {
                _value = _flag + '.nii';
              } else if (_type == 'file') {
                _value = _flag + '.file';
              } else if (_type == 'transform') {
                _value = _flag + '.mat';
              }
              
              // push the output
              _outputs.push({
                name: _flag,
                value: _value,
                type: 'simple',
                target_type: 'feed'
              });
              

            });
            
            // loop through all parameter rows
            _parameter_rows.each(function(i) {

              var _parameter_input = jQuery(_parameter_rows[i]).find(
                  '.parameter_input');
              var _flag = _parameter_input.attr('data-flag');
              var _type = _parameter_input.attr('data-type');
              
              var _parameter = null;
              
              // strip possible --
              _flag = _flag.replace(/-/g, '');
              
              var _value;
              
              if (_type == 'dropzone') {
                // dropzones
                var _dropzone_field = jQuery(_parameter_rows[i]).find(
                    '.parameter_dropzone');
                
                _value = _dropzone_field.children('span')
                    .attr('data-full-path');
                
              } else if (_type == 'spinner') {
                
                // spinners
                var _spinner = jQuery(_parameter_rows[i]).find(
                    '.parameter_spinner');
                
                _value = jQuery(_spinner).spinner("value");
                
              } else if (_type == 'checkbox') {
                
                // checkboxes
                var _checkbox = jQuery(_parameter_rows[i]).find(
                    '.parameter_checkbox');
                
                if (jQuery(_checkbox).prop('checked')) {
                  
                  // checkbox active, so add the flag
                  _value = '';
                  
                } else {
                  return;
                }
                
              }
              
              // push the parameter
              _parameters.push({
                name: _flag,
                value: _value,
                type: _type,
                target_type: 'feed'
              });
              
            });
            
            // TODO validate
            
            console.log(_parameters);
            console.log(_outputs);
            
            
            // send to the launcher
            jQuery.ajax({
              type: "POST",
              url: "controller/launcher-web.php",
              dataType: "text",
              data: {
                FEED_PLUGIN: _plugin_name,
                FEED_NAME: 'name of the feed',
                FEED_PARAM: _parameters,
                FEED_OUTPUT: _outputs
              },
              success: function(data) {

                console.log(data);
                
                alert('Job submitted!\n',data);
              }
            });
            
          });
      
      jQuery('.panelgroup').multiAccordion({
        heightStyle: "content",
        animate: false,
        
        // collapse all panels by default (they later get shown again if
        // they are not advanced panels)
        active: 'none'
      });
      jQuery('.parameter_spinner').each(function(i, v) {

        var _container = jQuery(v);
        var _default_value = _container.attr('data-default');
        var _step = _container.attr('data-step');
        if (!_step) {
          _step = 1;
        }
        
        _container.spinner({
          
          step: _step
        
        });
        _container.spinner("value", parseFloat(_default_value, 10));
        
      });
      
      // show non-advanced panels
      jQuery('.panelgroup').each(function(i, v) {

        var _accordion = jQuery(v);
        
        var _activeTabs = _accordion.multiAccordion('getActiveTabs');
        
        if ((_activeTabs.length == 1) && (_activeTabs[0] == -1)) {
          
          // no tabs active yet
          _activeTabs = [];
          
        }
        
        // grab the current panels of this accordion
        jQuery(v).children('.panel_content').each(function(j, w) {

          // check if this is an advanced panel
          var _advanced_panel = (jQuery(w).attr('data-advanced') == 'true');
          
          // check if this is an hidden panel
          var _hidden_panel = (jQuery(w).attr('hidden-panel') == 'true');
          
          if (_hidden_panel) {
            // hide this panel
            jQuery(w).prev().hide();
            
            // and never add it to the active tabs
            return;
          }
          
          // check if this is an output only panel
          var _only_output = (jQuery(w).find('.parameter_row').length == 0);
          
          if (_only_output) {
            // hide this panel
            jQuery(w).prev().hide();
            
            // and never add it to the active tabs
            return;
          }
          if (!_advanced_panel) {
            // this is not an advanced panel
            _activeTabs.push(j);
            
          }
          
        });
        
        // now show all non-advanced panels
        _accordion.multiAccordion('option', 'active', _activeTabs);
        
      });
      
    });
