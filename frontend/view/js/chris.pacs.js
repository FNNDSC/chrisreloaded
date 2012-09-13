/**
 * Define the PACS namespace
 */
var PACS = PACS || {};
/**
 * Bind the simple search input field to the simple search button
 */
jQuery('.ssearch').keypress(function(e) {
  if (e.which == 13) {
    jQuery('#S_SEARCH').click();
  }
});
/**
 * Bind the advanced search input field to the advanced search button
 */
jQuery('.asearch').keypress(function(e) {
  if (e.which == 13) {
    jQuery('#A_SEARCH').click();
  }
});
/**
 * Setup the download button to only download the series which are remaing after
 * filtering in the advanced mode
 */
PACS.setupDownloadSeriesFiltered = function() {
  jQuery(".d_filter").live('click', function() {
    // get filtered data
    var filter = PACS.aTable._('tr', {
      "filter" : "applied"
    });
    var nb_filter = filter.length;
    var i = 0;
    // get all download button ID and simulate click on it
    for (i = 0; i < nb_filter; i++) {
      var id = filter[i][9].split(' ')[1].split('"')[1];
      jQuery('#' + id).click();
    }
  });
}
/**
 * Setup the download button to download all series for a given study
 */
PACS.setupDownloadStudy = function() {
  jQuery(".d_study").live(
      'click',
      function() {
        // replace the '_'
        var stuid = jQuery(this).attr('id').replace(/\_/g, ".");
        // remove the '-std' tad at the end of the id
        stuid = stuid.substring(0, stuid.length - 4);
        // modify class
        jQuery(this).removeClass('btn-primary').removeClass('d_study')
            .addClass('btn-warning');
        // modify content
        jQuery(this).html('<i class="icon-refresh rotating_class">');
        // update study status
        PACS.cacheStatus[stuid] = 1;
        // download all related series
        PACS.ajaxSeries(stuid);
      });
}
/**
 * Setup the details button to show series within a study in simple query
 */
PACS.setupDetailStudy = function() {
  jQuery('#S-RESULTS td .control').live('click', function() {
    // get the row
    var nTr = jQuery(this).parents('tr')[0];
    // get the related study UID
    // replace back '_' by '.'
    var stuid = jQuery(this).attr('id').replace(/\_/g, ".");
    // if data has not been cached, perform ajax query, else show it without
    // ajax!
    var i = jQuery.inArray(nTr, PACS.openStudies);
    if (i == -1) {
      // get related series
      PACS.ajaxSeries(stuid, nTr);
    } else {
      jQuery('i', this).attr('class', 'icon-chevron-down');
      jQuery('div.innerDetails', jQuery(nTr).next()[0]).slideUp(function() {
        PACS.sTable.fnClose(nTr);
        PACS.openStudies.splice(i, 1);
      });
    }
  });
}
/**
 * Setup the download series button
 */
PACS.setupDownloadSeries = function() {
  jQuery(".d_series").live('click', function(event) {
    var id = jQuery(this).attr('id');
    var split_id = id.split('-');
    var stuid = split_id[0].replace(/\_/g, ".");
    var seuid = split_id[1].replace(/\_/g, ".");
    PACS.ajaxImage(stuid, seuid, '#' + id);
  });
}
/**
 * Setup the preview series behavior
 */
PACS.setupPreviewSeries = function() {
  // connect the preview button
  jQuery(".p_series")
      .live(
          'click',
          function(event) {
            var id = jQuery(this).attr('id');
            var split_id = id.split('-');
            var stuid = split_id[0].replace(/\_/g, ".");
            var seuid = split_id[1].replace(/\_/g, ".");
            // start pulling series and update id
            // conver id from *-sep to *-sed
            PACS.ajaxImage(stuid, seuid, '#' + id.substring(0, id.length - 1)
                + 'd');
            // Top Left overlay
            jQuery("#TL_OVER")
                .html(
                    'Retrieving data <i class="icon-refresh icon-white rotating_class">');
            jQuery("#TL_OVER").show();
            jQuery("#SLICE").html('00');
            jQuery("#SLICE_NB").html('00');
            // show modal
            jQuery('#PMODAL').modal();
            // start ajax preview
            PACS.PreviewStudy = stuid;
            PACS.PreviewSeries = seuid;
          });
  // connect the 'shown' event
  jQuery('#PMODAL').on('shown', function() {
    PACS.ajaxPreview(PACS.PreviewStudy, PACS.PreviewSeries);
  });
  // connect the 'hidden' event
  jQuery('#PMODAL').on('hidden', function() {
    // delete XTK stuff
    if (PACS.sliceX != null) {
      PACS.sliceX.destroy();
      delete PACS.sliceX;
      PACS.sliceX = null;
    }
    if (PACS.volume != null) {
      delete PACS.volume;
      PACS.volume = null;
    }
    // clean PACS namespace
    PACS.previewReceivedData['filename'] = [];
    PACS.previewReceivedData['data'] = [];
    // reset PACS.previewStudy and Series
    PACS.PreviewStudy = '0';
    PACS.PreviewSeries = '0';
    // destroy slider
    jQuery("#sliderZ").slider("destroy");
  });
}
/**
 * Setup the Advanced search button
 */
PACS.ajaxAdvanced = function() {
  jQuery("#A_SEARCH").live('click', function(event) {
    // keep reference to current object for the ajax response
    var me = jQuery(this);
    // modify class
    me.removeClass('btn-primary').addClass('btn-warning');
    // modify content
    me.html('<i class="icon-refresh rotating_class">');
    // destroy the results table if it exists
    if (jQuery('#A-RESULTS').length != 0) {
      PACS.aTable.dataTable().fnDestroy();
      PACS.aTable = null;
      jQuery('#A-RESULTS').remove();
    }
    var mrn_split = jQuery("#PACS_MRN_A").attr('value').split(' ');
    var mrn_nb = mrn_split.length;
    var mrn_received = 0;
    var i = 0;
    for (i = 0; i < mrn_nb; i++) {
      // query pacs on parameters, at STUDY LEVEL
      jQuery.ajax({
        type : "POST",
        url : "controller/pacs_query.php",
        dataType : "json",
        data : {
          USER_AET : jQuery("#USER_AET").attr('value'),
          SERVER_IP : jQuery("#SERVER_IP").attr('value'),
          SERVER_POR : jQuery("#SERVER_POR").attr('value'),
          PACS_LEV : 'ALL',
          PACS_MRN : mrn_split[i],
          PACS_NAM : jQuery("#PACS_NAM_A").attr('value'),
          PACS_MOD : jQuery("#PACS_MOD_A").attr('value'),
          PACS_DAT : jQuery("#PACS_DAT_A").attr('value'),
          PACS_ACC_NUM : '',
          PACS_STU_DES : '',
          PACS_STU_UID : ''
        },
        success : function(data) {
          mrn_received++;
          if (mrn_received == mrn_nb) {
            me.removeClass('btn-warning').addClass('btn-primary');
            me.html('Search');
          }
          PACS.ajaxAdvancedResults(data);
        }
      });
    }
  });
}
/**
 * 
 */
PACS.ajaxAdvancedResults = function(data) {
  if (data[0] != null) {
    // if no table, create it
    if (jQuery('#A-RESULTS').length == 0) {
      PACS.advancedTable();
    }
    // add data in the table!
    var append = Array();
    var series_nb = data[1].SeriesDescription.length;
    var i = 0;
    for (i = 0; i < series_nb; ++i) {
      // update loaded results
      PACS.advancedCaching(data, i);
      // fill html table
      append.push(PACS.advancedFormat(data, i));
    }
    // add table to current table
    jQuery('#A-RESULTS').dataTable().fnAddData(append);
  } else {
    // no studies found and not doing multiple mrn_split
    if (PACS.aTable == null) {
      jQuery('#AC-RESULTS').html("No studies found...");
    }
  }
}
/**
 * 
 */
PACS.advancedTable = function() {
  var content = '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="A-RESULTS">';
  var i = 0;
  content += '<thead><tr><th>Name</th><th>MRN</th><th>DOB</th><th>Study Date</th><th>Mod.</th><th>Study Desc.</th><th>Series Desc.</th><th>files</th><th></th><th></th></tr></thead><tbody>';
  content += '</tbody></table>';
  // update html with table
  jQuery('#AC-RESULTS').html(content);
  // make table sortable, filterable, ...
  PACS.aTable = jQuery('#A-RESULTS')
      .dataTable(
          {
            "sDom" : "<'row-fluid'<'span6'l><'span6' <'d_filter'> f>r>t<'row-fluid'<'span6'i><'span6'p>>",
            "sPaginationType" : "bootstrap",
            "oLanguage" : {
              "sLengthMenu" : "_MENU_ studies per page"
            },
            "aLengthMenu" : [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ],
            iDisplayStart : 0,
            iDisplayLength : 10,
            "aoColumnDefs" : [ {
              "bSortable" : false,
              "aTargets" : [ 8, 9 ]
            } ],
            "aaSorting" : [ [ 1, 'desc' ] ],
          });
  jQuery(".d_filter")
      .html(
          '<button class="btn btn-primary pull-right" type="button"><i class="icon-circle-arrow-down icon-white"></i></button>');
}
PACS.advancedCaching = function(data, i) {
  var stuid = data[1].StudyInstanceUID[i];
  var study = null;
  var cached = stuid in PACS.cache;
  // if study not loaded, create container for this study
  if (!cached) {
    PACS.cache[stuid] = Array();
    study = PACS.cache[stuid];
    study.StudyInstanceUID = Array();
    study.SeriesInstanceUID = Array();
    study.SeriesDescription = Array();
    study.NumberOfSeriesRelatedInstances = Array();
    study.QueryRetrieveLevel = Array();
    study.RetrieveAETitle = Array();
    study.Status = Array();
  } else {
    study = PACS.cache[stuid];
  }
  // fill study container
  var exists = jQuery.inArray(data[1].SeriesInstanceUID[i],
      study.SeriesInstanceUID);
  if (exists == -1) {
    study.StudyInstanceUID.push(data[1].StudyInstanceUID[i]);
    study.SeriesInstanceUID.push(data[1].SeriesInstanceUID[i]);
    study.SeriesDescription.push(data[1].SeriesDescription[i]);
    study.NumberOfSeriesRelatedInstances
        .push(data[1].NumberOfSeriesRelatedInstances[i]);
    study.QueryRetrieveLevel.push(data[1].QueryRetrieveLevel[i]);
    study.RetrieveAETitle.push(data[1].RetrieveAETitle[i]);
    study.Status.push(0);
  }
}
/**
 * 
 */
PACS.advancedFormat = function(data, i) {
  var index = data[0].StudyInstanceUID.indexOf(data[1].StudyInstanceUID[i]);
  var sub = Array();
  sub.push(data[0].PatientName[index].replace(/\^/g, " "));
  sub.push(data[0].PatientID[index]);
  sub.push(data[0].PatientBirthDate[index]);
  sub.push(data[0].StudyDate[index]);
  sub.push(data[0].ModalitiesInStudy[index]);
  sub.push(data[0].StudyDescription[index].replace(/\>/g, "&gt").replace(/\</g,
      "&lt"));
  sub.push(data[1].SeriesDescription[i].replace(/\>/g, "&gt").replace(/\</g,
      "&lt"));
  sub.push(data[1].NumberOfSeriesRelatedInstances[i]);
  sub
      .push('<button id="'
          + data[1].StudyInstanceUID[i].replace(/\./g, "_")
          + '-'
          + data[1].SeriesInstanceUID[i].replace(/\./g, "_")
          + '-sepa"  class="btn btn-info p_series " type="button"><i class="icon-eye-open icon-white"></i></button>');
  /**
   * @todo check in cached data to update button as requiered
   */
  sub
      .push('<button id="'
          + data[1].StudyInstanceUID[i].replace(/\./g, "_")
          + '-'
          + data[1].SeriesInstanceUID[i].replace(/\./g, "_")
          + '-series-ad" class="btn btn-primary d_series pull-right" type="button"><i class="icon-circle-arrow-down icon-white"></i></button>');
  return sub;
}
/**
 * 
 */
PACS.ajaxSimple = function() {
  jQuery("#S_SEARCH").live('click', function(event) {
    var me = jQuery(this);
    me.removeClass('btn-primary').addClass('btn-warning');
    // modify content
    me.html('<i class="icon-refresh rotating_class">');
    if (jQuery('#S-RESULTS').length != 0) {
      // destroy the table
      PACS.sTable.dataTable().fnDestroy();
      PACS.sTable = null;
      jQuery('#S-RESULTS').remove();
    }
    var mrn_split = jQuery("#PACS_MRN").attr('value').split(' ');
    var mrn_nb = mrn_split.length;
    var mrn_received = 0;
    var i = 0;
    for (i = 0; i < mrn_nb; i++) {
      // query pacs on parameters, at STUDY LEVEL
      jQuery.ajax({
        type : "POST",
        url : "controller/pacs_query.php",
        dataType : "json",
        data : {
          USER_AET : jQuery("#USER_AET").attr('value'),
          SERVER_IP : jQuery("#SERVER_IP").attr('value'),
          SERVER_POR : jQuery("#SERVER_POR").attr('value'),
          PACS_LEV : 'STUDY',
          PACS_MRN : mrn_split[i],
          PACS_NAM : jQuery("#PACS_NAM").attr('value'),
          PACS_MOD : jQuery("#PACS_MOD").attr('value'),
          PACS_DAT : jQuery("#PACS_DAT").attr('value'),
          PACS_ACC_NUM : '',
          PACS_STU_DES : '',
          PACS_STU_UID : ''
        },
        success : function(data) {
          mrn_received++;
          if (mrn_received == mrn_nb) {
            me.removeClass('btn-warning').addClass('btn-primary');
            me.html('Search');
          }
          PACS.ajaxSimpleResults(data);
        }
      });
    }
  });
}
/**
 * Handle ajax response after query pacs for studies, given mrn, name, date,
 * etc.
 */
PACS.ajaxSimpleResults = function(data) {
  // if ajax returns something, process it
  if (data != null) {
    // if no table, create it
    if (jQuery('#S-RESULTS').length == 0) {
      PACS.simpleTable();
    }
    // fill the table
    var append = Array();
    var numStudies = data.PatientID.length;
    var i = 0;
    for (i = 0; i < numStudies; ++i) {
      append.push(PACS.simpleFormat(data, i));
    }
    jQuery('#S-RESULTS').dataTable().fnAddData(append);
  } else {
    // no studies found and not doing multiple mrns
    if (PACS.sTable == null) {
      jQuery('#SC-RESULTS').html("No studies found...");
    }
  }
}
/**
 * 
 */
PACS.simpleTable = function() {
  var content = '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="S-RESULTS">';
  content += '<thead><tr><th></th><th>Name</th><th>MRN</th><th>DOB</th><th>Study Desc.</th><th>Study Date</th><th>Mod.</th><th></th></tr></thead><tbody>';
  content += '</tbody></table>';
  jQuery('#SC-RESULTS').html(content);
  // make table sortable, filterable, ...
  PACS.sTable = jQuery('#S-RESULTS')
      .dataTable(
          {
            "sDom" : "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
            "sPaginationType" : "bootstrap",
            "oLanguage" : {
              "sLengthMenu" : "_MENU_ studies per page"
            },
            "aoColumnDefs" : [ {
              "bSortable" : false,
              "aTargets" : [ 0, 7 ]
            } ],
            "aaSorting" : [ [ 1, 'desc' ] ]
          });
}
/**
 * 
 */
PACS.simpleFormat = function(data, i) {
  var stuid = data.StudyInstanceUID[i];
  var sub = Array();
  sub.push('<span  id="' + stuid.replace(/\./g, "_")
      + '"  class="control"><i class="icon-chevron-down"></i></span>');
  sub.push(data.PatientName[i].replace(/\^/g, " "));
  sub.push(data.PatientID[i]);
  sub.push(data.PatientBirthDate[i]);
  sub
      .push(data.StudyDescription[i].replace(/\>/g, "&gt")
          .replace(/\</g, "&lt"));
  sub.push(data.StudyDate[i]);
  sub.push(data.ModalitiesInStudy[i]);
  // if study cached, check status of series to update icon
  var cached = stuid in PACS.cacheStatus;
  var status = 0;
  if (cached) {
    status = PACS.cacheStatus[stuid];
  } else {
    PACS.cacheStatus[stuid] = 0;
    PACS.cacheCount[stuid] = 0;
  }
  if (status == 0) {
    sub
        .push('<button  id="'
            + data.StudyInstanceUID[i].replace(/\./g, "_")
            + '-std" class="btn btn-primary d_study pull-right" type="button"><i class="icon-circle-arrow-down icon-white"></i></button>');
  } else if (status == 1) {
    sub
        .push('<button  id="'
            + data.StudyInstanceUID[i].replace(/\./g, "_")
            + '-std" class="btn btn-warning pull-right" type="button"><i class="icon-refresh rotating_class"></button>');
  } else if (status == 2) {
    sub
        .push('<button  id="'
            + data.StudyInstanceUID[i].replace(/\./g, "_")
            + '-std" class="btn btn-success pull-right" type="button"><i class="icon-ok icon-white"></button>');
  }
  return sub;
}
/**
 * 
 */
PACS.ajaxSeries = function(studyUID, nTr) {
  var stuid = studyUID;
  var j = stuid in PACS.cache;
  // if not cached
  if (!j) {
    // set waiting icon
    if (nTr != null) {
      jQuery('.control', nTr).html('<i class="icon-refresh rotating_class">');
    }
    jQuery.ajax({
      type : "POST",
      url : "controller/pacs_query.php",
      dataType : "json",
      data : {
        USER_AET : jQuery("#USER_AET").attr('value'),
        SERVER_IP : jQuery("#SERVER_IP").attr('value'),
        SERVER_POR : jQuery("#SERVER_POR").attr('value'),
        PACS_LEV : 'SERIES',
        PACS_STU_UID : stuid,
        PACS_SER_DES : ''
      },
      success : function(data) {
        // change icon
        if (nTr != null) {
          jQuery('.control', nTr).html('<i class="icon-chevron-up">');
        }
        // should be inside the results
        // append a status field
        data.Status = Array();
        var series_nb = data.SeriesInstanceUID.length;
        var i = 0;
        for (i = 0; i < series_nb; ++i) {
          data.Status[i] = 0;
        }
        PACS.cache[stuid] = data;
        PACS.ajaxSeriesResults(data, nTr);
      }
    });
  }
  // if cached
  else {
    if (nTr != null) {
      jQuery('.control', nTr).html('<i class="icon-chevron-up">');
    }
    PACS.ajaxSeriesResults(PACS.cache[stuid], nTr);
  }
}
/**
 * 
 */
PACS.ajaxSeriesResults = function(data, nTr) {
  // format the details row table
  if (nTr != null) {
    var detailRown = PACS.sTable
        .fnOpen(nTr, PACS.seriesFormat(data), 'details');
    // create dataTable from html table
    jQuery('.table', detailRown).dataTable({
      "sDom" : "t",
      "aaSorting" : [ [ 1, 'desc' ] ],
      "bPaginate" : false,
      "aoColumnDefs" : [ {
        "bSortable" : false,
        "aTargets" : [ 2, 3 ]
      } ],
    });
    jQuery('div.innerDetails', detailRown).slideDown();
    PACS.openStudies.push(nTr);
  } else {
    // download images!
    // loop through all series and download the one which are not
    // downloaded
    // and not downloading
    var nb_results = data.StudyInstanceUID.length;
    var i = 0;
    for (i = 0; i < nb_results; ++i) {
      if (data.Status[i] == 0) {
        var bid = '#' + data.StudyInstanceUID[i].replace(/\./g, "_") + '-'
            + data.SeriesInstanceUID[i].replace(/\./g, "_") + '-sed';
        PACS
            .ajaxImage(data.StudyInstanceUID[i], data.SeriesInstanceUID[i], bid);
      }
    }
  }
}
/**
 * Format the details (series) HTML table for a study, given some data
 */
PACS.seriesFormat = function(data) {
  // number of rows to be created
  var nb_results = data.StudyInstanceUID.length;
  var i = 0;
  // Create the "details" (i.e. series) html content
  // innerDetails used for slide in/out
  var content = '<div class="innerDetails"><table class="table table-bordered" cellmarging="0" cellpadding="0" cellspacing="0" border="0"><thead><tr><th>Series Desc.</th><th class="span2"># files</th><th class="span1"></th><th class="span1"></th></tr></thead><tbody>';
  for (i = 0; i < nb_results; ++i) {
    // replace '.' by '_' (. is invalid for the id)
    var stuid = data.StudyInstanceUID[i].replace(/\./g, "_");
    var seriesUID = data.SeriesInstanceUID[i].replace(/\./g, "_");
    var id = stuid + '-' + seriesUID;
    content += '<tr class="parent " id="' + seriesUID + '">';
    // replace some illegal characters in the series description
    content += '<td>'
        + data.SeriesDescription[i].replace(/\>/g, "&gt").replace(/\</g, "&lt")
        + '</td>';
    content += '<td>' + data.NumberOfSeriesRelatedInstances[i] + '</td>';
    // sep: SEries Preview
    content += '<td class="center"><button id="'
        + id
        + '-sep" class="btn btn-info p_series " type="button"><i class="icon-eye-open icon-white"></i></button></td>';
    // sed: SEries Download
    // status == 0: data is available
    if (data.Status[i] == 0) {
      content += '<td class="center"><button id="'
          + id
          + '-sed" class="btn btn-primary d_series pull-right" type="button"><i class="icon-circle-arrow-down icon-white"></i></button></td>';
      // status == 1: data is downloading!
    } else if (data.Status[i] == 1) {
      content += '<td class="center"><button id="'
          + id
          + '-sed" class="btn btn-warning pull-right" type="button"><i class="icon-refresh rotating_class"></i></button></td>';
      // status == 1: data has been downloaded!
    } else {
      content += '<td class="center"><button id="'
          + id
          + '-sed" class="btn btn-success pull-right" type="button"><i class="icon-ok icon-white"></i></button></td>';
    }
    content += '</tr>';
  }
  content += '</body></table></div>';
  return content;
}
PACS.ajaxPreview = function(studyUID, seriesUID) {
  var stuid = studyUID;
  var serid = seriesUID;
  var seriesData = PACS.cache[studyUID];
  var index = seriesData.SeriesInstanceUID.indexOf(seriesUID);
  var files_nb = seriesData.NumberOfSeriesRelatedInstances[index];
  var desc = seriesData.SeriesDescription[index];
  jQuery.ajax({
    type : "POST",
    url : "controller/pacs_preview.php",
    dataType : "json",
    data : {
      PACS_SER_UID : seriesUID,
      PACS_SER_NOF : files_nb
    },
    success : function(data) {
      if (data && data.filename.length > 0) {
        // modal label
        jQuery('#myModalLabel').html(desc);
        jQuery("#TL_OVER").html('Creating XTK visualization...');
        // set XTK renderer
        PACS.volume = new X.volume();
        PACS.volume.file = 'http://chris/data/' + data.filename[0];
        PACS.sliceX = new X.renderer2D();
        PACS.sliceX.container = 'sliceZ';
        PACS.sliceX.orientation = 'Z';
        PACS.sliceX.init();
        PACS.sliceX.add(PACS.volume);
        PACS.sliceX.render();
        PACS.sliceX.onShowtime = function() {
          var dim = PACS.volume.dimensions;
          // hide overlay
          jQuery("#TL_OVER").hide();
          // init slider
          jQuery("#sliderZ").slider({
            min : 1,
            max : dim[2],
            value : Math.round(PACS.volume.indexZ + 1),
            slide : function(event, ui) {
              PACS.volume.indexZ = ui.value - 1;
              jQuery("#SLICE").html(ui.value);
            }
          });
          PACS.sliceX.onScroll = function() {
            jQuery('#sliderZ').slider("option", "value",
                Math.round(PACS.volume.indexZ + 1));
            jQuery("#SLICE").html(Math.round(PACS.volume.indexZ + 1));
          };
          jQuery("#SLICE").html(Math.round(PACS.volume.indexZ + 1));
          jQuery("#SLICE_NB").html(dim[2]);
        }
      } else {
        // if modal visible, callback
        if (PACS.PreviewStudy != '0' && PACS.PreviewSeries != '0') {
          setTimeout(function() {
            PACS.ajaxPreview(stuid, serid)
          }, 1000);
        }
      }
    }
  });
}
PACS.ajaxImage = function(studyUID, seriesUID, buttonID) {
  // if series already or is being downloaded (preview use case)
  if (jQuery(buttonID).length == 0 || jQuery(buttonID).hasClass('btn-primary')) {
    // wait button
    // modify class
    jQuery(buttonID).removeClass('btn-primary').removeClass('d_series')
        .addClass('btn-warning');
    // modify content
    jQuery(buttonID).html('<i class="icon-refresh rotating_class">');
    // modify status
    var seriesData = PACS.cache[studyUID];
    var index = seriesData.SeriesInstanceUID.indexOf(seriesUID);
    seriesData.Status[index] = 1;
    jQuery
        .ajax({
          type : "POST",
          url : "controller/pacs_move.php",
          dataType : "json",
          data : {
            USER_AET : jQuery('#USER_AET').attr('value'),
            SERVER_IP : '134.174.12.21',
            SERVER_POR : '104',
            PACS_LEV : 'SERIES',
            PACS_STU_UID : studyUID,
            PACS_SER_UID : seriesUID,
            PACS_MRN : '',
            PACS_NAM : '',
            PACS_MOD : '',
            PACS_DAT : '',
            PACS_STU_DES : '',
            PACS_ACC_NUM : ''
          },
          success : function(data) {
            var seriesData = PACS.cache[studyUID];
            var i = seriesData.SeriesInstanceUID.indexOf(seriesUID);
            seriesData.Status[i] = 2;
            // update visu if not closed!
            // use "this", modify style, refresh
            jQuery(buttonID).removeClass('btn-warning').addClass('btn-success');
            // modify content
            jQuery(buttonID).html('<i class="icon-ok icon-white">');
            var studyButtonID = '#' + studyUID.replace(/\./g, "_") + '-std';
            // update count
            PACS.cacheCount[studyUID]++;
            if (jQuery(studyButtonID).length != 0
                && PACS.cacheCount[studyUID] == seriesData.SeriesInstanceUID.length) {
              // all series downloaded, update button!
              PACS.cacheStatus[studyUID] = 2;
              jQuery(studyButtonID).removeClass('btn-warning').addClass(
                  'btn-success');
              // modify content
              jQuery(studyButtonID).html('<i class="icon-ok icon-white">');
            }
          }
        });
  }
}
/**
 * 
 */
PACS.ajaxPing = function() {
  jQuery.ajax({
    type : "POST",
    url : "controller/pacs_ping.php",
    dataType : "json",
    data : {
      USER_AET : jQuery("#USER_AET").attr('value'),
      SERVER_IP : jQuery("#SERVER_IP").attr('value'),
      SERVER_POR : jQuery("#SERVER_POR").attr('value')
    },
    success : function(data) {
      PACS.ajaxPingResults(data);
    }
  });
}
/**
 * 
 * @param data
 */
PACS.ajaxPingResults = function(data) {
  var pingResult = '';
  if (data == 1) {
    pingResult = ' <span class="alert alert-success fade in">Server accessible</span>';
  } else {
    pingResult = ' <span class="alert alert-error fade in">Server not accessible</span>';
  }
  jQuery('#pacsping').html(pingResult);
}
/**
 * 
 */
jQuery(document).ready(function() {
  // store "opened" studies
  PACS.openStudies = [];
  // store "loaded" studies
  PACS.cacheStatus = {};
  PACS.cacheCount = {};
  PACS.cache = {};
  // simple table
  PACS.sTable = null;
  PACS.previewReceivedData = [];
  PACS.previewReceivedData['filename'] = [];
  PACS.previewReceivedData['data'] = [];
  // search button pushed
  PACS.ajaxSimple();
  PACS.setupDetailStudy();
  PACS.setupDownloadStudy();
  PACS.setupDownloadSeries();
  PACS.sliceX = null;
  PACS.volume = null;
  PACS.setupPreviewSeries();
  // advanced mode
  PACS.ajaxAdvanced();
  PACS.setupDownloadSeriesFiltered();
  // advanced table
  PACS.aTable = null;
  PACS.PreviewStudy = '0';
  PACS.PreviewSeries = '0';
  // ping the server
  jQuery(".pacsPing").click(function(event) {
    PACS.ajaxPing();
  });
});