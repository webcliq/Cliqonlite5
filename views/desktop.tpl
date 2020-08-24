<!-- Index.Tpl -->
@include('partials/admhdr.tpl')
<body class="sb-nav-fixed">
<noscript>You need to enable JavaScript to run this app.</noscript>

    @include('partials/admnav.tpl')
    <main>
        <div class="container-fluid">
            <nav class="breadcrumb mb-4 mt-4 p-0 col" style="height: 50px;" id="breadcrumbbar"></nav>
            <section id="admincontent">
				<div class="grid-stack">
				  <div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="6">
				    <div class="grid-stack-item-content">
				    	<div id="newsfeed"></div>
				    </div>
				  </div>
				  <div class="grid-stack-item" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="5">
				    <div class="grid-stack-item-content">
				    	<div id=""><canvas id="coolclock" class="CoolClock:fancy:120"></canvas></div>
				    </div>
				  </div>
				  <div class="grid-stack-item" data-gs-x="8" data-gs-y="0" data-gs-width="4" data-gs-height="4">
				    <div class="grid-stack-item-content">
				    	<div id="dummyrecord"></div>
				    </div>
				  </div>
				</div>   	
            </section>
        </div>
    </main>
   	@include('partials/admftr.tpl')
  
@include('partials/admscript.tpl')
@include('partials/end.tpl')