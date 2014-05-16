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

viewer.Viewer = function( jsonFile ) {

	this.version = 0.0;
	this.threeD = null;
  //window.console.log(''jsonFile);
  this.scene = {
    patientID : null,
    fNames : [['plugins/viewer/widget/data/dicom/0001-1.3.12.2.1107.5.2.32.35162.2012021516003275873755302.dcm', 
    'plugins/viewer/widget/data/dicom/0002-1.3.12.2.1107.5.2.32.35162.2012021516003288462855318.dcm',
    'plugins/viewer/widget/data/dicom/0003-1.3.12.2.1107.5.2.32.35162.2012021516003360797655352.dcm',
    'plugins/viewer/widget/data/dicom/0004-1.3.12.2.1107.5.2.32.35162.2012021516003411054655384.dcm',
    'plugins/viewer/widget/data/dicom/0005-1.3.12.2.1107.5.2.32.35162.2012021516003465209455412.dcm'], 
    'plugins/viewer/widget/data/recon.nii', 'plugins/viewer/widget/data/tact.trk']
  };
    // try to create and initialize a 3D renderer
  _webGLFriendly = true;
  try {
    this.threeD = new X.renderer3D();
    this.threeD.container = '33d';
    this.threeD.init();
  } catch ( Exception ) {
  // no webgl on this machine
    _webGLFriendly = false;
  }

  // create the 2D renderers
  // .. for the X orientation
  this.sliceX = new X.renderer2D();
  this.sliceX.container = 'sliceXX';
  this.sliceX.orientation = 'X';
  this.sliceX.init();
  // .. for Y
  this.sliceY = new X.renderer2D();
  this.sliceY.container = 'sliceYY';
  this.sliceY.orientation = 'Y';
  this.sliceY.init();
  // .. and for Z
  this.sliceZ = new X.renderer2D();
  this.sliceZ.container = 'sliceZZ';
  this.sliceZ.orientation = 'Z';
  this.sliceZ.init();
  
  // THE VOLUME DATA
  //
  // create a X.volume
  this.volume = new X.volume();
  window.console.log('hey ' + this.volume);
    // .. and attach the single-file dicom in .NRRD format
  // this works with gzip/gz/raw encoded NRRD files but XTK also supports other
  // formats like MGH/MGZ
  this.volume.file = this.scene.fNames[0].sort().map(function( str ) { return str;});
  
  // Use a 2D renderer as the main renderer since this should work also on
  // non-webGL-friendly devices like Safari on iOS. Add the volume so it 
  // can be loaded and parsed
  this.sliceX.add(this.volume);
  
  // start the loading/rendering
  this.sliceX.render();

  //
  // THE GUI
  //
  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  var self = this;
  this.sliceX.onShowtime = function(volume) {

    // //
    // // add the volume to the other 3 renderers
    // //
    self.sliceY.add(self.volume);
    self.sliceY.render();
    self.sliceZ.add(self.volume);
    self.sliceZ.render();
    
    if ( _webGLFriendly ) {
      self.threeD.add(self.volume);
     self.threeD.render();
    } 
    
    // // now the real GUI
    // var gui = new dat.GUI({ autoPlace: false });
    // var customContainer = document.getElementById('xcontroller');
    // customContainer.appendChild(gui.domElement);

    // $('.interactive_plugin_content').css("background-color", "#000");
    
    // // the following configures the gui for interacting with the X.volume
    // var volumegui = gui.addFolder('Volume');
    // // now we can configure controllers which..
    // // .. switch between slicing and volume rendering
    // var vrController = volumegui.add(volume, 'volumeRendering');
    // // .. configure the volume rendering opacity
    // var opacityController = volumegui.add(volume, 'opacity', 0, 1);
    // // .. and the threshold in the min..max range
    // var lowerThresholdController = volumegui.add(volume, 'lowerThreshold',
    //     volume.min, volume.max);
    // var upperThresholdController = volumegui.add(volume, 'upperThreshold',
    //     volume.min, volume.max);
    // var lowerWindowController = volumegui.add(volume, 'windowLow', volume.min,
    //     volume.max);
    // var upperWindowController = volumegui.add(volume, 'windowHigh', volume.min,
    //     volume.max);
    // // the indexX,Y,Z are the currently displayed slice indices in the range
    // // 0..dimensions-1
    // var sliceXController = volumegui.add(volume, 'indexX', 0,
    //     volume.dimensions[0] - 1);
    // var sliceYController = volumegui.add(volume, 'indexY', 0,
    //     volume.dimensions[1] - 1);
    // var sliceZController = volumegui.add(volume, 'indexZ', 0,
    //     volume.dimensions[2] - 1);
    // volumegui.open();

  };
	
}


viewer.Viewer.prototype.render = function( fname ) {


}

viewer.Viewer.prototype.addObject = function(){


}

viewer.Viewer.prototype.addJSON = function(json){

  window.console.log(json);

}

viewer.Viewer.prototype.removeObject = function(){


}

viewer.Viewer.prototype.sayHi = function(){

  window.console.log('HI VIEWER');

}

viewer.Viewer.prototype.onThreshold = function(){

  window.console.log('Lets threshold!');
  //this.threeDRenderer 

}