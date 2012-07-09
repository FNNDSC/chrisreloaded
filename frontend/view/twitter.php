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