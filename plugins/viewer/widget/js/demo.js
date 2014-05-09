// DEFINE NAMESPACE
var _CHRIS_INTERACTIVE_PLUGIN_ = _CHRIS_INTERACTIVE_PLUGIN_ || {};

// HELPERS


_CHRIS_INTERACTIVE_PLUGIN_.getParam = function(parameter) {
    if (typeof _CHRIS_INTERACTIVE_PLUGIN_._param[parameter] != 'undefined') {
        if(_CHRIS_INTERACTIVE_PLUGIN_._param[parameter] == "")
            return '1';

        return _CHRIS_INTERACTIVE_PLUGIN_._param[parameter];
    }

    return "";
};



_CHRIS_INTERACTIVE_PLUGIN_.getInd = function(parameter) {
    if (typeof _CHRIS_INTERACTIVE_PLUGIN_._param[parameter] != 'undefined')
        return _CHRIS_INTERACTIVE_PLUGIN_._param_ind[parameter];
  
    return -1;
};



_CHRIS_INTERACTIVE_PLUGIN_.submitted = function(data) {
    var res = data.match(/\d+/g);
    _CHRIS_INTERACTIVE_PLUGIN_.getDB(res[0]);
}




// when the html is loaded, we get the parameters from the plugin parameters
_CHRIS_INTERACTIVE_PLUGIN_.init = function() {
  // if FEED_ID is not null, we just want to LOOK at the feed (it exists already)
  // Call ajax here
  // force it to start!

  window.console.log('init: ' + _CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid"));


    if(_CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid") == ''){
        _CHRIS_INTERACTIVE_PLUGIN_.force = true;
        $("#plugin_submit").click();
    }
    else{
        _CHRIS_INTERACTIVE_PLUGIN_.getDB(_CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid"));
    }
}



_CHRIS_INTERACTIVE_PLUGIN_.getDB = function(feedID){
    // ajax find matching directory!
    jQuery.ajax({
        type : "POST",
        url : "plugins/viewer/core/findDB.php",
        dataType : "json",
        data : {
            FEED_ID : feedID
        },
        success : function(data) {
            _CHRIS_INTERACTIVE_PLUGIN_.startViewer(feedID, data);
        }
    });
}


_CHRIS_INTERACTIVE_PLUGIN_.startViewer = function(feedID, json){

    // create collab object
    collab = new Collab(feedID);
    // close the connection on the chris Kill function

    // create viewer object
    viewer = new Viewer();
    viewer.init(json);

    // hook them up!
    // needs an interface!
    // api: name, object
    // collab will do the conversion for you
    // viewer.onChange(name, obj) = collab.emit
    // collab.receive = viewer.update(name, object)

  //_CHRIS_INTERACTIVE_PLUGIN_.togetherjsYO(feedID, threeD);
  
  // configure room name based on feed ID
 // window.console.log("XTK FEEDID: " + feedID);
  
}