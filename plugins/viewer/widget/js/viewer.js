/**
 * This object takes care of all the visualization:
 *
 * FEATURES
 * - Give it a JSON file which represents the 'scene'
 * - Allows users to selects elements of the scene to be rendered
 * - Allows basic image processing (thresholding, Volume Rendering (VR), Fibers Length Thresholding, etc.)
 * - Expose some functions
 *
 * TECHNOLOGY
 * - XTK
 * - xdatgui.js
 * - SliceDrop clone
 */

// Declare (or re-declare) the single global variable
var viewer = viewer || {};


viewer.Viewer = function(jsonObj) {

  this.version = 0.0;
  //Parse the jason file  
  this.source = [
    { title: 'plugins', key : '1', folder : true,
      children : [
        { title: 'viewer', key : '2', folder : true,
          children : [
            { title: 'widget', key : '3', folder : true,
              children : [
              { title: 'data', key : '4', folder : true,
                children : [
                  { title: 'dicom', key : '5', folder : true,
                    children : [
                      { title: '0001-1.3.12.2.1107.5.2.32.35162.2012021516003275873755302_fullvol.dcm', 
                        key: '6',
                        type : 'volume', 
                        url  : 'plugins/viewer/widget/data/dicom/',
                        files : ['0001-1.3.12.2.1107.5.2.32.35162.2012021516003275873755302.dcm', 
                                 '0002-1.3.12.2.1107.5.2.32.35162.2012021516003288462855318.dcm',
                                 '0003-1.3.12.2.1107.5.2.32.35162.2012021516003360797655352.dcm',
                                 '0004-1.3.12.2.1107.5.2.32.35162.2012021516003411054655384.dcm',
                                 '0005-1.3.12.2.1107.5.2.32.35162.2012021516003465209455412.dcm']               
                      },        
                    ] 
                  },
                  { title: 'recon.nii', key: '7',
                    type : 'volume', 
                    url  : 'plugins/viewer/widget/data/',
                    files : ['recon.nii']
                  }, 
                  { title: 'tact.trk', key: '8',
                    type : 'fibers', 
                    url  : 'plugins/viewer/widget/data/',
                    files : ['tact.trk']
                  }, 
                  { title: 'lh.pial', key: '9',
                    type : 'mesh', 
                    url  : 'plugins/viewer/widget/data/',
                    files : ['lh.pial']
                  }, 
                  { title: 'rh.pial', key: '10',
                    type : 'mesh', 
                    url  : 'plugins/viewer/widget/data/',
                    files : ['rh.pial']
                  }
                ]
              }
             ]
           }
         ]
       }
      ]
    }
  ];
  
  //rendered volume 
  this.volume = new X.volume();
  //no source file loaded yet, so key is initialized to 
  //a special value
  this.volume.key = -1;

  //rendered geometric models (eg. fibers and meshes) 
  this.geomModels = [];

  //file selection widget
  this.fileSelectWidget = null;
  this.createFileSelectTree('tree');

  // volume GUI widget
  this.volWidget = null;

  // try to create and initialize a 3D renderer
  this._webGLFriendly = true;
  try {
    this.create3DRenderer('33d');
  } catch (Exception) { 
    this._webGLFriendly = false;
  }
  // create the 2D renderers for the X, Y, Z orientations
  this.create2DRenderer('sliceXX', 'X');
  this.create2DRenderer('sliceYY', 'Y');
  this.create2DRenderer('sliceZZ', 'Z');

  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  var self = this;
  this.sliceXX.onShowtime = function() {
    // add the volume to the other 3 renderers
    self.sliceYY.add(self.volume);
    self.sliceYY.render(); 
    self.sliceZZ.add(self.volume);
    self.sliceZZ.render();
    if (self._webGLFriendly) {
      self['33d'].add(self.volume);
      // .. and start the loading and rendering!
      self['33d'].camera.position = [0, 0, 200];
      self['33d'].render();
    } 
    // now the volume GUI widget
    self.setVolWidget('xcontroller');
  };

  /*//Event handler for render button
  document.getElementById("renderbutton").addEventListener('click', function() {
    self.render();});*/
}


viewer.Viewer.prototype.create3DRenderer = function(container) {
  this[container] = new X.renderer3D();
  this[container].bgColor = [.1, .1, .1];
  this[container].container = container;
  this[container].init();
  // the volume and geometric models are not in the same space, so
  // we configure some transforms in the onShowtime method which gets executed
  // after all files were fully loaded and just before the first rendering
  // attempt
  this[container].onShowtime = function() {
  // we reset the bounding box so track and mesh are in the same space
    this.resetBoundingBox();
  };
}


viewer.Viewer.prototype.create2DRenderer = function(container, orientation) {
  this[container] = new X.renderer2D();
  this[container].container = container;
  this[container].orientation = orientation;
  this[container].init();
}


viewer.Viewer.prototype.createFileSelectTree = function(container) {
  var self = this;

  this.fileSelectTree = $('#' + container).fancytree({
    checkbox: true,
    source: this.source,
    select: function(event, data) {
      var node = data.node;
      if (node.data.type == 'volume') {
        self.setVolume(node);
      } else {
        self.addGeomModel(node);
      };
    }
  });
}


viewer.Viewer.prototype.setVolume = function(nodeObj) {
  var orderedFiles, files, url;

  if (nodeObj.key != this.volume.key) {
    if (this._webGLFriendly) {
      this['33d'].remove(this.volume);
    }
    url = nodeObj.data.url;
    // for the dicom format, files is a list of strings 
    // for other formats it's a list with just a single string 
    files = nodeObj.data.files;
    orderedFiles = files.sort().map(function(str) { 
    return url + str;});
    // attach the single-file dicom in .NRRD format
    // this works with gzip/gz/raw encoded NRRD files but XTK also supports other
    // formats like MGH/MGZ
    this.volume.file = orderedFiles;
    this.volume.key = nodeObj.key;
    //if (!this.sliceXX.get(this.volume.id)){ }
    this.sliceXX.add(this.volume); 
    // start the loading/rendering
    this.sliceXX.render();
  }
}


viewer.Viewer.prototype.addGeomModel = function(nodeObj) {
  var xtkObj; 

  if (this._webGLFriendly && (this.indexOfGeomModel(nodeObj.key) == -1)) {
    xtkObj = new X[nodeObj.data.type]();
    xtkObj.file = nodeObj.data.url + nodeObj.data.files;
    xtkObj.key = nodeObj.key;
    this.geomModels.push(xtkObj);
    this['33d'].add(xtkObj);
    this['33d'].camera.position = [0, 0, 200];
    this['33d'].render();
  }
}


viewer.Viewer.prototype.remGeomModel = function(key) {
  var ix = indexOfGeomModel(key);

  if (ix != -1) {
    this['33d'].remove(this.geomModels[ix]);
    this.geomModels.splice(ix,1);
  }
}


viewer.Viewer.prototype.indexOfGeomModel = function(key) {
  var found = false;

  if (this.geomModels) {
    for (var i = 0; i < this.geomModels.length; i++) {
      if (this.geomModels[i].key == key) {
        return i;
     }
    }
  }
  if (!found) {
    return -1;
  }
}


viewer.Viewer.prototype.onThreshold = function() {

  window.console.log('Lets threshold!');
  //this.threeDRenderer 

}


viewer.Viewer.prototype.setVolWidget = function(container) {
  if (!this.volWidget) {
    var gui = new dat.GUI({ autoPlace: false });
    var customContainer = document.getElementById(container);
    customContainer.appendChild(gui.domElement);
    // $('.interactive_plugin_content').css("background-color", "#000");
    // the following configures the gui for interacting with the X.volume
    this.volWidget = gui.addFolder('Volume');
  } else {
    this.volWidget.remove(this.volWidget.vrCtrl);
    this.volWidget.remove(this.volWidget.opacityCtrl);
    this.volWidget.remove(this.volWidget.lowThCtrl);
    this.volWidget.remove(this.volWidget.upThCtrl);
    this.volWidget.remove(this.volWidget.lowWinCtrl);
    this.volWidget.remove(this.volWidget.upWinCtrl);
    this.volWidget.remove(this.volWidget.sliceXCtrl);
    this.volWidget.remove(this.volWidget.sliceYCtrl);
    this.volWidget.remove(this.volWidget.sliceZCtrl);
  }
    // now we can configure controllers which..
    // .. switch between slicing and volume rendering
    this.volWidget.vrCtrl = this.volWidget.add(this.volume, 'volumeRendering');
    // .. configure the volume rendering opacity
    this.volWidget.opacityCtrl = this.volWidget.add(this.volume, 'opacity', 0, 1);
    // .. and the threshold in the min..max range
    this.volWidget.lowThCtrl = this.volWidget.add(this.volume, 'lowerThreshold', this.volume.min, this.volume.max);
    this.volWidget.upThCtrl = this.volWidget.add(this.volume, 'upperThreshold', this.volume.min, this.volume.max);
    this.volWidget.lowWinCtrl = this.volWidget.add(this.volume, 'windowLow', this.volume.min, this.volume.max);
    this.volWidget.upWinCtrl = this.volWidget.add(this.volume, 'windowHigh', this.volume.min, this.volume.max);
    // the indexX,Y,Z are the currently displayed slice indices in the range
    // 0..dimensions-1
    this.volWidget.sliceXCtrl = this.volWidget.add(this.volume, 'indexX', 0, this.volume.dimensions[0] - 1);
    this.volWidget.sliceYCtrl = this.volWidget.add(this.volume, 'indexY', 0, this.volume.dimensions[1] - 1);
    this.volWidget.sliceZCtrl = this.volWidget.add(this.volume, 'indexZ', 0, this.volume.dimensions[2] - 1);
    this.volWidget.open();
}


  /*   { title : '0001-1.3.12.2.1107.5.2.32.35162.2012021516003275873755302.dcm'
        url   : 'plugins/viewer/widget/data/dicom/',
        files : ['0001-1.3.12.2.1107.5.2.32.35162.2012021516003275873755302.dcm', 
                 '0002-1.3.12.2.1107.5.2.32.35162.2012021516003288462855318.dcm',
                 '0003-1.3.12.2.1107.5.2.32.35162.2012021516003360797655352.dcm',
                 '0004-1.3.12.2.1107.5.2.32.35162.2012021516003411054655384.dcm',
                 '0005-1.3.12.2.1107.5.2.32.35162.2012021516003465209455412.dcm'] }, 
      { url   : 'plugins/viewer/widget/data/', 
        files : ['recon.nii'] } ],
    fibers  : [
      { url   : 'plugins/viewer/widget/data/',
        files : ['tact.trk'] } ],
    models : [      
      { url   : 'plugins/viewer/widget/data/',
        files : ['lh.pial'] }, 
      { url   : 'plugins/viewer/widget/data/',
        files : ['rh.pial'] } ]; */


viewer.Viewer.prototype.viewChanged = function(arr){
    window.console.log('emit view changed');
}

// viewer.Viewer.prototype.viewEmitChanged = function(arr){
//     window.console.log('emit view changed');
//     self.viewChanged(viewM);
// }

viewer.Viewer.prototype.onViewChanged = function(arr){
    window.console.log('update view in view');
    window.console.log(this);
    this.threeD.camera.view = new Float32Array(arr);
}

viewer.Viewer.prototype.onTouchStart = function(){
    var self = this;
    _CHRIS_INTERACTIVE_PLUGIN_._updater = setInterval(function(){
            self.viewChanged(self.threeD.camera.view);
        }, 150);
}

viewer.Viewer.prototype.onTouchEnd = function(){
    clearInterval(_CHRIS_INTERACTIVE_PLUGIN_._updater);
}
