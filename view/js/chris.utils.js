/**
 * Define the _CHRIS_UTILS_ namespace
 */
var _CHRIS_UTILS_ = _CHRIS_UTILS_ || {};

/**
 * Helper to load JS from JS Credits:
 * http://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
 */
_CHRIS_UTILS_.loadScript = function(url, callback) {
  var script = document.createElement("script")
  script.type = "text/javascript";
  if (script.readyState) { // IE
    script.onreadystatechange = function() {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else { // Others
    script.onload = function() {
      callback();
    };
  }
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}