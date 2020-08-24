<!-- config.tpl  -->

<div class="form-row">
	<div class="col">
		<a class="btn btn-success cliqbutton" href="#" id="cfgloadbutton">@($data.config.cfgload)</a>
		<a class="btn btn-warning cliqbutton" href="#" id="cfgsavebutton">@($data.config.cfgsave)</a>
		<a class="btn btn-danger cliqbutton" href="#" id="cfgcompletebutton">@($data.config.cfgcomplete)</a>
	</div>
</div>

<div class="form-row">
	<div class="col mt-3">
		<textarea class="" id="codeeditor" rows="24" style="width: 100%; border: 0;"></textarea>
	</div>
</div>