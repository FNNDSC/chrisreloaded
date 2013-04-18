// setup namespace
var _CHRIS_INTERACTIVE_PLUGIN_ = _CHRIS_INTERACTIVE_PLUGIN_ || {};
// store values for convenience - interactive
_CHRIS_INTERACTIVE_PLUGIN_._param = {};
// store indices for convenience CLI
_CHRIS_INTERACTIVE_PLUGIN_._param_ind = {};
// store original parameters
_CHRIS_INTERACTIVE_PLUGIN_._parameters = null;
// store force flag
_CHRIS_INTERACTIVE_PLUGIN_.force = false;
// attach chris interactive plugin helper methods
// given an object, create the associated variable
_CHRIS_INTERACTIVE_PLUGIN_.parameters = function(_iparameters) {
  if (typeof _iparameters != 'undefined') {
    // clean local parameters
    for ( var key in _CHRIS_INTERACTIVE_PLUGIN_._param) {
      _CHRIS_INTERACTIVE_PLUGIN_._param[key] = "";
    }
    for ( var key in _CHRIS_INTERACTIVE_PLUGIN_._param_ind) {
      _CHRIS_INTERACTIVE_PLUGIN_._param_ind[key] = -1;
    }
    // copy new parameters
    _CHRIS_INTERACTIVE_PLUGIN_._parameters = _iparameters;
    for ( var i = 0; i < _iparameters[0].length; i++) {
      // store values
      if (_iparameters[0][i].type == "string") {
        // unescape strings (2 firsts 2 lasts)
        _CHRIS_INTERACTIVE_PLUGIN_._param[_iparameters[0][i].name] = _iparameters[0][i].value
            .substr(2, _iparameters[0][i].value.length - 4);
      } else {
        _CHRIS_INTERACTIVE_PLUGIN_._param[_iparameters[0][i].name] = _iparameters[0][i].value;
      }
      // store indices
      _CHRIS_INTERACTIVE_PLUGIN_._param_ind[_iparameters[0][i].name] = i;
    }
  } else {
    return _CHRIS_INTERACTIVE_PLUGIN_._parameters;
  }
};
// initialize plugin
// called when clik on "plugin_submit", after parameters are passed
_CHRIS_INTERACTIVE_PLUGIN_.init = function() {
};
//destroy plugin
// if one want to unbind events, etc.
//called before destroying namespace and layout
_CHRIS_INTERACTIVE_PLUGIN_.destroy = function() {
};
// call one CLI job has been successfully submitted
_CHRIS_INTERACTIVE_PLUGIN_.submitted = function() {
};