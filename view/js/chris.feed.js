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
    case 'INFO':
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
    //details.show('blind','slow');
    details.slideDown('fast');
  } else {
    if (more) {
      more.html('<a>Show details</a>');
      more.closest('.feed').css('margin-top', '-1px');
      more.closest('.feed').css('margin-bottom', '0px');
    }
    //details.hide('blind', 'slow');
    details.slideUp('fast');

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
_FEED_.feed_sea_onclick = function() {
  jQuery(document).on('click', '.feed_sea_check', function() {
    var advanced = jQuery(this).parents().eq(5).find('.feed_sea');
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
          if (element.length) {
            jQuery(element).each(
                function() {
                  var elt = jQuery(this);
                  if (elt.find('i').hasClass('icon-star')
                      || elt.parent().hasClass('feed_sea_content')) {
                    // update its status to 100%
                    jQuery(this).attr('data-chris-feed_status', '100');
                    jQuery(this).find('.feed_status').html(
                        'Status: <font color=green>Done</font>');
                    jQuery(this).find('.feed_share').html(
                        '<i class="icon-share"></i>');
                  } else {
                    elt.hide('blind', 'slow').remove();
                    if (data['new']['status'][i] == '100') {
                      _FEED_.finFeeds[0].unshift(data['new']['id'][i]);
                      _FEED_.finFeeds[1].unshift(data['new']['content'][i]);
                    } else {
                      _FEED_.runFeeds[0].unshift(data['new']['id'][i]);
                      _FEED_.runFeeds[1].unshift(data['new']['content'][i]);
                    }
                  }
                });
          } else {
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
            jQuery(element).each(
                function() {
                  jQuery(this).find('.feed_status').html(
                      'Status: <font color=red>Running <i class="icon-refresh rotating_class"></i></font>');
                  //  ('+ data['running']['content'][i] + '%)
                });
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
_FEED_.notes_tab_onclick = function() {
  jQuery(document).on(
    'click',
    '.notes_tab',
    function(e) {
      
      var _editor_div = jQuery(this).next();

      if (_editor_div.find('.wysihtml5-toolbar').length == 0) {
        
        var _notes_editor = _editor_div.find('.notes_editor');
        _notes_editor.wysihtml5({
          "save": true,
          "events": {
            "load": _FEED_.editor_loaded
          }
        });

// wysihtml5Editor = _notes_editor.data("wysihtml5").editor;
// wysihtml5Editor.composer.commands.exec("bold");        

      }// else {

        // destroy the text editor
        // jQuery(this).next().find('.wysihtml5-sandbox').first().remove();
        // jQuery(this).next().find("iframe.wysihtml5-sandbox, input[name='_wysihtml5_mode']").first().remove();
        // jQuery(this).next().find('.wysihtml5-toolbar').first().remove();
        // jQuery(this).next().find(".notes_editor").first().css("display", "block");

      //}
    });
}
_FEED_.editor_loaded = function() {

  var _wysihtml5 = $(this)[0];
  var _editor = _wysihtml5.composer.element;

  var filename = $(_wysihtml5.textareaElement).parent().attr('data-path');
  var save_button = $(_wysihtml5.toolbar.container.children[0]).find('a');

  // callback for the save button
  save_button.on('click', function() {

    var data = _editor.innerHTML;

    jQuery.ajax({
      type: 'POST',
      url: 'api.php',
      data: {
        action: 'set',
        what: 'file',
        parameters: [filename, data]
      },
      success: function(data) {

        // reset the button
        save_button.removeClass('btn-danger');

        // notify the user
        jQuery().toastmessage(
            'showSuccessToast',
            '<h5>Note saved.</h5>');

      }
    })

  });

  // grab possible existing content and display it
  jQuery.ajax({
    type: 'GET',
    url: 'api.php?action=get&what=file&parameters='+filename,
    dataType : "text",
    success : function(data) {

      // display the content
      _editor.innerHTML = data;

      // register the callbacks for content change
      _editor.addEventListener("keyup", function() { save_button.addClass('btn-danger'); });
      _wysihtml5.on("aftercommand:composer", function() { save_button.addClass('btn-danger'); });

    }
  });

}
_FEED_.feed_favorite_onclick = function() {
  jQuery(document).on(
      'click',
      '.feed_favorite',
      function(e) {
        // modify
        e.stopPropagation();
        // get feed id
        var feedElt = jQuery(this).parents().eq(2);
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
                            jQuery(elt).find('.feed_favorite').html(
                                '<i class="icon-star">');
                            jQuery(elt).prependTo('.feed_fav_content')
                                .slideDown('slow');
                          });
                    } else {
                      if (elt.attr('data-chris-feed_status') != 100) {
                        jQuery(elt).hide(
                            'blind',
                            'slow',
                            function() {
                              jQuery(elt).find('.feed_favorite').html(
                                  '<i class="icon-star-empty">');
                              jQuery(elt).prependTo('.feed_run_content').slideDown(
                                  'slow');
                            });
                      } else {
                        jQuery(elt).hide(
                            'blind',
                            'slow',
                            function() {
                              jQuery(elt).find('.feed_favorite').html(
                                  '<i class="icon-star-empty">');
                              jQuery(elt).prependTo('.feed_fin_content').slideDown(
                                  'slow');
                            });
                      }
                    }
                  } else {
                    if (data['result'] == "1") {
                      jQuery(elt).find('.feed_favorite').html(
                          '<i class="icon-star">');
                    } else {
                      jQuery(elt).find('.feed_favorite').html(
                          '<i class="icon-star-empty">');
                    }
                  }
                });
          }
        });
      });
}
_FEED_.feed_archive_onclick = function() {
  jQuery(document).on(
      'click',
      '.feed_archive',
      function(e) {
        // modify
        e.stopPropagation();
        // get feed id
        var feedElt = jQuery(this).parents().eq(2);
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
                          jQuery(elt).find('.feed_archive').html(
                              '<i class="icon-plus">');
                        } else {
                          jQuery(elt).find('.feed_archive').html(
                              '<i class="icon-remove">');
                          // clone and put at good location!
                          clone = elt.clone().hide();
                          // if favorite, push it in the favorites
                          if (elt.find('.feed_favorite > .i').hasClass(
                              'icon-star')) {
                            jQuery(clone).prependTo('.feed_fav_content').slideDown(
                                'slow');
                          } else {
                            if (elt.attr('data-chris-feed_status') != 100) {
                              jQuery(clone).prependTo('.feed_run_content').slideDown(
                                  'slow');
                            } else {
                              jQuery(clone).prependTo('.feed_fin_content').slideDown(
                                  'slow');
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
_FEED_.feed_share_onclick = function() {
  jQuery(document).on(
      'click',
      '.feed_share',
      function(e) {
        // get feed id
        var feedElt = jQuery(this).parents().eq(2);
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
          type: 'GET',
          url: 'api.php?action=get&what=users',
          dataType: "json",
          success: function(data) {
            
            if (data['result'] != '') {
             
              $('.aTextbox').typeahead({source: data['result']});
              
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
        jQuery(_FEED_.finFeeds[1].join("")).hide().prependTo('.feed_fin_content')
            .slideDown("slow", function() { // Animation complete.
              _FEED_.finFeeds[0] = [];
              _FEED_.finFeeds[1] = [];
            });
        // update RUNNING feeds
        jQuery(_FEED_.runFeeds[1].join("")).hide().prependTo('.feed_run_content')
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
              jQuery('.feed_fin_content').append(old_Feeds);
              _FEED_.updateTime();
              jQuery('.feed_content').bind('scroll');
              _FEED_.activateDraggableIcons();
            }
          });
        }
      });
}
_FEED_.search = function() {
  jQuery('.feed_search_input').keyup(
      function(event) {
        if (event.which == 13) {
          event.preventDefault();
        }
        // if value not empty, ajax call
        if (jQuery(this).val() != '') {
          // check checkbox
          if (!jQuery('.feed_sea_check').attr('checked')) {
            jQuery('.feed_sea_check').click();
            window.console.log('checked');
          }
          else{
            window.console.log('already checked');
          }
          // uncheck checkbox
          if (jQuery('.feed_fav_check').attr('checked')) {
            jQuery('.feed_fav_check').click();
          }
          // uncheck checkbox
          if (jQuery('.feed_run_check').attr('checked')) {
            jQuery('.feed_run_check').click();
          }
          // uncheck checkbox
          if (jQuery('.feed_fin_check').attr('checked')) {
            jQuery('.feed_fin_check').click();
          }
          // ajax call
          jQuery.ajax({
            type : "POST",
            url : "api.php?action=get&what=feed_search&parameters[]="
                + jQuery(this).val(),
            dataType : "json",
            success : function(data) {
              data = data['result'];
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
              jQuery('.feed_sea_content').html(old_Feeds);
              // jQuery('.feed_sea').find('.feed').addClass('feed_search');
              _FEED_.updateTime();
              _FEED_.activateDraggableIcons();
            }
          });
        } else {
          // check checkbox
          if (jQuery('.feed_sea_check').attr('checked')) {
            jQuery('.feed_sea_check').click();
          }
          if (!jQuery('.feed_fav_check').attr('checked')) {
            jQuery('.feed_fav_check').click();
          }
          if (!jQuery('.feed_run_check').attr('checked')) {
            jQuery('.feed_run_check').click();
          }
          if (!jQuery('.feed_fin_check').attr('checked')) {
            jQuery('.feed_fin_check').click();
          }
        }
      });
}
_FEED_.activateDraggable = function() {
  // setup draggable items for all file browser elements
  jQuery(".jqueryFileTree li a").draggable({
    cursor : "move",
    handle : ".feed_move",
    helper : "clone",
    appendTo : "body",
    zIndex : 2500
  });
}
_FEED_.activateDraggableIcons = function() {
  jQuery('.feed_icon').draggable({
    cursor : "move",
    handle : ".feed_move",
    opacity : 0.5,
    helper : "clone",
    appendTo : "body",
    zIndex : 2500,
    start: function(event, ui) {

      // disable all feed dropzones
      $(".feed").droppable('option','disabled', true)

      // activate dropzones for feeds of the same type
      // but only if we have a different id so we can't drop on the same feed
      var _feed_type = $(this).attr('data-type');
      var _feed_id = $(this).attr('data-chris-feed_id');
      $(".feed").filter("[data-type='"+_feed_type+"']").filter("[data-chris-feed_id!='"+_feed_id+"']").droppable(
        'option','disabled', false
      )

    },
    stop: function(event, ui) {

      // re-enable all feeds
      $(".feed").droppable('option','disabled', false);

    }
  });
}
_FEED_.activateDroppableIcons = function() {
  
  $(".feed").droppable({
    activeClass: "feed_dropzone_active",
    hoverClass: "feed_dropzone_hover",          
    tolerance: "pointer",
    accept: ":not(.ui-sortable-helper)",
    activate: function(event, ui) {

    },
    deactivate: function(event, ui) {
      
    },
    drop: function(event, ui) {
      
      var _master_feed_id = $(this).attr('data-chris-feed_id');
      var _slave_feed_id = $(ui.draggable[0]).attr('data-chris-feed_id');

      // trigger merge request
      jQuery.ajax({
        type : "POST",
        url : "api.php?action=set&what=feed_merge&id=" + _master_feed_id + '&parameters=' + _slave_feed_id,
        dataType : "json",
        success : function(data) {
          if (data['result'] == 'done') {
            jQuery()
                .toastmessage(
                    'showSuccessToast',
                    '<h5>Feeds merged.</h5>');

            // archive the old feed
            var _old_feed = jQuery('.feed[data-chris-feed_id='+_slave_feed_id+']');
            _old_feed.find('.feed_archive').html(
                              '<i class="icon-plus">');
            _old_feed.hide('blind', 'slow', function() {
              _old_feed.remove();
            });

          } else {
            jQuery()
                .toastmessage(
                    'showErrorToast',
                    '<h5>Could not merge feeds.</h5>');
          }
        }
      });      

    },
    over: function(event, ui) {

    }
  });
  
}
_FEED_.createFeedDetails = function() {
}
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document)
    .ready(
        function() {
          // get oldest and newest feed value
          _FEED_.oldest = '9007199254740992';
          _FEED_.newest = '0';
          // look into favorites
          var elt = jQuery(".feed_fav_content > .feed");
          if (elt.length) {
            if (jQuery(elt[0]).attr('data-chris-feed_time') > _FEED_.newest) {
              _FEED_.newest = jQuery(elt[0]).attr('data-chris-feed_time');
            }
          }
          // look into running
          elt = jQuery(".feed_run_content > .feed");
          if (elt.length) {
            if (jQuery(elt[0]).attr('data-chris-feed_time') > _FEED_.newest) {
              _FEED_.newest = jQuery(elt[0]).attr('data-chris-feed_time');
            }
          }
          // look into finished
          elt = jQuery(".feed_fin_content > .feed");
          if (elt.length) {
            if (jQuery(elt[0]).attr('data-chris-feed_time') > _FEED_.newest) {
              _FEED_.newest = jQuery(elt[0]).attr('data-chris-feed_time');
            }
            if (jQuery(elt[elt.length - 1]).attr('data-chris-feed_time') < _FEED_.oldest) {
              _FEED_.oldest = jQuery(elt[elt.length - 1]).attr(
                  'data-chris-feed_time');
            }
          }
          // feed functions
          // finished feeds
          _FEED_.finFeeds = [ [], [] ];
          // running feeds
          _FEED_.runFeeds = [ [], [] ];
          // on click callbacks
          _FEED_.feed_onclick();
          _FEED_.feed_favorite_onclick();
          _FEED_.feed_share_onclick();
          _FEED_.feed_archive_onclick();
          // _FEED_.feed_title_onclick();
          _FEED_.feed_fav_onclick();
          _FEED_.feed_run_onclick();
          _FEED_.feed_fin_onclick();
          _FEED_.feed_sea_onclick();
          _FEED_.feed_more_onclick();
          _FEED_.update_onclick();
          _FEED_.updateFeedTimeout();
          _FEED_.updateTime();
          _FEED_.activateDraggableIcons();
          _FEED_.activateDroppableIcons();
          _FEED_.notes_tab_onclick();
          // show placeholder when there are no feeds
          if (jQuery('#feed_count').html() == "0") {
            jQuery('.feed_empty').show();
          }
          _FEED_.scrollBottom();
          _FEED_.search();

          // also register the check for unsaved notes
          window.onbeforeunload = function (e) {

              var _unsaved_notes = false;

              // check if notes were not saved yet
              jQuery('.editor_save_button').each(function(i,v) {
                if($(v).hasClass('btn-danger')) {
                  _unsaved_notes = true;
                } 
              });

              if (_unsaved_notes) {

                // show a warning

                e = e || window.event;

                // For IE and Firefox prior to version 4
                if (e) {
                    e.returnValue = 'Warning: Some notes were not saved yet.';
                }

                // For Safari
                return 'Warning: Some notes were not saved yet.';              
              }

          };          


        });
