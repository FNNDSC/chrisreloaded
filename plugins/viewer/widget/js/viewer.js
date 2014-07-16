/**
 * This object takes care of all the visualization:
 *
 * FEATURES
 * - Give it a JSON object which represents the 'scene'
 * - Allows users to selects elements of the scene to be rendered
 * - Allows basic image processing (thresholding, Volume Rendering (VR), Fibers Length Thresholding, etc.)
 * - Expose some functions
 *
 * TECHNOLOGY
 * - XTK
 * - xdatgui.js
 * - SliceDrop clone
 * - fancytree
 */

// Declare (or re-declare) the single global variable
var viewer = viewer || {};


viewer.Viewer = function(jsonObj) {

  this.version = 0.0;
  //Parse the json file
  this.source = jsonObj;

  // collaborator object
  this.collaborator = null;

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
  this.treeContainerId = 'tree';
  this.createFileSelectTree(this.treeContainerId);

  // volume GUI widget
  this.volWidget = null;
  this.viewFolder = [
    {
      label: 'sliceMode',
      target: 'mode',
      parameters: { 'Default':0, 'Rotate Box':1},
      name: 'Mode',
      callback: function(){}
    },
    {
      label: 'bboxMode',
      target: 'bbox',
      parameters: null,
      name: 'Show BBox',
      callback: function(value) {
        if(this.volumeBBox != null){
            this.volumeBBox.visible = value;
        }
      }
    },
    {
      label: 'orientationMode',
      target: 'reslice2',
      parameters: null,
      name: 'Reslice',
      callback: function(value) {
        // Delete current volume
        if(value){
          this.reslice = 'true';
        }
        else{
         this.reslice = 'false';
        }
        this.updateVolume();
      }
    },
    {
      label: 'orientation',
      target: 'sceneOrientation',
      parameters: { 'Free': 0, 'Blue': 1, 'Red': 2, 'Green': 3 },
      name: 'Orientation',
      callback: function(value){
        if(value == 2){
          // move camera
          this['vol3D'].camera.position = [-400, 0, 0];
          this['vol3D'].camera.up = [0, 0, 1];
        }
        else if(value == 3){
          // move camera
          this['vol3D'].camera.position = [0, 400, 0];
          this['vol3D'].camera.up = [0, 0, 1];
        }
        else if(value == 1){
          // move camera
          this['vol3D'].camera.position = [0, 0, -400];
          this['vol3D'].camera.up = [0, 1, 0];
        }
      }
    }
  ];

  // try to create and initialize a 3D renderer
  this._webGLFriendly = true;
  try {
    this.create3DRenderer('vol3D');
  } catch (Exception) {
    this._webGLFriendly = false;
  }
  // create 2D renderers for the X, Y, Z orientations
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
      self['vol3D'].resetBoundingBox();
      self.createBBox();
      self['vol3D'].add(self.volumeBBox);
      self['vol3D'].add(self.volume);
      self['vol3D'].camera.position = [0, 0, 200];
      self['vol3D'].render();
    }
    // now the volume GUI widget
    if (!self.volWidget) {
      self.createVolWidget('xcontroller');
    } else {
      self.updateVolWidget();
    }
  };

  //Event handler for full screen behaviour when main container is double clicked
  document.getElementById('render3D').addEventListener('dblclick', self.on3DContDblClick.bind(self));

  //Event handlers for switching renderers
  document.getElementById('sliceX').addEventListener('click', self.on2DContClick.bind(self, 'sliceX'));
  document.getElementById('sliceY').addEventListener('click', self.on2DContClick.bind(self, 'sliceY'));
  document.getElementById('sliceZ').addEventListener('click', self.on2DContClick.bind(self, 'sliceZ'));

}


viewer.Viewer.prototype.create3DRenderer = function(container) {
  this[container] = new X.renderer3D();
  this[container].bgColor = [.1, .1, .1];
  this[container].container = container;
  this[container].init();
  self = this;
  //3D renderer's ROTATE event handler (update the camera view)
  this[container].interactor.addEventListener(X.event.events.ROTATE,
    function(){self.updateSceneView();});
  //3D renderer's SCROLL event handler (update the camera view)
  this[container].interactor.addEventListener(X.event.events.SCROLL,
      function(){self.updateSceneView();});
  this[container].interactor.onTouchStart = this[container].interactor.onMouseDown = function(){ self.on3DRendererTouchStart(); };
  this[container].interactor.onTouchEnd = this[container].interactor.onMouseUp = function(){ self.on3DRendererTouchEnd(); };
  this[container].interactor.onTouchMove = this[container].interactor.onMouseWheel = function(){ self.on3DRendererMouseWheel(); };
}


viewer.Viewer.prototype.create2DRenderer = function(container, orientation) {
  this[container] = new X.renderer2D();
  this[container].container = container;
  this[container].orientation = orientation;
  this[container].init();
  /*self = this;
  this[container].interactor.addEventListener(X.event.events.SCROLL,
      function(){self.updateSceneView();});
  this[container].interactor.onTouchMove = this[container].interactor.onMouseWheel = function(){ self.on2DRendererMouseWheel(); };*/
}


viewer.Viewer.prototype.createFileSelectTree = function(container) {
  var self = this;

  $('#' + self.treeContainerId).fancytree({
    checkbox: true,
    source: this.source,

    select: function(event, data) {
      var node = data.node;

      if (node.data.type == 'volume') {
        if (node.isSelected()) {
          if (self.volume != null) {
            window.console.log(self.volume.key);
            var prevSelectedNode = self.fileSelectTree.getNodeByKey(self.volume.key);
            window.console.log(prevSelectedNode);
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

  this.fileSelectTree = $('#' + self.treeContainerId).fancytree("getTree");
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


viewer.Viewer.prototype.setVolume = function(nodeObj) {

  var orderedFiles, files, url;

  url = nodeObj.data.url;

  // for the dicom format, files is a list of strings
  // for other formats it's a list with just a single string
  files = nodeObj.data.files;
  orderedFiles = files.sort().map(function(str) {
      return url + '/' + str;});

  this.volume = new X.volume();
  this.volume.reslicing = this.reslice;
  this.volume.file = orderedFiles;
  this.volume.key = nodeObj.key;

  this.sliceXX.add(this.volume);
  // start the loading/rendering
  this.sliceXX.render();
}


viewer.Viewer.prototype.unsetVolume = function() {
  // remove from the visualization
  if (this._webGLFriendly) {
    this['vol3D'].remove(this.volume);
    this['vol3D'].remove(this.volumeBBox);
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
    var nodeObj = this.fileSelectTree.getNodeByKey(this.volume.key);
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
    this['vol3D'].add(xtkObj);
    this['vol3D'].camera.position = [0, 0, 200];
    this['vol3D'].render();
  }
}


viewer.Viewer.prototype.remGeomModel = function(nodeObj) {
  var ix = this.indexOfGeomModel(nodeObj.key);

  if (ix != -1) {
    this['vol3D'].remove(this.geomModels[ix]);
    this.geomModels[ix].destroy();
    this.geomModels[ix] = null;
    this.geomModels.splice(ix,1);
  }
}


viewer.Viewer.prototype.indexOfGeomModel = function(key) {
  if (this.geomModels) {
    for (var i = 0; i < this.geomModels.length; i++) {
      if (this.geomModels[i].key == key) {
        return i;
      }
    }
  }
  return -1;
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
    this.volWidget.container = customContainer;
    this.volWidget.view = gui.addFolder('View');
    $('.interactive_plugin_content').css("background-color", "#000");
    this.volWidget.interaction = gui.addFolder('Interaction');
    this.populateVolWidget();
}

viewer.Viewer.prototype.createViewFolder = function(){
  var root = this.volWidget.view;

  for (var i=0; i < this.viewFolder.length; i++) {
    // create element
    root[this.viewFolder[i].label] = root.add(this, this.viewFolder[i].target, this.viewFolder[i].parameters).name(this.viewFolder[i].name);
    // set value
    root[this.viewFolder[i].label].setValue(this[this.viewFolder[i].target]);
    // connect callback
    root[this.viewFolder[i].label].onChange(this.viewFolder[i].callback.bind(this));
  }

}

viewer.Viewer.prototype.destroyViewFolder = function(){
  var root = this.volWidget.view;

  for (var i=0; i < this.viewFolder.length; i++) {
    root.remove(root[this.viewFolder[i].label]);
  }

}

viewer.Viewer.prototype.populateVolWidget = function() {
  // now we can configure controllers ..
  //view mode
  this.createViewFolder();
  this.volWidget.view.open();
  //the following configures the gui for interacting with the X.volume
  // .. configure the volume rendering opacity
  this.volWidget.interaction.opacity = this.volWidget.interaction.add(this.volume, 'opacity', 0, 1).listen();
  // .. and the threshold in the min..max range
  this.volWidget.interaction.lowerThresh = this.volWidget.interaction.add(this.volume, 'lowerThreshold',
    this.volume.min, this.volume.max).name('lowerThr').listen();
  this.volWidget.interaction.upperThresh = this.volWidget.interaction.add(this.volume, 'upperThreshold',
    this.volume.min, this.volume.max).name('upperThr').listen();
  this.volWidget.interaction.lowerWindow = this.volWidget.interaction.add(this.volume, 'windowLow',
    this.volume.min, this.volume.max).name('winLow').listen();
  this.volWidget.interaction.upperWindow = this.volWidget.interaction.add(this.volume, 'windowHigh',
    this.volume.min, this.volume.max).name('winHigh').listen();
  // the indexX,Y,Z are the currently displayed slice indices in the range 0..dimensions-1
  this.volWidget.interaction.sliceX = this.volWidget.interaction.add(this.volume, 'indexX', 0,
    this.volume.range[0] - 1).listen();
  this.volWidget.interaction.sliceY = this.volWidget.interaction.add(this.volume, 'indexY', 0,
    this.volume.range[1] - 1).listen();
  this.volWidget.interaction.sliceZ = this.volWidget.interaction.add(this.volume, 'indexZ', 0,
    this.volume.range[2] - 1).listen();
  this.volWidget.interaction.open();
}


viewer.Viewer.prototype.updateVolWidget = function() {
  this.destroyViewFolder();

  this.volWidget.interaction.remove(this.volWidget.interaction.opacity);
  this.volWidget.interaction.remove(this.volWidget.interaction.lowerThresh);
  this.volWidget.interaction.remove(this.volWidget.interaction.upperThresh);
  this.volWidget.interaction.remove(this.volWidget.interaction.lowerWindow);
  this.volWidget.interaction.remove(this.volWidget.interaction.upperWindow);
  this.volWidget.interaction.remove(this.volWidget.interaction.sliceX);
  this.volWidget.interaction.remove(this.volWidget.interaction.sliceY);
  this.volWidget.interaction.remove(this.volWidget.interaction.sliceZ);
  this.populateVolWidget();
}


viewer.Viewer.prototype.updateSceneView = function(){

  // if reslice mode, update the renderers by default
  // else reset normals to default (or RASIJK vals?)
  if(this.volWidget.view.sliceMode.getValue() == 1){
    var _x = this['vol3D'].camera.view[2];
    var _y = this['vol3D'].camera.view[6];
    var _z = this['vol3D'].camera.view[10];
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


//COLLABORATION: Local and Remote event handlers
//Register remote actions with their local handlers
viewer.Viewer.prototype.connect = function(feedID){
  var self = this;

// when the collaborator is ready connect!
window.addEventListener('CollaboratorReady',
  function(){
    var myId = self.collaborator.id;
    var sceneOwnerId = self.collaborator.getRoomOwnerId();

    window.console.log('myId: ', myId);
    window.console.log('sceneOwnerId: ', sceneOwnerId);
    self.collaborator.register('remoteViewerConnected', function(msgObj) {self.onRemoteViewerConnect(msgObj);});
    self.collaborator.register('sceneRequested', function(msgObj) {self.onRemoteSceneReceived(msgObj);});
    self.collaborator.register('cameraViewChanged', function(msgObj) {self.onRemoteCameraViewChange(msgObj);});
    self.collaborator.register('3DContDblClicked', function(msgObj) {self.onRemote3DContDblClick(msgObj);});
    self.collaborator.register('2DContClicked', function(msgObj) {self.onRemote2DContClick(msgObj);});
    if (myId != sceneOwnerId) {
      self.collaborator.send('remoteViewerConnected', {receiverId: myId, senderId: sceneOwnerId});
    }
  });
  //Create collaborator object
  this.collaborator = new collab.Collab(feedID);
}


viewer.Viewer.prototype.onRemoteViewerConnect = function(msgObj) {
  var ids = JSON.parse(msgObj.data);
  var self = this;

  if (this.collaborator.id == ids.senderId) {
    this.collaborator.send('sceneRequested', {receiverId: ids.receiverId, scene: self.exportScene()});
  }
}


viewer.Viewer.prototype.onRemoteSceneReceived = function(msgObj){
  var dataObj = JSON.parse(msgObj.data);

  if (this.collaborator.id == dataObj.receiverId) {
    this.importScene(dataObj.scene);
  }
}


viewer.Viewer.prototype.on3DContDblClick = function() {
  var contHeight = this._3DContDblClickHandler();

  this.collaborator.send('3DContDblClicked', contHeight);
  window.console.log('sent: ', contHeight);
}


viewer.Viewer.prototype.onRemote3DContDblClick = function(msgObj) {
  var contHeight = JSON.parse(msgObj.data);
  var render3D = document.getElementById('render3D');

  window.console.log('received: ', contHeight);
  if (render3D.style.height != contHeight) {
    this._3DContDblClickHandler();
  }
}


viewer.Viewer.prototype._3DContDblClickHandler = function() {
  var render3D = document.getElementById('render3D');
  var render2D = document.getElementById('render2D');

  if (render3D.style.height == '100%') {
      render2D.style.display = 'block';
      render3D.style.height = '70%';
  } else {
      render2D.style.display = 'none';
      render3D.style.height = '100%'
  }
  //repaint
  viewer.documentRepaint();
  return render3D.style.height;
}


viewer.Viewer.prototype.on2DContClick = function(cont) {
  window.console.log('sent: ', cont);
  this.collaborator.send('2DContClicked', cont);
  this._2DContClickHandler(cont);
}


viewer.Viewer.prototype.onRemote2DContClick = function(msgObj) {
  var cont = JSON.parse(msgObj.data);
  window.console.log('received: ', cont);
  this._2DContClickHandler(cont);
}


viewer.Viewer.prototype._2DContClickHandler = function(cont) {
  var contObj = document.getElementById(cont);
  var twoDRenderer = viewer.firstChild(contObj);
  var threeD = document.getElementById('render3D');
  var threeDRenderer = viewer.firstChild(threeD);

  contObj.replaceChild(threeDRenderer, twoDRenderer);
  threeD.insertBefore(twoDRenderer, threeD.firstChild);
  //threed.appendChild(renderer);
  //repaint
  viewer.documentRepaint();
}


viewer.Viewer.prototype.on3DRendererMouseWheel = function(){
  this.onCameraViewChange(this['vol3D'].camera.view);
}


// grab the camera view state every 20 mms after touch start and until touch end
viewer.Viewer.prototype.on3DRendererTouchStart = function(){
    var self = this;
    _CHRIS_INTERACTIVE_PLUGIN_._updater = setInterval(function(){
            self.onCameraViewChange(self['vol3D'].camera.view);
        }, 20);
}


viewer.Viewer.prototype.on3DRendererTouchEnd = function(){
  clearInterval(_CHRIS_INTERACTIVE_PLUGIN_._updater);
}


// local camera view change handler
viewer.Viewer.prototype.onCameraViewChange = function(dataObj){

  window.console.log('send: ' + dataObj);

  this.collaborator.send('cameraViewChanged', dataObj);

}


// remote camera view change handler
viewer.Viewer.prototype.onRemoteCameraViewChange = function(msgObj){

  window.console.log('received: ' + msgObj);
  window.console.log(this);

  var obj = JSON.parse(msgObj.data);
  var arr = $.map(obj, function(el) { return el; });
  this['vol3D'].camera.view = new Float32Array(arr);
}


viewer.Viewer.prototype.destroy = function(){
    // destroy the fancy tree
    $("#" + this.treeContainerId).fancytree("destroy");

    // listeners
    var self = this;
    document.getElementById('render3D').removeEventListener('dblclick', self.on3DContDblClick);
    document.getElementById('sliceX').removeEventListener('click', self.on2DContClick);
    document.getElementById('sliceY').removeEventListener('click', self.on2DContClick);
    document.getElementById('sliceZ').removeEventListener('click', self.on2DContClick);

    // top right widget must be destroyed if any!
    if(this.volWidget != null){
        this.volWidget.container.removeChild(this.volWidget.container.lastChild);
        this.volWidget = null;
    }

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
    this['vol3D'].destroy();
    this['vol3D'] = null;
    this['sliceXX'].destroy();
    this['sliceXX'] = null;
    this['sliceYY'].destroy();
    this['sliceYY'] = null;
    this['sliceZZ'].destroy();
    this['sliceZZ'] = null;

}

viewer.Viewer.prototype.exportScene = function(){
  var sceneObj = {};

  // export objects which are selected
  sceneObj.selectedKeys = {};
  sceneObj.selectedKeys = this.getSelectedKeys();

  // export viewer layout
  sceneObj.layout = {};
  sceneObj.layout = this.getLayout();

  // get general viewer information
  sceneObj.view = {};
  sceneObj.view = this.getView();

  return sceneObj;
}

viewer.Viewer.prototype.importScene = function(sceneObj){
  // set objects selection
  this.setSelectedKeys(sceneObj.selectedKeys);

  // set layout
  this.setLayout(sceneObj.layout);

  // set view
  this.setView(sceneObj.view);
}

viewer.Viewer.prototype.setView = function(remoteView){
  var view = this.getView();

  // if local view, update the widget from remote
  if(view.length == remoteView.length){
    for (var i=0; i < view.length; i++) {
      // if loaded
      if(typeof(this.volWidget) != 'undefined' && this.volWidget != null && view[i].label == remoteView[i].label){
        this.volWidget.view[remoteView[i].label].setValue(remoteView[i].value);
      }
    }
  }

  // if remote view, update the targets
  // when the widget is created, it will set the values from there
  for (var i=0; i < remoteView.length; i++) {
    // if not loaded yet
    this[remoteView[i].target] = remoteView[i].value;
  }

}

viewer.Viewer.prototype.getView = function(){
  var view = [];

  if(typeof(this.volWidget) != 'undefined' && this.volWidget != null){
    var root = this.volWidget.view;

    for (var i=0; i < this.viewFolder.length; i++) {
      view.push({
        'label': this.viewFolder[i].label,
        'value': this[this.viewFolder[i].target],
        'target': this.viewFolder[i].target
      });
    }
  }

  return view;
}

viewer.Viewer.prototype.setLayout = function(remoteLayout){
  var layout = this.getLayout();

  // is main container ok?
  if(layout.main != remoteLayout.main){
    var main = document.getElementById(layout.main);
    var mainContainer = main.parentNode;
    var remoteMain = document.getElementById(remoteLayout.main);
    var remoteMainContainer = remoteMain.parentNode;

    remoteMainContainer.replaceChild(main, remoteMain);
    mainContainer.insertBefore(remoteMain, mainContainer.firstChild);

    layout = this.getLayout();
  }

  // is left container ok?
  if(layout.left != remoteLayout.left){
    var left = document.getElementById(layout.left);
    var leftContainer = left.parentNode;
    var remoteLeft = document.getElementById(remoteLayout.left);
    var remoteLeftContainer = remoteLeft.parentNode;

    remoteLeftContainer.replaceChild(left, remoteLeft);
    leftContainer.insertBefore(remoteLeft, leftContainer.firstChild);

    layout = this.getLayout();
  }

  // is center container ok?
  // right will be automatically up to date then
  if(layout.center != remoteLayout.center){
    var center = document.getElementById(layout.center);
    var centerContainer = center.parentNode;
    var remoteCenter = document.getElementById(remoteLayout.center);
    var remoteCenterContainer = remoteCenter.parentNode;

    remoteCenterContainer.replaceChild(center, remoteLeft);
    centerContainer.insertBefore(remoteCenter, centerContainer.firstChild);

    layout = this.getLayout();
  }

  // is mode ok?
  if(layout.mode != remoteLayout.mode){
    this._3DContDblClickHandler();
  }

  // re-paint!
  viewer.documentRepaint();
}

viewer.Viewer.prototype.getLayout = function(){
  var layout = {};

  var contObj = document.getElementById('render3D');
  // full screen?
  // 0 : default
  // 1 : full screen
  layout.mode = (contObj.style.height == '100%') ? 1 : 0;
  // where are sliceX,Y,Z,3D?
  layout.main = viewer.firstChild(contObj).id;

  contObj = document.getElementById('sliceZ');
  layout.left = viewer.firstChild(contObj).id;

  contObj = document.getElementById('sliceX');
  layout.center = viewer.firstChild(contObj).id;

  contObj = document.getElementById('sliceY');
  layout.right = viewer.firstChild(contObj).id;

  return layout;
}

viewer.Viewer.prototype.setSelectedKeys = function(remoteSelectedKeys){

  //
  // synchronize fancytree
  //
  var tree = $('#' + this.treeContainerId).fancytree('getTree');
  var selectedKeys = this.getSelectedKeys();

  // get keys which have to be unselected
  var unselectKeys = selectedKeys.filter(function(val) {
    return remoteSelectedKeys.indexOf(val) == -1;
  });
  // and un-check it!
  for (var i=0; i < unselectKeys.length; i++) {
    var node = tree.getNodeByKey(unselectKeys[i]);
    node.setSelected(false);
  }

  // get keys which have to be selected
  var selectKeys = remoteSelectedKeys.filter(function(val) {
    return selectedKeys.indexOf(val) == -1;
  });
  // and check it!
  for (var i=0; i < selectKeys.length; i++) {
    var node = tree.getNodeByKey(selectKeys[i]);
    node.setSelected(true);
  }

}

// get the selected keys from the fancy tree
viewer.Viewer.prototype.getSelectedKeys = function(){
  // fancytree API
  var selectedNodes = $('#' + this.treeContainerId).fancytree('getTree').getSelectedNodes();
  var selectedKeys = [];

  // loopTrhough array and get keys ().key
  for (var i=0; i < selectedNodes.length; i++) {
    selectedKeys.push(selectedNodes[i].key);
  }

  return selectedKeys;
}

//Find the first child which is an element node
viewer.firstChild = function(DOMObj) {
  var x = DOMObj.firstChild;
  while ((x != null) && (x.nodeType != 1)) {
    x = x.nextSibling;
  }
  return x;
}

//repaint
viewer.documentRepaint = function() {
  var ev = document.createEvent('Event');
  ev.initEvent('resize', true, true);
  window.dispatchEvent(ev);
}
