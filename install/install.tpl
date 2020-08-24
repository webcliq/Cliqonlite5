<!-- Install.tpl  -->
	@include('partials/header.tpl')
    <body>

    	@include('partials/nav.tpl')

		<!-- Main content  -->
    	<main role="main" class="container">
    		<div class="">

    			@include('partials/tabs.tpl')

				<div class="tab-content" id="pills-tabContent">

					<!-- Installation instructions -->
					<div class="tab-pane fade show active" id="pills-instructions" role="tabpanel" aria-labelledby="pills-instructions-tab">
						
						<div class="">
							@raw($data.install.instructions)
						</div>

						<div class="mt-2" id="checkdirectories">
							<!-- Result of method will be displayed here -->
						</div>
						
					</div>

					<!-- Database -->
					<div class="tab-pane fade" id="pills-database" role="tabpanel" aria-labelledby="pills-database-tab">

						<div class="h6">
							@raw($data.database.instructions)
						</div>

						<form id="dataform">
							@include('partials/database.tpl')
						</form>

					</div>

					<!-- Language repeater -->
					<div class="tab-pane fade" id="pills-idiom" role="tabpanel" aria-labelledby="pills-idiom-tab">

						<div class="h6">
							@raw($data.idiom.instructions)
						</div>
                                       	
						<form id="idiomform" data-idioms='[{"idmcode": "@($data.idiom.idmcode)", "idmname": "@($data.idiom.idmname)", "idmflag": "@($data.idiom.idmflag)"}]'>
							@include('partials/idiom.tpl')
						</form>

					</div>

					<!-- Administrative user -->
					<div class="tab-pane fade" id="pills-admin" role="tabpanel" aria-labelledby="pills-admin-tab">

						<div class="h6">
							@raw($data.admin.instructions)
						</div>

						<form id="adminform">
							@include('partials/admin.tpl')
						</form>

					</div>

					<!-- Configuration editor -->
					<div class="tab-pane fade" id="pills-config" role="tabpanel" aria-labelledby="pills-config-tab">

						<div class="h6">
							@raw($data.config.instructions)
						</div>

						<form id="configform">
							@include('partials/config.tpl')
						</form>

					</div>
				</div>


    		</div>
    	</main>
   	@include('partials/script.tpl')

