// DEFINE NAMESPACE
var _CHRIS_INTERACTIVE_PLUGIN_ = _CHRIS_INTERACTIVE_PLUGIN_ || {};
// 1-OVERLOAD THE INIT METHOD
// when the html is loaded, we get the parameters from the plugin parameters
_CHRIS_INTERACTIVE_PLUGIN_.init = function() {
        _CHRIS_INTERACTIVE_PLUGIN_.body = document.getElementsByTagName("body")[0];
        _CHRIS_INTERACTIVE_PLUGIN_.dropListing = document.getElementById("output-listing01");
        _CHRIS_INTERACTIVE_PLUGIN_.dropArea = document.getElementById("drop");
        _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea = document.getElementById("dropmask");
        _CHRIS_INTERACTIVE_PLUGIN_.dropLoad = document.getElementById("dropload");
        _CHRIS_INTERACTIVE_PLUGIN_.dropReady = document.getElementById("dropready");
        _CHRIS_INTERACTIVE_PLUGIN_.targetFeed = null
        _CHRIS_INTERACTIVE_PLUGIN_.count = 0;
        
         // if(typeof window["FileReader"] === "function") {
         //   // File API interaction goes here

         // } else {
         //   // No File API support fallback to file input
         //   fileInput.type = "file";
         //   fileInput.id = "filesUpload";
         //   fileInput.setAttribute("multiple",true);
         //   dropArea.appendChild(fileInput);
         //   fileInput.addEventListener("change", TCNDDU.handleDrop, false);
         // }
         //http://www.thecssninja.com/javascript/gmail-upload

        // create the feed
          _CHRIS_INTERACTIVE_PLUGIN_.force = true;
          document.getElementById("plugin_submit").click();
}

_CHRIS_INTERACTIVE_PLUGIN_.submitted = function(val) {
_CHRIS_INTERACTIVE_PLUGIN_.targetFeed = val.split("\n")[1];

// let's go! (update UI to let user know we are ready)
           _CHRIS_INTERACTIVE_PLUGIN_.dropLoad.style.display = "none";
           _CHRIS_INTERACTIVE_PLUGIN_.dropReady.style.display = "block";

                   _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("dragenter",_CHRIS_INTERACTIVE_PLUGIN_.onDragEnter, false);
        _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("dragleave",_CHRIS_INTERACTIVE_PLUGIN_.onDrageLeave, false);
        _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("dragexit",_CHRIS_INTERACTIVE_PLUGIN_.onDrageLeave, false);
        _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("dragover",_CHRIS_INTERACTIVE_PLUGIN_.onDragOver, false);
        _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("drop", _CHRIS_INTERACTIVE_PLUGIN_.onDrop, false);
        _CHRIS_INTERACTIVE_PLUGIN_.dropMaskArea.addEventListener("dragend", _CHRIS_INTERACTIVE_PLUGIN_.onDrop, false);
}

// important!!!
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
             _CHRIS_INTERACTIVE_PLUGIN_.dropArea.style.border = "1px solid #8D8D8D";

  var dt = e.dataTransfer;
  var files = dt.files;
_CHRIS_INTERACTIVE_PLUGIN_.handleFiles(files);

      };
       _CHRIS_INTERACTIVE_PLUGIN_.handleFiles = function (files) {
           var filesFragment = document.createDocumentFragment(),
           domElements;
        
         _CHRIS_INTERACTIVE_PLUGIN_.dropListing.style.display = "block";

         console.log(files);

         var xhr = new XMLHttpRequest();
          xhr.open('POST', 'plugins/file_uploader/widget/file.listener.php', true);
          xhr.onload = function(e) {window.console.log("loaded...");};

         var data = new FormData();
        
         for(var i = 0, len = files.length; i < len; i++) {
           // Stop people trying to upload massive files don't need for demo to work
           if(files[i].size < 83886080) {
            
             domElements = [
               document.createElement('div'),
               document.createElement('span')
             ];
            
             domElements[1].appendChild(document.createTextNode(files[i].name + " (" + Math.round((files[i].size/1024*100000)/100000)+"K) "));
             domElements[0].id = "item"+_CHRIS_INTERACTIVE_PLUGIN_.count;
             domElements[0].appendChild(domElements[1]);
            
             filesFragment.appendChild(domElements[0]);
             _CHRIS_INTERACTIVE_PLUGIN_.dropListing.appendChild(filesFragment);
            
             // Use xhr to send files to server async both Chrome and Safari support xhr2 upload and progress events
             _CHRIS_INTERACTIVE_PLUGIN_.processXHR(files[i], _CHRIS_INTERACTIVE_PLUGIN_.count, xhr);
             data.append(files[i].name, files[i]);

             _CHRIS_INTERACTIVE_PLUGIN_.count++;
           } else {
             alert("Please don't kill my server by uploading large files, anything below 1mb will work");
           }
         }

         // GO!
         xhr.send(data);


       }
      
       _CHRIS_INTERACTIVE_PLUGIN_.processXHR = function (file, index, xhr) {
         var  container = document.getElementById("item"+index),
           loader;
           fileUpload = xhr.upload,
           progressDomElements = [
             document.createElement('div'),
             document.createElement('p')
           ];
        
         progressDomElements[0].className = "loader01";
         progressDomElements[0].appendChild(progressDomElements[1]);
        
         container.appendChild(progressDomElements[0]);
         loader = document.getElementsByClassName("loader01");
        
         fileUpload.addEventListener("progress", function(event) {
           if (event.lengthComputable) {
             var percentage = Math.round((event.loaded * 100) / event.total),
             loaderIndicator = container.firstChild.nextSibling.firstChild;
             if (percentage < 100) {
               loaderIndicator.style.width = percentage + "px";
             }
           }
         }, false);
        
         fileUpload.addEventListener("load", function(event) {
           loader[index].style.display = "none";
           console.log("xhr upload of "+container.id+" complete");
         }, false);
        
         fileUpload.addEventListener("error", function(evt) {
           console.log("error: " + evt.code);
         }, false);
       };