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
  //rendered fibers
  this.fibersList = [];
  //rendered meshes
  this.meshList = [];
  //file selection widget
  this.fileSelectWidget = null;
  this.volWidget = null;

  this.fileSelectTree = this.createFileSelectTree('tree');

  this.setVolume('plugins/viewer/widget/data/dicom/', ['0001-1.3.12.2.1107.5.2.32.35162.2012021516003275873755302.dcm', 
                                 '0002-1.3.12.2.1107.5.2.32.35162.2012021516003288462855318.dcm',
                                 '0003-1.3.12.2.1107.5.2.32.35162.2012021516003360797655352.dcm',
                                 '0004-1.3.12.2.1107.5.2.32.35162.2012021516003411054655384.dcm',
                                 '0005-1.3.12.2.1107.5.2.32.35162.2012021516003465209455412.dcm'] );
  //window.console.log('url: ' + json.fibers[0].url);
  this.addFibers('plugins/viewer/widget/data/', 'tact.trk');
  this.addMesh('plugins/viewer/widget/data/', 'lh.pial');
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
  //Event handler for render button
  self = this;
  document.getElementById("renderbutton").addEventListener('click', function() {
    self.render();});
}


viewer.Viewer.prototype.create3DRenderer = function(container) {
  this[container] = new X.renderer3D();
  this[container].bgColor = [.1, .1, .1];
  this[container].container = container;
  this[container].init();
}


viewer.Viewer.prototype.create2DRenderer = function(container, orientation) {
  this[container] = new X.renderer2D();
  this[container].container = container;
  this[container].orientation = orientation;
  this[container].init();
}


viewer.Viewer.prototype.render = function() {
  // Use a 2D renderer as the main renderer since this should work also on
  // non-webGL-friendly devices like Safari on iOS. Add the volume so it 
  // can be loaded and parsed
  this.sliceXX.add(this.volume);
  // start the loading/rendering
  this.sliceXX.render();
  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  var self = this;
  this.sliceXX.onShowtime = function() {
    // add the volume to the other 3 renderers
    self.sliceYY.add(self.volume);
    //self.sliceYY.remove(self.volume)
    self.sliceYY.render(); 
    self.sliceZZ.add(self.volume);
    self.sliceZZ.render();
    if (self._webGLFriendly) {
      self['33d'].add(self.volume);
      for (var i = 0; i < self.fibersList.length; i++) {
        self['33d'].add(self.fibersList[i]);
      }
      for (i = 0; i < self.meshList.length; i++) {
        self['33d'].add(self.meshList[i]);
      }
      // the volume and geometric models are not in the same space, so
      // we configure some transforms in the onShowtime method which gets executed
      // after all files were fully loaded and just before the first rendering
      // attempt
      self['33d'].onShowtime = function() {
      // we reset the bounding box so track and mesh are in the same space
        self['33d'].resetBoundingBox();
      };
      // .. and start the loading and rendering!
      self['33d'].camera.position = [0, 0, 200];
      self['33d'].render();
    } 
    // now the volume GUI widgets
  
    self.createVolWidget('xcontroller');
  };
}


viewer.Viewer.prototype.createVolWidget = function(container) {
  if (this.volume.file) {
    var gui = new dat.GUI({ autoPlace: false });
    var customContainer = document.getElementById(container);
    customContainer.appendChild(gui.domElement);
    // $('.interactive_plugin_content').css("background-color", "#000");
    // the following configures the gui for interacting with the X.volume
    var volumegui = gui.addFolder('Volume');
    // now we can configure controllers which..
    // .. switch between slicing and volume rendering
    volumegui.add(this.volume, 'volumeRendering');
    // .. configure the volume rendering opacity
    volumegui.add(this.volume, 'opacity', 0, 1);
    // .. and the threshold in the min..max range
    volumegui.add(this.volume, 'lowerThreshold', this.volume.min, this.volume.max);
    volumegui.add(this.volume, 'upperThreshold', this.volume.min, this.volume.max);
    volumegui.add(this.volume, 'windowLow', this.volume.min, this.volume.max);
    volumegui.add(this.volume, 'windowHigh', this.volume.min, this.volume.max);
    // the indexX,Y,Z are the currently displayed slice indices in the range
    // 0..dimensions-1
    volumegui.add(this.volume, 'indexX', 0, this.volume.dimensions[0] - 1);
    volumegui.add(this.volume, 'indexY', 0, this.volume.dimensions[1] - 1);
    volumegui.add(this.volume, 'indexZ', 0, this.volume.dimensions[2] - 1);
    volumegui.open();
  }
}


viewer.Viewer.prototype.createFileSelectTree = function(container) {
  return $('#' + container).fancytree({
    checkbox: true,
    source: this.source
  });
}


viewer.Viewer.prototype.onThreshold = function() {

  window.console.log('Lets threshold!');
  //this.threeDRenderer 

}


viewer.Viewer.prototype.setVolume = function(url, fileNames) {
  // for the dicom format, fileNames is a list of strings 
  // for other formats it's a list with just a single string 
  var orderedFiles = fileNames.sort().map(function(str) { 
    return url + str;});
  if (!this.volume.file || (this.volume.file[0] != orderedFiles[0])) {
    // attach the single-file dicom in .NRRD format
    // this works with gzip/gz/raw encoded NRRD files but XTK also supports other
    // formats like MGH/MGZ
    this.volume.file = orderedFiles;
  }
}


viewer.Viewer.prototype.addFibers = function(url, fileName) {
  this.addGeomModel(url, fileName, 'fibers');
}


viewer.Viewer.prototype.addMesh = function(url, fileName) {
  this.addGeomModel(url, fileName, 'mesh');
}


viewer.Viewer.prototype.addGeomModel = function(url, fileName, type) {
  var tList = this.typeListPropertyName(type);
  var filePath = url + fileName;

  if (this.indexOfGeomModel(filePath, type) == -1) {
    var obj = new X[type]();
    obj.file = filePath;
    this[tList].push(obj);
  }
}


viewer.Viewer.prototype.remGeomModel = function(url, fileName, type) {
  var tList = this.typeListPropertyName(type);
  var filePath = url + fileName;
  var ix = indexOfGeomModel(filePath, type);

  if ( ix != -1) {
    this[tList].splice(ix,1);
  }
}


viewer.Viewer.prototype.indexOfGeomModel = function(filePath, type) {
  var tList = this.typeListPropertyName(type);
  var found = false;

  if (this[tList]) {
    for (var i = 0; i < this[tList].length; i++) {
      if (this[tList][i].file == filePath) {
        found = true;
        return i;
     }
    }
  }
  if (!found) {
    return -1;
  }
}


viewer.Viewer.prototype.typeListPropertyName = function(type) {
  return type + 'List';
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
