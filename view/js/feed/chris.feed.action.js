/**
 * Define the FEED namespace
 */
var _FEED_ = _FEED_ || {};

_FEED_.feed_share = function() {
  jQuery(document).on(
      'click',
      '.feed_share',
      function(e) {
        // get feed id
        var feedElt = jQuery(this).closest('.feed');
        var feedID = feedElt.attr('data-chris-feed_id');
        apprise('<h5>Which user do you want to share this feed with?</h5>', {
          'input' : new Date()
        },
            function(r) {
              if (r) {
                // 
                var _user_name = r;
                // send to the launcher
                jQuery.ajax({
                  type : "POST",
                  url : "api.php?action=set&what=feed_share&id=" + feedID
                      + "&parameters[]=" + _user_name,
                  dataType : "json",
                  success : function(data) {
                    if (data['result'] == '') {
                      jQuery()
                          .toastmessage(
                              'showSuccessToast',
                              '<h5>Feed Shared with <b>' + _user_name
                                  + '</b></h5>');
                    } else {
                      jQuery().toastmessage(
                          'showErrorToast',
                          '<h5>Feed not shared</h5><br><b>' + data['result']
                              + '</b>');
                    }
                  }
                });
              } else {
                jQuery().toastmessage('showErrorToast',
                    '<h5>Feed not shared</h5>');
              }
            });
        // now fetch the user list for autocompletion
        jQuery.ajax({
          type : 'GET',
          url : 'api.php?action=get&what=users',
          dataType : "json",
          success : function(data) {
            if (data['result'] != '') {
              $('.aTextbox').typeahead({
                source : data['result']
              });
            }
          }
        });
        // modify
        e.stopPropagation();
      });
}
_FEED_.feed_favorite = function() {
  jQuery(document).on(
      'click',
      '.feed_favorite',
      function(e) {
        // modify
        e.stopPropagation();
        // get feed id
        var feedElt = jQuery(this).closest('.feed');
        var feedID = feedElt.attr('data-chris-feed_id');
        var allElts = jQuery('div[data-chris-feed_id=' + feedID + ']');
        // api.php add to favorites
        jQuery.ajax({
          type : "POST",
          url : "api.php?action=set&what=feed_favorite&id=" + feedID,
          dataType : "json",
          success : function(data) {
            jQuery(allElts).each(
                function() {
                  var elt = jQuery(this);
                  if (!elt.parent().hasClass('feed_sea_content')) {
                    if (data['result'] == "1") {
                      jQuery(elt).hide(
                          'blind',
                          'slow',
                          function() {
                            jQuery(elt).find('.feed_favorite > i')
                                .removeClass().addClass('icon-star');
                            jQuery(elt).find('.feed_favorite > span').html(
                            '<b>Favorited</b>');
                            jQuery(elt).prependTo('.feed_fav_content')
                                .slideDown('slow');
                          });
                    } else {
                      if (elt.attr('data-chris-feed_status') != 100) {
                        jQuery(elt).hide(
                            'blind',
                            'slow',
                            function() {
                              jQuery(elt).find('.feed_favorite > i')
                                  .removeClass().addClass('icon-star-empty');
                              jQuery(elt).find('.feed_favorite > span').html(
                              'Favorite');
                              jQuery(elt).prependTo('.feed_run_content')
                                  .slideDown('slow');
                            });
                      } else {
                        jQuery(elt).hide(
                            'blind',
                            'slow',
                            function() {
                              jQuery(elt).find('.feed_favorite > i')
                                  .removeClass().addClass('icon-star-empty');
                              jQuery(elt).find('.feed_favorite > span').html(
                              'Favorite');
                              jQuery(elt).prependTo('.feed_fin_content')
                                  .slideDown('slow');
                            });
                      }
                    }
                  } else {
                    if (data['result'] == "1") {
                      jQuery(elt).find('.feed_favorite > i').removeClass()
                          .addClass('icon-star');
                      jQuery(elt).find('.feed_favorite > span').html(
                      '<b>Favorited</b>');
                    } else {
                      jQuery(elt).find('.feed_favorite > i').removeClass()
                          .addClass('icon-star-empty');
                      jQuery(elt).find('.feed_favorite > span').html(
                      'Favorite');
                    }
                  }
                });
          }
        });
      });
}
_FEED_.feed_archive = function() {
  jQuery(document).on(
      'click',
      '.feed_archive',
      function(e) {
        // modify
        e.stopPropagation();
        // get feed id
        var feedElt = jQuery(this).closest('.feed');
        var feedID = feedElt.attr('data-chris-feed_id');
        var allElts = jQuery('div[data-chris-feed_id=' + feedID + ']');
        // api.php add to favorites
        jQuery.ajax({
          type : "POST",
          url : "api.php?action=set&what=feed_archive&id=" + feedID,
          dataType : "json",
          success : function(data) {
            jQuery(allElts)
                .each(
                    function() {
                      var elt = jQuery(this);
                      if (elt.parent().hasClass('feed_sea_content')) {
                        if (data['result'] == "1") {
                          jQuery(elt).find('.feed_archive > i').removeClass()
                              .addClass('icon-plus');
                          // update text
                          jQuery(elt).find('.feed_archive > span').html(
                              'Restore');
                        } else {
                          jQuery(elt).find('.feed_archive > i').removeClass()
                              .addClass('icon-remove');
                          // update text
                          jQuery(elt).find('.feed_archive > span').html(
                              'Archive');
                          // clone and put at good location!
                          clone = elt.clone().hide();
                          // if favorite, push it in the favorites
                          if (elt.find('.feed_favorite > i').hasClass(
                              'icon-star')) {
                            jQuery(clone).prependTo('.feed_fav_content')
                                .slideDown('slow');
                          } else {
                            if (elt.attr('data-chris-feed_status') != 100) {
                              jQuery(clone).prependTo('.feed_run_content')
                                  .slideDown('slow');
                            } else {
                              jQuery(clone).prependTo('.feed_fin_content')
                                  .slideDown('slow');
                            }
                          }
                        }
                      } else {
                        // remove
                        if (data['result'] == "1") {
                          jQuery(elt).hide('blind', 'slow', function() {
                            jQuery(this).remove();
                          });
                        }
                      }
                    });
          }
        });
      });
}
_FEED_.feed_rename = function(_me, event) {
  // avoid collapsing/expanding the feed
  var e = window.event;
  if (!e) {
    e = event;
  }
  e.stopPropagation();
  // collapse the feed
  _me.closest('.feed').find('.feed_details').slideUp('fast');
  // hide the label and the edit icon
  // show the textbox
  _me.hide();
  var _label = _me.prev().prev();
  _label.hide();
  var _old_name = _label.html();
  var _textbox = _me.prev();
  _textbox.show('fade');
  _textbox.trigger('focus');
  var _exit_callback = function() {
    // save this guy.
    var _value = _textbox.val();
    var _feed_id = _me.closest('.feed').attr('data-chris-feed_id');
    // call the API
    jQuery.ajax({
      type : 'POST',
      url : 'api.php',
      data : {
        action : 'set',
        what : 'feed_name',
        id : _feed_id,
        parameters : _value
      },
      dataType : 'json',
      success : function(data) {
        var safe_name = data['result'][0];
        var _folder = data['result'][1] + '/';
        // propagate the value in the UI
        _label.html(safe_name);
        // re-generate the file browser
        var _file_browser = _me.closest('.feed').find('.file_browser');
        // re-propagate the folder
        _file_browser.attr('data-folder', _folder);
        // reshow the label and the edit icon
        _me.show();
        _textbox.hide();
        _label.show('fade');
      }
    });
  }
  _textbox.keypress(function(e) {
    // if not enter, do not save
    if (e.keyCode != 13) {
      return;
    }
    _exit_callback();
  });
  _textbox.blur(_exit_callback); // focus lost
}
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  _FEED_.feed_share();
  _FEED_.feed_favorite();
  _FEED_.feed_archive();
});