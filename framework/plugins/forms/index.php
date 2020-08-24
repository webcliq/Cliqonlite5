<!-- Hdr.Tpl -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <meta name="author" content="Webcliq"/>
    <meta name="designer" content=”Webcliq”>
    <meta name="publisher" content=”Webcliq”>    
    <meta name="copyright" content="Webcliq"/>
    <meta name="format-detection" content="true"/>

    <!--Search Engine Optimization Meta Tags-->
    <title>jQuery formBuilder/formRender Demo</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name=”robots” content=”index,follow”>
    <meta name="revisit-after" content="7 days">
    <meta name="distribution" content="web">
    <meta name=”robots” content=”noodp”>
    
    <!--Optional Meta Tags-->
    <meta name="distribution" content="web">
    <meta name="web_author" content="">
    <meta name="rating" content="general">
    <meta name="rating" content="safe for kids">
    <meta name="subject" content="">
    <meta name="copyright" content="">
    <meta name="reply-to" content="">
    <meta name="abstract" content="">
    <meta name=”city” content=””>
    <meta name=”country” content=””>
    <meta name="distribution" content="global">
    <meta name="classification" content="">
  
    <!--Meta Tags for HTML pages on Mobile-->
    <meta name="format-detection" content="telephone=yes"/>
    <meta name="HandheldFriendly" content="true"/> 
    <meta name="theme-color" content="#563d7c">
    
    <!--http-equiv Tags-->
    <meta http-equiv="Content-Style-Type" content="text/css">
    <link rel="stylesheet" href="/framework/plugins/forms/assets/formbuilder.css">  
    <meta http-equiv="Content-Script-Type" content="text/javascript">
    <script src="/framework/plugins/forms/assets/basket.js"></script>

</head>
<body>
	<div id="formbuilder"></div>

<script>
	// Paths
	var jspath = "assets/";
	// Objects
	var ctrlDown = false, ctrlKey = 17, cmdKey = 91, vKey = 86, cKey = 67;

	// basket.clear(true);
	basket
	.require(  
       {url: jspath+"jquery.js"},
       {url: jspath+"form-builder.js"},  
       {url: jspath+"form-render.js"}
	).then(function(msg) {

		$('#formbuilder').formBuilder();

	}, function (error) {
	    // There was an error fetching the script
	    console.log(error);
	}); 
</script>
</body>
</html>