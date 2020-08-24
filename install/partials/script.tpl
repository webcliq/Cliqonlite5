<!-- Script.tpl  -->

    <script>
	// Paths
	var sitepath = '@raw($protocol)'+document.location.hostname+"/", jlcd = 'en', jspath = sitepath+"install/js/";
	var jlcd = '@($idiom)';
	// basket.clear(true);
	basket
	.remove("lib")  //, "code"
	.require(  
		{url: jspath+"library.js"},
		{url: jspath+"bootstrap.js"},
		{url: jspath+"all.min.js"},
		{url: jspath+"vue.js"},
		{url: jspath+"behave.js"},
		{url: sitepath+"install/i18n/lstr_"+jlcd+".js"},
       	{url: jspath+"install.js", key: "lib", skipCache: true}
	).then(function(msg) {

		Install.init();

	}, function (error) {
	    // There was an error fetching the script
	    console.log(error);
	}); 
</script>
</body>
</html>