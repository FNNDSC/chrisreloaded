/**
 * Define the _DRAG_AND_DROP_ namespace
 */
var _DRAG_AND_DROP_ = _DRAG_AND_DROP_ || {};

_DRAG_AND_DROP_.init = function() {
  // set global variables
  _DRAG_AND_DROP_.body = document.getElementsByTagName("body")[0];
  _DRAG_AND_DROP_.dropWidget = document.getElementById("drop-widget");
  _DRAG_AND_DROP_.dropListing = document.getElementById("drop-list");
  _DRAG_AND_DROP_.dropArea = document.getElementById("information");
  _DRAG_AND_DROP_.dropMaskArea = document.getElementById("information");
  _DRAG_AND_DROP_.count = 0;
  _DRAG_AND_DROP_.countStyle = 0;
  _DRAG_AND_DROP_.targetFiles = null;

  _DRAG_AND_DROP_.body.addEventListener("dragenter",_DRAG_AND_DROP_.onDragEnter, false);
  _DRAG_AND_DROP_.body.addEventListener("dragleave",_DRAG_AND_DROP_.onDrageLeave, false);
  _DRAG_AND_DROP_.dropMaskArea.addEventListener("dragover",_DRAG_AND_DROP_.onDragOver, false);
  _DRAG_AND_DROP_.dropArea.addEventListener("drop", _DRAG_AND_DROP_.onDrop, false);
  _DRAG_AND_DROP_.dropArea.addEventListener("dragend", _DRAG_AND_DROP_.onDrop, false);

  jQuery(document).off('click', '#closeDrop').on('click', '#drop-close', _DRAG_AND_DROP_.onCloseDrop);
}

// important in chrome, if not drag and drop do NOT work
_DRAG_AND_DROP_.onCloseDrop = function (e) {
  e.stopPropagation();
  e.preventDefault();
  
  _DRAG_AND_DROP_.dropWidget.style.display = "none";

  while(_DRAG_AND_DROP_.dropListing.firstChild) {
    _DRAG_AND_DROP_.dropListing.removeChild(_DRAG_AND_DROP_.dropListing.firstChild);
  }

  _DRAG_AND_DROP_.targetFeed = null
  _DRAG_AND_DROP_.count = 0;
  _DRAG_AND_DROP_.countStyle = 0;
  _DRAG_AND_DROP_.targetFiles = null;

  var _pluginpanelsize = jQuery(window).height()-417;
  jQuery('.plugin_panel').css('min-height', _pluginpanelsize);
  jQuery('.plugin_panel').css('height', _pluginpanelsize);
  jQuery('.plugin_panel').css('max-height', _pluginpanelsize);

};


// important in chrome, if not drag and drop do NOT work
_DRAG_AND_DROP_.onDragOver = function (e) {
  e.stopPropagation();
  e.preventDefault();
};

_DRAG_AND_DROP_.onDragEnter = function (e) {
  e.stopPropagation();
  e.preventDefault();
  _DRAG_AND_DROP_.dropArea.style.border = "5px dashed grey";
};

_DRAG_AND_DROP_.onDrageLeave = function (e, parent) {
  e.stopPropagation();
  e.preventDefault();

  // modify border only when leave the main window
  mouseX = e.clientX;
  mouseY = e.clientY;
  if ((mouseY > 0 && mouseY < window.innerHeight) && (mouseX > 0 && mouseX < window.innerWidth))
    return;

  _DRAG_AND_DROP_.dropArea.style.border = "1px solid #E3E3E3";
};

_DRAG_AND_DROP_.onDrop = function (e) {
  e.stopPropagation();
  e.preventDefault();
  // reset style
   _DRAG_AND_DROP_.dropArea.style.border = "1px solid #E3E3E3";

  if(_DRAG_AND_DROP_.count == 0){
    // store reference to files
    _DRAG_AND_DROP_.targetFiles = e.dataTransfer.files;
    // style output (for user interaction)
    _DRAG_AND_DROP_.handleStyle(e.dataTransfer.files);
    // create the feed
    // start job and hook calback
    var _feed_name = (new Date()).toLocaleString();
    var _output = [];
    _output.push([]);
    _output[0].push({
                      name : 'output',
                      value : '',
                      type : 'simple',
                      target_type : 'feed'
                    });

        var _param = [];
    _param.push([]);

    jQuery.ajax({
                   type : "POST",
                   url : "controller/launcher-web.php",
                   dataType : "text",
                   data : {
                     FEED_PLUGIN : 'file_uploader',
                     FEED_NAME : _feed_name,
                     FEED_PARAM : _param,
                     FEED_STATUS : 100,
                     FEED_MEMORY : 512,
                     FEED_OUTPUT : _output
                   },
                   success : function(data) {
   _DRAG_AND_DROP_.targetFeed = data.split("\n")[1];

   _DRAG_AND_DROP_.handleFiles(_DRAG_AND_DROP_.targetFiles);
                   }
                 });
    return;
  }
  // do sth with those files!
  _DRAG_AND_DROP_.handleStyle(e.dataTransfer.files);
  _DRAG_AND_DROP_.handleFiles(e.dataTransfer.files);
};

_DRAG_AND_DROP_.handleStyle = function (files) {
  var filesFragment = document.createDocumentFragment();
  var domElements = [];
        
  _DRAG_AND_DROP_.dropWidget.style.display = "block";
       
  for(var i = 0, len = files.length; i < len; i++) {
    domElements = [
      document.createElement('div'),
      document.createElement('span')];
            
    domElements[1].appendChild(document.createTextNode(files[i].name + " (" + Math.round((files[i].size/1024*100000)/100000)+"K)  "));
    domElements[0].id = "item"+_DRAG_AND_DROP_.countStyle;
    domElements[0].appendChild(domElements[1]);
            
    filesFragment.appendChild(domElements[0]);

    // progress bar
    var progressDomElements = [
        document.createElement('div'),
        document.createElement('div')];
        
    progressDomElements[0].className = "loader01";
    progressDomElements[0].appendChild(progressDomElements[1]);
    domElements[0].appendChild(progressDomElements[0]);

    _DRAG_AND_DROP_.dropListing.appendChild(filesFragment);

    // update plugin_panel width

    var _pluginpanelsize = jQuery(window).height()-417;
    _pluginpanelsize -= jQuery("#drop-widget").height();
    jQuery('.plugin_panel').css('min-height', _pluginpanelsize);
    jQuery('.plugin_panel').css('height', _pluginpanelsize);
    jQuery('.plugin_panel').css('max-height', _pluginpanelsize);

    _DRAG_AND_DROP_.countStyle++;
  }
};

_DRAG_AND_DROP_.handleFiles = function (files) {
       
  for(var i = 0, len = files.length; i < len; i++) {
   
      _DRAG_AND_DROP_.processXHR(files[i], _DRAG_AND_DROP_.count);
      _DRAG_AND_DROP_.count++;
  }
};
      
_DRAG_AND_DROP_.processXHR = function (file, index) {

  var container = document.getElementById("item"+index);
  var loader = document.getElementsByClassName("loader01");

  // GO!
  // Stop people trying to upload massive files don't need for demo to work
  // 100Mb limit
  //sudo vim /etc/php5/apache2/php.ini 
  //[toor@chris:x86_64-Linux]/var$>sudo service apache2 restart
  // upload_max_filesize = 100M = 104857600 Bytes
  // post_max_size = 120M
  if(file.size < 104857600) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'api.php', true);
    var fileUpload = xhr.upload;

    var data = new FormData();
    data.append('targetFeed', _DRAG_AND_DROP_.targetFeed);
    data.append('action', 'add');
    data.append('what', 'file');
    data.append(file.name, file);
       
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
      container.firstChild.nextSibling.style.borderColor = "#fff";
      loaderIndicator = container.firstChild.nextSibling.firstChild;
      loaderIndicator.style.width = "100%";


      // blue checkmark
      var successSpan =  document.createElement('span');
      successSpan.innerHTML = '&#10003;';
      successSpan.style.color = '#009DE9';
      container.firstChild.appendChild(successSpan);

      var _pluginpanelsize = jQuery(window).height()-417;
      _pluginpanelsize -= jQuery("#drop-widget").height();
      jQuery('.plugin_panel').css('min-height', _pluginpanelsize);
      jQuery('.plugin_panel').css('height', _pluginpanelsize);
      jQuery('.plugin_panel').css('max-height', _pluginpanelsize);

      console.log("xhr upload of "+container.id+" complete");
    }, false);
        
    fileUpload.addEventListener("error", function(evt) {
      container.firstChild.nextSibling.style.borderColor = "#fff";
      loaderIndicator = container.firstChild.nextSibling.firstChild;
      loaderIndicator.style.width = "100%";
      // red cross
      var errorSpan =  document.createElement('span');
      errorSpan.innerHTML = '&#10007;';
      errorSpan.style.color = 'salmon';
      container.firstChild.appendChild(errorSpan);

      var _pluginpanelsize = jQuery(window).height()-417;
      _pluginpanelsize -= jQuery("#drop-widget").height();
      jQuery('.plugin_panel').css('min-height', _pluginpanelsize);
      jQuery('.plugin_panel').css('height', _pluginpanelsize);
      jQuery('.plugin_panel').css('max-height', _pluginpanelsize);

      console.log("error: " + evt.code);
    }, false);

    xhr.send(data);
  } else {
    container.firstChild.nextSibling.style.borderColor = "#fff";
    loaderIndicator = container.firstChild.nextSibling.firstChild;
    loaderIndicator.style.width = "100%";
    // red cross
    var errorSpan =  document.createElement('span');
    errorSpan.innerHTML = '&#10007; (File too big)';
    errorSpan.style.color = 'salmon';
    container.firstChild.appendChild(errorSpan);

    var _pluginpanelsize = jQuery(window).height()-417;
    _pluginpanelsize -= jQuery("#drop-widget").height();
    jQuery('.plugin_panel').css('min-height', _pluginpanelsize);
    jQuery('.plugin_panel').css('height', _pluginpanelsize);
    jQuery('.plugin_panel').css('max-height', _pluginpanelsize);
  }

};

jQuery(document).ready(function() {
  
  // turn on drag and drop
  _DRAG_AND_DROP_.init();

});