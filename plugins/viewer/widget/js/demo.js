/**
 *
 * Entry point of the Viewer interactive plugin
 * Jquery, Select2 and Boostrap are provided by default
 * (since they are already part of ChRIS)
 *
 */

/**
 * (re) Define namespace if needed
 */
var _CHRIS_INTERACTIVE_PLUGIN_ = _CHRIS_INTERACTIVE_PLUGIN_ || {};

/**
 * Helper function to get a parameter's value from container
 */
_CHRIS_INTERACTIVE_PLUGIN_.getParam = function(parameter) {
    if (typeof _CHRIS_INTERACTIVE_PLUGIN_._param[parameter] != 'undefined') {
        if(_CHRIS_INTERACTIVE_PLUGIN_._param[parameter] == "")
            return '1';

        return _CHRIS_INTERACTIVE_PLUGIN_._param[parameter];
    }

    return "";
};

/**
 * Helper function to get a parameter's index from container
 */
_CHRIS_INTERACTIVE_PLUGIN_.getInd = function(parameter) {
    if (typeof _CHRIS_INTERACTIVE_PLUGIN_._param[parameter] != 'undefined')
        return _CHRIS_INTERACTIVE_PLUGIN_._param_ind[parameter];
  
    return -1;
};


/**
 * Callback function which is called when a plugin has been submitte
d * It doesn't tell us if the plugin is queued/finished
 */
_CHRIS_INTERACTIVE_PLUGIN_.submitted = function(data) {
    var res = data.match(/\d+/g);
    _CHRIS_INTERACTIVE_PLUGIN_.create(res[0]);
    // MIGHT NEED TO INTRODUCE TYPE AS WELL
    _CHRIS_INTERACTIVE_PLUGIN_.getJSON(feedId, directory);
}

/**
 * Callback function which is called when an interactive plugin has been closed
 * This a good place to clean up all the interactive plugin's mess
 */
_CHRIS_INTERACTIVE_PLUGIN_.destroy = function(data) {

    if(typeof(collaborator) != 'undefined' && collaborator != null){
        collaborator.destroy();
        collaborator = null;
    }

    if(typeof(view) != 'undefined' && view != null){
        //viewer.destroy();
        //view = null;
    }
  }

/**
 * Create the base objects of the interactive plugin
 * Sets up all the connection
 *
 * feedID is important to create the common room for collaboration
 */
_CHRIS_INTERACTIVE_PLUGIN_.create = function(feedID, data) {

    // create collab object
    if(typeof(collaborator) == 'undefined' || collaborator == null){
        collaborator = new collab.Collab(feedID);
    }

    window.console.log(data);
    // create viewer object
    if(typeof(view) == 'undefined' || view == null){
        view = new viewer.Viewer(data);
    }

    // (re)connect events
    collaborator.onViewChanged = function(test){view.onViewChanged(test);};
    view.viewChanged = function(view){collaborator.viewChanged(view);};

}

/**
 * Helper function to get JSON data from a directory
 * If feedID is not empty (!= ''), we read JSON from chris.json
 * If feedID is empty, we generate JSON from current directory, recursivly
 *
 * On success, append JSON to current View Object
 */
_CHRIS_INTERACTIVE_PLUGIN_.getJSON = function(feedId, directory){
    // ajax find matching directory!
    jQuery.ajax({
        async: "false",
        type : "POST",
        url : "plugins/viewer/core/findJSON.php",
        dataType : "json",
        data : {
            FEED_ID : feedId,
            DIRECTORY: directory
        },
        success : function(data){
          var jsonObj = JSON.parse( data );
          var tree = _CHRIS_INTERACTIVE_PLUGIN_.formatData(jsonObj);
          _CHRIS_INTERACTIVE_PLUGIN_.create(feedId, tree);
        }
    });
}

_CHRIS_INTERACTIVE_PLUGIN_.formatData = function(dataObj){

    var tree = [];

    // Loop though models, fibers and volumes 
    for (var type in dataObj) {
       var typeArr = dataObj[type];

       // loop though all obj of a same type
       for (var i=0; i < typeArr.length; i++){
        _CHRIS_INTERACTIVE_PLUGIN_.addToTree(tree, typeArr[i], type);
       }
    }

    return tree;

}

_CHRIS_INTERACTIVE_PLUGIN_.addToTree = function(tree, obj, type){

    return _CHRIS_INTERACTIVE_PLUGIN_.parseTree(tree, obj, 0, type, obj.url, [], '');

}

_CHRIS_INTERACTIVE_PLUGIN_.parseTree = function(subtree, obj, depth, type, url, files, key){

    // get current location
    var relPath = url.split('..');
    var path = relPath[1].split('/');
    path.shift();

    if(depth >= path.length){
        // loop through tree and look for 'title' match
        var indexSubTree = -1;

        for (var i=0; i < subtree.length; i++){
            if(subtree[i].title == obj.title){
                indexSubTree = i;
                break;
            }
        }

        if(indexSubTree == -1){

            indexSubTree = subtree.length;
            subtree.push(_CHRIS_INTERACTIVE_PLUGIN_.createTreeFile(obj.file[0], type, obj.url, obj.file, key + indexSubTree.toString()));

        }

        return;
    }


    // subtree is not there, create it 
    var indexSubTree = -1;

    // loop through tree and look for 'title' match
    for (var i=0; i < subtree.length; i++){
        if(subtree[i].title == path[depth]){
            indexSubTree = i;
            break;
        }
    }

    // we push object to children
    if(indexSubTree == -1){

        indexSubTree = subtree.length;
        key = key.toString() + subtree.length.toString();

        subtree.push({ 'title': path[depth],
                       'key': key,
                       'folder': true,
                       'hideCheckbox' : true,    
                       'children': []
                    });

    }
    else{

        key = subtree[indexSubTree].key;

    }

    _CHRIS_INTERACTIVE_PLUGIN_.parseTree(subtree[indexSubTree].children, obj, depth + 1, type, url, files, key);
}

_CHRIS_INTERACTIVE_PLUGIN_.createTreeFile = function(title, type, url, files, key){

    return { 'title': title,
             'key': key,
             'type' : type, 
             'url'  : url,
             'files' : files
            };
}

/**
 * Callback function which is called when an interactive plugin has been loaded
 * This is the JS entry-point of our interactive plugin
 */
_CHRIS_INTERACTIVE_PLUGIN_.init = function() {

    var feedId = _CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid");
    var directory = _CHRIS_INTERACTIVE_PLUGIN_.getParam("directory");
    var links = _CHRIS_INTERACTIVE_PLUGIN_.getParam("links");
    var feedId = _CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid");

    if(feedId != ''){
        // USE CASE:
        // * click on 'view' a feed
        // DO:
        // * DESTROY the scene and the collaboration
        // * CREATE scene and collaboration

        _CHRIS_INTERACTIVE_PLUGIN_.destroy();
        //_CHRIS_INTERACTIVE_PLUGIN_.create(feedId);

        // MIGHT NEED TO INTRODUCE TYPE AS WELL
        _CHRIS_INTERACTIVE_PLUGIN_.getJSON(feedId, directory);

        return;
    }
    else if(directory != '' && links == false){
        // USE CASE:
        // * click on 'view' inside a feed's file browser
        // DO:
        // * CREATE new scene if needed
        // * UPDATE the scene and the collaboration

        // We might have to create a scene/collab - id -1
        //_CHRIS_INTERACTIVE_PLUGIN_.create(-1);
        // MIGHT NEED TO INTRODUCE TYPE AS WELL
        _CHRIS_INTERACTIVE_PLUGIN_.getJSON(feedId, directory);

        return;
    }
    else if(directory != '' && links == true){
        // USE CASE: 
        // * start viewer from Plugin UI
        // * save current scene (which can contain elements from N feeds)
        // DO:
        // * DESTROY the scene and the collaboration
        // * CREATE feed
        // * CREATE scene and collaboration

        //_CHRIS_INTERACTIVE_PLUGIN_.destroy();
        // create new feed
        _CHRIS_INTERACTIVE_PLUGIN_.force = true;
        $("#plugin_submit").click();

        return;
    }

    window.console.log('Ouups... Something went wrong during the initializaton. ');
}