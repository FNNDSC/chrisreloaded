// setup namespace
var _CHRIS_INTERACTIVE_PLUGIN_ = _CHRIS_INTERACTIVE_PLUGIN_ || {};
/**
 * Show/hide the advanced parameters div on click
 */
_CHRIS_INTERACTIVE_PLUGIN_.connectShowAdvancedParameters = function() {
  $(document).off('click', "#show_advanced").on(
      'click',
      "#show_advanced",
      function(event) {
        if ($("#pacs_advanced").is(':visible')) {
          $("#pacs_advanced").hide('blind', 100);
          $("#show_advanced").html(
              '<i class="icon-chevron-down"></i><b>Advanced parameters</b>');
        } else {
          $("#pacs_advanced").show('blind', 100);
          $("#show_advanced").html(
              '<i class="icon-chevron-up"></i><b>Advanced parameters</b>');
        }
      });
}
_CHRIS_INTERACTIVE_PLUGIN_.cleanResults = function() {
  if ($('#S-RESULTS').length != 0) {
    _CHRIS_INTERACTIVE_PLUGIN_.table.dataTable().fnDestroy();
    _CHRIS_INTERACTIVE_PLUGIN_.table = null;
    $('#S-RESULTS').remove();
  }
}
_CHRIS_INTERACTIVE_PLUGIN_.getParam = function(parameter) {
  if (typeof _CHRIS_INTERACTIVE_PLUGIN_._param[parameter] != 'undefined') {
    if(_CHRIS_INTERACTIVE_PLUGIN_._param[parameter] == "")
      return '1';

    return _CHRIS_INTERACTIVE_PLUGIN_._param[parameter];
  }
  return "";
};

_CHRIS_INTERACTIVE_PLUGIN_.getInd = function(parameter) {
  if (typeof _CHRIS_INTERACTIVE_PLUGIN_._param[parameter] != 'undefined') {
    return _CHRIS_INTERACTIVE_PLUGIN_._param_ind[parameter];
  }
  return -1;
};
_CHRIS_INTERACTIVE_PLUGIN_.preProcessMRN = function() {
  var mrns = _CHRIS_INTERACTIVE_PLUGIN_.getParam("mrn");
  // split it!
  mrns = mrns.split(/\s+/g);
  var nb_mrns = mrns.length;
  if (nb_mrns >= 2 && mrns[nb_mrns - 1] == "") {
    nb_mrns--;
  }
  return [ mrns, nb_mrns ];
}
_CHRIS_INTERACTIVE_PLUGIN_.preProcessDate = function() {
  var dates = _CHRIS_INTERACTIVE_PLUGIN_.getParam("studydate");
  // split it
  dates = dates.split(/\-/g);
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
_CHRIS_INTERACTIVE_PLUGIN_.queryDayAll = function(mrn, date, nb_queries) {
  $.ajax({
    type : "POST",
    url : "plugins/pacs_pull/core/pacs_query.php",
    dataType : "json",
    data : {
      USER_AET : _CHRIS_INTERACTIVE_PLUGIN_.getParam("aet"),
      USER_AEC : _CHRIS_INTERACTIVE_PLUGIN_.getParam("aec"),
      SERVER_IP : _CHRIS_INTERACTIVE_PLUGIN_.getParam("serverip"),
      SERVER_POR : _CHRIS_INTERACTIVE_PLUGIN_.getParam("serverport"),
      PACS_MRN : mrn,
      PACS_NAM : _CHRIS_INTERACTIVE_PLUGIN_.getParam("name"),
      PACS_SEX : _CHRIS_INTERACTIVE_PLUGIN_.getParam("sex"),
      PACS_MOD : _CHRIS_INTERACTIVE_PLUGIN_.getParam("modality"),
      PACS_DAT : date,
      PACS_ACC_NUM : '',
      PACS_STU_DES : _CHRIS_INTERACTIVE_PLUGIN_.getParam("studydesc"),
      PACS_SER_DES : _CHRIS_INTERACTIVE_PLUGIN_.getParam("seriesdesc"),
      PACS_STU_UID : '',
      PACS_PSAET : _CHRIS_INTERACTIVE_PLUGIN_.getParam("station")
    },
    success : function(data) {
      $("#PACS-RESULTS").show('blind', 100);
      // data simple visualization
      _CHRIS_INTERACTIVE_PLUGIN_.ajaxAdvancedResults(data);
      _CHRIS_INTERACTIVE_PLUGIN_.ajaxStatus++;
      $("#PULL").html(
          '<i class="icon-refresh rotating_class"></i> <span> '
              + parseInt(100 * _CHRIS_INTERACTIVE_PLUGIN_.ajaxStatus
                  / nb_queries) + '%</span>');
      if (nb_queries == _CHRIS_INTERACTIVE_PLUGIN_.ajaxStatus) {
        $("#PULL").removeClass('btn-warning').addClass('btn-primary');
        $("#PULL").html('Pull Selection');
        $('#PULL').removeClass('disabled');
        _CHRIS_INTERACTIVE_PLUGIN_.ajaxStatus = 0;
      }
    },
    error : function(xhr, textStatus, error) {
      _CHRIS_INTERACTIVE_PLUGIN_.ajaxStatus++;
      $("#PULL").html(
          '<i class="icon-refresh rotating_class"></i> <span> '
              + parseInt(100 * _CHRIS_INTERACTIVE_PLUGIN_.ajaxStatus
                  / nb_queries) + '%</span>');
      if (nb_queries == _CHRIS_INTERACTIVE_PLUGIN_.ajaxStatus) {
        $("#PULL").removeClass('btn-warning').addClass('btn-primary');
        $("#PULL").html('Search');
        _CHRIS_INTERACTIVE_PLUGIN_.ajaxStatus = 0;
      }
    }
  });
}
/**
 * Setup the ajaxSearch action
 */
_CHRIS_INTERACTIVE_PLUGIN_.init = function() {
  _CHRIS_INTERACTIVE_PLUGIN_.cleanResults();
  // clean delete cache
  _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries = {};
  _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw = [ {}, {} ];
  // split MRNs on white space
  var pro_mrn = _CHRIS_INTERACTIVE_PLUGIN_.preProcessMRN();
  // sanity check should occur
  var mrns = pro_mrn[0];
  var nb_mrns = pro_mrn[1];
  // create list of date studies
  var pro_date = _CHRIS_INTERACTIVE_PLUGIN_.preProcessDate();
  // sanity check should occur
  var dates = pro_date[0];
  var nb_dates = pro_date[1];
  var nb_queries = nb_mrns * nb_dates;
  // keep reference to current object for the ajax response
  // modify class
  $("#PULL").removeClass('btn-primary').addClass('btn-warning');
  // modify content
  $("#PULL").html(
      '<i class="icon-refresh rotating_class"></i> <span> '
          + parseInt(100 * _CHRIS_INTERACTIVE_PLUGIN_.ajaxStatus / nb_queries)
          + '%</span>');
  var i = 0;
  if (nb_mrns >= 2) {
    // loop through mrns
    for (i = 0; i < nb_mrns; i++) {
      if (nb_dates >= 2) {
        // loop through dates
        var j = 0;
        for (j = 0; j < nb_dates; j++) {
          _CHRIS_INTERACTIVE_PLUGIN_.queryDayAll(mrns[i], dates[j], nb_queries);
        }
      } else {
        // no dates loop
        _CHRIS_INTERACTIVE_PLUGIN_.queryDayAll(mrns[i], dates[0], nb_queries);
      }
    }
  } else {
    // no mrn loop
    if (nb_dates >= 2) {
      // loop through dates
      var j = 0;
      for (j = 0; j < nb_dates; j++) {
        _CHRIS_INTERACTIVE_PLUGIN_.queryDayAll(mrns[0], dates[j], nb_queries);
      }
    } else {
      _CHRIS_INTERACTIVE_PLUGIN_.queryDayAll(mrns[0], dates[0], nb_queries);
    }
  }
}
/**
 * Create 'Advanced' table dataTables enabled.
 */
_CHRIS_INTERACTIVE_PLUGIN_.advancedTable = function() {
  var content = '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="S-RESULTS">';
  var i = 0;
  content += '<thead><tr><th>Name</th><th>MRN</th><th>DOB</th><th>Study Date</th><th>Mod.</th><th>Study Desc.</th><th>Series Desc.</th><th>Location</th><th>Files</th><th><input id="c_series" class="checkbox pull-right" type="checkbox"></th></tr></thead><tbody>';
  content += '</tbody></table>';
  // update html with table
  $('#SC-RESULTS').html(content);
  // make table sortable, filterable, ...
  _CHRIS_INTERACTIVE_PLUGIN_.table = $('#S-RESULTS').dataTable({
    "sDom" : "<'row-fluid'<'span6'l ><'span6'f>r>t<'row-fluid'<'span6'i>p>",
    "sPaginationType" : "bootstrap",
    "oLanguage" : {
      "sLengthMenu" : " Show _MENU_ results",
      "sInfo" : "Showing _START_ to _END_ of _TOTAL_ results "
    },
    "aoColumnDefs" : [ {
      "bSortable" : false,
      "aTargets" : [ 9 ]
    } ],
    "aLengthMenu" : [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ],
    iDisplayStart : 0,
    iDisplayLength : 10,
    "aaSorting" : [ [ 1, 'desc' ] ],
    "bAutoWidth" : false
  });
  $('#S-RESULTS_info').addClass('pull-left');
  $('#S-RESULTS_length').addClass('pull-left');
  $('#S-RESULTS_length > label').css('font-size', '12px');
  $('#S-RESULTS_filter').addClass('pull-right');
  $('#S-RESULTS_filter > label').css('font-size', '12px');
  $('.dataTables_paginate').addClass('pull-right');
  $('.dataTables_paginate').css('margin', '0px');
}
_CHRIS_INTERACTIVE_PLUGIN_.jsonConcat = function(json1, json2) {
  for ( var key in json2) {
    if (typeof json1[key] == "undefined") {
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
_CHRIS_INTERACTIVE_PLUGIN_.ajaxAdvancedResults = function(data, force) {
  // default value for 'force' is false
  if (typeof force == 'undefined') {
    force = false;
  }
  // cache the result data
  if (force == false) {
    if (typeof data != 'undefined' && data[0] != null && data[0] != '') {
      _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0] = _CHRIS_INTERACTIVE_PLUGIN_
          .jsonConcat(_CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0], data[0]);
    }
    if (typeof data != 'undefined' && data[1] != null && data[1] != '') {
      _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[1] = _CHRIS_INTERACTIVE_PLUGIN_
          .jsonConcat(_CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[1], data[1]);
    }
  }
  // note: Object.keys might not be supported by all browsers
  if (data[0] != null && Object.keys(data[0]).length > 0 && data[1] != null
      && Object.keys(data[1]).length > 0) {
    // if no table, create it
    if ($('#S-RESULTS').length == 0 || force == true) {
      _CHRIS_INTERACTIVE_PLUGIN_.advancedTable();
    }
    // add data in the table!
    var append = Array();
    var series_nb = data[1].SeriesDescription.length;
    var i = 0;
    for (i = 0; i < series_nb; ++i) {
      // update loaded results
      _CHRIS_INTERACTIVE_PLUGIN_.advancedCaching(data, i);
      // fill html table
      append.push(_CHRIS_INTERACTIVE_PLUGIN_.advancedFormat(data, i));
    }
    // add table to current table
    $('#S-RESULTS').dataTable().fnAddData(append);
  } else {
    // no studies found and not doing multiple mrn_split
    if (_CHRIS_INTERACTIVE_PLUGIN_.table == null) {
      $('#SC-RESULTS').html("No data found...");
    }
  }
}
/**
 * Cache data after 'Advanced' AJAX query.
 */
_CHRIS_INTERACTIVE_PLUGIN_.advancedCaching = function(data, i) {
  var stuid = data[1].StudyInstanceUID[i];
  var study = null;
  var cached = stuid in _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries;
  // if study not loaded, create container for this study
  if (!cached) {
    _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid] = Array();
    study = _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid];
    study.StudyInstanceUID = Array();
    study.SeriesInstanceUID = Array();
    study.SeriesDescription = Array();
    study.PerformedStationAETitle = Array();
    study.NumberOfSeriesRelatedInstances = Array();
    study.QueryRetrieveLevel = Array();
    study.RetrieveAETitle = Array();
    study.Status = Array();
  } else {
    study = _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid];
  }
  // fill study container
  var index = data[0].StudyInstanceUID.indexOf(data[1].StudyInstanceUID[i]);
  var exists = $.inArray(data[1].SeriesInstanceUID[i], study.SeriesInstanceUID);
  if (exists == -1) {
    study.StudyInstanceUID.push(data[1].StudyInstanceUID[i]);
    study.SeriesInstanceUID.push(data[1].SeriesInstanceUID[i]);
    study.SeriesDescription.push((data[1].SeriesDescription[i] == null) ? "nvp"
        : data[1].SeriesDescription[i]);
    study.PerformedStationAETitle
        .push((typeof(data[0].PerformedStationAETitle) == "undefined" || data[0].PerformedStationAETitle[index] == null) ? "nvp"
            : data[0].PerformedStationAETitle[index]);
    if(data[1].NumberOfSeriesRelatedInstances && data[1].NumberOfSeriesRelatedInstances[i] != "nvp"){
      study.NumberOfSeriesRelatedInstances.push(data[1].NumberOfSeriesRelatedInstances[i]);
    }
    else if(data[1].InstanceNumber && data[1].InstanceNumber[i]){
      study.NumberOfSeriesRelatedInstances.push(data[1].InstanceNumber[i]);
    }
    else{
      study.NumberOfSeriesRelatedInstances.push("nvp");
    }
    study.QueryRetrieveLevel.push(data[1].QueryRetrieveLevel[i]);
    if(data[1].RetrieveAETitle && data[1].RetrieveAETitle[i] ){
      study.RetrieveAETitle.push(data[1].RetrieveAETitle[i]);
    }
    else{
      study.RetrieveAETitle.push("nvp");
    }
    study.Status.push(false);
  }
}
/**
 * Reformat data after 'Advanced' AJAX query to fit the dataTable standard.
 */
_CHRIS_INTERACTIVE_PLUGIN_.advancedFormat = function(data, i) {
  var anon = _CHRIS_INTERACTIVE_PLUGIN_.getParam("anonymize");
  var index = data[0].StudyInstanceUID.indexOf(data[1].StudyInstanceUID[i]);
  var stuid = data[1].StudyInstanceUID[i];
  var serid = data[1].SeriesInstanceUID[i];
  var id = stuid.replace(/\./g, "_") + '-' + serid.replace(/\./g, "_");
  var sub = Array();
  if(anon == ""){
    sub.push(data[0].PatientName[index].replace(/\^/g, " ").replace(/\_/g, " "));
    sub.push(data[0].PatientID[index]);
    sub.push(data[0].PatientBirthDate[index]);
    sub.push(data[0].StudyDate[index]);
  }
  else{
    sub.push("XXXXXX");
    sub.push("XXXXXX");
    sub.push("XXXXXX");
    sub.push("XXXXXX");
  }
  sub.push(data[0].ModalitiesInStudy[index]);
  sub.push(data[0].StudyDescription[index].replace(/\>/g, "&gt").replace(/\</g,
      "&lt").replace(/\_/g, " "));
  sub.push(((data[1].SeriesDescription[i] == null) ? "nvp"
      : data[1].SeriesDescription[i]).replace(/\>/g, "&gt").replace(/\</g,
      "&lt").replace(/\_/g, " "));
  sub.push(((typeof(data[0].PerformedStationAETitle) == "undefined" || data[0].PerformedStationAETitle[index] == null) ? "nvp"
      : data[0].PerformedStationAETitle[index]).replace(/\>/g, "&gt").replace(
      /\</g, "&lt"));
    if(data[1].NumberOfSeriesRelatedInstances && data[1].NumberOfSeriesRelatedInstances[i] != "nvp"){
      sub.push(data[1].NumberOfSeriesRelatedInstances[i]);
    }
    else if(data[1].InstanceNumber && data[1].InstanceNumber[i]){
      sub.push(data[1].InstanceNumber[i]);
    }
    else{
      sub.push("nvp");
    }
  // update download icon based on its status
  var status = 0;
  var cached_study = stuid in _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries;
  if (cached_study) {
    var series_index = _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid].SeriesInstanceUID
        .indexOf(serid);
    if (series_index >= 0) {
      status = _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid].Status[series_index];
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
_CHRIS_INTERACTIVE_PLUGIN_.studyView = function() {
  $(document).off('click', "#STUDY_VIEW").on(
      'click',
      "#STUDY_VIEW",
      function(event) {
        // new representation of cached data
        _CHRIS_INTERACTIVE_PLUGIN_.ajaxSimpleResults(
            _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw, true);
      });
}
_CHRIS_INTERACTIVE_PLUGIN_.seriesView = function() {
  $(document).off('click', "#SERIES_VIEW").on(
      'click',
      "#SERIES_VIEW",
      function(event) {
        // new representation of cached data
        _CHRIS_INTERACTIVE_PLUGIN_.ajaxAdvancedResults(
            _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw, true);
      });
}
/**
 * Setup the details button to show series within a study in simple query.
 */
_CHRIS_INTERACTIVE_PLUGIN_.setupDetailStudy = function() {
  $(document).off('click', '#S-RESULTS td .control').on('click',
      '#S-RESULTS td .control', function() {
        // get the row
        var nTr = $(this).parents('tr')[0];
        // get the related study UID
        // replace back '_' by '.'
        var stuid = $(this).attr('id').replace(/\_/g, ".");
        // if data has not been cached, perform ajax query, else show it without
        // ajax!
        var i = $.inArray(nTr, _CHRIS_INTERACTIVE_PLUGIN_.openStudies);
        if (i == -1) {
          // get related series
          _CHRIS_INTERACTIVE_PLUGIN_.ajaxSeries(stuid, nTr);
        } else {
          $('i', this).attr('class', 'icon-chevron-down');
          $('div.innerDetails', $(nTr).next()[0]).slideUp(function() {
            _CHRIS_INTERACTIVE_PLUGIN_.table.fnClose(nTr);
            _CHRIS_INTERACTIVE_PLUGIN_.openStudies.splice(i, 1);
          });
        }
      });
}
/**
 * Setup the download button to download all series for a given study.
 */
_CHRIS_INTERACTIVE_PLUGIN_.setupDownloadStudy = function() {
  $(document)
      .off('click', '.d_study')
      .on(
          'click',
          '.d_study',
          function() { // replace the '_'
            var stuid = $(this).attr('id').replace(/\_/g, ".");
            // remove the '-std' tad at the end of the id
            stuid = stuid.substring(0, stuid.length - 4);
            // update study status
            if (typeof _CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid] === "undefined") {
              _CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid] = true;
            } else {
              _CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid] = !_CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid];
            }
            for ( var key in _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid]["SeriesInstanceUID"]) {
              if(key == 'hasObject'){
                // we are done, lets exit
                break;
              }

              var full = '#'
                  + stuid.replace(/\./g, "_")
                  + "-"
                  + _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid]["SeriesInstanceUID"][key]
                      .replace(/\./g, "_") + "-sed > :checkbox";
              if (_CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid] != _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid]["Status"][key]) {
                _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid]["Status"][key] = !_CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid]["Status"][key];
                if ($(full).length != 0) {
                  $(full)
                      .prop(
                          'checked',
                          _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid]["Status"][key]);
                }
              }
            }
          });
}

/**
 * Setup the check all callback.
 */
_CHRIS_INTERACTIVE_PLUGIN_.checkAllVisible = function(){

  var type = 'series';
  if($(this).prop('id') == 'c_studies'){
    type = 'study';
  }

  var self = this;
  $('.d_'+ type +' input').each(function(){
    if($(self).prop('checked') != $(this).prop('checked')){
      $(this).click();
    }
  });

}

/**
 * Setup the check all action for series and studies.
 */
_CHRIS_INTERACTIVE_PLUGIN_.setupCheckAll = function(type){

  $(document)
    .off('click', '#c_series')
    .on(
        'click',
        '#c_series',_CHRIS_INTERACTIVE_PLUGIN_.checkAllVisible);

  $(document)
    .off('click', '#c_studies')
    .on(
        'click',
        '#c_studies',_CHRIS_INTERACTIVE_PLUGIN_.checkAllVisible);

}

/**
 * Setup the download series button.
 */
_CHRIS_INTERACTIVE_PLUGIN_.setupDownloadSeries = function() {

  $(document)
      .off('click', '.d_series')
      .on(
          'click',
          '.d_series',
          function(event) {
            var id = $(this).attr('id');
            var split_id = id.split('-');
            var stuid = split_id[0].replace(/\_/g, ".");
            var seuid = split_id[1].replace(/\_/g, ".");
            var index = _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid].SeriesInstanceUID
                .indexOf(seuid);
            _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid].Status[index] = !_CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid].Status[index];
            // todo uncheck study if all series within one study unckecked
            // check if related study should be unchecked
            var full_1 = true;
            for ( var key in _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid]["Status"]) {
              if (!_CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid]["Status"][key]) {
                full_1 = false;
              }
            }
            var fullname = "#" + split_id[0] + "-std > :checkbox";
            // uncheck study if necessary
            if (typeof _CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid] === "undefined") {
              _CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid] = full_1;
            }
            if (full_1) {
              if (!_CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid]) {
                if ($(fullname).length != 0) {
                  $(fullname).prop('checked', true);
                }
                _CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid] = !_CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid];
              }
            } else {
              if (_CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid]) {
                if ($(fullname).length != 0) {
                  $(fullname).prop('checked', false);
                }
                _CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid] = !_CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid];
              }
            }
          });
}
/**
 * Handle 'Simple' AJAX query results.
 */
_CHRIS_INTERACTIVE_PLUGIN_.ajaxSimpleResults = function(data, force) {
  // default force value is false
  if (typeof (force) === 'undefined')
    force = false;
  // if ajax returns something, process it
  if (data[0] != null) {
    // if no table, create it
    if ($('#S-RESULTS').length == 0 || force == true) {
      _CHRIS_INTERACTIVE_PLUGIN_.simpleTable();
    }
    // fill the table
    var append = Array();
    var numStudies = data[0].PatientID.length;
    var i = 0;
    for (i = 0; i < numStudies; ++i) {
      append.push(_CHRIS_INTERACTIVE_PLUGIN_.simpleFormat(data[0], i));
    }
    $('#S-RESULTS').dataTable().fnAddData(append);
  } else {
    // no studies found and not doing multiple mrns
    if (_CHRIS_INTERACTIVE_PLUGIN_.table == null) {
      $('#SC-RESULTS').html("No data found...");
    }
  }
}
/**
 * Create 'Simple' table dataTables enabled.
 */
_CHRIS_INTERACTIVE_PLUGIN_.simpleTable = function() {
  var content = '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="S-RESULTS">';
  content += '<thead><tr><th>Name</th><th>MRN</th><th>DOB</th><th>Study Date</th><th>Study Desc.</th><th>Mod.</th><th>Location</th><th><input id="c_studies" class="checkbox pull-right" type="checkbox"></th></tr></thead><tbody>';
  content += '</tbody></table>';
  $('#SC-RESULTS').html(content);
  // make table sortable, filterable, ...
  _CHRIS_INTERACTIVE_PLUGIN_.table = $('#S-RESULTS').dataTable({
    "sDom" : "<'row-fluid'<'span6'l><'span6' f>r>t<'row-fluid'<'span6'i>p>",
    "sPaginationType" : "bootstrap",
    "oLanguage" : {
      "sLengthMenu" : " Show _MENU_ results",
      "sInfo" : "Showing _START_ to _END_ of _TOTAL_ results "
    },
    "aoColumnDefs" : [ {
      "bSortable" : false,
      "aTargets" : [ 7 ]
    } ],
    "aLengthMenu" : [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ],
    iDisplayStart : 0,
    iDisplayLength : 10,
    "aaSorting" : [ [ 1, 'desc' ] ],
    "bAutoWidth" : false
  });
  $('#S-RESULTS_info').addClass('pull-left');
  $('#S-RESULTS_length').addClass('pull-left');
  $('#S-RESULTS_length > label').css('font-size', '12px');
  $('#S-RESULTS_filter').addClass('pull-right');
  $('#S-RESULTS_filter > label').css('font-size', '12px');
  $('.dataTables_paginate').addClass('pull-right');
  $('.dataTables_paginate').css('margin', '0px');
}
/**
 * Reformat data after 'Advanced' AJAX query to fit the dataTable standard.
 */
_CHRIS_INTERACTIVE_PLUGIN_.simpleFormat = function(data, i) {
  var anon = _CHRIS_INTERACTIVE_PLUGIN_.getParam("anonymize");

  var stuid = data.StudyInstanceUID[i];
  var sub = Array();
  if(anon == ""){
    sub.push('<div id="' + stuid.replace(/\./g, "_")
        + '" class="control"><i class="icon-chevron-down"></i> '
        + data.PatientName[i].replace(/\^/g, " ").replace(/\_/g, " ") + '</div>');
    sub.push(data.PatientID[i]);
    sub.push(data.PatientBirthDate[i]);
    sub.push(data.StudyDate[i]);
  }
  else{
    sub.push('<div id="' + stuid.replace(/\./g, "_")
        + '" class="control"><i class="icon-chevron-down"></i>XXXXXX</div>');
    sub.push('XXXXXX');
    sub.push('XXXXXX');
    sub.push('XXXXXX');
  }

  sub.push(data.StudyDescription[i].replace(/\>/g, "&gt").replace(/\</g, "&lt")
      .replace(/\_/g, " "));
  sub.push(data.ModalitiesInStudy[i]);
  if(typeof(data.PerformedStationAETitle) == "undefined"){
    sub.push("nvp");
  }
  else{
    sub.push(data.PerformedStationAETitle[i].replace(/\>/g, "&gt").replace(/\</g,
      "&lt").replace(/\_/g, " "));
  }
  // if study cached, check status of series to update icon
  var cached = stuid in _CHRIS_INTERACTIVE_PLUGIN_.studyStatus;
  var status = 0;
  if (cached) {
    status = _CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid];
  } else {
    _CHRIS_INTERACTIVE_PLUGIN_.studyStatus[stuid] = false;
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
_CHRIS_INTERACTIVE_PLUGIN_.ajaxSeries = function(studyUID, nTr) {
  var stuid = studyUID;
  if (nTr != null) {
    $('.control i', nTr).removeClass('icon-chevron-down').addClass(
        'icon-chevron-up');
  }
  _CHRIS_INTERACTIVE_PLUGIN_.ajaxSeriesResults(
      _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[stuid], nTr);
}
/**
 * Handle 'Series' AJAX query results.
 */
_CHRIS_INTERACTIVE_PLUGIN_.ajaxSeriesResults = function(data, nTr) {
  // format the details row table
  var format = _CHRIS_INTERACTIVE_PLUGIN_.seriesFormat(data);
  var detailRown = _CHRIS_INTERACTIVE_PLUGIN_.table.fnOpen(nTr, format,
      'details');
  // create dataTable from html table
  $('.table', detailRown).dataTable({
    "sDom" : "t",
    "aaSorting" : [ [ 1, 'desc' ] ],
    "bPaginate" : false,
    "aoColumnDefs" : [ {
      "bSortable" : false,
      "aTargets" : [ 2 ]
    } ],
    "bAutoWidth" : false
  });
  $('div.innerDetails', detailRown).slideDown();
  _CHRIS_INTERACTIVE_PLUGIN_.openStudies.push(nTr);
}
/**
 * Format the details (series) HTML table for a study, given some data
 */
_CHRIS_INTERACTIVE_PLUGIN_.seriesFormat = function(data) {
  // number of rows to be created
  var nb_results = data.StudyInstanceUID.length;
  var i = 0;
  // Create the "details" (i.e. series) html content
  // innerDetails used for slide in/out
  var content = '<div class="innerDetails"><table class="table table-bordered" cellmarging="0" cellpadding="0" cellspacing="0" border="0"><thead><tr><th>Series Desc.</th><th class="span2">Files</th><th class="span1"></th></tr></thead><tbody>';
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
_CHRIS_INTERACTIVE_PLUGIN_.connectDownload = function() {
  $(document).off('click', '#DOWNLOAD').on('click', '#DOWNLOAD', function(event) {
    _CHRIS_INTERACTIVE_PLUGIN_.download();
  });
}
_CHRIS_INTERACTIVE_PLUGIN_.download = function() {

  var list = "";

  for ( var study_key in _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries) {
    for ( var j = 0; j < _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["Status"].length; j++) {
      if (_CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["Status"][j] == true) {
        // write csv column headers if list is empty
        if(list === ''){
           list += '"PatientID","PatientName","PatientBirthDate","PatientSex","StudyInstanceUID","StudyDescription","StudyDate","PerformedStationAETitle","ModalitiesInStudy","SeriesInstanceUID","SeriesDescription","NumberOfSeriesRelatedInstances"\r\n'
        }
  
        // write table content
        var index = _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0].StudyInstanceUID.indexOf(_CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["StudyInstanceUID"][j]);
        list +='"' + _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0]["PatientID"][index] + '",'
             + '"' + _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0]["PatientName"][index] + '",'
             + '"' + _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0]["PatientBirthDate"][index] + '",'
             + '"' + _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0]["PatientSex"][index] + '",'
             + '"' + _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["StudyInstanceUID"][j] + '",'
             + '"' + _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0]["StudyDescription"][index] + '",'
             + '"' + _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0]["StudyDate"][index] + '",'
             + '"' + (typeof _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0]["PerformedStationAETitle"] !== 'undefined' ? _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0]["PerformedStationAETitle"][index] : 'nvp' ) + '",'
             + '"' + (typeof _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0]["ModalitiesInStudy"] !== 'undefined' ? _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw[0]["ModalitiesInStudy"][index] : 'nvp' ) + '",'
             + '"' + _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["SeriesInstanceUID"][j] + '",'
             + '"' + _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["SeriesDescription"][j] + '",'
             + '"' + (typeof _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["NumberOfSeriesRelatedInstances"] !== 'undefined' ? _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["NumberOfSeriesRelatedInstances"][j] : 'nvp' )  + '",'
             +  '\r\n';

      }
    }
  }

  var downloadLink = document.createElement("a");
  var blob = new Blob([list],{type : 'text/csv'});
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  var now = new Date();
  downloadLink.download = "pacs_pull-" +( "0" + now.getFullYear()).slice(-2) + ("0" + now.getMonth()).slice(-2) + ("0" + now.getDate()).slice(-2) + "-" + ("0" + now.getHours()).slice(-2) + ("0" + now.getMinutes()).slice(-2) + ("0" + now.getSeconds()).slice(-2) +  ".csv";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  //window.open("data:text/csv;charset=utf-8," + encodeURIComponent(list));

}

_CHRIS_INTERACTIVE_PLUGIN_.connectPull = function() {
  $(document).off('click', '#PULL').on('click', '#PULL', function(event) {
    // modify button icon
    $("#PULL").removeClass('btn-success').addClass('btn-warning');
    $('#PULL').addClass('disabled');
    $("#PULL").html('<i class="icon-refresh rotating_class"></i>');
    _CHRIS_INTERACTIVE_PLUGIN_.ajaxPull();
  });
}
_CHRIS_INTERACTIVE_PLUGIN_.ajaxPull = function() {
  // get list to pull fron cache!
  var list = "";
  for ( var study_key in _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries) {
    for ( var j = 0; j < _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["Status"].length; j++) {
      if (_CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["Status"][j] == true) {
        list += _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["StudyInstanceUID"][j]
            + ","
            + _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries[study_key]["SeriesInstanceUID"][j]
            + "\n";
      }
    }
  }

  var str_uniqueID = '_' + Math.random().toString(36) + '.txt';
  var cluster_tmp_dir = _CHRIS_INTERACTIVE_PLUGIN_.getParam("clustertmpdir");

$.ajax({
          type : "POST",
          url : "plugins/pacs_pull/core/seriesUID_process.php",
          data : {
            UNIQUEID : str_uniqueID,
            DATA : list,
            CLUSTER: cluster_tmp_dir
          },
          success : function(data) {
            var _list_in = _CHRIS_INTERACTIVE_PLUGIN_.getInd('listseries');
            if (_list_in == -1) {
              // if doesn't exist, push it!
              _CHRIS_INTERACTIVE_PLUGIN_._parameters[0].push({
                name : "listseries",
                value : data,
                type : "string",
                target_type : 'feed'
              });
              _CHRIS_INTERACTIVE_PLUGIN_._param_ind['listseries'] = _CHRIS_INTERACTIVE_PLUGIN_._parameters[0].length - 1;
            } else {
              _CHRIS_INTERACTIVE_PLUGIN_._parameters[0][_list_in].value = list;
            }
            // trigger submit with "True"
            _CHRIS_INTERACTIVE_PLUGIN_.force = true;
            $("#plugin_submit").click();
          }
        });
}
_CHRIS_INTERACTIVE_PLUGIN_.submitted = function() {
  $("#PULL").removeClass('btn-warning').addClass('btn-primary');
  $("#PULL").html('Pull Selection');
  $('#PULL').removeClass('disabled');
}
/**
 * Setup the javascript when document is ready (finshed loading)
 */
$(document).ready(function() {
  //
  // Global variables
  //
  // is study checked?
  _CHRIS_INTERACTIVE_PLUGIN_.studyStatus = {};
  // keep track of the job status
  // how many ajax queries have succeed
  _CHRIS_INTERACTIVE_PLUGIN_.ajaxStatus = 0;
  // order received series
  // keep track of status
  // used in the details view
  _CHRIS_INTERACTIVE_PLUGIN_.cachedSeries = {};
  // cache all incoming raw data
  // used in advanced and simple view
  _CHRIS_INTERACTIVE_PLUGIN_.cachedRaw = null;
  // table containing raw data
  _CHRIS_INTERACTIVE_PLUGIN_.table = null;
  // keep track of opened studies in simple view
  _CHRIS_INTERACTIVE_PLUGIN_.openStudies = [];
  // connect button
  // show/hide the advanced parameters on click
  // connect button for
  // query server through ajax for given set of parameters
  _CHRIS_INTERACTIVE_PLUGIN_.studyView();
  _CHRIS_INTERACTIVE_PLUGIN_.seriesView();
  _CHRIS_INTERACTIVE_PLUGIN_.setupDetailStudy();
  _CHRIS_INTERACTIVE_PLUGIN_.setupDownloadStudy();
  _CHRIS_INTERACTIVE_PLUGIN_.setupDownloadSeries();
  _CHRIS_INTERACTIVE_PLUGIN_.setupCheckAll();
  _CHRIS_INTERACTIVE_PLUGIN_.connectPull();
  _CHRIS_INTERACTIVE_PLUGIN_.connectDownload();
});
