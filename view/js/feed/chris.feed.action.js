/**
 * Define the FEED namespace
 */
var _FEED_ = _FEED_ || {};

_FEED_.feed_share_onclick = function() {
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

/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  _FEED_.feed_share_onclick();
});
