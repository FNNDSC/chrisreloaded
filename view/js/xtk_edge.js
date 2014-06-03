/*
 * 
 *                  xxxxxxx      xxxxxxx
 *                   x:::::x    x:::::x 
 *                    x:::::x  x:::::x  
 *                     x:::::xx:::::x   
 *                      x::::::::::x    
 *                       x::::::::x     
 *                       x::::::::x     
 *                      x::::::::::x    
 *                     x:::::xx:::::x   
 *                    x:::::x  x:::::x  
 *                   x:::::x    x:::::x 
 *              THE xxxxxxx      xxxxxxx TOOLKIT
 *                    
 *                  http://www.goXTK.com
 *                   
 * Copyright (c) 2012 The X Toolkit Developers <dev@goXTK.com>
 *                   
 *    The X Toolkit (XTK) is licensed under the MIT License:
 *      http://www.opensource.org/licenses/mit-license.php
 * 
 *      "Free software" is a matter of liberty, not price.
 *      "Free" as in "free speech", not as in "free beer".
 *                                         - Richard M. Stallman
 * 
 * FUELED BY:
 *  - the wonderful Constructive Solid Geometry library by Evan Wallace (http://madebyevan.com)
 *    LICENSE: https://raw.github.com/xtk/X/master/lib/csg/LICENSE
 *
 *  - parts of the Google Closure Library (http://code.google.com/closure/library)
 *    LICENSE: https://raw.github.com/xtk/google-closure-library/master/LICENSE
 *
 *  - zlib.js, the ultimate gzip/zlib javascript implementation (https://github.com/imaya/zlib.js)
 *    LICENSE: https://raw.github.com/imaya/zlib.js/master/LICENSE
 *
 * MORE CREDITS: https://raw.github.com/xtk/X/master/LICENSE
 *
 */
function $JSCompiler_alias_THROW$$($jscomp_throw_param$$) {
  throw $jscomp_throw_param$$;
}
var $JSCompiler_alias_VOID$$ = void 0, $JSCompiler_alias_TRUE$$ = !0, $JSCompiler_alias_NULL$$ = null, $JSCompiler_alias_FALSE$$ = !1;
function $JSCompiler_emptyFn$$() {
  return function() {
  }
}
function $JSCompiler_set$$($JSCompiler_set_name$$) {
  return function($JSCompiler_set_value$$) {
    this[$JSCompiler_set_name$$] = $JSCompiler_set_value$$
  }
}
function $JSCompiler_get$$($JSCompiler_get_name$$) {
  return function() {
    return this[$JSCompiler_get_name$$]
  }
}
var $JSCompiler_prototypeAlias$$, $goog$global$$ = this;
function $goog$nullFunction$$() {
}
function $goog$typeOf$$($value$$40$$) {
  var $s$$2$$ = typeof $value$$40$$;
  if("object" == $s$$2$$) {
    if($value$$40$$) {
      if($value$$40$$ instanceof Array) {
        return"array"
      }
      if($value$$40$$ instanceof Object) {
        return $s$$2$$
      }
      var $className$$1$$ = Object.prototype.toString.call($value$$40$$);
      if("[object Window]" == $className$$1$$) {
        return"object"
      }
      if("[object Array]" == $className$$1$$ || "number" == typeof $value$$40$$.length && "undefined" != typeof $value$$40$$.splice && "undefined" != typeof $value$$40$$.propertyIsEnumerable && !$value$$40$$.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == $className$$1$$ || "undefined" != typeof $value$$40$$.call && "undefined" != typeof $value$$40$$.propertyIsEnumerable && !$value$$40$$.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == $s$$2$$ && "undefined" == typeof $value$$40$$.call) {
      return"object"
    }
  }
  return $s$$2$$
}
function $goog$isDef$$($val$$) {
  return $val$$ !== $JSCompiler_alias_VOID$$
}
function $goog$isArray$$($val$$3$$) {
  return"array" == $goog$typeOf$$($val$$3$$)
}
function $goog$isArrayLike$$($val$$4$$) {
  var $type$$52$$ = $goog$typeOf$$($val$$4$$);
  return"array" == $type$$52$$ || "object" == $type$$52$$ && "number" == typeof $val$$4$$.length
}
function $goog$isString$$($val$$6$$) {
  return"string" == typeof $val$$6$$
}
function $goog$isNumber$$($val$$8$$) {
  return"number" == typeof $val$$8$$
}
function $goog$isFunction$$($val$$9$$) {
  return"function" == $goog$typeOf$$($val$$9$$)
}
function $goog$isObject$$($val$$10$$) {
  var $type$$53$$ = typeof $val$$10$$;
  return"object" == $type$$53$$ && $val$$10$$ != $JSCompiler_alias_NULL$$ || "function" == $type$$53$$
}
function $goog$getUid$$($obj$$20$$) {
  return $obj$$20$$[$goog$UID_PROPERTY_$$] || ($obj$$20$$[$goog$UID_PROPERTY_$$] = ++$goog$uidCounter_$$)
}
var $goog$UID_PROPERTY_$$ = "closure_uid_" + (1E9 * Math.random() >>> 0), $goog$uidCounter_$$ = 0;
function $goog$bindNative_$$($fn$$, $selfObj$$1$$, $var_args$$25$$) {
  return $fn$$.call.apply($fn$$.bind, arguments)
}
function $goog$bindJs_$$($fn$$1$$, $selfObj$$2$$, $var_args$$26$$) {
  $fn$$1$$ || $JSCompiler_alias_THROW$$(Error());
  if(2 < arguments.length) {
    var $boundArgs$$ = Array.prototype.slice.call(arguments, 2);
    return function() {
      var $newArgs$$ = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply($newArgs$$, $boundArgs$$);
      return $fn$$1$$.apply($selfObj$$2$$, $newArgs$$)
    }
  }
  return function() {
    return $fn$$1$$.apply($selfObj$$2$$, arguments)
  }
}
function $goog$bind$$($fn$$2$$, $selfObj$$3$$, $var_args$$27$$) {
  $goog$bind$$ = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? $goog$bindNative_$$ : $goog$bindJs_$$;
  return $goog$bind$$.apply($JSCompiler_alias_NULL$$, arguments)
}
function $goog$partial$$($fn$$3$$, $var_args$$28$$) {
  var $args$$ = Array.prototype.slice.call(arguments, 1);
  return function() {
    var $newArgs$$1$$ = Array.prototype.slice.call(arguments);
    $newArgs$$1$$.unshift.apply($newArgs$$1$$, $args$$);
    return $fn$$3$$.apply(this, $newArgs$$1$$)
  }
}
var $goog$now$$ = Date.now || function() {
  return+new Date
};
function $goog$exportSymbol$$($publicPath$$, $object$$) {
  var $parts$$inline_52$$ = $publicPath$$.split("."), $cur$$inline_53$$ = $goog$global$$;
  !($parts$$inline_52$$[0] in $cur$$inline_53$$) && $cur$$inline_53$$.execScript && $cur$$inline_53$$.execScript("var " + $parts$$inline_52$$[0]);
  for(var $part$$inline_54$$;$parts$$inline_52$$.length && ($part$$inline_54$$ = $parts$$inline_52$$.shift());) {
    !$parts$$inline_52$$.length && $goog$isDef$$($object$$) ? $cur$$inline_53$$[$part$$inline_54$$] = $object$$ : $cur$$inline_53$$ = $cur$$inline_53$$[$part$$inline_54$$] ? $cur$$inline_53$$[$part$$inline_54$$] : $cur$$inline_53$$[$part$$inline_54$$] = {}
  }
}
function $goog$inherits$$($childCtor$$, $parentCtor$$) {
  function $tempCtor$$() {
  }
  $tempCtor$$.prototype = $parentCtor$$.prototype;
  $childCtor$$.$superClass_$ = $parentCtor$$.prototype;
  $childCtor$$.prototype = new $tempCtor$$;
  $childCtor$$.prototype.constructor = $childCtor$$
}
;var $X$$ = $X$$ || {};
$X$$.$DEV$ = $JSCompiler_alias_TRUE$$;
$X$$.$TIMER$ = function $$X$$$$TIMER$$($what$$) {
  eval("X.DEV === undefined") || window.console.time($what$$)
};
$X$$.$TIMERSTOP$ = function $$X$$$$TIMERSTOP$$($what$$1$$) {
  eval("X.DEV === undefined") || window.console.timeEnd($what$$1$$)
};
window["X.counter"] = new function() {
  this.$_counter$ = 0;
  this.$uniqueId$ = function $this$$uniqueId$$() {
    return this.$_counter$++
  }
};
function $inject$$($a$$2$$, $b$$1$$) {
  for(var $i$$6$$ in $b$$1$$) {
    var $g$$ = $b$$1$$.__lookupGetter__($i$$6$$), $s$$3$$ = $b$$1$$.__lookupSetter__($i$$6$$);
    $i$$6$$ in $a$$2$$ || ($g$$ || $s$$3$$ ? ($g$$ && $a$$2$$.__defineGetter__($i$$6$$, $g$$), $s$$3$$ && $a$$2$$.__defineSetter__($i$$6$$, $s$$3$$)) : $a$$2$$[$i$$6$$] = $b$$1$$[$i$$6$$])
  }
}
var $$$$ = window.$$$;
Function.prototype.bind || (Function.prototype.bind = function $Function$$bind$($oThis$$inline_56$$) {
  function $fBound$$inline_61$$() {
    return $fToBind$$inline_59$$.apply(this instanceof $fNOP$$inline_60$$ ? this : $oThis$$inline_56$$ || window, $aArgs$$inline_58$$.concat($fSlice$$inline_57$$.call(arguments)))
  }
  function $fNOP$$inline_60$$() {
  }
  "function" !== typeof this && $JSCompiler_alias_THROW$$(new TypeError("Function.prototype.bind - what is trying to be bound is not callable"));
  var $fSlice$$inline_57$$ = Array.prototype.slice, $aArgs$$inline_58$$ = $fSlice$$inline_57$$.call(arguments, 1), $fToBind$$inline_59$$ = this;
  $fNOP$$inline_60$$.prototype = this.prototype;
  $fBound$$inline_61$$.prototype = new $fNOP$$inline_60$$;
  return $fBound$$inline_61$$
});
for(var $lastTime$$inline_771$$ = 0, $vendors$$inline_772$$ = ["ms", "moz", "webkit", "o"], $x$$inline_773$$ = 0;$x$$inline_773$$ < $vendors$$inline_772$$.length && !window.requestAnimationFrame;++$x$$inline_773$$) {
  window.requestAnimationFrame = window[$vendors$$inline_772$$[$x$$inline_773$$] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[$vendors$$inline_772$$[$x$$inline_773$$] + "CancelAnimationFrame"] || window[$vendors$$inline_772$$[$x$$inline_773$$] + "CancelRequestAnimationFrame"]
}
window.requestAnimationFrame || (window.requestAnimationFrame = function $window$requestAnimationFrame$($callback$$inline_774$$) {
  var $currTime$$inline_775$$ = Date.now(), $timeToCall$$inline_776$$ = Math.max(0, 16 - ($currTime$$inline_775$$ - $lastTime$$inline_771$$)), $id$$inline_777$$ = window.setTimeout(function() {
    $callback$$inline_774$$($currTime$$inline_775$$ + $timeToCall$$inline_776$$)
  }, $timeToCall$$inline_776$$);
  $lastTime$$inline_771$$ = $currTime$$inline_775$$ + $timeToCall$$inline_776$$;
  return $id$$inline_777$$
});
window.cancelAnimationFrame || (window.cancelAnimationFrame = function $window$cancelAnimationFrame$($id$$inline_778$$) {
  clearTimeout($id$$inline_778$$)
});
"slice" in ArrayBuffer.prototype || (ArrayBuffer.prototype.slice = function $ArrayBuffer$$slice$($start$$inline_81$$, $opt_end$$inline_82$$) {
  $start$$inline_81$$ === $JSCompiler_alias_VOID$$ && $JSCompiler_alias_THROW$$(Error("Not enough arguments."));
  var $end$$inline_83$$ = $opt_end$$inline_82$$ || this.byteLength;
  0 > $start$$inline_81$$ && ($start$$inline_81$$ = this.byteLength + $start$$inline_81$$);
  0 > $end$$inline_83$$ && ($end$$inline_83$$ = this.byteLength + $end$$inline_83$$);
  $end$$inline_83$$ < $start$$inline_81$$ && ($end$$inline_83$$ = $start$$inline_81$$ = 0);
  0 > $start$$inline_81$$ && ($start$$inline_81$$ = 0);
  0 > $end$$inline_83$$ && ($end$$inline_83$$ = 0);
  $start$$inline_81$$ > this.byteLength && ($start$$inline_81$$ = this.byteLength);
  $end$$inline_83$$ > this.byteLength && ($end$$inline_83$$ = this.byteLength);
  for(var $result$$inline_84$$ = new ArrayBuffer($end$$inline_83$$ - $start$$inline_81$$), $inBytes$$inline_85$$ = new Uint8Array(this), $outBytes$$inline_86$$ = new Uint8Array($result$$inline_84$$), $inIndex$$inline_87$$ = $start$$inline_81$$, $outIndex$$inline_88$$ = 0;$inIndex$$inline_87$$ < $end$$inline_83$$;++$inIndex$$inline_87$$, ++$outIndex$$inline_88$$) {
    $outBytes$$inline_86$$[$outIndex$$inline_88$$] = $inBytes$$inline_85$$[$inIndex$$inline_87$$]
  }
  return $result$$inline_84$$
});
$goog$exportSymbol$$("$", $$$$);
$goog$exportSymbol$$("Function.prototype.bind", Function.prototype.bind);
$goog$exportSymbol$$("window.requestAnimationFrame", window.requestAnimationFrame);
$goog$exportSymbol$$("window.cancelAnimationFrame", window.cancelAnimationFrame);
var $goog$events$ListenableKey$counter_$$ = 0;
function $goog$events$Listener$$() {
}
$JSCompiler_prototypeAlias$$ = $goog$events$Listener$$.prototype;
$JSCompiler_prototypeAlias$$.key = 0;
$JSCompiler_prototypeAlias$$.$removed$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$callOnce$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$init$ = function $$JSCompiler_prototypeAlias$$$$init$$($listener$$32$$, $proxy$$, $src$$4$$, $type$$55$$, $capture$$, $opt_handler$$) {
  $goog$isFunction$$($listener$$32$$) ? this.$isFunctionListener_$ = $JSCompiler_alias_TRUE$$ : $listener$$32$$ && $listener$$32$$.handleEvent && $goog$isFunction$$($listener$$32$$.handleEvent) ? this.$isFunctionListener_$ = $JSCompiler_alias_FALSE$$ : $JSCompiler_alias_THROW$$(Error("Invalid listener argument"));
  this.$listener$ = $listener$$32$$;
  this.$proxy$ = $proxy$$;
  this.src = $src$$4$$;
  this.type = $type$$55$$;
  this.capture = !!$capture$$;
  this.$handler$ = $opt_handler$$;
  this.$callOnce$ = $JSCompiler_alias_FALSE$$;
  this.key = ++$goog$events$ListenableKey$counter_$$;
  this.$removed$ = $JSCompiler_alias_FALSE$$
};
$JSCompiler_prototypeAlias$$.handleEvent = function $$JSCompiler_prototypeAlias$$$handleEvent$($eventObject$$) {
  return this.$isFunctionListener_$ ? this.$listener$.call(this.$handler$ || this.src, $eventObject$$) : this.$listener$.handleEvent.call(this.$listener$, $eventObject$$)
};
function $goog$object$forEach$$($obj$$24$$, $f$$) {
  for(var $key$$16$$ in $obj$$24$$) {
    $f$$.call($JSCompiler_alias_VOID$$, $obj$$24$$[$key$$16$$], $key$$16$$, $obj$$24$$)
  }
}
function $goog$object$getValues$$($obj$$33$$) {
  var $res$$2$$ = [], $i$$7$$ = 0, $key$$24$$;
  for($key$$24$$ in $obj$$33$$) {
    $res$$2$$[$i$$7$$++] = $obj$$33$$[$key$$24$$]
  }
  return $res$$2$$
}
var $goog$object$PROTOTYPE_FIELDS_$$ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function $goog$object$extend$$($target$$40$$, $var_args$$31$$) {
  for(var $key$$39$$, $source$$2$$, $i$$11$$ = 1;$i$$11$$ < arguments.length;$i$$11$$++) {
    $source$$2$$ = arguments[$i$$11$$];
    for($key$$39$$ in $source$$2$$) {
      $target$$40$$[$key$$39$$] = $source$$2$$[$key$$39$$]
    }
    for(var $j$$1$$ = 0;$j$$1$$ < $goog$object$PROTOTYPE_FIELDS_$$.length;$j$$1$$++) {
      $key$$39$$ = $goog$object$PROTOTYPE_FIELDS_$$[$j$$1$$], Object.prototype.hasOwnProperty.call($source$$2$$, $key$$39$$) && ($target$$40$$[$key$$39$$] = $source$$2$$[$key$$39$$])
    }
  }
}
;function $goog$string$htmlEscape$$($str$$31$$) {
  if(!$goog$string$allRe_$$.test($str$$31$$)) {
    return $str$$31$$
  }
  -1 != $str$$31$$.indexOf("&") && ($str$$31$$ = $str$$31$$.replace($goog$string$amperRe_$$, "&amp;"));
  -1 != $str$$31$$.indexOf("<") && ($str$$31$$ = $str$$31$$.replace($goog$string$ltRe_$$, "&lt;"));
  -1 != $str$$31$$.indexOf(">") && ($str$$31$$ = $str$$31$$.replace($goog$string$gtRe_$$, "&gt;"));
  -1 != $str$$31$$.indexOf('"') && ($str$$31$$ = $str$$31$$.replace($goog$string$quotRe_$$, "&quot;"));
  return $str$$31$$
}
var $goog$string$amperRe_$$ = /&/g, $goog$string$ltRe_$$ = /</g, $goog$string$gtRe_$$ = />/g, $goog$string$quotRe_$$ = /\"/g, $goog$string$allRe_$$ = /[&<>\"]/;
var $goog$userAgent$detectedOpera_$$, $goog$userAgent$detectedIe_$$, $goog$userAgent$detectedWebkit_$$, $goog$userAgent$detectedGecko_$$, $goog$userAgent$detectedMac_$$, $goog$userAgent$detectedWindows_$$, $goog$userAgent$detectedLinux_$$;
function $goog$userAgent$getUserAgentString$$() {
  return $goog$global$$.navigator ? $goog$global$$.navigator.userAgent : $JSCompiler_alias_NULL$$
}
function $goog$userAgent$getNavigator$$() {
  return $goog$global$$.navigator
}
$goog$userAgent$detectedGecko_$$ = $goog$userAgent$detectedWebkit_$$ = $goog$userAgent$detectedIe_$$ = $goog$userAgent$detectedOpera_$$ = $JSCompiler_alias_FALSE$$;
var $ua$$inline_90$$;
if($ua$$inline_90$$ = $goog$userAgent$getUserAgentString$$()) {
  var $navigator$$inline_91$$ = $goog$userAgent$getNavigator$$();
  $goog$userAgent$detectedOpera_$$ = 0 == $ua$$inline_90$$.indexOf("Opera");
  $goog$userAgent$detectedIe_$$ = !$goog$userAgent$detectedOpera_$$ && -1 != $ua$$inline_90$$.indexOf("MSIE");
  $goog$userAgent$detectedWebkit_$$ = !$goog$userAgent$detectedOpera_$$ && -1 != $ua$$inline_90$$.indexOf("WebKit");
  $goog$userAgent$detectedGecko_$$ = !$goog$userAgent$detectedOpera_$$ && !$goog$userAgent$detectedWebkit_$$ && "Gecko" == $navigator$$inline_91$$.product
}
var $goog$userAgent$OPERA$$ = $goog$userAgent$detectedOpera_$$, $goog$userAgent$IE$$ = $goog$userAgent$detectedIe_$$, $goog$userAgent$GECKO$$ = $goog$userAgent$detectedGecko_$$, $goog$userAgent$WEBKIT$$ = $goog$userAgent$detectedWebkit_$$, $goog$userAgent$PLATFORM$$, $navigator$$inline_93$$ = $goog$userAgent$getNavigator$$();
$goog$userAgent$PLATFORM$$ = $navigator$$inline_93$$ && $navigator$$inline_93$$.platform || "";
$goog$userAgent$detectedMac_$$ = -1 != $goog$userAgent$PLATFORM$$.indexOf("Mac");
$goog$userAgent$detectedWindows_$$ = -1 != $goog$userAgent$PLATFORM$$.indexOf("Win");
$goog$userAgent$detectedLinux_$$ = -1 != $goog$userAgent$PLATFORM$$.indexOf("Linux");
var $goog$userAgent$X11$$ = !!$goog$userAgent$getNavigator$$() && -1 != ($goog$userAgent$getNavigator$$().appVersion || "").indexOf("X11");
function $goog$userAgent$getDocumentMode_$$() {
  var $doc$$4$$ = $goog$global$$.document;
  return $doc$$4$$ ? $doc$$4$$.documentMode : $JSCompiler_alias_VOID$$
}
var $goog$userAgent$VERSION$$;
a: {
  var $version$$inline_96$$ = "", $re$$inline_97$$;
  if($goog$userAgent$OPERA$$ && $goog$global$$.opera) {
    var $operaVersion$$inline_98$$ = $goog$global$$.opera.version, $version$$inline_96$$ = "function" == typeof $operaVersion$$inline_98$$ ? $operaVersion$$inline_98$$() : $operaVersion$$inline_98$$
  }else {
    if($goog$userAgent$GECKO$$ ? $re$$inline_97$$ = /rv\:([^\);]+)(\)|;)/ : $goog$userAgent$IE$$ ? $re$$inline_97$$ = /MSIE\s+([^\);]+)(\)|;)/ : $goog$userAgent$WEBKIT$$ && ($re$$inline_97$$ = /WebKit\/(\S+)/), $re$$inline_97$$) {
      var $arr$$inline_99$$ = $re$$inline_97$$.exec($goog$userAgent$getUserAgentString$$()), $version$$inline_96$$ = $arr$$inline_99$$ ? $arr$$inline_99$$[1] : ""
    }
  }
  if($goog$userAgent$IE$$) {
    var $docMode$$inline_100$$ = $goog$userAgent$getDocumentMode_$$();
    if($docMode$$inline_100$$ > parseFloat($version$$inline_96$$)) {
      $goog$userAgent$VERSION$$ = String($docMode$$inline_100$$);
      break a
    }
  }
  $goog$userAgent$VERSION$$ = $version$$inline_96$$
}
var $goog$userAgent$isVersionOrHigherCache_$$ = {};
function $goog$userAgent$isVersionOrHigher$$($version$$8$$) {
  var $JSCompiler_temp$$43_order$$inline_104$$;
  if(!($JSCompiler_temp$$43_order$$inline_104$$ = $goog$userAgent$isVersionOrHigherCache_$$[$version$$8$$])) {
    $JSCompiler_temp$$43_order$$inline_104$$ = 0;
    for(var $v1Subs$$inline_105$$ = String($goog$userAgent$VERSION$$).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), $v2Subs$$inline_106$$ = String($version$$8$$).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), $subCount$$inline_107$$ = Math.max($v1Subs$$inline_105$$.length, $v2Subs$$inline_106$$.length), $subIdx$$inline_108$$ = 0;0 == $JSCompiler_temp$$43_order$$inline_104$$ && $subIdx$$inline_108$$ < $subCount$$inline_107$$;$subIdx$$inline_108$$++) {
      var $v1Sub$$inline_109$$ = $v1Subs$$inline_105$$[$subIdx$$inline_108$$] || "", $v2Sub$$inline_110$$ = $v2Subs$$inline_106$$[$subIdx$$inline_108$$] || "", $v1CompParser$$inline_111$$ = RegExp("(\\d*)(\\D*)", "g"), $v2CompParser$$inline_112$$ = RegExp("(\\d*)(\\D*)", "g");
      do {
        var $v1Comp$$inline_113$$ = $v1CompParser$$inline_111$$.exec($v1Sub$$inline_109$$) || ["", "", ""], $v2Comp$$inline_114$$ = $v2CompParser$$inline_112$$.exec($v2Sub$$inline_110$$) || ["", "", ""];
        if(0 == $v1Comp$$inline_113$$[0].length && 0 == $v2Comp$$inline_114$$[0].length) {
          break
        }
        $JSCompiler_temp$$43_order$$inline_104$$ = ((0 == $v1Comp$$inline_113$$[1].length ? 0 : parseInt($v1Comp$$inline_113$$[1], 10)) < (0 == $v2Comp$$inline_114$$[1].length ? 0 : parseInt($v2Comp$$inline_114$$[1], 10)) ? -1 : (0 == $v1Comp$$inline_113$$[1].length ? 0 : parseInt($v1Comp$$inline_113$$[1], 10)) > (0 == $v2Comp$$inline_114$$[1].length ? 0 : parseInt($v2Comp$$inline_114$$[1], 10)) ? 1 : 0) || ((0 == $v1Comp$$inline_113$$[2].length) < (0 == $v2Comp$$inline_114$$[2].length) ? -1 : (0 == 
        $v1Comp$$inline_113$$[2].length) > (0 == $v2Comp$$inline_114$$[2].length) ? 1 : 0) || ($v1Comp$$inline_113$$[2] < $v2Comp$$inline_114$$[2] ? -1 : $v1Comp$$inline_113$$[2] > $v2Comp$$inline_114$$[2] ? 1 : 0)
      }while(0 == $JSCompiler_temp$$43_order$$inline_104$$)
    }
    $JSCompiler_temp$$43_order$$inline_104$$ = $goog$userAgent$isVersionOrHigherCache_$$[$version$$8$$] = 0 <= $JSCompiler_temp$$43_order$$inline_104$$
  }
  return $JSCompiler_temp$$43_order$$inline_104$$
}
var $doc$$inline_116$$ = $goog$global$$.document, $goog$userAgent$DOCUMENT_MODE$$ = !$doc$$inline_116$$ || !$goog$userAgent$IE$$ ? $JSCompiler_alias_VOID$$ : $goog$userAgent$getDocumentMode_$$() || ("CSS1Compat" == $doc$$inline_116$$.compatMode ? parseInt($goog$userAgent$VERSION$$, 10) : 5);
var $goog$events$BrowserFeature$HAS_W3C_EVENT_SUPPORT$$ = !$goog$userAgent$IE$$ || $goog$userAgent$IE$$ && 9 <= $goog$userAgent$DOCUMENT_MODE$$, $goog$events$BrowserFeature$SET_KEY_CODE_TO_PREVENT_DEFAULT$$ = $goog$userAgent$IE$$ && !$goog$userAgent$isVersionOrHigher$$("9");
!$goog$userAgent$WEBKIT$$ || $goog$userAgent$isVersionOrHigher$$("528");
$goog$userAgent$GECKO$$ && $goog$userAgent$isVersionOrHigher$$("1.9b") || $goog$userAgent$IE$$ && $goog$userAgent$isVersionOrHigher$$("8") || $goog$userAgent$OPERA$$ && $goog$userAgent$isVersionOrHigher$$("9.5") || $goog$userAgent$WEBKIT$$ && $goog$userAgent$isVersionOrHigher$$("528");
$goog$userAgent$GECKO$$ && !$goog$userAgent$isVersionOrHigher$$("8") || $goog$userAgent$IE$$ && $goog$userAgent$isVersionOrHigher$$("9");
var $goog$array$ARRAY_PROTOTYPE_$$ = Array.prototype, $goog$array$indexOf$$ = $goog$array$ARRAY_PROTOTYPE_$$.indexOf ? function($arr$$11$$, $obj$$53$$, $opt_fromIndex$$6$$) {
  return $goog$array$ARRAY_PROTOTYPE_$$.indexOf.call($arr$$11$$, $obj$$53$$, $opt_fromIndex$$6$$)
} : function($arr$$12$$, $obj$$54$$, $fromIndex_i$$21_opt_fromIndex$$7$$) {
  $fromIndex_i$$21_opt_fromIndex$$7$$ = $fromIndex_i$$21_opt_fromIndex$$7$$ == $JSCompiler_alias_NULL$$ ? 0 : 0 > $fromIndex_i$$21_opt_fromIndex$$7$$ ? Math.max(0, $arr$$12$$.length + $fromIndex_i$$21_opt_fromIndex$$7$$) : $fromIndex_i$$21_opt_fromIndex$$7$$;
  if($goog$isString$$($arr$$12$$)) {
    return!$goog$isString$$($obj$$54$$) || 1 != $obj$$54$$.length ? -1 : $arr$$12$$.indexOf($obj$$54$$, $fromIndex_i$$21_opt_fromIndex$$7$$)
  }
  for(;$fromIndex_i$$21_opt_fromIndex$$7$$ < $arr$$12$$.length;$fromIndex_i$$21_opt_fromIndex$$7$$++) {
    if($fromIndex_i$$21_opt_fromIndex$$7$$ in $arr$$12$$ && $arr$$12$$[$fromIndex_i$$21_opt_fromIndex$$7$$] === $obj$$54$$) {
      return $fromIndex_i$$21_opt_fromIndex$$7$$
    }
  }
  return-1
}, $goog$array$forEach$$ = $goog$array$ARRAY_PROTOTYPE_$$.forEach ? function($arr$$15$$, $f$$7$$, $opt_obj$$6$$) {
  $goog$array$ARRAY_PROTOTYPE_$$.forEach.call($arr$$15$$, $f$$7$$, $opt_obj$$6$$)
} : function($arr$$16$$, $f$$8$$, $opt_obj$$7$$) {
  for(var $l$$2$$ = $arr$$16$$.length, $arr2$$ = $goog$isString$$($arr$$16$$) ? $arr$$16$$.split("") : $arr$$16$$, $i$$23$$ = 0;$i$$23$$ < $l$$2$$;$i$$23$$++) {
    $i$$23$$ in $arr2$$ && $f$$8$$.call($opt_obj$$7$$, $arr2$$[$i$$23$$], $i$$23$$, $arr$$16$$)
  }
}, $goog$array$map$$ = $goog$array$ARRAY_PROTOTYPE_$$.map ? function($arr$$20$$, $f$$12$$, $opt_obj$$11$$) {
  return $goog$array$ARRAY_PROTOTYPE_$$.map.call($arr$$20$$, $f$$12$$, $opt_obj$$11$$)
} : function($arr$$21$$, $f$$13$$, $opt_obj$$12$$) {
  for(var $l$$5$$ = $arr$$21$$.length, $res$$6$$ = Array($l$$5$$), $arr2$$3$$ = $goog$isString$$($arr$$21$$) ? $arr$$21$$.split("") : $arr$$21$$, $i$$26$$ = 0;$i$$26$$ < $l$$5$$;$i$$26$$++) {
    $i$$26$$ in $arr2$$3$$ && ($res$$6$$[$i$$26$$] = $f$$13$$.call($opt_obj$$12$$, $arr2$$3$$[$i$$26$$], $i$$26$$, $arr$$21$$))
  }
  return $res$$6$$
}, $goog$array$some$$ = $goog$array$ARRAY_PROTOTYPE_$$.some ? function($arr$$24$$, $f$$16$$, $opt_obj$$15$$) {
  return $goog$array$ARRAY_PROTOTYPE_$$.some.call($arr$$24$$, $f$$16$$, $opt_obj$$15$$)
} : function($arr$$25$$, $f$$17$$, $opt_obj$$16$$) {
  for(var $l$$6$$ = $arr$$25$$.length, $arr2$$4$$ = $goog$isString$$($arr$$25$$) ? $arr$$25$$.split("") : $arr$$25$$, $i$$27$$ = 0;$i$$27$$ < $l$$6$$;$i$$27$$++) {
    if($i$$27$$ in $arr2$$4$$ && $f$$17$$.call($opt_obj$$16$$, $arr2$$4$$[$i$$27$$], $i$$27$$, $arr$$25$$)) {
      return $JSCompiler_alias_TRUE$$
    }
  }
  return $JSCompiler_alias_FALSE$$
};
function $goog$array$remove$$($arr$$41$$, $obj$$61$$) {
  var $i$$35$$ = $goog$array$indexOf$$($arr$$41$$, $obj$$61$$);
  0 <= $i$$35$$ && $goog$array$ARRAY_PROTOTYPE_$$.splice.call($arr$$41$$, $i$$35$$, 1)
}
function $goog$array$slice$$($arr$$45$$, $start$$6$$, $opt_end$$14$$) {
  return 2 >= arguments.length ? $goog$array$ARRAY_PROTOTYPE_$$.slice.call($arr$$45$$, $start$$6$$) : $goog$array$ARRAY_PROTOTYPE_$$.slice.call($arr$$45$$, $start$$6$$, $opt_end$$14$$)
}
;function $goog$Disposable$$() {
  0 != $goog$Disposable$MonitoringMode$OFF$$ && (this.$creationStack$ = Error().stack, $goog$getUid$$(this))
}
var $goog$Disposable$MonitoringMode$OFF$$ = 0;
function $goog$events$Event$$($type$$58$$, $opt_target$$1$$) {
  this.type = $type$$58$$;
  this.currentTarget = this.target = $opt_target$$1$$
}
$JSCompiler_prototypeAlias$$ = $goog$events$Event$$.prototype;
$JSCompiler_prototypeAlias$$.$propagationStopped_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.defaultPrevented = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$returnValue_$ = $JSCompiler_alias_TRUE$$;
$JSCompiler_prototypeAlias$$.stopPropagation = function $$JSCompiler_prototypeAlias$$$stopPropagation$() {
  this.$propagationStopped_$ = $JSCompiler_alias_TRUE$$
};
$JSCompiler_prototypeAlias$$.preventDefault = function $$JSCompiler_prototypeAlias$$$preventDefault$() {
  this.defaultPrevented = $JSCompiler_alias_TRUE$$;
  this.$returnValue_$ = $JSCompiler_alias_FALSE$$
};
function $goog$reflect$sinkValue$$($x$$57$$) {
  $goog$reflect$sinkValue$$[" "]($x$$57$$);
  return $x$$57$$
}
$goog$reflect$sinkValue$$[" "] = $goog$nullFunction$$;
function $goog$events$BrowserEvent$$($opt_e$$, $opt_currentTarget$$) {
  $opt_e$$ && this.$init$($opt_e$$, $opt_currentTarget$$)
}
$goog$inherits$$($goog$events$BrowserEvent$$, $goog$events$Event$$);
$JSCompiler_prototypeAlias$$ = $goog$events$BrowserEvent$$.prototype;
$JSCompiler_prototypeAlias$$.target = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.relatedTarget = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.offsetX = 0;
$JSCompiler_prototypeAlias$$.offsetY = 0;
$JSCompiler_prototypeAlias$$.clientX = 0;
$JSCompiler_prototypeAlias$$.clientY = 0;
$JSCompiler_prototypeAlias$$.screenX = 0;
$JSCompiler_prototypeAlias$$.screenY = 0;
$JSCompiler_prototypeAlias$$.button = 0;
$JSCompiler_prototypeAlias$$.keyCode = 0;
$JSCompiler_prototypeAlias$$.charCode = 0;
$JSCompiler_prototypeAlias$$.ctrlKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.altKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.shiftKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.metaKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$platformModifierKey$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$event_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$init$ = function $$JSCompiler_prototypeAlias$$$$init$$($e$$15$$, $opt_currentTarget$$1$$) {
  var $type$$60$$ = this.type = $e$$15$$.type;
  $goog$events$Event$$.call(this, $type$$60$$);
  this.target = $e$$15$$.target || $e$$15$$.srcElement;
  this.currentTarget = $opt_currentTarget$$1$$;
  var $relatedTarget$$ = $e$$15$$.relatedTarget;
  if($relatedTarget$$) {
    if($goog$userAgent$GECKO$$) {
      var $JSCompiler_inline_result$$18$$;
      a: {
        try {
          $goog$reflect$sinkValue$$($relatedTarget$$.nodeName);
          $JSCompiler_inline_result$$18$$ = $JSCompiler_alias_TRUE$$;
          break a
        }catch($e$$inline_123$$) {
        }
        $JSCompiler_inline_result$$18$$ = $JSCompiler_alias_FALSE$$
      }
      $JSCompiler_inline_result$$18$$ || ($relatedTarget$$ = $JSCompiler_alias_NULL$$)
    }
  }else {
    "mouseover" == $type$$60$$ ? $relatedTarget$$ = $e$$15$$.fromElement : "mouseout" == $type$$60$$ && ($relatedTarget$$ = $e$$15$$.toElement)
  }
  this.relatedTarget = $relatedTarget$$;
  this.offsetX = $goog$userAgent$WEBKIT$$ || $e$$15$$.offsetX !== $JSCompiler_alias_VOID$$ ? $e$$15$$.offsetX : $e$$15$$.layerX;
  this.offsetY = $goog$userAgent$WEBKIT$$ || $e$$15$$.offsetY !== $JSCompiler_alias_VOID$$ ? $e$$15$$.offsetY : $e$$15$$.layerY;
  this.clientX = $e$$15$$.clientX !== $JSCompiler_alias_VOID$$ ? $e$$15$$.clientX : $e$$15$$.pageX;
  this.clientY = $e$$15$$.clientY !== $JSCompiler_alias_VOID$$ ? $e$$15$$.clientY : $e$$15$$.pageY;
  this.screenX = $e$$15$$.screenX || 0;
  this.screenY = $e$$15$$.screenY || 0;
  this.button = $e$$15$$.button;
  this.keyCode = $e$$15$$.keyCode || 0;
  this.charCode = $e$$15$$.charCode || ("keypress" == $type$$60$$ ? $e$$15$$.keyCode : 0);
  this.ctrlKey = $e$$15$$.ctrlKey;
  this.altKey = $e$$15$$.altKey;
  this.shiftKey = $e$$15$$.shiftKey;
  this.metaKey = $e$$15$$.metaKey;
  this.$platformModifierKey$ = $goog$userAgent$detectedMac_$$ ? $e$$15$$.metaKey : $e$$15$$.ctrlKey;
  this.state = $e$$15$$.state;
  this.$event_$ = $e$$15$$;
  $e$$15$$.defaultPrevented && this.preventDefault();
  delete this.$propagationStopped_$
};
$JSCompiler_prototypeAlias$$.stopPropagation = function $$JSCompiler_prototypeAlias$$$stopPropagation$() {
  $goog$events$BrowserEvent$$.$superClass_$.stopPropagation.call(this);
  this.$event_$.stopPropagation ? this.$event_$.stopPropagation() : this.$event_$.cancelBubble = $JSCompiler_alias_TRUE$$
};
$JSCompiler_prototypeAlias$$.preventDefault = function $$JSCompiler_prototypeAlias$$$preventDefault$() {
  $goog$events$BrowserEvent$$.$superClass_$.preventDefault.call(this);
  var $be$$ = this.$event_$;
  if($be$$.preventDefault) {
    $be$$.preventDefault()
  }else {
    if($be$$.returnValue = $JSCompiler_alias_FALSE$$, $goog$events$BrowserFeature$SET_KEY_CODE_TO_PREVENT_DEFAULT$$) {
      try {
        if($be$$.ctrlKey || 112 <= $be$$.keyCode && 123 >= $be$$.keyCode) {
          $be$$.keyCode = -1
        }
      }catch($ex$$1$$) {
      }
    }
  }
};
$JSCompiler_prototypeAlias$$.$getBrowserEvent$ = $JSCompiler_get$$("$event_$");
var $goog$events$listeners_$$ = {}, $goog$events$listenerTree_$$ = {}, $goog$events$sources_$$ = {}, $goog$events$onStringMap_$$ = {};
function $goog$events$listen$$($listenableKey_src$$5$$, $key$$43_type$$61$$, $listener$$33$$, $opt_capt$$, $opt_handler$$1$$) {
  if($goog$isArray$$($key$$43_type$$61$$)) {
    for(var $i$$54$$ = 0;$i$$54$$ < $key$$43_type$$61$$.length;$i$$54$$++) {
      $goog$events$listen$$($listenableKey_src$$5$$, $key$$43_type$$61$$[$i$$54$$], $listener$$33$$, $opt_capt$$, $opt_handler$$1$$)
    }
    return $JSCompiler_alias_NULL$$
  }
  $listenableKey_src$$5$$ = $goog$events$listen_$$($listenableKey_src$$5$$, $key$$43_type$$61$$, $listener$$33$$, $JSCompiler_alias_FALSE$$, $opt_capt$$, $opt_handler$$1$$);
  $key$$43_type$$61$$ = $listenableKey_src$$5$$.key;
  $goog$events$listeners_$$[$key$$43_type$$61$$] = $listenableKey_src$$5$$;
  return $key$$43_type$$61$$
}
function $goog$events$listen_$$($src$$6$$, $type$$62$$, $listener$$34$$, $callOnce$$, $capture$$1_opt_capt$$1$$, $opt_handler$$2$$) {
  $type$$62$$ || $JSCompiler_alias_THROW$$(Error("Invalid event type"));
  $capture$$1_opt_capt$$1$$ = !!$capture$$1_opt_capt$$1$$;
  var $listenerObj_map$$ = $goog$events$listenerTree_$$;
  $type$$62$$ in $listenerObj_map$$ || ($listenerObj_map$$[$type$$62$$] = {$count_$:0, $remaining_$:0});
  $listenerObj_map$$ = $listenerObj_map$$[$type$$62$$];
  $capture$$1_opt_capt$$1$$ in $listenerObj_map$$ || ($listenerObj_map$$[$capture$$1_opt_capt$$1$$] = {$count_$:0, $remaining_$:0}, $listenerObj_map$$.$count_$++);
  var $listenerObj_map$$ = $listenerObj_map$$[$capture$$1_opt_capt$$1$$], $srcUid$$ = $goog$getUid$$($src$$6$$), $listenerArray$$;
  $listenerObj_map$$.$remaining_$++;
  if($listenerObj_map$$[$srcUid$$]) {
    $listenerArray$$ = $listenerObj_map$$[$srcUid$$];
    for(var $i$$55_proxy$$1$$ = 0;$i$$55_proxy$$1$$ < $listenerArray$$.length;$i$$55_proxy$$1$$++) {
      if($listenerObj_map$$ = $listenerArray$$[$i$$55_proxy$$1$$], $listenerObj_map$$.$listener$ == $listener$$34$$ && $listenerObj_map$$.$handler$ == $opt_handler$$2$$) {
        if($listenerObj_map$$.$removed$) {
          break
        }
        $callOnce$$ || ($listenerArray$$[$i$$55_proxy$$1$$].$callOnce$ = $JSCompiler_alias_FALSE$$);
        return $listenerArray$$[$i$$55_proxy$$1$$]
      }
    }
  }else {
    $listenerArray$$ = $listenerObj_map$$[$srcUid$$] = [], $listenerObj_map$$.$count_$++
  }
  var $proxyCallbackFunction$$inline_125$$ = $goog$events$handleBrowserEvent_$$, $f$$inline_126$$ = $goog$events$BrowserFeature$HAS_W3C_EVENT_SUPPORT$$ ? function($eventObject$$inline_127$$) {
    return $proxyCallbackFunction$$inline_125$$.call($f$$inline_126$$.src, $f$$inline_126$$.$listener$, $eventObject$$inline_127$$)
  } : function($eventObject$$inline_128_v$$inline_129$$) {
    $eventObject$$inline_128_v$$inline_129$$ = $proxyCallbackFunction$$inline_125$$.call($f$$inline_126$$.src, $f$$inline_126$$.$listener$, $eventObject$$inline_128_v$$inline_129$$);
    if(!$eventObject$$inline_128_v$$inline_129$$) {
      return $eventObject$$inline_128_v$$inline_129$$
    }
  }, $i$$55_proxy$$1$$ = $f$$inline_126$$, $listenerObj_map$$ = new $goog$events$Listener$$;
  $listenerObj_map$$.$init$($listener$$34$$, $i$$55_proxy$$1$$, $src$$6$$, $type$$62$$, $capture$$1_opt_capt$$1$$, $opt_handler$$2$$);
  $listenerObj_map$$.$callOnce$ = $callOnce$$;
  $i$$55_proxy$$1$$.src = $src$$6$$;
  $i$$55_proxy$$1$$.$listener$ = $listenerObj_map$$;
  $listenerArray$$.push($listenerObj_map$$);
  $goog$events$sources_$$[$srcUid$$] || ($goog$events$sources_$$[$srcUid$$] = []);
  $goog$events$sources_$$[$srcUid$$].push($listenerObj_map$$);
  $src$$6$$.addEventListener ? ($src$$6$$ == $goog$global$$ || !$src$$6$$.customEvent_) && $src$$6$$.addEventListener($type$$62$$, $i$$55_proxy$$1$$, $capture$$1_opt_capt$$1$$) : $src$$6$$.attachEvent($type$$62$$ in $goog$events$onStringMap_$$ ? $goog$events$onStringMap_$$[$type$$62$$] : $goog$events$onStringMap_$$[$type$$62$$] = "on" + $type$$62$$, $i$$55_proxy$$1$$);
  return $listenerObj_map$$
}
function $goog$events$listenOnce$$($listenableKey$$1_src$$7$$, $type$$63$$, $listener$$35$$, $opt_capt$$2$$, $opt_handler$$3$$) {
  if($goog$isArray$$($type$$63$$)) {
    for(var $i$$56$$ = 0;$i$$56$$ < $type$$63$$.length;$i$$56$$++) {
      $goog$events$listenOnce$$($listenableKey$$1_src$$7$$, $type$$63$$[$i$$56$$], $listener$$35$$, $opt_capt$$2$$, $opt_handler$$3$$)
    }
  }else {
    $listenableKey$$1_src$$7$$ = $goog$events$listen_$$($listenableKey$$1_src$$7$$, $type$$63$$, $listener$$35$$, $JSCompiler_alias_TRUE$$, $opt_capt$$2$$, $opt_handler$$3$$), $goog$events$listeners_$$[$listenableKey$$1_src$$7$$.key] = $listenableKey$$1_src$$7$$
  }
}
function $goog$events$unlisten$$($listenerArray$$1_objUid$$inline_137_src$$9$$, $type$$64$$, $listener$$37$$, $capture$$2_opt_capt$$4$$, $opt_handler$$5$$) {
  if($goog$isArray$$($type$$64$$)) {
    for(var $i$$57_map$$inline_136$$ = 0;$i$$57_map$$inline_136$$ < $type$$64$$.length;$i$$57_map$$inline_136$$++) {
      $goog$events$unlisten$$($listenerArray$$1_objUid$$inline_137_src$$9$$, $type$$64$$[$i$$57_map$$inline_136$$], $listener$$37$$, $capture$$2_opt_capt$$4$$, $opt_handler$$5$$)
    }
  }else {
    $capture$$2_opt_capt$$4$$ = !!$capture$$2_opt_capt$$4$$;
    a: {
      $i$$57_map$$inline_136$$ = $goog$events$listenerTree_$$;
      if($type$$64$$ in $i$$57_map$$inline_136$$ && ($i$$57_map$$inline_136$$ = $i$$57_map$$inline_136$$[$type$$64$$], $capture$$2_opt_capt$$4$$ in $i$$57_map$$inline_136$$ && ($i$$57_map$$inline_136$$ = $i$$57_map$$inline_136$$[$capture$$2_opt_capt$$4$$], $listenerArray$$1_objUid$$inline_137_src$$9$$ = $goog$getUid$$($listenerArray$$1_objUid$$inline_137_src$$9$$), $i$$57_map$$inline_136$$[$listenerArray$$1_objUid$$inline_137_src$$9$$]))) {
        $listenerArray$$1_objUid$$inline_137_src$$9$$ = $i$$57_map$$inline_136$$[$listenerArray$$1_objUid$$inline_137_src$$9$$];
        break a
      }
      $listenerArray$$1_objUid$$inline_137_src$$9$$ = $JSCompiler_alias_NULL$$
    }
    if($listenerArray$$1_objUid$$inline_137_src$$9$$) {
      for($i$$57_map$$inline_136$$ = 0;$i$$57_map$$inline_136$$ < $listenerArray$$1_objUid$$inline_137_src$$9$$.length;$i$$57_map$$inline_136$$++) {
        if($listenerArray$$1_objUid$$inline_137_src$$9$$[$i$$57_map$$inline_136$$].$listener$ == $listener$$37$$ && $listenerArray$$1_objUid$$inline_137_src$$9$$[$i$$57_map$$inline_136$$].capture == $capture$$2_opt_capt$$4$$ && $listenerArray$$1_objUid$$inline_137_src$$9$$[$i$$57_map$$inline_136$$].$handler$ == $opt_handler$$5$$) {
          $goog$events$unlistenByKey$$($listenerArray$$1_objUid$$inline_137_src$$9$$[$i$$57_map$$inline_136$$].key);
          break
        }
      }
    }
  }
}
function $goog$events$unlistenByKey$$($key$$45$$) {
  var $listener$$38_listenerArray$$2$$ = $goog$events$listeners_$$[$key$$45$$];
  if(!$listener$$38_listenerArray$$2$$ || $listener$$38_listenerArray$$2$$.$removed$) {
    return $JSCompiler_alias_FALSE$$
  }
  var $src$$10_srcUid$$1$$ = $listener$$38_listenerArray$$2$$.src, $type$$65$$ = $listener$$38_listenerArray$$2$$.type, $proxy$$2_sourcesArray$$ = $listener$$38_listenerArray$$2$$.$proxy$, $capture$$3$$ = $listener$$38_listenerArray$$2$$.capture;
  $src$$10_srcUid$$1$$.removeEventListener ? ($src$$10_srcUid$$1$$ == $goog$global$$ || !$src$$10_srcUid$$1$$.customEvent_) && $src$$10_srcUid$$1$$.removeEventListener($type$$65$$, $proxy$$2_sourcesArray$$, $capture$$3$$) : $src$$10_srcUid$$1$$.detachEvent && $src$$10_srcUid$$1$$.detachEvent($type$$65$$ in $goog$events$onStringMap_$$ ? $goog$events$onStringMap_$$[$type$$65$$] : $goog$events$onStringMap_$$[$type$$65$$] = "on" + $type$$65$$, $proxy$$2_sourcesArray$$);
  $src$$10_srcUid$$1$$ = $goog$getUid$$($src$$10_srcUid$$1$$);
  $goog$events$sources_$$[$src$$10_srcUid$$1$$] && ($proxy$$2_sourcesArray$$ = $goog$events$sources_$$[$src$$10_srcUid$$1$$], $goog$array$remove$$($proxy$$2_sourcesArray$$, $listener$$38_listenerArray$$2$$), 0 == $proxy$$2_sourcesArray$$.length && delete $goog$events$sources_$$[$src$$10_srcUid$$1$$]);
  $listener$$38_listenerArray$$2$$.$removed$ = $JSCompiler_alias_TRUE$$;
  if($listener$$38_listenerArray$$2$$ = $goog$events$listenerTree_$$[$type$$65$$][$capture$$3$$][$src$$10_srcUid$$1$$]) {
    $listener$$38_listenerArray$$2$$.$needsCleanup_$ = $JSCompiler_alias_TRUE$$, $goog$events$cleanUp_$$($type$$65$$, $capture$$3$$, $src$$10_srcUid$$1$$, $listener$$38_listenerArray$$2$$)
  }
  delete $goog$events$listeners_$$[$key$$45$$];
  return $JSCompiler_alias_TRUE$$
}
function $goog$events$cleanUp_$$($type$$66$$, $capture$$4$$, $srcUid$$2$$, $listenerArray$$3$$) {
  if(!$listenerArray$$3$$.$locked_$ && $listenerArray$$3$$.$needsCleanup_$) {
    for(var $oldIndex$$ = 0, $newIndex$$ = 0;$oldIndex$$ < $listenerArray$$3$$.length;$oldIndex$$++) {
      $listenerArray$$3$$[$oldIndex$$].$removed$ ? $listenerArray$$3$$[$oldIndex$$].$proxy$.src = $JSCompiler_alias_NULL$$ : ($oldIndex$$ != $newIndex$$ && ($listenerArray$$3$$[$newIndex$$] = $listenerArray$$3$$[$oldIndex$$]), $newIndex$$++)
    }
    $listenerArray$$3$$.length = $newIndex$$;
    $listenerArray$$3$$.$needsCleanup_$ = $JSCompiler_alias_FALSE$$;
    0 == $newIndex$$ && (delete $goog$events$listenerTree_$$[$type$$66$$][$capture$$4$$][$srcUid$$2$$], $goog$events$listenerTree_$$[$type$$66$$][$capture$$4$$].$count_$--, 0 == $goog$events$listenerTree_$$[$type$$66$$][$capture$$4$$].$count_$ && (delete $goog$events$listenerTree_$$[$type$$66$$][$capture$$4$$], $goog$events$listenerTree_$$[$type$$66$$].$count_$--), 0 == $goog$events$listenerTree_$$[$type$$66$$].$count_$ && delete $goog$events$listenerTree_$$[$type$$66$$])
  }
}
function $goog$events$hasListener$$($obj$$67$$, $opt_type$$6$$) {
  var $objUid$$1$$ = $goog$getUid$$($obj$$67$$), $listeners_map$$2$$ = $goog$events$sources_$$[$objUid$$1$$];
  if($listeners_map$$2$$) {
    var $hasType$$ = $goog$isDef$$($opt_type$$6$$), $hasCapture$$ = $goog$isDef$$($JSCompiler_alias_VOID$$);
    return $hasType$$ && $hasCapture$$ ? ($listeners_map$$2$$ = $goog$events$listenerTree_$$[$opt_type$$6$$], !!$listeners_map$$2$$ && !!$listeners_map$$2$$[$JSCompiler_alias_VOID$$] && $objUid$$1$$ in $listeners_map$$2$$[$JSCompiler_alias_VOID$$]) : !$hasType$$ && !$hasCapture$$ ? $JSCompiler_alias_TRUE$$ : $goog$array$some$$($listeners_map$$2$$, function($listener$$44$$) {
      return $hasType$$ && $listener$$44$$.type == $opt_type$$6$$ || $hasCapture$$ && $listener$$44$$.capture == $JSCompiler_alias_VOID$$
    })
  }
  return $JSCompiler_alias_FALSE$$
}
function $goog$events$fireListeners_$$($map$$4$$, $obj$$69_objUid$$2$$, $type$$72$$, $capture$$9$$, $eventObject$$4$$) {
  var $retval$$ = 1;
  $obj$$69_objUid$$2$$ = $goog$getUid$$($obj$$69_objUid$$2$$);
  if($map$$4$$[$obj$$69_objUid$$2$$]) {
    var $remaining$$ = --$map$$4$$.$remaining_$, $listenerArray$$5$$ = $map$$4$$[$obj$$69_objUid$$2$$];
    $listenerArray$$5$$.$locked_$ ? $listenerArray$$5$$.$locked_$++ : $listenerArray$$5$$.$locked_$ = 1;
    try {
      for(var $length$$16$$ = $listenerArray$$5$$.length, $i$$60$$ = 0;$i$$60$$ < $length$$16$$;$i$$60$$++) {
        var $listener$$45$$ = $listenerArray$$5$$[$i$$60$$];
        $listener$$45$$ && !$listener$$45$$.$removed$ && ($retval$$ &= $goog$events$fireListener$$($listener$$45$$, $eventObject$$4$$) !== $JSCompiler_alias_FALSE$$)
      }
    }finally {
      $map$$4$$.$remaining_$ = Math.max($remaining$$, $map$$4$$.$remaining_$), $listenerArray$$5$$.$locked_$--, $goog$events$cleanUp_$$($type$$72$$, $capture$$9$$, $obj$$69_objUid$$2$$, $listenerArray$$5$$)
    }
  }
  return Boolean($retval$$)
}
function $goog$events$fireListener$$($listener$$46$$, $eventObject$$5$$) {
  $listener$$46$$.$callOnce$ && $goog$events$unlistenByKey$$($listener$$46$$.key);
  return $listener$$46$$.handleEvent($eventObject$$5$$)
}
function $goog$events$handleBrowserEvent_$$($listener$$47$$, $opt_evt$$) {
  if($listener$$47$$.$removed$) {
    return $JSCompiler_alias_TRUE$$
  }
  var $be$$1_type$$74$$ = $listener$$47$$.type, $map$$6$$ = $goog$events$listenerTree_$$;
  if(!($be$$1_type$$74$$ in $map$$6$$)) {
    return $JSCompiler_alias_TRUE$$
  }
  var $map$$6$$ = $map$$6$$[$be$$1_type$$74$$], $ieEvent_part$$inline_145_retval$$1$$, $targetsMap$$1$$;
  if(!$goog$events$BrowserFeature$HAS_W3C_EVENT_SUPPORT$$) {
    var $JSCompiler_temp$$8_hasCapture$$2_parts$$inline_143$$;
    if(!($JSCompiler_temp$$8_hasCapture$$2_parts$$inline_143$$ = $opt_evt$$)) {
      a: {
        $JSCompiler_temp$$8_hasCapture$$2_parts$$inline_143$$ = ["window", "event"];
        for(var $cur$$inline_144_hasBubble$$1$$ = $goog$global$$;$ieEvent_part$$inline_145_retval$$1$$ = $JSCompiler_temp$$8_hasCapture$$2_parts$$inline_143$$.shift();) {
          if($cur$$inline_144_hasBubble$$1$$[$ieEvent_part$$inline_145_retval$$1$$] != $JSCompiler_alias_NULL$$) {
            $cur$$inline_144_hasBubble$$1$$ = $cur$$inline_144_hasBubble$$1$$[$ieEvent_part$$inline_145_retval$$1$$]
          }else {
            $JSCompiler_temp$$8_hasCapture$$2_parts$$inline_143$$ = $JSCompiler_alias_NULL$$;
            break a
          }
        }
        $JSCompiler_temp$$8_hasCapture$$2_parts$$inline_143$$ = $cur$$inline_144_hasBubble$$1$$
      }
    }
    $ieEvent_part$$inline_145_retval$$1$$ = $JSCompiler_temp$$8_hasCapture$$2_parts$$inline_143$$;
    $JSCompiler_temp$$8_hasCapture$$2_parts$$inline_143$$ = $JSCompiler_alias_TRUE$$ in $map$$6$$;
    $cur$$inline_144_hasBubble$$1$$ = $JSCompiler_alias_FALSE$$ in $map$$6$$;
    if($JSCompiler_temp$$8_hasCapture$$2_parts$$inline_143$$) {
      if(0 > $ieEvent_part$$inline_145_retval$$1$$.keyCode || $ieEvent_part$$inline_145_retval$$1$$.returnValue != $JSCompiler_alias_VOID$$) {
        return $JSCompiler_alias_TRUE$$
      }
      a: {
        var $evt$$16_useReturnValue$$inline_148$$ = $JSCompiler_alias_FALSE$$;
        if(0 == $ieEvent_part$$inline_145_retval$$1$$.keyCode) {
          try {
            $ieEvent_part$$inline_145_retval$$1$$.keyCode = -1;
            break a
          }catch($ex$$inline_149$$) {
            $evt$$16_useReturnValue$$inline_148$$ = $JSCompiler_alias_TRUE$$
          }
        }
        if($evt$$16_useReturnValue$$inline_148$$ || $ieEvent_part$$inline_145_retval$$1$$.returnValue == $JSCompiler_alias_VOID$$) {
          $ieEvent_part$$inline_145_retval$$1$$.returnValue = $JSCompiler_alias_TRUE$$
        }
      }
    }
    $evt$$16_useReturnValue$$inline_148$$ = new $goog$events$BrowserEvent$$;
    $evt$$16_useReturnValue$$inline_148$$.$init$($ieEvent_part$$inline_145_retval$$1$$, this);
    $ieEvent_part$$inline_145_retval$$1$$ = $JSCompiler_alias_TRUE$$;
    try {
      if($JSCompiler_temp$$8_hasCapture$$2_parts$$inline_143$$) {
        for(var $ancestors$$1$$ = [], $parent$$3$$ = $evt$$16_useReturnValue$$inline_148$$.currentTarget;$parent$$3$$;$parent$$3$$ = $parent$$3$$.parentNode) {
          $ancestors$$1$$.push($parent$$3$$)
        }
        $targetsMap$$1$$ = $map$$6$$[$JSCompiler_alias_TRUE$$];
        $targetsMap$$1$$.$remaining_$ = $targetsMap$$1$$.$count_$;
        for(var $i$$62$$ = $ancestors$$1$$.length - 1;!$evt$$16_useReturnValue$$inline_148$$.$propagationStopped_$ && 0 <= $i$$62$$ && $targetsMap$$1$$.$remaining_$;$i$$62$$--) {
          $evt$$16_useReturnValue$$inline_148$$.currentTarget = $ancestors$$1$$[$i$$62$$], $ieEvent_part$$inline_145_retval$$1$$ &= $goog$events$fireListeners_$$($targetsMap$$1$$, $ancestors$$1$$[$i$$62$$], $be$$1_type$$74$$, $JSCompiler_alias_TRUE$$, $evt$$16_useReturnValue$$inline_148$$)
        }
        if($cur$$inline_144_hasBubble$$1$$) {
          $targetsMap$$1$$ = $map$$6$$[$JSCompiler_alias_FALSE$$];
          $targetsMap$$1$$.$remaining_$ = $targetsMap$$1$$.$count_$;
          for($i$$62$$ = 0;!$evt$$16_useReturnValue$$inline_148$$.$propagationStopped_$ && $i$$62$$ < $ancestors$$1$$.length && $targetsMap$$1$$.$remaining_$;$i$$62$$++) {
            $evt$$16_useReturnValue$$inline_148$$.currentTarget = $ancestors$$1$$[$i$$62$$], $ieEvent_part$$inline_145_retval$$1$$ &= $goog$events$fireListeners_$$($targetsMap$$1$$, $ancestors$$1$$[$i$$62$$], $be$$1_type$$74$$, $JSCompiler_alias_FALSE$$, $evt$$16_useReturnValue$$inline_148$$)
          }
        }
      }else {
        $ieEvent_part$$inline_145_retval$$1$$ = $goog$events$fireListener$$($listener$$47$$, $evt$$16_useReturnValue$$inline_148$$)
      }
    }finally {
      $ancestors$$1$$ && ($ancestors$$1$$.length = 0)
    }
    return $ieEvent_part$$inline_145_retval$$1$$
  }
  $be$$1_type$$74$$ = new $goog$events$BrowserEvent$$($opt_evt$$, this);
  return $ieEvent_part$$inline_145_retval$$1$$ = $goog$events$fireListener$$($listener$$47$$, $be$$1_type$$74$$)
}
var $goog$events$uniqueIdCounter_$$ = 0;
function $goog$events$getUniqueId$$($identifier$$1$$) {
  return $identifier$$1$$ + "_" + $goog$events$uniqueIdCounter_$$++
}
;function $goog$events$EventTarget$$() {
  $goog$Disposable$$.call(this);
  this.$eventTargetListeners_$ = {};
  this.$actualEventTarget_$ = this
}
$goog$inherits$$($goog$events$EventTarget$$, $goog$Disposable$$);
$goog$events$EventTarget$$.prototype.customEvent_ = $JSCompiler_alias_TRUE$$;
$JSCompiler_prototypeAlias$$ = $goog$events$EventTarget$$.prototype;
$JSCompiler_prototypeAlias$$.$parentEventTarget_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$setParentEventTarget$ = $JSCompiler_set$$("$parentEventTarget_$");
$JSCompiler_prototypeAlias$$.addEventListener = function $$JSCompiler_prototypeAlias$$$addEventListener$($type$$75$$, $handler$$3$$, $opt_capture$$1$$, $opt_handlerScope$$) {
  $goog$events$listen$$(this, $type$$75$$, $handler$$3$$, $opt_capture$$1$$, $opt_handlerScope$$)
};
$JSCompiler_prototypeAlias$$.removeEventListener = function $$JSCompiler_prototypeAlias$$$removeEventListener$($type$$76$$, $handler$$4$$, $opt_capture$$2$$, $opt_handlerScope$$1$$) {
  $goog$events$unlisten$$(this, $type$$76$$, $handler$$4$$, $opt_capture$$2$$, $opt_handlerScope$$1$$)
};
$JSCompiler_prototypeAlias$$.dispatchEvent = function $$JSCompiler_prototypeAlias$$$dispatchEvent$($JSCompiler_inline_result$$34_e$$21_e$$inline_153$$) {
  var $hasCapture$$inline_159_type$$inline_154$$ = $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.type || $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$, $map$$inline_155$$ = $goog$events$listenerTree_$$;
  if($hasCapture$$inline_159_type$$inline_154$$ in $map$$inline_155$$) {
    if($goog$isString$$($JSCompiler_inline_result$$34_e$$21_e$$inline_153$$)) {
      $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$ = new $goog$events$Event$$($JSCompiler_inline_result$$34_e$$21_e$$inline_153$$, this)
    }else {
      if($JSCompiler_inline_result$$34_e$$21_e$$inline_153$$ instanceof $goog$events$Event$$) {
        $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.target = $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.target || this
      }else {
        var $oldEvent$$inline_156_rv$$inline_157$$ = $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$;
        $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$ = new $goog$events$Event$$($hasCapture$$inline_159_type$$inline_154$$, this);
        $goog$object$extend$$($JSCompiler_inline_result$$34_e$$21_e$$inline_153$$, $oldEvent$$inline_156_rv$$inline_157$$)
      }
    }
    var $oldEvent$$inline_156_rv$$inline_157$$ = 1, $ancestors$$inline_158_current$$inline_163$$, $map$$inline_155$$ = $map$$inline_155$$[$hasCapture$$inline_159_type$$inline_154$$], $hasCapture$$inline_159_type$$inline_154$$ = $JSCompiler_alias_TRUE$$ in $map$$inline_155$$, $parent$$inline_161_targetsMap$$inline_160$$;
    if($hasCapture$$inline_159_type$$inline_154$$) {
      $ancestors$$inline_158_current$$inline_163$$ = [];
      for($parent$$inline_161_targetsMap$$inline_160$$ = this;$parent$$inline_161_targetsMap$$inline_160$$;$parent$$inline_161_targetsMap$$inline_160$$ = $parent$$inline_161_targetsMap$$inline_160$$.$parentEventTarget_$) {
        $ancestors$$inline_158_current$$inline_163$$.push($parent$$inline_161_targetsMap$$inline_160$$)
      }
      $parent$$inline_161_targetsMap$$inline_160$$ = $map$$inline_155$$[$JSCompiler_alias_TRUE$$];
      $parent$$inline_161_targetsMap$$inline_160$$.$remaining_$ = $parent$$inline_161_targetsMap$$inline_160$$.$count_$;
      for(var $i$$inline_162$$ = $ancestors$$inline_158_current$$inline_163$$.length - 1;!$JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.$propagationStopped_$ && 0 <= $i$$inline_162$$ && $parent$$inline_161_targetsMap$$inline_160$$.$remaining_$;$i$$inline_162$$--) {
        $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.currentTarget = $ancestors$$inline_158_current$$inline_163$$[$i$$inline_162$$], $oldEvent$$inline_156_rv$$inline_157$$ &= $goog$events$fireListeners_$$($parent$$inline_161_targetsMap$$inline_160$$, $ancestors$$inline_158_current$$inline_163$$[$i$$inline_162$$], $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.type, $JSCompiler_alias_TRUE$$, $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$) && $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.$returnValue_$ != 
        $JSCompiler_alias_FALSE$$
      }
    }
    if($JSCompiler_alias_FALSE$$ in $map$$inline_155$$) {
      if($parent$$inline_161_targetsMap$$inline_160$$ = $map$$inline_155$$[$JSCompiler_alias_FALSE$$], $parent$$inline_161_targetsMap$$inline_160$$.$remaining_$ = $parent$$inline_161_targetsMap$$inline_160$$.$count_$, $hasCapture$$inline_159_type$$inline_154$$) {
        for($i$$inline_162$$ = 0;!$JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.$propagationStopped_$ && $i$$inline_162$$ < $ancestors$$inline_158_current$$inline_163$$.length && $parent$$inline_161_targetsMap$$inline_160$$.$remaining_$;$i$$inline_162$$++) {
          $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.currentTarget = $ancestors$$inline_158_current$$inline_163$$[$i$$inline_162$$], $oldEvent$$inline_156_rv$$inline_157$$ &= $goog$events$fireListeners_$$($parent$$inline_161_targetsMap$$inline_160$$, $ancestors$$inline_158_current$$inline_163$$[$i$$inline_162$$], $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.type, $JSCompiler_alias_FALSE$$, $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$) && $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.$returnValue_$ != 
          $JSCompiler_alias_FALSE$$
        }
      }else {
        for($ancestors$$inline_158_current$$inline_163$$ = this;!$JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.$propagationStopped_$ && $ancestors$$inline_158_current$$inline_163$$ && $parent$$inline_161_targetsMap$$inline_160$$.$remaining_$;$ancestors$$inline_158_current$$inline_163$$ = $ancestors$$inline_158_current$$inline_163$$.$parentEventTarget_$) {
          $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.currentTarget = $ancestors$$inline_158_current$$inline_163$$, $oldEvent$$inline_156_rv$$inline_157$$ &= $goog$events$fireListeners_$$($parent$$inline_161_targetsMap$$inline_160$$, $ancestors$$inline_158_current$$inline_163$$, $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.type, $JSCompiler_alias_FALSE$$, $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$) && $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$.$returnValue_$ != $JSCompiler_alias_FALSE$$
        }
      }
    }
    $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$ = Boolean($oldEvent$$inline_156_rv$$inline_157$$)
  }else {
    $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$ = $JSCompiler_alias_TRUE$$
  }
  return $JSCompiler_inline_result$$34_e$$21_e$$inline_153$$
};
function $X$base$$() {
  $goog$events$EventTarget$$.call(this);
  this.$_classname$ = "base";
  this.$_id$ = window["X.counter"].$uniqueId$();
  this.$_dirty$ = $JSCompiler_alias_FALSE$$
}
$goog$inherits$$($X$base$$, $goog$events$EventTarget$$);
$X$base$$.prototype.__defineGetter__("classname", $JSCompiler_get$$("$_classname$"));
$X$base$$.prototype.__defineGetter__("id", $JSCompiler_get$$("$_id$"));
$goog$exportSymbol$$("X.base", $X$base$$);
function $X$indexer$$() {
  $X$base$$.call(this);
  this.$_classname$ = "indexer";
  this.$_unique$ = [];
  this.$_indices$ = [];
  this.$_map$ = {}
}
$goog$inherits$$($X$indexer$$, $X$base$$);
$X$indexer$$.prototype.add = function $$X$indexer$$$$add$($object$$4$$) {
  $object$$4$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("Invalid object."));
  var $key$$50$$ = window.JSON.stringify($object$$4$$);
  $key$$50$$ in this.$_map$ || (this.$_map$[$key$$50$$] = this.$_unique$.length, this.$_unique$.push($object$$4$$));
  return this.$_map$[$key$$50$$]
};
$X$indexer$$.prototype.unique = $JSCompiler_get$$("$_unique$");
function $X$file$$($path$$6$$) {
  $X$base$$.call(this);
  this.$_classname$ = "file";
  this.$_path$ = $path$$6$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
}
$goog$inherits$$($X$file$$, $X$base$$);
function $X$loadable$$() {
  this.$_filedata$ = this.$_file$ = $JSCompiler_alias_NULL$$
}
$X$loadable$$.prototype.__defineSetter__("file", function($filepath$$) {
  if($filepath$$ == $JSCompiler_alias_NULL$$ || $goog$isArray$$($filepath$$) && 0 == $filepath$$.length) {
    this.$_file$ = $JSCompiler_alias_NULL$$
  }else {
    if($goog$isArray$$($filepath$$)) {
      if(1 == $filepath$$.length) {
        this.$_file$ = new $X$file$$($filepath$$[0]);
        return
      }
      this.$_file$ = $goog$array$map$$($filepath$$, function($v$$1$$) {
        var $_v$$ = new $X$volume$$;
        $_v$$.$_file$ = new $X$file$$($v$$1$$);
        return $_v$$
      })
    }else {
      this.$_file$ = new $X$file$$($filepath$$)
    }
    this.$_filedata$ = $JSCompiler_alias_NULL$$
  }
});
$X$loadable$$.prototype.__defineGetter__("file", function() {
  return!this.$_file$ ? "" : $goog$isArray$$(this.$_file$) ? this.$_file$.map(function($v$$2$$) {
    return $v$$2$$.$_file$.$_path$
  }) : this.$_file$.$_path$
});
$X$loadable$$.prototype.__defineGetter__("filedata", function() {
  return $goog$isArray$$(this.$_file$) ? this.$_file$.map(function($v$$3$$) {
    return $v$$3$$.$_filedata$
  }) : this.$_filedata$
});
$X$loadable$$.prototype.__defineSetter__("filedata", function($filedata$$) {
  if($filedata$$ == $JSCompiler_alias_NULL$$ || $goog$isArray$$($filedata$$) && 0 == $filedata$$.length) {
    this.$_filedata$ = $JSCompiler_alias_NULL$$
  }
  if($goog$isArray$$($filedata$$)) {
    if(1 == $filedata$$.length) {
      this.$_filedata$ = $filedata$$[0]
    }else {
      var $_number_of_files$$ = this.$_file$.length, $i$$70$$;
      for($i$$70$$ = 0;$i$$70$$ < $_number_of_files$$;$i$$70$$++) {
        this.$_file$[$i$$70$$].$_filedata$ = $filedata$$[$i$$70$$]
      }
    }
  }else {
    this.$_filedata$ = $filedata$$
  }
});
function $goog$structs$getValues$$($col$$1$$) {
  if("function" == typeof $col$$1$$.$getValues$) {
    return $col$$1$$.$getValues$()
  }
  if($goog$isString$$($col$$1$$)) {
    return $col$$1$$.split("")
  }
  if($goog$isArrayLike$$($col$$1$$)) {
    for(var $rv$$13$$ = [], $l$$12$$ = $col$$1$$.length, $i$$74$$ = 0;$i$$74$$ < $l$$12$$;$i$$74$$++) {
      $rv$$13$$.push($col$$1$$[$i$$74$$])
    }
    return $rv$$13$$
  }
  return $goog$object$getValues$$($col$$1$$)
}
;function $goog$structs$Map$$($opt_map$$, $var_args$$53$$) {
  this.$map_$ = {};
  this.$keys_$ = [];
  var $argLength$$2$$ = arguments.length;
  if(1 < $argLength$$2$$) {
    $argLength$$2$$ % 2 && $JSCompiler_alias_THROW$$(Error("Uneven number of arguments"));
    for(var $i$$81$$ = 0;$i$$81$$ < $argLength$$2$$;$i$$81$$ += 2) {
      this.set(arguments[$i$$81$$], arguments[$i$$81$$ + 1])
    }
  }else {
    $opt_map$$ && this.$addAll$($opt_map$$)
  }
}
$JSCompiler_prototypeAlias$$ = $goog$structs$Map$$.prototype;
$JSCompiler_prototypeAlias$$.$count_$ = 0;
$JSCompiler_prototypeAlias$$.$version_$ = 0;
$JSCompiler_prototypeAlias$$.$getCount$ = $JSCompiler_get$$("$count_$");
$JSCompiler_prototypeAlias$$.$getValues$ = function $$JSCompiler_prototypeAlias$$$$getValues$$() {
  $JSCompiler_StaticMethods_cleanupKeysArray_$$(this);
  for(var $rv$$17$$ = [], $i$$82$$ = 0;$i$$82$$ < this.$keys_$.length;$i$$82$$++) {
    $rv$$17$$.push(this.$map_$[this.$keys_$[$i$$82$$]])
  }
  return $rv$$17$$
};
function $JSCompiler_StaticMethods_containsValue$$($JSCompiler_StaticMethods_containsValue$self$$) {
  for(var $i$$83$$ = 0;$i$$83$$ < $JSCompiler_StaticMethods_containsValue$self$$.$keys_$.length;$i$$83$$++) {
    var $key$$53$$ = $JSCompiler_StaticMethods_containsValue$self$$.$keys_$[$i$$83$$];
    if($goog$structs$Map$hasKey_$$($JSCompiler_StaticMethods_containsValue$self$$.$map_$, $key$$53$$) && $JSCompiler_StaticMethods_containsValue$self$$.$map_$[$key$$53$$] == $JSCompiler_alias_FALSE$$) {
      return $JSCompiler_alias_TRUE$$
    }
  }
  return $JSCompiler_alias_FALSE$$
}
$JSCompiler_prototypeAlias$$.clear = function $$JSCompiler_prototypeAlias$$$clear$() {
  this.$map_$ = {};
  this.$version_$ = this.$count_$ = this.$keys_$.length = 0
};
$JSCompiler_prototypeAlias$$.remove = function $$JSCompiler_prototypeAlias$$$remove$($key$$55$$) {
  return $goog$structs$Map$hasKey_$$(this.$map_$, $key$$55$$) ? (delete this.$map_$[$key$$55$$], this.$count_$--, this.$version_$++, this.$keys_$.length > 2 * this.$count_$ && $JSCompiler_StaticMethods_cleanupKeysArray_$$(this), $JSCompiler_alias_TRUE$$) : $JSCompiler_alias_FALSE$$
};
function $JSCompiler_StaticMethods_cleanupKeysArray_$$($JSCompiler_StaticMethods_cleanupKeysArray_$self$$) {
  if($JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$count_$ != $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length) {
    for(var $srcIndex$$ = 0, $destIndex$$ = 0;$srcIndex$$ < $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length;) {
      var $key$$56$$ = $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$[$srcIndex$$];
      $goog$structs$Map$hasKey_$$($JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$map_$, $key$$56$$) && ($JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$[$destIndex$$++] = $key$$56$$);
      $srcIndex$$++
    }
    $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length = $destIndex$$
  }
  if($JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$count_$ != $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length) {
    for(var $seen$$2$$ = {}, $destIndex$$ = $srcIndex$$ = 0;$srcIndex$$ < $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length;) {
      $key$$56$$ = $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$[$srcIndex$$], $goog$structs$Map$hasKey_$$($seen$$2$$, $key$$56$$) || ($JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$[$destIndex$$++] = $key$$56$$, $seen$$2$$[$key$$56$$] = 1), $srcIndex$$++
    }
    $JSCompiler_StaticMethods_cleanupKeysArray_$self$$.$keys_$.length = $destIndex$$
  }
}
$JSCompiler_prototypeAlias$$.get = function $$JSCompiler_prototypeAlias$$$get$($key$$57$$, $opt_val$$1$$) {
  return $goog$structs$Map$hasKey_$$(this.$map_$, $key$$57$$) ? this.$map_$[$key$$57$$] : $opt_val$$1$$
};
$JSCompiler_prototypeAlias$$.set = function $$JSCompiler_prototypeAlias$$$set$($key$$58$$, $value$$58$$) {
  $goog$structs$Map$hasKey_$$(this.$map_$, $key$$58$$) || (this.$count_$++, this.$keys_$.push($key$$58$$), this.$version_$++);
  this.$map_$[$key$$58$$] = $value$$58$$
};
$JSCompiler_prototypeAlias$$.$addAll$ = function $$JSCompiler_prototypeAlias$$$$addAll$$($map$$7_values$$10$$) {
  var $keys$$6_res$$inline_168$$;
  if($map$$7_values$$10$$ instanceof $goog$structs$Map$$) {
    $JSCompiler_StaticMethods_cleanupKeysArray_$$($map$$7_values$$10$$), $keys$$6_res$$inline_168$$ = $map$$7_values$$10$$.$keys_$.concat(), $map$$7_values$$10$$ = $map$$7_values$$10$$.$getValues$()
  }else {
    $keys$$6_res$$inline_168$$ = [];
    var $i$$85_i$$inline_169$$ = 0, $key$$inline_170$$;
    for($key$$inline_170$$ in $map$$7_values$$10$$) {
      $keys$$6_res$$inline_168$$[$i$$85_i$$inline_169$$++] = $key$$inline_170$$
    }
    $map$$7_values$$10$$ = $goog$object$getValues$$($map$$7_values$$10$$)
  }
  for($i$$85_i$$inline_169$$ = 0;$i$$85_i$$inline_169$$ < $keys$$6_res$$inline_168$$.length;$i$$85_i$$inline_169$$++) {
    this.set($keys$$6_res$$inline_168$$[$i$$85_i$$inline_169$$], $map$$7_values$$10$$[$i$$85_i$$inline_169$$])
  }
};
$JSCompiler_prototypeAlias$$.$clone$ = function $$JSCompiler_prototypeAlias$$$$clone$$() {
  return new $goog$structs$Map$$(this)
};
$JSCompiler_prototypeAlias$$.$transpose$ = function $$JSCompiler_prototypeAlias$$$$transpose$$() {
  for(var $transposed$$1$$ = new $goog$structs$Map$$, $i$$86$$ = 0;$i$$86$$ < this.$keys_$.length;$i$$86$$++) {
    var $key$$59$$ = this.$keys_$[$i$$86$$];
    $transposed$$1$$.set(this.$map_$[$key$$59$$], $key$$59$$)
  }
  return $transposed$$1$$
};
function $goog$structs$Map$hasKey_$$($obj$$71$$, $key$$62$$) {
  return Object.prototype.hasOwnProperty.call($obj$$71$$, $key$$62$$)
}
;function $X$colortable$$() {
  $X$base$$.call(this);
  this.$_classname$ = "colortable";
  this.$_map$ = new $goog$structs$Map$$;
  $inject$$(this, new $X$loadable$$)
}
$goog$inherits$$($X$colortable$$, $X$base$$);
$X$colortable$$.prototype.add = function $$X$colortable$$$$add$($value$$60$$, $label$$2$$, $r$$, $g$$1$$, $b$$7$$, $a$$8$$) {
  (!$goog$isNumber$$($value$$60$$) || !$goog$isNumber$$($r$$) || !$goog$isNumber$$($g$$1$$) || !$goog$isNumber$$($b$$7$$) || !$goog$isNumber$$($a$$8$$)) && $JSCompiler_alias_THROW$$(Error("Invalid color table entry."));
  this.$_map$.set($value$$60$$, [$label$$2$$, $r$$, $g$$1$$, $b$$7$$, $a$$8$$]);
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
};
$X$colortable$$.prototype.get = function $$X$colortable$$$$get$($value$$61$$) {
  return this.$_map$.get($value$$61$$)
};
$goog$exportSymbol$$("X.colortable.prototype.get", $X$colortable$$.prototype.get);
function $goog$math$Coordinate3$$($opt_x$$, $opt_y$$, $opt_z$$) {
  this.x = $goog$isDef$$($opt_x$$) ? $opt_x$$ : 0;
  this.y = $goog$isDef$$($opt_y$$) ? $opt_y$$ : 0;
  this.$z$ = $goog$isDef$$($opt_z$$) ? $opt_z$$ : 0
}
$goog$math$Coordinate3$$.prototype.$clone$ = function $$goog$math$Coordinate3$$$$$clone$$() {
  return new $goog$math$Coordinate3$$(this.x, this.y, this.$z$)
};
function $goog$math$Vec3$$($x$$60$$, $y$$36$$, $z$$4$$) {
  this.x = $x$$60$$;
  this.y = $y$$36$$;
  this.$z$ = $z$$4$$
}
$goog$inherits$$($goog$math$Vec3$$, $goog$math$Coordinate3$$);
$JSCompiler_prototypeAlias$$ = $goog$math$Vec3$$.prototype;
$JSCompiler_prototypeAlias$$.$clone$ = function $$JSCompiler_prototypeAlias$$$$clone$$() {
  return new $goog$math$Vec3$$(this.x, this.y, this.$z$)
};
$JSCompiler_prototypeAlias$$.$magnitude$ = function $$JSCompiler_prototypeAlias$$$$magnitude$$() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.$z$ * this.$z$)
};
$JSCompiler_prototypeAlias$$.scale = function $$JSCompiler_prototypeAlias$$$scale$($s$$15$$) {
  this.x *= $s$$15$$;
  this.y *= $s$$15$$;
  this.$z$ *= $s$$15$$;
  return this
};
$JSCompiler_prototypeAlias$$.$invert$ = function $$JSCompiler_prototypeAlias$$$$invert$$() {
  this.x = -this.x;
  this.y = -this.y;
  this.$z$ = -this.$z$;
  return this
};
$JSCompiler_prototypeAlias$$.normalize = function $$JSCompiler_prototypeAlias$$$normalize$() {
  return this.scale(1 / this.$magnitude$())
};
$JSCompiler_prototypeAlias$$.add = function $$JSCompiler_prototypeAlias$$$add$($b$$17$$) {
  this.x += $b$$17$$.x;
  this.y += $b$$17$$.y;
  this.$z$ += $b$$17$$.$z$;
  return this
};
$JSCompiler_prototypeAlias$$.$subtract$ = function $$JSCompiler_prototypeAlias$$$$subtract$$($b$$18$$) {
  this.x -= $b$$18$$.x;
  this.y -= $b$$18$$.y;
  this.$z$ -= $b$$18$$.$z$;
  return this
};
function $goog$math$Vec3$distance$$($a$$16$$, $b$$14$$) {
  var $dx$$4$$ = $a$$16$$.x - $b$$14$$.x, $dy$$4$$ = $a$$16$$.y - $b$$14$$.y, $dz$$ = $a$$16$$.$z$ - $b$$14$$.$z$;
  return Math.sqrt($dx$$4$$ * $dx$$4$$ + $dy$$4$$ * $dy$$4$$ + $dz$$ * $dz$$)
}
function $goog$math$Vec3$squaredDistance$$($a$$17$$, $b$$15$$) {
  var $dx$$5$$ = $a$$17$$.x - $b$$15$$.x, $dy$$5$$ = $a$$17$$.y - $b$$15$$.y, $dz$$1$$ = $a$$17$$.$z$ - $b$$15$$.$z$;
  return $dx$$5$$ * $dx$$5$$ + $dy$$5$$ * $dy$$5$$ + $dz$$1$$ * $dz$$1$$
}
function $goog$math$Vec3$sum$$($a$$21$$, $b$$20$$) {
  return new $goog$math$Vec3$$($a$$21$$.x + $b$$20$$.x, $a$$21$$.y + $b$$20$$.y, $a$$21$$.$z$ + $b$$20$$.$z$)
}
function $goog$math$Vec3$cross$$($a$$24$$, $b$$23$$) {
  return new $goog$math$Vec3$$($a$$24$$.y * $b$$23$$.$z$ - $a$$24$$.$z$ * $b$$23$$.y, $a$$24$$.$z$ * $b$$23$$.x - $a$$24$$.x * $b$$23$$.$z$, $a$$24$$.x * $b$$23$$.y - $a$$24$$.y * $b$$23$$.x)
}
;$X$$.$vector$ = $goog$math$Vec3$$;
$JSCompiler_prototypeAlias$$ = $X$$.$vector$.prototype;
$JSCompiler_prototypeAlias$$.$clone$ = $goog$math$Vec3$$.prototype.$clone$;
$JSCompiler_prototypeAlias$$.$magnitude$ = $goog$math$Vec3$$.prototype.$magnitude$;
$JSCompiler_prototypeAlias$$.scale = $goog$math$Vec3$$.prototype.scale;
$JSCompiler_prototypeAlias$$.$invert$ = $goog$math$Vec3$$.prototype.$invert$;
$JSCompiler_prototypeAlias$$.add = $goog$math$Vec3$$.prototype.add;
$JSCompiler_prototypeAlias$$.$subtract$ = $goog$math$Vec3$$.prototype.$subtract$;
$JSCompiler_prototypeAlias$$.normalize = function $$JSCompiler_prototypeAlias$$$normalize$() {
  var $_magnitude$$ = this.$magnitude$();
  return 0 == $_magnitude$$ ? this.scale(0) : this.scale(1 / $_magnitude$$)
};
$X$$.$vector$.$dot$ = function $$X$$$$vector$$$dot$$($a$$23$$, $b$$22$$) {
  return $a$$23$$.x * $b$$22$$.x + $a$$23$$.y * $b$$22$$.y + $a$$23$$.$z$ * $b$$22$$.$z$
};
$X$$.$vector$.$cross$ = $goog$math$Vec3$cross$$;
$X$$.$vector$.$distance$ = $goog$math$Vec3$distance$$;
$X$$.$vector$.$lerp$ = function $$X$$$$vector$$$lerp$$($a$$25$$, $b$$24$$, $x$$62$$) {
  return new $goog$math$Vec3$$($a$$25$$.x + $x$$62$$ * ($b$$24$$.x - $a$$25$$.x), $a$$25$$.y + $x$$62$$ * ($b$$24$$.y - $a$$25$$.y), $a$$25$$.$z$ + $x$$62$$ * ($b$$24$$.$z$ - $a$$25$$.$z$))
};
$X$$.$vector$.prototype.__defineGetter__("xx", $JSCompiler_get$$("x"));
$X$$.$vector$.prototype.__defineGetter__("yy", $JSCompiler_get$$("y"));
$X$$.$vector$.prototype.__defineGetter__("zz", $JSCompiler_get$$("$z$"));
$goog$exportSymbol$$("X.vector", $X$$.$vector$);
$goog$exportSymbol$$("X.vector.prototype.clone", $X$$.$vector$.prototype.$clone$);
$goog$exportSymbol$$("X.vector.prototype.magnitude", $X$$.$vector$.prototype.$magnitude$);
$goog$exportSymbol$$("X.vector.prototype.scale", $X$$.$vector$.prototype.scale);
$goog$exportSymbol$$("X.vector.prototype.invert", $X$$.$vector$.prototype.$invert$);
$goog$exportSymbol$$("X.vector.prototype.normalize", $X$$.$vector$.prototype.normalize);
$goog$exportSymbol$$("X.vector.prototype.add", $X$$.$vector$.prototype.add);
$goog$exportSymbol$$("X.vector.prototype.subtract", $X$$.$vector$.prototype.$subtract$);
$goog$exportSymbol$$("X.vector.dot", $X$$.$vector$.$dot$);
$goog$exportSymbol$$("X.vector.cross", $X$$.$vector$.$cross$);
$goog$exportSymbol$$("X.vector.distance", $X$$.$vector$.$distance$);
$goog$exportSymbol$$("X.vector.lerp", $X$$.$vector$.$lerp$);
function $goog$vec$Float64Array$$($p0$$) {
  this.length = $p0$$.length || $p0$$;
  for(var $i$$90$$ = 0;$i$$90$$ < this.length;$i$$90$$++) {
    this[$i$$90$$] = $p0$$[$i$$90$$] || 0
  }
}
$goog$vec$Float64Array$$.prototype.BYTES_PER_ELEMENT = 8;
$goog$vec$Float64Array$$.prototype.set = function $$goog$vec$Float64Array$$$$set$($values$$11$$, $opt_offset$$9$$) {
  $opt_offset$$9$$ = $opt_offset$$9$$ || 0;
  for(var $i$$91$$ = 0;$i$$91$$ < $values$$11$$.length && $opt_offset$$9$$ + $i$$91$$ < this.length;$i$$91$$++) {
    this[$opt_offset$$9$$ + $i$$91$$] = $values$$11$$[$i$$91$$]
  }
};
$goog$vec$Float64Array$$.prototype.toString = Array.prototype.join;
if("undefined" == typeof Float64Array) {
  try {
    $goog$vec$Float64Array$$.BYTES_PER_ELEMENT = 8
  }catch($float64ArrayError$$) {
  }
  $goog$vec$Float64Array$$.prototype.BYTES_PER_ELEMENT = $goog$vec$Float64Array$$.prototype.BYTES_PER_ELEMENT;
  $goog$vec$Float64Array$$.prototype.set = $goog$vec$Float64Array$$.prototype.set;
  $goog$vec$Float64Array$$.prototype.toString = $goog$vec$Float64Array$$.prototype.toString;
  $goog$exportSymbol$$("Float64Array", $goog$vec$Float64Array$$)
}
;function $goog$vec$Float32Array$$($p0$$1$$) {
  this.length = $p0$$1$$.length || $p0$$1$$;
  for(var $i$$92$$ = 0;$i$$92$$ < this.length;$i$$92$$++) {
    this[$i$$92$$] = $p0$$1$$[$i$$92$$] || 0
  }
}
$goog$vec$Float32Array$$.prototype.BYTES_PER_ELEMENT = 4;
$goog$vec$Float32Array$$.prototype.set = function $$goog$vec$Float32Array$$$$set$($values$$12$$, $opt_offset$$10$$) {
  $opt_offset$$10$$ = $opt_offset$$10$$ || 0;
  for(var $i$$93$$ = 0;$i$$93$$ < $values$$12$$.length && $opt_offset$$10$$ + $i$$93$$ < this.length;$i$$93$$++) {
    this[$opt_offset$$10$$ + $i$$93$$] = $values$$12$$[$i$$93$$]
  }
};
$goog$vec$Float32Array$$.prototype.toString = Array.prototype.join;
"undefined" == typeof Float32Array && ($goog$vec$Float32Array$$.BYTES_PER_ELEMENT = 4, $goog$vec$Float32Array$$.prototype.BYTES_PER_ELEMENT = $goog$vec$Float32Array$$.prototype.BYTES_PER_ELEMENT, $goog$vec$Float32Array$$.prototype.set = $goog$vec$Float32Array$$.prototype.set, $goog$vec$Float32Array$$.prototype.toString = $goog$vec$Float32Array$$.prototype.toString, $goog$exportSymbol$$("Float32Array", $goog$vec$Float32Array$$));
function $goog$vec$Vec3$createFloat32$$() {
  return new Float32Array(3)
}
function $goog$vec$Vec3$createFloat32FromValues$$($v0$$, $v1$$1$$, $v2$$1$$) {
  var $a$$27$$ = $goog$vec$Vec3$createFloat32$$();
  $a$$27$$[0] = $v0$$;
  $a$$27$$[1] = $v1$$1$$;
  $a$$27$$[2] = $v2$$1$$;
  return $a$$27$$
}
function $goog$vec$Vec3$normalize$$($vec0$$6$$, $resultVec$$4$$) {
  var $ilen_x$$inline_210$$ = $vec0$$6$$[0], $y$$inline_211$$ = $vec0$$6$$[1], $z$$inline_212$$ = $vec0$$6$$[2], $ilen_x$$inline_210$$ = 1 / Math.sqrt($ilen_x$$inline_210$$ * $ilen_x$$inline_210$$ + $y$$inline_211$$ * $y$$inline_211$$ + $z$$inline_212$$ * $z$$inline_212$$);
  $resultVec$$4$$[0] = $vec0$$6$$[0] * $ilen_x$$inline_210$$;
  $resultVec$$4$$[1] = $vec0$$6$$[1] * $ilen_x$$inline_210$$;
  $resultVec$$4$$[2] = $vec0$$6$$[2] * $ilen_x$$inline_210$$
}
;function $goog$vec$Vec4$createFloat32$$() {
  return new Float32Array(4)
}
function $goog$vec$Vec4$createFloat32FromValues$$($v0$$8$$, $v1$$9$$, $v2$$5$$, $v3$$) {
  var $vec$$10$$ = $goog$vec$Vec4$createFloat32$$();
  $vec$$10$$[0] = $v0$$8$$;
  $vec$$10$$[1] = $v1$$9$$;
  $vec$$10$$[2] = $v2$$5$$;
  $vec$$10$$[3] = $v3$$;
  return $vec$$10$$
}
;function $goog$vec$Mat4$createFloat32$$() {
  return new Float32Array(16)
}
function $goog$vec$Mat4$createFloat32Identity$$() {
  var $mat$$ = $goog$vec$Mat4$createFloat32$$();
  $mat$$[0] = $mat$$[5] = $mat$$[10] = $mat$$[15] = 1;
  return $mat$$
}
function $goog$vec$Mat4$setFromValues$$($mat$$4$$, $v00$$3$$, $v10$$3$$, $v20$$3$$, $v30$$3$$, $v01$$3$$, $v11$$3$$, $v21$$3$$, $v31$$3$$, $v02$$3$$, $v12$$3$$, $v22$$3$$, $v32$$3$$, $v03$$3$$, $v13$$3$$, $v23$$3$$, $v33$$3$$) {
  $mat$$4$$[0] = $v00$$3$$;
  $mat$$4$$[1] = $v10$$3$$;
  $mat$$4$$[2] = $v20$$3$$;
  $mat$$4$$[3] = $v30$$3$$;
  $mat$$4$$[4] = $v01$$3$$;
  $mat$$4$$[5] = $v11$$3$$;
  $mat$$4$$[6] = $v21$$3$$;
  $mat$$4$$[7] = $v31$$3$$;
  $mat$$4$$[8] = $v02$$3$$;
  $mat$$4$$[9] = $v12$$3$$;
  $mat$$4$$[10] = $v22$$3$$;
  $mat$$4$$[11] = $v32$$3$$;
  $mat$$4$$[12] = $v03$$3$$;
  $mat$$4$$[13] = $v13$$3$$;
  $mat$$4$$[14] = $v23$$3$$;
  $mat$$4$$[15] = $v33$$3$$;
  return $mat$$4$$
}
function $goog$vec$Mat4$setColumnValues$$($mat$$10$$, $v0$$15$$, $v1$$16$$, $v2$$9$$, $v3$$4$$) {
  $mat$$10$$[12] = $v0$$15$$;
  $mat$$10$$[13] = $v1$$16$$;
  $mat$$10$$[14] = $v2$$9$$;
  $mat$$10$$[15] = $v3$$4$$;
  return $mat$$10$$
}
function $goog$vec$Mat4$setColumn$$($mat$$11$$, $column$$3_i$$96$$, $vec$$18$$) {
  $column$$3_i$$96$$ *= 4;
  $mat$$11$$[$column$$3_i$$96$$] = $vec$$18$$[0];
  $mat$$11$$[$column$$3_i$$96$$ + 1] = $vec$$18$$[1];
  $mat$$11$$[$column$$3_i$$96$$ + 2] = $vec$$18$$[2];
  $mat$$11$$[$column$$3_i$$96$$ + 3] = $vec$$18$$[3]
}
function $goog$vec$Mat4$getColumn$$($mat$$12$$, $column$$4_i$$97$$, $vec$$19$$) {
  $column$$4_i$$97$$ *= 4;
  $vec$$19$$[0] = $mat$$12$$[$column$$4_i$$97$$];
  $vec$$19$$[1] = $mat$$12$$[$column$$4_i$$97$$ + 1];
  $vec$$19$$[2] = $mat$$12$$[$column$$4_i$$97$$ + 2];
  $vec$$19$$[3] = $mat$$12$$[$column$$4_i$$97$$ + 3]
}
function $goog$vec$Mat4$setRowValues$$($mat$$15$$, $row$$2$$, $v0$$16$$, $v1$$17$$, $v2$$10$$, $v3$$5$$) {
  $mat$$15$$[$row$$2$$] = $v0$$16$$;
  $mat$$15$$[$row$$2$$ + 4] = $v1$$17$$;
  $mat$$15$$[$row$$2$$ + 8] = $v2$$10$$;
  $mat$$15$$[$row$$2$$ + 12] = $v3$$5$$
}
function $goog$vec$Mat4$setRow$$($mat$$16$$, $row$$3$$, $vec$$20$$) {
  $mat$$16$$[$row$$3$$] = $vec$$20$$[0];
  $mat$$16$$[$row$$3$$ + 4] = $vec$$20$$[1];
  $mat$$16$$[$row$$3$$ + 8] = $vec$$20$$[2];
  $mat$$16$$[$row$$3$$ + 12] = $vec$$20$$[3]
}
function $goog$vec$Mat4$getRow$$($mat$$17$$, $row$$4$$, $vec$$21$$) {
  $vec$$21$$[0] = $mat$$17$$[$row$$4$$];
  $vec$$21$$[1] = $mat$$17$$[$row$$4$$ + 4];
  $vec$$21$$[2] = $mat$$17$$[$row$$4$$ + 8];
  $vec$$21$$[3] = $mat$$17$$[$row$$4$$ + 12]
}
function $goog$vec$Mat4$multMat$$($a33_mat0$$2$$, $b33_mat1$$2$$, $resultMat$$3$$) {
  var $a00$$ = $a33_mat0$$2$$[0], $a10$$ = $a33_mat0$$2$$[1], $a20$$ = $a33_mat0$$2$$[2], $a30$$ = $a33_mat0$$2$$[3], $a01$$ = $a33_mat0$$2$$[4], $a11$$ = $a33_mat0$$2$$[5], $a21$$ = $a33_mat0$$2$$[6], $a31$$ = $a33_mat0$$2$$[7], $a02$$ = $a33_mat0$$2$$[8], $a12$$ = $a33_mat0$$2$$[9], $a22$$ = $a33_mat0$$2$$[10], $a32$$ = $a33_mat0$$2$$[11], $a03$$ = $a33_mat0$$2$$[12], $a13$$ = $a33_mat0$$2$$[13], $a23$$ = $a33_mat0$$2$$[14];
  $a33_mat0$$2$$ = $a33_mat0$$2$$[15];
  var $b00$$ = $b33_mat1$$2$$[0], $b10$$ = $b33_mat1$$2$$[1], $b20$$ = $b33_mat1$$2$$[2], $b30$$ = $b33_mat1$$2$$[3], $b01$$ = $b33_mat1$$2$$[4], $b11$$ = $b33_mat1$$2$$[5], $b21$$ = $b33_mat1$$2$$[6], $b31$$ = $b33_mat1$$2$$[7], $b02$$ = $b33_mat1$$2$$[8], $b12$$ = $b33_mat1$$2$$[9], $b22$$ = $b33_mat1$$2$$[10], $b32$$ = $b33_mat1$$2$$[11], $b03$$ = $b33_mat1$$2$$[12], $b13$$ = $b33_mat1$$2$$[13], $b23$$ = $b33_mat1$$2$$[14];
  $b33_mat1$$2$$ = $b33_mat1$$2$$[15];
  $resultMat$$3$$[0] = $a00$$ * $b00$$ + $a01$$ * $b10$$ + $a02$$ * $b20$$ + $a03$$ * $b30$$;
  $resultMat$$3$$[1] = $a10$$ * $b00$$ + $a11$$ * $b10$$ + $a12$$ * $b20$$ + $a13$$ * $b30$$;
  $resultMat$$3$$[2] = $a20$$ * $b00$$ + $a21$$ * $b10$$ + $a22$$ * $b20$$ + $a23$$ * $b30$$;
  $resultMat$$3$$[3] = $a30$$ * $b00$$ + $a31$$ * $b10$$ + $a32$$ * $b20$$ + $a33_mat0$$2$$ * $b30$$;
  $resultMat$$3$$[4] = $a00$$ * $b01$$ + $a01$$ * $b11$$ + $a02$$ * $b21$$ + $a03$$ * $b31$$;
  $resultMat$$3$$[5] = $a10$$ * $b01$$ + $a11$$ * $b11$$ + $a12$$ * $b21$$ + $a13$$ * $b31$$;
  $resultMat$$3$$[6] = $a20$$ * $b01$$ + $a21$$ * $b11$$ + $a22$$ * $b21$$ + $a23$$ * $b31$$;
  $resultMat$$3$$[7] = $a30$$ * $b01$$ + $a31$$ * $b11$$ + $a32$$ * $b21$$ + $a33_mat0$$2$$ * $b31$$;
  $resultMat$$3$$[8] = $a00$$ * $b02$$ + $a01$$ * $b12$$ + $a02$$ * $b22$$ + $a03$$ * $b32$$;
  $resultMat$$3$$[9] = $a10$$ * $b02$$ + $a11$$ * $b12$$ + $a12$$ * $b22$$ + $a13$$ * $b32$$;
  $resultMat$$3$$[10] = $a20$$ * $b02$$ + $a21$$ * $b12$$ + $a22$$ * $b22$$ + $a23$$ * $b32$$;
  $resultMat$$3$$[11] = $a30$$ * $b02$$ + $a31$$ * $b12$$ + $a32$$ * $b22$$ + $a33_mat0$$2$$ * $b32$$;
  $resultMat$$3$$[12] = $a00$$ * $b03$$ + $a01$$ * $b13$$ + $a02$$ * $b23$$ + $a03$$ * $b33_mat1$$2$$;
  $resultMat$$3$$[13] = $a10$$ * $b03$$ + $a11$$ * $b13$$ + $a12$$ * $b23$$ + $a13$$ * $b33_mat1$$2$$;
  $resultMat$$3$$[14] = $a20$$ * $b03$$ + $a21$$ * $b13$$ + $a22$$ * $b23$$ + $a23$$ * $b33_mat1$$2$$;
  $resultMat$$3$$[15] = $a30$$ * $b03$$ + $a31$$ * $b13$$ + $a32$$ * $b23$$ + $a33_mat0$$2$$ * $b33_mat1$$2$$;
  return $resultMat$$3$$
}
function $goog$vec$Mat4$invert$$($mat$$25$$, $resultMat$$5$$) {
  var $m00$$1$$ = $mat$$25$$[0], $m10$$1$$ = $mat$$25$$[1], $m20$$1$$ = $mat$$25$$[2], $m30$$1$$ = $mat$$25$$[3], $m01$$1$$ = $mat$$25$$[4], $m11$$3$$ = $mat$$25$$[5], $m21$$3$$ = $mat$$25$$[6], $m31$$1$$ = $mat$$25$$[7], $m02$$1$$ = $mat$$25$$[8], $m12$$3$$ = $mat$$25$$[9], $m22$$3$$ = $mat$$25$$[10], $m32$$1$$ = $mat$$25$$[11], $m03$$1$$ = $mat$$25$$[12], $m13$$1$$ = $mat$$25$$[13], $m23$$1$$ = $mat$$25$$[14], $m33$$1$$ = $mat$$25$$[15], $a0$$1$$ = $m00$$1$$ * $m11$$3$$ - $m10$$1$$ * $m01$$1$$, 
  $a1$$1$$ = $m00$$1$$ * $m21$$3$$ - $m20$$1$$ * $m01$$1$$, $a2$$1$$ = $m00$$1$$ * $m31$$1$$ - $m30$$1$$ * $m01$$1$$, $a3$$1$$ = $m10$$1$$ * $m21$$3$$ - $m20$$1$$ * $m11$$3$$, $a4$$1$$ = $m10$$1$$ * $m31$$1$$ - $m30$$1$$ * $m11$$3$$, $a5$$1$$ = $m20$$1$$ * $m31$$1$$ - $m30$$1$$ * $m21$$3$$, $b0$$1$$ = $m02$$1$$ * $m13$$1$$ - $m12$$3$$ * $m03$$1$$, $b1$$2$$ = $m02$$1$$ * $m23$$1$$ - $m22$$3$$ * $m03$$1$$, $b2$$2$$ = $m02$$1$$ * $m33$$1$$ - $m32$$1$$ * $m03$$1$$, $b3$$1$$ = $m12$$3$$ * $m23$$1$$ - 
  $m22$$3$$ * $m13$$1$$, $b4$$1$$ = $m12$$3$$ * $m33$$1$$ - $m32$$1$$ * $m13$$1$$, $b5$$1$$ = $m22$$3$$ * $m33$$1$$ - $m32$$1$$ * $m23$$1$$, $det_idet$$ = $a0$$1$$ * $b5$$1$$ - $a1$$1$$ * $b4$$1$$ + $a2$$1$$ * $b3$$1$$ + $a3$$1$$ * $b2$$2$$ - $a4$$1$$ * $b1$$2$$ + $a5$$1$$ * $b0$$1$$;
  if(0 == $det_idet$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $det_idet$$ = 1 / $det_idet$$;
  $resultMat$$5$$[0] = ($m11$$3$$ * $b5$$1$$ - $m21$$3$$ * $b4$$1$$ + $m31$$1$$ * $b3$$1$$) * $det_idet$$;
  $resultMat$$5$$[1] = (-$m10$$1$$ * $b5$$1$$ + $m20$$1$$ * $b4$$1$$ - $m30$$1$$ * $b3$$1$$) * $det_idet$$;
  $resultMat$$5$$[2] = ($m13$$1$$ * $a5$$1$$ - $m23$$1$$ * $a4$$1$$ + $m33$$1$$ * $a3$$1$$) * $det_idet$$;
  $resultMat$$5$$[3] = (-$m12$$3$$ * $a5$$1$$ + $m22$$3$$ * $a4$$1$$ - $m32$$1$$ * $a3$$1$$) * $det_idet$$;
  $resultMat$$5$$[4] = (-$m01$$1$$ * $b5$$1$$ + $m21$$3$$ * $b2$$2$$ - $m31$$1$$ * $b1$$2$$) * $det_idet$$;
  $resultMat$$5$$[5] = ($m00$$1$$ * $b5$$1$$ - $m20$$1$$ * $b2$$2$$ + $m30$$1$$ * $b1$$2$$) * $det_idet$$;
  $resultMat$$5$$[6] = (-$m03$$1$$ * $a5$$1$$ + $m23$$1$$ * $a2$$1$$ - $m33$$1$$ * $a1$$1$$) * $det_idet$$;
  $resultMat$$5$$[7] = ($m02$$1$$ * $a5$$1$$ - $m22$$3$$ * $a2$$1$$ + $m32$$1$$ * $a1$$1$$) * $det_idet$$;
  $resultMat$$5$$[8] = ($m01$$1$$ * $b4$$1$$ - $m11$$3$$ * $b2$$2$$ + $m31$$1$$ * $b0$$1$$) * $det_idet$$;
  $resultMat$$5$$[9] = (-$m00$$1$$ * $b4$$1$$ + $m10$$1$$ * $b2$$2$$ - $m30$$1$$ * $b0$$1$$) * $det_idet$$;
  $resultMat$$5$$[10] = ($m03$$1$$ * $a4$$1$$ - $m13$$1$$ * $a2$$1$$ + $m33$$1$$ * $a0$$1$$) * $det_idet$$;
  $resultMat$$5$$[11] = (-$m02$$1$$ * $a4$$1$$ + $m12$$3$$ * $a2$$1$$ - $m32$$1$$ * $a0$$1$$) * $det_idet$$;
  $resultMat$$5$$[12] = (-$m01$$1$$ * $b3$$1$$ + $m11$$3$$ * $b1$$2$$ - $m21$$3$$ * $b0$$1$$) * $det_idet$$;
  $resultMat$$5$$[13] = ($m00$$1$$ * $b3$$1$$ - $m10$$1$$ * $b1$$2$$ + $m20$$1$$ * $b0$$1$$) * $det_idet$$;
  $resultMat$$5$$[14] = (-$m03$$1$$ * $a3$$1$$ + $m13$$1$$ * $a1$$1$$ - $m23$$1$$ * $a0$$1$$) * $det_idet$$;
  $resultMat$$5$$[15] = ($m02$$1$$ * $a3$$1$$ - $m12$$3$$ * $a1$$1$$ + $m22$$3$$ * $a0$$1$$) * $det_idet$$;
  return $JSCompiler_alias_TRUE$$
}
function $goog$vec$Mat4$multVec3$$($mat$$26$$, $vec$$22_z$$14$$, $resultVec$$14$$) {
  var $x$$71$$ = $vec$$22_z$$14$$[0], $y$$46$$ = $vec$$22_z$$14$$[1];
  $vec$$22_z$$14$$ = $vec$$22_z$$14$$[2];
  $resultVec$$14$$[0] = $x$$71$$ * $mat$$26$$[0] + $y$$46$$ * $mat$$26$$[4] + $vec$$22_z$$14$$ * $mat$$26$$[8] + $mat$$26$$[12];
  $resultVec$$14$$[1] = $x$$71$$ * $mat$$26$$[1] + $y$$46$$ * $mat$$26$$[5] + $vec$$22_z$$14$$ * $mat$$26$$[9] + $mat$$26$$[13];
  $resultVec$$14$$[2] = $x$$71$$ * $mat$$26$$[2] + $y$$46$$ * $mat$$26$$[6] + $vec$$22_z$$14$$ * $mat$$26$$[10] + $mat$$26$$[14]
}
function $goog$vec$Mat4$multVec4$$($mat$$29$$, $vec$$25_w$$8$$, $resultVec$$17$$) {
  var $x$$74$$ = $vec$$25_w$$8$$[0], $y$$49$$ = $vec$$25_w$$8$$[1], $z$$17$$ = $vec$$25_w$$8$$[2];
  $vec$$25_w$$8$$ = $vec$$25_w$$8$$[3];
  $resultVec$$17$$[0] = $x$$74$$ * $mat$$29$$[0] + $y$$49$$ * $mat$$29$$[4] + $z$$17$$ * $mat$$29$$[8] + $vec$$25_w$$8$$ * $mat$$29$$[12];
  $resultVec$$17$$[1] = $x$$74$$ * $mat$$29$$[1] + $y$$49$$ * $mat$$29$$[5] + $z$$17$$ * $mat$$29$$[9] + $vec$$25_w$$8$$ * $mat$$29$$[13];
  $resultVec$$17$$[2] = $x$$74$$ * $mat$$29$$[2] + $y$$49$$ * $mat$$29$$[6] + $z$$17$$ * $mat$$29$$[10] + $vec$$25_w$$8$$ * $mat$$29$$[14];
  $resultVec$$17$$[3] = $x$$74$$ * $mat$$29$$[3] + $y$$49$$ * $mat$$29$$[7] + $z$$17$$ * $mat$$29$$[11] + $vec$$25_w$$8$$ * $mat$$29$$[15];
  return $resultVec$$17$$
}
function $goog$vec$Mat4$translate$$($mat$$43$$, $x$$79$$, $y$$54$$, $z$$21$$) {
  return $goog$vec$Mat4$setColumnValues$$($mat$$43$$, $mat$$43$$[0] * $x$$79$$ + $mat$$43$$[4] * $y$$54$$ + $mat$$43$$[8] * $z$$21$$ + $mat$$43$$[12], $mat$$43$$[1] * $x$$79$$ + $mat$$43$$[5] * $y$$54$$ + $mat$$43$$[9] * $z$$21$$ + $mat$$43$$[13], $mat$$43$$[2] * $x$$79$$ + $mat$$43$$[6] * $y$$54$$ + $mat$$43$$[10] * $z$$21$$ + $mat$$43$$[14], $mat$$43$$[3] * $x$$79$$ + $mat$$43$$[7] * $y$$54$$ + $mat$$43$$[11] * $z$$21$$ + $mat$$43$$[15])
}
new Float64Array(3);
new Float64Array(3);
new Float64Array(4);
new Float64Array(4);
new Float64Array(4);
new Float64Array(16);
$X$$.$matrix$ = {};
$X$$.$matrix$.$makeLookAt$ = function $$X$$$$matrix$$$makeLookAt$$($mat$$50$$, $eyePt$$2$$, $centerPt$$1_fwdVec$$2$$, $sideVec$$1_worldUpVec$$2$$) {
  $centerPt$$1_fwdVec$$2$$ = $centerPt$$1_fwdVec$$2$$.$subtract$($eyePt$$2$$);
  $centerPt$$1_fwdVec$$2$$.normalize();
  $sideVec$$1_worldUpVec$$2$$ = $X$$.$vector$.$cross$($centerPt$$1_fwdVec$$2$$, $sideVec$$1_worldUpVec$$2$$);
  $sideVec$$1_worldUpVec$$2$$.normalize();
  var $upVec$$1$$ = $X$$.$vector$.$cross$($sideVec$$1_worldUpVec$$2$$, $centerPt$$1_fwdVec$$2$$);
  $upVec$$1$$.normalize();
  $centerPt$$1_fwdVec$$2$$.$invert$();
  $goog$vec$Mat4$setRowValues$$($mat$$50$$, 0, $sideVec$$1_worldUpVec$$2$$.x, $sideVec$$1_worldUpVec$$2$$.y, $sideVec$$1_worldUpVec$$2$$.$z$, 0);
  $goog$vec$Mat4$setRowValues$$($mat$$50$$, 1, $upVec$$1$$.x, $upVec$$1$$.y, $upVec$$1$$.$z$, 0);
  $goog$vec$Mat4$setRowValues$$($mat$$50$$, 2, $centerPt$$1_fwdVec$$2$$.x, $centerPt$$1_fwdVec$$2$$.y, $centerPt$$1_fwdVec$$2$$.$z$, 0);
  $goog$vec$Mat4$translate$$($mat$$50$$, -$eyePt$$2$$.x, -$eyePt$$2$$.y, -$eyePt$$2$$.$z$);
  return $mat$$50$$
};
$X$$.$matrix$.$multiplyByVector$ = function $$X$$$$matrix$$$multiplyByVector$$($mat$$51$$, $x$$82$$, $y$$57$$, $z$$24$$) {
  var $invw$$1$$ = 1 / ($x$$82$$ * $mat$$51$$[3] + $y$$57$$ * $mat$$51$$[7] + $z$$24$$ * $mat$$51$$[11] + $mat$$51$$[15]);
  return new $X$$.$vector$(($x$$82$$ * $mat$$51$$[0] + $y$$57$$ * $mat$$51$$[4] + $z$$24$$ * $mat$$51$$[8] + $mat$$51$$[12]) * $invw$$1$$, ($x$$82$$ * $mat$$51$$[1] + $y$$57$$ * $mat$$51$$[5] + $z$$24$$ * $mat$$51$$[9] + $mat$$51$$[13]) * $invw$$1$$, ($x$$82$$ * $mat$$51$$[2] + $y$$57$$ * $mat$$51$$[6] + $z$$24$$ * $mat$$51$$[10] + $mat$$51$$[14]) * $invw$$1$$)
};
$X$$.$matrix$.$swapRows$ = function $$X$$$$matrix$$$swapRows$$($mat$$52$$, $row1$$, $row2$$) {
  var $_buffer1$$ = new Float32Array(4), $_buffer2$$ = new Float32Array(4);
  $goog$vec$Mat4$getRow$$($mat$$52$$, $row1$$, $_buffer1$$);
  $goog$vec$Mat4$getRow$$($mat$$52$$, $row2$$, $_buffer2$$);
  $goog$vec$Mat4$setRow$$($mat$$52$$, $row1$$, $_buffer2$$);
  $goog$vec$Mat4$setRow$$($mat$$52$$, $row2$$, $_buffer1$$);
  return $mat$$52$$
};
$X$$.$matrix$.$swapCols$ = function $$X$$$$matrix$$$swapCols$$($mat$$53$$, $col1$$, $col2$$) {
  var $_buffer1$$1$$ = new Float32Array(4), $_buffer2$$1$$ = new Float32Array(4);
  $goog$vec$Mat4$getColumn$$($mat$$53$$, $col1$$, $_buffer1$$1$$);
  $goog$vec$Mat4$getColumn$$($mat$$53$$, $col2$$, $_buffer2$$1$$);
  $goog$vec$Mat4$setColumn$$($mat$$53$$, $col1$$, $_buffer2$$1$$);
  $goog$vec$Mat4$setColumn$$($mat$$53$$, $col2$$, $_buffer1$$1$$);
  return $mat$$53$$
};
$X$$.$matrix$.$identity$ = $goog$vec$Mat4$createFloat32Identity$$;
$X$$.$matrix$.$clone$ = function $$X$$$$matrix$$$clone$$($matrix$$3$$) {
  var $newMatrix$$ = $goog$vec$Mat4$createFloat32$$();
  $newMatrix$$[0] = $matrix$$3$$[0];
  $newMatrix$$[1] = $matrix$$3$$[1];
  $newMatrix$$[2] = $matrix$$3$$[2];
  $newMatrix$$[3] = $matrix$$3$$[3];
  $newMatrix$$[4] = $matrix$$3$$[4];
  $newMatrix$$[5] = $matrix$$3$$[5];
  $newMatrix$$[6] = $matrix$$3$$[6];
  $newMatrix$$[7] = $matrix$$3$$[7];
  $newMatrix$$[8] = $matrix$$3$$[8];
  $newMatrix$$[9] = $matrix$$3$$[9];
  $newMatrix$$[10] = $matrix$$3$$[10];
  $newMatrix$$[11] = $matrix$$3$$[11];
  $newMatrix$$[12] = $matrix$$3$$[12];
  $newMatrix$$[13] = $matrix$$3$$[13];
  $newMatrix$$[14] = $matrix$$3$$[14];
  $newMatrix$$[15] = $matrix$$3$$[15];
  return $newMatrix$$
};
$X$$.$matrix$.$transpose$ = function $$X$$$$matrix$$$transpose$$($mat$$23$$, $resultMat$$4$$) {
  if($resultMat$$4$$ == $mat$$23$$) {
    var $a10$$1$$ = $mat$$23$$[1], $a20$$1$$ = $mat$$23$$[2], $a30$$1$$ = $mat$$23$$[3], $a21$$1$$ = $mat$$23$$[6], $a31$$1$$ = $mat$$23$$[7], $a32$$1$$ = $mat$$23$$[11];
    $resultMat$$4$$[1] = $mat$$23$$[4];
    $resultMat$$4$$[2] = $mat$$23$$[8];
    $resultMat$$4$$[3] = $mat$$23$$[12];
    $resultMat$$4$$[4] = $a10$$1$$;
    $resultMat$$4$$[6] = $mat$$23$$[9];
    $resultMat$$4$$[7] = $mat$$23$$[13];
    $resultMat$$4$$[8] = $a20$$1$$;
    $resultMat$$4$$[9] = $a21$$1$$;
    $resultMat$$4$$[11] = $mat$$23$$[14];
    $resultMat$$4$$[12] = $a30$$1$$;
    $resultMat$$4$$[13] = $a31$$1$$;
    $resultMat$$4$$[14] = $a32$$1$$
  }else {
    $resultMat$$4$$[0] = $mat$$23$$[0], $resultMat$$4$$[1] = $mat$$23$$[4], $resultMat$$4$$[2] = $mat$$23$$[8], $resultMat$$4$$[3] = $mat$$23$$[12], $resultMat$$4$$[4] = $mat$$23$$[1], $resultMat$$4$$[5] = $mat$$23$$[5], $resultMat$$4$$[6] = $mat$$23$$[9], $resultMat$$4$$[7] = $mat$$23$$[13], $resultMat$$4$$[8] = $mat$$23$$[2], $resultMat$$4$$[9] = $mat$$23$$[6], $resultMat$$4$$[10] = $mat$$23$$[10], $resultMat$$4$$[11] = $mat$$23$$[14], $resultMat$$4$$[12] = $mat$$23$$[3], $resultMat$$4$$[13] = 
    $mat$$23$$[7], $resultMat$$4$$[14] = $mat$$23$$[11], $resultMat$$4$$[15] = $mat$$23$$[15]
  }
  return $resultMat$$4$$
};
$X$$.$matrix$.$determinant$ = function $$X$$$$matrix$$$determinant$$($m33_mat$$24$$) {
  var $m00$$ = $m33_mat$$24$$[0], $m10$$ = $m33_mat$$24$$[1], $m20$$ = $m33_mat$$24$$[2], $m30$$ = $m33_mat$$24$$[3], $m01$$ = $m33_mat$$24$$[4], $m11$$2$$ = $m33_mat$$24$$[5], $m21$$2$$ = $m33_mat$$24$$[6], $m31$$ = $m33_mat$$24$$[7], $m02$$ = $m33_mat$$24$$[8], $m12$$2$$ = $m33_mat$$24$$[9], $m22$$2$$ = $m33_mat$$24$$[10], $m32$$ = $m33_mat$$24$$[11], $m03$$ = $m33_mat$$24$$[12], $m13$$ = $m33_mat$$24$$[13], $m23$$ = $m33_mat$$24$$[14];
  $m33_mat$$24$$ = $m33_mat$$24$$[15];
  return($m00$$ * $m11$$2$$ - $m10$$ * $m01$$) * ($m22$$2$$ * $m33_mat$$24$$ - $m32$$ * $m23$$) - ($m00$$ * $m21$$2$$ - $m20$$ * $m01$$) * ($m12$$2$$ * $m33_mat$$24$$ - $m32$$ * $m13$$) + ($m00$$ * $m31$$ - $m30$$ * $m01$$) * ($m12$$2$$ * $m23$$ - $m22$$2$$ * $m13$$) + ($m10$$ * $m21$$2$$ - $m20$$ * $m11$$2$$) * ($m02$$ * $m33_mat$$24$$ - $m32$$ * $m03$$) - ($m10$$ * $m31$$ - $m30$$ * $m11$$2$$) * ($m02$$ * $m23$$ - $m22$$2$$ * $m03$$) + ($m20$$ * $m31$$ - $m30$$ * $m21$$2$$) * ($m02$$ * $m13$$ - 
  $m12$$2$$ * $m03$$)
};
$X$$.$matrix$.$invert$ = $goog$vec$Mat4$invert$$;
$X$$.$matrix$.$makePerspective$ = function $$X$$$$matrix$$$makePerspective$$($mat$$37$$, $dz$$2_fovy$$, $aspect$$, $near$$1$$, $far$$1$$) {
  var $angle$$7_cot$$ = $dz$$2_fovy$$ / 2;
  $dz$$2_fovy$$ = $far$$1$$ - $near$$1$$;
  var $sinAngle$$ = Math.sin($angle$$7_cot$$);
  if(0 == $dz$$2_fovy$$ || 0 == $sinAngle$$ || 0 == $aspect$$) {
    return $mat$$37$$
  }
  $angle$$7_cot$$ = Math.cos($angle$$7_cot$$) / $sinAngle$$;
  return $goog$vec$Mat4$setFromValues$$($mat$$37$$, $angle$$7_cot$$ / $aspect$$, 0, 0, 0, 0, $angle$$7_cot$$, 0, 0, 0, 0, -($far$$1$$ + $near$$1$$) / $dz$$2_fovy$$, -1, 0, 0, -(2 * $near$$1$$ * $far$$1$$) / $dz$$2_fovy$$, 0)
};
$X$$.$matrix$.$makeFrustum$ = function $$X$$$$matrix$$$makeFrustum$$($mat$$36$$, $left$$5$$, $right$$5$$, $bottom$$1$$, $top$$2$$, $near$$, $far$$) {
  return $goog$vec$Mat4$setFromValues$$($mat$$36$$, 2 * $near$$ / ($right$$5$$ - $left$$5$$), 0, 0, 0, 0, 2 * $near$$ / ($top$$2$$ - $bottom$$1$$), 0, 0, ($right$$5$$ + $left$$5$$) / ($right$$5$$ - $left$$5$$), ($top$$2$$ + $bottom$$1$$) / ($top$$2$$ - $bottom$$1$$), -($far$$ + $near$$) / ($far$$ - $near$$), -1, 0, 0, -(2 * $far$$ * $near$$) / ($far$$ - $near$$), 0)
};
$X$$.$matrix$.$makeOrtho$ = function $$X$$$$matrix$$$makeOrtho$$($mat$$38$$, $left$$6$$, $right$$6$$, $bottom$$2$$, $top$$3$$, $near$$2$$, $far$$2$$) {
  return $goog$vec$Mat4$setFromValues$$($mat$$38$$, 2 / ($right$$6$$ - $left$$6$$), 0, 0, 0, 0, 2 / ($top$$3$$ - $bottom$$2$$), 0, 0, 0, 0, -2 / ($far$$2$$ - $near$$2$$), 0, -($right$$6$$ + $left$$6$$) / ($right$$6$$ - $left$$6$$), -($top$$3$$ + $bottom$$2$$) / ($top$$3$$ - $bottom$$2$$), -($far$$2$$ + $near$$2$$) / ($far$$2$$ - $near$$2$$), 1)
};
$X$$.$matrix$.multiply = $goog$vec$Mat4$multMat$$;
$X$$.$matrix$.$multiplyByVec4$ = $goog$vec$Mat4$multVec4$$;
$X$$.$matrix$.translate = $goog$vec$Mat4$translate$$;
$X$$.$matrix$.scale = function $$X$$$$matrix$$scale$($mat$$44$$, $x$$80$$, $y$$55$$, $z$$22$$) {
  return $goog$vec$Mat4$setFromValues$$($mat$$44$$, $mat$$44$$[0] * $x$$80$$, $mat$$44$$[1] * $x$$80$$, $mat$$44$$[2] * $x$$80$$, $mat$$44$$[3] * $x$$80$$, $mat$$44$$[4] * $y$$55$$, $mat$$44$$[5] * $y$$55$$, $mat$$44$$[6] * $y$$55$$, $mat$$44$$[7] * $y$$55$$, $mat$$44$$[8] * $z$$22$$, $mat$$44$$[9] * $z$$22$$, $mat$$44$$[10] * $z$$22$$, $mat$$44$$[11] * $z$$22$$, $mat$$44$$[12], $mat$$44$$[13], $mat$$44$$[14], $mat$$44$$[15])
};
$X$$.$matrix$.rotate = function $$X$$$$matrix$$rotate$($mat$$45$$, $angle$$8_r00$$, $r12_x$$81$$, $y$$56$$, $r22_z$$23$$) {
  var $m00$$2$$ = $mat$$45$$[0], $m10$$2$$ = $mat$$45$$[1], $m20$$2$$ = $mat$$45$$[2], $m30$$2$$ = $mat$$45$$[3], $m01$$2$$ = $mat$$45$$[4], $m11$$4$$ = $mat$$45$$[5], $m21$$4$$ = $mat$$45$$[6], $m31$$2$$ = $mat$$45$$[7], $m02$$2$$ = $mat$$45$$[8], $m12$$4$$ = $mat$$45$$[9], $m22$$4$$ = $mat$$45$$[10], $m32$$2$$ = $mat$$45$$[11], $cosAngle$$ = Math.cos($angle$$8_r00$$), $sinAngle$$1$$ = Math.sin($angle$$8_r00$$), $diffCosAngle$$ = 1 - $cosAngle$$;
  $angle$$8_r00$$ = $r12_x$$81$$ * $r12_x$$81$$ * $diffCosAngle$$ + $cosAngle$$;
  var $r10$$ = $r12_x$$81$$ * $y$$56$$ * $diffCosAngle$$ + $r22_z$$23$$ * $sinAngle$$1$$, $r20$$ = $r12_x$$81$$ * $r22_z$$23$$ * $diffCosAngle$$ - $y$$56$$ * $sinAngle$$1$$, $r01$$ = $r12_x$$81$$ * $y$$56$$ * $diffCosAngle$$ - $r22_z$$23$$ * $sinAngle$$1$$, $r11$$ = $y$$56$$ * $y$$56$$ * $diffCosAngle$$ + $cosAngle$$, $r21$$ = $y$$56$$ * $r22_z$$23$$ * $diffCosAngle$$ + $r12_x$$81$$ * $sinAngle$$1$$, $r02$$ = $r12_x$$81$$ * $r22_z$$23$$ * $diffCosAngle$$ + $y$$56$$ * $sinAngle$$1$$;
  $r12_x$$81$$ = $y$$56$$ * $r22_z$$23$$ * $diffCosAngle$$ - $r12_x$$81$$ * $sinAngle$$1$$;
  $r22_z$$23$$ = $r22_z$$23$$ * $r22_z$$23$$ * $diffCosAngle$$ + $cosAngle$$;
  return $goog$vec$Mat4$setFromValues$$($mat$$45$$, $m00$$2$$ * $angle$$8_r00$$ + $m01$$2$$ * $r10$$ + $m02$$2$$ * $r20$$, $m10$$2$$ * $angle$$8_r00$$ + $m11$$4$$ * $r10$$ + $m12$$4$$ * $r20$$, $m20$$2$$ * $angle$$8_r00$$ + $m21$$4$$ * $r10$$ + $m22$$4$$ * $r20$$, $m30$$2$$ * $angle$$8_r00$$ + $m31$$2$$ * $r10$$ + $m32$$2$$ * $r20$$, $m00$$2$$ * $r01$$ + $m01$$2$$ * $r11$$ + $m02$$2$$ * $r21$$, $m10$$2$$ * $r01$$ + $m11$$4$$ * $r11$$ + $m12$$4$$ * $r21$$, $m20$$2$$ * $r01$$ + $m21$$4$$ * $r11$$ + 
  $m22$$4$$ * $r21$$, $m30$$2$$ * $r01$$ + $m31$$2$$ * $r11$$ + $m32$$2$$ * $r21$$, $m00$$2$$ * $r02$$ + $m01$$2$$ * $r12_x$$81$$ + $m02$$2$$ * $r22_z$$23$$, $m10$$2$$ * $r02$$ + $m11$$4$$ * $r12_x$$81$$ + $m12$$4$$ * $r22_z$$23$$, $m20$$2$$ * $r02$$ + $m21$$4$$ * $r12_x$$81$$ + $m22$$4$$ * $r22_z$$23$$, $m30$$2$$ * $r02$$ + $m31$$2$$ * $r12_x$$81$$ + $m32$$2$$ * $r22_z$$23$$, $mat$$45$$[12], $mat$$45$$[13], $mat$$45$$[14], $mat$$45$$[15])
};
$X$$.$matrix$.$rotateX$ = function $$X$$$$matrix$$$rotateX$$($mat$$46$$, $angle$$9$$) {
  var $m01$$3$$ = $mat$$46$$[4], $m11$$5$$ = $mat$$46$$[5], $m21$$5$$ = $mat$$46$$[6], $m31$$3$$ = $mat$$46$$[7], $m02$$3$$ = $mat$$46$$[8], $m12$$5$$ = $mat$$46$$[9], $m22$$5$$ = $mat$$46$$[10], $m32$$3$$ = $mat$$46$$[11], $c$$7$$ = Math.cos($angle$$9$$), $s$$20$$ = Math.sin($angle$$9$$);
  $mat$$46$$[4] = $m01$$3$$ * $c$$7$$ + $m02$$3$$ * $s$$20$$;
  $mat$$46$$[5] = $m11$$5$$ * $c$$7$$ + $m12$$5$$ * $s$$20$$;
  $mat$$46$$[6] = $m21$$5$$ * $c$$7$$ + $m22$$5$$ * $s$$20$$;
  $mat$$46$$[7] = $m31$$3$$ * $c$$7$$ + $m32$$3$$ * $s$$20$$;
  $mat$$46$$[8] = $m01$$3$$ * -$s$$20$$ + $m02$$3$$ * $c$$7$$;
  $mat$$46$$[9] = $m11$$5$$ * -$s$$20$$ + $m12$$5$$ * $c$$7$$;
  $mat$$46$$[10] = $m21$$5$$ * -$s$$20$$ + $m22$$5$$ * $c$$7$$;
  $mat$$46$$[11] = $m31$$3$$ * -$s$$20$$ + $m32$$3$$ * $c$$7$$;
  return $mat$$46$$
};
$X$$.$matrix$.$rotateY$ = function $$X$$$$matrix$$$rotateY$$($mat$$47$$, $angle$$10$$) {
  var $m00$$3$$ = $mat$$47$$[0], $m10$$3$$ = $mat$$47$$[1], $m20$$3$$ = $mat$$47$$[2], $m30$$3$$ = $mat$$47$$[3], $m02$$4$$ = $mat$$47$$[8], $m12$$6$$ = $mat$$47$$[9], $m22$$6$$ = $mat$$47$$[10], $m32$$4$$ = $mat$$47$$[11], $c$$8$$ = Math.cos($angle$$10$$), $s$$21$$ = Math.sin($angle$$10$$);
  $mat$$47$$[0] = $m00$$3$$ * $c$$8$$ + $m02$$4$$ * -$s$$21$$;
  $mat$$47$$[1] = $m10$$3$$ * $c$$8$$ + $m12$$6$$ * -$s$$21$$;
  $mat$$47$$[2] = $m20$$3$$ * $c$$8$$ + $m22$$6$$ * -$s$$21$$;
  $mat$$47$$[3] = $m30$$3$$ * $c$$8$$ + $m32$$4$$ * -$s$$21$$;
  $mat$$47$$[8] = $m00$$3$$ * $s$$21$$ + $m02$$4$$ * $c$$8$$;
  $mat$$47$$[9] = $m10$$3$$ * $s$$21$$ + $m12$$6$$ * $c$$8$$;
  $mat$$47$$[10] = $m20$$3$$ * $s$$21$$ + $m22$$6$$ * $c$$8$$;
  $mat$$47$$[11] = $m30$$3$$ * $s$$21$$ + $m32$$4$$ * $c$$8$$;
  return $mat$$47$$
};
$X$$.$matrix$.$rotateZ$ = function $$X$$$$matrix$$$rotateZ$$($mat$$48$$, $angle$$11$$) {
  var $m00$$4$$ = $mat$$48$$[0], $m10$$4$$ = $mat$$48$$[1], $m20$$4$$ = $mat$$48$$[2], $m30$$4$$ = $mat$$48$$[3], $m01$$4$$ = $mat$$48$$[4], $m11$$6$$ = $mat$$48$$[5], $m21$$6$$ = $mat$$48$$[6], $m31$$4$$ = $mat$$48$$[7], $c$$9$$ = Math.cos($angle$$11$$), $s$$22$$ = Math.sin($angle$$11$$);
  $mat$$48$$[0] = $m00$$4$$ * $c$$9$$ + $m01$$4$$ * $s$$22$$;
  $mat$$48$$[1] = $m10$$4$$ * $c$$9$$ + $m11$$6$$ * $s$$22$$;
  $mat$$48$$[2] = $m20$$4$$ * $c$$9$$ + $m21$$6$$ * $s$$22$$;
  $mat$$48$$[3] = $m30$$4$$ * $c$$9$$ + $m31$$4$$ * $s$$22$$;
  $mat$$48$$[4] = $m00$$4$$ * -$s$$22$$ + $m01$$4$$ * $c$$9$$;
  $mat$$48$$[5] = $m10$$4$$ * -$s$$22$$ + $m11$$6$$ * $c$$9$$;
  $mat$$48$$[6] = $m20$$4$$ * -$s$$22$$ + $m21$$6$$ * $c$$9$$;
  $mat$$48$$[7] = $m30$$4$$ * -$s$$22$$ + $m31$$4$$ * $c$$9$$;
  return $mat$$48$$
};
$goog$exportSymbol$$("X.matrix.identity", $X$$.$matrix$.$identity$);
$goog$exportSymbol$$("X.matrix.clone", $X$$.$matrix$.$clone$);
$goog$exportSymbol$$("X.matrix.transpose", $X$$.$matrix$.$transpose$);
$goog$exportSymbol$$("X.matrix.determinant", $X$$.$matrix$.$determinant$);
$goog$exportSymbol$$("X.matrix.invert", $X$$.$matrix$.$invert$);
$goog$exportSymbol$$("X.matrix.multiply", $X$$.$matrix$.multiply);
$goog$exportSymbol$$("X.matrix.multiplyByVector", $X$$.$matrix$.$multiplyByVector$);
$goog$exportSymbol$$("X.matrix.multiplyByVec4", $X$$.$matrix$.$multiplyByVec4$);
$goog$exportSymbol$$("X.matrix.makePerspective", $X$$.$matrix$.$makePerspective$);
$goog$exportSymbol$$("X.matrix.makeFrustum", $X$$.$matrix$.$makeFrustum$);
$goog$exportSymbol$$("X.matrix.makeOrtho", $X$$.$matrix$.$makeOrtho$);
$goog$exportSymbol$$("X.matrix.makeLookAt", $X$$.$matrix$.$makeLookAt$);
$goog$exportSymbol$$("X.matrix.translate", $X$$.$matrix$.translate);
$goog$exportSymbol$$("X.matrix.scale", $X$$.$matrix$.scale);
$goog$exportSymbol$$("X.matrix.rotate", $X$$.$matrix$.rotate);
$goog$exportSymbol$$("X.matrix.rotateX", $X$$.$matrix$.$rotateX$);
$goog$exportSymbol$$("X.matrix.rotateY", $X$$.$matrix$.$rotateY$);
$goog$exportSymbol$$("X.matrix.rotateZ", $X$$.$matrix$.$rotateZ$);
$goog$exportSymbol$$("X.matrix.swapRows", $X$$.$matrix$.$swapRows$);
$goog$exportSymbol$$("X.matrix.swapCols", $X$$.$matrix$.$swapCols$);
function $X$transform$$() {
  $X$base$$.call(this);
  this.$_classname$ = "transform";
  this.$_matrix$ = $X$$.$matrix$.$identity$()
}
$goog$inherits$$($X$transform$$, $X$base$$);
$X$transform$$.prototype.__defineGetter__("matrix", $JSCompiler_get$$("$_matrix$"));
$X$transform$$.prototype.__defineSetter__("matrix", function($matrix$$6$$) {
  ($matrix$$6$$ == $JSCompiler_alias_NULL$$ || !($matrix$$6$$ instanceof Float32Array)) && $JSCompiler_alias_THROW$$(Error("Invalid matrix."));
  this.$_matrix$ = $matrix$$6$$;
  this.$modified$()
});
$JSCompiler_prototypeAlias$$ = $X$transform$$.prototype;
$JSCompiler_prototypeAlias$$.$rotateX$ = function $$JSCompiler_prototypeAlias$$$$rotateX$$($angle$$12$$) {
  (!$goog$isNumber$$($angle$$12$$) || -360 > $angle$$12$$ || 360 < $angle$$12$$) && $JSCompiler_alias_THROW$$(Error("Invalid angle."));
  $X$$.$matrix$.$rotateX$(this.$_matrix$, $angle$$12$$ * Math.PI / 180);
  this.$modified$()
};
$JSCompiler_prototypeAlias$$.$rotateY$ = function $$JSCompiler_prototypeAlias$$$$rotateY$$($angle$$13$$) {
  (!$goog$isNumber$$($angle$$13$$) || -360 > $angle$$13$$ || 360 < $angle$$13$$) && $JSCompiler_alias_THROW$$(Error("Invalid angle."));
  $X$$.$matrix$.$rotateY$(this.$_matrix$, $angle$$13$$ * Math.PI / 180);
  this.$modified$()
};
$JSCompiler_prototypeAlias$$.$rotateZ$ = function $$JSCompiler_prototypeAlias$$$$rotateZ$$($angle$$14$$) {
  (!$goog$isNumber$$($angle$$14$$) || -360 > $angle$$14$$ || 360 < $angle$$14$$) && $JSCompiler_alias_THROW$$(Error("Invalid angle."));
  $X$$.$matrix$.$rotateZ$(this.$_matrix$, $angle$$14$$ * Math.PI / 180);
  this.$modified$()
};
$JSCompiler_prototypeAlias$$.$translateX$ = function $$JSCompiler_prototypeAlias$$$$translateX$$($distance$$) {
  $goog$isNumber$$($distance$$) || $JSCompiler_alias_THROW$$(Error("Invalid distance."));
  $X$$.$matrix$.translate(this.$_matrix$, $distance$$, 0, 0);
  this.$modified$()
};
$JSCompiler_prototypeAlias$$.$translateY$ = function $$JSCompiler_prototypeAlias$$$$translateY$$($distance$$1$$) {
  $goog$isNumber$$($distance$$1$$) || $JSCompiler_alias_THROW$$(Error("Invalid distance."));
  $X$$.$matrix$.translate(this.$_matrix$, 0, $distance$$1$$, 0);
  this.$modified$()
};
$JSCompiler_prototypeAlias$$.$translateZ$ = function $$JSCompiler_prototypeAlias$$$$translateZ$$($distance$$2$$) {
  $goog$isNumber$$($distance$$2$$) || $JSCompiler_alias_THROW$$(Error("Invalid distance."));
  $X$$.$matrix$.translate(this.$_matrix$, 0, 0, $distance$$2$$);
  this.$modified$()
};
function $JSCompiler_StaticMethods_flip_$$($JSCompiler_StaticMethods_flip_$self$$, $row$$5$$, $col$$11$$) {
  $JSCompiler_StaticMethods_flip_$self$$.$_matrix$[$row$$5$$ + 4 * $col$$11$$] *= -1;
  $JSCompiler_StaticMethods_flip_$self$$.$modified$()
}
$JSCompiler_prototypeAlias$$.$flipX$ = function $$JSCompiler_prototypeAlias$$$$flipX$$() {
  $JSCompiler_StaticMethods_flip_$$(this, 0, 0)
};
$JSCompiler_prototypeAlias$$.$flipY$ = function $$JSCompiler_prototypeAlias$$$$flipY$$() {
  $JSCompiler_StaticMethods_flip_$$(this, 1, 1)
};
$JSCompiler_prototypeAlias$$.$flipZ$ = function $$JSCompiler_prototypeAlias$$$$flipZ$$() {
  $JSCompiler_StaticMethods_flip_$$(this, 2, 2)
};
$JSCompiler_prototypeAlias$$.$modified$ = function $$JSCompiler_prototypeAlias$$$$modified$$() {
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
};
$goog$exportSymbol$$("X.transform", $X$transform$$);
$goog$exportSymbol$$("X.transform.prototype.rotateX", $X$transform$$.prototype.$rotateX$);
$goog$exportSymbol$$("X.transform.prototype.rotateY", $X$transform$$.prototype.$rotateY$);
$goog$exportSymbol$$("X.transform.prototype.rotateZ", $X$transform$$.prototype.$rotateZ$);
$goog$exportSymbol$$("X.transform.prototype.translateX", $X$transform$$.prototype.$translateX$);
$goog$exportSymbol$$("X.transform.prototype.translateY", $X$transform$$.prototype.$translateY$);
$goog$exportSymbol$$("X.transform.prototype.translateZ", $X$transform$$.prototype.$translateZ$);
$goog$exportSymbol$$("X.transform.prototype.flipX", $X$transform$$.prototype.$flipX$);
$goog$exportSymbol$$("X.transform.prototype.flipY", $X$transform$$.prototype.$flipY$);
$goog$exportSymbol$$("X.transform.prototype.flipZ", $X$transform$$.prototype.$flipZ$);
$goog$exportSymbol$$("X.transform.prototype.modified", $X$transform$$.prototype.$modified$);
function $X$texture$$() {
  $X$base$$.call(this);
  this.$_classname$ = "texture";
  this.$_rawData$ = this.$_image$ = this.$_file$ = $JSCompiler_alias_NULL$$;
  this.$_rawDataHeight$ = this.$_rawDataWidth$ = 0;
  this.$_grayscale$ = $JSCompiler_alias_FALSE$$;
  $inject$$(this, new $X$loadable$$)
}
$goog$inherits$$($X$texture$$, $X$base$$);
$X$texture$$.prototype.__defineSetter__("rawData", function($rawData$$) {
  this.$_rawData$ = $rawData$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$texture$$.prototype.__defineSetter__("rawDataHeight", function($rawDataHeight$$) {
  this.$_rawDataHeight$ = $rawDataHeight$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$texture$$.prototype.__defineSetter__("rawDataWidth", function($rawDataWidth$$) {
  this.$_rawDataWidth$ = $rawDataWidth$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$texture$$.prototype.__defineSetter__("grayscale", function($grayscale$$) {
  this.$_grayscale$ = $grayscale$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$goog$exportSymbol$$("X.texture", $X$texture$$);
function $X$triplets$$($size$$10$$, $data$$21$$) {
  $X$base$$.call(this);
  this.$_classname$ = "triplets";
  this.$_minA$ = Infinity;
  this.$_maxA$ = -Infinity;
  this.$_minB$ = Infinity;
  this.$_maxB$ = -Infinity;
  this.$_minC$ = Infinity;
  this.$_maxC$ = -Infinity;
  this.$_centroid$ = [0, 0, 0];
  this.$_fresh$ = $JSCompiler_alias_TRUE$$;
  this.$_dataPointer$ = 0;
  this.$_triplets$ = new Float32Array($size$$10$$);
  $data$$21$$ != $JSCompiler_alias_NULL$$ && (this.$_triplets$ = $data$$21$$.$_triplets$.subarray(0, $data$$21$$.$_triplets$.length), this.$_dataPointer$ = this.$_triplets$.length, this.$_minA$ = $data$$21$$.$_minA$, this.$_maxA$ = $data$$21$$.$_maxA$, this.$_minB$ = $data$$21$$.$_minB$, this.$_maxB$ = $data$$21$$.$_maxB$, this.$_minC$ = $data$$21$$.$_minC$, this.$_maxC$ = $data$$21$$.$_maxC$, this.$_centroid$ = $data$$21$$.$_centroid$.slice(), this.$_fresh$ = $JSCompiler_alias_FALSE$$)
}
$goog$inherits$$($X$triplets$$, $X$base$$);
$JSCompiler_prototypeAlias$$ = $X$triplets$$.prototype;
$JSCompiler_prototypeAlias$$.add = function $$JSCompiler_prototypeAlias$$$add$($a$$32$$, $b$$27$$, $c$$10$$) {
  this.$_minA$ = Math.min(this.$_minA$, $a$$32$$);
  this.$_maxA$ = Math.max(this.$_maxA$, $a$$32$$);
  this.$_minB$ = Math.min(this.$_minB$, $b$$27$$);
  this.$_maxB$ = Math.max(this.$_maxB$, $b$$27$$);
  this.$_minC$ = Math.min(this.$_minC$, $c$$10$$);
  this.$_maxC$ = Math.max(this.$_maxC$, $c$$10$$);
  this.$_centroid$ = [(this.$_minA$ + this.$_maxA$) / 2, (this.$_minB$ + this.$_maxB$) / 2, (this.$_minC$ + this.$_maxC$) / 2];
  this.$_fresh$ = $JSCompiler_alias_FALSE$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$;
  this.$_triplets$[this.$_dataPointer$++] = $a$$32$$;
  this.$_triplets$[this.$_dataPointer$++] = $b$$27$$;
  this.$_triplets$[this.$_dataPointer$++] = $c$$10$$;
  return this.$_dataPointer$ / 3
};
$JSCompiler_prototypeAlias$$.$resize$ = function $$JSCompiler_prototypeAlias$$$$resize$$() {
  if(this.$_dataPointer$ != this.$_triplets$.length) {
    var $_tmpArr$$ = new Float32Array(this.$_dataPointer$);
    $_tmpArr$$.set(this.$_triplets$.subarray(0, this.$_dataPointer$));
    this.$_triplets$ = $_tmpArr$$
  }
};
$JSCompiler_prototypeAlias$$.get = function $$JSCompiler_prototypeAlias$$$get$($id$$4$$) {
  $id$$4$$ *= 3;
  return[this.$_triplets$[$id$$4$$], this.$_triplets$[$id$$4$$ + 1], this.$_triplets$[$id$$4$$ + 2]]
};
$JSCompiler_prototypeAlias$$.remove = function $$JSCompiler_prototypeAlias$$$remove$() {
  $JSCompiler_alias_THROW$$(Error("Not implemented."))
};
$JSCompiler_prototypeAlias$$.clear = function $$JSCompiler_prototypeAlias$$$clear$() {
  this.$_triplets$ = new Float32Array(this.$_triplets$.length);
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
};
$X$triplets$$.prototype.__defineGetter__("count", function() {
  this.$resize$();
  return this.$_triplets$.length / 3
});
$X$triplets$$.prototype.__defineGetter__("length", function() {
  this.$resize$();
  return this.$_triplets$.length
});
$goog$exportSymbol$$("X.triplets", $X$triplets$$);
$goog$exportSymbol$$("X.triplets.prototype.add", $X$triplets$$.prototype.add);
$goog$exportSymbol$$("X.triplets.prototype.resize", $X$triplets$$.prototype.$resize$);
$goog$exportSymbol$$("X.triplets.prototype.get", $X$triplets$$.prototype.get);
$goog$exportSymbol$$("X.triplets.prototype.remove", $X$triplets$$.prototype.remove);
$goog$exportSymbol$$("X.triplets.prototype.clear", $X$triplets$$.prototype.clear);
function $X$displayable$$() {
  this.$_type$ = $X$displayable$types$TRIANGLES$$;
  this.$_transform$ = new $X$transform$$;
  this.$_color$ = [1, 1, 1];
  this.$_textureCoordinateMap$ = this.$_texture$ = this.$_colors$ = this.$_normals$ = this.$_points$ = $JSCompiler_alias_NULL$$;
  this.$_pointIndices$ = [];
  this.$_visible$ = $JSCompiler_alias_TRUE$$;
  this.$_linewidth$ = this.$_pointsize$ = 1;
  this.$_caption$ = $JSCompiler_alias_NULL$$;
  this.$_magicmode$ = $JSCompiler_alias_FALSE$$;
  this.$_opacity$ = 1;
  this.$_distance$ = 0;
  this.$_pickable$ = $JSCompiler_alias_TRUE$$
}
var $X$displayable$types$TRIANGLES$$ = "TRIANGLES";
$X$displayable$$.prototype.__defineSetter__("type", function($type$$88$$) {
  return this.$_type$ = $type$$88$$
});
$X$displayable$$.prototype.__defineGetter__("type", $JSCompiler_get$$("$_type$"));
$X$displayable$$.prototype.__defineGetter__("texture", function() {
  this.$_texture$ || (this.$_texture$ = new $X$texture$$);
  return this.$_texture$
});
$X$displayable$$.prototype.__defineGetter__("transform", $JSCompiler_get$$("$_transform$"));
$X$displayable$$.prototype.__defineGetter__("points", $JSCompiler_get$$("$_points$"));
$X$displayable$$.prototype.__defineSetter__("points", $JSCompiler_set$$("$_points$"));
$X$displayable$$.prototype.__defineGetter__("normals", $JSCompiler_get$$("$_normals$"));
$X$displayable$$.prototype.__defineSetter__("normals", $JSCompiler_set$$("$_normals$"));
$X$displayable$$.prototype.__defineGetter__("colors", $JSCompiler_get$$("$_colors$"));
$X$displayable$$.prototype.__defineSetter__("colors", $JSCompiler_set$$("$_colors$"));
$X$displayable$$.prototype.__defineGetter__("color", $JSCompiler_get$$("$_color$"));
$X$displayable$$.prototype.__defineSetter__("color", function($color$$2$$) {
  ($color$$2$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($color$$2$$) || 3 != $color$$2$$.length) && $JSCompiler_alias_THROW$$(Error("Invalid color."));
  for(var $children$$ = this.$_children$, $numberOfChildren$$ = $children$$.length, $c$$11$$ = 0, $c$$11$$ = 0;$c$$11$$ < $numberOfChildren$$;$c$$11$$++) {
    $children$$[$c$$11$$].color = $color$$2$$
  }
  this.$_color$ = $color$$2$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$displayable$$.prototype.__defineGetter__("opacity", $JSCompiler_get$$("$_opacity$"));
$X$displayable$$.prototype.__defineSetter__("opacity", function($opacity$$) {
  (!$goog$isNumber$$($opacity$$) || 1 < $opacity$$ || 0 > $opacity$$) && $JSCompiler_alias_THROW$$(Error("Invalid opacity."));
  for(var $children$$1$$ = this.$_children$, $numberOfChildren$$1$$ = $children$$1$$.length, $c$$12$$ = 0, $c$$12$$ = 0;$c$$12$$ < $numberOfChildren$$1$$;$c$$12$$++) {
    $children$$1$$[$c$$12$$] != $JSCompiler_alias_NULL$$ && ($children$$1$$[$c$$12$$].opacity = $opacity$$)
  }
  this.$_opacity$ = $opacity$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$displayable$$.prototype.__defineGetter__("caption", $JSCompiler_get$$("$_caption$"));
$X$displayable$$.prototype.__defineSetter__("caption", function($caption$$) {
  this.$_caption$ = $caption$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$displayable$$.prototype.__defineGetter__("visible", $JSCompiler_get$$("$_visible$"));
$X$displayable$$.prototype.__defineSetter__("visible", function($visible$$) {
  for(var $children$$2$$ = this.$_children$, $numberOfChildren$$2$$ = $children$$2$$.length, $c$$13$$ = 0, $c$$13$$ = 0;$c$$13$$ < $numberOfChildren$$2$$;$c$$13$$++) {
    $children$$2$$[$c$$13$$] != $JSCompiler_alias_NULL$$ && ($children$$2$$[$c$$13$$].visible = $visible$$)
  }
  this.$_visible$ = $visible$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$displayable$$.prototype.__defineGetter__("pointsize", $JSCompiler_get$$("$_pointsize$"));
$X$displayable$$.prototype.__defineSetter__("pointsize", function($size$$11$$) {
  $goog$isNumber$$($size$$11$$) || $JSCompiler_alias_THROW$$(Error("Invalid point size."));
  this.$_pointsize$ = $size$$11$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$displayable$$.prototype.__defineGetter__("magicmode", $JSCompiler_get$$("$_magicmode$"));
$X$displayable$$.prototype.__defineSetter__("magicmode", function($magicmode$$) {
  "boolean" != typeof $magicmode$$ && $JSCompiler_alias_THROW$$(Error("Invalid magic mode setting."));
  this.$_magicmode$ = $magicmode$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$displayable$$.prototype.__defineGetter__("linewidth", $JSCompiler_get$$("$_linewidth$"));
$X$displayable$$.prototype.__defineSetter__("linewidth", function($width$$12$$) {
  $goog$isNumber$$($width$$12$$) || $JSCompiler_alias_THROW$$(Error("Invalid line width."));
  this.$_linewidth$ = $width$$12$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$displayable$$.prototype.__defineGetter__("pickable", $JSCompiler_get$$("$_pickable$"));
$X$displayable$$.prototype.__defineSetter__("pickable", function($pickable$$) {
  "boolean" != typeof $pickable$$ && $JSCompiler_alias_THROW$$(Error("Invalid pickable setting."));
  this.$_pickable$ = $pickable$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$displayable$$.prototype.__defineGetter__("textureCoordinateMap", $JSCompiler_get$$("$_textureCoordinateMap$"));
$X$displayable$$.prototype.__defineSetter__("textureCoordinateMap", $JSCompiler_set$$("$_textureCoordinate$"));
function $X$thresholdable$$() {
  this.$_min$ = Infinity;
  this.$_lowerThreshold$ = this.$_max$ = -Infinity;
  this.$_upperThreshold$ = Infinity;
  this.$_minColor$ = [0, 0, 0];
  this.$_maxColor$ = [1, 1, 1]
}
$X$thresholdable$$.prototype.__defineGetter__("lowerThreshold", $JSCompiler_get$$("$_lowerThreshold$"));
$X$thresholdable$$.prototype.__defineSetter__("lowerThreshold", $JSCompiler_set$$("$_lowerThreshold$"));
$X$thresholdable$$.prototype.__defineGetter__("upperThreshold", $JSCompiler_get$$("$_upperThreshold$"));
$X$thresholdable$$.prototype.__defineSetter__("upperThreshold", $JSCompiler_set$$("$_upperThreshold$"));
$X$thresholdable$$.prototype.__defineGetter__("min", $JSCompiler_get$$("$_min$"));
$X$thresholdable$$.prototype.__defineGetter__("max", $JSCompiler_get$$("$_max$"));
$X$thresholdable$$.prototype.__defineGetter__("minColor", $JSCompiler_get$$("$_minColor$"));
$X$thresholdable$$.prototype.__defineSetter__("minColor", function($minColor$$) {
  ($minColor$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($minColor$$) || 3 != $minColor$$.length) && $JSCompiler_alias_THROW$$(Error("Invalid min. color."));
  this.$_minColor$ = $minColor$$
});
$X$thresholdable$$.prototype.__defineGetter__("maxColor", $JSCompiler_get$$("$_maxColor$"));
$X$thresholdable$$.prototype.__defineSetter__("maxColor", function($maxColor$$) {
  ($maxColor$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($maxColor$$) || 3 != $maxColor$$.length) && $JSCompiler_alias_THROW$$(Error("Invalid max. color."));
  this.$_maxColor$ = $maxColor$$
});
function $X$scalars$$() {
  $X$base$$.call(this);
  this.$_classname$ = "scalars";
  this.$_glArray$ = this.$_array$ = $JSCompiler_alias_NULL$$;
  this.$_replaceMode$ = $JSCompiler_alias_TRUE$$;
  this.$_interpolation$ = 0;
  $inject$$(this, new $X$loadable$$);
  $inject$$(this, new $X$thresholdable$$);
  this.$_minColor$ = [0, 1, 0];
  this.$_maxColor$ = [1, 0, 0]
}
$goog$inherits$$($X$scalars$$, $X$base$$);
$X$scalars$$.prototype.__defineGetter__("array", $JSCompiler_get$$("$_array$"));
$X$scalars$$.prototype.__defineSetter__("array", function($array$$17$$) {
  this.$_glArray$ = this.$_array$ = $array$$17$$;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
});
$X$scalars$$.prototype.__defineGetter__("interpolation", $JSCompiler_get$$("$_interpolation$"));
$X$scalars$$.prototype.__defineSetter__("interpolation", $JSCompiler_set$$("$_interpolation$"));
$goog$exportSymbol$$("X.scalars", $X$scalars$$);
function $X$object$$($object$$5$$) {
  $X$base$$.call(this);
  this.$_classname$ = "object";
  this.$_children$ = [];
  this.$_scalars$ = this.$_colortable$ = $JSCompiler_alias_NULL$$;
  $inject$$(this, new $X$displayable$$);
  $object$$5$$ != $JSCompiler_alias_NULL$$ && this.$copy_$($object$$5$$)
}
$goog$inherits$$($X$object$$, $X$base$$);
$X$object$$.prototype.$copy_$ = function $$X$object$$$$$copy_$$($object$$6$$) {
  this.$_type$ = $object$$6$$.$_type$;
  this.$_transform$ = new $X$transform$$;
  this.$_transform$.$_matrix$ = new Float32Array($object$$6$$.$_transform$.$_matrix$);
  this.$_color$ = $object$$6$$.$_color$.slice();
  $object$$6$$.$_points$ && (this.$_points$ = new $X$triplets$$($object$$6$$.$_points$.length, $object$$6$$.$_points$));
  $object$$6$$.$_normals$ && (this.$_normals$ = new $X$triplets$$($object$$6$$.$_normals$.length, $object$$6$$.$_normals$));
  $object$$6$$.$_colors$ && (this.$_colors$ = new $X$triplets$$($object$$6$$.$_colors$.length, $object$$6$$.$_colors$));
  this.$_texture$ = $object$$6$$.$_texture$;
  this.$_textureCoordinateMap$ = $object$$6$$.$_textureCoordinateMap$;
  $object$$6$$.$_file$ && (this.$_file$ = new $X$file$$((new String($object$$6$$.$_file$.$_path$)).toString()));
  this.$_opacity$ = $object$$6$$.$_opacity$;
  this.$_children$.length = 0;
  var $_oldChildren$$ = $object$$6$$.$_children$;
  if($_oldChildren$$) {
    for(var $_oldChildrenLength$$ = $_oldChildren$$.length, $i$$98$$ = 0, $i$$98$$ = 0;$i$$98$$ < $_oldChildrenLength$$;$i$$98$$++) {
      this.$_children$.push(new $X$$[$_oldChildren$$[$i$$98$$].$_classname$]($_oldChildren$$[$i$$98$$]))
    }
  }
  this.$_visible$ = $object$$6$$.$_visible$;
  this.$_pointsize$ = $object$$6$$.$_pointsize$;
  this.$_linewidth$ = $object$$6$$.$_linewidth$;
  $object$$6$$.$_caption$ && (this.$_caption$ = (new String($object$$6$$.$_caption$)).toString());
  this.$_magicmode$ = $object$$6$$.$_magicmode$;
  this.$_pickable$ = $object$$6$$.$_pickable$;
  this.$_pointIndices$ = $object$$6$$.$_pointIndices$.slice();
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
};
$X$object$$.prototype.__defineGetter__("colortable", function() {
  this.$_colortable$ || (this.$_colortable$ = new $X$colortable$$);
  return this.$_colortable$
});
$X$object$$.prototype.__defineGetter__("scalars", function() {
  this.$_scalars$ || (this.$_scalars$ = new $X$scalars$$);
  return this.$_scalars$
});
$X$object$$.prototype.__defineGetter__("children", $JSCompiler_get$$("$_children$"));
$X$object$$.prototype.$modified$ = function $$X$object$$$$$modified$$() {
  var $modifiedEvent$$ = new $X$event$ModifiedEvent$$;
  $modifiedEvent$$.$_object$ = this;
  this.dispatchEvent($modifiedEvent$$)
};
$X$object$$.prototype.remove = function $$X$object$$$$remove$() {
  var $removeEvent$$ = new $X$event$RemoveEvent$$;
  $removeEvent$$.$_object$ = this;
  this.dispatchEvent($removeEvent$$)
};
function $X$object$OPACITY_COMPARATOR$$($object1$$, $object2$$) {
  ($object1$$ == $JSCompiler_alias_NULL$$ || $object2$$ == $JSCompiler_alias_NULL$$ || !($object1$$ instanceof $X$object$$) || !($object2$$ instanceof $X$object$$)) && $JSCompiler_alias_THROW$$(Error("Fatal: Two valid X.objects are required for comparison."));
  return 1 == $object1$$.$_opacity$ ? -1 : 1 == $object2$$.$_opacity$ ? 1 : $object1$$.$_distance$ != $JSCompiler_alias_NULL$$ && $object2$$.$_distance$ != $JSCompiler_alias_NULL$$ && $object1$$.$_distance$ > $object2$$.$_distance$ ? -1 : 1
}
$goog$exportSymbol$$("X.object", $X$object$$);
$goog$exportSymbol$$("X.object.prototype.modified", $X$object$$.prototype.$modified$);
$goog$exportSymbol$$("X.object.prototype.remove", $X$object$$.prototype.remove);
function $csgVector$$($ix$$, $iy$$, $iz$$) {
  this.$z_$ = this.$y_$ = this.$x_$ = 0;
  3 == arguments.length ? (this.$x_$ = Number($ix$$), this.$y_$ = Number($iy$$), this.$z_$ = Number($iz$$)) : $ix$$ instanceof $csgVector$$ ? (this.$x_$ = Number($ix$$.x()), this.$y_$ = Number($ix$$.y()), this.$z_$ = Number($ix$$.$z$())) : (this.$x_$ = Number($ix$$[0]), this.$y_$ = Number($ix$$[1]), this.$z_$ = Number($ix$$[2]))
}
$csgVector$$.prototype = {$clone$:function $$csgVector$$$$$clone$$() {
  return new $csgVector$$(this.$x_$, this.$y_$, this.$z_$)
}, $dot$:function $$csgVector$$$$$dot$$($a$$37$$) {
  return this.$x_$ * $a$$37$$.x() + this.$y_$ * $a$$37$$.y() + this.$z_$ * $a$$37$$.$z$()
}, $lerp$:function $$csgVector$$$$$lerp$$($a$$38$$, $t$$) {
  return $JSCompiler_StaticMethods_plus$$(this, $JSCompiler_StaticMethods_times$$($JSCompiler_StaticMethods_minus$$($a$$38$$, this), $t$$))
}, length:function $$csgVector$$$$length$() {
  return Math.sqrt(this.$dot$(this))
}, $cross$:function $$csgVector$$$$$cross$$($a$$39$$) {
  return new $csgVector$$(this.$y_$ * $a$$39$$.$z$() - this.$z_$ * $a$$39$$.y(), this.$z_$ * $a$$39$$.x() - this.$x_$ * $a$$39$$.$z$(), this.$x_$ * $a$$39$$.y() - this.$y_$ * $a$$39$$.x())
}, x:$JSCompiler_get$$("$x_$"), y:$JSCompiler_get$$("$y_$"), $z$:$JSCompiler_get$$("$z_$")};
function $JSCompiler_StaticMethods_unit$$($JSCompiler_StaticMethods_unit$self$$) {
  var $a$$inline_224$$ = $JSCompiler_StaticMethods_unit$self$$.length();
  return new $csgVector$$($JSCompiler_StaticMethods_unit$self$$.$x_$ / $a$$inline_224$$, $JSCompiler_StaticMethods_unit$self$$.$y_$ / $a$$inline_224$$, $JSCompiler_StaticMethods_unit$self$$.$z_$ / $a$$inline_224$$)
}
function $JSCompiler_StaticMethods_times$$($JSCompiler_StaticMethods_times$self$$, $a$$35$$) {
  return new $csgVector$$($JSCompiler_StaticMethods_times$self$$.$x_$ * $a$$35$$, $JSCompiler_StaticMethods_times$self$$.$y_$ * $a$$35$$, $JSCompiler_StaticMethods_times$self$$.$z_$ * $a$$35$$)
}
function $JSCompiler_StaticMethods_minus$$($JSCompiler_StaticMethods_minus$self$$, $a$$34$$) {
  return new $csgVector$$($JSCompiler_StaticMethods_minus$self$$.$x_$ - $a$$34$$.x(), $JSCompiler_StaticMethods_minus$self$$.$y_$ - $a$$34$$.y(), $JSCompiler_StaticMethods_minus$self$$.$z_$ - $a$$34$$.$z$())
}
function $JSCompiler_StaticMethods_plus$$($JSCompiler_StaticMethods_plus$self$$, $a$$33$$) {
  return new $csgVector$$($JSCompiler_StaticMethods_plus$self$$.$x_$ + $a$$33$$.x(), $JSCompiler_StaticMethods_plus$self$$.$y_$ + $a$$33$$.y(), $JSCompiler_StaticMethods_plus$self$$.$z_$ + $a$$33$$.$z$())
}
function $JSCompiler_StaticMethods_negated$$($JSCompiler_StaticMethods_negated$self$$) {
  return new $csgVector$$(-$JSCompiler_StaticMethods_negated$self$$.$x_$, -$JSCompiler_StaticMethods_negated$self$$.$y_$, -$JSCompiler_StaticMethods_negated$self$$.$z_$)
}
;function $csgVertex$$($pos$$, $normal$$) {
  this.$pos_$ = new $csgVector$$($pos$$);
  this.$normal_$ = new $csgVector$$($normal$$)
}
$csgVertex$$.prototype = {$clone$:function $$csgVertex$$$$$clone$$() {
  return new $csgVertex$$(this.$pos_$.$clone$(), this.$normal_$.$clone$())
}, $flip$:function $$csgVertex$$$$$flip$$() {
  this.$normal_$ = $JSCompiler_StaticMethods_negated$$(this.$normal_$)
}};
function $csgPlane$$($normal$$1$$, $w$$9$$) {
  this.$normal_$ = $normal$$1$$;
  this.$w_$ = $w$$9$$
}
$csgPlane$$.prototype = {$clone$:function $$csgPlane$$$$$clone$$() {
  return new $csgPlane$$(this.$normal_$.$clone$(), this.$w_$)
}, $flip$:function $$csgPlane$$$$$flip$$() {
  this.$normal_$ = $JSCompiler_StaticMethods_negated$$(this.$normal_$);
  this.$w_$ = -this.$w_$
}};
function $csgPolygon$$($vertices$$, $shared$$) {
  this.$vertices_$ = $vertices$$;
  this.$shared_$ = $shared$$;
  var $a$$inline_226$$ = $vertices$$[0].$pos_$, $c$$inline_228_n$$inline_229$$ = $vertices$$[2].$pos_$, $c$$inline_228_n$$inline_229$$ = $JSCompiler_StaticMethods_unit$$($JSCompiler_StaticMethods_minus$$($vertices$$[1].$pos_$, $a$$inline_226$$).$cross$($JSCompiler_StaticMethods_minus$$($c$$inline_228_n$$inline_229$$, $a$$inline_226$$)));
  this.$plane_$ = new $csgPlane$$($c$$inline_228_n$$inline_229$$, $c$$inline_228_n$$inline_229$$.$dot$($a$$inline_226$$))
}
$csgPolygon$$.prototype = {$clone$:function $$csgPolygon$$$$$clone$$() {
  var $vertices$$1$$ = this.$vertices_$.map(function($v$$5$$) {
    return $v$$5$$.$clone$()
  });
  return new $csgPolygon$$($vertices$$1$$, this.$shared_$)
}, $flip$:function $$csgPolygon$$$$$flip$$() {
  this.$vertices_$.reverse().map(function($v$$6$$) {
    $v$$6$$.$flip$()
  });
  this.$plane_$.$flip$()
}};
function $JSCompiler_StaticMethods_splitPolygon$$($JSCompiler_StaticMethods_splitPolygon$self$$, $plane$$, $coplanarFront_f$$42$$, $b$$29_coplanarBack$$, $front$$, $back$$) {
  for(var $polygonType_vi$$ = 0, $types$$ = [], $i$$99$$ = 0;$i$$99$$ < $JSCompiler_StaticMethods_splitPolygon$self$$.$vertices_$.length;$i$$99$$++) {
    var $t$$2_ti_type$$89_v$$7$$ = $plane$$.$normal_$.$dot$($JSCompiler_StaticMethods_splitPolygon$self$$.$vertices_$[$i$$99$$].$pos_$) - $plane$$.$w_$, $t$$2_ti_type$$89_v$$7$$ = -1E-5 > $t$$2_ti_type$$89_v$$7$$ ? 2 : 1E-5 < $t$$2_ti_type$$89_v$$7$$ ? 1 : 0, $polygonType_vi$$ = $polygonType_vi$$ | $t$$2_ti_type$$89_v$$7$$;
    $types$$.push($t$$2_ti_type$$89_v$$7$$)
  }
  switch($polygonType_vi$$) {
    case 0:
      (0 < $plane$$.$normal_$.$dot$($JSCompiler_StaticMethods_splitPolygon$self$$.$plane_$.$normal_$) ? $coplanarFront_f$$42$$ : $b$$29_coplanarBack$$).push($JSCompiler_StaticMethods_splitPolygon$self$$);
      break;
    case 1:
      $front$$.push($JSCompiler_StaticMethods_splitPolygon$self$$);
      break;
    case 2:
      $back$$.push($JSCompiler_StaticMethods_splitPolygon$self$$);
      break;
    case 3:
      $coplanarFront_f$$42$$ = [];
      $b$$29_coplanarBack$$ = [];
      for($i$$99$$ = 0;$i$$99$$ < $JSCompiler_StaticMethods_splitPolygon$self$$.$vertices_$.length;$i$$99$$++) {
        var $j$$6_vj$$ = ($i$$99$$ + 1) % $JSCompiler_StaticMethods_splitPolygon$self$$.$vertices_$.length, $t$$2_ti_type$$89_v$$7$$ = $types$$[$i$$99$$], $tj$$ = $types$$[$j$$6_vj$$], $polygonType_vi$$ = $JSCompiler_StaticMethods_splitPolygon$self$$.$vertices_$[$i$$99$$], $j$$6_vj$$ = $JSCompiler_StaticMethods_splitPolygon$self$$.$vertices_$[$j$$6_vj$$];
        2 != $t$$2_ti_type$$89_v$$7$$ && $coplanarFront_f$$42$$.push($polygonType_vi$$);
        1 != $t$$2_ti_type$$89_v$$7$$ && $b$$29_coplanarBack$$.push(2 != $t$$2_ti_type$$89_v$$7$$ ? $polygonType_vi$$.$clone$() : $polygonType_vi$$);
        3 == ($t$$2_ti_type$$89_v$$7$$ | $tj$$) && ($t$$2_ti_type$$89_v$$7$$ = ($plane$$.$w_$ - $plane$$.$normal_$.$dot$($polygonType_vi$$.$pos_$)) / $plane$$.$normal_$.$dot$($JSCompiler_StaticMethods_minus$$($j$$6_vj$$.$pos_$, $polygonType_vi$$.$pos_$)), $t$$2_ti_type$$89_v$$7$$ = new $csgVertex$$($polygonType_vi$$.$pos_$.$lerp$($j$$6_vj$$.$pos_$, $t$$2_ti_type$$89_v$$7$$), $polygonType_vi$$.$normal_$.$lerp$($j$$6_vj$$.$normal_$, $t$$2_ti_type$$89_v$$7$$)), $coplanarFront_f$$42$$.push($t$$2_ti_type$$89_v$$7$$), 
        $b$$29_coplanarBack$$.push($t$$2_ti_type$$89_v$$7$$.$clone$()))
      }
      3 <= $coplanarFront_f$$42$$.length && $front$$.push(new $csgPolygon$$($coplanarFront_f$$42$$, $JSCompiler_StaticMethods_splitPolygon$self$$.$shared_$));
      3 <= $b$$29_coplanarBack$$.length && $back$$.push(new $csgPolygon$$($b$$29_coplanarBack$$, $JSCompiler_StaticMethods_splitPolygon$self$$.$shared_$))
  }
}
;function $csgNode$$($polygons$$) {
  this.$back_$ = this.$front_$ = this.$plane_$ = $JSCompiler_alias_NULL$$;
  this.$polygons_$ = [];
  $polygons$$ && $JSCompiler_StaticMethods_build$$(this, $polygons$$)
}
$csgNode$$.prototype = {$clone$:function $$csgNode$$$$$clone$$() {
  var $node$$2$$ = new $csgNode$$, $iback$$inline_238_ifront$$inline_235_iplane$$inline_232$$ = this.$plane_$ && this.$plane_$.$clone$();
  $node$$2$$.$plane_$ = $iback$$inline_238_ifront$$inline_235_iplane$$inline_232$$;
  $iback$$inline_238_ifront$$inline_235_iplane$$inline_232$$ = this.$front_$ && this.$front_$.$clone$();
  $node$$2$$.$front_$ = $iback$$inline_238_ifront$$inline_235_iplane$$inline_232$$;
  $iback$$inline_238_ifront$$inline_235_iplane$$inline_232$$ = this.$back_$ && this.$back_$.$clone$();
  $node$$2$$.$back_$ = $iback$$inline_238_ifront$$inline_235_iplane$$inline_232$$;
  $node$$2$$.$setPolygons$(this.$polygons_$.map(function($p$$) {
    return $p$$.$clone$()
  }));
  return $node$$2$$
}, $invert$:function $$csgNode$$$$$invert$$() {
  for(var $i$$100_temp$$ = 0;$i$$100_temp$$ < this.$polygons_$.length;$i$$100_temp$$++) {
    this.$polygons_$[$i$$100_temp$$].$flip$()
  }
  this.$plane_$.$flip$();
  this.$front_$ && this.$front_$.$invert$();
  this.$back_$ && this.$back_$.$invert$();
  $i$$100_temp$$ = this.$front_$;
  this.$front_$ = this.$back_$;
  this.$back_$ = $i$$100_temp$$
}, $setPolygons$:$JSCompiler_set$$("$polygons_$")};
function $JSCompiler_StaticMethods_build$$($JSCompiler_StaticMethods_build$self$$, $polygons$$3$$) {
  if($polygons$$3$$.length) {
    $JSCompiler_StaticMethods_build$self$$.$plane_$ || ($JSCompiler_StaticMethods_build$self$$.$plane_$ = $polygons$$3$$[0].$plane_$.$clone$());
    for(var $front$$2$$ = [], $back$$2$$ = [], $i$$102$$ = 0;$i$$102$$ < $polygons$$3$$.length;$i$$102$$++) {
      $JSCompiler_StaticMethods_splitPolygon$$($polygons$$3$$[$i$$102$$], $JSCompiler_StaticMethods_build$self$$.$plane_$, $JSCompiler_StaticMethods_build$self$$.$polygons_$, $JSCompiler_StaticMethods_build$self$$.$polygons_$, $front$$2$$, $back$$2$$)
    }
    $front$$2$$.length && ($JSCompiler_StaticMethods_build$self$$.$front_$ || ($JSCompiler_StaticMethods_build$self$$.$front_$ = new $csgNode$$), $JSCompiler_StaticMethods_build$$($JSCompiler_StaticMethods_build$self$$.$front_$, $front$$2$$));
    $back$$2$$.length && ($JSCompiler_StaticMethods_build$self$$.$back_$ || ($JSCompiler_StaticMethods_build$self$$.$back_$ = new $csgNode$$), $JSCompiler_StaticMethods_build$$($JSCompiler_StaticMethods_build$self$$.$back_$, $back$$2$$))
  }
}
function $JSCompiler_StaticMethods_allPolygons$$($JSCompiler_StaticMethods_allPolygons$self$$) {
  var $polygons$$2$$ = $JSCompiler_StaticMethods_allPolygons$self$$.$polygons_$.slice();
  $JSCompiler_StaticMethods_allPolygons$self$$.$front_$ && ($polygons$$2$$ = $polygons$$2$$.concat($JSCompiler_StaticMethods_allPolygons$$($JSCompiler_StaticMethods_allPolygons$self$$.$front_$)));
  $JSCompiler_StaticMethods_allPolygons$self$$.$back_$ && ($polygons$$2$$ = $polygons$$2$$.concat($JSCompiler_StaticMethods_allPolygons$$($JSCompiler_StaticMethods_allPolygons$self$$.$back_$)));
  return $polygons$$2$$
}
function $JSCompiler_StaticMethods_clipTo$$($JSCompiler_StaticMethods_clipTo$self$$, $bsp$$) {
  $JSCompiler_StaticMethods_clipTo$self$$.$polygons_$ = $JSCompiler_StaticMethods_clipPolygons$$($bsp$$, $JSCompiler_StaticMethods_clipTo$self$$.$polygons_$);
  $JSCompiler_StaticMethods_clipTo$self$$.$front_$ && $JSCompiler_StaticMethods_clipTo$$($JSCompiler_StaticMethods_clipTo$self$$.$front_$, $bsp$$);
  $JSCompiler_StaticMethods_clipTo$self$$.$back_$ && $JSCompiler_StaticMethods_clipTo$$($JSCompiler_StaticMethods_clipTo$self$$.$back_$, $bsp$$)
}
function $JSCompiler_StaticMethods_clipPolygons$$($JSCompiler_StaticMethods_clipPolygons$self$$, $polygons$$1$$) {
  if(!$JSCompiler_StaticMethods_clipPolygons$self$$.$plane_$) {
    return $polygons$$1$$.slice()
  }
  for(var $front$$1$$ = [], $back$$1$$ = [], $i$$101$$ = 0;$i$$101$$ < $polygons$$1$$.length;$i$$101$$++) {
    $JSCompiler_StaticMethods_splitPolygon$$($polygons$$1$$[$i$$101$$], $JSCompiler_StaticMethods_clipPolygons$self$$.$plane_$, $front$$1$$, $back$$1$$, $front$$1$$, $back$$1$$)
  }
  $JSCompiler_StaticMethods_clipPolygons$self$$.$front_$ && ($front$$1$$ = $JSCompiler_StaticMethods_clipPolygons$$($JSCompiler_StaticMethods_clipPolygons$self$$.$front_$, $front$$1$$));
  $back$$1$$ = $JSCompiler_StaticMethods_clipPolygons$self$$.$back_$ ? $JSCompiler_StaticMethods_clipPolygons$$($JSCompiler_StaticMethods_clipPolygons$self$$.$back_$, $back$$1$$) : [];
  return $front$$1$$.concat($back$$1$$)
}
;function $CSG$$() {
  this.$polygons_$ = []
}
function $CSG$fromPolygons$$($polygons$$4$$) {
  var $csg$$ = new $CSG$$;
  $csg$$.$setPolygons$($polygons$$4$$);
  return $csg$$
}
$CSG$$.prototype = {$clone$:function $$CSG$$$$$clone$$() {
  var $csg$$1$$ = new $CSG$$;
  $csg$$1$$.$setPolygons$(this.$polygons_$.map(function($p$$1$$) {
    return $p$$1$$.$clone$()
  }));
  return $csg$$1$$
}, $union$:function $$CSG$$$$$union$$($b$$30_csg$$2$$) {
  var $a$$41$$ = new $csgNode$$(this.$clone$().$polygons_$);
  $b$$30_csg$$2$$ = new $csgNode$$($b$$30_csg$$2$$.$clone$().$polygons_$);
  $JSCompiler_StaticMethods_clipTo$$($a$$41$$, $b$$30_csg$$2$$);
  $JSCompiler_StaticMethods_clipTo$$($b$$30_csg$$2$$, $a$$41$$);
  $b$$30_csg$$2$$.$invert$();
  $JSCompiler_StaticMethods_clipTo$$($b$$30_csg$$2$$, $a$$41$$);
  $b$$30_csg$$2$$.$invert$();
  $JSCompiler_StaticMethods_build$$($a$$41$$, $JSCompiler_StaticMethods_allPolygons$$($b$$30_csg$$2$$));
  return $CSG$fromPolygons$$($JSCompiler_StaticMethods_allPolygons$$($a$$41$$))
}, $subtract$:function $$CSG$$$$$subtract$$($b$$31_csg$$3$$) {
  var $a$$42$$ = new $csgNode$$(this.$clone$().$polygons_$);
  $b$$31_csg$$3$$ = new $csgNode$$($b$$31_csg$$3$$.$clone$().$polygons_$);
  $a$$42$$.$invert$();
  $JSCompiler_StaticMethods_clipTo$$($a$$42$$, $b$$31_csg$$3$$);
  $JSCompiler_StaticMethods_clipTo$$($b$$31_csg$$3$$, $a$$42$$);
  $b$$31_csg$$3$$.$invert$();
  $JSCompiler_StaticMethods_clipTo$$($b$$31_csg$$3$$, $a$$42$$);
  $b$$31_csg$$3$$.$invert$();
  $JSCompiler_StaticMethods_build$$($a$$42$$, $JSCompiler_StaticMethods_allPolygons$$($b$$31_csg$$3$$));
  $a$$42$$.$invert$();
  return $CSG$fromPolygons$$($JSCompiler_StaticMethods_allPolygons$$($a$$42$$))
}, $intersect$:function $$CSG$$$$$intersect$$($b$$32_csg$$4$$) {
  var $a$$43$$ = new $csgNode$$(this.$clone$().$polygons_$);
  $b$$32_csg$$4$$ = new $csgNode$$($b$$32_csg$$4$$.$clone$().$polygons_$);
  $a$$43$$.$invert$();
  $JSCompiler_StaticMethods_clipTo$$($b$$32_csg$$4$$, $a$$43$$);
  $b$$32_csg$$4$$.$invert$();
  $JSCompiler_StaticMethods_clipTo$$($a$$43$$, $b$$32_csg$$4$$);
  $JSCompiler_StaticMethods_clipTo$$($b$$32_csg$$4$$, $a$$43$$);
  $JSCompiler_StaticMethods_build$$($a$$43$$, $JSCompiler_StaticMethods_allPolygons$$($b$$32_csg$$4$$));
  $a$$43$$.$invert$();
  return $CSG$fromPolygons$$($JSCompiler_StaticMethods_allPolygons$$($a$$43$$))
}, inverse:function $$CSG$$$$inverse$() {
  var $csg$$5$$ = this.$clone$();
  $csg$$5$$.$polygons_$.map(function($p$$2$$) {
    $p$$2$$.$flip$()
  });
  return $csg$$5$$
}, $setPolygons$:$JSCompiler_set$$("$polygons_$")};
function $X$constructable$$() {
}
function $JSCompiler_StaticMethods_toCSG$$($JSCompiler_StaticMethods_toCSG$self$$) {
  for(var $numberOfPoints$$ = $JSCompiler_StaticMethods_toCSG$self$$.$_points$.count, $polygons$$6$$ = [], $p$$3$$ = 0, $p$$3$$ = 0;$p$$3$$ < $numberOfPoints$$;$p$$3$$ += 3) {
    var $point1$$ = $JSCompiler_StaticMethods_toCSG$self$$.$_points$.get($p$$3$$), $point2$$ = $JSCompiler_StaticMethods_toCSG$self$$.$_points$.get($p$$3$$ + 1), $point3$$ = $JSCompiler_StaticMethods_toCSG$self$$.$_points$.get($p$$3$$ + 2), $normal1$$ = $JSCompiler_StaticMethods_toCSG$self$$.$_normals$.get($p$$3$$), $normal2$$ = $JSCompiler_StaticMethods_toCSG$self$$.$_normals$.get($p$$3$$ + 1), $normal3$$ = $JSCompiler_StaticMethods_toCSG$self$$.$_normals$.get($p$$3$$ + 2), $color$$3$$ = $JSCompiler_StaticMethods_toCSG$self$$.$_color$;
    $JSCompiler_StaticMethods_toCSG$self$$.$_colors$ && 0 < $JSCompiler_StaticMethods_toCSG$self$$.$_colors$.length && ($color$$3$$ = $JSCompiler_StaticMethods_toCSG$self$$.$_colors$.get($p$$3$$));
    var $vertices$$2$$ = [];
    $vertices$$2$$.push(new $csgVertex$$($point1$$, $normal1$$));
    $vertices$$2$$.push(new $csgVertex$$($point2$$, $normal2$$));
    $vertices$$2$$.push(new $csgVertex$$($point3$$, $normal3$$));
    $polygons$$6$$.push(new $csgPolygon$$($vertices$$2$$, $color$$3$$))
  }
  return $CSG$fromPolygons$$($polygons$$6$$)
}
function $JSCompiler_StaticMethods_fromCSG$$($JSCompiler_StaticMethods_fromCSG$self$$, $csg$$6$$) {
  ($csg$$6$$ == $JSCompiler_alias_NULL$$ || !($csg$$6$$ instanceof $CSG$$)) && $JSCompiler_alias_THROW$$(Error("Invalid CSG object."));
  var $indexer$$ = new $X$indexer$$, $triangles$$ = [];
  $goog$array$map$$($csg$$6$$.$polygons_$, function($i$$103_p$$4$$) {
    var $indices$$ = [], $shared$$1$$ = $i$$103_p$$4$$.$shared_$, $indices$$ = $goog$array$map$$($i$$103_p$$4$$.$vertices_$, function($vertex$$) {
      $vertex$$.color = $shared$$1$$;
      return $indexer$$.add($vertex$$)
    });
    for($i$$103_p$$4$$ = $i$$103_p$$4$$ = 2;$i$$103_p$$4$$ < $indices$$.length;$i$$103_p$$4$$++) {
      $triangles$$.push([$indices$$[0], $indices$$[$i$$103_p$$4$$ - 1], $indices$$[$i$$103_p$$4$$]])
    }
  }.bind($JSCompiler_StaticMethods_fromCSG$self$$));
  $JSCompiler_StaticMethods_fromCSG$self$$.$__vertices$ = $goog$array$map$$($indexer$$.unique(), function($v$$8$$) {
    return[$v$$8$$.$pos_$.x(), $v$$8$$.$pos_$.y(), $v$$8$$.$pos_$.$z$()]
  });
  $JSCompiler_StaticMethods_fromCSG$self$$.$__normals$ = $goog$array$map$$($indexer$$.unique(), function($v$$9$$) {
    return[$v$$9$$.$normal_$.x(), $v$$9$$.$normal_$.y(), $v$$9$$.$normal_$.$z$()]
  });
  $JSCompiler_StaticMethods_fromCSG$self$$.$__colors$ = $goog$array$map$$($indexer$$.unique(), function($v$$10$$) {
    return!$v$$10$$.color ? $JSCompiler_alias_NULL$$ : [$v$$10$$.color[0], $v$$10$$.color[1], $v$$10$$.color[2]]
  });
  $JSCompiler_StaticMethods_fromCSG$self$$.$_points$ = new $X$triplets$$(9 * $triangles$$.length);
  $JSCompiler_StaticMethods_fromCSG$self$$.$_normals$ = new $X$triplets$$(9 * $triangles$$.length);
  $JSCompiler_StaticMethods_fromCSG$self$$.$_colors$ = new $X$triplets$$(9 * $triangles$$.length);
  $goog$array$map$$($triangles$$, function($i$$104_i2$$1$$) {
    var $i0$$ = $i$$104_i2$$1$$[0], $i1$$1$$ = $i$$104_i2$$1$$[1];
    $i$$104_i2$$1$$ = $i$$104_i2$$1$$[2];
    var $vertices$$3$$ = this.$__vertices$, $normals$$1$$ = this.$__normals$, $colors$$1$$ = this.$__colors$;
    this.$_points$.add($vertices$$3$$[$i0$$][0], $vertices$$3$$[$i0$$][1], $vertices$$3$$[$i0$$][2]);
    this.$_points$.add($vertices$$3$$[$i1$$1$$][0], $vertices$$3$$[$i1$$1$$][1], $vertices$$3$$[$i1$$1$$][2]);
    this.$_points$.add($vertices$$3$$[$i$$104_i2$$1$$][0], $vertices$$3$$[$i$$104_i2$$1$$][1], $vertices$$3$$[$i$$104_i2$$1$$][2]);
    this.$_normals$.add($normals$$1$$[$i0$$][0], $normals$$1$$[$i0$$][1], $normals$$1$$[$i0$$][2]);
    this.$_normals$.add($normals$$1$$[$i1$$1$$][0], $normals$$1$$[$i1$$1$$][1], $normals$$1$$[$i1$$1$$][2]);
    this.$_normals$.add($normals$$1$$[$i$$104_i2$$1$$][0], $normals$$1$$[$i$$104_i2$$1$$][1], $normals$$1$$[$i$$104_i2$$1$$][2]);
    $colors$$1$$[$i0$$] && this.$_colors$.add($colors$$1$$[$i0$$][0], $colors$$1$$[$i0$$][1], $colors$$1$$[$i0$$][2]);
    $colors$$1$$[$i1$$1$$] && this.$_colors$.add($colors$$1$$[$i1$$1$$][0], $colors$$1$$[$i1$$1$$][1], $colors$$1$$[$i1$$1$$][2]);
    $colors$$1$$[$i$$104_i2$$1$$] && this.$_colors$.add($colors$$1$$[$i$$104_i2$$1$$][0], $colors$$1$$[$i$$104_i2$$1$$][1], $colors$$1$$[$i$$104_i2$$1$$][2])
  }.bind($JSCompiler_StaticMethods_fromCSG$self$$));
  0 == $JSCompiler_StaticMethods_fromCSG$self$$.$_colors$.$_dataPointer$ && ($JSCompiler_StaticMethods_fromCSG$self$$.$_colors$ = $JSCompiler_alias_NULL$$);
  $JSCompiler_StaticMethods_fromCSG$self$$.$_type$ = $X$displayable$types$TRIANGLES$$
}
$X$constructable$$.prototype.$union$ = function $$X$constructable$$$$$union$$($object$$7_result$$8$$) {
  ($object$$7_result$$8$$ == $JSCompiler_alias_NULL$$ || !($object$$7_result$$8$$ instanceof $CSG$$) && !($object$$7_result$$8$$ instanceof $X$object$$)) && $JSCompiler_alias_THROW$$(Error("Invalid object."));
  var $csg$$7$$ = $object$$7_result$$8$$;
  $object$$7_result$$8$$ instanceof $X$object$$ && ($csg$$7$$ = $JSCompiler_StaticMethods_toCSG$$($csg$$7$$));
  $object$$7_result$$8$$ = new $X$object$$;
  $inject$$($object$$7_result$$8$$, new $X$constructable$$);
  $JSCompiler_StaticMethods_fromCSG$$($object$$7_result$$8$$, $JSCompiler_StaticMethods_toCSG$$(this).$union$($csg$$7$$));
  return $object$$7_result$$8$$
};
$X$constructable$$.prototype.$subtract$ = function $$X$constructable$$$$$subtract$$($object$$8_result$$9$$) {
  ($object$$8_result$$9$$ == $JSCompiler_alias_NULL$$ || !($object$$8_result$$9$$ instanceof $CSG$$) && !($object$$8_result$$9$$ instanceof $X$object$$)) && $JSCompiler_alias_THROW$$(Error("Invalid object."));
  var $csg$$8$$ = $object$$8_result$$9$$;
  $object$$8_result$$9$$ instanceof $X$object$$ && ($csg$$8$$ = $JSCompiler_StaticMethods_toCSG$$($csg$$8$$));
  $object$$8_result$$9$$ = new $X$object$$;
  $inject$$($object$$8_result$$9$$, new $X$constructable$$);
  $JSCompiler_StaticMethods_fromCSG$$($object$$8_result$$9$$, $JSCompiler_StaticMethods_toCSG$$(this).$subtract$($csg$$8$$));
  return $object$$8_result$$9$$
};
$X$constructable$$.prototype.$intersect$ = function $$X$constructable$$$$$intersect$$($object$$9_result$$10$$) {
  ($object$$9_result$$10$$ == $JSCompiler_alias_NULL$$ || !($object$$9_result$$10$$ instanceof $CSG$$) && !($object$$9_result$$10$$ instanceof $X$object$$)) && $JSCompiler_alias_THROW$$(Error("Invalid object."));
  var $csg$$9$$ = $object$$9_result$$10$$;
  $object$$9_result$$10$$ instanceof $X$object$$ && ($csg$$9$$ = $JSCompiler_StaticMethods_toCSG$$($csg$$9$$));
  $object$$9_result$$10$$ = new $X$object$$;
  $inject$$($object$$9_result$$10$$, new $X$constructable$$);
  $JSCompiler_StaticMethods_fromCSG$$($object$$9_result$$10$$, $JSCompiler_StaticMethods_toCSG$$(this).$intersect$($csg$$9$$));
  return $object$$9_result$$10$$
};
$X$constructable$$.prototype.inverse = function $$X$constructable$$$$inverse$() {
  var $result$$11$$ = new $X$object$$;
  $inject$$($result$$11$$, new $X$constructable$$);
  $JSCompiler_StaticMethods_fromCSG$$($result$$11$$, $JSCompiler_StaticMethods_toCSG$$(this).inverse());
  return $result$$11$$
};
$goog$exportSymbol$$("X.constructable", $X$constructable$$);
$goog$exportSymbol$$("X.constructable.prototype.intersect", $X$constructable$$.prototype.$intersect$);
$goog$exportSymbol$$("X.constructable.prototype.inverse", $X$constructable$$.prototype.inverse);
$goog$exportSymbol$$("X.constructable.prototype.subtract", $X$constructable$$.prototype.$subtract$);
$goog$exportSymbol$$("X.constructable.prototype.union", $X$constructable$$.prototype.$union$);
function $X$event$$($type$$90$$) {
  $goog$events$Event$$.call(this, $type$$90$$);
  this.$_classname$ = "event"
}
$goog$inherits$$($X$event$$, $goog$events$Event$$);
var $X$event$events$PAN$$ = $goog$events$getUniqueId$$("pan"), $X$event$events$ROTATE$$ = $goog$events$getUniqueId$$("rotate"), $X$event$events$ZOOM$$ = $goog$events$getUniqueId$$("zoom"), $X$event$events$SCROLL$$ = $goog$events$getUniqueId$$("scroll");
$goog$events$getUniqueId$$("render");
var $X$event$events$RESETVIEW$$ = $goog$events$getUniqueId$$("resetview"), $X$event$events$WINDOWLEVEL$$ = $goog$events$getUniqueId$$("windowlevel"), $X$event$events$MODIFIED$$ = $goog$events$getUniqueId$$("modified"), $X$event$events$REMOVE$$ = $goog$events$getUniqueId$$("remove"), $X$event$events$PROGRESS$$ = $goog$events$getUniqueId$$("progress"), $X$event$events$HOVER$$ = $goog$events$getUniqueId$$("hover"), $X$event$events$HOVER_END$$ = $goog$events$getUniqueId$$("hover_end"), $X$event$events$COMPUTING$$ = 
$goog$events$getUniqueId$$("computing"), $X$event$events$COMPUTING_END$$ = $goog$events$getUniqueId$$("computing_end"), $X$event$events$COMPUTING_PROGRESS$$ = $goog$events$getUniqueId$$("computing_progress");
function $X$event$WindowLevelEvent$$() {
  $X$event$$.call(this, $X$event$events$WINDOWLEVEL$$);
  this.$_level$ = this.$_window$ = 0
}
$goog$inherits$$($X$event$WindowLevelEvent$$, $X$event$$);
function $X$event$PanEvent$$() {
  $X$event$$.call(this, $X$event$events$PAN$$);
  this.$_distance$ = new $X$$.$vector$(0, 0, 0)
}
$goog$inherits$$($X$event$PanEvent$$, $X$event$$);
function $X$event$RotateEvent$$() {
  $X$event$$.call(this, $X$event$events$ROTATE$$);
  this.$_distance$ = new $X$$.$vector$(0, 0, 0)
}
$goog$inherits$$($X$event$RotateEvent$$, $X$event$$);
function $X$event$ZoomEvent$$() {
  $X$event$$.call(this, $X$event$events$ZOOM$$);
  this.$_fast$ = this.$_in$ = $JSCompiler_alias_FALSE$$
}
$goog$inherits$$($X$event$ZoomEvent$$, $X$event$$);
function $X$event$ScrollEvent$$() {
  $X$event$$.call(this, $X$event$events$SCROLL$$);
  this.$_up$ = $JSCompiler_alias_FALSE$$
}
$goog$inherits$$($X$event$ScrollEvent$$, $X$event$$);
function $X$event$HoverEvent$$() {
  $X$event$$.call(this, $X$event$events$HOVER$$);
  this.$_y$ = this.$_x$ = 0
}
$goog$inherits$$($X$event$HoverEvent$$, $X$event$$);
function $X$event$HoverEndEvent$$() {
  $X$event$$.call(this, $X$event$events$HOVER_END$$)
}
$goog$inherits$$($X$event$HoverEndEvent$$, $X$event$$);
function $X$event$ResetViewEvent$$() {
  $X$event$$.call(this, $X$event$events$RESETVIEW$$)
}
$goog$inherits$$($X$event$ResetViewEvent$$, $X$event$$);
function $X$event$ModifiedEvent$$() {
  $X$event$$.call(this, $X$event$events$MODIFIED$$);
  this.$_container$ = this.$_object$ = $JSCompiler_alias_NULL$$
}
$goog$inherits$$($X$event$ModifiedEvent$$, $X$event$$);
function $X$event$RemoveEvent$$() {
  $X$event$$.call(this, $X$event$events$REMOVE$$);
  this.$_container$ = this.$_object$ = $JSCompiler_alias_NULL$$
}
$goog$inherits$$($X$event$RemoveEvent$$, $X$event$$);
function $X$event$ProgressEvent$$() {
  $X$event$$.call(this, $X$event$events$PROGRESS$$);
  this.$_value$ = 0
}
$goog$inherits$$($X$event$ProgressEvent$$, $X$event$$);
function $X$event$ComputingEvent$$() {
  $X$event$$.call(this, $X$event$events$COMPUTING$$);
  this.$_object$ = $JSCompiler_alias_NULL$$
}
$goog$inherits$$($X$event$ComputingEvent$$, $X$event$$);
function $X$event$ComputingProgressEvent$$() {
  $X$event$$.call(this, $X$event$events$COMPUTING_PROGRESS$$);
  this.$_value$ = 0
}
$goog$inherits$$($X$event$ComputingProgressEvent$$, $X$event$$);
function $X$event$ComputingEndEvent$$() {
  $X$event$$.call(this, $X$event$events$COMPUTING_END$$);
  this.$_object$ = $JSCompiler_alias_NULL$$
}
$goog$inherits$$($X$event$ComputingEndEvent$$, $X$event$$);
$goog$exportSymbol$$("X.event.events.PAN", $X$event$events$PAN$$);
$goog$exportSymbol$$("X.event.events.ROTATE", $X$event$events$ROTATE$$);
$goog$exportSymbol$$("X.event.events.ZOOM", $X$event$events$ZOOM$$);
$goog$exportSymbol$$("X.event.events.SCROLL", $X$event$events$SCROLL$$);
function $X$parser$$() {
  $X$base$$.call(this);
  this.$_classname$ = "parser";
  this.$_data$ = $JSCompiler_alias_NULL$$;
  this.$_dataPointer$ = 0;
  this.$_nativeLittleEndian$ = 0 < (new Int8Array((new Int16Array([1])).buffer))[0];
  this.$_littleEndian$ = $JSCompiler_alias_TRUE$$;
  this.$_lastMin$ = -Infinity;
  this.$_lastMax$ = Infinity
}
$goog$inherits$$($X$parser$$, $X$base$$);
$X$parser$$.prototype.parse = function $$X$parser$$$$parse$() {
  $JSCompiler_alias_THROW$$(Error("The function parse() should be overloaded."))
};
function $JSCompiler_StaticMethods_arrayMinMax$$($data$$23$$) {
  for(var $_min$$ = Infinity, $_max$$ = -Infinity, $_datasize$$ = $data$$23$$.length, $i$$105$$ = 0, $i$$105$$ = 0;$i$$105$$ < $_datasize$$;$i$$105$$++) {
    if(!isNaN($data$$23$$[$i$$105$$])) {
      var $_value$$ = $data$$23$$[$i$$105$$], $_min$$ = Math.min($_min$$, $_value$$), $_max$$ = Math.max($_max$$, $_value$$)
    }
  }
  return[$_min$$, $_max$$]
}
function $JSCompiler_StaticMethods_parseChars$$($array$$18$$, $start$$9$$, $end$$4$$) {
  $start$$9$$ === $JSCompiler_alias_VOID$$ && ($start$$9$$ = 0);
  $end$$4$$ === $JSCompiler_alias_VOID$$ && ($end$$4$$ = $array$$18$$.length);
  for(var $_output$$ = "", $i$$106$$ = 0, $i$$106$$ = $start$$9$$;$i$$106$$ < $end$$4$$;++$i$$106$$) {
    $_output$$ += String.fromCharCode($array$$18$$[$i$$106$$])
  }
  return $_output$$
}
function $JSCompiler_StaticMethods_scan$$($JSCompiler_StaticMethods_scan$self_array$$inline_240$$, $_bytes_type$$91_u8$$inline_242$$, $chunks$$) {
  $chunks$$ != $JSCompiler_alias_NULL$$ || ($chunks$$ = 1);
  var $_chunkSize_chunkSize$$inline_241$$ = 1, $_array_type_i$$inline_243$$ = Uint8Array;
  switch($_bytes_type$$91_u8$$inline_242$$) {
    case "schar":
      $_array_type_i$$inline_243$$ = Int8Array;
      break;
    case "ushort":
      $_array_type_i$$inline_243$$ = Uint16Array;
      $_chunkSize_chunkSize$$inline_241$$ = 2;
      break;
    case "sshort":
      $_array_type_i$$inline_243$$ = Int16Array;
      $_chunkSize_chunkSize$$inline_241$$ = 2;
      break;
    case "uint":
      $_array_type_i$$inline_243$$ = Uint32Array;
      $_chunkSize_chunkSize$$inline_241$$ = 4;
      break;
    case "sint":
      $_array_type_i$$inline_243$$ = Int32Array;
      $_chunkSize_chunkSize$$inline_241$$ = 4;
      break;
    case "float":
      $_array_type_i$$inline_243$$ = Float32Array;
      $_chunkSize_chunkSize$$inline_241$$ = 4;
      break;
    case "complex":
      $_array_type_i$$inline_243$$ = Float64Array;
      $_chunkSize_chunkSize$$inline_241$$ = 8;
      break;
    case "double":
      $_array_type_i$$inline_243$$ = Float64Array, $_chunkSize_chunkSize$$inline_241$$ = 8
  }
  $_bytes_type$$91_u8$$inline_242$$ = new $_array_type_i$$inline_243$$($JSCompiler_StaticMethods_scan$self_array$$inline_240$$.$_data$.slice($JSCompiler_StaticMethods_scan$self_array$$inline_240$$.$_dataPointer$, $JSCompiler_StaticMethods_scan$self_array$$inline_240$$.$_dataPointer$ += $chunks$$ * $_chunkSize_chunkSize$$inline_241$$));
  if($JSCompiler_StaticMethods_scan$self_array$$inline_240$$.$_nativeLittleEndian$ != $JSCompiler_StaticMethods_scan$self_array$$inline_240$$.$_littleEndian$) {
    $JSCompiler_StaticMethods_scan$self_array$$inline_240$$ = $_bytes_type$$91_u8$$inline_242$$;
    $_bytes_type$$91_u8$$inline_242$$ = new Uint8Array($JSCompiler_StaticMethods_scan$self_array$$inline_240$$.buffer, $JSCompiler_StaticMethods_scan$self_array$$inline_240$$.byteOffset, $JSCompiler_StaticMethods_scan$self_array$$inline_240$$.byteLength);
    for($_array_type_i$$inline_243$$ = 0;$_array_type_i$$inline_243$$ < $JSCompiler_StaticMethods_scan$self_array$$inline_240$$.byteLength;$_array_type_i$$inline_243$$ += $_chunkSize_chunkSize$$inline_241$$) {
      for(var $j$$inline_244$$ = $_array_type_i$$inline_243$$ + $_chunkSize_chunkSize$$inline_241$$ - 1, $k$$inline_245$$ = $_array_type_i$$inline_243$$;$j$$inline_244$$ > $k$$inline_245$$;$j$$inline_244$$--, $k$$inline_245$$++) {
        var $tmp$$inline_246$$ = $_bytes_type$$91_u8$$inline_242$$[$k$$inline_245$$];
        $_bytes_type$$91_u8$$inline_242$$[$k$$inline_245$$] = $_bytes_type$$91_u8$$inline_242$$[$j$$inline_244$$];
        $_bytes_type$$91_u8$$inline_242$$[$j$$inline_244$$] = $tmp$$inline_246$$
      }
    }
    $_bytes_type$$91_u8$$inline_242$$ = $JSCompiler_StaticMethods_scan$self_array$$inline_240$$
  }
  return 1 == $chunks$$ ? $_bytes_type$$91_u8$$inline_242$$[0] : $_bytes_type$$91_u8$$inline_242$$
}
function $X$parser$computeRASBBox$$($IJKToRAS$$, $MRIdim$$) {
  var $_rasBB$$ = [Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE], $ijkTarget$$ = $goog$vec$Vec4$createFloat32FromValues$$(0, 0, 0, 1), $rasResult$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$, $ijkTarget$$, $rasResult$$);
  $_rasBB$$[0] = $rasResult$$[0] < $_rasBB$$[0] ? $rasResult$$[0] : $_rasBB$$[0];
  $_rasBB$$[1] = $rasResult$$[0] > $_rasBB$$[1] ? $rasResult$$[0] : $_rasBB$$[1];
  $_rasBB$$[2] = $rasResult$$[1] < $_rasBB$$[2] ? $rasResult$$[1] : $_rasBB$$[2];
  $_rasBB$$[3] = $rasResult$$[1] > $_rasBB$$[3] ? $rasResult$$[1] : $_rasBB$$[3];
  $_rasBB$$[4] = $rasResult$$[2] < $_rasBB$$[4] ? $rasResult$$[2] : $_rasBB$$[4];
  $_rasBB$$[5] = $rasResult$$[2] > $_rasBB$$[5] ? $rasResult$$[2] : $_rasBB$$[5];
  $ijkTarget$$ = $goog$vec$Vec4$createFloat32FromValues$$(0, 0, $MRIdim$$[2] - 1, 1);
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$, $ijkTarget$$, $rasResult$$);
  $_rasBB$$[0] = $rasResult$$[0] < $_rasBB$$[0] ? $rasResult$$[0] : $_rasBB$$[0];
  $_rasBB$$[1] = $rasResult$$[0] > $_rasBB$$[1] ? $rasResult$$[0] : $_rasBB$$[1];
  $_rasBB$$[2] = $rasResult$$[1] < $_rasBB$$[2] ? $rasResult$$[1] : $_rasBB$$[2];
  $_rasBB$$[3] = $rasResult$$[1] > $_rasBB$$[3] ? $rasResult$$[1] : $_rasBB$$[3];
  $_rasBB$$[4] = $rasResult$$[2] < $_rasBB$$[4] ? $rasResult$$[2] : $_rasBB$$[4];
  $_rasBB$$[5] = $rasResult$$[2] > $_rasBB$$[5] ? $rasResult$$[2] : $_rasBB$$[5];
  $ijkTarget$$ = $goog$vec$Vec4$createFloat32FromValues$$(0, $MRIdim$$[1] - 1, 0, 1);
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$, $ijkTarget$$, $rasResult$$);
  $_rasBB$$[0] = $rasResult$$[0] < $_rasBB$$[0] ? $rasResult$$[0] : $_rasBB$$[0];
  $_rasBB$$[1] = $rasResult$$[0] > $_rasBB$$[1] ? $rasResult$$[0] : $_rasBB$$[1];
  $_rasBB$$[2] = $rasResult$$[1] < $_rasBB$$[2] ? $rasResult$$[1] : $_rasBB$$[2];
  $_rasBB$$[3] = $rasResult$$[1] > $_rasBB$$[3] ? $rasResult$$[1] : $_rasBB$$[3];
  $_rasBB$$[4] = $rasResult$$[2] < $_rasBB$$[4] ? $rasResult$$[2] : $_rasBB$$[4];
  $_rasBB$$[5] = $rasResult$$[2] > $_rasBB$$[5] ? $rasResult$$[2] : $_rasBB$$[5];
  $ijkTarget$$ = $goog$vec$Vec4$createFloat32FromValues$$($MRIdim$$[0] - 1, 0, 0, 1);
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$, $ijkTarget$$, $rasResult$$);
  $_rasBB$$[0] = $rasResult$$[0] < $_rasBB$$[0] ? $rasResult$$[0] : $_rasBB$$[0];
  $_rasBB$$[1] = $rasResult$$[0] > $_rasBB$$[1] ? $rasResult$$[0] : $_rasBB$$[1];
  $_rasBB$$[2] = $rasResult$$[1] < $_rasBB$$[2] ? $rasResult$$[1] : $_rasBB$$[2];
  $_rasBB$$[3] = $rasResult$$[1] > $_rasBB$$[3] ? $rasResult$$[1] : $_rasBB$$[3];
  $_rasBB$$[4] = $rasResult$$[2] < $_rasBB$$[4] ? $rasResult$$[2] : $_rasBB$$[4];
  $_rasBB$$[5] = $rasResult$$[2] > $_rasBB$$[5] ? $rasResult$$[2] : $_rasBB$$[5];
  $ijkTarget$$ = $goog$vec$Vec4$createFloat32FromValues$$($MRIdim$$[0] - 1, $MRIdim$$[1] - 1, 0, 1);
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$, $ijkTarget$$, $rasResult$$);
  $_rasBB$$[0] = $rasResult$$[0] < $_rasBB$$[0] ? $rasResult$$[0] : $_rasBB$$[0];
  $_rasBB$$[1] = $rasResult$$[0] > $_rasBB$$[1] ? $rasResult$$[0] : $_rasBB$$[1];
  $_rasBB$$[2] = $rasResult$$[1] < $_rasBB$$[2] ? $rasResult$$[1] : $_rasBB$$[2];
  $_rasBB$$[3] = $rasResult$$[1] > $_rasBB$$[3] ? $rasResult$$[1] : $_rasBB$$[3];
  $_rasBB$$[4] = $rasResult$$[2] < $_rasBB$$[4] ? $rasResult$$[2] : $_rasBB$$[4];
  $_rasBB$$[5] = $rasResult$$[2] > $_rasBB$$[5] ? $rasResult$$[2] : $_rasBB$$[5];
  $ijkTarget$$ = $goog$vec$Vec4$createFloat32FromValues$$($MRIdim$$[0] - 1, 0, $MRIdim$$[2] - 1, 1);
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$, $ijkTarget$$, $rasResult$$);
  $_rasBB$$[0] = $rasResult$$[0] < $_rasBB$$[0] ? $rasResult$$[0] : $_rasBB$$[0];
  $_rasBB$$[1] = $rasResult$$[0] > $_rasBB$$[1] ? $rasResult$$[0] : $_rasBB$$[1];
  $_rasBB$$[2] = $rasResult$$[1] < $_rasBB$$[2] ? $rasResult$$[1] : $_rasBB$$[2];
  $_rasBB$$[3] = $rasResult$$[1] > $_rasBB$$[3] ? $rasResult$$[1] : $_rasBB$$[3];
  $_rasBB$$[4] = $rasResult$$[2] < $_rasBB$$[4] ? $rasResult$$[2] : $_rasBB$$[4];
  $_rasBB$$[5] = $rasResult$$[2] > $_rasBB$$[5] ? $rasResult$$[2] : $_rasBB$$[5];
  $ijkTarget$$ = $goog$vec$Vec4$createFloat32FromValues$$(0, $MRIdim$$[1] - 1, $MRIdim$$[2] - 1, 1);
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$, $ijkTarget$$, $rasResult$$);
  $_rasBB$$[0] = $rasResult$$[0] < $_rasBB$$[0] ? $rasResult$$[0] : $_rasBB$$[0];
  $_rasBB$$[1] = $rasResult$$[0] > $_rasBB$$[1] ? $rasResult$$[0] : $_rasBB$$[1];
  $_rasBB$$[2] = $rasResult$$[1] < $_rasBB$$[2] ? $rasResult$$[1] : $_rasBB$$[2];
  $_rasBB$$[3] = $rasResult$$[1] > $_rasBB$$[3] ? $rasResult$$[1] : $_rasBB$$[3];
  $_rasBB$$[4] = $rasResult$$[2] < $_rasBB$$[4] ? $rasResult$$[2] : $_rasBB$$[4];
  $_rasBB$$[5] = $rasResult$$[2] > $_rasBB$$[5] ? $rasResult$$[2] : $_rasBB$$[5];
  $ijkTarget$$ = $goog$vec$Vec4$createFloat32FromValues$$($MRIdim$$[0] - 1, $MRIdim$$[1] - 1, $MRIdim$$[2] - 1, 1);
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$, $ijkTarget$$, $rasResult$$);
  $_rasBB$$[0] = $rasResult$$[0] < $_rasBB$$[0] ? $rasResult$$[0] : $_rasBB$$[0];
  $_rasBB$$[1] = $rasResult$$[0] > $_rasBB$$[1] ? $rasResult$$[0] : $_rasBB$$[1];
  $_rasBB$$[2] = $rasResult$$[1] < $_rasBB$$[2] ? $rasResult$$[1] : $_rasBB$$[2];
  $_rasBB$$[3] = $rasResult$$[1] > $_rasBB$$[3] ? $rasResult$$[1] : $_rasBB$$[3];
  $_rasBB$$[4] = $rasResult$$[2] < $_rasBB$$[4] ? $rasResult$$[2] : $_rasBB$$[4];
  $_rasBB$$[5] = $rasResult$$[2] > $_rasBB$$[5] ? $rasResult$$[2] : $_rasBB$$[5];
  return $_rasBB$$
}
function $X$parser$xyrasTransform$$($_sliceNormal$$2$$, $_XYNormal$$) {
  var $_RASToXY$$ = $goog$vec$Mat4$createFloat32Identity$$();
  if(!($_sliceNormal$$2$$.length == $_XYNormal$$.length && $_sliceNormal$$2$$[0] == $_XYNormal$$[0] && $_sliceNormal$$2$$[1] == $_XYNormal$$[1] && $_sliceNormal$$2$$[2] == $_XYNormal$$[2])) {
    var $_XYToRAS__teta_d$$4$$ = Math.acos($_sliceNormal$$2$$[2]), $_r$$ = $goog$vec$Vec3$createFloat32$$(), $a$$44_x0$$inline_251$$ = $_sliceNormal$$2$$[0], $b$$33_y0$$inline_252$$ = $_sliceNormal$$2$$[1], $c$$15_z0$$inline_253$$ = $_sliceNormal$$2$$[2], $x1$$inline_254$$ = $_XYNormal$$[0], $y1$$inline_255$$ = $_XYNormal$$[1], $z1$$inline_256$$ = $_XYNormal$$[2];
    $_r$$[0] = $b$$33_y0$$inline_252$$ * $z1$$inline_256$$ - $c$$15_z0$$inline_253$$ * $y1$$inline_255$$;
    $_r$$[1] = $c$$15_z0$$inline_253$$ * $x1$$inline_254$$ - $a$$44_x0$$inline_251$$ * $z1$$inline_256$$;
    $_r$$[2] = $a$$44_x0$$inline_251$$ * $y1$$inline_255$$ - $b$$33_y0$$inline_252$$ * $x1$$inline_254$$;
    $goog$vec$Vec3$normalize$$($_r$$, $_r$$);
    $a$$44_x0$$inline_251$$ = Math.cos($_XYToRAS__teta_d$$4$$ / 2);
    $b$$33_y0$$inline_252$$ = Math.sin($_XYToRAS__teta_d$$4$$ / 2) * $_r$$[0];
    $c$$15_z0$$inline_253$$ = Math.sin($_XYToRAS__teta_d$$4$$ / 2) * $_r$$[1];
    $_XYToRAS__teta_d$$4$$ = Math.sin($_XYToRAS__teta_d$$4$$ / 2) * $_r$$[2];
    $goog$vec$Mat4$setRowValues$$($_RASToXY$$, 0, $a$$44_x0$$inline_251$$ * $a$$44_x0$$inline_251$$ + $b$$33_y0$$inline_252$$ * $b$$33_y0$$inline_252$$ - $c$$15_z0$$inline_253$$ * $c$$15_z0$$inline_253$$ - $_XYToRAS__teta_d$$4$$ * $_XYToRAS__teta_d$$4$$, 2 * ($b$$33_y0$$inline_252$$ * $c$$15_z0$$inline_253$$ - $a$$44_x0$$inline_251$$ * $_XYToRAS__teta_d$$4$$), 2 * ($b$$33_y0$$inline_252$$ * $_XYToRAS__teta_d$$4$$ + $a$$44_x0$$inline_251$$ * $c$$15_z0$$inline_253$$), 0);
    $goog$vec$Mat4$setRowValues$$($_RASToXY$$, 1, 2 * ($b$$33_y0$$inline_252$$ * $c$$15_z0$$inline_253$$ + $a$$44_x0$$inline_251$$ * $_XYToRAS__teta_d$$4$$), $a$$44_x0$$inline_251$$ * $a$$44_x0$$inline_251$$ + $c$$15_z0$$inline_253$$ * $c$$15_z0$$inline_253$$ - $b$$33_y0$$inline_252$$ * $b$$33_y0$$inline_252$$ - $_XYToRAS__teta_d$$4$$ * $_XYToRAS__teta_d$$4$$, 2 * ($c$$15_z0$$inline_253$$ * $_XYToRAS__teta_d$$4$$ - $a$$44_x0$$inline_251$$ * $b$$33_y0$$inline_252$$), 0);
    $goog$vec$Mat4$setRowValues$$($_RASToXY$$, 2, 2 * ($b$$33_y0$$inline_252$$ * $_XYToRAS__teta_d$$4$$ - $a$$44_x0$$inline_251$$ * $c$$15_z0$$inline_253$$), 2 * ($c$$15_z0$$inline_253$$ * $_XYToRAS__teta_d$$4$$ + $a$$44_x0$$inline_251$$ * $b$$33_y0$$inline_252$$), $a$$44_x0$$inline_251$$ * $a$$44_x0$$inline_251$$ + $_XYToRAS__teta_d$$4$$ * $_XYToRAS__teta_d$$4$$ - $c$$15_z0$$inline_253$$ * $c$$15_z0$$inline_253$$ - $b$$33_y0$$inline_252$$ * $b$$33_y0$$inline_252$$, 0)
  }
  $_XYToRAS__teta_d$$4$$ = $goog$vec$Mat4$createFloat32$$();
  $goog$vec$Mat4$invert$$($_RASToXY$$, $_XYToRAS__teta_d$$4$$);
  return[$_RASToXY$$, $_XYToRAS__teta_d$$4$$]
}
function $X$parser$reslice2$$($_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$, $_resY__sliceXYSpacing$$, $_sliceNormal$$3$$, $_color$$, $_RASToXY$$1__bbox$$2__right__rup$$, $_IJKVolume$$, $object$$11$$, $hasLabelMap$$, $colorTable$$) {
  var $sliceXY$$ = new $X$slice$$;
  $goog$vec$Vec3$normalize$$($_sliceNormal$$3$$, $_sliceNormal$$3$$);
  for(var $_rright__solutionsIn$$inline_261$$ = [], $_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ = [], $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$ = 0;6 > $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$;$_i$$inline_263__rasIntersection__xyBBox$$inline_274$$++) {
    for(var $_RASCenter__i2$$inline_264__solutionsXY$$1$$ = Math.floor($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$ / 2), $_i3$$inline_265__wmin__xyIntersection$$ = ($_RASCenter__i2$$inline_264__solutionsXY$$1$$ + 1) % 3, $_i4$$inline_266__wmax$$ = ($_RASCenter__i2$$inline_264__solutionsXY$$1$$ + 2) % 3, $_j3$$inline_267__swidth$$ = (4 + 2 * $_RASCenter__i2$$inline_264__solutionsXY$$1$$) % 6, $_hmin__j$$inline_268$$ = 0;2 > $_hmin__j$$inline_268$$;$_hmin__j$$inline_268$$++) {
      var $_hmax__j2$$inline_269$$ = (2 + $_hmin__j$$inline_268$$ + 2 * $_RASCenter__i2$$inline_264__solutionsXY$$1$$) % 6, $_sheight__solution$$inline_270$$ = -($_sliceNormal$$3$$[$_RASCenter__i2$$inline_264__solutionsXY$$1$$] * ($_RASToXY$$1__bbox$$2__right__rup$$[$_i$$inline_263__rasIntersection__xyBBox$$inline_274$$] - $_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$[$_RASCenter__i2$$inline_264__solutionsXY$$1$$]) + $_sliceNormal$$3$$[$_i3$$inline_265__wmin__xyIntersection$$] * ($_RASToXY$$1__bbox$$2__right__rup$$[$_hmax__j2$$inline_269$$] - 
      $_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$[$_i3$$inline_265__wmin__xyIntersection$$])) / $_sliceNormal$$3$$[$_i4$$inline_266__wmax$$] + $_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$[$_i4$$inline_266__wmax$$];
      if($_sheight__solution$$inline_270$$ >= $_RASToXY$$1__bbox$$2__right__rup$$[$_j3$$inline_267__swidth$$] && $_sheight__solution$$inline_270$$ <= $_RASToXY$$1__bbox$$2__right__rup$$[$_j3$$inline_267__swidth$$ + 1] || $_sheight__solution$$inline_270$$ <= $_RASToXY$$1__bbox$$2__right__rup$$[$_j3$$inline_267__swidth$$] && $_sheight__solution$$inline_270$$ >= $_RASToXY$$1__bbox$$2__right__rup$$[$_j3$$inline_267__swidth$$ + 1]) {
        var $_resX__sol$$inline_271$$ = [];
        $_resX__sol$$inline_271$$[$_RASCenter__i2$$inline_264__solutionsXY$$1$$] = $_RASToXY$$1__bbox$$2__right__rup$$[$_i$$inline_263__rasIntersection__xyBBox$$inline_274$$];
        $_resX__sol$$inline_271$$[$_i3$$inline_265__wmin__xyIntersection$$] = $_RASToXY$$1__bbox$$2__right__rup$$[$_hmax__j2$$inline_269$$];
        $_resX__sol$$inline_271$$[$_i4$$inline_266__wmax$$] = $_sheight__solution$$inline_270$$;
        $_rright__solutionsIn$$inline_261$$.push($_resX__sol$$inline_271$$)
      }else {
        $_resX__sol$$inline_271$$ = [], $_resX__sol$$inline_271$$[$_RASCenter__i2$$inline_264__solutionsXY$$1$$] = $_RASToXY$$1__bbox$$2__right__rup$$[$_i$$inline_263__rasIntersection__xyBBox$$inline_274$$], $_resX__sol$$inline_271$$[$_i3$$inline_265__wmin__xyIntersection$$] = $_RASToXY$$1__bbox$$2__right__rup$$[$_hmax__j2$$inline_269$$], $_resX__sol$$inline_271$$[$_i4$$inline_266__wmax$$] = $_sheight__solution$$inline_270$$, $_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$.push($_resX__sol$$inline_271$$)
      }
    }
  }
  $_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$ = $goog$vec$Vec3$createFloat32FromValues$$(0, 0, 1);
  $_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$ = $X$parser$xyrasTransform$$($_sliceNormal$$3$$, $_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$);
  $_RASToXY$$1__bbox$$2__right__rup$$ = $_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$[0];
  $_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$ = $_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$[1];
  $_RASCenter__i2$$inline_264__solutionsXY$$1$$ = [];
  for($_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ = 0;$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ < $_rright__solutionsIn$$inline_261$$.length;++$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$) {
    $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$ = $goog$vec$Vec4$createFloat32FromValues$$($_rright__solutionsIn$$inline_261$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][0], $_rright__solutionsIn$$inline_261$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][1], $_rright__solutionsIn$$inline_261$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][2], 1), $_i3$$inline_265__wmin__xyIntersection$$ = $goog$vec$Vec4$createFloat32$$(), 
    $goog$vec$Mat4$multVec4$$($_RASToXY$$1__bbox$$2__right__rup$$, $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$, $_i3$$inline_265__wmin__xyIntersection$$), $_RASCenter__i2$$inline_264__solutionsXY$$1$$.push([$_i3$$inline_265__wmin__xyIntersection$$[0], $_i3$$inline_265__wmin__xyIntersection$$[1], $_i3$$inline_265__wmin__xyIntersection$$[2]])
  }
  $_RASToXY$$1__bbox$$2__right__rup$$ = $goog$vec$Vec3$createFloat32FromValues$$(1, 0, 0);
  $_rright__solutionsIn$$inline_261$$ = $goog$vec$Vec3$createFloat32$$();
  $goog$vec$Mat4$multVec3$$($_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$, $_RASToXY$$1__bbox$$2__right__rup$$, $_rright__solutionsIn$$inline_261$$);
  $_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ = $goog$vec$Vec3$createFloat32FromValues$$(0, 1, 0);
  $_RASToXY$$1__bbox$$2__right__rup$$ = $goog$vec$Vec3$createFloat32$$();
  $goog$vec$Mat4$multVec3$$($_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$, $_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$, $_RASToXY$$1__bbox$$2__right__rup$$);
  $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$ = [Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE];
  for($_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ = $_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ = 0;$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ < $_RASCenter__i2$$inline_264__solutionsXY$$1$$.length;++$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$) {
    $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][0] < $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[0] && ($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[0] = $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][0]), $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][0] > 
    $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[1] && ($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[1] = $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][0]), $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][1] < $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[2] && ($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[2] = $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][1]), 
    $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][1] > $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[3] && ($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[3] = $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][1]), $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][2] < 
    $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[4] && ($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[4] = $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][2]), $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][2] > $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[5] && ($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[5] = $_RASCenter__i2$$inline_264__solutionsXY$$1$$[$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$][2])
  }
  $_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ = $goog$vec$Vec4$createFloat32FromValues$$($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[0] + ($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[1] - $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[0]) / 2, $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[2] + ($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[3] - $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[2]) / 2, $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[4] + 
  ($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[5] - $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[4]) / 2, 0);
  $_RASCenter__i2$$inline_264__solutionsXY$$1$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multMat$$($_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$, $_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$, $_RASCenter__i2$$inline_264__solutionsXY$$1$$);
  $_i3$$inline_265__wmin__xyIntersection$$ = Math.floor($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[0]);
  $_i4$$inline_266__wmax$$ = Math.ceil($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[1]);
  $_i3$$inline_265__wmin__xyIntersection$$ == $_i4$$inline_266__wmax$$ && $_i4$$inline_266__wmax$$++;
  $_j3$$inline_267__swidth$$ = $_i4$$inline_266__wmax$$ - $_i3$$inline_265__wmin__xyIntersection$$;
  $_hmin__j$$inline_268$$ = Math.floor($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[2]);
  $_hmax__j2$$inline_269$$ = Math.ceil($_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[3]);
  $_sheight__solution$$inline_270$$ = $_hmax__j2$$inline_269$$ - $_hmin__j$$inline_268$$;
  $_resX__sol$$inline_271$$ = $_resY__sliceXYSpacing$$[0];
  $_resY__sliceXYSpacing$$ = $_resY__sliceXYSpacing$$[1];
  var $_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ = Math.ceil($_j3$$inline_267__swidth$$ / $_resX__sol$$inline_271$$), $_csheight__indexIJK$$ = Math.ceil($_sheight__solution$$inline_270$$ / $_resY__sliceXYSpacing$$), $textureForCurrentSlice$$ = new Uint8Array(4 * $_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ * $_csheight__indexIJK$$), $pixelTexture$$ = new $X$texture$$;
  $pixelTexture$$.$_rawDataWidth$ = $_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$;
  $pixelTexture$$.$_rawDataHeight$ = $_csheight__indexIJK$$;
  var $_csheight__indexIJK$$ = $goog$vec$Vec4$createFloat32$$(), $_indexXY$$ = $goog$vec$Vec4$createFloat32FromValues$$(0, 0, $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$[4], 1), $_XYToIJK$$ = $goog$vec$Mat4$createFloat32$$();
  $goog$vec$Mat4$multMat$$($object$$11$$.$_RASToIJK$, $_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$, $_XYToIJK$$);
  for(var $_he$$ = $_hmax__j2$$inline_269$$ - 1E-7, $_we$$ = $_i4$$inline_266__wmax$$ - 1E-7, $_p$$ = 0, $_iWidth$$ = 0, $_iHeight$$ = 0, $j$$8$$ = $_hmin__j$$inline_268$$, $j$$8$$ = $_hmin__j$$inline_268$$;$j$$8$$ <= $_he$$;$j$$8$$ += $_resY__sliceXYSpacing$$) {
    $_iHeight$$++;
    $_iWidth$$ = 0;
    $_indexXY$$[1] = $j$$8$$;
    for($_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ = $_i3$$inline_265__wmin__xyIntersection$$;$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ <= $_we$$;$_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$ += $_resX__sol$$inline_271$$) {
      $_iWidth$$++;
      $_indexXY$$[0] = $_cswidth__solutionsOut$$inline_262__up__xyCenter_i$$109_i$$inline_275$$;
      $goog$vec$Mat4$multVec4$$($_XYToIJK$$, $_indexXY$$, $_csheight__indexIJK$$);
      var $textureStartIndex$$ = 4 * $_p$$, $_k$$1_pixelValue_r$$ = Math.floor($_csheight__indexIJK$$[2]), $_j$$2_pixelValue_g$$ = Math.floor($_csheight__indexIJK$$[1]), $_i$$3_pixelValue_b$$ = Math.floor($_csheight__indexIJK$$[0]);
      if(0 <= $_i$$3_pixelValue_b$$ && $_i$$3_pixelValue_b$$ < $object$$11$$.$_dimensions$[0] && 0 <= $_j$$2_pixelValue_g$$ && $_j$$2_pixelValue_g$$ < $object$$11$$.$_dimensions$[1] && 0 <= $_k$$1_pixelValue_r$$ && $_k$$1_pixelValue_r$$ < $object$$11$$.$_dimensions$[2]) {
        var $lookupValue_pixval$$ = $_IJKVolume$$[$_k$$1_pixelValue_r$$][$_j$$2_pixelValue_g$$][$_i$$3_pixelValue_b$$], $pixelValue_a$$ = $_i$$3_pixelValue_b$$ = $_j$$2_pixelValue_g$$ = $_k$$1_pixelValue_r$$ = 0;
        $colorTable$$ ? (($lookupValue_pixval$$ = $colorTable$$.get($lookupValue_pixval$$)) || ($lookupValue_pixval$$ = [0, 0.61, 0, 0, 1]), $_k$$1_pixelValue_r$$ = 255 * $lookupValue_pixval$$[1], $_j$$2_pixelValue_g$$ = 255 * $lookupValue_pixval$$[2], $_i$$3_pixelValue_b$$ = 255 * $lookupValue_pixval$$[3], $pixelValue_a$$ = 255 * $lookupValue_pixval$$[4]) : ($_k$$1_pixelValue_r$$ = $_j$$2_pixelValue_g$$ = $_i$$3_pixelValue_b$$ = 255 * ($lookupValue_pixval$$ / $object$$11$$.$_max$), $pixelValue_a$$ = 
        255);
        $textureForCurrentSlice$$[$textureStartIndex$$] = $_k$$1_pixelValue_r$$;
        $textureForCurrentSlice$$[++$textureStartIndex$$] = $_j$$2_pixelValue_g$$;
        $textureForCurrentSlice$$[++$textureStartIndex$$] = $_i$$3_pixelValue_b$$;
        $textureForCurrentSlice$$[++$textureStartIndex$$] = $pixelValue_a$$
      }else {
        $textureForCurrentSlice$$[$textureStartIndex$$] = 0, $textureForCurrentSlice$$[++$textureStartIndex$$] = 0, $textureForCurrentSlice$$[++$textureStartIndex$$] = 0, $textureForCurrentSlice$$[++$textureStartIndex$$] = 0
      }
      $_p$$++
    }
  }
  $pixelTexture$$.$_rawData$ = $textureForCurrentSlice$$;
  $sliceXY$$.$_texture$ = $pixelTexture$$;
  $sliceXY$$.$_xyBBox$ = $_i$$inline_263__rasIntersection__xyBBox$$inline_274$$;
  $sliceXY$$.$_XYToRAS$ = $_XYNormal$$1__XYRASTransform__XYToRAS$$1__sliceOrigin$$2$$;
  $sliceXY$$.$_XYToIJK$ = $_XYToIJK$$;
  $sliceXY$$.$_hmin$ = $_hmin__j$$inline_268$$;
  $sliceXY$$.$_hmax$ = $_hmax__j2$$inline_269$$;
  $sliceXY$$.$_wmin$ = $_i3$$inline_265__wmin__xyIntersection$$;
  $sliceXY$$.$_wmax$ = $_i4$$inline_266__wmax$$;
  $sliceXY$$.$_iWidth$ = $_iWidth$$;
  $sliceXY$$.$_iHeight$ = $_iHeight$$;
  $sliceXY$$.$_widthSpacing$ = $_resX__sol$$inline_271$$;
  $sliceXY$$.$_width$ = $_j3$$inline_267__swidth$$;
  $sliceXY$$.$_heightSpacing$ = $_resY__sliceXYSpacing$$;
  $sliceXY$$.$_height$ = $_sheight__solution$$inline_270$$;
  $sliceXY$$.$_center$ = [$_RASCenter__i2$$inline_264__solutionsXY$$1$$[0], $_RASCenter__i2$$inline_264__solutionsXY$$1$$[1], $_RASCenter__i2$$inline_264__solutionsXY$$1$$[2]];
  $sliceXY$$.$_front$ = [$_sliceNormal$$3$$[0], $_sliceNormal$$3$$[1], $_sliceNormal$$3$$[2]];
  $sliceXY$$.$_right$ = [$_rright__solutionsIn$$inline_261$$[0], $_rright__solutionsIn$$inline_261$$[1], $_rright__solutionsIn$$inline_261$$[2]];
  $sliceXY$$.$_up$ = [$_RASToXY$$1__bbox$$2__right__rup$$[0], $_RASToXY$$1__bbox$$2__right__rup$$[1], $_RASToXY$$1__bbox$$2__right__rup$$[2]];
  $sliceXY$$.$_visible$ = $JSCompiler_alias_FALSE$$;
  $sliceXY$$.$_volume$ = $object$$11$$;
  $sliceXY$$.$_borders$ = $object$$11$$.$_volume$ != $JSCompiler_alias_NULL$$ && !$hasLabelMap$$ ? $JSCompiler_alias_FALSE$$ : $JSCompiler_alias_TRUE$$;
  $sliceXY$$.$_borderColor$ = $_color$$;
  $sliceXY$$.$create_$();
  $sliceXY$$.$_visible$ = $JSCompiler_alias_FALSE$$;
  return $sliceXY$$
}
function $JSCompiler_StaticMethods_updateSliceInfo$$($_index$$, $_sliceOrigin$$3__solutionsInLine$$, $_sliceNormal$$4$$, $object$$12$$) {
  var $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$;
  $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ = $object$$12$$.$_BBox$;
  for(var $_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$ = [], $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$ = [], $_i$$inline_282__rasSpacing_scalar$$inline_294$$ = 0;6 > $_i$$inline_282__rasSpacing_scalar$$inline_294$$;$_i$$inline_282__rasSpacing_scalar$$inline_294$$++) {
    var $_i2$$inline_283$$ = Math.floor($_i$$inline_282__rasSpacing_scalar$$inline_294$$ / 2), $_i3$$inline_284$$ = ($_i2$$inline_283$$ + 1) % 3, $_i4$$inline_285$$ = ($_i2$$inline_283$$ + 2) % 3, $_j1$$inline_286__sol$$inline_291$$ = (2 + 2 * $_i2$$inline_283$$) % 6, $_j2$$inline_287$$ = (4 + 2 * $_i2$$inline_283$$) % 6, $_sol2$$inline_290__t$$inline_288$$ = ($_bbox$$inline_277__dist__nb__solutionsLine__tmp$$[$_i$$inline_282__rasSpacing_scalar$$inline_294$$] - $_sliceOrigin$$3__solutionsInLine$$[$_i2$$inline_283$$]) * 
    (1 / $_sliceNormal$$4$$[$_i2$$inline_283$$]);
    if(Infinity != $_sol2$$inline_290__t$$inline_288$$ && -Infinity != $_sol2$$inline_290__t$$inline_288$$) {
      var $_sol1$$inline_289$$ = $_sliceOrigin$$3__solutionsInLine$$[$_i3$$inline_284$$] + $_sliceNormal$$4$$[$_i3$$inline_284$$] * $_sol2$$inline_290__t$$inline_288$$, $_sol2$$inline_290__t$$inline_288$$ = $_sliceOrigin$$3__solutionsInLine$$[$_i4$$inline_285$$] + $_sliceNormal$$4$$[$_i4$$inline_285$$] * $_sol2$$inline_290__t$$inline_288$$;
      $_sol1$$inline_289$$ >= $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$[$_j1$$inline_286__sol$$inline_291$$] && $_sol1$$inline_289$$ <= $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$[$_j1$$inline_286__sol$$inline_291$$ + 1] && $_sol2$$inline_290__t$$inline_288$$ >= $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$[$_j2$$inline_287$$] && $_sol2$$inline_290__t$$inline_288$$ <= $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$[$_j2$$inline_287$$ + 1] ? ($_j1$$inline_286__sol$$inline_291$$ = 
      [], $_j1$$inline_286__sol$$inline_291$$[$_i2$$inline_283$$] = $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$[$_i$$inline_282__rasSpacing_scalar$$inline_294$$], $_j1$$inline_286__sol$$inline_291$$[$_i3$$inline_284$$] = $_sol1$$inline_289$$, $_j1$$inline_286__sol$$inline_291$$[$_i4$$inline_285$$] = $_sol2$$inline_290__t$$inline_288$$, $_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$.push($_j1$$inline_286__sol$$inline_291$$)) : ($_j1$$inline_286__sol$$inline_291$$ = [], $_j1$$inline_286__sol$$inline_291$$[$_i2$$inline_283$$] = 
      $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$[$_i$$inline_282__rasSpacing_scalar$$inline_294$$], $_j1$$inline_286__sol$$inline_291$$[$_i3$$inline_284$$] = $_sol1$$inline_289$$, $_j1$$inline_286__sol$$inline_291$$[$_i4$$inline_285$$] = $_sol2$$inline_290__t$$inline_288$$, $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$.push($_j1$$inline_286__sol$$inline_291$$))
    }
  }
  $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ = [$_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$, $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$];
  $_sliceOrigin$$3__solutionsInLine$$ = $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$[0];
  $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$ = $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$;
  $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ = $goog$math$Vec3$distance$$(new $goog$math$Vec3$$($_sliceOrigin$$3__solutionsInLine$$[0][0], $_sliceOrigin$$3__solutionsInLine$$[0][1], $_sliceOrigin$$3__solutionsInLine$$[0][2]), new $goog$math$Vec3$$($_sliceOrigin$$3__solutionsInLine$$[1][0], $_sliceOrigin$$3__solutionsInLine$$[1][1], $_sliceOrigin$$3__solutionsInLine$$[1][2]));
  $object$$12$$.$_childrenInfo$[$_index$$].$_dist$ = $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$;
  $_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$ = $goog$vec$Vec3$createFloat32FromValues$$(0, 0, 1);
  $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$ = $X$parser$xyrasTransform$$($_sliceNormal$$4$$, $_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$)[0];
  $_i$$inline_282__rasSpacing_scalar$$inline_294$$ = $goog$vec$Vec4$createFloat32FromValues$$($object$$12$$.$_RASSpacing$[0], $object$$12$$.$_RASSpacing$[1], $object$$12$$.$_RASSpacing$[2], 0);
  $_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$, $_i$$inline_282__rasSpacing_scalar$$inline_294$$, $_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$);
  $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$ = $goog$vec$Vec4$createFloat32$$();
  $_i$$inline_282__rasSpacing_scalar$$inline_294$$ = $_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$[2];
  $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$[0] = $_sliceNormal$$4$$[0] * $_i$$inline_282__rasSpacing_scalar$$inline_294$$;
  $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$[1] = $_sliceNormal$$4$$[1] * $_i$$inline_282__rasSpacing_scalar$$inline_294$$;
  $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$[2] = $_sliceNormal$$4$$[2] * $_i$$inline_282__rasSpacing_scalar$$inline_294$$;
  $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$[3] = $_sliceNormal$$4$$[3] * $_i$$inline_282__rasSpacing_scalar$$inline_294$$;
  0.5 > Math.abs($_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$[0]) && ($_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$[0] = 0.5);
  0.5 > Math.abs($_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$[1]) && ($_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$[1] = 0.5);
  $object$$12$$.$_childrenInfo$[$_index$$].$_sliceXYSpacing$ = [Math.abs($_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$[0]), Math.abs($_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$[1])];
  $object$$12$$.$_childrenInfo$[$_index$$].$_sliceSpacing$ = $_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$[2];
  $object$$12$$.$_childrenInfo$[$_index$$].$_sliceDirection$ = $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$;
  $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ = Math.floor(Math.abs($_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ / $_XYNormal$$2__solutionsIn$$inline_280__xySpacing$$[2]));
  $object$$12$$.$_range$[$_index$$] = $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ + 1;
  $object$$12$$.$_childrenInfo$[$_index$$].$_nb$ = $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ + 1;
  $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0][0] > $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1][0] ? 0 < $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$[0] && ($_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ = $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0], $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0] = $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1], $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1] = 
  $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$) : $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0][0] < $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1][0] ? 0 > $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$[0] && ($_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ = $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0], $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0] = $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1], 
  $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1] = $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$) : $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0][1] > $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1][1] ? 0 < $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$[1] && ($_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ = $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0], $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0] = 
  $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1], $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1] = $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$) : $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0][1] < $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1][1] ? 0 > $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$[1] && ($_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ = $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0], 
  $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0] = $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1], $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1] = $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$) : $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0][2] > $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1][2] ? 0 < $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$[2] && ($_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ = 
  $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0], $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0] = $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1], $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1] = $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$) : $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0][2] < $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1][2] && 0 > $_RASToXY$$2__sliceDirection__solutionsOut$$inline_281$$[2] && 
  ($_bbox$$inline_277__dist__nb__solutionsLine__tmp$$ = $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0], $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][0] = $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1], $object$$12$$.$_childrenInfo$[$_index$$].$_solutionsLine$[0][1] = $_bbox$$inline_277__dist__nb__solutionsLine__tmp$$);
  $object$$12$$.$_childrenInfo$[$_index$$].$_originD$ = -($_sliceNormal$$4$$[0] * $_sliceOrigin$$3__solutionsInLine$$[0][0] + $_sliceNormal$$4$$[1] * $_sliceOrigin$$3__solutionsInLine$$[0][1] + $_sliceNormal$$4$$[2] * $_sliceOrigin$$3__solutionsInLine$$[0][2])
}
function $JSCompiler_StaticMethods_reslice$$($JSCompiler_StaticMethods_reslice$self$$, $object$$13$$) {
  var $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$;
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$ = $object$$13$$.$_data$;
  for(var $_dims$$inline_298__sliceNormal$$5$$ = $object$$13$$.$_dimensions$, $_color$$1__max$$inline_299$$ = $object$$13$$.$_max$, $_image$$inline_300$$ = Array($_dims$$inline_298__sliceNormal$$5$$[2]), $_imageN$$inline_301$$ = Array($_dims$$inline_298__sliceNormal$$5$$[2]), $_nb_pix_per_slice$$inline_302$$ = $_dims$$inline_298__sliceNormal$$5$$[1] * $_dims$$inline_298__sliceNormal$$5$$[0], $_pix_value$$inline_303$$ = 0, $_i$$inline_304$$ = 0, $_j$$inline_305$$ = 0, $_k$$inline_306$$ = 0, $_data_pointer$$inline_307$$ = 
  0, $_k$$inline_306$$ = 0;$_k$$inline_306$$ < $_dims$$inline_298__sliceNormal$$5$$[2];$_k$$inline_306$$++) {
    var $_current_k$$inline_308$$ = $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$.subarray($_k$$inline_306$$ * $_nb_pix_per_slice$$inline_302$$, ($_k$$inline_306$$ + 1) * $_nb_pix_per_slice$$inline_302$$), $_data_pointer$$inline_307$$ = 0;
    $_imageN$$inline_301$$[$_k$$inline_306$$] = Array($_dims$$inline_298__sliceNormal$$5$$[1]);
    $_image$$inline_300$$[$_k$$inline_306$$] = Array($_dims$$inline_298__sliceNormal$$5$$[1]);
    for($_j$$inline_305$$ = 0;$_j$$inline_305$$ < $_dims$$inline_298__sliceNormal$$5$$[1];$_j$$inline_305$$++) {
      $_imageN$$inline_301$$[$_k$$inline_306$$][$_j$$inline_305$$] = new $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$.constructor($_dims$$inline_298__sliceNormal$$5$$[0]);
      $_image$$inline_300$$[$_k$$inline_306$$][$_j$$inline_305$$] = new $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$.constructor($_dims$$inline_298__sliceNormal$$5$$[0]);
      for($_i$$inline_304$$ = 0;$_i$$inline_304$$ < $_dims$$inline_298__sliceNormal$$5$$[0];$_i$$inline_304$$++) {
        $_pix_value$$inline_303$$ = $_current_k$$inline_308$$[$_data_pointer$$inline_307$$], $_imageN$$inline_301$$[$_k$$inline_306$$][$_j$$inline_305$$][$_i$$inline_304$$] = 255 * ($_pix_value$$inline_303$$ / $_color$$1__max$$inline_299$$), $_image$$inline_300$$[$_k$$inline_306$$][$_j$$inline_305$$][$_i$$inline_304$$] = $_pix_value$$inline_303$$, $_data_pointer$$inline_307$$++
      }
    }
  }
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$ = [$_image$$inline_300$$, $_imageN$$inline_301$$];
  $object$$13$$.$_IJKVolume$ = $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$[0];
  $object$$13$$.$_IJKVolumeN$ = $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$[1];
  $X$$.$TIMER$($JSCompiler_StaticMethods_reslice$self$$.$_classname$ + ".reslice");
  $object$$13$$.$hasLabelMap$ = $object$$13$$.$_labelmap$ != $JSCompiler_alias_NULL$$;
  $object$$13$$.$_colortable$ && ($object$$13$$.$_colorTable$ = $object$$13$$.$_colortable$.$_map$);
  $object$$13$$.$range$ = [0, 0, 0];
  $object$$13$$.$_RASCenter$ = [$object$$13$$.$_RASOrigin$[0] + ($object$$13$$.$_RASDimensions$[0] - 1) / 2, $object$$13$$.$_RASOrigin$[1] + ($object$$13$$.$_RASDimensions$[1] - 1) / 2, $object$$13$$.$_RASOrigin$[2] + ($object$$13$$.$_RASDimensions$[2] - 1) / 2];
  $object$$13$$.$_BBox$ = [Math.min($object$$13$$.$_RASOrigin$[0], $object$$13$$.$_RASOrigin$[0] + $object$$13$$.$_RASDimensions$[0] - 1), Math.max($object$$13$$.$_RASOrigin$[0], $object$$13$$.$_RASOrigin$[0] + $object$$13$$.$_RASDimensions$[0] - 1), Math.min($object$$13$$.$_RASOrigin$[1], $object$$13$$.$_RASOrigin$[1] + $object$$13$$.$_RASDimensions$[1] - 1), Math.max($object$$13$$.$_RASOrigin$[1], $object$$13$$.$_RASOrigin$[1] + $object$$13$$.$_RASDimensions$[1] - 1), Math.min($object$$13$$.$_RASOrigin$[2], 
  $object$$13$$.$_RASOrigin$[2] + $object$$13$$.$_RASDimensions$[2] - 1), Math.max($object$$13$$.$_RASOrigin$[2], $object$$13$$.$_RASOrigin$[2] + $object$$13$$.$_RASDimensions$[2] - 1)];
  $object$$13$$.$_childrenInfo$ = [{}, {}, {}];
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$ = $goog$vec$Vec3$createFloat32FromValues$$($object$$13$$.$_RASCenter$[0], $object$$13$$.$_RASCenter$[1], $object$$13$$.$_RASCenter$[2]);
  $object$$13$$.$_childrenInfo$[0].$_sliceOrigin$ = $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$;
  $_dims$$inline_298__sliceNormal$$5$$ = $goog$vec$Vec3$createFloat32FromValues$$(1, 0, 0);
  $goog$vec$Vec3$normalize$$($_dims$$inline_298__sliceNormal$$5$$, $_dims$$inline_298__sliceNormal$$5$$);
  $object$$13$$.$_childrenInfo$[0].$_sliceNormal$ = $_dims$$inline_298__sliceNormal$$5$$;
  $_color$$1__max$$inline_299$$ = [1, 0, 0];
  $object$$13$$.$_childrenInfo$[0].$_color$ = $_color$$1__max$$inline_299$$;
  $JSCompiler_StaticMethods_updateSliceInfo$$(0, $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$, $_dims$$inline_298__sliceNormal$$5$$, $object$$13$$);
  $object$$13$$.$_children$[0].$_children$ = Array($object$$13$$.$_childrenInfo$[0].$_nb$);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$[0] = $object$$13$$.$_childrenInfo$[0].$_solutionsLine$[0][0][0] + $object$$13$$.$_childrenInfo$[0].$_sliceDirection$[0] * Math.floor($object$$13$$.$_childrenInfo$[0].$_nb$ / 2);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$[1] = $object$$13$$.$_childrenInfo$[0].$_solutionsLine$[0][0][1] + $object$$13$$.$_childrenInfo$[0].$_sliceDirection$[1] * Math.floor($object$$13$$.$_childrenInfo$[0].$_nb$ / 2);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$[2] = $object$$13$$.$_childrenInfo$[0].$_solutionsLine$[0][0][2] + $object$$13$$.$_childrenInfo$[0].$_sliceDirection$[2] * Math.floor($object$$13$$.$_childrenInfo$[0].$_nb$ / 2);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$ = $X$parser$reslice2$$($_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$, $object$$13$$.$_childrenInfo$[0].$_sliceXYSpacing$, $object$$13$$.$_childrenInfo$[0].$_sliceNormal$, $object$$13$$.$_childrenInfo$[0].$_color$, $object$$13$$.$_BBox$, $object$$13$$.$_IJKVolume$, $object$$13$$, $object$$13$$.$hasLabelMap$, $object$$13$$.$_colorTable$);
  $object$$13$$.$hasLabelMap$ && ($_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$.$_labelmap$ = $object$$13$$.$_labelmap$.$_children$[0].$_children$[Math.floor($object$$13$$.$_childrenInfo$[0].$_nb$ / 2)].$_texture$);
  $object$$13$$.$_children$[0].$_children$[Math.floor($object$$13$$.$_childrenInfo$[0].$_nb$ / 2)] = $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$;
  $object$$13$$.$_indexX$ = Math.floor($object$$13$$.$_childrenInfo$[0].$_nb$ / 2);
  $object$$13$$.$_indexXold$ = Math.floor($object$$13$$.$_childrenInfo$[0].$_nb$ / 2);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$ = $goog$vec$Vec3$createFloat32FromValues$$($object$$13$$.$_RASCenter$[0], $object$$13$$.$_RASCenter$[1], $object$$13$$.$_RASCenter$[2]);
  $object$$13$$.$_childrenInfo$[1].$_sliceOrigin$ = $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$;
  $_dims$$inline_298__sliceNormal$$5$$ = $goog$vec$Vec3$createFloat32FromValues$$(0, 1, 0);
  $goog$vec$Vec3$normalize$$($_dims$$inline_298__sliceNormal$$5$$, $_dims$$inline_298__sliceNormal$$5$$);
  $object$$13$$.$_childrenInfo$[1].$_sliceNormal$ = $_dims$$inline_298__sliceNormal$$5$$;
  $_color$$1__max$$inline_299$$ = [0, 1, 0];
  $object$$13$$.$_childrenInfo$[1].$_color$ = $_color$$1__max$$inline_299$$;
  $JSCompiler_StaticMethods_updateSliceInfo$$(1, $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$, $_dims$$inline_298__sliceNormal$$5$$, $object$$13$$);
  $object$$13$$.$_children$[1].$_children$ = Array($object$$13$$.$_childrenInfo$[1].$_nb$);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$[0] = $object$$13$$.$_childrenInfo$[1].$_solutionsLine$[0][0][0] + $object$$13$$.$_childrenInfo$[1].$_sliceDirection$[0] * Math.floor($object$$13$$.$_childrenInfo$[1].$_nb$ / 2);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$[1] = $object$$13$$.$_childrenInfo$[1].$_solutionsLine$[0][0][1] + $object$$13$$.$_childrenInfo$[1].$_sliceDirection$[1] * Math.floor($object$$13$$.$_childrenInfo$[1].$_nb$ / 2);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$[2] = $object$$13$$.$_childrenInfo$[1].$_solutionsLine$[0][0][2] + $object$$13$$.$_childrenInfo$[1].$_sliceDirection$[2] * Math.floor($object$$13$$.$_childrenInfo$[1].$_nb$ / 2);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$ = $X$parser$reslice2$$($_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$, $object$$13$$.$_childrenInfo$[1].$_sliceXYSpacing$, $object$$13$$.$_childrenInfo$[1].$_sliceNormal$, $object$$13$$.$_childrenInfo$[1].$_color$, $object$$13$$.$_BBox$, $object$$13$$.$_IJKVolume$, $object$$13$$, $object$$13$$.$hasLabelMap$, $object$$13$$.$_colorTable$);
  $object$$13$$.$hasLabelMap$ && ($_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$.$_labelmap$ = $object$$13$$.$_labelmap$.$_children$[1].$_children$[Math.floor($object$$13$$.$_childrenInfo$[1].$_nb$ / 2)].$_texture$);
  $object$$13$$.$_children$[1].$_children$[Math.floor($object$$13$$.$_childrenInfo$[1].$_nb$ / 2)] = $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$;
  $object$$13$$.$_indexY$ = Math.floor($object$$13$$.$_childrenInfo$[1].$_nb$ / 2);
  $object$$13$$.$_indexYold$ = Math.floor($object$$13$$.$_childrenInfo$[1].$_nb$ / 2);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$ = $goog$vec$Vec3$createFloat32FromValues$$($object$$13$$.$_RASCenter$[0], $object$$13$$.$_RASCenter$[1], $object$$13$$.$_RASCenter$[2]);
  $object$$13$$.$_childrenInfo$[2].$_sliceOrigin$ = $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$;
  $_dims$$inline_298__sliceNormal$$5$$ = $goog$vec$Vec3$createFloat32FromValues$$(0, 0, 1);
  $goog$vec$Vec3$normalize$$($_dims$$inline_298__sliceNormal$$5$$, $_dims$$inline_298__sliceNormal$$5$$);
  $object$$13$$.$_childrenInfo$[2].$_sliceNormal$ = $_dims$$inline_298__sliceNormal$$5$$;
  $_color$$1__max$$inline_299$$ = [0, 0.392, 0.804];
  $object$$13$$.$_childrenInfo$[2].$_color$ = $_color$$1__max$$inline_299$$;
  $JSCompiler_StaticMethods_updateSliceInfo$$(2, $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$, $_dims$$inline_298__sliceNormal$$5$$, $object$$13$$);
  $object$$13$$.$_children$[2].$_children$ = Array($object$$13$$.$_childrenInfo$[2].$_nb$);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$[0] = $object$$13$$.$_childrenInfo$[2].$_solutionsLine$[0][0][0] + $object$$13$$.$_childrenInfo$[2].$_sliceDirection$[0] * Math.floor($object$$13$$.$_childrenInfo$[2].$_nb$ / 2);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$[1] = $object$$13$$.$_childrenInfo$[2].$_solutionsLine$[0][0][1] + $object$$13$$.$_childrenInfo$[2].$_sliceDirection$[1] * Math.floor($object$$13$$.$_childrenInfo$[2].$_nb$ / 2);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$[2] = $object$$13$$.$_childrenInfo$[2].$_solutionsLine$[0][0][2] + $object$$13$$.$_childrenInfo$[2].$_sliceDirection$[2] * Math.floor($object$$13$$.$_childrenInfo$[2].$_nb$ / 2);
  $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$ = $X$parser$reslice2$$($_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$, $object$$13$$.$_childrenInfo$[2].$_sliceXYSpacing$, $object$$13$$.$_childrenInfo$[2].$_sliceNormal$, $object$$13$$.$_childrenInfo$[2].$_color$, $object$$13$$.$_BBox$, $object$$13$$.$_IJKVolume$, $object$$13$$, $object$$13$$.$hasLabelMap$, $object$$13$$.$_colorTable$);
  $object$$13$$.$hasLabelMap$ && ($_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$.$_labelmap$ = $object$$13$$.$_labelmap$.$_children$[2].$_children$[Math.floor($object$$13$$.$_childrenInfo$[2].$_nb$ / 2)].$_texture$);
  $object$$13$$.$_children$[2].$_children$[Math.floor($object$$13$$.$_childrenInfo$[2].$_nb$ / 2)] = $_IJKVolumes__data$$inline_297__slice__sliceOrigin$$4$$;
  $object$$13$$.$_indexZ$ = Math.floor($object$$13$$.$_childrenInfo$[2].$_nb$ / 2);
  $object$$13$$.$_indexZold$ = Math.floor($object$$13$$.$_childrenInfo$[2].$_nb$ / 2);
  $X$$.$TIMERSTOP$($JSCompiler_StaticMethods_reslice$self$$.$_classname$ + ".reslice");
  return $object$$13$$.$_IJKVolume$
}
;function $X$parserLBL$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserLBL"
}
$goog$inherits$$($X$parserLBL$$, $X$parser$$);
$X$parserLBL$$.prototype.parse = function $$X$parserLBL$$$$parse$($container$$1$$, $object$$14$$, $data$$24_i$$110$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  var $ind_modifiedEvent$$1$$ = $object$$14$$.$_pointIndices$, $numberOfIndices$$ = $ind_modifiedEvent$$1$$.length;
  0 == $numberOfIndices$$ && $JSCompiler_alias_THROW$$(Error("No _pointIndices defined on the X.object."));
  this.$_data$ = $data$$24_i$$110$$;
  var $_indices__orderedLabels$$ = [], $_bytes$$1__unorderedLabels$$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", $data$$24_i$$110$$.byteLength), $_curvaturePointer__labelsCount__length$$ = $_bytes$$1__unorderedLabels$$.length, $_scanMode_currentIndex_currentScalar$$ = $JSCompiler_alias_FALSE$$, $_rangeStart$$ = 0;
  for($data$$24_i$$110$$ = 1;$data$$24_i$$110$$ < $_curvaturePointer__labelsCount__length$$;$data$$24_i$$110$$++) {
    10 == $_bytes$$1__unorderedLabels$$[$data$$24_i$$110$$ - 1] ? ($_rangeStart$$ = $data$$24_i$$110$$, $_scanMode_currentIndex_currentScalar$$ = $JSCompiler_alias_TRUE$$) : $_scanMode_currentIndex_currentScalar$$ && 32 == $_bytes$$1__unorderedLabels$$[$data$$24_i$$110$$] && ($_indices__orderedLabels$$.push(parseInt($JSCompiler_StaticMethods_parseChars$$($_bytes$$1__unorderedLabels$$, $_rangeStart$$, $data$$24_i$$110$$), 10)), $_scanMode_currentIndex_currentScalar$$ = $JSCompiler_alias_FALSE$$)
  }
  $_bytes$$1__unorderedLabels$$ = $object$$14$$.$_scalars$.$_array$ ? $object$$14$$.$_scalars$.$_array$ : new Float32Array($numberOfIndices$$);
  $_curvaturePointer__labelsCount__length$$ = $_indices__orderedLabels$$.length;
  for($data$$24_i$$110$$ = 0;$data$$24_i$$110$$ < $_curvaturePointer__labelsCount__length$$;$data$$24_i$$110$$++) {
    $_bytes$$1__unorderedLabels$$[$_indices__orderedLabels$$[$data$$24_i$$110$$]] = 1
  }
  $_indices__orderedLabels$$ = new Float32Array(3 * $numberOfIndices$$);
  for($data$$24_i$$110$$ = $_curvaturePointer__labelsCount__length$$ = 0;$data$$24_i$$110$$ < $numberOfIndices$$;$data$$24_i$$110$$++) {
    $_scanMode_currentIndex_currentScalar$$ = $ind_modifiedEvent$$1$$[$data$$24_i$$110$$], $_scanMode_currentIndex_currentScalar$$ > $numberOfIndices$$ && $JSCompiler_alias_THROW$$(Error("Could not find scalar for vertex.")), $_scanMode_currentIndex_currentScalar$$ = $_bytes$$1__unorderedLabels$$[$_scanMode_currentIndex_currentScalar$$], $_indices__orderedLabels$$[$_curvaturePointer__labelsCount__length$$++] = $_scanMode_currentIndex_currentScalar$$, $_indices__orderedLabels$$[$_curvaturePointer__labelsCount__length$$++] = 
    $_scanMode_currentIndex_currentScalar$$, $_indices__orderedLabels$$[$_curvaturePointer__labelsCount__length$$++] = $_scanMode_currentIndex_currentScalar$$
  }
  $object$$14$$.$_scalars$.$_array$ = $_bytes$$1__unorderedLabels$$;
  $object$$14$$.$_scalars$.$_glArray$ = $_indices__orderedLabels$$;
  $object$$14$$.$_scalars$.$_dirty$ = $JSCompiler_alias_TRUE$$;
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $ind_modifiedEvent$$1$$ = new $X$event$ModifiedEvent$$;
  $ind_modifiedEvent$$1$$.$_object$ = $object$$14$$;
  $ind_modifiedEvent$$1$$.$_container$ = $container$$1$$;
  this.dispatchEvent($ind_modifiedEvent$$1$$)
};
$goog$exportSymbol$$("X.parserLBL", $X$parserLBL$$);
$goog$exportSymbol$$("X.parserLBL.prototype.parse", $X$parserLBL$$.prototype.parse);
function $X$slice$$($slice$$) {
  $X$object$$.call(this);
  this.$_classname$ = "slice";
  this.$_center$ = [0, 0, 0];
  this.$_front$ = [0, 0, 1];
  this.$_up$ = [0, 1, 0];
  this.$_right$ = [1, 0, 0];
  this.$_height$ = this.$_width$ = 10;
  this.$_textureCoordinateMap$ = [0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0];
  this.$_labelmap$ = this.$_volume$ = $JSCompiler_alias_NULL$$;
  this.$_borders$ = $JSCompiler_alias_TRUE$$;
  this.$_borderColor$ = [1, 1, 1];
  $slice$$ != $JSCompiler_alias_NULL$$ && this.$copy_$($slice$$)
}
$goog$inherits$$($X$slice$$, $X$object$$);
$X$slice$$.prototype.$copy_$ = function $$X$slice$$$$$copy_$$($slice$$1$$) {
  this.$_center$ = $slice$$1$$.$_center$.slice();
  this.$_front$ = $slice$$1$$.$_front$.slice();
  this.$_up$ = $slice$$1$$.$_up$.slice();
  this.$_width$ = $slice$$1$$.$_width$;
  this.$_height$ = $slice$$1$$.$_height$;
  this.$_volume$ = $slice$$1$$.$_volume$;
  this.$_labelmap$ = $slice$$1$$.$_labelmap$;
  this.$_borders$ = $slice$$1$$.$_borders$;
  this.$_borderColor$ = $slice$$1$$.$_borderColor$;
  this.$_hideChildren$ = $slice$$1$$.$_hideChildren$;
  $X$slice$$.$superClass_$.$copy_$.call(this, $slice$$1$$)
};
$X$slice$$.prototype.__defineSetter__("height", $JSCompiler_set$$("$_height$"));
$X$slice$$.prototype.__defineSetter__("width", $JSCompiler_set$$("$_width$"));
$X$slice$$.prototype.__defineGetter__("up", $JSCompiler_get$$("$_up$"));
$X$slice$$.prototype.__defineGetter__("right", $JSCompiler_get$$("$_right$"));
$X$slice$$.prototype.create = function $$X$slice$$$$create$() {
  this.$create_$()
};
$X$slice$$.prototype.$create_$ = function $$X$slice$$$$$create_$$() {
  var $borders$$1_frontVector$$ = (new $goog$math$Vec3$$(this.$_front$[0], this.$_front$[1], this.$_front$[2])).normalize(), $point4_upVector$$ = new $goog$math$Vec3$$(this.$_up$[0], this.$_up$[1], this.$_up$[2]), $rightVector$$ = new $goog$math$Vec3$$(this.$_right$[0], this.$_right$[1], this.$_right$[2]), $centerVector$$ = new $goog$math$Vec3$$(this.$_center$[0], this.$_center$[1], this.$_center$[2]), $dirVector$$ = $goog$math$Vec3$sum$$($rightVector$$.$clone$().$invert$().scale(this.$_width$ / 
  2), $point4_upVector$$.$clone$().$invert$().scale(this.$_height$ / 2)), $point0$$ = new $goog$math$Vec3$$($dirVector$$.x + $centerVector$$.x, $dirVector$$.y + $centerVector$$.y, $dirVector$$.$z$ + $centerVector$$.$z$), $dirVector$$ = $goog$math$Vec3$sum$$($rightVector$$.$clone$().$invert$().scale(this.$_width$ / 2), $point4_upVector$$.$clone$().scale(this.$_height$ / 2)), $point1$$1$$ = new $goog$math$Vec3$$($dirVector$$.x + $centerVector$$.x, $dirVector$$.y + $centerVector$$.y, $dirVector$$.$z$ + 
  $centerVector$$.$z$), $dirVector$$ = $goog$math$Vec3$sum$$($rightVector$$.$clone$().scale(this.$_width$ / 2), $point4_upVector$$.$clone$().$invert$().scale(this.$_height$ / 2)), $point2$$1$$ = new $goog$math$Vec3$$($dirVector$$.x + $centerVector$$.x, $dirVector$$.y + $centerVector$$.y, $dirVector$$.$z$ + $centerVector$$.$z$), $dirVector$$ = $goog$math$Vec3$sum$$($rightVector$$.$clone$().scale(this.$_width$ / 2), $point4_upVector$$.$clone$().scale(this.$_height$ / 2)), $point4_upVector$$ = new $goog$math$Vec3$$($dirVector$$.x + 
  $centerVector$$.x, $dirVector$$.y + $centerVector$$.y, $dirVector$$.$z$ + $centerVector$$.$z$);
  this.$_points$ = new $X$triplets$$(18);
  this.$_normals$ = new $X$triplets$$(18);
  this.$_points$.add($point0$$.x, $point0$$.y, $point0$$.$z$);
  this.$_points$.add($point1$$1$$.x, $point1$$1$$.y, $point1$$1$$.$z$);
  this.$_points$.add($point2$$1$$.x, $point2$$1$$.y, $point2$$1$$.$z$);
  this.$_points$.add($point2$$1$$.x, $point2$$1$$.y, $point2$$1$$.$z$);
  this.$_points$.add($point4_upVector$$.x, $point4_upVector$$.y, $point4_upVector$$.$z$);
  this.$_points$.add($point1$$1$$.x, $point1$$1$$.y, $point1$$1$$.$z$);
  this.$_normals$.add($borders$$1_frontVector$$.x, $borders$$1_frontVector$$.y, $borders$$1_frontVector$$.$z$);
  this.$_normals$.add($borders$$1_frontVector$$.x, $borders$$1_frontVector$$.y, $borders$$1_frontVector$$.$z$);
  this.$_normals$.add($borders$$1_frontVector$$.x, $borders$$1_frontVector$$.y, $borders$$1_frontVector$$.$z$);
  this.$_normals$.add($borders$$1_frontVector$$.x, $borders$$1_frontVector$$.y, $borders$$1_frontVector$$.$z$);
  this.$_normals$.add($borders$$1_frontVector$$.x, $borders$$1_frontVector$$.y, $borders$$1_frontVector$$.$z$);
  this.$_normals$.add($borders$$1_frontVector$$.x, $borders$$1_frontVector$$.y, $borders$$1_frontVector$$.$z$);
  this.$_borders$ && ($borders$$1_frontVector$$ = new $X$object$$, $borders$$1_frontVector$$.$_points$ = new $X$triplets$$(24), $borders$$1_frontVector$$.$_normals$ = new $X$triplets$$(24), $borders$$1_frontVector$$.$_points$.add($point0$$.x, $point0$$.y, $point0$$.$z$), $borders$$1_frontVector$$.$_points$.add($point1$$1$$.x, $point1$$1$$.y, $point1$$1$$.$z$), $borders$$1_frontVector$$.$_points$.add($point1$$1$$.x, $point1$$1$$.y, $point1$$1$$.$z$), $borders$$1_frontVector$$.$_points$.add($point4_upVector$$.x, 
  $point4_upVector$$.y, $point4_upVector$$.$z$), $borders$$1_frontVector$$.$_points$.add($point4_upVector$$.x, $point4_upVector$$.y, $point4_upVector$$.$z$), $borders$$1_frontVector$$.$_points$.add($point2$$1$$.x, $point2$$1$$.y, $point2$$1$$.$z$), $borders$$1_frontVector$$.$_points$.add($point2$$1$$.x, $point2$$1$$.y, $point2$$1$$.$z$), $borders$$1_frontVector$$.$_points$.add($point0$$.x, $point0$$.y, $point0$$.$z$), $borders$$1_frontVector$$.$_normals$.add(0, 0, 0), $borders$$1_frontVector$$.$_normals$.add(0, 
  0, 0), $borders$$1_frontVector$$.$_normals$.add(0, 0, 0), $borders$$1_frontVector$$.$_normals$.add(0, 0, 0), $borders$$1_frontVector$$.$_normals$.add(0, 0, 0), $borders$$1_frontVector$$.$_normals$.add(0, 0, 0), $borders$$1_frontVector$$.$_normals$.add(0, 0, 0), $borders$$1_frontVector$$.$_normals$.add(0, 0, 0), $borders$$1_frontVector$$.$_color$ = [this.$_borderColor$[0], this.$_borderColor$[1], this.$_borderColor$[2]], $borders$$1_frontVector$$.$_type$ = "LINES", $borders$$1_frontVector$$.$_linewidth$ = 
  2, this.$_children$.push($borders$$1_frontVector$$))
};
$goog$exportSymbol$$("X.slice", $X$slice$$);
$goog$exportSymbol$$("X.slice.prototype.create", $X$slice$$.prototype.create);
function $X$volume$$($volume$$) {
  $X$object$$.call(this);
  this.$_classname$ = "volume";
  this.$_center$ = [0, 0, 0];
  this.$_dimensions$ = [10, 10, 10];
  this.$_BBox$ = [1, 1, 1];
  this.$_range$ = [10, 10, 10];
  this.$_spacing$ = [1, 1, 1];
  this.$_image$ = [];
  this.$_indexZold$ = this.$_indexZ$ = this.$_indexYold$ = this.$_indexY$ = this.$_indexXold$ = this.$_indexX$ = 0;
  this.$_slicesX$ = new $X$object$$;
  this.$_slicesY$ = new $X$object$$;
  this.$_slicesZ$ = new $X$object$$;
  this.$_volumeRenderingOld$ = this.$_volumeRendering$ = $JSCompiler_alias_FALSE$$;
  this.$_volumeRenderingDirection$ = -1;
  this.$_volumeRenderingCache$ = [];
  this.$_labelmap$ = $JSCompiler_alias_NULL$$;
  this.$_borders$ = $JSCompiler_alias_TRUE$$;
  this.$_windowLow$ = Infinity;
  this.$_windowHigh$ = -Infinity;
  this.$_reslicing$ = $JSCompiler_alias_TRUE$$;
  this.$_max$ = 0;
  this.$_data$ = $JSCompiler_alias_NULL$$;
  $inject$$(this, new $X$loadable$$);
  $inject$$(this, new $X$thresholdable$$);
  $volume$$ != $JSCompiler_alias_NULL$$ && this.$copy_$($volume$$)
}
$goog$inherits$$($X$volume$$, $X$object$$);
$X$volume$$.prototype.$copy_$ = function $$X$volume$$$$$copy_$$($volume$$1$$) {
  this.$_center$ = $volume$$1$$.$_center$.slice();
  this.$_dimensions$ = $volume$$1$$.$_dimensions$.slice();
  this.$_spacing$ = $volume$$1$$.$_spacing$.slice();
  this.$_indexX$ = $volume$$1$$.$_indexX$;
  this.$_indexXold$ = $volume$$1$$.$_indexXold$;
  this.$_indexY$ = $volume$$1$$.$_indexY$;
  this.$_indexYold$ = $volume$$1$$.$_indexYold$;
  this.$_indexZ$ = $volume$$1$$.$_indexZ$;
  this.$_indexZold$ = $volume$$1$$.$_indexZold$;
  this.$_dimensionsRAS$ = $volume$$1$$.$_dimensionsRAS$.slice();
  this.$_slicesX$ = new $X$object$$($volume$$1$$.$_slicesX$);
  this.$_slicesY$ = new $X$object$$($volume$$1$$.$_slicesY$);
  this.$_slicesZ$ = new $X$object$$($volume$$1$$.$_slicesZ$);
  this.$_max$ = $volume$$1$$.$_max$;
  this.$_data$ = $volume$$1$$.$_data$;
  this.$_volumeRendering$ = $volume$$1$$.$_volumeRendering$;
  this.$_volumeRenderingOld$ = $volume$$1$$.$_volumeRenderingOld$;
  this.$_volumeRenderingDirection$ = $volume$$1$$.$_volumeRenderingDirection$;
  this.$_labelmap$ = $volume$$1$$.$_labelmap$;
  this.$_borders$ = $volume$$1$$.$_borders$;
  $X$volume$$.$superClass_$.$copy_$.call(this, $volume$$1$$)
};
$X$volume$$.prototype.$create_$ = function $$X$volume$$$$$create_$$($_info$$) {
  this.$_children$.length = 0;
  this.$_slicesX$.$_children$.length = 0;
  this.$_slicesY$.$_children$.length = 0;
  this.$_slicesZ$.$_children$.length = 0;
  this.$_children$.push(this.$_slicesX$);
  this.$_children$.push(this.$_slicesY$);
  this.$_children$.push(this.$_slicesZ$);
  this.$_RASOrigin$ = $_info$$.$RASOrigin$;
  this.$_RASSpacing$ = $_info$$.$RASSpacing$;
  this.$_RASDimensions$ = $_info$$.$RASDimensions$;
  this.$_IJKToRAS$ = $_info$$.$IJKToRAS$;
  this.$_RASToIJK$ = $_info$$.$RASToIJK$;
  this.$_max$ = $_info$$.max;
  this.$_data$ = $_info$$.data;
  this.$_dirty$ = $JSCompiler_alias_TRUE$$
};
$X$volume$$.prototype.$modified$ = function $$X$volume$$$$$modified$$($propagateEvent$$2$$) {
  $propagateEvent$$2$$ = "undefined" !== typeof $propagateEvent$$2$$ ? $propagateEvent$$2$$ : $JSCompiler_alias_TRUE$$;
  if(0 < this.$_children$.length) {
    this.$_volumeRendering$ != this.$_volumeRenderingOld$ && (!this.$_volumeRendering$ && -1 != this.$_volumeRenderingDirection$ && (this.$_children$[this.$_volumeRenderingDirection$].visible = $JSCompiler_alias_FALSE$$), this.$_dirty$ = $JSCompiler_alias_TRUE$$, this.$_volumeRenderingOld$ = this.$_volumeRendering$);
    if(!this.$_visible$) {
      return
    }
    for(var $xyz$$inline_311$$ = 0, $xyz$$inline_311$$ = 0;3 > $xyz$$inline_311$$;$xyz$$inline_311$$++) {
      var $_child$$inline_312__currentSlice$$inline_319$$ = this.$_children$[$xyz$$inline_311$$], $currentIndex$$inline_313$$ = 0, $_oldSlice$$inline_318_oldIndex$$inline_314$$ = 0;
      0 == $xyz$$inline_311$$ ? ($currentIndex$$inline_313$$ = this.$_indexX$, $_oldSlice$$inline_318_oldIndex$$inline_314$$ = this.$_indexXold$, this.$_indexXold$ = this.$_indexX$) : 1 == $xyz$$inline_311$$ ? ($currentIndex$$inline_313$$ = this.$_indexY$, $_oldSlice$$inline_318_oldIndex$$inline_314$$ = this.$_indexYold$, this.$_indexYold$ = this.$_indexY$) : 2 == $xyz$$inline_311$$ && ($currentIndex$$inline_313$$ = this.$_indexZ$, $_oldSlice$$inline_318_oldIndex$$inline_314$$ = this.$_indexZold$, 
      this.$_indexZold$ = this.$_indexZ$);
      if(this.$_children$[$xyz$$inline_311$$].$_children$[parseInt($currentIndex$$inline_313$$, 10)] == $JSCompiler_alias_NULL$$) {
        var $_slice$$inline_317__sliceOrigin$$inline_315$$ = $goog$vec$Vec3$createFloat32$$();
        $_slice$$inline_317__sliceOrigin$$inline_315$$[0] = this.$_childrenInfo$[$xyz$$inline_311$$].$_solutionsLine$[0][0][0] + this.$_childrenInfo$[$xyz$$inline_311$$].$_sliceDirection$[0] * parseInt($currentIndex$$inline_313$$, 10);
        $_slice$$inline_317__sliceOrigin$$inline_315$$[1] = this.$_childrenInfo$[$xyz$$inline_311$$].$_solutionsLine$[0][0][1] + this.$_childrenInfo$[$xyz$$inline_311$$].$_sliceDirection$[1] * parseInt($currentIndex$$inline_313$$, 10);
        $_slice$$inline_317__sliceOrigin$$inline_315$$[2] = this.$_childrenInfo$[$xyz$$inline_311$$].$_solutionsLine$[0][0][2] + this.$_childrenInfo$[$xyz$$inline_311$$].$_sliceDirection$[2] * parseInt($currentIndex$$inline_313$$, 10);
        if(this.$hasLabelMap$) {
          var $_sliceLabel$$inline_316$$ = $X$parser$reslice2$$($_slice$$inline_317__sliceOrigin$$inline_315$$, this.$_childrenInfo$[$xyz$$inline_311$$].$_sliceXYSpacing$, this.$_childrenInfo$[$xyz$$inline_311$$].$_sliceNormal$, this.$_childrenInfo$[$xyz$$inline_311$$].$_color$, this.$_BBox$, this.$_labelmap$.$_IJKVolume$, this.$_labelmap$, this.$_labelmap$.$hasLabelMap$, this.$_labelmap$.$_colortable$.$_map$);
          this.$_labelmap$.$_children$[$xyz$$inline_311$$].$_children$[parseInt($currentIndex$$inline_313$$, 10)] = $_sliceLabel$$inline_316$$;
          this.$_labelmap$.$_children$[$xyz$$inline_311$$].$modified$($JSCompiler_alias_TRUE$$)
        }
        $_slice$$inline_317__sliceOrigin$$inline_315$$ = $X$parser$reslice2$$($_slice$$inline_317__sliceOrigin$$inline_315$$, this.$_childrenInfo$[$xyz$$inline_311$$].$_sliceXYSpacing$, this.$_childrenInfo$[$xyz$$inline_311$$].$_sliceNormal$, this.$_childrenInfo$[$xyz$$inline_311$$].$_color$, this.$_BBox$, this.$_IJKVolume$, this, $JSCompiler_alias_TRUE$$, $JSCompiler_alias_NULL$$);
        this.$hasLabelMap$ && ($_slice$$inline_317__sliceOrigin$$inline_315$$.$_labelmap$ = $_slice$$inline_317__sliceOrigin$$inline_315$$.$_texture$, $_slice$$inline_317__sliceOrigin$$inline_315$$.$_labelmap$ = this.$_labelmap$.$_children$[$xyz$$inline_311$$].$_children$[parseInt($currentIndex$$inline_313$$, 10)].$_texture$);
        $_child$$inline_312__currentSlice$$inline_319$$.$_children$[parseInt($currentIndex$$inline_313$$, 10)] = $_slice$$inline_317__sliceOrigin$$inline_315$$;
        this.$_children$[$xyz$$inline_311$$].$modified$($JSCompiler_alias_TRUE$$)
      }
      $_oldSlice$$inline_318_oldIndex$$inline_314$$ = $_child$$inline_312__currentSlice$$inline_319$$.$_children$[parseInt($_oldSlice$$inline_318_oldIndex$$inline_314$$, 10)];
      this.$_volumeRendering$ || ($_oldSlice$$inline_318_oldIndex$$inline_314$$.visible = $JSCompiler_alias_FALSE$$);
      $_child$$inline_312__currentSlice$$inline_319$$ = $_child$$inline_312__currentSlice$$inline_319$$.$_children$[parseInt($currentIndex$$inline_313$$, 10)];
      $_child$$inline_312__currentSlice$$inline_319$$.visible = $JSCompiler_alias_TRUE$$;
      $_child$$inline_312__currentSlice$$inline_319$$.$_opacity$ = 1;
      this.$_volumeRendering$ && ($_child$$inline_312__currentSlice$$inline_319$$.$_children$[0].$_visible$ = $JSCompiler_alias_FALSE$$, $xyz$$inline_311$$ != this.$_volumeRenderingDirection$ && ($_child$$inline_312__currentSlice$$inline_319$$.visible = $JSCompiler_alias_FALSE$$, $_child$$inline_312__currentSlice$$inline_319$$.$_opacity$ = 0))
    }
    this.$_volumeRendering$ && -1 != this.$_volumeRenderingDirection$ && $JSCompiler_StaticMethods_volumeRendering_$$(this, this.$_volumeRenderingDirection$)
  }
  $propagateEvent$$2$$ && $X$volume$$.$superClass_$.$modified$.call(this)
};
$X$volume$$.prototype.__defineGetter__("dimensions", $JSCompiler_get$$("$_dimensions$"));
$X$volume$$.prototype.__defineSetter__("dimensions", $JSCompiler_set$$("$_dimensions$"));
$X$volume$$.prototype.__defineGetter__("spacing", $JSCompiler_get$$("$_spacing$"));
$X$volume$$.prototype.__defineSetter__("spacing", $JSCompiler_set$$("$_spacing$"));
$X$volume$$.prototype.__defineGetter__("bbox", $JSCompiler_get$$("$_BBox$"));
$X$volume$$.prototype.__defineGetter__("range", $JSCompiler_get$$("$_range$"));
$X$volume$$.prototype.__defineGetter__("dimensionsRAS", $JSCompiler_get$$("$_dimensionsRAS$"));
$X$volume$$.prototype.__defineGetter__("volumeRendering", $JSCompiler_get$$("$_volumeRendering$"));
$X$volume$$.prototype.__defineSetter__("volumeRendering", function($volumeRendering$$) {
  this.$_volumeRendering$ = $volumeRendering$$;
  this.$modified$($JSCompiler_alias_FALSE$$)
});
$X$volume$$.prototype.__defineGetter__("visible", $JSCompiler_get$$("$_visible$"));
$X$volume$$.prototype.__defineSetter__("visible", function($visible$$1$$) {
  if($visible$$1$$) {
    this.$_visible$ = $visible$$1$$, this.$modified$($JSCompiler_alias_FALSE$$)
  }else {
    for(var $children$$3$$ = this.$_children$, $numberOfChildren$$3$$ = $children$$3$$.length, $c$$16$$ = 0, $c$$16$$ = 0;$c$$16$$ < $numberOfChildren$$3$$;$c$$16$$++) {
      $children$$3$$[$c$$16$$].visible = $visible$$1$$
    }
    this.$_visible$ = $visible$$1$$;
    this.$_dirty$ = $JSCompiler_alias_TRUE$$
  }
});
$X$volume$$.prototype.__defineGetter__("center", $JSCompiler_get$$("$_center$"));
$X$volume$$.prototype.__defineSetter__("center", function($center$$1$$) {
  ($center$$1$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($center$$1$$) || 3 != $center$$1$$.length) && $JSCompiler_alias_THROW$$(Error("Invalid center."));
  this.$_center$ = $center$$1$$
});
$X$volume$$.prototype.__defineGetter__("volumeRenderingCache", $JSCompiler_get$$("$_volumeRenderingCache$"));
$X$volume$$.prototype.__defineSetter__("volumeRenderingCache", function($volumeRenderingCache$$) {
  ($volumeRenderingCache$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($volumeRenderingCache$$) || !(3 >= $volumeRenderingCache$$.length)) && $JSCompiler_alias_THROW$$(Error("Invalid volumeRederingCache."));
  this.$_volumeRenderingCache$ = $volumeRenderingCache$$
});
$X$volume$$.prototype.__defineGetter__("image", $JSCompiler_get$$("$_image$"));
$X$volume$$.prototype.__defineGetter__("labelmap", function() {
  this.$_labelmap$ || (this.$_labelmap$ = new $X$labelmap$$(this));
  return this.$_labelmap$
});
$X$volume$$.prototype.__defineGetter__("indexX", $JSCompiler_get$$("$_indexX$"));
$X$volume$$.prototype.__defineSetter__("indexX", function($indexX$$) {
  $goog$isNumber$$($indexX$$) && (0 <= $indexX$$ && $indexX$$ < this.$_slicesX$.$_children$.length) && (this.$_indexX$ = $indexX$$, this.$modified$($JSCompiler_alias_FALSE$$))
});
$X$volume$$.prototype.__defineGetter__("indexY", $JSCompiler_get$$("$_indexY$"));
$X$volume$$.prototype.__defineSetter__("indexY", function($indexY$$) {
  $goog$isNumber$$($indexY$$) && (0 <= $indexY$$ && $indexY$$ < this.$_slicesY$.$_children$.length) && (this.$_indexY$ = $indexY$$, this.$modified$($JSCompiler_alias_FALSE$$))
});
$X$volume$$.prototype.__defineGetter__("indexZ", $JSCompiler_get$$("$_indexZ$"));
$X$volume$$.prototype.__defineSetter__("indexZ", function($indexZ$$) {
  $goog$isNumber$$($indexZ$$) && (0 <= $indexZ$$ && $indexZ$$ < this.$_slicesZ$.$_children$.length) && (this.$_indexZ$ = $indexZ$$, this.$modified$($JSCompiler_alias_FALSE$$))
});
$X$volume$$.prototype.__defineGetter__("windowLow", $JSCompiler_get$$("$_windowLow$"));
$X$volume$$.prototype.__defineSetter__("windowLow", $JSCompiler_set$$("$_windowLow$"));
$X$volume$$.prototype.__defineGetter__("windowHigh", $JSCompiler_get$$("$_windowHigh$"));
$X$volume$$.prototype.__defineSetter__("windowHigh", $JSCompiler_set$$("$_windowHigh$"));
$X$volume$$.prototype.__defineGetter__("borders", $JSCompiler_get$$("$_borders$"));
$X$volume$$.prototype.__defineSetter__("borders", $JSCompiler_set$$("$_borders$"));
$X$volume$$.prototype.__defineGetter__("reslicing", $JSCompiler_get$$("$_reslicing$"));
$X$volume$$.prototype.__defineSetter__("reslicing", $JSCompiler_set$$("$_reslicing$"));
$X$volume$$.prototype.__defineSetter__("xNormX", function($xNormX$$) {
  this.$_childrenInfo$[0].$_sliceNormal$[0] = $xNormX$$
});
$X$volume$$.prototype.__defineGetter__("xNormX", function() {
  return this.$_childrenInfo$[0].$_sliceNormal$[0]
});
$X$volume$$.prototype.__defineSetter__("xNormY", function($xNormY$$) {
  this.$_childrenInfo$[0].$_sliceNormal$[1] = $xNormY$$
});
$X$volume$$.prototype.__defineGetter__("xNormY", function() {
  return this.$_childrenInfo$[0].$_sliceNormal$[1]
});
$X$volume$$.prototype.__defineSetter__("xNormZ", function($xNormZ$$) {
  this.$_childrenInfo$[0].$_sliceNormal$[2] = $xNormZ$$
});
$X$volume$$.prototype.__defineGetter__("xNormZ", function() {
  return this.$_childrenInfo$[0].$_sliceNormal$[2]
});
$X$volume$$.prototype.__defineSetter__("xColor", function($xColor$$) {
  this.$_childrenInfo$[0].$_color$ = $xColor$$
});
$X$volume$$.prototype.__defineGetter__("xColor", function() {
  return this.$_childrenInfo$[0].$_color$
});
$X$volume$$.prototype.__defineSetter__("yNormX", function($yNormX$$) {
  this.$_childrenInfo$[1].$_sliceNormal$[0] = $yNormX$$
});
$X$volume$$.prototype.__defineGetter__("yNormX", function() {
  return this.$_childrenInfo$[1].$_sliceNormal$[0]
});
$X$volume$$.prototype.__defineSetter__("yNormY", function($yNormY$$) {
  this.$_childrenInfo$[1].$_sliceNormal$[1] = $yNormY$$
});
$X$volume$$.prototype.__defineGetter__("yNormY", function() {
  return this.$_childrenInfo$[1].$_sliceNormal$[1]
});
$X$volume$$.prototype.__defineSetter__("yNormZ", function($yNormZ$$) {
  this.$_childrenInfo$[1].$_sliceNormal$[2] = $yNormZ$$
});
$X$volume$$.prototype.__defineGetter__("yNormZ", function() {
  return this.$_childrenInfo$[1].$_sliceNormal$[2]
});
$X$volume$$.prototype.__defineSetter__("yColor", function($yColor$$) {
  this.$_childrenInfo$[1].$_color$ = $yColor$$
});
$X$volume$$.prototype.__defineGetter__("yColor", function() {
  return this.$_childrenInfo$[1].$_color$
});
$X$volume$$.prototype.__defineSetter__("zNormX", function($zNormX$$) {
  this.$_childrenInfo$[2].$_sliceNormal$[0] = $zNormX$$
});
$X$volume$$.prototype.__defineGetter__("zNormX", function() {
  return this.$_childrenInfo$[2].$_sliceNormal$[0]
});
$X$volume$$.prototype.__defineSetter__("zNormY", function($zNormY$$) {
  this.$_childrenInfo$[2].$_sliceNormal$[1] = $zNormY$$
});
$X$volume$$.prototype.__defineGetter__("zNormY", function() {
  return this.$_childrenInfo$[2].$_sliceNormal$[1]
});
$X$volume$$.prototype.__defineSetter__("zNormZ", function($zNormZ$$) {
  this.$_childrenInfo$[2].$_sliceNormal$[2] = $zNormZ$$
});
$X$volume$$.prototype.__defineGetter__("zNormZ", function() {
  return this.$_childrenInfo$[2].$_sliceNormal$[2]
});
$X$volume$$.prototype.__defineSetter__("zColor", function($zColor$$) {
  this.$_childrenInfo$[2].$_color$ = $zColor$$
});
$X$volume$$.prototype.__defineGetter__("zColor", function() {
  return this.$_childrenInfo$[2].$_color$
});
$X$volume$$.prototype.$sliceInfoChanged$ = function $$X$volume$$$$$sliceInfoChanged$$($index$$55$$) {
  this.$_children$[$index$$55$$].visible = $JSCompiler_alias_FALSE$$;
  for(var $_slice$$2__sliceLabel$$1_i$$111$$ = 0;$_slice$$2__sliceLabel$$1_i$$111$$ < this.$_children$[$index$$55$$].$_children$.length;$_slice$$2__sliceLabel$$1_i$$111$$++) {
    "undefined" != typeof this.$_children$[$index$$55$$].$_children$[$_slice$$2__sliceLabel$$1_i$$111$$] && (this.$hasLabelMap$ && (this.$_labelmap$.$_children$[$index$$55$$].$_children$[$_slice$$2__sliceLabel$$1_i$$111$$].remove(), this.$_labelmap$.$_children$[$index$$55$$].$_children$[$_slice$$2__sliceLabel$$1_i$$111$$] = $JSCompiler_alias_NULL$$), this.$_children$[$index$$55$$].$_children$[$_slice$$2__sliceLabel$$1_i$$111$$].remove(), this.$_children$[$index$$55$$].$_children$[$_slice$$2__sliceLabel$$1_i$$111$$] = 
    $JSCompiler_alias_NULL$$)
  }
  $goog$vec$Vec3$normalize$$(this.$_childrenInfo$[$index$$55$$].$_sliceNormal$, this.$_childrenInfo$[$index$$55$$].$_sliceNormal$);
  $JSCompiler_StaticMethods_updateSliceInfo$$($index$$55$$, this.$_childrenInfo$[$index$$55$$].$_sliceOrigin$, this.$_childrenInfo$[$index$$55$$].$_sliceNormal$, this);
  this.$_children$[$index$$55$$].$_children$ = [];
  this.$_children$[$index$$55$$].$_children$ = Array(this.$_childrenInfo$[$index$$55$$].$_nb$);
  this.$hasLabelMap$ && ($_slice$$2__sliceLabel$$1_i$$111$$ = $X$parser$reslice2$$(this.$_childrenInfo$[$index$$55$$].$_sliceOrigin$, this.$_childrenInfo$[$index$$55$$].$_sliceXYSpacing$, this.$_childrenInfo$[$index$$55$$].$_sliceNormal$, this.$_childrenInfo$[$index$$55$$].$_color$, this.$_BBox$, this.$_labelmap$.$_IJKVolume$, this.$_labelmap$, this.$_labelmap$.$hasLabelMap$, this.$_labelmap$.$_colortable$.$_map$), this.$_labelmap$.$_children$[$index$$55$$].$_children$ = [], this.$_labelmap$.$_children$[$index$$55$$].$_children$ = 
  Array(this.$_childrenInfo$[$index$$55$$].$_nb$), this.$_labelmap$.$_children$[$index$$55$$].$_children$[Math.floor(this.$_childrenInfo$[$index$$55$$].$_nb$ / 2)] = $_slice$$2__sliceLabel$$1_i$$111$$, this.$_labelmap$.$_children$[$index$$55$$].$modified$());
  $_slice$$2__sliceLabel$$1_i$$111$$ = $X$parser$reslice2$$(this.$_childrenInfo$[$index$$55$$].$_sliceOrigin$, this.$_childrenInfo$[$index$$55$$].$_sliceXYSpacing$, this.$_childrenInfo$[$index$$55$$].$_sliceNormal$, this.$_childrenInfo$[$index$$55$$].$_color$, this.$_BBox$, this.$_IJKVolume$, this, $JSCompiler_alias_TRUE$$, $JSCompiler_alias_NULL$$);
  window.console.log("modified!");
  this.$hasLabelMap$ && ($_slice$$2__sliceLabel$$1_i$$111$$.$_labelmap$ = $_slice$$2__sliceLabel$$1_i$$111$$.$_texture$, $_slice$$2__sliceLabel$$1_i$$111$$.$_labelmap$ = this.$_labelmap$.$_children$[$index$$55$$].$_children$[Math.floor(this.$_childrenInfo$[$index$$55$$].$_nb$ / 2)].$_texture$);
  this.$_children$[$index$$55$$].$_children$[Math.floor(this.$_childrenInfo$[$index$$55$$].$_nb$ / 2)] = $_slice$$2__sliceLabel$$1_i$$111$$;
  0 == $index$$55$$ ? (this.$_indexX$ = Math.floor(this.$_childrenInfo$[$index$$55$$].$_nb$ / 2), this.$_indexXold$ = Math.floor(this.$_childrenInfo$[$index$$55$$].$_nb$ / 2)) : 1 == $index$$55$$ ? (this.$_indexY$ = Math.floor(this.$_childrenInfo$[$index$$55$$].$_nb$ / 2), this.$_indexYold$ = Math.floor(this.$_childrenInfo$[$index$$55$$].$_nb$ / 2)) : (this.$_indexZ$ = Math.floor(this.$_childrenInfo$[$index$$55$$].$_nb$ / 2), this.$_indexZold$ = Math.floor(this.$_childrenInfo$[$index$$55$$].$_nb$ / 
  2));
  this.$_children$[$index$$55$$].$modified$();
  this.$_children$[$index$$55$$].$_children$[Math.floor(this.$_childrenInfo$[$index$$55$$].$_nb$ / 2)].$_visible$ = $JSCompiler_alias_TRUE$$
};
function $JSCompiler_StaticMethods_volumeRendering_$$($JSCompiler_StaticMethods_volumeRendering_$self$$, $direction$$4$$) {
  if(!$JSCompiler_StaticMethods_volumeRendering_$self$$.$_computing$) {
    if(!$JSCompiler_StaticMethods_volumeRendering_$self$$.$_volumeRendering$ || !$JSCompiler_StaticMethods_volumeRendering_$self$$.$_dirty$ && $direction$$4$$ == $JSCompiler_StaticMethods_volumeRendering_$self$$.$_volumeRenderingDirection$) {
      $JSCompiler_StaticMethods_volumeRendering_$self$$.$_volumeRenderingDirection$ = $direction$$4$$
    }else {
      if(-1 == $JSCompiler_StaticMethods_volumeRendering_$self$$.$_volumeRenderingCache$.indexOf($direction$$4$$)) {
        $JSCompiler_StaticMethods_volumeRendering_$self$$.$_volumeRenderingCache$.push($direction$$4$$);
        $JSCompiler_StaticMethods_volumeRendering_$self$$.$_computing$ = $JSCompiler_alias_TRUE$$;
        var $_child$$2_computingEvent$$inline_323$$ = new $X$event$ComputingEvent$$;
        $_child$$2_computingEvent$$inline_323$$.$_object$ = $JSCompiler_StaticMethods_volumeRendering_$self$$;
        $JSCompiler_StaticMethods_volumeRendering_$self$$.dispatchEvent($_child$$2_computingEvent$$inline_323$$);
        $JSCompiler_StaticMethods_volumeRendering_$self$$.onComputing($direction$$4$$);
        setTimeout(function() {
          var $_child$$3$$ = $JSCompiler_alias_NULL$$;
          0 <= this.$_volumeRenderingDirection$ && ($_child$$3$$ = this.$_children$[this.$_volumeRenderingDirection$], $_child$$3$$.visible = $JSCompiler_alias_FALSE$$);
          var $_child$$3$$ = this.$_children$[$direction$$4$$], $_numberOfSlices$$1$$ = $_child$$3$$.$_children$.length, $quarters$$ = Math.floor($_numberOfSlices$$1$$ / 4), $i$$113$$;
          for($i$$113$$ = 0;$i$$113$$ < 1 * $quarters$$;$i$$113$$++) {
            if($_child$$3$$.$_children$[$i$$113$$] == $JSCompiler_alias_NULL$$) {
              var $_slice$$3__sliceOrigin$$6$$ = $goog$vec$Vec3$createFloat32$$();
              $_slice$$3__sliceOrigin$$6$$[0] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][0] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[0] * $i$$113$$;
              $_slice$$3__sliceOrigin$$6$$[1] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][1] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[1] * $i$$113$$;
              $_slice$$3__sliceOrigin$$6$$[2] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][2] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[2] * $i$$113$$;
              if(this.$hasLabelMap$) {
                var $_sliceLabel$$2$$ = $X$parser$reslice2$$($_slice$$3__sliceOrigin$$6$$, this.$_childrenInfo$[$direction$$4$$].$_sliceXYSpacing$, this.$_childrenInfo$[$direction$$4$$].$_sliceNormal$, this.$_childrenInfo$[$direction$$4$$].$_color$, this.$_BBox$, this.$_labelmap$.$_IJKVolume$, this.$_labelmap$, this.$_labelmap$.$hasLabelMap$, this.$_labelmap$.$_colortable$.$_map$);
                this.$_labelmap$.$_children$[$direction$$4$$].$_children$[$i$$113$$] = $_sliceLabel$$2$$;
                this.$_labelmap$.$_children$[$direction$$4$$].$modified$($JSCompiler_alias_TRUE$$)
              }
              $_slice$$3__sliceOrigin$$6$$ = $X$parser$reslice2$$($_slice$$3__sliceOrigin$$6$$, this.$_childrenInfo$[$direction$$4$$].$_sliceXYSpacing$, this.$_childrenInfo$[$direction$$4$$].$_sliceNormal$, this.$_childrenInfo$[$direction$$4$$].$_color$, this.$_BBox$, this.$_IJKVolume$, this, $JSCompiler_alias_TRUE$$, $JSCompiler_alias_NULL$$);
              $_slice$$3__sliceOrigin$$6$$.$_children$[0].$_visible$ = $JSCompiler_alias_FALSE$$;
              this.$hasLabelMap$ && ($_slice$$3__sliceOrigin$$6$$.$_labelmap$ = $_slice$$3__sliceOrigin$$6$$.$_texture$, $_slice$$3__sliceOrigin$$6$$.$_labelmap$ = this.$_labelmap$.$_children$[$direction$$4$$].$_children$[$i$$113$$].$_texture$);
              $_child$$3$$.$_children$[$i$$113$$] = $_slice$$3__sliceOrigin$$6$$
            }
            $_child$$3$$.$_children$[$i$$113$$].$_visible$ = $JSCompiler_alias_TRUE$$
          }
          $JSCompiler_StaticMethods_onComputingProgress_$$(this, 0.25);
          setTimeout(function() {
            for(;$i$$113$$ < 2 * $quarters$$;$i$$113$$++) {
              if($_child$$3$$.$_children$[$i$$113$$] == $JSCompiler_alias_NULL$$) {
                var $_slice$$4__sliceOrigin$$7$$ = $goog$vec$Vec3$createFloat32$$();
                $_slice$$4__sliceOrigin$$7$$[0] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][0] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[0] * $i$$113$$;
                $_slice$$4__sliceOrigin$$7$$[1] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][1] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[1] * $i$$113$$;
                $_slice$$4__sliceOrigin$$7$$[2] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][2] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[2] * $i$$113$$;
                if(this.$hasLabelMap$) {
                  var $_sliceLabel$$3$$ = $X$parser$reslice2$$($_slice$$4__sliceOrigin$$7$$, this.$_childrenInfo$[$direction$$4$$].$_sliceXYSpacing$, this.$_childrenInfo$[$direction$$4$$].$_sliceNormal$, this.$_childrenInfo$[$direction$$4$$].$_color$, this.$_BBox$, this.$_labelmap$.$_IJKVolume$, this.$_labelmap$, this.$_labelmap$.$hasLabelMap$, this.$_labelmap$.$_colortable$.$_map$);
                  this.$_labelmap$.$_children$[$direction$$4$$].$_children$[$i$$113$$] = $_sliceLabel$$3$$;
                  this.$_labelmap$.$_children$[$direction$$4$$].$modified$($JSCompiler_alias_TRUE$$)
                }
                $_slice$$4__sliceOrigin$$7$$ = $X$parser$reslice2$$($_slice$$4__sliceOrigin$$7$$, this.$_childrenInfo$[$direction$$4$$].$_sliceXYSpacing$, this.$_childrenInfo$[$direction$$4$$].$_sliceNormal$, this.$_childrenInfo$[$direction$$4$$].$_color$, this.$_BBox$, this.$_IJKVolume$, this, $JSCompiler_alias_TRUE$$, $JSCompiler_alias_NULL$$);
                $_slice$$4__sliceOrigin$$7$$.$_children$[0].$_visible$ = $JSCompiler_alias_FALSE$$;
                this.$hasLabelMap$ && ($_slice$$4__sliceOrigin$$7$$.$_labelmap$ = $_slice$$4__sliceOrigin$$7$$.$_texture$, $_slice$$4__sliceOrigin$$7$$.$_labelmap$ = this.$_labelmap$.$_children$[$direction$$4$$].$_children$[$i$$113$$].$_texture$);
                $_child$$3$$.$_children$[$i$$113$$] = $_slice$$4__sliceOrigin$$7$$
              }
              $_child$$3$$.$_children$[$i$$113$$].$_visible$ = $JSCompiler_alias_TRUE$$
            }
            $JSCompiler_StaticMethods_onComputingProgress_$$(this, 0.5);
            setTimeout(function() {
              for(;$i$$113$$ < 3 * $quarters$$;$i$$113$$++) {
                if($_child$$3$$.$_children$[$i$$113$$] == $JSCompiler_alias_NULL$$) {
                  var $_slice$$5__sliceOrigin$$8$$ = $goog$vec$Vec3$createFloat32$$();
                  $_slice$$5__sliceOrigin$$8$$[0] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][0] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[0] * $i$$113$$;
                  $_slice$$5__sliceOrigin$$8$$[1] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][1] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[1] * $i$$113$$;
                  $_slice$$5__sliceOrigin$$8$$[2] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][2] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[2] * $i$$113$$;
                  if(this.$hasLabelMap$) {
                    var $_sliceLabel$$4$$ = $X$parser$reslice2$$($_slice$$5__sliceOrigin$$8$$, this.$_childrenInfo$[$direction$$4$$].$_sliceXYSpacing$, this.$_childrenInfo$[$direction$$4$$].$_sliceNormal$, this.$_childrenInfo$[$direction$$4$$].$_color$, this.$_BBox$, this.$_labelmap$.$_IJKVolume$, this.$_labelmap$, this.$_labelmap$.$hasLabelMap$, this.$_labelmap$.$_colortable$.$_map$);
                    this.$_labelmap$.$_children$[$direction$$4$$].$_children$[$i$$113$$] = $_sliceLabel$$4$$;
                    this.$_labelmap$.$_children$[$direction$$4$$].$modified$($JSCompiler_alias_TRUE$$)
                  }
                  $_slice$$5__sliceOrigin$$8$$ = $X$parser$reslice2$$($_slice$$5__sliceOrigin$$8$$, this.$_childrenInfo$[$direction$$4$$].$_sliceXYSpacing$, this.$_childrenInfo$[$direction$$4$$].$_sliceNormal$, this.$_childrenInfo$[$direction$$4$$].$_color$, this.$_BBox$, this.$_IJKVolume$, this, $JSCompiler_alias_TRUE$$, $JSCompiler_alias_NULL$$);
                  $_slice$$5__sliceOrigin$$8$$.$_children$[0].$_visible$ = $JSCompiler_alias_FALSE$$;
                  this.$hasLabelMap$ && ($_slice$$5__sliceOrigin$$8$$.$_labelmap$ = $_slice$$5__sliceOrigin$$8$$.$_texture$, $_slice$$5__sliceOrigin$$8$$.$_labelmap$ = this.$_labelmap$.$_children$[$direction$$4$$].$_children$[$i$$113$$].$_texture$);
                  $_child$$3$$.$_children$[$i$$113$$] = $_slice$$5__sliceOrigin$$8$$
                }
                $_child$$3$$.$_children$[$i$$113$$].$_visible$ = $JSCompiler_alias_TRUE$$
              }
              $JSCompiler_StaticMethods_onComputingProgress_$$(this, 0.75);
              setTimeout(function() {
                for($i$$113$$ = 3 * $quarters$$;$i$$113$$ < $_numberOfSlices$$1$$;$i$$113$$++) {
                  if($_child$$3$$.$_children$[$i$$113$$] == $JSCompiler_alias_NULL$$) {
                    var $_slice$$6__sliceOrigin$$9$$ = $goog$vec$Vec3$createFloat32$$();
                    $_slice$$6__sliceOrigin$$9$$[0] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][0] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[0] * $i$$113$$;
                    $_slice$$6__sliceOrigin$$9$$[1] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][1] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[1] * $i$$113$$;
                    $_slice$$6__sliceOrigin$$9$$[2] = this.$_childrenInfo$[$direction$$4$$].$_solutionsLine$[0][0][2] + this.$_childrenInfo$[$direction$$4$$].$_sliceDirection$[2] * $i$$113$$;
                    if(this.$hasLabelMap$) {
                      var $_sliceLabel$$5$$ = $X$parser$reslice2$$($_slice$$6__sliceOrigin$$9$$, this.$_childrenInfo$[$direction$$4$$].$_sliceXYSpacing$, this.$_childrenInfo$[$direction$$4$$].$_sliceNormal$, this.$_childrenInfo$[$direction$$4$$].$_color$, this.$_BBox$, this.$_labelmap$.$_IJKVolume$, this.$_labelmap$, this.$_labelmap$.$hasLabelMap$, this.$_labelmap$.$_colortable$.$_map$);
                      this.$_labelmap$.$_children$[$direction$$4$$].$_children$[$i$$113$$] = $_sliceLabel$$5$$;
                      this.$_labelmap$.$_children$[$direction$$4$$].$modified$($JSCompiler_alias_TRUE$$)
                    }
                    $_slice$$6__sliceOrigin$$9$$ = $X$parser$reslice2$$($_slice$$6__sliceOrigin$$9$$, this.$_childrenInfo$[$direction$$4$$].$_sliceXYSpacing$, this.$_childrenInfo$[$direction$$4$$].$_sliceNormal$, this.$_childrenInfo$[$direction$$4$$].$_color$, this.$_BBox$, this.$_IJKVolume$, this, $JSCompiler_alias_TRUE$$, $JSCompiler_alias_NULL$$);
                    $_slice$$6__sliceOrigin$$9$$.$_children$[0].$_visible$ = $JSCompiler_alias_FALSE$$;
                    this.$hasLabelMap$ && ($_slice$$6__sliceOrigin$$9$$.$_labelmap$ = $_slice$$6__sliceOrigin$$9$$.$_texture$, $_slice$$6__sliceOrigin$$9$$.$_labelmap$ = this.$_labelmap$.$_children$[$direction$$4$$].$_children$[$i$$113$$].$_texture$);
                    $_child$$3$$.$_children$[$i$$113$$] = $_slice$$6__sliceOrigin$$9$$
                  }
                  $_child$$3$$.$_children$[$i$$113$$].$_visible$ = $JSCompiler_alias_TRUE$$
                }
                $JSCompiler_StaticMethods_onComputingProgress_$$(this, 1);
                setTimeout(function() {
                  this.$_computing$ && this.$_children$[$direction$$4$$].$modified$($JSCompiler_alias_TRUE$$);
                  this.$_volumeRenderingDirection$ = $direction$$4$$;
                  this.$_dirty$ = $JSCompiler_alias_FALSE$$;
                  if(this.$_computing$) {
                    var $computingEndEvent$$inline_327$$ = new $X$event$ComputingEndEvent$$;
                    $computingEndEvent$$inline_327$$.$_object$ = this;
                    this.dispatchEvent($computingEndEvent$$inline_327$$);
                    this.onComputingEnd($direction$$4$$)
                  }
                  this.$_computing$ = $JSCompiler_alias_FALSE$$
                }.bind(this), 10)
              }.bind(this), 10)
            }.bind(this), 10)
          }.bind(this), 10)
        }.bind($JSCompiler_StaticMethods_volumeRendering_$self$$), 10)
      }else {
        $_child$$2_computingEvent$$inline_323$$ = $JSCompiler_StaticMethods_volumeRendering_$self$$.$_children$[$JSCompiler_StaticMethods_volumeRendering_$self$$.$_volumeRenderingDirection$];
        $_child$$2_computingEvent$$inline_323$$.visible = $JSCompiler_alias_FALSE$$;
        var $_child$$2_computingEvent$$inline_323$$ = $JSCompiler_StaticMethods_volumeRendering_$self$$.$_children$[$direction$$4$$], $_numberOfSlices$$ = $_child$$2_computingEvent$$inline_323$$.$_children$.length, $i$$112$$;
        for($i$$112$$ = 0;$i$$112$$ < $_numberOfSlices$$;$i$$112$$++) {
          $_child$$2_computingEvent$$inline_323$$.$_children$[$i$$112$$].$_visible$ = $JSCompiler_alias_TRUE$$
        }
        $JSCompiler_StaticMethods_volumeRendering_$self$$.$_volumeRenderingDirection$ = $direction$$4$$;
        $JSCompiler_StaticMethods_volumeRendering_$self$$.$_dirty$ = $JSCompiler_alias_FALSE$$
      }
    }
  }
}
function $JSCompiler_StaticMethods_onComputingProgress_$$($JSCompiler_StaticMethods_onComputingProgress_$self$$, $progress$$) {
  var $computingProgressEvent$$ = new $X$event$ComputingProgressEvent$$;
  $computingProgressEvent$$.$_value$ = $progress$$;
  $JSCompiler_StaticMethods_onComputingProgress_$self$$.dispatchEvent($computingProgressEvent$$);
  $JSCompiler_StaticMethods_onComputingProgress_$self$$.onComputingProgress(100 * $progress$$)
}
$X$volume$$.prototype.$onComputing$ = $JSCompiler_emptyFn$$();
$X$volume$$.prototype.$onComputingProgress$ = $JSCompiler_emptyFn$$();
$X$volume$$.prototype.$onComputingEnd$ = $JSCompiler_emptyFn$$();
$goog$exportSymbol$$("X.volume", $X$volume$$);
$goog$exportSymbol$$("X.volume.prototype.modified", $X$volume$$.prototype.$modified$);
$goog$exportSymbol$$("X.volume.prototype.sliceInfoChanged", $X$volume$$.prototype.$sliceInfoChanged$);
$goog$exportSymbol$$("X.volume.prototype.onComputing", $X$volume$$.prototype.$onComputing$);
$goog$exportSymbol$$("X.volume.prototype.onComputingProgress", $X$volume$$.prototype.$onComputingProgress$);
$goog$exportSymbol$$("X.volume.prototype.onComputingEnd", $X$volume$$.prototype.$onComputingEnd$);
function $X$parserOFF$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserOFF"
}
$goog$inherits$$($X$parserOFF$$, $X$parser$$);
$X$parserOFF$$.prototype.parse = function $$X$parserOFF$$$$parse$($container$$2$$, $object$$15$$, $_pts_data$$25_modifiedEvent$$2$$) {
  function $readLine$$() {
    $_position$$ === $_length$$1$$ && $JSCompiler_alias_THROW$$(Error("End of file reached unexpectedly."));
    for(var $i$$114$$ = $_position$$;$i$$114$$ < $_length$$1$$;++$i$$114$$) {
      if(10 === $byteData$$[$i$$114$$]) {
        var $line$$1$$ = $JSCompiler_StaticMethods_parseChars$$($byteData$$, $_position$$, $i$$114$$);
        $_position$$ = $i$$114$$ + 1;
        return $line$$1$$
      }
    }
    $_position$$ = $_length$$1$$;
    return $JSCompiler_StaticMethods_parseChars$$($byteData$$, $_position$$, $_length$$1$$ - 1)
  }
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  this.$_data$ = $_pts_data$$25_modifiedEvent$$2$$;
  var $_length$$1$$ = $_pts_data$$25_modifiedEvent$$2$$.byteLength, $byteData$$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", $_length$$1$$);
  $_pts_data$$25_modifiedEvent$$2$$ = [];
  $object$$15$$.$_points$ = new $X$triplets$$($_length$$1$$);
  $object$$15$$.$_normals$ = new $X$triplets$$($_length$$1$$);
  for(var $p$$5$$ = $object$$15$$.$_points$, $n$$6$$ = $object$$15$$.$_normals$, $_position$$ = 0, $_firstLine__nFaces__split$$ = $readLine$$(), $_firstLine__nFaces__split$$ = ("OFF" === $_firstLine__nFaces__split$$ ? $readLine$$() : $_firstLine__nFaces__split$$).split(" "), $_nVertices_norm_p2$$1$$ = $_firstLine__nFaces__split$$[0], $_firstLine__nFaces__split$$ = $_firstLine__nFaces__split$$[1];$_nVertices_norm_p2$$1$$--;) {
    var $coords_line_p3_v3$$6$$ = $readLine$$(), $coords_line_p3_v3$$6$$ = $coords_line_p3_v3$$6$$.split(" ");
    $_pts_data$$25_modifiedEvent$$2$$.push([parseFloat($coords_line_p3_v3$$6$$[0]), parseFloat($coords_line_p3_v3$$6$$[1]), parseFloat($coords_line_p3_v3$$6$$[2])])
  }
  for(;$_firstLine__nFaces__split$$--;) {
    var $coords_line_p3_v3$$6$$ = $readLine$$(), $coords_line_p3_v3$$6$$ = $coords_line_p3_v3$$6$$.split(" "), $p1$$1_v1$$18$$ = $_pts_data$$25_modifiedEvent$$2$$[parseInt($coords_line_p3_v3$$6$$[1], 10)], $_nVertices_norm_p2$$1$$ = $_pts_data$$25_modifiedEvent$$2$$[parseInt($coords_line_p3_v3$$6$$[2], 10)], $coords_line_p3_v3$$6$$ = $_pts_data$$25_modifiedEvent$$2$$[parseInt($coords_line_p3_v3$$6$$[3], 10)];
    $p$$5$$.add($p1$$1_v1$$18$$[0], $p1$$1_v1$$18$$[1], $p1$$1_v1$$18$$[2]);
    $p$$5$$.add($_nVertices_norm_p2$$1$$[0], $_nVertices_norm_p2$$1$$[1], $_nVertices_norm_p2$$1$$[2]);
    $p$$5$$.add($coords_line_p3_v3$$6$$[0], $coords_line_p3_v3$$6$$[1], $coords_line_p3_v3$$6$$[2]);
    $p1$$1_v1$$18$$ = new $goog$math$Vec3$$($p1$$1_v1$$18$$[0], $p1$$1_v1$$18$$[1], $p1$$1_v1$$18$$[2]);
    $coords_line_p3_v3$$6$$ = new $goog$math$Vec3$$($coords_line_p3_v3$$6$$[0], $coords_line_p3_v3$$6$$[1], $coords_line_p3_v3$$6$$[2]);
    $_nVertices_norm_p2$$1$$ = $goog$math$Vec3$cross$$((new $goog$math$Vec3$$($_nVertices_norm_p2$$1$$[0], $_nVertices_norm_p2$$1$$[1], $_nVertices_norm_p2$$1$$[2])).$subtract$($p1$$1_v1$$18$$), $coords_line_p3_v3$$6$$.$subtract$($p1$$1_v1$$18$$));
    $_nVertices_norm_p2$$1$$.normalize();
    $n$$6$$.add($_nVertices_norm_p2$$1$$.x, $_nVertices_norm_p2$$1$$.y, $_nVertices_norm_p2$$1$$.$z$);
    $n$$6$$.add($_nVertices_norm_p2$$1$$.x, $_nVertices_norm_p2$$1$$.y, $_nVertices_norm_p2$$1$$.$z$);
    $n$$6$$.add($_nVertices_norm_p2$$1$$.x, $_nVertices_norm_p2$$1$$.y, $_nVertices_norm_p2$$1$$.$z$)
  }
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $_pts_data$$25_modifiedEvent$$2$$ = new $X$event$ModifiedEvent$$;
  $_pts_data$$25_modifiedEvent$$2$$.$_object$ = $object$$15$$;
  $_pts_data$$25_modifiedEvent$$2$$.$_container$ = $container$$2$$;
  this.dispatchEvent($_pts_data$$25_modifiedEvent$$2$$)
};
$goog$exportSymbol$$("X.parserOFF", $X$parserOFF$$);
$goog$exportSymbol$$("X.parserOFF.prototype.parse", $X$parserOFF$$.prototype.parse);
function $X$parserDCM$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserDCM"
}
$goog$inherits$$($X$parserDCM$$, $X$parser$$);
$X$parserDCM$$.prototype.parse = function $$X$parserDCM$$$$parse$($container$$3$$, $object$$16$$, $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$) {
  window.console.log($object$$16$$);
  $object$$16$$.$MRI$ = {};
  $object$$16$$.$MRI$.$loaded_files$ = 0;
  this.$parseStream$($data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$, $object$$16$$);
  if($object$$16$$.$_file$.length == $JSCompiler_alias_NULL$$ || $object$$16$$.$slices$.length == $object$$16$$.$_file$.length) {
    $object$$16$$.$MRI$.$loaded_files$ = $object$$16$$.$_file$.length;
    var $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ = {};
    $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$ = {};
    for(var $_rasBB$$1_first_image_i$$115_res$$7$$ = 0;$_rasBB$$1_first_image_i$$115_res$$7$$ < $object$$16$$.$slices$.length;$_rasBB$$1_first_image_i$$115_res$$7$$++) {
      $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$.hasOwnProperty($object$$16$$.$slices$[$_rasBB$$1_first_image_i$$115_res$$7$$].series_instance_uid) || ($_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[$object$$16$$.$slices$[$_rasBB$$1_first_image_i$$115_res$$7$$].series_instance_uid] = [], $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$[$object$$16$$.$slices$[$_rasBB$$1_first_image_i$$115_res$$7$$].series_instance_uid] = 
      {}), $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$[$object$$16$$.$slices$[$_rasBB$$1_first_image_i$$115_res$$7$$].series_instance_uid].hasOwnProperty($object$$16$$.$slices$[$_rasBB$$1_first_image_i$$115_res$$7$$].sop_instance_uid) || ($data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$[$object$$16$$.$slices$[$_rasBB$$1_first_image_i$$115_res$$7$$].series_instance_uid][$object$$16$$.$slices$[$_rasBB$$1_first_image_i$$115_res$$7$$].sop_instance_uid] = $JSCompiler_alias_TRUE$$, 
      $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[$object$$16$$.$slices$[$_rasBB$$1_first_image_i$$115_res$$7$$].series_instance_uid].push($object$$16$$.$slices$[$_rasBB$$1_first_image_i$$115_res$$7$$]))
    }
    var $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ = Object.keys($_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$)[0], $_rasBB$$1_first_image_i$$115_res$$7$$ = $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[$_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$], $IJKToRAS$$1_first_image_stacks_min$$1$$ = $_rasBB$$1_first_image_i$$115_res$$7$$.length;
    $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$ = {};
    var $_ordering_tar_tar2$$ = "image_position_patient";
    1 == $IJKToRAS$$1_first_image_stacks_min$$1$$ ? ($_ordering_tar_tar2$$ = "image_position_patient", $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[$_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$][0].dist = 0) : $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_position_patient[0] != $_rasBB$$1_first_image_i$$115_res$$7$$[1].image_position_patient[0] || $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_position_patient[1] != 
    $_rasBB$$1_first_image_i$$115_res$$7$$[1].image_position_patient[1] || $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_position_patient[2] != $_rasBB$$1_first_image_i$$115_res$$7$$[1].image_position_patient[2] ? ($_ordering_tar_tar2$$ = "image_position_patient", $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ = new $goog$math$Vec3$$($_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[0], $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[1], 
    $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[2]), $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ = new $goog$math$Vec3$$($_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[3], $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[4], $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[5]), $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ = $goog$math$Vec3$cross$$($_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$, 
    $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$), $_rasBB$$1_first_image_i$$115_res$$7$$.map(function($flag$$5$$, $arrelem$$) {
      $arrelem$$.dist = $arrelem$$.image_position_patient[0] * $flag$$5$$.x + $arrelem$$.image_position_patient[1] * $flag$$5$$.y + $arrelem$$.image_position_patient[2] * $flag$$5$$.$z$;
      return $arrelem$$
    }.bind($JSCompiler_alias_NULL$$, $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$)), $_rasBB$$1_first_image_i$$115_res$$7$$.sort(function($a$$45$$, $b$$34$$) {
      return $a$$45$$.dist - $b$$34$$.dist
    })) : $_rasBB$$1_first_image_i$$115_res$$7$$[0].instance_number != $_rasBB$$1_first_image_i$$115_res$$7$$[1].instance_number ? ($_ordering_tar_tar2$$ = "instance_number", $_rasBB$$1_first_image_i$$115_res$$7$$.sort(function($a$$46$$, $b$$35$$) {
      return $a$$46$$.instance_number - $b$$35$$.instance_number
    })) : window.console.log("Could not resolve the ordering mode");
    isNaN($_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[0]) && ($_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[0] = 1);
    isNaN($_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[1]) && ($_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[1] = 1);
    if(1 < $IJKToRAS$$1_first_image_stacks_min$$1$$) {
      switch($_ordering_tar_tar2$$) {
        case "image_position_patient":
          var $_first_position_first_slice_size$$ = $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_position_patient, $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ = $_rasBB$$1_first_image_i$$115_res$$7$$[1].image_position_patient, $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ = $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[0] - $_first_position_first_slice_size$$[0], 
          $_origin__y$$1$$ = $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[1] - $_first_position_first_slice_size$$[1], $_z$$1$$ = $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[2] - $_first_position_first_slice_size$$[2];
          $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[2] = Math.sqrt($_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ * $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ + $_origin__y$$1$$ * $_origin__y$$1$$ + $_z$$1$$ * $_z$$1$$);
          break;
        case "instance_number":
          $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[2] = 1;
          break;
        default:
          window.console.log("Unkown ordering mode - returning: " + $_ordering_tar_tar2$$)
      }
    }else {
      $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[2] = 1
    }
    $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ = 1;
    switch($_ordering_tar_tar2$$) {
      case "image_position_patient":
        var $_first_position_first_slice_size$$ = $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_position_patient, $_last_image_position_first_image_data$$ = $_rasBB$$1_first_image_i$$115_res$$7$$[$IJKToRAS$$1_first_image_stacks_min$$1$$ - 1].image_position_patient, $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ = $_last_image_position_first_image_data$$[0] - $_first_position_first_slice_size$$[0], $_origin__y$$1$$ = $_last_image_position_first_image_data$$[1] - $_first_position_first_slice_size$$[1], 
        $_z$$1$$ = $_last_image_position_first_image_data$$[2] - $_first_position_first_slice_size$$[2], $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ = Math.sqrt($_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ * $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ + $_origin__y$$1$$ * $_origin__y$$1$$ + $_z$$1$$ * $_z$$1$$), $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ = 
        $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ + Math.round($_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ / $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[2]);
        break;
      case "instance_number":
        $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ += Math.abs($_rasBB$$1_first_image_i$$115_res$$7$$[$IJKToRAS$$1_first_image_stacks_min$$1$$ - 1].instance_number - $_rasBB$$1_first_image_i$$115_res$$7$$[0].instance_number);
        break;
      default:
        window.console.log("Unkown ordering mode - returning: " + $_ordering_tar_tar2$$)
    }
    $_first_position_first_slice_size$$ = $_rasBB$$1_first_image_i$$115_res$$7$$[0].columns * $_rasBB$$1_first_image_i$$115_res$$7$$[0].rows;
    $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ = $_first_position_first_slice_size$$ * $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$;
    $_last_image_position_first_image_data$$ = $JSCompiler_alias_NULL$$;
    switch($_rasBB$$1_first_image_i$$115_res$$7$$[0].$bits_allocated$) {
      case 8:
        $_last_image_position_first_image_data$$ = new Uint8Array($_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$);
        break;
      case 16:
        $_last_image_position_first_image_data$$ = new Uint16Array($_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$);
        break;
      case 32:
        $_last_image_position_first_image_data$$ = new Uint32Array($_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$);
      default:
        window.console.log("Unknown number of bits allocated - using default: 32 bits")
    }
    $object$$16$$.$_spacing$ = $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing;
    for(var $_i$$4$$ = 0;$_i$$4$$ < $IJKToRAS$$1_first_image_stacks_min$$1$$;$_i$$4$$++) {
      var $_data$$1$$ = $_rasBB$$1_first_image_i$$115_res$$7$$[$_i$$4$$].data, $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ = 0;
      switch($_ordering_tar_tar2$$) {
        case "image_position_patient":
          $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ = $_rasBB$$1_first_image_i$$115_res$$7$$[$_i$$4$$].image_position_patient[0] - $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_position_patient[0];
          $_origin__y$$1$$ = $_rasBB$$1_first_image_i$$115_res$$7$$[$_i$$4$$].image_position_patient[1] - $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_position_patient[1];
          $_z$$1$$ = $_rasBB$$1_first_image_i$$115_res$$7$$[$_i$$4$$].image_position_patient[2] - $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_position_patient[2];
          $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ = Math.sqrt($_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ * $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ + $_origin__y$$1$$ * $_origin__y$$1$$ + $_z$$1$$ * $_z$$1$$) / $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[2];
          break;
        case "instance_number":
          $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ = $_rasBB$$1_first_image_i$$115_res$$7$$[$_i$$4$$].instance_number - $_rasBB$$1_first_image_i$$115_res$$7$$[0].instance_number;
          break;
        default:
          window.console.log("Unkown ordering mode - returning: " + $_ordering_tar_tar2$$)
      }
      $_last_image_position_first_image_data$$.set($_data$$1$$, $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ * $_first_position_first_slice_size$$)
    }
    $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.data = $_last_image_position_first_image_data$$;
    $object$$16$$.$_data$ = $_last_image_position_first_image_data$$;
    $object$$16$$.$_dimensions$ = [$_rasBB$$1_first_image_i$$115_res$$7$$[0].columns, $_rasBB$$1_first_image_i$$115_res$$7$$[0].rows, $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$];
    $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.$dimensions$ = $object$$16$$.$_dimensions$;
    $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ = $JSCompiler_StaticMethods_arrayMinMax$$($_last_image_position_first_image_data$$);
    $IJKToRAS$$1_first_image_stacks_min$$1$$ = $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[0];
    $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ = $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[1];
    $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.min = $object$$16$$.$_min$ = $object$$16$$.$_windowLow$ = $IJKToRAS$$1_first_image_stacks_min$$1$$;
    $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.max = $object$$16$$.$_max$ = $object$$16$$.$_windowHigh$ = $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$;
    -Infinity == $object$$16$$.$_lowerThreshold$ && ($object$$16$$.$_lowerThreshold$ = $IJKToRAS$$1_first_image_stacks_min$$1$$);
    Infinity == $object$$16$$.$_upperThreshold$ && ($object$$16$$.$_upperThreshold$ = $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$);
    $_origin__y$$1$$ = $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_position_patient;
    $IJKToRAS$$1_first_image_stacks_min$$1$$ = $goog$vec$Mat4$createFloat32$$();
    if("false" == $object$$16$$.reslicing || $object$$16$$.reslicing == $JSCompiler_alias_FALSE$$) {
      $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 0, $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[0], 0, 0, 0), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 1, 0, $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[1], 0, 0), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 2, 0, 0, $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[2], 0), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 
      3, 0, 0, 0, 1)
    }else {
      switch($_ordering_tar_tar2$$) {
        case "image_position_patient":
          $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ = new $goog$math$Vec3$$($_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[0], $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[1], $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[2]);
          $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$ = new $goog$math$Vec3$$($_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[3], $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[4], $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[5]);
          $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ = $goog$math$Vec3$cross$$($_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$, $_distance_position__x$$1__y_cosine_first_image_size_seriesInstanceUID$$);
          $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 0, -$_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[0] * $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[0], -$_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[3] * $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[1], -$_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$.x * $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[2], 
          -$_origin__y$$1$$[0]);
          $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 1, -$_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[1] * $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[0], -$_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[4] * $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[1], -$_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$.y * $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[2], 
          -$_origin__y$$1$$[1]);
          $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 2, $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[2] * $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[0], $_rasBB$$1_first_image_i$$115_res$$7$$[0].image_orientation_patient[5] * $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[1], $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$.$z$ * $_rasBB$$1_first_image_i$$115_res$$7$$[0].pixel_spacing[2], 
          $_origin__y$$1$$[2]);
          $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 3, 0, 0, 0, 1);
          break;
        case "instance_number":
          $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 0, -1, 0, 0, -$_origin__y$$1$$[0]);
          $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 1, -0, -1, -0, -$_origin__y$$1$$[1]);
          $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 2, 0, 0, 1, $_origin__y$$1$$[2]);
          $goog$vec$Mat4$setRowValues$$($IJKToRAS$$1_first_image_stacks_min$$1$$, 3, 0, 0, 0, 1);
          break;
        default:
          window.console.log("Unkown ordering mode - returning: " + $_ordering_tar_tar2$$)
      }
    }
    $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.$IJKToRAS$ = $IJKToRAS$$1_first_image_stacks_min$$1$$;
    $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.$RASToIJK$ = $goog$vec$Mat4$createFloat32$$();
    $goog$vec$Mat4$invert$$($data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.$IJKToRAS$, $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.$RASToIJK$);
    $_ordering_tar_tar2$$ = $goog$vec$Vec4$createFloat32FromValues$$(0, 0, 0, 1);
    $_rasBB$$1_first_image_i$$115_res$$7$$ = $goog$vec$Vec4$createFloat32$$();
    $goog$vec$Mat4$multVec4$$($IJKToRAS$$1_first_image_stacks_min$$1$$, $_ordering_tar_tar2$$, $_rasBB$$1_first_image_i$$115_res$$7$$);
    $_ordering_tar_tar2$$ = $goog$vec$Vec4$createFloat32FromValues$$(1, 1, 1, 1);
    $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$ = $goog$vec$Vec4$createFloat32$$();
    $goog$vec$Mat4$multVec4$$($IJKToRAS$$1_first_image_stacks_min$$1$$, $_ordering_tar_tar2$$, $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$);
    $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.$RASSpacing$ = [$_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[0] - $_rasBB$$1_first_image_i$$115_res$$7$$[0], $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[1] - $_rasBB$$1_first_image_i$$115_res$$7$$[1], $_second_image_position__x_cosine__z_cosine_first_image_expected_nb_slices_max$$1_min_max_res2_series$$[2] - $_rasBB$$1_first_image_i$$115_res$$7$$[2]];
    $_rasBB$$1_first_image_i$$115_res$$7$$ = $X$parser$computeRASBBox$$($IJKToRAS$$1_first_image_stacks_min$$1$$, [$object$$16$$.$_dimensions$[0], $object$$16$$.$_dimensions$[1], $object$$16$$.$_dimensions$[2]]);
    $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.$RASDimensions$ = [$_rasBB$$1_first_image_i$$115_res$$7$$[1] - $_rasBB$$1_first_image_i$$115_res$$7$$[0] + 1, $_rasBB$$1_first_image_i$$115_res$$7$$[3] - $_rasBB$$1_first_image_i$$115_res$$7$$[2] + 1, $_rasBB$$1_first_image_i$$115_res$$7$$[5] - $_rasBB$$1_first_image_i$$115_res$$7$$[4] + 1];
    $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.$RASOrigin$ = [$_rasBB$$1_first_image_i$$115_res$$7$$[0], $_rasBB$$1_first_image_i$$115_res$$7$$[2], $_rasBB$$1_first_image_i$$115_res$$7$$[4]];
    $object$$16$$.$create_$($data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$);
    $object$$16$$.$_image$ = $JSCompiler_StaticMethods_reslice$$(this, $object$$16$$)
  }
  $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$ = new $X$event$ModifiedEvent$$;
  $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.$_object$ = $object$$16$$;
  $data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$.$_container$ = $container$$3$$;
  this.dispatchEvent($data$$26_imageSeriesPushed_modifiedEvent$$3_volumeAttributes$$)
};
function $JSCompiler_StaticMethods_handleDefaults$$($_VLT__bytes$$2$$, $_bytePointer$$, $_VR_byte2bits$$, $_VL$$) {
  switch($_VR_byte2bits$$) {
    case 16975:
    ;
    case 20819:
    ;
    case 20053:
    ;
    case 22351:
      $_VR_byte2bits$$ = function $$_VR_byte2bits$$$($a$$47$$) {
        for(var $tmp$$2$$ = "", $i$$116$$ = 128;1 <= $i$$116$$;$i$$116$$ /= 2) {
          $tmp$$2$$ += $a$$47$$ & $i$$116$$ ? "1" : "0"
        }
        return $tmp$$2$$
      };
      $_VL$$ = $_VLT__bytes$$2$$[$_bytePointer$$++];
      $_VLT__bytes$$2$$ = $_VLT__bytes$$2$$[$_bytePointer$$++];
      $_VL$$ = parseInt($_VR_byte2bits$$(($_VLT__bytes$$2$$ & 65280) >> 8) + $_VR_byte2bits$$($_VLT__bytes$$2$$ & 255) + ($_VR_byte2bits$$(($_VL$$ & 65280) >> 8) + $_VR_byte2bits$$($_VL$$ & 255)), 2);
      4294967295 == $_VL$$ && ($_VL$$ = 0);
      $_bytePointer$$ += $_VL$$ / 2;
      break;
    default:
      $_bytePointer$$ += $_VL$$ / 2
  }
  return $_bytePointer$$
}
$X$parserDCM$$.prototype.$parseStream$ = function $$X$parserDCM$$$$$parseStream$$($data$$27$$, $object$$17$$) {
  this.$_data$ = $data$$27$$;
  if("undefined" == typeof $object$$17$$.$slices$ || $object$$17$$.$slices$ == $JSCompiler_alias_NULL$$) {
    $object$$17$$.$slices$ = []
  }
  for(var $slice$$2$$ = {pixel_spacing:[0.1, 0.1, Infinity], image_orientation_patient:[1, 0, 0, 0, 1, 0], image_position_patient:[0, 0, 0], transfer_syntax_uid:"no_transfer_syntax_uid"}, $_bytes$$3__data$$2$$ = $JSCompiler_StaticMethods_scan$$(this, "ushort", this.$_data$.byteLength), $_bytePointer$$1$$ = 66, $_tagGroup_i$$117$$ = $JSCompiler_alias_NULL$$, $_b0$$1__tagElement$$ = $JSCompiler_alias_NULL$$, $_VR$$1__b1$$1__short$$ = $JSCompiler_alias_NULL$$, $_VL$$1$$ = $JSCompiler_alias_NULL$$;$_bytePointer$$1$$ < 
  $_bytes$$3__data$$2$$.length;) {
    switch($_tagGroup_i$$117$$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$++], $_b0$$1__tagElement$$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$++], $_VR$$1__b1$$1__short$$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$++], $_VL$$1$$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$++], "1.2.840.10008.1.2" == $slice$$2$$.transfer_syntax_uid && 0 == $_VL$$1$$ && ($_VL$$1$$ = $_VR$$1__b1$$1__short$$), $_tagGroup_i$$117$$) {
      case 2:
        switch($_b0$$1__tagElement$$) {
          case 16:
            for(var $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ = "", $_tagGroup_i$$117$$ = $_tagGroup_i$$117$$ = 0;$_tagGroup_i$$117$$ < $_VL$$1$$ / 2;$_tagGroup_i$$117$$++) {
              $_VR$$1__b1$$1__short$$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$++], $_b0$$1__tagElement$$ = $_VR$$1__b1$$1__short$$ & 255, $_VR$$1__b1$$1__short$$ = ($_VR$$1__b1$$1__short$$ & 65280) >> 8, $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ += String.fromCharCode($_b0$$1__tagElement$$), $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ += String.fromCharCode($_VR$$1__b1$$1__short$$)
            }
            $slice$$2$$.transfer_syntax_uid = $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$.replace(/\0/g, "");
            break;
          default:
            $_bytePointer$$1$$ = $JSCompiler_StaticMethods_handleDefaults$$($_bytes$$3__data$$2$$, $_bytePointer$$1$$, $_VR$$1__b1$$1__short$$, $_VL$$1$$)
        }
        break;
      case 40:
        switch($_b0$$1__tagElement$$) {
          case 16:
            $slice$$2$$.rows = $_bytes$$3__data$$2$$[$_bytePointer$$1$$];
            $_bytePointer$$1$$ += $_VL$$1$$ / 2;
            break;
          case 17:
            $slice$$2$$.columns = $_bytes$$3__data$$2$$[$_bytePointer$$1$$];
            $_bytePointer$$1$$ += $_VL$$1$$ / 2;
            break;
          case 256:
            $slice$$2$$.$bits_allocated$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$];
            $_bytePointer$$1$$ += $_VL$$1$$ / 2;
            break;
          case 257:
            $slice$$2$$.bits_stored = $_bytes$$3__data$$2$$[$_bytePointer$$1$$];
            $_bytePointer$$1$$ += $_VL$$1$$ / 2;
            break;
          case 2:
            $slice$$2$$.number_of_images = $_bytes$$3__data$$2$$[$_bytePointer$$1$$];
            $_bytePointer$$1$$ += $_VL$$1$$ / 2;
            break;
          case 48:
            $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ = "";
            for($_tagGroup_i$$117$$ = 0;$_tagGroup_i$$117$$ < $_VL$$1$$ / 2;$_tagGroup_i$$117$$++) {
              $_VR$$1__b1$$1__short$$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$++], $_b0$$1__tagElement$$ = $_VR$$1__b1$$1__short$$ & 255, $_VR$$1__b1$$1__short$$ = ($_VR$$1__b1$$1__short$$ & 65280) >> 8, $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ += String.fromCharCode($_b0$$1__tagElement$$), $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ += String.fromCharCode($_VR$$1__b1$$1__short$$)
            }
            $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ = $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$.split("\\");
            $slice$$2$$.pixel_spacing = [parseFloat($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$[0]), parseFloat($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$[1]), Infinity];
            break;
          default:
            $_bytePointer$$1$$ = $JSCompiler_StaticMethods_handleDefaults$$($_bytes$$3__data$$2$$, $_bytePointer$$1$$, $_VR$$1__b1$$1__short$$, $_VL$$1$$)
        }
        break;
      case 32:
        switch($_b0$$1__tagElement$$) {
          case 14:
            $slice$$2$$.series_instance_uid = "";
            for($_tagGroup_i$$117$$ = 0;$_tagGroup_i$$117$$ < $_VL$$1$$ / 2;$_tagGroup_i$$117$$++) {
              $_VR$$1__b1$$1__short$$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$++], $_b0$$1__tagElement$$ = $_VR$$1__b1$$1__short$$ & 255, $_VR$$1__b1$$1__short$$ = ($_VR$$1__b1$$1__short$$ & 65280) >> 8, $slice$$2$$.series_instance_uid += String.fromCharCode($_b0$$1__tagElement$$), $slice$$2$$.series_instance_uid += String.fromCharCode($_VR$$1__b1$$1__short$$)
            }
            break;
          case 19:
            $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ = "";
            for($_tagGroup_i$$117$$ = 0;$_tagGroup_i$$117$$ < $_VL$$1$$ / 2;$_tagGroup_i$$117$$++) {
              $_VR$$1__b1$$1__short$$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$++], $_b0$$1__tagElement$$ = $_VR$$1__b1$$1__short$$ & 255, $_VR$$1__b1$$1__short$$ = ($_VR$$1__b1$$1__short$$ & 65280) >> 8, $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ += String.fromCharCode($_b0$$1__tagElement$$), $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ += String.fromCharCode($_VR$$1__b1$$1__short$$)
            }
            $slice$$2$$.instance_number = parseInt($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$, 10);
            break;
          case 50:
            $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ = "";
            for($_tagGroup_i$$117$$ = 0;$_tagGroup_i$$117$$ < $_VL$$1$$ / 2;$_tagGroup_i$$117$$++) {
              $_VR$$1__b1$$1__short$$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$++], $_b0$$1__tagElement$$ = $_VR$$1__b1$$1__short$$ & 255, $_VR$$1__b1$$1__short$$ = ($_VR$$1__b1$$1__short$$ & 65280) >> 8, $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ += String.fromCharCode($_b0$$1__tagElement$$), $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ += String.fromCharCode($_VR$$1__b1$$1__short$$)
            }
            $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ = $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$.split("\\");
            $slice$$2$$.image_position_patient = [parseFloat($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$[0]), parseFloat($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$[1]), parseFloat($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$[2])];
            break;
          case 55:
            $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ = "";
            for($_tagGroup_i$$117$$ = 0;$_tagGroup_i$$117$$ < $_VL$$1$$ / 2;$_tagGroup_i$$117$$++) {
              $_VR$$1__b1$$1__short$$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$++], $_b0$$1__tagElement$$ = $_VR$$1__b1$$1__short$$ & 255, $_VR$$1__b1$$1__short$$ = ($_VR$$1__b1$$1__short$$ & 65280) >> 8, $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ += String.fromCharCode($_b0$$1__tagElement$$), $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ += String.fromCharCode($_VR$$1__b1$$1__short$$)
            }
            $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$ = $_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$.split("\\");
            $slice$$2$$.image_orientation_patient = [parseFloat($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$[0]), parseFloat($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$[1]), parseFloat($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$[2]), parseFloat($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$[3]), parseFloat($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$[4]), 
            parseFloat($_image_orientation__image_position__pixel_spacing__position$$1__transfer_syntax_uid$$[5])];
            break;
          default:
            $_bytePointer$$1$$ = $JSCompiler_StaticMethods_handleDefaults$$($_bytes$$3__data$$2$$, $_bytePointer$$1$$, $_VR$$1__b1$$1__short$$, $_VL$$1$$)
        }
        break;
      case 65534:
        switch($_b0$$1__tagElement$$) {
          default:
            $_VL$$1$$ = 0, $_bytePointer$$1$$ += $_VL$$1$$ / 2
        }
        break;
      case 8:
        switch($_b0$$1__tagElement$$) {
          case 24:
            $slice$$2$$.sop_instance_uid = "";
            for($_tagGroup_i$$117$$ = 0;$_tagGroup_i$$117$$ < $_VL$$1$$ / 2;$_tagGroup_i$$117$$++) {
              $_VR$$1__b1$$1__short$$ = $_bytes$$3__data$$2$$[$_bytePointer$$1$$++], $_b0$$1__tagElement$$ = $_VR$$1__b1$$1__short$$ & 255, $_VR$$1__b1$$1__short$$ = ($_VR$$1__b1$$1__short$$ & 65280) >> 8, $slice$$2$$.sop_instance_uid += String.fromCharCode($_b0$$1__tagElement$$), $slice$$2$$.sop_instance_uid += String.fromCharCode($_VR$$1__b1$$1__short$$)
            }
            break;
          default:
            $_bytePointer$$1$$ = $JSCompiler_StaticMethods_handleDefaults$$($_bytes$$3__data$$2$$, $_bytePointer$$1$$, $_VR$$1__b1$$1__short$$, $_VL$$1$$)
        }
        break;
      case 16:
        switch($_b0$$1__tagElement$$) {
          case 8720:
            for($_tagGroup_i$$117$$ = 0;$_tagGroup_i$$117$$ < $_VL$$1$$ / 2;$_tagGroup_i$$117$$++) {
              $_bytePointer$$1$$++
            }
            break;
          default:
            $_bytePointer$$1$$ = $JSCompiler_StaticMethods_handleDefaults$$($_bytes$$3__data$$2$$, $_bytePointer$$1$$, $_VR$$1__b1$$1__short$$, $_VL$$1$$)
        }
        break;
      default:
        $_bytePointer$$1$$ = $JSCompiler_StaticMethods_handleDefaults$$($_bytes$$3__data$$2$$, $_bytePointer$$1$$, $_VR$$1__b1$$1__short$$, $_VL$$1$$)
    }
  }
  switch($slice$$2$$.$bits_allocated$) {
    case 8:
      $slice$$2$$.data = new Uint8Array($slice$$2$$.columns * $slice$$2$$.rows);
      break;
    case 16:
      $slice$$2$$.data = new Uint16Array($slice$$2$$.columns * $slice$$2$$.rows);
      break;
    case 32:
      $slice$$2$$.data = new Uint32Array($slice$$2$$.columns * $slice$$2$$.rows)
  }
  this.$_dataPointer$ = this.$_data$.byteLength - 2 * $slice$$2$$.columns * $slice$$2$$.rows;
  $_bytes$$3__data$$2$$ = $JSCompiler_alias_NULL$$;
  switch($slice$$2$$.$bits_allocated$) {
    case 8:
      $_bytes$$3__data$$2$$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", $slice$$2$$.columns * $slice$$2$$.rows);
      break;
    case 16:
      $_bytes$$3__data$$2$$ = $JSCompiler_StaticMethods_scan$$(this, "ushort", $slice$$2$$.columns * $slice$$2$$.rows);
      break;
    case 32:
      $_bytes$$3__data$$2$$ = $JSCompiler_StaticMethods_scan$$(this, "uint", $slice$$2$$.columns * $slice$$2$$.rows)
  }
  $slice$$2$$.data = $_bytes$$3__data$$2$$;
  $object$$17$$.$slices$.push($slice$$2$$);
  return $object$$17$$
};
$goog$exportSymbol$$("X.parserDCM", $X$parserDCM$$);
$goog$exportSymbol$$("X.parserDCM.prototype.parse", $X$parserDCM$$.prototype.parse);
function $X$parserVTK$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserVTK"
}
$goog$inherits$$($X$parserVTK$$, $X$parser$$);
$X$parserVTK$$.prototype.parse = function $$X$parserVTK$$$$parse$($container$$4$$, $object$$18$$, $data$$28_i$$118_unorderedPoints$$inline_335$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  var $modifiedEvent$$4_p$$6_p$$inline_333$$ = $object$$18$$.$_points$, $n$$7_n$$inline_334$$ = $object$$18$$.$_normals$, $_data$$3_dataAsArray_unorderedNormals$$inline_336$$ = new Uint8Array($data$$28_i$$118_unorderedPoints$$inline_335$$), $_str_numberOfLines_numberOfUnorderedNormals$$inline_337$$ = "";
  $object$$18$$.$_points$ = $modifiedEvent$$4_p$$6_p$$inline_333$$ = new $X$triplets$$($data$$28_i$$118_unorderedPoints$$inline_335$$.byteLength);
  $object$$18$$.$_normals$ = $n$$7_n$$inline_334$$ = new $X$triplets$$($data$$28_i$$118_unorderedPoints$$inline_335$$.byteLength);
  $data$$28_i$$118_unorderedPoints$$inline_335$$ = 0;
  for(var $len$$1_n2_numberOfGeometries$$inline_338$$ = $_data$$3_dataAsArray_unorderedNormals$$inline_336$$.length;$data$$28_i$$118_unorderedPoints$$inline_335$$ < $len$$1_n2_numberOfGeometries$$inline_338$$;$data$$28_i$$118_unorderedPoints$$inline_335$$ += 32768) {
    $_str_numberOfLines_numberOfUnorderedNormals$$inline_337$$ += $JSCompiler_StaticMethods_parseChars$$($_data$$3_dataAsArray_unorderedNormals$$inline_336$$, $data$$28_i$$118_unorderedPoints$$inline_335$$, Math.min($data$$28_i$$118_unorderedPoints$$inline_335$$ + 32768, $len$$1_n2_numberOfGeometries$$inline_338$$))
  }
  $_data$$3_dataAsArray_unorderedNormals$$inline_336$$ = $_str_numberOfLines_numberOfUnorderedNormals$$inline_337$$.split("\n");
  $_str_numberOfLines_numberOfUnorderedNormals$$inline_337$$ = $_data$$3_dataAsArray_unorderedNormals$$inline_336$$.length;
  this.$_unorderedNormals$ = this.$_unorderedPoints$ = $JSCompiler_alias_NULL$$;
  this.$_geometries$ = [];
  this.$_objectType$ = $X$displayable$types$TRIANGLES$$;
  this.$_normalsMode$ = this.$_pointDataMode$ = this.$_geometryMode$ = this.$_pointsMode$ = $JSCompiler_alias_FALSE$$;
  $data$$28_i$$118_unorderedPoints$$inline_335$$ = 0;
  for($len$$1_n2_numberOfGeometries$$inline_338$$ = $_str_numberOfLines_numberOfUnorderedNormals$$inline_337$$ % 8;$len$$1_n2_numberOfGeometries$$inline_338$$--;) {
    $JSCompiler_StaticMethods_parseLine$$(this, $_data$$3_dataAsArray_unorderedNormals$$inline_336$$[$data$$28_i$$118_unorderedPoints$$inline_335$$]), $data$$28_i$$118_unorderedPoints$$inline_335$$++
  }
  for($len$$1_n2_numberOfGeometries$$inline_338$$ = 0.125 * $_str_numberOfLines_numberOfUnorderedNormals$$inline_337$$ ^ 0;$len$$1_n2_numberOfGeometries$$inline_338$$--;) {
    $JSCompiler_StaticMethods_parseLine$$(this, $_data$$3_dataAsArray_unorderedNormals$$inline_336$$[$data$$28_i$$118_unorderedPoints$$inline_335$$]), $data$$28_i$$118_unorderedPoints$$inline_335$$++, $JSCompiler_StaticMethods_parseLine$$(this, $_data$$3_dataAsArray_unorderedNormals$$inline_336$$[$data$$28_i$$118_unorderedPoints$$inline_335$$]), $data$$28_i$$118_unorderedPoints$$inline_335$$++, $JSCompiler_StaticMethods_parseLine$$(this, $_data$$3_dataAsArray_unorderedNormals$$inline_336$$[$data$$28_i$$118_unorderedPoints$$inline_335$$]), 
    $data$$28_i$$118_unorderedPoints$$inline_335$$++, $JSCompiler_StaticMethods_parseLine$$(this, $_data$$3_dataAsArray_unorderedNormals$$inline_336$$[$data$$28_i$$118_unorderedPoints$$inline_335$$]), $data$$28_i$$118_unorderedPoints$$inline_335$$++, $JSCompiler_StaticMethods_parseLine$$(this, $_data$$3_dataAsArray_unorderedNormals$$inline_336$$[$data$$28_i$$118_unorderedPoints$$inline_335$$]), $data$$28_i$$118_unorderedPoints$$inline_335$$++, $JSCompiler_StaticMethods_parseLine$$(this, $_data$$3_dataAsArray_unorderedNormals$$inline_336$$[$data$$28_i$$118_unorderedPoints$$inline_335$$]), 
    $data$$28_i$$118_unorderedPoints$$inline_335$$++, $JSCompiler_StaticMethods_parseLine$$(this, $_data$$3_dataAsArray_unorderedNormals$$inline_336$$[$data$$28_i$$118_unorderedPoints$$inline_335$$]), $data$$28_i$$118_unorderedPoints$$inline_335$$++, $JSCompiler_StaticMethods_parseLine$$(this, $_data$$3_dataAsArray_unorderedNormals$$inline_336$$[$data$$28_i$$118_unorderedPoints$$inline_335$$]), $data$$28_i$$118_unorderedPoints$$inline_335$$++
  }
  $data$$28_i$$118_unorderedPoints$$inline_335$$ = this.$_unorderedPoints$;
  var $_data$$3_dataAsArray_unorderedNormals$$inline_336$$ = this.$_unorderedNormals$, $_str_numberOfLines_numberOfUnorderedNormals$$inline_337$$ = $_data$$3_dataAsArray_unorderedNormals$$inline_336$$.length, $i$$inline_339$$ = $len$$1_n2_numberOfGeometries$$inline_338$$ = this.$_geometries$.length;
  do {
    var $currentGeometry$$inline_340$$ = this.$_geometries$[$len$$1_n2_numberOfGeometries$$inline_338$$ - $i$$inline_339$$], $currentGeometryLength$$inline_341$$ = $currentGeometry$$inline_340$$.length, $k$$inline_342$$;
    for($k$$inline_342$$ = 0;$k$$inline_342$$ < $currentGeometryLength$$inline_341$$ && !("LINES" == this.$_objectType$ && $k$$inline_342$$ + 1 >= $currentGeometryLength$$inline_341$$);$k$$inline_342$$++) {
      var $currentIndex$$inline_343$$ = parseInt($currentGeometry$$inline_340$$[$k$$inline_342$$], 10), $currentPoint$$inline_344$$ = $data$$28_i$$118_unorderedPoints$$inline_335$$.get($currentIndex$$inline_343$$);
      $modifiedEvent$$4_p$$6_p$$inline_333$$.add($currentPoint$$inline_344$$[0], $currentPoint$$inline_344$$[1], $currentPoint$$inline_344$$[2]);
      var $artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$ = $currentIndex$$inline_343$$, $currentNormals$$inline_347_nextPoint$$inline_346$$ = $currentPoint$$inline_344$$;
      "LINES" == this.$_objectType$ ? ($artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$ = parseInt($currentGeometry$$inline_340$$[$k$$inline_342$$ + 1], 10), $currentNormals$$inline_347_nextPoint$$inline_346$$ = $data$$28_i$$118_unorderedPoints$$inline_335$$.get($artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$), $modifiedEvent$$4_p$$6_p$$inline_333$$.add($currentNormals$$inline_347_nextPoint$$inline_346$$[0], 
      $currentNormals$$inline_347_nextPoint$$inline_346$$[1], $currentNormals$$inline_347_nextPoint$$inline_346$$[2])) : "TRIANGLE_STRIPS" == this.$_objectType$ && (0 == $k$$inline_342$$ || $k$$inline_342$$ == $currentGeometryLength$$inline_341$$ - 1) && $modifiedEvent$$4_p$$6_p$$inline_333$$.add($currentPoint$$inline_344$$[0], $currentPoint$$inline_344$$[1], $currentPoint$$inline_344$$[2]);
      $currentIndex$$inline_343$$ < $_str_numberOfLines_numberOfUnorderedNormals$$inline_337$$ ? ($currentNormals$$inline_347_nextPoint$$inline_346$$ = $_data$$3_dataAsArray_unorderedNormals$$inline_336$$.get($currentIndex$$inline_343$$), $n$$7_n$$inline_334$$.add($currentNormals$$inline_347_nextPoint$$inline_346$$[0], $currentNormals$$inline_347_nextPoint$$inline_346$$[1], $currentNormals$$inline_347_nextPoint$$inline_346$$[2]), "LINES" == this.$_objectType$ ? ($artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$ = 
      $_data$$3_dataAsArray_unorderedNormals$$inline_336$$.get($artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$), $n$$7_n$$inline_334$$.add($artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$[0], $artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$[1], $artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$[2])) : 
      "TRIANGLE_STRIPS" == this.$_objectType$ && (0 == $k$$inline_342$$ || $k$$inline_342$$ == $currentGeometryLength$$inline_341$$ - 1) && $n$$7_n$$inline_334$$.add($currentNormals$$inline_347_nextPoint$$inline_346$$[0], $currentNormals$$inline_347_nextPoint$$inline_346$$[1], $currentNormals$$inline_347_nextPoint$$inline_346$$[2])) : ($artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$ = new $goog$math$Vec3$$($currentPoint$$inline_344$$[0], 
      $currentPoint$$inline_344$$[1], $currentPoint$$inline_344$$[2]), $artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$.normalize(), $n$$7_n$$inline_334$$.add($artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$.x, $artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$.y, $artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$.$z$), 
      "LINES" == this.$_objectType$ ? ($artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$ = new $goog$math$Vec3$$($currentNormals$$inline_347_nextPoint$$inline_346$$[0], $currentNormals$$inline_347_nextPoint$$inline_346$$[1], $currentNormals$$inline_347_nextPoint$$inline_346$$[2]), $artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$.normalize(), $n$$7_n$$inline_334$$.add($artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$.x, 
      $artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$.y, $artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$.$z$)) : "TRIANGLE_STRIPS" == this.$_objectType$ && (0 == $k$$inline_342$$ || $k$$inline_342$$ == $currentGeometryLength$$inline_341$$ - 1) && $n$$7_n$$inline_334$$.add($artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$.x, 
      $artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$.y, $artificialNormal$$inline_349_artificialNormal2$$inline_350_nextIndex$$inline_345_nextNormals$$inline_348$$.$z$))
    }
    $i$$inline_339$$--
  }while(0 < $i$$inline_339$$);
  $object$$18$$.$_type$ = this.$_objectType$;
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $modifiedEvent$$4_p$$6_p$$inline_333$$ = new $X$event$ModifiedEvent$$;
  $modifiedEvent$$4_p$$6_p$$inline_333$$.$_object$ = $object$$18$$;
  $modifiedEvent$$4_p$$6_p$$inline_333$$.$_container$ = $container$$4$$;
  this.dispatchEvent($modifiedEvent$$4_p$$6_p$$inline_333$$)
};
function $JSCompiler_StaticMethods_parseLine$$($JSCompiler_StaticMethods_parseLine$self$$, $line$$2$$) {
  $line$$2$$ = $line$$2$$.replace(/^\s+|\s+$/g, "");
  var $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$ = $line$$2$$.split(" "), $numberOfLineFields_x2$$2$$ = $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$.length, $firstLineField_x0$$3_x1$$5_y2$$2$$ = $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[0];
  switch($firstLineField_x0$$3_x1$$5_y2$$2$$) {
    case "POINTS":
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointsMode$ = $JSCompiler_alias_TRUE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_geometryMode$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointDataMode$ = $JSCompiler_alias_FALSE$$;
      $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$ = parseInt($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[1], 10);
      $JSCompiler_StaticMethods_parseLine$self$$.$_unorderedPoints$ = new $X$triplets$$(3 * $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$);
      $JSCompiler_StaticMethods_parseLine$self$$.$_unorderedNormals$ = new $X$triplets$$(3 * $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$);
      return;
    case "VERTICES":
      $JSCompiler_StaticMethods_parseLine$self$$.$_geometryMode$ = $JSCompiler_alias_TRUE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointsMode$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointDataMode$ = $JSCompiler_alias_FALSE$$;
      $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$ = parseInt($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[1], 10);
      3 <= $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$ ? $JSCompiler_StaticMethods_parseLine$self$$.$_objectType$ = $X$displayable$types$TRIANGLES$$ : 1 == $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$ ? $JSCompiler_StaticMethods_parseLine$self$$.$_objectType$ = "POINTS" : $JSCompiler_alias_THROW$$(Error("This VTK file is not supported!"));
      $JSCompiler_StaticMethods_parseLine$self$$.$_geometries$ = [];
      return;
    case "TRIANGLE_STRIPS":
      $JSCompiler_StaticMethods_parseLine$self$$.$_geometryMode$ = $JSCompiler_alias_TRUE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointsMode$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointDataMode$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_objectType$ = "TRIANGLE_STRIPS";
      $JSCompiler_StaticMethods_parseLine$self$$.$_geometries$ = [];
      return;
    case "LINES":
      $JSCompiler_StaticMethods_parseLine$self$$.$_geometryMode$ = $JSCompiler_alias_TRUE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointsMode$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointDataMode$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_objectType$ = "LINES";
      $JSCompiler_StaticMethods_parseLine$self$$.$_geometries$ = [];
      return;
    case "POLYGONS":
      $JSCompiler_StaticMethods_parseLine$self$$.$_geometryMode$ = $JSCompiler_alias_TRUE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointsMode$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointDataMode$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_objectType$ = "POLYGONS";
      $JSCompiler_StaticMethods_parseLine$self$$.$_geometries$ = [];
      return;
    case "POINT_DATA":
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointDataMode$ = $JSCompiler_alias_TRUE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointsMode$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_parseLine$self$$.$_geometryMode$ = $JSCompiler_alias_FALSE$$;
      return
  }
  if($JSCompiler_StaticMethods_parseLine$self$$.$_pointsMode$) {
    if(1 == $numberOfLineFields_x2$$2$$ || isNaN(parseFloat($firstLineField_x0$$3_x1$$5_y2$$2$$))) {
      $JSCompiler_StaticMethods_parseLine$self$$.$_pointsMode$ = $JSCompiler_alias_FALSE$$
    }else {
      if(3 <= $numberOfLineFields_x2$$2$$) {
        var $firstLineField_x0$$3_x1$$5_y2$$2$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[0]), $y0$$3_y1$$5$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[1]), $z0$$1_z1$$1$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[2]);
        $JSCompiler_StaticMethods_parseLine$self$$.$_unorderedPoints$.add($firstLineField_x0$$3_x1$$5_y2$$2$$, $y0$$3_y1$$5$$, $z0$$1_z1$$1$$)
      }
      6 <= $numberOfLineFields_x2$$2$$ && ($firstLineField_x0$$3_x1$$5_y2$$2$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[3]), $y0$$3_y1$$5$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[4]), $z0$$1_z1$$1$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[5]), $JSCompiler_StaticMethods_parseLine$self$$.$_unorderedPoints$.add($firstLineField_x0$$3_x1$$5_y2$$2$$, $y0$$3_y1$$5$$, $z0$$1_z1$$1$$));
      9 <= $numberOfLineFields_x2$$2$$ && ($numberOfLineFields_x2$$2$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[6]), $firstLineField_x0$$3_x1$$5_y2$$2$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[7]), $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[8]), $JSCompiler_StaticMethods_parseLine$self$$.$_unorderedPoints$.add($numberOfLineFields_x2$$2$$, 
      $firstLineField_x0$$3_x1$$5_y2$$2$$, $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$))
    }
  }else {
    $JSCompiler_StaticMethods_parseLine$self$$.$_geometryMode$ ? 1 == $numberOfLineFields_x2$$2$$ || isNaN(parseFloat($firstLineField_x0$$3_x1$$5_y2$$2$$)) ? $JSCompiler_StaticMethods_parseLine$self$$.$_geometryMode$ = $JSCompiler_alias_FALSE$$ : ($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$ = $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$.slice(1), $JSCompiler_StaticMethods_parseLine$self$$.$_geometries$.push($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$)) : 
    $JSCompiler_StaticMethods_parseLine$self$$.$_pointDataMode$ && ("NORMALS" == $firstLineField_x0$$3_x1$$5_y2$$2$$ ? $JSCompiler_StaticMethods_parseLine$self$$.$_normalsMode$ = $JSCompiler_alias_TRUE$$ : 1 == $numberOfLineFields_x2$$2$$ || isNaN(parseFloat($firstLineField_x0$$3_x1$$5_y2$$2$$)) ? ($JSCompiler_StaticMethods_parseLine$self$$.$_pointDataMode$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_parseLine$self$$.$_normalsMode$ = $JSCompiler_alias_FALSE$$) : $JSCompiler_StaticMethods_parseLine$self$$.$_normalsMode$ && 
    (3 <= $numberOfLineFields_x2$$2$$ && ($firstLineField_x0$$3_x1$$5_y2$$2$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[0]), $y0$$3_y1$$5$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[1]), $z0$$1_z1$$1$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[2]), $JSCompiler_StaticMethods_parseLine$self$$.$_unorderedNormals$.add($firstLineField_x0$$3_x1$$5_y2$$2$$, $y0$$3_y1$$5$$, $z0$$1_z1$$1$$)), 6 <= $numberOfLineFields_x2$$2$$ && 
    ($firstLineField_x0$$3_x1$$5_y2$$2$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[3]), $y0$$3_y1$$5$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[4]), $z0$$1_z1$$1$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[5]), $JSCompiler_StaticMethods_parseLine$self$$.$_unorderedNormals$.add($firstLineField_x0$$3_x1$$5_y2$$2$$, $y0$$3_y1$$5$$, $z0$$1_z1$$1$$)), 9 <= $numberOfLineFields_x2$$2$$ && ($numberOfLineFields_x2$$2$$ = 
    parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[6]), $firstLineField_x0$$3_x1$$5_y2$$2$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[7]), $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$ = parseFloat($lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$[8]), $JSCompiler_StaticMethods_parseLine$self$$.$_unorderedNormals$.add($numberOfLineFields_x2$$2$$, $firstLineField_x0$$3_x1$$5_y2$$2$$, $lineFields_numberOfElements_numberOfPoints$$1_values$$17_z2$$))))
  }
}
$goog$exportSymbol$$("X.parserVTK", $X$parserVTK$$);
$goog$exportSymbol$$("X.parserVTK.prototype.parse", $X$parserVTK$$.prototype.parse);
function $X$parserFSM$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserFSM";
  this.$_littleEndian$ = $JSCompiler_alias_FALSE$$
}
$goog$inherits$$($X$parserFSM$$, $X$parser$$);
$X$parserFSM$$.prototype.parse = function $$X$parserFSM$$$$parse$($container$$5$$, $object$$19$$, $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  this.$_data$ = $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$;
  var $p$$8$$ = $object$$19$$.$_points$, $_cras_values_stop_n$$9_numberOfVertices$$ = $object$$19$$.$_normals$;
  $object$$19$$.$_pointIndices$ = [];
  var $ind$$1_n2v_normal2$$1$$ = $object$$19$$.$_pointIndices$;
  $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$ = 0;
  var $_cras__cras_values_start__indices$$1_curChar$$;
  do {
    $_cras__cras_values_start__indices$$1_curChar$$ = $JSCompiler_StaticMethods_scan$$(this, "uchar"), $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$++
  }while(200 > $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$ && 10 != $_cras__cras_values_start__indices$$1_curChar$$);
  $JSCompiler_StaticMethods_scan$$(this, "uchar");
  $_cras_values_stop_n$$9_numberOfVertices$$ = $JSCompiler_StaticMethods_scan$$(this, "uint");
  $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$ = $JSCompiler_StaticMethods_scan$$(this, "uint");
  var $_vertices_n3v_normal3$$1$$ = $JSCompiler_StaticMethods_scan$$(this, "float", 3 * $_cras_values_stop_n$$9_numberOfVertices$$);
  $_cras__cras_values_start__indices$$1_curChar$$ = $JSCompiler_StaticMethods_scan$$(this, "uint", 3 * $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$);
  var $indexCounter$$ = new Uint32Array($_cras_values_stop_n$$9_numberOfVertices$$), $normals$$2$$ = new Float32Array(9 * $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$);
  $object$$19$$.$_points$ = $p$$8$$ = new $X$triplets$$(9 * $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$);
  $object$$19$$.$_normals$ = $_cras_values_stop_n$$9_numberOfVertices$$ = new $X$triplets$$(9 * $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$);
  var $t$$3$$;
  for($t$$3$$ = 0;$t$$3$$ < $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$;$t$$3$$++) {
    var $_index1_i$$120_normal1$$1$$ = 3 * $t$$3$$, $index1_v2z$$ = $_cras__cras_values_start__indices$$1_curChar$$[$_index1_i$$120_normal1$$1$$], $index2_n1_normal$$2_v2x$$ = $_cras__cras_values_start__indices$$1_curChar$$[$_index1_i$$120_normal1$$1$$ + 1], $index3_n2$$1_v2y$$ = $_cras__cras_values_start__indices$$1_curChar$$[$_index1_i$$120_normal1$$1$$ + 2];
    $ind$$1_n2v_normal2$$1$$.push($index1_v2z$$);
    $ind$$1_n2v_normal2$$1$$.push($index2_n1_normal$$2_v2x$$);
    $ind$$1_n2v_normal2$$1$$.push($index3_n2$$1_v2y$$);
    $indexCounter$$[$index1_v2z$$] += 1;
    $indexCounter$$[$index2_n1_normal$$2_v2x$$] += 1;
    $indexCounter$$[$index3_n2$$1_v2y$$] += 1;
    var $_index1_i$$120_normal1$$1$$ = 3 * $index1_v2z$$, $_index2$$ = 3 * $index2_n1_normal$$2_v2x$$, $_index3$$ = 3 * $index3_n2$$1_v2y$$, $v1v_v1x$$ = $_vertices_n3v_normal3$$1$$[$_index1_i$$120_normal1$$1$$], $v1y$$ = $_vertices_n3v_normal3$$1$$[$_index1_i$$120_normal1$$1$$ + 1], $v1z$$ = $_vertices_n3v_normal3$$1$$[$_index1_i$$120_normal1$$1$$ + 2], $index2_n1_normal$$2_v2x$$ = $_vertices_n3v_normal3$$1$$[$_index2$$], $index3_n2$$1_v2y$$ = $_vertices_n3v_normal3$$1$$[$_index2$$ + 1], $index1_v2z$$ = 
    $_vertices_n3v_normal3$$1$$[$_index2$$ + 2], $v3v_v3x$$ = $_vertices_n3v_normal3$$1$$[$_index3$$], $v3y$$ = $_vertices_n3v_normal3$$1$$[$_index3$$ + 1], $v3z$$ = $_vertices_n3v_normal3$$1$$[$_index3$$ + 2];
    $p$$8$$.add($v1v_v1x$$, $v1y$$, $v1z$$);
    $p$$8$$.add($index2_n1_normal$$2_v2x$$, $index3_n2$$1_v2y$$, $index1_v2z$$);
    $p$$8$$.add($v3v_v3x$$, $v3y$$, $v3z$$);
    $v1v_v1x$$ = new $goog$math$Vec3$$($v1v_v1x$$, $v1y$$, $v1z$$);
    $v3v_v3x$$ = new $goog$math$Vec3$$($v3v_v3x$$, $v3y$$, $v3z$$);
    $index2_n1_normal$$2_v2x$$ = (new $goog$math$Vec3$$($index2_n1_normal$$2_v2x$$, $index3_n2$$1_v2y$$, $index1_v2z$$)).$clone$().$subtract$($v1v_v1x$$);
    $index3_n2$$1_v2y$$ = $v3v_v3x$$.$clone$().$subtract$($v1v_v1x$$);
    $index2_n1_normal$$2_v2x$$ = $goog$math$Vec3$cross$$($index2_n1_normal$$2_v2x$$, $index3_n2$$1_v2y$$).normalize();
    $normals$$2$$[$_index1_i$$120_normal1$$1$$] += $index2_n1_normal$$2_v2x$$.x;
    $normals$$2$$[$_index1_i$$120_normal1$$1$$ + 1] += $index2_n1_normal$$2_v2x$$.y;
    $normals$$2$$[$_index1_i$$120_normal1$$1$$ + 2] += $index2_n1_normal$$2_v2x$$.$z$;
    $normals$$2$$[$_index2$$] += $index2_n1_normal$$2_v2x$$.x;
    $normals$$2$$[$_index2$$ + 1] += $index2_n1_normal$$2_v2x$$.y;
    $normals$$2$$[$_index2$$ + 2] += $index2_n1_normal$$2_v2x$$.$z$;
    $normals$$2$$[$_index3$$] += $index2_n1_normal$$2_v2x$$.x;
    $normals$$2$$[$_index3$$ + 1] += $index2_n1_normal$$2_v2x$$.y;
    $normals$$2$$[$_index3$$ + 2] += $index2_n1_normal$$2_v2x$$.$z$
  }
  for($t$$3$$ = 0;$t$$3$$ < $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$;$t$$3$$++) {
    $_index1_i$$120_normal1$$1$$ = 3 * $t$$3$$, $index1_v2z$$ = $_cras__cras_values_start__indices$$1_curChar$$[$_index1_i$$120_normal1$$1$$], $index2_n1_normal$$2_v2x$$ = $_cras__cras_values_start__indices$$1_curChar$$[$_index1_i$$120_normal1$$1$$ + 1], $index3_n2$$1_v2y$$ = $_cras__cras_values_start__indices$$1_curChar$$[$_index1_i$$120_normal1$$1$$ + 2], $_index1_i$$120_normal1$$1$$ = 3 * $index1_v2z$$, $_index2$$ = 3 * $index2_n1_normal$$2_v2x$$, $_index3$$ = 3 * $index3_n2$$1_v2y$$, $ind$$1_n2v_normal2$$1$$ = 
    new $goog$math$Vec3$$($normals$$2$$[$_index2$$], $normals$$2$$[$_index2$$ + 1], $normals$$2$$[$_index2$$ + 2]), $_vertices_n3v_normal3$$1$$ = new $goog$math$Vec3$$($normals$$2$$[$_index3$$], $normals$$2$$[$_index3$$ + 1], $normals$$2$$[$_index3$$ + 2]), $_index1_i$$120_normal1$$1$$ = (new $goog$math$Vec3$$($normals$$2$$[$_index1_i$$120_normal1$$1$$], $normals$$2$$[$_index1_i$$120_normal1$$1$$ + 1], $normals$$2$$[$_index1_i$$120_normal1$$1$$ + 2])).scale(1 / $indexCounter$$[$index1_v2z$$]).normalize(), 
    $ind$$1_n2v_normal2$$1$$ = $ind$$1_n2v_normal2$$1$$.scale(1 / $indexCounter$$[$index2_n1_normal$$2_v2x$$]).normalize(), $_vertices_n3v_normal3$$1$$ = $_vertices_n3v_normal3$$1$$.scale(1 / $indexCounter$$[$index3_n2$$1_v2y$$]).normalize(), $_cras_values_stop_n$$9_numberOfVertices$$.add($_index1_i$$120_normal1$$1$$.x, $_index1_i$$120_normal1$$1$$.y, $_index1_i$$120_normal1$$1$$.$z$), $_cras_values_stop_n$$9_numberOfVertices$$.add($ind$$1_n2v_normal2$$1$$.x, $ind$$1_n2v_normal2$$1$$.y, $ind$$1_n2v_normal2$$1$$.$z$), 
    $_cras_values_stop_n$$9_numberOfVertices$$.add($_vertices_n3v_normal3$$1$$.x, $_vertices_n3v_normal3$$1$$.y, $_vertices_n3v_normal3$$1$$.$z$)
  }
  $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", this.$_data$.byteLength - this.$_dataPointer$);
  $_cras__cras_values_start__indices$$1_curChar$$ = $JSCompiler_alias_NULL$$;
  for($_index1_i$$120_normal1$$1$$ = 0;$_index1_i$$120_normal1$$1$$ < $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$.length;$_index1_i$$120_normal1$$1$$++) {
    if(99 == $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$[$_index1_i$$120_normal1$$1$$] && 114 == $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$[$_index1_i$$120_normal1$$1$$ + 1] && 97 == $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$[$_index1_i$$120_normal1$$1$$ + 2] && 115 == $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$[$_index1_i$$120_normal1$$1$$ + 3]) {
      for($_cras_values_stop_n$$9_numberOfVertices$$ = $_cras__cras_values_start__indices$$1_curChar$$ = $_index1_i$$120_normal1$$1$$ + 9;10 != $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$[$_index1_i$$120_normal1$$1$$] && $_index1_i$$120_normal1$$1$$ < $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$.length;) {
        $_cras_values_stop_n$$9_numberOfVertices$$++, $_index1_i$$120_normal1$$1$$++
      }
      $_cras__cras_values_start__indices$$1_curChar$$ = $JSCompiler_StaticMethods_parseChars$$($_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$.subarray($_cras__cras_values_start__indices$$1_curChar$$, $_cras_values_stop_n$$9_numberOfVertices$$)).split(" ");
      break
    }
  }
  $_cras__cras_values_start__indices$$1_curChar$$ && ($object$$19$$.$_transform$.$translateX$(parseFloat($_cras__cras_values_start__indices$$1_curChar$$[0])), $object$$19$$.$_transform$.$translateY$(parseFloat($_cras__cras_values_start__indices$$1_curChar$$[1])), $object$$19$$.$_transform$.$translateZ$(parseFloat($_cras__cras_values_start__indices$$1_curChar$$[2])));
  $object$$19$$.$_type$ = $X$displayable$types$TRIANGLES$$;
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$ = new $X$event$ModifiedEvent$$;
  $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$.$_object$ = $object$$19$$;
  $_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$.$_container$ = $container$$5$$;
  this.dispatchEvent($_rest_of_file_data$$29_iters_modifiedEvent$$5_numberOfTriangles$$)
};
$goog$exportSymbol$$("X.parserFSM", $X$parserFSM$$);
$goog$exportSymbol$$("X.parserFSM.prototype.parse", $X$parserFSM$$.prototype.parse);
var $Zlib$CRC32$$ = {$calc$:function($data$$30$$, $pos$$1$$, $length$$18$$) {
  return $Zlib$CRC32$$.update($data$$30$$, 0, $pos$$1$$, $length$$18$$)
}, update:function($data$$31$$, $crc$$, $pos$$2$$, $il_length$$19$$) {
  var $table$$ = $Zlib$CRC32$$.$Table$, $i$$121$$ = "number" === typeof $pos$$2$$ ? $pos$$2$$ : $pos$$2$$ = 0;
  $il_length$$19$$ = "number" === typeof $il_length$$19$$ ? $il_length$$19$$ : $data$$31$$.length;
  $crc$$ ^= 4294967295;
  for($i$$121$$ = $il_length$$19$$ & 7;$i$$121$$--;++$pos$$2$$) {
    $crc$$ = $crc$$ >>> 8 ^ $table$$[($crc$$ ^ $data$$31$$[$pos$$2$$]) & 255]
  }
  for($i$$121$$ = $il_length$$19$$ >> 3;$i$$121$$--;$pos$$2$$ += 8) {
    $crc$$ = $crc$$ >>> 8 ^ $table$$[($crc$$ ^ $data$$31$$[$pos$$2$$]) & 255], $crc$$ = $crc$$ >>> 8 ^ $table$$[($crc$$ ^ $data$$31$$[$pos$$2$$ + 1]) & 255], $crc$$ = $crc$$ >>> 8 ^ $table$$[($crc$$ ^ $data$$31$$[$pos$$2$$ + 2]) & 255], $crc$$ = $crc$$ >>> 8 ^ $table$$[($crc$$ ^ $data$$31$$[$pos$$2$$ + 3]) & 255], $crc$$ = $crc$$ >>> 8 ^ $table$$[($crc$$ ^ $data$$31$$[$pos$$2$$ + 4]) & 255], $crc$$ = $crc$$ >>> 8 ^ $table$$[($crc$$ ^ $data$$31$$[$pos$$2$$ + 5]) & 255], $crc$$ = $crc$$ >>> 8 ^ $table$$[($crc$$ ^ 
    $data$$31$$[$pos$$2$$ + 6]) & 255], $crc$$ = $crc$$ >>> 8 ^ $table$$[($crc$$ ^ $data$$31$$[$pos$$2$$ + 7]) & 255]
  }
  return($crc$$ ^ 4294967295) >>> 0
}};
$Zlib$CRC32$$.$Table$ = new Uint32Array([0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 
901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 
4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 
3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 
2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 
2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918E3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 
755167117]);
function $Zlib$Huffman$buildHuffmanTable$$($lengths$$) {
  var $listSize$$ = $lengths$$.length, $maxCodeLength$$ = 0, $minCodeLength$$ = Number.POSITIVE_INFINITY, $size$$12$$, $table$$2$$, $bitLength$$, $code$$2$$, $skip$$, $reversed$$, $rtemp$$, $i$$122$$, $j$$9$$;
  for($i$$122$$ = 0;$i$$122$$ < $listSize$$;++$i$$122$$) {
    $lengths$$[$i$$122$$] > $maxCodeLength$$ && ($maxCodeLength$$ = $lengths$$[$i$$122$$]), $lengths$$[$i$$122$$] < $minCodeLength$$ && ($minCodeLength$$ = $lengths$$[$i$$122$$])
  }
  $size$$12$$ = 1 << $maxCodeLength$$;
  $table$$2$$ = new Uint32Array($size$$12$$);
  $bitLength$$ = 1;
  $code$$2$$ = 0;
  for($skip$$ = 2;$bitLength$$ <= $maxCodeLength$$;) {
    for($i$$122$$ = 0;$i$$122$$ < $listSize$$;++$i$$122$$) {
      if($lengths$$[$i$$122$$] === $bitLength$$) {
        $reversed$$ = 0;
        $rtemp$$ = $code$$2$$;
        for($j$$9$$ = 0;$j$$9$$ < $bitLength$$;++$j$$9$$) {
          $reversed$$ = $reversed$$ << 1 | $rtemp$$ & 1, $rtemp$$ >>= 1
        }
        for($j$$9$$ = $reversed$$;$j$$9$$ < $size$$12$$;$j$$9$$ += $skip$$) {
          $table$$2$$[$j$$9$$] = $bitLength$$ << 16 | $i$$122$$
        }
        ++$code$$2$$
      }
    }
    ++$bitLength$$;
    $code$$2$$ <<= 1;
    $skip$$ <<= 1
  }
  return[$table$$2$$, $maxCodeLength$$, $minCodeLength$$]
}
;function $Zlib$RawInflate$$($input$$, $opt_params$$) {
  this.$blocks$ = [];
  this.$bufferSize$ = 32768;
  this.$bitsbuflen$ = this.$bitsbuf$ = this.$ip$ = this.$totalpos$ = 0;
  this.input = new Uint8Array($input$$);
  this.$bfinal$ = $JSCompiler_alias_FALSE$$;
  this.$bufferType$ = $Zlib$RawInflate$BufferType$ADAPTIVE$$;
  this.$resize$ = $JSCompiler_alias_FALSE$$;
  if($opt_params$$ || !($opt_params$$ = {})) {
    $opt_params$$.index && (this.$ip$ = $opt_params$$.index), $opt_params$$.bufferSize && (this.$bufferSize$ = $opt_params$$.bufferSize), $opt_params$$.bufferType && (this.$bufferType$ = $opt_params$$.bufferType), $opt_params$$.resize && (this.$resize$ = $opt_params$$.resize)
  }
  switch(this.$bufferType$) {
    case $Zlib$RawInflate$BufferType$BLOCK$$:
      this.$op$ = 32768;
      this.$output$ = new Uint8Array(32768 + this.$bufferSize$ + 258);
      break;
    case $Zlib$RawInflate$BufferType$ADAPTIVE$$:
      this.$op$ = 0;
      this.$output$ = new Uint8Array(this.$bufferSize$);
      this.$expandBuffer$ = this.$expandBufferAdaptive$;
      this.$concatBuffer$ = this.$concatBufferDynamic$;
      this.$decodeHuffman$ = this.$decodeHuffmanAdaptive$;
      break;
    default:
      $JSCompiler_alias_THROW$$(Error("invalid inflate mode"))
  }
}
var $Zlib$RawInflate$BufferType$BLOCK$$ = 0, $Zlib$RawInflate$BufferType$ADAPTIVE$$ = 1;
$Zlib$RawInflate$$.prototype.$decompress$ = function $$Zlib$RawInflate$$$$$decompress$$() {
  for(;!this.$bfinal$;) {
    var $hdr$$inline_353_input$$inline_787$$ = $JSCompiler_StaticMethods_readBits$$(this, 3);
    $hdr$$inline_353_input$$inline_787$$ & 1 && (this.$bfinal$ = $JSCompiler_alias_TRUE$$);
    $hdr$$inline_353_input$$inline_787$$ >>>= 1;
    switch($hdr$$inline_353_input$$inline_787$$) {
      case 0:
        var $hdr$$inline_353_input$$inline_787$$ = this.input, $ip$$inline_788$$ = this.$ip$, $output$$inline_789$$ = this.$output$, $op$$inline_790$$ = this.$op$, $octet$$inline_791_preCopy$$inline_795$$ = $JSCompiler_alias_VOID$$, $len$$inline_792$$ = $JSCompiler_alias_VOID$$, $nlen$$inline_793$$ = $JSCompiler_alias_VOID$$, $olength$$inline_794$$ = $output$$inline_789$$.length, $octet$$inline_791_preCopy$$inline_795$$ = $JSCompiler_alias_VOID$$;
        this.$bitsbuflen$ = this.$bitsbuf$ = 0;
        $octet$$inline_791_preCopy$$inline_795$$ = $hdr$$inline_353_input$$inline_787$$[$ip$$inline_788$$++];
        $octet$$inline_791_preCopy$$inline_795$$ === $JSCompiler_alias_VOID$$ && $JSCompiler_alias_THROW$$(Error("invalid uncompressed block header: LEN (first byte)"));
        $len$$inline_792$$ = $octet$$inline_791_preCopy$$inline_795$$;
        $octet$$inline_791_preCopy$$inline_795$$ = $hdr$$inline_353_input$$inline_787$$[$ip$$inline_788$$++];
        $octet$$inline_791_preCopy$$inline_795$$ === $JSCompiler_alias_VOID$$ && $JSCompiler_alias_THROW$$(Error("invalid uncompressed block header: LEN (second byte)"));
        $len$$inline_792$$ |= $octet$$inline_791_preCopy$$inline_795$$ << 8;
        $octet$$inline_791_preCopy$$inline_795$$ = $hdr$$inline_353_input$$inline_787$$[$ip$$inline_788$$++];
        $octet$$inline_791_preCopy$$inline_795$$ === $JSCompiler_alias_VOID$$ && $JSCompiler_alias_THROW$$(Error("invalid uncompressed block header: NLEN (first byte)"));
        $nlen$$inline_793$$ = $octet$$inline_791_preCopy$$inline_795$$;
        $octet$$inline_791_preCopy$$inline_795$$ = $hdr$$inline_353_input$$inline_787$$[$ip$$inline_788$$++];
        $octet$$inline_791_preCopy$$inline_795$$ === $JSCompiler_alias_VOID$$ && $JSCompiler_alias_THROW$$(Error("invalid uncompressed block header: NLEN (second byte)"));
        $nlen$$inline_793$$ |= $octet$$inline_791_preCopy$$inline_795$$ << 8;
        $len$$inline_792$$ === ~$nlen$$inline_793$$ && $JSCompiler_alias_THROW$$(Error("invalid uncompressed block header: length verify"));
        $ip$$inline_788$$ + $len$$inline_792$$ > $hdr$$inline_353_input$$inline_787$$.length && $JSCompiler_alias_THROW$$(Error("input buffer is broken"));
        switch(this.$bufferType$) {
          case $Zlib$RawInflate$BufferType$BLOCK$$:
            for(;$op$$inline_790$$ + $len$$inline_792$$ > $output$$inline_789$$.length;) {
              $octet$$inline_791_preCopy$$inline_795$$ = $olength$$inline_794$$ - $op$$inline_790$$, $len$$inline_792$$ -= $octet$$inline_791_preCopy$$inline_795$$, $output$$inline_789$$.set($hdr$$inline_353_input$$inline_787$$.subarray($ip$$inline_788$$, $ip$$inline_788$$ + $octet$$inline_791_preCopy$$inline_795$$), $op$$inline_790$$), $op$$inline_790$$ += $octet$$inline_791_preCopy$$inline_795$$, $ip$$inline_788$$ += $octet$$inline_791_preCopy$$inline_795$$, this.$op$ = $op$$inline_790$$, $output$$inline_789$$ = 
              this.$expandBuffer$(), $op$$inline_790$$ = this.$op$
            }
            break;
          case $Zlib$RawInflate$BufferType$ADAPTIVE$$:
            for(;$op$$inline_790$$ + $len$$inline_792$$ > $output$$inline_789$$.length;) {
              $output$$inline_789$$ = this.$expandBuffer$({$fixRatio$:2})
            }
            break;
          default:
            $JSCompiler_alias_THROW$$(Error("invalid inflate mode"))
        }
        $output$$inline_789$$.set($hdr$$inline_353_input$$inline_787$$.subarray($ip$$inline_788$$, $ip$$inline_788$$ + $len$$inline_792$$), $op$$inline_790$$);
        $op$$inline_790$$ += $len$$inline_792$$;
        this.$ip$ = $ip$$inline_788$$ += $len$$inline_792$$;
        this.$op$ = $op$$inline_790$$;
        this.$output$ = $output$$inline_789$$;
        break;
      case 1:
        this.$decodeHuffman$($Zlib$RawInflate$FixedLiteralLengthTable$$, $Zlib$RawInflate$FixedDistanceTable$$);
        break;
      case 2:
        $JSCompiler_StaticMethods_parseDynamicHuffmanBlock$$(this);
        break;
      default:
        $JSCompiler_alias_THROW$$(Error("unknown BTYPE: " + $hdr$$inline_353_input$$inline_787$$))
    }
  }
  return this.$concatBuffer$()
};
var $Zlib$RawInflate$Order$$ = new Uint16Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), $Zlib$RawInflate$LengthCodeTable$$ = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 258, 258]), $Zlib$RawInflate$LengthExtraTable$$ = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0]), $Zlib$RawInflate$DistCodeTable$$ = new Uint16Array([1, 
2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577]), $Zlib$RawInflate$DistExtraTable$$ = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]), $lengths$$inline_355$$ = new Uint8Array(288), $i$$inline_356$$, $il$$inline_357$$;
$i$$inline_356$$ = 0;
for($il$$inline_357$$ = $lengths$$inline_355$$.length;$i$$inline_356$$ < $il$$inline_357$$;++$i$$inline_356$$) {
  $lengths$$inline_355$$[$i$$inline_356$$] = 143 >= $i$$inline_356$$ ? 8 : 255 >= $i$$inline_356$$ ? 9 : 279 >= $i$$inline_356$$ ? 7 : 8
}
var $Zlib$RawInflate$FixedLiteralLengthTable$$ = $Zlib$Huffman$buildHuffmanTable$$($lengths$$inline_355$$), $lengths$$inline_361$$ = new Uint8Array(30), $i$$inline_362$$, $il$$inline_363$$;
$i$$inline_362$$ = 0;
for($il$$inline_363$$ = $lengths$$inline_361$$.length;$i$$inline_362$$ < $il$$inline_363$$;++$i$$inline_362$$) {
  $lengths$$inline_361$$[$i$$inline_362$$] = 5
}
var $Zlib$RawInflate$FixedDistanceTable$$ = $Zlib$Huffman$buildHuffmanTable$$($lengths$$inline_361$$);
function $JSCompiler_StaticMethods_readBits$$($JSCompiler_StaticMethods_readBits$self$$, $length$$20$$) {
  for(var $bitsbuf$$ = $JSCompiler_StaticMethods_readBits$self$$.$bitsbuf$, $bitsbuflen$$ = $JSCompiler_StaticMethods_readBits$self$$.$bitsbuflen$, $input$$1$$ = $JSCompiler_StaticMethods_readBits$self$$.input, $ip$$ = $JSCompiler_StaticMethods_readBits$self$$.$ip$, $octet$$;$bitsbuflen$$ < $length$$20$$;) {
    $octet$$ = $input$$1$$[$ip$$++], $octet$$ === $JSCompiler_alias_VOID$$ && $JSCompiler_alias_THROW$$(Error("input buffer is broken")), $bitsbuf$$ |= $octet$$ << $bitsbuflen$$, $bitsbuflen$$ += 8
  }
  $octet$$ = $bitsbuf$$ & (1 << $length$$20$$) - 1;
  $JSCompiler_StaticMethods_readBits$self$$.$bitsbuf$ = $bitsbuf$$ >>> $length$$20$$;
  $JSCompiler_StaticMethods_readBits$self$$.$bitsbuflen$ = $bitsbuflen$$ - $length$$20$$;
  $JSCompiler_StaticMethods_readBits$self$$.$ip$ = $ip$$;
  return $octet$$
}
function $JSCompiler_StaticMethods_readCodeByTable$$($JSCompiler_StaticMethods_readCodeByTable$self$$, $table$$10$$) {
  for(var $bitsbuf$$1$$ = $JSCompiler_StaticMethods_readCodeByTable$self$$.$bitsbuf$, $bitsbuflen$$1$$ = $JSCompiler_StaticMethods_readCodeByTable$self$$.$bitsbuflen$, $codeWithLength_input$$2$$ = $JSCompiler_StaticMethods_readCodeByTable$self$$.input, $ip$$1$$ = $JSCompiler_StaticMethods_readCodeByTable$self$$.$ip$, $codeLength_codeTable$$ = $table$$10$$[0], $maxCodeLength$$1$$ = $table$$10$$[1], $octet$$1$$;$bitsbuflen$$1$$ < $maxCodeLength$$1$$;) {
    $octet$$1$$ = $codeWithLength_input$$2$$[$ip$$1$$++], $octet$$1$$ === $JSCompiler_alias_VOID$$ && $JSCompiler_alias_THROW$$(Error("input buffer is broken")), $bitsbuf$$1$$ |= $octet$$1$$ << $bitsbuflen$$1$$, $bitsbuflen$$1$$ += 8
  }
  $codeWithLength_input$$2$$ = $codeLength_codeTable$$[$bitsbuf$$1$$ & (1 << $maxCodeLength$$1$$) - 1];
  $codeLength_codeTable$$ = $codeWithLength_input$$2$$ >>> 16;
  $JSCompiler_StaticMethods_readCodeByTable$self$$.$bitsbuf$ = $bitsbuf$$1$$ >> $codeLength_codeTable$$;
  $JSCompiler_StaticMethods_readCodeByTable$self$$.$bitsbuflen$ = $bitsbuflen$$1$$ - $codeLength_codeTable$$;
  $JSCompiler_StaticMethods_readCodeByTable$self$$.$ip$ = $ip$$1$$;
  return $codeWithLength_input$$2$$ & 65535
}
function $JSCompiler_StaticMethods_parseDynamicHuffmanBlock$$($JSCompiler_StaticMethods_parseDynamicHuffmanBlock$self$$) {
  function $decode$$($num$$10$$, $table$$11$$, $lengths$$3$$) {
    var $code$$3_repeat$$, $prev$$, $i$$126$$;
    for($i$$126$$ = 0;$i$$126$$ < $num$$10$$;) {
      switch($code$$3_repeat$$ = $JSCompiler_StaticMethods_readCodeByTable$$(this, $table$$11$$), $code$$3_repeat$$) {
        case 16:
          for($code$$3_repeat$$ = 3 + $JSCompiler_StaticMethods_readBits$$(this, 2);$code$$3_repeat$$--;) {
            $lengths$$3$$[$i$$126$$++] = $prev$$
          }
          break;
        case 17:
          for($code$$3_repeat$$ = 3 + $JSCompiler_StaticMethods_readBits$$(this, 3);$code$$3_repeat$$--;) {
            $lengths$$3$$[$i$$126$$++] = 0
          }
          $prev$$ = 0;
          break;
        case 18:
          for($code$$3_repeat$$ = 11 + $JSCompiler_StaticMethods_readBits$$(this, 7);$code$$3_repeat$$--;) {
            $lengths$$3$$[$i$$126$$++] = 0
          }
          $prev$$ = 0;
          break;
        default:
          $prev$$ = $lengths$$3$$[$i$$126$$++] = $code$$3_repeat$$
      }
    }
    return $lengths$$3$$
  }
  var $hlit$$ = $JSCompiler_StaticMethods_readBits$$($JSCompiler_StaticMethods_parseDynamicHuffmanBlock$self$$, 5) + 257, $hdist$$ = $JSCompiler_StaticMethods_readBits$$($JSCompiler_StaticMethods_parseDynamicHuffmanBlock$self$$, 5) + 1, $codeLengthsTable_hclen$$ = $JSCompiler_StaticMethods_readBits$$($JSCompiler_StaticMethods_parseDynamicHuffmanBlock$self$$, 4) + 4, $codeLengths_litlenLengths$$ = new Uint8Array($Zlib$RawInflate$Order$$.length), $distLengths_i$$125$$;
  for($distLengths_i$$125$$ = 0;$distLengths_i$$125$$ < $codeLengthsTable_hclen$$;++$distLengths_i$$125$$) {
    $codeLengths_litlenLengths$$[$Zlib$RawInflate$Order$$[$distLengths_i$$125$$]] = $JSCompiler_StaticMethods_readBits$$($JSCompiler_StaticMethods_parseDynamicHuffmanBlock$self$$, 3)
  }
  $codeLengthsTable_hclen$$ = $Zlib$Huffman$buildHuffmanTable$$($codeLengths_litlenLengths$$);
  $codeLengths_litlenLengths$$ = new Uint8Array($hlit$$);
  $distLengths_i$$125$$ = new Uint8Array($hdist$$);
  $JSCompiler_StaticMethods_parseDynamicHuffmanBlock$self$$.$decodeHuffman$($Zlib$Huffman$buildHuffmanTable$$($decode$$.call($JSCompiler_StaticMethods_parseDynamicHuffmanBlock$self$$, $hlit$$, $codeLengthsTable_hclen$$, $codeLengths_litlenLengths$$)), $Zlib$Huffman$buildHuffmanTable$$($decode$$.call($JSCompiler_StaticMethods_parseDynamicHuffmanBlock$self$$, $hdist$$, $codeLengthsTable_hclen$$, $distLengths_i$$125$$)))
}
$JSCompiler_prototypeAlias$$ = $Zlib$RawInflate$$.prototype;
$JSCompiler_prototypeAlias$$.$decodeHuffman$ = function $$JSCompiler_prototypeAlias$$$$decodeHuffman$$($litlen$$, $dist$$) {
  var $output$$1$$ = this.$output$, $op$$1$$ = this.$op$;
  this.$currentLitlenTable$ = $litlen$$;
  for(var $olength$$1$$ = $output$$1$$.length - 258, $code$$4_ti$$1$$, $codeDist$$, $codeLength$$1$$;256 !== ($code$$4_ti$$1$$ = $JSCompiler_StaticMethods_readCodeByTable$$(this, $litlen$$));) {
    if(256 > $code$$4_ti$$1$$) {
      $op$$1$$ >= $olength$$1$$ && (this.$op$ = $op$$1$$, $output$$1$$ = this.$expandBuffer$(), $op$$1$$ = this.$op$), $output$$1$$[$op$$1$$++] = $code$$4_ti$$1$$
    }else {
      $code$$4_ti$$1$$ -= 257;
      $codeLength$$1$$ = $Zlib$RawInflate$LengthCodeTable$$[$code$$4_ti$$1$$];
      0 < $Zlib$RawInflate$LengthExtraTable$$[$code$$4_ti$$1$$] && ($codeLength$$1$$ += $JSCompiler_StaticMethods_readBits$$(this, $Zlib$RawInflate$LengthExtraTable$$[$code$$4_ti$$1$$]));
      $code$$4_ti$$1$$ = $JSCompiler_StaticMethods_readCodeByTable$$(this, $dist$$);
      $codeDist$$ = $Zlib$RawInflate$DistCodeTable$$[$code$$4_ti$$1$$];
      0 < $Zlib$RawInflate$DistExtraTable$$[$code$$4_ti$$1$$] && ($codeDist$$ += $JSCompiler_StaticMethods_readBits$$(this, $Zlib$RawInflate$DistExtraTable$$[$code$$4_ti$$1$$]));
      $op$$1$$ >= $olength$$1$$ && (this.$op$ = $op$$1$$, $output$$1$$ = this.$expandBuffer$(), $op$$1$$ = this.$op$);
      for(;$codeLength$$1$$--;) {
        $output$$1$$[$op$$1$$] = $output$$1$$[$op$$1$$++ - $codeDist$$]
      }
    }
  }
  for(;8 <= this.$bitsbuflen$;) {
    this.$bitsbuflen$ -= 8, this.$ip$--
  }
  this.$op$ = $op$$1$$
};
$JSCompiler_prototypeAlias$$.$decodeHuffmanAdaptive$ = function $$JSCompiler_prototypeAlias$$$$decodeHuffmanAdaptive$$($litlen$$1$$, $dist$$1$$) {
  var $output$$2$$ = this.$output$, $op$$2$$ = this.$op$;
  this.$currentLitlenTable$ = $litlen$$1$$;
  for(var $olength$$2$$ = $output$$2$$.length, $code$$5_ti$$2$$, $codeDist$$1$$, $codeLength$$2$$;256 !== ($code$$5_ti$$2$$ = $JSCompiler_StaticMethods_readCodeByTable$$(this, $litlen$$1$$));) {
    if(256 > $code$$5_ti$$2$$) {
      $op$$2$$ >= $olength$$2$$ && ($output$$2$$ = this.$expandBuffer$(), $olength$$2$$ = $output$$2$$.length), $output$$2$$[$op$$2$$++] = $code$$5_ti$$2$$
    }else {
      $code$$5_ti$$2$$ -= 257;
      $codeLength$$2$$ = $Zlib$RawInflate$LengthCodeTable$$[$code$$5_ti$$2$$];
      0 < $Zlib$RawInflate$LengthExtraTable$$[$code$$5_ti$$2$$] && ($codeLength$$2$$ += $JSCompiler_StaticMethods_readBits$$(this, $Zlib$RawInflate$LengthExtraTable$$[$code$$5_ti$$2$$]));
      $code$$5_ti$$2$$ = $JSCompiler_StaticMethods_readCodeByTable$$(this, $dist$$1$$);
      $codeDist$$1$$ = $Zlib$RawInflate$DistCodeTable$$[$code$$5_ti$$2$$];
      0 < $Zlib$RawInflate$DistExtraTable$$[$code$$5_ti$$2$$] && ($codeDist$$1$$ += $JSCompiler_StaticMethods_readBits$$(this, $Zlib$RawInflate$DistExtraTable$$[$code$$5_ti$$2$$]));
      $op$$2$$ + $codeLength$$2$$ > $olength$$2$$ && ($output$$2$$ = this.$expandBuffer$(), $olength$$2$$ = $output$$2$$.length);
      for(;$codeLength$$2$$--;) {
        $output$$2$$[$op$$2$$] = $output$$2$$[$op$$2$$++ - $codeDist$$1$$]
      }
    }
  }
  for(;8 <= this.$bitsbuflen$;) {
    this.$bitsbuflen$ -= 8, this.$ip$--
  }
  this.$op$ = $op$$2$$
};
$JSCompiler_prototypeAlias$$.$expandBuffer$ = function $$JSCompiler_prototypeAlias$$$$expandBuffer$$() {
  var $buffer$$8$$ = new Uint8Array(this.$op$ - 32768), $backward$$ = this.$op$ - 32768, $output$$3$$ = this.$output$;
  $buffer$$8$$.set($output$$3$$.subarray(32768, $buffer$$8$$.length));
  this.$blocks$.push($buffer$$8$$);
  this.$totalpos$ += $buffer$$8$$.length;
  $output$$3$$.set($output$$3$$.subarray($backward$$, $backward$$ + 32768));
  this.$op$ = 32768;
  return $output$$3$$
};
$JSCompiler_prototypeAlias$$.$expandBufferAdaptive$ = function $$JSCompiler_prototypeAlias$$$$expandBufferAdaptive$$($buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$) {
  var $ratio$$ = this.input.length / this.$ip$ + 1 | 0, $input$$4$$ = this.input, $output$$4$$ = this.$output$;
  $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$ && ("number" === typeof $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$.$fixRatio$ && ($ratio$$ = $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$.$fixRatio$), "number" === typeof $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$.$addRatio$ && ($ratio$$ += $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$.$addRatio$));
  2 > $ratio$$ ? ($buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$ = ($input$$4$$.length - this.$ip$) / this.$currentLitlenTable$[2], $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$ = 258 * ($buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$ / 2) | 0, $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$ = $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$ < $output$$4$$.length ? $output$$4$$.length + $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$ : 
  $output$$4$$.length << 1) : $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$ = $output$$4$$.length * $ratio$$;
  $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$ = new Uint8Array($buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$);
  $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$.set($output$$4$$);
  return this.$output$ = $buffer$$9_maxHuffCode_maxInflateSize_newSize_opt_param$$1$$
};
$JSCompiler_prototypeAlias$$.$concatBuffer$ = function $$JSCompiler_prototypeAlias$$$$concatBuffer$$() {
  var $pos$$3$$ = 0, $output$$5$$ = this.$output$, $blocks$$ = this.$blocks$, $block$$, $buffer$$10$$ = new Uint8Array(this.$totalpos$ + (this.$op$ - 32768)), $i$$128$$, $il$$5$$, $j$$10$$, $jl$$1$$;
  if(0 === $blocks$$.length) {
    return this.$output$.subarray(32768, this.$op$)
  }
  $i$$128$$ = 0;
  for($il$$5$$ = $blocks$$.length;$i$$128$$ < $il$$5$$;++$i$$128$$) {
    $block$$ = $blocks$$[$i$$128$$];
    $j$$10$$ = 0;
    for($jl$$1$$ = $block$$.length;$j$$10$$ < $jl$$1$$;++$j$$10$$) {
      $buffer$$10$$[$pos$$3$$++] = $block$$[$j$$10$$]
    }
  }
  $i$$128$$ = 32768;
  for($il$$5$$ = this.$op$;$i$$128$$ < $il$$5$$;++$i$$128$$) {
    $buffer$$10$$[$pos$$3$$++] = $output$$5$$[$i$$128$$]
  }
  this.$blocks$ = [];
  return this.buffer = $buffer$$10$$
};
$JSCompiler_prototypeAlias$$.$concatBufferDynamic$ = function $$JSCompiler_prototypeAlias$$$$concatBufferDynamic$$() {
  var $buffer$$11$$, $op$$3$$ = this.$op$;
  this.$resize$ ? ($buffer$$11$$ = new Uint8Array($op$$3$$), $buffer$$11$$.set(this.$output$.subarray(0, $op$$3$$))) : $buffer$$11$$ = this.$output$.subarray(0, $op$$3$$);
  return this.buffer = $buffer$$11$$
};
new Uint8Array(256);
var $i$$inline_372$$;
for($i$$inline_372$$ = 0;256 > $i$$inline_372$$;++$i$$inline_372$$) {
  for(var $n$$inline_799$$ = $i$$inline_372$$, $s$$inline_801$$ = 7, $n$$inline_799$$ = $n$$inline_799$$ >>> 1;$n$$inline_799$$;$n$$inline_799$$ >>>= 1) {
    --$s$$inline_801$$
  }
}
;var $table$$inline_377$$ = [], $i$$inline_378$$;
for($i$$inline_378$$ = 0;288 > $i$$inline_378$$;$i$$inline_378$$++) {
  switch($JSCompiler_alias_TRUE$$) {
    case 143 >= $i$$inline_378$$:
      $table$$inline_377$$.push([$i$$inline_378$$ + 48, 8]);
      break;
    case 255 >= $i$$inline_378$$:
      $table$$inline_377$$.push([$i$$inline_378$$ - 144 + 400, 9]);
      break;
    case 279 >= $i$$inline_378$$:
      $table$$inline_377$$.push([$i$$inline_378$$ - 256 + 0, 7]);
      break;
    case 287 >= $i$$inline_378$$:
      $table$$inline_377$$.push([$i$$inline_378$$ - 280 + 192, 8]);
      break;
    default:
      $JSCompiler_alias_THROW$$("invalid literal: " + $i$$inline_378$$)
  }
}
function $code$$inline_380$$() {
  var $length$$inline_384$$ = $i$$inline_382$$;
  switch($JSCompiler_alias_TRUE$$) {
    case 3 === $length$$inline_384$$:
      return[257, $length$$inline_384$$ - 3, 0];
    case 4 === $length$$inline_384$$:
      return[258, $length$$inline_384$$ - 4, 0];
    case 5 === $length$$inline_384$$:
      return[259, $length$$inline_384$$ - 5, 0];
    case 6 === $length$$inline_384$$:
      return[260, $length$$inline_384$$ - 6, 0];
    case 7 === $length$$inline_384$$:
      return[261, $length$$inline_384$$ - 7, 0];
    case 8 === $length$$inline_384$$:
      return[262, $length$$inline_384$$ - 8, 0];
    case 9 === $length$$inline_384$$:
      return[263, $length$$inline_384$$ - 9, 0];
    case 10 === $length$$inline_384$$:
      return[264, $length$$inline_384$$ - 10, 0];
    case 12 >= $length$$inline_384$$:
      return[265, $length$$inline_384$$ - 11, 1];
    case 14 >= $length$$inline_384$$:
      return[266, $length$$inline_384$$ - 13, 1];
    case 16 >= $length$$inline_384$$:
      return[267, $length$$inline_384$$ - 15, 1];
    case 18 >= $length$$inline_384$$:
      return[268, $length$$inline_384$$ - 17, 1];
    case 22 >= $length$$inline_384$$:
      return[269, $length$$inline_384$$ - 19, 2];
    case 26 >= $length$$inline_384$$:
      return[270, $length$$inline_384$$ - 23, 2];
    case 30 >= $length$$inline_384$$:
      return[271, $length$$inline_384$$ - 27, 2];
    case 34 >= $length$$inline_384$$:
      return[272, $length$$inline_384$$ - 31, 2];
    case 42 >= $length$$inline_384$$:
      return[273, $length$$inline_384$$ - 35, 3];
    case 50 >= $length$$inline_384$$:
      return[274, $length$$inline_384$$ - 43, 3];
    case 58 >= $length$$inline_384$$:
      return[275, $length$$inline_384$$ - 51, 3];
    case 66 >= $length$$inline_384$$:
      return[276, $length$$inline_384$$ - 59, 3];
    case 82 >= $length$$inline_384$$:
      return[277, $length$$inline_384$$ - 67, 4];
    case 98 >= $length$$inline_384$$:
      return[278, $length$$inline_384$$ - 83, 4];
    case 114 >= $length$$inline_384$$:
      return[279, $length$$inline_384$$ - 99, 4];
    case 130 >= $length$$inline_384$$:
      return[280, $length$$inline_384$$ - 115, 4];
    case 162 >= $length$$inline_384$$:
      return[281, $length$$inline_384$$ - 131, 5];
    case 194 >= $length$$inline_384$$:
      return[282, $length$$inline_384$$ - 163, 5];
    case 226 >= $length$$inline_384$$:
      return[283, $length$$inline_384$$ - 195, 5];
    case 257 >= $length$$inline_384$$:
      return[284, $length$$inline_384$$ - 227, 5];
    case 258 === $length$$inline_384$$:
      return[285, $length$$inline_384$$ - 258, 0];
    default:
      $JSCompiler_alias_THROW$$("invalid length: " + $length$$inline_384$$)
  }
}
var $table$$inline_381$$ = [], $i$$inline_382$$, $c$$inline_383$$;
for($i$$inline_382$$ = 3;258 >= $i$$inline_382$$;$i$$inline_382$$++) {
  $c$$inline_383$$ = $code$$inline_380$$(), $table$$inline_381$$[$i$$inline_382$$] = $c$$inline_383$$[2] << 24 | $c$$inline_383$$[1] << 16 | $c$$inline_383$$[0]
}
new Uint32Array($table$$inline_381$$);
function $Zlib$GunzipMember$$() {
}
;function $Zlib$Gunzip$$($input$$9$$) {
  this.input = $input$$9$$;
  this.$ip$ = 0;
  this.member = []
}
$Zlib$Gunzip$$.prototype.$decompress$ = function $$Zlib$Gunzip$$$$$decompress$$() {
  for(var $il$$15_member$$inline_403$$ = this.input.length;this.$ip$ < $il$$15_member$$inline_403$$;) {
    var $i$$inline_404_member$$inline_389$$ = new $Zlib$GunzipMember$$, $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ = $JSCompiler_alias_VOID$$, $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$ = $JSCompiler_alias_VOID$$, $buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$ = $JSCompiler_alias_VOID$$, $ci$$inline_395$$ = $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ = $buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$ = 
    $JSCompiler_alias_VOID$$, $str$$inline_396$$ = $JSCompiler_alias_VOID$$, $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ = $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ = $JSCompiler_alias_VOID$$, $il$$inline_405_input$$inline_399$$ = this.input, $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$ = this.$ip$;
    $i$$inline_404_member$$inline_389$$.$id1$ = $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++];
    $i$$inline_404_member$$inline_389$$.$id2$ = $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++];
    (31 !== $i$$inline_404_member$$inline_389$$.$id1$ || 139 !== $i$$inline_404_member$$inline_389$$.$id2$) && $JSCompiler_alias_THROW$$(Error("invalid file signature:", $i$$inline_404_member$$inline_389$$.$id1$, $i$$inline_404_member$$inline_389$$.$id2$));
    $i$$inline_404_member$$inline_389$$.$cm$ = $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++];
    switch($i$$inline_404_member$$inline_389$$.$cm$) {
      case 8:
        break;
      default:
        $JSCompiler_alias_THROW$$(Error("unknown compression method: " + $i$$inline_404_member$$inline_389$$.$cm$))
    }
    $i$$inline_404_member$$inline_389$$.$flg$ = $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++];
    $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ = $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] | $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] << 8 | $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] << 16 | $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] << 24;
    $i$$inline_404_member$$inline_389$$.$mtime$ = new Date(1E3 * $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$);
    $i$$inline_404_member$$inline_389$$.$xfl$ = $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++];
    $i$$inline_404_member$$inline_389$$.$os$ = $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++];
    0 < ($i$$inline_404_member$$inline_389$$.$flg$ & 4) && ($i$$inline_404_member$$inline_389$$.$xlen$ = $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] | $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] << 8, $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$ += $i$$inline_404_member$$inline_389$$.$xlen$);
    if(0 < ($i$$inline_404_member$$inline_389$$.$flg$ & 8)) {
      $str$$inline_396$$ = [];
      for($ci$$inline_395$$ = 0;0 < ($c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ = $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++]);) {
        $str$$inline_396$$[$ci$$inline_395$$++] = String.fromCharCode($c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$)
      }
      $i$$inline_404_member$$inline_389$$.name = $str$$inline_396$$.join("")
    }
    if(0 < ($i$$inline_404_member$$inline_389$$.$flg$ & 16)) {
      $str$$inline_396$$ = [];
      for($ci$$inline_395$$ = 0;0 < ($c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ = $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++]);) {
        $str$$inline_396$$[$ci$$inline_395$$++] = String.fromCharCode($c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$)
      }
      $i$$inline_404_member$$inline_389$$.comment = $str$$inline_396$$.join("")
    }
    0 < ($i$$inline_404_member$$inline_389$$.$flg$ & 2) && ($i$$inline_404_member$$inline_389$$.$crc16$ = $Zlib$CRC32$$.$calc$($il$$inline_405_input$$inline_399$$, 0, $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$) & 65535, $i$$inline_404_member$$inline_389$$.$crc16$ !== ($il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] | $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] << 8) && $JSCompiler_alias_THROW$$(Error("invalid header crc16")));
    $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ = $il$$inline_405_input$$inline_399$$[$il$$inline_405_input$$inline_399$$.length - 4] | $il$$inline_405_input$$inline_399$$[$il$$inline_405_input$$inline_399$$.length - 3] << 8 | $il$$inline_405_input$$inline_399$$[$il$$inline_405_input$$inline_399$$.length - 2] << 16 | $il$$inline_405_input$$inline_399$$[$il$$inline_405_input$$inline_399$$.length - 1] << 24;
    $il$$inline_405_input$$inline_399$$.length - $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$ - 4 - 4 < 512 * $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ && ($buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$ = $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$);
    $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$ = new $Zlib$RawInflate$$($il$$inline_405_input$$inline_399$$, {index:$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$, bufferSize:$buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$});
    $i$$inline_404_member$$inline_389$$.data = $buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$ = $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$.$decompress$();
    $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$ = $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$.$ip$;
    $i$$inline_404_member$$inline_389$$.$crc32$ = $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ = ($il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] | $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] << 8 | $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] << 16 | $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] << 
    24) >>> 0;
    $Zlib$CRC32$$.$calc$($buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$) !== $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ && $JSCompiler_alias_THROW$$(Error("invalid CRC-32 checksum: 0x" + $Zlib$CRC32$$.$calc$($buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$).toString(16) + " / 0x" + $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$.toString(16)));
    $i$$inline_404_member$$inline_389$$.$isize$ = $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ = ($il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] | $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] << 8 | $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] << 16 | $il$$inline_405_input$$inline_399$$[$ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$++] << 
    24) >>> 0;
    ($buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$.length & 4294967295) !== $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$ && $JSCompiler_alias_THROW$$(Error("invalid input size: " + ($buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$.length & 4294967295) + " / " + $c$$inline_394_crc32$$inline_398_isize$$inline_390_mtime$$inline_397$$));
    this.member.push($i$$inline_404_member$$inline_389$$);
    this.$ip$ = $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$
  }
  $il$$15_member$$inline_403$$ = this.member;
  $i$$inline_404_member$$inline_389$$ = $buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$ = $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$ = 0;
  for($il$$inline_405_input$$inline_399$$ = $il$$15_member$$inline_403$$.length;$i$$inline_404_member$$inline_389$$ < $il$$inline_405_input$$inline_399$$;++$i$$inline_404_member$$inline_389$$) {
    $buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$ += $il$$15_member$$inline_403$$[$i$$inline_404_member$$inline_389$$].data.length
  }
  $buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$ = new Uint8Array($buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$);
  for($i$$inline_404_member$$inline_389$$ = 0;$i$$inline_404_member$$inline_389$$ < $il$$inline_405_input$$inline_399$$;++$i$$inline_404_member$$inline_389$$) {
    $buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$.set($il$$15_member$$inline_403$$[$i$$inline_404_member$$inline_389$$].data, $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$), $ip$$inline_400_p$$inline_406_rawinflate$$inline_391$$ += $il$$15_member$$inline_403$$[$i$$inline_404_member$$inline_389$$].data.length
  }
  return $buffer$$inline_408_inflated$$inline_392_inflen$$inline_393_size$$inline_407$$
};
function $X$parserMGZ$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserMGZ";
  this.$_littleEndian$ = $JSCompiler_alias_FALSE$$
}
$goog$inherits$$($X$parserMGZ$$, $X$parser$$);
$X$parserMGZ$$.prototype.parse = function $$X$parserMGZ$$$$parse$($container$$6$$, $object$$20$$, $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, $MRI_flag$$9_modifiedEvent$$6$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  window.console.log($object$$20$$);
  $MRI_flag$$9_modifiedEvent$$6$$ && ($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$ = (new $Zlib$Gunzip$$(new Uint8Array($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$))).$decompress$(), $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$ = $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$.buffer);
  $MRI_flag$$9_modifiedEvent$$6$$ = this.$parseStream$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$);
  var $_dimensions_fcz$$ = [$MRI_flag$$9_modifiedEvent$$6$$.$ndim1$, $MRI_flag$$9_modifiedEvent$$6$$.$ndim2$, $MRI_flag$$9_modifiedEvent$$6$$.$ndim3$];
  $object$$20$$.$_dimensions$ = $_dimensions_fcz$$;
  var $_spacing_res$$8$$ = $MRI_flag$$9_modifiedEvent$$6$$.$v_voxelsize$;
  $object$$20$$.$_spacing$ = $_spacing_res$$8$$;
  $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$ = $MRI_flag$$9_modifiedEvent$$6$$.min;
  var $fcx_max$$2_res2$$1_tar$$1$$ = $MRI_flag$$9_modifiedEvent$$6$$.max;
  $object$$20$$.$_min$ = $object$$20$$.$_windowLow$ = $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$;
  $object$$20$$.$_max$ = $object$$20$$.$_windowHigh$ = $fcx_max$$2_res2$$1_tar$$1$$;
  -Infinity == $object$$20$$.$_lowerThreshold$ && ($object$$20$$.$_lowerThreshold$ = $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$);
  Infinity == $object$$20$$.$_upperThreshold$ && ($object$$20$$.$_upperThreshold$ = $fcx_max$$2_res2$$1_tar$$1$$);
  $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$ = $goog$vec$Mat4$createFloat32$$();
  if("false" == $object$$20$$.reslicing || $object$$20$$.reslicing == $JSCompiler_alias_FALSE$$) {
    $goog$vec$Mat4$setRowValues$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, 0, $object$$20$$.$_spacing$[0], 0, 0, 0), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, 1, 0, $object$$20$$.$_spacing$[1], 0, 0), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, 2, 0, 0, $object$$20$$.$_spacing$[2], 0), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, 3, 0, 0, 0, 1), $goog$vec$Mat4$setColumnValues$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, 
    0, 0, 0, 1)
  }else {
    $goog$vec$Mat4$setRowValues$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, 0, $MRI_flag$$9_modifiedEvent$$6$$.$M_ras$[0][0], $MRI_flag$$9_modifiedEvent$$6$$.$M_ras$[1][0], $MRI_flag$$9_modifiedEvent$$6$$.$M_ras$[2][0], 0);
    $goog$vec$Mat4$setRowValues$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, 1, $MRI_flag$$9_modifiedEvent$$6$$.$M_ras$[0][1], $MRI_flag$$9_modifiedEvent$$6$$.$M_ras$[1][1], $MRI_flag$$9_modifiedEvent$$6$$.$M_ras$[2][1], 0);
    $goog$vec$Mat4$setRowValues$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, 2, $MRI_flag$$9_modifiedEvent$$6$$.$M_ras$[0][2], $MRI_flag$$9_modifiedEvent$$6$$.$M_ras$[1][2], $MRI_flag$$9_modifiedEvent$$6$$.$M_ras$[2][2], 0);
    $goog$vec$Mat4$setRowValues$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, 3, 0, 0, 0, 1);
    for(var $fcx_max$$2_res2$$1_tar$$1$$ = $_dimensions_fcz$$[0] / 2, $fcy_tar2$$1$$ = $_dimensions_fcz$$[1] / 2, $_dimensions_fcz$$ = $_dimensions_fcz$$[2] / 2, $_origin$$1$$ = [0, 0, 0], $ui$$ = 0;3 > $ui$$;++$ui$$) {
      $_origin$$1$$[$ui$$] = $MRI_flag$$9_modifiedEvent$$6$$.$M_ras$[3][$ui$$] - ($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[$ui$$ + 0] * $_spacing_res$$8$$[0] * $fcx_max$$2_res2$$1_tar$$1$$ + $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[$ui$$ + 4] * $_spacing_res$$8$$[1] * $fcy_tar2$$1$$ + $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[$ui$$ + 8] * $_spacing_res$$8$$[2] * $_dimensions_fcz$$)
    }
    $goog$vec$Mat4$setColumnValues$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, $_origin$$1$$[0], $_origin$$1$$[1], $_origin$$1$$[2], 1)
  }
  $MRI_flag$$9_modifiedEvent$$6$$.$IJKToRAS$ = $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$;
  $MRI_flag$$9_modifiedEvent$$6$$.$RASToIJK$ = $goog$vec$Mat4$createFloat32$$();
  $goog$vec$Mat4$invert$$($MRI_flag$$9_modifiedEvent$$6$$.$IJKToRAS$, $MRI_flag$$9_modifiedEvent$$6$$.$RASToIJK$);
  $fcx_max$$2_res2$$1_tar$$1$$ = $goog$vec$Vec4$createFloat32FromValues$$(0, 0, 0, 1);
  $_spacing_res$$8$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, $fcx_max$$2_res2$$1_tar$$1$$, $_spacing_res$$8$$);
  $fcy_tar2$$1$$ = $goog$vec$Vec4$createFloat32FromValues$$(1, 1, 1, 1);
  $fcx_max$$2_res2$$1_tar$$1$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, $fcy_tar2$$1$$, $fcx_max$$2_res2$$1_tar$$1$$);
  $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$ = $X$parser$computeRASBBox$$($IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$, $object$$20$$.$_dimensions$);
  $MRI_flag$$9_modifiedEvent$$6$$.$RASSpacing$ = [$fcx_max$$2_res2$$1_tar$$1$$[0] - $_spacing_res$$8$$[0], $fcx_max$$2_res2$$1_tar$$1$$[1] - $_spacing_res$$8$$[1], $fcx_max$$2_res2$$1_tar$$1$$[2] - $_spacing_res$$8$$[2]];
  $MRI_flag$$9_modifiedEvent$$6$$.$RASDimensions$ = [$IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[1] - $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[0] + 1, $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[3] - $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[2] + 1, $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[5] - $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[4] + 1];
  $MRI_flag$$9_modifiedEvent$$6$$.$RASOrigin$ = [$IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[0], $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[2], $IJKToRAS$$2__data$$4__rasBB$$2_data$$35_min$$2$$[4]];
  $object$$20$$.$create_$($MRI_flag$$9_modifiedEvent$$6$$);
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $object$$20$$.$_image$ = $JSCompiler_StaticMethods_reslice$$(this, $object$$20$$);
  $MRI_flag$$9_modifiedEvent$$6$$ = new $X$event$ModifiedEvent$$;
  $MRI_flag$$9_modifiedEvent$$6$$.$_object$ = $object$$20$$;
  $MRI_flag$$9_modifiedEvent$$6$$.$_container$ = $container$$6$$;
  this.dispatchEvent($MRI_flag$$9_modifiedEvent$$6$$)
};
$X$parserMGZ$$.prototype.$parseStream$ = function $$X$parserMGZ$$$$$parseStream$$($MRI$$1_data$$36$$) {
  this.$_data$ = $MRI$$1_data$$36$$;
  $MRI$$1_data$$36$$ = {version:0, $Tr$:0, $Te$:0, $flipangle$:0, $Ti$:0, $ndim1$:0, $ndim2$:0, $ndim3$:0, $nframes$:0, type:0, $dof$:0, $rasgoodflag$:0, $MRIreader$:$JSCompiler_alias_NULL$$, $M_ras$:$JSCompiler_alias_NULL$$, $v_voxelsize$:$JSCompiler_alias_NULL$$, data:$JSCompiler_alias_NULL$$, min:Infinity, max:-Infinity};
  $MRI$$1_data$$36$$.version = $JSCompiler_StaticMethods_scan$$(this, "uint");
  $MRI$$1_data$$36$$.$ndim1$ = $JSCompiler_StaticMethods_scan$$(this, "uint");
  $MRI$$1_data$$36$$.$ndim2$ = $JSCompiler_StaticMethods_scan$$(this, "uint");
  $MRI$$1_data$$36$$.$ndim3$ = $JSCompiler_StaticMethods_scan$$(this, "uint");
  $MRI$$1_data$$36$$.$nframes$ = $JSCompiler_StaticMethods_scan$$(this, "uint");
  $MRI$$1_data$$36$$.type = $JSCompiler_StaticMethods_scan$$(this, "uint");
  $MRI$$1_data$$36$$.$dof$ = $JSCompiler_StaticMethods_scan$$(this, "uint");
  $MRI$$1_data$$36$$.$rasgoodflag$ = $JSCompiler_StaticMethods_scan$$(this, "ushort");
  if(0 < $MRI$$1_data$$36$$.$rasgoodflag$) {
    $MRI$$1_data$$36$$.$v_voxelsize$ = $JSCompiler_StaticMethods_scan$$(this, "float", 3);
    var $_ras_min_max$$1_volsize$$ = [];
    $_ras_min_max$$1_volsize$$.push($JSCompiler_StaticMethods_scan$$(this, "float", 3));
    $_ras_min_max$$1_volsize$$.push($JSCompiler_StaticMethods_scan$$(this, "float", 3));
    $_ras_min_max$$1_volsize$$.push($JSCompiler_StaticMethods_scan$$(this, "float", 3));
    $_ras_min_max$$1_volsize$$.push($JSCompiler_StaticMethods_scan$$(this, "float", 3));
    $MRI$$1_data$$36$$.$M_ras$ = $_ras_min_max$$1_volsize$$
  }
  this.$_dataPointer$ = 284;
  $_ras_min_max$$1_volsize$$ = $MRI$$1_data$$36$$.$ndim1$ * $MRI$$1_data$$36$$.$ndim2$ * $MRI$$1_data$$36$$.$ndim3$;
  switch($MRI$$1_data$$36$$.type) {
    case 0:
      $MRI$$1_data$$36$$.data = $JSCompiler_StaticMethods_scan$$(this, "uchar", $_ras_min_max$$1_volsize$$);
      break;
    case 1:
      $MRI$$1_data$$36$$.data = $JSCompiler_StaticMethods_scan$$(this, "uint", $_ras_min_max$$1_volsize$$);
      break;
    case 3:
      $MRI$$1_data$$36$$.data = $JSCompiler_StaticMethods_scan$$(this, "float", $_ras_min_max$$1_volsize$$);
      break;
    case 4:
      $MRI$$1_data$$36$$.data = $JSCompiler_StaticMethods_scan$$(this, "ushort", $_ras_min_max$$1_volsize$$);
      break;
    default:
      $JSCompiler_alias_THROW$$(Error("Unsupported MGH/MGZ data type: " + $MRI$$1_data$$36$$.type))
  }
  $_ras_min_max$$1_volsize$$ = $JSCompiler_StaticMethods_arrayMinMax$$($MRI$$1_data$$36$$.data);
  $MRI$$1_data$$36$$.min = $_ras_min_max$$1_volsize$$[0];
  $MRI$$1_data$$36$$.max = $_ras_min_max$$1_volsize$$[1];
  this.$_dataPointer$ + 16 < this.$_data$.byteLength && ($MRI$$1_data$$36$$.$Tr$ = $JSCompiler_StaticMethods_scan$$(this, "float"), $MRI$$1_data$$36$$.$flipangle$ = $JSCompiler_StaticMethods_scan$$(this, "float"), $MRI$$1_data$$36$$.$Te$ = $JSCompiler_StaticMethods_scan$$(this, "float"), $MRI$$1_data$$36$$.$Ti$ = $JSCompiler_StaticMethods_scan$$(this, "float"));
  return $MRI$$1_data$$36$$
};
$goog$exportSymbol$$("X.parserMGZ", $X$parserMGZ$$);
$goog$exportSymbol$$("X.parserMGZ.prototype.parse", $X$parserMGZ$$.prototype.parse);
function $X$parserCRV$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserCRV";
  this.$_littleEndian$ = $JSCompiler_alias_FALSE$$
}
$goog$inherits$$($X$parserCRV$$, $X$parser$$);
$X$parserCRV$$.prototype.parse = function $$X$parserCRV$$$$parse$($container$$7$$, $object$$21$$, $data$$37_minCurv$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  var $ind$$2_modifiedEvent$$7$$ = $object$$21$$.$_pointIndices$;
  0 == $ind$$2_modifiedEvent$$7$$.length && $JSCompiler_alias_THROW$$(Error("No _pointIndices defined on the X.object."));
  this.$_data$ = $data$$37_minCurv$$;
  this.$_dataPointer$ = 3;
  var $numVertices_numberOfIndices$$1$$ = $JSCompiler_StaticMethods_scan$$(this, "uint");
  $JSCompiler_StaticMethods_scan$$(this, "uint");
  $JSCompiler_StaticMethods_scan$$(this, "uint");
  var $numPosValues_orderedCurvatures$$ = 0, $currentScalar$$1_numNegValues$$ = 0, $_i$$5_negSum$$ = 0, $posSum$$ = 0, $posMean$$ = 0, $negMean$$ = 0, $posStdDev$$ = 0, $negStdDev$$ = 0, $sum$$1$$ = 0, $mean$$1$$ = 0, $i$$145_numValues$$ = 0;
  $data$$37_minCurv$$ = Array(2);
  var $maxCurv$$ = Array(2), $vertexCurvatures$$ = $JSCompiler_StaticMethods_scan$$(this, "float", $numVertices_numberOfIndices$$1$$), $diffSq_k$$2$$;
  for($diffSq_k$$2$$ = 0;$diffSq_k$$2$$ < $numVertices_numberOfIndices$$1$$;$diffSq_k$$2$$++) {
    var $curv$$ = $vertexCurvatures$$[$diffSq_k$$2$$];
    0 == $diffSq_k$$2$$ && ($data$$37_minCurv$$[0] = $maxCurv$$[0] = $curv$$);
    0 <= $curv$$ ? ($numPosValues_orderedCurvatures$$++, $posSum$$ += $curv$$) : ($currentScalar$$1_numNegValues$$++, $_i$$5_negSum$$ += $curv$$);
    $sum$$1$$ += $curv$$;
    $i$$145_numValues$$++;
    $maxCurv$$[0] = Math.max($curv$$, $maxCurv$$[0]);
    $data$$37_minCurv$$[0] = Math.min($curv$$, $data$$37_minCurv$$[0]);
    $vertexCurvatures$$[$diffSq_k$$2$$] = $curv$$
  }
  0 != $numPosValues_orderedCurvatures$$ && ($posMean$$ = $posSum$$ / $numPosValues_orderedCurvatures$$);
  0 != $currentScalar$$1_numNegValues$$ && ($negMean$$ = $_i$$5_negSum$$ / $currentScalar$$1_numNegValues$$);
  0 != $i$$145_numValues$$ && ($mean$$1$$ = $sum$$1$$ / $i$$145_numValues$$);
  for($i$$145_numValues$$ = $sum$$1$$ = $_i$$5_negSum$$ = $posSum$$ = 0;$i$$145_numValues$$ < $numVertices_numberOfIndices$$1$$;$i$$145_numValues$$++) {
    $curv$$ = $vertexCurvatures$$[$i$$145_numValues$$], $diffSq_k$$2$$ = 0, 0 <= $curv$$ ? ($diffSq_k$$2$$ = Math.pow($curv$$ - $posMean$$, 2), $posSum$$ += $diffSq_k$$2$$) : ($diffSq_k$$2$$ = Math.pow($curv$$ - $negMean$$, 2), $_i$$5_negSum$$ += $diffSq_k$$2$$), $diffSq_k$$2$$ = Math.pow($curv$$ - $mean$$1$$, 2), $sum$$1$$ += $diffSq_k$$2$$
  }
  1 < $numPosValues_orderedCurvatures$$ && ($posStdDev$$ = Math.sqrt($posSum$$ / ($numPosValues_orderedCurvatures$$ - 1)));
  1 < $currentScalar$$1_numNegValues$$ && ($negStdDev$$ = Math.sqrt($_i$$5_negSum$$ / ($currentScalar$$1_numNegValues$$ - 1)));
  $data$$37_minCurv$$[1] = $negMean$$ - 2.5 * $negStdDev$$;
  $maxCurv$$[1] = $posMean$$ + 2.5 * $posStdDev$$;
  $numVertices_numberOfIndices$$1$$ = $ind$$2_modifiedEvent$$7$$.length;
  $numPosValues_orderedCurvatures$$ = new Float32Array(3 * $numVertices_numberOfIndices$$1$$);
  for($i$$145_numValues$$ = 0;$i$$145_numValues$$ < $numVertices_numberOfIndices$$1$$;$i$$145_numValues$$++) {
    $currentScalar$$1_numNegValues$$ = $vertexCurvatures$$[$ind$$2_modifiedEvent$$7$$[$i$$145_numValues$$]], $_i$$5_negSum$$ = 3 * $i$$145_numValues$$, $numPosValues_orderedCurvatures$$[$_i$$5_negSum$$] = $currentScalar$$1_numNegValues$$, $numPosValues_orderedCurvatures$$[$_i$$5_negSum$$ + 1] = $currentScalar$$1_numNegValues$$, $numPosValues_orderedCurvatures$$[$_i$$5_negSum$$ + 2] = $currentScalar$$1_numNegValues$$
  }
  $object$$21$$.$_scalars$.$_min$ = $data$$37_minCurv$$[1];
  $object$$21$$.$_scalars$.$_max$ = $maxCurv$$[1];
  -Infinity == $object$$21$$.$_scalars$.$_lowerThreshold$ && ($object$$21$$.$_scalars$.$_lowerThreshold$ = $data$$37_minCurv$$[1]);
  Infinity == $object$$21$$.$_scalars$.$_upperThreshold$ && ($object$$21$$.$_scalars$.$_upperThreshold$ = $maxCurv$$[1]);
  $object$$21$$.$_scalars$.$_array$ = $vertexCurvatures$$;
  $object$$21$$.$_scalars$.$_glArray$ = $numPosValues_orderedCurvatures$$;
  $object$$21$$.$_scalars$.$_dirty$ = $JSCompiler_alias_TRUE$$;
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $ind$$2_modifiedEvent$$7$$ = new $X$event$ModifiedEvent$$;
  $ind$$2_modifiedEvent$$7$$.$_object$ = $object$$21$$;
  $ind$$2_modifiedEvent$$7$$.$_container$ = $container$$7$$;
  this.dispatchEvent($ind$$2_modifiedEvent$$7$$)
};
$goog$exportSymbol$$("X.parserCRV", $X$parserCRV$$);
$goog$exportSymbol$$("X.parserCRV.prototype.parse", $X$parserCRV$$.prototype.parse);
function $Zlib$Inflate$$($input$$13$$, $opt_params$$6$$) {
  var $cmf$$1$$, $flg$$2$$;
  this.input = $input$$13$$;
  this.$ip$ = 0;
  if($opt_params$$6$$ || !($opt_params$$6$$ = {})) {
    $opt_params$$6$$.index && (this.$ip$ = $opt_params$$6$$.index), $opt_params$$6$$.verify && (this.$verify$ = $opt_params$$6$$.verify)
  }
  $cmf$$1$$ = $input$$13$$[this.$ip$++];
  $flg$$2$$ = $input$$13$$[this.$ip$++];
  switch($cmf$$1$$ & 15) {
    case 8:
      this.method = 8;
      break;
    default:
      $JSCompiler_alias_THROW$$(Error("unsupported compression method"))
  }
  0 !== (($cmf$$1$$ << 8) + $flg$$2$$) % 31 && $JSCompiler_alias_THROW$$(Error("invalid fcheck flag:" + (($cmf$$1$$ << 8) + $flg$$2$$) % 31));
  $flg$$2$$ & 32 && $JSCompiler_alias_THROW$$(Error("fdict flag is not supported"));
  this.$rawinflate$ = new $Zlib$RawInflate$$($input$$13$$, {index:this.$ip$, bufferSize:$opt_params$$6$$.bufferSize, bufferType:$opt_params$$6$$.bufferType, resize:$opt_params$$6$$.resize})
}
$Zlib$Inflate$$.prototype.$decompress$ = function $$Zlib$Inflate$$$$$decompress$$() {
  var $adler32_input$$14$$ = this.input, $buffer$$17$$;
  $buffer$$17$$ = this.$rawinflate$.$decompress$();
  this.$ip$ = this.$rawinflate$.$ip$;
  if(this.$verify$) {
    var $adler32_input$$14$$ = ($adler32_input$$14$$[this.$ip$++] << 24 | $adler32_input$$14$$[this.$ip$++] << 16 | $adler32_input$$14$$[this.$ip$++] << 8 | $adler32_input$$14$$[this.$ip$++]) >>> 0, $array$$inline_416_tmp$$inline_804$$ = $buffer$$17$$;
    if("string" === typeof $array$$inline_416_tmp$$inline_804$$) {
      var $array$$inline_416_tmp$$inline_804$$ = $array$$inline_416_tmp$$inline_804$$.split(""), $i$$inline_805_s1$$inline_809$$, $l$$inline_806_s2$$inline_810$$;
      $i$$inline_805_s1$$inline_809$$ = 0;
      for($l$$inline_806_s2$$inline_810$$ = $array$$inline_416_tmp$$inline_804$$.length;$i$$inline_805_s1$$inline_809$$ < $l$$inline_806_s2$$inline_810$$;$i$$inline_805_s1$$inline_809$$++) {
        $array$$inline_416_tmp$$inline_804$$[$i$$inline_805_s1$$inline_809$$] = ($array$$inline_416_tmp$$inline_804$$[$i$$inline_805_s1$$inline_809$$].charCodeAt(0) & 255) >>> 0
      }
    }
    $i$$inline_805_s1$$inline_809$$ = 1;
    $l$$inline_806_s2$$inline_810$$ = 0;
    for(var $len$$inline_811$$ = $array$$inline_416_tmp$$inline_804$$.length, $tlen$$inline_812$$, $i$$inline_813$$ = 0;0 < $len$$inline_811$$;) {
      $tlen$$inline_812$$ = 1024 < $len$$inline_811$$ ? 1024 : $len$$inline_811$$;
      $len$$inline_811$$ -= $tlen$$inline_812$$;
      do {
        $i$$inline_805_s1$$inline_809$$ += $array$$inline_416_tmp$$inline_804$$[$i$$inline_813$$++], $l$$inline_806_s2$$inline_810$$ += $i$$inline_805_s1$$inline_809$$
      }while(--$tlen$$inline_812$$);
      $i$$inline_805_s1$$inline_809$$ %= 65521;
      $l$$inline_806_s2$$inline_810$$ %= 65521
    }
    $adler32_input$$14$$ !== ($l$$inline_806_s2$$inline_810$$ << 16 | $i$$inline_805_s1$$inline_809$$) >>> 0 && $JSCompiler_alias_THROW$$(Error("invalid adler-32 checksum"))
  }
  return $buffer$$17$$
};
function $X$parserRAW$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserRAW"
}
$goog$inherits$$($X$parserRAW$$, $X$parser$$);
$X$parserRAW$$.prototype.parse = function $$X$parserRAW$$$$parse$($container$$8$$, $object$$22$$, $_data$$5_data$$38_min$$3_res$$9$$, $MRI$$2_flag$$11_modifiedEvent$$8$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  $MRI$$2_flag$$11_modifiedEvent$$8$$ && ($_data$$5_data$$38_min$$3_res$$9$$ = (new $Zlib$Inflate$$(new Uint8Array($_data$$5_data$$38_min$$3_res$$9$$))).$decompress$(), $_data$$5_data$$38_min$$3_res$$9$$ = $_data$$5_data$$38_min$$3_res$$9$$.buffer);
  $MRI$$2_flag$$11_modifiedEvent$$8$$ = {};
  $MRI$$2_flag$$11_modifiedEvent$$8$$.data = new Uint8Array($_data$$5_data$$38_min$$3_res$$9$$);
  var $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$ = $JSCompiler_StaticMethods_arrayMinMax$$($MRI$$2_flag$$11_modifiedEvent$$8$$.data);
  $_data$$5_data$$38_min$$3_res$$9$$ = $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$[0];
  $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$ = $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$[1];
  $MRI$$2_flag$$11_modifiedEvent$$8$$.min = $object$$22$$.$_min$ = $object$$22$$.$_windowLow$ = $_data$$5_data$$38_min$$3_res$$9$$;
  $MRI$$2_flag$$11_modifiedEvent$$8$$.max = $object$$22$$.$_max$ = $object$$22$$.$_windowHigh$ = $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$;
  -Infinity == $object$$22$$.$_lowerThreshold$ && ($object$$22$$.$_lowerThreshold$ = $_data$$5_data$$38_min$$3_res$$9$$);
  Infinity == $object$$22$$.$_upperThreshold$ && ($object$$22$$.$_upperThreshold$ = $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$);
  $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$ = $goog$vec$Mat4$createFloat32Identity$$();
  $MRI$$2_flag$$11_modifiedEvent$$8$$.$IJKToRAS$ = $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$;
  $MRI$$2_flag$$11_modifiedEvent$$8$$.$RASToIJK$ = $goog$vec$Mat4$createFloat32Identity$$();
  var $res2$$2_tar$$2$$ = $goog$vec$Vec4$createFloat32FromValues$$(0, 0, 0, 1);
  $_data$$5_data$$38_min$$3_res$$9$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$, $res2$$2_tar$$2$$, $_data$$5_data$$38_min$$3_res$$9$$);
  var $tar2$$2$$ = $goog$vec$Vec4$createFloat32FromValues$$(1, 1, 1, 1), $res2$$2_tar$$2$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$, $tar2$$2$$, $res2$$2_tar$$2$$);
  $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$ = $X$parser$computeRASBBox$$($IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$, $object$$22$$.$_dimensions$);
  $MRI$$2_flag$$11_modifiedEvent$$8$$.$RASSpacing$ = [$res2$$2_tar$$2$$[0] - $_data$$5_data$$38_min$$3_res$$9$$[0], $res2$$2_tar$$2$$[1] - $_data$$5_data$$38_min$$3_res$$9$$[1], $res2$$2_tar$$2$$[2] - $_data$$5_data$$38_min$$3_res$$9$$[2]];
  $MRI$$2_flag$$11_modifiedEvent$$8$$.$RASDimensions$ = [$IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$[1] - $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$[0] + 1, $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$[3] - $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$[2] + 1, $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$[5] - $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$[4] + 1];
  $MRI$$2_flag$$11_modifiedEvent$$8$$.$RASOrigin$ = [$IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$[0], $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$[2], $IJKToRAS$$3__rasBB$$3_max$$3_min_max$$2$$[4]];
  $object$$22$$.$create_$($MRI$$2_flag$$11_modifiedEvent$$8$$);
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $object$$22$$.$_image$ = $JSCompiler_StaticMethods_reslice$$(this, $object$$22$$);
  $MRI$$2_flag$$11_modifiedEvent$$8$$ = new $X$event$ModifiedEvent$$;
  $MRI$$2_flag$$11_modifiedEvent$$8$$.$_object$ = $object$$22$$;
  $MRI$$2_flag$$11_modifiedEvent$$8$$.$_container$ = $container$$8$$;
  this.dispatchEvent($MRI$$2_flag$$11_modifiedEvent$$8$$)
};
$goog$exportSymbol$$("X.parserRAW", $X$parserRAW$$);
$goog$exportSymbol$$("X.parserRAW.prototype.parse", $X$parserRAW$$.prototype.parse);
function $X$parserIMAGE$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserIMAGE"
}
$goog$inherits$$($X$parserIMAGE$$, $X$parser$$);
$X$parserIMAGE$$.prototype.parse = function $$X$parserIMAGE$$$$parse$($container$$9$$, $object$$23$$, $data$$39$$, $flag$$12$$) {
  $data$$39$$ instanceof ArrayBuffer || $JSCompiler_alias_THROW$$(Error());
  for(var $bytebuffer_encodedData$$1$$ = new Uint8Array($data$$39$$), $_image$$1_i$$150$$ = $bytebuffer_encodedData$$1$$.length, $binaryString$$ = Array($_image$$1_i$$150$$);$_image$$1_i$$150$$--;) {
    $binaryString$$[$_image$$1_i$$150$$] = String.fromCharCode($bytebuffer_encodedData$$1$$[$_image$$1_i$$150$$])
  }
  $bytebuffer_encodedData$$1$$ = window.btoa($binaryString$$.join(""));
  $_image$$1_i$$150$$ = new Image;
  $goog$events$listenOnce$$($_image$$1_i$$150$$, "load", this.$parseCompleted$.bind(this, $_image$$1_i$$150$$, $container$$9$$, $object$$23$$, $data$$39$$, $flag$$12$$));
  $_image$$1_i$$150$$.src = "data:image/" + $flag$$12$$ + ";base64," + $bytebuffer_encodedData$$1$$
};
$X$parserIMAGE$$.prototype.$parseCompleted$ = function $$X$parserIMAGE$$$$$parseCompleted$$($image$$2_modifiedEvent$$9$$, $container$$10$$, $object$$24$$) {
  $container$$10$$.$_image$ = $image$$2_modifiedEvent$$9$$;
  $container$$10$$.$_rawData$ = $JSCompiler_alias_NULL$$;
  $image$$2_modifiedEvent$$9$$ = new $X$event$ModifiedEvent$$;
  $image$$2_modifiedEvent$$9$$.$_object$ = $object$$24$$;
  $image$$2_modifiedEvent$$9$$.$_container$ = $container$$10$$;
  this.dispatchEvent($image$$2_modifiedEvent$$9$$)
};
$goog$exportSymbol$$("X.parserIMAGE", $X$parserIMAGE$$);
$goog$exportSymbol$$("X.parserIMAGE.prototype.parse", $X$parserIMAGE$$.prototype.parse);
function $X$parserLUT$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserLUT"
}
$goog$inherits$$($X$parserLUT$$, $X$parser$$);
$X$parserLUT$$.prototype.parse = function $$X$parserLUT$$$$parse$($container$$11$$, $object$$25$$, $_bytes$$4_data$$41_modifiedEvent$$10$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  this.$_data$ = $_bytes$$4_data$$41_modifiedEvent$$10$$;
  $_bytes$$4_data$$41_modifiedEvent$$10$$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", $_bytes$$4_data$$41_modifiedEvent$$10$$.byteLength);
  var $_length$$2$$ = $_bytes$$4_data$$41_modifiedEvent$$10$$.length, $_rangeStart$$1$$ = 0, $i$$151$$;
  for($i$$151$$ = 0;$i$$151$$ < $_length$$2$$;$i$$151$$++) {
    if(10 == $_bytes$$4_data$$41_modifiedEvent$$10$$[$i$$151$$]) {
      var $line$$3_lineFields$$1$$ = $JSCompiler_StaticMethods_parseChars$$($_bytes$$4_data$$41_modifiedEvent$$10$$, $_rangeStart$$1$$, $i$$151$$), $_rangeStart$$1$$ = $i$$151$$ + 1, $line$$3_lineFields$$1$$ = $line$$3_lineFields$$1$$.replace(/^\s+|\s+$/g, "");
      "#" != $line$$3_lineFields$$1$$[0] && ($line$$3_lineFields$$1$$ = $line$$3_lineFields$$1$$.split(" "), $line$$3_lineFields$$1$$ = $line$$3_lineFields$$1$$.filter(function($v$$11$$) {
        return"" != $v$$11$$
      }), 6 == $line$$3_lineFields$$1$$.length && ($line$$3_lineFields$$1$$[2] = parseInt($line$$3_lineFields$$1$$[2], 10) / 255, $line$$3_lineFields$$1$$[3] = parseInt($line$$3_lineFields$$1$$[3], 10) / 255, $line$$3_lineFields$$1$$[4] = parseInt($line$$3_lineFields$$1$$[4], 10) / 255, $line$$3_lineFields$$1$$[5] = parseInt($line$$3_lineFields$$1$$[5], 10) / 255, $container$$11$$.add(parseInt($line$$3_lineFields$$1$$[0], 10), $line$$3_lineFields$$1$$[1], $line$$3_lineFields$$1$$[2], $line$$3_lineFields$$1$$[3], 
      $line$$3_lineFields$$1$$[4], $line$$3_lineFields$$1$$[5], 10)))
    }
  }
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $_bytes$$4_data$$41_modifiedEvent$$10$$ = new $X$event$ModifiedEvent$$;
  $_bytes$$4_data$$41_modifiedEvent$$10$$.$_object$ = $object$$25$$;
  $_bytes$$4_data$$41_modifiedEvent$$10$$.$_container$ = $container$$11$$;
  this.dispatchEvent($_bytes$$4_data$$41_modifiedEvent$$10$$)
};
$goog$exportSymbol$$("X.parserLUT", $X$parserLUT$$);
$goog$exportSymbol$$("X.parserLUT.prototype.parse", $X$parserLUT$$.prototype.parse);
function $X$parserMRC$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserMRC"
}
$goog$inherits$$($X$parserMRC$$, $X$parser$$);
$X$parserMRC$$.prototype.parse = function $$X$parserMRC$$$$parse$($container$$12$$, $object$$26$$, $MRI$$3_data$$42_modifiedEvent$$11$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  $MRI$$3_data$$42_modifiedEvent$$11$$ = this.$parseStream$($MRI$$3_data$$42_modifiedEvent$$11$$);
  var $min$$4_res$$10$$ = $MRI$$3_data$$42_modifiedEvent$$11$$.min, $IJKToRAS$$4__rasBB$$4_max$$4$$ = $MRI$$3_data$$42_modifiedEvent$$11$$.max;
  $object$$26$$.$_dimensions$ = [$MRI$$3_data$$42_modifiedEvent$$11$$.$nx$, $MRI$$3_data$$42_modifiedEvent$$11$$.$ny$, $MRI$$3_data$$42_modifiedEvent$$11$$.$nz$];
  $object$$26$$.$_spacing$ = [$MRI$$3_data$$42_modifiedEvent$$11$$.$xlen$ / $MRI$$3_data$$42_modifiedEvent$$11$$.$mx$, $MRI$$3_data$$42_modifiedEvent$$11$$.$ylen$ / $MRI$$3_data$$42_modifiedEvent$$11$$.$my$, $MRI$$3_data$$42_modifiedEvent$$11$$.$zlen$ / $MRI$$3_data$$42_modifiedEvent$$11$$.$mz$];
  $object$$26$$.$_min$ = $object$$26$$.$_windowLow$ = $min$$4_res$$10$$;
  $object$$26$$.$_max$ = $object$$26$$.$_windowHigh$ = $IJKToRAS$$4__rasBB$$4_max$$4$$;
  -Infinity == $object$$26$$.$_lowerThreshold$ && ($object$$26$$.$_lowerThreshold$ = $min$$4_res$$10$$);
  Infinity == $object$$26$$.$_upperThreshold$ && ($object$$26$$.$_upperThreshold$ = $IJKToRAS$$4__rasBB$$4_max$$4$$);
  $IJKToRAS$$4__rasBB$$4_max$$4$$ = $goog$vec$Mat4$createFloat32$$();
  $goog$vec$Mat4$setRowValues$$($IJKToRAS$$4__rasBB$$4_max$$4$$, 3, 0, 0, 0, 1);
  $goog$vec$Mat4$setRowValues$$($IJKToRAS$$4__rasBB$$4_max$$4$$, 0, -1, 0, 0, $MRI$$3_data$$42_modifiedEvent$$11$$.$nx$);
  $goog$vec$Mat4$setRowValues$$($IJKToRAS$$4__rasBB$$4_max$$4$$, 1, 0, 0, -1, $MRI$$3_data$$42_modifiedEvent$$11$$.$ny$);
  $goog$vec$Mat4$setRowValues$$($IJKToRAS$$4__rasBB$$4_max$$4$$, 2, 0, -1, 0, $MRI$$3_data$$42_modifiedEvent$$11$$.$nz$);
  $MRI$$3_data$$42_modifiedEvent$$11$$.$IJKToRAS$ = $IJKToRAS$$4__rasBB$$4_max$$4$$;
  $MRI$$3_data$$42_modifiedEvent$$11$$.$RASToIJK$ = $goog$vec$Mat4$createFloat32$$();
  $goog$vec$Mat4$invert$$($MRI$$3_data$$42_modifiedEvent$$11$$.$IJKToRAS$, $MRI$$3_data$$42_modifiedEvent$$11$$.$RASToIJK$);
  var $res2$$3_tar$$3$$ = $goog$vec$Vec4$createFloat32FromValues$$(0, 0, 0, 1), $min$$4_res$$10$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$4__rasBB$$4_max$$4$$, $res2$$3_tar$$3$$, $min$$4_res$$10$$);
  var $_dims$$1_tar2$$3$$ = $goog$vec$Vec4$createFloat32FromValues$$(1, 1, 1, 1), $res2$$3_tar$$3$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$4__rasBB$$4_max$$4$$, $_dims$$1_tar2$$3$$, $res2$$3_tar$$3$$);
  $_dims$$1_tar2$$3$$ = [$MRI$$3_data$$42_modifiedEvent$$11$$.$nx$, $MRI$$3_data$$42_modifiedEvent$$11$$.$ny$, $MRI$$3_data$$42_modifiedEvent$$11$$.$nz$];
  $IJKToRAS$$4__rasBB$$4_max$$4$$ = $X$parser$computeRASBBox$$($IJKToRAS$$4__rasBB$$4_max$$4$$, $_dims$$1_tar2$$3$$);
  $MRI$$3_data$$42_modifiedEvent$$11$$.$RASSpacing$ = [$res2$$3_tar$$3$$[0] - $min$$4_res$$10$$[0], $res2$$3_tar$$3$$[1] - $min$$4_res$$10$$[1], $res2$$3_tar$$3$$[2] - $min$$4_res$$10$$[2]];
  $MRI$$3_data$$42_modifiedEvent$$11$$.$RASDimensions$ = [$IJKToRAS$$4__rasBB$$4_max$$4$$[1] + $IJKToRAS$$4__rasBB$$4_max$$4$$[0] + 1, $IJKToRAS$$4__rasBB$$4_max$$4$$[3] - $IJKToRAS$$4__rasBB$$4_max$$4$$[2] + 1, $IJKToRAS$$4__rasBB$$4_max$$4$$[5] - $IJKToRAS$$4__rasBB$$4_max$$4$$[4] + 1];
  $MRI$$3_data$$42_modifiedEvent$$11$$.$RASOrigin$ = [$IJKToRAS$$4__rasBB$$4_max$$4$$[0], $IJKToRAS$$4__rasBB$$4_max$$4$$[2], $IJKToRAS$$4__rasBB$$4_max$$4$$[4]];
  $object$$26$$.$_dimensions$ = $_dims$$1_tar2$$3$$;
  $object$$26$$.$create_$($MRI$$3_data$$42_modifiedEvent$$11$$);
  $object$$26$$.$_image$ = $JSCompiler_StaticMethods_reslice$$(this, $object$$26$$);
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $MRI$$3_data$$42_modifiedEvent$$11$$ = new $X$event$ModifiedEvent$$;
  $MRI$$3_data$$42_modifiedEvent$$11$$.$_object$ = $object$$26$$;
  $MRI$$3_data$$42_modifiedEvent$$11$$.$_container$ = $container$$12$$;
  this.dispatchEvent($MRI$$3_data$$42_modifiedEvent$$11$$)
};
$X$parserMRC$$.prototype.$parseStream$ = function $$X$parserMRC$$$$$parseStream$$($MRI$$4_data$$43$$) {
  this.$_data$ = $MRI$$4_data$$43$$;
  $MRI$$4_data$$43$$ = {$nx$:0, $ny$:0, $nz$:0, mode:0, $nxstart$:0, $nystart$:0, $nzstart$:0, $mx$:0, $my$:0, $mz$:0, $xlen$:0, $ylen$:0, $zlen$:0, alpha:0, $beta$:0, $gamma$:0, $mapc$:0, $mapr$:0, $maps$:0, $amin$:0, $amax$:0, $amean$:0, $ispg$:0, next:0, $creatid$:0, $extra$:$JSCompiler_alias_NULL$$, $nint$:0, $nreal$:0, $extra$:$JSCompiler_alias_NULL$$, $imodStamp$:0, $imodFlags$:0, $idtype$:0, $lens$:0, $nd1$:0, $nd2$:0, $vd1$:0, $vd2$:0, $tiltangles$:$JSCompiler_alias_NULL$$, $xorg$:0, $yorg$:0, 
  $zorg$:0, $cmap$:0, $stamp$:0, $rms$:0, $nlabl$:0, data:$JSCompiler_alias_NULL$$, min:Infinity, max:-Infinity, $mean$:0, $space$:$JSCompiler_alias_NULL$$, $spaceorientation$:$JSCompiler_alias_NULL$$, $rasspaceorientation$:$JSCompiler_alias_NULL$$, orientation:$JSCompiler_alias_NULL$$, $normcosine$:$JSCompiler_alias_NULL$$};
  this.$_dataPointer$ = 0;
  $MRI$$4_data$$43$$.$nx$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$ny$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$nz$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.mode = $JSCompiler_StaticMethods_scan$$(this, "sint");
  var $volsize$$1$$ = $MRI$$4_data$$43$$.$nx$ * $MRI$$4_data$$43$$.$ny$ * $MRI$$4_data$$43$$.$nz$;
  this.$_dataPointer$ = 1024;
  switch($MRI$$4_data$$43$$.mode) {
    case 0:
      $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "schar", $volsize$$1$$);
      break;
    case 1:
      $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "sshort", $volsize$$1$$);
      break;
    case 2:
      $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "float", $volsize$$1$$);
      break;
    case 3:
      $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "uint", $volsize$$1$$);
      break;
    case 4:
      $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "double", $volsize$$1$$);
      break;
    case 6:
      $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "ushort", $volsize$$1$$);
      break;
    case 16:
      $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "uchar", $volsize$$1$$);
      break;
    default:
      $JSCompiler_alias_THROW$$(Error("Unsupported MRC data type: " + $MRI$$4_data$$43$$.mode))
  }
  this.$_dataPointer$ = 28;
  $MRI$$4_data$$43$$.$mx$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$my$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$mz$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$xlen$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.$ylen$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.$zlen$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.alpha = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.$beta$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.$gamma$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.$mapc$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$mapr$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$maps$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$amin$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.$amax$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.$amean$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.$ispeg$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.next = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$creatid$ = $JSCompiler_StaticMethods_scan$$(this, "short");
  $MRI$$4_data$$43$$.$nint$ = $JSCompiler_StaticMethods_scan$$(this, "short");
  $MRI$$4_data$$43$$.$nreal$ = $JSCompiler_StaticMethods_scan$$(this, "short");
  $MRI$$4_data$$43$$.$imodStamp$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$imodFLags$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$idtype$ = $JSCompiler_StaticMethods_scan$$(this, "short");
  $MRI$$4_data$$43$$.$lens$ = $JSCompiler_StaticMethods_scan$$(this, "short");
  $MRI$$4_data$$43$$.$nd1$ = $JSCompiler_StaticMethods_scan$$(this, "short");
  $MRI$$4_data$$43$$.$nd2$ = $JSCompiler_StaticMethods_scan$$(this, "short");
  $MRI$$4_data$$43$$.$vd1$ = $JSCompiler_StaticMethods_scan$$(this, "short");
  $MRI$$4_data$$43$$.$vd2$ = $JSCompiler_StaticMethods_scan$$(this, "short");
  $MRI$$4_data$$43$$.$tiltangles$ = $JSCompiler_StaticMethods_scan$$(this, "float", 6);
  this.$_dataPointer$ = 196;
  $MRI$$4_data$$43$$.$xorg$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.$yorg$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.$zorg$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  this.$_dataPointer$ = 216;
  $MRI$$4_data$$43$$.$rms$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$4_data$$43$$.$nlabl$ = $JSCompiler_StaticMethods_scan$$(this, "sint");
  $MRI$$4_data$$43$$.$lables$ = $JSCompiler_StaticMethods_scan$$(this, "schar", 10);
  if(0 != $MRI$$4_data$$43$$.next) {
    switch(this.$_dataPointer$ = parseInt($MRI$$4_data$$43$$.next + 1024, 10), $MRI$$4_data$$43$$.mode) {
      case 0:
        $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "schar", $volsize$$1$$);
        break;
      case 1:
        $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "sshort", $volsize$$1$$);
        break;
      case 2:
        $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "float", $volsize$$1$$);
        break;
      case 3:
        $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "uint", $volsize$$1$$);
        break;
      case 4:
        $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "double", $volsize$$1$$);
        break;
      case 6:
        $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "ushort", $volsize$$1$$);
        break;
      case 16:
        $MRI$$4_data$$43$$.data = $JSCompiler_StaticMethods_scan$$(this, "uchar", $volsize$$1$$);
        break;
      default:
        $JSCompiler_alias_THROW$$(Error("Unsupported MRC data type: " + $MRI$$4_data$$43$$.mode))
    }
  }
  0 > $MRI$$4_data$$43$$.$amean$ - ($MRI$$4_data$$43$$.$amax$ - $MRI$$4_data$$43$$.$amean$) ? ($MRI$$4_data$$43$$.min = $MRI$$4_data$$43$$.$amin$, $MRI$$4_data$$43$$.max = $MRI$$4_data$$43$$.$amean$ + ($MRI$$4_data$$43$$.$amean$ - $MRI$$4_data$$43$$.$amin$)) : ($MRI$$4_data$$43$$.min = $MRI$$4_data$$43$$.$amean$ - ($MRI$$4_data$$43$$.$amax$ - $MRI$$4_data$$43$$.$amean$), $MRI$$4_data$$43$$.max = $MRI$$4_data$$43$$.$amax$);
  return $MRI$$4_data$$43$$
};
$goog$exportSymbol$$("X.parserMRC", $X$parserMRC$$);
$goog$exportSymbol$$("X.parserMRC.prototype.parse", $X$parserMRC$$.prototype.parse);
function $X$parserNRRD$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserNRRD"
}
$goog$inherits$$($X$parserNRRD$$, $X$parser$$);
$X$parserNRRD$$.prototype.parse = function $$X$parserNRRD$$$$parse$($container$$13$$, $object$$27$$, $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  this.$_data$ = $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$;
  $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.byteLength);
  var $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ = $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.length, $_header__i$$inline_445_spacingY$$1_tar2$$4$$ = $JSCompiler_alias_NULL$$, $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$ = 0, $_len$$inline_446_i$$155_spacingZ$$1$$;
  for($_len$$inline_446_i$$155_spacingZ$$1$$ = 1;$_len$$inline_446_i$$155_spacingZ$$1$$ < $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$;$_len$$inline_446_i$$155_spacingZ$$1$$++) {
    if(10 == $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$[$_len$$inline_446_i$$155_spacingZ$$1$$ - 1] && 10 == $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$[$_len$$inline_446_i$$155_spacingZ$$1$$]) {
      $_header__i$$inline_445_spacingY$$1_tar2$$4$$ = $JSCompiler_StaticMethods_parseChars$$($MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$, 0, $_len$$inline_446_i$$155_spacingZ$$1$$ - 2);
      $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$ = $_len$$inline_446_i$$155_spacingZ$$1$$ + 1;
      break
    }
  }
  var $data$$inline_438_l$$inline_442$$, $field$$inline_439$$, $fn$$inline_440$$, $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$, $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ = $_header__i$$inline_445_spacingY$$1_tar2$$4$$.split(/\r?\n/), $_header__i$$inline_445_spacingY$$1_tar2$$4$$ = 0;
  for($_len$$inline_446_i$$155_spacingZ$$1$$ = $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$.length;$_header__i$$inline_445_spacingY$$1_tar2$$4$$ < $_len$$inline_446_i$$155_spacingZ$$1$$;$_header__i$$inline_445_spacingY$$1_tar2$$4$$++) {
    if($data$$inline_438_l$$inline_442$$ = $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$[$_header__i$$inline_445_spacingY$$1_tar2$$4$$], $data$$inline_438_l$$inline_442$$.match(/NRRD\d+/)) {
      this.$isNrrd$ = $JSCompiler_alias_TRUE$$
    }else {
      if(!$data$$inline_438_l$$inline_442$$.match(/^#/) && ($_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$ = $data$$inline_438_l$$inline_442$$.match(/(.*):(.*)/))) {
        $field$$inline_439$$ = $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$[1].trim(), $data$$inline_438_l$$inline_442$$ = $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$[2].trim(), ($fn$$inline_440$$ = this.$fieldFunctions$[$field$$inline_439$$]) ? $fn$$inline_440$$.call(this, $data$$inline_438_l$$inline_442$$) : this[$field$$inline_439$$] = $data$$inline_438_l$$inline_442$$
      }
    }
  }
  this.$isNrrd$ || $JSCompiler_alias_THROW$$(Error("Not an NRRD file"));
  "raw" !== this.encoding && ("gzip" !== this.encoding && "gz" !== this.encoding) && $JSCompiler_alias_THROW$$(Error("Only raw or gz/gzip encoding is allowed"));
  if(!this.$vectors$ && (this.$vectors$ = [new $goog$math$Vec3$$(1, 0, 0), new $goog$math$Vec3$$(0, 1, 0), new $goog$math$Vec3$$(0, 0, 1)], this.$spacings$)) {
    $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ = [];
    for($_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$ = 0;2 >= $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$;$_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$++) {
      $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$.push(!isNaN(this.$spacings$[$_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$]) ? this.$vectors$[$_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$].scale(this.$spacings$[$_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$]) : $JSCompiler_alias_VOID$$)
    }
  }
  $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$ = $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.subarray($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$);
  if("gzip" == this.encoding || "gz" == this.encoding) {
    $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$ = (new $Zlib$Gunzip$$(new Uint8Array($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$))).$decompress$()
  }
  $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$ = $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$.buffer;
  $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$ = {data:$JSCompiler_alias_NULL$$, min:Infinity, max:-Infinity};
  $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.data = new this.$__array$($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$);
  $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$ = $JSCompiler_StaticMethods_arrayMinMax$$($MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.data);
  $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$ = $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.min = $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$[0];
  $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$ = $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.max = $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$[1];
  $object$$27$$.$_min$ = $object$$27$$.$_windowLow$ = $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$;
  $object$$27$$.$_max$ = $object$$27$$.$_windowHigh$ = $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$;
  $object$$27$$.$_dimensions$ = [this.$sizes$[0], this.$sizes$[1], this.$sizes$[2]];
  $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ = (new $goog$math$Vec3$$(this.$vectors$[0][0], this.$vectors$[0][1], this.$vectors$[0][2])).$magnitude$();
  $_header__i$$inline_445_spacingY$$1_tar2$$4$$ = (new $goog$math$Vec3$$(this.$vectors$[1][0], this.$vectors$[1][1], this.$vectors$[1][2])).$magnitude$();
  $_len$$inline_446_i$$155_spacingZ$$1$$ = (new $goog$math$Vec3$$(this.$vectors$[2][0], this.$vectors$[2][1], this.$vectors$[2][2])).$magnitude$();
  $object$$27$$.$_spacing$ = [$_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$, $_header__i$$inline_445_spacingY$$1_tar2$$4$$, $_len$$inline_446_i$$155_spacingZ$$1$$];
  -Infinity == $object$$27$$.$_lowerThreshold$ && ($object$$27$$.$_lowerThreshold$ = $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$);
  Infinity == $object$$27$$.$_upperThreshold$ && ($object$$27$$.$_upperThreshold$ = $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$);
  $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ = $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$ = 1;
  "left-posterior-superior" == this.$space$ && ($_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ = $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$ = -1);
  $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$ = $goog$vec$Mat4$createFloat32Identity$$();
  "false" == $object$$27$$.reslicing || $object$$27$$.reslicing == $JSCompiler_alias_FALSE$$ ? ($goog$vec$Mat4$setRowValues$$($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$, 0, $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$, 0, 0, 0), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$, 1, 0, $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$, 0, 0), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$, 
  2, 0, 0, 1, 0)) : ($goog$vec$Mat4$setRowValues$$($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$, 0, $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$ * this.$vectors$[0][0], $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$ * this.$vectors$[1][0], $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$ * this.$vectors$[2][0], $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$ * this.$space_origin$[0]), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$, 
  1, $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ * this.$vectors$[0][1], $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ * this.$vectors$[1][1], $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ * this.$vectors$[2][1], $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ * this.$space_origin$[1]), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$, 
  2, 1 * this.$vectors$[0][2], 1 * this.$vectors$[1][2], 1 * this.$vectors$[2][2], 1 * this.$space_origin$[2]));
  $goog$vec$Mat4$setRowValues$$($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$, 3, 0, 0, 0, 1);
  $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.$IJKToRAS$ = $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$;
  $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.$RASToIJK$ = $goog$vec$Mat4$createFloat32$$();
  $goog$vec$Mat4$invert$$($MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.$IJKToRAS$, $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.$RASToIJK$);
  $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ = $goog$vec$Vec4$createFloat32FromValues$$(0, 0, 0, 1);
  $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$, $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$, $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$);
  $_header__i$$inline_445_spacingY$$1_tar2$$4$$ = $goog$vec$Vec4$createFloat32FromValues$$(1, 1, 1, 1);
  $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$, $_header__i$$inline_445_spacingY$$1_tar2$$4$$, $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$);
  $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$ = $X$parser$computeRASBBox$$($IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$, $object$$27$$.$_dimensions$);
  $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.$RASSpacing$ = [$_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$[0] - $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$[0], $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$[1] - $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$[1], $_length$$3__results$$inline_447__spaceY_lines$$inline_443_res2$$4_spacingX$$1_tar$$4$$[2] - $_spaceX_i$$inline_441_m$$inline_444_max$$5_min_max$$3_res$$11$$[2]];
  $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.$RASDimensions$ = [$IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$[1] - $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$[0] + 1, $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$[3] - $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$[2] + 1, $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$[5] - $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$[4] + 1];
  $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.$RASOrigin$ = [$IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$[0], $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$[2], $IJKToRAS$$5__data$$7__data_start__rasBB$$5_min$$5$$[4]];
  $object$$27$$.$create_$($MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$);
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $object$$27$$.$_image$ = $JSCompiler_StaticMethods_reslice$$(this, $object$$27$$);
  $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$ = new $X$event$ModifiedEvent$$;
  $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.$_object$ = $object$$27$$;
  $MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$.$_container$ = $container$$13$$;
  this.dispatchEvent($MRI$$5__bytes$$5_data$$44_modifiedEvent$$12$$)
};
$X$parserNRRD$$.prototype.$fieldFunctions$ = {type:function $$X$parserNRRD$$$$$fieldFunctions$$type$($data$$46$$) {
  switch($data$$46$$) {
    case "uchar":
    ;
    case "unsigned char":
    ;
    case "uint8":
    ;
    case "uint8_t":
      this.$__array$ = Uint8Array;
      break;
    case "signed char":
    ;
    case "int8":
    ;
    case "int8_t":
      this.$__array$ = Int8Array;
      break;
    case "short":
    ;
    case "short int":
    ;
    case "signed short":
    ;
    case "signed short int":
    ;
    case "int16":
    ;
    case "int16_t":
      this.$__array$ = Int16Array;
      break;
    case "ushort":
    ;
    case "unsigned short":
    ;
    case "unsigned short int":
    ;
    case "uint16":
    ;
    case "uint16_t":
      this.$__array$ = Uint16Array;
      break;
    case "int":
    ;
    case "signed int":
    ;
    case "int32":
    ;
    case "int32_t":
      this.$__array$ = Int32Array;
      break;
    case "uint":
    ;
    case "unsigned int":
    ;
    case "uint32":
    ;
    case "uint32_t":
      this.$__array$ = Uint32Array;
      break;
    case "float":
      this.$__array$ = Float32Array;
      break;
    case "double":
      this.$__array$ = Float64Array;
      break;
    default:
      $JSCompiler_alias_THROW$$(Error("Unsupported NRRD data type: " + $data$$46$$))
  }
  return this.type = $data$$46$$
}, endian:function $$X$parserNRRD$$$$$fieldFunctions$$endian$($data$$47$$) {
  return this.$endian$ = $data$$47$$
}, encoding:function $$X$parserNRRD$$$$$fieldFunctions$$encoding$($data$$48$$) {
  return this.encoding = $data$$48$$
}, dimension:function $$X$parserNRRD$$$$$fieldFunctions$$dimension$($data$$49$$) {
  return this.$dim$ = parseInt($data$$49$$, 10)
}, sizes:function $$X$parserNRRD$$$$$fieldFunctions$$sizes$($data$$50_i$$157$$) {
  var $_i$$inline_449$$, $_len$$inline_450$$, $_ref$$inline_451$$, $_results$$inline_452$$;
  $_ref$$inline_451$$ = $data$$50_i$$157$$.split(/\s+/);
  $_results$$inline_452$$ = [];
  $_i$$inline_449$$ = 0;
  for($_len$$inline_450$$ = $_ref$$inline_451$$.length;$_i$$inline_449$$ < $_len$$inline_450$$;$_i$$inline_449$$++) {
    $data$$50_i$$157$$ = $_ref$$inline_451$$[$_i$$inline_449$$], $_results$$inline_452$$.push(parseInt($data$$50_i$$157$$, 10))
  }
  return this.$sizes$ = $_results$$inline_452$$
}, space:function $$X$parserNRRD$$$$$fieldFunctions$$space$($data$$51$$) {
  return this.$space$ = $data$$51$$
}, "space origin":function $$X$parserNRRD$$$$$fieldFunctions$$__0$($data$$52$$) {
  return this.$space_origin$ = $data$$52$$.split("(")[1].split(")")[0].split(",")
}, "space directions":function $$X$parserNRRD$$$$$fieldFunctions$$__1$($data$$53_parts$$3$$) {
  var $f$$43$$, $v$$12$$;
  $data$$53_parts$$3$$ = $data$$53_parts$$3$$.match(/\(.*?\)/g);
  var $_i$$inline_454$$, $_len$$inline_455$$, $_results$$inline_456$$;
  $_results$$inline_456$$ = [];
  $_i$$inline_454$$ = 0;
  for($_len$$inline_455$$ = $data$$53_parts$$3$$.length;$_i$$inline_454$$ < $_len$$inline_455$$;$_i$$inline_454$$++) {
    $v$$12$$ = $data$$53_parts$$3$$[$_i$$inline_454$$], $_results$$inline_456$$.push(function() {
      var $_j$$inline_457$$, $_len2$$inline_458$$, $_ref$$inline_459$$, $_results2$$inline_460$$;
      $_ref$$inline_459$$ = $v$$12$$.slice(1, -1).split(/,/);
      $_results2$$inline_460$$ = [];
      $_j$$inline_457$$ = 0;
      for($_len2$$inline_458$$ = $_ref$$inline_459$$.length;$_j$$inline_457$$ < $_len2$$inline_458$$;$_j$$inline_457$$++) {
        $f$$43$$ = $_ref$$inline_459$$[$_j$$inline_457$$], $_results2$$inline_460$$.push(parseFloat($f$$43$$))
      }
      return $_results2$$inline_460$$
    }())
  }
  return this.$vectors$ = $_results$$inline_456$$
}, spacings:function $$X$parserNRRD$$$$$fieldFunctions$$spacings$($data$$54_f$$44$$) {
  var $parts$$4$$;
  $parts$$4$$ = $data$$54_f$$44$$.split(/\s+/);
  var $_i$$inline_462$$, $_len$$inline_463$$, $_results$$inline_464$$;
  $_results$$inline_464$$ = [];
  $_i$$inline_462$$ = 0;
  for($_len$$inline_463$$ = $parts$$4$$.length;$_i$$inline_462$$ < $_len$$inline_463$$;$_i$$inline_462$$++) {
    $data$$54_f$$44$$ = $parts$$4$$[$_i$$inline_462$$], $_results$$inline_464$$.push(parseFloat($data$$54_f$$44$$))
  }
  return this.$spacings$ = $_results$$inline_464$$
}};
$goog$exportSymbol$$("X.parserNRRD", $X$parserNRRD$$);
$goog$exportSymbol$$("X.parserNRRD.prototype.parse", $X$parserNRRD$$.prototype.parse);
function $X$parserSTL$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserSTL"
}
$goog$inherits$$($X$parserSTL$$, $X$parser$$);
$X$parserSTL$$.prototype.parse = function $$X$parserSTL$$$$parse$($container$$14$$, $object$$28$$, $_length$$inline_470_data$$55_i$$inline_487$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  this.$_data$ = $_length$$inline_470_data$$55_i$$inline_487$$;
  var $n$$inline_468_p$$10_p$$inline_484$$ = $object$$28$$.$_points$, $data$$inline_469_n$$13_n$$inline_485$$ = $object$$28$$.$_normals$;
  if("solid" == $JSCompiler_StaticMethods_parseChars$$($JSCompiler_StaticMethods_scan$$(this, "uchar", 5))) {
    $object$$28$$.$_points$ = $n$$inline_468_p$$10_p$$inline_484$$ = new $X$triplets$$($_length$$inline_470_data$$55_i$$inline_487$$.byteLength);
    $object$$28$$.$_normals$ = $data$$inline_469_n$$13_n$$inline_485$$ = new $X$triplets$$($_length$$inline_470_data$$55_i$$inline_487$$.byteLength);
    var $_triangleCount_modifiedEvent$$13_p$$inline_467$$ = $n$$inline_468_p$$10_p$$inline_484$$, $n$$inline_468_p$$10_p$$inline_484$$ = $data$$inline_469_n$$13_n$$inline_485$$, $data$$inline_469_n$$13_n$$inline_485$$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", $_length$$inline_470_data$$55_i$$inline_487$$.byteLength - 5);
    $_length$$inline_470_data$$55_i$$inline_487$$ = $data$$inline_469_n$$13_n$$inline_485$$.length;
    var $_bytes$$inline_488__normalsMode$$inline_471$$ = $JSCompiler_alias_FALSE$$, $_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$ = $JSCompiler_alias_FALSE$$, $_normalX$$inline_489__rangeStart$$inline_473$$ = 0, $_normalY$$inline_490_i$$inline_474$$;
    for($_normalY$$inline_490_i$$inline_474$$ = 0;$_normalY$$inline_490_i$$inline_474$$ < $_length$$inline_470_data$$55_i$$inline_487$$;$_normalY$$inline_490_i$$inline_474$$++) {
      if(10 == $data$$inline_469_n$$13_n$$inline_485$$[$_normalY$$inline_490_i$$inline_474$$]) {
        if($_bytes$$inline_488__normalsMode$$inline_471$$ || $_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$) {
          var $_numbers$$inline_475_z$$inline_478$$ = $JSCompiler_StaticMethods_parseChars$$($data$$inline_469_n$$13_n$$inline_485$$, $_normalX$$inline_489__rangeStart$$inline_473$$, $_normalY$$inline_490_i$$inline_474$$).split(" "), $_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$ = parseFloat($_numbers$$inline_475_z$$inline_478$$[0]), $y$$inline_477$$ = parseFloat($_numbers$$inline_475_z$$inline_478$$[1]), $_numbers$$inline_475_z$$inline_478$$ = parseFloat($_numbers$$inline_475_z$$inline_478$$[2]);
          $_bytes$$inline_488__normalsMode$$inline_471$$ ? ($n$$inline_468_p$$10_p$$inline_484$$.add($_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$, $y$$inline_477$$, $_numbers$$inline_475_z$$inline_478$$), $n$$inline_468_p$$10_p$$inline_484$$.add($_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$, $y$$inline_477$$, $_numbers$$inline_475_z$$inline_478$$), $n$$inline_468_p$$10_p$$inline_484$$.add($_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$, $y$$inline_477$$, 
          $_numbers$$inline_475_z$$inline_478$$)) : $_triangleCount_modifiedEvent$$13_p$$inline_467$$.add($_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$, $y$$inline_477$$, $_numbers$$inline_475_z$$inline_478$$);
          $_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$ = $_bytes$$inline_488__normalsMode$$inline_471$$ = $JSCompiler_alias_FALSE$$
        }
      }else {
        32 == $data$$inline_469_n$$13_n$$inline_485$$[$_normalY$$inline_490_i$$inline_474$$ - 1] && (102 == $data$$inline_469_n$$13_n$$inline_485$$[$_normalY$$inline_490_i$$inline_474$$] ? ($_normalX$$inline_489__rangeStart$$inline_473$$ = $_normalY$$inline_490_i$$inline_474$$ += 13, $_bytes$$inline_488__normalsMode$$inline_471$$ = $JSCompiler_alias_TRUE$$) : 118 == $data$$inline_469_n$$13_n$$inline_485$$[$_normalY$$inline_490_i$$inline_474$$] && ($_normalX$$inline_489__rangeStart$$inline_473$$ = 
        $_normalY$$inline_490_i$$inline_474$$ += 7, $_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$ = $JSCompiler_alias_TRUE$$))
      }
    }
  }else {
    this.$_dataPointer$ = 80;
    $_triangleCount_modifiedEvent$$13_p$$inline_467$$ = $JSCompiler_StaticMethods_scan$$(this, "uint");
    $object$$28$$.$_points$ = $n$$inline_468_p$$10_p$$inline_484$$ = new $X$triplets$$(9 * $_triangleCount_modifiedEvent$$13_p$$inline_467$$);
    $object$$28$$.$_normals$ = $data$$inline_469_n$$13_n$$inline_485$$ = new $X$triplets$$(9 * $_triangleCount_modifiedEvent$$13_p$$inline_467$$);
    for($_length$$inline_470_data$$55_i$$inline_487$$ = $_length$$inline_470_data$$55_i$$inline_487$$ = 0;$_length$$inline_470_data$$55_i$$inline_487$$ < $_triangleCount_modifiedEvent$$13_p$$inline_467$$;$_length$$inline_470_data$$55_i$$inline_487$$++) {
      $_bytes$$inline_488__normalsMode$$inline_471$$ = $JSCompiler_StaticMethods_scan$$(this, "float", 12), $_normalX$$inline_489__rangeStart$$inline_473$$ = $_bytes$$inline_488__normalsMode$$inline_471$$[0], $_normalY$$inline_490_i$$inline_474$$ = $_bytes$$inline_488__normalsMode$$inline_471$$[1], $_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$ = $_bytes$$inline_488__normalsMode$$inline_471$$[2], $data$$inline_469_n$$13_n$$inline_485$$.add($_normalX$$inline_489__rangeStart$$inline_473$$, 
      $_normalY$$inline_490_i$$inline_474$$, $_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$), $data$$inline_469_n$$13_n$$inline_485$$.add($_normalX$$inline_489__rangeStart$$inline_473$$, $_normalY$$inline_490_i$$inline_474$$, $_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$), $data$$inline_469_n$$13_n$$inline_485$$.add($_normalX$$inline_489__rangeStart$$inline_473$$, $_normalY$$inline_490_i$$inline_474$$, $_normalZ$$inline_491__vertexMode$$inline_472_x$$inline_476$$), 
      $n$$inline_468_p$$10_p$$inline_484$$.add($_bytes$$inline_488__normalsMode$$inline_471$$[3], $_bytes$$inline_488__normalsMode$$inline_471$$[4], $_bytes$$inline_488__normalsMode$$inline_471$$[5]), $n$$inline_468_p$$10_p$$inline_484$$.add($_bytes$$inline_488__normalsMode$$inline_471$$[6], $_bytes$$inline_488__normalsMode$$inline_471$$[7], $_bytes$$inline_488__normalsMode$$inline_471$$[8]), $n$$inline_468_p$$10_p$$inline_484$$.add($_bytes$$inline_488__normalsMode$$inline_471$$[9], $_bytes$$inline_488__normalsMode$$inline_471$$[10], 
      $_bytes$$inline_488__normalsMode$$inline_471$$[11]), this.$_dataPointer$ += 2
    }
  }
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $_triangleCount_modifiedEvent$$13_p$$inline_467$$ = new $X$event$ModifiedEvent$$;
  $_triangleCount_modifiedEvent$$13_p$$inline_467$$.$_object$ = $object$$28$$;
  $_triangleCount_modifiedEvent$$13_p$$inline_467$$.$_container$ = $container$$14$$;
  this.dispatchEvent($_triangleCount_modifiedEvent$$13_p$$inline_467$$)
};
$goog$exportSymbol$$("X.parserSTL", $X$parserSTL$$);
$goog$exportSymbol$$("X.parserSTL.prototype.parse", $X$parserSTL$$.prototype.parse);
function $X$parserNII$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserNII"
}
$goog$inherits$$($X$parserNII$$, $X$parser$$);
$X$parserNII$$.prototype.parse = function $$X$parserNII$$$$parse$($container$$15$$, $object$$29$$, $MRI$$6_data$$57_modifiedEvent$$14$$) {
  var $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$ = $MRI$$6_data$$57_modifiedEvent$$14$$, $_compressionCheck_max$$6_res$$12_sx$$1_xd$$ = -1, $_compressionCheck_max$$6_res$$12_sx$$1_xd$$ = "undefined" == typeof DataView ? (new Int32Array($MRI$$6_data$$57_modifiedEvent$$14$$, 0, 1))[0] : (new DataView($MRI$$6_data$$57_modifiedEvent$$14$$, 0)).getInt32(0, $JSCompiler_alias_TRUE$$);
  348 != $_compressionCheck_max$$6_res$$12_sx$$1_xd$$ && ($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$ = (new $Zlib$Gunzip$$(new Uint8Array($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$))).$decompress$(), $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$ = $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$.buffer);
  $MRI$$6_data$$57_modifiedEvent$$14$$ = this.$parseStream$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$);
  $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.min;
  $_compressionCheck_max$$6_res$$12_sx$$1_xd$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.max;
  $object$$29$$.$_min$ = $object$$29$$.$_windowLow$ = $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$;
  $object$$29$$.$_max$ = $object$$29$$.$_windowHigh$ = $_compressionCheck_max$$6_res$$12_sx$$1_xd$$;
  -Infinity == $object$$29$$.$_lowerThreshold$ && ($object$$29$$.$_lowerThreshold$ = $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$);
  Infinity == $object$$29$$.$_upperThreshold$ && ($object$$29$$.$_upperThreshold$ = $_compressionCheck_max$$6_res$$12_sx$$1_xd$$);
  $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$ = $goog$vec$Mat4$createFloat32$$();
  $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 3, 0, 0, 0, 1);
  if("false" == $object$$29$$.reslicing || $object$$29$$.reslicing == $JSCompiler_alias_FALSE$$) {
    var $res2$$5_sy$$1_tar$$5_yd$$ = $_compressionCheck_max$$6_res$$12_sx$$1_xd$$ = 1, $_dims$$2_sz_tar2$$5_zd$$ = 1;
    0 < $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[1] && ($_compressionCheck_max$$6_res$$12_sx$$1_xd$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[1]);
    0 < $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[2] && ($res2$$5_sy$$1_tar$$5_yd$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[2]);
    0 < $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[2] && ($_dims$$2_sz_tar2$$5_zd$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[3]);
    0 > $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[0] && ($_dims$$2_sz_tar2$$5_zd$$ = -$_dims$$2_sz_tar2$$5_zd$$);
    $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 0, $_compressionCheck_max$$6_res$$12_sx$$1_xd$$, 0, 0, 0);
    $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 1, 0, $res2$$5_sy$$1_tar$$5_yd$$, 0, 0);
    $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 2, 0, 0, $_dims$$2_sz_tar2$$5_zd$$, 0)
  }else {
    if(0 < $MRI$$6_data$$57_modifiedEvent$$14$$.$qform_code$) {
      var $a$$50$$ = 0, $b$$36$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$quatern_b$, $c$$27$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$quatern_c$, $d$$6$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$quatern_d$, $_dims$$2_sz_tar2$$5_zd$$ = $res2$$5_sy$$1_tar$$5_yd$$ = $_compressionCheck_max$$6_res$$12_sx$$1_xd$$ = 1, $qx$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$qoffset_x$, $qy$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$qoffset_y$, $qz$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$qoffset_z$, $a$$50$$ = 1 - 
      ($b$$36$$ * $b$$36$$ + $c$$27$$ * $c$$27$$ + $d$$6$$ * $d$$6$$);
      1E-7 > $a$$50$$ ? ($a$$50$$ = 1 / Math.sqrt($b$$36$$ * $b$$36$$ + $c$$27$$ * $c$$27$$ + $d$$6$$ * $d$$6$$), $b$$36$$ *= $a$$50$$, $c$$27$$ *= $a$$50$$, $d$$6$$ *= $a$$50$$, $a$$50$$ = 0) : $a$$50$$ = Math.sqrt($a$$50$$);
      0 < $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[1] && ($_compressionCheck_max$$6_res$$12_sx$$1_xd$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[1]);
      0 < $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[2] && ($res2$$5_sy$$1_tar$$5_yd$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[2]);
      0 < $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[2] && ($_dims$$2_sz_tar2$$5_zd$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[3]);
      0 > $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[0] && ($_dims$$2_sz_tar2$$5_zd$$ = -$_dims$$2_sz_tar2$$5_zd$$);
      $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 0, ($a$$50$$ * $a$$50$$ + $b$$36$$ * $b$$36$$ - $c$$27$$ * $c$$27$$ - $d$$6$$ * $d$$6$$) * $_compressionCheck_max$$6_res$$12_sx$$1_xd$$, 2 * ($b$$36$$ * $c$$27$$ - $a$$50$$ * $d$$6$$) * $res2$$5_sy$$1_tar$$5_yd$$, 2 * ($b$$36$$ * $d$$6$$ + $a$$50$$ * $c$$27$$) * $_dims$$2_sz_tar2$$5_zd$$, $qx$$);
      $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 1, 2 * ($b$$36$$ * $c$$27$$ + $a$$50$$ * $d$$6$$) * $_compressionCheck_max$$6_res$$12_sx$$1_xd$$, ($a$$50$$ * $a$$50$$ + $c$$27$$ * $c$$27$$ - $b$$36$$ * $b$$36$$ - $d$$6$$ * $d$$6$$) * $res2$$5_sy$$1_tar$$5_yd$$, 2 * ($c$$27$$ * $d$$6$$ - $a$$50$$ * $b$$36$$) * $_dims$$2_sz_tar2$$5_zd$$, $qy$$);
      $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 2, 2 * ($b$$36$$ * $d$$6$$ - $a$$50$$ * $c$$27$$) * $_compressionCheck_max$$6_res$$12_sx$$1_xd$$, 2 * ($c$$27$$ * $d$$6$$ + $a$$50$$ * $b$$36$$) * $res2$$5_sy$$1_tar$$5_yd$$, ($a$$50$$ * $a$$50$$ + $d$$6$$ * $d$$6$$ - $c$$27$$ * $c$$27$$ - $b$$36$$ * $b$$36$$) * $_dims$$2_sz_tar2$$5_zd$$, $qz$$)
    }else {
      0 < $MRI$$6_data$$57_modifiedEvent$$14$$.$sform_code$ ? ($_compressionCheck_max$$6_res$$12_sx$$1_xd$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$srow_x$, $res2$$5_sy$$1_tar$$5_yd$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$srow_y$, $_dims$$2_sz_tar2$$5_zd$$ = $MRI$$6_data$$57_modifiedEvent$$14$$.$srow_z$, $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 0, $_compressionCheck_max$$6_res$$12_sx$$1_xd$$[0], $_compressionCheck_max$$6_res$$12_sx$$1_xd$$[1], $_compressionCheck_max$$6_res$$12_sx$$1_xd$$[2], 
      $_compressionCheck_max$$6_res$$12_sx$$1_xd$$[3]), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 1, $res2$$5_sy$$1_tar$$5_yd$$[0], $res2$$5_sy$$1_tar$$5_yd$$[1], $res2$$5_sy$$1_tar$$5_yd$$[2], $res2$$5_sy$$1_tar$$5_yd$$[3]), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 2, $_dims$$2_sz_tar2$$5_zd$$[0], $_dims$$2_sz_tar2$$5_zd$$[1], $_dims$$2_sz_tar2$$5_zd$$[2], $_dims$$2_sz_tar2$$5_zd$$[3])) : 0 == $MRI$$6_data$$57_modifiedEvent$$14$$.$qform_code$ ? 
      ($goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 0, $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[1], 0, 0, 0), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 1, 0, $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[2], 0, 0), $goog$vec$Mat4$setRowValues$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, 2, 0, 0, $MRI$$6_data$$57_modifiedEvent$$14$$.$pixdim$[3], 0)) : window.console.log("UNKNOWN METHOD IN PARSER NII")
    }
  }
  $MRI$$6_data$$57_modifiedEvent$$14$$.$IJKToRAS$ = $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$;
  $MRI$$6_data$$57_modifiedEvent$$14$$.$RASToIJK$ = $goog$vec$Mat4$createFloat32$$();
  $goog$vec$Mat4$invert$$($MRI$$6_data$$57_modifiedEvent$$14$$.$IJKToRAS$, $MRI$$6_data$$57_modifiedEvent$$14$$.$RASToIJK$);
  $res2$$5_sy$$1_tar$$5_yd$$ = $goog$vec$Vec4$createFloat32FromValues$$(0, 0, 0, 1);
  $_compressionCheck_max$$6_res$$12_sx$$1_xd$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, $res2$$5_sy$$1_tar$$5_yd$$, $_compressionCheck_max$$6_res$$12_sx$$1_xd$$);
  $_dims$$2_sz_tar2$$5_zd$$ = $goog$vec$Vec4$createFloat32FromValues$$(1, 1, 1, 1);
  $res2$$5_sy$$1_tar$$5_yd$$ = $goog$vec$Vec4$createFloat32$$();
  $goog$vec$Mat4$multVec4$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, $_dims$$2_sz_tar2$$5_zd$$, $res2$$5_sy$$1_tar$$5_yd$$);
  $_dims$$2_sz_tar2$$5_zd$$ = [$MRI$$6_data$$57_modifiedEvent$$14$$.$dim$[1], $MRI$$6_data$$57_modifiedEvent$$14$$.$dim$[2], $MRI$$6_data$$57_modifiedEvent$$14$$.$dim$[3]];
  $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$ = $X$parser$computeRASBBox$$($IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$, $_dims$$2_sz_tar2$$5_zd$$);
  $MRI$$6_data$$57_modifiedEvent$$14$$.$RASSpacing$ = [$res2$$5_sy$$1_tar$$5_yd$$[0] - $_compressionCheck_max$$6_res$$12_sx$$1_xd$$[0], $res2$$5_sy$$1_tar$$5_yd$$[1] - $_compressionCheck_max$$6_res$$12_sx$$1_xd$$[1], $res2$$5_sy$$1_tar$$5_yd$$[2] - $_compressionCheck_max$$6_res$$12_sx$$1_xd$$[2]];
  $MRI$$6_data$$57_modifiedEvent$$14$$.$RASDimensions$ = [$IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$[1] - $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$[0] + 1, $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$[3] - $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$[2] + 1, $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$[5] - $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$[4] + 1];
  $MRI$$6_data$$57_modifiedEvent$$14$$.$RASOrigin$ = [$IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$[0], $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$[2], $IJKToRAS$$6__data$$8__rasBB$$6_min$$6$$[4]];
  $object$$29$$.$_dimensions$ = $_dims$$2_sz_tar2$$5_zd$$;
  $object$$29$$.$create_$($MRI$$6_data$$57_modifiedEvent$$14$$);
  $object$$29$$.$_image$ = $JSCompiler_StaticMethods_reslice$$(this, $object$$29$$);
  $MRI$$6_data$$57_modifiedEvent$$14$$ = new $X$event$ModifiedEvent$$;
  $MRI$$6_data$$57_modifiedEvent$$14$$.$_object$ = $object$$29$$;
  $MRI$$6_data$$57_modifiedEvent$$14$$.$_container$ = $container$$15$$;
  this.dispatchEvent($MRI$$6_data$$57_modifiedEvent$$14$$)
};
$X$parserNII$$.prototype.$parseStream$ = function $$X$parserNII$$$$$parseStream$$($MRI$$7_data$$58$$) {
  this.$_data$ = $MRI$$7_data$$58$$;
  $MRI$$7_data$$58$$ = {$sizeof_hdr$:0, $data_type$:$JSCompiler_alias_NULL$$, $db_name$:$JSCompiler_alias_NULL$$, $extents$:0, $session_error$:0, $regular$:0, $dim_info$:$JSCompiler_alias_NULL$$, $dim$:$JSCompiler_alias_NULL$$, $intent_p1$:0, $intent_p2$:0, $intent_p3$:0, $intent_code$:0, $datatype$:0, $bitpix$:0, $slice_start$:0, $pixdim$:$JSCompiler_alias_NULL$$, $vox_offset$:0, $scl_slope$:0, $scl_inter$:0, $slice_end$:0, $slice_code$:$JSCompiler_alias_NULL$$, $xyzt_units$:$JSCompiler_alias_NULL$$, 
  $cal_max$:0, $cal_min$:0, $slice_duration$:0, $toffset$:0, $glmax$:0, $glmin$:0, $descrip$:$JSCompiler_alias_NULL$$, $aux_file$:$JSCompiler_alias_NULL$$, $qform_code$:0, $sform_code$:0, $quatern_b$:0, $quatern_c$:0, $quatern_d$:0, $qoffset_x$:0, $qoffset_y$:0, $qoffset_z$:0, $srow_x$:$JSCompiler_alias_NULL$$, $srow_y$:$JSCompiler_alias_NULL$$, $srow_z$:$JSCompiler_alias_NULL$$, $intent_name$:$JSCompiler_alias_NULL$$, $magic$:$JSCompiler_alias_NULL$$, data:$JSCompiler_alias_NULL$$, min:Infinity, 
  max:-Infinity};
  $MRI$$7_data$$58$$.$sizeof_hdr$ = $JSCompiler_StaticMethods_scan$$(this, "uint");
  $MRI$$7_data$$58$$.$data_type$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", 10);
  $MRI$$7_data$$58$$.$db_name$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", 18);
  $MRI$$7_data$$58$$.$extents$ = $JSCompiler_StaticMethods_scan$$(this, "uint");
  $MRI$$7_data$$58$$.$session_error$ = $JSCompiler_StaticMethods_scan$$(this, "ushort");
  $MRI$$7_data$$58$$.$regular$ = $JSCompiler_StaticMethods_scan$$(this, "uchar");
  $MRI$$7_data$$58$$.$dim_info$ = $JSCompiler_StaticMethods_scan$$(this, "uchar");
  $MRI$$7_data$$58$$.$dim$ = $JSCompiler_StaticMethods_scan$$(this, "ushort", 8);
  $MRI$$7_data$$58$$.$intent_p1$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$intent_p2$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$intent_p3$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$intent_code$ = $JSCompiler_StaticMethods_scan$$(this, "ushort");
  $MRI$$7_data$$58$$.$datatype$ = $JSCompiler_StaticMethods_scan$$(this, "ushort");
  $MRI$$7_data$$58$$.$bitpix$ = $JSCompiler_StaticMethods_scan$$(this, "ushort");
  $MRI$$7_data$$58$$.$slice_start$ = $JSCompiler_StaticMethods_scan$$(this, "ushort");
  $MRI$$7_data$$58$$.$pixdim$ = $JSCompiler_StaticMethods_scan$$(this, "float", 8);
  $MRI$$7_data$$58$$.$vox_offset$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$scl_slope$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$scl_inter$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$slice_end$ = $JSCompiler_StaticMethods_scan$$(this, "ushort");
  $MRI$$7_data$$58$$.$slice_code$ = $JSCompiler_StaticMethods_scan$$(this, "uchar");
  $MRI$$7_data$$58$$.$xyzt_units$ = $JSCompiler_StaticMethods_scan$$(this, "uchar");
  $MRI$$7_data$$58$$.$cal_max$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$cal_min$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$slice_duration$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$toffset$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$glmax$ = $JSCompiler_StaticMethods_scan$$(this, "uint", 1);
  $MRI$$7_data$$58$$.$glmin$ = $JSCompiler_StaticMethods_scan$$(this, "uint", 1);
  $MRI$$7_data$$58$$.$descrip$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", 80);
  $MRI$$7_data$$58$$.$aux_file$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", 24);
  $MRI$$7_data$$58$$.$qform_code$ = $JSCompiler_StaticMethods_scan$$(this, "ushort");
  $MRI$$7_data$$58$$.$sform_code$ = $JSCompiler_StaticMethods_scan$$(this, "ushort");
  $MRI$$7_data$$58$$.$quatern_b$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$quatern_c$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$quatern_d$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$qoffset_x$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$qoffset_y$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$qoffset_z$ = $JSCompiler_StaticMethods_scan$$(this, "float");
  $MRI$$7_data$$58$$.$srow_x$ = $JSCompiler_StaticMethods_scan$$(this, "float", 4);
  $MRI$$7_data$$58$$.$srow_y$ = $JSCompiler_StaticMethods_scan$$(this, "float", 4);
  $MRI$$7_data$$58$$.$srow_z$ = $JSCompiler_StaticMethods_scan$$(this, "float", 4);
  $MRI$$7_data$$58$$.$intent_name$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", 16);
  $MRI$$7_data$$58$$.$magic$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", 4);
  this.$_dataPointer$ = parseInt($MRI$$7_data$$58$$.$vox_offset$, 10);
  var $min_max$$4_volsize$$2$$ = $MRI$$7_data$$58$$.$dim$[1] * $MRI$$7_data$$58$$.$dim$[2] * $MRI$$7_data$$58$$.$dim$[3];
  switch($MRI$$7_data$$58$$.$datatype$) {
    case 2:
      $MRI$$7_data$$58$$.data = $JSCompiler_StaticMethods_scan$$(this, "uchar", $min_max$$4_volsize$$2$$);
      break;
    case 4:
      $MRI$$7_data$$58$$.data = $JSCompiler_StaticMethods_scan$$(this, "sshort", $min_max$$4_volsize$$2$$);
      break;
    case 8:
      $MRI$$7_data$$58$$.data = $JSCompiler_StaticMethods_scan$$(this, "sint", $min_max$$4_volsize$$2$$);
      break;
    case 16:
      $MRI$$7_data$$58$$.data = $JSCompiler_StaticMethods_scan$$(this, "float", $min_max$$4_volsize$$2$$);
      break;
    case 32:
      $MRI$$7_data$$58$$.data = $JSCompiler_StaticMethods_scan$$(this, "complex", $min_max$$4_volsize$$2$$);
      break;
    case 64:
      $MRI$$7_data$$58$$.data = $JSCompiler_StaticMethods_scan$$(this, "double", $min_max$$4_volsize$$2$$);
      break;
    case 256:
      $MRI$$7_data$$58$$.data = $JSCompiler_StaticMethods_scan$$(this, "schar", $min_max$$4_volsize$$2$$);
      break;
    case 512:
      $MRI$$7_data$$58$$.data = $JSCompiler_StaticMethods_scan$$(this, "ushort", $min_max$$4_volsize$$2$$);
      break;
    case 768:
      $MRI$$7_data$$58$$.data = $JSCompiler_StaticMethods_scan$$(this, "uint", $min_max$$4_volsize$$2$$);
      break;
    default:
      $JSCompiler_alias_THROW$$(Error("Unsupported NII data type: " + $MRI$$7_data$$58$$.$datatype$))
  }
  $min_max$$4_volsize$$2$$ = $JSCompiler_StaticMethods_arrayMinMax$$($MRI$$7_data$$58$$.data);
  $MRI$$7_data$$58$$.min = $min_max$$4_volsize$$2$$[0];
  $MRI$$7_data$$58$$.max = $min_max$$4_volsize$$2$$[1];
  return $MRI$$7_data$$58$$
};
$goog$exportSymbol$$("X.parserNII", $X$parserNII$$);
$goog$exportSymbol$$("X.parserNII.prototype.parse", $X$parserNII$$.prototype.parse);
function $X$parserTRK$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserTRK"
}
$goog$inherits$$($X$parserTRK$$, $X$parser$$);
$X$parserTRK$$.prototype.parse = function $$X$parserTRK$$$$parse$($container$$16$$, $object$$30$$, $data$$59_header$$3_modifiedEvent$$15$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  var $minZ_p$$13$$ = $object$$30$$.$_points$, $maxZ_n$$16$$ = $object$$30$$.$_normals$, $_totalPoints_c$$28$$ = $object$$30$$.$_colors$;
  this.$_data$ = $data$$59_header$$3_modifiedEvent$$15$$;
  $data$$59_header$$3_modifiedEvent$$15$$ = {id_string:$JSCompiler_StaticMethods_scan$$(this, "uchar", 6), dim:$JSCompiler_StaticMethods_scan$$(this, "ushort", 3), voxel_size:$JSCompiler_StaticMethods_scan$$(this, "float", 3), origin:$JSCompiler_StaticMethods_scan$$(this, "float", 3), n_scalars:$JSCompiler_StaticMethods_scan$$(this, "ushort"), scalar_name:$JSCompiler_StaticMethods_scan$$(this, "uchar", 200), n_properties:$JSCompiler_StaticMethods_scan$$(this, "ushort"), property_name:$JSCompiler_StaticMethods_scan$$(this, 
  "uchar", 200), vox_to_ras:$JSCompiler_StaticMethods_scan$$(this, "float", 16), reserved:$JSCompiler_StaticMethods_scan$$(this, "uchar", 444), voxel_order:$JSCompiler_StaticMethods_scan$$(this, "uchar", 4), pad2:$JSCompiler_StaticMethods_scan$$(this, "uchar", 4), image_orientation_patient:$JSCompiler_StaticMethods_scan$$(this, "float", 6), pad1:$JSCompiler_StaticMethods_scan$$(this, "uchar", 2), invert_x:$JSCompiler_StaticMethods_scan$$(this, "uchar"), invert_y:$JSCompiler_StaticMethods_scan$$(this, 
  "uchar"), invert_z:$JSCompiler_StaticMethods_scan$$(this, "uchar"), swap_xy:$JSCompiler_StaticMethods_scan$$(this, "uchar"), swap_yz:$JSCompiler_StaticMethods_scan$$(this, "uchar"), swap_zx:$JSCompiler_StaticMethods_scan$$(this, "uchar"), n_count:$JSCompiler_StaticMethods_scan$$(this, "uint"), version:$JSCompiler_StaticMethods_scan$$(this, "uint"), hdr_size:$JSCompiler_StaticMethods_scan$$(this, "uint")};
  var $numberOfFibers$$ = $data$$59_header$$3_modifiedEvent$$15$$.$n_count$, $centerX_numberOfScalars$$ = $data$$59_header$$3_modifiedEvent$$15$$.$n_scalars$, $fibers$$ = [], $lengths$$5$$ = [], $minLength_vox_to_ras_defined$$ = Infinity, $maxLength$$ = -Infinity, $centerZ_minX$$ = $JSCompiler_alias_NULL$$, $_scalarIndex_maxX$$ = $JSCompiler_alias_NULL$$, $centerY_minY$$ = $JSCompiler_alias_NULL$$, $maxY_scalarArray$$ = $JSCompiler_alias_NULL$$, $maxZ_n$$16$$ = $minZ_p$$13$$ = $JSCompiler_alias_NULL$$, 
  $_numPoints_points$$1$$ = $JSCompiler_StaticMethods_scan$$(this, "uint", (this.$_data$.byteLength - 1E3) / 4);
  this.$_dataPointer$ = $data$$59_header$$3_modifiedEvent$$15$$.$hdr_size$;
  var $_points_numberOfPoints$$2$$ = $JSCompiler_StaticMethods_scan$$(this, "float", (this.$_data$.byteLength - 1E3) / 4), $diff_end$$5_nextPoint$$1_offset$$16$$ = 0, $_totalPoints_c$$28$$ = 0, $i$$160_scalars$$;
  for($i$$160_scalars$$ = 0;$i$$160_scalars$$ < $numberOfFibers$$;$i$$160_scalars$$++) {
    for(var $cMaxX_nCurrentPointX_numPoints$$ = $_numPoints_points$$1$$[$diff_end$$5_nextPoint$$1_offset$$16$$], $currentPoint$$1_currentPoints_distance$$3_start$$11$$ = new $X$triplets$$(3 * $cMaxX_nCurrentPointX_numPoints$$), $length$$33$$ = 0, $cMinX_j$$16$$ = 0;$cMinX_j$$16$$ < $cMaxX_nCurrentPointX_numPoints$$;$cMinX_j$$16$$++) {
      var $cMinY_nCurrentPointY_x$$90$$ = $_points_numberOfPoints$$2$$[$diff_end$$5_nextPoint$$1_offset$$16$$ + 3 * $cMinX_j$$16$$ + $cMinX_j$$16$$ * $centerX_numberOfScalars$$ + 1], $cMaxY_nCurrentPointZ_y$$64$$ = $_points_numberOfPoints$$2$$[$diff_end$$5_nextPoint$$1_offset$$16$$ + 3 * $cMinX_j$$16$$ + $cMinX_j$$16$$ * $centerX_numberOfScalars$$ + 2], $cMinZ_nCurrentPointLength_z$$30$$ = $_points_numberOfPoints$$2$$[$diff_end$$5_nextPoint$$1_offset$$16$$ + 3 * $cMinX_j$$16$$ + $cMinX_j$$16$$ * 
      $centerX_numberOfScalars$$ + 3], $cMinY_nCurrentPointY_x$$90$$ = $cMinY_nCurrentPointY_x$$90$$ / $data$$59_header$$3_modifiedEvent$$15$$.$voxel_size$[0], $cMaxY_nCurrentPointZ_y$$64$$ = $cMaxY_nCurrentPointZ_y$$64$$ / $data$$59_header$$3_modifiedEvent$$15$$.$voxel_size$[1], $cMinZ_nCurrentPointLength_z$$30$$ = $cMinZ_nCurrentPointLength_z$$30$$ / $data$$59_header$$3_modifiedEvent$$15$$.$voxel_size$[2];
      $currentPoint$$1_currentPoints_distance$$3_start$$11$$.add($cMinY_nCurrentPointY_x$$90$$, $cMaxY_nCurrentPointZ_y$$64$$, $cMinZ_nCurrentPointLength_z$$30$$);
      if(0 < $cMinX_j$$16$$) {
        var $cMaxZ_nNextPointX_oldPoint$$ = $currentPoint$$1_currentPoints_distance$$3_start$$11$$.get($cMinX_j$$16$$ - 1), $length$$33$$ = $length$$33$$ + Math.sqrt(Math.pow($cMinY_nCurrentPointY_x$$90$$ - $cMaxZ_nNextPointX_oldPoint$$[0], 2) + Math.pow($cMaxY_nCurrentPointZ_y$$64$$ - $cMaxZ_nNextPointX_oldPoint$$[1], 2) + Math.pow($cMinZ_nCurrentPointLength_z$$30$$ - $cMaxZ_nNextPointX_oldPoint$$[2], 2))
      }
      $cMinX_j$$16$$ < $cMaxX_nCurrentPointX_numPoints$$ - 1 && ($_totalPoints_c$$28$$ += 6)
    }
    $diff_end$$5_nextPoint$$1_offset$$16$$ += 3 * $cMaxX_nCurrentPointX_numPoints$$ + $cMaxX_nCurrentPointX_numPoints$$ * $centerX_numberOfScalars$$ + 1;
    $cMinX_j$$16$$ = $currentPoint$$1_currentPoints_distance$$3_start$$11$$.$_minA$;
    $cMaxX_nCurrentPointX_numPoints$$ = $currentPoint$$1_currentPoints_distance$$3_start$$11$$.$_maxA$;
    $cMinY_nCurrentPointY_x$$90$$ = $currentPoint$$1_currentPoints_distance$$3_start$$11$$.$_minB$;
    $cMaxY_nCurrentPointZ_y$$64$$ = $currentPoint$$1_currentPoints_distance$$3_start$$11$$.$_maxB$;
    $cMinZ_nCurrentPointLength_z$$30$$ = $currentPoint$$1_currentPoints_distance$$3_start$$11$$.$_minC$;
    $cMaxZ_nNextPointX_oldPoint$$ = $currentPoint$$1_currentPoints_distance$$3_start$$11$$.$_maxC$;
    if(!$centerZ_minX$$ || $cMinX_j$$16$$ < $centerZ_minX$$) {
      $centerZ_minX$$ = $cMinX_j$$16$$
    }
    if(!$_scalarIndex_maxX$$ || $cMaxX_nCurrentPointX_numPoints$$ > $_scalarIndex_maxX$$) {
      $_scalarIndex_maxX$$ = $cMaxX_nCurrentPointX_numPoints$$
    }
    if(!$centerY_minY$$ || $cMinY_nCurrentPointY_x$$90$$ < $centerY_minY$$) {
      $centerY_minY$$ = $cMinY_nCurrentPointY_x$$90$$
    }
    if(!$maxY_scalarArray$$ || $cMaxY_nCurrentPointZ_y$$64$$ > $maxY_scalarArray$$) {
      $maxY_scalarArray$$ = $cMaxY_nCurrentPointZ_y$$64$$
    }
    if(!$minZ_p$$13$$ || $cMinZ_nCurrentPointLength_z$$30$$ < $minZ_p$$13$$) {
      $minZ_p$$13$$ = $cMinZ_nCurrentPointLength_z$$30$$
    }
    if(!$maxZ_n$$16$$ || $cMaxZ_nNextPointX_oldPoint$$ > $maxZ_n$$16$$) {
      $maxZ_n$$16$$ = $cMaxZ_nNextPointX_oldPoint$$
    }
    $fibers$$.push($currentPoint$$1_currentPoints_distance$$3_start$$11$$);
    $lengths$$5$$.push($length$$33$$)
  }
  $centerX_numberOfScalars$$ = ($centerZ_minX$$ + $_scalarIndex_maxX$$) / 2;
  $centerY_minY$$ = ($centerY_minY$$ + $maxY_scalarArray$$) / 2;
  $centerZ_minX$$ = ($minZ_p$$13$$ + $maxZ_n$$16$$) / 2;
  $maxY_scalarArray$$ = new Float32Array($_totalPoints_c$$28$$);
  $object$$30$$.$_points$ = $minZ_p$$13$$ = new $X$triplets$$($_totalPoints_c$$28$$);
  $object$$30$$.$_normals$ = $maxZ_n$$16$$ = new $X$triplets$$($_totalPoints_c$$28$$);
  $object$$30$$.$_colors$ = $_totalPoints_c$$28$$ = new $X$triplets$$($_totalPoints_c$$28$$);
  $_scalarIndex_maxX$$ = 0;
  window.console.log($numberOfFibers$$);
  for($i$$160_scalars$$ = 0;$i$$160_scalars$$ < $numberOfFibers$$;$i$$160_scalars$$++) {
    $_numPoints_points$$1$$ = $fibers$$[$i$$160_scalars$$];
    $_points_numberOfPoints$$2$$ = $_numPoints_points$$1$$.count;
    $length$$33$$ = $lengths$$5$$[$i$$160_scalars$$];
    $minLength_vox_to_ras_defined$$ = Math.min($minLength_vox_to_ras_defined$$, $length$$33$$);
    $maxLength$$ = Math.max($maxLength$$, $length$$33$$);
    for($cMinX_j$$16$$ = 0;$cMinX_j$$16$$ < $_points_numberOfPoints$$2$$ - 1;$cMinX_j$$16$$++) {
      $currentPoint$$1_currentPoints_distance$$3_start$$11$$ = $_numPoints_points$$1$$.get($cMinX_j$$16$$);
      $diff_end$$5_nextPoint$$1_offset$$16$$ = $_numPoints_points$$1$$.get($cMinX_j$$16$$ + 1);
      $minZ_p$$13$$.add($currentPoint$$1_currentPoints_distance$$3_start$$11$$[0], $currentPoint$$1_currentPoints_distance$$3_start$$11$$[1], $currentPoint$$1_currentPoints_distance$$3_start$$11$$[2]);
      $minZ_p$$13$$.add($diff_end$$5_nextPoint$$1_offset$$16$$[0], $diff_end$$5_nextPoint$$1_offset$$16$$[1], $diff_end$$5_nextPoint$$1_offset$$16$$[2]);
      var $cMaxX_nCurrentPointX_numPoints$$ = $currentPoint$$1_currentPoints_distance$$3_start$$11$$[0] - $centerX_numberOfScalars$$, $cMinY_nCurrentPointY_x$$90$$ = $currentPoint$$1_currentPoints_distance$$3_start$$11$$[1] - $centerY_minY$$, $cMaxY_nCurrentPointZ_y$$64$$ = $currentPoint$$1_currentPoints_distance$$3_start$$11$$[2] - $centerZ_minX$$, $cMinZ_nCurrentPointLength_z$$30$$ = Math.sqrt($cMaxX_nCurrentPointX_numPoints$$ * $cMaxX_nCurrentPointX_numPoints$$ + $cMinY_nCurrentPointY_x$$90$$ * 
      $cMinY_nCurrentPointY_x$$90$$ + $cMaxY_nCurrentPointZ_y$$64$$ * $cMaxY_nCurrentPointZ_y$$64$$), $cMaxZ_nNextPointX_oldPoint$$ = $diff_end$$5_nextPoint$$1_offset$$16$$[0] - $centerX_numberOfScalars$$, $nNextPointY$$ = $diff_end$$5_nextPoint$$1_offset$$16$$[1] - $centerY_minY$$, $nNextPointZ$$ = $diff_end$$5_nextPoint$$1_offset$$16$$[2] - $centerZ_minX$$, $nNextPointLength$$ = Math.sqrt($cMaxZ_nNextPointX_oldPoint$$ * $cMaxZ_nNextPointX_oldPoint$$ + $nNextPointY$$ * $nNextPointY$$ + $nNextPointZ$$ * 
      $nNextPointZ$$);
      $maxZ_n$$16$$.add($cMaxX_nCurrentPointX_numPoints$$ / $cMinZ_nCurrentPointLength_z$$30$$, $cMinY_nCurrentPointY_x$$90$$ / $cMinZ_nCurrentPointLength_z$$30$$, $cMaxY_nCurrentPointZ_y$$64$$ / $cMinZ_nCurrentPointLength_z$$30$$);
      $maxZ_n$$16$$.add($cMaxZ_nNextPointX_oldPoint$$ / $nNextPointLength$$, $nNextPointY$$ / $nNextPointLength$$, $nNextPointZ$$ / $nNextPointLength$$);
      $diff_end$$5_nextPoint$$1_offset$$16$$ = [Math.abs($diff_end$$5_nextPoint$$1_offset$$16$$[0] - $currentPoint$$1_currentPoints_distance$$3_start$$11$$[0]), Math.abs($diff_end$$5_nextPoint$$1_offset$$16$$[1] - $currentPoint$$1_currentPoints_distance$$3_start$$11$$[1]), Math.abs($diff_end$$5_nextPoint$$1_offset$$16$$[2] - $currentPoint$$1_currentPoints_distance$$3_start$$11$$[2])];
      $currentPoint$$1_currentPoints_distance$$3_start$$11$$ = Math.sqrt($diff_end$$5_nextPoint$$1_offset$$16$$[0] * $diff_end$$5_nextPoint$$1_offset$$16$$[0] + $diff_end$$5_nextPoint$$1_offset$$16$$[1] * $diff_end$$5_nextPoint$$1_offset$$16$$[1] + $diff_end$$5_nextPoint$$1_offset$$16$$[2] * $diff_end$$5_nextPoint$$1_offset$$16$$[2]);
      $diff_end$$5_nextPoint$$1_offset$$16$$[0] /= $currentPoint$$1_currentPoints_distance$$3_start$$11$$;
      $diff_end$$5_nextPoint$$1_offset$$16$$[1] /= $currentPoint$$1_currentPoints_distance$$3_start$$11$$;
      $diff_end$$5_nextPoint$$1_offset$$16$$[2] /= $currentPoint$$1_currentPoints_distance$$3_start$$11$$;
      $_totalPoints_c$$28$$.add($diff_end$$5_nextPoint$$1_offset$$16$$[0], $diff_end$$5_nextPoint$$1_offset$$16$$[1], $diff_end$$5_nextPoint$$1_offset$$16$$[2]);
      $_totalPoints_c$$28$$.add($diff_end$$5_nextPoint$$1_offset$$16$$[0], $diff_end$$5_nextPoint$$1_offset$$16$$[1], $diff_end$$5_nextPoint$$1_offset$$16$$[2]);
      $maxY_scalarArray$$[$_scalarIndex_maxX$$++] = $length$$33$$;
      $maxY_scalarArray$$[$_scalarIndex_maxX$$++] = $length$$33$$;
      $maxY_scalarArray$$[$_scalarIndex_maxX$$++] = $length$$33$$;
      $maxY_scalarArray$$[$_scalarIndex_maxX$$++] = $length$$33$$;
      $maxY_scalarArray$$[$_scalarIndex_maxX$$++] = $length$$33$$;
      $maxY_scalarArray$$[$_scalarIndex_maxX$$++] = $length$$33$$
    }
  }
  window.console.log($data$$59_header$$3_modifiedEvent$$15$$);
  window.console.log("HELLO!");
  window.console.log($data$$59_header$$3_modifiedEvent$$15$$);
  $object$$30$$.$_type$ = "LINES";
  $i$$160_scalars$$ = new $X$scalars$$;
  $i$$160_scalars$$.$_min$ = $minLength_vox_to_ras_defined$$;
  $i$$160_scalars$$.$_max$ = $maxLength$$;
  $i$$160_scalars$$.$_lowerThreshold$ = $minLength_vox_to_ras_defined$$;
  $i$$160_scalars$$.$_upperThreshold$ = $maxLength$$;
  $i$$160_scalars$$.$_glArray$ = $maxY_scalarArray$$;
  $i$$160_scalars$$.$_replaceMode$ = $JSCompiler_alias_FALSE$$;
  $i$$160_scalars$$.$_dirty$ = $JSCompiler_alias_TRUE$$;
  $object$$30$$.$_scalars$ = $i$$160_scalars$$;
  $minLength_vox_to_ras_defined$$ = $JSCompiler_alias_FALSE$$;
  for($i$$160_scalars$$ = 0;16 > $i$$160_scalars$$;$i$$160_scalars$$++) {
    if(0 != $data$$59_header$$3_modifiedEvent$$15$$.$vox_to_ras$[$i$$160_scalars$$]) {
      $minLength_vox_to_ras_defined$$ = $JSCompiler_alias_TRUE$$;
      break
    }
  }
  window.console.log($data$$59_header$$3_modifiedEvent$$15$$);
  $minLength_vox_to_ras_defined$$ == $JSCompiler_alias_FALSE$$ && ($data$$59_header$$3_modifiedEvent$$15$$.$vox_to_ras$[0] = $data$$59_header$$3_modifiedEvent$$15$$.$vox_to_ras$[5] = $data$$59_header$$3_modifiedEvent$$15$$.$vox_to_ras$[10] = $data$$59_header$$3_modifiedEvent$$15$$.$vox_to_ras$[15] = 1);
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $X$$.$matrix$.$transpose$($data$$59_header$$3_modifiedEvent$$15$$.$vox_to_ras$, $object$$30$$.$_transform$.$_matrix$);
  $data$$59_header$$3_modifiedEvent$$15$$ = new $X$event$ModifiedEvent$$;
  $data$$59_header$$3_modifiedEvent$$15$$.$_object$ = $object$$30$$;
  $data$$59_header$$3_modifiedEvent$$15$$.$_container$ = $container$$16$$;
  this.dispatchEvent($data$$59_header$$3_modifiedEvent$$15$$)
};
$goog$exportSymbol$$("X.parserTRK", $X$parserTRK$$);
$goog$exportSymbol$$("X.parserTRK.prototype.parse", $X$parserTRK$$.prototype.parse);
function $X$parserOBJ$$() {
  $X$parser$$.call(this);
  this.$_classname$ = "parserOBJ"
}
$goog$inherits$$($X$parserOBJ$$, $X$parser$$);
$X$parserOBJ$$.prototype.parse = function $$X$parserOBJ$$$$parse$($container$$17$$, $object$$31$$, $_length$$5_data$$60_modifiedEvent$$16$$) {
  $X$$.$TIMER$(this.$_classname$ + ".parse");
  this.$_data$ = $_length$$5_data$$60_modifiedEvent$$16$$;
  $_length$$5_data$$60_modifiedEvent$$16$$ = $_length$$5_data$$60_modifiedEvent$$16$$.byteLength;
  var $byteData$$1$$ = $JSCompiler_StaticMethods_scan$$(this, "uchar", $_length$$5_data$$60_modifiedEvent$$16$$), $_pts$$1$$ = [];
  $object$$31$$.$_points$ = new $X$triplets$$($_length$$5_data$$60_modifiedEvent$$16$$);
  $object$$31$$.$_normals$ = new $X$triplets$$($_length$$5_data$$60_modifiedEvent$$16$$);
  var $p$$14$$ = $object$$31$$.$_points$, $n$$17$$ = $object$$31$$.$_normals$, $_rangeStart$$3_norm$$1_p2$$2$$ = 0, $i$$161$$;
  for($i$$161$$ = 0;$i$$161$$ < $_length$$5_data$$60_modifiedEvent$$16$$;++$i$$161$$) {
    if(10 == $byteData$$1$$[$i$$161$$]) {
      var $_d_p3$$1_v3$$7$$ = $JSCompiler_StaticMethods_parseChars$$($byteData$$1$$, $_rangeStart$$3_norm$$1_p2$$2$$, $i$$161$$).replace(/\s{2,}/g, " ").split(" ");
      if("v" == $_d_p3$$1_v3$$7$$[0]) {
        $_pts$$1$$.push([parseFloat($_d_p3$$1_v3$$7$$[1]), parseFloat($_d_p3$$1_v3$$7$$[2]), parseFloat($_d_p3$$1_v3$$7$$[3])])
      }else {
        if("f" == $_d_p3$$1_v3$$7$$[0]) {
          var $p1$$2_v1$$21$$ = $_pts$$1$$[parseInt($_d_p3$$1_v3$$7$$[1], 10) - 1], $_rangeStart$$3_norm$$1_p2$$2$$ = $_pts$$1$$[parseInt($_d_p3$$1_v3$$7$$[2], 10) - 1], $_d_p3$$1_v3$$7$$ = $_pts$$1$$[parseInt($_d_p3$$1_v3$$7$$[3], 10) - 1];
          $p$$14$$.add($p1$$2_v1$$21$$[0], $p1$$2_v1$$21$$[1], $p1$$2_v1$$21$$[2]);
          $p$$14$$.add($_rangeStart$$3_norm$$1_p2$$2$$[0], $_rangeStart$$3_norm$$1_p2$$2$$[1], $_rangeStart$$3_norm$$1_p2$$2$$[2]);
          $p$$14$$.add($_d_p3$$1_v3$$7$$[0], $_d_p3$$1_v3$$7$$[1], $_d_p3$$1_v3$$7$$[2]);
          $p1$$2_v1$$21$$ = new $goog$math$Vec3$$($p1$$2_v1$$21$$[0], $p1$$2_v1$$21$$[1], $p1$$2_v1$$21$$[2]);
          $_d_p3$$1_v3$$7$$ = new $goog$math$Vec3$$($_d_p3$$1_v3$$7$$[0], $_d_p3$$1_v3$$7$$[1], $_d_p3$$1_v3$$7$$[2]);
          $_rangeStart$$3_norm$$1_p2$$2$$ = $goog$math$Vec3$cross$$((new $goog$math$Vec3$$($_rangeStart$$3_norm$$1_p2$$2$$[0], $_rangeStart$$3_norm$$1_p2$$2$$[1], $_rangeStart$$3_norm$$1_p2$$2$$[2])).$subtract$($p1$$2_v1$$21$$), $_d_p3$$1_v3$$7$$.$subtract$($p1$$2_v1$$21$$));
          $_rangeStart$$3_norm$$1_p2$$2$$.normalize();
          $n$$17$$.add($_rangeStart$$3_norm$$1_p2$$2$$.x, $_rangeStart$$3_norm$$1_p2$$2$$.y, $_rangeStart$$3_norm$$1_p2$$2$$.$z$);
          $n$$17$$.add($_rangeStart$$3_norm$$1_p2$$2$$.x, $_rangeStart$$3_norm$$1_p2$$2$$.y, $_rangeStart$$3_norm$$1_p2$$2$$.$z$);
          $n$$17$$.add($_rangeStart$$3_norm$$1_p2$$2$$.x, $_rangeStart$$3_norm$$1_p2$$2$$.y, $_rangeStart$$3_norm$$1_p2$$2$$.$z$)
        }
      }
      $_rangeStart$$3_norm$$1_p2$$2$$ = $i$$161$$ + 1
    }
  }
  $X$$.$TIMERSTOP$(this.$_classname$ + ".parse");
  $_length$$5_data$$60_modifiedEvent$$16$$ = new $X$event$ModifiedEvent$$;
  $_length$$5_data$$60_modifiedEvent$$16$$.$_object$ = $object$$31$$;
  $_length$$5_data$$60_modifiedEvent$$16$$.$_container$ = $container$$17$$;
  this.dispatchEvent($_length$$5_data$$60_modifiedEvent$$16$$)
};
$goog$exportSymbol$$("X.parserOBJ", $X$parserOBJ$$);
$goog$exportSymbol$$("X.parserOBJ.prototype.parse", $X$parserOBJ$$.prototype.parse);
function $X$loader$$() {
  $X$base$$.call(this);
  this.$_classname$ = "loader";
  this.$_jobs$ = new $goog$structs$Map$$;
  this.$_progress$ = 0
}
$goog$inherits$$($X$loader$$, $X$base$$);
function $JSCompiler_StaticMethods_addProgress$$($JSCompiler_StaticMethods_addProgress$self$$, $value$$70$$) {
  $JSCompiler_StaticMethods_addProgress$self$$.$_progress$ += $value$$70$$ / $JSCompiler_StaticMethods_addProgress$self$$.$_jobs$.$getCount$() / 3;
  $JSCompiler_StaticMethods_addProgress$self$$.$_progress$ = Math.min(1, $JSCompiler_StaticMethods_addProgress$self$$.$_progress$);
  var $progressEvent$$2$$ = new $X$event$ProgressEvent$$;
  $progressEvent$$2$$.$_value$ = $JSCompiler_StaticMethods_addProgress$self$$.$_progress$;
  $JSCompiler_StaticMethods_addProgress$self$$.dispatchEvent($progressEvent$$2$$)
}
function $JSCompiler_StaticMethods_checkFileFormat$$($container$$18_filepath$$1$$) {
  $container$$18_filepath$$1$$ = $container$$18_filepath$$1$$.$_file$.$_path$;
  var $extension$$ = $container$$18_filepath$$1$$.split(".").pop().toUpperCase();
  $extension$$ == $container$$18_filepath$$1$$.toUpperCase() && ($extension$$ = "");
  $extension$$ in $X$loader$extensions$$ || $JSCompiler_alias_THROW$$(Error("The " + $extension$$ + " file format is not supported."));
  return[$container$$18_filepath$$1$$, $extension$$, $X$loader$extensions$$[$extension$$][0], $X$loader$extensions$$[$extension$$][1], $X$loader$extensions$$[$extension$$][2]]
}
$X$loader$$.prototype.load = function $$X$loader$$$$load$($container$$19$$, $object$$32$$) {
  (!$container$$19$$ || !$object$$32$$) && $JSCompiler_alias_THROW$$(Error("No container or object to load."));
  if(!$goog$structs$Map$hasKey_$$(this.$_jobs$.$map_$, $container$$19$$.$_id$) || this.$_jobs$.get($container$$19$$.$_id$)) {
    this.$_jobs$.set($container$$19$$.$_id$, $JSCompiler_alias_FALSE$$);
    var $filepath$$2$$ = $JSCompiler_StaticMethods_checkFileFormat$$($container$$19$$)[0];
    if($container$$19$$.$_filedata$ != $JSCompiler_alias_NULL$$) {
      this.parse($JSCompiler_alias_NULL$$, $container$$19$$, $object$$32$$)
    }else {
      var $request$$ = new XMLHttpRequest;
      $goog$events$listen$$($request$$, "abort", this.$failed$.bind(this, $request$$, $container$$19$$, $object$$32$$));
      $goog$events$listen$$($request$$, "error", this.$failed$.bind(this, $request$$, $container$$19$$, $object$$32$$));
      $goog$events$listen$$($request$$, "load", this.parse.bind(this, $request$$, $container$$19$$, $object$$32$$));
      $request$$.open("GET", $filepath$$2$$, $JSCompiler_alias_TRUE$$);
      $request$$.responseType = "arraybuffer";
      $request$$.send($JSCompiler_alias_NULL$$)
    }
  }
};
$X$loader$$.prototype.parse = function $$X$loader$$$$parse$($request$$1$$, $container$$20$$, $object$$33$$) {
  $JSCompiler_StaticMethods_addProgress$$(this, 1);
  setTimeout(function() {
    var $_checkresult$$1__parser$$ = $JSCompiler_StaticMethods_checkFileFormat$$($container$$20$$), $flags$$1$$ = $_checkresult$$1__parser$$[3], $_checkresult$$1__parser$$ = new $_checkresult$$1__parser$$[2];
    $goog$events$listenOnce$$($_checkresult$$1__parser$$, $X$event$events$MODIFIED$$, this.complete.bind(this));
    var $_data$$9$$ = $container$$20$$.$_filedata$;
    $_data$$9$$ == $JSCompiler_alias_NULL$$ && ($_data$$9$$ = $request$$1$$.response, $container$$20$$.$_filedata$ = $_data$$9$$);
    $_checkresult$$1__parser$$.parse($container$$20$$, $object$$33$$, $_data$$9$$, $flags$$1$$)
  }.bind(this), 100)
};
$X$loader$$.prototype.complete = function $$X$loader$$$$complete$($event$$3$$) {
  $JSCompiler_StaticMethods_addProgress$$(this, 1);
  setTimeout(function() {
    var $container$$21$$ = $event$$3$$.$_container$, $object$$34$$ = $event$$3$$.$_object$;
    $container$$21$$.$_file$.$_dirty$ = $JSCompiler_alias_FALSE$$;
    $container$$21$$.$_dirty$ = $JSCompiler_alias_TRUE$$;
    $object$$34$$.$modified$();
    this.$_jobs$.set($container$$21$$.$_id$, $JSCompiler_alias_TRUE$$)
  }.bind(this), 100)
};
$X$loader$$.prototype.$failed$ = function $$X$loader$$$$$failed$$($request$$2$$, $container$$22$$, $object$$35$$) {
  $JSCompiler_alias_THROW$$(Error("Loading failed: ", $container$$22$$, $object$$35$$))
};
var $X$loader$extensions$$ = {OBJ:[$X$parserOBJ$$, $JSCompiler_alias_NULL$$], OFF:[$X$parserOFF$$, $JSCompiler_alias_NULL$$], STL:[$X$parserSTL$$, $JSCompiler_alias_NULL$$], VTK:[$X$parserVTK$$, $JSCompiler_alias_NULL$$], TRK:[$X$parserTRK$$, $JSCompiler_alias_NULL$$], MRC:[$X$parserMRC$$, $JSCompiler_alias_NULL$$], ST:[$X$parserMRC$$, $JSCompiler_alias_NULL$$], FSM:[$X$parserFSM$$, $JSCompiler_alias_NULL$$], INFLATED:[$X$parserFSM$$, $JSCompiler_alias_NULL$$], SMOOTHWM:[$X$parserFSM$$, $JSCompiler_alias_NULL$$], 
SPHERE:[$X$parserFSM$$, $JSCompiler_alias_NULL$$], PIAL:[$X$parserFSM$$, $JSCompiler_alias_NULL$$], ORIG:[$X$parserFSM$$, $JSCompiler_alias_NULL$$], NRRD:[$X$parserNRRD$$, $JSCompiler_alias_NULL$$], NII:[$X$parserNII$$, $JSCompiler_alias_NULL$$], GZ:[$X$parserNII$$, $JSCompiler_alias_NULL$$], DCM:[$X$parserDCM$$, $JSCompiler_alias_NULL$$], DICOM:[$X$parserDCM$$, $JSCompiler_alias_NULL$$], "":[$X$parserDCM$$, $JSCompiler_alias_NULL$$], CRV:[$X$parserCRV$$, $JSCompiler_alias_NULL$$], LABEL:[$X$parserLBL$$, 
$JSCompiler_alias_NULL$$], MGH:[$X$parserMGZ$$, $JSCompiler_alias_FALSE$$], MGZ:[$X$parserMGZ$$, $JSCompiler_alias_TRUE$$], RAW:[$X$parserRAW$$, $JSCompiler_alias_FALSE$$], RZ:[$X$parserRAW$$, $JSCompiler_alias_TRUE$$], TXT:[$X$parserLUT$$, $JSCompiler_alias_NULL$$], LUT:[$X$parserLUT$$, $JSCompiler_alias_NULL$$], PNG:[$X$parserIMAGE$$, "png"], JPG:[$X$parserIMAGE$$, "jpeg"], JPEG:[$X$parserIMAGE$$, "jpeg"], GIF:[$X$parserIMAGE$$, "gif"]};
var $goog$dom$defaultDomHelper_$$;
function $goog$dom$classes$add$$($element$$10$$, $var_args$$57$$) {
  var $className$$inline_500_classes$$;
  $className$$inline_500_classes$$ = $element$$10$$.className;
  $className$$inline_500_classes$$ = $goog$isString$$($className$$inline_500_classes$$) && $className$$inline_500_classes$$.match(/\S+/g) || [];
  for(var $args$$4_args$$inline_503$$ = $goog$array$slice$$(arguments, 1), $expectedCount$$ = $className$$inline_500_classes$$.length + $args$$4_args$$inline_503$$.length, $classes$$inline_502$$ = $className$$inline_500_classes$$, $i$$inline_504$$ = 0;$i$$inline_504$$ < $args$$4_args$$inline_503$$.length;$i$$inline_504$$++) {
    0 <= $goog$array$indexOf$$($classes$$inline_502$$, $args$$4_args$$inline_503$$[$i$$inline_504$$]) || $classes$$inline_502$$.push($args$$4_args$$inline_503$$[$i$$inline_504$$])
  }
  $element$$10$$.className = $className$$inline_500_classes$$.join(" ");
  return $className$$inline_500_classes$$.length == $expectedCount$$
}
;function $goog$math$Size$$($width$$15$$, $height$$13$$) {
  this.width = $width$$15$$;
  this.height = $height$$13$$
}
$JSCompiler_prototypeAlias$$ = $goog$math$Size$$.prototype;
$JSCompiler_prototypeAlias$$.$clone$ = function $$JSCompiler_prototypeAlias$$$$clone$$() {
  return new $goog$math$Size$$(this.width, this.height)
};
$JSCompiler_prototypeAlias$$.ceil = function $$JSCompiler_prototypeAlias$$$ceil$() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
$JSCompiler_prototypeAlias$$.floor = function $$JSCompiler_prototypeAlias$$$floor$() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
$JSCompiler_prototypeAlias$$.round = function $$JSCompiler_prototypeAlias$$$round$() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
$JSCompiler_prototypeAlias$$.scale = function $$JSCompiler_prototypeAlias$$$scale$($sx$$2$$, $opt_sy$$1$$) {
  var $sy$$2$$ = $goog$isNumber$$($opt_sy$$1$$) ? $opt_sy$$1$$ : $sx$$2$$;
  this.width *= $sx$$2$$;
  this.height *= $sy$$2$$;
  return this
};
var $goog$dom$BrowserFeature$CAN_ADD_NAME_OR_TYPE_ATTRIBUTES$$ = !$goog$userAgent$IE$$ || $goog$userAgent$IE$$ && 9 <= $goog$userAgent$DOCUMENT_MODE$$;
!$goog$userAgent$GECKO$$ && !$goog$userAgent$IE$$ || $goog$userAgent$IE$$ && $goog$userAgent$IE$$ && 9 <= $goog$userAgent$DOCUMENT_MODE$$ || $goog$userAgent$GECKO$$ && $goog$userAgent$isVersionOrHigher$$("1.9.1");
$goog$userAgent$IE$$ && $goog$userAgent$isVersionOrHigher$$("9");
function $goog$math$Coordinate$$($opt_x$$1$$, $opt_y$$1$$) {
  this.x = $goog$isDef$$($opt_x$$1$$) ? $opt_x$$1$$ : 0;
  this.y = $goog$isDef$$($opt_y$$1$$) ? $opt_y$$1$$ : 0
}
$JSCompiler_prototypeAlias$$ = $goog$math$Coordinate$$.prototype;
$JSCompiler_prototypeAlias$$.$clone$ = function $$JSCompiler_prototypeAlias$$$$clone$$() {
  return new $goog$math$Coordinate$$(this.x, this.y)
};
function $goog$math$Coordinate$difference$$($a$$57$$, $b$$41$$) {
  return new $goog$math$Coordinate$$($a$$57$$.x - $b$$41$$.x, $a$$57$$.y - $b$$41$$.y)
}
$JSCompiler_prototypeAlias$$.ceil = function $$JSCompiler_prototypeAlias$$$ceil$() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this
};
$JSCompiler_prototypeAlias$$.floor = function $$JSCompiler_prototypeAlias$$$floor$() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this
};
$JSCompiler_prototypeAlias$$.round = function $$JSCompiler_prototypeAlias$$$round$() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this
};
$JSCompiler_prototypeAlias$$.translate = function $$JSCompiler_prototypeAlias$$$translate$($tx$$, $opt_ty$$) {
  $tx$$ instanceof $goog$math$Coordinate$$ ? (this.x += $tx$$.x, this.y += $tx$$.y) : (this.x += $tx$$, $goog$isNumber$$($opt_ty$$) && (this.y += $opt_ty$$));
  return this
};
$JSCompiler_prototypeAlias$$.scale = function $$JSCompiler_prototypeAlias$$$scale$($sx$$3$$, $opt_sy$$2$$) {
  var $sy$$3$$ = $goog$isNumber$$($opt_sy$$2$$) ? $opt_sy$$2$$ : $sx$$3$$;
  this.x *= $sx$$3$$;
  this.y *= $sy$$3$$;
  return this
};
function $goog$dom$getDomHelper$$($opt_element$$10$$) {
  return $opt_element$$10$$ ? new $goog$dom$DomHelper$$($goog$dom$getOwnerDocument$$($opt_element$$10$$)) : $goog$dom$defaultDomHelper_$$ || ($goog$dom$defaultDomHelper_$$ = new $goog$dom$DomHelper$$)
}
function $goog$dom$getElement$$($element$$17$$) {
  return $goog$isString$$($element$$17$$) ? document.getElementById($element$$17$$) : $element$$17$$
}
var $goog$dom$DIRECT_ATTRIBUTE_MAP_$$ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
function $goog$dom$createDom$$($tagName$$2$$, $opt_attributes$$, $var_args$$59$$) {
  return $goog$dom$createDom_$$(document, arguments)
}
function $goog$dom$createDom_$$($doc$$12$$, $args$$7$$) {
  var $i$$inline_519_tagName$$3_tagNameArr$$ = $args$$7$$[0], $attributes_childHandler$$inline_518$$ = $args$$7$$[1];
  if(!$goog$dom$BrowserFeature$CAN_ADD_NAME_OR_TYPE_ATTRIBUTES$$ && $attributes_childHandler$$inline_518$$ && ($attributes_childHandler$$inline_518$$.name || $attributes_childHandler$$inline_518$$.type)) {
    $i$$inline_519_tagName$$3_tagNameArr$$ = ["<", $i$$inline_519_tagName$$3_tagNameArr$$];
    $attributes_childHandler$$inline_518$$.name && $i$$inline_519_tagName$$3_tagNameArr$$.push(' name="', $goog$string$htmlEscape$$($attributes_childHandler$$inline_518$$.name), '"');
    if($attributes_childHandler$$inline_518$$.type) {
      $i$$inline_519_tagName$$3_tagNameArr$$.push(' type="', $goog$string$htmlEscape$$($attributes_childHandler$$inline_518$$.type), '"');
      var $JSCompiler_temp_const$$760_clone$$2$$ = {};
      $goog$object$extend$$($JSCompiler_temp_const$$760_clone$$2$$, $attributes_childHandler$$inline_518$$);
      delete $JSCompiler_temp_const$$760_clone$$2$$.type;
      $attributes_childHandler$$inline_518$$ = $JSCompiler_temp_const$$760_clone$$2$$
    }
    $i$$inline_519_tagName$$3_tagNameArr$$.push(">");
    $i$$inline_519_tagName$$3_tagNameArr$$ = $i$$inline_519_tagName$$3_tagNameArr$$.join("")
  }
  var $element$$19$$ = $doc$$12$$.createElement($i$$inline_519_tagName$$3_tagNameArr$$);
  $attributes_childHandler$$inline_518$$ && ($goog$isString$$($attributes_childHandler$$inline_518$$) ? $element$$19$$.className = $attributes_childHandler$$inline_518$$ : $goog$isArray$$($attributes_childHandler$$inline_518$$) ? $goog$dom$classes$add$$.apply($JSCompiler_alias_NULL$$, [$element$$19$$].concat($attributes_childHandler$$inline_518$$)) : $goog$object$forEach$$($attributes_childHandler$$inline_518$$, function($val$$inline_511$$, $key$$inline_512$$) {
    "style" == $key$$inline_512$$ ? $element$$19$$.style.cssText = $val$$inline_511$$ : "class" == $key$$inline_512$$ ? $element$$19$$.className = $val$$inline_511$$ : "for" == $key$$inline_512$$ ? $element$$19$$.htmlFor = $val$$inline_511$$ : $key$$inline_512$$ in $goog$dom$DIRECT_ATTRIBUTE_MAP_$$ ? $element$$19$$.setAttribute($goog$dom$DIRECT_ATTRIBUTE_MAP_$$[$key$$inline_512$$], $val$$inline_511$$) : 0 == $key$$inline_512$$.lastIndexOf("aria-", 0) || 0 == $key$$inline_512$$.lastIndexOf("data-", 
    0) ? $element$$19$$.setAttribute($key$$inline_512$$, $val$$inline_511$$) : $element$$19$$[$key$$inline_512$$] = $val$$inline_511$$
  }));
  if(2 < $args$$7$$.length) {
    $attributes_childHandler$$inline_518$$ = function $$attributes_childHandler$$inline_518$$$($child$$inline_521$$) {
      $child$$inline_521$$ && $element$$19$$.appendChild($goog$isString$$($child$$inline_521$$) ? $doc$$12$$.createTextNode($child$$inline_521$$) : $child$$inline_521$$)
    };
    for($i$$inline_519_tagName$$3_tagNameArr$$ = 2;$i$$inline_519_tagName$$3_tagNameArr$$ < $args$$7$$.length;$i$$inline_519_tagName$$3_tagNameArr$$++) {
      var $JSCompiler_temp$$765_arg$$inline_520_object$$inline_817$$ = $args$$7$$[$i$$inline_519_tagName$$3_tagNameArr$$];
      if($goog$isArrayLike$$($JSCompiler_temp$$765_arg$$inline_520_object$$inline_817$$) && !($goog$isObject$$($JSCompiler_temp$$765_arg$$inline_520_object$$inline_817$$) && 0 < $JSCompiler_temp$$765_arg$$inline_520_object$$inline_817$$.nodeType)) {
        var $JSCompiler_temp_const$$760_clone$$2$$ = $goog$array$forEach$$, $JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$;
        a: {
          if(($JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$ = $JSCompiler_temp$$765_arg$$inline_520_object$$inline_817$$) && "number" == typeof $JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$.length) {
            if($goog$isObject$$($JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$)) {
              $JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$ = "function" == typeof $JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$.item || "string" == typeof $JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$.item;
              break a
            }
            if($goog$isFunction$$($JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$)) {
              $JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$ = "function" == typeof $JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$.item;
              break a
            }
          }
          $JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$ = $JSCompiler_alias_FALSE$$
        }
        if($JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$) {
          if($JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$ = $JSCompiler_temp$$765_arg$$inline_520_object$$inline_817$$.length, 0 < $JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$) {
            for(var $rv$$inline_819$$ = Array($JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$), $i$$inline_820$$ = 0;$i$$inline_820$$ < $JSCompiler_inline_result$$761_length$$inline_818_val$$inline_815$$;$i$$inline_820$$++) {
              $rv$$inline_819$$[$i$$inline_820$$] = $JSCompiler_temp$$765_arg$$inline_520_object$$inline_817$$[$i$$inline_820$$]
            }
            $JSCompiler_temp$$765_arg$$inline_520_object$$inline_817$$ = $rv$$inline_819$$
          }else {
            $JSCompiler_temp$$765_arg$$inline_520_object$$inline_817$$ = []
          }
        }
        $JSCompiler_temp_const$$760_clone$$2$$($JSCompiler_temp$$765_arg$$inline_520_object$$inline_817$$, $attributes_childHandler$$inline_518$$)
      }else {
        $attributes_childHandler$$inline_518$$($JSCompiler_temp$$765_arg$$inline_520_object$$inline_817$$)
      }
    }
  }
  return $element$$19$$
}
function $goog$dom$removeNode$$($node$$5$$) {
  $node$$5$$ && $node$$5$$.parentNode && $node$$5$$.parentNode.removeChild($node$$5$$)
}
function $goog$dom$getNextElementNode_$$($node$$11$$) {
  for(;$node$$11$$ && 1 != $node$$11$$.nodeType;) {
    $node$$11$$ = $node$$11$$.nextSibling
  }
  return $node$$11$$
}
function $goog$dom$contains$$($parent$$18$$, $descendant$$) {
  if($parent$$18$$.contains && 1 == $descendant$$.nodeType) {
    return $parent$$18$$ == $descendant$$ || $parent$$18$$.contains($descendant$$)
  }
  if("undefined" != typeof $parent$$18$$.compareDocumentPosition) {
    return $parent$$18$$ == $descendant$$ || Boolean($parent$$18$$.compareDocumentPosition($descendant$$) & 16)
  }
  for(;$descendant$$ && $parent$$18$$ != $descendant$$;) {
    $descendant$$ = $descendant$$.parentNode
  }
  return $descendant$$ == $parent$$18$$
}
function $goog$dom$getOwnerDocument$$($node$$16$$) {
  return 9 == $node$$16$$.nodeType ? $node$$16$$ : $node$$16$$.ownerDocument || $node$$16$$.document
}
function $goog$dom$DomHelper$$($opt_document$$) {
  this.$document_$ = $opt_document$$ || $goog$global$$.document || document
}
$JSCompiler_prototypeAlias$$ = $goog$dom$DomHelper$$.prototype;
$JSCompiler_prototypeAlias$$.$getDomHelper$ = $goog$dom$getDomHelper$$;
$JSCompiler_prototypeAlias$$.$getElement$ = function $$JSCompiler_prototypeAlias$$$$getElement$$($element$$30$$) {
  return $goog$isString$$($element$$30$$) ? this.$document_$.getElementById($element$$30$$) : $element$$30$$
};
$JSCompiler_prototypeAlias$$.$$$ = $goog$dom$DomHelper$$.prototype.$getElement$;
$JSCompiler_prototypeAlias$$.$createDom$ = function $$JSCompiler_prototypeAlias$$$$createDom$$($tagName$$5$$, $opt_attributes$$1$$, $var_args$$62$$) {
  return $goog$dom$createDom_$$(this.$document_$, arguments)
};
$JSCompiler_prototypeAlias$$.createElement = function $$JSCompiler_prototypeAlias$$$createElement$($name$$62$$) {
  return this.$document_$.createElement($name$$62$$)
};
$JSCompiler_prototypeAlias$$.createTextNode = function $$JSCompiler_prototypeAlias$$$createTextNode$($content$$1$$) {
  return this.$document_$.createTextNode(String($content$$1$$))
};
function $JSCompiler_StaticMethods_isCss1CompatMode$$($JSCompiler_StaticMethods_isCss1CompatMode$self$$) {
  return"CSS1Compat" == $JSCompiler_StaticMethods_isCss1CompatMode$self$$.$document_$.compatMode
}
function $JSCompiler_StaticMethods_getDocumentScroll$$($JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_524$$) {
  var $doc$$inline_523_win$$inline_525$$ = $JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_524$$.$document_$;
  $JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_524$$ = !$goog$userAgent$WEBKIT$$ && "CSS1Compat" == $doc$$inline_523_win$$inline_525$$.compatMode ? $doc$$inline_523_win$$inline_525$$.documentElement : $doc$$inline_523_win$$inline_525$$.body;
  $doc$$inline_523_win$$inline_525$$ = $doc$$inline_523_win$$inline_525$$.parentWindow || $doc$$inline_523_win$$inline_525$$.defaultView;
  return $goog$userAgent$IE$$ && $goog$userAgent$isVersionOrHigher$$("10") && $doc$$inline_523_win$$inline_525$$.pageYOffset != $JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_524$$.scrollTop ? new $goog$math$Coordinate$$($JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_524$$.scrollLeft, $JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_524$$.scrollTop) : new $goog$math$Coordinate$$($doc$$inline_523_win$$inline_525$$.pageXOffset || $JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_524$$.scrollLeft, 
  $doc$$inline_523_win$$inline_525$$.pageYOffset || $JSCompiler_StaticMethods_getDocumentScroll$self_el$$inline_524$$.scrollTop)
}
$JSCompiler_prototypeAlias$$.appendChild = function $$JSCompiler_prototypeAlias$$$appendChild$($parent$$12$$, $child$$2$$) {
  $parent$$12$$.appendChild($child$$2$$)
};
$JSCompiler_prototypeAlias$$.contains = $goog$dom$contains$$;
function $goog$math$Box$$($top$$4$$, $right$$8$$, $bottom$$3$$, $left$$7$$) {
  this.top = $top$$4$$;
  this.right = $right$$8$$;
  this.bottom = $bottom$$3$$;
  this.left = $left$$7$$
}
$JSCompiler_prototypeAlias$$ = $goog$math$Box$$.prototype;
$JSCompiler_prototypeAlias$$.$clone$ = function $$JSCompiler_prototypeAlias$$$$clone$$() {
  return new $goog$math$Box$$(this.top, this.right, this.bottom, this.left)
};
$JSCompiler_prototypeAlias$$.contains = function $$JSCompiler_prototypeAlias$$$contains$($other$$5$$) {
  return!this || !$other$$5$$ ? $JSCompiler_alias_FALSE$$ : $other$$5$$ instanceof $goog$math$Box$$ ? $other$$5$$.left >= this.left && $other$$5$$.right <= this.right && $other$$5$$.top >= this.top && $other$$5$$.bottom <= this.bottom : $other$$5$$.x >= this.left && $other$$5$$.x <= this.right && $other$$5$$.y >= this.top && $other$$5$$.y <= this.bottom
};
$JSCompiler_prototypeAlias$$.ceil = function $$JSCompiler_prototypeAlias$$$ceil$() {
  this.top = Math.ceil(this.top);
  this.right = Math.ceil(this.right);
  this.bottom = Math.ceil(this.bottom);
  this.left = Math.ceil(this.left);
  return this
};
$JSCompiler_prototypeAlias$$.floor = function $$JSCompiler_prototypeAlias$$$floor$() {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this
};
$JSCompiler_prototypeAlias$$.round = function $$JSCompiler_prototypeAlias$$$round$() {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this
};
$JSCompiler_prototypeAlias$$.translate = function $$JSCompiler_prototypeAlias$$$translate$($tx$$1$$, $opt_ty$$1$$) {
  $tx$$1$$ instanceof $goog$math$Coordinate$$ ? (this.left += $tx$$1$$.x, this.right += $tx$$1$$.x, this.top += $tx$$1$$.y, this.bottom += $tx$$1$$.y) : (this.left += $tx$$1$$, this.right += $tx$$1$$, $goog$isNumber$$($opt_ty$$1$$) && (this.top += $opt_ty$$1$$, this.bottom += $opt_ty$$1$$));
  return this
};
$JSCompiler_prototypeAlias$$.scale = function $$JSCompiler_prototypeAlias$$$scale$($sx$$4$$, $opt_sy$$3$$) {
  var $sy$$4$$ = $goog$isNumber$$($opt_sy$$3$$) ? $opt_sy$$3$$ : $sx$$4$$;
  this.left *= $sx$$4$$;
  this.right *= $sx$$4$$;
  this.top *= $sy$$4$$;
  this.bottom *= $sy$$4$$;
  return this
};
function $goog$math$Rect$$($x$$93$$, $y$$67$$, $w$$10$$, $h$$4$$) {
  this.left = $x$$93$$;
  this.top = $y$$67$$;
  this.width = $w$$10$$;
  this.height = $h$$4$$
}
$JSCompiler_prototypeAlias$$ = $goog$math$Rect$$.prototype;
$JSCompiler_prototypeAlias$$.$clone$ = function $$JSCompiler_prototypeAlias$$$$clone$$() {
  return new $goog$math$Rect$$(this.left, this.top, this.width, this.height)
};
$JSCompiler_prototypeAlias$$.$intersection$ = function $$JSCompiler_prototypeAlias$$$$intersection$$($rect_y1$$6$$) {
  var $x0$$4$$ = Math.max(this.left, $rect_y1$$6$$.left), $x1$$6$$ = Math.min(this.left + this.width, $rect_y1$$6$$.left + $rect_y1$$6$$.width);
  if($x0$$4$$ <= $x1$$6$$) {
    var $y0$$4$$ = Math.max(this.top, $rect_y1$$6$$.top);
    $rect_y1$$6$$ = Math.min(this.top + this.height, $rect_y1$$6$$.top + $rect_y1$$6$$.height);
    if($y0$$4$$ <= $rect_y1$$6$$) {
      return this.left = $x0$$4$$, this.top = $y0$$4$$, this.width = $x1$$6$$ - $x0$$4$$, this.height = $rect_y1$$6$$ - $y0$$4$$, $JSCompiler_alias_TRUE$$
    }
  }
  return $JSCompiler_alias_FALSE$$
};
$JSCompiler_prototypeAlias$$.contains = function $$JSCompiler_prototypeAlias$$$contains$($another$$) {
  return $another$$ instanceof $goog$math$Rect$$ ? this.left <= $another$$.left && this.left + this.width >= $another$$.left + $another$$.width && this.top <= $another$$.top && this.top + this.height >= $another$$.top + $another$$.height : $another$$.x >= this.left && $another$$.x <= this.left + this.width && $another$$.y >= this.top && $another$$.y <= this.top + this.height
};
function $JSCompiler_StaticMethods_squaredDistance$$($JSCompiler_StaticMethods_squaredDistance$self$$, $point$$) {
  var $dx$$8$$ = $point$$.x < $JSCompiler_StaticMethods_squaredDistance$self$$.left ? $JSCompiler_StaticMethods_squaredDistance$self$$.left - $point$$.x : Math.max($point$$.x - ($JSCompiler_StaticMethods_squaredDistance$self$$.left + $JSCompiler_StaticMethods_squaredDistance$self$$.width), 0), $dy$$8$$ = $point$$.y < $JSCompiler_StaticMethods_squaredDistance$self$$.top ? $JSCompiler_StaticMethods_squaredDistance$self$$.top - $point$$.y : Math.max($point$$.y - ($JSCompiler_StaticMethods_squaredDistance$self$$.top + 
  $JSCompiler_StaticMethods_squaredDistance$self$$.height), 0);
  return $dx$$8$$ * $dx$$8$$ + $dy$$8$$ * $dy$$8$$
}
$JSCompiler_prototypeAlias$$.$distance$ = function $$JSCompiler_prototypeAlias$$$$distance$$($point$$1$$) {
  return Math.sqrt($JSCompiler_StaticMethods_squaredDistance$$(this, $point$$1$$))
};
$JSCompiler_prototypeAlias$$.ceil = function $$JSCompiler_prototypeAlias$$$ceil$() {
  this.left = Math.ceil(this.left);
  this.top = Math.ceil(this.top);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
$JSCompiler_prototypeAlias$$.floor = function $$JSCompiler_prototypeAlias$$$floor$() {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
$JSCompiler_prototypeAlias$$.round = function $$JSCompiler_prototypeAlias$$$round$() {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
$JSCompiler_prototypeAlias$$.translate = function $$JSCompiler_prototypeAlias$$$translate$($tx$$2$$, $opt_ty$$2$$) {
  $tx$$2$$ instanceof $goog$math$Coordinate$$ ? (this.left += $tx$$2$$.x, this.top += $tx$$2$$.y) : (this.left += $tx$$2$$, $goog$isNumber$$($opt_ty$$2$$) && (this.top += $opt_ty$$2$$));
  return this
};
$JSCompiler_prototypeAlias$$.scale = function $$JSCompiler_prototypeAlias$$$scale$($sx$$5$$, $opt_sy$$4$$) {
  var $sy$$5$$ = $goog$isNumber$$($opt_sy$$4$$) ? $opt_sy$$4$$ : $sx$$5$$;
  this.left *= $sx$$5$$;
  this.width *= $sx$$5$$;
  this.top *= $sy$$5$$;
  this.height *= $sy$$5$$;
  return this
};
function $goog$style$getComputedStyle$$($element$$36$$, $property$$4$$) {
  var $doc$$24_styles$$ = $goog$dom$getOwnerDocument$$($element$$36$$);
  return $doc$$24_styles$$.defaultView && $doc$$24_styles$$.defaultView.getComputedStyle && ($doc$$24_styles$$ = $doc$$24_styles$$.defaultView.getComputedStyle($element$$36$$, $JSCompiler_alias_NULL$$)) ? $doc$$24_styles$$[$property$$4$$] || $doc$$24_styles$$.getPropertyValue($property$$4$$) || "" : ""
}
function $goog$style$getStyle_$$($element$$38$$, $style$$5$$) {
  return $goog$style$getComputedStyle$$($element$$38$$, $style$$5$$) || ($element$$38$$.currentStyle ? $element$$38$$.currentStyle[$style$$5$$] : $JSCompiler_alias_NULL$$) || $element$$38$$.style && $element$$38$$.style[$style$$5$$]
}
function $goog$style$getClientViewportElement$$($doc$$25_opt_node$$) {
  $doc$$25_opt_node$$ = $doc$$25_opt_node$$ ? $goog$dom$getOwnerDocument$$($doc$$25_opt_node$$) : document;
  return $goog$userAgent$IE$$ && !($goog$userAgent$IE$$ && 9 <= $goog$userAgent$DOCUMENT_MODE$$) && !$JSCompiler_StaticMethods_isCss1CompatMode$$($goog$dom$getDomHelper$$($doc$$25_opt_node$$)) ? $doc$$25_opt_node$$.body : $doc$$25_opt_node$$.documentElement
}
function $goog$style$getBoundingClientRect_$$($doc$$27_el$$5$$) {
  var $rect$$4$$ = $doc$$27_el$$5$$.getBoundingClientRect();
  $goog$userAgent$IE$$ && ($doc$$27_el$$5$$ = $doc$$27_el$$5$$.ownerDocument, $rect$$4$$.left -= $doc$$27_el$$5$$.documentElement.clientLeft + $doc$$27_el$$5$$.body.clientLeft, $rect$$4$$.top -= $doc$$27_el$$5$$.documentElement.clientTop + $doc$$27_el$$5$$.body.clientTop);
  return $rect$$4$$
}
function $goog$style$getOffsetParent$$($element$$47_parent$$21$$) {
  if($goog$userAgent$IE$$ && !($goog$userAgent$IE$$ && 8 <= $goog$userAgent$DOCUMENT_MODE$$)) {
    return $element$$47_parent$$21$$.offsetParent
  }
  var $doc$$28$$ = $goog$dom$getOwnerDocument$$($element$$47_parent$$21$$), $positionStyle$$ = $goog$style$getStyle_$$($element$$47_parent$$21$$, "position"), $skipStatic$$ = "fixed" == $positionStyle$$ || "absolute" == $positionStyle$$;
  for($element$$47_parent$$21$$ = $element$$47_parent$$21$$.parentNode;$element$$47_parent$$21$$ && $element$$47_parent$$21$$ != $doc$$28$$;$element$$47_parent$$21$$ = $element$$47_parent$$21$$.parentNode) {
    if($positionStyle$$ = $goog$style$getStyle_$$($element$$47_parent$$21$$, "position"), $skipStatic$$ = $skipStatic$$ && "static" == $positionStyle$$ && $element$$47_parent$$21$$ != $doc$$28$$.documentElement && $element$$47_parent$$21$$ != $doc$$28$$.body, !$skipStatic$$ && ($element$$47_parent$$21$$.scrollWidth > $element$$47_parent$$21$$.clientWidth || $element$$47_parent$$21$$.scrollHeight > $element$$47_parent$$21$$.clientHeight || "fixed" == $positionStyle$$ || "absolute" == $positionStyle$$ || 
    "relative" == $positionStyle$$)) {
      return $element$$47_parent$$21$$
    }
  }
  return $JSCompiler_alias_NULL$$
}
function $goog$style$getVisibleRectForElement$$($el$$6_element$$48$$) {
  for(var $visibleRect$$ = new $goog$math$Box$$(0, Infinity, Infinity, 0), $doc$$inline_900_dom_el$$inline_901_winSize$$ = $goog$dom$getDomHelper$$($el$$6_element$$48$$), $body$$3_scrollX$$ = $doc$$inline_900_dom_el$$inline_901_winSize$$.$document_$.body, $documentElement$$1$$ = $doc$$inline_900_dom_el$$inline_901_winSize$$.$document_$.documentElement, $scrollEl_scrollY$$ = !$goog$userAgent$WEBKIT$$ && "CSS1Compat" == $doc$$inline_900_dom_el$$inline_901_winSize$$.$document_$.compatMode ? $doc$$inline_900_dom_el$$inline_901_winSize$$.$document_$.documentElement : 
  $doc$$inline_900_dom_el$$inline_901_winSize$$.$document_$.body;$el$$6_element$$48$$ = $goog$style$getOffsetParent$$($el$$6_element$$48$$);) {
    if((!$goog$userAgent$IE$$ || 0 != $el$$6_element$$48$$.clientWidth) && (!$goog$userAgent$WEBKIT$$ || 0 != $el$$6_element$$48$$.clientHeight || $el$$6_element$$48$$ != $body$$3_scrollX$$) && $el$$6_element$$48$$ != $body$$3_scrollX$$ && $el$$6_element$$48$$ != $documentElement$$1$$ && "visible" != $goog$style$getStyle_$$($el$$6_element$$48$$, "overflow")) {
      var $pos$$8$$ = $goog$style$getPageOffset$$($el$$6_element$$48$$), $client_el$$inline_527$$;
      $client_el$$inline_527$$ = $el$$6_element$$48$$;
      if($goog$userAgent$GECKO$$ && !$goog$userAgent$isVersionOrHigher$$("1.9")) {
        var $left$$inline_528$$ = parseFloat($goog$style$getComputedStyle$$($client_el$$inline_527$$, "borderLeftWidth"));
        if($goog$style$isRightToLeft$$($client_el$$inline_527$$)) {
          var $scrollbarWidth$$inline_529$$ = $client_el$$inline_527$$.offsetWidth - $client_el$$inline_527$$.clientWidth - $left$$inline_528$$ - parseFloat($goog$style$getComputedStyle$$($client_el$$inline_527$$, "borderRightWidth")), $left$$inline_528$$ = $left$$inline_528$$ + $scrollbarWidth$$inline_529$$
        }
        $client_el$$inline_527$$ = new $goog$math$Coordinate$$($left$$inline_528$$, parseFloat($goog$style$getComputedStyle$$($client_el$$inline_527$$, "borderTopWidth")))
      }else {
        $client_el$$inline_527$$ = new $goog$math$Coordinate$$($client_el$$inline_527$$.clientLeft, $client_el$$inline_527$$.clientTop)
      }
      $pos$$8$$.x += $client_el$$inline_527$$.x;
      $pos$$8$$.y += $client_el$$inline_527$$.y;
      $visibleRect$$.top = Math.max($visibleRect$$.top, $pos$$8$$.y);
      $visibleRect$$.right = Math.min($visibleRect$$.right, $pos$$8$$.x + $el$$6_element$$48$$.clientWidth);
      $visibleRect$$.bottom = Math.min($visibleRect$$.bottom, $pos$$8$$.y + $el$$6_element$$48$$.clientHeight);
      $visibleRect$$.left = Math.max($visibleRect$$.left, $pos$$8$$.x)
    }
  }
  $body$$3_scrollX$$ = $scrollEl_scrollY$$.scrollLeft;
  $scrollEl_scrollY$$ = $scrollEl_scrollY$$.scrollTop;
  $visibleRect$$.left = Math.max($visibleRect$$.left, $body$$3_scrollX$$);
  $visibleRect$$.top = Math.max($visibleRect$$.top, $scrollEl_scrollY$$);
  $doc$$inline_900_dom_el$$inline_901_winSize$$ = ($doc$$inline_900_dom_el$$inline_901_winSize$$.$document_$.parentWindow || $doc$$inline_900_dom_el$$inline_901_winSize$$.$document_$.defaultView || window).document;
  $doc$$inline_900_dom_el$$inline_901_winSize$$ = "CSS1Compat" == $doc$$inline_900_dom_el$$inline_901_winSize$$.compatMode ? $doc$$inline_900_dom_el$$inline_901_winSize$$.documentElement : $doc$$inline_900_dom_el$$inline_901_winSize$$.body;
  $doc$$inline_900_dom_el$$inline_901_winSize$$ = new $goog$math$Size$$($doc$$inline_900_dom_el$$inline_901_winSize$$.clientWidth, $doc$$inline_900_dom_el$$inline_901_winSize$$.clientHeight);
  $visibleRect$$.right = Math.min($visibleRect$$.right, $body$$3_scrollX$$ + $doc$$inline_900_dom_el$$inline_901_winSize$$.width);
  $visibleRect$$.bottom = Math.min($visibleRect$$.bottom, $scrollEl_scrollY$$ + $doc$$inline_900_dom_el$$inline_901_winSize$$.height);
  return 0 <= $visibleRect$$.top && 0 <= $visibleRect$$.left && $visibleRect$$.bottom > $visibleRect$$.top && $visibleRect$$.right > $visibleRect$$.left ? $visibleRect$$ : $JSCompiler_alias_NULL$$
}
function $goog$style$getPageOffset$$($el$$8_scrollCoord_vpBox$$) {
  var $box$$7_parent$$22$$, $doc$$29$$ = $goog$dom$getOwnerDocument$$($el$$8_scrollCoord_vpBox$$), $positionStyle$$1$$ = $goog$style$getStyle_$$($el$$8_scrollCoord_vpBox$$, "position"), $BUGGY_GECKO_BOX_OBJECT$$ = $goog$userAgent$GECKO$$ && $doc$$29$$.getBoxObjectFor && !$el$$8_scrollCoord_vpBox$$.getBoundingClientRect && "absolute" == $positionStyle$$1$$ && ($box$$7_parent$$22$$ = $doc$$29$$.getBoxObjectFor($el$$8_scrollCoord_vpBox$$)) && (0 > $box$$7_parent$$22$$.screenX || 0 > $box$$7_parent$$22$$.screenY), 
  $pos$$9$$ = new $goog$math$Coordinate$$(0, 0), $viewportElement$$ = $goog$style$getClientViewportElement$$($doc$$29$$);
  if($el$$8_scrollCoord_vpBox$$ == $viewportElement$$) {
    return $pos$$9$$
  }
  if($el$$8_scrollCoord_vpBox$$.getBoundingClientRect) {
    $box$$7_parent$$22$$ = $goog$style$getBoundingClientRect_$$($el$$8_scrollCoord_vpBox$$), $el$$8_scrollCoord_vpBox$$ = $JSCompiler_StaticMethods_getDocumentScroll$$($goog$dom$getDomHelper$$($doc$$29$$)), $pos$$9$$.x = $box$$7_parent$$22$$.left + $el$$8_scrollCoord_vpBox$$.x, $pos$$9$$.y = $box$$7_parent$$22$$.top + $el$$8_scrollCoord_vpBox$$.y
  }else {
    if($doc$$29$$.getBoxObjectFor && !$BUGGY_GECKO_BOX_OBJECT$$) {
      $box$$7_parent$$22$$ = $doc$$29$$.getBoxObjectFor($el$$8_scrollCoord_vpBox$$), $el$$8_scrollCoord_vpBox$$ = $doc$$29$$.getBoxObjectFor($viewportElement$$), $pos$$9$$.x = $box$$7_parent$$22$$.screenX - $el$$8_scrollCoord_vpBox$$.screenX, $pos$$9$$.y = $box$$7_parent$$22$$.screenY - $el$$8_scrollCoord_vpBox$$.screenY
    }else {
      $box$$7_parent$$22$$ = $el$$8_scrollCoord_vpBox$$;
      do {
        $pos$$9$$.x += $box$$7_parent$$22$$.offsetLeft;
        $pos$$9$$.y += $box$$7_parent$$22$$.offsetTop;
        $box$$7_parent$$22$$ != $el$$8_scrollCoord_vpBox$$ && ($pos$$9$$.x += $box$$7_parent$$22$$.clientLeft || 0, $pos$$9$$.y += $box$$7_parent$$22$$.clientTop || 0);
        if($goog$userAgent$WEBKIT$$ && "fixed" == $goog$style$getStyle_$$($box$$7_parent$$22$$, "position")) {
          $pos$$9$$.x += $doc$$29$$.body.scrollLeft;
          $pos$$9$$.y += $doc$$29$$.body.scrollTop;
          break
        }
        $box$$7_parent$$22$$ = $box$$7_parent$$22$$.offsetParent
      }while($box$$7_parent$$22$$ && $box$$7_parent$$22$$ != $el$$8_scrollCoord_vpBox$$);
      if($goog$userAgent$OPERA$$ || $goog$userAgent$WEBKIT$$ && "absolute" == $positionStyle$$1$$) {
        $pos$$9$$.y -= $doc$$29$$.body.offsetTop
      }
      for($box$$7_parent$$22$$ = $el$$8_scrollCoord_vpBox$$;($box$$7_parent$$22$$ = $goog$style$getOffsetParent$$($box$$7_parent$$22$$)) && $box$$7_parent$$22$$ != $doc$$29$$.body && $box$$7_parent$$22$$ != $viewportElement$$;) {
        if($pos$$9$$.x -= $box$$7_parent$$22$$.scrollLeft, !$goog$userAgent$OPERA$$ || "TR" != $box$$7_parent$$22$$.tagName) {
          $pos$$9$$.y -= $box$$7_parent$$22$$.scrollTop
        }
      }
    }
  }
  return $pos$$9$$
}
function $goog$style$getClientPosition$$($JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$) {
  var $JSCompiler_temp_const$$15_pos$$11$$ = new $goog$math$Coordinate$$;
  if(1 == $JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$.nodeType) {
    if($JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$.getBoundingClientRect) {
      var $box$$8_scrollCoord$$1$$ = $goog$style$getBoundingClientRect_$$($JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$);
      $JSCompiler_temp_const$$15_pos$$11$$.x = $box$$8_scrollCoord$$1$$.left;
      $JSCompiler_temp_const$$15_pos$$11$$.y = $box$$8_scrollCoord$$1$$.top
    }else {
      var $box$$8_scrollCoord$$1$$ = $JSCompiler_StaticMethods_getDocumentScroll$$($goog$dom$getDomHelper$$($JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$)), $pageCoord$$ = $goog$style$getPageOffset$$($JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$);
      $JSCompiler_temp_const$$15_pos$$11$$.x = $pageCoord$$.x - $box$$8_scrollCoord$$1$$.x;
      $JSCompiler_temp_const$$15_pos$$11$$.y = $pageCoord$$.y - $box$$8_scrollCoord$$1$$.y
    }
    if($goog$userAgent$GECKO$$ && !$goog$userAgent$isVersionOrHigher$$(12)) {
      var $isAbstractedEvent_property$$inline_536$$;
      $goog$userAgent$IE$$ ? $isAbstractedEvent_property$$inline_536$$ = "-ms-transform" : $goog$userAgent$WEBKIT$$ ? $isAbstractedEvent_property$$inline_536$$ = "-webkit-transform" : $goog$userAgent$OPERA$$ ? $isAbstractedEvent_property$$inline_536$$ = "-o-transform" : $goog$userAgent$GECKO$$ && ($isAbstractedEvent_property$$inline_536$$ = "-moz-transform");
      var $targetEvent_transform$$inline_537$$;
      $isAbstractedEvent_property$$inline_536$$ && ($targetEvent_transform$$inline_537$$ = $goog$style$getStyle_$$($JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$, $isAbstractedEvent_property$$inline_536$$));
      $targetEvent_transform$$inline_537$$ || ($targetEvent_transform$$inline_537$$ = $goog$style$getStyle_$$($JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$, "transform"));
      $targetEvent_transform$$inline_537$$ ? ($JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$ = $targetEvent_transform$$inline_537$$.match($goog$style$MATRIX_TRANSLATION_REGEX_$$), $JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$ = !$JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$ ? new $goog$math$Coordinate$$(0, 0) : new $goog$math$Coordinate$$(parseFloat($JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$[1]), parseFloat($JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$[2]))) : 
      $JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$ = new $goog$math$Coordinate$$(0, 0);
      $JSCompiler_temp_const$$15_pos$$11$$ = new $goog$math$Coordinate$$($JSCompiler_temp_const$$15_pos$$11$$.x + $JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$.x, $JSCompiler_temp_const$$15_pos$$11$$.y + $JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$.y)
    }
  }else {
    $isAbstractedEvent_property$$inline_536$$ = $goog$isFunction$$($JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$.$getBrowserEvent$), $targetEvent_transform$$inline_537$$ = $JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$, $JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$.targetTouches ? $targetEvent_transform$$inline_537$$ = $JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$.targetTouches[0] : $isAbstractedEvent_property$$inline_536$$ && $JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$.$event_$.targetTouches && 
    ($targetEvent_transform$$inline_537$$ = $JSCompiler_inline_result$$16_el$$12_matches$$inline_538$$.$event_$.targetTouches[0]), $JSCompiler_temp_const$$15_pos$$11$$.x = $targetEvent_transform$$inline_537$$.clientX, $JSCompiler_temp_const$$15_pos$$11$$.y = $targetEvent_transform$$inline_537$$.clientY
  }
  return $JSCompiler_temp_const$$15_pos$$11$$
}
function $goog$style$getPixelStyleValue_$$($value$$72$$, $round$$) {
  "number" == typeof $value$$72$$ && ($value$$72$$ = ($round$$ ? Math.round($value$$72$$) : $value$$72$$) + "px");
  return $value$$72$$
}
function $goog$style$getSize$$($element$$54_size$$15$$) {
  if("none" != $goog$style$getStyle_$$($element$$54_size$$15$$, "display")) {
    return $goog$style$getSizeWithDisplay_$$($element$$54_size$$15$$)
  }
  var $style$$6$$ = $element$$54_size$$15$$.style, $originalDisplay$$ = $style$$6$$.display, $originalVisibility$$ = $style$$6$$.visibility, $originalPosition$$ = $style$$6$$.position;
  $style$$6$$.visibility = "hidden";
  $style$$6$$.position = "absolute";
  $style$$6$$.display = "inline";
  $element$$54_size$$15$$ = $goog$style$getSizeWithDisplay_$$($element$$54_size$$15$$);
  $style$$6$$.display = $originalDisplay$$;
  $style$$6$$.position = $originalPosition$$;
  $style$$6$$.visibility = $originalVisibility$$;
  return $element$$54_size$$15$$
}
function $goog$style$getSizeWithDisplay_$$($clientRect_element$$55$$) {
  var $offsetWidth$$ = $clientRect_element$$55$$.offsetWidth, $offsetHeight$$ = $clientRect_element$$55$$.offsetHeight, $webkitOffsetsZero$$ = $goog$userAgent$WEBKIT$$ && !$offsetWidth$$ && !$offsetHeight$$;
  return(!$goog$isDef$$($offsetWidth$$) || $webkitOffsetsZero$$) && $clientRect_element$$55$$.getBoundingClientRect ? ($clientRect_element$$55$$ = $goog$style$getBoundingClientRect_$$($clientRect_element$$55$$), new $goog$math$Size$$($clientRect_element$$55$$.right - $clientRect_element$$55$$.left, $clientRect_element$$55$$.bottom - $clientRect_element$$55$$.top)) : new $goog$math$Size$$($offsetWidth$$, $offsetHeight$$)
}
function $goog$style$setElementShown$$($el$$19$$, $isShown$$) {
  $el$$19$$.style.display = $isShown$$ ? "" : "none"
}
function $goog$style$isRightToLeft$$($el$$23$$) {
  return"rtl" == $goog$style$getStyle_$$($el$$23$$, "direction")
}
function $goog$style$getIePixelValue_$$($element$$63$$, $value$$74$$) {
  if(/^\d+px?$/.test($value$$74$$)) {
    return parseInt($value$$74$$, 10)
  }
  var $oldStyleValue$$ = $element$$63$$.style.left, $oldRuntimeValue$$ = $element$$63$$.runtimeStyle.left;
  $element$$63$$.runtimeStyle.left = $element$$63$$.currentStyle.left;
  $element$$63$$.style.left = $value$$74$$;
  var $pixelValue$$ = $element$$63$$.style.pixelLeft;
  $element$$63$$.style.left = $oldStyleValue$$;
  $element$$63$$.runtimeStyle.left = $oldRuntimeValue$$;
  return $pixelValue$$
}
function $goog$style$getIePixelDistance_$$($element$$64$$, $propName$$) {
  var $value$$75$$ = $element$$64$$.currentStyle ? $element$$64$$.currentStyle[$propName$$] : $JSCompiler_alias_NULL$$;
  return $value$$75$$ ? $goog$style$getIePixelValue_$$($element$$64$$, $value$$75$$) : 0
}
var $goog$style$ieBorderWidthKeywords_$$ = {thin:2, medium:4, thick:6};
function $goog$style$getIePixelBorder_$$($element$$68$$, $prop$$6$$) {
  if("none" == ($element$$68$$.currentStyle ? $element$$68$$.currentStyle[$prop$$6$$ + "Style"] : $JSCompiler_alias_NULL$$)) {
    return 0
  }
  var $width$$18$$ = $element$$68$$.currentStyle ? $element$$68$$.currentStyle[$prop$$6$$ + "Width"] : $JSCompiler_alias_NULL$$;
  return $width$$18$$ in $goog$style$ieBorderWidthKeywords_$$ ? $goog$style$ieBorderWidthKeywords_$$[$width$$18$$] : $goog$style$getIePixelValue_$$($element$$68$$, $width$$18$$)
}
var $goog$style$MATRIX_TRANSLATION_REGEX_$$ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
function $goog$events$MouseWheelHandler$$($element$$71$$, $opt_capture$$5$$) {
  $goog$events$EventTarget$$.call(this);
  this.$element_$ = $element$$71$$;
  var $rtlElement$$ = $goog$isObject$$(this.$element_$) && 1 == this.$element_$.nodeType ? this.$element_$ : this.$element_$ ? this.$element_$.body : $JSCompiler_alias_NULL$$;
  this.$isRtl_$ = !!$rtlElement$$ && $goog$style$isRightToLeft$$($rtlElement$$);
  this.$listenKey_$ = $goog$events$listen$$(this.$element_$, $goog$userAgent$GECKO$$ ? "DOMMouseScroll" : "mousewheel", this, $opt_capture$$5$$)
}
$goog$inherits$$($goog$events$MouseWheelHandler$$, $goog$events$EventTarget$$);
$goog$events$MouseWheelHandler$$.prototype.handleEvent = function $$goog$events$MouseWheelHandler$$$$handleEvent$($be$$2_e$$27$$) {
  var $deltaX_newEvent$$ = 0, $deltaY_wheelDeltaScaleFactor$$ = 0, $detail$$3$$ = 0;
  $be$$2_e$$27$$ = $be$$2_e$$27$$.$event_$;
  if("mousewheel" == $be$$2_e$$27$$.type) {
    $deltaY_wheelDeltaScaleFactor$$ = 1;
    if($goog$userAgent$IE$$ || $goog$userAgent$WEBKIT$$ && ($goog$userAgent$detectedWindows_$$ || $goog$userAgent$isVersionOrHigher$$("532.0"))) {
      $deltaY_wheelDeltaScaleFactor$$ = 40
    }
    $detail$$3$$ = $goog$events$MouseWheelHandler$smartScale_$$(-$be$$2_e$$27$$.wheelDelta, $deltaY_wheelDeltaScaleFactor$$);
    $goog$isDef$$($be$$2_e$$27$$.wheelDeltaX) ? ($deltaX_newEvent$$ = $goog$events$MouseWheelHandler$smartScale_$$(-$be$$2_e$$27$$.wheelDeltaX, $deltaY_wheelDeltaScaleFactor$$), $deltaY_wheelDeltaScaleFactor$$ = $goog$events$MouseWheelHandler$smartScale_$$(-$be$$2_e$$27$$.wheelDeltaY, $deltaY_wheelDeltaScaleFactor$$)) : $deltaY_wheelDeltaScaleFactor$$ = $detail$$3$$
  }else {
    $detail$$3$$ = $be$$2_e$$27$$.detail, 100 < $detail$$3$$ ? $detail$$3$$ = 3 : -100 > $detail$$3$$ && ($detail$$3$$ = -3), $goog$isDef$$($be$$2_e$$27$$.axis) && $be$$2_e$$27$$.axis === $be$$2_e$$27$$.HORIZONTAL_AXIS ? $deltaX_newEvent$$ = $detail$$3$$ : $deltaY_wheelDeltaScaleFactor$$ = $detail$$3$$
  }
  $goog$isNumber$$(this.$maxDeltaX_$) && ($deltaX_newEvent$$ = Math.min(Math.max($deltaX_newEvent$$, -this.$maxDeltaX_$), this.$maxDeltaX_$));
  $goog$isNumber$$(this.$maxDeltaY_$) && ($deltaY_wheelDeltaScaleFactor$$ = Math.min(Math.max($deltaY_wheelDeltaScaleFactor$$, -this.$maxDeltaY_$), this.$maxDeltaY_$));
  this.$isRtl_$ && ($deltaX_newEvent$$ = -$deltaX_newEvent$$);
  $deltaX_newEvent$$ = new $goog$events$MouseWheelEvent$$($detail$$3$$, $be$$2_e$$27$$, $deltaX_newEvent$$, $deltaY_wheelDeltaScaleFactor$$);
  this.dispatchEvent($deltaX_newEvent$$)
};
function $goog$events$MouseWheelHandler$smartScale_$$($mouseWheelDelta$$, $scaleFactor$$) {
  return $goog$userAgent$WEBKIT$$ && ($goog$userAgent$detectedMac_$$ || $goog$userAgent$detectedLinux_$$) && 0 != $mouseWheelDelta$$ % $scaleFactor$$ ? $mouseWheelDelta$$ : $mouseWheelDelta$$ / $scaleFactor$$
}
function $goog$events$MouseWheelEvent$$($detail$$4$$, $browserEvent$$, $deltaX$$1$$, $deltaY$$1$$) {
  $browserEvent$$ && this.$init$($browserEvent$$, $JSCompiler_alias_VOID$$);
  this.type = "mousewheel";
  this.detail = $detail$$4$$;
  this.$deltaX$ = $deltaX$$1$$;
  this.$deltaY$ = $deltaY$$1$$
}
$goog$inherits$$($goog$events$MouseWheelEvent$$, $goog$events$BrowserEvent$$);
$goog$userAgent$IE$$ || $goog$userAgent$WEBKIT$$ && $goog$userAgent$isVersionOrHigher$$("525");
function $X$interactor$$($element$$73$$) {
  $X$base$$.call(this);
  this.$_classname$ = "interactor";
  this.$_element$ = $element$$73$$;
  this.$_mouseWheelHandler$ = this.$_mouseOutListener$ = this.$_mouseMoveListener$ = this.$_mouseUpListener$ = this.$_mouseDownListener$ = this.$_mouseWheelListener$ = $JSCompiler_alias_NULL$$;
  this.$_mouseInside$ = $JSCompiler_alias_TRUE$$;
  this.$_rightButtonDown$ = this.$_middleButtonDown$ = this.$_leftButtonDown$ = $JSCompiler_alias_FALSE$$;
  this.$_mousePosition$ = [0, 0];
  this.$_lastMousePosition$ = new $X$$.$vector$(0, 0, 0);
  this.$_lastTouchPosition$ = new $X$$.$vector$(0, 0, 0);
  this.$lastFingerDistance$ = 0;
  this.$_touchHoverTrigger$ = this.$_hoverTrigger$ = $JSCompiler_alias_NULL$$;
  this.$_shiftDown$ = $JSCompiler_alias_FALSE$$;
  this.$_config$ = {MOUSEWHEEL_ENABLED:$JSCompiler_alias_TRUE$$, MOUSECLICKS_ENABLED:$JSCompiler_alias_TRUE$$, KEYBOARD_ENABLED:$JSCompiler_alias_TRUE$$, HOVERING_ENABLED:$JSCompiler_alias_TRUE$$, CONTEXTMENU_ENABLED:$JSCompiler_alias_FALSE$$, TOUCH_ENABLED:$JSCompiler_alias_TRUE$$, TOUCH_BOUNCING_ENABLED:$JSCompiler_alias_FALSE$$}
}
$goog$inherits$$($X$interactor$$, $X$base$$);
$X$interactor$$.prototype.__defineGetter__("config", $JSCompiler_get$$("$_config$"));
$X$interactor$$.prototype.__defineGetter__("leftButtonDown", $JSCompiler_get$$("$_leftButtonDown$"));
$X$interactor$$.prototype.__defineGetter__("middleButtonDown", $JSCompiler_get$$("$_middleButtonDown$"));
$X$interactor$$.prototype.__defineGetter__("rightButtonDown", $JSCompiler_get$$("$_rightButtonDown$"));
$X$interactor$$.prototype.$init$ = function $$X$interactor$$$$$init$$() {
  this.$_config$.MOUSEWHEEL_ENABLED ? (this.$_mouseWheelHandler$ = new $goog$events$MouseWheelHandler$$(this.$_element$), this.$_mouseWheelListener$ = $goog$events$listen$$(this.$_mouseWheelHandler$, "mousewheel", this.$onMouseWheel_$.bind(this))) : ($goog$events$unlistenByKey$$(this.$_mouseWheelListener$), this.$_mouseWheelHandler$ = $JSCompiler_alias_NULL$$);
  this.$_config$.MOUSECLICKS_ENABLED ? (this.$_mouseDownListener$ = $goog$events$listen$$(this.$_element$, "mousedown", this.$onMouseDown_$.bind(this)), this.$_mouseUpListener$ = $goog$events$listen$$(this.$_element$, "mouseup", this.$onMouseUp_$.bind(this))) : ($goog$events$unlistenByKey$$(this.$_mouseDownListener$), $goog$events$unlistenByKey$$(this.$_mouseUpListener$));
  this.$_element$.oncontextmenu = this.$_config$.CONTEXTMENU_ENABLED ? $JSCompiler_alias_NULL$$ : function() {
    return $JSCompiler_alias_FALSE$$
  };
  window.onkeydown = this.$_config$.KEYBOARD_ENABLED ? this.$onKey_$.bind(this) : $JSCompiler_alias_NULL$$;
  this.$_config$.TOUCH_ENABLED ? (this.$_config$.TOUCH_BOUNCING_ENABLED || document.body.addEventListener("touchmove", function($event$$5$$) {
    $event$$5$$.preventDefault()
  }, $JSCompiler_alias_FALSE$$), this.$_touchStartListener$ = $goog$events$listen$$(this.$_element$, "touchstart", this.$onTouchStart_$.bind(this)), this.$_touchMoveListener$ = $goog$events$listen$$(this.$_element$, "touchmove", this.$onTouchMove_$.bind(this)), this.$_touchEndListener$ = $goog$events$listen$$(this.$_element$, "touchend", this.$onTouchEnd_$.bind(this))) : ($goog$events$unlistenByKey$$(this.$_touchStartListener$), $goog$events$unlistenByKey$$(this.$_touchMoveListener$), $goog$events$unlistenByKey$$(this.$_touchEndListener$));
  $goog$events$unlistenByKey$$(this.$_mouseMoveListener$);
  $goog$events$unlistenByKey$$(this.$_mouseOutListener$);
  this.$_mouseMoveListener$ = $goog$events$listen$$(this.$_element$, "mousemove", this.$onMouseMovementInside_$.bind(this));
  this.$_mouseOutListener$ = $goog$events$listen$$(this.$_element$, "mouseout", this.$onMouseMovementOutside_$.bind(this))
};
$X$interactor$$.prototype.$onMouseDown_$ = function $$X$interactor$$$$$onMouseDown_$$($event$$6$$) {
  0 == $event$$6$$.button ? this.$_leftButtonDown$ = $JSCompiler_alias_TRUE$$ : 1 == $event$$6$$.button ? this.$_middleButtonDown$ = $JSCompiler_alias_TRUE$$ : 2 == $event$$6$$.button && (this.$_rightButtonDown$ = $JSCompiler_alias_TRUE$$);
  eval("this.onMouseDown(" + this.$_leftButtonDown$ + "," + this.$_middleButtonDown$ + "," + this.$_rightButtonDown$ + ")");
  $JSCompiler_StaticMethods_hoverEnd_$$(this);
  $event$$6$$.preventDefault()
};
$X$interactor$$.prototype.$onMouseDown$ = $JSCompiler_emptyFn$$();
$X$interactor$$.prototype.$onMouseUp_$ = function $$X$interactor$$$$$onMouseUp_$$($event$$7$$) {
  0 == $event$$7$$.button ? this.$_leftButtonDown$ = $JSCompiler_alias_FALSE$$ : 1 == $event$$7$$.button ? this.$_middleButtonDown$ = $JSCompiler_alias_FALSE$$ : 2 == $event$$7$$.button && (this.$_rightButtonDown$ = $JSCompiler_alias_FALSE$$);
  eval("this.onMouseUp(" + this.$_leftButtonDown$ + "," + this.$_middleButtonDown$ + "," + this.$_rightButtonDown$ + ")");
  $JSCompiler_StaticMethods_hoverEnd_$$(this);
  $event$$7$$.preventDefault()
};
$X$interactor$$.prototype.__defineGetter__("mousePosition", $JSCompiler_get$$("$_mousePosition$"));
$JSCompiler_prototypeAlias$$ = $X$interactor$$.prototype;
$JSCompiler_prototypeAlias$$.$onMouseUp$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$onMouseMovementOutside_$ = function $$JSCompiler_prototypeAlias$$$$onMouseMovementOutside_$$($event$$8$$) {
  this.$_mouseInside$ = $JSCompiler_alias_FALSE$$;
  this.$_config$.KEYBOARD_ENABLED && (window.onkeydown = $JSCompiler_alias_NULL$$);
  this.$_rightButtonDown$ = this.$_middleButtonDown$ = this.$_leftButtonDown$ = $JSCompiler_alias_FALSE$$;
  $JSCompiler_StaticMethods_hoverEnd_$$(this);
  this.$_lastMousePosition$ = new $X$$.$vector$(0, 0, 0);
  $event$$8$$.preventDefault()
};
$JSCompiler_prototypeAlias$$.$onMouseMove$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$onTouchStart_$ = function $$JSCompiler_prototypeAlias$$$$onTouchStart_$$($event$$10$$) {
  $event$$10$$.preventDefault();
  $event$$10$$.$init$($event$$10$$.$event_$.targetTouches[0], $event$$10$$.currentTarget);
  eval("this.onTouchStart(" + $event$$10$$.clientX + "," + $event$$10$$.clientY + ")");
  this.$_lastTouchPosition$ = new $X$$.$vector$($event$$10$$.clientX, $event$$10$$.clientY, 0);
  this.$_touchHoverTrigger$ = setTimeout(this.$onTouchHover_$.bind(this, $event$$10$$), 500)
};
$JSCompiler_prototypeAlias$$.$onTouchStart$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$onTouchHover_$ = function $$JSCompiler_prototypeAlias$$$$onTouchHover_$$($e$$32_event$$11$$) {
  eval("this.onTouchHover(" + $e$$32_event$$11$$.clientX + "," + $e$$32_event$$11$$.clientY + ")");
  $e$$32_event$$11$$ = new $X$event$ZoomEvent$$;
  $e$$32_event$$11$$.$_in$ = $JSCompiler_alias_TRUE$$;
  $e$$32_event$$11$$.$_fast$ = this instanceof $X$interactor3D$$;
  this.dispatchEvent($e$$32_event$$11$$);
  this.$_touchHovering$ = $JSCompiler_alias_TRUE$$
};
$JSCompiler_prototypeAlias$$.$onTouchHover$ = $JSCompiler_emptyFn$$();
function $JSCompiler_StaticMethods_resetTouchHover_$$($JSCompiler_StaticMethods_resetTouchHover_$self$$) {
  clearTimeout($JSCompiler_StaticMethods_resetTouchHover_$self$$.$_touchHoverTrigger$);
  if($JSCompiler_StaticMethods_resetTouchHover_$self$$.$_touchHovering$) {
    var $e$$33$$ = new $X$event$ZoomEvent$$;
    $e$$33$$.$_in$ = $JSCompiler_alias_FALSE$$;
    $e$$33$$.$_fast$ = $JSCompiler_StaticMethods_resetTouchHover_$self$$ instanceof $X$interactor3D$$;
    $JSCompiler_StaticMethods_resetTouchHover_$self$$.dispatchEvent($e$$33$$)
  }
  $JSCompiler_StaticMethods_resetTouchHover_$self$$.$_touchHovering$ = $JSCompiler_alias_FALSE$$
}
$JSCompiler_prototypeAlias$$.$onTouchEnd_$ = function $$JSCompiler_prototypeAlias$$$$onTouchEnd_$$($event$$12$$) {
  $event$$12$$.preventDefault();
  eval("this.onTouchEnd()");
  $JSCompiler_StaticMethods_resetTouchHover_$$(this)
};
$JSCompiler_prototypeAlias$$.$onTouchEnd$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$onTouchMove_$ = function $$JSCompiler_prototypeAlias$$$$onTouchMove_$$($_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$) {
  $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.preventDefault();
  this.$_touchHovering$ || $JSCompiler_StaticMethods_resetTouchHover_$$(this);
  this.touchmoveEvent = $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$ = $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.$event_$;
  eval("this.onTouchMove(this['touchmoveEvent'])");
  var $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$ = $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.targetTouches;
  if(1 == $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$.length) {
    $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$ = $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$[0];
    var $_bottom_quarter__middle__touchPosition$$ = [$_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.clientX, $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.clientY];
    $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$ = new $X$$.$vector$($_bottom_quarter__middle__touchPosition$$[0], $_bottom_quarter__middle__touchPosition$$[1], 0);
    var $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$ = $_bottom_quarter__middle__touchPosition$$[0] > 3 * this.$_element$.clientWidth / 4, $_left_quarter$$ = $_bottom_quarter__middle__touchPosition$$[0] < this.$_element$.clientWidth / 4, $_top_quarter_distance$$4$$ = $_bottom_quarter__middle__touchPosition$$[1] < this.$_element$.clientHeight / 4, $_bottom_quarter__middle__touchPosition$$ = $_bottom_quarter__middle__touchPosition$$[1] > 3 * this.$_element$.clientHeight / 
    4, $_bottom_quarter__middle__touchPosition$$ = !$_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$ && !$_left_quarter$$ && !$_top_quarter_distance$$4$$ && !$_bottom_quarter__middle__touchPosition$$, $_top_quarter_distance$$4$$ = this.$_lastTouchPosition$.$subtract$($_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$);
    this.$_lastTouchPosition$ = $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.$clone$();
    if(this.$_touchHovering$) {
      $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$ = new $X$event$PanEvent$$, 5 < $_top_quarter_distance$$4$$.x ? $_top_quarter_distance$$4$$.x = 1 : -5 > $_top_quarter_distance$$4$$.x && ($_top_quarter_distance$$4$$.x = -1), 5 < $_top_quarter_distance$$4$$.y ? $_top_quarter_distance$$4$$.y = 1 : -5 > $_top_quarter_distance$$4$$.y && ($_top_quarter_distance$$4$$.y = -1), $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.$_distance$ = 
      $_top_quarter_distance$$4$$, this.dispatchEvent($_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$)
    }else {
      if(this instanceof $X$interactor2D$$ && ($_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$ || $_left_quarter$$)) {
        $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$ = new $X$event$ScrollEvent$$, $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.$_up$ = 0 > $_top_quarter_distance$$4$$.y, this.dispatchEvent($_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$)
      }else {
        if(this instanceof $X$interactor3D$$ || $_bottom_quarter__middle__touchPosition$$) {
          $_top_quarter_distance$$4$$.scale(3), $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$ = new $X$event$RotateEvent$$, $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.$_distance$ = $_top_quarter_distance$$4$$, this.dispatchEvent($_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$)
        }
      }
    }
  }else {
    2 == $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$.length && ($_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$ = $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$[0], $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$ = $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$[1], $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$ = 
    [$_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.clientX, $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.clientY], $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$ = [$_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$.clientX, $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$.clientY], $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$ = 
    new $X$$.$vector$($_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$[0], $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$[1], 0), $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$ = new $X$$.$vector$($_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$[0], $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$[1], 0), 
    $_top_quarter_distance$$4$$ = $goog$math$Vec3$squaredDistance$$($_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$, $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$), $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$ = $_top_quarter_distance$$4$$ - this.$lastFingerDistance$, this.$lastFingerDistance$ = $_top_quarter_distance$$4$$, this.$_lastTouchPosition$.$subtract$($_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$), 
    this.$_lastTouchPosition$ = $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.$clone$(), 10 < Math.abs($_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$) && ($_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$ = new $X$event$ZoomEvent$$, $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.$_in$ = 0 < $_fingers__right_quarter__touchPosition2_currentTouchPosition2_distanceChange_finger2$$, 
    $_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$.$_fast$ = this instanceof $X$interactor3D$$, this.dispatchEvent($_touchPosition1_currentTouchPosition_currentTouchPosition1_e$$34_event$$13_finger1$$)))
  }
};
$JSCompiler_prototypeAlias$$.$onTouchMove$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$onMouseMovementInside_$ = function $$JSCompiler_prototypeAlias$$$$onMouseMovementInside_$$($distance$$5_event$$15$$) {
  this.mousemoveEvent = $distance$$5_event$$15$$;
  eval("this.onMouseMove(this['mousemoveEvent'])");
  this.$_mouseInside$ = $JSCompiler_alias_TRUE$$;
  this.$_config$.KEYBOARD_ENABLED && window.onkeydown == $JSCompiler_alias_NULL$$ && (window.onkeydown = this.$onKey_$.bind(this));
  $distance$$5_event$$15$$.preventDefault();
  var $e$$35_shiftDown$$ = $distance$$5_event$$15$$.shiftKey;
  this.$_shiftDown$ = $e$$35_shiftDown$$;
  this.$_mousePosition$ = [$distance$$5_event$$15$$.offsetX, $distance$$5_event$$15$$.offsetY];
  var $currentMousePosition$$ = new $X$$.$vector$(this.$_mousePosition$[0], this.$_mousePosition$[1], 0);
  $distance$$5_event$$15$$ = this.$_lastMousePosition$.$subtract$($currentMousePosition$$);
  this.$_lastMousePosition$ = $currentMousePosition$$.$clone$();
  this.$_config$.HOVERING_ENABLED && ((0 < Math.abs($distance$$5_event$$15$$.x) || 0 < Math.abs($distance$$5_event$$15$$.y) || this.$_middleButtonDown$ || this.$_leftButtonDown$ || this.$_rightButtonDown$) && $JSCompiler_StaticMethods_hoverEnd_$$(this), this.$_hoverTrigger$ = setTimeout(function() {
    $JSCompiler_StaticMethods_hoverEnd_$$(this);
    var $e$$36$$ = new $X$event$HoverEvent$$;
    $e$$36$$.$_x$ = $currentMousePosition$$.x;
    $e$$36$$.$_y$ = $currentMousePosition$$.y;
    this.dispatchEvent($e$$36$$);
    this.$_hoverTrigger$ = $JSCompiler_alias_NULL$$
  }.bind(this), 300));
  0 != $distance$$5_event$$15$$.$magnitude$() && (this.$_leftButtonDown$ && !$e$$35_shiftDown$$ ? ($e$$35_shiftDown$$ = new $X$event$RotateEvent$$, $distance$$5_event$$15$$.scale(3), $e$$35_shiftDown$$.$_distance$ = $distance$$5_event$$15$$, this.dispatchEvent($e$$35_shiftDown$$)) : this.$_middleButtonDown$ || this.$_leftButtonDown$ && $e$$35_shiftDown$$ ? ($e$$35_shiftDown$$ = new $X$event$PanEvent$$, $e$$35_shiftDown$$.$_distance$ = $distance$$5_event$$15$$, this.dispatchEvent($e$$35_shiftDown$$)) : 
  this.$_rightButtonDown$ && ($e$$35_shiftDown$$ = new $X$event$ZoomEvent$$, $e$$35_shiftDown$$.$_in$ = 0 < $distance$$5_event$$15$$.y, $e$$35_shiftDown$$.$_fast$ = $JSCompiler_alias_FALSE$$, this.dispatchEvent($e$$35_shiftDown$$)))
};
function $JSCompiler_StaticMethods_hoverEnd_$$($JSCompiler_StaticMethods_hoverEnd_$self$$) {
  $JSCompiler_StaticMethods_hoverEnd_$self$$.$_hoverTrigger$ && clearTimeout($JSCompiler_StaticMethods_hoverEnd_$self$$.$_hoverTrigger$);
  $JSCompiler_StaticMethods_hoverEnd_$self$$.dispatchEvent(new $X$event$HoverEndEvent$$)
}
$JSCompiler_prototypeAlias$$.$onMouseWheel$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$onMouseWheel_$ = function $$JSCompiler_prototypeAlias$$$$onMouseWheel_$$($event$$17$$) {
  this.mouseWheelEvent = $event$$17$$;
  eval("this.onMouseWheel(this['mouseWheelEvent'])");
  $JSCompiler_StaticMethods_hoverEnd_$$(this);
  $event$$17$$.preventDefault()
};
$JSCompiler_prototypeAlias$$.$onKey$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$onKey_$ = function $$JSCompiler_prototypeAlias$$$$onKey_$$($e$$38_event$$19$$) {
  if(this.$_mouseInside$) {
    this.keyEvent = $e$$38_event$$19$$;
    eval("this.onKey(this['keyEvent'])");
    $JSCompiler_StaticMethods_hoverEnd_$$(this);
    var $alt$$ = $e$$38_event$$19$$.altKey, $ctrl_distance$$6$$ = $e$$38_event$$19$$.ctrlKey, $meta$$ = $e$$38_event$$19$$.metaKey, $shift$$ = $e$$38_event$$19$$.shiftKey, $keyCode$$5$$ = $e$$38_event$$19$$.keyCode;
    82 == $keyCode$$5$$ && !$alt$$ && !$ctrl_distance$$6$$ && !$meta$$ && !$shift$$ ? ($e$$38_event$$19$$.preventDefault(), $e$$38_event$$19$$ = new $X$event$ResetViewEvent$$, this.dispatchEvent($e$$38_event$$19$$)) : 37 <= $keyCode$$5$$ && 40 >= $keyCode$$5$$ && ($e$$38_event$$19$$.preventDefault(), $shift$$ ? $e$$38_event$$19$$ = new $X$event$PanEvent$$ : $alt$$ ? $e$$38_event$$19$$ = new $X$event$ZoomEvent$$ : ($e$$38_event$$19$$ = new $X$event$RotateEvent$$, this instanceof $X$interactor2D$$ && 
    ($e$$38_event$$19$$ = new $X$event$ScrollEvent$$)), $e$$38_event$$19$$ && ($ctrl_distance$$6$$ = new $X$$.$vector$(0, 0, 0), 37 == $keyCode$$5$$ ? ($ctrl_distance$$6$$.x = 5, $e$$38_event$$19$$.$_up$ = $JSCompiler_alias_FALSE$$, $alt$$ && ($e$$38_event$$19$$.$_up$ = $JSCompiler_alias_TRUE$$, $e$$38_event$$19$$.$_in$ = $JSCompiler_alias_TRUE$$, $e$$38_event$$19$$.$_fast$ = $JSCompiler_alias_FALSE$$)) : 39 == $keyCode$$5$$ ? ($ctrl_distance$$6$$.x = -5, $e$$38_event$$19$$.$_up$ = $JSCompiler_alias_TRUE$$, 
    $alt$$ && ($e$$38_event$$19$$.$_in$ = $JSCompiler_alias_FALSE$$, $e$$38_event$$19$$.$_fast$ = $JSCompiler_alias_FALSE$$)) : 38 == $keyCode$$5$$ ? ($ctrl_distance$$6$$.y = 5, $e$$38_event$$19$$.$_up$ = $JSCompiler_alias_TRUE$$, $alt$$ && ($e$$38_event$$19$$.$_in$ = $JSCompiler_alias_TRUE$$, $e$$38_event$$19$$.$_fast$ = $JSCompiler_alias_TRUE$$)) : 40 == $keyCode$$5$$ && ($ctrl_distance$$6$$.y = -5, $e$$38_event$$19$$.$_up$ = $JSCompiler_alias_FALSE$$, $alt$$ && ($e$$38_event$$19$$.$_in$ = $JSCompiler_alias_FALSE$$, 
    $e$$38_event$$19$$.$_fast$ = $JSCompiler_alias_TRUE$$)), $e$$38_event$$19$$.$_distance$ = $ctrl_distance$$6$$, this.dispatchEvent($e$$38_event$$19$$)))
  }
};
$goog$exportSymbol$$("X.interactor", $X$interactor$$);
$goog$exportSymbol$$("X.interactor.prototype.init", $X$interactor$$.prototype.$init$);
$goog$exportSymbol$$("X.interactor.prototype.onMouseDown", $X$interactor$$.prototype.$onMouseDown$);
$goog$exportSymbol$$("X.interactor.prototype.onMouseUp", $X$interactor$$.prototype.$onMouseUp$);
$goog$exportSymbol$$("X.interactor.prototype.onMouseMove", $X$interactor$$.prototype.$onMouseMove$);
$goog$exportSymbol$$("X.interactor.prototype.onMouseWheel", $X$interactor$$.prototype.$onMouseWheel$);
$goog$exportSymbol$$("X.interactor.prototype.onKey", $X$interactor$$.prototype.$onKey$);
$goog$exportSymbol$$("X.interactor.prototype.onTouchStart", $X$interactor$$.prototype.$onTouchStart$);
$goog$exportSymbol$$("X.interactor.prototype.onTouchMove", $X$interactor$$.prototype.$onTouchMove$);
$goog$exportSymbol$$("X.interactor.prototype.onTouchEnd", $X$interactor$$.prototype.$onTouchEnd$);
$goog$exportSymbol$$("X.interactor.prototype.onTouchHover", $X$interactor$$.prototype.$onTouchHover$);
function $X$interactor2D$$($element$$74$$) {
  $X$interactor$$.call(this, $element$$74$$);
  this.$_classname$ = "interactor2D"
}
$goog$inherits$$($X$interactor2D$$, $X$interactor$$);
$X$interactor2D$$.prototype.$onMouseWheel_$ = function $$X$interactor2D$$$$$onMouseWheel_$$($event$$20$$) {
  $X$interactor2D$$.$superClass_$.$onMouseWheel_$.call(this, $event$$20$$);
  var $e$$39$$ = new $X$event$ScrollEvent$$;
  $event$$20$$.$deltaY$ == $JSCompiler_alias_NULL$$ && ($event$$20$$.$deltaY$ = 0);
  $e$$39$$.$_up$ = 0 > $event$$20$$.$deltaY$;
  this.dispatchEvent($e$$39$$)
};
function $X$camera$$($width$$20$$, $height$$18$$) {
  (!$goog$isNumber$$($width$$20$$) || !$goog$isNumber$$($height$$18$$)) && $JSCompiler_alias_THROW$$(Error("A camera needs valid width and height values."));
  $X$base$$.call(this);
  this.$_classname$ = "camera";
  this.$_position$ = new $X$$.$vector$(0, 100, 0);
  this.$_focus$ = new $X$$.$vector$(0, 0, 0);
  this.$_up$ = new $X$$.$vector$(0, 0, 1);
  this.$_width$ = $width$$20$$;
  this.$_height$ = $height$$18$$;
  this.$_view$ = this.$lookAt_$(this.$_position$, this.$_focus$)
}
$goog$inherits$$($X$camera$$, $X$base$$);
$X$camera$$.prototype.observe = function $$X$camera$$$$observe$($interactor$$) {
  ($interactor$$ == $JSCompiler_alias_NULL$$ || !($interactor$$ instanceof $X$interactor$$)) && $JSCompiler_alias_THROW$$(Error("Could not observe the interactor."));
  $goog$events$listen$$($interactor$$, $X$event$events$ROTATE$$, this.$onRotate_$.bind(this));
  $goog$events$listen$$($interactor$$, $X$event$events$PAN$$, this.$onPan_$.bind(this));
  $goog$events$listen$$($interactor$$, $X$event$events$ZOOM$$, this.$onZoom_$.bind(this))
};
$X$camera$$.prototype.$onRotate_$ = function $$X$camera$$$$$onRotate_$$($event$$21$$) {
  $event$$21$$ instanceof $X$event$RotateEvent$$ || $JSCompiler_alias_THROW$$(Error("Received no valid rotate event."));
  this.rotate($event$$21$$.$_distance$)
};
$X$camera$$.prototype.$onZoom_$ = function $$X$camera$$$$$onZoom_$$($event$$22$$) {
  $event$$22$$ instanceof $X$event$ZoomEvent$$ || $JSCompiler_alias_THROW$$(Error("Received no valid zoom event."));
  $event$$22$$.$_in$ ? this.$zoomIn$($event$$22$$.$_fast$) : this.$zoomOut$($event$$22$$.$_fast$)
};
$X$camera$$.prototype.$onPan_$ = function $$X$camera$$$$$onPan_$$($event$$23$$) {
  $event$$23$$ instanceof $X$event$PanEvent$$ || $JSCompiler_alias_THROW$$(Error("Received no valid pan event."));
  this.$pan$($event$$23$$.$_distance$)
};
$X$camera$$.prototype.__defineGetter__("view", $JSCompiler_get$$("$_view$"));
$X$camera$$.prototype.__defineSetter__("view", function($view$$3$$) {
  ($view$$3$$ == $JSCompiler_alias_NULL$$ || !($view$$3$$ instanceof Float32Array)) && $JSCompiler_alias_THROW$$(Error("Invalid view matrix."));
  this.$_view$ = $view$$3$$
});
$X$camera$$.prototype.__defineGetter__("position", function() {
  return[this.$_position$.x, this.$_position$.y, this.$_position$.$z$]
});
$X$camera$$.prototype.__defineSetter__("position", function($position$$5$$) {
  ($position$$5$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($position$$5$$) || 3 != $position$$5$$.length) && $JSCompiler_alias_THROW$$(Error("Invalid position."));
  this.$_position$ = new $X$$.$vector$($position$$5$$[0], $position$$5$$[1], $position$$5$$[2]);
  this.reset()
});
$X$camera$$.prototype.__defineGetter__("focus", function() {
  return[this.$_focus$.x, this.$_focus$.y, this.$_focus$.$z$]
});
$X$camera$$.prototype.__defineSetter__("focus", function($focus$$) {
  ($focus$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($focus$$) || 3 != $focus$$.length) && $JSCompiler_alias_THROW$$(Error("Invalid focus"));
  this.$_focus$ = new $X$$.$vector$($focus$$[0], $focus$$[1], $focus$$[2]);
  this.reset()
});
$X$camera$$.prototype.__defineGetter__("up", function() {
  return[this.$_up$.x, this.$_up$.y, this.$_up$.$z$]
});
$X$camera$$.prototype.__defineSetter__("up", function($up$$1$$) {
  ($up$$1$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($up$$1$$) || 3 != $up$$1$$.length) && $JSCompiler_alias_THROW$$(Error("Invalid up vector."));
  this.$_up$ = new $X$$.$vector$($up$$1$$[0], $up$$1$$[1], $up$$1$$[2]);
  this.reset()
});
$JSCompiler_prototypeAlias$$ = $X$camera$$.prototype;
$JSCompiler_prototypeAlias$$.reset = function $$JSCompiler_prototypeAlias$$$reset$() {
  this.$_view$ = this.$lookAt_$(this.$_position$, this.$_focus$)
};
$JSCompiler_prototypeAlias$$.rotate = function $$JSCompiler_prototypeAlias$$$rotate$($distance$$7$$) {
  $goog$isArray$$($distance$$7$$) && 2 == $distance$$7$$.length ? $distance$$7$$ = new $X$$.$vector$($distance$$7$$[0], $distance$$7$$[1], 0) : $distance$$7$$ instanceof $X$$.$vector$ || $JSCompiler_alias_THROW$$(Error("Invalid distance vector for rotate operation."));
  return $distance$$7$$
};
$JSCompiler_prototypeAlias$$.$pan$ = function $$JSCompiler_prototypeAlias$$$$pan$$($distance$$8$$) {
  $goog$isArray$$($distance$$8$$) && 2 == $distance$$8$$.length ? $distance$$8$$ = new $X$$.$vector$($distance$$8$$[0], $distance$$8$$[1], 0) : $distance$$8$$ instanceof $X$$.$vector$ || $JSCompiler_alias_THROW$$(Error("Invalid distance vector for pan operation."));
  this.$_view$[12] -= $distance$$8$$.x;
  this.$_view$[13] += $distance$$8$$.y
};
$JSCompiler_prototypeAlias$$.$zoomIn$ = function $$JSCompiler_prototypeAlias$$$$zoomIn$$($fast$$) {
  var $zoomStep$$ = 20;
  $fast$$ != $JSCompiler_alias_NULL$$ && !$fast$$ && ($zoomStep$$ = 1);
  this.$_view$[14] += $zoomStep$$
};
$JSCompiler_prototypeAlias$$.$zoomOut$ = function $$JSCompiler_prototypeAlias$$$$zoomOut$$($fast$$1$$) {
  var $zoomStep$$1$$ = 20;
  $fast$$1$$ != $JSCompiler_alias_NULL$$ && !$fast$$1$$ && ($zoomStep$$1$$ = 1);
  this.$_view$[14] -= $zoomStep$$1$$
};
$JSCompiler_prototypeAlias$$.$lookAt_$ = function $$JSCompiler_prototypeAlias$$$$lookAt_$$($cameraPosition$$, $targetPoint$$) {
  (!($cameraPosition$$ instanceof $X$$.$vector$) || !($targetPoint$$ instanceof $X$$.$vector$)) && $JSCompiler_alias_THROW$$(Error("3D vectors required for calculating the view."));
  return $X$$.$matrix$.$identity$()
};
$goog$exportSymbol$$("X.camera", $X$camera$$);
$goog$exportSymbol$$("X.camera.prototype.pan", $X$camera$$.prototype.$pan$);
$goog$exportSymbol$$("X.camera.prototype.rotate", $X$camera$$.prototype.rotate);
$goog$exportSymbol$$("X.camera.prototype.zoomIn", $X$camera$$.prototype.$zoomIn$);
$goog$exportSymbol$$("X.camera.prototype.zoomOut", $X$camera$$.prototype.$zoomOut$);
function $CSG$cylinder$$($options$$3_slices$$) {
  function $point$$2$$($pos$$12_stack$$1$$, $angle$$23_out_slice$$3$$, $normal$$3_normalBlend$$) {
    $angle$$23_out_slice$$3$$ = 2 * $angle$$23_out_slice$$3$$ * Math.PI;
    $angle$$23_out_slice$$3$$ = $JSCompiler_StaticMethods_plus$$($JSCompiler_StaticMethods_times$$($axisX$$, Math.cos($angle$$23_out_slice$$3$$)), $JSCompiler_StaticMethods_times$$($axisY$$, Math.sin($angle$$23_out_slice$$3$$)));
    $pos$$12_stack$$1$$ = $JSCompiler_StaticMethods_plus$$($JSCompiler_StaticMethods_plus$$($s$$34$$, $JSCompiler_StaticMethods_times$$($ray$$, $pos$$12_stack$$1$$)), $JSCompiler_StaticMethods_times$$($angle$$23_out_slice$$3$$, $r$$4$$));
    $normal$$3_normalBlend$$ = $JSCompiler_StaticMethods_plus$$($JSCompiler_StaticMethods_times$$($angle$$23_out_slice$$3$$, 1 - Math.abs($normal$$3_normalBlend$$)), $JSCompiler_StaticMethods_times$$($axisZ$$, $normal$$3_normalBlend$$));
    return new $csgVertex$$($pos$$12_stack$$1$$, $normal$$3_normalBlend$$)
  }
  this.$polygons_$ = [];
  $options$$3_slices$$ = $options$$3_slices$$ || {};
  var $s$$34$$ = new $csgVector$$($options$$3_slices$$.start || [0, -1, 0]), $e$$40_end$$6$$ = new $csgVector$$($options$$3_slices$$.end || [0, 1, 0]), $ray$$ = $JSCompiler_StaticMethods_minus$$($e$$40_end$$6$$, $s$$34$$), $r$$4$$ = $options$$3_slices$$.$radius$ || 1;
  $options$$3_slices$$ = $options$$3_slices$$.$slices$ || 16;
  for(var $axisZ$$ = $JSCompiler_StaticMethods_unit$$($ray$$), $isY_start$$12$$ = 0.5 < Math.abs($axisZ$$.y()), $axisX$$ = $JSCompiler_StaticMethods_unit$$((new $csgVector$$($isY_start$$12$$, !$isY_start$$12$$, 0)).$cross$($axisZ$$)), $axisY$$ = $JSCompiler_StaticMethods_unit$$($axisX$$.$cross$($axisZ$$)), $isY_start$$12$$ = new $csgVertex$$($s$$34$$, $JSCompiler_StaticMethods_negated$$($axisZ$$)), $e$$40_end$$6$$ = new $csgVertex$$($e$$40_end$$6$$, $JSCompiler_StaticMethods_unit$$($axisZ$$)), $polygons$$7$$ = 
  [], $i$$171$$ = 0;$i$$171$$ < $options$$3_slices$$;$i$$171$$++) {
    var $t0$$ = $i$$171$$ / $options$$3_slices$$, $t1$$ = ($i$$171$$ + 1) / $options$$3_slices$$;
    $polygons$$7$$.push(new $csgPolygon$$([$isY_start$$12$$, $point$$2$$(0, $t0$$, -1), $point$$2$$(0, $t1$$, -1)]));
    $polygons$$7$$.push(new $csgPolygon$$([$point$$2$$(0, $t1$$, 0), $point$$2$$(0, $t0$$, 0), $point$$2$$(1, $t0$$, 0), $point$$2$$(1, $t1$$, 0)]));
    $polygons$$7$$.push(new $csgPolygon$$([$e$$40_end$$6$$, $point$$2$$(1, $t1$$, 1), $point$$2$$(1, $t0$$, 1)]))
  }
  return $CSG$fromPolygons$$($polygons$$7$$)
}
$goog$inherits$$($CSG$cylinder$$, $CSG$$);
function $X$cylinder$$() {
  $X$object$$.call(this);
  this.$_classname$ = "cylinder";
  this.$_start$ = [-10, -10, -10];
  this.$_end$ = [10, 10, 10];
  this.$_radius$ = 10;
  this.$_slices$ = 32;
  $inject$$(this, new $X$constructable$$)
}
$goog$inherits$$($X$cylinder$$, $X$object$$);
$X$cylinder$$.prototype.__defineGetter__("start", $JSCompiler_get$$("$_start$"));
$X$cylinder$$.prototype.__defineSetter__("start", function($start$$13$$) {
  ($start$$13$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($start$$13$$) || 3 != $start$$13$$.length) && $JSCompiler_alias_THROW$$(Error("Invalid start"));
  this.$_start$ = $start$$13$$
});
$X$cylinder$$.prototype.__defineGetter__("end", $JSCompiler_get$$("$_end$"));
$X$cylinder$$.prototype.__defineSetter__("end", function($end$$7$$) {
  ($end$$7$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($end$$7$$) || 3 != $end$$7$$.length) && $JSCompiler_alias_THROW$$(Error("Invalid end"));
  this.$_end$ = $end$$7$$
});
$X$cylinder$$.prototype.__defineGetter__("radius", $JSCompiler_get$$("$_radius$"));
$X$cylinder$$.prototype.__defineSetter__("radius", function($radius$$4$$) {
  $goog$isNumber$$($radius$$4$$) || $JSCompiler_alias_THROW$$(Error("Invalid radius."));
  this.$_radius$ = $radius$$4$$
});
$X$cylinder$$.prototype.$modified$ = function $$X$cylinder$$$$$modified$$() {
  $JSCompiler_StaticMethods_fromCSG$$(this, new $CSG$cylinder$$({start:this.$_start$, end:this.$_end$, $radius$:this.$_radius$, $slices$:this.$_slices$}));
  $X$cylinder$$.$superClass_$.$modified$.call(this)
};
$goog$exportSymbol$$("X.cylinder", $X$cylinder$$);
$goog$exportSymbol$$("X.cylinder.prototype.modified", $X$cylinder$$.prototype.$modified$);
function $CSG$sphere$$($options$$4_stacks$$) {
  function $vertex$$1$$($theta$$1$$, $phi$$1$$) {
    $theta$$1$$ *= 2 * Math.PI;
    $phi$$1$$ *= Math.PI;
    var $dir$$ = new $csgVector$$(Math.cos($theta$$1$$) * Math.sin($phi$$1$$), Math.cos($phi$$1$$), Math.sin($theta$$1$$) * Math.sin($phi$$1$$));
    $vertices$$4$$.push(new $csgVertex$$($JSCompiler_StaticMethods_plus$$($c$$29$$, $JSCompiler_StaticMethods_times$$($dir$$, $r$$5$$)), $dir$$))
  }
  this.$polygons_$ = [];
  $options$$4_stacks$$ = $options$$4_stacks$$ || {};
  var $c$$29$$ = new $csgVector$$($options$$4_stacks$$.$center$ || [0, 0, 0]), $r$$5$$ = $options$$4_stacks$$.$radius$ || 1, $slices$$1$$ = $options$$4_stacks$$.$slices$ || 16;
  $options$$4_stacks$$ = $options$$4_stacks$$.$stacks$ || 8;
  for(var $polygons$$8$$ = [], $vertices$$4$$ = [], $i$$172$$ = 0;$i$$172$$ < $slices$$1$$;$i$$172$$++) {
    for(var $j$$18$$ = 0;$j$$18$$ < $options$$4_stacks$$;$j$$18$$++) {
      $vertices$$4$$ = [], $vertex$$1$$($i$$172$$ / $slices$$1$$, $j$$18$$ / $options$$4_stacks$$), 0 < $j$$18$$ && $vertex$$1$$(($i$$172$$ + 1) / $slices$$1$$, $j$$18$$ / $options$$4_stacks$$), $j$$18$$ < $options$$4_stacks$$ - 1 && $vertex$$1$$(($i$$172$$ + 1) / $slices$$1$$, ($j$$18$$ + 1) / $options$$4_stacks$$), $vertex$$1$$($i$$172$$ / $slices$$1$$, ($j$$18$$ + 1) / $options$$4_stacks$$), $polygons$$8$$.push(new $csgPolygon$$($vertices$$4$$))
    }
  }
  return $CSG$fromPolygons$$($polygons$$8$$)
}
$goog$inherits$$($CSG$sphere$$, $CSG$$);
function $X$sphere$$() {
  $X$object$$.call(this);
  this.$_classname$ = "sphere";
  this.$_center$ = [0, 0, 0];
  this.$_radius$ = 5;
  this.$_slices$ = 32;
  this.$_stacks$ = 16;
  $inject$$(this, new $X$constructable$$)
}
$goog$inherits$$($X$sphere$$, $X$object$$);
$X$sphere$$.prototype.__defineGetter__("center", $JSCompiler_get$$("$_center$"));
$X$sphere$$.prototype.__defineSetter__("center", function($center$$2$$) {
  ($center$$2$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($center$$2$$) || 3 != $center$$2$$.length) && $JSCompiler_alias_THROW$$(Error("Invalid center"));
  this.$_center$ = $center$$2$$
});
$X$sphere$$.prototype.__defineGetter__("radius", $JSCompiler_get$$("$_radius$"));
$X$sphere$$.prototype.__defineSetter__("radius", function($radius$$5$$) {
  $goog$isNumber$$($radius$$5$$) || $JSCompiler_alias_THROW$$(Error("Invalid radius."));
  this.$_radius$ = $radius$$5$$
});
$X$sphere$$.prototype.$modified$ = function $$X$sphere$$$$$modified$$() {
  $JSCompiler_StaticMethods_fromCSG$$(this, new $CSG$sphere$$({$center$:this.$_center$, $radius$:this.$_radius$, $slices$:this.$_slices$, $stacks$:this.$_stacks$}));
  $X$sphere$$.$superClass_$.$modified$.call(this)
};
$goog$exportSymbol$$("X.sphere", $X$sphere$$);
$goog$exportSymbol$$("X.sphere.prototype.modified", $X$sphere$$.prototype.$modified$);
function $X$labelmap$$($volume$$2$$) {
  $X$volume$$.call(this);
  this.$_classname$ = "labelmap";
  this.$_volume$ = $volume$$2$$;
  this.$_showOnlyColor$ = new Float32Array([-255, -255, -255, -255])
}
$goog$inherits$$($X$labelmap$$, $X$volume$$);
$X$labelmap$$.prototype.$modified$ = function $$X$labelmap$$$$$modified$$() {
  var $modifiedEvent$$17$$ = new $X$event$ModifiedEvent$$;
  $modifiedEvent$$17$$.$_object$ = this;
  this.dispatchEvent($modifiedEvent$$17$$);
  this.$_volume$.$modified$()
};
$X$labelmap$$.prototype.__defineSetter__("showOnly", function($label$$3$$) {
  var $_color$$2$$ = [-1, -1, -1, -1];
  $label$$3$$ != $JSCompiler_alias_NULL$$ && ($goog$isArray$$($label$$3$$) && 4 == $label$$3$$.length ? $_color$$2$$ = $label$$3$$ : (this.$_colortable$ || $JSCompiler_alias_THROW$$(Error("No colortable assigned.")), $_color$$2$$ = this.$_colortable$.$_map$.get($label$$3$$).slice(1, 5)));
  this.$_showOnlyColor$ = new Float32Array([Math.floor(255 * $_color$$2$$[0]), Math.floor(255 * $_color$$2$$[1]), Math.floor(255 * $_color$$2$$[2]), Math.floor(255 * $_color$$2$$[3])])
});
$goog$exportSymbol$$("X.labelmap", $X$labelmap$$);
function $CSG$cube$$($options$$5$$) {
  this.$polygons_$ = [];
  $options$$5$$ = $options$$5$$ || {};
  var $c$$30$$ = new $csgVector$$($options$$5$$.$center$ || [0, 0, 0]), $r$$6$$ = !$options$$5$$.$radius$ ? [1, 1, 1] : $options$$5$$.$radius$.length ? $options$$5$$.$radius$ : [$options$$5$$.$radius$, $options$$5$$.$radius$, $options$$5$$.$radius$];
  return $CSG$fromPolygons$$([[[0, 4, 6, 2], [-1, 0, 0]], [[1, 3, 7, 5], [1, 0, 0]], [[0, 1, 5, 4], [0, -1, 0]], [[2, 6, 7, 3], [0, 1, 0]], [[0, 2, 3, 1], [0, 0, -1]], [[4, 5, 7, 6], [0, 0, 1]]].map(function($info$$) {
    return new $csgPolygon$$($info$$[0].map(function($i$$173_pos$$13$$) {
      $i$$173_pos$$13$$ = new $csgVector$$($c$$30$$.x() + $r$$6$$[0] * (2 * !!($i$$173_pos$$13$$ & 1) - 1), $c$$30$$.y() + $r$$6$$[1] * (2 * !!($i$$173_pos$$13$$ & 2) - 1), $c$$30$$.$z$() + $r$$6$$[2] * (2 * !!($i$$173_pos$$13$$ & 4) - 1));
      return new $csgVertex$$($i$$173_pos$$13$$, new $csgVector$$($info$$[1]))
    }))
  }))
}
$goog$inherits$$($CSG$cube$$, $CSG$$);
function $X$cube$$() {
  $X$object$$.call(this);
  this.$_classname$ = "cube";
  this.$_center$ = [0, 0, 0];
  this.$_lengthZ$ = this.$_lengthY$ = this.$_lengthX$ = 20;
  this.$_textureCoordinateMap$ = [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0];
  $inject$$(this, new $X$constructable$$)
}
$goog$inherits$$($X$cube$$, $X$object$$);
$X$cube$$.prototype.__defineGetter__("center", $JSCompiler_get$$("$_center$"));
$X$cube$$.prototype.__defineSetter__("center", function($center$$3$$) {
  ($center$$3$$ == $JSCompiler_alias_NULL$$ || !$goog$isArray$$($center$$3$$) || 3 != $center$$3$$.length) && $JSCompiler_alias_THROW$$(Error("Invalid center"));
  this.$_center$ = $center$$3$$
});
$X$cube$$.prototype.__defineGetter__("lengthX", $JSCompiler_get$$("$_lengthX$"));
$X$cube$$.prototype.__defineSetter__("lengthX", function($lengthX$$) {
  $goog$isNumber$$($lengthX$$) || $JSCompiler_alias_THROW$$(Error("Invalid lengthX."));
  this.$_lengthX$ = $lengthX$$
});
$X$cube$$.prototype.__defineGetter__("lengthY", $JSCompiler_get$$("$_lengthY$"));
$X$cube$$.prototype.__defineSetter__("lengthY", function($lengthY$$) {
  $goog$isNumber$$($lengthY$$) || $JSCompiler_alias_THROW$$(Error("Invalid lengthY."));
  this.$_lengthY$ = $lengthY$$
});
$X$cube$$.prototype.__defineGetter__("lengthZ", $JSCompiler_get$$("$_lengthZ$"));
$X$cube$$.prototype.__defineSetter__("lengthZ", function($lengthZ$$) {
  $goog$isNumber$$($lengthZ$$) || $JSCompiler_alias_THROW$$(Error("Invalid lengthZ."));
  this.$_lengthZ$ = $lengthZ$$
});
$X$cube$$.prototype.$modified$ = function $$X$cube$$$$$modified$$() {
  $JSCompiler_StaticMethods_fromCSG$$(this, new $CSG$cube$$({$center$:this.$_center$, $radius$:[this.$_lengthX$ / 2, this.$_lengthY$ / 2, this.$_lengthZ$ / 2]}));
  $X$cube$$.$superClass_$.$modified$.call(this)
};
$goog$exportSymbol$$("X.cube", $X$cube$$);
$goog$exportSymbol$$("X.cube.prototype.modified", $X$cube$$.prototype.$modified$);
function $X$interactor3D$$($element$$75$$) {
  $X$interactor$$.call(this, $element$$75$$);
  this.$_classname$ = "interactor3D";
  this.$_clear_all$ = $JSCompiler_alias_FALSE$$
}
$goog$inherits$$($X$interactor3D$$, $X$interactor$$);
$X$interactor3D$$.prototype.$onMouseWheel_$ = function $$X$interactor3D$$$$$onMouseWheel_$$($event$$24$$) {
  $X$interactor3D$$.$superClass_$.$onMouseWheel_$.call(this, $event$$24$$);
  var $e$$41$$ = new $X$event$ZoomEvent$$;
  $event$$24$$.$deltaY$ == $JSCompiler_alias_NULL$$ && ($event$$24$$.$deltaY$ = 0);
  $e$$41$$.$_in$ = 0 > $event$$24$$.$deltaY$;
  $e$$41$$.$_fast$ = $JSCompiler_alias_TRUE$$;
  this.dispatchEvent($e$$41$$)
};
function $X$array$$($comparator$$) {
  $X$base$$.call(this);
  this.$_classname$ = "array";
  this.$_array$ = [];
  this.$_comparator$ = $comparator$$
}
$goog$inherits$$($X$array$$, $X$base$$);
function $X$array$compare$$($arr1$$5$$, $arr2$$13$$, $offset2$$) {
  for(var $i$$174$$ = 0;4 > $i$$174$$;$i$$174$$++) {
    if($arr1$$5$$[$i$$174$$ + 0] !== $arr2$$13$$[$i$$174$$ + $offset2$$]) {
      return $JSCompiler_alias_FALSE$$
    }
  }
  return $JSCompiler_alias_TRUE$$
}
$X$array$$.prototype.add = function $$X$array$$$$add$($object$$36$$) {
  this.$_array$.push($object$$36$$);
  return $JSCompiler_alias_TRUE$$
};
$X$array$$.prototype.remove = function $$X$array$$$$remove$($_index$$1_object$$37$$) {
  $_index$$1_object$$37$$ = this.$_array$.indexOf($_index$$1_object$$37$$);
  -1 < $_index$$1_object$$37$$ && this.$_array$.splice($_index$$1_object$$37$$, 1);
  return $JSCompiler_alias_TRUE$$
};
$X$array$$.prototype.clear = function $$X$array$$$$clear$() {
  this.$_array$.length = 0
};
function $JSCompiler_StaticMethods_msort_$$($JSCompiler_StaticMethods_msort_$self$$, $begin$$13_begin$$inline_550$$, $end$$10$$) {
  var $begin_right$$1_size$$19$$ = $end$$10$$ - $begin$$13_begin$$inline_550$$;
  if(!(2 > $begin_right$$1_size$$19$$)) {
    $begin_right$$1_size$$19$$ = $begin$$13_begin$$inline_550$$ + Math.floor($begin_right$$1_size$$19$$ / 2);
    $JSCompiler_StaticMethods_msort_$$($JSCompiler_StaticMethods_msort_$self$$, $begin$$13_begin$$inline_550$$, $begin_right$$1_size$$19$$);
    for($JSCompiler_StaticMethods_msort_$$($JSCompiler_StaticMethods_msort_$self$$, $begin_right$$1_size$$19$$, $end$$10$$);$begin$$13_begin$$inline_550$$ < $begin_right$$1_size$$19$$;++$begin$$13_begin$$inline_550$$) {
      if(0 < $JSCompiler_StaticMethods_msort_$self$$.$_comparator$($JSCompiler_StaticMethods_msort_$self$$.$_array$[$begin$$13_begin$$inline_550$$], $JSCompiler_StaticMethods_msort_$self$$.$_array$[$begin_right$$1_size$$19$$])) {
        var $v$$inline_553_v$$inline_825$$ = $JSCompiler_StaticMethods_msort_$self$$.$_array$[$begin$$13_begin$$inline_550$$];
        $JSCompiler_StaticMethods_msort_$self$$.$_array$[$begin$$13_begin$$inline_550$$] = $JSCompiler_StaticMethods_msort_$self$$.$_array$[$begin_right$$1_size$$19$$];
        for(var $JSCompiler_StaticMethods_insert_$self$$inline_822$$ = $JSCompiler_StaticMethods_msort_$self$$, $begin$$inline_823$$ = $begin_right$$1_size$$19$$, $end$$inline_824$$ = $end$$10$$;$begin$$inline_823$$ + 1 < $end$$inline_824$$ && 0 > $JSCompiler_StaticMethods_insert_$self$$inline_822$$.$_comparator$($JSCompiler_StaticMethods_insert_$self$$inline_822$$.$_array$[$begin$$inline_823$$ + 1], $v$$inline_553_v$$inline_825$$);) {
          var $JSCompiler_StaticMethods_swap_$self$$inline_903$$ = $JSCompiler_StaticMethods_insert_$self$$inline_822$$, $index2$$inline_905$$ = $begin$$inline_823$$ + 1, $tmp$$inline_906$$ = $JSCompiler_StaticMethods_swap_$self$$inline_903$$.$_array$[$begin$$inline_823$$];
          $JSCompiler_StaticMethods_swap_$self$$inline_903$$.$_array$[$begin$$inline_823$$] = $JSCompiler_StaticMethods_swap_$self$$inline_903$$.$_array$[$index2$$inline_905$$];
          $JSCompiler_StaticMethods_swap_$self$$inline_903$$.$_array$[$index2$$inline_905$$] = $tmp$$inline_906$$;
          ++$begin$$inline_823$$
        }
        $JSCompiler_StaticMethods_insert_$self$$inline_822$$.$_array$[$begin$$inline_823$$] = $v$$inline_553_v$$inline_825$$
      }
    }
  }
}
$X$array$$.prototype.sort = function $$X$array$$$$sort$() {
  $JSCompiler_StaticMethods_msort_$$(this, 0, this.$_array$.length)
};
function $X$camera2D$$($width$$21$$, $height$$19$$) {
  $X$camera$$.call(this, $width$$21$$, $height$$19$$);
  this.$_classname$ = "camera2D"
}
$goog$inherits$$($X$camera2D$$, $X$camera$$);
$X$camera2D$$.prototype.rotate = function $$X$camera2D$$$$rotate$($distance$$9$$) {
  $distance$$9$$ = $X$camera2D$$.$superClass_$.rotate.call(this, $distance$$9$$);
  var $_e$$ = new $X$event$WindowLevelEvent$$;
  0 < $distance$$9$$.x ? $_e$$.$_window$-- : 0 > $distance$$9$$.x && $_e$$.$_window$++;
  0 < $distance$$9$$.y ? $_e$$.$_level$++ : 0 > $distance$$9$$.y && $_e$$.$_level$--;
  this.dispatchEvent($_e$$)
};
$X$camera2D$$.prototype.$zoomIn$ = function $$X$camera2D$$$$$zoomIn$$($fast$$2$$) {
  var $zoomStep$$2$$ = 20;
  $fast$$2$$ != $JSCompiler_alias_NULL$$ && !$fast$$2$$ && ($zoomStep$$2$$ = 0.02);
  this.$_view$[14] += $zoomStep$$2$$
};
$X$camera2D$$.prototype.$zoomOut$ = function $$X$camera2D$$$$$zoomOut$$($fast$$3$$) {
  var $zoomStep$$3$$ = 20;
  $fast$$3$$ != $JSCompiler_alias_NULL$$ && !$fast$$3$$ && ($zoomStep$$3$$ = 0.02);
  this.$_view$[14] -= $zoomStep$$3$$
};
$X$camera2D$$.prototype.$pan$ = function $$X$camera2D$$$$$pan$$($distance$$10$$) {
  $goog$isArray$$($distance$$10$$) && 2 == $distance$$10$$.length ? $distance$$10$$ = new $X$$.$vector$($distance$$10$$[0], $distance$$10$$[1], 0) : $distance$$10$$ instanceof $X$$.$vector$ || $JSCompiler_alias_THROW$$(Error("Invalid distance vector for pan operation."));
  this.$_view$[12] -= $distance$$10$$.x / this.$_view$[14];
  this.$_view$[13] += $distance$$10$$.y / this.$_view$[14]
};
function $X$camera3D$$($width$$22$$, $height$$20$$) {
  $X$camera$$.call(this, $width$$22$$, $height$$20$$);
  this.$_classname$ = "camera3D";
  this.$_fieldOfView$ = 45;
  this.$_perspective$ = $X$$.$matrix$.$makePerspective$($X$$.$matrix$.$identity$(), this.$_fieldOfView$, $width$$22$$ / $height$$20$$, 1, 1E4)
}
$goog$inherits$$($X$camera3D$$, $X$camera$$);
$X$camera3D$$.prototype.rotate = function $$X$camera3D$$$$rotate$($angleY_distance$$11$$) {
  $angleY_distance$$11$$ = $X$camera3D$$.$superClass_$.rotate.call(this, $angleY_distance$$11$$);
  var $angleX$$ = -$angleY_distance$$11$$.x / 5 * Math.PI / 180;
  $angleY_distance$$11$$ = -$angleY_distance$$11$$.y / 5 * Math.PI / 180;
  var $axisX$$1$$ = new $X$$.$vector$(this.$_view$[1], this.$_view$[5], this.$_view$[9]), $axisY$$1$$ = new $X$$.$vector$(this.$_view$[0], this.$_view$[4], this.$_view$[8]);
  $axisX$$1$$.normalize();
  $axisY$$1$$.normalize();
  $X$$.$matrix$.rotate(this.$_view$, $angleX$$, $axisX$$1$$.x, $axisX$$1$$.y, $axisX$$1$$.$z$);
  $X$$.$matrix$.rotate(this.$_view$, $angleY_distance$$11$$, $axisY$$1$$.x, $axisY$$1$$.y, $axisY$$1$$.$z$)
};
$X$camera3D$$.prototype.$lookAt_$ = function $$X$camera3D$$$$$lookAt_$$($cameraPosition$$1$$, $targetPoint$$1$$) {
  var $matrix$$10$$ = $X$camera3D$$.$superClass_$.$lookAt_$.call(this, $cameraPosition$$1$$, $targetPoint$$1$$);
  $X$$.$matrix$.$makeLookAt$($matrix$$10$$, $cameraPosition$$1$$, $targetPoint$$1$$, this.$_up$);
  return $matrix$$10$$
};
function $JSCompiler_StaticMethods_unproject_$$($JSCompiler_StaticMethods_unproject_$self$$, $x$$101$$, $y$$74$$, $z$$35$$) {
  var $_in$$ = new Float32Array(4), $_out$$ = new Float32Array(4), $_m$$ = new Float32Array(16), $_A$$ = new Float32Array(16);
  new Float32Array(16);
  $X$$.$matrix$.multiply($JSCompiler_StaticMethods_unproject_$self$$.$_perspective$, $JSCompiler_StaticMethods_unproject_$self$$.$_view$, $_A$$);
  $X$$.$matrix$.$invert$($_A$$, $_m$$);
  $_in$$[0] = $x$$101$$;
  $_in$$[1] = $y$$74$$;
  $_in$$[2] = 2 * $z$$35$$ - 1;
  $_in$$[3] = 1;
  $X$$.$matrix$.$multiplyByVec4$($_m$$, $_in$$, $_out$$);
  $_out$$[3] = 1 / $_out$$[3];
  $_out$$[0] *= $_out$$[3];
  $_out$$[1] *= $_out$$[3];
  $_out$$[2] *= $_out$$[3];
  return $_out$$
}
$goog$exportSymbol$$("X.camera3D", $X$camera3D$$);
function $goog$events$EventHandler$$($opt_handler$$8$$) {
  $goog$Disposable$$.call(this);
  this.$handler_$ = $opt_handler$$8$$;
  this.$keys_$ = []
}
$goog$inherits$$($goog$events$EventHandler$$, $goog$Disposable$$);
var $goog$events$EventHandler$typeArray_$$ = [];
function $JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_listen$self$$, $src$$20$$, $type$$94$$, $opt_fn$$, $opt_capture$$8$$) {
  $goog$isArray$$($type$$94$$) || ($goog$events$EventHandler$typeArray_$$[0] = $type$$94$$, $type$$94$$ = $goog$events$EventHandler$typeArray_$$);
  for(var $i$$175$$ = 0;$i$$175$$ < $type$$94$$.length;$i$$175$$++) {
    var $key$$66$$ = $goog$events$listen$$($src$$20$$, $type$$94$$[$i$$175$$], $opt_fn$$ || $JSCompiler_StaticMethods_listen$self$$, $opt_capture$$8$$ || $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_listen$self$$.$handler_$ || $JSCompiler_StaticMethods_listen$self$$);
    $JSCompiler_StaticMethods_listen$self$$.$keys_$.push($key$$66$$)
  }
}
$goog$events$EventHandler$$.prototype.$removeAll$ = function $$goog$events$EventHandler$$$$$removeAll$$() {
  $goog$array$forEach$$(this.$keys_$, $goog$events$unlistenByKey$$);
  this.$keys_$.length = 0
};
$goog$events$EventHandler$$.prototype.handleEvent = function $$goog$events$EventHandler$$$$handleEvent$() {
  $JSCompiler_alias_THROW$$(Error("EventHandler.handleEvent not implemented"))
};
function $goog$ui$IdGenerator$$() {
}
$goog$ui$IdGenerator$$.$getInstance$ = function $$goog$ui$IdGenerator$$$$getInstance$$() {
  return $goog$ui$IdGenerator$$.$instance_$ ? $goog$ui$IdGenerator$$.$instance_$ : $goog$ui$IdGenerator$$.$instance_$ = new $goog$ui$IdGenerator$$
};
$goog$ui$IdGenerator$$.prototype.$nextId_$ = 0;
$goog$ui$IdGenerator$$.$getInstance$();
function $goog$ui$Component$$($opt_domHelper$$) {
  $goog$events$EventTarget$$.call(this);
  this.$dom_$ = $opt_domHelper$$ || $goog$dom$getDomHelper$$();
  this.$rightToLeft_$ = $goog$ui$Component$defaultRightToLeft_$$
}
$goog$inherits$$($goog$ui$Component$$, $goog$events$EventTarget$$);
$goog$ui$Component$$.prototype.$idGenerator_$ = $goog$ui$IdGenerator$$.$getInstance$();
var $goog$ui$Component$defaultRightToLeft_$$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$ = $goog$ui$Component$$.prototype;
$JSCompiler_prototypeAlias$$.$id_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$inDocument_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$element_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$rightToLeft_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$parent_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$children_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$childIndex_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$getElement$ = $JSCompiler_get$$("$element_$");
$JSCompiler_prototypeAlias$$.$setParentEventTarget$ = function $$JSCompiler_prototypeAlias$$$$setParentEventTarget$$($parent$$24$$) {
  this.$parent_$ && this.$parent_$ != $parent$$24$$ && $JSCompiler_alias_THROW$$(Error("Method not supported"));
  $goog$ui$Component$$.$superClass_$.$setParentEventTarget$.call(this, $parent$$24$$)
};
$JSCompiler_prototypeAlias$$.$getDomHelper$ = $JSCompiler_get$$("$dom_$");
$JSCompiler_prototypeAlias$$.$createDom$ = function $$JSCompiler_prototypeAlias$$$$createDom$$() {
  this.$element_$ = this.$dom_$.createElement("div")
};
$JSCompiler_prototypeAlias$$.$render$ = function $$JSCompiler_prototypeAlias$$$$render$$($opt_parentElement$$) {
  this.$render_$($opt_parentElement$$)
};
$JSCompiler_prototypeAlias$$.$render_$ = function $$JSCompiler_prototypeAlias$$$$render_$$($opt_parentElement$$1$$, $opt_beforeNode$$) {
  this.$inDocument_$ && $JSCompiler_alias_THROW$$(Error("Component already rendered"));
  this.$element_$ || this.$createDom$();
  $opt_parentElement$$1$$ ? $opt_parentElement$$1$$.insertBefore(this.$element_$, $opt_beforeNode$$ || $JSCompiler_alias_NULL$$) : this.$dom_$.$document_$.body.appendChild(this.$element_$);
  (!this.$parent_$ || this.$parent_$.$inDocument_$) && this.$enterDocument$()
};
$JSCompiler_prototypeAlias$$.$enterDocument$ = function $$JSCompiler_prototypeAlias$$$$enterDocument$$() {
  function $f$$inline_558$$($child$$8$$) {
    !$child$$8$$.$inDocument_$ && $child$$8$$.$getElement$() && $child$$8$$.$enterDocument$()
  }
  this.$inDocument_$ = $JSCompiler_alias_TRUE$$;
  this.$children_$ && $goog$array$forEach$$(this.$children_$, $f$$inline_558$$, $JSCompiler_alias_VOID$$)
};
$JSCompiler_prototypeAlias$$.$exitDocument$ = function $$JSCompiler_prototypeAlias$$$$exitDocument$$() {
  function $f$$inline_562$$($child$$9$$) {
    $child$$9$$.$inDocument_$ && $child$$9$$.$exitDocument$()
  }
  this.$children_$ && $goog$array$forEach$$(this.$children_$, $f$$inline_562$$, $JSCompiler_alias_VOID$$);
  this.$googUiComponentHandler_$ && this.$googUiComponentHandler_$.$removeAll$();
  this.$inDocument_$ = $JSCompiler_alias_FALSE$$
};
$JSCompiler_prototypeAlias$$.removeChild = function $$JSCompiler_prototypeAlias$$$removeChild$($child$$15$$, $opt_unrender$$) {
  if($child$$15$$) {
    var $JSCompiler_StaticMethods_setParent$self$$inline_572_id$$10$$ = $goog$isString$$($child$$15$$) ? $child$$15$$ : $child$$15$$.$id_$ || ($child$$15$$.$id_$ = ":" + ($child$$15$$.$idGenerator_$.$nextId_$++).toString(36)), $JSCompiler_temp$$inline_829_obj$$inline_569_obj$$inline_830$$;
    this.$childIndex_$ && $JSCompiler_StaticMethods_setParent$self$$inline_572_id$$10$$ ? ($JSCompiler_temp$$inline_829_obj$$inline_569_obj$$inline_830$$ = this.$childIndex_$, $JSCompiler_temp$$inline_829_obj$$inline_569_obj$$inline_830$$ = ($JSCompiler_StaticMethods_setParent$self$$inline_572_id$$10$$ in $JSCompiler_temp$$inline_829_obj$$inline_569_obj$$inline_830$$ ? $JSCompiler_temp$$inline_829_obj$$inline_569_obj$$inline_830$$[$JSCompiler_StaticMethods_setParent$self$$inline_572_id$$10$$] : $JSCompiler_alias_VOID$$) || 
    $JSCompiler_alias_NULL$$) : $JSCompiler_temp$$inline_829_obj$$inline_569_obj$$inline_830$$ = $JSCompiler_alias_NULL$$;
    $child$$15$$ = $JSCompiler_temp$$inline_829_obj$$inline_569_obj$$inline_830$$;
    $JSCompiler_StaticMethods_setParent$self$$inline_572_id$$10$$ && $child$$15$$ && ($JSCompiler_temp$$inline_829_obj$$inline_569_obj$$inline_830$$ = this.$childIndex_$, $JSCompiler_StaticMethods_setParent$self$$inline_572_id$$10$$ in $JSCompiler_temp$$inline_829_obj$$inline_569_obj$$inline_830$$ && delete $JSCompiler_temp$$inline_829_obj$$inline_569_obj$$inline_830$$[$JSCompiler_StaticMethods_setParent$self$$inline_572_id$$10$$], $goog$array$remove$$(this.$children_$, $child$$15$$), $opt_unrender$$ && 
    ($child$$15$$.$exitDocument$(), $child$$15$$.$element_$ && $goog$dom$removeNode$$($child$$15$$.$element_$)), $JSCompiler_StaticMethods_setParent$self$$inline_572_id$$10$$ = $child$$15$$, $JSCompiler_StaticMethods_setParent$self$$inline_572_id$$10$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("Unable to set parent component")), $JSCompiler_StaticMethods_setParent$self$$inline_572_id$$10$$.$parent_$ = $JSCompiler_alias_NULL$$, $goog$ui$Component$$.$superClass_$.$setParentEventTarget$.call($JSCompiler_StaticMethods_setParent$self$$inline_572_id$$10$$, 
    $JSCompiler_alias_NULL$$))
  }
  $child$$15$$ || $JSCompiler_alias_THROW$$(Error("Child is not in parent component"));
  return $child$$15$$
};
function $goog$ui$RangeModel$$() {
  $goog$events$EventTarget$$.call(this)
}
$goog$inherits$$($goog$ui$RangeModel$$, $goog$events$EventTarget$$);
$JSCompiler_prototypeAlias$$ = $goog$ui$RangeModel$$.prototype;
$JSCompiler_prototypeAlias$$.$value_$ = 0;
$JSCompiler_prototypeAlias$$.$minimum_$ = 0;
$JSCompiler_prototypeAlias$$.$maximum_$ = 100;
$JSCompiler_prototypeAlias$$.$extent_$ = 0;
$JSCompiler_prototypeAlias$$.$step_$ = 1;
$JSCompiler_prototypeAlias$$.$isChanging_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$mute_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$setValue$ = function $$JSCompiler_prototypeAlias$$$$setValue$$($value$$81$$) {
  $value$$81$$ = $JSCompiler_StaticMethods_roundToStepWithMin$$(this, $value$$81$$);
  this.$value_$ != $value$$81$$ && (this.$value_$ = $value$$81$$ + this.$extent_$ > this.$maximum_$ ? this.$maximum_$ - this.$extent_$ : $value$$81$$ < this.$minimum_$ ? this.$minimum_$ : $value$$81$$, !this.$isChanging_$ && !this.$mute_$ && this.dispatchEvent("change"))
};
$JSCompiler_prototypeAlias$$.$getValue$ = function $$JSCompiler_prototypeAlias$$$$getValue$$() {
  return $JSCompiler_StaticMethods_roundToStepWithMin$$(this, this.$value_$)
};
$JSCompiler_prototypeAlias$$.$getMinimum$ = function $$JSCompiler_prototypeAlias$$$$getMinimum$$() {
  return $JSCompiler_StaticMethods_roundToStepWithMin$$(this, this.$minimum_$)
};
$JSCompiler_prototypeAlias$$.$getMaximum$ = function $$JSCompiler_prototypeAlias$$$$getMaximum$$() {
  return $JSCompiler_StaticMethods_roundToStepWithMin$$(this, this.$maximum_$)
};
function $JSCompiler_StaticMethods_roundToStepWithMin$$($JSCompiler_StaticMethods_roundToStepWithMin$self$$, $value$$82$$) {
  return $JSCompiler_StaticMethods_roundToStepWithMin$self$$.$step_$ == $JSCompiler_alias_NULL$$ ? $value$$82$$ : $JSCompiler_StaticMethods_roundToStepWithMin$self$$.$minimum_$ + Math.round(($value$$82$$ - $JSCompiler_StaticMethods_roundToStepWithMin$self$$.$minimum_$) / $JSCompiler_StaticMethods_roundToStepWithMin$self$$.$step_$) * $JSCompiler_StaticMethods_roundToStepWithMin$self$$.$step_$
}
;function $goog$ui$ProgressBar$$($opt_domHelper$$1$$) {
  $goog$ui$Component$$.call(this, $opt_domHelper$$1$$);
  this.$rangeModel_$ = new $goog$ui$RangeModel$$;
  $goog$events$listen$$(this.$rangeModel_$, "change", this.$handleChange_$, $JSCompiler_alias_FALSE$$, this)
}
$goog$inherits$$($goog$ui$ProgressBar$$, $goog$ui$Component$$);
var $goog$ui$ProgressBar$ORIENTATION_TO_CSS_NAME_$$ = {vertical:"progress-bar-vertical", horizontal:"progress-bar-horizontal"};
$JSCompiler_prototypeAlias$$ = $goog$ui$ProgressBar$$.prototype;
$JSCompiler_prototypeAlias$$.$createDom$ = function $$JSCompiler_prototypeAlias$$$$createDom$$() {
  this.$thumbElement_$ = this.$getDomHelper$().$createDom$("div", "progress-bar-thumb");
  var $cs_element$$inline_579_element$$inline_582$$ = $goog$ui$ProgressBar$ORIENTATION_TO_CSS_NAME_$$[this.$orientation_$];
  this.$element_$ = this.$getDomHelper$().$createDom$("div", $cs_element$$inline_579_element$$inline_582$$, this.$thumbElement_$);
  $JSCompiler_StaticMethods_setValueState_$$(this);
  var $cs_element$$inline_579_element$$inline_582$$ = this.$getElement$(), $value$$inline_835_value$$inline_839$$ = this.$getMinimum$();
  $cs_element$$inline_579_element$$inline_582$$.setAttribute("aria-valuemin", $value$$inline_835_value$$inline_839$$);
  $cs_element$$inline_579_element$$inline_582$$ = this.$getElement$();
  $value$$inline_835_value$$inline_839$$ = this.$getMaximum$();
  $cs_element$$inline_579_element$$inline_582$$.setAttribute("aria-valuemax", $value$$inline_835_value$$inline_839$$)
};
$JSCompiler_prototypeAlias$$.$enterDocument$ = function $$JSCompiler_prototypeAlias$$$$enterDocument$$() {
  $goog$ui$ProgressBar$$.$superClass_$.$enterDocument$.call(this);
  $goog$userAgent$IE$$ && 7 > $goog$userAgent$VERSION$$ && $goog$events$listen$$(this.$getElement$(), "resize", this.$updateUi_$, $JSCompiler_alias_FALSE$$, this);
  this.$updateUi_$();
  var $element$$88$$ = this.$getElement$();
  $element$$88$$.setAttribute("role", "progressbar");
  $element$$88$$.setAttribute("aria-live", "polite")
};
$JSCompiler_prototypeAlias$$.$exitDocument$ = function $$JSCompiler_prototypeAlias$$$$exitDocument$$() {
  $goog$ui$ProgressBar$$.$superClass_$.$exitDocument$.call(this);
  $goog$userAgent$IE$$ && 7 > $goog$userAgent$VERSION$$ && $goog$events$unlisten$$(this.$getElement$(), "resize", this.$updateUi_$, $JSCompiler_alias_FALSE$$, this)
};
$JSCompiler_prototypeAlias$$.$getValue$ = function $$JSCompiler_prototypeAlias$$$$getValue$$() {
  return this.$rangeModel_$.$getValue$()
};
$JSCompiler_prototypeAlias$$.$setValue$ = function $$JSCompiler_prototypeAlias$$$$setValue$$($v$$15$$) {
  this.$rangeModel_$.$setValue$($v$$15$$);
  this.$getElement$() && $JSCompiler_StaticMethods_setValueState_$$(this)
};
function $JSCompiler_StaticMethods_setValueState_$$($JSCompiler_StaticMethods_setValueState_$self_value$$inline_847$$) {
  var $element$$90$$ = $JSCompiler_StaticMethods_setValueState_$self_value$$inline_847$$.$getElement$();
  $JSCompiler_StaticMethods_setValueState_$self_value$$inline_847$$ = $JSCompiler_StaticMethods_setValueState_$self_value$$inline_847$$.$getValue$();
  $element$$90$$.setAttribute("aria-valuenow", $JSCompiler_StaticMethods_setValueState_$self_value$$inline_847$$)
}
$JSCompiler_prototypeAlias$$.$getMinimum$ = function $$JSCompiler_prototypeAlias$$$$getMinimum$$() {
  return this.$rangeModel_$.$getMinimum$()
};
$JSCompiler_prototypeAlias$$.$getMaximum$ = function $$JSCompiler_prototypeAlias$$$$getMaximum$$() {
  return this.$rangeModel_$.$getMaximum$()
};
$JSCompiler_prototypeAlias$$.$orientation_$ = "horizontal";
$JSCompiler_prototypeAlias$$.$handleChange_$ = function $$JSCompiler_prototypeAlias$$$$handleChange_$$() {
  this.$updateUi_$();
  this.dispatchEvent("change")
};
$JSCompiler_prototypeAlias$$.$updateUi_$ = function $$JSCompiler_prototypeAlias$$$$updateUi_$$() {
  if(this.$thumbElement_$) {
    var $bottom$$8_min$$7_ratio$$1$$ = this.$getMinimum$(), $h$$6_max$$7_size$$20$$ = this.$getMaximum$(), $bottom$$8_min$$7_ratio$$1$$ = (this.$getValue$() - $bottom$$8_min$$7_ratio$$1$$) / ($h$$6_max$$7_size$$20$$ - $bottom$$8_min$$7_ratio$$1$$), $h$$6_max$$7_size$$20$$ = Math.round(100 * $bottom$$8_min$$7_ratio$$1$$);
    "vertical" == this.$orientation_$ ? $goog$userAgent$IE$$ && 7 > $goog$userAgent$VERSION$$ ? (this.$thumbElement_$.style.top = 0, this.$thumbElement_$.style.height = "100%", $h$$6_max$$7_size$$20$$ = this.$thumbElement_$.offsetHeight, $bottom$$8_min$$7_ratio$$1$$ = Math.round($bottom$$8_min$$7_ratio$$1$$ * $h$$6_max$$7_size$$20$$), this.$thumbElement_$.style.top = $h$$6_max$$7_size$$20$$ - $bottom$$8_min$$7_ratio$$1$$ + "px", this.$thumbElement_$.style.height = $bottom$$8_min$$7_ratio$$1$$ + "px") : 
    (this.$thumbElement_$.style.top = 100 - $h$$6_max$$7_size$$20$$ + "%", this.$thumbElement_$.style.height = $h$$6_max$$7_size$$20$$ + "%") : this.$thumbElement_$.style.width = $h$$6_max$$7_size$$20$$ + "%"
  }
};
function $X$progressbar$$($parent$$25$$, $initialvalue$$) {
  $parent$$25$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("No valid parent element."));
  $initialvalue$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("Invalid initial value."));
  $goog$ui$ProgressBar$$.call(this);
  this.$_classname$ = "progressbar";
  this.$_parent$ = $parent$$25$$;
  this.$_parent_position_original$ = "";
  this.$_doneProgressBar$ = this.$_style$ = $JSCompiler_alias_NULL$$;
  this.$_css$ = [];
  var $css1$$;
  $css1$$ = ".progress-bar-horizontal {\n  position: relative;\n  border: 1px solid #949dad;\n";
  $css1$$ += "  background: white;\n";
  $css1$$ += "  padding: 1px;\n";
  $css1$$ += "  overflow: hidden;\n";
  $css1$$ += "  margin: 2px;\n";
  $css1$$ += "  width: 100px;\n";
  $css1$$ += "  height: 5px;\n";
  $css1$$ += "}";
  var $css2$$;
  $css2$$ = ".progress-bar-thumb {\n  position: relative;\n  background: #F62217;\n";
  $css2$$ += "  overflow: hidden;\n";
  $css2$$ += "  width: 0%;\n";
  $css2$$ += "  height: 100%;\n";
  $css2$$ += "}";
  var $css3$$;
  $css3$$ = ".progress-bar-thumb-done {\n  background: #57E964;\n}";
  this.$_css$ = [$css1$$, $css2$$, $css3$$];
  this.$setValue$($initialvalue$$);
  this.$init_$()
}
$goog$inherits$$($X$progressbar$$, $goog$ui$ProgressBar$$);
$X$progressbar$$.prototype.$init_$ = function $$X$progressbar$$$$$init_$$() {
  var $head$$1_pbElement_position$$6$$ = $goog$style$getComputedStyle$$(this.$_parent$, "position");
  if("static" == $head$$1_pbElement_position$$6$$ || "" == $head$$1_pbElement_position$$6$$) {
    this.$_parent_position_original$ = this.$_parent$.style.position, this.$_parent$.style.position = "relative"
  }
  var $head$$1_pbElement_position$$6$$ = document.getElementsByTagName("head")[0], $style$$16$$ = $goog$dom$createDom$$("style");
  $style$$16$$.type = "text/css";
  $style$$16$$.media = "screen";
  var $css$$ = document.createTextNode(String(this.$_css$[0])), $css2$$1$$ = document.createTextNode(String(this.$_css$[1])), $css3$$1$$ = document.createTextNode(String(this.$_css$[2]));
  $head$$1_pbElement_position$$6$$.appendChild($style$$16$$);
  $style$$16$$.appendChild($css$$);
  $style$$16$$.appendChild($css2$$1$$);
  $style$$16$$.appendChild($css3$$1$$);
  this.$_style$ = $style$$16$$;
  this.$render$(this.$_parent$);
  $head$$1_pbElement_position$$6$$ = this.$getElement$();
  $head$$1_pbElement_position$$6$$.style.position = "absolute";
  $head$$1_pbElement_position$$6$$.style.top = (this.$_parent$.clientHeight - 5) / 2 + "px";
  $head$$1_pbElement_position$$6$$.style.left = (this.$_parent$.clientWidth - 100) / 2 + "px";
  $head$$1_pbElement_position$$6$$.classList.add("xtk-progress-bar")
};
function $JSCompiler_StaticMethods_done$$($JSCompiler_StaticMethods_done$self$$) {
  var $top$$9$$ = $JSCompiler_StaticMethods_done$self$$.$getElement$().style.top, $left$$13$$ = $JSCompiler_StaticMethods_done$self$$.$getElement$().style.left;
  $goog$dom$removeNode$$($JSCompiler_StaticMethods_done$self$$.$getElement$());
  var $pb$$ = new $X$progressbar$$($JSCompiler_StaticMethods_done$self$$.$_parent$, 100), $pbElement$$1$$ = $pb$$.$getElement$();
  $pbElement$$1$$.style.position = "absolute";
  $pbElement$$1$$.style.top = $top$$9$$;
  $pbElement$$1$$.style.left = $left$$13$$;
  $pbElement$$1$$.classList.add("xtk-progress-bar");
  ($pbElement$$1$$.firstElementChild != $JSCompiler_alias_VOID$$ ? $pbElement$$1$$.firstElementChild : $goog$dom$getNextElementNode_$$($pbElement$$1$$.firstChild)).classList.add("progress-bar-thumb-done");
  $JSCompiler_StaticMethods_done$self$$.$_doneProgressBar$ = $pb$$
}
$X$progressbar$$.prototype.$kill$ = function $$X$progressbar$$$$$kill$$() {
  this.$_style$ && $goog$dom$removeNode$$(this.$_style$);
  this.$getElement$() && $goog$dom$removeNode$$(this.$getElement$());
  this.$_doneProgressBar$ && $goog$dom$removeNode$$(this.$_doneProgressBar$.$getElement$());
  this.$_doneProgressBar$ = this.$_style$ = $JSCompiler_alias_NULL$$;
  this.$_parent_position_original$ && (this.$_parent$.style.position = this.$_parent_position_original$)
};
function $goog$Timer$callOnce$$($listener$$61$$, $opt_delay$$, $opt_handler$$14$$) {
  $goog$isFunction$$($listener$$61$$) ? $opt_handler$$14$$ && ($listener$$61$$ = $goog$bind$$($listener$$61$$, $opt_handler$$14$$)) : $listener$$61$$ && "function" == typeof $listener$$61$$.handleEvent ? $listener$$61$$ = $goog$bind$$($listener$$61$$.handleEvent, $listener$$61$$) : $JSCompiler_alias_THROW$$(Error("Invalid listener argument"));
  return 2147483647 < $opt_delay$$ ? -1 : $goog$global$$.setTimeout($listener$$61$$, $opt_delay$$ || 0)
}
;function $X$renderer$$() {
  $X$base$$.call(this);
  this.$_classname$ = "renderer";
  this.$_container$ = window.document.body;
  this.$_width$ = this.$_container$.clientWidth;
  this.$_height$ = this.$_container$.clientHeight;
  this.$_interactor$ = this.$_camera$ = this.$_canvas$ = $JSCompiler_alias_NULL$$;
  this.$_objects$ = new $X$array$$($X$object$OPACITY_COMPARATOR$$);
  this.$_topLevelObjects$ = [];
  this.$_loader$ = $JSCompiler_alias_NULL$$;
  this.$_onShowtime$ = this.$_loadingCompleted$ = this.$_locked$ = $JSCompiler_alias_FALSE$$;
  this.$_context$ = this.$_progressBar2$ = this.$_progressBar$ = $JSCompiler_alias_NULL$$;
  this.$_config$ = {PROGRESSBAR_ENABLED:$JSCompiler_alias_TRUE$$, INTERMEDIATE_RENDERING:$JSCompiler_alias_FALSE$$, SLICENAVIGATORS:$JSCompiler_alias_TRUE$$};
  this.$_AnimationFrameID$ = -1;
  window.console.log("XTK release 10 -- 2014-06-03 12:14:59 -- http://www.goXTK.com -- @goXTK")
}
$goog$inherits$$($X$renderer$$, $X$base$$);
$JSCompiler_prototypeAlias$$ = $X$renderer$$.prototype;
$JSCompiler_prototypeAlias$$.$onComputing$ = function $$JSCompiler_prototypeAlias$$$$onComputing$$() {
  window.cancelAnimationFrame(this.$_AnimationFrameID$);
  this.$_config$.PROGRESSBAR_ENABLED && (this.$_progressBar2$ = new $X$progressbar$$(this.$_container$, 3))
};
$JSCompiler_prototypeAlias$$.$onComputingEnd$ = function $$JSCompiler_prototypeAlias$$$$onComputingEnd$$() {
  this.$_config$.PROGRESSBAR_ENABLED && this.$_progressBar2$ && ($JSCompiler_StaticMethods_done$$(this.$_progressBar2$), this.$__readyCheckTimer2$ = $goog$Timer$callOnce$$(function() {
    this.$__readyCheckTimer2$ = $JSCompiler_alias_NULL$$;
    this.$_progressBar2$ && (this.$_progressBar2$.$kill$(), this.$_progressBar2$ = $JSCompiler_alias_NULL$$);
    this.$_loadingCompleted$ = this.$_onShowtime$ = $JSCompiler_alias_TRUE$$;
    this.$render$()
  }.bind(this), 700))
};
$JSCompiler_prototypeAlias$$.$onComputingProgress$ = function $$JSCompiler_prototypeAlias$$$$onComputingProgress$$($event$$27$$) {
  this.$_progressBar2$ && this.$_progressBar2$.$setValue$(100 * $event$$27$$.$_value$)
};
$JSCompiler_prototypeAlias$$.$onProgress$ = function $$JSCompiler_prototypeAlias$$$$onProgress$$($event$$28$$) {
  this.$_progressBar$ && this.$_progressBar$.$setValue$(100 * $event$$28$$.$_value$)
};
$JSCompiler_prototypeAlias$$.$onModified$ = function $$JSCompiler_prototypeAlias$$$$onModified$$($event$$29$$) {
  $event$$29$$ != $JSCompiler_alias_NULL$$ && $event$$29$$ instanceof $X$event$ModifiedEvent$$ && $event$$29$$.$_object$ && this.$update_$($event$$29$$.$_object$)
};
$JSCompiler_prototypeAlias$$.$onRemove$ = function $$JSCompiler_prototypeAlias$$$$onRemove$$($event$$30$$) {
  $event$$30$$ != $JSCompiler_alias_NULL$$ && $event$$30$$ instanceof $X$event$RemoveEvent$$ && $event$$30$$.$_object$ && this.remove($event$$30$$.$_object$)
};
$JSCompiler_prototypeAlias$$.$onHover_$ = function $$JSCompiler_prototypeAlias$$$$onHover_$$($event$$31$$) {
  ($event$$31$$ == $JSCompiler_alias_NULL$$ || !($event$$31$$ instanceof $X$event$HoverEvent$$)) && $JSCompiler_alias_THROW$$(Error("Invalid hover event."))
};
$JSCompiler_prototypeAlias$$.$onResize_$ = function $$JSCompiler_prototypeAlias$$$$onResize_$$() {
  var $canvas_container$$25$$ = $goog$dom$getElement$$(this.$_container$);
  this.$_width$ = $canvas_container$$25$$.clientWidth;
  this.$_height$ = $canvas_container$$25$$.clientHeight;
  $canvas_container$$25$$ = $goog$dom$getElement$$(this.$_canvas$);
  $canvas_container$$25$$.width = this.$_width$;
  $canvas_container$$25$$.height = this.$_height$;
  "renderer3D" == this.$_classname$ && (this.$_context$.viewport(0, 0, this.$_width$, this.$_height$), this.$_camera$.$_perspective$ = $X$$.$matrix$.$makePerspective$($X$$.$matrix$.$identity$(), this.$_camera$.$_fieldOfView$, this.$_canvas$.width / this.$_canvas$.height, 1, 1E4))
};
$JSCompiler_prototypeAlias$$.$onScroll_$ = function $$JSCompiler_prototypeAlias$$$$onScroll_$$($event$$32$$) {
  ($event$$32$$ == $JSCompiler_alias_NULL$$ || !($event$$32$$ instanceof $X$event$ScrollEvent$$)) && $JSCompiler_alias_THROW$$(Error("Invalid scroll event."))
};
$X$renderer$$.prototype.__defineGetter__("config", $JSCompiler_get$$("$_config$"));
$X$renderer$$.prototype.__defineGetter__("interactor", $JSCompiler_get$$("$_interactor$"));
$X$renderer$$.prototype.__defineGetter__("camera", $JSCompiler_get$$("$_camera$"));
$X$renderer$$.prototype.__defineGetter__("loadingCompleted", $JSCompiler_get$$("$_loadingCompleted$"));
$X$renderer$$.prototype.__defineGetter__("container", $JSCompiler_get$$("$_container$"));
$X$renderer$$.prototype.__defineSetter__("container", function($container$$26$$) {
  $container$$26$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("An ID to a valid container (<div>..) is required."));
  var $_container$$ = $container$$26$$;
  $goog$isString$$($_container$$) && ($_container$$ = $goog$dom$getElement$$($container$$26$$));
  $goog$isObject$$($_container$$) && 1 == $_container$$.nodeType || $JSCompiler_alias_THROW$$(Error("Could not find the given container."));
  this.$_container$ = $_container$$
});
$JSCompiler_prototypeAlias$$ = $X$renderer$$.prototype;
$JSCompiler_prototypeAlias$$.$resetViewAndRender$ = function $$JSCompiler_prototypeAlias$$$$resetViewAndRender$$() {
  this.$_camera$.reset()
};
$JSCompiler_prototypeAlias$$.$init$ = function $$JSCompiler_prototypeAlias$$$$init$$($_contextName$$) {
  var $_camera__canvas__interactor$$ = $goog$dom$createDom$$("canvas");
  this.$_container$.appendChild($_camera__canvas__interactor$$);
  this.$_width$ = this.$_container$.clientWidth;
  this.$_height$ = this.$_container$.clientHeight;
  $_camera__canvas__interactor$$.width = this.$_width$;
  $_camera__canvas__interactor$$.height = this.$_height$;
  try {
    var $_context$$ = $_camera__canvas__interactor$$.getContext($_contextName$$);
    $_context$$ || $JSCompiler_alias_THROW$$(Error())
  }catch($e$$44$$) {
    var $_msg$$ = "Sorry, " + $_contextName$$ + ' context is <strong>not supported</strong> on this machine! See <a href="http://crash.goXTK.com" target="_blank">http://crash.goXTK.com</a> for requirements..';
    this.$_container$.innerHTML = '<h3 style="color:red;font-family:sans-serif;">Oooops..</h3><p style="color:red;font-family:sans-serif;">' + $_msg$$ + "</p>";
    $JSCompiler_alias_THROW$$(Error($_msg$$))
  }
  this.$_loader$ = new $X$loader$$;
  $goog$events$listen$$(this.$_loader$, $X$event$events$PROGRESS$$, this.$onProgress$.bind(this));
  this.$_canvas$ = $_camera__canvas__interactor$$;
  this.$_context$ = $_context$$;
  $_camera__canvas__interactor$$ = new $X$interactor3D$$(this.$_canvas$);
  "2d" == $_contextName$$ && ($_camera__canvas__interactor$$ = new $X$interactor2D$$(this.$_canvas$));
  $_camera__canvas__interactor$$.$init$();
  $goog$events$listen$$($_camera__canvas__interactor$$, $X$event$events$RESETVIEW$$, this.$resetViewAndRender$.bind(this));
  $goog$events$listen$$($_camera__canvas__interactor$$, $X$event$events$HOVER$$, this.$onHover_$.bind(this));
  $goog$events$listen$$($_camera__canvas__interactor$$, $X$event$events$SCROLL$$, this.$onScroll_$.bind(this));
  this.$_interactor$ = $_camera__canvas__interactor$$;
  $_camera__canvas__interactor$$ = new $X$camera3D$$(this.$_width$, this.$_height$);
  "2d" == $_contextName$$ && ($_camera__canvas__interactor$$ = new $X$camera2D$$(this.$_width$, this.$_height$));
  $_camera__canvas__interactor$$.observe(this.$_interactor$);
  this.$_camera$ = $_camera__canvas__interactor$$;
  $goog$events$listen$$(window, "resize", this.$onResize_$, $JSCompiler_alias_FALSE$$, this)
};
$JSCompiler_prototypeAlias$$.add = function $$JSCompiler_prototypeAlias$$$add$($object$$39$$) {
  ($object$$39$$ instanceof $X$cube$$ || $object$$39$$ instanceof $X$sphere$$ || $object$$39$$ instanceof $X$cylinder$$) && $object$$39$$.$modified$();
  this.$_topLevelObjects$.push($object$$39$$);
  this.$update_$($object$$39$$)
};
$JSCompiler_prototypeAlias$$.remove = function $$JSCompiler_prototypeAlias$$$remove$($object$$40$$) {
  (!this.$_canvas$ || !this.$_context$) && $JSCompiler_alias_THROW$$(Error("The renderer was not initialized properly."));
  if($object$$40$$ != $JSCompiler_alias_NULL$$) {
    var $count$$inline_608$$ = 0;
    if($object$$40$$ != $JSCompiler_alias_NULL$$) {
      var $_numberOfTopLevelObjects_sourcesArray$$inline_611_srcUid$$inline_610$$ = $goog$getUid$$($object$$40$$);
      if($goog$events$sources_$$[$_numberOfTopLevelObjects_sourcesArray$$inline_611_srcUid$$inline_610$$]) {
        for(var $_numberOfTopLevelObjects_sourcesArray$$inline_611_srcUid$$inline_610$$ = $goog$events$sources_$$[$_numberOfTopLevelObjects_sourcesArray$$inline_611_srcUid$$inline_610$$], $_y$$2_i$$inline_612$$ = $_numberOfTopLevelObjects_sourcesArray$$inline_611_srcUid$$inline_610$$.length - 1;0 <= $_y$$2_i$$inline_612$$;$_y$$2_i$$inline_612$$--) {
          $goog$events$unlistenByKey$$($_numberOfTopLevelObjects_sourcesArray$$inline_611_srcUid$$inline_610$$[$_y$$2_i$$inline_612$$].key), $count$$inline_608$$++
        }
      }
    }else {
      $goog$object$forEach$$($goog$events$listeners_$$, function($listener$$inline_614$$, $key$$inline_615$$) {
        $goog$events$unlistenByKey$$($key$$inline_615$$);
        $count$$inline_608$$++
      })
    }
    $_numberOfTopLevelObjects_sourcesArray$$inline_611_srcUid$$inline_610$$ = this.$_topLevelObjects$.length;
    for($_y$$2_i$$inline_612$$ = 0;$_y$$2_i$$inline_612$$ < $_numberOfTopLevelObjects_sourcesArray$$inline_611_srcUid$$inline_610$$;$_y$$2_i$$inline_612$$++) {
      if(this.$_topLevelObjects$[$_y$$2_i$$inline_612$$].$_id$ == $object$$40$$.$_id$) {
        return this.$_topLevelObjects$[$_y$$2_i$$inline_612$$] = $JSCompiler_alias_NULL$$, this.$_topLevelObjects$.splice($_y$$2_i$$inline_612$$, 1), $JSCompiler_alias_TRUE$$
      }
    }
  }
  return $JSCompiler_alias_FALSE$$
};
$JSCompiler_prototypeAlias$$.$update_$ = function $$JSCompiler_prototypeAlias$$$$update_$$($object$$41$$) {
  (!this.$_canvas$ || !this.$_context$) && $JSCompiler_alias_THROW$$(Error("The renderer was not initialized properly."));
  $object$$41$$ != $JSCompiler_alias_NULL$$ && ($goog$events$hasListener$$($object$$41$$, $X$event$events$MODIFIED$$) || $goog$events$listen$$($object$$41$$, $X$event$events$MODIFIED$$, this.$onModified$.bind(this)), $goog$events$hasListener$$($object$$41$$, $X$event$events$REMOVE$$) || $goog$events$listen$$($object$$41$$, $X$event$events$REMOVE$$, this.$onRemove$.bind(this)), $goog$events$hasListener$$($object$$41$$, $X$event$events$COMPUTING$$) || $goog$events$listen$$($object$$41$$, $X$event$events$COMPUTING$$, 
  this.$onComputing$.bind(this)), $goog$events$hasListener$$($object$$41$$, $X$event$events$COMPUTING_PROGRESS$$) || $goog$events$listen$$($object$$41$$, $X$event$events$COMPUTING_PROGRESS$$, this.$onComputingProgress$.bind(this)), $goog$events$hasListener$$($object$$41$$, $X$event$events$COMPUTING_END$$) || $goog$events$listen$$($object$$41$$, $X$event$events$COMPUTING_END$$, this.$onComputingEnd$.bind(this)))
};
$JSCompiler_prototypeAlias$$.get = function $$JSCompiler_prototypeAlias$$$get$($id$$12$$) {
  $id$$12$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("Invalid object id."));
  for(var $_objects$$ = this.$_objects$.$_array$, $_numberOfObjects$$ = $_objects$$.length, $_k$$2$$ = 0, $_k$$2$$ = 0;$_k$$2$$ < $_numberOfObjects$$;$_k$$2$$++) {
    if($_objects$$[$_k$$2$$].$_id$ == $id$$12$$) {
      return $_objects$$[$_k$$2$$]
    }
  }
  return $JSCompiler_alias_NULL$$
};
$JSCompiler_prototypeAlias$$.$render$ = function $$JSCompiler_prototypeAlias$$$$render$$() {
  (!this.$_canvas$ || !this.$_context$) && $JSCompiler_alias_THROW$$(Error("The renderer was not initialized properly."));
  if(this.$_readyCheckTimer$ == $JSCompiler_alias_NULL$$) {
    if($JSCompiler_StaticMethods_containsValue$$(this.$_loader$.$_jobs$)) {
      if(this.$_config$.PROGRESSBAR_ENABLED && !this.$_progressBar$ && (this.$_progressBar$ = new $X$progressbar$$(this.$_container$, 3)), this.$_onShowtime$ = this.$_loadingCompleted$ = $JSCompiler_alias_FALSE$$, this.$_readyCheckTimer$ = $goog$Timer$callOnce$$(function() {
        this.$_readyCheckTimer$ = $JSCompiler_alias_NULL$$;
        this.$render$()
      }.bind(this), 100), !this.$_config$.INTERMEDIATE_RENDERING) {
        return
      }
    }else {
      if(!this.$_loadingCompleted$ && !this.$_onShowtime$ && (window.console.log("loadding completed"), this.$_onShowtime$ = $JSCompiler_alias_TRUE$$, eval("this.onShowtime()"), this.$_loadingCompleted$ = $JSCompiler_alias_TRUE$$), this.$_progressBar$) {
        this.$_config$.PROGRESSBAR_ENABLED && (this.$_progressBar$ && !this.$__readyCheckTimer2$) && ($JSCompiler_StaticMethods_done$$(this.$_progressBar$), this.$__readyCheckTimer2$ = $goog$Timer$callOnce$$(function() {
          this.$__readyCheckTimer2$ = $JSCompiler_alias_NULL$$;
          this.$_progressBar$ && (this.$_progressBar$.$kill$(), this.$_progressBar$ = $JSCompiler_alias_NULL$$);
          this.$render$()
        }.bind(this), 700));
        return
      }
    }
    this.$_AnimationFrameID$ = window.requestAnimationFrame(this.$render$.bind(this));
    eval("this.onRender()");
    this.$render_$($JSCompiler_alias_FALSE$$, $JSCompiler_alias_TRUE$$)
  }
};
$JSCompiler_prototypeAlias$$.$onShowtime$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$onRender$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$render_$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$destroy$ = function $$JSCompiler_prototypeAlias$$$$destroy$$() {
  window.cancelAnimationFrame(this.$_AnimationFrameID$);
  this.$_loader$ && (delete this.$_loader$, this.$_loader$ = $JSCompiler_alias_NULL$$);
  this.$_progressBar$ && (this.$_progressBar$.$kill$(), delete this.$_progressBar$, this.$_progressBar$ = $JSCompiler_alias_NULL$$);
  this.$_objects$.clear();
  delete this.$_objects$;
  this.$_topLevelObjects$.length = 0;
  delete this.$_topLevelObjects$;
  delete this.$_loader$;
  this.$_loader$ = $JSCompiler_alias_NULL$$;
  delete this.$_camera$;
  this.$_camera$ = $JSCompiler_alias_NULL$$;
  delete this.$_interactor$;
  this.$_interactor$ = $JSCompiler_alias_NULL$$;
  delete this.$_context$;
  this.$_context$ = $JSCompiler_alias_NULL$$;
  $goog$dom$removeNode$$(this.$_canvas$);
  delete this.$_canvas$;
  this.$_canvas$ = $JSCompiler_alias_NULL$$
};
function $X$shaders$$() {
  $X$base$$.call(this);
  this.$_classname$ = "shaders";
  this.$_vertexshaderSource$ = "";
  var $t$$5_t2$$;
  $t$$5_t2$$ = "precision mediump float;\n\n";
  $t$$5_t2$$ += "attribute vec3 vertexPosition;\n";
  $t$$5_t2$$ += "attribute vec3 vertexNormal;\n";
  $t$$5_t2$$ += "attribute vec3 vertexColor;\n";
  $t$$5_t2$$ += "attribute vec2 vertexTexturePos;\n";
  $t$$5_t2$$ += "attribute float vertexScalar;\n";
  $t$$5_t2$$ += "\n";
  $t$$5_t2$$ += "uniform mat4 view;\n";
  $t$$5_t2$$ += "uniform mat4 perspective;\n";
  $t$$5_t2$$ += "uniform vec3 center;\n";
  $t$$5_t2$$ += "uniform mat4 objectTransform;\n";
  $t$$5_t2$$ += "uniform bool useObjectColor;\n";
  $t$$5_t2$$ += "uniform bool useScalars;\n";
  $t$$5_t2$$ += "uniform bool scalarsReplaceMode;\n";
  $t$$5_t2$$ += "uniform float scalarsMin;\n";
  $t$$5_t2$$ += "uniform float scalarsMax;\n";
  $t$$5_t2$$ += "uniform vec3 scalarsMinColor;\n";
  $t$$5_t2$$ += "uniform vec3 scalarsMaxColor;\n";
  $t$$5_t2$$ += "uniform float scalarsMinThreshold;\n";
  $t$$5_t2$$ += "uniform float scalarsMaxThreshold;\n";
  $t$$5_t2$$ += "uniform int scalarsInterpolation;\n";
  $t$$5_t2$$ += "uniform vec3 objectColor;\n";
  $t$$5_t2$$ += "uniform float pointSize;\n";
  $t$$5_t2$$ += "\n";
  $t$$5_t2$$ += "varying float fDiscardNow;\n";
  $t$$5_t2$$ += "varying vec4 fVertexPosition;\n";
  $t$$5_t2$$ += "varying vec3 fragmentColor;\n";
  $t$$5_t2$$ += "varying vec2 fragmentTexturePos;\n";
  $t$$5_t2$$ += "varying vec3 fVertexNormal;\n";
  $t$$5_t2$$ += "varying vec3 fTransformedVertexNormal;\n";
  $t$$5_t2$$ += "\n";
  $t$$5_t2$$ += "void main(void) {\n";
  $t$$5_t2$$ += "  fTransformedVertexNormal = mat3(view[0].xyz,view[1].xyz,view[2].xyz) * ";
  $t$$5_t2$$ += "mat3(objectTransform[0].xyz,objectTransform[1].xyz,objectTransform[2].xyz) * ";
  $t$$5_t2$$ += "vertexNormal;\n";
  $t$$5_t2$$ += "  fVertexNormal = vertexNormal;\n";
  $t$$5_t2$$ += "  fDiscardNow = 0.0;\n";
  $t$$5_t2$$ += "  vec3 vertexPosition2 = vertexPosition - center;\n";
  $t$$5_t2$$ += "  fVertexPosition = view * objectTransform * vec4(vertexPosition2, 1.0);\n";
  $t$$5_t2$$ += "  fragmentTexturePos = vertexTexturePos;\n";
  $t$$5_t2$$ += "  if (useScalars) {\n";
  $t$$5_t2$$ += "    float scalarValue = vertexScalar;\n";
  $t$$5_t2$$ += "    if (scalarValue < scalarsMinThreshold || scalarValue > scalarsMaxThreshold) {\n";
  $t$$5_t2$$ += "      if (scalarsReplaceMode) {\n";
  $t$$5_t2$$ += "        fragmentColor = objectColor;\n";
  $t$$5_t2$$ += "      } else {\n";
  $t$$5_t2$$ += "        fDiscardNow = 1.0;\n";
  $t$$5_t2$$ += "      }\n";
  $t$$5_t2$$ += "    } else {\n";
  $t$$5_t2$$ += "      if (scalarsReplaceMode) {\n";
  $t$$5_t2$$ += "        if (scalarsInterpolation == 1) {\n";
  $t$$5_t2$$ += "            vec3 zeroMaxColor;\n";
  $t$$5_t2$$ += "            vec3 zeroMinColor;\n";
  $t$$5_t2$$ += "            zeroMaxColor[0] = scalarsMaxColor[0]*0.33;\n";
  $t$$5_t2$$ += "            zeroMaxColor[1] = scalarsMaxColor[1]*0.33;\n";
  $t$$5_t2$$ += "            zeroMaxColor[2] = scalarsMaxColor[2]*0.33;\n";
  $t$$5_t2$$ += "            zeroMinColor[0] = scalarsMinColor[0]*0.33;\n";
  $t$$5_t2$$ += "            zeroMinColor[1] = scalarsMinColor[1]*0.33;\n";
  $t$$5_t2$$ += "            zeroMinColor[2] = scalarsMinColor[2]*0.33;\n";
  $t$$5_t2$$ += "            if(scalarValue < 0.0) {fragmentColor = scalarValue/(scalarsMin) * scalarsMinColor + (1.0 - scalarValue/(scalarsMin)) * (zeroMinColor);}\n";
  $t$$5_t2$$ += "            else {fragmentColor = scalarValue/(scalarsMax) * scalarsMaxColor + (1.0 - scalarValue/(scalarsMax)) * (zeroMaxColor);}\n";
  $t$$5_t2$$ += "        } else {\n";
  $t$$5_t2$$ += "            fragmentColor = scalarValue * scalarsMaxColor + (1.0 - scalarValue) * scalarsMinColor;\n";
  $t$$5_t2$$ += "          }\n";
  $t$$5_t2$$ += "      } else {\n";
  $t$$5_t2$$ += "        fragmentColor = vertexColor;\n";
  $t$$5_t2$$ += "      }\n";
  $t$$5_t2$$ += "    }\n";
  $t$$5_t2$$ += "  } else if (useObjectColor) {\n";
  $t$$5_t2$$ += "    fragmentColor = objectColor;\n";
  $t$$5_t2$$ += "  } else {\n";
  $t$$5_t2$$ += "    fragmentColor = vertexColor;\n";
  $t$$5_t2$$ += "  }\n";
  $t$$5_t2$$ += "  gl_PointSize = pointSize;\n";
  $t$$5_t2$$ += "  gl_Position = perspective * fVertexPosition;\n";
  this.$_vertexshaderSource$ = $t$$5_t2$$ += "}\n";
  this.$_fragmentshaderSource$ = "";
  $t$$5_t2$$ = "precision mediump float;\n\n";
  $t$$5_t2$$ += "uniform bool usePicking;\n";
  $t$$5_t2$$ += "uniform bool useTexture;\n";
  $t$$5_t2$$ += "uniform bool volumeTexture;\n";
  $t$$5_t2$$ += "uniform bool useLabelMapTexture;\n";
  $t$$5_t2$$ += "uniform sampler2D textureSampler;\n";
  $t$$5_t2$$ += "uniform sampler2D textureSampler2;\n";
  $t$$5_t2$$ += "uniform float objectOpacity;\n";
  $t$$5_t2$$ += "uniform float labelmapOpacity;\n";
  $t$$5_t2$$ += "uniform vec4 labelmapColor;\n";
  $t$$5_t2$$ += "uniform float volumeLowerThreshold;\n";
  $t$$5_t2$$ += "uniform float volumeUpperThreshold;\n";
  $t$$5_t2$$ += "uniform float volumeScalarMin;\n";
  $t$$5_t2$$ += "uniform float volumeScalarMax;\n";
  $t$$5_t2$$ += "uniform vec3 volumeScalarMinColor;\n";
  $t$$5_t2$$ += "uniform vec3 volumeScalarMaxColor;\n";
  $t$$5_t2$$ += "uniform float volumeWindowLow;\n";
  $t$$5_t2$$ += "uniform float volumeWindowHigh;\n";
  $t$$5_t2$$ += "\n";
  $t$$5_t2$$ += "varying float fDiscardNow;\n";
  $t$$5_t2$$ += "varying vec4 fVertexPosition;\n";
  $t$$5_t2$$ += "varying vec3 fragmentColor;\n";
  $t$$5_t2$$ += "varying vec2 fragmentTexturePos;\n";
  $t$$5_t2$$ += "varying vec3 fVertexNormal;\n";
  $t$$5_t2$$ += "varying vec3 fTransformedVertexNormal;\n";
  $t$$5_t2$$ += "\n";
  $t$$5_t2$$ += "void main(void) {\n";
  $t$$5_t2$$ += " if (fDiscardNow > 0.0) {\n";
  $t$$5_t2$$ += "   discard;\n";
  $t$$5_t2$$ += " }\n";
  $t$$5_t2$$ += " if (usePicking) {\n";
  $t$$5_t2$$ += "   gl_FragColor = vec4(fragmentColor, 1.0);\n";
  $t$$5_t2$$ += " } else if (useTexture) {\n";
  $t$$5_t2$$ += "   vec4 texture1 = texture2D(textureSampler,fragmentTexturePos);\n";
  $t$$5_t2$$ += "   vec4 textureSum = texture1;\n";
  $t$$5_t2$$ += "   if (volumeTexture) {\n";
  $t$$5_t2$$ += "     float _windowLow = (volumeWindowLow / volumeScalarMax);\n";
  $t$$5_t2$$ += "     float _windowHigh = (volumeWindowHigh / volumeScalarMax);\n";
  $t$$5_t2$$ += "     vec3 _minrange = vec3(_windowLow,_windowLow,_windowLow);\n";
  $t$$5_t2$$ += "     vec3 _maxrange = vec3(_windowHigh,_windowHigh,_windowHigh);\n";
  $t$$5_t2$$ += "     vec3 fac = _maxrange - _minrange;\n";
  $t$$5_t2$$ += "     textureSum = vec4((textureSum.r - _minrange)/fac,1);\n";
  $t$$5_t2$$ += "     textureSum = textureSum.r * vec4(volumeScalarMaxColor,1) + (1.0 - textureSum.r) * vec4(volumeScalarMinColor,1);\n";
  $t$$5_t2$$ += "   }\n";
  $t$$5_t2$$ += "   if (useLabelMapTexture) {\n";
  $t$$5_t2$$ += "     vec4 texture2 = texture2D(textureSampler2,fragmentTexturePos);\n";
  $t$$5_t2$$ += "     if (texture2.a > 0.0) {\n";
  $t$$5_t2$$ += "         if (labelmapColor.a != -255.0) {\n";
  $t$$5_t2$$ += "           if (all(equal(floor(texture2 * vec4(255)), labelmapColor))) {\n";
  $t$$5_t2$$ += "             if (labelmapOpacity < 1.0) {\n";
  $t$$5_t2$$ += "               textureSum = mix(texture2, textureSum, 1.0 - labelmapOpacity);\n";
  $t$$5_t2$$ += "             } else {\n";
  $t$$5_t2$$ += "               textureSum = texture2;\n";
  $t$$5_t2$$ += "             }\n";
  $t$$5_t2$$ += "           }\n";
  $t$$5_t2$$ += "         } else {\n";
  $t$$5_t2$$ += "           if (labelmapOpacity < 1.0) {\n";
  $t$$5_t2$$ += "             textureSum = mix(texture2, textureSum, 1.0 - labelmapOpacity);\n";
  $t$$5_t2$$ += "           } else {\n";
  $t$$5_t2$$ += "             textureSum = texture2;\n";
  $t$$5_t2$$ += "           }\n";
  $t$$5_t2$$ += "         }\n";
  $t$$5_t2$$ += "     }\n";
  $t$$5_t2$$ += "   }\n";
  $t$$5_t2$$ += "   if (volumeTexture) {\n";
  $t$$5_t2$$ += "     float _volumeLowerThreshold = (volumeLowerThreshold / volumeScalarMax);\n";
  $t$$5_t2$$ += "     float _volumeUpperThreshold = (volumeUpperThreshold / volumeScalarMax);\n";
  $t$$5_t2$$ += "     if (texture1.r < _volumeLowerThreshold ||\n";
  $t$$5_t2$$ += "         texture1.r > _volumeUpperThreshold ||\n";
  $t$$5_t2$$ += "         texture1.a == 0.0 ) {\n";
  $t$$5_t2$$ += "       discard;\n";
  $t$$5_t2$$ += "     };\n";
  $t$$5_t2$$ += "   };\n";
  $t$$5_t2$$ += "   gl_FragColor = textureSum;\n";
  $t$$5_t2$$ += "   gl_FragColor.a = objectOpacity;\n";
  $t$$5_t2$$ += " } else {\n";
  $t$$5_t2$$ += "   vec3 nNormal = normalize(fTransformedVertexNormal);\n";
  $t$$5_t2$$ += "   if (fVertexNormal == vec3(0.0,0.0,0.0)) {\n";
  $t$$5_t2$$ += "     gl_FragColor = vec4(fragmentColor,1.0);\n";
  $t$$5_t2$$ += "     return;\n";
  $t$$5_t2$$ += "   }\n";
  $t$$5_t2$$ += "   vec3 light = vec3(0.0, 0.0, 1.0);\n";
  $t$$5_t2$$ += "   vec3 lightDirection = vec3(0,0,-10);\n";
  $t$$5_t2$$ += "   lightDirection = normalize(lightDirection);\n";
  $t$$5_t2$$ += "   vec3 eyeDirection = normalize(-fVertexPosition.xyz);\n";
  $t$$5_t2$$ += "   vec3 reflectionDirection = reflect(-lightDirection, nNormal);\n";
  $t$$5_t2$$ += "   float specular = pow(max(dot(reflectionDirection, eyeDirection), 0.0), 10.0);\n";
  $t$$5_t2$$ += "   float diffuse = 0.8 * max(dot(nNormal, light), 0.0);\n";
  $t$$5_t2$$ += "   float ambient = 0.3;\n";
  $t$$5_t2$$ += "   gl_FragColor = vec4(fragmentColor * ambient +\n";
  $t$$5_t2$$ += "                       fragmentColor * diffuse +\n";
  $t$$5_t2$$ += "                       vec3(0.2, 0.2, 0.2) * specular,\n";
  $t$$5_t2$$ += "                       objectOpacity);\n";
  $t$$5_t2$$ += " }\n";
  this.$_fragmentshaderSource$ = $t$$5_t2$$ += "}\n"
}
$goog$inherits$$($X$shaders$$, $X$base$$);
var $X$shaders$attributes$$ = {$VERTEXPOSITION$:"vertexPosition", $VERTEXNORMAL$:"vertexNormal", $VERTEXCOLOR$:"vertexColor", $VERTEXTEXTUREPOS$:"vertexTexturePos", $VERTEXSCALAR$:"vertexScalar"}, $X$shaders$uniforms$$ = {$VIEW$:"view", $PERSPECTIVE$:"perspective", $CENTER$:"center", $OBJECTTRANSFORM$:"objectTransform", $USEOBJECTCOLOR$:"useObjectColor", $OBJECTCOLOR$:"objectColor", $USESCALARS$:"useScalars", $SCALARSREPLACEMODE$:"scalarsReplaceMode", $SCALARSMIN$:"scalarsMin", $SCALARSMAX$:"scalarsMax", 
$SCALARSMINCOLOR$:"scalarsMinColor", $SCALARSMAXCOLOR$:"scalarsMaxColor", $SCALARSMINTHRESHOLD$:"scalarsMinThreshold", $SCALARSMAXTHRESHOLD$:"scalarsMaxThreshold", $SCALARSINTERPOLATION$:"scalarsInterpolation", $POINTSIZE$:"pointSize", $OBJECTOPACITY$:"objectOpacity", $NORMAL$:"normal", $USEPICKING$:"usePicking", $USETEXTURE$:"useTexture", $USELABELMAPTEXTURE$:"useLabelMapTexture", $LABELMAPOPACITY$:"labelmapOpacity", $LABELMAPCOLOR$:"labelmapColor", $TEXTURESAMPLER$:"textureSampler", $TEXTURESAMPLER2$:"textureSampler2", 
$VOLUMELOWERTHRESHOLD$:"volumeLowerThreshold", $VOLUMEUPPERTHRESHOLD$:"volumeUpperThreshold", $VOLUMESCALARMIN$:"volumeScalarMin", $VOLUMESCALARMAX$:"volumeScalarMax", $VOLUMESCALARMINCOLOR$:"volumeScalarMinColor", $VOLUMESCALARMAXCOLOR$:"volumeScalarMaxColor", $VOLUMEWINDOWLOW$:"volumeWindowLow", $VOLUMEWINDOWHIGH$:"volumeWindowHigh", $VOLUMETEXTURE$:"volumeTexture"};
function $X$buffer$$($glBuffer$$, $itemCount$$, $itemSize$$) {
  $glBuffer$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("Invalid GL Buffer."));
  $itemCount$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("Invalid number of items."));
  $itemSize$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("Invalid item size."));
  $X$base$$.call(this);
  this.$_classname$ = "buffer";
  this.$_glBuffer$ = $glBuffer$$;
  this.$_itemCount$ = $itemCount$$;
  this.$_itemSize$ = $itemSize$$
}
$goog$inherits$$($X$buffer$$, $X$base$$);
function $goog$positioning$positionAtAnchor$$($anchorElement_corner$$, $absolutePos_anchorElementCorner$$, $movableElement$$, $movableElementCorner$$, $opt_offset$$11$$, $opt_margin$$, $opt_overflow$$, $opt_preferredSize$$) {
  var $movableParentTopLeft_parent$$inline_623$$, $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$;
  if($movableParentTopLeft_parent$$inline_623$$ = $movableElement$$.offsetParent) {
    var $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$ = "HTML" == $movableParentTopLeft_parent$$inline_623$$.tagName || "BODY" == $movableParentTopLeft_parent$$inline_623$$.tagName;
    if(!$JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$ || "static" != $goog$style$getStyle_$$($movableParentTopLeft_parent$$inline_623$$, "position")) {
      $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$ = $goog$style$getPageOffset$$($movableParentTopLeft_parent$$inline_623$$), $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$ || ($JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$ = ($JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$ = 
      $goog$style$isRightToLeft$$($movableParentTopLeft_parent$$inline_623$$)) && $goog$userAgent$GECKO$$ ? -$movableParentTopLeft_parent$$inline_623$$.scrollLeft : $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$ && (!$goog$userAgent$IE$$ || !$goog$userAgent$isVersionOrHigher$$("8")) && "visible" != $goog$style$getStyle_$$($movableParentTopLeft_parent$$inline_623$$, "overflowX") ? $movableParentTopLeft_parent$$inline_623$$.scrollWidth - 
      $movableParentTopLeft_parent$$inline_623$$.clientWidth - $movableParentTopLeft_parent$$inline_623$$.scrollLeft : $movableParentTopLeft_parent$$inline_623$$.scrollLeft, $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$ = $goog$math$Coordinate$difference$$($JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$, new $goog$math$Coordinate$$($JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$, 
      $movableParentTopLeft_parent$$inline_623$$.scrollTop)))
    }
  }
  $movableParentTopLeft_parent$$inline_623$$ = $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$ || new $goog$math$Coordinate$$;
  $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$ = $goog$style$getPageOffset$$($anchorElement_corner$$);
  $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$ = $goog$style$getSize$$($anchorElement_corner$$);
  $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$ = new $goog$math$Rect$$($JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$.x, $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$.y, $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$.width, $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$.height);
  ($JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$ = $goog$style$getVisibleRectForElement$$($anchorElement_corner$$)) && $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$.$intersection$(new $goog$math$Rect$$($JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$.left, $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$.top, 
  $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$.right - $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$.left, $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$.bottom - $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$.top));
  var $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$ = $goog$dom$getDomHelper$$($anchorElement_corner$$), $newBase$$inline_632_relativeWin$$inline_857$$ = $goog$dom$getDomHelper$$($movableElement$$);
  if($JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$.$document_$ != $newBase$$inline_632_relativeWin$$inline_857$$.$document_$) {
    var $body$$inline_633_pos$$inline_634$$ = $JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$.$document_$.body, $newBase$$inline_632_relativeWin$$inline_857$$ = $newBase$$inline_632_relativeWin$$inline_857$$.$document_$.parentWindow || $newBase$$inline_632_relativeWin$$inline_857$$.$document_$.defaultView, $position$$inline_858$$ = new $goog$math$Coordinate$$(0, 0), $currentWin$$inline_859$$ = $goog$dom$getOwnerDocument$$($body$$inline_633_pos$$inline_634$$) ? 
    $goog$dom$getOwnerDocument$$($body$$inline_633_pos$$inline_634$$).parentWindow || $goog$dom$getOwnerDocument$$($body$$inline_633_pos$$inline_634$$).defaultView : window, $currentEl$$inline_860$$ = $body$$inline_633_pos$$inline_634$$;
    do {
      var $offset$$inline_861$$ = $currentWin$$inline_859$$ == $newBase$$inline_632_relativeWin$$inline_857$$ ? $goog$style$getPageOffset$$($currentEl$$inline_860$$) : $goog$style$getClientPosition$$($currentEl$$inline_860$$);
      $position$$inline_858$$.x += $offset$$inline_861$$.x;
      $position$$inline_858$$.y += $offset$$inline_861$$.y
    }while($currentWin$$inline_859$$ && $currentWin$$inline_859$$ != $newBase$$inline_632_relativeWin$$inline_857$$ && ($currentEl$$inline_860$$ = $currentWin$$inline_859$$.frameElement) && ($currentWin$$inline_859$$ = $currentWin$$inline_859$$.parent));
    $body$$inline_633_pos$$inline_634$$ = $goog$math$Coordinate$difference$$($position$$inline_858$$, $goog$style$getPageOffset$$($body$$inline_633_pos$$inline_634$$));
    $goog$userAgent$IE$$ && !$JSCompiler_StaticMethods_isCss1CompatMode$$($JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$) && ($body$$inline_633_pos$$inline_634$$ = $goog$math$Coordinate$difference$$($body$$inline_633_pos$$inline_634$$, $JSCompiler_StaticMethods_getDocumentScroll$$($JSCompiler_inline_result$$770_isBody$$inline_624_isRtl$$inline_850_origBase$$inline_631_s$$inline_854_visibleBox$$inline_628$$)));
    $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$.left += $body$$inline_633_pos$$inline_634$$.x;
    $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$.top += $body$$inline_633_pos$$inline_634$$.y
  }
  $anchorElement_corner$$ = ($absolutePos_anchorElementCorner$$ & 4 && $goog$style$isRightToLeft$$($anchorElement_corner$$) ? $absolutePos_anchorElementCorner$$ ^ 2 : $absolutePos_anchorElementCorner$$) & -5;
  $absolutePos_anchorElementCorner$$ = new $goog$math$Coordinate$$($anchorElement_corner$$ & 2 ? $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$.left + $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$.width : $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$.left, $anchorElement_corner$$ & 1 ? $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$.top + 
  $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$.height : $JSCompiler_temp_const$$769_movableParentTopLeft$$inline_622_o$$inline_853_rect$$inline_627$$.top);
  $absolutePos_anchorElementCorner$$ = $goog$math$Coordinate$difference$$($absolutePos_anchorElementCorner$$, $movableParentTopLeft_parent$$inline_623$$);
  $opt_offset$$11$$ && ($absolutePos_anchorElementCorner$$.x += ($anchorElement_corner$$ & 2 ? -1 : 1) * $opt_offset$$11$$.x, $absolutePos_anchorElementCorner$$.y += ($anchorElement_corner$$ & 1 ? -1 : 1) * $opt_offset$$11$$.y);
  var $viewport$$;
  if($opt_overflow$$ && ($viewport$$ = $goog$style$getVisibleRectForElement$$($movableElement$$))) {
    $viewport$$.top -= $movableParentTopLeft_parent$$inline_623$$.y, $viewport$$.right -= $movableParentTopLeft_parent$$inline_623$$.x, $viewport$$.bottom -= $movableParentTopLeft_parent$$inline_623$$.y, $viewport$$.left -= $movableParentTopLeft_parent$$inline_623$$.x
  }
  return $goog$positioning$positionAtCoordinate$$($absolutePos_anchorElementCorner$$, $movableElement$$, $movableElementCorner$$, $opt_margin$$, $viewport$$, $opt_overflow$$, $opt_preferredSize$$)
}
function $goog$positioning$positionAtCoordinate$$($absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$, $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, $elementSize_movableElementCorner$$1_style$$inline_652$$, $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$, $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$, $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$, 
$opt_preferredSize$$1_size$$21$$) {
  $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$ = $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$.$clone$();
  var $JSCompiler_temp$$2_pos$$inline_636_status$$ = 0, $corner$$1$$ = ($elementSize_movableElementCorner$$1_style$$inline_652$$ & 4 && $goog$style$isRightToLeft$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$) ? $elementSize_movableElementCorner$$1_style$$inline_652$$ ^ 2 : $elementSize_movableElementCorner$$1_style$$inline_652$$) & -5;
  $elementSize_movableElementCorner$$1_style$$inline_652$$ = $goog$style$getSize$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$);
  $opt_preferredSize$$1_size$$21$$ = $opt_preferredSize$$1_size$$21$$ ? $opt_preferredSize$$1_size$$21$$.$clone$() : $elementSize_movableElementCorner$$1_style$$inline_652$$.$clone$();
  if($bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ || 0 != $corner$$1$$) {
    $corner$$1$$ & 2 ? $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$.x -= $opt_preferredSize$$1_size$$21$$.width + ($bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ ? $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$.right : 0) : $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ && ($absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$.x += 
    $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$.left), $corner$$1$$ & 1 ? $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$.y -= $opt_preferredSize$$1_size$$21$$.height + ($bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ ? $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$.bottom : 0) : $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ && ($absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$.y += 
    $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$.top)
  }
  if($arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$) {
    if($buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$) {
      $JSCompiler_temp$$2_pos$$inline_636_status$$ = $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$;
      $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ = 0;
      if(65 == ($arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ & 65) && ($JSCompiler_temp$$2_pos$$inline_636_status$$.x < $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.left || $JSCompiler_temp$$2_pos$$inline_636_status$$.x >= $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.right)) {
        $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ &= -2
      }
      if(132 == ($arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ & 132) && ($JSCompiler_temp$$2_pos$$inline_636_status$$.y < $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.top || $JSCompiler_temp$$2_pos$$inline_636_status$$.y >= $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.bottom)) {
        $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ &= -5
      }
      $JSCompiler_temp$$2_pos$$inline_636_status$$.x < $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.left && $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ & 1 && ($JSCompiler_temp$$2_pos$$inline_636_status$$.x = $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.left, $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ |= 1);
      $JSCompiler_temp$$2_pos$$inline_636_status$$.x < $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.left && ($JSCompiler_temp$$2_pos$$inline_636_status$$.x + $opt_preferredSize$$1_size$$21$$.width > $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.right && $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ & 16) && ($opt_preferredSize$$1_size$$21$$.width = Math.max($opt_preferredSize$$1_size$$21$$.width - 
      ($JSCompiler_temp$$2_pos$$inline_636_status$$.x + $opt_preferredSize$$1_size$$21$$.width - $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.right), 0), $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ |= 4);
      $JSCompiler_temp$$2_pos$$inline_636_status$$.x + $opt_preferredSize$$1_size$$21$$.width > $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.right && $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ & 1 && ($JSCompiler_temp$$2_pos$$inline_636_status$$.x = Math.max($buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.right - $opt_preferredSize$$1_size$$21$$.width, $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.left), 
      $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ |= 1);
      $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ & 2 && ($bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ |= ($JSCompiler_temp$$2_pos$$inline_636_status$$.x < $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.left ? 16 : 0) | ($JSCompiler_temp$$2_pos$$inline_636_status$$.x + $opt_preferredSize$$1_size$$21$$.width > $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.right ? 
      32 : 0));
      $JSCompiler_temp$$2_pos$$inline_636_status$$.y < $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.top && $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ & 4 && ($JSCompiler_temp$$2_pos$$inline_636_status$$.y = $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.top, $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ |= 2);
      $JSCompiler_temp$$2_pos$$inline_636_status$$.y <= $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.top && ($JSCompiler_temp$$2_pos$$inline_636_status$$.y + $opt_preferredSize$$1_size$$21$$.height < $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.bottom && $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ & 32) && ($opt_preferredSize$$1_size$$21$$.height = Math.max($opt_preferredSize$$1_size$$21$$.height - 
      ($buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.top - $JSCompiler_temp$$2_pos$$inline_636_status$$.y), 0), $JSCompiler_temp$$2_pos$$inline_636_status$$.y = 0, $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ |= 8);
      $JSCompiler_temp$$2_pos$$inline_636_status$$.y >= $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.top && ($JSCompiler_temp$$2_pos$$inline_636_status$$.y + $opt_preferredSize$$1_size$$21$$.height > $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.bottom && $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ & 32) && ($opt_preferredSize$$1_size$$21$$.height = Math.max($opt_preferredSize$$1_size$$21$$.height - 
      ($JSCompiler_temp$$2_pos$$inline_636_status$$.y + $opt_preferredSize$$1_size$$21$$.height - $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.bottom), 0), $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ |= 8);
      $JSCompiler_temp$$2_pos$$inline_636_status$$.y + $opt_preferredSize$$1_size$$21$$.height > $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.bottom && $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ & 4 && ($JSCompiler_temp$$2_pos$$inline_636_status$$.y = Math.max($buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.bottom - $opt_preferredSize$$1_size$$21$$.height, 
      $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.top), $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ |= 2);
      $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ & 8 && ($bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ |= ($JSCompiler_temp$$2_pos$$inline_636_status$$.y < $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.top ? 64 : 0) | ($JSCompiler_temp$$2_pos$$inline_636_status$$.y + $opt_preferredSize$$1_size$$21$$.height > $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$.bottom ? 
      128 : 0));
      $JSCompiler_temp$$2_pos$$inline_636_status$$ = $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$
    }else {
      $JSCompiler_temp$$2_pos$$inline_636_status$$ = 256
    }
    if($JSCompiler_temp$$2_pos$$inline_636_status$$ & 496) {
      return $JSCompiler_temp$$2_pos$$inline_636_status$$
    }
  }
  $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ = $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$;
  $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$ = $goog$userAgent$GECKO$$ && ($goog$userAgent$detectedMac_$$ || $goog$userAgent$X11$$) && $goog$userAgent$isVersionOrHigher$$("1.9");
  $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ instanceof $goog$math$Coordinate$$ ? ($absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$ = $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$.x, $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ = $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$.y) : 
  ($absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$ = $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$, $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ = $JSCompiler_alias_VOID$$);
  $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.style.left = $goog$style$getPixelStyleValue_$$($absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$, $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$);
  $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.style.top = $goog$style$getPixelStyleValue_$$($arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$, $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$);
  if(!($elementSize_movableElementCorner$$1_style$$inline_652$$ == $opt_preferredSize$$1_size$$21$$ || (!$elementSize_movableElementCorner$$1_style$$inline_652$$ || !$opt_preferredSize$$1_size$$21$$ ? 0 : $elementSize_movableElementCorner$$1_style$$inline_652$$.width == $opt_preferredSize$$1_size$$21$$.width && $elementSize_movableElementCorner$$1_style$$inline_652$$.height == $opt_preferredSize$$1_size$$21$$.height))) {
    $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$ = $JSCompiler_StaticMethods_isCss1CompatMode$$($goog$dom$getDomHelper$$($goog$dom$getOwnerDocument$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$))), $goog$userAgent$IE$$ && (!$absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$ || !$goog$userAgent$isVersionOrHigher$$("8")) ? ($elementSize_movableElementCorner$$1_style$$inline_652$$ = 
    $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.style, $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$ ? ($goog$userAgent$IE$$ ? ($absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$ = $goog$style$getIePixelDistance_$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "paddingLeft"), $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$ = 
    $goog$style$getIePixelDistance_$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "paddingRight"), $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ = $goog$style$getIePixelDistance_$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "paddingTop"), $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ = $goog$style$getIePixelDistance_$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, 
    "paddingBottom"), $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$ = new $goog$math$Box$$($arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$, $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$, $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$, $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$)) : 
    ($absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$ = $goog$style$getComputedStyle$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "paddingLeft"), $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$ = $goog$style$getComputedStyle$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "paddingRight"), $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ = 
    $goog$style$getComputedStyle$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "paddingTop"), $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ = $goog$style$getComputedStyle$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "paddingBottom"), $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$ = new $goog$math$Box$$(parseFloat($arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$), 
    parseFloat($buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$), parseFloat($bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$), parseFloat($absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$))), $goog$userAgent$IE$$ ? ($buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$ = $goog$style$getIePixelBorder_$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, 
    "borderLeft"), $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ = $goog$style$getIePixelBorder_$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "borderRight"), $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ = $goog$style$getIePixelBorder_$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "borderTop"), $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$ = 
    $goog$style$getIePixelBorder_$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "borderBottom"), $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$ = new $goog$math$Box$$($bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$, $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$, $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, $buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$)) : 
    ($buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$ = $goog$style$getComputedStyle$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "borderLeftWidth"), $arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$ = $goog$style$getComputedStyle$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "borderRightWidth"), $bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$ = 
    $goog$style$getComputedStyle$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "borderTopWidth"), $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$ = $goog$style$getComputedStyle$$($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$, "borderBottomWidth"), $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$ = new $goog$math$Box$$(parseFloat($bottom$$inline_912_opt_margin$$1_status$$inline_640_top$$inline_866$$), 
    parseFloat($arg1$$inline_643_opt_overflow$$1_overflow$$inline_639_right$$inline_865_top$$inline_911_y$$inline_646$$), parseFloat($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$), parseFloat($buggyGeckoSubPixelPos$$inline_647_left$$inline_864_opt_viewport$$1_right$$inline_910$$))), $elementSize_movableElementCorner$$1_style$$inline_652$$.pixelWidth = $opt_preferredSize$$1_size$$21$$.width - $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.left - 
    $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$.left - $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$.right - $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.right, $elementSize_movableElementCorner$$1_style$$inline_652$$.pixelHeight = $opt_preferredSize$$1_size$$21$$.height - $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.top - 
    $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$.top - $absolutePos$$1_isCss1CompatMode$$inline_651_left$$inline_909_paddingBox$$inline_653_x$$inline_645$$.bottom - $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.bottom) : ($elementSize_movableElementCorner$$1_style$$inline_652$$.pixelWidth = $opt_preferredSize$$1_size$$21$$.width, $elementSize_movableElementCorner$$1_style$$inline_652$$.pixelHeight = $opt_preferredSize$$1_size$$21$$.height)) : 
    ($borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$ = $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.style, $goog$userAgent$GECKO$$ ? $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.MozBoxSizing = "border-box" : $goog$userAgent$WEBKIT$$ ? $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.WebkitBoxSizing = "border-box" : $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.boxSizing = 
    "border-box", $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.width = Math.max($opt_preferredSize$$1_size$$21$$.width, 0) + "px", $borderBox$$inline_654_bottom$$inline_867_movableElement$$2_style$$inline_871$$.height = Math.max($opt_preferredSize$$1_size$$21$$.height, 0) + "px")
  }
  return $JSCompiler_temp$$2_pos$$inline_636_status$$
}
;function $goog$positioning$AbstractPosition$$() {
}
$goog$positioning$AbstractPosition$$.prototype.$reposition$ = $JSCompiler_emptyFn$$();
function $goog$positioning$ViewportPosition$$($arg1$$1$$, $opt_arg2$$1$$) {
  this.$coordinate$ = $arg1$$1$$ instanceof $goog$math$Coordinate$$ ? $arg1$$1$$ : new $goog$math$Coordinate$$($arg1$$1$$, $opt_arg2$$1$$)
}
$goog$inherits$$($goog$positioning$ViewportPosition$$, $goog$positioning$AbstractPosition$$);
$goog$positioning$ViewportPosition$$.prototype.$reposition$ = function $$goog$positioning$ViewportPosition$$$$$reposition$$($element$$97$$, $popupCorner$$, $opt_margin$$3$$, $opt_preferredSize$$3$$) {
  $goog$positioning$positionAtAnchor$$($goog$style$getClientViewportElement$$($element$$97$$), 0, $element$$97$$, $popupCorner$$, this.$coordinate$, $opt_margin$$3$$, $JSCompiler_alias_NULL$$, $opt_preferredSize$$3$$)
};
function $goog$positioning$AnchoredPosition$$($anchorElement$$1$$, $corner$$7$$, $opt_overflow$$2$$) {
  this.element = $anchorElement$$1$$;
  this.$corner$ = $corner$$7$$;
  this.$overflow_$ = $opt_overflow$$2$$
}
$goog$inherits$$($goog$positioning$AnchoredPosition$$, $goog$positioning$AbstractPosition$$);
$goog$positioning$AnchoredPosition$$.prototype.$reposition$ = function $$goog$positioning$AnchoredPosition$$$$$reposition$$($movableElement$$4$$, $movableCorner$$, $opt_margin$$4$$) {
  $goog$positioning$positionAtAnchor$$(this.element, this.$corner$, $movableElement$$4$$, $movableCorner$$, $JSCompiler_alias_VOID$$, $opt_margin$$4$$, this.$overflow_$)
};
function $goog$ui$PopupBase$$($opt_element$$12$$, $opt_type$$9$$) {
  $goog$events$EventTarget$$.call(this);
  this.$handler_$ = new $goog$events$EventHandler$$(this);
  this.$setElement$($opt_element$$12$$ || $JSCompiler_alias_NULL$$);
  $opt_type$$9$$ && (this.$type_$ = $opt_type$$9$$)
}
$goog$inherits$$($goog$ui$PopupBase$$, $goog$events$EventTarget$$);
$JSCompiler_prototypeAlias$$ = $goog$ui$PopupBase$$.prototype;
$JSCompiler_prototypeAlias$$.$element_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$autoHide_$ = $JSCompiler_alias_TRUE$$;
$JSCompiler_prototypeAlias$$.$autoHideRegion_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$isVisible_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$shouldHideAsync_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$lastShowTime_$ = -1;
$JSCompiler_prototypeAlias$$.$lastHideTime_$ = -1;
$JSCompiler_prototypeAlias$$.$hideOnEscape_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$enableCrossIframeDismissal_$ = $JSCompiler_alias_TRUE$$;
$JSCompiler_prototypeAlias$$.$type_$ = "toggle_display";
$JSCompiler_prototypeAlias$$.$getElement$ = $JSCompiler_get$$("$element_$");
$JSCompiler_prototypeAlias$$.$setElement$ = function $$JSCompiler_prototypeAlias$$$$setElement$$($elt$$2$$) {
  this.$isVisible_$ && $JSCompiler_alias_THROW$$(Error("Can not change this state of the popup while showing."));
  this.$element_$ = $elt$$2$$
};
function $JSCompiler_StaticMethods_setVisible$$($JSCompiler_StaticMethods_setVisible$self$$, $visible$$2$$) {
  $JSCompiler_StaticMethods_setVisible$self$$.$showTransition_$ && $JSCompiler_StaticMethods_setVisible$self$$.$showTransition_$.stop();
  $JSCompiler_StaticMethods_setVisible$self$$.$hideTransition_$ && $JSCompiler_StaticMethods_setVisible$self$$.$hideTransition_$.stop();
  if($visible$$2$$) {
    if(!$JSCompiler_StaticMethods_setVisible$self$$.$isVisible_$ && $JSCompiler_StaticMethods_setVisible$self$$.$onBeforeShow$()) {
      $JSCompiler_StaticMethods_setVisible$self$$.$element_$ || $JSCompiler_alias_THROW$$(Error("Caller must call setElement before trying to show the popup"));
      $JSCompiler_StaticMethods_setVisible$self$$.$reposition$();
      var $doc$$inline_662$$ = $goog$dom$getOwnerDocument$$($JSCompiler_StaticMethods_setVisible$self$$.$element_$);
      $JSCompiler_StaticMethods_setVisible$self$$.$hideOnEscape_$ && $JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_setVisible$self$$.$handler_$, $doc$$inline_662$$, "keydown", $JSCompiler_StaticMethods_setVisible$self$$.$onDocumentKeyDown_$, $JSCompiler_alias_TRUE$$);
      if($JSCompiler_StaticMethods_setVisible$self$$.$autoHide_$) {
        if($JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_setVisible$self$$.$handler_$, $doc$$inline_662$$, "mousedown", $JSCompiler_StaticMethods_setVisible$self$$.$onDocumentMouseDown_$, $JSCompiler_alias_TRUE$$), $goog$userAgent$IE$$) {
          var $activeElement$$inline_663$$;
          try {
            $activeElement$$inline_663$$ = $doc$$inline_662$$.activeElement
          }catch($e$$inline_665$$) {
          }
          for(;$activeElement$$inline_663$$ && "IFRAME" == $activeElement$$inline_663$$.nodeName;) {
            try {
              var $tempDoc$$inline_664$$ = $activeElement$$inline_663$$.contentDocument || $activeElement$$inline_663$$.contentWindow.document
            }catch($e$$inline_666$$) {
              break
            }
            $doc$$inline_662$$ = $tempDoc$$inline_664$$;
            $activeElement$$inline_663$$ = $doc$$inline_662$$.activeElement
          }
          $JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_setVisible$self$$.$handler_$, $doc$$inline_662$$, "mousedown", $JSCompiler_StaticMethods_setVisible$self$$.$onDocumentMouseDown_$, $JSCompiler_alias_TRUE$$);
          $JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_setVisible$self$$.$handler_$, $doc$$inline_662$$, "deactivate", $JSCompiler_StaticMethods_setVisible$self$$.$onDocumentBlur_$)
        }else {
          $JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_setVisible$self$$.$handler_$, $doc$$inline_662$$, "blur", $JSCompiler_StaticMethods_setVisible$self$$.$onDocumentBlur_$)
        }
      }
      "toggle_display" == $JSCompiler_StaticMethods_setVisible$self$$.$type_$ ? ($JSCompiler_StaticMethods_setVisible$self$$.$element_$.style.visibility = "visible", $goog$style$setElementShown$$($JSCompiler_StaticMethods_setVisible$self$$.$element_$, $JSCompiler_alias_TRUE$$)) : "move_offscreen" == $JSCompiler_StaticMethods_setVisible$self$$.$type_$ && $JSCompiler_StaticMethods_setVisible$self$$.$reposition$();
      $JSCompiler_StaticMethods_setVisible$self$$.$isVisible_$ = $JSCompiler_alias_TRUE$$;
      $JSCompiler_StaticMethods_setVisible$self$$.$showTransition_$ ? ($goog$events$listenOnce$$($JSCompiler_StaticMethods_setVisible$self$$.$showTransition_$, "end", $JSCompiler_StaticMethods_setVisible$self$$.$onShow_$, $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_setVisible$self$$), $JSCompiler_StaticMethods_setVisible$self$$.$showTransition_$.play()) : $JSCompiler_StaticMethods_setVisible$self$$.$onShow_$()
    }
  }else {
    $JSCompiler_StaticMethods_hide_$$($JSCompiler_StaticMethods_setVisible$self$$)
  }
}
$JSCompiler_prototypeAlias$$.$reposition$ = $goog$nullFunction$$;
function $JSCompiler_StaticMethods_hide_$$($JSCompiler_StaticMethods_hide_$self$$, $opt_target$$2$$) {
  if(!$JSCompiler_StaticMethods_hide_$self$$.$isVisible_$ || !$JSCompiler_StaticMethods_hide_$self$$.dispatchEvent({type:"beforehide", target:$opt_target$$2$$})) {
    return $JSCompiler_alias_FALSE$$
  }
  $JSCompiler_StaticMethods_hide_$self$$.$handler_$ && $JSCompiler_StaticMethods_hide_$self$$.$handler_$.$removeAll$();
  $JSCompiler_StaticMethods_hide_$self$$.$isVisible_$ = $JSCompiler_alias_FALSE$$;
  $JSCompiler_StaticMethods_hide_$self$$.$lastHideTime_$ = $goog$now$$();
  $JSCompiler_StaticMethods_hide_$self$$.$hideTransition_$ ? ($goog$events$listenOnce$$($JSCompiler_StaticMethods_hide_$self$$.$hideTransition_$, "end", $goog$partial$$($JSCompiler_StaticMethods_hide_$self$$.$continueHidingPopup_$, $opt_target$$2$$), $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_hide_$self$$), $JSCompiler_StaticMethods_hide_$self$$.$hideTransition_$.play()) : $JSCompiler_StaticMethods_hide_$self$$.$continueHidingPopup_$($opt_target$$2$$);
  return $JSCompiler_alias_TRUE$$
}
$JSCompiler_prototypeAlias$$.$continueHidingPopup_$ = function $$JSCompiler_prototypeAlias$$$$continueHidingPopup_$$($opt_target$$3$$) {
  "toggle_display" == this.$type_$ ? this.$shouldHideAsync_$ ? $goog$Timer$callOnce$$(this.$hidePopupElement_$, 0, this) : this.$hidePopupElement_$() : "move_offscreen" == this.$type_$ && (this.$element_$.style.top = "-10000px");
  this.$onHide_$($opt_target$$3$$)
};
$JSCompiler_prototypeAlias$$.$hidePopupElement_$ = function $$JSCompiler_prototypeAlias$$$$hidePopupElement_$$() {
  this.$element_$.style.visibility = "hidden";
  $goog$style$setElementShown$$(this.$element_$, $JSCompiler_alias_FALSE$$)
};
$JSCompiler_prototypeAlias$$.$onBeforeShow$ = function $$JSCompiler_prototypeAlias$$$$onBeforeShow$$() {
  return this.dispatchEvent("beforeshow")
};
$JSCompiler_prototypeAlias$$.$onShow_$ = function $$JSCompiler_prototypeAlias$$$$onShow_$$() {
  this.$lastShowTime_$ = $goog$now$$();
  this.$lastHideTime_$ = -1;
  this.dispatchEvent("show")
};
$JSCompiler_prototypeAlias$$.$onHide_$ = function $$JSCompiler_prototypeAlias$$$$onHide_$$($opt_target$$5$$) {
  this.dispatchEvent({type:"hide", target:$opt_target$$5$$})
};
$JSCompiler_prototypeAlias$$.$onDocumentMouseDown_$ = function $$JSCompiler_prototypeAlias$$$$onDocumentMouseDown_$$($e$$47_target$$46$$) {
  $e$$47_target$$46$$ = $e$$47_target$$46$$.target;
  !$goog$dom$contains$$(this.$element_$, $e$$47_target$$46$$) && ((!this.$autoHideRegion_$ || $goog$dom$contains$$(this.$autoHideRegion_$, $e$$47_target$$46$$)) && !(150 > $goog$now$$() - this.$lastShowTime_$)) && $JSCompiler_StaticMethods_hide_$$(this, $e$$47_target$$46$$)
};
$JSCompiler_prototypeAlias$$.$onDocumentKeyDown_$ = function $$JSCompiler_prototypeAlias$$$$onDocumentKeyDown_$$($e$$48$$) {
  27 == $e$$48$$.keyCode && $JSCompiler_StaticMethods_hide_$$(this, $e$$48$$.target) && ($e$$48$$.preventDefault(), $e$$48$$.stopPropagation())
};
$JSCompiler_prototypeAlias$$.$onDocumentBlur_$ = function $$JSCompiler_prototypeAlias$$$$onDocumentBlur_$$($activeElement$$2_e$$49$$) {
  if(this.$enableCrossIframeDismissal_$) {
    var $doc$$35$$ = $goog$dom$getOwnerDocument$$(this.$element_$);
    if($goog$userAgent$IE$$ || $goog$userAgent$OPERA$$) {
      if($activeElement$$2_e$$49$$ = $doc$$35$$.activeElement, !$activeElement$$2_e$$49$$ || $goog$dom$contains$$(this.$element_$, $activeElement$$2_e$$49$$) || "BODY" == $activeElement$$2_e$$49$$.tagName) {
        return
      }
    }else {
      if($activeElement$$2_e$$49$$.target != $doc$$35$$) {
        return
      }
    }
    150 > $goog$now$$() - this.$lastShowTime_$ || $JSCompiler_StaticMethods_hide_$$(this)
  }
};
function $goog$ui$Popup$$($opt_element$$13$$, $opt_position$$) {
  this.$popupCorner_$ = 4;
  this.$position_$ = $opt_position$$ || $JSCompiler_alias_VOID$$;
  $goog$ui$PopupBase$$.call(this, $opt_element$$13$$)
}
$goog$inherits$$($goog$ui$Popup$$, $goog$ui$PopupBase$$);
$goog$ui$Popup$$.prototype.$reposition$ = function $$goog$ui$Popup$$$$$reposition$$() {
  if(this.$position_$) {
    var $hideForPositioning$$ = !this.$isVisible_$ && "move_offscreen" != this.$type_$, $el$$32$$ = this.$getElement$();
    $hideForPositioning$$ && ($el$$32$$.style.visibility = "hidden", $goog$style$setElementShown$$($el$$32$$, $JSCompiler_alias_TRUE$$));
    this.$position_$.$reposition$($el$$32$$, this.$popupCorner_$, this.$margin_$);
    $hideForPositioning$$ && $goog$style$setElementShown$$($el$$32$$, $JSCompiler_alias_FALSE$$)
  }
};
function $goog$structs$Set$$($opt_values$$1$$) {
  this.$map_$ = new $goog$structs$Map$$;
  $opt_values$$1$$ && this.$addAll$($opt_values$$1$$)
}
function $goog$structs$Set$getKey_$$($val$$32$$) {
  var $type$$98$$ = typeof $val$$32$$;
  return"object" == $type$$98$$ && $val$$32$$ || "function" == $type$$98$$ ? "o" + $goog$getUid$$($val$$32$$) : $type$$98$$.substr(0, 1) + $val$$32$$
}
$JSCompiler_prototypeAlias$$ = $goog$structs$Set$$.prototype;
$JSCompiler_prototypeAlias$$.$getCount$ = function $$JSCompiler_prototypeAlias$$$$getCount$$() {
  return this.$map_$.$getCount$()
};
$JSCompiler_prototypeAlias$$.add = function $$JSCompiler_prototypeAlias$$$add$($element$$100$$) {
  this.$map_$.set($goog$structs$Set$getKey_$$($element$$100$$), $element$$100$$)
};
$JSCompiler_prototypeAlias$$.$addAll$ = function $$JSCompiler_prototypeAlias$$$$addAll$$($col$$12_values$$21$$) {
  $col$$12_values$$21$$ = $goog$structs$getValues$$($col$$12_values$$21$$);
  for(var $l$$23$$ = $col$$12_values$$21$$.length, $i$$178$$ = 0;$i$$178$$ < $l$$23$$;$i$$178$$++) {
    this.add($col$$12_values$$21$$[$i$$178$$])
  }
};
$JSCompiler_prototypeAlias$$.$removeAll$ = function $$JSCompiler_prototypeAlias$$$$removeAll$$($col$$13_values$$22$$) {
  $col$$13_values$$22$$ = $goog$structs$getValues$$($col$$13_values$$22$$);
  for(var $l$$24$$ = $col$$13_values$$22$$.length, $i$$179$$ = 0;$i$$179$$ < $l$$24$$;$i$$179$$++) {
    this.remove($col$$13_values$$22$$[$i$$179$$])
  }
};
$JSCompiler_prototypeAlias$$.remove = function $$JSCompiler_prototypeAlias$$$remove$($element$$101$$) {
  return this.$map_$.remove($goog$structs$Set$getKey_$$($element$$101$$))
};
$JSCompiler_prototypeAlias$$.clear = function $$JSCompiler_prototypeAlias$$$clear$() {
  this.$map_$.clear()
};
$JSCompiler_prototypeAlias$$.contains = function $$JSCompiler_prototypeAlias$$$contains$($element$$102_key$$inline_671$$) {
  $element$$102_key$$inline_671$$ = $goog$structs$Set$getKey_$$($element$$102_key$$inline_671$$);
  return $goog$structs$Map$hasKey_$$(this.$map_$.$map_$, $element$$102_key$$inline_671$$)
};
$JSCompiler_prototypeAlias$$.$intersection$ = function $$JSCompiler_prototypeAlias$$$$intersection$$($col$$15_values$$23$$) {
  var $result$$17$$ = new $goog$structs$Set$$;
  $col$$15_values$$23$$ = $goog$structs$getValues$$($col$$15_values$$23$$);
  for(var $i$$180$$ = 0;$i$$180$$ < $col$$15_values$$23$$.length;$i$$180$$++) {
    var $value$$84$$ = $col$$15_values$$23$$[$i$$180$$];
    this.contains($value$$84$$) && $result$$17$$.add($value$$84$$)
  }
  return $result$$17$$
};
$JSCompiler_prototypeAlias$$.$getValues$ = function $$JSCompiler_prototypeAlias$$$$getValues$$() {
  return this.$map_$.$getValues$()
};
$JSCompiler_prototypeAlias$$.$clone$ = function $$JSCompiler_prototypeAlias$$$$clone$$() {
  return new $goog$structs$Set$$(this)
};
function $goog$ui$Tooltip$$($element$$inline_875_opt_el$$7$$, $opt_str$$2$$, $child$$inline_915_opt_domHelper$$2$$) {
  this.$dom_$ = $child$$inline_915_opt_domHelper$$2$$ || ($element$$inline_875_opt_el$$7$$ ? $goog$dom$getDomHelper$$($goog$dom$getElement$$($element$$inline_875_opt_el$$7$$)) : $goog$dom$getDomHelper$$());
  $goog$ui$Popup$$.call(this, this.$dom_$.$createDom$("div", {style:"position:absolute;display:none;"}));
  this.$cursorPosition$ = new $goog$math$Coordinate$$(1, 1);
  this.$elements_$ = new $goog$structs$Set$$;
  $element$$inline_875_opt_el$$7$$ && $JSCompiler_StaticMethods_attach$$(this, $element$$inline_875_opt_el$$7$$);
  if($opt_str$$2$$ != $JSCompiler_alias_NULL$$) {
    if($element$$inline_875_opt_el$$7$$ = this.$getElement$(), "textContent" in $element$$inline_875_opt_el$$7$$) {
      $element$$inline_875_opt_el$$7$$.textContent = $opt_str$$2$$
    }else {
      if($element$$inline_875_opt_el$$7$$.firstChild && 3 == $element$$inline_875_opt_el$$7$$.firstChild.nodeType) {
        for(;$element$$inline_875_opt_el$$7$$.lastChild != $element$$inline_875_opt_el$$7$$.firstChild;) {
          $element$$inline_875_opt_el$$7$$.removeChild($element$$inline_875_opt_el$$7$$.lastChild)
        }
        $element$$inline_875_opt_el$$7$$.firstChild.data = $opt_str$$2$$
      }else {
        for(;$child$$inline_915_opt_domHelper$$2$$ = $element$$inline_875_opt_el$$7$$.firstChild;) {
          $element$$inline_875_opt_el$$7$$.removeChild($child$$inline_915_opt_domHelper$$2$$)
        }
        $element$$inline_875_opt_el$$7$$.appendChild($goog$dom$getOwnerDocument$$($element$$inline_875_opt_el$$7$$).createTextNode(String($opt_str$$2$$)))
      }
    }
  }
}
$goog$inherits$$($goog$ui$Tooltip$$, $goog$ui$Popup$$);
var $goog$ui$Tooltip$activeInstances_$$ = [];
$JSCompiler_prototypeAlias$$ = $goog$ui$Tooltip$$.prototype;
$JSCompiler_prototypeAlias$$.$activeEl_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.className = "goog-tooltip";
$JSCompiler_prototypeAlias$$.$showDelayMs_$ = 500;
$JSCompiler_prototypeAlias$$.$hideDelayMs_$ = 0;
$JSCompiler_prototypeAlias$$.$getDomHelper$ = $JSCompiler_get$$("$dom_$");
function $JSCompiler_StaticMethods_attach$$($JSCompiler_StaticMethods_attach$self$$, $el$$33$$) {
  $el$$33$$ = $goog$dom$getElement$$($el$$33$$);
  $JSCompiler_StaticMethods_attach$self$$.$elements_$.add($el$$33$$);
  $goog$events$listen$$($el$$33$$, "mouseover", $JSCompiler_StaticMethods_attach$self$$.$handleMouseOver$, $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_attach$self$$);
  $goog$events$listen$$($el$$33$$, "mouseout", $JSCompiler_StaticMethods_attach$self$$.$handleMouseOutAndBlur$, $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_attach$self$$);
  $goog$events$listen$$($el$$33$$, "mousemove", $JSCompiler_StaticMethods_attach$self$$.$handleMouseMove$, $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_attach$self$$);
  $goog$events$listen$$($el$$33$$, "focus", $JSCompiler_StaticMethods_attach$self$$.$handleFocus$, $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_attach$self$$);
  $goog$events$listen$$($el$$33$$, "blur", $JSCompiler_StaticMethods_attach$self$$.$handleMouseOutAndBlur$, $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_attach$self$$)
}
$JSCompiler_prototypeAlias$$.$setElement$ = function $$JSCompiler_prototypeAlias$$$$setElement$$($el$$36$$) {
  var $body$$6_oldElement$$ = this.$getElement$();
  $body$$6_oldElement$$ && $goog$dom$removeNode$$($body$$6_oldElement$$);
  $goog$ui$Tooltip$$.$superClass_$.$setElement$.call(this, $el$$36$$);
  $el$$36$$ && ($body$$6_oldElement$$ = this.$dom_$.$document_$.body, $body$$6_oldElement$$.insertBefore($el$$36$$, $body$$6_oldElement$$.lastChild))
};
$JSCompiler_prototypeAlias$$.$onBeforeShow$ = function $$JSCompiler_prototypeAlias$$$$onBeforeShow$$() {
  if(!$goog$ui$PopupBase$$.prototype.$onBeforeShow$.call(this)) {
    return $JSCompiler_alias_FALSE$$
  }
  if(this.anchor) {
    for(var $element$$103_tt$$, $i$$182$$ = 0;$element$$103_tt$$ = $goog$ui$Tooltip$activeInstances_$$[$i$$182$$];$i$$182$$++) {
      $goog$dom$contains$$($element$$103_tt$$.$getElement$(), this.anchor) || $JSCompiler_StaticMethods_setVisible$$($element$$103_tt$$, $JSCompiler_alias_FALSE$$)
    }
  }
  0 <= $goog$array$indexOf$$($goog$ui$Tooltip$activeInstances_$$, this) || $goog$ui$Tooltip$activeInstances_$$.push(this);
  $element$$103_tt$$ = this.$getElement$();
  $element$$103_tt$$.className = this.className;
  $JSCompiler_StaticMethods_clearHideTimer$$(this);
  $goog$events$listen$$($element$$103_tt$$, "mouseover", this.$handleTooltipMouseOver$, $JSCompiler_alias_FALSE$$, this);
  $goog$events$listen$$($element$$103_tt$$, "mouseout", this.$handleTooltipMouseOut$, $JSCompiler_alias_FALSE$$, this);
  $JSCompiler_StaticMethods_clearShowTimer$$(this);
  return $JSCompiler_alias_TRUE$$
};
$JSCompiler_prototypeAlias$$.$onHide_$ = function $$JSCompiler_prototypeAlias$$$$onHide_$$() {
  $goog$array$remove$$($goog$ui$Tooltip$activeInstances_$$, this);
  for(var $element$$104$$ = this.$getElement$(), $tt$$1$$, $i$$183$$ = 0;$tt$$1$$ = $goog$ui$Tooltip$activeInstances_$$[$i$$183$$];$i$$183$$++) {
    $tt$$1$$.anchor && $goog$dom$contains$$($element$$104$$, $tt$$1$$.anchor) && $JSCompiler_StaticMethods_setVisible$$($tt$$1$$, $JSCompiler_alias_FALSE$$)
  }
  this.$parentTooltip_$ && $JSCompiler_StaticMethods_startHideTimer$$(this.$parentTooltip_$);
  $goog$events$unlisten$$($element$$104$$, "mouseover", this.$handleTooltipMouseOver$, $JSCompiler_alias_FALSE$$, this);
  $goog$events$unlisten$$($element$$104$$, "mouseout", this.$handleTooltipMouseOut$, $JSCompiler_alias_FALSE$$, this);
  this.anchor = $JSCompiler_alias_VOID$$;
  if(0 == (this.$showTimer$ ? this.$isVisible_$ ? 4 : 1 : this.$hideTimer$ ? 3 : this.$isVisible_$ ? 2 : 0)) {
    this.$seenInteraction_$ = $JSCompiler_alias_FALSE$$
  }
  $goog$ui$PopupBase$$.prototype.$onHide_$.call(this)
};
$JSCompiler_prototypeAlias$$.$maybeShow$ = function $$JSCompiler_prototypeAlias$$$$maybeShow$$($el$$37$$, $opt_pos$$) {
  this.anchor == $el$$37$$ && this.$elements_$.contains(this.anchor) && (this.$seenInteraction_$ || !this.$requireInteraction_$ ? ($JSCompiler_StaticMethods_setVisible$$(this, $JSCompiler_alias_FALSE$$), this.$isVisible_$ || (this.anchor = $el$$37$$, this.$position_$ = $opt_pos$$ || $JSCompiler_StaticMethods_getPositioningStrategy$$(this, 0) || $JSCompiler_alias_VOID$$, this.$isVisible_$ && this.$reposition$(), $JSCompiler_StaticMethods_setVisible$$(this, $JSCompiler_alias_TRUE$$))) : this.anchor = 
  $JSCompiler_alias_VOID$$);
  this.$showTimer$ = $JSCompiler_alias_VOID$$
};
$JSCompiler_prototypeAlias$$.$maybeHide$ = function $$JSCompiler_prototypeAlias$$$$maybeHide$$($el$$40$$) {
  this.$hideTimer$ = $JSCompiler_alias_VOID$$;
  $el$$40$$ == this.anchor && (this.$activeEl_$ == $JSCompiler_alias_NULL$$ || this.$activeEl_$ != this.$getElement$() && !this.$elements_$.contains(this.$activeEl_$)) && (!this.$childTooltip_$ || !this.$childTooltip_$.$activeEl_$) && $JSCompiler_StaticMethods_setVisible$$(this, $JSCompiler_alias_FALSE$$)
};
function $JSCompiler_StaticMethods_saveCursorPosition_$$($JSCompiler_StaticMethods_saveCursorPosition_$self$$, $event$$33$$) {
  var $scroll$$ = $JSCompiler_StaticMethods_getDocumentScroll$$($JSCompiler_StaticMethods_saveCursorPosition_$self$$.$dom_$);
  $JSCompiler_StaticMethods_saveCursorPosition_$self$$.$cursorPosition$.x = $event$$33$$.clientX + $scroll$$.x;
  $JSCompiler_StaticMethods_saveCursorPosition_$self$$.$cursorPosition$.y = $event$$33$$.clientY + $scroll$$.y
}
$JSCompiler_prototypeAlias$$.$handleMouseOver$ = function $$JSCompiler_prototypeAlias$$$$handleMouseOver$$($event$$34$$) {
  var $el$$41$$ = $JSCompiler_StaticMethods_getAnchorFromElement$$(this, $event$$34$$.target);
  this.$activeEl_$ = $el$$41$$;
  $JSCompiler_StaticMethods_clearHideTimer$$(this);
  $el$$41$$ != this.anchor && (this.anchor = $el$$41$$, this.$showTimer$ || (this.$showTimer$ = $goog$Timer$callOnce$$($goog$bind$$(this.$maybeShow$, this, $el$$41$$, $JSCompiler_alias_VOID$$), this.$showDelayMs_$)), $JSCompiler_StaticMethods_checkForParentTooltip_$$(this), $JSCompiler_StaticMethods_saveCursorPosition_$$(this, $event$$34$$))
};
function $JSCompiler_StaticMethods_getAnchorFromElement$$($JSCompiler_StaticMethods_getAnchorFromElement$self$$, $el$$42$$) {
  try {
    for(;$el$$42$$ && !$JSCompiler_StaticMethods_getAnchorFromElement$self$$.$elements_$.contains($el$$42$$);) {
      $el$$42$$ = $el$$42$$.parentNode
    }
    return $el$$42$$
  }catch($e$$50$$) {
    return $JSCompiler_alias_NULL$$
  }
}
$JSCompiler_prototypeAlias$$.$handleMouseMove$ = function $$JSCompiler_prototypeAlias$$$$handleMouseMove$$($event$$35$$) {
  $JSCompiler_StaticMethods_saveCursorPosition_$$(this, $event$$35$$);
  this.$seenInteraction_$ = $JSCompiler_alias_TRUE$$
};
$JSCompiler_prototypeAlias$$.$handleFocus$ = function $$JSCompiler_prototypeAlias$$$$handleFocus$$($el$$43_event$$36$$) {
  this.$activeEl_$ = $el$$43_event$$36$$ = $JSCompiler_StaticMethods_getAnchorFromElement$$(this, $el$$43_event$$36$$.target);
  this.$seenInteraction_$ = $JSCompiler_alias_TRUE$$;
  if(this.anchor != $el$$43_event$$36$$) {
    this.anchor = $el$$43_event$$36$$;
    var $pos$$15$$ = $JSCompiler_StaticMethods_getPositioningStrategy$$(this, 1);
    $JSCompiler_StaticMethods_clearHideTimer$$(this);
    this.$showTimer$ || (this.$showTimer$ = $goog$Timer$callOnce$$($goog$bind$$(this.$maybeShow$, this, $el$$43_event$$36$$, $pos$$15$$), this.$showDelayMs_$));
    $JSCompiler_StaticMethods_checkForParentTooltip_$$(this)
  }
};
function $JSCompiler_StaticMethods_getPositioningStrategy$$($JSCompiler_StaticMethods_getPositioningStrategy$self$$, $activationType$$) {
  if(0 == $activationType$$) {
    var $coord$$5$$ = $JSCompiler_StaticMethods_getPositioningStrategy$self$$.$cursorPosition$.$clone$();
    return new $goog$ui$Tooltip$CursorTooltipPosition$$($coord$$5$$)
  }
  return new $goog$ui$Tooltip$ElementTooltipPosition$$($JSCompiler_StaticMethods_getPositioningStrategy$self$$.$activeEl_$)
}
function $JSCompiler_StaticMethods_checkForParentTooltip_$$($JSCompiler_StaticMethods_checkForParentTooltip_$self$$) {
  if($JSCompiler_StaticMethods_checkForParentTooltip_$self$$.anchor) {
    for(var $tt$$2$$, $i$$184$$ = 0;$tt$$2$$ = $goog$ui$Tooltip$activeInstances_$$[$i$$184$$];$i$$184$$++) {
      $goog$dom$contains$$($tt$$2$$.$getElement$(), $JSCompiler_StaticMethods_checkForParentTooltip_$self$$.anchor) && ($tt$$2$$.$childTooltip_$ = $JSCompiler_StaticMethods_checkForParentTooltip_$self$$, $JSCompiler_StaticMethods_checkForParentTooltip_$self$$.$parentTooltip_$ = $tt$$2$$)
    }
  }
}
$JSCompiler_prototypeAlias$$.$handleMouseOutAndBlur$ = function $$JSCompiler_prototypeAlias$$$$handleMouseOutAndBlur$$($event$$37$$) {
  var $el$$44$$ = $JSCompiler_StaticMethods_getAnchorFromElement$$(this, $event$$37$$.target), $elTo$$ = $JSCompiler_StaticMethods_getAnchorFromElement$$(this, $event$$37$$.relatedTarget);
  $el$$44$$ != $elTo$$ && ($el$$44$$ == this.$activeEl_$ && (this.$activeEl_$ = $JSCompiler_alias_NULL$$), $JSCompiler_StaticMethods_clearShowTimer$$(this), this.$seenInteraction_$ = $JSCompiler_alias_FALSE$$, this.$isVisible_$ && (!$event$$37$$.relatedTarget || !$goog$dom$contains$$(this.$getElement$(), $event$$37$$.relatedTarget)) ? $JSCompiler_StaticMethods_startHideTimer$$(this) : this.anchor = $JSCompiler_alias_VOID$$)
};
$JSCompiler_prototypeAlias$$.$handleTooltipMouseOver$ = function $$JSCompiler_prototypeAlias$$$$handleTooltipMouseOver$$() {
  var $element$$105$$ = this.$getElement$();
  this.$activeEl_$ != $element$$105$$ && ($JSCompiler_StaticMethods_clearHideTimer$$(this), this.$activeEl_$ = $element$$105$$)
};
$JSCompiler_prototypeAlias$$.$handleTooltipMouseOut$ = function $$JSCompiler_prototypeAlias$$$$handleTooltipMouseOut$$($event$$39$$) {
  var $element$$106$$ = this.$getElement$();
  if(this.$activeEl_$ == $element$$106$$ && (!$event$$39$$.relatedTarget || !$goog$dom$contains$$($element$$106$$, $event$$39$$.relatedTarget))) {
    this.$activeEl_$ = $JSCompiler_alias_NULL$$, $JSCompiler_StaticMethods_startHideTimer$$(this)
  }
};
function $JSCompiler_StaticMethods_clearShowTimer$$($JSCompiler_StaticMethods_clearShowTimer$self$$) {
  $JSCompiler_StaticMethods_clearShowTimer$self$$.$showTimer$ && ($goog$global$$.clearTimeout($JSCompiler_StaticMethods_clearShowTimer$self$$.$showTimer$), $JSCompiler_StaticMethods_clearShowTimer$self$$.$showTimer$ = $JSCompiler_alias_VOID$$)
}
function $JSCompiler_StaticMethods_startHideTimer$$($JSCompiler_StaticMethods_startHideTimer$self$$) {
  if(2 == ($JSCompiler_StaticMethods_startHideTimer$self$$.$showTimer$ ? $JSCompiler_StaticMethods_startHideTimer$self$$.$isVisible_$ ? 4 : 1 : $JSCompiler_StaticMethods_startHideTimer$self$$.$hideTimer$ ? 3 : $JSCompiler_StaticMethods_startHideTimer$self$$.$isVisible_$ ? 2 : 0)) {
    $JSCompiler_StaticMethods_startHideTimer$self$$.$hideTimer$ = $goog$Timer$callOnce$$($goog$bind$$($JSCompiler_StaticMethods_startHideTimer$self$$.$maybeHide$, $JSCompiler_StaticMethods_startHideTimer$self$$, $JSCompiler_StaticMethods_startHideTimer$self$$.anchor), $JSCompiler_StaticMethods_startHideTimer$self$$.$hideDelayMs_$)
  }
}
function $JSCompiler_StaticMethods_clearHideTimer$$($JSCompiler_StaticMethods_clearHideTimer$self$$) {
  $JSCompiler_StaticMethods_clearHideTimer$self$$.$hideTimer$ && ($goog$global$$.clearTimeout($JSCompiler_StaticMethods_clearHideTimer$self$$.$hideTimer$), $JSCompiler_StaticMethods_clearHideTimer$self$$.$hideTimer$ = $JSCompiler_alias_VOID$$)
}
function $goog$ui$Tooltip$CursorTooltipPosition$$($arg1$$6$$, $opt_arg2$$6$$) {
  $goog$positioning$ViewportPosition$$.call(this, $arg1$$6$$, $opt_arg2$$6$$)
}
$goog$inherits$$($goog$ui$Tooltip$CursorTooltipPosition$$, $goog$positioning$ViewportPosition$$);
$goog$ui$Tooltip$CursorTooltipPosition$$.prototype.$reposition$ = function $$goog$ui$Tooltip$CursorTooltipPosition$$$$$reposition$$($element$$107$$, $popupCorner$$2_viewport$$3_viewportElt$$1$$, $margin_opt_margin$$9$$) {
  $popupCorner$$2_viewport$$3_viewportElt$$1$$ = $goog$style$getClientViewportElement$$($element$$107$$);
  $popupCorner$$2_viewport$$3_viewportElt$$1$$ = $goog$style$getVisibleRectForElement$$($popupCorner$$2_viewport$$3_viewportElt$$1$$);
  $margin_opt_margin$$9$$ = $margin_opt_margin$$9$$ ? new $goog$math$Box$$($margin_opt_margin$$9$$.top + 10, $margin_opt_margin$$9$$.right, $margin_opt_margin$$9$$.bottom, $margin_opt_margin$$9$$.left + 10) : new $goog$math$Box$$(10, 0, 0, 10);
  $goog$positioning$positionAtCoordinate$$(this.$coordinate$, $element$$107$$, 4, $margin_opt_margin$$9$$, $popupCorner$$2_viewport$$3_viewportElt$$1$$, 9) & 496 && $goog$positioning$positionAtCoordinate$$(this.$coordinate$, $element$$107$$, 4, $margin_opt_margin$$9$$, $popupCorner$$2_viewport$$3_viewportElt$$1$$, 5)
};
function $goog$ui$Tooltip$ElementTooltipPosition$$($element$$108$$) {
  $goog$positioning$AnchoredPosition$$.call(this, $element$$108$$, 3)
}
$goog$inherits$$($goog$ui$Tooltip$ElementTooltipPosition$$, $goog$positioning$AnchoredPosition$$);
$goog$ui$Tooltip$ElementTooltipPosition$$.prototype.$reposition$ = function $$goog$ui$Tooltip$ElementTooltipPosition$$$$$reposition$$($element$$109$$, $popupCorner$$3$$, $opt_margin$$10$$) {
  var $offset$$21$$ = new $goog$math$Coordinate$$(10, 0);
  $goog$positioning$positionAtAnchor$$(this.element, this.$corner$, $element$$109$$, $popupCorner$$3$$, $offset$$21$$, $opt_margin$$10$$, 9) & 496 && $goog$positioning$positionAtAnchor$$(this.element, 2, $element$$109$$, 1, $offset$$21$$, $opt_margin$$10$$, 5)
};
function $X$caption$$($css1$$1_parent$$27$$, $x$$103$$, $y$$76$$, $interactor$$1$$) {
  $css1$$1_parent$$27$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("No valid parent element."));
  (!$goog$isNumber$$($x$$103$$) || !$goog$isNumber$$($y$$76$$)) && $JSCompiler_alias_THROW$$(Error("Invalid coordinates."));
  ($interactor$$1$$ == $JSCompiler_alias_NULL$$ || !($interactor$$1$$ instanceof $X$interactor$$)) && $JSCompiler_alias_THROW$$(Error("Invalid interactor."));
  $goog$ui$Tooltip$$.call(this);
  this.$_classname$ = "caption";
  this.$_parent$ = $css1$$1_parent$$27$$;
  this.$_x$ = $x$$103$$;
  this.$_y$ = $y$$76$$;
  this.$_interactor$ = $interactor$$1$$;
  this.$_style$ = $JSCompiler_alias_NULL$$;
  this.$_css$ = [];
  $css1$$1_parent$$27$$ = ".x-tooltip {\n  background: #C0C0FF;\n  color: #000000;\n";
  $css1$$1_parent$$27$$ += "  border: 1px solid infotext;\n";
  $css1$$1_parent$$27$$ += "  padding: 1px;\n";
  $css1$$1_parent$$27$$ += "  font-family: sans-serif;\n";
  $css1$$1_parent$$27$$ += "}";
  this.$_css$ = [$css1$$1_parent$$27$$];
  $goog$events$listenOnce$$($interactor$$1$$, $X$event$events$HOVER_END$$, this.$kill$.bind(this));
  this.$init_$()
}
$goog$inherits$$($X$caption$$, $goog$ui$Tooltip$$);
$X$caption$$.prototype.$init_$ = function $$X$caption$$$$$init_$$() {
  var $head$$2_position$$8$$ = $goog$style$getComputedStyle$$(this.$_parent$, "position");
  if("static" == $head$$2_position$$8$$ || "" == $head$$2_position$$8$$) {
    this.$_parent$.style.position = "relative"
  }
  var $head$$2_position$$8$$ = document.getElementsByTagName("head")[0], $style$$17$$ = $goog$dom$createDom$$("style");
  $style$$17$$.type = "text/css";
  $style$$17$$.media = "screen";
  var $css$$1$$ = document.createTextNode(String(this.$_css$[0]));
  $head$$2_position$$8$$.appendChild($style$$17$$);
  $style$$17$$.appendChild($css$$1$$);
  this.$_style$ = $style$$17$$;
  this.$position_$ = new $goog$positioning$ViewportPosition$$(this.$_x$, this.$_y$) || $JSCompiler_alias_VOID$$;
  this.$isVisible_$ && this.$reposition$();
  $JSCompiler_StaticMethods_setVisible$$(this, $JSCompiler_alias_TRUE$$);
  $JSCompiler_StaticMethods_attach$$(this, this.$_parent$);
  this.$getElement$().classList.add("x-tooltip")
};
$X$caption$$.prototype.$kill$ = function $$X$caption$$$$$kill$$() {
  $JSCompiler_StaticMethods_setVisible$$(this, $JSCompiler_alias_FALSE$$);
  this.$_style$ && $goog$dom$removeNode$$(this.$_style$);
  this.$getElement$() && $goog$dom$removeNode$$(this.$getElement$());
  this.$_style$ = $JSCompiler_alias_NULL$$
};
function $X$renderer3D$$() {
  $X$renderer$$.call(this);
  this.$_classname$ = "renderer3D";
  this.$_maxZ$ = this.$_minZ$ = this.$_maxY$ = this.$_minY$ = this.$_maxX$ = this.$_minX$ = this.$_shaderProgram$ = this.$_shaders$ = $JSCompiler_alias_NULL$$;
  this.$_center$ = [0, 0, 0];
  this.$_bgColor$ = [0, 0, 0];
  this.$_pickFrameBuffer$ = $JSCompiler_alias_NULL$$;
  this.$_attributePointers$ = new $goog$structs$Map$$;
  this.$_uniformLocations$ = new $goog$structs$Map$$;
  this.$_vertexBuffers$ = new $goog$structs$Map$$;
  this.$_normalBuffers$ = new $goog$structs$Map$$;
  this.$_colorBuffers$ = new $goog$structs$Map$$;
  this.$_scalarBuffers$ = new $goog$structs$Map$$;
  this.$_texturePositionBuffers$ = new $goog$structs$Map$$;
  this.$_textures$ = new $goog$structs$Map$$;
  this.$_config$ = {PROGRESSBAR_ENABLED:$JSCompiler_alias_TRUE$$, PICKING_ENABLED:$JSCompiler_alias_TRUE$$, ORDERING_ENABLED:$JSCompiler_alias_TRUE$$, STATISTICS_ENABLED:$JSCompiler_alias_FALSE$$, INTERMEDIATE_RENDERING:$JSCompiler_alias_FALSE$$}
}
$goog$inherits$$($X$renderer3D$$, $X$renderer$$);
$X$renderer3D$$.prototype.__defineGetter__("config", $JSCompiler_get$$("$_config$"));
$JSCompiler_prototypeAlias$$ = $X$renderer3D$$.prototype;
$JSCompiler_prototypeAlias$$.$resetBoundingBox$ = function $$JSCompiler_prototypeAlias$$$$resetBoundingBox$$() {
  this.$_maxZ$ = this.$_minZ$ = this.$_maxY$ = this.$_minY$ = this.$_maxX$ = this.$_minX$ = $JSCompiler_alias_NULL$$;
  this.$_center$ = [0, 0, 0]
};
$JSCompiler_prototypeAlias$$.$onHover_$ = function $$JSCompiler_prototypeAlias$$$$onHover_$$($event$$40_y$$inline_703$$) {
  $X$renderer3D$$.$superClass_$.$onHover_$.call(this, $event$$40_y$$inline_703$$);
  var $x$$inline_702$$ = $event$$40_y$$inline_703$$.$_x$;
  $event$$40_y$$inline_703$$ = $event$$40_y$$inline_703$$.$_y$;
  var $caption$$inline_706_object$$inline_705_pickedId$$inline_704$$ = this.$pick$($x$$inline_702$$, $event$$40_y$$inline_703$$);
  if($caption$$inline_706_object$$inline_705_pickedId$$inline_704$$ = this.get($caption$$inline_706_object$$inline_705_pickedId$$inline_704$$)) {
    if($caption$$inline_706_object$$inline_705_pickedId$$inline_704$$ = $caption$$inline_706_object$$inline_705_pickedId$$inline_704$$.$_caption$) {
      var $pos$$inline_707$$ = $goog$style$getClientPosition$$(this.$_container$);
      (new $X$caption$$(this.$_container$, $pos$$inline_707$$.x + $x$$inline_702$$ + 10, $pos$$inline_707$$.y + $event$$40_y$$inline_703$$ + 10, this.$_interactor$)).$getElement$().innerHTML = $caption$$inline_706_object$$inline_705_pickedId$$inline_704$$
    }
  }
};
$JSCompiler_prototypeAlias$$.$init$ = function $$JSCompiler_prototypeAlias$$$$init$$() {
  $X$renderer3D$$.$superClass_$.$init$.call(this, "experimental-webgl");
  try {
    if(this.$_context$.viewport(0, 0, this.$_width$, this.$_height$), this.$_context$.clearColor(this.$_bgColor$[0], this.$_bgColor$[1], this.$_bgColor$[2], 0), this.$_context$.enable(this.$_context$.BLEND), this.$_context$.blendEquation(this.$_context$.FUNC_ADD), this.$_context$.blendFunc(this.$_context$.SRC_ALPHA, this.$_context$.ONE_MINUS_SRC_ALPHA), this.$_context$.enable(this.$_context$.DEPTH_TEST), this.$_context$.depthFunc(this.$_context$.LEQUAL), this.$_context$.clear(this.$_context$.COLOR_BUFFER_BIT | 
    this.$_context$.DEPTH_BUFFER_BIT), this.$_config$.PICKING_ENABLED) {
      var $pickFrameBuffer_shaders$$inline_710$$ = this.$_context$.createFramebuffer(), $_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$ = this.$_context$.createRenderbuffer(), $_glVertexShader$$inline_712_pickTexture$$ = this.$_context$.createTexture();
      this.$_context$.bindTexture(this.$_context$.TEXTURE_2D, $_glVertexShader$$inline_712_pickTexture$$);
      this.$_context$.texImage2D(this.$_context$.TEXTURE_2D, 0, this.$_context$.RGB, this.$_width$, this.$_height$, 0, this.$_context$.RGB, this.$_context$.UNSIGNED_BYTE, $JSCompiler_alias_NULL$$);
      this.$_context$.texParameteri(this.$_context$.TEXTURE_2D, this.$_context$.TEXTURE_WRAP_S, this.$_context$.CLAMP_TO_EDGE);
      this.$_context$.texParameteri(this.$_context$.TEXTURE_2D, this.$_context$.TEXTURE_WRAP_T, this.$_context$.CLAMP_TO_EDGE);
      this.$_context$.texParameteri(this.$_context$.TEXTURE_2D, this.$_context$.TEXTURE_MAG_FILTER, this.$_context$.NEAREST);
      this.$_context$.texParameteri(this.$_context$.TEXTURE_2D, this.$_context$.TEXTURE_MIN_FILTER, this.$_context$.NEAREST);
      this.$_context$.bindFramebuffer(this.$_context$.FRAMEBUFFER, $pickFrameBuffer_shaders$$inline_710$$);
      this.$_context$.bindRenderbuffer(this.$_context$.RENDERBUFFER, $_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$);
      this.$_context$.renderbufferStorage(this.$_context$.RENDERBUFFER, this.$_context$.DEPTH_COMPONENT16, this.$_width$, this.$_height$);
      this.$_context$.bindRenderbuffer(this.$_context$.RENDERBUFFER, $JSCompiler_alias_NULL$$);
      this.$_context$.framebufferTexture2D(this.$_context$.FRAMEBUFFER, this.$_context$.COLOR_ATTACHMENT0, this.$_context$.TEXTURE_2D, $_glVertexShader$$inline_712_pickTexture$$, 0);
      this.$_context$.framebufferRenderbuffer(this.$_context$.FRAMEBUFFER, this.$_context$.DEPTH_ATTACHMENT, this.$_context$.RENDERBUFFER, $_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$);
      this.$_context$.bindFramebuffer(this.$_context$.FRAMEBUFFER, $JSCompiler_alias_NULL$$);
      this.$_pickFrameBuffer$ = $pickFrameBuffer_shaders$$inline_710$$
    }
  }catch($e$$51$$) {
    $JSCompiler_alias_THROW$$(Error("Exception while accessing GL Context!\n" + $e$$51$$))
  }
  $pickFrameBuffer_shaders$$inline_710$$ = new $X$shaders$$;
  (this.$_canvas$ == $JSCompiler_alias_NULL$$ || this.$_context$ == $JSCompiler_alias_NULL$$ || this.$_camera$ == $JSCompiler_alias_NULL$$) && $JSCompiler_alias_THROW$$(Error("Renderer was not initialized properly."));
  ($pickFrameBuffer_shaders$$inline_710$$ == $JSCompiler_alias_NULL$$ || !($pickFrameBuffer_shaders$$inline_710$$ instanceof $X$shaders$$)) && $JSCompiler_alias_THROW$$(Error("Could not add shaders."));
  $_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$ = Object.keys($X$shaders$uniforms$$);
  Object.keys($X$shaders$attributes$$).every(function($a$$inline_889$$) {
    $a$$inline_889$$ = $X$shaders$attributes$$[$a$$inline_889$$];
    return-1 != this.$_vertexshaderSource$.search($a$$inline_889$$) || -1 != this.$_fragmentshaderSource$.search($a$$inline_889$$)
  }.bind($pickFrameBuffer_shaders$$inline_710$$)) || $JSCompiler_alias_THROW$$(Error("Could not find all attributes in the shader sources."));
  $_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$.every(function($u$$inline_890$$) {
    $u$$inline_890$$ = $X$shaders$uniforms$$[$u$$inline_890$$];
    return-1 != this.$_vertexshaderSource$.search($u$$inline_890$$) || -1 != this.$_fragmentshaderSource$.search($u$$inline_890$$)
  }.bind($pickFrameBuffer_shaders$$inline_710$$)) || $JSCompiler_alias_THROW$$(Error("Could not find all uniforms in the shader sources."));
  $_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$ = this.$_context$.createShader(this.$_context$.FRAGMENT_SHADER);
  $_glVertexShader$$inline_712_pickTexture$$ = this.$_context$.createShader(this.$_context$.VERTEX_SHADER);
  this.$_context$.shaderSource($_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$, $pickFrameBuffer_shaders$$inline_710$$.$_fragmentshaderSource$);
  this.$_context$.shaderSource($_glVertexShader$$inline_712_pickTexture$$, $pickFrameBuffer_shaders$$inline_710$$.$_vertexshaderSource$);
  this.$_context$.compileShader($_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$);
  this.$_context$.compileShader($_glVertexShader$$inline_712_pickTexture$$);
  this.$_context$.getShaderParameter($_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$, this.$_context$.COMPILE_STATUS) || $JSCompiler_alias_THROW$$(Error("Fragement Shader compilation failed!\n" + this.$_context$.getShaderInfoLog($_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$)));
  this.$_context$.getShaderParameter($_glVertexShader$$inline_712_pickTexture$$, this.$_context$.COMPILE_STATUS) || $JSCompiler_alias_THROW$$(Error("Vertex Shader compilation failed!\n" + this.$_context$.getShaderInfoLog($_glVertexShader$$inline_712_pickTexture$$)));
  var $_shaderProgram$$inline_713$$ = this.$_context$.createProgram();
  this.$_context$.attachShader($_shaderProgram$$inline_713$$, $_glVertexShader$$inline_712_pickTexture$$);
  this.$_context$.attachShader($_shaderProgram$$inline_713$$, $_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$);
  this.$_context$.linkProgram($_shaderProgram$$inline_713$$);
  this.$_context$.getProgramParameter($_shaderProgram$$inline_713$$, this.$_context$.LINK_STATUS) || $JSCompiler_alias_THROW$$(Error("Could not create shader program!\n" + this.$_context$.getShaderInfoLog($_glFragmentShader$$inline_711_pickRenderBuffer_uniforms$$inline_888$$) + "\n" + this.$_context$.getShaderInfoLog($_glVertexShader$$inline_712_pickTexture$$) + "\n" + this.$_context$.getProgramInfoLog($_shaderProgram$$inline_713$$)));
  this.$_context$.useProgram($_shaderProgram$$inline_713$$);
  this.$_shaderProgram$ = $_shaderProgram$$inline_713$$;
  Object.keys($X$shaders$attributes$$).forEach(function($a$$inline_714$$) {
    $a$$inline_714$$ = $X$shaders$attributes$$[$a$$inline_714$$];
    this.$_attributePointers$.set($a$$inline_714$$, this.$_context$.getAttribLocation(this.$_shaderProgram$, $a$$inline_714$$));
    this.$_context$.enableVertexAttribArray(this.$_attributePointers$.get($a$$inline_714$$))
  }.bind(this));
  Object.keys($X$shaders$uniforms$$).forEach(function($u$$inline_715$$) {
    $u$$inline_715$$ = $X$shaders$uniforms$$[$u$$inline_715$$];
    this.$_uniformLocations$.set($u$$inline_715$$, this.$_context$.getUniformLocation(this.$_shaderProgram$, $u$$inline_715$$))
  }.bind(this));
  this.$_shaders$ = $pickFrameBuffer_shaders$$inline_710$$
};
$JSCompiler_prototypeAlias$$.$update_$ = function $$JSCompiler_prototypeAlias$$$$update_$$($object$$43$$) {
  $X$renderer3D$$.$superClass_$.$update_$.call(this, $object$$43$$);
  var $_k$$3_existed$$ = $JSCompiler_alias_FALSE$$;
  if($object$$43$$ != $JSCompiler_alias_NULL$$) {
    this.get($object$$43$$.$_id$) && ($_k$$3_existed$$ = $JSCompiler_alias_TRUE$$);
    var $_len$$4_id$$13$$ = $object$$43$$.$_id$, $glScalarBuffer_points$$2$$ = $object$$43$$.$_points$, $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$ = $object$$43$$.$_normals$, $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$ = $object$$43$$.$_colors$, $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$ = $object$$43$$.$_texture$, $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ = $object$$43$$.$_file$, $glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$ = 
    $object$$43$$.$_transform$, $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$ = $object$$43$$.$_colortable$, $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ = $object$$43$$.$_labelmap$, $scalars$$1$$ = $object$$43$$.$_scalars$;
    if($_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ != $JSCompiler_alias_NULL$$ && $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$.$_file$ != $JSCompiler_alias_NULL$$ && $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$.$_file$.$_dirty$) {
      this.$update_$($_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$)
    }else {
      if($_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ != $JSCompiler_alias_NULL$$ && $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$.$_dirty$ && this.$update_$($_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$), $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$ != $JSCompiler_alias_NULL$$ && $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$.$_file$ != $JSCompiler_alias_NULL$$ && 
      $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$.$_file$.$_dirty$) {
        this.$_loader$.load($colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$, $object$$43$$)
      }else {
        if($glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$ != $JSCompiler_alias_NULL$$ && $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_file$ != $JSCompiler_alias_NULL$$ && $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_file$.$_dirty$) {
          this.$_loader$.load($glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$, $object$$43$$)
        }else {
          if($children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ != $JSCompiler_alias_NULL$$ && $goog$isArray$$($children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$)) {
            if($object$$43$$.$MRI$ != $JSCompiler_alias_NULL$$) {
              if($object$$43$$.$MRI$.$loaded_files$ != $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$.length || !$object$$43$$.$_dirty$) {
                return
              }
            }else {
              $_k$$3_existed$$ = 0;
              $_len$$4_id$$13$$ = $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$.length;
              for($_k$$3_existed$$ = 0;$_k$$3_existed$$ < $_len$$4_id$$13$$;$_k$$3_existed$$++) {
                this.$_loader$.load($children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$[$_k$$3_existed$$], $object$$43$$)
              }
              return
            }
          }else {
            if($children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ != $JSCompiler_alias_NULL$$ && $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$.$_dirty$) {
              this.$_loader$.load($object$$43$$, $object$$43$$);
              return
            }
            if($scalars$$1$$ != $JSCompiler_alias_NULL$$ && $scalars$$1$$.$_file$ != $JSCompiler_alias_NULL$$ && $scalars$$1$$.$_file$.$_dirty$) {
              this.$_loader$.load($scalars$$1$$, $object$$43$$);
              return
            }
          }
          if(0 < $object$$43$$.$_children$.length) {
            $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ = $object$$43$$.$_children$;
            $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$ = $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$.length;
            for($_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ = $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ = 0;$_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ < $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$;$_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$++) {
              this.$update_$($children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$[$_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$])
            }
          }
          if($glScalarBuffer_points$$2$$) {
            for($children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ = 0;this.$_locked$;) {
              $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$++, window.console.log("Possible thread lock avoided: " + $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$)
            }
            this.$_locked$ = $JSCompiler_alias_TRUE$$;
            $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$ = $object$$43$$ instanceof $X$slice$$ && $object$$43$$.$_volume$ instanceof $X$labelmap$$;
            $_k$$3_existed$$ && ($glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$ != $JSCompiler_alias_NULL$$ && $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_dirty$) && ($children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ = this.$_texturePositionBuffers$.get($_len$$4_id$$13$$), $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ != $JSCompiler_alias_NULL$$ && this.$_context$.isBuffer($children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$.$_glBuffer$) && 
            this.$_context$.deleteBuffer($children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$.$_glBuffer$));
            $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ = $JSCompiler_alias_NULL$$;
            $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$ != $JSCompiler_alias_NULL$$ && (!$_k$$3_existed$$ || $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_dirty$ ? ($children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ = $object$$43$$.$_textureCoordinateMap$, $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ == $JSCompiler_alias_NULL$$ && $JSCompiler_alias_THROW$$(Error("Can not add an object and texture without valid coordinate mapping! Set the textureCoordinateMap!")), 
            $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ = $JSCompiler_alias_FALSE$$, $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_rawData$ && ($_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ = $JSCompiler_alias_TRUE$$), this.$_context$.pixelStorei(this.$_context$.UNPACK_FLIP_Y_WEBGL, $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$), $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ = 
            this.$_context$.createTexture(), $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$.$image$ = $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_image$, this.$_textures$.set($glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_id$, $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$), this.$_context$.bindTexture(this.$_context$.TEXTURE_2D, $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$), $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_rawData$ ? 
            ($_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ = this.$_context$.RGBA, $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_grayscale$ && ($_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ = this.$_context$.LUMINANCE, this.$_context$.pixelStorei(this.$_context$.UNPACK_ALIGNMENT, 1)), this.$_context$.texImage2D(this.$_context$.TEXTURE_2D, 0, $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$, $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_rawDataWidth$, 
            $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_rawDataHeight$, 0, $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$, this.$_context$.UNSIGNED_BYTE, $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_rawData$)) : this.$_context$.texImage2D(this.$_context$.TEXTURE_2D, 0, this.$_context$.RGBA, this.$_context$.RGBA, this.$_context$.UNSIGNED_BYTE, $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$.$image$), this.$_context$.texParameteri(this.$_context$.TEXTURE_2D, 
            this.$_context$.TEXTURE_WRAP_S, this.$_context$.CLAMP_TO_EDGE), this.$_context$.texParameteri(this.$_context$.TEXTURE_2D, this.$_context$.TEXTURE_WRAP_T, this.$_context$.CLAMP_TO_EDGE), $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$ ? (this.$_context$.texParameteri(this.$_context$.TEXTURE_2D, this.$_context$.TEXTURE_MAG_FILTER, this.$_context$.NEAREST), this.$_context$.texParameteri(this.$_context$.TEXTURE_2D, this.$_context$.TEXTURE_MIN_FILTER, this.$_context$.NEAREST)) : 
            (this.$_context$.texParameteri(this.$_context$.TEXTURE_2D, this.$_context$.TEXTURE_MAG_FILTER, this.$_context$.LINEAR), this.$_context$.texParameteri(this.$_context$.TEXTURE_2D, this.$_context$.TEXTURE_MIN_FILTER, this.$_context$.LINEAR)), this.$_context$.bindTexture(this.$_context$.TEXTURE_2D, $JSCompiler_alias_NULL$$), $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$ = this.$_context$.createBuffer(), this.$_context$.bindBuffer(this.$_context$.ARRAY_BUFFER, $_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$), 
            this.$_context$.bufferData(this.$_context$.ARRAY_BUFFER, new Float32Array($children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$), this.$_context$.STATIC_DRAW), $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ = new $X$buffer$$($_flipY__texture_type_c$$31_glTexture_glTexturePositionBuffer_labelmap$$, $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$.length, 
            2), this.$_texturePositionBuffers$.set($_len$$4_id$$13$$, $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$), $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_dirty$ = $JSCompiler_alias_FALSE$$) : $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$ = this.$_texturePositionBuffers$.get($_len$$4_id$$13$$));
            $JSCompiler_StaticMethods_addProgress$$(this.$_loader$, 0.1);
            if($colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$) {
              this.$_locked$ = $JSCompiler_alias_FALSE$$, $X$$.$TIMERSTOP$(this.$_classname$ + ".update"), $JSCompiler_StaticMethods_addProgress$$(this.$_loader$, 0.9)
            }else {
              if(!$_k$$3_existed$$ || $glScalarBuffer_points$$2$$.$_dirty$ || $glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$.$_dirty$) {
                $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$ = $glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$.$_matrix$;
                $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$ = $X$$.$matrix$.$multiplyByVector$($colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$, $glScalarBuffer_points$$2$$.$_minA$, $glScalarBuffer_points$$2$$.$_minB$, $glScalarBuffer_points$$2$$.$_minC$);
                $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$ = $X$$.$matrix$.$multiplyByVector$($colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$, $glScalarBuffer_points$$2$$.$_maxA$, $glScalarBuffer_points$$2$$.$_maxB$, $glScalarBuffer_points$$2$$.$_maxC$);
                if(this.$_minX$ === $JSCompiler_alias_NULL$$ || $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.x < this.$_minX$) {
                  this.$_minX$ = $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.x
                }
                if(this.$_maxX$ === $JSCompiler_alias_NULL$$ || $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$.x > this.$_maxX$) {
                  this.$_maxX$ = $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$.x
                }
                if(this.$_minY$ === $JSCompiler_alias_NULL$$ || $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.y < this.$_minY$) {
                  this.$_minY$ = $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.y
                }
                if(this.$_maxY$ === $JSCompiler_alias_NULL$$ || $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$.y > this.$_maxY$) {
                  this.$_maxY$ = $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$.y
                }
                if(this.$_minZ$ === $JSCompiler_alias_NULL$$ || $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$z$ < this.$_minZ$) {
                  this.$_minZ$ = $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$z$
                }
                if(this.$_maxZ$ === $JSCompiler_alias_NULL$$ || $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$.$z$ > this.$_maxZ$) {
                  this.$_maxZ$ = $colortable$$1_isLabelMap_numberOfChildren$$4_tMax_transformationMatrix$$.$z$
                }
                this.$_center$ = [(this.$_minX$ + this.$_maxX$) / 2, (this.$_minY$ + this.$_maxY$) / 2, (this.$_minZ$ + this.$_maxZ$) / 2];
                $glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$.$_dirty$ = $JSCompiler_alias_FALSE$$
              }
              $_k$$3_existed$$ && $glScalarBuffer_points$$2$$.$_dirty$ && ($glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$ = this.$_vertexBuffers$.get($_len$$4_id$$13$$), $glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$ != $JSCompiler_alias_NULL$$ && this.$_context$.isBuffer($glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$.$_glBuffer$) && this.$_context$.deleteBuffer($glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$.$_glBuffer$));
              $glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$ = $JSCompiler_alias_NULL$$;
              !$_k$$3_existed$$ || $glScalarBuffer_points$$2$$.$_dirty$ ? ($glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$ = this.$_context$.createBuffer(), $glScalarBuffer_points$$2$$.$resize$(), this.$_context$.bindBuffer(this.$_context$.ARRAY_BUFFER, $glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$), this.$_context$.bufferData(this.$_context$.ARRAY_BUFFER, $glScalarBuffer_points$$2$$.$_triplets$, this.$_context$.STATIC_DRAW), $glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$ = 
              new $X$buffer$$($glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$, $glScalarBuffer_points$$2$$.count, 3), $glScalarBuffer_points$$2$$.$_dirty$ = $JSCompiler_alias_FALSE$$) : $glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$ = this.$_vertexBuffers$.get($_len$$4_id$$13$$);
              $JSCompiler_StaticMethods_addProgress$$(this.$_loader$, 0.3);
              $_k$$3_existed$$ && $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$.$_dirty$ && ($glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$ = this.$_vertexBuffers$.get($_len$$4_id$$13$$), $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$ != $JSCompiler_alias_NULL$$ && this.$_context$.isBuffer($glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_glBuffer$) && this.$_context$.deleteBuffer($glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$.$_glBuffer$));
              $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$ = $JSCompiler_alias_NULL$$;
              !$_k$$3_existed$$ || $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$.$_dirty$ ? ($glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$ = this.$_context$.createBuffer(), $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$.$resize$(), this.$_context$.bindBuffer(this.$_context$.ARRAY_BUFFER, $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$), this.$_context$.bufferData(this.$_context$.ARRAY_BUFFER, $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$.$_triplets$, 
              this.$_context$.STATIC_DRAW), $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$ = new $X$buffer$$($glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$, $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$.count, 3), $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$.$_dirty$ = $JSCompiler_alias_FALSE$$) : $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$ = this.$_normalBuffers$.get($_len$$4_id$$13$$);
              $JSCompiler_StaticMethods_addProgress$$(this.$_loader$, 0.3);
              $_k$$3_existed$$ && ($colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$ && $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$.$_dirty$) && ($colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$ = this.$_colorBuffers$.get($_len$$4_id$$13$$), $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$ != $JSCompiler_alias_NULL$$ && this.$_context$.isBuffer($colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$.$_glBuffer$) && this.$_context$.deleteBuffer($colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$.$_glBuffer$));
              $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$ = $JSCompiler_alias_NULL$$;
              $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$ && (!$_k$$3_existed$$ || $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$.$_dirty$ ? ($colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$.length != $glScalarBuffer_points$$2$$.length && $JSCompiler_alias_THROW$$(Error("Mismatch between points and point colors.")), $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$ = this.$_context$.createBuffer(), $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$.$resize$(), this.$_context$.bindBuffer(this.$_context$.ARRAY_BUFFER, 
              $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$), this.$_context$.bufferData(this.$_context$.ARRAY_BUFFER, $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$.$_triplets$, this.$_context$.STATIC_DRAW), $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$ = new $X$buffer$$($colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$, $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$.count, 3), $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$.$_dirty$ = $JSCompiler_alias_FALSE$$) : 
              $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$ = this.$_colorBuffers$.get($_len$$4_id$$13$$));
              $JSCompiler_StaticMethods_addProgress$$(this.$_loader$, 0.2);
              $_k$$3_existed$$ && ($scalars$$1$$ && $scalars$$1$$.$_dirty$) && ($colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$ = this.$_scalarBuffers$.get($_len$$4_id$$13$$), $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$ != $JSCompiler_alias_NULL$$ && this.$_context$.isBuffer($colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$.$_glBuffer$) && this.$_context$.deleteBuffer($colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$.$_glBuffer$));
              $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$ = $JSCompiler_alias_NULL$$;
              $scalars$$1$$ && ($colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$ = $scalars$$1$$.$_glArray$, !$_k$$3_existed$$ || $scalars$$1$$.$_dirty$ ? ($colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$.length != $glScalarBuffer_points$$2$$.length && $JSCompiler_alias_THROW$$(Error("Mismatch between points and scalars.")), $glScalarBuffer_points$$2$$ = this.$_context$.createBuffer(), this.$_context$.bindBuffer(this.$_context$.ARRAY_BUFFER, $glScalarBuffer_points$$2$$), this.$_context$.bufferData(this.$_context$.ARRAY_BUFFER, 
              $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$, this.$_context$.STATIC_DRAW), $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$ = new $X$buffer$$($glScalarBuffer_points$$2$$, $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$.length, 3), $scalars$$1$$.$_dirty$ = $JSCompiler_alias_FALSE$$) : $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$ = this.$_scalarBuffers$.get($_len$$4_id$$13$$));
              $JSCompiler_StaticMethods_addProgress$$(this.$_loader$, 0.1);
              $_k$$3_existed$$ || this.$_objects$.add($object$$43$$);
              this.$_vertexBuffers$.set($_len$$4_id$$13$$, $glVertexBuffer_oldVertexBuffer_transform$$1_vertexBuffer$$);
              this.$_normalBuffers$.set($_len$$4_id$$13$$, $glNormalBuffer_normalBuffer_oldNormalBuffer_tMin_texture$$5$$);
              this.$_colorBuffers$.set($_len$$4_id$$13$$, $colorBuffer_glColorBuffer_normals$$3_oldColorBuffer$$);
              this.$_texturePositionBuffers$.set($_len$$4_id$$13$$, $children$$4_counter_file_oldTexturePositionBuffer_textureCoordinateMap$$1_texturePositionBuffer$$);
              this.$_scalarBuffers$.set($_len$$4_id$$13$$, $colors$$2_oldScalarBuffer_scalarBuffer_scalarsArray$$);
              this.$_locked$ = $object$$43$$.$_dirty$ = $JSCompiler_alias_FALSE$$
            }
          }else {
            $object$$43$$.$_dirty$ = $JSCompiler_alias_FALSE$$
          }
        }
      }
    }
  }
};
$JSCompiler_prototypeAlias$$.$pick$ = function $$JSCompiler_prototypeAlias$$$$pick$$($x$$105$$, $y$$78$$) {
  if(this.$_config$.PICKING_ENABLED) {
    this.$render_$($JSCompiler_alias_TRUE$$, $JSCompiler_alias_FALSE$$);
    var $data$$61$$ = new Uint8Array(4);
    this.$_context$.readPixels($x$$105$$, this.$_height$ - $y$$78$$, 1, 1, this.$_context$.RGBA, this.$_context$.UNSIGNED_BYTE, $data$$61$$);
    return $data$$61$$[0] + 255 * $data$$61$$[1] + 65025 * $data$$61$$[2]
  }
  return-1
};
$JSCompiler_prototypeAlias$$.$render_$ = function $$JSCompiler_prototypeAlias$$$$render_$$($picking$$1$$, $invoked$$1$$) {
  $X$renderer3D$$.$superClass_$.$render_$.call(this, $picking$$1$$, $invoked$$1$$);
  this.$_context$.viewport(0, 0, this.$_width$, this.$_height$);
  this.$_context$.clear(this.$_context$.COLOR_BUFFER_BIT | this.$_context$.DEPTH_BUFFER_BIT);
  var $_objects$$1$$ = this.$_objects$.$_array$, $_numberOfObjects$$1$$ = $_objects$$1$$.length;
  if(0 != $_numberOfObjects$$1$$) {
    $picking$$1$$ ? this.$_context$.bindFramebuffer(this.$_context$.FRAMEBUFFER, this.$_pickFrameBuffer$) : this.$_context$.bindFramebuffer(this.$_context$.FRAMEBUFFER, $JSCompiler_alias_NULL$$);
    var $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = this.$_camera$.$_perspective$, $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$ = this.$_camera$.$_view$;
    this.$_context$.uniformMatrix4fv(this.$_uniformLocations$.get("perspective"), $JSCompiler_alias_FALSE$$, $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$);
    this.$_context$.uniformMatrix4fv(this.$_uniformLocations$.get("view"), $JSCompiler_alias_FALSE$$, $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$);
    $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = this.$_center$;
    this.$_context$.uniform3f(this.$_uniformLocations$.get("center"), parseFloat($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$[0]), parseFloat($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$[1]), 
    parseFloat($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$[2]));
    $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$ = this.$_topLevelObjects$.length;
    for($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = 0;$JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ < $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$;++$JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$) {
      var $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$ = this.$_topLevelObjects$[$JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$];
      if($aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$ instanceof $X$volume$$) {
        var $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ = $X$$.$matrix$.$multiplyByVector$(this.$_camera$.$_view$, $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[0] + $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[0].$_sliceNormal$[0], $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[1] + 
        $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[0].$_sliceNormal$[1], $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[2] + $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[0].$_sliceNormal$[2]), $_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$ = $X$$.$matrix$.$multiplyByVector$(this.$_camera$.$_view$, $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[0] - 
        $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[0].$_sliceNormal$[0], $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[1] - $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[0].$_sliceNormal$[1], $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[2] - $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[0].$_sliceNormal$[2]), 
        $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$ = Math.abs($aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$.$z$ - $_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$.$z$), $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ = 
        $X$$.$matrix$.$multiplyByVector$(this.$_camera$.$_view$, $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[0] + $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[1].$_sliceNormal$[0], $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[1] + $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[1].$_sliceNormal$[1], $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[2] + 
        $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[1].$_sliceNormal$[2]), $_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$ = $X$$.$matrix$.$multiplyByVector$(this.$_camera$.$_view$, $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[0] - $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[1].$_sliceNormal$[0], $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[1] - 
        $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[1].$_sliceNormal$[1], $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[2] + -$aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[1].$_sliceNormal$[2]), $_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$ = Math.abs($aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$.$z$ - 
        $_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$.$z$), $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ = $X$$.$matrix$.$multiplyByVector$(this.$_camera$.$_view$, $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[0] + $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[2].$_sliceNormal$[0], 
        $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[1] + $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[2].$_sliceNormal$[1], $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[2] + $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[2].$_sliceNormal$[2]), $_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$ = 
        $X$$.$matrix$.$multiplyByVector$(this.$_camera$.$_view$, $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[0] - $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[2].$_sliceNormal$[0], $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[1] - $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[2].$_sliceNormal$[1], $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_RASCenter$[2] - 
        $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$.$_childrenInfo$[2].$_sliceNormal$[2]), $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ = Math.max($JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$, $_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$, Math.abs($aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$.$z$ - 
        $_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$.$z$));
        $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ == $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$ ? $JSCompiler_StaticMethods_volumeRendering_$$($aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$, 0) : $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ == 
        $_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$ ? $JSCompiler_StaticMethods_volumeRendering_$$($aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$, 1) : $JSCompiler_StaticMethods_volumeRendering_$$($aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$, 2)
      }
    }
    if(this.$_config$.ORDERING_ENABLED) {
      $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$ = $JSCompiler_alias_FALSE$$;
      $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$ = this.$_topLevelObjects$;
      $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$ = $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$.length - 1;
      do {
        if($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$[$aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$], $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ instanceof 
        $X$volume$$ && $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_volumeRendering$ && -1 != $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_volumeRenderingDirection$) {
          var $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_children$[$JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_volumeRenderingDirection$].$_children$, 
          $_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_volumeRenderingDirection$, $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ = $X$$.$matrix$.$multiplyByVector$(this.$_camera$.$_view$, 
          $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_RASCenter$[0] + $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_childrenInfo$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$].$_sliceDirection$[0], 
          $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_RASCenter$[1] + $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_childrenInfo$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$].$_sliceDirection$[1], 
          $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_RASCenter$[2] + $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_childrenInfo$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$].$_sliceDirection$[2]), 
          $_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$ = $X$$.$matrix$.$multiplyByVector$(this.$_camera$.$_view$, $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_RASCenter$[0] - $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_childrenInfo$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$].$_sliceDirection$[0], 
          $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_RASCenter$[1] - $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_childrenInfo$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$].$_sliceDirection$[1], 
          $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_RASCenter$[2] - $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_childrenInfo$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$].$_sliceDirection$[2]), 
          $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ = $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$.$z$ - $_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$.$z$, $_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$ = 
          Math.max($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_IJKToRAS$[$JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_volumeRenderingDirection$], Math.max($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_IJKToRAS$[$JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_volumeRenderingDirection$ + 
          4], $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_IJKToRAS$[$JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_volumeRenderingDirection$ + 8])), $_acquisitionDirection2$$inline_736_uUsePicking$$ = 
          Math.min($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_IJKToRAS$[$JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_volumeRenderingDirection$], Math.min($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_IJKToRAS$[$JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_volumeRenderingDirection$ + 
          4], $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_IJKToRAS$[$JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_volumeRenderingDirection$ + 8]));
          if(0 > $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ * ($_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$ + $_acquisitionDirection2$$inline_736_uUsePicking$$)) {
            for($aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ = $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ = 0;$aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ < $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_range$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$] - 
            1;$aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$++) {
              $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$[$aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$] && ($JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$[$aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$].$_opacity$ = 
              $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_opacity$, $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$[$aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$].$_distance$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_childrenInfo$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$].$_sliceSpacing$ * 
              $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$)
            }
          }else {
            for($aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_range$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$] - 1;0 <= $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$;$aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$--) {
              $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$[$aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$] && ($JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$[$aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$].$_opacity$ = 
              $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_opacity$, $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$[$aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$].$_distance$ = ($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_range$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$] - 
              1) * $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_childrenInfo$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$].$_sliceSpacing$ - $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_childrenInfo$[$_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$].$_sliceSpacing$ * 
              $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$)
            }
          }
          $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$ = $JSCompiler_alias_TRUE$$
        }
      }while($aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$--);
      $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$ = this.$_objects$.$_array$;
      $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$ = $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$.length - 1;
      do {
        if($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$[$aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$], $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_visible$ && 
        !(1 == $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_opacity$ || $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ instanceof $X$slice$$)) {
          $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$, $_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_points$.$_centroid$, 
          $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = $X$$.$matrix$.$multiplyByVector$($JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$_transform$.$_matrix$, $_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$[0], 
          $_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$[1], $_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$[2]), $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = $X$$.$matrix$.$multiplyByVector$(this.$_camera$.$_view$, $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.x, 
          $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.y, $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.$z$), $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = 
          $X$$.$vector$.$distance$(this.$_camera$.$_position$, $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$), $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = Math.round(1E3 * $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$) / 
          1E3, $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$.$_distance$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$, $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$ = $JSCompiler_alias_TRUE$$
        }
      }while($aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$--);
      $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$ && this.$_objects$.sort()
    }
    if($objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$ = !$picking$$1$$ && $invoked$$1$$ != $JSCompiler_alias_NULL$$ && $invoked$$1$$ && this.$_config$.STATISTICS_ENABLED) {
      var $trianglesCounter$$ = 0
    }
    var $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = this.$_attributePointers$, $aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("vertexPosition"), 
    $JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("vertexNormal"), $_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("vertexColor"), 
    $aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("vertexTexturePos"), $_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("vertexScalar"), 
    $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = this.$_uniformLocations$, $_acquisitionDirection2$$inline_736_uUsePicking$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("usePicking"), 
    $uUseObjectColor$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("useObjectColor"), $uObjectColor$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("objectColor"), $uUseScalars$$ = 
    $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("useScalars"), $uScalarsReplaceMode$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("scalarsReplaceMode"), $uScalarsMin$$ = 
    $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("scalarsMin"), $uScalarsMax$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("scalarsMax"), $uScalarsMinColor$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("scalarsMinColor"), 
    $uScalarsMaxColor$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("scalarsMaxColor"), $uScalarsInterpolation$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("scalarsInterpolation"), 
    $uScalarsMinThreshold$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("scalarsMinThreshold"), $uScalarsMaxThreshold$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("scalarsMaxThreshold"), 
    $uObjectOpacity$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("objectOpacity"), $uLabelMapOpacity$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("labelmapOpacity"), 
    $uLabelMapColor$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("labelmapColor"), $uUseTexture$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("useTexture"), $uUseLabelMapTexture$$ = 
    $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("useLabelMapTexture"), $uTextureSampler$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("textureSampler"), $uTextureSampler2$$ = 
    $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("textureSampler2"), $uVolumeLowerThreshold$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("volumeLowerThreshold"), $uVolumeUpperThreshold$$ = 
    $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("volumeUpperThreshold"), $uVolumeScalarMin$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("volumeScalarMin"), $uVolumeScalarMax$$ = 
    $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("volumeScalarMax"), $uVolumeWindowLow$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("volumeWindowLow"), $uVolumeWindowHigh$$ = 
    $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("volumeWindowHigh"), $uVolumeScalarMinColor$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("volumeScalarMinColor"), $uVolumeScalarMaxColor$$ = 
    $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("volumeScalarMaxColor"), $uVolumeTexture$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("volumeTexture"), $uObjectTransform$$ = 
    $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("objectTransform"), $uPointSize$$ = $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$.get("pointSize"), $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$ = 
    $_numberOfObjects$$1$$;
    do {
      var $object$$47$$ = $_objects$$1$$[$_numberOfObjects$$1$$ - $JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$];
      if($object$$47$$) {
        var $drawMode_labelmapTextureID_pointSize_volume$$4$$ = $JSCompiler_alias_NULL$$;
        $object$$47$$ instanceof $X$slice$$ && $object$$47$$.$_volume$ && ($drawMode_labelmapTextureID_pointSize_volume$$4$$ = $object$$47$$.$_volume$);
        if($object$$47$$.$_visible$ && (!$drawMode_labelmapTextureID_pointSize_volume$$4$$ || $drawMode_labelmapTextureID_pointSize_volume$$4$$.$_visible$) && (!$picking$$1$$ || $object$$47$$.$_pickable$)) {
          var $id$$14_minColor$$1$$ = $object$$47$$.$_id$, $magicMode_maxColor$$1$$ = $object$$47$$.$_magicmode$, $vertexBuffer$$1$$ = this.$_vertexBuffers$.get($id$$14_minColor$$1$$), $normalBuffer$$1_objectColor_useObjectColor$$ = this.$_normalBuffers$.get($id$$14_minColor$$1$$), $colorBuffer$$1$$ = this.$_colorBuffers$.get($id$$14_minColor$$1$$), $labelmap$$1_scalarBuffer$$1$$ = this.$_scalarBuffers$.get($id$$14_minColor$$1$$), $texturePositionBuffer$$1$$ = this.$_texturePositionBuffers$.get($id$$14_minColor$$1$$);
          this.$_context$.bindBuffer(this.$_context$.ARRAY_BUFFER, $vertexBuffer$$1$$.$_glBuffer$);
          this.$_context$.vertexAttribPointer($aPosition_i$$inline_739_t$$inline_728_topLevelObject_volume$$inline_718$$, $vertexBuffer$$1$$.$_itemSize$, this.$_context$.FLOAT, $JSCompiler_alias_FALSE$$, 0, 0);
          this.$_context$.bindBuffer(this.$_context$.ARRAY_BUFFER, $normalBuffer$$1_objectColor_useObjectColor$$.$_glBuffer$);
          this.$_context$.vertexAttribPointer($JSCompiler_temp_const$$766__slices$$inline_730_aNormal_dX$$inline_721_reSortRequired$$inline_726$$, $normalBuffer$$1_objectColor_useObjectColor$$.$_itemSize$, this.$_context$.FLOAT, $JSCompiler_alias_FALSE$$, 0, 0);
          $picking$$1$$ ? this.$_context$.uniform1i($_acquisitionDirection2$$inline_736_uUsePicking$$, $JSCompiler_alias_TRUE$$) : this.$_context$.uniform1i($_acquisitionDirection2$$inline_736_uUsePicking$$, $JSCompiler_alias_FALSE$$);
          $colorBuffer$$1$$ && !$picking$$1$$ && !$magicMode_maxColor$$1$$ ? (this.$_context$.uniform1i($uUseObjectColor$$, $JSCompiler_alias_FALSE$$), this.$_context$.bindBuffer(this.$_context$.ARRAY_BUFFER, $colorBuffer$$1$$.$_glBuffer$), this.$_context$.vertexAttribPointer($_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$, $colorBuffer$$1$$.$_itemSize$, this.$_context$.FLOAT, $JSCompiler_alias_FALSE$$, 0, 0)) : ($normalBuffer$$1_objectColor_useObjectColor$$ = 1, $magicMode_maxColor$$1$$ && 
          !$picking$$1$$ && ($normalBuffer$$1_objectColor_useObjectColor$$ = 0), this.$_context$.uniform1i($uUseObjectColor$$, $normalBuffer$$1_objectColor_useObjectColor$$), $normalBuffer$$1_objectColor_useObjectColor$$ = $object$$47$$.$_color$, $picking$$1$$ && ($normalBuffer$$1_objectColor_useObjectColor$$ = [Math.floor($id$$14_minColor$$1$$ % 65025 % 255) / 255, Math.floor($id$$14_minColor$$1$$ % 65025 / 255) / 255, Math.floor($id$$14_minColor$$1$$ / 65025) / 255]), this.$_context$.uniform3f($uObjectColor$$, 
          parseFloat($normalBuffer$$1_objectColor_useObjectColor$$[0]), parseFloat($normalBuffer$$1_objectColor_useObjectColor$$[1]), parseFloat($normalBuffer$$1_objectColor_useObjectColor$$[2])), this.$_context$.vertexAttribPointer($_targetChild$$inline_731_aColor_centroid$$inline_894_dY$$inline_722$$, $vertexBuffer$$1$$.$_itemSize$, this.$_context$.FLOAT, $JSCompiler_alias_FALSE$$, 0, 0));
          $labelmap$$1_scalarBuffer$$1$$ && !$picking$$1$$ && !$magicMode_maxColor$$1$$ ? (this.$_context$.uniform1i($uUseScalars$$, $JSCompiler_alias_TRUE$$), this.$_context$.uniform1i($uScalarsReplaceMode$$, $object$$47$$.$_scalars$.$_replaceMode$), $id$$14_minColor$$1$$ = $object$$47$$.$_scalars$.$_minColor$, $magicMode_maxColor$$1$$ = $object$$47$$.$_scalars$.$_maxColor$, this.$_context$.uniform3f($uScalarsMinColor$$, parseFloat($id$$14_minColor$$1$$[0]), parseFloat($id$$14_minColor$$1$$[1]), 
          parseFloat($id$$14_minColor$$1$$[2])), this.$_context$.uniform3f($uScalarsMaxColor$$, parseFloat($magicMode_maxColor$$1$$[0]), parseFloat($magicMode_maxColor$$1$$[1]), parseFloat($magicMode_maxColor$$1$$[2])), this.$_context$.uniform1f($uScalarsMinThreshold$$, parseFloat($object$$47$$.$_scalars$.$_lowerThreshold$)), this.$_context$.uniform1f($uScalarsMaxThreshold$$, parseFloat($object$$47$$.$_scalars$.$_upperThreshold$)), this.$_context$.uniform1f($uScalarsMin$$, parseFloat($object$$47$$.$_scalars$.$_min$)), 
          this.$_context$.uniform1f($uScalarsMax$$, parseFloat($object$$47$$.$_scalars$.$_max$)), this.$_context$.uniform1i($uScalarsInterpolation$$, parseInt($object$$47$$.$_scalars$.$_interpolation$, 10)), this.$_context$.bindBuffer(this.$_context$.ARRAY_BUFFER, $labelmap$$1_scalarBuffer$$1$$.$_glBuffer$), this.$_context$.vertexAttribPointer($_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$, $labelmap$$1_scalarBuffer$$1$$.$_itemSize$, this.$_context$.FLOAT, 
          $JSCompiler_alias_FALSE$$, 0, 0)) : (this.$_context$.uniform1i($uUseScalars$$, $JSCompiler_alias_FALSE$$), this.$_context$.vertexAttribPointer($_acquisitionDirection$$inline_735_aScalar_realCentroidVector2$$inline_720_realCentroidVector2$$inline_733$$, $vertexBuffer$$1$$.$_itemSize$, this.$_context$.FLOAT, $JSCompiler_alias_FALSE$$, 0, 0));
          this.$_context$.uniform1f($uObjectOpacity$$, parseFloat($object$$47$$.$_opacity$));
          $object$$47$$.$_texture$ && $texturePositionBuffer$$1$$ && !$picking$$1$$ ? (this.$_context$.uniform1i($uUseTexture$$, $JSCompiler_alias_TRUE$$), this.$_context$.activeTexture(this.$_context$.TEXTURE0), this.$_context$.bindTexture(this.$_context$.TEXTURE_2D, this.$_textures$.get($object$$47$$.$_texture$.$_id$)), this.$_context$.uniform1i($uTextureSampler$$, 0), this.$_context$.bindBuffer(this.$_context$.ARRAY_BUFFER, $texturePositionBuffer$$1$$.$_glBuffer$), this.$_context$.vertexAttribPointer($aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$, 
          $texturePositionBuffer$$1$$.$_itemSize$, this.$_context$.FLOAT, $JSCompiler_alias_FALSE$$, 0, 0), this.$_context$.uniform1i($uVolumeTexture$$, $JSCompiler_alias_FALSE$$)) : (this.$_context$.uniform1i($uUseTexture$$, $JSCompiler_alias_FALSE$$), this.$_context$.vertexAttribPointer($aTexturePosition_dX$$inline_734_maxDistance$$inline_723_realCentroidVector$$inline_719_realCentroidVector$$inline_732_s$$inline_737$$, $vertexBuffer$$1$$.$_itemSize$, this.$_context$.FLOAT, $JSCompiler_alias_FALSE$$, 
          0, 0));
          $drawMode_labelmapTextureID_pointSize_volume$$4$$ && (this.$_context$.uniform1i($uVolumeTexture$$, $JSCompiler_alias_TRUE$$), this.$_context$.uniform1f($uVolumeLowerThreshold$$, $drawMode_labelmapTextureID_pointSize_volume$$4$$.$_lowerThreshold$), this.$_context$.uniform1f($uVolumeUpperThreshold$$, $drawMode_labelmapTextureID_pointSize_volume$$4$$.$_upperThreshold$), this.$_context$.uniform1f($uVolumeScalarMin$$, $drawMode_labelmapTextureID_pointSize_volume$$4$$.$_min$), this.$_context$.uniform1f($uVolumeScalarMax$$, 
          $drawMode_labelmapTextureID_pointSize_volume$$4$$.$_max$), $id$$14_minColor$$1$$ = $drawMode_labelmapTextureID_pointSize_volume$$4$$.$_minColor$, $magicMode_maxColor$$1$$ = $drawMode_labelmapTextureID_pointSize_volume$$4$$.$_maxColor$, this.$_context$.uniform3f($uVolumeScalarMinColor$$, parseFloat($id$$14_minColor$$1$$[0]), parseFloat($id$$14_minColor$$1$$[1]), parseFloat($id$$14_minColor$$1$$[2])), this.$_context$.uniform3f($uVolumeScalarMaxColor$$, parseFloat($magicMode_maxColor$$1$$[0]), 
          parseFloat($magicMode_maxColor$$1$$[1]), parseFloat($magicMode_maxColor$$1$$[2])), this.$_context$.uniform1f($uVolumeWindowLow$$, $drawMode_labelmapTextureID_pointSize_volume$$4$$.$_windowLow$), this.$_context$.uniform1f($uVolumeWindowHigh$$, $drawMode_labelmapTextureID_pointSize_volume$$4$$.$_windowHigh$), $labelmap$$1_scalarBuffer$$1$$ = $drawMode_labelmapTextureID_pointSize_volume$$4$$.$_labelmap$, this.$_context$.uniform1i($uUseLabelMapTexture$$, $JSCompiler_alias_FALSE$$), $drawMode_labelmapTextureID_pointSize_volume$$4$$.$_volumeRendering$ ? 
          this.$_context$.uniform1f($uObjectOpacity$$, parseFloat($drawMode_labelmapTextureID_pointSize_volume$$4$$.$_opacity$)) : $labelmap$$1_scalarBuffer$$1$$ && $labelmap$$1_scalarBuffer$$1$$.$_visible$ && ($drawMode_labelmapTextureID_pointSize_volume$$4$$ = $object$$47$$.$_labelmap$.$_id$, this.$_context$.uniform1i($uUseLabelMapTexture$$, $JSCompiler_alias_TRUE$$), this.$_context$.activeTexture(this.$_context$.TEXTURE1), this.$_context$.bindTexture(this.$_context$.TEXTURE_2D, this.$_textures$.get($drawMode_labelmapTextureID_pointSize_volume$$4$$)), 
          this.$_context$.uniform1i($uTextureSampler2$$, 1), this.$_context$.uniform1f($uLabelMapOpacity$$, $labelmap$$1_scalarBuffer$$1$$.$_opacity$), this.$_context$.uniform4fv($uLabelMapColor$$, $labelmap$$1_scalarBuffer$$1$$.$_showOnlyColor$)));
          this.$_context$.uniformMatrix4fv($uObjectTransform$$, $JSCompiler_alias_FALSE$$, $object$$47$$.$_transform$.$_matrix$);
          $drawMode_labelmapTextureID_pointSize_volume$$4$$ = 1;
          "POINTS" == $object$$47$$.$_type$ && ($drawMode_labelmapTextureID_pointSize_volume$$4$$ = $object$$47$$.$_pointsize$);
          this.$_context$.uniform1f($uPointSize$$, $drawMode_labelmapTextureID_pointSize_volume$$4$$);
          $drawMode_labelmapTextureID_pointSize_volume$$4$$ = -1;
          $object$$47$$.$_type$ == $X$displayable$types$TRIANGLES$$ ? ($drawMode_labelmapTextureID_pointSize_volume$$4$$ = this.$_context$.TRIANGLES, $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$ && ($trianglesCounter$$ += $vertexBuffer$$1$$.$_itemCount$ / 3)) : "LINES" == $object$$47$$.$_type$ ? (this.$_context$.lineWidth($object$$47$$.$_linewidth$), $drawMode_labelmapTextureID_pointSize_volume$$4$$ = this.$_context$.LINES) : "POINTS" == $object$$47$$.$_type$ ? 
          $drawMode_labelmapTextureID_pointSize_volume$$4$$ = this.$_context$.POINTS : "TRIANGLE_STRIPS" == $object$$47$$.$_type$ ? ($drawMode_labelmapTextureID_pointSize_volume$$4$$ = this.$_context$.TRIANGLE_STRIP, $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$ && ($trianglesCounter$$ += $vertexBuffer$$1$$.$_itemCount$ / 3)) : "POLYGONS" == $object$$47$$.$_type$ && ($drawMode_labelmapTextureID_pointSize_volume$$4$$ = 0 == $vertexBuffer$$1$$.$_itemCount$ % 
          3 ? this.$_context$.TRIANGLES : this.$_context$.TRIANGLE_FAN, $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$ && ($trianglesCounter$$ += $vertexBuffer$$1$$.$_itemCount$ / 3));
          this.$_context$.drawArrays($drawMode_labelmapTextureID_pointSize_volume$$4$$, 0, $vertexBuffer$$1$$.$_itemCount$)
        }
      }
    }while(--$JSCompiler_inline_result$$767_aPointers_center$$4_distanceFromEye$$inline_897_i$$186_object$$inline_729_perspectiveMatrix_realCentroidVector$$inline_896_transformedCentroidVector$$inline_895_uLocations$$);
    $objects$$inline_738_statisticsEnabled_topLevelObjects$$inline_727_topLevelObjectsLength_viewMatrix$$ && Math.round($trianglesCounter$$)
  }
};
$JSCompiler_prototypeAlias$$.remove = function $$JSCompiler_prototypeAlias$$$remove$($object$$48$$) {
  $X$renderer3D$$.$superClass_$.remove.call(this, $object$$48$$);
  if(0 < $object$$48$$.$_children$.length) {
    for(var $children$$5_id$$15$$ = $object$$48$$.$_children$, $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ = $children$$5_id$$15$$.length, $c$$32$$ = 0, $c$$32$$ = 0;$c$$32$$ < $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$;$c$$32$$++) {
      "undefined" != typeof $children$$5_id$$15$$[$c$$32$$] && this.remove($children$$5_id$$15$$[$c$$32$$])
    }
  }
  $children$$5_id$$15$$ = $object$$48$$.$_id$;
  $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ = this.$_texturePositionBuffers$.get($children$$5_id$$15$$);
  $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ != $JSCompiler_alias_NULL$$ && this.$_context$.isBuffer($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$.$_glBuffer$) && this.$_context$.deleteBuffer($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$.$_glBuffer$);
  if($object$$48$$.$_texture$ && ($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ = this.$_textures$.get($object$$48$$.$_texture$.$_id$))) {
    this.$_context$.deleteTexture($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$), this.$_textures$.remove($object$$48$$.$_texture$.$_id$)
  }
  $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ = this.$_vertexBuffers$.get($children$$5_id$$15$$);
  $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ != $JSCompiler_alias_NULL$$ && this.$_context$.isBuffer($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$.$_glBuffer$) && this.$_context$.deleteBuffer($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$.$_glBuffer$);
  $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ = this.$_normalBuffers$.get($children$$5_id$$15$$);
  $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ != $JSCompiler_alias_NULL$$ && this.$_context$.isBuffer($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$.$_glBuffer$) && this.$_context$.deleteBuffer($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$.$_glBuffer$);
  $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ = this.$_colorBuffers$.get($children$$5_id$$15$$);
  $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ != $JSCompiler_alias_NULL$$ && this.$_context$.isBuffer($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$.$_glBuffer$) && this.$_context$.deleteBuffer($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$.$_glBuffer$);
  $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ = this.$_scalarBuffers$.get($children$$5_id$$15$$);
  $_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$ != $JSCompiler_alias_NULL$$ && this.$_context$.isBuffer($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$.$_glBuffer$) && this.$_context$.deleteBuffer($_texture_numberOfChildren$$5_oldColorBuffer$$1_oldNormalBuffer$$1_oldScalarBuffer$$1_oldTexturePositionBuffer$$1_oldVertexBuffer$$1$$.$_glBuffer$);
  this.$_vertexBuffers$.remove($children$$5_id$$15$$);
  this.$_normalBuffers$.remove($children$$5_id$$15$$);
  this.$_colorBuffers$.remove($children$$5_id$$15$$);
  this.$_texturePositionBuffers$.remove($children$$5_id$$15$$);
  this.$_scalarBuffers$.remove($children$$5_id$$15$$);
  this.$_objects$.remove($object$$48$$);
  return $JSCompiler_alias_TRUE$$
};
$JSCompiler_prototypeAlias$$.$destroy$ = function $$JSCompiler_prototypeAlias$$$$destroy$$() {
  this.$_shaders$ = $JSCompiler_alias_NULL$$;
  delete this.$_shaders$;
  this.$_context$.clear(this.$_context$.COLOR_BUFFER_BIT | this.$_context$.DEPTH_BUFFER_BIT);
  $X$renderer3D$$.$superClass_$.$destroy$.call(this)
};
$X$renderer3D$$.prototype.__defineGetter__("bgColor", $JSCompiler_get$$("$_bgColor$"));
$X$renderer3D$$.prototype.__defineSetter__("bgColor", $JSCompiler_set$$("$_bgColor$"));
$X$renderer3D$$.prototype.$pick3d$ = function $$X$renderer3D$$$$$pick3d$$($box_intersections_ray_far_s_p_x$$106$$, $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$, $delta$$1$$, $epsilon$$, $id$$16_object$$49$$) {
  $delta$$1$$ != $JSCompiler_alias_NULL$$ || ($delta$$1$$ = 4);
  $epsilon$$ != $JSCompiler_alias_NULL$$ || ($epsilon$$ = 2);
  if($id$$16_object$$49$$ == $JSCompiler_alias_NULL$$) {
    $id$$16_object$$49$$ = this.$pick$($box_intersections_ray_far_s_p_x$$106$$, $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$);
    if(-1 == $id$$16_object$$49$$) {
      return $JSCompiler_alias_NULL$$
    }
    $id$$16_object$$49$$ = this.get($id$$16_object$$49$$);
    if(!$id$$16_object$$49$$) {
      return $JSCompiler_alias_NULL$$
    }
  }
  var $ray_near_sample_count_sample_space$$ = $JSCompiler_StaticMethods_unproject_$$(this.$_camera$, 2 * ($box_intersections_ray_far_s_p_x$$106$$ / this.$_width$) - 1, 2 * ((this.$_height$ - $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$) / this.$_height$) - 1, 0);
  $box_intersections_ray_far_s_p_x$$106$$ = $JSCompiler_StaticMethods_unproject_$$(this.$_camera$, 2 * ($box_intersections_ray_far_s_p_x$$106$$ / this.$_width$) - 1, 2 * ((this.$_height$ - $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$) / this.$_height$) - 1, 1);
  $ray_near_sample_count_sample_space$$[0] += this.$_center$[0];
  $ray_near_sample_count_sample_space$$[1] += this.$_center$[1];
  $ray_near_sample_count_sample_space$$[2] += this.$_center$[2];
  $box_intersections_ray_far_s_p_x$$106$$[0] += this.$_center$[0];
  $box_intersections_ray_far_s_p_x$$106$$[1] += this.$_center$[1];
  $box_intersections_ray_far_s_p_x$$106$$[2] += this.$_center$[2];
  $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ = [$id$$16_object$$49$$.$_points$.$_minA$, $id$$16_object$$49$$.$_points$.$_minB$, $id$$16_object$$49$$.$_points$.$_minC$];
  var $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$ = [$id$$16_object$$49$$.$_points$.$_maxA$, $id$$16_object$$49$$.$_points$.$_minB$, $id$$16_object$$49$$.$_points$.$_minC$], $C__i$$inline_746_points$$3$$ = [$id$$16_object$$49$$.$_points$.$_maxA$, $id$$16_object$$49$$.$_points$.$_maxB$, $id$$16_object$$49$$.$_points$.$_minC$], $D__i2$$inline_747_points_count$$ = [$id$$16_object$$49$$.$_points$.$_minA$, $id$$16_object$$49$$.$_points$.$_maxB$, $id$$16_object$$49$$.$_points$.$_minC$], 
  $E__i3$$inline_748_c_p_x$$ = [$id$$16_object$$49$$.$_points$.$_minA$, $id$$16_object$$49$$.$_points$.$_maxB$, $id$$16_object$$49$$.$_points$.$_maxC$], $F__i4$$inline_749_c_p_y$$ = [$id$$16_object$$49$$.$_points$.$_minA$, $id$$16_object$$49$$.$_points$.$_minB$, $id$$16_object$$49$$.$_points$.$_maxC$], $G__sol1$$inline_753_c_p_z$$ = [$id$$16_object$$49$$.$_points$.$_maxA$, $id$$16_object$$49$$.$_points$.$_maxB$, $id$$16_object$$49$$.$_points$.$_maxC$], $H__j1$$inline_750__sol$$inline_755_c_p$$ = 
  [$id$$16_object$$49$$.$_points$.$_maxA$, $id$$16_object$$49$$.$_points$.$_minB$, $id$$16_object$$49$$.$_points$.$_maxC$];
  $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ = [$X$$.$matrix$.$multiplyByVector$($id$$16_object$$49$$.$_transform$.$_matrix$, $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[0], $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[1], $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[2]), $X$$.$matrix$.$multiplyByVector$($id$$16_object$$49$$.$_transform$.$_matrix$, 
  $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[0], $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[1], $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[2]), $X$$.$matrix$.$multiplyByVector$($id$$16_object$$49$$.$_transform$.$_matrix$, $C__i$$inline_746_points$$3$$[0], $C__i$$inline_746_points$$3$$[1], $C__i$$inline_746_points$$3$$[2]), $X$$.$matrix$.$multiplyByVector$($id$$16_object$$49$$.$_transform$.$_matrix$, $D__i2$$inline_747_points_count$$[0], 
  $D__i2$$inline_747_points_count$$[1], $D__i2$$inline_747_points_count$$[2]), $X$$.$matrix$.$multiplyByVector$($id$$16_object$$49$$.$_transform$.$_matrix$, $E__i3$$inline_748_c_p_x$$[0], $E__i3$$inline_748_c_p_x$$[1], $E__i3$$inline_748_c_p_x$$[2]), $X$$.$matrix$.$multiplyByVector$($id$$16_object$$49$$.$_transform$.$_matrix$, $F__i4$$inline_749_c_p_y$$[0], $F__i4$$inline_749_c_p_y$$[1], $F__i4$$inline_749_c_p_y$$[2]), $X$$.$matrix$.$multiplyByVector$($id$$16_object$$49$$.$_transform$.$_matrix$, 
  $G__sol1$$inline_753_c_p_z$$[0], $G__sol1$$inline_753_c_p_z$$[1], $G__sol1$$inline_753_c_p_z$$[2]), $X$$.$matrix$.$multiplyByVector$($id$$16_object$$49$$.$_transform$.$_matrix$, $H__j1$$inline_750__sol$$inline_755_c_p$$[0], $H__j1$$inline_750__sol$$inline_755_c_p$$[1], $H__j1$$inline_750__sol$$inline_755_c_p$$[2])];
  var $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$ = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity], $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$;
  for($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$ in $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$) {
    $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$ = $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[$box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$], $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$ = [Math.min($B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[0], $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$.x), Math.max($B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[1], 
    $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$.x), Math.min($B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[2], $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$.y), Math.max($B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[3], $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$.y), Math.min($B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[4], $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$.$z$), Math.max($B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[5], 
    $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$.$z$)]
  }
  $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$ = $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$;
  $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ = [];
  $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$ = [];
  for($C__i$$inline_746_points$$3$$ = 0;6 > $C__i$$inline_746_points$$3$$;$C__i$$inline_746_points$$3$$++) {
    var $D__i2$$inline_747_points_count$$ = Math.floor($C__i$$inline_746_points$$3$$ / 2), $E__i3$$inline_748_c_p_x$$ = ($D__i2$$inline_747_points_count$$ + 1) % 3, $F__i4$$inline_749_c_p_y$$ = ($D__i2$$inline_747_points_count$$ + 2) % 3, $H__j1$$inline_750__sol$$inline_755_c_p$$ = (2 + 2 * $D__i2$$inline_747_points_count$$) % 6, $_j2$$inline_751$$ = (4 + 2 * $D__i2$$inline_747_points_count$$) % 6, $_sol2$$inline_754__t$$inline_752$$ = ($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[$C__i$$inline_746_points$$3$$] - 
    $ray_near_sample_count_sample_space$$[$D__i2$$inline_747_points_count$$]) * (1 / $box_intersections_ray_far_s_p_x$$106$$[$D__i2$$inline_747_points_count$$]);
    Infinity != $_sol2$$inline_754__t$$inline_752$$ && -Infinity != $_sol2$$inline_754__t$$inline_752$$ && ($G__sol1$$inline_753_c_p_z$$ = $ray_near_sample_count_sample_space$$[$E__i3$$inline_748_c_p_x$$] + $box_intersections_ray_far_s_p_x$$106$$[$E__i3$$inline_748_c_p_x$$] * $_sol2$$inline_754__t$$inline_752$$, $_sol2$$inline_754__t$$inline_752$$ = $ray_near_sample_count_sample_space$$[$F__i4$$inline_749_c_p_y$$] + $box_intersections_ray_far_s_p_x$$106$$[$F__i4$$inline_749_c_p_y$$] * $_sol2$$inline_754__t$$inline_752$$, 
    $G__sol1$$inline_753_c_p_z$$ >= $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[$H__j1$$inline_750__sol$$inline_755_c_p$$] && $G__sol1$$inline_753_c_p_z$$ <= $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[$H__j1$$inline_750__sol$$inline_755_c_p$$ + 1] && $_sol2$$inline_754__t$$inline_752$$ >= $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[$_j2$$inline_751$$] && $_sol2$$inline_754__t$$inline_752$$ <= $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[$_j2$$inline_751$$ + 
    1] ? ($H__j1$$inline_750__sol$$inline_755_c_p$$ = [], $H__j1$$inline_750__sol$$inline_755_c_p$$[$D__i2$$inline_747_points_count$$] = $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[$C__i$$inline_746_points$$3$$], $H__j1$$inline_750__sol$$inline_755_c_p$$[$E__i3$$inline_748_c_p_x$$] = $G__sol1$$inline_753_c_p_z$$, $H__j1$$inline_750__sol$$inline_755_c_p$$[$F__i4$$inline_749_c_p_y$$] = $_sol2$$inline_754__t$$inline_752$$, $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$.push($H__j1$$inline_750__sol$$inline_755_c_p$$)) : 
    ($H__j1$$inline_750__sol$$inline_755_c_p$$ = [], $H__j1$$inline_750__sol$$inline_755_c_p$$[$D__i2$$inline_747_points_count$$] = $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[$C__i$$inline_746_points$$3$$], $H__j1$$inline_750__sol$$inline_755_c_p$$[$E__i3$$inline_748_c_p_x$$] = $G__sol1$$inline_753_c_p_z$$, $H__j1$$inline_750__sol$$inline_755_c_p$$[$F__i4$$inline_749_c_p_y$$] = $_sol2$$inline_754__t$$inline_752$$, $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$.push($H__j1$$inline_750__sol$$inline_755_c_p$$)))
  }
  $box_intersections_ray_far_s_p_x$$106$$ = [$A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$, $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$];
  $box_intersections_ray_far_s_p_x$$106$$ = $box_intersections_ray_far_s_p_x$$106$$[0];
  if(0 == $box_intersections_ray_far_s_p_x$$106$$.length) {
    return $JSCompiler_alias_NULL$$
  }
  $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$ = Array(2);
  for($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$ = 0;2 > $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$;$box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$++) {
    $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ = $box_intersections_ray_far_s_p_x$$106$$[$box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$], $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[$box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$] = Math.sqrt(($A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[0] - $ray_near_sample_count_sample_space$$[0]) * ($A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[0] - 
    $ray_near_sample_count_sample_space$$[0]) + ($A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[1] - $ray_near_sample_count_sample_space$$[1]) * ($A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[1] - $ray_near_sample_count_sample_space$$[1]) + ($A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[2] - $ray_near_sample_count_sample_space$$[2]) * ($A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[2] - 
    $ray_near_sample_count_sample_space$$[2]))
  }
  $ray_near_sample_count_sample_space$$ = $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ = $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$ = $JSCompiler_alias_NULL$$;
  $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[0] < $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[1] ? ($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$ = $box_intersections_ray_far_s_p_x$$106$$[0], $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ = $box_intersections_ray_far_s_p_x$$106$$[1]) : ($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$ = $box_intersections_ray_far_s_p_x$$106$$[1], $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ = 
  $box_intersections_ray_far_s_p_x$$106$$[0]);
  $ray_near_sample_count_sample_space$$ = Math.sqrt(($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[0] - $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[0]) * ($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[0] - $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[0]) + ($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[1] - $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[1]) * 
  ($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[1] - $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[1]) + ($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[2] - $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[2]) * ($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[2] - $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[2]));
  $ray_near_sample_count_sample_space$$ /= $delta$$1$$;
  $box_intersections_ray_far_s_p_x$$106$$ = $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$;
  $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$ = [$A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[0] - $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[0], $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[1] - $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[1], $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$[2] - $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[2]];
  $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ = Math.sqrt($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[0] * $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[0] + $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[1] * $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[1] + $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[2] * $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[2]);
  $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$ = [$box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[0] / $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$, $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[1] / $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$, $box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$[2] / $A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$];
  $C__i$$inline_746_points$$3$$ = $id$$16_object$$49$$.$_points$.$_triplets$;
  $D__i2$$inline_747_points_count$$ = $C__i$$inline_746_points$$3$$.length;
  for($box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$ = 0;$box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$ < $ray_near_sample_count_sample_space$$;$box$$inline_741_i$$187_sample_direction_sample_start_t$$8$$ += $delta$$1$$) {
    $box_intersections_ray_far_s_p_x$$106$$ = [$box_intersections_ray_far_s_p_x$$106$$[0] + $delta$$1$$ * $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[0], $box_intersections_ray_far_s_p_x$$106$$[1] + $delta$$1$$ * $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[1], $box_intersections_ray_far_s_p_x$$106$$[2] + $delta$$1$$ * $B__solutionsOut$$inline_745_distances_extremes_sample_unit_v$$[2]];
    for($A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ = 0;$A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ < $D__i2$$inline_747_points_count$$;$A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ += 3) {
      if($E__i3$$inline_748_c_p_x$$ = $C__i$$inline_746_points$$3$$[$A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$], $F__i4$$inline_749_c_p_y$$ = $C__i$$inline_746_points$$3$$[$A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ + 1], $G__sol1$$inline_753_c_p_z$$ = $C__i$$inline_746_points$$3$$[$A__solutionsIn$$inline_744_p$$18_sample_direction_length_sample_end_transformed_points_y$$79$$ + 2], $H__j1$$inline_750__sol$$inline_755_c_p$$ = 
      new $X$$.$vector$($E__i3$$inline_748_c_p_x$$, $F__i4$$inline_749_c_p_y$$, $G__sol1$$inline_753_c_p_z$$), $H__j1$$inline_750__sol$$inline_755_c_p$$ = $X$$.$matrix$.$multiplyByVector$($id$$16_object$$49$$.$_transform$.$_matrix$, $E__i3$$inline_748_c_p_x$$, $F__i4$$inline_749_c_p_y$$, $G__sol1$$inline_753_c_p_z$$), Math.sqrt(($box_intersections_ray_far_s_p_x$$106$$[0] - $H__j1$$inline_750__sol$$inline_755_c_p$$.x) * ($box_intersections_ray_far_s_p_x$$106$$[0] - $H__j1$$inline_750__sol$$inline_755_c_p$$.x) + 
      ($box_intersections_ray_far_s_p_x$$106$$[1] - $H__j1$$inline_750__sol$$inline_755_c_p$$.y) * ($box_intersections_ray_far_s_p_x$$106$$[1] - $H__j1$$inline_750__sol$$inline_755_c_p$$.y) + ($box_intersections_ray_far_s_p_x$$106$$[2] - $H__j1$$inline_750__sol$$inline_755_c_p$$.$z$) * ($box_intersections_ray_far_s_p_x$$106$$[2] - $H__j1$$inline_750__sol$$inline_755_c_p$$.$z$)) <= $epsilon$$) {
        return[$H__j1$$inline_750__sol$$inline_755_c_p$$.x, $H__j1$$inline_750__sol$$inline_755_c_p$$.y, $H__j1$$inline_750__sol$$inline_755_c_p$$.$z$]
      }
    }
  }
  return $JSCompiler_alias_NULL$$
};
$goog$exportSymbol$$("X.renderer3D", $X$renderer3D$$);
$goog$exportSymbol$$("X.renderer3D.prototype.init", $X$renderer3D$$.prototype.$init$);
$goog$exportSymbol$$("X.renderer3D.prototype.add", $X$renderer3D$$.prototype.add);
$goog$exportSymbol$$("X.renderer3D.prototype.onShowtime", $X$renderer3D$$.prototype.$onShowtime$);
$goog$exportSymbol$$("X.renderer3D.prototype.onRender", $X$renderer3D$$.prototype.$onRender$);
$goog$exportSymbol$$("X.renderer3D.prototype.get", $X$renderer3D$$.prototype.get);
$goog$exportSymbol$$("X.renderer3D.prototype.render", $X$renderer3D$$.prototype.$render$);
$goog$exportSymbol$$("X.renderer3D.prototype.destroy", $X$renderer3D$$.prototype.$destroy$);
$goog$exportSymbol$$("X.renderer3D.prototype.remove", $X$renderer3D$$.prototype.remove);
$goog$exportSymbol$$("X.renderer3D.prototype.resetBoundingBox", $X$renderer3D$$.prototype.$resetBoundingBox$);
$goog$exportSymbol$$("X.renderer3D.prototype.resetViewAndRender", $X$renderer3D$$.prototype.$resetViewAndRender$);
$goog$exportSymbol$$("X.renderer3D.prototype.pick", $X$renderer3D$$.prototype.$pick$);
$goog$exportSymbol$$("X.renderer3D.prototype.pick3d", $X$renderer3D$$.prototype.$pick3d$);
function $X$renderer2D$$() {
  $X$renderer$$.call(this);
  this.$_classname$ = "renderer2D";
  this.$_orientation$ = $JSCompiler_alias_NULL$$;
  this.$_orientationIndex$ = -1;
  this.$_orientationColors$ = [];
  this.$_labelFrameBufferContext$ = this.$_labelFrameBuffer$ = this.$_frameBufferContext$ = this.$_frameBuffer$ = $JSCompiler_alias_NULL$$;
  this.$_sliceHeightSpacing$ = this.$_sliceWidthSpacing$ = this.$_sliceHeight$ = this.$_sliceWidth$ = 0;
  this.$_windowHigh$ = this.$_windowLow$ = this.$_upperThreshold$ = this.$_lowerThreshold$ = this.$_currentSlice$ = -1;
  this.$_labelmapShowOnlyColor$ = new Float32Array([-255, -255, -255, -255]);
  this.$_radiological$ = $JSCompiler_alias_TRUE$$
}
$goog$inherits$$($X$renderer2D$$, $X$renderer$$);
$JSCompiler_prototypeAlias$$ = $X$renderer2D$$.prototype;
$JSCompiler_prototypeAlias$$.remove = function $$JSCompiler_prototypeAlias$$$remove$($object$$50$$) {
  $X$renderer2D$$.$superClass_$.remove.call(this, $object$$50$$);
  this.$_objects$.remove($object$$50$$);
  return $JSCompiler_alias_TRUE$$
};
$JSCompiler_prototypeAlias$$.$onScroll$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$onWindowLevel$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$onScroll_$ = function $$JSCompiler_prototypeAlias$$$$onScroll_$$($event$$41$$) {
  $X$renderer2D$$.$superClass_$.$onScroll_$.call(this, $event$$41$$);
  var $_volume$$ = this.$_topLevelObjects$[0];
  if($_volume$$) {
    var $_orientation$$ = "", $_orientation$$ = 0 == this.$_orientationIndex$ ? "indexX" : 1 == this.$_orientationIndex$ ? "indexY" : "indexZ";
    $_volume$$[$_orientation$$] = $event$$41$$.$_up$ ? $_volume$$[$_orientation$$] + 1 : $_volume$$[$_orientation$$] - 1;
    eval("this.onScroll();")
  }
};
$JSCompiler_prototypeAlias$$.$onWindowLevel_$ = function $$JSCompiler_prototypeAlias$$$$onWindowLevel_$$($_new_level_event$$42$$) {
  var $_volume$$1$$ = this.$_topLevelObjects$[0];
  if($_volume$$1$$) {
    var $_old_window$$ = $_volume$$1$$.$_windowHigh$ - $_volume$$1$$.$_windowLow$, $_old_level$$ = $_old_window$$ / 2, $_new_window$$ = parseInt($_old_window$$ + $_old_window$$ / 15 * -$_new_level_event$$42$$.$_window$, 10);
    $_new_level_event$$42$$ = parseInt($_old_level$$ + $_old_level$$ / 15 * $_new_level_event$$42$$.$_level$, 10);
    $_old_window$$ == $_new_window$$ && $_new_window$$++;
    $_old_level$$ == $_new_level_event$$42$$ && $_new_level_event$$42$$++;
    $_volume$$1$$.$_windowLow$ -= parseInt($_old_level$$ - $_new_level_event$$42$$, 10);
    $_volume$$1$$.$_windowLow$ -= parseInt($_old_window$$ - $_new_window$$, 10);
    $_volume$$1$$.$_windowLow$ = Math.max($_volume$$1$$.$_windowLow$, $_volume$$1$$.$_min$);
    $_volume$$1$$.$_windowHigh$ -= parseInt($_old_level$$ - $_new_level_event$$42$$, 10);
    $_volume$$1$$.$_windowHigh$ += parseInt($_old_window$$ - $_new_window$$, 10);
    $_volume$$1$$.$_windowHigh$ = Math.min($_volume$$1$$.$_windowHigh$, $_volume$$1$$.$_max$);
    eval("this.onWindowLevel();")
  }
};
$X$renderer2D$$.prototype.__defineGetter__("orientation", $JSCompiler_get$$("$_orientation$"));
$X$renderer2D$$.prototype.__defineSetter__("orientation", function($orientation$$) {
  $orientation$$ = $orientation$$.toUpperCase();
  "AXIAL" == $orientation$$ ? ($orientation$$ = "Z", this.$_orientationIndex$ = 2) : "SAGITTAL" == $orientation$$ ? ($orientation$$ = "X", this.$_orientationIndex$ = 0) : "CORONAL" == $orientation$$ && ($orientation$$ = "Y", this.$_orientationIndex$ = 1);
  "X" != $orientation$$ && ("Y" != $orientation$$ && "Z" != $orientation$$) && $JSCompiler_alias_THROW$$(Error("Invalid orientation."));
  this.$_orientation$ = $orientation$$
});
$X$renderer2D$$.prototype.__defineGetter__("radiological", $JSCompiler_get$$("$_radiological$"));
$X$renderer2D$$.prototype.__defineSetter__("radiological", $JSCompiler_set$$("$_radiological$"));
$JSCompiler_prototypeAlias$$ = $X$renderer2D$$.prototype;
$JSCompiler_prototypeAlias$$.$init$ = function $$JSCompiler_prototypeAlias$$$$init$$() {
  this.$_orientation$ || $JSCompiler_alias_THROW$$(Error("No 2D orientation set."));
  $X$renderer2D$$.$superClass_$.$init$.call(this, "2d");
  this.$_context$.fillStyle = "rgba(50,50,50,0)";
  this.$_context$.fillRect(0, 0, this.$_canvas$.width, this.$_canvas$.height);
  this.$_frameBuffer$ = $goog$dom$createDom$$("canvas");
  this.$_labelFrameBuffer$ = $goog$dom$createDom$$("canvas");
  $goog$events$listen$$(this.$_camera$, $X$event$events$WINDOWLEVEL$$, this.$onWindowLevel_$.bind(this))
};
$JSCompiler_prototypeAlias$$.$onResize_$ = function $$JSCompiler_prototypeAlias$$$$onResize_$$() {
  $X$renderer2D$$.$superClass_$.$onResize_$.call(this);
  $JSCompiler_StaticMethods_autoScale_$$(this)
};
$JSCompiler_prototypeAlias$$.$resetViewAndRender$ = function $$JSCompiler_prototypeAlias$$$$resetViewAndRender$$() {
  $X$renderer2D$$.$superClass_$.$resetViewAndRender$.call(this);
  $JSCompiler_StaticMethods_autoScale_$$(this);
  var $_volume$$3$$ = this.$_topLevelObjects$[0];
  $_volume$$3$$ && ($_volume$$3$$.$_windowHigh$ = $_volume$$3$$.$_max$, $_volume$$3$$.$_windowLow$ = $_volume$$3$$.$_min$)
};
$JSCompiler_prototypeAlias$$.update = function $$JSCompiler_prototypeAlias$$$update$($object$$51$$) {
  this.$update_$($object$$51$$);
  this.$_currentSlice$ = -1
};
$JSCompiler_prototypeAlias$$.$update_$ = function $$JSCompiler_prototypeAlias$$$$update_$$($object$$52$$) {
  $X$renderer2D$$.$superClass_$.$update_$.call(this, $object$$52$$);
  var $_k$$4_existed$$1$$ = $JSCompiler_alias_FALSE$$;
  this.get($object$$52$$.$_id$) && ($_k$$4_existed$$1$$ = $JSCompiler_alias_TRUE$$);
  if($object$$52$$ instanceof $X$volume$$) {
    var $_width_file$$1$$ = $object$$52$$.$_file$, $_height__len$$5_labelmap$$2$$ = $object$$52$$.$_labelmap$, $_currentSlice$$1__frameBuffer_colortable$$2$$ = $object$$52$$.$_colortable$;
    if($_height__len$$5_labelmap$$2$$ != $JSCompiler_alias_NULL$$ && $_height__len$$5_labelmap$$2$$.$_file$ != $JSCompiler_alias_NULL$$ && $_height__len$$5_labelmap$$2$$.$_file$.$_dirty$) {
      this.$update_$($_height__len$$5_labelmap$$2$$)
    }else {
      if($_currentSlice$$1__frameBuffer_colortable$$2$$ != $JSCompiler_alias_NULL$$ && $_currentSlice$$1__frameBuffer_colortable$$2$$.$_file$ != $JSCompiler_alias_NULL$$ && $_currentSlice$$1__frameBuffer_colortable$$2$$.$_file$.$_dirty$) {
        this.$_loader$.load($_currentSlice$$1__frameBuffer_colortable$$2$$, $object$$52$$)
      }else {
        if($_width_file$$1$$ != $JSCompiler_alias_NULL$$ && $goog$isArray$$($_width_file$$1$$)) {
          if($object$$52$$.$MRI$ != $JSCompiler_alias_NULL$$) {
            if($object$$52$$.$MRI$.$loaded_files$ != $_width_file$$1$$.length) {
              return
            }
          }else {
            $_k$$4_existed$$1$$ = 0;
            $_height__len$$5_labelmap$$2$$ = $_width_file$$1$$.length;
            for($_k$$4_existed$$1$$ = 0;$_k$$4_existed$$1$$ < $_height__len$$5_labelmap$$2$$;$_k$$4_existed$$1$$++) {
              this.$_loader$.load($_width_file$$1$$[$_k$$4_existed$$1$$], $object$$52$$)
            }
            return
          }
        }else {
          if($_width_file$$1$$ != $JSCompiler_alias_NULL$$ && $_width_file$$1$$.$_dirty$) {
            this.$_loader$.load($object$$52$$, $object$$52$$);
            return
          }
        }
        this.$_orientationIndex$ = "X" == this.$_orientation$ ? 0 : "Y" == this.$_orientation$ ? 1 : 2;
        this.$_slices$ = $object$$52$$.$_children$[this.$_orientationIndex$].$_children$;
        $_currentSlice$$1__frameBuffer_colortable$$2$$ = $JSCompiler_alias_NULL$$;
        $_currentSlice$$1__frameBuffer_colortable$$2$$ = 0 == this.$_orientationIndex$ ? $object$$52$$.indexX : 1 == this.$_orientationIndex$ ? $object$$52$$.indexY : $object$$52$$.indexZ;
        $_width_file$$1$$ = $object$$52$$.$_children$[this.$_orientationIndex$].$_children$[$_currentSlice$$1__frameBuffer_colortable$$2$$].$_iWidth$;
        $_height__len$$5_labelmap$$2$$ = $object$$52$$.$_children$[this.$_orientationIndex$].$_children$[$_currentSlice$$1__frameBuffer_colortable$$2$$].$_iHeight$;
        this.$_sliceWidthSpacing$ = $object$$52$$.$_children$[this.$_orientationIndex$].$_children$[$_currentSlice$$1__frameBuffer_colortable$$2$$].$_widthSpacing$;
        this.$_sliceHeightSpacing$ = $object$$52$$.$_children$[this.$_orientationIndex$].$_children$[$_currentSlice$$1__frameBuffer_colortable$$2$$].$_heightSpacing$;
        this.$_sliceWidth$ = $_width_file$$1$$;
        this.$_sliceHeight$ = $_height__len$$5_labelmap$$2$$;
        $_currentSlice$$1__frameBuffer_colortable$$2$$ = this.$_frameBuffer$;
        $_currentSlice$$1__frameBuffer_colortable$$2$$.width = $_width_file$$1$$;
        $_currentSlice$$1__frameBuffer_colortable$$2$$.height = $_height__len$$5_labelmap$$2$$;
        var $_frameBuffer2$$ = this.$_labelFrameBuffer$;
        $_frameBuffer2$$.width = $_width_file$$1$$;
        $_frameBuffer2$$.height = $_height__len$$5_labelmap$$2$$;
        this.$_frameBufferContext$ = $_currentSlice$$1__frameBuffer_colortable$$2$$.getContext("2d");
        this.$_labelFrameBufferContext$ = $_frameBuffer2$$.getContext("2d");
        $_k$$4_existed$$1$$ || (this.$_objects$.add($object$$52$$), $JSCompiler_StaticMethods_autoScale_$$(this))
      }
    }
  }
};
function $JSCompiler_StaticMethods_autoScale_$$($JSCompiler_StaticMethods_autoScale_$self$$) {
  var $_autoScale$$ = Math.min($JSCompiler_StaticMethods_autoScale_$self$$.$_width$ / ($JSCompiler_StaticMethods_autoScale_$self$$.$_sliceWidth$ * $JSCompiler_StaticMethods_autoScale_$self$$.$_sliceWidthSpacing$), $JSCompiler_StaticMethods_autoScale_$self$$.$_height$ / ($JSCompiler_StaticMethods_autoScale_$self$$.$_sliceHeight$ * $JSCompiler_StaticMethods_autoScale_$self$$.$_sliceHeightSpacing$));
  $JSCompiler_StaticMethods_autoScale_$self$$.$_camera$.$_view$[14] = $_autoScale$$
}
$JSCompiler_prototypeAlias$$.$onSliceNavigation$ = $JSCompiler_emptyFn$$();
$JSCompiler_prototypeAlias$$.$xy2ijk$ = function $$JSCompiler_prototypeAlias$$$$xy2ijk$$($x$$107$$, $y$$80$$) {
  var $_volume$$4$$ = this.$_topLevelObjects$[0], $_center__image_top2xy__view$$1$$ = this.$_camera$.$_view$, $_currentSlice$$2__ix$$ = $JSCompiler_alias_NULL$$, $_ijk__sliceWidth$$ = this.$_sliceWidth$, $_ras$$1__sliceHeight$$ = this.$_sliceHeight$, $_sliceWSpacing__sliceWidthScaled$$ = $JSCompiler_alias_NULL$$, $_sliceHSpacing__sliceHeightScaled__z$$2$$ = $JSCompiler_alias_NULL$$;
  if("Y" == this.$_orientation$) {
    $_currentSlice$$2__ix$$ = this.$_slices$[parseInt($_volume$$4$$.indexY, 10)], $_sliceWSpacing__sliceWidthScaled$$ = $_currentSlice$$2__ix$$.$_widthSpacing$, $_sliceHSpacing__sliceHeightScaled__z$$2$$ = $_currentSlice$$2__ix$$.$_heightSpacing$, this.$_orientationColors$[0] = "red", this.$_orientationColors$[1] = "blue"
  }else {
    if("Z" == this.$_orientation$) {
      $_currentSlice$$2__ix$$ = this.$_slices$[parseInt($_volume$$4$$.indexZ, 10)], $_sliceWSpacing__sliceWidthScaled$$ = $_currentSlice$$2__ix$$.$_widthSpacing$, $_sliceHSpacing__sliceHeightScaled__z$$2$$ = $_currentSlice$$2__ix$$.$_heightSpacing$, this.$_orientationColors$[0] = "red", this.$_orientationColors$[1] = "green"
    }else {
      $_currentSlice$$2__ix$$ = this.$_slices$[parseInt($_volume$$4$$.indexX, 10)];
      $_sliceWSpacing__sliceWidthScaled$$ = $_currentSlice$$2__ix$$.$_heightSpacing$;
      $_sliceHSpacing__sliceHeightScaled__z$$2$$ = $_currentSlice$$2__ix$$.$_widthSpacing$;
      this.$_orientationColors$[0] = "green";
      this.$_orientationColors$[1] = "blue";
      var $_buf__normalizedScale$$ = $_ijk__sliceWidth$$, $_ijk__sliceWidth$$ = $_ras$$1__sliceHeight$$, $_ras$$1__sliceHeight$$ = $_buf__normalizedScale$$
    }
  }
  var $_iy__x$$2__xyz$$ = 1 * $_center__image_top2xy__view$$1$$[12], $_iz__y$$4$$ = -1 * $_center__image_top2xy__view$$1$$[13], $_buf__normalizedScale$$ = Math.max($_center__image_top2xy__view$$1$$[14], 0.6), $_center__image_top2xy__view$$1$$ = [this.$_width$ / 2, this.$_height$ / 2], $_sliceWSpacing__sliceWidthScaled$$ = $_ijk__sliceWidth$$ * $_sliceWSpacing__sliceWidthScaled$$ * $_buf__normalizedScale$$, $_sliceHSpacing__sliceHeightScaled__z$$2$$ = $_ras$$1__sliceHeight$$ * $_sliceHSpacing__sliceHeightScaled__z$$2$$ * 
  $_buf__normalizedScale$$, $_image_left2xy$$ = $_center__image_top2xy__view$$1$$[0] - $_sliceWSpacing__sliceWidthScaled$$ / 2, $_center__image_top2xy__view$$1$$ = $_center__image_top2xy__view$$1$$[1] - $_sliceHSpacing__sliceHeightScaled__z$$2$$ / 2, $_image_left2xy$$ = $_image_left2xy$$ + $_iy__x$$2__xyz$$ * $_buf__normalizedScale$$, $_center__image_top2xy__view$$1$$ = $_center__image_top2xy__view$$1$$ + $_iz__y$$4$$ * $_buf__normalizedScale$$;
  return $x$$107$$ > $_image_left2xy$$ && $x$$107$$ < $_image_left2xy$$ + $_sliceWSpacing__sliceWidthScaled$$ && $y$$80$$ > $_center__image_top2xy__view$$1$$ && $y$$80$$ < $_center__image_top2xy__view$$1$$ + $_sliceHSpacing__sliceHeightScaled__z$$2$$ ? ($_iy__x$$2__xyz$$ = ($x$$107$$ - $_image_left2xy$$) / $_sliceWSpacing__sliceWidthScaled$$ * $_ijk__sliceWidth$$, $_iz__y$$4$$ = ($y$$80$$ - $_center__image_top2xy__view$$1$$) / $_sliceHSpacing__sliceHeightScaled__z$$2$$ * $_ras$$1__sliceHeight$$, 
  $_sliceHSpacing__sliceHeightScaled__z$$2$$ = $_currentSlice$$2__ix$$.$_xyBBox$[4], "X" == this.$_orientation$ ? ($_buf__normalizedScale$$ = $_ijk__sliceWidth$$ - $_iy__x$$2__xyz$$, $_iy__x$$2__xyz$$ = $_iz__y$$4$$, $_iz__y$$4$$ = $_buf__normalizedScale$$) : "Y" == this.$_orientation$ ? $_iy__x$$2__xyz$$ = $_ijk__sliceWidth$$ - $_iy__x$$2__xyz$$ : "Z" == this.$_orientation$ && ($_iy__x$$2__xyz$$ = $_ijk__sliceWidth$$ - $_iy__x$$2__xyz$$, $_iz__y$$4$$ = $_ras$$1__sliceHeight$$ - $_iz__y$$4$$), $_iy__x$$2__xyz$$ = 
  $_currentSlice$$2__ix$$.$_wmin$ + $_iy__x$$2__xyz$$ * $_currentSlice$$2__ix$$.$_widthSpacing$, $_iz__y$$4$$ = $_currentSlice$$2__ix$$.$_hmin$ + $_iz__y$$4$$ * $_currentSlice$$2__ix$$.$_heightSpacing$, $_iy__x$$2__xyz$$ = $goog$vec$Vec4$createFloat32FromValues$$($_iy__x$$2__xyz$$, $_iz__y$$4$$, $_sliceHSpacing__sliceHeightScaled__z$$2$$, 1), $_ijk__sliceWidth$$ = $goog$vec$Mat4$createFloat32$$(), $goog$vec$Mat4$multVec4$$($_currentSlice$$2__ix$$.$_XYToIJK$, $_iy__x$$2__xyz$$, $_ijk__sliceWidth$$), 
  $_ras$$1__sliceHeight$$ = $goog$vec$Mat4$createFloat32$$(), $goog$vec$Mat4$multVec4$$($_currentSlice$$2__ix$$.$_XYToRAS$, $_iy__x$$2__xyz$$, $_ras$$1__sliceHeight$$), $_currentSlice$$2__ix$$ = Math.round(($_volume$$4$$.$_childrenInfo$[0].$_sliceNormal$[0] * $_ras$$1__sliceHeight$$[0] + $_volume$$4$$.$_childrenInfo$[0].$_sliceNormal$[1] * $_ras$$1__sliceHeight$$[1] + $_volume$$4$$.$_childrenInfo$[0].$_sliceNormal$[2] * $_ras$$1__sliceHeight$$[2] + $_volume$$4$$.$_childrenInfo$[0].$_originD$) / $_volume$$4$$.$_childrenInfo$[0].$_sliceSpacing$), 
  $_currentSlice$$2__ix$$ >= $_volume$$4$$.$_childrenInfo$[0].$_nb$ ? $_currentSlice$$2__ix$$ = $_volume$$4$$.$_childrenInfo$[0].$_nb$ - 1 : 0 > $_currentSlice$$2__ix$$ && ($_currentSlice$$2__ix$$ = 0), $_iy__x$$2__xyz$$ = Math.round(($_volume$$4$$.$_childrenInfo$[1].$_sliceNormal$[0] * $_ras$$1__sliceHeight$$[0] + $_volume$$4$$.$_childrenInfo$[1].$_sliceNormal$[1] * $_ras$$1__sliceHeight$$[1] + $_volume$$4$$.$_childrenInfo$[1].$_sliceNormal$[2] * $_ras$$1__sliceHeight$$[2] + $_volume$$4$$.$_childrenInfo$[1].$_originD$) / 
  $_volume$$4$$.$_childrenInfo$[1].$_sliceSpacing$), $_iy__x$$2__xyz$$ >= $_volume$$4$$.$_childrenInfo$[1].$_nb$ ? $_iy__x$$2__xyz$$ = $_volume$$4$$.$_childrenInfo$[1].$_nb$ - 1 : 0 > $_iy__x$$2__xyz$$ && ($_iy__x$$2__xyz$$ = 0), $_iz__y$$4$$ = Math.round(($_volume$$4$$.$_childrenInfo$[2].$_sliceNormal$[0] * $_ras$$1__sliceHeight$$[0] + $_volume$$4$$.$_childrenInfo$[2].$_sliceNormal$[1] * $_ras$$1__sliceHeight$$[1] + $_volume$$4$$.$_childrenInfo$[2].$_sliceNormal$[2] * $_ras$$1__sliceHeight$$[2] + 
  $_volume$$4$$.$_childrenInfo$[2].$_originD$) / $_volume$$4$$.$_childrenInfo$[2].$_sliceSpacing$), $_iz__y$$4$$ >= $_volume$$4$$.$_childrenInfo$[2].$_nb$ ? $_iz__y$$4$$ = $_volume$$4$$.$_childrenInfo$[2].$_nb$ - 1 : 0 > $_iz__y$$4$$ && ($_iz__y$$4$$ = 0), [[$_currentSlice$$2__ix$$, $_iy__x$$2__xyz$$, $_iz__y$$4$$], [$_ijk__sliceWidth$$[0], $_ijk__sliceWidth$$[1], $_ijk__sliceWidth$$[2]], [$_ras$$1__sliceHeight$$[0], $_ras$$1__sliceHeight$$[1], $_ras$$1__sliceHeight$$[2]]]) : $JSCompiler_alias_NULL$$
};
$JSCompiler_prototypeAlias$$.$render_$ = function $$JSCompiler_prototypeAlias$$$$render_$$($picking$$2$$, $invoked$$2$$) {
  $X$renderer2D$$.$superClass_$.$render_$.call(this, $picking$$2$$, $invoked$$2$$);
  if(0 != this.$_objects$.$_array$.length) {
    var $_volume$$5$$ = this.$_topLevelObjects$[0], $_buf$$1__currentSlice$$3$$ = $JSCompiler_alias_NULL$$, $_buf$$1__currentSlice$$3$$ = 0 == this.$_orientationIndex$ ? $_volume$$5$$.indexX : 1 == this.$_orientationIndex$ ? $_volume$$5$$.indexY : $_volume$$5$$.indexZ, $_index$$2__width2$$ = this.$_slices$[parseInt($_buf$$1__currentSlice$$3$$, 10)].$_iWidth$, $_height2__label$$ = this.$_slices$[parseInt($_buf$$1__currentSlice$$3$$, 10)].$_iHeight$;
    this.$_sliceWidthSpacing$ = this.$_slices$[parseInt($_buf$$1__currentSlice$$3$$, 10)].$_widthSpacing$;
    this.$_sliceHeightSpacing$ = this.$_slices$[parseInt($_buf$$1__currentSlice$$3$$, 10)].$_heightSpacing$;
    this.$_sliceWidth$ = $_index$$2__width2$$;
    this.$_sliceHeight$ = $_height2__label$$;
    var $_width$$1$$ = this.$_width$, $_height$$1$$ = this.$_height$, $_offset_y__value$$2__view$$2__y$$5$$ = this.$_camera$.$_view$;
    this.$_context$.save();
    this.$_context$.clearRect(-$_width$$1$$, -$_height$$1$$, 2 * $_width$$1$$, 2 * $_height$$1$$);
    this.$_context$.restore();
    var $_normalizedScale$$1$$ = Math.max($_offset_y__value$$2__view$$2__y$$5$$[14], 0.1);
    this.$_context$.setTransform($_normalizedScale$$1$$, 0, 0, $_normalizedScale$$1$$, 0, 0);
    var $_mousePosition__offset_x__x$$3_ijk$$ = 1 * $_offset_y__value$$2__view$$2__y$$5$$[12], $_offset_y__value$$2__view$$2__y$$5$$ = -1 * $_offset_y__value$$2__view$$2__y$$5$$[13], $_labelmapShowOnlyColor$$ = $JSCompiler_alias_NULL$$;
    $_volume$$5$$.$_labelmap$ && ($_labelmapShowOnlyColor$$ = $_volume$$5$$.$_labelmap$.$_showOnlyColor$);
    var $_currentLabelMap__slice$$7__valueLM$$ = this.$_slices$[parseInt($_buf$$1__currentSlice$$3$$, 10)], $_sliceData$$ = $_currentLabelMap__slice$$7__valueLM$$.$_texture$.$_rawData$, $_currentLabelMap__slice$$7__valueLM$$ = $_currentLabelMap__slice$$7__valueLM$$.$_labelmap$, $_labelData$$ = $JSCompiler_alias_NULL$$;
    $_currentLabelMap__slice$$7__valueLM$$ && ($_labelData$$ = $_currentLabelMap__slice$$7__valueLM$$.$_rawData$);
    var $_sliceWidth$$1__valueCT$$ = this.$_sliceWidth$, $_sliceHeight$$1$$ = this.$_sliceHeight$, $_imageFBContext$$ = this.$_frameBufferContext$, $_labelFBContext$$ = this.$_labelFrameBufferContext$, $_imageData$$ = $_imageFBContext$$.getImageData(0, 0, $_sliceWidth$$1__valueCT$$, $_sliceHeight$$1$$), $_labelmapData$$ = $_labelFBContext$$.getImageData(0, 0, $_sliceWidth$$1__valueCT$$, $_sliceHeight$$1$$), $_pixels$$ = $_imageData$$.data, $_labelPixels$$ = $_labelmapData$$.data, $_pixelsLength$$ = 
    $_pixels$$.length, $_maxScalarRange$$ = $_volume$$5$$.$_max$, $_lowerThreshold$$ = $_volume$$5$$.$_lowerThreshold$, $_upperThreshold$$ = $_volume$$5$$.$_upperThreshold$, $_windowLow$$ = $_volume$$5$$.$_windowLow$ / $_maxScalarRange$$, $_windowHigh$$ = $_volume$$5$$.$_windowHigh$ / $_maxScalarRange$$;
    if(this.$_currentSlice$ != $_buf$$1__currentSlice$$3$$ || this.$_lowerThreshold$ != $_lowerThreshold$$ || this.$_upperThreshold$ != $_upperThreshold$$ || this.$_windowLow$ != $_windowLow$$ || this.$_windowHigh$ != $_windowHigh$$ || $_labelmapShowOnlyColor$$ && !$X$array$compare$$($_labelmapShowOnlyColor$$, this.$_labelmapShowOnlyColor$, 0)) {
      var $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$ = this.$_frameBuffer$;
      $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$.width = $_index$$2__width2$$;
      $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$.height = $_height2__label$$;
      $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$ = this.$_labelFrameBuffer$;
      $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$.width = $_index$$2__width2$$;
      $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$.height = $_height2__label$$;
      $_index$$2__width2$$ = 0;
      do {
        var $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$ = [0, 0, 0, 0], $_height2__label$$ = [0, 0, 0, 0], $_intensity$$ = $_sliceData$$[$_index$$2__width2$$] / 255 * $_maxScalarRange$$, $_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ = $_sliceData$$[$_index$$2__width2$$], $_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ = ($_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ / 255 - $_windowLow$$) / ($_windowHigh$$ - $_windowLow$$), $_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ = 
        255 * $_invertedColsIndex__invertedIndex__origIntensity_row$$11$$;
        $_intensity$$ >= $_lowerThreshold$$ && $_intensity$$ <= $_upperThreshold$$ && ($_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$ = new $goog$math$Vec3$$($_volume$$5$$.$_minColor$[0], $_volume$$5$$.$_minColor$[1], $_volume$$5$$.$_minColor$[2]), $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$ = (new $goog$math$Vec3$$($_volume$$5$$.$_maxColor$[0], $_volume$$5$$.$_maxColor$[1], $_volume$$5$$.$_maxColor$[2])).scale($_invertedColsIndex__invertedIndex__origIntensity_row$$11$$).add($_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$.scale(255 - 
        $_invertedColsIndex__invertedIndex__origIntensity_row$$11$$)), $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$ = [Math.floor($_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$.x), Math.floor($_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$.y), Math.floor($_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$.$z$), 255], $_currentLabelMap__slice$$7__valueLM$$ && (-255 == $_labelmapShowOnlyColor$$[3] ? $_height2__label$$ = [$_labelData$$[$_index$$2__width2$$], $_labelData$$[$_index$$2__width2$$ + 
        1], $_labelData$$[$_index$$2__width2$$ + 2], $_labelData$$[$_index$$2__width2$$ + 3]] : $X$array$compare$$($_labelmapShowOnlyColor$$, $_labelData$$, $_index$$2__width2$$) && ($_height2__label$$ = [$_labelData$$[$_index$$2__width2$$], $_labelData$$[$_index$$2__width2$$ + 1], $_labelData$$[$_index$$2__width2$$ + 2], $_labelData$$[$_index$$2__width2$$ + 3]])));
        "X" == this.$_orientation$ ? ($_pixels$$[$_index$$2__width2$$] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[0], $_pixels$$[$_index$$2__width2$$ + 1] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[1], $_pixels$$[$_index$$2__width2$$ + 2] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[2], $_pixels$$[$_index$$2__width2$$ + 3] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[3], $_labelPixels$$[$_index$$2__width2$$] = $_height2__label$$[0], 
        $_labelPixels$$[$_index$$2__width2$$ + 1] = $_height2__label$$[1], $_labelPixels$$[$_index$$2__width2$$ + 2] = $_height2__label$$[2], $_labelPixels$$[$_index$$2__width2$$ + 3] = $_height2__label$$[3]) : "Y" == this.$_orientation$ ? ($_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ = Math.floor($_index$$2__width2$$ / (4 * $_sliceWidth$$1__valueCT$$)), $_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ = 4 * $_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ * $_sliceWidth$$1__valueCT$$ + 
        (4 * ($_sliceWidth$$1__valueCT$$ - 1) - ($_index$$2__width2$$ - 4 * $_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ * $_sliceWidth$$1__valueCT$$)), $_pixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[0], $_pixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ + 1] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[1], $_pixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ + 
        2] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[2], $_pixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ + 3] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[3], $_labelPixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$] = $_height2__label$$[0], $_labelPixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ + 1] = $_height2__label$$[1], $_labelPixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ + 
        2] = $_height2__label$$[2], $_labelPixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ + 3] = $_height2__label$$[3]) : ($_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ = $_pixelsLength$$ - 1 - $_index$$2__width2$$, $_pixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ - 3] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[0], $_pixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ - 2] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[1], 
        $_pixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ - 1] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[2], $_pixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$] = $_color$$3__frameBuffer$$1__frameBuffer2$$1_minColor$$2$$[3], $_labelPixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ - 3] = $_height2__label$$[0], $_labelPixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ - 2] = $_height2__label$$[1], $_labelPixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$ - 
        1] = $_height2__label$$[2], $_labelPixels$$[$_invertedColsIndex__invertedIndex__origIntensity_row$$11$$] = $_height2__label$$[3]);
        $_index$$2__width2$$ += 4
      }while($_index$$2__width2$$ < $_pixelsLength$$);
      $_imageFBContext$$.putImageData($_imageData$$, 0, 0);
      $_labelFBContext$$.putImageData($_labelmapData$$, 0, 0);
      this.$_currentSlice$ = $_buf$$1__currentSlice$$3$$;
      this.$_lowerThreshold$ = $_lowerThreshold$$;
      this.$_upperThreshold$ = $_upperThreshold$$;
      this.$_windowLow$ = $_windowLow$$;
      this.$_windowHigh$ = $_windowHigh$$;
      $_currentLabelMap__slice$$7__valueLM$$ && (this.$_labelmapShowOnlyColor$ = $_labelmapShowOnlyColor$$)
    }
    this.$_context$.globalAlpha = 1;
    this.$_context$.translate($_width$$1$$ / 2 / $_normalizedScale$$1$$, $_height$$1$$ / 2 / $_normalizedScale$$1$$);
    "X" == this.$_orientation$ && (this.$_context$.rotate(0.5 * Math.PI), $_buf$$1__currentSlice$$3$$ = $_mousePosition__offset_x__x$$3_ijk$$, $_mousePosition__offset_x__x$$3_ijk$$ = $_offset_y__value$$2__view$$2__y$$5$$, $_offset_y__value$$2__view$$2__y$$5$$ = -$_buf$$1__currentSlice$$3$$);
    $_mousePosition__offset_x__x$$3_ijk$$ = -$_sliceWidth$$1__valueCT$$ * this.$_sliceWidthSpacing$ / 2 + $_mousePosition__offset_x__x$$3_ijk$$;
    $_offset_y__value$$2__view$$2__y$$5$$ = -$_sliceHeight$$1$$ * this.$_sliceHeightSpacing$ / 2 + $_offset_y__value$$2__view$$2__y$$5$$;
    this.$_context$.drawImage(this.$_frameBuffer$, $_mousePosition__offset_x__x$$3_ijk$$, $_offset_y__value$$2__view$$2__y$$5$$, $_sliceWidth$$1__valueCT$$ * this.$_sliceWidthSpacing$, $_sliceHeight$$1$$ * this.$_sliceHeightSpacing$);
    $_currentLabelMap__slice$$7__valueLM$$ && $_volume$$5$$.$_labelmap$.$_visible$ && (this.$_context$.globalAlpha = $_volume$$5$$.$_labelmap$.$_opacity$, this.$_context$.drawImage(this.$_labelFrameBuffer$, $_mousePosition__offset_x__x$$3_ijk$$, $_offset_y__value$$2__view$$2__y$$5$$, $_sliceWidth$$1__valueCT$$ * this.$_sliceWidthSpacing$, $_sliceHeight$$1$$ * this.$_sliceHeightSpacing$));
    if(this.$_config$.SLICENAVIGATORS && (this.$_interactor$.$_mouseInside$ && this.$_interactor$.$_shiftDown$ && !this.$_interactor$.$_leftButtonDown$) && ($_mousePosition__offset_x__x$$3_ijk$$ = this.$_interactor$.$_mousePosition$, $_mousePosition__offset_x__x$$3_ijk$$ = this.$xy2ijk$($_mousePosition__offset_x__x$$3_ijk$$[0], $_mousePosition__offset_x__x$$3_ijk$$[1]))) {
      $_volume$$5$$.$_indexX$ = $_mousePosition__offset_x__x$$3_ijk$$[0][0], $_volume$$5$$.$_indexY$ = $_mousePosition__offset_x__x$$3_ijk$$[0][1], $_volume$$5$$.$_indexZ$ = $_mousePosition__offset_x__x$$3_ijk$$[0][2], $_volume$$5$$.$modified$($JSCompiler_alias_FALSE$$), this.onSliceNavigation(), this.$_context$.setTransform(1, 0, 0, 1, 0, 0), this.$_context$.lineWidth = 1, this.$_context$.beginPath(), this.$_context$.moveTo(this.$_interactor$.$_mousePosition$[0], 0), this.$_context$.lineTo(this.$_interactor$.$_mousePosition$[0], 
      this.$_interactor$.$_mousePosition$[1] - 10), this.$_context$.moveTo(this.$_interactor$.$_mousePosition$[0], this.$_interactor$.$_mousePosition$[1] + 10), this.$_context$.lineTo(this.$_interactor$.$_mousePosition$[0], this.$_height$), this.$_context$.strokeStyle = this.$_orientationColors$[0], this.$_context$.stroke(), this.$_context$.closePath(), this.$_context$.beginPath(), this.$_context$.moveTo(0, this.$_interactor$.$_mousePosition$[1]), this.$_context$.lineTo(this.$_interactor$.$_mousePosition$[0] - 
      10, this.$_interactor$.$_mousePosition$[1]), this.$_context$.moveTo(this.$_interactor$.$_mousePosition$[0] + 10, this.$_interactor$.$_mousePosition$[1] + 0.5), this.$_context$.lineTo(this.$_width$, this.$_interactor$.$_mousePosition$[1]), this.$_context$.strokeStyle = this.$_orientationColors$[1], this.$_context$.stroke(), this.$_context$.closePath(), this.$_context$.font = "10pt Arial", this.$_context$.textAlign = "left", this.$_context$.textBaseline = "top", this.$_context$.fillStyle = "white", 
      this.$_context$.fillText("RAS: " + $_mousePosition__offset_x__x$$3_ijk$$[2][0].toFixed(2) + ", " + $_mousePosition__offset_x__x$$3_ijk$$[2][1].toFixed(2) + ", " + $_mousePosition__offset_x__x$$3_ijk$$[2][2].toFixed(2), 0, 0), $_sliceWidth$$1__valueCT$$ = $_currentLabelMap__slice$$7__valueLM$$ = $_offset_y__value$$2__view$$2__y$$5$$ = "undefined", "undefined" != typeof $_volume$$5$$.$_IJKVolume$[$_mousePosition__offset_x__x$$3_ijk$$[1][2].toFixed(0)] && "undefined" != typeof $_volume$$5$$.$_IJKVolume$[$_mousePosition__offset_x__x$$3_ijk$$[1][2].toFixed(0)][$_mousePosition__offset_x__x$$3_ijk$$[1][1].toFixed(0)] && 
      ($_offset_y__value$$2__view$$2__y$$5$$ = $_volume$$5$$.$_IJKVolume$[$_mousePosition__offset_x__x$$3_ijk$$[1][2].toFixed(0)][$_mousePosition__offset_x__x$$3_ijk$$[1][1].toFixed(0)][$_mousePosition__offset_x__x$$3_ijk$$[1][0].toFixed(0)], $_volume$$5$$.$hasLabelMap$ && ($_currentLabelMap__slice$$7__valueLM$$ = $_volume$$5$$.$_labelmap$.$_IJKVolume$[$_mousePosition__offset_x__x$$3_ijk$$[1][2].toFixed(0)][$_mousePosition__offset_x__x$$3_ijk$$[1][1].toFixed(0)][$_mousePosition__offset_x__x$$3_ijk$$[1][0].toFixed(0)], 
      $_volume$$5$$.$_labelmap$.$_colorTable$ && ($_sliceWidth$$1__valueCT$$ = $_volume$$5$$.$_labelmap$.$_colorTable$.get($_currentLabelMap__slice$$7__valueLM$$), "undefined" != typeof $_sliceWidth$$1__valueCT$$ && ($_sliceWidth$$1__valueCT$$ = $_sliceWidth$$1__valueCT$$[0])))), this.$_context$.fillText("Background:  " + $_offset_y__value$$2__view$$2__y$$5$$ + " (" + $_mousePosition__offset_x__x$$3_ijk$$[1][0].toFixed(0) + ", " + $_mousePosition__offset_x__x$$3_ijk$$[1][1].toFixed(0) + ", " + $_mousePosition__offset_x__x$$3_ijk$$[1][2].toFixed(0) + 
      ")", 0, 15), $_volume$$5$$.$hasLabelMap$ && this.$_context$.fillText("Labelmap:  " + $_sliceWidth$$1__valueCT$$ + " (" + $_currentLabelMap__slice$$7__valueLM$$ + ")", 0, 30)
    }
  }
};
$goog$exportSymbol$$("X.renderer2D", $X$renderer2D$$);
$goog$exportSymbol$$("X.renderer2D.prototype.init", $X$renderer2D$$.prototype.$init$);
$goog$exportSymbol$$("X.renderer2D.prototype.add", $X$renderer2D$$.prototype.add);
$goog$exportSymbol$$("X.renderer2D.prototype.onShowtime", $X$renderer2D$$.prototype.$onShowtime$);
$goog$exportSymbol$$("X.renderer2D.prototype.onRender", $X$renderer2D$$.prototype.$onRender$);
$goog$exportSymbol$$("X.renderer2D.prototype.onScroll", $X$renderer2D$$.prototype.$onScroll$);
$goog$exportSymbol$$("X.renderer2D.prototype.onWindowLevel", $X$renderer2D$$.prototype.$onWindowLevel$);
$goog$exportSymbol$$("X.renderer2D.prototype.get", $X$renderer2D$$.prototype.get);
$goog$exportSymbol$$("X.renderer2D.prototype.resetViewAndRender", $X$renderer2D$$.prototype.$resetViewAndRender$);
$goog$exportSymbol$$("X.renderer2D.prototype.xy2ijk", $X$renderer2D$$.prototype.$xy2ijk$);
$goog$exportSymbol$$("X.renderer2D.prototype.render", $X$renderer2D$$.prototype.$render$);
$goog$exportSymbol$$("X.renderer2D.prototype.destroy", $X$renderer2D$$.prototype.$destroy$);
$goog$exportSymbol$$("X.renderer2D.prototype.onSliceNavigation", $X$renderer2D$$.prototype.$onSliceNavigation$);
function $X$fibers$$() {
  $X$object$$.call(this);
  this.$_classname$ = "fibers";
  $inject$$(this, new $X$loadable$$)
}
$goog$inherits$$($X$fibers$$, $X$object$$);
$goog$exportSymbol$$("X.fibers", $X$fibers$$);
function $X$mesh$$() {
  $X$object$$.call(this);
  this.$_classname$ = "mesh";
  $inject$$(this, new $X$loadable$$)
}
$goog$inherits$$($X$mesh$$, $X$object$$);
$goog$exportSymbol$$("X.mesh", $X$mesh$$);

