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
/**
 * Show/hide the advanced parameters div on click
 */
_PACS_.connectShowAdvancedParameters = function() {
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
/**
 * Start ajax search on click
 */
_PACS_.connectAjaxSearch = function() {
  jQuery("#SEARCH").live('click', function(event) {
    _PACS_.ajaxSearch();
  });
}
_PACS_.cleanResults = function() {
  if (jQuery('#S-RESULTS').length != 0) {
    _PACS_.table.dataTable().fnDestroy();
    _PACS_.table = null;
    jQuery('#S-RESULTS').remove();
  }
}
_PACS_.preProcessMRN = function() {
  var mrns = jQuery("#PACS_MRN").attr('value').split(/\s+/g);
  var nb_mrns = mrns.length;
  if (nb_mrns >= 2 && mrns[nb_mrns - 1] == "") {
    nb_mrns--;
  }
  return [ mrns, nb_mrns ];
}
_PACS_.preProcessDate = function() {
  var dates = jQuery("#PACS_DAT").attr('value').split(/\-/g);
  var nb_dates = dates.length;
  // list all dates to be queried
  if (nb_dates >= 2 && dates[1] != "") {
    var f_year = dates[0].substring(0, 4);
    var f_month = dates[0].substring(4, 6);
    var f_day = dates[0].substring(6, 8);
    var from = new Date(f_year, parseInt(f_month) - 1, f_day);
    var t_year = dates[1].substring(0, 4);
    var t_month = dates[1].substring(4, 6);
    var t_day = dates[1].substring(6, 8);
    var to = new Date(t_year, parseInt(t_month) - 1, t_day);
    dates = [];
    dates.push(f_year + f_month + f_day);
    from.setDate(from.getDate() + 1);
    while (from <= to) {
      dates.push(from.getFullYear().toString()
          + ("0" + (from.getMonth() + 1).toString()).slice(-2)
          + ("0" + from.getDate().toString()).slice(-2));
      from.setDate(from.getDate() + 1);
    }
    nb_dates = dates.length;
  } else {
    nb_dates = 1;
  }
  return [ dates, nb_dates ];
}
/**
 * Setup the ajaxSearch action
 */
_PACS_.ajaxSearch = function() {
  _PACS_.cleanResults();
  // clean delete cache
  _PACS_.cachedSeries = [];
  _PACS_.cachedRaw = [ {}, {} ];
  // split MRNs on white space
  var pro_mrn = _PACS_.preProcessMRN();
  // sanity check should occur
  var mrns = pro_mrn[0];
  var nb_mrns = pro_mrn[1];
  // create list of date studies
  var pro_date = _PACS_.preProcessDate();
  // sanity check should occur
  var dates = pro_date[0];
  var nb_dates = pro_date[1];
  var nb_queries = nb_mrns * nb_dates;
  // keep reference to current object for the ajax response
  // modify class
  jQuery("#SEARCH").removeClass('btn-primary').addClass('btn-warning');
  // modify content
  jQuery("#SEARCH").html(
      '<i class="icon-refresh rotating_class"></i> <span> '
          + parseInt(100 * _PACS_.ajaxStatus / nb_queries) + '%</span>');
  var i = 0;
  if (nb_mrns >= 2) {
    // loop through mrns
    for (i = 0; i < nb_mrns; i++) {
      if (nb_dates >= 2) {
        // loop through dates
        var j = 0;
        for (j = 0; j < nb_dates; j++) {
          _PACS_.queryDayAll(mrns[i], dates[j], nb_queries);
        }
      } else {
        // no dates loop
        _PACS_.queryDayAll(mrns[i], dates[0], nb_queries);
      }
    }
  } else {
    // no mrn loop
    if (nb_dates >= 2) {
      // loop through dates
      var j = 0;
      for (j = 0; j < nb_dates; j++) {
        _PACS_.queryDayAll(mrns[0], dates[j], nb_queries);
      }
    } else {
      _PACS_.queryDayAll(mrns[0], dates[0], nb_queries);
    }
  }
}
_PACS_.queryDayAll = function(mrn, date, nb_queries) {
  jQuery.ajax({
    type : "POST",
    url : "pacs_query.php",
    dataType : "json",
    data : {
      USER_AET : jQuery("#USER_AET").attr('value'),
      SERVER_IP : jQuery("#SERVER_IP").attr('value'),
      SERVER_POR : jQuery("#SERVER_POR").attr('value'),
      PACS_MRN : mrn,
      PACS_NAM : jQuery("#PACS_NAM").attr('value'),
      PACS_MOD : jQuery("#PACS_MOD").attr('value'),
      PACS_DAT : date,
      PACS_ACC_NUM : '',
      PACS_STU_DES : jQuery("#PACS_STU_DES").attr('value'),
      PACS_SER_DES : jQuery("#PACS_SER_DES").attr('value'),
      PACS_STU_UID : '',
      PACS_PSAET : jQuery("#PACS_PSAET").attr('value')
    },
    success : function(data) {
      jQuery("#PACS-RESULTS").show('blind', 100);
      // data simple visualization
      _PACS_.ajaxAdvancedResults(data);
      _PACS_.ajaxStatus++;
      jQuery("#SEARCH").html(
          '<i class="icon-refresh rotating_class"></i> <span> '
              + parseInt(100 * _PACS_.ajaxStatus / nb_queries) + '%</span>');
      if (nb_queries == _PACS_.ajaxStatus) {
        jQuery("#SEARCH").removeClass('btn-warning').addClass('btn-primary');
        jQuery("#SEARCH").html('Search');
        _PACS_.ajaxStatus = 0;
      }
    },
    error : function(xhr, textStatus, error) {
      _PACS_.ajaxStatus++;
      jQuery("#SEARCH").html(
          '<i class="icon-refresh rotating_class"></i> <span> '
              + parseInt(100 * _PACS_.ajaxStatus / nb_queries) + '%</span>');
      if (nb_queries == _PACS_.ajaxStatus) {
        jQuery("#SEARCH").removeClass('btn-warning').addClass('btn-primary');
        jQuery("#SEARCH").html('Search');
        _PACS_.ajaxStatus = 0;
      }
    }
  });
}
/**
 * Create 'Advanced' table dataTables enabled.
 */
_PACS_.advancedTable = function() {
  var content = '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="S-RESULTS">';
  var i = 0;
  content += '<thead><tr><th>Name</th><th>MRN</th><th>DOB</th><th>Study Date</th><th>Mod.</th><th>Study Desc.</th><th>Series Desc.</th><th>Location</th><th>files</th><th></th></tr></thead><tbody>';
  content += '</tbody></table>';
  // update html with table
  jQuery('#SC-RESULTS').html(content);
  // make table sortable, filterable, ...
  _PACS_.table = jQuery('#S-RESULTS')
      .dataTable(
          {
            "sDom" : "<'row-fluid'<'span6' il ><'span6'f>r>t<'row-fluid'<'span6'><'span6'p>>",
            "sPaginationType" : "bootstrap",
            "oLanguage" : {
              "sLengthMenu" : " (_MENU_ per page)",
              "sInfo" : "Showing _START_ to _END_ of _TOTAL_ results "
            },
            "aLengthMenu" : [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ],
            iDisplayStart : 0,
            iDisplayLength : 10,
            "aoColumnDefs" : [ {
              "bSortable" : false,
              "aTargets" : [ 9 ]
            } ],
            "aaSorting" : [ [ 1, 'desc' ] ],
            "bAutoWidth" : false
          });
}
_PACS_.jsonConcat = function(json1, json2) {
  for ( var key in json2) {
    if (typeof json1[key] === "undefined") {
      json1[key] = json2[key];
    } else {
      json1[key] = json1[key].concat(json2[key]);
    }
  }
  return json1;
}
/**
 * Handle 'Advanced' AJAX query results.
 */
_PACS_.ajaxAdvancedResults = function(data, force) {
  // default value for 'force' is false
  if (typeof force == 'undefined') {
    force = false;
  }
  // cache the result data
  if (force == false) {
    if (typeof data != 'undefined' && data[0] != null) {
      _PACS_.cachedRaw[0] = _PACS_.jsonConcat(_PACS_.cachedRaw[0], data[0]);
    }
    if (typeof data != 'undefined' && data[1] != null) {
      _PACS_.cachedRaw[1] = _PACS_.jsonConcat(_PACS_.cachedRaw[1], data[1]);
    }
  }
  // note: Object.keys might not be supported by all browsers
  if (data[0] != null && Object.keys(data[0]).length > 0 && data[1] != null
      && Object.keys(data[1]).length > 0) {
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
    if (_PACS_.table == null) {
      jQuery('#SC-RESULTS').html("No data found...");
    }
  }
}
/**
 * Cache data after 'Advanced' AJAX query.
 */
_PACS_.advancedCaching = function(data, i) {
  var stuid = data[1].StudyInstanceUID[i];
  var study = null;
  var cached = stuid in _PACS_.cachedSeries;
  // if study not loaded, create container for this study
  if (!cached) {
    _PACS_.cachedSeries[stuid] = Array();
    study = _PACS_.cachedSeries[stuid];
    study.StudyInstanceUID = Array();
    study.SeriesInstanceUID = Array();
    study.SeriesDescription = Array();
    study.PerformedStationAETitle = Array();
    study.NumberOfSeriesRelatedInstances = Array();
    study.QueryRetrieveLevel = Array();
    study.RetrieveAETitle = Array();
    study.Status = Array();
  } else {
    study = _PACS_.cachedSeries[stuid];
  }
  // fill study container
  var index = data[0].StudyInstanceUID.indexOf(data[1].StudyInstanceUID[i]);
  var exists = jQuery.inArray(data[1].SeriesInstanceUID[i],
      study.SeriesInstanceUID);
  if (exists == -1) {
    study.StudyInstanceUID.push(data[1].StudyInstanceUID[i]);
    study.SeriesInstanceUID.push(data[1].SeriesInstanceUID[i]);
    study.SeriesDescription.push((data[1].SeriesDescription[i] == null) ? "nvp"
        : data[1].SeriesDescription[i]);
    study.PerformedStationAETitle
        .push((data[0].PerformedStationAETitle[index] == null) ? "nvp"
            : data[0].PerformedStationAETitle[index]);
    study.NumberOfSeriesRelatedInstances
        .push(data[1].NumberOfSeriesRelatedInstances[i]);
    study.QueryRetrieveLevel.push(data[1].QueryRetrieveLevel[i]);
    study.RetrieveAETitle.push(data[1].RetrieveAETitle[i]);
    study.Status.push(false);
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
  sub.push(data[0].PatientName[index].replace(/\^/g, " ").replace(/\_/g, " "));
  sub.push(data[0].PatientID[index]);
  sub.push(data[0].PatientBirthDate[index]);
  sub.push(data[0].StudyDate[index]);
  sub.push(data[0].ModalitiesInStudy[index]);
  sub.push(data[0].StudyDescription[index].replace(/\>/g, "&gt").replace(/\</g,
      "&lt").replace(/\_/g, " "));
  sub.push(((data[1].SeriesDescription[i] == null) ? "nvp"
      : data[1].SeriesDescription[i]).replace(/\>/g, "&gt").replace(/\</g,
      "&lt").replace(/\_/g, " "));
  sub.push(((data[0].PerformedStationAETitle[index] == null) ? "nvp"
      : data[0].PerformedStationAETitle[index]).replace(/\>/g, "&gt").replace(
      /\</g, "&lt"));
  sub.push(data[1].NumberOfSeriesRelatedInstances[i]);
  // update download icon based on its status
  var status = 0;
  var cached_study = stuid in _PACS_.cachedSeries;
  if (cached_study) {
    var series_index = _PACS_.cachedSeries[stuid].SeriesInstanceUID
        .indexOf(serid);
    if (series_index >= 0) {
      status = _PACS_.cachedSeries[stuid].Status[series_index];
    }
  }
  if (!status) {
    sub
        .push('<label id="'
            + id
            + '-ad" class="d_series checkbox pull-right"><input type="checkbox"></label>');
  } else {
    sub
        .push('<label id="'
            + id
            + '-ad" class="d_series checkbox pull-right"><input type="checkbox" checked></label>');
  }
  return sub;
}
_PACS_.studyView = function() {
  jQuery("#STUDY_VIEW").live('click', function(event) {
    // new representation of cached data
    _PACS_.ajaxSimpleResults(_PACS_.cachedRaw, true);
  });
}
_PACS_.seriesView = function() {
  jQuery("#SERIES_VIEW").live('click', function(event) {
    // new representation of cached data
    _PACS_.ajaxAdvancedResults(_PACS_.cachedRaw, true);
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
        _PACS_.table.fnClose(nTr);
        _PACS_.openStudies.splice(i, 1);
      });
    }
  });
}
/**
 * Setup the download button to download all series for a given study.
 */
_PACS_.setupDownloadStudy = function() {
  jQuery(".d_study")
      .live(
          'click',
          function() { // replace the '_'
            var stuid = jQuery(this).attr('id').replace(/\_/g, ".");
            // remove the '-std' tad at the end of the id
            stuid = stuid.substring(0, stuid.length - 4);
            // update study status
            if (typeof _PACS_.studyStatus[stuid] === "undefined") {
              _PACS_.studyStatus[stuid] = true;
            } else {
              _PACS_.studyStatus[stuid] = !_PACS_.studyStatus[stuid];
            }
            for ( var key in _PACS_.cachedSeries[stuid]["SeriesInstanceUID"]) {
              var full = '#'
                  + stuid.replace(/\./g, "_")
                  + "-"
                  + _PACS_.cachedSeries[stuid]["SeriesInstanceUID"][key]
                      .replace(/\./g, "_") + "-sed > :checkbox";
              if (_PACS_.studyStatus[stuid] != _PACS_.cachedSeries[stuid]["Status"][key]) {
                _PACS_.cachedSeries[stuid]["Status"][key] = !_PACS_.cachedSeries[stuid]["Status"][key];
                if (jQuery(full).length != 0) {
                  jQuery(full).prop('checked',
                      _PACS_.cachedSeries[stuid]["Status"][key]);
                }
              }
            }
          });
}
/**
 * Setup the download series button.
 */
_PACS_.setupDownloadSeries = function() {
  jQuery(".d_series")
      .live(
          'click',
          function(event) {
            var id = jQuery(this).attr('id');
            var split_id = id.split('-');
            var stuid = split_id[0].replace(/\_/g, ".");
            var seuid = split_id[1].replace(/\_/g, ".");
            var index = _PACS_.cachedSeries[stuid].SeriesInstanceUID
                .indexOf(seuid);
            _PACS_.cachedSeries[stuid].Status[index] = !_PACS_.cachedSeries[stuid].Status[index];
            // todo uncheck study if all series within one study unckecked
            // check if related study should be unchecked
            var full_1 = true;
            for ( var key in _PACS_.cachedSeries[stuid]["Status"]) {
              if (!_PACS_.cachedSeries[stuid]["Status"][key]) {
                full_1 = false;
              }
            }
            var fullname = "#" + split_id[0] + "-std > :checkbox";
            // uncheck study if necessary
            if (typeof _PACS_.studyStatus[stuid] === "undefined") {
              _PACS_.studyStatus[stuid] = full_1;
            }
            if (full_1) {
              if (!_PACS_.studyStatus[stuid]) {
                if (jQuery(fullname).length != 0) {
                  $(fullname).prop('checked', true);
                }
                _PACS_.studyStatus[stuid] = !_PACS_.studyStatus[stuid];
              }
            } else {
              if (_PACS_.studyStatus[stuid]) {
                if (jQuery(fullname).length != 0) {
                  $(fullname).prop('checked', false);
                }
                _PACS_.studyStatus[stuid] = !_PACS_.studyStatus[stuid];
              }
            }
          });
}
/**
 * Handle 'Simple' AJAX query results.
 */
_PACS_.ajaxSimpleResults = function(data, force) {
  // default force value is false
  if (typeof (force) === 'undefined')
    force = false;
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
    if (_PACS_.table == null) {
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
  _PACS_.table = jQuery('#S-RESULTS')
      .dataTable(
          {
            "sDom" : "<'row-fluid'<'span6' il><'span6' f>r>t<'row-fluid'<'span6'><'span6'p>>",
            "sPaginationType" : "bootstrap",
            "oLanguage" : {
              "sLengthMenu" : " (_MENU_ per page)",
              "sInfo" : "Showing _START_ to _END_ of _TOTAL_ results "
            },
            "aLengthMenu" : [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ],
            iDisplayStart : 0,
            iDisplayLength : 10,
            "aoColumnDefs" : [ {
              "bSortable" : false,
              "aTargets" : [ 7 ]
            } ],
            "bAutoWidth" : false,
            "aaSorting" : [ [ 1, 'desc' ] ],
          });
}
/**
 * Reformat data after 'Advanced' AJAX query to fit the dataTable standard.
 */
_PACS_.simpleFormat = function(data, i) {
  var stuid = data.StudyInstanceUID[i];
  var sub = Array();
  sub.push('<div id="' + stuid.replace(/\./g, "_")
      + '" class="control"><i class="icon-chevron-down"></i> '
      + data.PatientName[i].replace(/\^/g, " ").replace(/\_/g, " ") + '</div>');
  sub.push(data.PatientID[i]);
  sub.push(data.PatientBirthDate[i]);
  sub.push(data.StudyDescription[i].replace(/\>/g, "&gt").replace(/\</g, "&lt")
      .replace(/\_/g, " "));
  sub.push(data.StudyDate[i]);
  sub.push(data.ModalitiesInStudy[i]);
  sub.push(data.PerformedStationAETitle[i].replace(/\>/g, "&gt").replace(/\</g,
      "&lt").replace(/\_/g, " "));
  // if study cached, check status of series to update icon
  var cached = stuid in _PACS_.studyStatus;
  var status = 0;
  if (cached) {
    status = _PACS_.studyStatus[stuid];
  } else {
    _PACS_.studyStatus[stuid] = false;
  }
  if (!status) {
    sub
        .push('<label id="'
            + stuid.replace(/\./g, "_")
            + '-std" class="d_study checkbox pull-right"><input type="checkbox"></label>');
  } else {
    sub
        .push('<label id="'
            + stuid.replace(/\./g, "_")
            + '-std" class="d_study checkbox pull-right"><input type="checkbox" checked></label>');
  }
  return sub;
}
/**
 * Get 'Series' data AJAX.
 */
_PACS_.ajaxSeries = function(studyUID, nTr) {
  var stuid = studyUID;
  if (nTr != null) {
    jQuery('.control i', nTr).removeClass('icon-chevron-down').addClass(
        'icon-chevron-up');
  }
  _PACS_.ajaxSeriesResults(_PACS_.cachedSeries[stuid], nTr);
}
/**
 * Handle 'Series' AJAX query results.
 */
_PACS_.ajaxSeriesResults = function(data, nTr) {
  // format the details row table
  var format = _PACS_.seriesFormat(data);
  var detailRown = _PACS_.table.fnOpen(nTr, format, 'details');
  // create dataTable from html table
  jQuery('.table', detailRown).dataTable({
    "sDom" : "t",
    "aaSorting" : [ [ 1, 'desc' ] ],
    "bPaginate" : false,
    "aoColumnDefs" : [ {
      "bSortable" : false,
      "aTargets" : [ 2 ]
    } ],
    "bAutoWidth" : false
  });
  jQuery('div.innerDetails', detailRown).slideDown();
  _PACS_.openStudies.push(nTr);
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
  var content = '<div class="innerDetails"><table class="table table-bordered" cellmarging="0" cellpadding="0" cellspacing="0" border="0"><thead><tr><th>Series Desc.</th><th class="span2"># files</th><th class="span1"></th></tr></thead><tbody>';
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
    // sed: SEries Download
    // status == 0: data is not checked
    if (!data.Status[i]) {
      content += '<td class="center"><label id="'
          + id
          + '-sed" class="d_series checkbox pull-right"><input type="checkbox"></label></td>';
      // status == 1: data is checked!
    } else {
      content += '<td class="center"><label id="'
          + id
          + '-sed" class="d_series checkbox pull-right"><input type="checkbox" checked></label></td>';
    }
    content += '</tr>';
  }
  content += '</body></table></div>';
  return content;
}
_PACS_.connectPull = function() {
  jQuery("#PULL").live('click', function(event) {
    _PACS_.ajaxPull();
  });
}
_PACS_.ajaxPull = function() {
  // get list to pull fron cache!
  var list = "";
  for ( var study_key in _PACS_.cachedSeries) {
    for ( var key in _PACS_.cachedSeries[study_key]["Status"]) {
      if (_PACS_.cachedSeries[study_key]["Status"][key]) {
        list += _PACS_.cachedSeries[study_key]["StudyInstanceUID"][key] + ","
            + _PACS_.cachedSeries[study_key]["SeriesInstanceUID"][key] + " ";
      }
    }
  }
  window.console.log(list);
  // plugin
  var plugin = "pacs_pull";
  // status
  var status = 0;
  // output
  var output = [];
  var output_container = [];
  output_container.push({
    name : 'output',
    value : '',
    type : 'simple',
    target_type : 'feed'
  });
  output.push(output_container);
  // params
  var param = [];
  var param_container = [];
  // create user AETITLE
  param_container.push({
    name : 'aet',
    value : '\\\"' + jQuery("#USER_AET").attr('value') + '\\\"',
    type : 'string',
    target_type : 'feed'
  });
  // create SERVER IP
  param_container.push({
    name : 'serverip',
    value : '\\\"' + jQuery("#SERVER_IP").attr('value') + '\\\"',
    type : 'string',
    target_type : 'feed'
  });
  // create SERVER PORT
  param_container.push({
    name : 'serverport',
    value : '\\\"' + jQuery("#SERVER_POR").attr('value') + '\\\"',
    type : 'string',
    target_type : 'feed'
  });
  // create LIST
  param_container.push({
    name : 'listseries',
    value : '\\\"' + list + '\\\"',
    type : 'string',
    target_type : 'feed'
  });
  // create SERVER PORT
  param_container.push({
    name : 'feedid',
    value : '\\\"{FEED_ID}\\\"',
    type : 'string',
    target_type : 'feed'
  });
  // create SERVER PORT
  param_container.push({
    name : 'userid',
    value : '\\\"{USER_ID}\\\"',
    type : 'string',
    target_type : 'feed'
  });
  param.push(param_container);
  var _feed_name = (new Date()).toISOString();
  window.console.log(param);
  // send to the launcher
  jQuery.ajax({
    type : "POST",
    url : "../../controller/launcher-web.php",
    dataType : "text",
    data : {
      FEED_PLUGIN : plugin,
      FEED_NAME : _feed_name,
      FEED_PARAM : param,
      FEED_STATUS : status,
      FEED_OUTPUT : output
    },
    success : function(data) {
      window.console.log('Youhou');
    }
  });
}
/**
 * Setup the javascript when document is ready (finshed loading)
 */
$(document).ready(function() {
  //
  // Global variables
  //
  // is study checked?
  _PACS_.studyStatus = {};
  // keep track of the job status
  // how many ajax queries have succeed
  _PACS_.ajaxStatus = 0;
  // order received series
  // keep track of status
  // used in the details view
  _PACS_.cachedSeries = {};
  // cache all incoming raw data
  // used in advanced and simple view
  _PACS_.cachedRaw = null;
  // table containing raw data
  _PACS_.table = null;
  // keep track of opened studies in simple view
  _PACS_.openStudies = [];
  // connect button
  // show/hide the advanced parameters on click
  _PACS_.connectShowAdvancedParameters();
  // connect button for
  // query server through ajax for given set of parameters
  _PACS_.connectAjaxSearch();
  _PACS_.studyView();
  _PACS_.seriesView();
  _PACS_.setupDetailStudy();
  _PACS_.setupDownloadStudy();
  _PACS_.setupDownloadSeries();
  _PACS_.connectPull();
});
