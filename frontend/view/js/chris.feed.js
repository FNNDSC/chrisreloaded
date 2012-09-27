/**
 * Define the FEED namespace
 */
var _FEED_ = _FEED_ || {};
_FEED_.onclick = function(more, details) {
  var hidden = details.is(':hidden');
  if (hidden) {
    more.html('<a>Hide details</a>');
    more.closest('.feed').css('margin-top', '10px');
    more.closest('.feed').css('margin-bottom', '11px');
    details.show('blind', 100);
  } else {
    more.html('<a>Show details</a>');
    more.closest('.feed').css('margin-top', '-1px');
    more.closest('.feed').css('margin-bottom', '0px');
    details.hide('blind', 100);
  }
}
_FEED_.more_onclick = function() {
  jQuery(".more").live('click', function(e) {
    // modify
    e.stopPropagation();
    var details = jQuery(this).closest('.preview').next();
    _FEED_.onclick(jQuery(this), details);
  });
}
_FEED_.feed_onclick = function() {
  jQuery(".feed").live(
      'click',
      function() {
        // modify
        // alert('Show details!');
        var details = jQuery(this).children('.details');
        var more = jQuery(this).children('.preview').children('.content')
            .children('.more');
        _FEED_.onclick(more, details);
      });
}
_FEED_.feed_mouseenter = function() {
  jQuery(".feed").live('mouseenter', function() {
    jQuery(this).css('background', '-moz-linear-gradient(top, #fff, #eee)');
    /* jQuery(this).css('background', '-moz-linear-gradient(top, #eee, #ddd)'); */
  });
}
_FEED_.feed_mouseleave = function() {
  jQuery(".feed").live('mouseleave', function() {
    jQuery(this).css('background', '#fff');
    /* jQuery(this).css('background', '-moz-linear-gradient(top, #fff, #eee)'); */
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
      if (length_done) {
        for ( var i = length_done - 1; i == 0; i--) {
          // if id there, delete it!
          var index = _FEED_.cachedFeeds[0].indexOf(data['done']['id'][i]);
          if (index >= 0) {
            _FEED_.cachedFeeds[0][index] = '';
            _FEED_.cachedFeeds[1][index] = '';
          }
          _FEED_.cachedFeeds[0].unshift(data['done']['id'][i]);
          _FEED_.cachedFeeds[1].unshift(data['done']['content'][i]);
          // _FEED_.cachedFeeds = data['done']['content'][i] +
          // _FEED_.cachedFeeds;
          // delete related feeds in progress
          var element = jQuery('#' + data['done']['id'][i]
              + '_feed_progress-feed');
          if (element.length) {
            element.hide('blind', 100);
          }
        }
        // update "Update" button
        jQuery('.feed_update').html('More feeds available');
        jQuery('.feed_update').show('blind', 100);
      }
      var length_progress = data['progress']['id'].length;
      if (length_progress) {
        for ( var i = 0; i < length_progress; i++) {
          // get %
          var test = data['progress']['content'][i].split("");
          // get number of "0"
          var newlength = test.length;
          var count = 0;
          for ( var j = 0; j < newlength; j++) {
            if (test[j] == 0) {
              count++;
              // show icons for visible elements
              var string = '#' + data['progress']['id'][i]
                  + '_feed_progress-feed .details .data';
              var elt = jQuery(string).eq(j).find("span").eq(0);
              elt.show();
            }
          }
          percent = Math.round(count / newlength * 100);
          // update percent
          jQuery(
              '#' + data['progress']['id'][i]
                  + '_feed_progress-feed .feed_progress_status').html(
              percent + '%');
          // Do something
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
  jQuery('.time').each(
      function() {
        var dateArray = jQuery(this).attr('id').split('_');
        var feedTime = new Date(dateArray[0], dateArray[1] - 1, dateArray[2],
            dateArray[3], dateArray[4], dateArray[5]);
        var diff = currentTime.getTime() - feedTime.getTime();
        var day = Math.floor(diff / d);
        if (day == 0) {
          var hour = Math.floor((diff % d) / h);
          if (hour == 0) {
            var min = Math.floor(((diff % d) % h) / m);
            jQuery(this).html(min + ' minutes ago');
          } else {
            jQuery(this).html(hour + ' hours ago');
          }
        } else {
          jQuery(this).html(day + ' days ago');
        }
      });
}
_FEED_.update_onclick = function() {
  jQuery(".feed_update").live(
      'click',
      function() {
        // update the feeds
        jQuery(_FEED_.cachedFeeds[1].toString()).hide().prependTo(
            '.feed_content').slideDown("fast", function() {
          // Animation complete.
          _FEED_.cachedFeeds[0] = [];
          _FEED_.cachedFeeds[1] = [];
          //
          jQuery(".feed_update").hide('blind', 100);
        });
        _FEED_.updateTime();
      });
}
_FEED_.setupPreview = function() {
  jQuery(".feed_preview").live('click', function(e) {
    e.stopPropagation();
    var full_id = jQuery(this).attr('id');
    var id = full_id.substring(0, full_id.length - 6);
    _DATA_.PreviewSeries = id.replace(/\_/g, ".");
    _DATA_.PreviewNbFiles = '-1';
    _DATA_.PreviewDesc = 'Image name';
    _DATA_.startPreview();
  });
}
_FEED_.setupLocation = function() {
  jQuery(".feed_location").live('mouseenter', function(e) {
    /*
     * e.stopPropagation(); var full_id = jQuery(this).attr('id'); var id =
     * full_id.substring(0, full_id.length - 6).replace(/\_/g, "."); // ajax
     * call jQuery.ajax({ type : "POST", url : "controller/data_location.php",
     * dataType : "text", data : { DATA_SER_UID : id }, success : function(data) {
     * if (data) { var text_id = full_id.substring(0, full_id.length - 6) +
     * '-feedlt'; jQuery("#" + text_id).html(data.replace(/\\/g, ""));
     * jQuery("#" + text_id).show(); // alert(data.replace(/\\/g, "")); } } });
     */
  });
  jQuery(".feed_location").live('mouseleaves', function(e) {
    /*
     * e.stopPropagation(); var full_id = jQuery(this).attr('id'); var id =
     * full_id.substring(0, full_id.length - 6).replace(/\_/g, "."); var text_id =
     * full_id.substring(0, full_id.length - 6) + '-feedlt'; jQuery("#" +
     * text_id).hide();
     */
  });
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
  _FEED_.more_onclick();
  _FEED_.update_onclick();
  _FEED_.feed_mouseenter();
  _FEED_.feed_mouseleave();
  _FEED_.updateFeedTimeout();
  _FEED_.updateTime();
  _FEED_.setupPreview();
  _FEED_.setupLocation();
});