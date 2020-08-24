<!-- database.tpl  -->

<!-- Connection type -->
<div class="form-group row">
	<label for="conntype" class="col-sm-2 col-form-label">@($data.type)</label>
	<div class="col-sm-10">
		<select class="form-control col-sm-6" id="conntype" v-model="db.connectiontype">
			<option value="" selected>@($data.select)</option>
			<option value="sqlite">Sqlite</option>
			<option value="mysql">Mysql</option>
			<option value="pgsql">Postgres</option>
			<option value="mssql">MSSql</option>
		</select>
	</div>
	<small id="conntype-help" class="form-text text-muted ml-3">@($data.database.conntypehelp)</small>
</div>

<!-- Database name -->
<div class="form-group row">
	<label for="dbname" class="col-sm-2 col-form-label">@($data.database.dbname)</label>
	<div class="col-sm-10">
		<input type="text" class="form-control col-sm-6" autofocus required id="dbname" v-model="db.dbname">
	</div>
	<small id="dbname-help" class="form-text text-muted ml-3">@($data.database.dbnamehelp)</small>
</div>

<!-- Username -->
<div class="form-group row">
	<label for="dbuser" class="col-sm-2 col-form-label">@($data.user)</label>
	<div class="col-sm-10">
		<input type="text" class="form-control col-sm-6" id="dbuser"  v-model="db.dbuser">
	</div>
	<small id="dbuser-help" class="form-text text-muted ml-3">@($data.database.dbuserhelp)</small>
</div>

<!-- Password -->
<div class="form-group row">
	<label for="dbpassword" class="col-sm-2 col-form-label">@($data.password)</label>
	<div class="col-sm-10">
		<input type="text" class="form-control col-sm-6" id="dbpassword"  v-model="db.dbpassword">
	</div>
	<small id="dbpassword-help" class="form-text text-muted ml-3">@($data.database.dbpasswordhelp)</small>
</div>

<!-- Server -->
<div class="form-group row">
	<label for="dbserver" class="col-sm-2 col-form-label">@($data.database.dbserver)</label>
	<div class="col-sm-10">
		<input type="text" class="form-control col-sm-6" id="dbserver" v-model="db.dbserver">
	</div>
	<small id="dbserver-help" class="form-text text-muted ml-3">@($data.database.dbserverhelp)</small>
</div>

<!-- Port Number -->
<div class="form-group row">
	<label for="dbport" class="col-sm-2 col-form-label">@($data.database.dbport)</label>
	<div class="col-sm-10">
		<input type="text" class="form-control col-sm-6" id="dbport" v-model="db.dbport">
	</div>
	<small id="dbport-help" class="form-text text-muted ml-3">@($data.database.dbporthelp)</small>
</div>

<!-- Buttons -->
<div class="form-group row">
	<label for="dbcreatebutton" class="col-sm-2 col-form-label"></label>
	<div class="col-sm-10">
		<a class="btn btn-success" href="#" id="dbcreatebutton" v-on:click="dbcreate($event)">@($data.database.dbcreate)</a>
	</div>
</div>