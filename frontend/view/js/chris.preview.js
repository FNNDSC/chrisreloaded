/**
 * Define the _PREVIEW_ namespace
 */
var _PREVIEW_ = _PREVIEW_ || {};
//
// example:
// _PREVIEW_.start('2D','volume','/path/to/volume.nii');
// or
// _PREVIEW_.start('3D','fibers','/path/to/fibers.trk');
//
_PREVIEW_.start = function(renderertype, filetype, filepath) {

  _PREVIEW_.renderertype = renderertype;
  
  _PREVIEW_.filepath = filepath;
  _PREVIEW_.filetype = filetype;
  
  if (renderertype == 'text') {
    
    // text preview
    jQuery('#PREVIEWSLIDER').show();
    jQuery('#BR_OVER').hide();
    jQuery('#PREVIEWMODAL').addClass('largePreview');
    
  } else {
    
    // XTK preview
    
    if (_PREVIEW_.filetype == 'volume') {
      
      jQuery('#PREVIEWSLIDER').show();
      jQuery('#BR_OVER').show();
      
    } else {
      
      jQuery('#PREVIEWSLIDER').show();
      jQuery('#BR_OVER').hide();
      
    }
    
  }
  
  // always center the modal
  jQuery('#PREVIEWMODAL').css('margin-left',jQuery('#PREVIEWMODAL').outerWidth()/2*-1);
  
  // Top Left overlay
  jQuery("#TL_OVER").html(
      'Retrieving data <i class="icon-refresh icon-white rotating_class">');
  jQuery("#TL_OVER").show();
  
  // show title 'Loading..'
  jQuery('#PREVIEWLABEL').html('Loading..');
  // show modal
  jQuery('#PREVIEWMODAL').modal();
  
}
_PREVIEW_.preview = function() {

  // clear the label
  jQuery('#PREVIEWLABEL').html(_PREVIEW_.filepath.split('/').pop());
  
  if (_PREVIEW_.renderertype == 'text') {
    
    // text/log preview
    
    // hide loading overlay
    jQuery("#TL_OVER").hide();
    
    // grab the text file
    jQuery.ajax({
      url: 'http://chris/datadev/' + _PREVIEW_.filepath
    }).done(function ( data ) {
      jQuery('#PREVIEW').append('<pre id="textPreview">'+data+'</pre>');
    });
    
    
  } else {
    
    jQuery("#TL_OVER").html('Creating visualization...');
    
    // set XTK renderer
    _PREVIEW_.object = eval('new X.' + _PREVIEW_.filetype + '()');
    _PREVIEW_.object.file = 'http://chris/datadev/' + _PREVIEW_.filepath;
    _PREVIEW_.object.reslicing = false; // we don't need to reslice here
    _PREVIEW_.renderer = eval('new X.renderer' + _PREVIEW_.renderertype + '()');
    _PREVIEW_.renderer.container = 'PREVIEW';
    _PREVIEW_.renderer.orientation = 'Z';
    _PREVIEW_.renderer.init();
    _PREVIEW_.renderer.add(_PREVIEW_.object);
    _PREVIEW_.renderer.render();
    
    if (_PREVIEW_.renderertype == '3D') {
      
      _PREVIEW_.renderer.camera.position = [0, 0, 300];
      
    }
    
    _PREVIEW_.renderer.onShowtime = function() {

      // hide overlay
      jQuery("#TL_OVER").hide();
      
      if (_PREVIEW_.filetype == 'volume') {
        
        // for volumes, create and setup the slider
        
        var dim = _PREVIEW_.object.dimensions;
        
        // init slider
        jQuery("#PREVIEWSLIDER").slider({
          min: 1,
          max: dim[2],
          value: Math.floor(_PREVIEW_.object.indexZ + 1),
          slide: function(event, ui) {

            _PREVIEW_.object.indexZ = ui.value - 1;
            jQuery("#SLICE").html(ui.value);
          }
        });
        // also make sure that the little slider thing is in the middle
        jQuery('.ui-slider-handle').css('top', '-.2em');
        _PREVIEW_.renderer.onScroll = function() {

          jQuery('#PREVIEWSLIDER').slider("option", "value",
              Math.floor(_PREVIEW_.object.indexZ + 1));
          jQuery("#SLICE").html(Math.floor(_PREVIEW_.object.indexZ + 1));
        };
        jQuery("#SLICE").html(Math.floor(_PREVIEW_.object.indexZ + 1));
        jQuery("#SLICE_NB").html(dim[2]);
        
      }
      
    }

  }
  
}
jQuery(document).ready(function() {

  // XTK variables
  _PREVIEW_.renderer = null;
  _PREVIEW_.renderertype = null;
  
  _PREVIEW_.filepath = null;
  _PREVIEW_.filetype = null;
  
  _PREVIEW_.object = null; // volume, fibers, mesh etc.
  // connect the 'shown' event
  jQuery('#PREVIEWMODAL').on('shown', function() {

    _PREVIEW_.preview();
  });
  // connect the 'hidden' event
  jQuery('#PREVIEWMODAL').on('hidden', function() {

    // empty description
    jQuery('#PREVIEWLABEL').html("");
    
    if (_PREVIEW_.filetype == 'volume') {
      
      // destroy slider
      jQuery("#PREVIEWSLIDER").slider("destroy");
      
    }
    
    // delete XTK stuff
    if (_PREVIEW_.renderer != null) {
      _PREVIEW_.renderer.destroy();
      delete _PREVIEW_.renderer;
      _PREVIEW_.renderer = null;
    }
    if (_PREVIEW_.object != null) {
      delete _PREVIEW_.object;
      _PREVIEW_.object = null;
    }
    
    // remove the text class
    jQuery('#PREVIEWMODAL').removeClass('largePreview');
    jQuery('#textPreview').remove();
    
  });
});
