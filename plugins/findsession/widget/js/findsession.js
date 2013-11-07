// setup namespace
var _CHRIS_INTERACTIVE_PLUGIN_ = _CHRIS_INTERACTIVE_PLUGIN_ || {};

// HELPERS
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

// MAIN FUNCTIONS

_CHRIS_INTERACTIVE_PLUGIN_.init = function() {

  // clean table if any
  if ($('#findsession_table').length != 0) {
    $('#findsession_table').dataTable().fnDestroy();
  }

  // create table
  $('#findsession_table').dataTable(
    {
        "bProcessing": true,
        "sAjaxSource": "plugins/findsession/core/query-web.php",
        "sServerMethod": "POST", 
        "fnServerParams": function ( aoData ) {
         aoData.push({"name": "FINDS_e", "value":  _CHRIS_INTERACTIVE_PLUGIN_.getParam("name")},
                     {"name": "FINDS_i", "value":  _CHRIS_INTERACTIVE_PLUGIN_.getParam("sessionid")},
                     {"name": "FINDS_I", "value":  _CHRIS_INTERACTIVE_PLUGIN_.getParam("subjectid")},
                     {"name": "FINDS_p", "value":  _CHRIS_INTERACTIVE_PLUGIN_.getParam("project")},
                     {"name": "FINDS_o", "value":  _CHRIS_INTERACTIVE_PLUGIN_.getParam("dateon")},
                     {"name": "FINDS_r", "value":  _CHRIS_INTERACTIVE_PLUGIN_.getParam("datepast4months")},
                     {"name": "FINDS_s", "value":  _CHRIS_INTERACTIVE_PLUGIN_.getParam("datesince")},
                     {"name": "FINDS_t", "value":  _CHRIS_INTERACTIVE_PLUGIN_.getParam("datetoday")},
                     {"name": "FINDS_x", "value":  _CHRIS_INTERACTIVE_PLUGIN_.getParam("experimenter")}
//                     {"name": "FINDS_v", "value":  _CHRIS_INTERACTIVE_PLUGIN_.getParam("verbose")}
);
        },
        "aoColumns": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "mData": null,
            "sDefaultContent": "<input type='checkbox' />"
          }
        ],
        "aaSorting" : [ [ 1, 'desc' ] ],
        "bAutoWidth" : false,
        "iDisplayLength": -1,
        "sDom" : "<if<'pull-selection'>r>t",
        "oLanguage" : {
          "sInfo" : "_TOTAL_ match(es) ",
          "sInfoEmpty": "No match",
          "sInfoFiltered": " - over _MAX_"
        },
        "aoColumnDefs" : [ {
          "bSortable" : false,
          "aTargets" : [ 7 ]
        } ],
    });

  $(document).off('click', ".pull-selection").on(
    'click', ".pull-selection",function(event) {
    _CHRIS_INTERACTIVE_PLUGIN_.ajaxPull();
  });

  $('div.pull-selection').html('<div style="background-color: #353535;color: #FFF;display: inline-block;background-color: #009DE9;outline: 1px solid #353535;padding: 5px;border-radius: 2px;font-size: 17.5px;margin-top:5px;">Pull Selection</div>');
  $('div.pull-selection').css('display', 'inline-block');
  $('div.pull-selection').css('flex', '1');
  $('div.pull-selection > div:first').hover(function(){
    $('div.pull-selection > div:first').css("cursor","pointer");
  });


  $('#findsession_table_info').css('display', 'inline-block');
  $('#findsession_table_info').css('font-size', '17.5px');
  $('#findsession_table_info').css('flex', '1');
  $('#findsession_table_info').css('padding-top', '8px');
  $('#findsession_table_info').css('padding-left', '10px');

  $('#findsession_table_filter').css('display', 'inline-block');
  $('#findsession_table_filter > label').css('font-size', '17.5px');
  $('#findsession_table_filter').css('flex', '1');
  $('#findsession_table_filter').css('padding-top', '5px');

  $("#findsession_table_wrapper > div:first").width($("#findsession_table_wrapper").width());
  $("#findsession_table_wrapper > div:first").css('position', 'fixed');
  $("#findsession_table_wrapper > div:first").css('margin-top', '-42px');
  $("#findsession_table_wrapper > div:first").css('display', 'flex');
  $("#findsession_table_wrapper > div:first").css('background-color', '#353535');
  $("#findsession_table_wrapper > div:first").css('color', '#ffffff');
  
  $("#findsession_table").css('margin-top', '42px');
}

_CHRIS_INTERACTIVE_PLUGIN_.ajaxPull = function() {
  
  // get all checked elements in the table
  var jSPath = $("#findsession_table input:checked").closest('td').prev('td');

  var src = "\\\"";

  jSPath.each(function() {
    src += $( this ).html() + ' ';
  });

  src += "\\\"";

  var index = _CHRIS_INTERACTIVE_PLUGIN_.getInd('listdirectories');  
  if (index == -1) {
    // if doesn't exist, push it!
    _CHRIS_INTERACTIVE_PLUGIN_._parameters[0].push({
      name : "listdirectories",
      value : src,
      type : "string",
      target_type : 'feed'
    });
  } else {
    _CHRIS_INTERACTIVE_PLUGIN_._parameters[0][index].value = src;
  }


  // trigger submit with "True"
  _CHRIS_INTERACTIVE_PLUGIN_.force = true;
  $("#plugin_submit").click();

}

_CHRIS_INTERACTIVE_PLUGIN_.submitted = function() {

}
