<!-- admin.tpl  -->

<!-- Username -->
<div class="form-group row">
	<label for="admuser" class="col-sm-2 col-form-label">@($data.user)</label>
	<div class="col-sm-10">
		<input type="text" required min=5 max=20 class="form-control col-sm-6" id="admuser" v-model="user.admuser">
	</div>
	<small id="admuser-help" class="form-text text-muted ml-3">@($data.admin.userhelp)</small>
</div>

<!-- Password -->
<div class="form-group row">
	<label for="admpassword" class="col-sm-2 col-form-label">@($data.password)</label>
	<div class="col-sm-10">
		<input type="password" min=8 max=20 required class="form-control col-sm-6" id="admpassword" v-model="user.admpassword">
	</div>
	<small id="admpassword-help" class="form-text text-muted ml-3">@($data.admin.passwordhelp)</small>
</div>

<!-- Email -->
<div class="form-group row">
	<label for="admemail" class="col-sm-2 col-form-label">@($data.admin.email)</label>
	<div class="col-sm-10">
		<input type="email" class="form-control col-sm-6" id="admemail" v-model="user.admemail">
	</div>
	<small id="admemail-help" class="form-text text-muted ml-3">@($data.admin.emailhelp)</small>
</div>

<!-- Secret key -->
<div class="form-group row">
	<label for="sitesecret" class="col-sm-2 col-form-label">@($data.admin.secret)</label>
	<div class="col-sm-10">
		<input type="text" required min=15 class="form-control col-sm-6" id="sitesecret" v-model="user.sitesecret">
	</div>
	<small id="sitesecrete-help" class="form-text text-muted ml-3">@($data.admin.secrethelp)</small>
</div>

<!-- Buttons -->
<div class="form-group row">
	<label for="admcreatebutton" class="col-sm-2 col-form-label"></label>
	<div class="col-sm-10">
		<a class="btn btn-success" href="#" id="admcreatebutton" v-on:click="usercreate" >@($data.admin.admcreate)</a>
	</div>
</div>