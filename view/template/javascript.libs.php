<script type="text/javascript" src="view/js/jquery.min.js"></script>
<script type="text/javascript"
 src="view/js/jquery-ui-1.8.23.custom.min.js"></script>

<script type="text/javascript" src="view/js/jquery.toastmessage.js"></script>
<script type="text/javascript" src="view/js/jquery.filetree.js"></script>
<script type="text/javascript" src="view/js/jquery.multi-accordion-1.5.3.js"></script>
<script type="text/javascript" src="view/js/jquery.apprise.min.js"></script>
<script type="text/javascript" src="view/js/jquery.touchpunch.js"></script>
<script type="text/javascript" src="view/js/jquery.toggle.buttons.js"></script>

<!-- THREEJS and VJS -->
<script type="text/javascript" src="view/js/viewer/babel-polyfill.min.js"></script>
<script type="text/javascript" src="view/js/viewer/three.min.js"></script>
<script type="text/javascript" src="view/js/viewer/vjs.js"></script>
<!-- Seach boxes-->
<script src="lib/select2-3.4.2/select2.js"></script>
<!-- Feature detection-->
<script type="text/javascript" src="view/js/modernizr-2.6.2.js"></script>

<!-- XTK -->
<script type="text/javascript" src="view/js/xtk_edge.js"></script>

<!-- GOOGLE ANALYTICS -->
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push([ '_setAccount', '<?php echo ANALYTICS_ACCOUNT; ?>' ]);
  _gaq.push([ '_setDomainName', 'none' ]);
  _gaq.push([ '_trackPageview' ]);
  (function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl'
        : 'http://www')
        + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
  })();
</script>
