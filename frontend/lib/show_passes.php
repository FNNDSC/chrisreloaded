<?php
require_once(dirname(__FILE__) . '/simpletest/reporter.php');

class ShowPasses extends HtmlReporter {
  function paintPass($message) {
    parent::paintPass($message);
    print "<span class=\"pass\">Pass</span>: ";
    $breadcrumb = $this->getTestList();
    array_shift($breadcrumb);
    print implode("->", $breadcrumb);
    print "->$message<br />\n";
  }

  protected function getCss() {
    return parent::getCss() . ' .pass { color: green; }';
  }
}
?>