/**
 * Define the PLUGIN namespace
 */
var _PLUGIN_ = _PLUGIN_ || {};
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  // set default plugin to "fetal_moco"
  jQuery("#fetal_moco_carousel").addClass("active");
  // turn off automated rotation
  jQuery('#pipelines').carousel({
    interval : false
  });
  // setup droppable item
  jQuery("#cart_selection").droppable({
    activeClass : "ui-state-default",
    hoverClass : "ui-state-hover",
    accept : ":not(.ui-sortable-helper)",
    drop : function(event, ui) {
      jQuery("<div></div>").text(ui.draggable.text()).appendTo(this);
    }
  });
});
