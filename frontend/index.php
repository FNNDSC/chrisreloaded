<!-- code from http://designshack.net/tutorialexamples/bootstraptwo/designshack-bootstrap.html -->

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
		<link href="assets/css/bootstrap.css" rel="stylesheet">
		<link href="assets/css/bootstrap-responsive.css" rel="stylesheet">
		<link href="assets/css/docs.css" rel="stylesheet">
		<link href="assets/js/google-code-prettify/prettify.css" rel="stylesheet">

		<!-- fav and touch icons -->
		<link rel="shortcut icon" href="assets/ico/favicon.ico">
		<link rel="apple-touch-icon" href="assets/ico/apple-touch-icon.png">
		<link rel="apple-touch-icon" sizes="72x72" href="assets/ico/apple-touch-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="114x114" href="assets/ico/apple-touch-icon-114x114.png">
	</head>

	<style>
		body {
			position: relative;
			background-color: #fff;
			background-image: url(http://twitter.github.com/bootstrap/assets/img/grid-18px-masked.png);
			background-repeat: repeat-x;
		}
		h1 {
			margin-top: 10px;
			margin-bottom: 10px;
		}

		/*.mainsection {
		 margin-bottom: 20px;
		 }*/

		.login-form {
			width: 250;
			height: 300;
			padding: 20px;
		}

		.footer {
			height: 100px;
			color: #111111;
			background-color: #333333;
			color: #ffffff;
		}
		.intro {
			font-size: large;
		}

		.more {
		}

		.block {
			background-color: #333333;
			color: #ffffff;
			margin-top: 10px;
			margin-bottom: 10px;
			-webkit-border-radius: 10px 10px 10px 10px;
			-moz-border-radius: 10px 10px 10px 10px;
			border-radius: 10px 10px 10px 10px;
			-webkit-box-shadow: 0 1px 2px rgba(0,0,0,.15);
			-moz-box-shadow: 0 1px 2px rgba(0,0,0,.15);
			box-shadow: 0 1px 2px rgba(0,0,0,.15);
		}
	</style>

	<body data-spy="scroll" data-target=".subnav" data-offset="50">

		<div class="container">

			<div class="row">
				<div class="span8 intro">
					<h1>Welcome to ChRIS 2.0 -Reloaded</h1>
					<p>
						Brought by FNNDSC <a class="btn btn-primary btn-large" onclick="_gaq.push(['_trackEvent', 'Jumbotron actions', 'GitHub Project', 'View project on GitHub']);" href="http://childrenshospital.org/cfapps/research/data_admin/Site3068/mainpageS3068P0.html">Website</a>

					</p>
					<p>
						Super cool features, you can do that that that:
						<ul>
							<li>
								First
							</li>
							<li>
								Second
							</li>
							<li>
								Third
							</li>
						</ul>

					</p>
					<!--     <p>
					<a class="btn btn-primary btn-large">
					Learn more
					</a>
					</p> -->

				</div>
				<div class="span4">
					<div class="login-form block">
						<h2>Login</h2>
						<form action="">
							<fieldset>
								<div class="clearfix">
									<input type="text" placeholder="Username">
								</div>
								<div class="clearfix">
									<input type="password" placeholder="Password">
								</div>
								<button class="btn btn-primary" type="submit">
									Sign in
								</button>
							</fieldset>
						</form>
					</div>

				</div>
			</div>

			<div class="row mainsection">
				<div class="span8">
					<div id="myCarousel" class="carousel slide">
						<div class="carousel-inner">
							<div class="item active">
								<img src="assets/img/carina.jpg" alt="">
								<div class="carousel-caption">
									<h4>First Pipeline</h4>
									<p>
										Tractography bklaascada asdasd ad asd asd asd  dasd adasd ad sa  dad a
									</p>
								</div>
							</div>
							<div class="item">
								<img src="assets/img/echo.jpg" alt="">
								<div class="carousel-caption">
									<h4>Second Pipeline</h4>
									<p>
										CMP sdfs fdsf s sfdsfdsfsdfdsf s fds fdsf  fs fsfd dsfsd
									</p>
								</div>
							</div>
							<div class="item">
								<img src="assets/img/ngc5866.jpg" alt="">
								<div class="carousel-caption">
									<h4>Third Pipeline</h4>
									<p>
										FreeSufer !!! gestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.
									</p>
								</div>
							</div>
						</div>
						<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>
						<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>
					</div>

				</div>
				<div class="span4">
					<script charset="utf-8" src="http://widgets.twimg.com/j/2/widget.js"></script>
					<script>
						new TWTR.Widget({
							version : 2,
							type : 'profile',
							rpp : 4,
							interval : 30000,
							width : 'auto',
							height : 250,
							theme : {
								shell : {
									background : '#333333',
									color : '#ffffff'
								},
								tweets : {
									background : '#000000',
									color : '#ffffff',
									links : '#4aed05'
								}
							},
							features : {
								scrollbar : true,
								loop : true,
								live : true,
								behavior : 'default'
							}
						}).render().setUser('FNNDSC').start();
					</script>
				</div>
			</div>

			<div class="row links">

				<div class="more block span6">
					<div class="test" style="padding: 10px;">
						<p>
							<a class="btn btn-primary btn-large" onclick="_gaq.push(['_trackEvent', 'Jumbotron actions', 'GitHub Project', 'View project on GitHub']);" href="https://github.com/FNNDSC/chrisreloaded">View project on GitHub</a>
						</p>
						<iframe class="github-btn" src="http://markdotto.github.com/github-buttons/github-btn.html?user=nicolasrannou&repo=chrisreloaded&type=watch&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="112px" height="20px"></iframe>
						<iframe class="github-btn" src="http://markdotto.github.com/github-buttons/github-btn.html?user=nicolasrannou&repo=chrisreloaded&type=fork&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="98px" height="20px"></iframe>

					</div>
				</div>

				<div class="more block span6">
					<div class="test" style="padding: 10px;">
						SLICE DROP HERE
					</div>
				</div>

			</div>

			<footer>
				<p>
					&copy; FNNDSC 2012
				</p>
			</footer>

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
