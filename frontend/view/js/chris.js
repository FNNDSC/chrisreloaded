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
  /* blinking(jQuery("#cart")); */
  // blinking(jQuery("#submit"));
});