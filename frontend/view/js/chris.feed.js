/**
 * Define the FEED namespace
 */
var _FEED_ = _FEED_ || {};
_FEED_.onclick = function(details, more) {
  
  // generate the file browser on demand, if doesnt exist already
  var _file_browser = details.find('.file_browser');
  if (_file_browser.is(':empty')) {
    var _folder = _file_browser.attr('data-folder');
    _file_browser.fileTree({
      root : _folder,
      script : 'controller/feed.browser.connector.php'
    }, function(file) {
      alert(file);
    });
  }
  
  // also create the multi accordion
  // if it doesn't exist
  var accordionpanel = details.children('.feedpanel');
  if (!accordionpanel.hasClass('ui-accordion')) {
    
    var _last_div_index = accordionpanel.children('div').length-1;
    
    accordionpanel.multiAccordion({
      heightStyle: "content",
      animate: false,
      active: _last_div_index
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
    details.show('blind', 100);
  } else {
    if (more) {
      more.html('<a>Show details</a>');
      more.closest('.feed').css('margin-top', '-1px');
      more.closest('.feed').css('margin-bottom', '0px');
    }
    details.hide('blind', 100);
  }
  
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
    url : "controller/feed_update.php",
    dataType : "json",
    success : function(data) {
      var length_done = data['done']['id'].length;
      if (length_done > 0) {
        var i = length_done - 1;
        var duplicates = 0;
        while (i >= 0) {
          // if id there, delete it!
          var index = _FEED_.cachedFeeds[0].indexOf(data['done']['id'][i]);
          if (index >= 0) {
            // delete elements
            _FEED_.cachedFeeds[0].splice(index, 1);
            _FEED_.cachedFeeds[1].splice(index, 1);
          }
          _FEED_.cachedFeeds[0].unshift(data['done']['id'][i]);
          _FEED_.cachedFeeds[1].unshift(data['done']['content'][i]);
          // delete related feeds in progress
          var element = jQuery('div[data-chris-feed_id='
              + data['done']['id'][i] + ']');
          if (element.length) {
            element.hide('blind', 100);
          }
          i--;
        }
        // update "Update" button
        jQuery('.feed_update').html(
            'More feeds available (' + _FEED_.cachedFeeds[0].length + ')');
        if (!jQuery('.feed_update').is(':visible')) {
          jQuery('.feed_update').show('blind', 100);
        }
      }
      var length_progress = data['progress']['id'].length;
      if (length_progress) {
        for ( var i = 0; i < length_progress; i++) {
          // if element is there!
          var element = jQuery('div[data-chris-feed_id='
              + data['progress']['id'][i] + ']');
          if (element.length) {
            var _current_feed = jQuery('div[data-chris-feed_id='
                + data['progress']['id'][i] + ']');
            _current_feed.find('.feed_status').html(
                'Status: ' + data['progress']['content'][i]);
          }
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
_FEED_.update_onclick = function() {
  jQuery(".feed_update").on(
      'click',
      function() {
        window.scrollTo(0, 0);
        jQuery(_FEED_.cachedFeeds[1].join("")).hide()
            .prependTo('.feed_content').slideDown("fast", function() {
              // Animation complete.
              _FEED_.cachedFeeds[0] = [];
              _FEED_.cachedFeeds[1] = [];
              //
              jQuery(".feed_update").hide('blind', 100);
            });
        _FEED_.updateTime();
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
_FEED_.createFeedDetails = function() {

}
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  // feed functions
  _FEED_.cachedFeeds = new Array();
  _FEED_.cachedFeeds.push(new Array());
  _FEED_.cachedFeeds.push(new Array());
  _FEED_.feed_onclick();
  _FEED_.feed_more_onclick();
  _FEED_.update_onclick();
  _FEED_.updateFeedTimeout();
  _FEED_.updateTime();
  


});
