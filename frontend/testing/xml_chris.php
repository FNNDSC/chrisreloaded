<?php
require_once(dirname(__FILE__) . '/../lib/simpletest/xml.php');

/**
 * Based on https://techknowhow.library.emory.edu/blogs/rsutton/2009/07/24/using-hudson-php-simpletest
 * extend default XmlReporter to record & report time to run each test method
 */

class Xml_Chris extends XmlReporter {
  var $pre;

  function paintMethodStart($test_name) {
    $this->pre = microtime();
    parent::paintMethodStart($test_name);
  }

  function paintMethodEnd($test_name) {
    $post = microtime();
    if ($this->pre != null) {
      $duration = $post - $this->pre;
      // how can post time be less than pre?  assuming zero if this happens..
      if ($post < $this->pre) $duration = 0;
      print $this->getIndent(1);
      print "<time>$duration</time>\n";
    }
    parent::paintMethodEnd($test_name);
    $this->pre = null;
  }

}

?>