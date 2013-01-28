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
    _PACS_.ajaxAdvanced();
  });
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
      PACS_LEV : 'ALL',
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
      window.console.log(mrn);
      window.console.log(date);
      window.console.log(_PACS_.status);
      _PACS_.status++;
      jQuery("#SEARCH").html(
          '<i class="icon-refresh rotating_class"></i> <span> '
              + parseInt(100 * _PACS_.status / nb_queries) + '%</span>');
      if (nb_queries == _PACS_.status) {
        jQuery("#SEARCH").removeClass('btn-warning').addClass('btn-primary');
        jQuery("#SEARCH").html('Search');
        _PACS_.status = 0;
      }
    },
    error : function(xhr, textStatus, error) {
      window.console.log(xhr);
      window.console.log(textStatus);
      window.console.log(error);
      _PACS_.status++;
      jQuery("#SEARCH").html(
          '<i class="icon-refresh rotating_class"></i> <span> '
              + parseInt(100 * _PACS_.status / nb_queries) + '%</span>');
      if (nb_queries == _PACS_.status) {
        jQuery("#SEARCH").removeClass('btn-warning').addClass('btn-primary');
        jQuery("#SEARCH").html('Search');
        _PACS_.status = 0;
      }
    }
  });
}
/**
 * Setup the 'Advanced' search button.
 */
_PACS_.ajaxAdvanced = function() {
  // destroy the results table if it exists
  if (jQuery('#S-RESULTS').length != 0) {
    _PACS_.sTable.dataTable().fnDestroy();
    _PACS_.sTable = null;
    jQuery('#S-RESULTS').remove();
  }
  // clean delete cache
  _PACS_.cache = [];
  _PACS_.cachedData = [ {}, {} ];
  // split MRNs on white space
  mrns = jQuery("#PACS_MRN").attr('value').split(/\s+/g);
  nb_mrns = mrns.length;
  if (nb_mrns >= 2 && mrns[nb_mrns - 1] == "") {
    nb_mrns--;
  }
  // split dates
  dates = jQuery("#PACS_DAT").attr('value').split(/\-/g);
  nb_dates = dates.length;
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
  // window.console.log(dates);
  // window.console.log(nb_dates);
  nb_queries = nb_mrns * nb_dates;
  // keep reference to current object for the ajax response
  // modify class
  jQuery("#SEARCH").removeClass('btn-primary').addClass('btn-warning');
  // modify content
  jQuery("#SEARCH").html(
      '<i class="icon-refresh rotating_class"></i> <span> '
          + parseInt(100 * _PACS_.status / nb_queries) + '%</span>');
  window.console.log(dates);
  window.console.log(nb_queries);
  var i = 0;
  if (nb_mrns >= 2) {
    // loop through mrns
    for (i = 0; i < nb_mrns; i++) {
      if (nb_dates >= 2) {
        // loop through dates
        var j = 0;
        for (j = 0; j < nb_dates; j++) {
          window.console.log("i:" + i + " j:" + j);
          window.console.log("mrns[i]:" + mrns[i] + " dates[j]:" + dates[j]);
          _PACS_.queryDayAll(mrns[i], dates[j], nb_queries);
        }
      } else {
        // no dates loop
        window.console.log("i:" + i + " j:0");
        window.console.log("mrns[i]:" + mrns[i] + " dates[0]:" + dates[0]);
        _PACS_.queryDayAll(mrns[i], dates[0], nb_queries);
      }
    }
  } else {
    // no mrn loop
    if (nb_dates >= 2) {
      // loop through dates
      var j = 0;
      for (j = 0; j < nb_dates; j++) {
        window.console.log("i:0 j:" + j);
        window.console.log("mrns[0]:" + mrns[0] + " dates[j]:" + dates[j]);
        _PACS_.queryDayAll(mrns[0], dates[j], nb_queries);
      }
    } else {
      window.console.log("i:0 j:0");
      window.console.log("mrns[0]:" + mrns[0] + " dates[0]:" + dates[0]);
      _PACS_.queryDayAll(mrns[0], dates[0], nb_queries);
    }
  }
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
  _PACS_.sTable = jQuery('#S-RESULTS')
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
    window.console.log(data[0]);
    window.console.log(data[1]);
    _PACS_.cachedData[0] = _PACS_.jsonConcat(_PACS_.cachedData[0], data[0]);
    _PACS_.cachedData[1] = _PACS_.jsonConcat(_PACS_.cachedData[1], data[1]);
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
  var cached_study = stuid in _PACS_.cache;
  if (cached_study) {
    var series_index = _PACS_.cache[stuid].SeriesInstanceUID.indexOf(serid);
    if (series_index >= 0) {
      status = _PACS_.cache[stuid].Status[series_index];
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
    _PACS_.ajaxSimpleResults(_PACS_.cachedData, true);
  });
}
_PACS_.seriesView = function() {
  jQuery("#SERIES_VIEW").live('click', function(event) {
    // new representation of cached data
    _PACS_.ajaxAdvancedResults(_PACS_.cachedData, true);
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
            if (typeof _PACS_.cacheStatus[stuid] === "undefined") {
              _PACS_.cacheStatus[stuid] = true;
            } else {
              _PACS_.cacheStatus[stuid] = !_PACS_.cacheStatus[stuid];
            }
            for ( var key in _PACS_.cache[stuid]["SeriesInstanceUID"]) {
              var full = '#'
                  + stuid.replace(/\./g, "_")
                  + "-"
                  + _PACS_.cache[stuid]["SeriesInstanceUID"][key].replace(
                      /\./g, "_") + "-sed > :checkbox";
              if (_PACS_.cacheStatus[stuid] != _PACS_.cache[stuid]["Status"][key]) {
                _PACS_.cache[stuid]["Status"][key] = !_PACS_.cache[stuid]["Status"][key];
                if (jQuery(full).length != 0) {
                  jQuery(full).prop('checked',
                      _PACS_.cache[stuid]["Status"][key]);
                }
              }
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
    var index = _PACS_.cache[stuid].SeriesInstanceUID.indexOf(seuid);
    _PACS_.cache[stuid].Status[index] = !_PACS_.cache[stuid].Status[index];
    // todo uncheck study if all series within one study unckecked
    // check if related study should be unchecked
    var full_1 = true;
    for ( var key in _PACS_.cache[stuid]["Status"]) {
      if (!_PACS_.cache[stuid]["Status"][key]) {
        full_1 = false;
      }
    }
    var fullname = "#" + split_id[0] + "-std > :checkbox";
    // uncheck study if necessary
    if (typeof _PACS_.cacheStatus[stuid] === "undefined") {
      _PACS_.cacheStatus[stuid] = full_1;
    }
    if (full_1) {
      if (!_PACS_.cacheStatus[stuid]) {
        if (jQuery(fullname).length != 0) {
          $(fullname).prop('checked', true);
        }
        _PACS_.cacheStatus[stuid] = !_PACS_.cacheStatus[stuid];
      }
    } else {
      if (_PACS_.cacheStatus[stuid]) {
        if (jQuery(fullname).length != 0) {
          $(fullname).prop('checked', false);
        }
        _PACS_.cacheStatus[stuid] = !_PACS_.cacheStatus[stuid];
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
  var cached = stuid in _PACS_.cacheStatus;
  var status = 0;
  if (cached) {
    status = _PACS_.cacheStatus[stuid];
  } else {
    _PACS_.cacheStatus[stuid] = 0;
    _PACS_.cacheCount[stuid] = 0;
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
  var j = stuid in _PACS_.cache;
  // if not cached
  if (!j) {
    window.console.log('not cached, we have a problem!');
  }
  // if cached
  else {
    if (nTr != null) {
      jQuery('.control i', nTr).removeClass('icon-chevron-down').addClass(
          'icon-chevron-up');
    }
    window.console.log('ajaxSeriesResults');
    _PACS_.ajaxSeriesResults(_PACS_.cache[stuid], nTr);
  }
}
/**
 * Handle 'Series' AJAX query results.
 */
_PACS_.ajaxSeriesResults = function(data, nTr) {
  // format the details row table
  if (nTr != null) {
    window.console.log('before format');
    var format = _PACS_.seriesFormat(data);
    window.console.log(format);
    var detailRown = _PACS_.sTable.fnOpen(nTr, format, 'details');
    window.console.log('after format');
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
  } else {
    // download images!
    // loop through all series and download the one which are not
    // downloaded
    // and not downloading
    window.console.log('Download images, we have a problem!!');
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
/**
 * Setup the download button to only download the series which are remaing after
 * filtering in the advanced mode.
 */
//_PACS_.setupDownloadSeriesFiltered = function() {
//  jQuery(".dseries_filter").live('click', function() {
//    // get filtered data
//    var filter = _PACS_.sTable._('tr', {
//      "filter" : "applied"
//    });
//    var nb_filter = filter.length;
//    var i = 0;
//    // get all download button ID and simulate click on it
//    for (i = 0; i < nb_filter; i++) {
//      var id = filter[i][9].split(' ')[1].split('"')[1];
//      jQuery('#' + id).click();
//    }
//  });
//}
//_PACS_.setupDownloadStudiesFiltered = function() {
//  jQuery(".dstudies_filter").live('click', function() {
//    // get filtered data
//    var filter = _PACS_.sTable._('tr', {
//      "filter" : "applied"
//    });
//    var nb_filter = filter.length;
//    var i = 0;
//    // get all download button ID and simulate click on it
//    for (i = 0; i < nb_filter; i++) {
//      var id = filter[i][7].split(' ')[1].split('"')[1];
//      jQuery('#' + id).click();
//    }
//  });
//}
/**
 * Setup the javascript when document is ready (finshed loading)
 */
$(document).ready(function() {
  window.console.log('READY!');
  // global variable
  //
  // caching variables
  //
  _PACS_.cacheStatus = {};
  _PACS_.cacheCount = {};
  _PACS_.cache = {};
  _PACS_.cachedData = null;
  _PACS_.status = 0;
  //
  // Advanced table
  //
  _PACS_.sTable = null;
  // show/hide advanced parameters
  _PACS_.pacsAdvanced();
  // connect search button to search method
  _PACS_.ajaxSearch();
  //
  // _PACS_.ajaxSearch();
  /*
   * _PACS_.studySearch(); _PACS_.seriesSearch();
   */
  _PACS_.studyView();
  _PACS_.seriesView();
  //
  // simple mode
  //
  _PACS_.openStudies = [];
  _PACS_.setupDetailStudy();
  //
  // advanced mode
  //
  //_PACS_.setupDownloadStudiesFiltered();
  //_PACS_.setupDownloadSeriesFiltered();
  //
  // both modes
  //
  // search button pushed
  _PACS_.setupDownloadStudy();
  _PACS_.setupDownloadSeries();
});
