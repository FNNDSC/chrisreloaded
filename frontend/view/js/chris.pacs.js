// create the Pacs namespace
var PACS = PACS || {};
/**
 * 
 * @param oTable
 * @param data
 * @returns {String}
 */
PACS.fnFormatDetails = function(data) {
  var numberOfResults = data.StudyInstanceUID.length;
  var i = 0;
  // set table id
  var content = '<div class="innerDetails"><table id="'
      + data.StudyInstanceUID[0].replace(/\./g, "_")
      + '-details" class="table table-bordered" cellmarging="0" cellpadding="0" cellspacing="0" border="0"><thead><tr><th>Series Description</th><th class="span2"># files</th><th class="span1"></th><th class="span1"></th></tr></thead><tbody>';
  for (i = 0; i < numberOfResults; ++i) {
    content += '<tr class="parent pacsStudyRows" id="'
        + data.SeriesInstanceUID[i].replace(/\./g, "_") + '">';
    content += '<td>' + data.SeriesDescription[i] + '</td>';
    content += '<td>' + data.NumberOfSeriesRelatedInstances[i] + '</td>';
    content += '<td class="center"><button class="btn btn-info preview_series " type="button"><i class="icon-eye-open icon-white"></i></button></td>';
    // need 3 cases
    // on server!
    if (data.Status[i] == 0) {
      content += '<td class="center"><button id="'
          + data.SeriesInstanceUID[i].replace(/\./g, "_")
          + '-series" class="btn btn-primary download_series pull-right" type="button"><i class="icon-circle-arrow-down icon-white"></i></button></td>';
      // downloading!
    } else if (data.Status[i] == 1) {
      content += '<td class="center"><button id="'
          + data.SeriesInstanceUID[i].replace(/\./g, "_")
          + '-series" class="btn btn-warning pull-right" type="button"><i class="icon-refresh rotating_class"></i></button></td>';
      // donwloaded!
    } else {
      content += '<td class="center"><button id="'
          + data.SeriesInstanceUID[i].replace(/\./g, "_")
          + '-series" class="btn btn-success pull-right" type="button"><i class="icon-ok icon-white"></i></button></td>';
    }
    content += '</tr>';
  }
  content += '</body></table></div>';
  return content;
}
/**
 * @param tableName
 * @param nbColumn
 * @param icon
 * @returns
 */
PACS.fnInitTable = function(tableName, nbColumn, icon) {
  /*
   * Insert a 'details' column to the table
   */
  var nCloneTh = document.createElement('th');
  var nCloneTd = document.createElement('td');
  nCloneTd.innerHTML = '<span class="control"><i class="' + icon
      + '"></i></span>';
  nCloneTd.className = "center";
  jQuery('#' + tableName + '-results thead tr').each(function() {
    this.insertBefore(nCloneTh, this.childNodes[0]);
  });
  jQuery('#' + tableName + '-results tbody tr').each(function() {
    this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
  });
  /*
   * Insert a 'download' column to the table
   */
  var nCloneTh = document.createElement('th');
  var nCloneTd = document.createElement('td');
  nCloneTd.innerHTML = '<button class="btn btn-primary download_study pull-right" type="button" value="0"><i class="icon-circle-arrow-down icon-white download'
      + tableName + '"></i></button>';
  nCloneTd.className = "center";
  jQuery('#' + tableName + '-results thead tr').each(function() {
    this.insertBefore(nCloneTh, this.childNodes[nbColumn]);
  });
  jQuery('#' + tableName + '-results tbody tr').each(function() {
    this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[nbColumn]);
  });
  /*
   * Initialse DataTables, with no sorting on the 'details' column
   */
  var oTable = jQuery('#' + tableName + '-results')
      .dataTable(
          {
            "sDom" : "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
            "sPaginationType" : "bootstrap",
            "oLanguage" : {
              "sLengthMenu" : "_MENU_ records per page"
            },
            "aoColumnDefs" : [ {
              "bSortable" : false,
              "aTargets" : [ 0, nbColumn ]
            } ],
            "aaSorting" : [ [ 1, 'desc' ] ]
          });
  return oTable;
}
/**
 * 
 */
PACS.setupDownloadStudy = function() {
  jQuery(".download_study").live(
      'click',
      function(event) {
        var nTr = jQuery(this).parents('tr')[0];
        var studyUID = nTr.getAttribute('id').replace(/\_/g, ".");
        // modify class
        var currentButton = jQuery(this);
        currentButton.removeClass('btn-primary').removeClass('download_study')
            .addClass('btn-warning').addClass('downloading_study');
        // modify content
        currentButton.html('<i class="icon-refresh rotating_class">');
        // cache data
        PACS.ajaxSeries(studyUID);
      });
}
/**
 * 
 */
PACS.setupDetailStudy = function() {
  jQuery('#quick-results td .control').live('click', function() {
    var nTr = jQuery(this).parents('tr')[0];
    var studyUID = nTr.getAttribute('id').replace(/\_/g, ".");
    var i = jQuery.inArray(nTr, PACS.openStudies);
    if (i === -1) {
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
 * 
 * @param data
 */
PACS.ajaxStudyResults = function(data) {
  if (data != null) {
    // fill table with results
    // table id is important:
    // must follow the syntax: name-results
    // name is used later to make the table sortable,
    // searchable, etc.
    var content = '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="quick-results">';
    var numStudies = data.PatientID.length;
    var i = 0;
    content += '<thead><tr><th>PatientName</th><th>DateOfBirth</th><th>StudyDescription</th><th>StudyDate</th><th>Modality</th></tr></thead><tbody>';
    for (i = 0; i < numStudies; ++i) {
      content += '<tr class="parent pacsStudyRows" id="'
          + data.StudyInstanceUID[i].replace(/\./g, "_") + '">';
      content += '<td>' + data.PatientName[i] + '</td>';
      content += '<td>' + data.PatientBirthDate[i] + '</td>';
      content += '<td>' + data.StudyDescription[i] + '</td>';
      content += '<td>' + data.StudyDate[i] + '</td>';
      content += '<td>' + data.ModalitiesInStudy[i] + '</td>';
      content += '</tr>';
    }
    content += '</tbody></table>';
    // update html with table
    jQuery('#results_container').html(content);
    // make table sortable, filterable, ...
    // make the table cooler!
    PACS.oTable = PACS.fnInitTable('quick', 6, 'icon-chevron-down');
  } else {
    // no studies found
    jQuery('#results_container').html("No studies found...");
  }
}
/**
 * 
 */
PACS.ajaxStudy = function() {
  jQuery("#PACS_QUERY").live('click', function(event) {
    var currentButton = jQuery(this);
    currentButton.removeClass('btn-primary').addClass('btn-warning');
    // modify content
    currentButton.html('<i class="icon-refresh rotating_class">');
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
        PACS_MRN : jQuery("#PACS_MRN").val(),
        PACS_NAM : jQuery("#PACS_NAM").val(),
        PACS_MOD : jQuery("#PACS_MOD").val(),
        PACS_DAT : jQuery("#PACS_DAT").val(),
        PACS_ACC_NUM : '',
        PACS_STU_DES : '',
        PACS_STU_UID : ''
      },
      success : function(data) {
        currentButton.removeClass('btn-warning').addClass('btn-primary');
        currentButton.html('Search');
        PACS.ajaxStudyResults(data);
      }
    });
  });
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
  if (j == 0) {
    // set waiting icon
    jQuery('.control', nTr).html('<i class="icon-refresh rotating_class">');
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
        jQuery('.control', nTr).html('<i class="icon-chevron-up">');
        // hshould be inside the results
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
    jQuery('.control', nTr).html('<i class="icon-chevron-up">');
    PACS.ajaxSeriesResults(PACS.loadedStudies[studyUID], nTr);
  }
}
/**
 * 
 * @param otable
 */
PACS.ajaxSeriesResults = function(data, nTr) {
  // format the details row table
  if (nTr) {
    var nDetailsRow = PACS.oTable.fnOpen(nTr, PACS.fnFormatDetails(data),
        'details');
    // make the details table sortable
    var detailstableid = "#" + data.StudyInstanceUID[0].replace(/\./g, "_")
        + "-details";
    jQuery(detailstableid).dataTable({
      "sDom" : "t",
      "aaSorting" : [ [ 1, 'desc' ] ],
      "bPaginate" : false,
      "aoColumnDefs" : [ {
        "bSortable" : false,
        "aTargets" : [ 2, 3 ]
      } ],
    /*
     * "sScrollY" : "200px", "bScrollCollapse" : true
     */
    });
    jQuery('div.innerDetails', nDetailsRow).slideDown();
    PACS.openStudies.push(nTr);
    // download images!
  } else {
    // loop through all series and download the one which are not
    // downloaded
    // and not downloading
    var numberOfResults = data.StudyInstanceUID.length;
    var i = 0;
    for (i = 0; i < numberOfResults; ++i) {
      if (data.Status[i] == 0) {
        var buttonID = '#' + data.SeriesInstanceUID[i].replace(/\./g, "_")
            + '-series';
        PACS.ajaxImage(data.StudyInstanceUID[i], data.SeriesInstanceUID[i],
            buttonID);
      }
    }
  }
  // query server for protocol name
  // not working
  /*
   * var numberOfResults = data2.StudyInstanceUID.length; var j = 0; for (j = 0;
   * j < numberOfResults; ++j) { jQuery .ajax({ type : "POST", async : false,
   * url : "controller/pacs_query.php", dataType : "json", data : { USER_AET :
   * jQuery( "#USER_AET") .val(), SERVER_IP : jQuery( "#SERVER_IP") .val(),
   * SERVER_POR : jQuery( "#SERVER_POR") .val(), PACS_LEV : 'IMAGE',
   * PACS_STU_UID : data2.StudyInstanceUID[j], PACS_SER_UID :
   * data2.SeriesInstanceUID[j] }, success : function( data3) { var idseries =
   * '#series-' + data3.SeriesInstanceUID[0] .replace( /\./g, "_");
   * jQuery(idseries) .text( data3.ProtocolName[0]); } }); }
   */
}
PACS.setupDownloadSeries = function() {
  jQuery(".download_series").live('click', function(event) {
    var currentButtonID = '#' + jQuery(this).attr('id');
    var nTr = jQuery(this).parents('tr')[0];
    var seriesUID = nTr.getAttribute('id').replace(/\_/g, ".");
    nTr = jQuery(this).parents('table')[0];
    // remove last 8 character (-details)
    var studyUID = nTr.getAttribute('id').replace(/\_/g, ".");
    studyUID = studyUID.substring(0, studyUID.length - 8);
    PACS.ajaxImage(studyUID, seriesUID, currentButtonID);
  });
}
PACS.setupPreviewSeries = function() {
  jQuery(".preview_series").live('click', function(event) {
    // get parent row
    var nTr = jQuery(this).parents('tr')[0];
    // get series uid
    var currentButtonID = '#' + nTr.getAttribute('id') + '-series';
    var seriesUID = nTr.getAttribute('id').replace(/\_/g, ".");
    // get study uid
    nTr = jQuery(this).parents('table')[0];
    var studyUID = nTr.getAttribute('id').replace(/\_/g, ".");
    studyUID = studyUID.substring(0, studyUID.length - 8);
    // get series description - might be a better way...!
    var description = jQuery(this).parents('tr')[0].cells[0].firstChild.data;
    // start pulling series
    PACS.ajaxImage(studyUID, seriesUID, currentButtonID);
    // start timeout function
    PACS.preview = setInterval(function() {
      PACS.ajaxPreview(studyUID, seriesUID)
    }, 2000);
    // modal label
    jQuery('#myModalLabel').html(description);
    // loading status callback
    // show modal
    jQuery('#myModal').modal();
    // if quit modal, stop preview
  });
  jQuery("#modal-dismiss").live('click', function(event) {
    // stop timeout
    clearInterval(PACS.preview);
    // delete XTK stuff
    delete PACS.sliceX;
    delete PACS.volume;
    // clean global variable
    PACS.previewReceivedData['filename'] = [];
    PACS.previewReceivedData['data'] = [];


  });
  jQuery("#modal-close").live('click', function(event) {
    // stop timeout
    clearInterval(PACS.preview);
    // delete XTK stuff
    delete PACS.sliceX;
    delete PACS.volume;
    // clean global variable
    PACS.previewReceivedData['filename'] = [];
    PACS.previewReceivedData['data'] = [];
  });
  jQuery("#modal-download").live('click', function(event) {
    // stop timeout
    clearInterval(PACS.preview);
    // delete XTK stuff
    delete PACS.sliceX;
    delete PACS.volume;
    // clean global variable
    PACS.previewReceivedData['filename'] = [];
    PACS.previewReceivedData['data'] = [];
  });
}
PACS.ajaxPreview = function(studyUID, seriesUID) {
  jQuery
      .ajax({
        type : "POST",
        url : "controller/pacs_preview.php",
        dataType : "json",
        data : {
          PACS_SER_UID : seriesUID
        },
        success : function(data) {
          if (data) {
            var numberOfResults = data.filename.length;
            // setup XTK viewer
            if (!PACS.sliceX) {
              window.console.debug('Slice created');
              PACS.sliceX = new X.renderer2D();
              PACS.sliceX.container = 'sliceX';
              PACS.sliceX.orientation = 'X';
              PACS.sliceX.init();
            }
            // create the volume
            if (!PACS.volume) {
              window.console.debug('Volume created');
              PACS.volume = new X.volume();
            }
            // get the all the files
            var i = 0;
            var seriesData = PACS.loadedStudies[studyUID];
            var nbFilesInSeries = seriesData.NumberOfSeriesRelatedInstances[seriesData.SeriesInstanceUID.indexOf(seriesUID)];
            
            // go through ajax results and populate the preview data
            for (i = 0; i < numberOfResults; i++) {
              // if data already received, do nothing
              if(jQuery.inArray(data.filename[i],PACS.previewReceivedData['filename']) != -1){
              window.console.log('already there:' + data.filename[i]);
              }
              // if data not received, grab it
              else {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://chris/data/' + data.filename[i], true);
                xhr.responseType = 'ArrayBuffer';
                // define error callback
                xhr.error = function(e) {
                  window.console.log('Error:' + e.target.error.code);
                };
                
                // define onLoad callback
                var overloadedOnLoad = function(filename){
                  return function(e){
                    // if data has been received in between, do nothing
                    if(jQuery.inArray(filename,PACS.previewReceivedData['filename']) == -1){
                    
                    // push not good - make sure data not there already
                    PACS.previewReceivedData['filename'].push(filename);
                    PACS.previewReceivedData['data'].push(this.response);

                    window.console.debug(' data loaded ' + filename);
                    window.console
                        .debug(PACS.previewReceivedData['filename'].length);

                    if (nbFilesInSeries == PACS.previewReceivedData['filename'].length) {
                      window.console.debug('All files received');
                      clearInterval(PACS.preview);
                      // set XTK renderer
                      PACS.volume.file = PACS.previewReceivedData['filename'];
                      PACS.volume.filedata = PACS.previewReceivedData['data'];
                      PACS.sliceX.add(PACS.volume);
                      PACS.sliceX.render();
                    }
                  }
                  };
                };
                
                xhr.onload = (overloadedOnLoad)(data.filename[i]);
                xhr.send();
              }
            }
          }
        }
      });
}
PACS.ajaxImage = function(studyUID, seriesUID, currentButtonID) {
  // wait button
  var seriesData = PACS.loadedStudies[studyUID];
  var i = seriesData.SeriesInstanceUID.indexOf(seriesUID);
  seriesData.Status[i] = 1;
  // modify class
  jQuery(currentButtonID).removeClass('btn-primary').removeClass(
      'download_series').addClass('btn-warning');
  // modify content
  jQuery(currentButtonID).html('<i class="icon-refresh rotating_class">');
  jQuery
      .ajax({
        type : "POST",
        url : "controller/pacs_move.php",
        dataType : "json",
        data : {
          USER_AET : 'FNNDSC-CHRISDEV',
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
          var studyButtonID = '#' + studyUID.replace(/\./g, "_") + ' button';
          jQuery(studyButtonID).attr('value',
              +jQuery(studyButtonID).attr('value') + 1);
          // all series downloaded, update button!
          if (+jQuery(studyButtonID).attr('value') == seriesData.SeriesInstanceUID.length) {
            jQuery(studyButtonID).removeClass('btn-warning').removeClass(
                'downloading_study').addClass('btn-success');
            // modify content
            jQuery(studyButtonID).html('<i class="icon-ok icon-white">');
          }
        }
      });
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
  PACS.loadedStudies = [];
  PACS.oTable = null;
  PACS.preview = null;
  PACS.previewReceivedData = [];
  PACS.previewReceivedData['filename'] = [];
  PACS.previewReceivedData['data'] = [];
  // search button pushed
  PACS.ajaxStudy();
  PACS.setupDetailStudy();
  PACS.setupDownloadStudy();
  PACS.setupDownloadSeries();
  PACS.setupPreviewSeries();
  // ping the server
  jQuery(".pacsPing").click(function(event) {
    PACS.ajaxPing();
  });
});