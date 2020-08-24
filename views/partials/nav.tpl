<!-- nav.tpl  -->

<header>
	<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary">

		<a class="navbar-brand" href="#"><img src="views/img/logo.png" alt="views/img/logo.png" title="Cliqon" class="img-responsive" style="height: 50px;"/></a>

		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainnavbar" aria-controls="mainnavbar" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="mainnavbar">
			<ul class="navbar-nav mr-auto">

				<li class="nav-item">
					<a class="nav-link" href="/">Home</a>
				</li>

				<li class="nav-item">
					<a class="nav-link" href="https://cliqonlite.com/manual/@($idiom)/">Documentation</a>
				</li>

				<li class="nav-item">
					<a class="nav-link" href="/login/@($idiom)/">Login</a>
				</li>

				<li class="nav-item">
					<a class="nav-link" href="/desktop/@($idiom)/">Administration</a>
				</li>

			</ul>


			<form class="form-inline my-2 my-lg-0">
				<input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
				<button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
			</form>

		</div>
	</nav>
</header>
