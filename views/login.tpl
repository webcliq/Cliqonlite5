<!-- Index.Tpl  -->
@include('partials/hdr.tpl')
<style>
	html,
	body {
	  height: 100%;
	}

	body {
	  display: -ms-flexbox;
	  display: flex;
	  -ms-flex-align: center;
	  align-items: center;
	  background-color: #f5f5f5;
	  margin-top: 0px;

	}

	.form-signin {
	  width: 100%;
	  max-width: 330px;
	  padding: 15px;
	  margin: auto;
	}
	.form-signin .checkbox {
	  font-weight: 400;
	}
	.form-signin .form-control {
	  position: relative;
	  box-sizing: border-box;
	  height: auto;
	  padding: 10px;
	  font-size: 16px;
	}
	.form-signin .form-control:focus {
	  z-index: 2;
	}
	.form-signin input[type="email"] {
	  margin-bottom: 5px;
	  border-bottom-right-radius: 0;
	  border-bottom-left-radius: 0;
	}
	.form-signin input[type="password"] {
	  margin-bottom: 10px;
	  border-top-left-radius: 0;
	  border-top-right-radius: 0;
	}

	.beegee {
/* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#f2f6f8+0,d8e1e7+30,b5c6d0+64,b5c6d0+85,e0eff9+100 */
background: #f2f6f8; /* Old browsers */
background: -moz-linear-gradient(top,  #f2f6f8 0%, #d8e1e7 30%, #b5c6d0 64%, #b5c6d0 85%, #e0eff9 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(top,  #f2f6f8 0%,#d8e1e7 30%,#b5c6d0 64%,#b5c6d0 85%,#e0eff9 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom,  #f2f6f8 0%,#d8e1e7 30%,#b5c6d0 64%,#b5c6d0 85%,#e0eff9 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f6f8', endColorstr='#e0eff9',GradientType=0 ); /* IE6-9 */
}
</style>
<body class="text-center" style="background-image: url( /views/img/register_bg_2.png  ); background-size: 100%; background-repeat: no-repeat;">
	<form class="form-signin beegee p-5" id="loginform">
		<img class="mb-4" src="/views/img/logo.png" alt="/views/img/logo.png" style="max-width: 200px;" />
		<h1 class="h3 mb-3 font-weight-normal">@(Q::cStr('207:Please sign in'))</h1>
		
		<label for="username" class="sr-only">@(Q::cStr('0:Username'))</label>
		<input type="text" id="username" class="form-control mb-2" placeholder="@(Q::cStr('0:Username'))" required autofocus>
		
		<label for="password" class="sr-only">@(Q::cStr('1:Password'))</label>
		<input type="password" id="password" class="form-control" placeholder="@(Q::cStr('1:Password'))" required>
		
		<div class="checkbox mb-3">
			<label>
				<input type="checkbox" value="rememberme" id="rememberme"> @(Q::cStr('206:Remember me'))
			</label>
		</div>
		<button class="btn btn-lg btn-primary btn-block cliqbutton" id="loginbutton" type="button">@(Q::cStr('208:Login'))</button>
	</form>
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
		).then(function(msg) {

			$('button.cliqbutton').on('click', function(evt) { login(evt); });
			var loginform = document.getElementById("loginform");
			loginform.addEventListener("keyup", function(event) {
			  	if(event.keyCode === 13) {
			   		event.preventDefault();
			   		document.getElementById("loginbutton").click();
			  	}
			});

		}, function (error) {
		    // There was an error fetching the script
		    console.log(error);
		}); 

		function login(evt) {
            if($('input[id="username"]').val() != '') {
	            var frmData = new FormData();
	            frmData.append('username', $('input[id="username"]').val());
	            frmData.append('password', $('input[id="password"]').val());
	            frmData.append('rememberme', $('input[id="rememberme"]').val());             	
 	            // console.log(frmData);
	            axios({
	                'method': 'POST',
	                'url': '/dologin/'+jlcd+'/',
	                'responseType': 'json',
	                'cache': 'false',
	                'timeout': 5000,
	                'data': frmData,
	            }).then((response) => {
	                    var result = response.data.data;
	                    
	                    var match = /NotOk/.test(result.flag);
	                    if(!match == true) { 
	               			var urlstr = '/desktop/'+jlcd+'/?token='+result.token; // response will include jwt
	              			uLoad(urlstr);                                                        
	                    } else {
	                        bootbox.alert(result.msg);
	                    }                 
	                }, (error) => {
	                    bootbox.alert(error);
	                }

	            ).catch(function(reason) {
	                bootbox.alert(JSON.stringify(reason));
	            })           	
            } else {
            	return false;
            } // End if
		}

	</script>
</body>
@include('partials/end.tpl')

