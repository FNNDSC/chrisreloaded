/**
* Define the _PACS_ namespace
*/
var _PACS_ = _PACS_ || {};
/**
* Bind the simple search input field to the simple search button.
*/
jQuery('#pacs_form').submit(function(e) {
  e.preventDefault();
  if (e.which == 13) {
    jQuery("#SEARCH").click();
  }
});

_PACS_.studyView = function() {
  jQuery("#STUDY_VIEW").live('click', function(event) {
    // new representation of cached data
    _PACS_.ajaxSimpleResults(_PACS_.cachedData, true);
  });
}
_PACS_.seriesView = function() {
  jQuery("#SERIES_VIEW").live('click', function(event) {
    // new representation of cached data
    _PACS_.ajaxAdvancedResults(_PACS_.cachedData, true);
  });
}
_PACS_.pacsAdvanced = function() {
  jQuery("#show_advanced").live(
      'click',
      function(event) {
        if (jQuery("#pacs_advanced").is(':visible')) {
          jQuery("#pacs_advanced").hide('blind', 100);
          jQuery("#show_advanced").html(
              '<i class="icon-chevron-down"></i><b>Advanced parameters</b>');
        } else {
          jQuery("#pacs_advanced").show('blind', 100);
          jQuery("#show_advanced").html(
              '<i class="icon-chevron-up"></i><b>Advanced parameters</b>');
        }
      });
}
_PACS_.ajaxSearch = function() {
  jQuery("#SEARCH").live('click', function(event) {
      _PACS_.ajaxSimple();
  });
}
/**
* Setup the download button to only download the series which are remaing after
* filtering in the advanced mode.
*/
_PACS_.setupDownloadSeriesFiltered = function() {
  jQuery(".d_filter").live('click', function() {
    // get filtered data
    var filter = _PACS_.sTable._('tr', {
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
* Setup the download button to download all series for a given study.
*/
_PACS_.setupDownloadStudy = function() {
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
        _PACS_.cacheStatus[stuid] = 1;
        // download all related series
        _PACS_.ajaxSeries(stuid);
      });
}
/**
* Setup the details button to show series within a study in simple query.
*/
_PACS_.setupDetailStudy = function() {
  jQuery('#S-RESULTS td .control').live('click', function() {
    // get the row
    var nTr = jQuery(this).parents('tr')[0];
    // get the related study UID
    // replace back '_' by '.'
    var stuid = jQuery(this).attr('id').replace(/\_/g, ".");
    // if data has not been cached, perform ajax query, else show it without
    // ajax!
    var i = jQuery.inArray(nTr, _PACS_.openStudies);
    if (i == -1) {
      // get related series
      _PACS_.ajaxSeries(stuid, nTr);
    } else {
      jQuery('i', this).attr('class', 'icon-chevron-down');
      jQuery('div.innerDetails', jQuery(nTr).next()[0]).slideUp(function() {
        _PACS_.sTable.fnClose(nTr);
        _PACS_.openStudies.splice(i, 1);
      });
    }
  });
}
/**
* Setup the download series button.
*/
_PACS_.setupDownloadSeries = function() {
  jQuery(".d_series").live('click', function(event) {
    var id = jQuery(this).attr('id');
    var split_id = id.split('-');
    var stuid = split_id[0].replace(/\_/g, ".");
    var seuid = split_id[1].replace(/\_/g, ".");
    _PACS_.ajaxImage(stuid, seuid, '#' + id);
  });
}
/**
* Setup the preview series behavior.
*/
_PACS_.setupPreviewSeries = function() {
  // connect the preview button
  jQuery(".p_series").live('click', function(event) {
    var id = jQuery(this).attr('id');
    var split_id = id.split('-');
    var stuid = split_id[0].replace(/\_/g, ".");
    var seuid = split_id[1].replace(/\_/g, ".");
    // start pulling series and update id
    _PACS_.ajaxImage(stuid, seuid, '#' + id.substring(0, id.length - 1) + 'd');
    // setup nb_files and filename
    var seriesData = _PACS_.cache[stuid];
    var index = seriesData.SeriesInstanceUID.indexOf(seuid);
    var files_nb = seriesData.NumberOfSeriesRelatedInstances[index];
    var desc = seriesData.SeriesDescription[index];
    // setup data previews
    _DATA_.PreviewSeries = seuid;
    _DATA_.PreviewNbFiles = files_nb;
    _DATA_.PreviewDesc = desc;
    // start data preview
    _DATA_.startPreview();
  });
}
/**
* Setup the 'Advanced' search button.
*/
_PACS_.ajaxAdvanced = function() {
  // keep reference to current object for the ajax response
  var me = jQuery("#SEARCH");
  // modify class
  me.removeClass('btn-primary').addClass('btn-warning');
  // modify content
  me.html('<i class="icon-refresh rotating_class">');
  // destroy the results table if it exists
  if (jQuery('#S-RESULTS').length != 0) {
    _PACS_.sTable.dataTable().fnDestroy();
    _PACS_.sTable = null;
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
        PACS_LEV : 'ALL',
        PACS_MRN : mrn_split[i],
        PACS_NAM : jQuery("#PACS_NAM").attr('value'),
        PACS_MOD : jQuery("#PACS_MOD").attr('value'),
        PACS_DAT : jQuery("#PACS_DAT").attr('value'),
        PACS_ACC_NUM : '',
        PACS_STU_DES : '',
        PACS_STU_UID : '',
        PACS_PSAET : jQuery("#PACS_PSAET").attr('value')
      },
      success : function(data) {
        jQuery("#PACS-RESULTS").show('blind', 100);
        mrn_received++;
        if (mrn_received == mrn_nb) {
          me.removeClass('btn-warning').addClass('btn-primary');
          me.html('Search');
        }
        _PACS_.ajaxAdvancedResults(data);
      }
    });
  }
}
/**
* Handle 'Advanced' AJAX query results.
*/
_PACS_.ajaxAdvancedResults = function(data, force) {
  
  // default value for 'force' is false
  if (typeof force == 'undefined') {
    
    force = false;
    
  }
  
  // cache the data
  _PACS_.cachedData = data;
  if(data[1] == null){
    _PACS_.ajaxAdvanced();
  }
  if (data[0] != null) {
    // if no table, create it
    if (jQuery('#S-RESULTS').length == 0 || force == true) {
      _PACS_.advancedTable();
    }
    // add data in the table!
    var append = Array();
    var series_nb = data[1].SeriesDescription.length;
    var i = 0;
    for (i = 0; i < series_nb; ++i) {
      // update loaded results
      _PACS_.advancedCaching(data, i);
      // fill html table
      append.push(_PACS_.advancedFormat(data, i));
    }
    // add table to current table
    jQuery('#S-RESULTS').dataTable().fnAddData(append);
  } else {
    // no studies found and not doing multiple mrn_split
    if (_PACS_.sTable == null) {
      jQuery('#SC-RESULTS').html("No data found...");
    }
  }
}
/**
* Create 'Advanced' table dataTables enabled.
*/
_PACS_.advancedTable = function() {
  var content = '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="S-RESULTS">';
  var i = 0;
  content += '<thead><tr><th>Name</th><th>MRN</th><th>DOB</th><th>Study Date</th><th>Mod.</th><th>Study Desc.</th><th>Series Desc.</th><th>Location</th><th>files</th><th></th><th></th></tr></thead><tbody>';
  content += '</tbody></table>';
  // update html with table
  jQuery('#SC-RESULTS').html(content);
  // make table sortable, filterable, ...
  _PACS_.sTable = jQuery('#S-RESULTS')
      .dataTable(
          {
            "sDom" : "<'row-fluid'<'span6' il ><'span6' <'d_filter'> f>r>t<'row-fluid'<'span6'><'span6'p>>",
            "sPaginationType" : "bootstrap",
            "oLanguage" : {
              "sLengthMenu" : " (_MENU_ per page)",
              "sInfo": "Showing _START_ to _END_ of _TOTAL_ results "
            },
            "aLengthMenu" : [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ],
            iDisplayStart : 0,
            iDisplayLength : 10,
            "aoColumnDefs" : [ {
              "bSortable" : false,
              "aTargets" : [ 9, 10 ]
            } ],
            "aaSorting" : [ [ 1, 'desc' ] ],
            "bAutoWidth" :false
          });
  jQuery(".d_filter")
      .html(
          '<button class="btn btn-primary pull-right" type="button"><i class="icon-circle-arrow-down icon-white"></i></button>');
}
/**
* Cache data after 'Advanced' AJAX query.
*/
_PACS_.advancedCaching = function(data, i) {
  var stuid = data[1].StudyInstanceUID[i];
  var study = null;
  var cached = stuid in _PACS_.cache;
  // if study not loaded, create container for this study
  if (!cached) {
    _PACS_.cache[stuid] = Array();
    study = _PACS_.cache[stuid];
    study.StudyInstanceUID = Array();
    study.SeriesInstanceUID = Array();
    study.SeriesDescription = Array();
    study.PerformedStationAETitle = Array();
    study.NumberOfSeriesRelatedInstances = Array();
    study.QueryRetrieveLevel = Array();
    study.RetrieveAETitle = Array();
    study.Status = Array();
  } else {
    study = _PACS_.cache[stuid];
  }
  // fill study container
  var index = data[0].StudyInstanceUID.indexOf(data[1].StudyInstanceUID[i]);
  var exists = jQuery.inArray(data[1].SeriesInstanceUID[i],
      study.SeriesInstanceUID);
  if (exists == -1) {
    study.StudyInstanceUID.push(data[1].StudyInstanceUID[i]);
    study.SeriesInstanceUID.push(data[1].SeriesInstanceUID[i]);
    study.SeriesDescription.push(data[1].SeriesDescription[i]);
    study.PerformedStationAETitle.push(data[0].PerformedStationAETitle[index]);
    study.NumberOfSeriesRelatedInstances
        .push(data[1].NumberOfSeriesRelatedInstances[i]);
    study.QueryRetrieveLevel.push(data[1].QueryRetrieveLevel[i]);
    study.RetrieveAETitle.push(data[1].RetrieveAETitle[i]);
    study.Status.push(0);
  }
}
/**
* Reformat data after 'Advanced' AJAX query to fit the dataTable standard.
*/
_PACS_.advancedFormat = function(data, i) {
  var index = data[0].StudyInstanceUID.indexOf(data[1].StudyInstanceUID[i]);
  var stuid = data[1].StudyInstanceUID[i];
  var serid = data[1].SeriesInstanceUID[i];
  var id = stuid.replace(/\./g, "_") + '-' + serid.replace(/\./g, "_");
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
  sub.push(data[0].PerformedStationAETitle[index].replace(/\>/g, "&gt")
      .replace(/\</g, "&lt"));
  sub.push(data[1].NumberOfSeriesRelatedInstances[i]);
  sub
      .push('<button id="'
          + id
          + '-ap" class="btn btn-info p_series " type="button"><i class="icon-eye-open icon-white"></i></button>');
  // update download icon based on its status
  var status = 0;
  var cached_study = stuid in _PACS_.cache;
  if (cached_study) {
    var series_index = _PACS_.cache[stuid].SeriesInstanceUID.indexOf(serid);
    if (series_index >= 0) {
      status = _PACS_.cache[stuid].Status[series_index];
    }
  }
  if (status == 0) {
    sub
        .push('<button id="'
            + id
            + '-ad" class="btn btn-primary d_series pull-right" type="button"><i class="icon-circle-arrow-down icon-white"></i></button>');
  } else if (status == 1) {
    sub
        .push('<button id="'
            + id
            + '-ad" class="btn btn-warning pull-right" type="button"><i class="icon-refresh rotating_class"></i></button>');
  } else if (status == 2) {
    sub
        .push('<button id="'
            + id
            + '-ad" class="btn btn-success pull-right" type="button"><i class="icon-ok icon-white"></i></button>');
  }
  return sub;
}
/**
* Setup the 'Simple' search button.
*/
_PACS_.ajaxSimple = function() {
  var me = jQuery("#SEARCH");
  me.removeClass('btn-primary').addClass('btn-warning');
  // modify content
  me.html('<i class="icon-refresh rotating_class">');
  if (jQuery('#S-RESULTS').length != 0) {
    // destroy the table
    _PACS_.sTable.dataTable().fnDestroy();
    _PACS_.sTable = null;
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
        PACS_STU_UID : '',
        PACS_PSAET : jQuery("#PACS_PSAET").attr('value')
      },
      success : function(data) {
        jQuery("#PACS-RESULTS").show('blind', 100);
        mrn_received++;
        if (mrn_received == mrn_nb) {
          me.removeClass('btn-warning').addClass('btn-primary');
          me.html('Search');
        }
        // reformat data in 2 arrays
        data = _PACS_.reformatSimpleResults(data);
        _PACS_.cachedData = data;
        // data simple visualization
        _PACS_.ajaxSimpleResults(data);
      }
    });
  }
}
_PACS_.reformatSimpleResults = function(data) {
  var reformat = new Array();
  reformat[0] = data;
  reformat[1] = null;
  return reformat;
}
/**
* Handle 'Simple' AJAX query results.
*/
_PACS_.ajaxSimpleResults = function(data, force) {
  // default force value is false
  if(typeof(force)==='undefined') force = false;
  // if ajax returns something, process it
  if (data[0] != null) {
    // if no table, create it
    if (jQuery('#S-RESULTS').length == 0 || force == true) {
      _PACS_.simpleTable();
    }
    // fill the table
    var append = Array();
    var numStudies = data[0].PatientID.length;
    var i = 0;
    for (i = 0; i < numStudies; ++i) {
      append.push(_PACS_.simpleFormat(data[0], i));
    }
    jQuery('#S-RESULTS').dataTable().fnAddData(append);
  } else {
    // no studies found and not doing multiple mrns
    if (_PACS_.sTable == null) {
      jQuery('#SC-RESULTS').html("No data found...");
    }
  }
}
/**
* Create 'Simple' table dataTables enabled.
*/
_PACS_.simpleTable = function() {
  var content = '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="S-RESULTS">';
  content += '<thead><tr><th>Name</th><th>MRN</th><th>DOB</th><th>Study Desc.</th><th>Study Date</th><th>Mod.</th><th>Location</th><th></th></tr></thead><tbody>';
  content += '</tbody></table>';
  jQuery('#SC-RESULTS').html(content);
  // make table sortable, filterable, ...
  _PACS_.sTable = jQuery('#S-RESULTS')
      .dataTable(
          {
            "sDom" : "<'row-fluid'<'span6' il><'span6' <'d_filter'> f>r>t<'row-fluid'<'span6'><'span6'p>>",
            "sPaginationType" : "bootstrap",
            "oLanguage" : {
              "sLengthMenu" : " (_MENU_ per page)",
              "sInfo": "Showing _START_ to _END_ of _TOTAL_ results "
            },
            "aLengthMenu" : [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ],
            iDisplayStart : 0,
            iDisplayLength : 10,
            "aoColumnDefs" : [ {
              "bSortable" : false,
              "aTargets" : [ 7 ]
            } ],
            "bAutoWidth" :false,
            "aaSorting" : [ [ 1, 'desc' ] ],
          });
  jQuery(".d_filter")
      .html(
          '<button class="btn btn-primary pull-right" type="button"><i class="icon-circle-arrow-down icon-white"></i></button>');
}
/**
* Reformat data after 'Advanced' AJAX query to fit the dataTable standard.
*/
_PACS_.simpleFormat = function(data, i) {
  var stuid = data.StudyInstanceUID[i];
  var sub = Array();
  sub.push('<div id="' + stuid.replace(/\./g, "_")
      + '" class="control"><i class="icon-chevron-down"></i> '+data.PatientName[i].replace(/\^/g, " ")+'</div>');
  sub.push(data.PatientID[i]);
  sub.push(data.PatientBirthDate[i]);
  sub
      .push(data.StudyDescription[i].replace(/\>/g, "&gt")
          .replace(/\</g, "&lt"));
  sub.push(data.StudyDate[i]);
  sub.push(data.ModalitiesInStudy[i]);
  sub.push(data.PerformedStationAETitle[i].replace(/\>/g, "&gt").replace(/\</g,
      "&lt"));
  // if study cached, check status of series to update icon
  var cached = stuid in _PACS_.cacheStatus;
  var status = 0;
  if (cached) {
    status = _PACS_.cacheStatus[stuid];
  } else {
    _PACS_.cacheStatus[stuid] = 0;
    _PACS_.cacheCount[stuid] = 0;
  }
  if (status == 0) {
    sub
        .push('<button id="'
            + data.StudyInstanceUID[i].replace(/\./g, "_")
            + '-std" class="btn btn-primary d_study pull-right" type="button"><i class="icon-circle-arrow-down icon-white"></i></button>');
  } else if (status == 1) {
    sub
        .push('<button id="'
            + data.StudyInstanceUID[i].replace(/\./g, "_")
            + '-std" class="btn btn-warning pull-right" type="button"><i class="icon-refresh rotating_class"></button>');
  } else if (status == 2) {
    sub
        .push('<button id="'
            + data.StudyInstanceUID[i].replace(/\./g, "_")
            + '-std" class="btn btn-success pull-right" type="button"><i class="icon-ok icon-white"></button>');
  }
  return sub;
}
/**
* Get 'Series' data AJAX.
*/
_PACS_.ajaxSeries = function(studyUID, nTr) {
  var stuid = studyUID;
  var j = stuid in _PACS_.cache;
  // if not cached
  if (!j) {
    // set waiting icon
    if (nTr != null) {
      jQuery('.control i', nTr).removeClass('icon-chevron-down').addClass('icon-refresh').addClass('rotating_class');
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
        PACS_SER_DES : '',
        PACS_PSAET : jQuery("#PACS_PSAET").attr('value')
      },
      success : function(data) {
        // change icon
        if (nTr != null) {
          jQuery('.control i', nTr).removeClass('icon-refresh').removeClass('rotating_class').addClass('icon-chevron-up');
        }
        // should be inside the results
        // append a status field
        data.Status = Array();
        var series_nb = data.SeriesInstanceUID.length;
        var i = 0;
        for (i = 0; i < series_nb; ++i) {
          data.Status[i] = 0;
        }
        _PACS_.cache[stuid] = data;
        _PACS_.ajaxSeriesResults(data, nTr);
      }
    });
  }
  // if cached
  else {
    if (nTr != null) {
      jQuery('.control i', nTr).removeClass('icon-chevron-down').addClass('icon-chevron-up');
    }
    _PACS_.ajaxSeriesResults(_PACS_.cache[stuid], nTr);
  }
}
/**
* Handle 'Series' AJAX query results.
*/
_PACS_.ajaxSeriesResults = function(data, nTr) {
  // format the details row table
  if (nTr != null) {
    var detailRown = _PACS_.sTable.fnOpen(nTr, _PACS_.seriesFormat(data),
        'details');
    // create dataTable from html table
    jQuery('.table', detailRown).dataTable({
      "sDom" : "t",
      "aaSorting" : [ [ 1, 'desc' ] ],
      "bPaginate" : false,
      "aoColumnDefs" : [ {
        "bSortable" : false,
        "aTargets" : [ 2, 3 ]
      } ],
      "bAutoWidth" :false
    });
    jQuery('div.innerDetails', detailRown).slideDown();
    _PACS_.openStudies.push(nTr);
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
        _PACS_.ajaxImage(data.StudyInstanceUID[i], data.SeriesInstanceUID[i],
            bid);
      }
    }
  }
}
/**
* Format the details (series) HTML table for a study, given some data
*/
_PACS_.seriesFormat = function(data) {
  // number of rows to be created
  var nb_results = data.StudyInstanceUID.length;
  var i = 0;
  // Create the "details" (i.e. series) html content
  // innerDetails used for slide in/out
  var content = '<div class="innerDetails"><table class="table table-bordered" cellmarging="0" cellpadding="0" cellspacing="0" border="0"><thead><tr><th>Series Desc.</th><th class="span2"># files</th><th class="span1"></th><th class="span1"></th></tr></thead><tbody>';
  for (i = 0; i < nb_results; ++i) {
    // replace '.' by '_' (. is invalid for the id)
    var stuid = data.StudyInstanceUID[i].replace(/\./g, "_");
    var serid = data.SeriesInstanceUID[i].replace(/\./g, "_");
    var id = stuid + '-' + serid;
    content += '<tr class="parent " id="' + serid + '">';
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
* Get 'Image' data AJAX.
*/
_PACS_.ajaxImage = function(studyUID, seriesUID, buttonID) {
  // if series already or is being downloaded (preview use case)
  if (jQuery(buttonID).length == 0 || jQuery(buttonID).hasClass('btn-primary')) {
    // wait button
    // modify class
    jQuery(buttonID).removeClass('btn-primary').removeClass('d_series')
        .addClass('btn-warning');
    // modify content
    jQuery(buttonID).html('<i class="icon-refresh rotating_class">');
    // modify status
    var seriesData = _PACS_.cache[studyUID];
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
            var seriesData = _PACS_.cache[studyUID];
            var i = seriesData.SeriesInstanceUID.indexOf(seriesUID);
            seriesData.Status[i] = 2;
            // update visu if not closed!
            // use "this", modify style, refresh
            jQuery(buttonID).removeClass('btn-warning').addClass('btn-success');
            // modify content
            jQuery(buttonID).html('<i class="icon-ok icon-white">');
            var studyButtonID = '#' + studyUID.replace(/\./g, "_") + '-std';
            // update count
            _PACS_.cacheCount[studyUID]++;
            if (jQuery(studyButtonID).length != 0
                && _PACS_.cacheCount[studyUID] == seriesData.SeriesInstanceUID.length) {
              // all series downloaded, update button!
              _PACS_.cacheStatus[studyUID] = 2;
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
* Get 'Ping' data AJAX.
*/
_PACS_.ajaxPing = function() {
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
      _PACS_.ajaxPingResults(data);
    }
  });
}
/**
* Handle 'Ping' AJAX query results.
*/
_PACS_.ajaxPingResults = function(data) {
  var pingResult = '';
  if (data == 1) {
    pingResult = ' <span class="alert alert-success fade in">Server accessible</span>';
  } else {
    pingResult = ' <span class="alert alert-error fade in">Server not accessible</span>';
  }
  jQuery('#pacsping').html(pingResult);
}
/**
* Setup the javascript when document is ready (finshed loading)
*/
$(document).ready(function() {
  window.console.log('READY!');
  //
  // caching variables
  //
  _PACS_.cachedData = null;
  _PACS_.cacheStatus = {};
  _PACS_.cacheCount = {};
  _PACS_.cache = {};
  _PACS_.ajaxSearch();
/*
* _PACS_.studySearch(); _PACS_.seriesSearch();
*/
  _PACS_.studyView();
  _PACS_.seriesView();
  //
  // simple mode
  //
  _PACS_.sTable = null;
  _PACS_.openStudies = [];
  _PACS_.setupDetailStudy();
  _PACS_.setupDownloadStudy();
  _PACS_.pacsAdvanced();
  //
  // advanced mode
  //
  _PACS_.setupDownloadSeriesFiltered();
  //
  // both modes
  //
  // preview - do not need all that but ready for DICOM support!
  _PACS_.setupPreviewSeries();
  // search button pushed
  _PACS_.setupDownloadSeries();
  //
  // settings
  //
  // ping the server
  jQuery(".pacsPing").click(function(event) {
    _PACS_.ajaxPing();
  });
});
