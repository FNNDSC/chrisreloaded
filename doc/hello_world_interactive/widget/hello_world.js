// DEFINE NAMESPACE
var _CHRIS_INTERACTIVE_PLUGIN_ = _CHRIS_INTERACTIVE_PLUGIN_ || {};

// 1-OVERLOAD THE INIT METHOD
// when the html is loaded, we get the parameters from the plugin parameters
_CHRIS_INTERACTIVE_PLUGIN_.init = function() {
  $('.cloud').html(
      'Hello, <b>' + _CHRIS_INTERACTIVE_PLUGIN_._param.name
          + '</b>! </br> Click on the bird to start a job!');
}

// 2-START JOB ON THE CLUSTER
// when click on the bird, we animate it and start a job on the cluster
$(document).off('click', '#redbird').on('click', '#redbird', function() {
  // start job!
  animateDiv();
  // trigger submit with "True"
  _CHRIS_INTERACTIVE_PLUGIN_.force = true;
  $("#plugin_submit").click();
});

// 3-JOB HAS BEEN SUBMITTED TO THE CLUSTER
// once the job has been pushed to the cluster, we stop animating the bird
_CHRIS_INTERACTIVE_PLUGIN_.submitted = function() {
  $('#redbird').stop();
  $('#redbird').css('top', '0px');
  $('#redbird').css('left', '0px');
}

// 4-CLEANUP THE HTML INTERACTIVE PLUGIN WHEN EXIT
// when we close the interactive widget, we greet the user
// we can disconnect events, etc.
_CHRIS_INTERACTIVE_PLUGIN_.destroy = function() {
  alert('See you soon, <b>' + _CHRIS_INTERACTIVE_PLUGIN_._param.name + '</b>!');
}