/**
 * Define the _BATCH_ namespace
 */
var _BATCH_ = _BATCH_ || {};

_BATCH_.current = -1;

_BATCH_.jobs = [];

_BATCH_.add = function(flag, p, newjob) {

  if (newjob || _BATCH_.jobs.length == 0) {
    
    _BATCH_.emptyDropzones();
    
//    _BATCH_.jobs.push({});
//    _BATCH_.current++;
    
    _BATCH_.jobs.splice(++_BATCH_.current,0,{});
    
  }
  
  _BATCH_.show(flag, p);
  
  _BATCH_.jobs[_BATCH_.current][flag] = p;
  
  _BATCH_.updateMenu();
  
};

_BATCH_.drop = function(event, ui) {

  // grab the data name dom element
  var _data_name = ui.draggable;
  
  var _file_browser = null;
  var _full_path = null;
  
  if (jQuery(_data_name[0]).hasClass('feed_icon')) {
    abceef = jQuery(_data_name[0]);
    // a feed icon was dropped
    var _feed_content = jQuery(_data_name[0]).closest('.feed');
    _file_browser = jQuery(_feed_content).find('.file_browser');
    _full_path = _file_browser.attr('data-folder');
    
  } else {
    
    // a file browser entry was dropped
    _file_browser = _data_name.closest('.file_browser');
    _full_path = _data_name.attr('rel');
    
  }
  
  // now we can grab the MRN
  var _mrn = _file_browser.attr('data-patient-id');
  
  // and the data id
  var _data_id = _file_browser.attr('data-id');
  
  var _parameter = new _BATCH_.parameter(_mrn, jQuery.trim(_data_name.text()),
      _data_id, _full_path);
  
  var _flag = jQuery(this).attr('data-flag');
  
  if (_flag == '') {
    // if flag is not set, we must have an index
    _flag = jQuery(this).attr('data-index');
  }
  
  _BATCH_.add(_flag, _parameter, jQuery(this)
      .hasClass('parameter_batchdrop'));
};

_BATCH_.show = function(flag, p) {

  // and create a new representation
  var _new_span = jQuery('<span></span>');
  //_new_span.html('<b>MRN ' + p._mrn + '</b> ' + p._label);
  _new_span.html('<b>'+p._fullpath.split('/').filter(function(v) { return v.length>0; }).pop()+'</b>');
  _new_span.attr('data-patient-id', p._mrn);
  _new_span.attr('data-id', p._id);
  _new_span.attr('data-full-path', p._fullpath);
  
  // .. show it
  var _container = jQuery(".parameter_dropzone").filter(
      "[data-flag=" + flag + "]").filter(':visible');
  
  if (_container.length == 0) {
    // we must have passed an index
    _container = jQuery(".parameter_dropzone").filter(
        "[data-index=" + flag + "]").filter(':visible');    
  }
  
  _container.empty();
  _container.append(_new_span);
  
};

_BATCH_.updateMenu = function() {

  // grab the visible plugin panel
  var _visible_panel = jQuery('.plugin_panel :visible');
  var _plugin_name = _visible_panel.parent().attr('id').replace('panel_', '');
  
  if (_BATCH_.jobs.length < 2) {
    jQuery('#batch_' + _plugin_name).empty();
  } else {
    jQuery('#batch_' + _plugin_name)
        .html(
            '<i class="batchicon icon-arrow-left" onclick="_BATCH_.down()"></i>' +
                (_BATCH_.current + 1) +
                '/' +
                _BATCH_.jobs.length +
                '<i class="batchicon icon-arrow-right" onclick="_BATCH_.up()"></i>&nbsp;&nbsp;&nbsp;&nbsp;<i class="batchicon icon-remove-circle" rel="bottom_tooltip" title="Remove current job" onclick="_BATCH_.remove()"></i>');
  }
  
};

_BATCH_.reset = function() {

  _BATCH_.current = -1;
  _BATCH_.jobs = [];
  
  _BATCH_.updateMenu();
  
}

_BATCH_.emptyDropzones = function() {
  // reset all dropzones
  _parameter_rows = jQuery('.parameter_row');
  
  // loop through all parameter rows
  _parameter_rows.each(function(i) {

    // and restore all inputs to the default values
    
    // dropzones
    var _dropzone_field = jQuery(_parameter_rows[i]).find(
        '.parameter_dropzone');
    var _default_value = _dropzone_field.attr('data-default');
    _dropzone_field.html(_default_value);
    
  });
};

_BATCH_.down = function() {
  
  // empty the dropzones
  _BATCH_.emptyDropzones();
  
  _BATCH_.current--;
  
  if (_BATCH_.current < 0) {
    _BATCH_.current = _BATCH_.jobs.length-1;
  }
  
  // propagate stored values to dropzones
  for (flag in _BATCH_.jobs[_BATCH_.current]) {
    
    _BATCH_.show(flag, _BATCH_.jobs[_BATCH_.current][flag]);
    
  }
  
  _BATCH_.updateMenu();
  
};

_BATCH_.up = function() {
  
  // empty the dropzones
  _BATCH_.emptyDropzones();
  
  _BATCH_.current++;
  
  if (_BATCH_.current >= _BATCH_.jobs.length) {
    _BATCH_.current = 0;
  }
  
  // propagate stored values to dropzones
  for (flag in _BATCH_.jobs[_BATCH_.current]) {
    
    _BATCH_.show(flag, _BATCH_.jobs[_BATCH_.current][flag]);
    
  }
  
  _BATCH_.updateMenu();
  
};

_BATCH_.remove = function() {
  
  _BATCH_.jobs.splice(_BATCH_.current, 1);
  
  _BATCH_.up();
  
};

// parameter information
_BATCH_.parameter = function(mrn, label, id, fullpath) {

  this._mrn = mrn;
  this._label = label;
  this._id = id;
  this._fullpath = fullpath;
  
}
