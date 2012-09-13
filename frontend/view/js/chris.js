function blinking(elm) {
  timer = setInterval(blink, 1000);
  function blink() {
    // elm.show('highlight',{color: 'yellow'},'slow');
    // elm.effect("pulsate", { times:3 }, 1000);
    elm.fadeTo(500, 0.5, function() {
      elm.fadeTo(500, 1);
    });
  }
}
jQuery(document).ready(function() {
  jQuery('.dropdown-toggle').dropdown();
  jQuery("[rel=bottom_tooltip]").tooltip({
    placement : 'bottom'
  });
  jQuery("[rel=right_tooltip]").tooltip({
    placement : 'right'
  });
  jQuery('#pacs_pull_mrns').focus(function() {
    jQuery(this).animate({
      height : '80px'
    }, 200);
    jQuery('#pacs_pull_ui').show();
  });
  jQuery('#pacs_pull_mrns').blur(function() {
    if (jQuery('#pacs_pull_mrns').val() == '') {
      jQuery('#pacs_pull_mrns').animate({
        height : '19px'
      }, 200);
      jQuery('#pacs_pull_ui').hide();
    }
  });
  jQuery("#pacs_pull").click(function(event) {
    // if not already querying the pacs
    if (!jQuery("#pacs_pull_mrns").prop("readonly")) {
      var mrn_list = jQuery('#pacs_pull_mrns').val();
      jQuery("#pacs_pull_mrns").prop("readonly", "readonly");
      jQuery("#pacs_pull_advanced").prop("readonly", "readonly");
      jQuery(this).text('Pulling...');
      blinking(jQuery(this));
      jQuery.ajax({
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
        },
        success : function(data) {
          clearInterval(timer);
          jQuery("#pacs_pull").text('Pull');
          jQuery("#pacs_pull_mrns").removeProp("readonly");
          jQuery("#pacs_pull_advanced").removeProp("readonly");
          jQuery('#pacs_pull_mrns').val('');
          jQuery('#pacs_pull_mrns').animate({
            height : '19px'
          }, 200);
          jQuery('#pacs_pull_ui').hide();
        }
      });
    }
  });
  
  jQuery("#cart").click(function(event) {
    if (jQuery("#cartdiv").is(":visible")) {
      jQuery("#cartdiv").hide('blind');
      blinking(jQuery("#cart"));
    } else {
      jQuery("#cartdiv").show('blind');
      clearInterval(timer);
    }
  });
  jQuery("#cartdiv").hide();
  /*blinking(jQuery("#cart"));*/
  // blinking(jQuery("#submit"));
});