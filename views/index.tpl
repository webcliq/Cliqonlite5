<!-- Index.Tpl  -->
@include('partials/hdr.tpl')
	<body class="d-flex flex-column" style="background-image: url('/views/img/leaf.webp'); background-repeat: repeat;">
		
		@include('partials/nav.tpl')    

		<main role="main" class="flex-shrink-0 content">
			<div class="container">

				<div class="card text-white" style="width: 350px;">
			        <img src="/views/img/post_img1.jpg" class="card-img-top" alt="...">
			        <div class="card-img-overlay">
			            <h5 class="card-title">Alice Liddel</h5>
			            <p class="card-text">Alice is a freelance web designer and developer based in London. She is specialized in HTML5, CSS3, JavaScript, Bootstrap, etc.</p>
			            <a href="#" class="btn btn-primary stretched-link">View Profile</a>
			        </div>
			    </div>

  			</div>

		</main>
    	@include('partials/ftr.tpl')
    @include('partials/script.tpl')
@include('partials/end.tpl')
