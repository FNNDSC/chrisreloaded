/**
 * Define the CART namespace
 */
var _CART_ = _CART_ || {};
_CART_.show = function(x, y) {
  var hidden = jQuery('.cart').is(':hidden');
  if (hidden) {
    // get carrousel via ajax!
    jQuery('.cart').show();
  }
}
_CART_.select = function(x, y) {
  _CART_.show(x, y);
  // show a notification which hides it self after a while
  jQuery().toastmessage('showSuccessToast',
      '<b>' + _CART_.SeriesDesc + '</b><br>selected.');
  jQuery('#cart_datalist').append(
      '<li class="draggable">' + _CART_.SeriesDesc + '</li>');
};
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  jQuery('#pipelines').carousel({
    interval : false
  });
  jQuery("#cart_selection").droppable({
    activeClass : "ui-state-default",
    hoverClass : "ui-state-hover",
    accept : ":not(.ui-sortable-helper)",
    drop : function(event, ui) {
      jQuery("<div></div>").text(ui.draggable.text()).appendTo(this);
    }
  });
});