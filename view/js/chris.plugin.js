/**
 * Define the PLUGIN namespace
 */
var _PLUGIN_ = _PLUGIN_ || {};

_PLUGIN_.showBatchDrop = function() {
  
  // grab the visible plugin panel
  var _visible_panel = jQuery('.plugin_panel :visible');
  var _plugin_name = _visible_panel.parent().attr('id').replace(
      'panel_', '');  
  
  _visible_panel.find('.parameter_dropzone').width(125);
  _visible_panel.find('.parameter_batchdrop').html('<i class="icon-plus" style="vertical-align:sub;"/>')
  _visible_panel.find('.parameter_batchdrop').show();
  
  // setup droppable item
  jQuery(".parameter_batchdrop").droppable({
    hoverClass: "parameter_batchdrop_hover",
    tolerance: "pointer",
    drop: _BATCH_.drop
  });  
  
}

_PLUGIN_.hideBatchDrop = function() {
  
  // grab the visible plugin panel
  var _visible_panel = jQuery('.plugin_panel :visible');
  var _plugin_name = _visible_panel.parent().attr('id').replace(
      'panel_', '');  
  
  _visible_panel.find('.parameter_dropzone').width(160);
  // _visible_panel.find('.parameter_batchdrop').html('<i class="icon-plus"
  // style="vertical-align:sub;"/>')
  _visible_panel.find('.parameter_batchdrop').hide();
  
}


/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(
    function() {

      // parse all categories
      _PLUGIN_.categories = ['-- Show all --'];
      jQuery('.plugin_panel').each(function (i,v) {
        
        var _category = jQuery(v).attr('data-category');
        
        // propagate all categories to the carousel items
        var _id = jQuery(v).attr('id').replace('panel_','');
        jQuery('#'+_id).attr('data-category', _category);
        
        if (_PLUGIN_.categories.indexOf(_category) == -1) {
          _PLUGIN_.categories.push(_category);
        }
        
      });
      _PLUGIN_.categories.sort(); // order alphabetically
      
      // and also store all plugins
      jQuery('.carousel-inner').children().clone().appendTo('#cart_storage');
      
      // fill the category combobox
      var _categorieslength = _PLUGIN_.categories.length;
      for (var p=0;p<_categorieslength;p++) {
        
        jQuery('#cart_categories').append('<option>'+_PLUGIN_.categories[p]+'</option>');
        
      }
      
      // configure the category callback
      jQuery('#cart_categories').bind('change', function() {
        
        var _new_category = jQuery('#cart_categories').val();
        
        // remove all
        jQuery('.carousel-inner').empty();
        
        // configure the selector
        var _selector = '[data-category="'+_new_category+'"]';
        
        // and a special case for show all
        if (_new_category == '-- Show all --') {
          
          // this means, show all :)
          _selector = '';
          
        }
          
        // now move all the matching ones back
        jQuery('#cart_storage').children(_selector).clone().appendTo('.carousel-inner');
                
        // remove all the active classes
        jQuery('.carousel-inner').children('.active').removeClass('active');
        
        // and activate the first one
        jQuery('.carousel-inner').children().first().addClass('active');
        
        // for only one matching plugin, remove the arrows to avoid a deadlock
        // in the carousel stack
        if (jQuery('.carousel-inner').children().length == 1) {
          
          jQuery('.cart-carousel-control').hide();
          
        } else {
          
          jQuery('.cart-carousel-control').show();
          
        }
        
        // and show the proper UI
        
        // reset to default
        jQuery('#plugin_cancel').click();        
        
        jQuery('.plugin_panel').hide();
        jQuery('#panel_'+jQuery('.carousel-inner').children().first().attr('id')).show();
        
        // now reset all jobs
        _BATCH_.reset();
        
        
      });
      
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

            // reset to default
            jQuery('#plugin_cancel').click();            
            
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
            
            // now reset all jobs
            _BATCH_.reset();
            
          });
      

      
      jQuery(".parameter_dropzone").droppable({
        activeClass: "parameter_dropzone_active",
        hoverClass: "parameter_dropzone_hover",
        tolerance: "pointer",
        accept: ":not(.ui-sortable-helper)",
        activate: function(event, ui) {
          
          if (!jQuery(this).is(":visible")) {
            return;
          }
          
          var _dropzone_field = jQuery(this);
          var _default_value = _dropzone_field.attr('data-default');
          var _current_value = jQuery.trim(_dropzone_field.html());          
          
          if (_default_value == _current_value) {
            
            // nothing was dropped here before
            
          } else {
            
            // something was already dropped, so show the parameter_batchdrop
            _PLUGIN_.showBatchDrop();
            
          }
          
        },
        deactivate: function(event, ui) {
          
          _PLUGIN_.hideBatchDrop();
          
        },
        drop: _BATCH_.drop
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
              
              // strings
              var _string = jQuery(_parameter_rows[i]).find(
              '.parameter_string');
              _default_value = _string.attr('data-default');
              _string.val(_default_value);
              
            });
            
            // reset all jobs
            _BATCH_.reset();
            
          });
      
      jQuery('#plugin_submit').on(
          'click',
          function(e) {

            // fire it up!!
            
            // prevent scrolling up
            e.preventDefault();
            
            // grab the visible plugin panel
            var _visible_panel = jQuery('.plugin_panel :visible');
            var _plugin_name = _visible_panel.parent().attr('id').replace(
                'panel_', '');
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
                
              } else if (_type == 'string') {
                
                // text_input
                var text_input = jQuery(_parameter_rows[i]).find(
                    '.parameter_string');
                
                _value = '\"' + text_input.val() + '\"';
                
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
            
            apprise('<h5>Please name this job!</h5>', {
              'input': new Date()
            }, function(r) {

              if (r) {
                
                // 
                var _feed_name = r;
                
                // send to the launcher
                jQuery.ajax({
                  type: "POST",
                  url: "controller/launcher-web.php",
                  dataType: "text",
                  data: {
                    FEED_PLUGIN: _plugin_name,
                    FEED_NAME: _feed_name,
                    FEED_PARAM: _parameters,
                    FEED_OUTPUT: _outputs
                  },
                  success: function(data) {

                    jQuery().toastmessage(
                        'showSuccessToast',
                        '<h5>Job started.</h5>' + 'Plugin: <b>' + _plugin_name +
                            '</b><br>' + 'Name: <b>' + _feed_name + '</b>');
                    
                  }
                });
                

              } else {
                
                jQuery().toastmessage('showErrorToast',
                    '<h5>Submission failed.</h5>' + 'Please enter a name!');
                
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
      
      // replace the default values for string parameters
      jQuery('.parameter_string').each(function(i,v) {
        
        if (jQuery(v).html() == '_CHRIS_DEFAULT') {
          jQuery(v).html('');
          jQuery(v).attr('data-default','')
        }
        
      });
      
      // register keypress for string parameters
      jQuery('.parameter_string').keypress(function(e) {
        if (e.which == '13') {
          // on return, adjust the size
          jQuery(this).css('height', parseInt(jQuery(this).css('height'),10)+parseInt(jQuery(this).css('line-height'),10));
        }
      })
      
      
    });
