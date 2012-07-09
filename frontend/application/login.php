<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>ChRIS 2 -Reloaded</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="">

		<meta name="apple-mobile-web-app-capable" content="yes">

		<!-- style -->
		<link href="../assets/css/bootstrap.css" rel="stylesheet">
		<link href="../assets/css/bootstrap-responsive.css" rel="stylesheet">
		<link href="../assets/css/docs.css" rel="stylesheet">
		<link href="../assets/css/chris.css" rel="stylesheet">

		<link href="../assets/js/google-code-prettify/prettify.css" rel="stylesheet">

		<!-- fav and touch icons -->
		<link rel="shortcut icon" href="../assets/ico/favicon.ico">
		<link rel="apple-touch-icon" href="../assets/ico/apple-touch-icon.png">
		<link rel="apple-touch-icon" sizes="72x72" href="../assets/ico/apple-touch-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="114x114" href="../assets/ico/apple-touch-icon-114x114.png">
	</head>

	<body data-spy="scroll" data-target=".subnav" data-offset="50">

		<div class="navbar">
			<div class="navbar-inner">
				<div class="container">
					<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </a>
					<a class="brand" href="#">ChRIS 2.0 -Reloaded</a>
					<div class="nav-collapse">
						<ul class="nav">
							<li class="active">
								<a href="#"><i class="icon-white icon-home"></i> Home</a>
							</li>
							<li>
								<a href="#"><i class="icon-white icon-list-alt"></i> Results</a>
							</li>
							<li>
								<a href="#"><i class="icon-white icon-folder-open"></i> Projects</a>
							</li>
							<li>
								<a href="#"><i class="icon-white icon-cog"></i> Pipelines</a>
							</li>
							<li>
								<a href="#"><i class="icon-white icon-book"></i> Library</a>
							</li>

						</ul>

						<form class="navbar-search pull-left" action="">
							<input type="text" class="search-query span2" placeholder="Command">
						</form>

						<ul class="nav pull-right">
							<li>
								<a href="#"><i class="icon-white icon-wrench"></i> Settings</a>
							</li>
							<li>
								<a href="#"><i class="icon-white icon-user"></i> Log out</a>
							</li>
						</ul>
					</div><!-- /.nav-collapse -->
				</div>
			</div><!-- /navbar-inner -->
		</div><!-- /navbar -->

		<?php
		$name = $_POST["username"];
		echo "<h3>Welcome $name !!! </h3>";
		?>

		<!-- Le javascript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
		<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
		<script src="../assets/js/jquery.js"></script>
		<script src="../assets/js/google-code-prettify/prettify.js"></script>
		<script src="../assets/js/bootstrap-transition.js"></script>
		<script src="../assets/js/bootstrap-alert.js"></script>
		<script src="../assets/js/bootstrap-modal.js"></script>
		<script src="../assets/js/bootstrap-dropdown.js"></script>
		<script src="../assets/js/bootstrap-scrollspy.js"></script>
		<script src="../assets/js/bootstrap-tab.js"></script>
		<script src="../assets/js/bootstrap-tooltip.js"></script>
		<script src="../assets/js/bootstrap-popover.js"></script>
		<script src="../assets/js/bootstrap-button.js"></script>
		<script src="../assets/js/bootstrap-collapse.js"></script>
		<script src="../assets/js/bootstrap-carousel.js"></script>
		<script src="../assets/js/bootstrap-typeahead.js"></script>
		<script src="../assets/js/application.js"></script>

	</body>
</html>