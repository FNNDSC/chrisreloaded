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

function Viewer(){

	this.verson = 0.0;
	this.threeD = null;
	

}

Viewer.prototype.init = function(jsonFile){

  //window.console.log(jsonFile);

  // try to create and initialize a 3D render
  this.threeD = new X.renderer3D();
  this.threeD.container = '33d';
  this.threeD.init();
  //
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
  
  //
  // THE VOLUME DATA
  //
  // create a X.volume
  this.volume = new X.volume();
  // .. and attach the single-file dicom in .NRRD format
  // this works with gzip/gz/raw encoded NRRD files but XTK also supports other
  // formats like MGH/MGZ
  this.volume.file = 'plugins/viewer/widget/data/recon.nii';
  
  // add the volume in the main renderer
  // we choose the sliceX here, since this should work also on
  // non-webGL-friendly devices like Safari on iOS
  this.sliceX.add(this.volume);
  
  // start the loading/rendering
  this.sliceX.render();
  

  //
  // THE GUI
  //
  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  var self = this;
  this.sliceX.onShowtime = function() {

    // //
    // // add the volume to the other 3 renderers
    // //
    self.sliceY.add(self.volume);
    self.sliceY.render();
    self.sliceZ.add(self.volume);
    self.sliceZ.render();
    
    self.threeD.add(self.volume);
    self.threeD.render();
    
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

Viewer.prototype.addObject = function(){


}

Viewer.prototype.removeObject = function(){


}

Viewer.prototype.sayHi = function(){

  window.console.log('HI VIEWER');

}

Viewer.prototype.onThreshold = function(){

  window.console.log('Lets threshold!');
  //this.threeDRenderer 

}