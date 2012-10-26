/**
 * Define the _PACS_ namespace
 */
var _PACS_ = _PACS_ || {};

_PACS_.pull_click = function() {
  jQuery("#pacs_pull").click(function(event) {
    // if not already querying the pacs
    if (!jQuery("#pacs_pull_mrns").prop("readonly")) {
      var mrn_list = jQuery('#pacs_pull_mrns').val();
      var meta=new Object();
      meta.name="MRN";
      meta.value=mrn_list;
      meta.type="simple";
      meta.target_type="feed";
      
      var metas = new Array();
      metas[0] = meta;
      // create feed
      // get all datas unique id to fill the feed
      jQuery.ajax({
        type : "POST",
        url : "controller/go.php",
        dataType : "text",
        data : {
          FEED_USER : '1',
          FEED_PLUGIN : 'pacs_pull',
          FEED_META : metas
        },
        success : function(data) {
/*          jQuery.ajax({
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
    }
  });
}
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  _PACS_.pull_click();
});