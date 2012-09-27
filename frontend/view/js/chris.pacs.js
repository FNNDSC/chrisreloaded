/**
 * Define the _PACS_ namespace
 */
var _PACS_ = _PACS_ || {};
_PACS_.pull_focus = function() {
  jQuery('#pacs_pull_mrns').focus(function() {
    jQuery(this).animate({
      height : '80px'
    }, 200);
    jQuery('#pacs_pull_ui').show();
  });
}
_PACS_.pull_blur = function() {
  jQuery('#pacs_pull_mrns').blur(function() {
    if (jQuery('#pacs_pull_mrns').val() == '') {
      jQuery('#pacs_pull_mrns').animate({
        height : '19px'
      }, 200);
      jQuery('#pacs_pull_ui').hide();
    }
  });
}
_PACS_.pull_click = function() {
  jQuery("#pacs_pull").click(function(event) {
    // if not already querying the pacs
    if (!jQuery("#pacs_pull_mrns").prop("readonly")) {
      var mrn_list = jQuery('#pacs_pull_mrns').val();
      // create feed
      // get all datas unique id to fill the feed
      jQuery.ajax({
        type : "POST",
        url : "controller/feed_create.php",
        dataType : "text",
        data : {
          FEED_USER : 'Nicolas',
          FEED_ACTION : 'data-down-mrn',
          FEED_MODEL : 'data',
          FEED_MODEL_ID : mrn_list
        },
        success : function(data) {
          // data is html feed for this client
          // needed ??
          // add feed to new feed
          // start pulling the data
          /*jQuery.ajax({
            type : "POST",
            url : "controller/pacs_move.php",
            dataType : "json",
            data : {
              USER_AET : 'FNNDSC-CHRISDEV',
              SERVER_IP : '134.174.12.21',
              SERVER_POR : '104',
              PACS_LEV : 'STUDY',
              PACS_STU_UID : '',
              PACS_MRN : mrn_list,
              PACS_NAM : '',
              PACS_MOD : '',
              PACS_DAT : '',
              PACS_STU_DES : '',
              PACS_ACC_NUM : ''
            }
          });*/
        }
      });
      jQuery('#pacs_pull_mrns').val('');
      jQuery('#pacs_pull_mrns').animate({
        height : '19px'
      }, 200);
      jQuery('#pacs_pull_ui').hide();
    }
  });
}
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  _PACS_.pull_click();
  _PACS_.pull_focus();
  _PACS_.pull_blur();
});