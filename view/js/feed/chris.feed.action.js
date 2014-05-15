/**
 * Define the FEED namespace
 */
var _FEED_ = _FEED_ || {};

_FEED_.singleAction = function(el){
  // if 3 parent has class "feed_header_line_one", we go for a single action
  if($(el).parent().parent().parent().hasClass('feed_header_line_one')){
    return true;
  }

  return false;
}

_FEED_.feed_check_action = function(id){
  var allElts = jQuery('div[data-chris-feed_id=' + id + ']');

  jQuery(allElts).each(function(){
    $(this).attr('data-chris-feed_checked', 'true');
    $(this).find('.feed_uncheck').css('display', 'block');
    $(this).find('.feed_header').css('backgroundColor', 'rgb(204, 204, 204)');
    $(this).find('.feed_header').css('color', '#353535');
  });
}

_FEED_.feed_ucheck_action = function(id){
  var allElts = jQuery('div[data-chris-feed_id=' + id + ']');
  jQuery(allElts).each(function(){
    $(this).attr('data-chris-feed_checked', 'false');
    $(this).find('.feed_uncheck').css('display', 'none');
    $(this).find('.feed_header').css('backgroundColor', '');
    $(this).find('.feed_header').css('color', '');
  });
}

_FEED_.feed_check = function() {
    jQuery(document).on(
      'click',
      '.cat_check',
      function(event) {
        event.stopPropagation();
        event.preventDefault(); 

        // get value
        var checked = jQuery(this).attr("data-chris-ui-checkbox");
        var allElts = jQuery(this).parent().parent().find('.feed');
        if(checked == "true"){
          jQuery(allElts).each(function(){
            $(this).find('.feed_icon').addClass('flip');
            _FEED_.feed_check_action($(this).attr('data-chris-feed_id'));
          });
        }
        else{
          jQuery(allElts).each(function(){
            $(this).find('.feed_icon').removeClass('flip');
            _FEED_.feed_ucheck_action($(this).attr('data-chris-feed_id'));
          });
        }
      });

  jQuery(document).on(
      'click',
      '.feed_icon',
      function(event) {

          event.preventDefault();
          event.stopPropagation();

          // if flip class
          if( jQuery(this).hasClass('flip')){
              $(this).removeClass('flip');
              var feedElt = jQuery(this).closest('.feed');
              var feedID = feedElt.attr('data-chris-feed_id');
              _FEED_.feed_ucheck_action(feedID);
          }
          else{
              $(this).addClass('flip');
              var feedElt = jQuery(this).closest('.feed');
              var feedID = feedElt.attr('data-chris-feed_id');
              _FEED_.feed_check_action(feedID);
          }
      });
}

_FEED_.feed_view = function() {
  jQuery(document).on(
      'click',
      '.feed_view',
      _FEED_.feed_view_action);
}

_FEED_.feed_view_action = function(e, el){
          // modify
        e.stopPropagation();

         var feedID = '';
         var feedFolder = '';

        // view whole feed or filebrowser directory?
        if(typeof(el) == 'undefined'){

            var feedElt = jQuery(this).closest('.feed');

            feedID = feedElt.attr('data-chris-feed_id');
            feedFolder = feedElt.find('.file_browser').attr('data-folder');
            
        }
        else{

            feedFolder = jQuery(el).parent().attr('data-full-path');

        }

        // start viewer interactive plugin - HOW?
        // 1- show plugin
        // 2- update params
        // 3- GO
        // 4- what if is already open?
        // update viewer default values

        var inputs = $("#panel_viewer .parameter_input");

        jQuery(inputs).each(function(){

            var flag = $(this).attr('data-flag');
            var content = '';
            if(flag == '--directory'){
              content = feedFolder;
            }
            else if(flag == '--feedid'){
              content = feedID;
            }
            else{
              content = '';
            }

            $(this).find('textarea').attr('data-default', content);
            $(this).find('textarea').val(content);
        });

        // If I am already in the viewer plugin, this is not necessary
        var _visible_panel = jQuery('.plugin_panel:visible');
        var _plugin_name = _visible_panel.attr('id').replace('panel_', '');
        var _plugin_interactive = _visible_panel.attr('data-interactive');

        // if interactive and NOT viewer
        if( _plugin_name != 'viewer' && _plugin_interactive == 'True'){
          
          // if interactive, listen for event to avoid timing issues
          jQuery('.interactive_plugin_content').on("cleanInteractive",
            function(e, param1, param2) {
              jQuery('.interactive_plugin_content').off("cleanInteractive");
              jQuery("#plugin_submit").click();
            });

          $("#cart_categories").val("viewer").change();

        }
        // if not interactive, not timing issue, all sequential
        else if(_plugin_name != 'viewer' ){

          $("#cart_categories").val("viewer").change();
          $("#plugin_submit").click();

        }
        // if viewer
        else{

          $("#plugin_submit").click();

        }
}

_FEED_.feed_share = function() {
  jQuery(document).on(
      'click',
      '.feed_share',
      function(e) {

        // modify
        e.stopPropagation();

        // get feed id
        var feedIDs = [];

        // is single action?
        if(_FEED_.singleAction(this)){
          var feedElt = jQuery(this).closest('.feed');
          feedIDs.push(feedElt.attr('data-chris-feed_id'));
        }
        else{
          // get all checked elements
          var allElts = jQuery(this).parent().parent().parent().find('div[data-chris-feed_checked=true]');
          // loop though all elements
          jQuery(allElts).each(function(){
            var feedID = $(this).attr('data-chris-feed_id');
            if(feedIDs.indexOf(feedID) == -1){
              feedIDs.push(feedID);
            }
          });
        }

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
                  url : "api.php",
                  dataType : "json",
                  data : {
                    action : 'set',
                    what : 'feed_share',
                    id : feedIDs,
                    parameters : _user_name
                  },
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

_FEED_.feed_favorite_action = function(el){
        // get feed id
        var feedElt = jQuery(el).closest('.feed');
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
                      if (elt.attr('data-chris-feed_status') < 100) {
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
                      jQuery(elt).find('.feed_favorite > span')
                          .html('Favorite');
                    }
                  }
                });
          }
        });
}

_FEED_.feed_favorite = function() {
  jQuery(document).on(
      'click',
      '.feed_favorite',
      function(e) {
        // modify
        e.stopPropagation();

        // is single action?
        if(_FEED_.singleAction(this)){
          _FEED_.feed_favorite_action(this);
        }
        else{
          // get all checked elements
          //get target
          var allElts = jQuery(this).parent().parent().parent().find('div[data-chris-feed_checked=true]');
          // loop though all elements
          var  processedFeeds = [];
          jQuery(allElts).each(function(){
            var feedID = $(this).attr('data-chris-feed_id');
            if(processedFeeds.indexOf(feedID) == -1){
            _FEED_.feed_favorite_action(this);
            processedFeeds.push(feedID);
            }
          });
        }
      });

    // search favorite
    jQuery(document).on(
      'click',
      '.sfeed_favorite',
      function(e) {
        // modify
        e.stopPropagation();

        // get all un-favorite checked elements
        var shortcut = jQuery(this).parent().parent().parent().find('div[data-chris-feed_checked=true]');
        var allElts = shortcut.filter(function() {
          return $(this).find('.icon-star-empty').length === 1;
        });
        // loop though all elements
        var  processedFeeds = [];
        jQuery(allElts).each(function(){
        var feedID = $(this).attr('data-chris-feed_id');
          if(processedFeeds.indexOf(feedID) == -1 ){
            _FEED_.feed_favorite_action(this);
            processedFeeds.push(feedID);
          }
        });
      });

        // search favorite
    jQuery(document).on(
      'click',
      '.sfeed_ufavorite',
      function(e) {
        // modify
        e.stopPropagation();

        // get all un-checked elements
        var shortcut = jQuery(this).parent().parent().parent().find('div[data-chris-feed_checked=true]');
        var allElts = shortcut.filter(function() {
          return $(this).find('.icon-star').length === 1;
        });
        // loop though all elements
        var  processedFeeds = [];
        jQuery(allElts).each(function(){
        var feedID = $(this).attr('data-chris-feed_id');
          if(processedFeeds.indexOf(feedID) == -1 ){
            _FEED_.feed_favorite_action(this);
            processedFeeds.push(feedID);
          }
        });
      });
}

_FEED_.feed_archive_action = function(el){
        // get feed id
        var feedElt = jQuery(el).closest('.feed');
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
                            // get one more feed
                            if( jQuery('.feed_fin').height() < jQuery('.feed_content').height()){
                              _FEED_.getPreviousFeed(1);
                            }           
                          });
                        }
                      }
                    });
          }
        });
}

_FEED_.feed_archive = function() {
  jQuery(document).on(
      'click',
      '.feed_archive',
      function(e) {
        // modify
        e.stopPropagation();

        // is single action?
        if(_FEED_.singleAction(this)){
          _FEED_.feed_archive_action(this);
        }
        else{
          // get all checked elements
          var allElts = jQuery(this).parent().parent().parent().find('div[data-chris-feed_checked=true]');
          // loop though all elements
          var processedFeeds = [];
          jQuery(allElts).each(function(){
            var feedID = $(this).attr('data-chris-feed_id');
            if(processedFeeds.indexOf(feedID) == -1){
            _FEED_.feed_archive_action(this);
            processedFeeds.push(feedID);
          }
        });
      }
    });

      // search favorite
    jQuery(document).on(
      'click',
      '.sfeed_archive',
      function(e) {
        // modify
        e.stopPropagation();

        // get all un-favorite checked elements
        var shortcut = jQuery(this).parent().parent().parent().find('div[data-chris-feed_checked=true]');
        var allElts = shortcut.filter(function() {
          return $(this).find('.icon-remove').length === 1;
        });
        // loop though all elements
        var  processedFeeds = [];
        jQuery(allElts).each(function(){
        var feedID = $(this).attr('data-chris-feed_id');
          if(processedFeeds.indexOf(feedID) == -1 ){
            _FEED_.feed_archive_action(this);
            processedFeeds.push(feedID);
          }
        });
      });

        // search favorite
    jQuery(document).on(
      'click',
      '.sfeed_uarchive',
      function(e) {
        // modify
        e.stopPropagation();

        // get all un-checked elements
        var shortcut = jQuery(this).parent().parent().parent().find('div[data-chris-feed_checked=true]');
        var allElts = shortcut.filter(function() {
          return $(this).find('.icon-plus').length === 1;
        });
        // loop though all elements
        var  processedFeeds = [];
        jQuery(allElts).each(function(){
        var feedID = $(this).attr('data-chris-feed_id');
          if(processedFeeds.indexOf(feedID) == -1 ){
            _FEED_.feed_archive_action(this);
            processedFeeds.push(feedID);
          }
        });
      });
}

_FEED_.feed_rename = function() {
  jQuery(document).on('keypress', '.feed_name_edit', function(e) {
    // if not enter, do not save
    if (e.keyCode != 13) {
      return;
    }
    // trigger blur
    jQuery(this).trigger('blur');
  });
  jQuery(document).on('blur', '.feed_name_edit', function(e) {
    var _value = jQuery(this).val();
    var _label = jQuery(this).prev();
    var _icon = jQuery(this).next();
    var _input = jQuery(this);
    var _feed_id = jQuery(this).closest('.feed').attr('data-chris-feed_id');
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
        var _file_browser = _input.closest('.feed').find('.file_browser');
        // re-propagate the folder
        _file_browser.attr('data-folder', _folder);
        // reshow the label and the edit icon
        _icon.css('display', '');
        _input.hide();
        _input.removeClass('focused');
        _label.show('fade');
      }
    });
  });
  jQuery(document).on('click', '.feed_edit_icon', function(e) {
    e.stopPropagation();
    // collapse the feed
    jQuery(this).closest('.feed').find('.feed_details').slideUp('fast');
    // hide the label and the edit icon
    // show the textbox
    jQuery(this).hide();
    var _label = jQuery(this).prev().prev();
    _label.hide();
    var _old_name = _label.html();
    var _textbox = jQuery(this).prev();
    _textbox.show('fade');
    _textbox.trigger('focus');
    _textbox.addClass('focused');
  });
}
_FEED_.feed_cancel = function() {
  jQuery(document).on(
      'click',
      '.feed_cancel',
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
          url : "api.php?action=set&what=feed_cancel&id=" + feedID,
          dataType : "json",
          success : function(data) {
            jQuery(allElts).each(
                function() {
                  var elt = jQuery(this);
                  if (elt.parent().hasClass('feed_sea_content')
                      || elt.find('i').hasClass('icon-star')) {
                    // this feed is favorited or is inside search div, meaning
                    // that we don't
                    // hide it
                    return;
                  }
                  // hide the div
                  elt.hide('blind', 'slow');
                });
          }
        });
      });
}
_FEED_.feed_tag = function() {
    jQuery(document).on(
      'click',
      '.inmodal',
      function(e) {
       e.stopPropagation();
       if(_MODALTAG_.selectedTagID != ''){
         // clean style
         var target = document.querySelector('#'+_MODALTAG_.selectedTagID);
         target.classList.remove('tagselected');
       }
       if(_MODALTAG_.selectedTagID != e.target.id){
         e.target.classList.add('tagselected');
         _MODALTAG_.selectedTagID = e.target.id;
       }
       else{
         _MODALTAG_.selectedTagID = '';
       }
      });

    jQuery(document).on(
      'click',
      '.inmodal > img',
      function(e) {
        e.stopPropagation();
        r = window.confirm("The tag will be deleted!");
        if (r){
          var spanElt = e.target.parentElement;

          // delete from the js array
          for (var i = 0; i < _MODALTAG_.tags.length; i++) {
            if(_MODALTAG_.tags[i] != null && spanElt.id.substring(4) == _MODALTAG_.tags[i].id){
              _MODALTAG_.tags[i] = null;
              break;
            }
          };

          // reest selection
          if(_MODALTAG_.selectedTagID == spanElt.id){
            _MODALTAG_.selectedTagID = '';
          };
        
        // delete tag from DB
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'api.php', true);

        var data = new FormData();
        data.append('action', 'remove');
        data.append('what', 'tag');
        data.append('tagid', spanElt.id.substring(4));
        // GO!
        xhr.send(data);

        // delete from all feeds
        var targets = document.querySelectorAll("[data-chris-tag_id='"+spanElt.id.substring(4)+"']");
        for (var i = 0, len = targets.length; i < len; i++) {

          (targets[i].parentNode).removeChild(targets[i]);
        }

        // // delete the tag from the GUI
        // (spanElt.parentNode).removeChild(spanElt);
        }
        else{
          // nothing
        }
      });

  jQuery(document).on(
      'click',
      '.feed_tag',
      function(e) {
        // modify
        e.stopPropagation();

      //check if color input is supported, warn user, ideally should be invisble to the user...
      if (!Modernizr.inputtypes.color) {
        // no native support for <input type="date"> :(
        alert('Your browser does not appear to support "colors input type".\nhttp://caniuse.com/#feat=input-color\nUse Chrome 20+ for the best labbook experience.');
        $("#tagcolor").val('#000000');
        $("#tagcolorhelp").show();
      }

        // get feed id
        var feedIDs = [];

        // is single action?
        if(_FEED_.singleAction(this)){
          var feedElt = jQuery(this).closest('.feed');
          feedIDs.push(feedElt.attr('data-chris-feed_id'));
        }
        else{
          // get all checked elements
          var allElts = jQuery(this).parent().parent().parent().find('div[data-chris-feed_checked=true]');
          // loop though all elements
          jQuery(allElts).each(function(){
            var feedID = $(this).attr('data-chris-feed_id');
            if(feedIDs.indexOf(feedID) == -1){
              feedIDs.push(feedID);
            }
          });
        }

        // modal with feed id + user id
        jQuery('#TAGMODAL').addClass('largePreview');
        jQuery('#TAGMODAL').css('margin-left',
        jQuery('#TAGMODAL').outerWidth() / 2 * -1);
        jQuery('#TAGMODAL').modal();

        jQuery('#TAGMODAL').on('shown', function() {
          // pass feed to add tags directly?
          _MODALTAG_.load(feedIDs, jQuery('#TAGMODAL'));
        });
      });

  jQuery(document).on(
      'click',
      '.infeed > img',
      function(e) {
        // modify
        e.stopPropagation();

        var feedElt = jQuery(this).closest('.feed');
        var feedID = feedElt.attr('data-chris-feed_id');
        var allFeedsElts = jQuery('[data-chris-feed_id=' + feedID + ']');
        var tagElt = jQuery(this).closest('.tag');
        var tagID = tagElt.attr('data-chris-tag_id');

        // remove in db, then remove in ui
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'api.php', true);

        var data = new FormData();
        data.append('action', 'set');
        data.append('what', 'tag');
        data.append('feedid', feedID);
        data.append('tagid', tagID);
        data.append('remove', true);

        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            jQuery(allFeedsElts).each(function() {
              var tag = jQuery(this).find('[data-chris-tag_id=' + tagID + ']');
              jQuery(tag).remove();
            });
          }
        };

        // GO!
        xhr.send(data);  
      });

}

_FEED_.slicedrop = function(el) {
    
    var _token = '';
  
    // grab a fresh token
    jQuery.ajax({
      type : "POST",
      url : "api.php?action=get&what=token",
      dataType : 'json',
      success : function(data) {
        
        _token = data['result'];

        // now we need the relative path to the data
        var _relativepath = $(el.target).siblings('.file').attr('rel');
        
        var _url = 'http://slicedrop.com/?'+window.location.protocol+"//"+window.location.host + window.location.pathname+'api.php?token='+_token+'&action=download&what=file&parameters='+_relativepath;
        
        window.open(_url);        
        
      }
    });

}
_FEED_.slicedrop_dicom = function(el) {
  
  var _token = '';

  // grab a fresh token
  jQuery.ajax({
    type : "POST",
    url : "api.php?action=get&what=token",
    dataType : 'json',
    success : function(data) {
      
      _token = data['result'];

      // now we need the relative path to the data
      var _relativepath = $(el.target).closest('.file').attr('rel');
      
      var _url = 'http://slicedrop.com/?scene='+window.location.protocol+"//"+window.location.host + window.location.pathname+'api.php?token='+_token+'&action=get&what=dicomscene&parameters='+_relativepath;
      //console.log(_url);
      window.open(_url);        
      
    }
  });

}
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  _FEED_.feed_view();
  _FEED_.feed_share();
  _FEED_.feed_tag();
  _FEED_.feed_favorite();
  _FEED_.feed_archive();
  _FEED_.feed_rename();
  _FEED_.feed_cancel();
  _FEED_.feed_check();
});
