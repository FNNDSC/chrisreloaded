/**
 * Define the _PACS_ namespace
 */
var _PACS_ = _PACS_ || {};

_PACS_.pull_click = function() {
  jQuery("#pacs_pull").click(function(event) {
    // if not already querying the pacs
    if (!jQuery("#pacs_pull_mrns").prop("readonly")) {
      var mrn_list = jQuery('#pacs_pull_mrns').val();
      var metaS =new Object();
      metaS.name="MRN";
      metaS.value=mrn_list;
      metaS.type="simple";
      metaS.target_type="feed";
      
      var metasS = new Array();
      metasS[0] = metaS;
      
      var metaO=new Object();
      metaO.name="Output image";
      metaO.value='image_location';
      metaO.type="simple";
      metaO.target_type="feed";
      
      var metasO = new Array();
      metasO[0] = metaO;
      
      // create feed
      // get all datas unique id to fill the feed
      jQuery.ajax({
        type : "POST",
        url : "controller/launcher.php",
        dataType : "text",
        data : {
          FEED_PLUGIN : 'pacs_pull',
          FEED_NAME : 'name of the feed',
          FEED_PARAM : metasS,
          FEED_OUTPUT: metasO
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