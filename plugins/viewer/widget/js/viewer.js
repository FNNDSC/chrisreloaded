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
  //Parse the json file
  this.source = jsonObj;

  //rendered volume
  this.volume = null;

  this.volumeBBox = null;
  this.bbox = true;

  this.sceneOrientation = 0;
  this.mode = 0;

  // true == ignore orientation
  // false == use orientation
  this.reslice = 'false';
  this.reslice2 = false;

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

    // make sure to re-paint
    self['sliceXX'].update(self.volume);
    self['sliceYY'].update(self.volume);
    self['sliceZZ'].update(self.volume);

    if (self._webGLFriendly) {
      // no need to worry about the other showtimes
      self['33d'].interactor.addEventListener(X.event.events.ROTATE, function(){self.updateSceneView();});
      self['33d'].resetBoundingBox();
      self.createBBox();
      self['33d'].add(self.volumeBBox);
      self['33d'].add(self.volume);
      self['33d'].camera.position = [0, 0, 200];
      self['33d'].render();
    }
    // now the volume GUI widget
    if (!self.volWidget) {
      self.createVolWidget('xcontroller');
    } else {
      self.updateVolWidget();
    }
  };

  //Event handler for full screen behaviour main container is double clicked
  document.getElementById('33d').addEventListener('dblclick', function() {
    var render2D = document.getElementById('render2D');


    if (this.style.height == '100%') {
      render2D.style.display = 'block';
      this.style.height = '70%';
    } else {
      render2D.style.display = 'none';
      this.style.height = '100%'
    }
    var ev = document.createEvent('Event');
    ev.initEvent('resize', true, true);
    window.dispatchEvent(ev);
  });

  /*//Event handler for render button
  document.getElementById("renderbutton").addEventListener('click', function() {
    self.render();});*/
}

viewer.Viewer.prototype.createBBox = function(){

    var res = [this.volume.bbox[0],this.volume.bbox[2],this.volume.bbox[4]];
    var res2 = [this.volume.bbox[1],this.volume.bbox[3],this.volume.bbox[5]];

    this.volumeBBox = new X.object();
    this.volumeBBox.points = new X.triplets(72);
    this.volumeBBox.normals = new X.triplets(72);
    this.volumeBBox.type = 'LINES';
    this.volumeBBox.points.add(res2[0], res[1], res2[2]);
    this.volumeBBox.points.add(res[0], res[1], res2[2]);
    this.volumeBBox.points.add(res2[0], res2[1], res2[2]);
    this.volumeBBox.points.add(res[0], res2[1], res2[2]);
    this.volumeBBox.points.add(res2[0], res[1], res[2]);
    this.volumeBBox.points.add(res[0], res[1], res[2]);
    this.volumeBBox.points.add(res2[0], res2[1], res[2]);
    this.volumeBBox.points.add(res[0], res2[1], res[2]);
    this.volumeBBox.points.add(res2[0], res[1], res2[2]);
    this.volumeBBox.points.add(res2[0], res[1], res[2]);
    this.volumeBBox.points.add(res[0], res[1], res2[2]);
    this.volumeBBox.points.add(res[0], res[1], res[2]);
    this.volumeBBox.points.add(res2[0], res2[1], res2[2]);
    this.volumeBBox.points.add(res2[0], res2[1], res[2]);
    this.volumeBBox.points.add(res[0], res2[1], res2[2]);
    this.volumeBBox.points.add(res[0], res2[1], res[2]);
    this.volumeBBox.points.add(res2[0], res2[1], res2[2]);
    this.volumeBBox.points.add(res2[0], res[1], res2[2]);
    this.volumeBBox.points.add(res[0], res2[1], res2[2]);
    this.volumeBBox.points.add(res[0], res[1], res2[2]);
    this.volumeBBox.points.add(res[0], res2[1], res[2]);
    this.volumeBBox.points.add(res[0], res[1], res[2]);
    this.volumeBBox.points.add(res2[0], res2[1], res[2]);
    this.volumeBBox.points.add(res2[0], res[1], res[2]);
    for ( var i = 0; i < 24; ++i) {
      this.volumeBBox.normals.add(0, 0, 0);
    }

    this.volumeBBox.visible = this.bbox;

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


viewer.Viewer.prototype.createFileSelectTree = function(container) {
  var self = this;

  $('#' + container).fancytree({
    checkbox: true,
    source: this.source,
    selectMode: 1,

    select: function(event, data) {

      // disable picking
      //$("#tree").fancytree("option", "disabled", true);

      var node = data.node;
      if (node.data.type == 'volume') {
        if (node.isSelected()) {
          if (self.volume != null) {
            var prevSelectedNode = self.fileSelectTree.getNodeByKey(self.volume.key);
            //uncheck previously selected volume node and call the select event
            prevSelectedNode.setSelected(false);
          }
          self.setVolume(node);
        } else {
          self.unsetVolume();
        }
      } else {
        if (node.isSelected()) {
          self.addGeomModel(node);
        } else {
          self.remGeomModel(node);
        }
      };
    },

    keydown: function(event, data) {
      var node = data.node;
      if (event.which === 13) {
        if (node.isFolder()) {
          node.toggleExpanded();
        } else {
          node.toggleSelected();
        }
      }
    }
  });

  this.fileSelectTree = $('#' + container).fancytree("getTree");
}


viewer.Viewer.prototype.setVolume = function(nodeObj) {

  var orderedFiles, files, url;

  url = nodeObj.data.url;

  // for the dicom format, files is a list of strings
  // for other formats it's a list with just a single string
  files = nodeObj.data.files;
  orderedFiles = files.sort().map(function(str) {
      return url + '/' + str;});

  this.volume = new X.volume();
  this.volume.reslicing = this.reslice
  this.volume.file = orderedFiles;
  this.volume.key = nodeObj.key;
  this.volume.nodeObj = nodeObj;

  this.sliceXX.add(this.volume);
  // start the loading/rendering
  this.sliceXX.render();
}

viewer.Viewer.prototype.unsetVolume = function() {
  // remove from the visualization
  if (this._webGLFriendly) {
    this['33d'].remove(this.volume);
    this['33d'].remove(this.volumeBBox);
  }

    this['sliceXX'].remove(this.volume);
    this['sliceYY'].remove(this.volume);
    this['sliceZZ'].remove(this.volume);

    this.volume.destroy();
    this.volume = null;

    this.volumeBBox.destroy();
    this.volumeBBox = null;

}

viewer.Viewer.prototype.updateVolume = function() {
  if(this.volume != null){
    var nodeObj = this.volume.nodeObj;
    this.unsetVolume();
    this.setVolume(nodeObj);
  }
}

viewer.Viewer.prototype.addGeomModel = function(nodeObj) {
  var xtkObj;

  if (this._webGLFriendly && (this.indexOfGeomModel(nodeObj.key) == -1)) {
    xtkObj = new X[nodeObj.data.type]();
    xtkObj.file = nodeObj.data.url + '/' + nodeObj.data.files;
    xtkObj.key = nodeObj.key;
    this.geomModels.push(xtkObj);
    this['33d'].add(xtkObj);
    this['33d'].camera.position = [0, 0, 200];
    this['33d'].render();
  }
}


viewer.Viewer.prototype.remGeomModel = function(nodeObj) {
  var ix = this.indexOfGeomModel(nodeObj.key);

  if (ix != -1) {
    this['33d'].remove(this.geomModels[ix]);
    this.geomModels[ix].destroy();
    this.geomModels[ix] = null;
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


viewer.Viewer.prototype.createVolWidget = function(container) {
    this.volWidget = {};
    var gui = new dat.GUI({ autoPlace: false });
    var customContainer = document.getElementById(container);
    customContainer.appendChild(gui.domElement);
    this.volWidget.view = gui.addFolder('View');
    // $('.interactive_plugin_content').css("background-color", "#000");
    // the following configures the gui for interacting with the X.volume
    // this.volWidget.interact = gui.addFolder('Volume Interaction');
    this.populateVolWidget();

}

viewer.Viewer.prototype.populateVolWidget = function() {
  // now we can configure controllers ..
  //view mode
  this.volWidget.view.sliceMode = this.volWidget.view.add(this, 'mode', { 'Default':0, 'Rotate Box':1});
  this.volWidget.view.bboxMode = this.volWidget.view.add(this, 'bbox').name('Show BBox');
  this.volWidget.view.orientationMode = this.volWidget.view.add(this, 'reslice2').name('Reslice');
  this.volWidget.view.orientation = this.volWidget.view.add(this, 'sceneOrientation',
   { Free: 0, Blue: 1, Red: 2, Green: 3 }).name('orientation');
  this.volWidget.view.open();

  // connect callbacks
  var self = this;
  this.volWidget.view.bboxMode.onChange(function(value) {
    if(self.volumeBBox != null){
        self.volumeBBox.visible = value;
    }
  });

  this.volWidget.view.orientationMode.onChange(function(value) {
    // Delete current volume
    if(value){
        window.console.log(value);
        self.reslice = 'true';
    }
    else{
      window.console.log(value);
        self.reslice = 'false';
    }
    self.updateVolume();
  });

  this.volWidget.view.orientation.onChange(function(value){
    if(value == 2){
      // move camera
      self['33d'].camera.position = [-400, 0, 0];
      self['33d'].camera.up = [0, 0, 1];
    }
    else if(value == 3){
      // move camera
      self['33d'].camera.position = [0, 400, 0];
      self['33d'].camera.up = [0, 0, 1];
    }
    else if(value == 1){
      // move camera
      self['33d'].camera.position = [0, 0, -400];
      self['33d'].camera.up = [0, 1, 0];
    }
  });

  // // .. switch between slicing and volume rendering
  // this.volWidget.interact.vrCtrl = this.volWidget.interact.add(this.volume, 'volumeRendering').name('rendering');
  // // .. configure the volume rendering opacity
  // this.volWidget.interact.opacityCtrl = this.volWidget.interact.add(this.volume, 'opacity', 0, 1);
  // // .. and the threshold in the min..max range
  // this.volWidget.interact.lowThCtrl = this.volWidget.interact.add(this.volume, 'lowerThreshold',
  //   this.volume.min, this.volume.max).name('lowerThr');
  // this.volWidget.interact.upThCtrl = this.volWidget.interact.add(this.volume, 'upperThreshold',
  //   this.volume.min, this.volume.max).name('upperThr');
  // this.volWidget.interact.lowWinCtrl = this.volWidget.interact.add(this.volume, 'windowLow',
  //   this.volume.min, this.volume.max).name('winLow');
  // this.volWidget.interact.upWinCtrl = this.volWidget.interact.add(this.volume, 'windowHigh',
  //  this.volume.min, this.volume.max).name('winHigh');
  // // the indexX,Y,Z are the currently displayed slice indices in the range
  // // 0..dimensions-1
  // this.volWidget.interact.sliceXCtrl = this.volWidget.interact.add(this.volume, 'indexX', 0,
  //  this.volume.dimensions[0] - 1).listen();
  // this.volWidget.interact.sliceYCtrl = this.volWidget.interact.add(this.volume, 'indexY', 0,
  //  this.volume.dimensions[1] - 1).listen();
  // this.volWidget.interact.sliceZCtrl = this.volWidget.interact.add(this.volume, 'indexZ', 0,
  //  this.volume.dimensions[2] - 1).listen();
  // this.volWidget.interact.open();
}

viewer.Viewer.prototype.updateSceneView = function(){

  // if reslice mode, update the renderers by default
  // else reset normals to default (or RASIJK vals?)
  if(this.volWidget.view.sliceMode.getValue() == 1){
    var _x = this['33d'].camera.view[2];
    var _y = this['33d'].camera.view[6];
    var _z = this['33d'].camera.view[10];
    // normalize
    var length = Math.sqrt(_x*_x + _y*_y+_z*_z);

    // Update X
    this.volume.xNormX = _x/length;
    this.volume.xNormY = _y/length;
    this.volume.xNormZ = _z/length;

    this.volume.sliceInfoChanged(0);

    // get new slice normal
    var sliceX = this.volume.children[0].children[this.volume.indexX];
    // window.console.log();

    // Update Y
    this.volume.yNormX = sliceX.up[0];
    this.volume.yNormY = sliceX.up[1];
    this.volume.yNormZ = sliceX.up[2];

    this.volume.sliceInfoChanged(1);

    // Update Z
    this.volume.zNormX = sliceX.right[0];
    this.volume.zNormY = sliceX.right[1];
    this.volume.zNormZ = sliceX.right[2];

    this.volume.sliceInfoChanged(2);

    // only triggers 1 3d renderer

    // this.volume.modified();
    this['sliceXX'].update(this.volume);
    this['sliceYY'].update(this.volume);
    this['sliceZZ'].update(this.volume);
    }

}


viewer.Viewer.prototype.updateVolWidget = function() {
  this.volWidget.view.remove(this.volWidget.view.sliceMode);
  this.volWidget.view.remove(this.volWidget.view.bboxMode);
  this.volWidget.view.remove(this.volWidget.view.orientationMode);
  this.volWidget.view.remove(this.volWidget.view.orientation);
  // this.volWidget.interact.remove(this.volWidget.interact.vrCtrl);
  // this.volWidget.interact.remove(this.volWidget.interact.opacityCtrl);
  // this.volWidget.interact.remove(this.volWidget.interact.lowThCtrl);
  // this.volWidget.interact.remove(this.volWidget.interact.upThCtrl);
  // this.volWidget.interact.remove(this.volWidget.interact.lowWinCtrl);
  // this.volWidget.interact.remove(this.volWidget.interact.upWinCtrl);
  // this.volWidget.interact.remove(this.volWidget.interact.sliceXCtrl);
  // this.volWidget.interact.remove(this.volWidget.interact.sliceYCtrl);
  // this.volWidget.interact.remove(this.volWidget.interact.sliceZCtrl);
  this.populateVolWidget();
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

viewer.Viewer.prototype.destroy = function(){
    // destroy the fancy tree
    $("#tree").fancytree("destroy");

    // dbl click listeners

    // single click listeners

    // top right object

    // delete all elements contained in the scene
    if(this.volume != null){
        this.unsetVolume();
    }

    if (this.geomModels != []) {
        // iterate backwards to handle splice in remGeomModel
        var len = this.geomModels.length;
        while (len--) {
            this.remGeomModel(len);
        }
    }
    this.geomModels.length = [];

    // destroy XTK renderers
    this['33d'].destroy();
    this['33d'] = null;
    this['sliceXX'].destroy();
    this['sliceXX'] = null;
    this['sliceYY'].destroy();
    this['sliceYY'] = null;
    this['sliceZZ'].destroy();
    this['sliceZZ'] = null;
}
