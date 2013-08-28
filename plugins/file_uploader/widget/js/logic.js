// inspired by:
// http://www.thecssninja.com/javascript/gmail-upload

// DEFINE NAMESPACE
var _CHRIS_INTERACTIVE_PLUGIN_ = _CHRIS_INTERACTIVE_PLUGIN_ || {};

_CHRIS_INTERACTIVE_PLUGIN_.init = function() {
  // set global variables
  _CHRIS_INTERACTIVE_PLUGIN_.body = document.getElementsByTagName("body")[0];
  _CHRIS_INTERACTIVE_PLUGIN_.dropListing = document.getElementById("output-listing01");
  _CHRIS_INTERACTIVE_PLUGIN_.dropArea = document.getElementById("drop");
  _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea = document.getElementById("dropmask");
  _CHRIS_INTERACTIVE_PLUGIN_.dropLoad = document.getElementById("dropload");
  _CHRIS_INTERACTIVE_PLUGIN_.dropReady = document.getElementById("dropready");
  _CHRIS_INTERACTIVE_PLUGIN_.targetFeed = null
  _CHRIS_INTERACTIVE_PLUGIN_.count = 0;
  _CHRIS_INTERACTIVE_PLUGIN_.countStyle = 0;
  _CHRIS_INTERACTIVE_PLUGIN_.targetFiles = null;

  // attach events
  _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("dragenter",_CHRIS_INTERACTIVE_PLUGIN_.onDragEnter, false);
  _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("dragleave",_CHRIS_INTERACTIVE_PLUGIN_.onDrageLeave, false);
  _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("dragexit",_CHRIS_INTERACTIVE_PLUGIN_.onDrageLeave, false);
  _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("dragover",_CHRIS_INTERACTIVE_PLUGIN_.onDragOver, false);
  _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("drop", _CHRIS_INTERACTIVE_PLUGIN_.onDrop, false);
  _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("dragend", _CHRIS_INTERACTIVE_PLUGIN_.onDrop, false);

}

_CHRIS_INTERACTIVE_PLUGIN_.submitted = function(val) {
  // let's go! Feed has been created (update UI to let user know we are ready)
  // we need to create the feed first to have a container to put the images
  _CHRIS_INTERACTIVE_PLUGIN_.targetFeed = val.split("\n")[1];

  _CHRIS_INTERACTIVE_PLUGIN_.handleFiles(_CHRIS_INTERACTIVE_PLUGIN_.targetFiles);

}

// important in chrome, if not drag and drop do NOT work
_CHRIS_INTERACTIVE_PLUGIN_.onDragOver = function (e) {
  e.stopPropagation();
  e.preventDefault();
};

_CHRIS_INTERACTIVE_PLUGIN_.onDragEnter = function (e) {
  e.stopPropagation();
  e.preventDefault();

  _CHRIS_INTERACTIVE_PLUGIN_.dropArea.style.border = "5px dashed grey";
};

_CHRIS_INTERACTIVE_PLUGIN_.onDrageLeave = function (e) {
  e.stopPropagation();
  e.preventDefault();

  _CHRIS_INTERACTIVE_PLUGIN_.dropArea.style.border = "1px solid #8D8D8D";
};

_CHRIS_INTERACTIVE_PLUGIN_.onDrop = function (e) {
  e.stopPropagation();
  e.preventDefault();
  // reset style
  _CHRIS_INTERACTIVE_PLUGIN_.dropArea.style.border = "1px solid #8D8D8D";

  if(_CHRIS_INTERACTIVE_PLUGIN_.count == 0){
    // store reference to files
    _CHRIS_INTERACTIVE_PLUGIN_.targetFiles = e.dataTransfer.files;
    // style output (for user interaction)
    _CHRIS_INTERACTIVE_PLUGIN_.handleStyle(e.dataTransfer.files);
    // create the feed
    _CHRIS_INTERACTIVE_PLUGIN_.force = true;
    document.getElementById("plugin_submit").click();
    return;
  }
  // do sth with those files!
  _CHRIS_INTERACTIVE_PLUGIN_.handleStyle(e.dataTransfer.files);
  _CHRIS_INTERACTIVE_PLUGIN_.handleFiles(e.dataTransfer.files);
};

_CHRIS_INTERACTIVE_PLUGIN_.handleStyle = function (files) {
  var filesFragment = document.createDocumentFragment();
  var domElements = [];
        
  _CHRIS_INTERACTIVE_PLUGIN_.dropListing.style.display = "block";
       
  for(var i = 0, len = files.length; i < len; i++) {
    // Stop people trying to upload massive files don't need for demo to work
    // 100Mb limit
    //sudo vim /etc/php5/apache2/php.ini 
    //[toor@chris:x86_64-Linux]/var$>sudo service apache2 restart
    // upload_max_filesize = 100M
    // post_max_size = 120M
    if(files[i].size < 838860800) {
      domElements = [
        document.createElement('div'),
        document.createElement('span')];
            
      domElements[1].appendChild(document.createTextNode(files[i].name + " (" + Math.round((files[i].size/1024*100000)/100000)+"K) "));
      domElements[0].id = "item"+_CHRIS_INTERACTIVE_PLUGIN_.countStyle;
      domElements[0].appendChild(domElements[1]);
            
      filesFragment.appendChild(domElements[0]);

      // progress bar
      var progressDomElements = [
          document.createElement('div'),
          document.createElement('div')];
        
      progressDomElements[0].className = "loader01";
      progressDomElements[0].appendChild(progressDomElements[1]);
      domElements[0].appendChild(progressDomElements[0]);

      _CHRIS_INTERACTIVE_PLUGIN_.dropListing.appendChild(filesFragment);

      _CHRIS_INTERACTIVE_PLUGIN_.countStyle++;
    } else {
        alert("The file you are trying to upload is too BIG (100Mb max)");
    }
  }
};

_CHRIS_INTERACTIVE_PLUGIN_.handleFiles = function (files) {
       
  for(var i = 0, len = files.length; i < len; i++) {
   
      _CHRIS_INTERACTIVE_PLUGIN_.processXHR(files[i], _CHRIS_INTERACTIVE_PLUGIN_.count);
      _CHRIS_INTERACTIVE_PLUGIN_.count++;
  }
};
      
_CHRIS_INTERACTIVE_PLUGIN_.processXHR = function (file, index) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'api.php', true);

  var data = new FormData();
  data.append('targetFeed', _CHRIS_INTERACTIVE_PLUGIN_.targetFeed);
  data.append('action', 'add');
  data.append('what', 'file');
  data.append(file.name, file);

  var container = document.getElementById("item"+index);
  var loader = document.getElementsByClassName("loader01");
  var fileUpload = xhr.upload;
        
  fileUpload.addEventListener("progress", function(event) {
    if (event.lengthComputable) {
      var percentage = Math.round((event.loaded * 100) / event.total),
      loaderIndicator = container.firstChild.nextSibling.firstChild;
      if (percentage < 100) {
        loaderIndicator.style.width = percentage + "%";
      }
    }
  }, false);
        
  fileUpload.addEventListener("load", function(event) {
   loader[index].style.display = "none";
   // green checkmark
    var successSpan =  document.createElement('span');
    successSpan.style.color = 'greenyellow';
    successSpan.innerHTML = '&#10003;';
    container.appendChild(successSpan);

    console.log("xhr upload of "+container.id+" complete");
  }, false);
        
  fileUpload.addEventListener("error", function(evt) {
    loader[index].style.display = "none";
    // red cross
    var errorSpan =  document.createElement('span');
    errorSpan.style.color = 'salmon';
    errorSpan.innerHTML = '&#10007;';
    container.appendChild(errorSpan);

    console.log("error: " + evt.code);
  }, false);

  // GO!
  xhr.send(data);
};