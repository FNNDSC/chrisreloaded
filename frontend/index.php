<!-- code from http://designshack.net/tutorialexamples/bootstraptwo/designshack-bootstrap.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Bootstrap, from Twitter</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le HTML5 shim, for IE6-8 support of HTML elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le styles -->
    <link href="assets/css/bootstrap.css" rel="stylesheet">
    <link href="assets/css/bootstrap-responsive.css" rel="stylesheet">
    <!--<link href="assets/css/docs.css" rel="stylesheet">-->
    <link href="assets/js/google-code-prettify/prettify.css" rel="stylesheet">

    <!-- Le fav and touch icons -->
    <link rel="shortcut icon" href="assets/ico/favicon.ico">
    <link rel="apple-touch-icon" href="assets/ico/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="72x72" href="assets/ico/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="114x114" href="assets/ico/apple-touch-icon-114x114.png">
  </head>
  
  <style>
  	h1 {
  		margin: 20px 0;
  	}
  	
  	.mainsection {
  		margin-bottom: 20px;
  	}
  </style>

  <body data-spy="scroll" data-target=".subnav" data-offset="50">

	<div class="container">
		
		<div class="row">
			<div class="span12">
				<h1>Bootstrap 2 Demo</h1>
			</div>
		</div>
		
		<div class="row">
			<div class="span12" style="margin-bottom: 20px;">
				<div class="btn-group">
				  <a class="btn" href="#">One</a>
				  <a class="btn" href="#">Two</a>
				  <a class="btn" href="#">Three</a>
				  <a class="btn" href="#">Four</a>
				  <a class="btn" href="#">Five</a>
				  <a class="btn" href="#">Six</a>
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="span6">
				<div class="progress">
				  <div class="bar"
				       style="width: 20%;"></div>
				</div>
			</div>
			
			<div class="span6">
				<div class="progress progress-danger progress-striped active">
				  <div class="bar"
				       style="width: 60%;"></div>
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="span6">
				<div class="progress">
				  <div class="bar"
				       style="width: 40%;"></div>
				</div>
			</div>
			
			<div class="span6">
				<div class="progress progress-danger progress-striped active">
				  <div class="bar"
				       style="width: 40%;"></div>
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="span6">
				<div class="progress">
				  <div class="bar"
				       style="width: 60%;"></div>
				</div>
			</div>
			
			<div class="span6">
				<div class="progress progress-danger progress-striped active">
				  <div class="bar"
				       style="width: 20%;"></div>
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="span12">
				<ul class="thumbnails">
				  <li class="span3">
				    <a href="#" class="thumbnail">
				      <img src="http://placehold.it/260x180" alt="">
				    </a>
				  </li>
				  
				  <li class="span3">
				    <a href="#" class="thumbnail">
				      <img src="http://placehold.it/260x180" alt="">
				    </a>
				  </li>
				  
				  <li class="span3">
				    <a href="#" class="thumbnail">
				      <img src="http://placehold.it/260x180" alt="">
				    </a>
				  </li>
				  
				  <li class="span3">
				    <a href="#" class="thumbnail">
				      <img src="http://placehold.it/260x180" alt="">
				    </a>
				  </li>
				  
				  <li class="span3">
				    <a href="#" class="thumbnail">
				      <img src="http://placehold.it/260x180" alt="">
				    </a>
				  </li>
				  
				  <li class="span3">
				    <a href="#" class="thumbnail">
				      <img src="http://placehold.it/260x180" alt="">
				    </a>
				  </li>
				  
				  <li class="span3">
				    <a href="#" class="thumbnail">
				      <img src="http://placehold.it/260x180" alt="">
				    </a>
				  </li>
				  
				  <li class="span3">
				    <a href="#" class="thumbnail">
				      <img src="http://placehold.it/260x180" alt="">
				    </a>
				  </li>
				</ul>
			</div>
		</div>
		
		<div class="row mainsection">
		  <div class="span4"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod ultrices ante, ac laoreet nulla vestibulum adipiscing. Nam quis justo in augue auctor imperdiet. Curabitur aliquet orci sit amet est posuere consectetur. Fusce nec leo ut massa viverra venenatis.</p></div>
		  <div class="span4"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod ultrices ante, ac laoreet nulla vestibulum adipiscing. Nam quis justo in augue auctor imperdiet. Curabitur aliquet orci sit amet est posuere consectetur. Fusce nec leo ut massa viverra venenatis.</p></div>
		  <div class="span4"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod ultrices ante, ac laoreet nulla vestibulum adipiscing. Nam quis justo in augue auctor imperdiet. Curabitur aliquet orci sit amet est posuere consectetur. Fusce nec leo ut massa viverra venenatis.</p></div>
		</div>
		
		<div class="row">
			<div class="span8">
				<div id="myCarousel" class="carousel slide">
				  <div class="carousel-inner">
				    <div class="item active">
				      <img src="assets/img/bootstrap-mdo-sfmoma-01.jpg" alt="">
				      <div class="carousel-caption">
				        <h4>First Thumbnail label</h4>
				        <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
				      </div>
				    </div>
				    <div class="item">
				      <img src="assets/img/bootstrap-mdo-sfmoma-02.jpg" alt="">
				      <div class="carousel-caption">
				        <h4>Second Thumbnail label</h4>
				        <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
				      </div>
				    </div>
				    <div class="item">
				      <img src="assets/img/bootstrap-mdo-sfmoma-03.jpg" alt="">
				      <div class="carousel-caption">
				        <h4>Third Thumbnail label</h4>
				        <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
				      </div>
				    </div>
				  </div>
				  <a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>
				  <a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>
				</div>
			</div>
			
			<div class="span4">
				<h2>Slideshow</h2>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod ultrices ante, ac laoreet nulla vestibulum adipiscing. Nam quis justo in augue auctor imperdiet. Curabitur aliquet orci sit amet est posuere consectetur. Fusce nec leo ut massa viverra venenatis. Nam accumsan libero a elit aliquet quis ullamcorper arcu tincidunt. Praesent purus turpis, consectetur quis congue vel, pulvinar at lorem. Vivamus varius condimentum dolor, quis ultricies ipsum porta quis. </p>
				
			</div>
		</div>
		
	</div>



    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/google-code-prettify/prettify.js"></script>
    <script src="assets/js/bootstrap-transition.js"></script>
    <script src="assets/js/bootstrap-alert.js"></script>
    <script src="assets/js/bootstrap-modal.js"></script>
    <script src="assets/js/bootstrap-dropdown.js"></script>
    <script src="assets/js/bootstrap-scrollspy.js"></script>
    <script src="assets/js/bootstrap-tab.js"></script>
    <script src="assets/js/bootstrap-tooltip.js"></script>
    <script src="assets/js/bootstrap-popover.js"></script>
    <script src="assets/js/bootstrap-button.js"></script>
    <script src="assets/js/bootstrap-collapse.js"></script>
    <script src="assets/js/bootstrap-carousel.js"></script>
    <script src="assets/js/bootstrap-typeahead.js"></script>
    <script src="assets/js/application.js"></script>


  </body>
</html>
