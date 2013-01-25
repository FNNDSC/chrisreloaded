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
      PACS_STU_DES : '',
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
      jQuery("#SEARCH").html('<i class="icon-refresh rotating_class"></i> <span> ' + parseInt(100*_PACS_.status/nb_queries) + '%</span>');
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
      jQuery("#SEARCH").html('<i class="icon-refresh rotating_class"></i> <span> ' + parseInt(100*_PACS_.status/nb_queries) + '%</span>');
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
  // split MRNs on white space
  mrns = jQuery("#PACS_MRN").attr('value').split(/\s+/g);
  nb_mrns = mrns.length;
  if (nb_mrns >= 2 && mrns[1] == "") {
    nb_mrns = 1;
  }
  // window.console.log(mrns);
  // window.console.log(nb_mrns);
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
  jQuery("#SEARCH").html('<i class="icon-refresh rotating_class"></i> <span> ' + parseInt(100*_PACS_.status/nb_queries) + '%</span>');
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
  content += '<thead><tr><th>Name</th><th>MRN</th><th>DOB</th><th>Study Date</th><th>Mod.</th><th>Study Desc.</th><th>Series Desc.</th><th>Location</th><th>files</th><th><label class="checkbox pull-right"> <input type="checkbox"></label></th></tr></thead><tbody>';
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
/**
 * Handle 'Advanced' AJAX query results.
 */
_PACS_.ajaxAdvancedResults = function(data, force) {
  // default value for 'force' is false
  if (typeof force == 'undefined') {
    force = false;
  }
  // cache the result data
  _PACS_.cachedData = data;
  if (data[1] == null) {
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
  sub
      .push('<label id="'
          + id
          + '-ad" class="d_series checkbox pull-right"><input type="checkbox"></label>');
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
 * Setup the download button to only download the series which are remaing after
 * filtering in the advanced mode.
 */
/*
 * _PACS_.setupDownloadSeriesFiltered = function() {
 * jQuery(".d_filter").live('click', function() { // get filtered data var
 * filter = _PACS_.sTable._('tr', { "filter" : "applied" }); var nb_filter =
 * filter.length; var i = 0; // get all download button ID and simulate click on
 * it for (i = 0; i < nb_filter; i++) { var id = filter[i][8].split('
 * ')[1].split('"')[1]; jQuery('#' + id).click(); } }); }
 */
/**
 * Setup the download button to download all series for a given study.
 */
/*
 * _PACS_.setupDownloadStudy = function() { jQuery(".d_study").live( 'click',
 * function() { // replace the '_' var stuid =
 * jQuery(this).attr('id').replace(/\_/g, "."); // remove the '-std' tad at the
 * end of the id stuid = stuid.substring(0, stuid.length - 4); // modify class
 * jQuery(this).removeClass('btn-primary').removeClass('d_study')
 * .addClass('btn-warning'); // modify content jQuery(this).html('<i
 * class="icon-refresh rotating_class">'); // update study status
 * _PACS_.cacheStatus[stuid] = 1; // download all related series
 * _PACS_.ajaxSeries(stuid); }); }
 */
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
/*
 * _PACS_.setupDownloadSeries = function() { jQuery(".d_series").live('click',
 * function(event) { window.console("d_series clicked - do nothing"); // var id =
 * jQuery(this).attr('id'); // var split_id = id.split('-'); // var stuid =
 * split_id[0].replace(/\_/g, "."); // var seuid = split_id[1].replace(/\_/g,
 * "."); // _PACS_.ajaxImage(stuid, seuid, '#' + id); }); } _PACS_.queryDayAll =
 * function(day, today) { window.console.log(day); year =
 * day.getFullYear().toString(); month = ("0" +
 * day.getMonth().toString()).slice(-2); date = ("0" +
 * day.getDate().toString()).slice(-2); window.console.log(today); jQuery.ajax({
 * type : "POST", url : "pacs_query.php", dataType : "json", data : { USER_AET :
 * jQuery("#USER_AET").attr('value'), SERVER_IP :
 * jQuery("#SERVER_IP").attr('value'), SERVER_POR :
 * jQuery("#SERVER_POR").attr('value'), PACS_LEV : 'ALL', PACS_MRN :
 * jQuery("#PACS_MRN").attr('value'), PACS_NAM :
 * jQuery("#PACS_NAM").attr('value'), PACS_MOD :
 * jQuery("#PACS_MOD").attr('value'), PACS_DAT : year + month + date,
 * PACS_ACC_NUM : '', PACS_STU_DES : '', PACS_STU_UID : '', PACS_PSAET :
 * jQuery("#PACS_PSAET").attr('value') }, success : function(data) {
 * jQuery("#PACS-RESULTS").show('blind', 100); // data simple visualization
 * _PACS_.ajaxAdvancedResults(data); day.setDate(day.getDate() + 1); if (day <
 * today) { window.console.log('recursive call'); _PACS_.queryDayAll(day,
 * today); } else { window.console.log('done'); } } }); }
 *//*
     * _PACS_.queryDay = function(day, today) { window.console.log(day); year =
     * day.getFullYear().toString(); month = ("0" +
     * day.getMonth().toString()).slice(-2); date = ("0" +
     * day.getDate().toString()).slice(-2); window.console.log(today);
     * jQuery.ajax({ type : "POST", url : "pacs_query.php", dataType : "json",
     * data : { USER_AET : jQuery("#USER_AET").attr('value'), SERVER_IP :
     * jQuery("#SERVER_IP").attr('value'), SERVER_POR :
     * jQuery("#SERVER_POR").attr('value'), PACS_LEV : 'STUDY', PACS_MRN :
     * jQuery("#PACS_MRN").attr('value'), PACS_NAM :
     * jQuery("#PACS_NAM").attr('value'), PACS_MOD :
     * jQuery("#PACS_MOD").attr('value'), PACS_DAT : year + month + date,
     * PACS_ACC_NUM : '', PACS_STU_DES : '', PACS_STU_UID : '', PACS_PSAET :
     * jQuery("#PACS_PSAET").attr('value') }, success : function(data) {
     * jQuery("#PACS-RESULTS").show('blind', 100); // reformat data in 2 arrays
     * data = _PACS_.reformatSimpleResults(data); _PACS_.cachedData = data; //
     * data simple visualization _PACS_.ajaxSimpleResults(data);
     * day.setDate(day.getDate() + 1); if (day < today) {
     * window.console.log('recursive call'); _PACS_.queryDay(day, today); } else {
     * window.console.log('done'); } } }); }
     */
/**
 * Setup the 'Simple' search button.
 */
/*
 * _PACS_.ajaxSimple = function() { var me = jQuery("#SEARCH");
 * me.removeClass('btn-primary').addClass('btn-warning'); // modify content
 * me.html('<i class="icon-refresh rotating_class">'); if
 * (jQuery('#S-RESULTS').length != 0) { // destroy the table
 * _PACS_.sTable.dataTable().fnDestroy(); _PACS_.sTable = null;
 * jQuery('#S-RESULTS').remove(); } // // get date // var dateString =
 * jQuery("#PACS_DAT").attr('value'); var year = dateString.substring(0, 4); var
 * month = dateString.substring(4, 6); var day = dateString.substring(6, 8); var
 * date = new Date(year, month, day); var today = new Date(); // if (date <
 * today) { _PACS_.queryDay(date, date); // }
 * me.removeClass('btn-warning').addClass('btn-primary'); me.html('Search'); //
 * if string finis // var mrn_split = jQuery("#PACS_MRN").attr('value').split('
 * '); // var mrn_nb = mrn_split.length; // var mrn_received = 0; // var i = 0; //
 * for (i = 0; i < mrn_nb; i++) { // query pacs on parameters, at STUDY LEVEL /*
 * jQuery.ajax({ type : "POST", url : "pacs_query.php", dataType : "json", data : {
 * USER_AET : jQuery("#USER_AET").attr('value'), SERVER_IP :
 * jQuery("#SERVER_IP").attr('value'), SERVER_POR :
 * jQuery("#SERVER_POR").attr('value'), PACS_LEV : 'STUDY', PACS_MRN :
 * mrn_split[i], PACS_NAM : jQuery("#PACS_NAM").attr('value'), PACS_MOD :
 * jQuery("#PACS_MOD").attr('value'), PACS_DAT :
 * jQuery("#PACS_DAT").attr('value'), PACS_ACC_NUM : '', PACS_STU_DES : '',
 * PACS_STU_UID : '', PACS_PSAET : jQuery("#PACS_PSAET").attr('value') },
 * success : function(data) { jQuery("#PACS-RESULTS").show('blind', 100);
 * mrn_received++; if (mrn_received == mrn_nb) {
 * me.removeClass('btn-warning').addClass('btn-primary'); me.html('Search'); } //
 * reformat data in 2 arrays data = _PACS_.reformatSimpleResults(data);
 * _PACS_.cachedData = data; // data simple visualization
 * _PACS_.ajaxSimpleResults(data); } });
 */
// }
/*
 * } _PACS_.reformatSimpleResults = function(data) { var reformat = new Array();
 * reformat[0] = data; reformat[1] = null; return reformat; }
 */
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
  content += '<thead><tr><th>Name</th><th>MRN</th><th>DOB</th><th>Study Desc.</th><th>Study Date</th><th>Mod.</th><th>Location</th><th><label class="d_series checkbox pull-right"><input type="checkbox"></label></th></tr></thead><tbody>';
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
  sub
      .push('<label id="'
          + stuid.replace(/\./g, "_")
          + '-std" class="d_study checkbox pull-right"><input type="checkbox"></label>');
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
    if (data.Status[i] == 0) {
      content += '<td class="center"><label id="'
          + id
          + '-sed" class="d_series checkbox pull-right"><input type="checkbox"></label></td>';
      // status == 1: data is checked!
    } else {
      content += '<td class="center"><label id="'
          + id
          + '-sed" class="d_series checkbox pull-right"><input type="checkbox"></label></td>';
    }
    content += '</tr>';
  }
  content += '</body></table></div>';
  return content;
}
/**
 * Get 'Image' data AJAX.
 */
/*
 * _PACS_.ajaxImage = function(studyUID, seriesUID, buttonID) { // if series
 * already or is being downloaded (preview use case) if (jQuery(buttonID).length ==
 * 0 || jQuery(buttonID).hasClass('btn-primary')) { // wait button // modify
 * class jQuery(buttonID).removeClass('btn-primary').removeClass('d_series')
 * .addClass('btn-warning'); // modify content jQuery(buttonID).html('<i
 * class="icon-refresh rotating_class">'); // modify status var seriesData =
 * _PACS_.cache[studyUID]; var index =
 * seriesData.SeriesInstanceUID.indexOf(seriesUID); seriesData.Status[index] =
 * 1; jQuery .ajax({ type : "POST", url : "controller/pacs_move.php", dataType :
 * "json", data : { USER_AET : jQuery('#USER_AET').attr('value'), SERVER_IP :
 * '134.174.12.21', SERVER_POR : '104', PACS_LEV : 'SERIES', PACS_STU_UID :
 * studyUID, PACS_SER_UID : seriesUID, PACS_MRN : '', PACS_NAM : '', PACS_MOD :
 * '', PACS_DAT : '', PACS_STU_DES : '', PACS_ACC_NUM : '' }, success :
 * function(data) { var seriesData = _PACS_.cache[studyUID]; var i =
 * seriesData.SeriesInstanceUID.indexOf(seriesUID); seriesData.Status[i] = 2; //
 * update visu if not closed! // use "this", modify style, refresh
 * jQuery(buttonID).removeClass('btn-warning').addClass('btn-success'); //
 * modify content jQuery(buttonID).html('<i class="icon-ok icon-white">'); var
 * studyButtonID = '#' + studyUID.replace(/\./g, "_") + '-std'; // update count
 * _PACS_.cacheCount[studyUID]++; if (jQuery(studyButtonID).length != 0 &&
 * _PACS_.cacheCount[studyUID] == seriesData.SeriesInstanceUID.length) { // all
 * series downloaded, update button! _PACS_.cacheStatus[studyUID] = 2;
 * jQuery(studyButtonID).removeClass('btn-warning').addClass( 'btn-success'); //
 * modify content jQuery(studyButtonID).html('<i class="icon-ok icon-white">'); } }
 * }); } }
 */
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
  // _PACS_.setupDownloadStudy();
  //
  // advanced mode
  //
  // _PACS_.setupDownloadSeriesFiltered();
  //
  // both modes
  //
  // search button pushed
  // _PACS_.setupDownloadSeries();
});
