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
 * Format the details (series) HTML table for a study, given some data
 */
PACS.formatDetails = function(data) {
  // number of rows to be created
  var nb_results = data.StudyInstanceUID.length;
  var i = 0;
  // Create the "details" (i.e. series) html content
  // innerDetails used for slide in/out
  var content = '<div class="innerDetails"><table class="table table-bordered" cellmarging="0" cellpadding="0" cellspacing="0" border="0"><thead><tr><th>Series Desc.</th><th class="span2"># files</th><th class="span1"></th><th class="span1"></th></tr></thead><tbody>';
  for (i = 0; i < nb_results; ++i) {
    // replace '.' by '_' (. is invalid for the id)
    var studyUID = data.StudyInstanceUID[i].replace(/\./g, "_");
    var seriesUID = data.SeriesInstanceUID[i].replace(/\./g, "_");
    var id = studyUID + '-' + seriesUID;
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
/**
 * Setup the download button to only download the series which are remaing after
 * filtering in the advanced mode
 */
PACS.setupDownloadSeriesFiltered = function() {
  jQuery(".d_filter").live('click', function() {
    // get filtered data
    var filter = PACS.oTableA._('tr', {
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
        var studyUID = jQuery(this).attr('id').replace(/\_/g, ".");
        // remove the '-std' tad at the end of the id
        studyUID = studyUID.substring(0, studyUID.length - 4);
        // modify class
        jQuery(this).removeClass('btn-primary').removeClass('d_study')
            .addClass('btn-warning');
        // modify content
        jQuery(this).html('<i class="icon-refresh rotating_class">');
        // update study status
        PACS.loadedStudiesStatus[studyUID] = 1;
        // download all related series
        PACS.ajaxSeries(studyUID);
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
    var studyUID = jQuery(this).attr('id').replace(/\_/g, ".");
    // if data has not been cached, perform ajax query, else show it without
    // ajax!
    var i = jQuery.inArray(nTr, PACS.openStudies);
    if (i == -1) {
      // get related series
      PACS.ajaxSeries(studyUID, nTr);
    } else {
      jQuery('i', this).attr('class', 'icon-chevron-down');
      jQuery('div.innerDetails', jQuery(nTr).next()[0]).slideUp(function() {
        PACS.oTable.fnClose(nTr);
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
 * 
 */
PACS.ajaxAll = function() {
  jQuery("#A_SEARCH").live('click', function(event) {
    var currentButton = jQuery(this);
    currentButton.removeClass('btn-primary').addClass('btn-warning');
    // modify content
    currentButton.html('<i class="icon-refresh rotating_class">');
    if (jQuery('#A-RESULTS').length != 0) {
      // destroy the table
      PACS.oTableA.dataTable().fnDestroy();
      PACS.oTableA = null;
      jQuery('#A-RESULTS').remove();
    }
    var mrns = jQuery("#PACS_MRN_A").val().split(' ');
    var mrnscount = mrns.length;
    var received = 0;
    var i = 0;
    for (i = 0; i < mrnscount; i++) {
      // query pacs on parameters, at STUDY LEVEL
      jQuery.ajax({
        type : "POST",
        url : "controller/pacs_query.php",
        dataType : "json",
        data : {
          USER_AET : jQuery("#USER_AET").val(),
          SERVER_IP : jQuery("#SERVER_IP").val(),
          SERVER_POR : jQuery("#SERVER_POR").val(),
          PACS_LEV : 'ALL',
          PACS_MRN : mrns[i],
          PACS_NAM : jQuery("#PACS_NAM_A").val(),
          PACS_MOD : jQuery("#PACS_MOD_A").val(),
          PACS_DAT : jQuery("#PACS_DAT_A").val(),
          PACS_ACC_NUM : '',
          PACS_STU_DES : '',
          PACS_STU_UID : ''
        },
        success : function(data) {
          received++;
          if (received == mrnscount) {
            currentButton.removeClass('btn-warning').addClass('btn-primary');
            currentButton.html('Search');
          }
          PACS.ajaxAllResults(data);
        }
      });
    }
  });
}
/**
 * 
 */
PACS.ajaxAllResults = function(data) {
  if (data[0] != null) {
    // if no table, create it
    if (jQuery('#A-RESULTS').length == 0) {
      var content = '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="A-RESULTS">';
      var numSeries = data[1].SeriesDescription.length;
      var i = 0;
      content += '<thead><tr><th>Name</th><th>MRN</th><th>DOB</th><th>Study Date</th><th>Mod.</th><th>Study Desc.</th><th>Series Desc.</th><th>files</th><th></th><th></th></tr></thead><tbody>';
      content += '</tbody></table>';
      // update html with table
      jQuery('#results_container_a').html(content);
      // make table sortable, filterable, ...
      PACS.oTableA = jQuery('#A-RESULTS')
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
    // add data in the table!
    var dataToAppend = Array();
    var numSeries = data[1].SeriesDescription.length;
    var i = 0;
    for (i = 0; i < numSeries; ++i) {
      // update loaded results
      var studyUID = data[1].StudyInstanceUID[i];
      var currentStudy = null;
      var studyloaded = studyUID in PACS.loadedStudies;
      // if study not loaded, create container for this study
      if (!studyloaded) {
        PACS.loadedStudies[studyUID] = Array();
        currentStudy = PACS.loadedStudies[studyUID];
        currentStudy.StudyInstanceUID = Array();
        currentStudy.SeriesInstanceUID = Array();
        currentStudy.SeriesDescription = Array();
        currentStudy.NumberOfSeriesRelatedInstances = Array();
        currentStudy.QueryRetrieveLevel = Array();
        currentStudy.RetrieveAETitle = Array();
        currentStudy.Status = Array();
      } else {
        currentStudy = PACS.loadedStudies[studyUID];
      }
      // fill study container
      var seriesExist = jQuery.inArray(data[1].SeriesInstanceUID[i],
          currentStudy.SeriesInstanceUID);
      if (seriesExist == -1) {
        currentStudy.StudyInstanceUID.push(data[1].StudyInstanceUID[i]);
        currentStudy.SeriesInstanceUID.push(data[1].SeriesInstanceUID[i]);
        currentStudy.SeriesDescription.push(data[1].SeriesDescription[i]);
        currentStudy.NumberOfSeriesRelatedInstances
            .push(data[1].NumberOfSeriesRelatedInstances[i]);
        currentStudy.QueryRetrieveLevel.push(data[1].QueryRetrieveLevel[i]);
        currentStudy.RetrieveAETitle.push(data[1].RetrieveAETitle[i]);
        currentStudy.Status.push(0);
      }
      // fill html table
      // get study uid index
      var studyIndex = data[0].StudyInstanceUID
          .indexOf(data[1].StudyInstanceUID[i]);
      var innerArray = Array();
      innerArray.push(data[0].PatientName[studyIndex].replace(/\^/g, " "));
      innerArray.push(data[0].PatientID[studyIndex]);
      innerArray.push(data[0].PatientBirthDate[studyIndex]);
      innerArray.push(data[0].StudyDate[studyIndex]);
      innerArray.push(data[0].ModalitiesInStudy[studyIndex]);
      innerArray.push(data[0].StudyDescription[studyIndex]
          .replace(/\>/g, "&gt").replace(/\</g, "&lt"));
      innerArray.push(data[1].SeriesDescription[i].replace(/\>/g, "&gt")
          .replace(/\</g, "&lt"));
      innerArray.push(data[1].NumberOfSeriesRelatedInstances[i]);
      innerArray
          .push('<button id="'
              + data[1].StudyInstanceUID[i].replace(/\./g, "_")
              + '-'
              + data[1].SeriesInstanceUID[i].replace(/\./g, "_")
              + '-sepa"  class="btn btn-info p_series " type="button"><i class="icon-eye-open icon-white"></i></button>');
      /**
       * @todo check in cached data to update button as requiered
       */
      innerArray
          .push('<button id="'
              + data[1].StudyInstanceUID[i].replace(/\./g, "_")
              + '-'
              + data[1].SeriesInstanceUID[i].replace(/\./g, "_")
              + '-series-ad" class="btn btn-primary d_series pull-right" type="button"><i class="icon-circle-arrow-down icon-white"></i></button>');
      dataToAppend.push(innerArray);
    }
    // add table to current table
    jQuery('#A-RESULTS').dataTable().fnAddData(dataToAppend);
  } else {
    // no studies found and not doing multiple mrns
    if (PACS.oTableA == null) {
      jQuery('#results_container_a').html("No studies found...");
    }
  }
}
PACS.ajaxStudy = function() {
  jQuery("#S_SEARCH").live('click', function(event) {
    var currentButton = jQuery(this);
    currentButton.removeClass('btn-primary').addClass('btn-warning');
    // modify content
    currentButton.html('<i class="icon-refresh rotating_class">');
    if (jQuery('#S-RESULTS').length != 0) {
      // destroy the table
      PACS.oTable.dataTable().fnDestroy();
      PACS.oTable = null;
      jQuery('#S-RESULTS').remove();
    }
    var mrns = jQuery("#PACS_MRN").val().split(' ');
    var mrnscount = mrns.length;
    var received = 0;
    var i = 0;
    for (i = 0; i < mrnscount; i++) {
      // query pacs on parameters, at STUDY LEVEL
      jQuery.ajax({
        type : "POST",
        url : "controller/pacs_query.php",
        dataType : "json",
        data : {
          USER_AET : jQuery("#USER_AET").val(),
          SERVER_IP : jQuery("#SERVER_IP").val(),
          SERVER_POR : jQuery("#SERVER_POR").val(),
          PACS_LEV : 'STUDY',
          PACS_MRN : mrns[i],
          PACS_NAM : jQuery("#PACS_NAM").val(),
          PACS_MOD : jQuery("#PACS_MOD").val(),
          PACS_DAT : jQuery("#PACS_DAT").val(),
          PACS_ACC_NUM : '',
          PACS_STU_DES : '',
          PACS_STU_UID : ''
        },
        success : function(data) {
          received++;
          if (received == mrnscount) {
            currentButton.removeClass('btn-warning').addClass('btn-primary');
            currentButton.html('Search');
          }
          PACS.ajaxStudyResults(data);
        }
      });
    }
  });
}
/**
 * Handle ajax response after query pacs for studies, given mrn, name, date,
 * etc.
 */
PACS.ajaxStudyResults = function(data) {
  // if ajax returns something, process it
  if (data != null) {
    // if no table, create it
    if (jQuery('#S-RESULTS').length == 0) {
      var content = '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="S-RESULTS">';
      content += '<thead><tr><th></th><th>Name</th><th>MRN</th><th>DOB</th><th>Study Desc.</th><th>Study Date</th><th>Mod.</th><th></th></tr></thead><tbody>';
      content += '</tbody></table>';
      jQuery('#results_container').html(content);
      // make table sortable, filterable, ...
      PACS.oTable = jQuery('#S-RESULTS')
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
    // fill the table
    var dataToAppend = Array();
    var numStudies = data.PatientID.length;
    var i = 0;
    for (i = 0; i < numStudies; ++i) {
      var studyUID = data.StudyInstanceUID[i];
      var localDataToAppend = Array();
      localDataToAppend.push('<span  id="' + studyUID.replace(/\./g, "_")
          + '"  class="control"><i class="icon-chevron-down"></i></span>');
      localDataToAppend.push(data.PatientName[i].replace(/\^/g, " "));
      localDataToAppend.push(data.PatientID[i]);
      localDataToAppend.push(data.PatientBirthDate[i]);
      localDataToAppend.push(data.StudyDescription[i].replace(/\>/g, "&gt")
          .replace(/\</g, "&lt"));
      localDataToAppend.push(data.StudyDate[i]);
      localDataToAppend.push(data.ModalitiesInStudy[i]);
      // if study cached, check status of series to update icon
      var studyloaded = studyUID in PACS.loadedStudiesStatus;
      var status = 0;
      if (studyloaded) {
        status = PACS.loadedStudiesStatus[studyUID];
      } else {
        PACS.loadedStudiesStatus[studyUID] = 0;
        PACS.loadedStudiesCount[studyUID] = 0;
      }
      if (status == 0) {
        localDataToAppend
            .push('<button  id="'
                + data.StudyInstanceUID[i].replace(/\./g, "_")
                + '-std" class="btn btn-primary d_study pull-right" type="button"><i class="icon-circle-arrow-down icon-white"></i></button>');
      } else if (status == 1) {
        localDataToAppend
            .push('<button  id="'
                + data.StudyInstanceUID[i].replace(/\./g, "_")
                + '-std" class="btn btn-warning pull-right" type="button"><i class="icon-refresh rotating_class"></button>');
      } else if (status == 2) {
        localDataToAppend
            .push('<button  id="'
                + data.StudyInstanceUID[i].replace(/\./g, "_")
                + '-std" class="btn btn-success pull-right" type="button"><i class="icon-ok icon-white"></button>');
      }
      dataToAppend.push(localDataToAppend);
    }
    jQuery('#S-RESULTS').dataTable().fnAddData(dataToAppend);
  } else {
    // no studies found and not doing multiple mrns
    if (PACS.oTable == null) {
      jQuery('#results_container').html("No studies found...");
    }
  }
}
/**
 * 
 * @param studyUID
 * @param oTable
 */
PACS.ajaxSeries = function(studyUID, nTr) {
  // is it good practice
  var j = studyUID in PACS.loadedStudies;
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
        USER_AET : jQuery("#USER_AET").val(),
        SERVER_IP : jQuery("#SERVER_IP").val(),
        SERVER_POR : jQuery("#SERVER_POR").val(),
        PACS_LEV : 'SERIES',
        PACS_STU_UID : studyUID,
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
        var numSeries = data.SeriesInstanceUID.length;
        var i = 0;
        for (i = 0; i < numSeries; ++i) {
          data.Status[i] = 0;
        }
        PACS.loadedStudies[studyUID] = data;
        PACS.ajaxSeriesResults(data, nTr);
      }
    });
  }
  // if cached
  else {
    if (nTr != null) {
      jQuery('.control', nTr).html('<i class="icon-chevron-up">');
    }
    PACS.ajaxSeriesResults(PACS.loadedStudies[studyUID], nTr);
  }
}
/**
 * 
 * @param otable
 */
PACS.ajaxSeriesResults = function(data, nTr) {
  // format the details row table
  if (nTr != null) {
    var nDetailsRow = PACS.oTable.fnOpen(nTr, PACS.formatDetails(data),
        'details');
    // create dataTable from html table
    jQuery('.table', nDetailsRow).dataTable({
      "sDom" : "t",
      "aaSorting" : [ [ 1, 'desc' ] ],
      "bPaginate" : false,
      "aoColumnDefs" : [ {
        "bSortable" : false,
        "aTargets" : [ 2, 3 ]
      } ],
    });
    jQuery('div.innerDetails', nDetailsRow).slideDown();
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
        var buttonID = '#' + data.StudyInstanceUID[i].replace(/\./g, "_") + '-'
            + data.SeriesInstanceUID[i].replace(/\./g, "_") + '-sed';
        PACS.ajaxImage(data.StudyInstanceUID[i], data.SeriesInstanceUID[i],
            buttonID);
      }
    }
  }
  // query server for protocol name
  // not working
  /*
   * var nb_results = data2.StudyInstanceUID.length; var j = 0; for (j = 0; j <
   * nb_results; ++j) { jQuery .ajax({ type : "POST", async : false, url :
   * "controller/S_SEARCH.php", dataType : "json", data : { USER_AET : jQuery(
   * "#USER_AET") .val(), SERVER_IP : jQuery( "#SERVER_IP") .val(), SERVER_POR :
   * jQuery( "#SERVER_POR") .val(), PACS_LEV : 'IMAGE', PACS_STU_UID :
   * data2.StudyInstanceUID[j], PACS_SER_UID : data2.SeriesInstanceUID[j] },
   * success : function( data3) { var idseries = '#series-' +
   * data3.SeriesInstanceUID[0] .replace( /\./g, "_"); jQuery(idseries) .text(
   * data3.ProtocolName[0]); } }); }
   */
}
PACS.ajaxPreview = function(studyUID, seriesUID) {
  var localStudy = studyUID;
  var localSeries = seriesUID;
  var seriesData = PACS.loadedStudies[studyUID];
  var nbFilesInSeries = seriesData.NumberOfSeriesRelatedInstances[seriesData.SeriesInstanceUID
      .indexOf(seriesUID)];
  var description = seriesData.SeriesDescription[seriesData.SeriesInstanceUID
      .indexOf(seriesUID)];
  jQuery.ajax({
    type : "POST",
    url : "controller/pacs_preview.php",
    dataType : "json",
    data : {
      PACS_SER_UID : seriesUID,
      PACS_SER_NOF : nbFilesInSeries
    },
    success : function(data) {
      if (data && data.filename.length > 0) {
        // modal label
        jQuery('#myModalLabel').html(description);
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
            PACS.ajaxPreview(localStudy, localSeries)
          }, 1000);
        }
      }
    }
  });
}
PACS.ajaxImage = function(studyUID, seriesUID, currentButtonID) {
  // should it be there...(or inside ajax result)?
  var seriesData = PACS.loadedStudies[studyUID];
  var i = seriesData.SeriesInstanceUID.indexOf(seriesUID);
  seriesData.Status[i] = 1;
  if (jQuery(currentButtonID).length == 0
      || jQuery(currentButtonID).hasClass('btn-primary')) {
    // wait button
    // if series already or is being downloaded (preview use case)
    // modify class
    jQuery(currentButtonID).removeClass('btn-primary').removeClass('d_series')
        .addClass('btn-warning');
    // modify content
    jQuery(currentButtonID).html('<i class="icon-refresh rotating_class">');
    var userAET = jQuery('#USER_AET').attr('value');
    jQuery
        .ajax({
          type : "POST",
          url : "controller/pacs_move.php",
          dataType : "json",
          data : {
            USER_AET : userAET,
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
            var seriesData = PACS.loadedStudies[studyUID];
            var i = seriesData.SeriesInstanceUID.indexOf(seriesUID);
            seriesData.Status[i] = 2;
            // update visu if not closed!
            // use "this", modify style, refresh
            jQuery(currentButtonID).removeClass('btn-warning').addClass(
                'btn-success');
            // modify content
            jQuery(currentButtonID).html('<i class="icon-ok icon-white">');
            var studyButtonID = '#' + studyUID.replace(/\./g, "_") + '-std';
            // update count
            PACS.loadedStudiesCount[studyUID]++;
            if (jQuery(studyButtonID).length != 0
                && PACS.loadedStudiesCount[studyUID] == seriesData.SeriesInstanceUID.length) {
              // all series downloaded, update button!
              PACS.loadedStudiesStatus[studyUID] = 2;
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
      USER_AET : jQuery("#USER_AET").val(),
      SERVER_IP : jQuery("#SERVER_IP").val(),
      SERVER_POR : jQuery("#SERVER_POR").val()
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
  PACS.loadedStudiesStatus = {};
  PACS.loadedStudiesCount = {};
  PACS.loadedStudies = {};
  PACS.oTable = null;
  PACS.previewReceivedData = [];
  PACS.previewReceivedData['filename'] = [];
  PACS.previewReceivedData['data'] = [];
  // search button pushed
  PACS.ajaxStudy();
  PACS.setupDetailStudy();
  PACS.setupDownloadStudy();
  PACS.setupDownloadSeries();
  PACS.sliceX = null;
  PACS.volume = null;
  PACS.setupPreviewSeries();
  // advanced mode
  PACS.ajaxAll();
  PACS.setupDownloadSeriesFiltered();
  PACS.oTableA = null;
  PACS.PreviewStudy = '0';
  PACS.PreviewSeries = '0';
  // ping the server
  jQuery(".pacsPing").click(function(event) {
    PACS.ajaxPing();
  });
});