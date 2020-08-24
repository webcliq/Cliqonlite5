<!-- idiom.tpl  -->


<div class="form-row mb-1" v-for="(idiom, idx) in idioms">
	<div class="col-1">
		<input type="text" min=2 max=2 class="form-control"  name="idioms[][]" v-model="idiom.idmcode">
	</div>
	<div class="col-3">
		<input type="text" class="form-control" name="idioms[][]" v-model="idiom.idmname">
	</div>
	<div class="col-3">
		<input type="text" class="form-control" name="idioms[][]" v-model="idiom.idmflag">
	</div>
	<div class="col-5">
		<a href="#" v-on:click="removeIdiom(idx)" class="cursor-pointer"><i class="fas fa-fw fa-trash " title="@($data.idiom.delrow)" ></i></a>
		<a href="#" v-on:click="addNewIdiom" class=" cursor-pointer" ><i class="fas fa-fw fa-plus" title="@($data.idiom.addrow)"></i></a>
	</div>
</div>

<div class="form-row">
	<div class="col mt-3">
		<a class="btn btn-success" href="#" v-on:click="saveIdioms" id="idmcreatebutton">@($data.idiom.idmcreate)</a>
	</div>
</div>
