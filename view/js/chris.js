/**
 * Define the CHRIS namespace
 */
var _CHRIS_ = _CHRIS_ || {};

_CHRIS_.updateStatistics = function() {
  
  jQuery.ajax({
    type : "GET",
    url : "api.php?action=count&what=datafeedrunning",
    dataType : "json",
    success : function(data) {
      
      if (data['result'] == 'maintenance') {
        
        // we are in maintenance mode
        // lock the screen
        $('#maintenance').show();
        return;
        
      }

      // update data count
      jQuery('#data_count').html(data['result'][0]);
      // update feed count
      jQuery('#feed_count').html(data['result'][1]);      
      // update running count
      jQuery('#running_count').html(data['result'][2]);
      
    }
  });
  
}

_CHRIS_.scalePanels = function() {

  // configure screen size related parameters
  var _pluginpanelsize = jQuery(window).height()-417;
  var _feedcontentsize = jQuery(window).height()-129;  
  var _interactivepluginsize = jQuery(window).height()-129;
  // right panel: 300px + well: 40px
  // left panel: 450px + well: 40px
  var _interactivepluginwidth = jQuery(window).width()-300 - 450 - 40 - 40;
  var _opaqueoverlaywidth = jQuery(window).width()- 40;
  
  if (jQuery(window).height() <= 600) {
    // hide the statistics panel
    jQuery('#information').hide();
    _pluginpanelsize += 131;
  } else {
    // show it
    jQuery('#information').show();
  }
  
  jQuery('.plugin_panel').css('min-height', _pluginpanelsize);
  jQuery('.plugin_panel').css('height', _pluginpanelsize);
  jQuery('.plugin_panel').css('max-height', _pluginpanelsize);
  jQuery('.feed_content').css('min-height', _feedcontentsize);
  jQuery('.feed_content').css('height', _feedcontentsize);
  jQuery('.feed_content').css('max-height', _feedcontentsize);
  jQuery('.interactive_plugin_content').css('min-height', _interactivepluginsize);
  jQuery('.interactive_plugin_content').css('height', _interactivepluginsize);
  jQuery('.interactive_plugin_content').css('max-height', _interactivepluginsize);
  jQuery('#center').css('min-width', _interactivepluginwidth);
  jQuery('#center').css('width', _interactivepluginwidth);
  jQuery('#center').css('max-width', _interactivepluginwidth);
  if(jQuery('#center').is(":visible")){
    // resize opaque overlay if interactive plugin (#center) is visible
    jQuery('#opaqueoverlay').css('width', _opaqueoverlaywidth);
  }
  
};
       
_CHRIS_.init = function() {
  // set global variables
  _CHRIS_.body = document.getElementsByTagName("body")[0];
  _CHRIS_.dropListing = document.getElementById("homedrop-outputlisting01");
  _CHRIS_.dropArea = document.getElementById("information");
  _CHRIS_.dropMaskArea = document.getElementById("information");
  _CHRIS_.closeDrop = document.getElementById("closeDrop");
  _CHRIS_.count = 0;
  _CHRIS_.countStyle = 0;
  _CHRIS_.targetFiles = null;

  // add a close button

  // attach events
  _CHRIS_.dropMaskArea.addEventListener("dragenter",_CHRIS_.onDragEnter, false);
  _CHRIS_.dropMaskArea.addEventListener("dragleave",_CHRIS_.onDrageLeave, false);
  _CHRIS_.dropMaskArea.addEventListener("dragover",_CHRIS_.onDragOver, false);
  _CHRIS_.dropMaskArea.addEventListener("drop", _CHRIS_.onDrop, false);
  _CHRIS_.dropMaskArea.addEventListener("dragend", _CHRIS_.onDrop, false);
  _CHRIS_.dropMaskArea.addEventListener("click", _CHRIS_.onCloseDrop, false);
}

// important in chrome, if not drag and drop do NOT work
_CHRIS_.onCloseDrop = function (e) {
  e.stopPropagation();
  e.preventDefault();
  
    _CHRIS_.dropListing.style.display = "none";

  while(_CHRIS_.dropListing.firstChild) {
    _CHRIS_.dropListing.removeChild(_CHRIS_.dropListing.firstChild);
}


  _CHRIS_.targetFeed = null
  _CHRIS_.count = 0;
  _CHRIS_.countStyle = 0;
  _CHRIS_.targetFiles = null;

  _CHRIS_.dropListing.appendChild(_CHRIS_.closeDrop);

};


// important in chrome, if not drag and drop do NOT work
_CHRIS_.onDragOver = function (e) {
  e.stopPropagation();
  e.preventDefault();
};

_CHRIS_.onDragEnter = function (e) {
  e.stopPropagation();
  e.preventDefault();

  // _CHRIS_.dropArea.style.border = "5px dashed grey";
};

_CHRIS_.onDrageLeave = function (e) {
  e.stopPropagation();
  e.preventDefault();

  // _CHRIS_.dropArea.style.border = "1px solid #8D8D8D";
};

_CHRIS_.onDrop = function (e) {
  e.stopPropagation();
  e.preventDefault();
  // reset style
  // _CHRIS_.dropArea.style.border = "1px solid #8D8D8D";

  if(_CHRIS_.count == 0){
    // store reference to files
    _CHRIS_.targetFiles = e.dataTransfer.files;
    // style output (for user interaction)
    _CHRIS_.handleStyle(e.dataTransfer.files);
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
   _CHRIS_.targetFeed = data.split("\n")[1];

   _CHRIS_.handleFiles(_CHRIS_.targetFiles);
                   }
                 });
    return;
  }
  // do sth with those files!
  _CHRIS_.handleStyle(e.dataTransfer.files);
  _CHRIS_.handleFiles(e.dataTransfer.files);
};

_CHRIS_.handleStyle = function (files) {
  var filesFragment = document.createDocumentFragment();
  var domElements = [];
        
  _CHRIS_.dropListing.style.display = "block";
       
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
      domElements[0].id = "item"+_CHRIS_.countStyle;
      domElements[0].appendChild(domElements[1]);
            
      filesFragment.appendChild(domElements[0]);

      // progress bar
      var progressDomElements = [
          document.createElement('div'),
          document.createElement('div')];
        
      progressDomElements[0].className = "loader01";
      progressDomElements[0].appendChild(progressDomElements[1]);
      domElements[0].appendChild(progressDomElements[0]);

      _CHRIS_.dropListing.appendChild(filesFragment);

      _CHRIS_.countStyle++;
    } else {
        alert("The file you are trying to upload is too BIG (100Mb max)");
    }
  }
};

_CHRIS_.handleFiles = function (files) {
       
  for(var i = 0, len = files.length; i < len; i++) {
   
      _CHRIS_.processXHR(files[i], _CHRIS_.count);
      _CHRIS_.count++;
  }
};
      
_CHRIS_.processXHR = function (file, index) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'api.php', true);

  var data = new FormData();
  data.append('targetFeed', _CHRIS_.targetFeed);
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





jQuery(document).ready(function() {
  
  // watch for the resize event
  jQuery(window).resize(function() {_CHRIS_.scalePanels()});
  // also call it once
  _CHRIS_.scalePanels();
  
  jQuery('.dropdown-toggle').dropdown();
  jQuery("[rel=bottom_tooltip]").tooltip({
    placement : 'bottom'
  });
  jQuery("[rel=right_tooltip]").tooltip({
    placement : 'right'
  });
  jQuery("[rel=left_tooltip]").tooltip({
    placement : 'left'
  });  
  
  // action command show on focus
  jQuery('#action_command').focusin(function() {
    
    jQuery('#action_ui').show();
    
  });
  jQuery('#action_command').focusout(function() {
    
    if (jQuery('#action_run').attr('data-hover')=='true') return;
    jQuery('#action_ui').hide();
    
  });
  jQuery('#action_run').hover(function() {
    
    jQuery('#action_run').attr('data-hover','true');
    
  },function() {
    
    jQuery('#action_run').attr('data-hover','false');
    
  });
  jQuery('#action_run').click(function() {
  
    jQuery('#action_ui').hide();
    
  });
  
  // activate polling of new statistics
  setInterval(_CHRIS_.updateStatistics, 5000);

  // turn on drag and drop
  _CHRIS_.init();
  
  
});

// activate backstretch
jQuery.backstretch('view/gfx/background1.jpg');