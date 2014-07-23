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

  // try to create and initialize a 3D renderer
  this._webGLFriendly = true;
  try {
    this.create3DRenderer('vol3D');
  } catch (Exception) {
    this._webGLFriendly = false;
  }
  // create 2D renderers for the X, Y, Z orientations
  this.create2DRenderer('sliceX', 'X');
  this.create2DRenderer('sliceY', 'Y');
  this.create2DRenderer('sliceZ', 'Z');

  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  var self = this;
  this.sliceX.onShowtime = function() {
    // add the volume to the other 3 renderers
    self.sliceY.add(self.volume);
    self.sliceY.render();
    self.sliceZ.add(self.volume);
    self.sliceZ.render();

    // make sure to re-paint
    self.sliceX.update(self.volume);
    self.sliceY.update(self.volume);
    self.sliceZ.update(self.volume);

    if (self._webGLFriendly) {
      // no need to worry about the other showtimes
      self.vol3D.resetBoundingBox();
      self.createBBox();
      self.vol3D.add(self.volumeBBox);
      self.vol3D.add(self.volume);
      self.vol3D.camera.position = [0, 0, 200];
      self.vol3D.render();
    }
    // now the volume GUI widget
    if (!self.volWidget) {
      self.createVolWidget('xcontroller');
    } else {
      self.updateVolWidget();
    }
  };

  //Event handler for full screen behaviour when main container is double clicked
  document.getElementsByClassName('renderer main')[0].addEventListener('dblclick', self.on3DContDblClick.bind(self));

  //Event handlers for switching renderers
  document.getElementsByClassName('renderer left')[0].addEventListener('dblclick', self.on2DContDblClick.bind(self, 'left'));
  document.getElementsByClassName('renderer center')[0].addEventListener('dblclick', self.on2DContDblClick.bind(self, 'center'));
  document.getElementsByClassName('renderer right')[0].addEventListener('dblclick', self.on2DContDblClick.bind(self, 'right'));

}


viewer.Viewer.prototype.create3DRenderer = function(container) {
  this[container] = new X.renderer3D();
  this[container].bgColor = [.4, .5, .5];
  this[container].container = container;
  this[container].init();
  self = this;
  //3D renderer's ROTATE event handler (update the camera view)
  this[container].interactor.addEventListener(X.event.events.ROTATE,
    function(){self.updateSceneView();self.onCameraViewChange(self[container].camera.view);});

  //3D renderer's SCROLL event handler (update the camera view)
  this[container].interactor.addEventListener(X.event.events.SCROLL,
      function(){self.updateSceneView();self.onCameraViewChange(self[container].camera.view);});
  //3D renderer's SCROLL event handler (update the camera view)
  this[container].interactor.addEventListener(X.event.events.ZOOM,
      function(){self.updateSceneView();self.onCameraViewChange(self[container].camera.view);});
  this[container].interactor.addEventListener(X.event.events.PAN,
      function(){self.updateSceneView();self.onCameraViewChange(self[container].camera.view);});
}


viewer.Viewer.prototype.create2DRenderer = function(container, orientation) {
  this[container] = new X.renderer2D();
  this[container].container = container;
  this[container].bgColor = [.2, .2, .2];
  this[container].orientation = orientation;
  this[container].init();

  // we need to explicitly send volume info to peers if we changed slices/windowlevel/etc. through mouse action (not through the GUI)
  var self = this;
  this[container].interactor.addEventListener(X.event.events.SCROLL,
      function(){self.updateSceneView();self.collaborator.send('volumeInformationSent', self.getVolumeInformation());});
  this[container].interactor.addEventListener(X.event.events.ROTATE,
      function(){self.updateSceneView();self.collaborator.send('volumeInformationSent', self.getVolumeInformation());});
  this[container].interactor.addEventListener(X.event.events.ZOOM,
      function(){self.updateSceneView();self.onCameraViewChange(self[container].camera.view, container);});
  this[container].interactor.addEventListener(X.event.events.PAN,
      function(){self.updateSceneView();self.onCameraViewChange(self[container].camera.view, container);});
}


viewer.Viewer.prototype.createFileSelectTree = function(container) {
  var self = this;

  $('#' + self.treeContainerId).fancytree({
    checkbox: true,
    source: this.source,

    select: function(event, data) {
      var node = data.node;

      self.onFileTreeNodeSelect(node);
    },

    expand: function(event, data) {
      var node = data.node;

      self.onFileTreeNodeExpand(node);
    },

    collapse: function(event, data) {
      var node = data.node;

      self.onFileTreeNodeExpand(node);
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

  document.getElementById('sliceX').firstChild.style.visibility = 'visible';
  document.getElementById('sliceY').firstChild.style.visibility = 'visible';
  document.getElementById('sliceZ').firstChild.style.visibility = 'visible';

  this.sliceX.add(this.volume);
  // start the loading/rendering
  this.sliceX.render();
}


viewer.Viewer.prototype.unsetVolume = function() {
  // remove from the visualization
  if (this._webGLFriendly) {
    this['vol3D'].remove(this.volume);
    this['vol3D'].remove(this.volumeBBox);
  }

    this['sliceX'].remove(this.volume);
    this['sliceY'].remove(this.volume);
    this['sliceZ'].remove(this.volume);
    document.getElementById('sliceX').firstChild.style.visibility = 'hidden';
    document.getElementById('sliceY').firstChild.style.visibility = 'hidden';
    document.getElementById('sliceZ').firstChild.style.visibility = 'hidden';


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

viewer.Viewer.prototype.createInteractionFolder = function(){
  var root = this.volWidget.interaction;

  for (var i=0; i < this.interactionFolder.length; i++) {
    // create element
    root[this.interactionFolder[i].label] = root.add(this.volume, this.interactionFolder[i].target, this.interactionFolder[i].parameters.min, this.interactionFolder[i].parameters.max).name(this.interactionFolder[i].name).listen();
    // set value
    root[this.interactionFolder[i].label].setValue(this.volume[this.interactionFolder[i].target]);
    // connect callback
    root[this.interactionFolder[i].label].onChange(this.interactionFolder[i].callback.bind(this));
  }

}

viewer.Viewer.prototype.destroyInteractionFolder = function(){
  var root = this.volWidget.interaction;

  for (var i=0; i < this.interactionFolder.length; i++) {
    root.remove(root[this.interactionFolder[i].label]);
  }

}

viewer.Viewer.prototype.populateVolWidget = function() {
  // now we can configure controllers ..
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

  this.interactionFolder = [
    // {
    //   label: 'opacity',
    //   target: 'opacity',
    //   parameters: { 'min':0, 'max':1},
    //   name: 'Opacity',
    //   callback: function(){
    //     // emit message
    //     this.collaborator.send('volumeInformationSent', this.getVolumeInformation());
    //   }
    // },
    {
      label: 'lowerThresh',
      target: 'lowerThreshold',
      parameters: { 'min':this.volume.min, 'max':this.volume.max},
      name: 'lowThresh',
      callback: function(){
        // emit message
        this.collaborator.send('volumeInformationSent', this.getVolumeInformation());
      }
    },
    {
      label: 'upperThresh',
      target: 'upperThreshold',
      parameters: { 'min':this.volume.min, 'max':this.volume.max},
      name: 'upThresh',
      callback: function(){
        // emit message
        this.collaborator.send('volumeInformationSent', this.getVolumeInformation());
      }
    },
    {
      label: 'windowLow',
      target: 'windowLow',
      parameters: { 'min':this.volume.min, 'max':this.volume.max},
      name: 'winLow',
      callback: function(){
        // emit message
        this.collaborator.send('volumeInformationSent', this.getVolumeInformation());
      }
    },
    {
      label: 'windowHigh',
      target: 'windowHigh',
      parameters: { 'min':this.volume.min, 'max':this.volume.max},
      name: 'winHigh',
      callback: function(){
        // emit message
        this.collaborator.send('volumeInformationSent', this.getVolumeInformation());
      }
    },
    {
      label: 'sliceZ',
      target: 'indexZ',
      parameters: { 'min':0, 'max':this.volume.range[2] - 1},
      name: 'Blue slice',
      callback: function(){
        // emit message
        this.collaborator.send('volumeInformationSent', this.getVolumeInformation());
      }
    },
    {
      label: 'sliceX',
      target: 'indexX',
      parameters: { 'min':0, 'max':this.volume.range[0] - 1},
      name: 'Red slice',
      callback: function(){
        // emit message
        this.collaborator.send('volumeInformationSent', this.getVolumeInformation());
      }
    },
    {
      label: 'sliceY',
      target: 'indexY',
      parameters: { 'min':0, 'max':this.volume.range[1] - 1},
      name: 'Green slice',
      callback: function(){
        // emit message
        this.collaborator.send('volumeInformationSent', this.getVolumeInformation());
      }
    }
  ];


  //view mode
  this.createViewFolder();
  this.volWidget.view.open();
  // interaction mode
  this.createInteractionFolder();
  this.volWidget.interaction.open();
}


viewer.Viewer.prototype.updateVolWidget = function() {
  this.destroyViewFolder();
  this.destroyInteractionFolder();
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
    this['sliceX'].update(this.volume);
    this['sliceY'].update(this.volume);
    this['sliceZ'].update(this.volume);
    }

}


//COLLABORATION: Local and Remote event handlers
//Register remote actions with their local handlers
viewer.Viewer.prototype.connect = function(feedID){
  var self = this;

  // when TogetherJS is ready connect!
  window.addEventListener('CollaboratorReady',
  function(){
    var myId = self.collaborator.id;
    var sceneOwnerId = self.collaborator.roomOwnerId;

    window.console.log('myId: ', myId);
    window.console.log('sceneOwnerId: ', sceneOwnerId);
    self.collaborator.register('remoteViewerConnected', function(msgObj) {self.onRemoteViewerConnect(msgObj);});
    self.collaborator.register('sceneRequested', function(msgObj) {self.onRemoteSceneReceived(msgObj);});
    self.collaborator.register('volumeInformationSent', function(msgObj) {self.onRemoteVolumeInformationReceived(msgObj);});
    self.collaborator.register('cameraViewChanged', function(msgObj) {self.onRemoteCameraViewChange(msgObj);});
    self.collaborator.register('3DContDblClicked', function(msgObj) {self.onRemote3DContDblClick(msgObj);});
    self.collaborator.register('2DContDblClicked', function(msgObj) {self.onRemote2DContDblClick(msgObj);});
    self.collaborator.register('fileTreeNodeSelected', function(msgObj) {self.onRemoteFileTreeNodeSelect(msgObj);});
    self.collaborator.register('fileTreeNodeExpanded', function(msgObj) {self.onRemoteFileTreeNodeExpand(msgObj);});
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
    this.collaborator.send('sceneRequested', {receiverId: ids.receiverId, scene: self.getScene()});
  }
}


viewer.Viewer.prototype.onRemoteSceneReceived = function(msgObj){
  var dataObj = JSON.parse(msgObj.data);

  if (this.collaborator.id == dataObj.receiverId) {
    this.setScene(dataObj.scene);
  }
}

viewer.Viewer.prototype.onRemoteVolumeInformationReceived = function(msgObj){
  var dataObj = JSON.parse(msgObj.data);
  this.setVolumeInformation(dataObj);
}


viewer.Viewer.prototype.onFileTreeNodeExpand = function(node) {
  var data = {key: node.key, expanded: node.isExpanded()};

  this.collaborator.send('fileTreeNodeExpanded', data);
}


viewer.Viewer.prototype.onRemoteFileTreeNodeExpand = function(msgObj) {
  var data = JSON.parse(msgObj.data);

  window.console.log('received: ', data);
  node = this.fileSelectTree.getNodeByKey(data.key);
  if (node.isExpanded() != data.expanded) {
    node.setExpanded(data.expanded);
  }
}


viewer.Viewer.prototype.onFileTreeNodeSelect = function(node) {
  var data = {key: node.key, selected: node.isSelected()};

  this.collaborator.send('fileTreeNodeSelected', data);
  this._fileTreeNodeSelectHandler(node);
}


viewer.Viewer.prototype.onRemoteFileTreeNodeSelect = function(msgObj) {
  var data = JSON.parse(msgObj.data);

  window.console.log('received: ', data);
  node = this.fileSelectTree.getNodeByKey(data.key);
  if (node.isSelected() != data.selected) {
    node.setSelected(data.selected)
  }
}


viewer.Viewer.prototype._fileTreeNodeSelectHandler = function(node) {
  if (node.data.type == 'volume') {
    if (node.isSelected()) {
      if (this.volume != null) {
        var prevSelectedNode = this.fileSelectTree.getNodeByKey(this.volume.key);
        //uncheck previously selected volume node and call the select event
        prevSelectedNode.setSelected(false);
      }
      this.setVolume(node);
    } else {
      this.unsetVolume();
    }
  } else {
    if (node.isSelected()) {
      this.addGeomModel(node);
    } else {
      this.remGeomModel(node);
    }
  };
}


viewer.Viewer.prototype.on3DContDblClick = function() {
  var contHeight = this._3DContDblClickHandler();

  this.collaborator.send('3DContDblClicked', contHeight);
}


viewer.Viewer.prototype.onRemote3DContDblClick = function(msgObj) {
  var contHeight = JSON.parse(msgObj.data);
  var render3D = document.getElementsByClassName('renderer main')[0];

  window.console.log('received: ', contHeight);
  if (render3D.style.height != contHeight) {
    this._3DContDblClickHandler();
  }
}


viewer.Viewer.prototype._3DContDblClickHandler = function() {
  var render3D = document.getElementsByClassName('main renderer')[0];
  var render2D = document.getElementsByClassName('smallRenderers')[0];

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


viewer.Viewer.prototype.on2DContDblClick = function(cont) {
  this.collaborator.send('2DContDblClicked', cont);
  this._2DContDblClickHandler(cont);
}


viewer.Viewer.prototype.onRemote2DContDblClick = function(msgObj) {
  var cont = JSON.parse(msgObj.data);
  window.console.log('received: ', cont);
  this._2DContDblClickHandler(cont);
}

viewer.Viewer.prototype._2DContDblClickHandler = function(cont) {
  var contObj = document.getElementsByClassName('renderer ' + cont)[0];
  var twoDRenderer = viewer.firstChild(contObj);
  var threeD = document.getElementsByClassName('main renderer')[0];
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
viewer.Viewer.prototype.onCameraViewChange = function(dataObj, container){
  if (!container) {
    container = 'vol3D';
  }
  this.collaborator.send('cameraViewChanged', {data:dataObj, cont: container});
}


// remote camera view change handler
viewer.Viewer.prototype.onRemoteCameraViewChange = function(msgObj){

  window.console.log('received: ' + msgObj);
  window.console.log(this);

  var obj = JSON.parse(msgObj.data);
  var arr = $.map(obj.data, function(el) { return el; });
  this[obj.cont].camera.view = new Float32Array(arr);
}


viewer.Viewer.prototype.destroy = function(){
    // destroy the fancy tree
    $("#" + this.treeContainerId).fancytree("destroy");

    // listeners
    var self = this;
    document.getElementsByClassName('renderer main')[0].removeEventListener('dblclick', self.on3DContDblClick);
    document.getElementsByClassName('renderer left')[0].removeEventListener('dblclick', self.on2DContDblClick);
    document.getElementsByClassName('renderer center')[0].removeEventListener('dblclick', self.on2DContDblClick);
    document.getElementsByClassName('renderer right')[0].removeEventListener('dblclick', self.on2DContDblClick);

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
    this['sliceX'].destroy();
    this['sliceX'] = null;
    this['sliceY'].destroy();
    this['sliceY'] = null;
    this['sliceZ'].destroy();
    this['sliceZ'] = null;

  if(this.collaborator){
        window.console.log('destroying collaborator');
        this.collaborator.destroy();
        this.collaborator = null;
    }
}

viewer.Viewer.prototype.getScene = function(){
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

viewer.Viewer.prototype.setScene = function(sceneObj){
  // set objects selection
  this.setSelectedKeys(sceneObj.selectedKeys);

  // set layout
  this.setLayout(sceneObj.layout);

  // set view
  this.setView(sceneObj.view);
}

viewer.Viewer.prototype.setVolumeInformation = function(remoteVolumeInformation){

  // if remote view, update the targets
  // when the widget is created, it will set the values from there
  for (var i=0; i < remoteVolumeInformation.length; i++) {
    // if not loaded yet
    this.volume[remoteVolumeInformation[i].target] = remoteVolumeInformation[i].value;
  }

}

viewer.Viewer.prototype.getVolumeInformation = function(){
  var volumeInfObj = [];

  if(typeof(this.volWidget) != 'undefined' && this.volWidget != null){
    var root = this.volWidget.interaction;

    for (var i=0; i < this.interactionFolder.length; i++) {
      volumeInfObj.push({
        'label': this.interactionFolder[i].label,
        'value': this.volume[this.interactionFolder[i].target],
        'target': this.interactionFolder[i].target
      });
    }
  }

  return volumeInfObj;
}


viewer.Viewer.prototype.setView = function(remoteView){
  var view = this.getView();

  // if local view, update the widget from remote
  if(view.length == remoteView.length){
    for (var i=0; i < view.length; i++) {
      // if loaded
      if(typeof(this.volWidget) != 'undefined' &&
        this.volWidget != null &&
        view[i].label == remoteView[i].label &&
        view[i].value != remoteView[i].value){
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

  var contObj = document.getElementsByClassName('renderer main')[0];
  // full screen?
  // 0 : default
  // 1 : full screen
  layout.mode = (contObj.style.height == '100%') ? 1 : 0;
  // where are sliceX,Y,Z,3D?
  layout.main = viewer.firstChild(contObj).id;

  contObj = document.getElementsByClassName('renderer left')[0];
  layout.left = viewer.firstChild(contObj).id;

  contObj = document.getElementsByClassName('renderer center')[0];
  layout.center = viewer.firstChild(contObj).id;

  contObj = document.getElementsByClassName('renderer right')[0];
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
    node.setActive(false);
  }

  // get keys which have to be selected
  var selectKeys = remoteSelectedKeys.filter(function(val) {
    return selectedKeys.indexOf(val) == -1;
  });
  // and check it!
  for (var i=0; i < selectKeys.length; i++) {
    var node = tree.getNodeByKey(selectKeys[i]);
    node.setSelected(true);
    node.setActive(true);
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
