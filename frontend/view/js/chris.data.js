/**
 * Define the FEED namespace
 */
var _DATA_ = _DATA_ || {};
_DATA_.startPreview = function() {
  // Top Left overlay
  jQuery("#TL_OVER").html(
      'Retrieving data <i class="icon-refresh icon-white rotating_class">');
  jQuery("#TL_OVER").show();
  jQuery("#SLICE").html('00');
  jQuery("#SLICE_NB").html('00');
  // show title 'Loading..'
  jQuery('#myModalLabel').html('Loading..');
  // show modal
  jQuery('#PMODAL').modal();
}
_DATA_.preview = function() {
  jQuery.ajax({
    type : "POST",
    url : "controller/data_preview.php",
    dataType : "json",
    data : {
      DATA_SER_UID : _DATA_.PreviewSeries,
      DATA_SER_NOF : _DATA_.PreviewNbFiles
    },
    success : function(data) {
      if (data && data.filename.length > 0) {
        // modal label
        jQuery('#myModalLabel').html(_DATA_.PreviewDesc);
        jQuery("#TL_OVER").html('Creating XTK visualization...');
        // set XTK renderer
        _DATA_.volume = new X.volume();
        _DATA_.volume.file = 'http://chris/datadev/' + data.filename[0];
        _DATA_.volume.reslicing = false; // we don't need to reslice here
        _DATA_.sliceX = new X.renderer2D();
        _DATA_.sliceX.container = 'sliceZ';
        _DATA_.sliceX.orientation = 'Z';
        _DATA_.sliceX.init();
        _DATA_.sliceX.add(_DATA_.volume);
        _DATA_.sliceX.render();
        _DATA_.sliceX.onShowtime = function() {
          var dim = _DATA_.volume.dimensions;
          // hide overlay
          jQuery("#TL_OVER").hide();
          // init slider
          jQuery("#sliderZ").slider({
            min : 1,
            max : dim[2],
            value : Math.floor(_DATA_.volume.indexZ + 1),
            slide : function(event, ui) {
              _DATA_.volume.indexZ = ui.value - 1;
              jQuery("#SLICE").html(ui.value);
            }
          });
          // also make sure that the little slider thing is in the middle
          jQuery('.ui-slider-handle').css('top','-.2em');          
          _DATA_.sliceX.onScroll = function() {
            jQuery('#sliderZ').slider("option", "value",
                Math.floor(_DATA_.volume.indexZ + 1));
            jQuery("#SLICE").html(Math.floor(_DATA_.volume.indexZ + 1));
          };
          jQuery("#SLICE").html(Math.floor(_DATA_.volume.indexZ + 1));
          jQuery("#SLICE_NB").html(dim[2]);
        }
      } else {
        // if modal visible, callback
        if (_DATA_.PreviewSeries != '0') {
          setTimeout(function() {
            _DATA_.preview()
          }, 1000);
        }
      }
    }
  });
}
jQuery(document).ready(function() {
  // convenience variables
  _DATA_.PreviewSeries = '0';
  _DATA_.PreviewNbFiles = '-1';
  _DATA_.PreviewDesc = '';
  // XTK variables
  _DATA_.sliceX = null;
  _DATA_.volume = null;
  // connect the 'shown' event
  jQuery('#PMODAL').on('shown', function() {
    _DATA_.preview();
  });
  // connect the 'hidden' event
  jQuery('#PMODAL').on('hidden', function() {
    // empty description
    jQuery('#myModalLabel').html("");
    // delete XTK stuff
    if (_DATA_.sliceX != null) {
      _DATA_.sliceX.destroy();
      delete _DATA_.sliceX;
      _DATA_.sliceX = null;
    }
    if (_DATA_.volume != null) {
      delete _DATA_.volume;
      _DATA_.volume = null;
    }
    // reset _PACS_.previewStudy and Series
    _DATA_.PreviewSeries = '0';
    // destroy slider
    jQuery("#sliderZ").slider("destroy");
  });
});