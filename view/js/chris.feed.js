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
    url : "api.php?action=get&what=feed_updates&parameters[]=" + _FEED_.newest,
    dataType : "json",
    success : function(data) {
      data = data['result'];
      // update newest feed
      _FEED_.newest = data['feed_new'];
      // update FINISHED feeds
      var length_done = data['new']['id'].length;
      if (length_done > 0) {
        var i = length_done - 1;
        while (i >= 0) {
          // if id in new delete it!
          var index = _FEED_.finFeeds[0].indexOf(data['new']['id'][i]);
          if (index >= 0) {
            // delete elements
            _FEED_.finFeeds[0].splice(index, 1);
            _FEED_.finFeeds[1].splice(index, 1);
          }
          // if id in running delete it
          index = _FEED_.runFeeds[0].indexOf(data['new']['id'][i]);
          if (index >= 0) {
            // delete elements
            _FEED_.runFeeds[0].splice(index, 1);
            _FEED_.runFeeds[1].splice(index, 1);
          }
          var element = jQuery('div[data-chris-feed_id=' + data['new']['id'][i]
              + ']');
          // hide element if exists
          if (element.length && element.find('i').hasClass('icon-star')) {
            // and if not favorite
            // update its status to 100%
            element.attr('data-chris-feed_status', '100');
            element.find('.feed_status').html(
                'Status: <font color=green>Done</font>');
          } else {
            element.hide('blind', 'slow');
            // hide element to relevant list based on status
            if (data['new']['status'][i] == '100') {
              _FEED_.finFeeds[0].unshift(data['new']['id'][i]);
              _FEED_.finFeeds[1].unshift(data['new']['content'][i]);
            } else {
              _FEED_.runFeeds[0].unshift(data['new']['id'][i]);
              _FEED_.runFeeds[1].unshift(data['new']['content'][i]);
            }
          }
          i--;
        }
      }
      // update RUNNING feeds
      // issue: doesnt update feed is not visible
      var length_done = data['running']['id'].length;
      if (length_done > 0) {
        var i = length_done - 1;
        while (i >= 0) {
          var element = jQuery('div[data-chris-feed_id='
              + data['running']['id'][i] + ']');
          // hide element if exists
          if (element.length) {
            element.find('.feed_status').html(
                'Status: <font color=red>Running ('
                    + data['running']['content'][i] + '%)</font>');
          }
          i--;
        }
      }
      var $newFeeds = _FEED_.finFeeds[0].length + _FEED_.runFeeds[0].length;
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
  jQuery('div[data-chris-feed_time]').each(function() {
    var feedTime = new Date(jQuery(this).attr('data-chris-feed_time') * 1000);
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
        jQuery('.feed_content').scrollTop();
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
_FEED_.scrollBottom = function() {
  jQuery('.feed_content').scroll(
      function() {
        if ($(this)[0].scrollHeight - $(this).scrollTop() <= $(this).height()) {
          // ajax call
          jQuery.ajax({
            type : "POST",
            url : "api.php?action=get&what=feed_previous&parameters[]="
                + _FEED_.oldest,
            dataType : "json",
            success : function(data) {
              data = data['result'];
              // update oldest feed
              _FEED_.oldest = data['feed_old'];
              old_Feeds = '';
              var length_done = data['content'].length;
              if (length_done > 0) {
                var i = 0;
                while (i <= length_done - 1) {
                  // if id in new delete it!
                  old_Feeds += data['content'][i];
                  i++;
                }
              }
              jQuery('.feed_fin').append(old_Feeds);
              _FEED_.updateTime();
              jQuery('.feed_content').bind('scroll');
            }
          });
        }
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
  // get oldest and newest feed value
  _FEED_.oldest = '00.00';
  _FEED_.newest = '9999999999.00';
  // first run or first finished
  var newest = '';
  var oldest = '';
  //
  var elt = jQuery(".feed_run > .feed");
  if (elt.length) {
    newest = jQuery(elt[0]).attr('data-chris-feed_time');
    oldest = jQuery(elt[elt.length - 1]).attr('data-chris-feed_time');
  }
  // feed_fin
  elt = jQuery(".feed_fin > .feed");
  if (elt.length) {
    if (jQuery(elt[0]).attr('data-chris-feed_time') > newest) {
      newest = jQuery(elt[0]).attr('data-chris-feed_time');
    }
    if (jQuery(elt[elt.length - 1]).attr('data-chris-feed_time') > oldest) {
      oldest = jQuery(elt[elt.length - 1]).attr('data-chris-feed_time');
    }
  }
  // get first element
  _FEED_.oldest = oldest;
  _FEED_.newest = newest;
  // feed functions
  // finished feeds
  _FEED_.finFeeds = [ [], [] ];
  // running feeds
  _FEED_.runFeeds = [ [], [] ];
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
  _FEED_.scrollBottom();
});
