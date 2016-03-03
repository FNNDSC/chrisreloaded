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


  //
  this.shiftDown = false;
  this.onWindowKeyPressed = this.onWindowKeyPressed.bind(this)
  window.addEventListener('keydown', this.onWindowKeyPressed, false);
  window.addEventListener('keyup', this.onWindowKeyPressed, false);

  // GUI
  this.redVolWidget = null;
  this.greenVolWidget = null;
  this.blueVolWidget = null;
  //this.stackFolder = null;
  this.redFolder = null;
  this.greenFolder = null;
  this.blueFolder = null;

  this.maximized = false;

  // GO THREEJS
  this.requestAnimationFrameID = null;
  this.stack = null;
  this.redStackHelper = null;
  this.greenStackHelper = null;
  this.blueStackHelper = null;

  this.redThreeD = document.getElementById('first');
  this.greenThreeD = document.getElementById('second');
  this.blueThreeD = document.getElementById('third');

  this.redRenderer = new THREE.WebGLRenderer({
    antialias: true
  });
  this.redRenderer.setSize(this.redThreeD.clientWidth, this.redThreeD.clientHeight);
  this.redRenderer.setClearColor(0x212121, 1);
  this.redThreeD.appendChild(this.redRenderer.domElement);
  
  this.greenRenderer = new THREE.WebGLRenderer({
    antialias: true
  });
  this.greenRenderer.setSize(this.greenThreeD.clientWidth, this.greenThreeD.clientHeight);
  this.greenRenderer.setClearColor(0x212121, 1);
  this.greenThreeD.appendChild(this.greenRenderer.domElement);

  this.blueRenderer = new THREE.WebGLRenderer({
    antialias: true
  });
  this.blueRenderer.setSize(this.blueThreeD.clientWidth, this.blueThreeD.clientHeight);
  this.blueRenderer.setClearColor(0x212121, 1);
  this.blueThreeD.appendChild(this.blueRenderer.domElement);

  // new scene
  this.redScene = new THREE.Scene();
  this.greenScene = new THREE.Scene();
  this.blueScene = new THREE.Scene();
  // new camera
  this.VJS = VJS.default;
  this.redCamera = new this.VJS.Cameras.Orthographic(this.redThreeD.clientWidth / -2, this.redThreeD.clientWidth / 2, this.redThreeD.clientHeight / 2, this.redThreeD.clientHeight / -2, 0.1, 10000);
  this.greenCamera = new this.VJS.Cameras.Orthographic(this.greenThreeD.clientWidth / -2, this.greenThreeD.clientWidth / 2, this.greenThreeD.clientHeight / 2, this.greenThreeD.clientHeight / -2, 0.1, 10000);
  this.blueCamera = new this.VJS.Cameras.Orthographic(this.blueThreeD.clientWidth / -2, this.blueThreeD.clientWidth / 2, this.blueThreeD.clientHeight / 2, this.blueThreeD.clientHeight / -2, 0.1, 10000);
  
  // helpers vars for the GUI
  // put those guys in an object
  this.invertRows = false;
  this.invertColumns = false;
  this.rotate = false;
  
  // new controls
  this.redControls = new this.VJS.Controls.TrackballOrtho(this.redCamera, this.redThreeD);
  this.redControls.staticMoving = true;
  this.redControls.noRotate = true;
  
  this.greenControls = new this.VJS.Controls.TrackballOrtho(this.greenCamera, this.greenThreeD);
  this.greenControls.staticMoving = true;
  this.greenControls.noRotate = true;
  
  this.blueControls = new this.VJS.Controls.TrackballOrtho(this.blueCamera, this.blueThreeD);
  this.blueControls.staticMoving = true;
  this.blueControls.noRotate = true;

  // start rendering loop...
  this.animate();

  // connect scroll event
  this.redOnScroll = this.onScroll.bind(this, 'red', 'z');
  this.redControls.addEventListener('OnScroll', this.redOnScroll);
  this.greenOnScroll = this.onScroll.bind(this, 'green', 'x');
  this.greenControls.addEventListener('OnScroll', this.greenOnScroll);
  this.blueOnScroll = this.onScroll.bind(this, 'blue', 'y');
  this.blueControls.addEventListener('OnScroll', this.blueOnScroll);

  // connect resize event
  this.onWindowResize = this.onWindowResize.bind(this);
  window.addEventListener('resize', this.onWindowResize, false);
  
  //file selection widget
  this.fileSelectWidget = null;
  this.treeContainerId = 'tree';
  this.createFileSelectTree(this.treeContainerId);

  // directly show object if there is only 1 element in tree
  if(jsonObj.length === 0){
    return;
  }

  var root = jsonObj['0'];
  var key = '-1';

  while( typeof(root.children) !== 'undefined' && root.children.length == 1){
    if(typeof(root.children[0].type) !== 'undefined'){
      key = root.children[0].key;
      break;
    }
    root =  root.children[0];
  }

  if(key !== '-1'){
    node = this.fileSelectTree.getNodeByKey(key);
    node.setSelected(true);
  }

  // 
  

  //Event handlers for switching renderers
  this.on2DContDblClickBindRed = this.on2DContDblClick.bind(this, 'red');
  document.getElementById('first').
    addEventListener('dblclick', this.on2DContDblClickBindRed);
  this.on2DContDblClickBindGreen = this.on2DContDblClick.bind(this, 'green');
  document.getElementById('second').
    addEventListener('dblclick', this.on2DContDblClickBindGreen);
  this.on2DContDblClickBindBlue = this.on2DContDblClick.bind(this, 'blue');
  document.getElementById('third').
    addEventListener('dblclick', this.on2DContDblClickBindBlue);

  // Event handler to 
  this.on2DContMoveBindRed = this.on2DContMove.bind(this, 'red');
  document.getElementById('first').
    addEventListener('mousemove', this.on2DContMoveBindRed);
  this.on2DContMoveBindGreen = this.on2DContMove.bind(this, 'green');
  document.getElementById('second').
    addEventListener('mousemove', this.on2DContMoveBindGreen);
  this.on2DContMoveBindBlue = this.on2DContMove.bind(this, 'blue');
  document.getElementById('third').
    addEventListener('mousemove', this.on2DContMoveBindBlue);
}

viewer.Viewer.prototype.onWindowKeyPressed = function(event){
  this.shiftDown = event.shiftKey;
}

viewer.Viewer.prototype.on2DContMove = function(color, event){

  if(!this.shiftDown){
    return;
  }
  //
  var colors = ['red', 'green', 'blue'];
  var index = colors.indexOf(color);
  if (index > -1) {
    colors.splice(index, 1);
  }

  // raycast
  var container = document.getElementById(color);

  var mouse = {
      x: (event.offsetX / container.clientWidth) * 2 - 1,
      y: -(event.offsetY / container.clientHeight) * 2 + 1
    };

  // update the raycaster
  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, this[color + 'Camera']);
  var intersects = raycaster.intersectObject(this[color + 'StackHelper'].slice, true);

  if(intersects.length > 0){
    // to IJK...
    intersects[0].point.applyMatrix4(this.stack.lps2IJK);

    for(var i=0; i<=colors.length; i++){
      if(colors[i] === 'red'){
        this.redStackHelper.index = Math.round(intersects[0].point.z);
      }

      if(colors[i] === 'green'){
        this.greenStackHelper.index = Math.round(intersects[0].point.x);
      }

      if(colors[i] === 'blue'){
        this.blueStackHelper.index = Math.round(intersects[0].point.y);
      }
    }
  }

}

viewer.Viewer.prototype.on2DContDblClick = function(cont){
  var renderers = ['red', 'green', 'blue'];
  var index = renderers.indexOf(cont);
  if (index > -1) {
    renderers.splice(index, 1);
  }

  var target = document.getElementById(cont);

  if (target.style.width == '100%') {
    // update target
    if(cont === 'red'){
      target.style.width = '34%';
    }
    else{
      target.style.width = '33%';
    }

    // update the rest
    for(var i = 0; i<renderers.length; i++){
      document.getElementById(renderers[i]).style.display = 'block';
    }

    this.maximized = false;
  } else {
    // update target
    target.style.width = '100%';
    // update the rest
    for(var i = 0; i<renderers.length; i++){
      document.getElementById(renderers[i]).style.display = 'none';
    }

    this.maximized = true;
  }

  this.onWindowResize();
}

viewer.Viewer.prototype.animate = function(){
  if(this.redControls && this.redRenderer && this.redScene && this.redCamera){

    this.redControls.update();
    this.redRenderer.render(this.redScene, this.redCamera);
    
    this.greenControls.update();
    this.greenRenderer.render(this.greenScene, this.greenCamera);
    
    this.blueControls.update();
    this.blueRenderer.render(this.blueScene, this.blueCamera);

    // request new frame
    var self = this;
    this.requestAnimationFrameID = requestAnimationFrame(function() {
      self.animate();
    });
  }
}

viewer.Viewer.prototype.onScroll = function(color, axis, e){
  if(this[color + 'StackHelper'] && this.stack){
    if (e.delta > 0) {
      if (this[color + 'StackHelper'].index >= this.stack.dimensionsIJK[axis] - 1) {
        return false;
      }
      this[color + 'StackHelper'].index += 1;
    } else {
      if (this[color + 'StackHelper'].index <= 0) {
        return false;
      }
      this[color + 'StackHelper'].index -= 1;
    }
  }
}
  
// connect resize event
viewer.Viewer.prototype.onWindowResize = function() {

    //
  var fullscreen = (document.getElementById('left').style.display === 'none');
  if(fullscreen){
    
    if(!this.maximized){
      document.getElementById('red').style.width = '34%';
      document.getElementById('green').style.display = 'block';
      document.getElementById('blue').style.display = 'block';
    }

  }
  else{
    document.getElementById('red').style.width = '100%';
    document.getElementById('red').style.display = 'block';
    document.getElementById('green').style.width = '33%';
    document.getElementById('green').style.display = 'none';
    document.getElementById('blue').style.width = '33%';
    document.getElementById('blue').style.display = 'none';

    this.maximized = false;

  }

  if( this.redCamera && this.redThreeD && this.redControls && this.redCamera.box ){
    
    var camFactor = 2;

    this.redCamera.left = -this.redThreeD.clientWidth / camFactor;
    this.redCamera.right = this.redThreeD.clientWidth / camFactor;
    this.redCamera.top = this.redThreeD.clientHeight / camFactor;
    this.redCamera.bottom = -this.redThreeD.clientHeight / camFactor;
    this.redCamera.updateProjectionMatrix();

    this.redCamera.adjust([this.redThreeD.clientWidth, this.redThreeD.clientHeight], 2);

    this.redControls.handleResize();
    this.redRenderer.setSize(this.redThreeD.clientWidth, this.redThreeD.clientHeight);

    this.greenCamera.left = -this.greenThreeD.clientWidth / camFactor;
    this.greenCamera.right = this.greenThreeD.clientWidth / camFactor;
    this.greenCamera.top = this.greenThreeD.clientHeight / camFactor;
    this.greenCamera.bottom = -this.greenThreeD.clientHeight / camFactor;
    this.greenCamera.updateProjectionMatrix();

    this.greenCamera.adjust([this.greenThreeD.clientWidth, this.greenThreeD.clientHeight], 2);

    this.greenControls.handleResize();
    this.greenRenderer.setSize(this.greenThreeD.clientWidth, this.greenThreeD.clientHeight);

    this.blueCamera.left = -this.blueThreeD.clientWidth / camFactor;
    this.blueCamera.right = this.blueThreeD.clientWidth / camFactor;
    this.blueCamera.top = this.blueThreeD.clientHeight / camFactor;
    this.blueCamera.bottom = -this.blueThreeD.clientHeight / camFactor;
    this.blueCamera.updateProjectionMatrix();

    this.blueCamera.adjust([this.blueThreeD.clientWidth, this.blueThreeD.clientHeight], 2);

    this.blueControls.handleResize();
    this.blueRenderer.setSize(this.blueThreeD.clientWidth, this.blueThreeD.clientHeight);
  }
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

viewer.Viewer.prototype.onFileTreeNodeExpand = function(node) {
  var data = {key: node.key, expanded: node.isExpanded()};
}

viewer.Viewer.prototype.setVolume = function(nodeObj) {
  var orderedFiles, files, url;

  url = nodeObj.data.url;

  // for the dicom format, files is a list of strings
  // for other formats it's a list with just a single string
  files = nodeObj.data.files;
  orderedFiles = files.sort().map(function(str) {
      return url + '/' + str;});

  // classic VJS...
  function mergeSeries(series) {
    var mergedHelpers = [series[0]];
    for (var k = 0; k < series.length; k++) {
      // test image against existing imagess
      for (var j = 0; j < mergedHelpers.length; j++) {
        if (mergedHelpers[j].merge(series[k])) {
          // merged successfully
          break;
        } else if (j === mergedHelpers.length - 1) {
          // last merge was not successful
          // this is a new series
          mergedHelpers.push(series[k]);
        }
      }
    }

    return mergedHelpers;
  }

  // reset loader/manager progress
  requestAnimationFrame(function(){
    document.getElementById('manager').style.borderWidth = '1px';
    document.getElementById('loader').style.borderWidth = '1px';
  });

  var loader = new this.VJS.Loaders.Dicom();
  var seriesContainer = [];
  var loadSequence = [];
  orderedFiles.forEach(function(url) {
    loadSequence.push(
      Promise.resolve()
      // fetch the file
      .then(function() {
        return loader.fetch(url);
      })
      .then(function(data) {
        return loader.parse(data);
      })
      .then(function(series) {
        seriesContainer.push(series);
        // could also update the manager's status
        var progress = (seriesContainer.length / files.length) * 100;
        document.getElementById('manager').style.width = progress + '%';
      })
      .catch(function(error) {
        window.console.log('oops... something went wrong...');
        window.console.log(error);
      })
    );
  });
  var self = this;
  Promise
  .all(loadSequence)
  .then(function() {
    requestAnimationFrame(function(){
      // cleanup load bar
      document.getElementById('manager').style.width = '0%';
      document.getElementById('manager').style.borderWidth = '0px';
      document.getElementById('loader').style.width = '0%';
      document.getElementById('loader').style.borderWidth = '0px';
    });

    self.stack  = mergeSeries(seriesContainer)[0].stack[0];
    
    self.redStackHelper = new self.VJS.Helpers.Stack(self.stack);
    self.redStackHelper.orientation = 0;
    self.redStackHelper.bbox.visible = false;
    self.redStackHelper.border.visible = false;
    self.redScene.add(self.redStackHelper);
    
    self.greenStackHelper = new self.VJS.Helpers.Stack(self.stack);
    self.greenStackHelper.orientation = 1;
    self.greenStackHelper.index = Math.floor(self.stack.halfDimensionsIJK.x);
    self.greenStackHelper.bbox.visible = false;
    self.greenStackHelper.border.visible = false;
    self.greenScene.add(self.greenStackHelper);
    
    self.blueStackHelper = new self.VJS.Helpers.Stack(self.stack);
    self.blueStackHelper.orientation = 2;
    self.blueStackHelper.index = Math.floor(self.stack.halfDimensionsIJK.y);
    self.blueStackHelper.bbox.visible = false;
    self.blueStackHelper.border.visible = false;
    self.blueScene.add(self.blueStackHelper);

    // setup camera orientation/position...
    var lpsDims = self.stack.worldDims();
    var lpsCenter = self.stack.worldCenter();

    var ray = {position: null, direction: null};
    ray.position = lpsCenter.clone();
    ray.direction = self.stack.zCosine.clone();

    var  box = {halfDimensions: null, center: null};
    box.center = lpsCenter.clone();
    box.halfDimensions = new THREE.Vector3(lpsDims.x + 4, lpsDims.y + 4, lpsDims.z + 4);

    self.redCamera.init(self.stack.xCosine, self.stack.yCosine, self.stack.zCosine, self.redControls, box);
    self.redCamera.adjust([self.redThreeD.clientWidth, self.redThreeD.clientHeight], 2);

    self.greenCamera.init(self.stack.yCosine, self.stack.zCosine, self.stack.xCosine, self.greenControls, box);
    self.greenCamera.adjust([self.greenThreeD.clientWidth, self.greenThreeD.clientHeight], 2);

    self.blueCamera.init(self.stack.zCosine, self.stack.xCosine, self.stack.yCosine, self.blueControls, box);
    self.blueCamera.adjust([self.blueThreeD.clientWidth, self.blueThreeD.clientHeight], 2);

    //
    //self.camera.invertColumns();
    //self.camera.invertRows();

    self.onWindowResize();

    // CREATE LUT
    // after...

    self.stack.file = orderedFiles;
    self.stack.key = nodeObj.key;
    
    // now the volume GUI widget
    if (!self.redVolWidget) {
      self.createVolWidget('xcontroller');
    } else {
      self.updateVolWidget();
    }
  });
}


viewer.Viewer.prototype.unsetVolume = function() {
  // remove stack from scene
  this.redScene.remove(this.redStackHelper);
  this.redStackHelper = null;
  
  this.greenScene.remove(this.greenStackHelper);
  this.greenStackHelper = null;
  
  this.blueScene.remove(this.blueStackHelper);
  this.blueStackHelper = null;
  
  this.stack = null;
}


viewer.Viewer.prototype.updateVolume = function() {
  if(this.stack != null){
    var nodeObj = this.fileSelectTree.getNodeByKey(this.stack.key);
    this.unsetVolume();
    this.setVolume(nodeObj);
  }
}

viewer.Viewer.prototype.createVolWidget = function(container) {
    // first
    this.redVolWidget = new dat.GUI({ autoPlace: false, width: "100%" });
    var redCustomContainer = document.getElementById("redControls");
    redCustomContainer.appendChild(this.redVolWidget.domElement);
    this.redVolWidget.container = redCustomContainer;
    this.redFolder = this.redVolWidget.addFolder('Slice');

    //second
    this.greenVolWidget = new dat.GUI({ autoPlace: false, width: "100%" });
    var greenCustomContainer = document.getElementById("greenControls");
    greenCustomContainer.appendChild(this.greenVolWidget.domElement);
    this.greenVolWidget.container = greenCustomContainer;
    this.greenFolder = this.greenVolWidget.addFolder('Slice');

    // third
    this.blueVolWidget = new dat.GUI({ autoPlace: false, width: "100%" });
    var blueCustomContainer = document.getElementById("blueControls");
    blueCustomContainer.appendChild(this.blueVolWidget.domElement);
    this.blueVolWidget.container = blueCustomContainer;
    this.blueFolder = this.blueVolWidget.addFolder('Slice');

    //this.stackFolder = this.redVolWidget.addFolder('Stack');
    this.populateVolWidget();
}

viewer.Viewer.prototype.updateVolWidget = function() {
  //this.destroyStackFolder();
  this.destroyColorFolder('red');
  this.destroyColorFolder('green');
  this.destroyColorFolder('blue');
  this.populateVolWidget();
}

viewer.Viewer.prototype.populateVolWidget = function(){
  
  // STACK
  //
  //this.createStackFolder();
  //this.stackFolder.open();

  // RED, GREEN and BLUE
  //
  this.createColorFolder('red', this.stack.dimensionsIJK.z - 1);
  this.redFolder.open();
  this.createColorFolder('green', this.stack.dimensionsIJK.x - 1);
  this.greenFolder.open();
  this.createColorFolder('blue', this.stack.dimensionsIJK.y - 1);
  this.blueFolder.open();

}

viewer.Viewer.prototype.createStackFolder = function(){

  var self = this;

  this.stackFolder.windowWidth = this.stackFolder.add(this.redStackHelper.slice, 'windowWidth', 1, this.stack.minMax[1]).step(1).listen();
  this.stackFolder.windowWidth.onChange(function(value){
    self.redStackHelper.slice.windowWidth = value;
    self.greenStackHelper.slice.windowWidth = value;
    self.blueStackHelper.slice.windowWidth = value;
  });

  this.stackFolder.windowCenter = this.stackFolder.add(this.redStackHelper.slice, 'windowCenter', this.stack.minMax[0], this.stack.minMax[1]).step(1).listen();
  this.stackFolder.windowCenter.onChange(function(value){
    self.redStackHelper.slice.windowCenter = value;
    self.greenStackHelper.slice.windowCenter = value;
    self.blueStackHelper.slice.windowCenter = value;
  });

  this.stackFolder.intensityAuto = this.stackFolder.add(this.redStackHelper.slice, 'intensityAuto');
  this.stackFolder.intensityAuto.onChange(function(value){
    self.redStackHelper.slice.intensityAuto = value;
    self.greenStackHelper.slice.intensityAuto = value;
    self.blueStackHelper.slice.intensityAuto = value;
  });

  this.stackFolder.invert = this.stackFolder.add(this.redStackHelper.slice, 'invert');
  this.stackFolder.invert.onChange(function(value){
    self.redStackHelper.slice.invert = value;
    self.greenStackHelper.slice.invert = value;
    self.blueStackHelper.slice.invert = value;
  });

}

viewer.Viewer.prototype.destroyStackFolder = function(){

  this.stackFolder.remove(this.stackFolder.windowWidth);
  this.stackFolder.remove(this.stackFolder.windowCenter);
  this.stackFolder.remove(this.stackFolder.intensityAuto);
  this.stackFolder.remove(this.stackFolder.invert);

}

viewer.Viewer.prototype.createColorFolder = function(color, maxIndex){

  var self = this;

  this[color + 'Folder'].index = this[color + 'Folder'].add(this[color + 'StackHelper'], 'index', 0, maxIndex).step(1).listen();
  this[color + 'Folder'].invertRows = this[color + 'Folder'].add(this, 'invertRows');
  this[color + 'Folder'].invertRows.onChange(function(){
    self[color + 'Camera'].invertRows();
  });

  this[color + 'Folder'].invertColumns = this[color + 'Folder'].add(this, 'invertColumns');
  this[color + 'Folder'].invertColumns.onChange(function(){
    self[color + 'Camera'].invertColumns();
  });

  this[color + 'Folder'].rotate = this[color + 'Folder'].add(this, 'rotate');
  this[color + 'Folder'].rotate.onChange(function(){
      self[color + 'Camera'].rotate();
  });

}

viewer.Viewer.prototype.destroyColorFolder = function(color){
  this[color + 'Folder'].remove(this[color + 'Folder'].index);
  this[color + 'Folder'].remove(this[color + 'Folder'].invertRows);
  this[color + 'Folder'].remove(this[color + 'Folder'].invertColumns);
  this[color + 'Folder'].remove(this[color + 'Folder'].rotate);
}

viewer.Viewer.prototype.onFileTreeNodeSelect = function(node) {
  var data = {key: node.key, selected: node.isSelected()};
  this._fileTreeNodeSelectHandler(node);
}

viewer.Viewer.prototype._fileTreeNodeSelectHandler = function(node) {
  if (node.data.type == 'volume') {
    if (node.isSelected()) {
      if (this.stack != null) {
        var prevSelectedNode = this.fileSelectTree.getNodeByKey(this.stack.key);
        //uncheck previously selected volume node and call the select event
        prevSelectedNode.setSelected(false);
      }
      this.setVolume(node);
    } else {
      this.unsetVolume();
    }
  };
}


viewer.Viewer.prototype.destroy = function(){

    // destroy it
    // destroy the fancy tree
    this.fileSelectTree = $('#' + this.treeContainerId).fancytree();
    if(this.fileSelectTree){
      $("#" + this.treeContainerId).fancytree("destroy");
    }
    //
    window.removeEventListener('keydown', this.onWindowKeyPressed);
    window.removeEventListener('keyup', this.onWindowKeyPressed);

    // listeners
    document.getElementById('first').removeEventListener('dblclick', this.on2DContDblClickBindRed);
    document.getElementById('second').removeEventListener('dblclick', this.on2DContDblClickBindGreen);
    document.getElementById('third').removeEventListener('dblclick', this.on2DContDblClickBindBlue);

    document.getElementById('first').removeEventListener('mousemove', this.on2DContMoveBindRed);
    document.getElementById('second').removeEventListener('mousemove', this.on2DContMoveBindGreen);
    document.getElementById('third').removeEventListener('mousemove', this.on2DContMoveBindBlue);


    // connect resize event
    window.removeEventListener('resize', this.onWindowResize);

    // controller widget must be destroyed if any!
    if(this.redVolWidget != null){
        this.redVolWidget.container.removeChild(this.redVolWidget.container.lastChild);
        this.redVolWidget = null;

        this.greenVolWidget.container.removeChild(this.greenVolWidget.container.lastChild);
        this.greenVolWidget = null;

        this.blueVolWidget.container.removeChild(this.blueVolWidget.container.lastChild);
        this.blueVolWidget = null;

        //this.stackFolder = null;
        this.redFolder = null;
        this.greenFolder = null;
        this.blueFolder = null;
    }

    // delete stack and stackHelper...
    if(this.stack != null){
        this.unsetVolume();
    }
    
    this.dispose('red');
    this.dispose('green');
    this.dispose('blue');

    window.cancelAnimationFrame(this.requestAnimationFrameID);
    this.requestAnimationFrameID = null;
}

viewer.Viewer.prototype.dispose = function(color){
  this[color + 'Scene'] = null;
  this[color + 'Renderer'].forceContextLoss();
  this[color + 'Renderer'].dispose();
  this[color + 'Renderer'] = null;
  this[color + 'Controls'].removeEventListener('OnScroll', this[color + 'OnScroll']);
  this[color + 'Controls'].dispose();
  this[color + 'Controls'] = null;
  this[color + 'Camera'] = null;
  this[color + 'ThreeD'].removeChild(this[color + 'ThreeD'].firstChild);
  this[color + 'ThreeD'].firstChild = null;
  this[color + 'ThreeD'] = null;
}
