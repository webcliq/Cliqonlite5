<!-- Nav.tpl  -->

    	<!-- Header bar -->
		<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
			
			<a class="navbar-brand" href="#">Cliqonlite</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#cliqonliteNav" aria-controls="cliqonliteNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="cliqonliteNav">
				<ul class="navbar-nav mr-auto">

					<li class="nav-item active">
						<a class="nav-link" href="#">@($data.installation)<span class="sr-only">(current)</span></a>
					</li>

					<li class="nav-item">
						<a class="nav-link" href="https://docs.cliqonlite.com" target="_blank">@($data.manual)</a>
					</li>

					<li class="nav-item">
						<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">@($data.administration)</a>
					</li>
				</ul>
			</div>
		</nav>