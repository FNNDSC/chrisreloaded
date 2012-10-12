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
_FEED_.feed_more_onclick = function() {

  jQuery(document).on('click', '.feed_more', function(e) {

    // modify
    e.stopPropagation();
    var details = jQuery(this).closest('.feed').find('.feed_details');
    _FEED_.onclick(jQuery(this), details);
  });
}
_FEED_.feed_onclick = function() {

  jQuery(document).on('click', '.feed',

  function() {

    // modify
    // alert('Show details!');
    
    var more = jQuery(this).find('.feed_more');
    var details = jQuery(this).find('.feed_details');
    _FEED_.onclick(more, details);
  });
}
_FEED_.feed_mouseenter = function() {

  jQuery(document).on('mouseenter', '.feed', function() {

    jQuery(this).addClass('feed_gradient');
    
  });
}
_FEED_.feed_mouseleave = function() {

  jQuery(document).on('mouseleave', '.feed', function() {

    jQuery(this).removeClass('feed_gradient');
    
  });
}
_FEED_.updateFeedTimeout = function() {

  timer = setInterval(_FEED_.refresh, 2000);
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
    type: "POST",
    url: "controller/feed_update.php",
    dataType: "json",
    success: function(data) {

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
          var element = jQuery('#' + data['done']['id'][i] +
              '_feed_progress-feed');
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
          var element = jQuery('#' + data['progress']['id'][i] +
              '_feed_progress-feed');
          if (element.length) {
            // get %
            var test = data['progress']['content'][i].split("");
            // get number of "0"
            var newlength = test.length;
            var count = 0;
            for ( var j = 0; j < newlength; j++) {
              if (test[j] == 0) {
                count++;
                // show icons for visible elements
                var string = '#' + data['progress']['id'][i] +
                    '_feed_progress-feed .details .data';
                var elt = jQuery(string).eq(j).find("span").eq(1);
                elt.show();
              }
            }
            percent = Math.round(count / newlength * 100);
            // update percent
            jQuery(
                '#' + data['progress']['id'][i] +
                    '_feed_progress-feed .feed_progress_status').html(
                percent + '%');
            // Do something
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
  jQuery('.feed_time').each(
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

  jQuery(".feed_update").on(
      'click',
      function() {

        // update the feeds
        // console.log(_FEED_.cachedFeeds);
        // return;
        
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
_FEED_.setupPreview = function() {

  jQuery(document).on(
      'click',
      '.feed_preview',
      function(e) {

        e.stopPropagation();
        var full_id = jQuery(this).attr('id');
        var id = full_id.substring(0, full_id.length - 6);
        _DATA_.PreviewSeries = id.replace(/\_/g, ".");
        _DATA_.PreviewNbFiles = '-1';
        // get sth else
        _DATA_.PreviewDesc = jQuery(this).parents().eq(1).find('span').eq(0)
            .html();
        _DATA_.startPreview();
      });
}
_FEED_.setupLocation = function() {

  jQuery(".feed_location").on('mouseenter', function(e) {

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
  jQuery(".feed_location").on('mouseleaves', function(e) {

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
  _FEED_.feed_more_onclick();
  _FEED_.update_onclick();
  _FEED_.feed_mouseenter();
  _FEED_.feed_mouseleave();
  _FEED_.updateFeedTimeout();
  _FEED_.updateTime();
  _FEED_.setupPreview();
  _FEED_.setupLocation();
});
