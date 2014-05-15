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
    //
    //_CHRIS_INTERACTIVE_PLUGIN_.getJSON(res[0]);
}

_CHRIS_INTERACTIVE_PLUGIN_.destroy = function(data) {

    if(typeof(collab) != 'undefined' && collab != null){
        //collab.destroy();
        collab = null;
    }

    if(typeof(viewer) != 'undefined' && viewer != null){
        //viewer.destroy();
        viewer = null;
    }

    // stop timeout if any
}

// when the html is loaded, we get the parameters from the plugin parameters
_CHRIS_INTERACTIVE_PLUGIN_.init = function() {

    var feedId = _CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid");
    var directory = _CHRIS_INTERACTIVE_PLUGIN_.getParam("directory");
    var links = _CHRIS_INTERACTIVE_PLUGIN_.getParam("links");
    var feedId = _CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid");

  // IF THERE IS AN ID, make sure to cleanup the scene and the collaboration
  if(feedId != ''){
    window.console.log('new visu + no new feed');
    _CHRIS_INTERACTIVE_PLUGIN_.destroy();

    // MIGHT NEED TO INTRODUCE TYPE AS WELL
    _CHRIS_INTERACTIVE_PLUGIN_.getJSON(feedId, directory);
    return;
  }
  else if(directory != '' && links == false){
    window.console.log('same visu + new JSON');
    // get more json from the directory and view it!
    // MIGHT NEED TO INTRODUCE TYPE AS WELL
    _CHRIS_INTERACTIVE_PLUGIN_.getJSON(feedId, directory);
    return;
  }
  else if(directory != '' && links == true){
    window.console.log('new visu + new feed');
    _CHRIS_INTERACTIVE_PLUGIN_.destroy();

    // create new feed
    // _CHRIS_INTERACTIVE_PLUGIN_.force = true;
    // $("#plugin_submit").click();
    return;
  }

  window.console.log('Ouups... Something went wrong during the initializaton. ');
  // if FEED_ID is not null, we just want to LOOK at the feed (it exists already)
  // Call ajax here
  // force it to start!

  // window.console.log('init: ' + _CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid"));


  //   if(_CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid") == ''){
  //       _CHRIS_INTERACTIVE_PLUGIN_.force = true;
  //       $("#plugin_submit").click();
  //   }
  //   else{
  //       _CHRIS_INTERACTIVE_PLUGIN_.getDB(_CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid"));
  //   }
}



_CHRIS_INTERACTIVE_PLUGIN_.getJSON = function(feedID, directory){
    // ajax find matching directory!
    jQuery.ajax({
        type : "POST",
        url : "plugins/viewer/core/findJSON.php",
        dataType : "json",
        data : {
            FEED_ID : feedID,
            DIRECTORY: directory
        },
        success : function(data) {
            window.console.log(data);
            _CHRIS_INTERACTIVE_PLUGIN_.startViewer(feedID, data);
        }
    });
}


_CHRIS_INTERACTIVE_PLUGIN_.startViewer = function(feedID, json){

    // create collab object
    // collab = new Collab(feedID);
    // close the connection on the chris Kill function

    // create viewer object
    view = new viewer.Viewer( json );
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