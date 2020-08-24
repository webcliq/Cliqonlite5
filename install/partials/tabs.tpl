<!-- Tabs  -->

<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">

  <li class="nav-item" role="presentation">
    	<a class="nav-link active" id="pills-instructions-tab" data-toggle="pill" href="#pills-instructions" role="tab" aria-controls="pills-instructions" aria-selected="true">
    		<i class="fas fa-fw fa-file"></i>
    		@($data.instructions)
    		<i class="fas fa-fw fa-hand-point-right"></i>
    	</a>
  </li>

  <li class="nav-item" role="presentation">
    	<a class="nav-link" id="pills-database-tab" data-toggle="pill" href="#pills-database" role="tab" aria-controls="pills-database" aria-selected="false">
    		<i class="fas fa-fw fa-database"></i>
    		@($data.tabs.database) 
    		<i class="fas fa-fw fa-hand-point-right"></i>
    	</a>
  </li>

  <li class="nav-item" role="presentation">
    	<a class="nav-link" id="pills-idiom-tab" data-toggle="pill" href="#pills-idiom" role="tab" aria-controls="pills-idiom" aria-selected="false">
    		<i class="fas fa-fw fa-language"></i>
    		@($data.tabs.idiom)
    		<i class="fas fa-fw fa-hand-point-right"></i>
    	</a>
  </li>

  <li class="nav-item" role="presentation">
    	<a class="nav-link" id="pills-admin-tab" data-toggle="pill" href="#pills-admin" role="tab" aria-controls="pills-admin" aria-selected="false">
    		<i class="fas fa-fw fa-user-cog"></i>
    		@($data.tabs.adminuser)
    		<i class="fas fa-fw fa-hand-point-right"></i>
    	</a>
  </li>

  <li class="nav-item" role="presentation">
    	<a class="nav-link" id="pills-config-tab" data-toggle="pill" href="#pills-config" role="tab" aria-controls="pills-config" aria-selected="false">
    		<i class="fas fa-fw fa-cogs"></i>
    		@($data.tabs.config)
    		<i class="fas fa-fw fa-check-circle"></i>
    	</a>
  </li>

</ul>