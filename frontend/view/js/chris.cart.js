/**
 * Define the CART namespace
 */
var _CART_ = _CART_ || {};

_CART_.show = function(x,y) {
  var hidden = jQuery('.cart').is(':hidden');
  
  if (hidden) {
    jQuery('.cart').show();
    // don't loose the current spot
    
    // TODO find good value.. tried adding jQuery('.cart').height() + 20 (for the margin without good success)
    window.scrollTo(x,y+50);
    
  }
}

_CART_.select = function(x,y) {
  
  _CART_.show(x,y);

  // show a notification which hides it self after a while
  jQuery().toastmessage('showSuccessToast','<b>'+_CART_.SeriesDesc+'</b><br>selected.');
  
  jQuery('#cart_datalist').append('<li>'+_CART_.SeriesDesc+'</li>');
  
};

/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  
  jQuery('#pipelines').carousel({
    interval: false
  });
  
});