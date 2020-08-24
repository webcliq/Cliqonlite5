<!-- Script.Tpl -->
<script>
	// Paths
	var sitepath = "@($protocol)"+document.location.hostname+"/", jlcd = '@raw($idiom)',
	    jspath = sitepath+"views/js/";
	// Objects
	var ctrlDown = false, ctrlKey = 17, cmdKey = 91, vKey = 86, cKey = 67;

	// basket.clear(true);
	basket
	.remove("lib")  //, "code"
	.require(  
       {url: jspath+"library.js", key: "lib", skipCache: true},
       {url: jspath+"phpjs.js"},
       {url: jspath+"bootstrap.js"},    
       {url: jspath+"cliqonlite.js"},     
	).then(function(msg) {

        $(document).keydown(function(e) {
            return (e.which || e.keyCode) != 116;
        })
        
        Cliq.init();

	}, function (error) {
	    // There was an error fetching the script
	    console.log(error);
	}); 
</script>
