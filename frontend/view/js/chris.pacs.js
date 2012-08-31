/**
 * 
 * @param oTable
 * @param data
 * @returns {String}
 */
function fnFormatDetails(data) {
  var numberOfResults = data.StudyInstanceUID.length;
  var i = 0;
  // set table id
  var content = '<div class="innerDetails"><table id="'
      + data.StudyInstanceUID[0].replace(/\./g, "_")
      + '-details" class="table table-bordered" cellmarging="0" cellpadding="0" cellspacing="0" border="0"><thead><tr><th>Protocol</th><th class="span2"># files</th><th class="span1"></th><th class="span1"></th></tr></thead><tbody>';
  for (i = 0; i < numberOfResults; ++i) {
    content += '<tr class="parent pacsStudyRows" id="'
        + data.SeriesInstanceUID[i].replace(/\./g, "_") + '">';
    content += '<td>' + data.SeriesInstanceUID[i] + '</td>';
    content += '<td>' + data.NumberOfSeriesRelatedInstances[i] + '</td>';
    content += '<td><button class="btn btn-success preview_series " type="button"><i class="icon-eye-open icon-white"></i></button></td>';
    // need 3 cases
    if (data.Status[i] == 0) {
      content += '<td><button class="btn btn-info download_series " type="button"><i class="icon-circle-arrow-down icon-white"></i></button></td>';
    } else if (data.Status[i] == 1) {
      content += '<td><button class="btn btn-warning download_series " type="button"><i class="icon-circle-arrow-down icon-white"></i></button></td>';
    } else {
      content += '<td><button class="btn download_series " type="button"><i class="icon-circle-arrow-down icon-white"></i></button></td>';
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
function fnInitTable(tableName, nbColumn, icon) {
  /*
   * Insert a 'details' column to the table
   */
  var nCloneTh = document.createElement('th');
  var nCloneTd = document.createElement('td');
  nCloneTd.innerHTML = '<span class="control"><i class="' + icon
      + '"></i></span>';
  nCloneTd.className = "center";
  $('#' + tableName + '-results thead tr').each(function() {
    this.insertBefore(nCloneTh, this.childNodes[0]);
  });
  $('#' + tableName + '-results tbody tr').each(function() {
    this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
  });
  /*
   * Insert a 'download' column to the table
   */
  var nCloneTh = document.createElement('th');
  var nCloneTd = document.createElement('td');
  nCloneTd.innerHTML = '<button class="btn btn-primary download_study" type="button"><i class="icon-circle-arrow-down icon-white download'
      + tableName + '"></i></button>';
  nCloneTd.className = "center";
  $('#' + tableName + '-results thead tr').each(function() {
    this.insertBefore(nCloneTh, this.childNodes[nbColumn]);
  });
  $('#' + tableName + '-results tbody tr').each(function() {
    this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[nbColumn]);
  });
  /*
   * Initialse DataTables, with no sorting on the 'details' column
   */
  var oTable = $('#' + tableName + '-results')
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
function setupDownloadStudy() {
  $(".download_study").live('click', function(event) {
    var nTr = $(this).parents('tr')[0];
    var studyUID = nTr.getAttribute('id').replace(/\_/g, ".");
    $.ajax({
      type : "POST",
      url : "controller/pacs_move.php",
      dataType : "json",
      data : {
        USER_AET : 'FNNDSC-CHRISDEV',
        SERVER_IP : '134.174.12.21',
        SERVER_POR : '104',
        PACS_LEV : 'STUDY',
        PACS_STU_UID : studyUID,
        PACS_MRN : $("#PACS_MRN").val(),
        PACS_NAM : '',
        PACS_MOD : '',
        PACS_DAT : '',
        PACS_STU_DES : '',
        PACS_ACC_NUM : ''
      },
      success : function(data) {
      }
    });
  });
}
/**
 * 
 */
function setupDetailStudy(oTable) {
  $('#quick-results td .control').live('click', function() {
    var nTr = $(this).parents('tr')[0];
    var studyUID = nTr.getAttribute('id').replace(/\_/g, ".");
    var i = $.inArray(nTr, window.openStudies);
    if (i === -1) {
      $('i', this).attr('class', 'icon-chevron-up');
      // is it good practice
      var j = studyUID in window.loadedStudies;
      // if not cached
      if (j == 0) {
        ajaxSeries(studyUID, oTable, nTr);
        // if cached
      } else {
        ajaxSeriesResults(window.loadedStudies[studyUID], oTable, nTr);
      }
    } else {
      $('i', this).attr('class', 'icon-chevron-down');
      $('div.innerDetails', $(nTr).next()[0]).slideUp(function() {
        oTable.fnClose(nTr);
        window.openStudies.splice(i, 1);
      });
    }
  });
}
/**
 * 
 * @param data
 */
function ajaxStudyResults(data) {
  // destroy table if exists
  if ($('#quick-results').length > 0) {
    // unlink all click events
    $('#quick-results td .control').die('click');
    // destroy dataTable
    $('#quick-results').dataTable().fnDestroy();
    // empty container
    $('#results_container').html("");
  }
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
    $('#results_container').html(content);
    // make table sortable, filterable, ...
    // make the table cooler!
    var oTable = fnInitTable('quick', 6, 'icon-chevron-down');
    setupDownloadStudy();
    setupDetailStudy(oTable);
  } else {
    // no studies found
    $('#results_container').html("No studies found...");
  }
}
/**
 * 
 */
function ajaxStudy() {
  // query pacs on parameters, at STUDY LEVEL
  $.ajax({
    type : "POST",
    url : "controller/pacs_query.php",
    dataType : "json",
    data : {
      USER_AET : $("#USER_AET").val(),
      SERVER_IP : $("#SERVER_IP").val(),
      SERVER_POR : $("#SERVER_POR").val(),
      PACS_LEV : 'STUDY',
      PACS_MRN : $("#PACS_MRN").val(),
      PACS_NAM : $("#PACS_NAM").val(),
      PACS_MOD : $("#PACS_MOD").val(),
      PACS_DAT : $("#PACS_DAT").val(),
      PACS_ACC_NUM : '',
      PACS_STU_DES : '',
      PACS_STU_UID : ''
    },
    success : function(data) {
      ajaxStudyResults(data);
    }
  });
}
/**
 * 
 * @param studyUID
 * @param oTable
 */
function ajaxSeries(studyUID, oTable, nTr) {
  $.ajax({
    type : "POST",
    url : "controller/pacs_query.php",
    dataType : "json",
    data : {
      USER_AET : $("#USER_AET").val(),
      SERVER_IP : $("#SERVER_IP").val(),
      SERVER_POR : $("#SERVER_POR").val(),
      PACS_LEV : 'SERIES',
      PACS_STU_UID : studyUID
    },
    success : function(data) {
      // hshould be inside the results
      // append a status field
      data.Status = Array();
      var numSeries = data.SeriesInstanceUID.length;
      var i = 0;
      for (i = 0; i < numSeries; ++i) {
        data.Status[i] = 0;
      }
      window.loadedStudies[studyUID] = data;
      ajaxSeriesResults(data, oTable, nTr);
    }
  });
}
/**
 * 
 * @param otable
 */
function ajaxSeriesResults(data, oTable, nTr) {
  // format the details row table
  var nDetailsRow = oTable.fnOpen(nTr, fnFormatDetails(data), 'details');
  // make the details table sortable
  var detailstableid = "#" + data.StudyInstanceUID[0].replace(/\./g, "_")
      + "-details";
  $(detailstableid).dataTable({
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
  $('div.innerDetails', nDetailsRow).slideDown();
  window.openStudies.push(nTr);
  setupDownloadSeries();
  // query server for protocol name
  // not working
  /*
   * var numberOfResults = data2.StudyInstanceUID.length; var j = 0; for (j = 0;
   * j < numberOfResults; ++j) { $ .ajax({ type : "POST", async : false, url :
   * "controller/pacs_query.php", dataType : "json", data : { USER_AET : $(
   * "#USER_AET") .val(), SERVER_IP : $( "#SERVER_IP") .val(), SERVER_POR : $(
   * "#SERVER_POR") .val(), PACS_LEV : 'IMAGE', PACS_STU_UID :
   * data2.StudyInstanceUID[j], PACS_SER_UID : data2.SeriesInstanceUID[j] },
   * success : function( data3) { var idseries = '#series-' +
   * data3.SeriesInstanceUID[0] .replace( /\./g, "_"); $(idseries) .text(
   * data3.ProtocolName[0]); } }); }
   */
}
function setupDownloadSeries() {
  $(".download_series").live('click', function(event) {
    var currentButton = $(this);
    var nTr = $(this).parents('tr')[0];
    var seriesUID = nTr.getAttribute('id').replace(/\_/g, ".");
    nTr = $(this).parents('table')[0];
    // remove last 8 character (-details)
    var studyUID = nTr.getAttribute('id').replace(/\_/g, ".");
    studyUID = studyUID.substring(0, studyUID.length - 8);
    
     var seriesData = window.loadedStudies[studyUID];
     var i = seriesData.SeriesInstanceUID.indexOf(seriesUID);
     seriesData.Status[i] = 1;
     currentButton.toggleClass('btn-info', false);
     currentButton.toggleClass('btn-warning', true);
    
    $.ajax({
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
        var seriesData = window.loadedStudies[studyUID];
        var i = seriesData.SeriesInstanceUID.indexOf(seriesUID);
        seriesData.Status[i] = 2;
        // update visu if not closed!
        // use "this", modify style, refresh
        currentButton.toggleClass('btn-warning', false);
      }
    });
  });
}
/**
 * 
 */
function ajaxPing() {
  $.ajax({
    type : "POST",
    url : "controller/pacs_ping.php",
    dataType : "json",
    data : {
      USER_AET : $("#USER_AET").val(),
      SERVER_IP : $("#SERVER_IP").val(),
      SERVER_POR : $("#SERVER_POR").val()
    },
    success : function(data) {
      ajaxPingResults(data);
    }
  });
}
/**
 * 
 * @param data
 */
function ajaxPingResults(data) {
  var pingResult = '';
  if (data == 1) {
    pingResult = ' <span class="alert alert-success fade in">Server accessible</span>';
  } else {
    pingResult = ' <span class="alert alert-error fade in">Server not accessible</span>';
  }
  $('#pacsping').html(pingResult);
}
/**
 * 
 */
$(document).ready(function() {
  // store "opened" studies
  openStudies = [];
  // store "loaded" studies
  loadedStudies = [];
  // search button pushed
  $("#PACS_QUERY").live('click', function(event) {
    ajaxStudy();
  });
  // ping the server
  $(".pacsPing").click(function(event) {
    ajaxPing();
  });
});