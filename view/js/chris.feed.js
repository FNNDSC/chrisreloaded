/**
 * Define the FEED namespace
 */
var _FEED_ = _FEED_ || {};
_FEED_.onclick = function(details, more) {
  // generate the file browser on demand, if doesnt exist already
  var _file_browser = details.find('.file_browser');
  // if (_file_browser.is(':empty')) {
  var _folder = _file_browser.attr('data-folder');
  _file_browser.fileTree({
    root : _folder,
    script : 'controller/feed.browser.connector.php'
  }, function(file) {
    // grab the file extension
    // grab the file extension
    var extension = file.split('.').pop().toUpperCase();
    // support no extensions
    if (extension == file.toUpperCase()) {
      // this means no extension
      extension = '';
    }
    switch (extension) {
    case 'NII':
    case 'MGH':
    case 'MGZ':
    case 'DCM':
    case 'DICOM':
    case 'NII':
    case 'GZ':
    case 'NRRD':
      _PREVIEW_.start('2D', 'volume', file);
      break;
    case 'TRK':
      _PREVIEW_.start('3D', 'fibers', file);
      break;
    case 'FSM':
    case 'SMOOTHWM':
    case 'PIAL':
    case 'INFLATED':
    case 'SPHERE':
    case 'ORIG':
    case 'VTK':
    case 'STL':
      _PREVIEW_.start('3D', 'mesh', file);
      break;
    case 'TXT':
    case 'LOG':
    case 'ERR':
    case 'JS':
      _PREVIEW_.start('text', null, file);
      break;
    }
  });
  // }
  // also create the multi accordion
  // if it doesn't exist
  var accordionpanel = details.children('.feedpanel');
  if (!accordionpanel.hasClass('ui-accordion')) {
    var _last_div_index = accordionpanel.children('div').length - 1;
    accordionpanel.multiAccordion({
      heightStyle : "content",
      animate : false,
      active : _last_div_index
    });
  }
  // default value for 'force' is false
  if (typeof more == 'undefined') {
    more = false;
  }
  var hidden = details.is(':hidden');
  if (hidden) {
    if (more) {
      more.html('<a>Hide details</a>');
      more.closest('.feed').css('margin-top', '10px');
      more.closest('.feed').css('margin-bottom', '11px');
    }
    details.show('blind', 'slow');
  } else {
    if (more) {
      more.html('<a>Show details</a>');
      more.closest('.feed').css('margin-top', '-1px');
      more.closest('.feed').css('margin-bottom', '0px');
    }
    details.hide('blind', 'slow');
  }
}
_FEED_.feed_title_onclick = function() {
  jQuery(document).on('click', '.feed_title', function() {
    var advanced = jQuery(this).parent().find('.feed_advanced');
    _FEED_.onclick(advanced);
    /**
     * @todo push feed css down?
     */
  });
}
_FEED_.feed_fav_onclick = function() {
  jQuery(document).on('click', '.feed_fav_check', function() {
    var advanced = jQuery(this).parents().eq(5).find('.feed_fav');
    _FEED_.onclick(advanced);
  });
}
_FEED_.feed_run_onclick = function() {
  jQuery(document).on('click', '.feed_run_check', function() {
    var advanced = jQuery(this).parents().eq(5).find('.feed_run');
    _FEED_.onclick(advanced);
  });
}
_FEED_.feed_fin_onclick = function() {
  jQuery(document).on('click', '.feed_fin_check', function() {
    var advanced = jQuery(this).parents().eq(5).find('.feed_fin');
    _FEED_.onclick(advanced);
  });
}
_FEED_.feed_more_onclick = function() {
  jQuery(document).on('click', '.feed_more', function(e) {
    // modify
    e.stopPropagation();
    var details = jQuery(this).closest('.feed').find('.feed_details');
    _FEED_.onclick(details, jQuery(this));
  });
}
_FEED_.feed_onclick = function() {
  jQuery(document).on('click', '.feed_header', function() {
    var more = jQuery(this).parent().find('.feed_more');
    var details = jQuery(this).parent().find('.feed_details');
    _FEED_.onclick(details, more);
  });
  jQuery(document).on('click', '.feed_meta_header', function() {
    var details = jQuery(this).parent().find('.feed_meta_content');
    _FEED_.onclick(details);
  });
  jQuery(document).on('click', '.data_meta_header', function() {
    var details = jQuery(this).parent().find('.data_meta_content');
    _FEED_.onclick(details);
  });
  jQuery(document).on('click', '.html_header', function() {
    var details = jQuery(this).parent().find('.html_viewer');
    _FEED_.onclick(details);
  });
  jQuery(document).on('click', '.data_browser_header', function() {
    var details = jQuery(this).parent().find('.data_browser');
    _FEED_.onclick(details);
  });
}
_FEED_.updateFeedTimeout = function() {
  timer = setInterval(_FEED_.refresh, 5000);
}
_FEED_.refresh = function() {
  // look for new feeds
  _FEED_.ajaxUpdate();
  // update the time stamps
  _FEED_.updateTime();
}
_FEED_.ajaxUpdate = function() {
  // ajax call
  jQuery.ajax({
    type : "POST",
    url : "api.php?action=get&what=feed_updates",
    dataType : "json",
    success : function(data) {
      data = data['result'];
      // update FINISHED feeds
      var length_done = data['fin']['id'].length;
      if (length_done > 0) {
        var i = length_done - 1;
        while (i >= 0) {
          // if id there, delete it!
          var index = _FEED_.finFeeds[0].indexOf(data['fin']['id'][i]);
          if (index >= 0) {
            // delete elements
            _FEED_.finFeeds[0].splice(index, 1);
            _FEED_.finFeeds[1].splice(index, 1);
          }
          index = _FEED_.runFeeds[0].indexOf(data['fin']['id'][i]);
          if (index >= 0) {
            // delete elements
            _FEED_.runFeeds[0].splice(index, 1);
            _FEED_.runFeeds[1].splice(index, 1);
          }
          // find element
          var element = jQuery('div[data-chris-feed_id=' + data['fin']['id'][i]
              + ']');
          // if starred, do not do anything
          // if not starred, add in list and delete related running element
          if (!element.find('i').hasClass('icon-star')) {
            _FEED_.finFeeds[0].unshift(data['fin']['id'][i]);
            _FEED_.finFeeds[1].unshift(data['fin']['content'][i]);
            if (element.length) {
              element.hide('blind', 'slow');
            }
          } else {
            element.attr('data-chris-feed_status', '100');
            element.find('.feed_status').html(
                'Status: <font color=green>Done</font>');
          }
          i--;
        }
      }
      /*
       * // update FAVORITES feeds var length_done = data['fav']['id'].length;
       * if (length_done > 0) { var i = length_done - 1; while (i >= 0) { // if
       * id there, delete it! var index =
       * _FEED_.favFeeds[0].indexOf(data['fav']['id'][i]); if (index >= 0) { //
       * delete elements _FEED_.favFeeds[0].splice(index, 1);
       * _FEED_.favFeeds[1].splice(index, 1); }
       * _FEED_.favFeeds[0].unshift(data['fav']['id'][i]);
       * _FEED_.favFeeds[1].unshift(data['fav']['content'][i]); i--; } }
       */
      // update NEW RUNNING feeds
      var length_done = data['run']['new']['id'].length;
      if (length_done > 0) {
        var i = length_done - 1;
        while (i >= 0) {
          // if id there, delete it!
          var index = _FEED_.runFeeds[0].indexOf(data['run']['new']['id'][i]);
          if (index >= 0) {
            // delete elements
            _FEED_.runFeeds[0].splice(index, 1);
            _FEED_.runFeeds[1].splice(index, 1);
          }
          _FEED_.runFeeds[0].unshift(data['run']['new']['id'][i]);
          _FEED_.runFeeds[1].unshift(data['run']['new']['content'][i]);
          i--;
        }
      }
      // update UPDATE RUNNING feeds
      var length_progress = data['run']['update']['id'].length;
      if (length_progress) {
        for ( var i = 0; i < length_progress; i++) {
          // if element is there!
          var element = jQuery('div[data-chris-feed_id='
              + data['run']['update']['id'][i] + ']');
          if (element.length) {
            var _current_feed = jQuery('div[data-chris-feed_id='
                + data['run']['update']['id'][i] + ']');
            var _status_text = '<font color=red>Running</font>';
            var _status = data['run']['update']['content'][i];
            if (_status == 100) {
              _status_text = '<font color=green>Done</font>';
            }
            _current_feed.find('.feed_status').html('Status: ' + _status_text);
          }
        }
      }
      // update UPDATE button
      $newFeeds = /* _FEED_.favFeeds[0].length + */_FEED_.finFeeds[0].length
          + _FEED_.runFeeds[0].length;
      if ($newFeeds > 0) {
        jQuery('.feed_update').html(
            '<b>' + $newFeeds + ' </b>More feeds available');
        if (!jQuery('.feed_update').is(':visible')) {
          jQuery('.feed_update').show('blind', 100);
        }
      }
    }
  });
}
_FEED_.updateTime = function() {
  var currentTime = new Date();
  var m = 60 * 1000;
  var h = m * 60;
  var d = h * 24;
  jQuery('div[data-chris-feed_time]').each(
      function() {
        var dateArray = jQuery(this).attr('data-chris-feed_time').split('_');
        var feedTime = new Date(dateArray[0], dateArray[1] - 1, dateArray[2],
            dateArray[3], dateArray[4], dateArray[5]);
        var diff = currentTime.getTime() - feedTime.getTime();
        var day = Math.floor(diff / d);
        if (day == 0) {
          var hour = Math.floor((diff % d) / h);
          if (hour == 0) {
            var min = Math.floor(((diff % d) % h) / m);
            jQuery(this).find('.feed_time').html(min + ' minutes ago');
          } else {
            jQuery(this).find('.feed_time').html(hour + ' hours ago');
          }
        } else {
          jQuery(this).find('.feed_time').html(day + ' days ago');
        }
      });
}
_FEED_.feed_favorite_onclick = function() {
  jQuery(document).on(
      'click',
      '.feed_favorite',
      function(e) {
        // get feed id
        $feedElt = jQuery(this).parents().eq(2);
        $feedID = $feedElt.attr('data-chris-feed_id');
        // api.php add to favorites
        jQuery.ajax({
          type : "POST",
          url : "api.php?action=set&what=feed_favorite&id=" + $feedID,
          dataType : "json",
          success : function(data) {
            // window.console.log(data);
            if (data['result'] == "1") {
              jQuery($feedElt).hide(
                  'blind',
                  'slow',
                  function() {
                    jQuery($feedElt).find('.feed_favorite').html(
                        '<i class="icon-star">');
                    jQuery($feedElt).prependTo('.feed_fav').slideDown('slow');
                  });
            } else {
              if ($feedElt.attr('data-chris-feed_status') != 100) {
                jQuery($feedElt)
                    .hide(
                        'blind',
                        'slow',
                        function() {
                          jQuery($feedElt).find('.feed_favorite').html(
                              '<i class="icon-star-empty">');
                          jQuery($feedElt).prependTo('.feed_run').slideDown(
                              'slow');
                        });
              } else {
                jQuery($feedElt)
                    .hide(
                        'blind',
                        'slow',
                        function() {
                          jQuery($feedElt).find('.feed_favorite').html(
                              '<i class="icon-star-empty">');
                          jQuery($feedElt).prependTo('.feed_fin').slideDown(
                              'slow');
                        });
              }
            }
          }
        });
        // modify
        e.stopPropagation();
      });
}
_FEED_.update_onclick = function() {
  jQuery(".feed_update").on(
      'click',
      function() {
        
        // hide the placeholder
        jQuery('.feed_empty').hide();
        
        window.scrollTo(0, 0);
        // update FINISHED feeds
        jQuery(_FEED_.finFeeds[1].join("")).hide().prependTo('.feed_fin')
            .slideDown("slow", function() { // Animation complete.
              _FEED_.finFeeds[0] = [];
              _FEED_.finFeeds[1] = [];
            });
        // update RUNNING feeds
        jQuery(_FEED_.runFeeds[1].join("")).hide().prependTo('.feed_run')
            .slideDown("slow", function() { // Animation complete.
              _FEED_.runFeeds[0] = [];
              _FEED_.runFeeds[1] = [];
            });
        // Hide feed update button
        jQuery(".feed_update").hide('blind', 'slow');
        _FEED_.updateTime();
        // re-activate draggable for all feed icons
        _FEED_.activateDraggableIcons();
      });
}
_FEED_.activateDraggable = function() {
  // setup draggable items for all file browser elements
  jQuery(".jqueryFileTree li a").draggable({
    handle : ".feed_move",
    helper : "clone",
    appendTo : "body",
    zIndex : 2500
  });
}
_FEED_.activateDraggableIcons = function() {
  jQuery('.feed_icon').draggable({
    handle : ".feed_move",
    helper : "clone",
    appendTo : "body",
    zIndex : 2500
  });
}
_FEED_.createFeedDetails = function() {
}
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  // feed functions
  // finished feeds
  _FEED_.finFeeds = [[],[]];
  // running feeds
  _FEED_.runFeeds = [[],[]];
  // on click callbacks
  _FEED_.feed_onclick();
  _FEED_.feed_favorite_onclick();
  // _FEED_.feed_title_onclick();
  _FEED_.feed_fav_onclick();
  _FEED_.feed_run_onclick();
  _FEED_.feed_fin_onclick();
  _FEED_.feed_more_onclick();
  _FEED_.update_onclick();
  _FEED_.updateFeedTimeout();
  _FEED_.updateTime();
  _FEED_.activateDraggableIcons();
  
  // show placeholder when there are no feeds
  if (jQuery('#feed_count').html() == "0") {
    jQuery('.feed_empty').show();
  }
  
});
