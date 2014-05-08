/**
 * Define the PLUGIN namespace
 */
var _PLUGIN_ = _PLUGIN_ || {};
_PLUGIN_.showBatchDrop = function() {
  // grab the visible plugin panel
  var _visible_panel = jQuery('.plugin_panel:visible');
  var _plugin_name = _visible_panel.attr('id').replace('panel_', '');
  _visible_panel.find('.parameter_dropzone').width(125);
  _visible_panel.find('.parameter_batchdrop').html(
      '<i class="icon-plus" style="vertical-align:sub;"/>')
  _visible_panel.find('.parameter_batchdrop').show();
  // setup droppable item
  jQuery(".parameter_batchdrop").droppable({
    hoverClass : "parameter_batchdrop_hover",
    tolerance : "pointer",
    drop : _BATCH_.drop
  });
}
_PLUGIN_.hideBatchDrop = function() {
  // grab the visible plugin panel
  var _visible_panel = jQuery('.plugin_panel:visible');
  var _plugin_name = _visible_panel.attr('id').replace('panel_', '');
  _visible_panel.find('.parameter_dropzone').width(160);
  // _visible_panel.find('.parameter_batchdrop').html('<i class="icon-plus"
  // style="vertical-align:sub;"/>')
  _visible_panel.find('.parameter_batchdrop').hide();
}
/**
 * Process submit coming from an interactive plugin
 */
_PLUGIN_.submitInteractive = function(_plugin_name, _jobs) {
  if (typeof _CHRIS_INTERACTIVE_PLUGIN_ == 'undefined') {
    // setup view layout
    _PLUGIN_.setupInteractiveLayout(_plugin_name, _jobs);
    jQuery('#plugin_submit').removeClass('disabled');
    jQuery('#plugin_submit_wait').hide();
    jQuery('#plugin_submit_play').show();
    return null;
  } else if (_CHRIS_INTERACTIVE_PLUGIN_.force == false) {
    // load new parameters
    _CHRIS_INTERACTIVE_PLUGIN_.parameters(_jobs);
    // start view
    _CHRIS_INTERACTIVE_PLUGIN_.init();
    jQuery('#plugin_submit').removeClass('disabled');
    jQuery('#plugin_submit_wait').hide();
    jQuery('#plugin_submit_play').show();
    return null;
  } else {
    // get new parameters
    _CHRIS_INTERACTIVE_PLUGIN_.force = false;
    return _CHRIS_INTERACTIVE_PLUGIN_.parameters();
  }
}
/**
 * Cleanup the layout after an interactive plugin
 */
_PLUGIN_.cleanInteractiveLayout = function() {
  // clean if necessary
  if (typeof _CHRIS_INTERACTIVE_PLUGIN_ != 'undefined') {
    _CHRIS_INTERACTIVE_PLUGIN_.destroy();
  }
  // clean namespace
  _CHRIS_INTERACTIVE_PLUGIN_ = {};
  _CHRIS_INTERACTIVE_PLUGIN_ = undefined;
  // back to original layout
  // GO!
  // 1- hide center
  // 2- modify right width
  // 3- modify background width
  jQuery('#center:visible')
      .hide(
          'blind',
          function() {
            jQuery('#right')
                .on(
                    "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
                    function() {
                      jQuery('#opaqueoverlay').css('width',
                          jQuery('#opaqueoverlay').data('width'));
                      jQuery('#right')
                          .off(
                              "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
                    });
            jQuery('#right').css('width', jQuery('#right').data('width'));
          });
}
/**
 * Setup the layout before an interactive plugin
 */
_PLUGIN_.setupInteractiveLayout = function(_pluginName, _params) {
  // store width value
  jQuery('#opaqueoverlay').data('width', jQuery('#opaqueoverlay').css('width'));
  jQuery('#right').data('width', jQuery('#right').css('width'));
  // connect close button
  jQuery(document).off('click', '#close_interactive_plugin').on('click',
      '#close_interactive_plugin', _PLUGIN_.cleanInteractiveLayout);
  // prepare sequence of transitions
  jQuery('#opaqueoverlay').on(
      "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
      function() {
        jQuery('#right').css('width', '450px');
      });
  jQuery('#right')
      .on(
          "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
          function() {
            jQuery
                .ajax({
                  type : "GET",
                  url : "plugins/" + _pluginName + "/widget/index.html",
                  dataType : "text",
                  success : function(data) {
                    window.console.log(data);
                    jQuery('.interactive_plugin_content').html(data);
                    jQuery('#center').show('blind');
                    // pass parameters
                    _CHRIS_INTERACTIVE_PLUGIN_.parameters(_params);
                    // start view
                    _CHRIS_INTERACTIVE_PLUGIN_.init();
                    // unbind transitions
                    jQuery('#opaqueoverlay')
                        .off(
                            "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
                    jQuery('#right')
                        .off(
                            "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
                  }
                });
          });
  // GO!
  // 1- modify background width
  // 2- modify right width
  // 3- load plugin
  // 4- show center
  // load JS and go!
  var _windows_width = jQuery(window).width() - 40;
  _CHRIS_UTILS_.loadScript("view/js/chris.plugin.interactive.js", function() {
    jQuery('#opaqueoverlay').css('width', _windows_width)
  });
}
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document)
    .ready(
        function() {
          // parse all categories
          _PLUGIN_.categories = [];
          jQuery('.plugin_panel').each(function(i, v) {
            var _category = jQuery(v).attr('data-category');
            // propagate all categories to the carousel items
            var _id = jQuery(v).attr('id').replace('panel_', '');
            jQuery('#' + _id).attr('data-category', _category);
            if (_PLUGIN_.categories.indexOf(_category) == -1) {
              _PLUGIN_.categories.push(_category);
            }
          });
          // order alphabetically
          _PLUGIN_.categories.sort(function(a, b) {
            if (a.toLowerCase() < b.toLowerCase())
              return -1;
            if (a.toLowerCase() > b.toLowerCase())
              return 1;
            return 0;
          });
          // and also store all plugins
          jQuery('.carousel-inner').children().clone()
              .appendTo('#cart_storage');
          // fill the category combobox
          jQuery('#cart_categories').append('<option></option>');
          var _categorieslength = _PLUGIN_.categories.length;
          for ( var p = 0; p < _categorieslength; p++) {
            // optgroups
            var groupContent = '';
            groupContent += '<optgroup label="'+_PLUGIN_.categories[p]+'">';
            // loop through plugins
            jQuery('#cart_storage').children('[data-category="' + _PLUGIN_.categories[p] + '"]').each(function( key, value ) {
              groupContent += '<option value="'+jQuery(this).attr('id')+'">' + jQuery(this).attr('id') + '</option>';
            });

            groupContent += '</optgroup>';
            jQuery('#cart_categories').append(groupContent);
          }

          // create select elt
          $("#cart_categories").select2({
                placeholder: "Select a plugin",
                allowClear: true
            });

          // click on sidse to go to next, on change

          // configure the category callback
          jQuery('#cart_categories')
              .bind(
                  'change',
                  function(e) {

                    var _categorySelector = '';
                    var _pluginSelector = '';
                    if (e.val.length > 0) {
                      // set category + active plugin
                      // show one plugin
                      _categorySelector = '[data-category="' + e.added.element[0].parentElement.label + '"]';
                      _pluginSelector = '#' + e.val;
                    }
                    else {
                      //'show all'; == 'show first'
                    }

                    // var _new_category = jQuery('#cart_categories').val();
                    // remove all
                     jQuery('.carousel-inner').empty();
                    // // configure the selector
                    // var _selector = '[data-category="' + _new_category + '"]';
                    // // and a special case for show all
                    // if (_new_category == '-- Show all --') {
                    //   // this means, show all :)
                    //   _selector = '';
                    // }
                    // now move all the matching ones back
                    jQuery('#cart_storage').children(_categorySelector).clone()
                        .appendTo('.carousel-inner');
                    // remove all the active classes
                    jQuery('.carousel-inner').children('.active').removeClass(
                        'active');
                    // and activate the first one
                    // 
                    if(_pluginSelector == ''){
                    jQuery('.carousel-inner').children().first().addClass(
                        'active');
                    }
                    else{
                    jQuery('.carousel-inner').children(_pluginSelector).addClass(
                        'active');
                  }
                    // for only one matching plugin, remove the arrows to avoid
                    // a deadlock
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
                    // clean up after interactive plugin
                    _PLUGIN_.cleanInteractiveLayout();
                    var _new_plugin_id = '';

                    if(_pluginSelector == ''){
                      _new_plugin_id = jQuery('.carousel-inner').children().first().attr('id');
                    }
                    else{
                      _new_plugin_id = jQuery('.carousel-inner').children(_pluginSelector).attr('id');
                    }

                    jQuery('#panel_' + _new_plugin_id).show();
                    // now reset all jobs
                    _BATCH_.reset();
                  });

          // set default plugin to the first one
          var _first_plugin = jQuery("#search");
          var _first_plugin_id = _first_plugin.attr('id');
          // .. activate it in the carousel
          _first_plugin.addClass("active");
          // .. and show it's panel
          jQuery('#panel_' + _first_plugin_id).show();
          // turn off automated rotation
          jQuery('#pipelines').carousel({
            interval : false
          });

          // show/hide panels on sliding of the carousel
          // the old one
          jQuery('#pipelines').bind(
              'slide',
              function() {
                // reset to default
                jQuery('#plugin_cancel').click();
                // update UI
                var _old_plugin_id = jQuery(".carousel-inner").children(
                    '.active').attr('id');
                // by hiding the old plugin
                jQuery('#panel_' + _old_plugin_id).hide();
                // clean up after interactive plugin
                _PLUGIN_.cleanInteractiveLayout();
              });
          // the new one
          jQuery('#pipelines').bind(
              'slid',
              function() {
                // update UI
                var _new_plugin_id = jQuery(".carousel-inner").children(
                    '.active').attr('id');
                // by showing the new plugin
                jQuery('#panel_' + _new_plugin_id).show();
                // now reset all jobs
                _BATCH_.reset();
                // update drop down
                $("#cart_categories").select2("val", _new_plugin_id);
              });
          jQuery(".parameter_dropzone").droppable({
            activeClass : "parameter_dropzone_active",
            hoverClass : "parameter_dropzone_hover",
            tolerance : "pointer",
            accept : ":not(.ui-sortable-helper)",
            activate : function(event, ui) {
              if (!jQuery(this).is(":visible")) {
                return;
              }
              var _dropzone_field = jQuery(this);
              var _default_value = _dropzone_field.attr('data-default');
              var _current_value = jQuery.trim(_dropzone_field.html());
              if (_default_value == _current_value) {
                // nothing was dropped here before
              } else {
                // something was already dropped, so show the
                // parameter_batchdrop
                _PLUGIN_.showBatchDrop();
              }
            },
            deactivate : function(event, ui) {
              _PLUGIN_.hideBatchDrop();
            },
            drop : _BATCH_.drop
          });
          jQuery('#plugin_cancel').on(
              'click',
              function(e) {
                // reset all parameters to default values
                // prevent scrolling up
                e.preventDefault();
                // grab the visible plugin panel
                var _visible_panel = jQuery('.plugin_panel:visible');
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
                  // double spinners
                  _spinner = jQuery(_parameter_rows[i]).find(
                      '.parameter_spinner_double');
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
                  // comboboxes
                  var _combobox = jQuery(_parameter_rows[i]).find(
                      '.parameter_combobox');
                  _default_value = _combobox.attr('data-default');
                  _combobox.val(_default_value);
                });
                // reset all jobs
                _BATCH_.reset();
              });
          $(document).on(
              'click',
              '#plugin_submit',
              function(e) {
                // fire it up!!
                // prevent scrolling up
                e.preventDefault();
                if (jQuery(this).hasClass('disabled')) {
                  return;
                }
                // grab the visible plugin panel
                var _visible_panel = jQuery('.plugin_panel:visible');
                var _plugin_name = _visible_panel.attr('id').replace(
                    'panel_', '');
                var _parameter_rows = _visible_panel.find('.parameter_row');
                var _output_rows = _visible_panel.find('.output_row');
                var _jobs = [];
                var _jobsOutputs = [];
                var _numberOfJobs = _BATCH_.jobs.length;
                if (_numberOfJobs == 0) {
                  // maybe no dropzones present
                  _numberOfJobs = 1;
                }
                for ( var j = 0; j < _numberOfJobs; ++j) {
                  var _parameters = [];
                  var _outputs = [];
                  if (_BATCH_.jobs.length > 0) {
                    var job = _BATCH_.jobs[j];
                    // grab all input dropzones
                    for (flag in job) {
                      var fullpath = job[flag]._fullpath;
                      // strip possible --
                      flag = flag.replace(/-/g, '');
                      _parameters.push({
                        name : flag,
                        value : fullpath,
                        type : 'dropzone',
                        target_type : 'feed'
                      });
                    }
                  }
                  // loop through all output rows
                  _output_rows.each(function(i) {
                    var _parameter_output = jQuery(_output_rows[i]).find(
                        '.parameter_output');
                    var _flag = _parameter_output.attr('data-flag');
                    var _type = _parameter_output.attr('data-type');
                    var _output = null;
                    // strip possible --
                    _flag = _flag.replace(/-/g, '');
                    var _filename = '';
                    if (_flag == "") {
                      _filename = "output";
                    } else {
                      _filename = _flag;
                    }
                    var _value;
                    if (_type == 'directory') {
                      _value = '';
                    } else if (_type == 'image') {
                      _value = _filename + '.nii';
                    } else if (_type == 'file') {
                      _value = _filename + '.file';
                    } else if (_type == 'transform') {
                      _value = _filename + '.mat';
                    }
                    // push the output
                    _outputs.push({
                      name : _flag,
                      value : _value,
                      type : 'simple',
                      target_type : 'feed'
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
                      // we already took care of dropzones
                      // but we have to reset all flags which are indices
                      var _index = _parameter_input.attr('data-index');
                      if (_index) {
                        for (_p in _parameters) {
                          _p = _parameters[_p];
                          if (_p.name == _index) {
                            // found parameter which is actually an index
                            // so reset the name
                            _p.name = '';
                          }
                        }
                      }
                      return;
                    } else if (_type == 'spinner') {
                      // spinners
                      var _spinner = jQuery(_parameter_rows[i]).find(
                          '.parameter_spinner');
                      _value = jQuery(_spinner).spinner("value");
                    } else if (_type == 'spinner_double') {
                      // spinners
                      var _spinner = jQuery(_parameter_rows[i]).find(
                          '.parameter_spinner_double');
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
                      // return parameter if string is not empty
                      if (text_input.val() != "") {
                        _value = '\\\"' + text_input.val() + '\\\"';
                      } else {
                        return;
                      }
                    } else if (_type == 'combobox') {
                      // comboboxes
                      var _combobox = jQuery(_parameter_rows[i]).find(
                          '.parameter_combobox');
                      _value = jQuery(_combobox).val();
                    }
                    // push the parameter
                    _parameters.push({
                      name : _flag,
                      value : _value,
                      type : _type,
                      target_type : 'feed'
                    });
                  });
                  _jobs.push(_parameters);
                  _jobsOutputs.push(_outputs);
                }
                // check if this plugin has a predefined status
                var _status = 0;
                var _definedStatus = jQuery(_visible_panel[0]).attr(
                    'data-status');
                if (_definedStatus) {
                  _status = _definedStatus;
                }
                // check if this plugin has a predefined memory
                var _memory = 0;
                var _definedMemory = jQuery(_visible_panel[0]).attr(
                    'data-memory');
                if (_definedMemory) {
                  _memory = _definedMemory;
                }
                jQuery('#plugin_submit_play').hide();
                jQuery('#plugin_submit_wait').show();
                jQuery(this).addClass('disabled');
                var now = new Date();
                var month = now.getMonth() + 1;
                var _feed_name =  month + "-" + now.getDate() + "-" + now.getFullYear() + " " 
               + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
                // if interactive plugin calling, give control to the plugin
                // and return before launching
                // if namespace doesnt exist or force false
                var _definedInteractive = jQuery(_visible_panel[0])
                    .attr('data-interactive');
                if (_definedInteractive != "") {
                  var _parameters = _PLUGIN_.submitInteractive(_plugin_name,
                      _jobs);
                  if (_parameters == null) {
                    return;
                  } else {
                    _jobs = _parameters;
                  }
                }
                // send to the launcher
                jQuery.ajax({
                  type : "POST",
                  url : "controller/launcher-web.php",
                  dataType : "text",
                  data : {
                    FEED_PLUGIN : _plugin_name,
                    FEED_NAME : _feed_name,
                    FEED_PARAM : _jobs,
                    FEED_STATUS : _status,
                    FEED_MEMORY : _memory,
                    FEED_OUTPUT : _jobsOutputs
                  },
                  success : function(data) {
                    jQuery().toastmessage(
                        'showSuccessToast',
                        '<h5>Job started.</h5>' + 'Plugin: <b>' + _plugin_name
                            + '</b><br>' + 'Name: <b>' + _feed_name + '</b>');
                    jQuery('#plugin_submit').removeClass('disabled');
                    jQuery('#plugin_submit_wait').hide();
                    jQuery('#plugin_submit_play').show();
                    // if interactive plugin, we might want to cleanup the ui
                    if (_definedInteractive != ""
                        && typeof _CHRIS_INTERACTIVE_PLUGIN_ != 'undefined') {
                      _CHRIS_INTERACTIVE_PLUGIN_.submitted(data);
                    }
                  }
                });
              });
          jQuery('.panelgroup').multiAccordion({
            heightStyle : "content",
            animate : false,
            // collapse all panels by default (they later get shown again if
            // they are not advanced panels)
            active : 'none'
          });
          jQuery('.parameter_spinner').each(function(i, v) {
            var _container = jQuery(v);
            var _default_value = _container.attr('data-default');
            var _step = _container.attr('data-step');
            if (!_step) {
              _step = 1;
            }
            _container.spinner({
              step : _step,
              numberFormat : "n"
            });
            _container.spinner("value", _default_value);
          });
          jQuery('.parameter_spinner_double').each(function(i, v) {
            var _container = jQuery(v);
            var _default_value = _container.attr('data-default');
            var _step = _container.attr('data-step');
            if (!_step) {
              _step = 0.1;
            }
            _container.spinner({
              step : _step,
              numberFormat : "n"
            });
            _container.spinner("value", _default_value);
          });
          jQuery('.parameter_combobox').each(function(i, v) {
            var _container = jQuery(v);
            var _default_value = _container.attr('data-default');
            _container.val(_default_value);
          });
          // show non-advanced panels
          jQuery('.panelgroup')
              .each(
                  function(i, v) {
                    var _accordion = jQuery(v);
                    var _activeTabs = _accordion
                        .multiAccordion('getActiveTabs');
                    if ((_activeTabs.length == 1) && (_activeTabs[0] == -1)) {
                      // no tabs active yet
                      _activeTabs = [];
                    }
                    // grab the current panels of this accordion
                    jQuery(v).children('.panel_content')
                        .each(
                            function(j, w) {
                              // check if this is an advanced panel
                              var _advanced_panel = (jQuery(w).attr(
                                  'data-advanced') == 'true');
                              // check if this is an hidden panel
                              var _hidden_panel = (jQuery(w).attr(
                                  'hidden-panel') == 'true');
                              if (_hidden_panel) {
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
          jQuery('.parameter_string').each(function(i, v) {
            jQuery(v).html(jQuery(v).attr('data-default'));
          });
          // register keypress for string parameters
          jQuery('.parameter_string').keypress(
              function(e) {
                if (e.which == '13') {
                  // on return, adjust the size
                  jQuery(this).css(
                      'height',
                      parseInt(jQuery(this).css('height'), 10)
                          + parseInt(jQuery(this).css('line-height'), 10));
                }
              })
        });
