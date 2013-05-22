function makeNewPosition() {
  // Get viewport dimensions (remove the dimension of the div)
  var h = $('#clouds').height();
  var w = $('#clouds').width();
  var nh = Math.round(Math.random() * h);
  var nw = Math.round(Math.random() * w);
  return [ nh, nw ];
}
function animateDiv() {
  var newq = makeNewPosition();
  $('#redbird').animate({
    top : '-' + newq[0],
    left : newq[1]
  }, function() {
    animateDiv();
  });
};
