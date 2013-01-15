/*

    .----.                    _..._                                                     .-'''-.                           
   / .--./    .---.        .-'_..._''.                          _______                '   _    \                         
  ' '         |   |.--.  .' .'      '.\     __.....__           \  ___ `'.           /   /` '.   \_________   _...._      
  \ \         |   ||__| / .'            .-''         '.    ,.--. ' |--.\  \         .   |     \  '\        |.'      '-.   
   `.`'--.    |   |.--.. '             /     .-''"'-.  `. //    \| |    \  ' .-,.--.|   '      |  '\        .'```'.    '. 
     `'-. `.  |   ||  || |            /     /________\   \\\    /| |     |  '|  .-. \    \     / /  \      |       \     \
         `. \ |   ||  || |            |                  | `'--' | |     |  || |  | |`.   ` ..' /    |     |        |    |
           \ '|   ||  |. '            \    .-------------' ,.--. | |     ' .'| |  | |   '-...-'`     |      \      /    . 
            | |   ||  | \ '.          .\    '-.____...---.//    \| |___.' /' | |  '-                 |     |\`'-.-'   .'  
            | |   ||__|  '. `._____.-'/ `.             .' \\    /_______.'/  | |                     |     | '-....-'`    
           / /'---'        `-.______ /    `''-...... -'    `'--'\_______|/   | |                    .'     '.             
     /...-'.'                       `                                        |_|                  '-----------'           
    /--...-'                                                                                                              
    
    Slice:Drop - Instantly view scientific and medical imaging data in 3D.
    
     http://slicedrop.com
     
    Copyright (c) 2012 The Slice:Drop and X Toolkit Developers <dev@goXTK.com>
    
    Slice:Drop is licensed under the MIT License:
      http://www.opensource.org/licenses/mit-license.php    
      
    CREDITS: http://slicedrop.com/LICENSE
     
 */

/**
 * The main handler for drag'n'drop and also for file selection. The XTK scene
 * gets created here and the viewer gets activated. Inspired by
 * http://imgscalr.com - THANKS!!
 */


jQuery(document).ready(function() {

  
  detect_viewingmode();
  
  // initBrowserWarning();
  initDnD();
  // initExamples();
  
  ren3d = null;
  configurator = function() {

  };
  
  function switch_orientation(id) {

    var _width = jQuery(id).width();
    var _height = jQuery(id).height();
    
    // now convert to percentage
    console.log('old', _width, _height);
    _width = jQuery(id).width() / jQuery(document).width() * 100;
    _height = jQuery(id).height() / jQuery(document).height() * 100;
    console.log('new', _width, _height);
    jQuery(id).height(_width + '%');
    jQuery(id).width(_height + '%');
    jQuery(id).css('position', 'absolute');
    
  }
  
  function detect_viewingmode() {

    // portrait or landscape display
    if (jQuery(document).width() < jQuery(document).height()) {
      
      jQuery(document.body).removeClass('landscape');
      jQuery(document.body).addClass('portrait');
      
    } else {
      
      jQuery(document.body).removeClass('portrait');
      jQuery(document.body).addClass('landscape');
      
    }
    
  }
  
  // add a handler for viewing mode detecting
  jQuery(window).resize(detect_viewingmode);
  
});

var _current_3d_content = null;
var _current_X_content = null;
var _current_Y_content = null;
var _current_Z_content = null;


function showLarge(el2, new3d_content) {

  // jump out if the renderers were not set up
  if (!_current_3d_content || !_current_X_content || !_current_Y_content ||
      !_current_Z_content) {
    
    console.log('nothing to do');
    
    return;
    
  }
  
  // from Stackoverflow http://stackoverflow.com/a/6391857/1183453
  
  var el1 = jQuery('#3d');
  el1.prepend('<span/>'); // drop a marker in place
  var tag1 = jQuery(el1.children()[0]);
  var old_content = tag1.nextAll();
  
  tag1.replaceWith(el2.children('div, canvas'));
  
  el2.prepend('<span/>');
  var tag2 = jQuery(el2.children()[0]);
  tag2.replaceWith(old_content);
  
  // adjust the XTK containers
  
  var _2dcontainerId = el2.attr('id');
  var _orientation = _2dcontainerId.substr(-1);
  
  if (_orientation == 'd') {
    return;
  }
  
  var _old_2d_content = eval('_current_' + _orientation + '_content');
  var _old_3d_content = _current_3d_content;
  
  _current_3d_content.container = document.getElementById(_2dcontainerId);
  _old_2d_content.container = document.getElementById('3d');
  
  // .. and update the layout
  _current_3d_content = _old_2d_content;
  eval('_current_' + _orientation + '_content = _old_3d_content');
  
  // fire resize event
  var evt = document.createEvent('UIEvents');
  evt.initUIEvent('resize', true, false, window, 0);
  window.dispatchEvent(evt);
  
};


function initBrowserWarning() {

  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  
  if (!isChrome && !isFirefox) {
    jQuery("#browser-warning").fadeIn(125);
  }
};

function initDnD() {

  // Add drag handling to target elements
  document.getElementById("body").addEventListener("dragenter", onDragEnter,
      false);
  document.getElementById("drop-box-overlay").addEventListener("dragleave",
      onDragLeave, false);
  document.getElementById("drop-box-overlay").addEventListener("dragover",
      noopHandler, false);
  
  // Add drop handling
  document.getElementById("drop-box-overlay").addEventListener("drop", onDrop,
      false);
  
};

function noopHandler(evt) {

  evt.stopPropagation();
  evt.preventDefault();
};

function onDragEnter(evt) {

  jQuery("#drop-box-overlay").fadeIn(125);
  jQuery("#drop-box-prompt").fadeIn(125);
};

function onDragLeave(evt) {

  /*
   * We have to double-check the 'leave' event state because this event stupidly
   * gets fired by JavaScript when you mouse over the child of a parent element;
   * instead of firing a subsequent enter event for the child, JavaScript first
   * fires a LEAVE event for the parent then an ENTER event for the child even
   * though the mouse is still technically inside the parent bounds. If we trust
   * the dragenter/dragleave events as-delivered, it leads to "flickering" when
   * a child element (drop prompt) is hovered over as it becomes invisible, then
   * visible then invisible again as that continually triggers the enter/leave
   * events back to back. Instead, we use a 10px buffer around the window frame
   * to capture the mouse leaving the window manually instead. (using 1px didn't
   * work as the mouse can skip out of the window before hitting 1px with high
   * enough acceleration).
   */
  if (evt.pageX < 10 || evt.pageY < 10 ||
      jQuery(window).width() - evt.pageX < 10 ||
      jQuery(window).height - evt.pageY < 10) {
    jQuery("#drop-box-overlay").fadeOut(125);
    jQuery("#drop-box-prompt").fadeOut(125);
  }
};

function onDrop(evt) {

  // Consume the event.
  noopHandler(evt);
  
  // Hide overlay
  jQuery("#drop-box-overlay").fadeOut(0);
  jQuery("#drop-box-prompt").fadeOut(0);
  
  // Get the dropped files.
  var files = evt.dataTransfer.files;
  
  // If anything is wrong with the dropped files, exit.
  if (typeof files == "undefined" || files.length == 0) {
    return;
  }
  
  selectfiles(files);
  
};

function switchToViewer() {

  jQuery('#body').addClass('viewerBody');
  jQuery('#frontpage').hide();
  jQuery('#viewer').show();
  
};

function selectfiles(files) {


  $('.backstretch').remove();
  
  // remove all old chris styles
  $('link[rel=stylesheet]').each(function(i, v) {

    v = jQuery(v);
    
    if (v.attr('href').indexOf('slicedrop') == -1) {
      v.remove();
    }
    
  });
  
  // add new slicedrop styles
  var fileref = document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", 'view/slicedrop/css/bootstrap.css')
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref);
  fileref = document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", 'view/slicedrop/css/bootstrap-responsive.css')
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref);  
  
  // now switch to the viewer
  switchToViewer();
  
  // .. and start the file reading
  read(files);
  
};
