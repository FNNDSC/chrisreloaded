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
  if (typeof _CHRIS_INTERACTIVE_PLUGIN_._param[parameter] != 'undefined') {
    return _CHRIS_INTERACTIVE_PLUGIN_._param_ind[parameter];
  }
  return -1;
};

_CHRIS_INTERACTIVE_PLUGIN_.submitted = function(data) {
  window.console.log('submitted');
  var res = data.match(/\d+/g);
  _CHRIS_INTERACTIVE_PLUGIN_.getDB(res[0]);

}

// when the html is loaded, we get the parameters from the plugin parameters
_CHRIS_INTERACTIVE_PLUGIN_.init = function() {
  window.console.log('init');
  // if FEED_ID is not null, we just want to LOOK at the feed (it exists already)
  // Call ajax here
  // force it to start!
  if(_CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid") == ''){
    _CHRIS_INTERACTIVE_PLUGIN_.force = true;
    $("#plugin_submit").click();
  }
  else{
    window.console.log(_CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid"));
    _CHRIS_INTERACTIVE_PLUGIN_.getDB(_CHRIS_INTERACTIVE_PLUGIN_.getParam("feedid"));
  }
}

_CHRIS_INTERACTIVE_PLUGIN_.getDB = function(feedID){
    window.console.log('getDB');
  // ajax find matching directory!
  jQuery.ajax({
    type : "POST",
    url : "plugins/viewer/core/findDB.php",
    dataType : "text",
    data : {
      FEED_ID : feedID
      },
    success : function(data) {
      window.console.log('YAY AJAX');
      window.console.log(data);
      _CHRIS_INTERACTIVE_PLUGIN_.startXTK(feedID);
    }
  });
}

_CHRIS_INTERACTIVE_PLUGIN_.togetherjsYO = function(feedID, threeD){

  TogetherJSConfig_findRoom =  "chris" + feedID;

window.console.log(TogetherJSConfig_findRoom);

  TogetherJSConfig_on = {
    ready: function(){_CHRIS_INTERACTIVE_PLUGIN_.togetherjsTestYO(threeD);}
  };
}

_CHRIS_INTERACTIVE_PLUGIN_.onTouchStart = function(){
  window.console.log('Touch Start');

  _CHRIS_INTERACTIVE_PLUGIN_._updater = setInterval(function(){
                var myJsonString = JSON.stringify(threeD.camera.view);
                TogetherJS.send({type: "viewChanged", view:myJsonString});
              }
              , 150);
}

_CHRIS_INTERACTIVE_PLUGIN_.onTouchEnd = function(){

  window.console.log('TouchEnd');
  clearInterval(_CHRIS_INTERACTIVE_PLUGIN_._updater);
  
}

_CHRIS_INTERACTIVE_PLUGIN_.togetherjsTestYO = function(threeD){
  window.console.log('I am READY!');

  // to be stopped when view closed
  threeD.interactor.onTouchStart = threeD.interactor.onMouseDown = _CHRIS_INTERACTIVE_PLUGIN_.onTouchStart;
  threeD.interactor.onTouchEnd = threeD.interactor.onMouseUp = _CHRIS_INTERACTIVE_PLUGIN_.onTouchEnd;
 // ren3d.interactor.onMouseWheel = function(e) {
//       setInterval(function(threeD){
//         var myJsonString = JSON.stringify(threeD.camera.view);
// TogetherJS.send({type: "viewChanged", view:myJsonString});
// },1000,threeD);

      TogetherJS.hub.on("viewChanged", function (msg) {
        if (! msg.sameUrl) {
          return;
        }

        window.console.log(msg);
        var obj = JSON.parse(msg.view);
        var arr = $.map(obj, function(el) { return el; });
        threeD.camera.view = new Float32Array(arr);
      });

  //TogetherJS.send({type: "visibilityChange", isVisible: isVisible, element: element});
//TogetherJS.hub.on("visibilityChange", function (msg) {
//   var elementFinder = TogetherJS.require("elementFinder");
//   // If the element can't be found this will throw an exception:
//   var element = elementFinder.findElement(msg.element);
//   MyApp.changeVisibility(element, msg.isVisible);
// });
}

// _CHRIS_INTERACTIVE_PLUGIN_.RTpushCamera = function(renderer) {

//   var _current_view = Array.apply([], eval(renderer).camera.view);

//   if ( !arraysEqual(_current_view, RT._old_view) ) {

//     RT._link.trigger('client-camera-sync', {
//       'target' : renderer,
//       'value' : _current_view
//     });

//     RT._old_view = _current_view;

//   }

// };


_CHRIS_INTERACTIVE_PLUGIN_.startXTK = function(feedID){

  // try to create and initialize a 3D render
  threeD = new X.renderer3D();
  threeD.container = '33d';
  threeD.init();

  // configure room name based on feed ID
  window.console.log("XTK FEEDID: " + feedID);
  _CHRIS_INTERACTIVE_PLUGIN_.togetherjsYO(feedID, threeD);
  
  //
  // create the 2D renderers
  // .. for the X orientation
  sliceX = new X.renderer2D();
  sliceX.container = 'sliceXX';
  sliceX.orientation = 'X';
  sliceX.init();
  // .. for Y
  var sliceY = new X.renderer2D();
  sliceY.container = 'sliceYY';
  sliceY.orientation = 'Y';
  sliceY.init();
  // .. and for Z
  var sliceZ = new X.renderer2D();
  sliceZ.container = 'sliceZZ';
  sliceZ.orientation = 'Z';
  sliceZ.init();
  
  //
  // THE VOLUME DATA
  //
  // create a X.volume
  volume = new X.volume();
  // .. and attach the single-file dicom in .NRRD format
  // this works with gzip/gz/raw encoded NRRD files but XTK also supports other
  // formats like MGH/MGZ
  volume.file = 'plugins/viewer/widget/data/recon.nii';
  
  // add the volume in the main renderer
  // we choose the sliceX here, since this should work also on
  // non-webGL-friendly devices like Safari on iOS
  sliceX.add(volume);
  
  // start the loading/rendering
  sliceX.render();
  

  //
  // THE GUI
  //
  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  sliceX.onShowtime = function() {

    //
    // add the volume to the other 3 renderers
    //
    sliceY.add(volume);
    sliceY.render();
    sliceZ.add(volume);
    sliceZ.render();
    
    threeD.add(volume);
    threeD.render();
    
    // now the real GUI
    var gui = new dat.GUI({ autoPlace: false });
    var customContainer = document.getElementById('xcontroller');
    customContainer.appendChild(gui.domElement);

    $('.interactive_plugin_content').css("background-color", "#000");
    
    // the following configures the gui for interacting with the X.volume
    var volumegui = gui.addFolder('Volume');
    // now we can configure controllers which..
    // .. switch between slicing and volume rendering
    var vrController = volumegui.add(volume, 'volumeRendering');
    // .. configure the volume rendering opacity
    var opacityController = volumegui.add(volume, 'opacity', 0, 1);
    // .. and the threshold in the min..max range
    var lowerThresholdController = volumegui.add(volume, 'lowerThreshold',
        volume.min, volume.max);
    var upperThresholdController = volumegui.add(volume, 'upperThreshold',
        volume.min, volume.max);
    var lowerWindowController = volumegui.add(volume, 'windowLow', volume.min,
        volume.max);
    var upperWindowController = volumegui.add(volume, 'windowHigh', volume.min,
        volume.max);
    // the indexX,Y,Z are the currently displayed slice indices in the range
    // 0..dimensions-1
    var sliceXController = volumegui.add(volume, 'indexX', 0,
        volume.dimensions[0] - 1);
    var sliceYController = volumegui.add(volume, 'indexY', 0,
        volume.dimensions[1] - 1);
    var sliceZController = volumegui.add(volume, 'indexZ', 0,
        volume.dimensions[2] - 1);
    volumegui.open();

  };

}