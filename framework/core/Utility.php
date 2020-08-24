<?php
/**
 * Cliq Framework - Utility
 *
 * @category   Web application framework
 * @package    Cliq
 * @author     Original Author <support@cliqon.com>
 * @copyright  2020 Webcliq
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    Release: 1.0.1
 * @link       http://webcliq.com
 */


namespace core;

use \core\Engine as Cliq;
use \core\Quikform as Qform;
use \core\Html as H;
use \core\Db as Db;
use \core\Log as Log;
use \core\Toml as Toml;
use \core\TomlEncoder as TomlEncode;
use \Framework as F;
use \core\Files as Files;
use \Firephp;
use \R;

class Utility extends Cliq {

	const THISCLASS = "Utility";
	const CLIQDOC = "c_document";
	
	function __construct() {
		// parent::__construct();
	}
	function __destruct() {}


		/** settings() OK
		 * 
		 * @param - array - primarily the request
		 * @return - Ajax return
		 * */
		 function settings($args)
		 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            $idioms = $cfg['site']['idioms'];

				$mdl = F::stdModel('settings', '', '');

				// Extend for each on language - breadcrumbs - text and buttons	- text	etc.
				$mdl['breadcrumbs']	= Cliq::extend($mdl['breadcrumbs']);
				$mdl['buttons']	= Cliq::extend($mdl['buttons']);

				$tabs = ""; $content = "";
				foreach($mdl['tabs'] as $id => $tab) {

					if($tab['active'] == true) {
						$a = ' active'; $b = true; $c = ' show active';
					} else {
						$a = ''; $b = false; $c = '';
					}

					// We will put each tab content in a separate routine belo so that we can modify them as required
					// maybe use plugins .....

					$method = $tab['method'];

					$tabs .= H::li(['class' => 'nav-item', 'role' => 'presentation'],
						H::a(['class' => 'nav-link'.$a, 'id' => $id.'-tab', 'data-toggle' => 'tab', 'href' => '#'.$id, 'role' => 'tab', 'aria-controls' => $id, 'aria-selected' => $b], Cliq::cStr($tab['label']))
					);

					$content .= H::div(['class' => 'tab-pane fade'.$c, 'id' => $id, 'role' => 'tabpanel', 'aria-labelledby' => $id.'-tab'], $this->$method($tab, $lcd)['html']);

					$mdl[$method] = $this->$method($tab, $lcd)['mdl'];
				}

				$html = H::ul(['class' => 'nav nav-tabs', 'id' => 'settings', 'role' => 'tablist'], $tabs).H::div(['class' => 'tab-content', 'id' => 'dataform'], $content);

				return $this->api_exec([
					'html' => $html,							// Html for component
					'component' => [
						'breadcrumbs' => $mdl['breadcrumbs'],
						'buttons' => $mdl['buttons'],
					],											// Current component structure
					'options' => $mdl,							// Data for the component
					'action' => 'settings',						// Name of the component
				]);

		    } catch (Exception $e) {
				return $this->api_exec([
					'html' => $e->getMessage(),
					'action' => 'error',
				]);
		    }
		 }

		/** accessControl() OK
		 * 
		 * @param - array - portion of Model
		 * @return - array - two elements of HTML and Data 
		 * */
		 protected function accessControl(array $tab, $lcd)
		 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$functions = Cliq::fList('dbcollection', 'functions');
				$groups = Cliq::fList('dbcollection', 'usergroups');

				$cols = H::div(['class' => 'clqtable-cell', 'style' => 'width: 200px; font-weight: normal;'], Cliq::cStr('161:Click on the Column header ..... '));
				foreach($groups as $col => $colbl) {
					$cols .= H::div(['class' => 'clqtable-cell pointer headerbutton', 'id' => $col, 'style' => 'width: 80px;'], $colbl);
				}
				$hdrrow = H::div(['class' => 'clqtable-header'], $cols);

				// Gets the existing access control settings from the database
				$sql = "SELECT c_document FROM dbcollection WHERE c_type = ? AND c_reference = ?";
				$cell = R::getCell($sql, ['setting', 'acl']);
				// maybe include encryption / decryption
				is_json($cell) ? $val = json_decode($cell, true) : $val = [] ;

				$rows = ""; 
				foreach($functions as $fn => $fnlbl) {
					$row = '<div class="clqtable-row">';
					$row .= H::div(['class' => 'clqtable-label rowbutton pointer', 'id' => $fn], $fnlbl);
					foreach($groups as $col => $colbl) {
						$name = $fn.'_'.$col;
						$row .= H::div(['class' => 'clqtable-cell'],
							H::input(['type' => 'checkbox', 'class' => 'magic ml-4 pointer cellbutton', 'v-model' => 'acl.'.$name, 'id' => $name])
						);

						array_key_exists($name, $val) ? $data[$name] = $val[$name]: $data[$name] = false;
					}
					$row .= '</div>';
					$rows .= $row; unset($row);
				}

				$html = H::div(['class' => 'row clqtable p-2', 'id' => 'clqtable'], $hdrrow.$rows);
				$html .= H::div(['class' => 'row'],
					H::p([], '*'.Cliq::cStr('158:All users can see the Dashboard .....')),
					H::p([], '** '.Cliq::cStr('159:If the menu header item is disabled .....')),
					H::p([], Cliq::cStr('160:Visitors do not have access to a standard Cliqon Lite by default, ....'))
				);

				// Test
				// $html .= H::div(['class' => 'row'], '{{acl}}');

				return [
					'mdl' => ['functions' => $functions, 'groups' => $groups, 'acl' => $data],
					'html' => $html
				];

		    } catch (Exception $e) {
				return $e->getMessage();
		    }	
		 }

		/** updateAcl() OK
		 * @param - array of arguments
		 * @return - msg - should be ID of record updated
		 **/
		 function updateAcl(array $args)
		 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$rq = $args['request'];
				$acl = $rq['acl'];
				if(!is_array($acl)) {
					throw new \Exception('ACL update to not receive a valid array');
				}
				$json = json_encode($acl);

				$sql = "SELECT DISTINCT id FROM dbcollection WHERE c_type = ? AND c_reference = ?";
				$id = R::getCell($sql, ['setting', 'acl']);

				$upd = R::load('dbcollection', $id);
				$upd->c_document = $json;
				$result = R::store($upd);

				return $this->api_exec([
					'msg' => $result
				]);

		    } catch (Exception $e) {
				return $this->api_exec([
					'msg' => $e->getMessage()
				]);
		    }	
		 }

		/** apiKeys() OK
		 * 
		 * @param - array - portion of Model
		 * @return - array - two elements of HTML and Data 
		 * */
		 protected function apiKeys(array $tab, string $lcd)
		 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$sql = "SELECT * FROM dbuser ORDER BY c_username ASC";
				$rawset = R::getAll($sql); $rs = []; $data = [];
				for($r = 0; $r < count($rawset); $r++) {
					$row = $rawset[$r];
					$json = $rawset[$r]['c_document'];
					$doc = json_decode($json, true);
					unset($row['c_document']);
					$row = array_merge($row, $doc);
					$data[$row['c_username'].'_d_apikey'] = $row['d_apikey'];
					$rs[$row['c_username']] = $row; unset($row);
				}

				// we have a usable extended recordset with the username as the key
				$apiform = "";
				foreach($rs as $usr => $attrs) {
					$apiform .= H::div(['class' => 'form-group row'],
						H::label(['class' => 'col-sm-3 col-form-label', 'for' => $usr.'_d_apikey'], Cliq::fullName($attrs)),
						H::div(['class' => 'col-sm-9'],
							H::input(['type' => 'text', 'id' => $usr.'_d_apikey', 'v-model' => 'apikeys.'.$usr.'_d_apikey', 'class' => 'form-control col-sm-6 apikeychanges'])
						)
					);
				}

				$html = H::div(['class' => 'p-4', 'id' => ''], 
					H::p(Cliq::cStr('162:Please enter a unique string of characters and numbers .....')),
					H::div($apiform)
				);
				
				return [
					'mdl' => ['apikeys' => $data],
					'html' => $html
				];

		    } catch (Exception $e) {
				return $e->getMessage();
		    }	
		 }

		/** updateApiKey() OK
		 *
		 * @param - array of arguments
		 * @return - msg - should be ID of record updated
		 **/
		 function updateApiKey(array $args)
		 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$rq = $args['request'];
				if(!is_array($rq)) {
					throw new \Exception('API key update to not receive a valid array');
				}
				$usr = $rq['c_username'];
				$newapikey = $rq['d_apikey'];

				$sql = "SELECT DISTINCT id, c_document FROM dbuser WHERE c_username = ?";
				$row = R::getRow($sql, [$usr]);
				$json = $row['c_document'];
				$id = $row['id'];
				$doc = json_decode($json, true);
				$doc['d_apikey'] = $newapikey;
				$json = json_encode($doc);
				$upd = R::load('dbuser', $id);
				$upd->c_document = $json;
				$result = R::store($upd);

				return $this->api_exec([
					'msg' => $result
				]);

		    } catch (Exception $e) {
				return $this->api_exec([
					'msg' => $e->getMessage()
				]);
		    }	
		 }

        /** importData()
         * 
         * @param() - array - usual collection of arguments
         * @return - array - containing HTML with import form
         * */
         function importData(array $tab, string $lcd = 'en') {

		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

                $frm = new Qform($lcd);
                $frm->str(['text' => '196:Upload a file to the Server .....']);
                $frm->file([
                    'required' => 'true',
                    'id' => 'ximport.inputfilename',
                    // sficon = ''
                    // pricon => ''
                    // action => ''
                    'label' => ['labelclass' => '', 'text' => '66:File'],
                    'help' => ['helpclass' => '', 'text' => '39:Please select file']
                ], 'file');
                $frm->select([
                    'id' => 'tablename', 'v-model' => 'ximport.tablename',
                    'label' => ['labelclass' => '', 'text' => '163:Table'],
                    'help' => ['helpclass' => '', 'text' => '182:Select the table from the list'],
                    'listtype' => 'dynamic',
                    'list' => ['dbcollection', 'tables', ''],
                ]);
                $frm->field([
                    'id' => 'rowterminator', 'type' => 'text', 'required' => 'true', 'fieldclass' => 'col-sm-2', 'v-model' => 'ximport.rowterminator',
                    'label' => ['labelclass' => '', 'text' => '185:Terminator'],
                    'help' => ['helpclass' => '', 'text' => '186:Row delimiter or termination character']
                ], 'input');
                $frm->field([
                    'id' => 'fielddelimiter', 'type' => 'text', 'required' => 'true', 'fieldclass' => 'col-sm-2', 'v-model' => 'ximport.fielddelimiter',
                    'label' => ['labelclass' => '', 'text' => '187:Delimiter'],
                    'help' => ['helpclass' => '', 'text' => '188:Field delimiter']
                ], 'input');
                $frm->field([
                    'id' => 'fieldencloser', 'type' => 'text', 'fieldclass' => 'col-sm-2', 'v-model' => 'ximport.fieldencloser',
                    'label' => ['labelclass' => '', 'text' => '189:Character'],
                    'help' => ['helpclass' => '', 'text' => '190:Field encloser character']
                ], 'input');
                $frm->field([
                    'id' => 'escapecharacter', 'type' => 'text', 'fieldclass' => 'col-sm-2', 'v-model' => 'ximport.escapecharacter',
                    'label' => ['labelclass' => '', 'text' => '191:Escape'],
                    'help' => ['helpclass' => '', 'text' => '192:Escape character']
                ], 'input');
                $frm->radiochkbox([
                	'v-model' => 'ximport.action[]',
                    'list' => [
                        // $val => $lbl
                        'ximport.testing' => '197:Testing',
                        'ximport.removeid' => '198:Remove the Id',
                        'ximport.mapfields' => '199:Map fields'
                    ],
                    'label' => ['labelclass' => '', 'text' => '195:Result']
                ], 'checkbox');

                $frm->buttons([
                    'label' => ['labelclass' => '', 'text' => ''],
                    'buttons' => [
                        'importdatabutton' => [
                            'text' => '15:Submit',
                            'class' => 'primary',
                            'icon' => 'paper-plane'
                        ],
                        'reset' => [
                            'text' => '17:Reset',
                            'class' => 'warning',
                            'icon' => 'undo-alt'
                        ],
                    ]
                ]);

				$html = H::div(['class' => 'row', 'id' => 'importdata'],
                	H::div(['class' => 'col-sm-6 pl-4'], $frm->renderForm(['id' => $tab['element']])),
                	H::div(['class' => 'col-sm-6 pl-4', 'id' => 'importresults'])
                );	

				return [
					'mdl' => ['ximport' => $tab],
					'html' => $html
				];

		    } catch (Exception $e) {
				return $e->getMessage();
		    }	
         }

        /** doImportData()
         *
         * @param - array - usual args
         * @return - JSON with success or failure message, or JSON with test data
         *
         **/
         function doImportData(array $args)
         {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            $idioms = $cfg['site']['idioms'];
	            $rq = $args['request'];

				$filename = "";	$res = []; $tbl = $args['table']; $testarray = []; $written = "";
				
				// Confirm upload of file and write to disk - solution is not right but it works
				if(isset($_FILES)) {
					$fn = $rq['inputfilename'];  
					$fn = str_replace('.','_',$fn);
					$filename = $_FILES[$fn]['name'];
					if(!move_uploaded_file($_FILES[$fn]['tmp_name'], "tmp/".$filename)) {
						$error = "File not moved and written";
						throw new Exception($error);
					}
				} else {
					$error = "No input file";
					throw new Exception($error);
				};

				// Read file
				$strarray = [];
			    if (($handle = fopen('tmp/'.$filename, 'r')) !== FALSE) {
			    	$header = fgetcsv($handle, 102400, $rq['fielddelimiter'], $rq['fieldencloser'], $rq['escapecharacter']);
			        while (($row = fgetcsv($handle, 102400, $rq['fielddelimiter'], $rq['fieldencloser'], $rq['escapecharacter'])) !== FALSE) {
			            if(!$header) {
			                $header = $row;
			            } else {
			                $strarray[] = array_combine($header, $row);
			            }
			        }
			        fclose($handle);
				} else {
					$error = "Could not open CSV file for reading";
					throw new Exception($error);
				};

				if(!is_array($strarray)) {
					$error = "Input file /tmp/".$filename." did not create usable array";
					throw new Exception($error);
				} 	

				// Get model record for defaults etc.
				$mdl = F::stdModel('importdata', '', '');
				$model = $mdl['importdata'][$tbl];
				if(!is_array($model)) {
					$error = "Fields Model for ".$tbl." not created";
					throw new Exception($error);
				}
				
				// Walk through the input array
				foreach($strarray as $q => $row) {

					switch($tbl) {
						case "dbuser":
							$ref = $row['c_username'];
							$flds = $model['dbuser'];
						break;

						// Room for more if needed

						default:
							$ref = $row['c_reference'];
							$type = $row['c_type'];
							$flds = $model[$type];
						break;
					}

					if(!$rq['removeid'] != 'false') {
						$recid = $row['id'];
					} else {
						$recid = 0;
					}

					// Load a table record - existing or new
					$udb = R::load($tbl, $recid);

					// Logically all the fields both physical (c_) and virtual (d_) should exist in the model, so that we have a type to go by
 
					$rqc = []; $rqd = []; $submit = []; $doc = []; $test = []; 
					foreach($row as $fld => $val) {
						$chk = strtolower(substr($fld, 0, 2));	
						switch($chk) {
							case "c_": $rqc[$fld] = $val; break;
							case "d_": $rqd[$fld] = $val; break;	
							default: break;	// throw away anything else
						}
					};

					// Send $vals for formatting
					foreach($rqc as $fldc => $valc) {
						if($this->cellFormat($fldc, $flds[$fldc], $valc) != false) {
							$submit[$fldc] =$this->cellFormat($fldc, $flds[$fldc], $valc);
						}
					}
				
					// Send $doc for formatting
					foreach($rqd as $fldd => $vald) {
						if($this->cellFormat($fldd, $flds[$fldd], $vald) != false) {
							$doc[$fldd] =$this->cellFormat($fldd, $flds[$fldd], $vald);
						}
					}
				
					// call up the existing record if it exists
					if($recid > 0) {
						$sql = "SELECT c_document FROM ".$tbl." WHERE id = ?";
						$existing = json_decode(R::getCell($sql, [$recid]), true);
						
						// Replace
						if(is_array($existing) && count($existing) > 0) {
							$doc = array_replace($existing, $doc);
						}
					}
	

					$submit['c_document'] = json_encode($doc);
					
					// Run through the array of records that will be written to the database									
					foreach($submit as $fld => $val) {
						$test[$fld] = $val;
						$udb->$fld = $val;
					}		
										
					// Save a new record to the database if a live import
					if($rq['testing'] != "false") {

						// R::debug(true);
						$result = R::store($udb);
						// R::debug(false);

						if(!is_numeric($result)) {
							throw new Exception("No result has been created!");
						} else {

							// If written successfully
							if(count($result) > 0) {
								$sql = "SELECT * FROM ".$tbl." WHERE id = ?";
								$res = R::getRow($sql, [$result]);	
							} else {
								$written = "Not Written";
							}								
			
						}			
						
					};

					$testarray[] = $test;		

					unset($rqc); unset($rqd); unset($submit); unset($doc); unset($test);

				} // Completes foreach loop			
				
				// Generate a Test or process result
				$array = array_slice($testarray, 0, 50);

				// Return to caller for display in "results" DIV
				return $this->api_exec([
					'data' => [
						'columns' => $header,
						'rows' => $array
					]
				]);

		    } catch (Exception $e) {
				return $e->getMessage();
		    }
         }

         protected function cellFormat(string $fld, string $type, $val) {

         	switch ($type) {

         		case "idiomtext":
         		case "selecttext":
         			return json_decode($val, true);
         		break;

         		case "image":
         			return $val;
         		break;

         		case "file":
         			return $val;
         		break;

         		case "date":
         			return Cliq::dbDate($val);
         		break;

         		case "datetime":
         			return Cliq::dbDateTime($val);
         		break;

         		case "text";
         		default:
         			return $val;
         		break;
         	}
         }

        /** exportData()
         * 
         * @param() - array - usual collection of arguments
         * @return - array - containing HTML with import form
         * */
         function exportData(array $tab, string $lcd) {

            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                
                $frm = new Qform($lcd);
                $frm->str(['text' => '181:Use this form to select data for export ... to file']);

                $frm->select([
                	 
                    'id' => 'tablename', 'v-model' => 'xport.tablename', 
                    'v-on:change' => 'setFileName($event, \'exportfilename\')',
                    'label' => ['labelclass' => '', 'text' => '163:Table'],
                    'help' => ['helpclass' => '', 'text' => '182:Select the table from the list'],
                    'listtype' => 'dynamic',
                    'list' => ['dbcollection', 'tables', ''],
                ]);
                $frm->select([
                    'id' => 'tabletypename', 'v-model' => 'xport.tabletypename',
                    'v-on:change' => 'setFileName($event, \'exportfilename\')',
                    'label' => ['labelclass' => '', 'text' => '183:Tabletypes'],
                    'help' => ['helpclass' => '', 'text' => '184:Select the tabletype from the list'],
                    'listtype' => 'dynamic',
                    'list' => ['dbcollection', 'tabletypes', ''],
                ]);
                $frm->field([
                    'id' => 'rowterminator', 'v-model' => 'xport.rowterminator', 'type' => 'text', 'required' => 'true', 'fieldclass' => 'col-sm-2',
                    'label' => ['labelclass' => '', 'text' => '185:Terminator'],
                    'help' => ['helpclass' => '', 'text' => '186:Row delimiter or termination character']
                ], 'input');
                $frm->field([
                    'id' => 'fielddelimiter', 'v-model' => 'xport.fielddelimiter', 'type' => 'text', 'required' => 'true', 'fieldclass' => 'col-sm-2',
                    'label' => ['labelclass' => '', 'text' => '187:Delimiter'],
                    'help' => ['helpclass' => '', 'text' => '188:Field delimiter']
                ], 'input');
                $frm->field([
                    'id' => 'fieldencloser', 'v-model' => 'xport.fieldencloser', 'type' => 'text', 'fieldclass' => 'col-sm-2',
                    'label' => ['labelclass' => '', 'text' => '189:Character'],
                    'help' => ['helpclass' => '', 'text' => '190:Field encloser character']
                ], 'input');
                $frm->field([
                    'id' => 'escapecharacter', 'v-model' => 'xport.escapecharacter', 'type' => 'text', 'fieldclass' => 'col-sm-2',
                    'label' => ['labelclass' => '', 'text' => '191:Escape'],
                    'help' => ['helpclass' => '', 'text' => '192:Escape character']
                ], 'input');
                $frm->field([
                    'required' => 'true',
                    'id' => 'exportfilename', 'v-model' => 'xport.exportfilename', 
                    'type' => 'text',
                    // sficon = ''
                    // pricon => ''
                    // action => ''
                    'label' => ['labelclass' => '', 'text' => '66:File'],
                    'help' => ['helpclass' => '', 'text' => '193:File name']
                ], 'input');                    
                $frm->radiochkbox([
                    'list' => [
                        // $val => $lbl
                        'xport.exportdata' => '194:Check to export file',
                    ],
                    'label' => ['labelclass' => '', 'text' => '195:Result']
                ], 'checkbox');
                $frm->buttons([
                    'label' => ['labelclass' => '', 'text' => ''],
                    'buttons' => [
                        'exportdatabutton' => [
                            'text' => '15:Submit',
                            'class' => 'primary',
                            'icon' => 'paper-plane'
                        ],
                        'reset' => [
                            'text' => '17:Reset',
                            'class' => 'warning',
                            'icon' => 'undo-alt'
                        ],
                    ]
                ]);

				$html = H::div(['class' => 'row', 'id' => 'exportdata'],
                	H::div(['class' => 'col-sm-5 pl-4'], $frm->renderForm(['id' => $tab['element']])),
                	H::div(['class' => 'col-sm-7 pl-4', 'id' => 'exportresults'])
                );	

				return [
					'mdl' => ['xport' => $tab],
					'html' => $html
				];

		    } catch (Exception $e) {
				return $e->getMessage();
		    }	
         }

        /** doExportData()
         *
         * @param - array - usual args
         * @return - JSON with success or failure message, or JSON with test data
         *
         **/
         function doExportData(array $args)
         {

		    $fr = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            $idioms = $cfg['site']['idioms'];
	            $rq = $args['request'];

				// Recordset
				$db = new Db();			
				$opts = [
					'table' => $args['table'],	// the table - dbcollection or dbitem etc
					'idiom' => $lcd 	// this language code or false = all language recs as an array		
				];
				array_key_exists('tabletype', $args) ? $opts['filter'] = ['c_type' => $args['tabletype']] : null ;
				array_key_exists('orderby', $rq) ? $opts['orderby'] = [$rq['orderby'], 'ASC'] : $opts['orderby'] = ['c_reference', 'ASC'];

	 			$res = $db->getRecords($opts);
				if($res['flag'] == 'NotOk') {
					throw new Exception('Database error: '.$res['msg']);
				}
				$rs = []; $rows = [];
				// Problem is, that $res[data] is not in the format suitable for the CSV
				$rs[0] = array_keys($res['data'][0]);
				$q = count($res['data']);
				for($r = 1; $r < $q; $r++) {	// maybe need to add -1 
					$rs[] = $res['data'][$r];
				}

				// Display or download
				if($rq['exportdata'] != 'false') {

					$fs = '/tmp/'.$rq['exportfilename'];
					Files::outputCsv($rs, $fs);

					return $this->api_exec([
						'data' => [
							'action' => 'download',
							'url' => $fs,
							'name' => $rq['exportfilename']
						]
					]);
				} else {
					// Convert to suitable display format, probably a table ....
					// Return to caller for display in "results" DIV
					return $this->api_exec([
						'data' => [
							'action' => 'test',
							'columns' => $rs[0],
							'rows' => $res['data']
						]
					]);
				}

		    } catch (Exception $e) {
				return $this->api_exec([
					'msg' => $e->getMessage()
				]);
		    }
         }

        /** dumpData()
         *
		 * @param - array - portion of Model
		 * @param - string - current language
		 * @return - array - two elements of HTML and Data 
         **/
         protected function dumpData(array $tab, string $lcd)
         {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

                $frm = new Qform($lcd);
                $frm->str(['text' => '211:Use this screen to specify ....']);
                $frm->radiochkbox([
                	'v-model' => 'dbdump.action[]',
                    'list' => [
                        // $val => $lbl
                        'dbdump.dbcollection' => '128:Collection',
                        'dbdump.dbitem' => '70:Item',
                        'dbdump.dbuser' => '91:Users',
                        'dbdump.dblog' => '107:Log file',
                        // 'dbdump.dbtransaction' => '',
                        // 'dbdump.dbcatalog' => '',  
                        // 'dbdump.dbcompany' => '',
                        // 'dbdump.dbcontact' => '', 
                        // 'dbdump.dbadvert' => '',
                        // 'dbdump.dbbanner' => '',                                   
                    ],
                    'label' => ['labelclass' => '', 'text' => '210:Dump data']
                ], 'checkbox');

                $frm->buttons([
                    'label' => ['labelclass' => '', 'text' => ''],
                    'buttons' => [
                        'dumpdatabutton' => [
                            'text' => '15:Submit',
                            'class' => 'primary',
                            'icon' => 'paper-plane'
                        ],
                        'reset' => [
                            'text' => '17:Reset',
                            'class' => 'warning',
                            'icon' => 'undo-alt'
                        ],
                    ]
                ]);

				$html = H::div(['class' => 'row', 'id' => 'dumpdata'],
                	H::div(['class' => 'col-sm-6 pl-4'], $frm->renderForm(['id' => $tab['element']])),
                	H::div(['class' => 'col-sm-6 pl-4', 'id' => 'dumpdata'])
                );	

				return [
					'mdl' => ['dbdump' => $tab],
					'html' => $html
				];

		    } catch (Exception $e) {
				return $e->getMessage();
		    }	
		 }

        /** doDumpData()
         *
         * @param - usual array of arguments
         * @return - array containing a success or failure message
         **/
         function doDumpData(array $args)
         {
		    $fr = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$rq = $args['request']; $msg = "";
				foreach($rq as $tbl => $dmp) {
					// Select only tables
					if(substr($tbl, 0, 2) == 'db') {
						if($dmp == 'true') {
							$sql = "SELECT * FROM ".$tbl;
							$rs = R::getAll($sql);
							$fp = "data/".$tbl.".dta";
							$result = Files::putArray($rs, $fp);
							if($result == 'Ok') {
								$msg .= $tbl." matched, ";
							} else {
								$msg .= $tbl." did not match, ";
							}
						}
					}
				}

				$result = trim($msg, ', ');
				
				return $this->api_exec([
					'msg' => Cliq::cStr('212:Dump data success message').' - '.$result
				]);

				// else - Cliq::cStr('213:Dump data failed');

		    } catch (Exception $e) {
				return $this->api_exec([
					'msg' => $e->getMessage()
				]);
		    }
		 }


		/** iframe() OK
		 * 
		 * @param - array - primarily the request
		 * @return - Ajax return
		 * */
		 function iframe($args)
		 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            $idioms = $cfg['site']['idioms'];
	            $rq = $args['request'];
	            $url = $rq['url'];
	            $label = $rq['label'];

				$mdl = F::stdModel('iframe', '', '');

				// Extend for each on language - breadcrumbs - text and buttons	- text	etc.
				$mdl['breadcrumbs']	= Cliq::extend($mdl['breadcrumbs']);
				$mdl['buttons']	= Cliq::extend($mdl['buttons']);
				$mdl['breadcrumbs']['collection']['text'] = $label;				

				// Set of tabs and panels
				$html = H::div(['class' => 'embed-responsive embed-responsive-4by3'],
					H::iframe([
						'src' => $url,
						'title' => $label,
						'frameborder' => 0,
						'id' => 'standard_iframe',
						'class' => 'embed-responsive-item'
					])
				);

				return $this->api_exec([
					'html' => $html,							// Html for component
					'component' => [
						'breadcrumbs' => $mdl['breadcrumbs'],
						'buttons' => $mdl['buttons'],
					],											// Current component structure
					'action' => 'iframe',						// Name of the component
				]);

		    } catch (Exception $e) {
				return $this->api_exec([
					'html' => $e->getMessage(),
					'action' => 'error',
				]);
		    }
		 }

		/** clearcache() OK
		 *
		 * @return - success or failure message
		 **/
		 function clearCache() 
		 {
		    $fp = FirePHP::getInstance(true);
		    try {
				
				$result = true;
				$dir = SITE_PATH."cache";
				foreach (glob_recursive($dir."/*.*") as $filename) {
				    if(is_file($filename) and $result = true) {
				       $result = unlink($filename); // returns true or false
				    } else {
				    	throw new \Exception('Cache file did not delete: '.$filename);
				    }
				};

				Log::wLog([
            		'table' => 'admin',
            		'type' => 'function',
            		'category'  => 'delete',
           			'text' => 'Cache deleted',
				]);

				return [
					'type' => 'json',
					'code' => 200,
					'body' => ['flag' => 'Ok', 'action' => 'clearcache', 'msg' => Cliq::cStr('139:Cache files deleted')],
					'encode' => true
				];

		    } catch(Exception $e) {
		    	return [
					'type' => 'json',
					'code' => 500,
					'body' => ['flag' => 'NotOk', 'action' => 'clearcache', 'msg' => $e->getMessage()],
					'encode' => true
				];
		    }		 	
		 }

		/** Delete all Log files OK
		 *
		 * @param - array - Variables from Construct
		 * @return - string - Message
		 **/	
		 function clearlogs($vars = [])
		 {
		    try {
		    	global $clq;
				$dir = $clq->get('basedir')."log";
				foreach (glob($dir."/*.*") as $filename) {
				    if (is_file($filename)) {
				        unlink($filename);
				    }
				};
				return ['content' => ['flag' => 'Ok', 'msg' => ''], 'callBack' => ''];
		    } catch(Exception $e) {
		    	return ['content' => ['flag' => 'NotOk', 'msg' => $e->getMessage()], 'callBack' => ''];
		    }		
		 }

		/** maintainIdiom() OK
		 * 
		 * @param - array - primarily the request
		 * @return - Ajax return
		 * */
		 function maintainIdiom(array $args)
		 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            $idioms = $cfg['site']['idioms'];

				$mdl = F::stdModel('maintainidiom', '', '');

				// Extend for each on language - breadcrumbs - text and buttons	- text	etc.
				$mdl['breadcrumbs']	= Cliq::extend($mdl['breadcrumbs']);
				$mdl['buttons']	= Cliq::extend($mdl['buttons']);
				$mdl['datagrid']['columns']	= Cliq::extend($mdl['datagrid']['columns'], 'title');

				// current idioms data retrieved from Config
                 $dtaidms = [];
                 foreach($idioms as $lcdcode => $lcdname) {
                    $idiom = [];
                    $idiom['code'] = $lcdcode;
                    $idiom['name'] = $lcdname;
                    $idiom['flag'] = $cfg['site']['idiomflags'][$lcdcode];
                    $dtaidms[] = $idiom; unset($idiom);
                 }

                // We can display this in a table to which we can add and delete
                 $toptable = H::table(['class' => 'table table condensed table-hover table-striped', ],
                    H::thead(['class' => ''],
                        H::tr(['class' => ''],
                            H::th(['class' => ''], Cliq::cStr('171:Code')),
                            H::th(['class' => ''], Cliq::cStr('167:Language name')),
                            H::th(['class' => ''], Cliq::cStr('117:Icon')),
                            H::th(['class' => ''], '*')
                        )
                    ),
                    H::tbody(['class' => ''],
                        H::tr(['class' => '', 'v-for' => '(idm, idx) in languages'],
                            H::td(['class' => ''], '{{idm.code}}'),
                            H::td(['class' => ''], '{{idm.name}}'),
                            H::td(['class' => ''], 
                                H::img(['style' => 'height: 20px;', 'v-bind:src' => '\'/public/flags/\'+idm.flag'])
                            ),
                            H::td(['class' => ''], 
                                H::a(['class' => 'btn btn-sm btn-danger', 'href' => '#', 'v-bind:data-lcdcode' => 'idm.code', 'v-on:click' => 'deleteIcon($event)'], H::i(['class' => 'fas fa-trash', 'v-bind:data-lcdcode' => 'idm.code']))
                            )
                        )
                    )    
                 );

                // Forms
                // New language form
                 $frm = new Qform($lcd);
                 $frm->field([
                    'id' => 'lcdcode', 'v-model' => 'newidiom.lcdcode', 'v-on:change' => 'setFlag()', 'type' => 'text', 'required' => 'true', 'fieldclass' => 'col-sm-2',
                    'label' => ['labelclass' => '', 'text' => '165:Language code'],
                    'help' => ['helpclass' => '', 'text' => '166:Please enter a 2 character language code']
                 ], 'input');

                 $frm->field([
                    'id' => 'lcdname', 'v-model' => 'newidiom.lcdname', 'type' => 'text', 'required' => 'true', 'fieldclass' => 'col-sm-7',
                    'label' => ['labelclass' => '', 'text' => '167:Language name'],
                    'help' => ['helpclass' => '', 'text' => '168:It is suggested that the language name .....']
                 ], 'input');

                 $frm->select([
                    'id' => 'lcdflag', 'v-model' => 'newidiom.lcdflag', 'required' => 'true', 'fieldclass' => 'col-sm-5', 
                    'listtype' => 'idiomflags', 'list' => '/public/flags/',
                    'label' => ['labelclass' => '', 'text' => '117:Icon'],
                    'help' => ['helpclass' => '', 'text' => '169:By default, flags are a series of PNG files']
                 ]);

                 $frm->buttons([
                    'label' => ['labelclass' => '', 'text' => ''],
                    'buttons' => [
                        'submitnewidiom' => [
                            'text' => '15:Submit',
                            'class' => 'primary',
                            'icon' => 'paper-plane'
                        ],
                        'reset' => [
                            'text' => '17:Reset',
                            'class' => 'warning',
                            'icon' => 'undo-alt'
                        ],
                    ]
                 ]);

                // Import / Export message boxes
                 $popfrm = new Qform($lcd);

                 $popfrm->file([
                    'id' => 'importidiom.inputfilename', 
                    'fieldclass' => 'col-sm-10',
                    'label' => ['labelclass' => '', 'text' => '66:File']
                 ], 'file'); 

                 $popfrm->field([
                    'id' => 'lcdcode', 'type' => 'text', 'v-model' => 'importidiom.lcdcode', 'fieldclass' => 'col-sm-2',
                    'max' => 2, 'min' => 2,
                    'label' => ['labelclass' => '', 'text' => '165:Language code'],
                 ], 'input');  

                 $popfrm->buttons([
                    'label' => ['labelclass' => '', 'text' => ''],
                    'buttons' => [
                        'importidiom' => [
                            'text' => '170:Import strings',
                            'class' => 'primary importbutton',
                            'icon' => 'upload'
                        ],
                        'reset' => [
                            'text' => '17:Reset',
                            'class' => 'warning',
                            'icon' => 'undo-alt'
                        ]
                    ]
                 ]);

                // Form accordion
                 $accordionform = H::div(['class' => 'accordion mr-3', 'id' => 'dataform'],
                 	
                 	// Repeat
                 	H::div(['class' => 'card'],
                 		// 
                 		H::div(['class' => 'card-header', 'id' => 'addFormHeader'],
                 			H::div(['class' => 'h2 mb-0'],
			                 	H::button(['class' => 'btn btn-link btn-block text-left', 'type' => 'button', 'data-toggle' => 'collapse', 'data-target' => '#addForm', 'aria-expanded' => false, 'aria-controls' => 'addForm'],
			                 		Cliq::cStr('164:Add language').H::i(['class' => 'fas fa-arrows-alt-v ml-2'])
			                 	)
                 			)
                 		),
                 		//
                 		H::div(['id' => 'addForm', 'class' => 'collapse', 'aria-labelledby' => 'addFormHeader', 'data-parent' => '#dataform'],
		                 	H::div(['class' => 'card-body'], $frm->renderForm(['id' => 'addform']))
                 		)
                 	), // Ends repeat

                 	// Repeat
                 	H::div(['class' => 'card'],
                 		// 
                 		H::div(['class' => 'card-header', 'id' => 'importFormHeader'],
                 			H::div(['class' => 'h2 mb-0'],
			                 	H::button(['class' => 'btn btn-link btn-block text-left', 'type' => 'button', 'data-toggle' => 'collapse', 'data-target' => '#importForm', 'aria-expanded' => false, 'aria-controls' => 'importForm'],
			                 		Cliq::cStr('175:Import language strings').H::i(['class' => 'fas fa-arrows-alt-v ml-2'])
			                 	)
                 			)
                 		),
                 		//
                 		H::div(['id' => 'importForm', 'class' => 'collapse', 'aria-labelledby' => 'importFormHeader', 'data-parent' => '#dataform'],
		                 	H::div(['class' => 'card-body'], $popfrm->renderForm(['id' => 'importform']))
                 		)
                 	) // Ends repeat



                 );
                
                // Check missing
                 $bottomtable = '<bootstrap-table v-bind:columns="columns" v-bind:data="data" v-bind:options="options" data-query-params="queryParams"></bootstrap-table>'; 

                // Make a page with two columns - left for the grid of existing languages and right for the forms in an accordion
                 $html = H::div(['class' => 'row', 'id' => 'datagrid'],
                	H::div(['class' => 'col-sm-5 pl-4'], 

                		// First row
                        H::div(['class' => 'row'],            		
                			H::p([], Cliq::cStr('173:Use this page to add or delete system languages'))
                		),

                		// Second row
                        H::div(['class' => 'row'],
                			H::div([], $toptable)
                		),

                		// Third row
                        H::div(['class' => 'row col-sm-10'],            		
                			H::p([], Cliq::cStr('178:Any individual language entries for any record ...'))
                		),

                		// Fourth row
                        H::div(['class' => 'row'],
                			H::div(['class' => 'visible', 'id' => 'checkmissing'], $bottomtable)	// toggle to visible
                		)
                	),
                	H::div(['class' => 'col-sm-7 p-2'], $accordionform), 
            	 );

                // All the data that is required by the page on startup
                 $data = [];
                 $data['idioms'] = $dtaidms;
                 $data['datagrid'] = $mdl['datagrid'];

				return $this->api_exec([
					'html' => $html,							// Html for component
					'component' => [
						'breadcrumbs' => $mdl['breadcrumbs'],
						'buttons' => $mdl['buttons'],
					],											// Current component structure
					'data' => $data,							// Data for the component
					'action' => 'maintainidiom',						// Name of the component
				]);

		    } catch (Exception $e) {
		    	$fp->fb($e->getMessage());
				return $this->api_exec([
					'html' => $e->getMessage(),
					'action' => 'error',
				]);
		    }
		 }

        /** addNewIdiom() OK 
         *
         * @param() - array - usual collection of arguments
         * @return - array - process new Idiom
         **/
         function addNewIdiom(array $args)
         {
		    $fr = FirePHP::getInstance(true);	
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                
                $cfg = F::get('cfg'); 
                $rq = $args['request'];

                // three form elements to make a new language entry
                 /*
                    'lcdcode': 'en',
                    'lcdname': 'English',
                    'lcdflag': 'en.png'   
                 */

                // In Site array are two entries: site.idioms and site.idiomflags
                $newidiom = [$rq['lcdcode'] => $rq['lcdname']];
                $cfg['site']['idioms'] = array_merge($cfg['site']['idioms'], $newidiom);
                $newflag = [$rq['lcdcode'] => $rq['lcdflag']];
                $cfg['site']['idiomflags'] = array_merge($cfg['site']['idiomflags'], $newflag);
                F::set('cfg', $cfg);

                // Array is updated, convert back to string
                $fp = '/config/config.cfg';

                // Array is updated, convert back to string
                $toml = TomlEncode::toml_encode($cfg);
                $flag = Files::writeFile($fp, $toml);

                if($flag == 'Ok') {
                    $msg = Cliq::cStr('81:Record updated successfully');
                } else {
                    $msg = Cliq::cStr('177:Error saving record');
                }

				return $this->api_exec([
					'flag' => $flag,
					'msg' => $msg
				]);

		    } catch (Exception $e) {
		    	$fr->fb($e->getMessage());
				return $this->api_exec([
					'flag' => 'NotOk',
					'msg' => $e->getMessage()
				]);
		    }
         }

        /** deleteIdiom() OK 
         *
         * @param() - array - usual collection of arguments
         * @return - array - delete unneeded Idiom
         **/
         function deleteIdiom(array $args)
         {
		    $fr = FirePHP::getInstance(true);	
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                
                $cfg = F::get('cfg'); 
                $rq = $args['request'];
                // element to delete entry = $rq['language'];

                // In Site array are two entries: site.idioms and site.idiomflags
                unset($cfg['site']['idioms'][$rq['language']]);
                unset($cfg['site']['idiomflags'][$rq['language']]);
                $fp = '/config/config.cfg';

                // Array is updated, convert back to string
                $toml = TomlEncode::toml_encode($cfg);
                $flag = Files::writeFile($fp, $toml);

                if($flag == 'Ok') {
                    // Do we want to remove the language records ?
                    // $this->docLang('delete', $rq['language']); 
                    $msg = Cliq::cStr('81:Record updated successfully');
                } else {
                    $msg = Cliq::cStr('177:Error saving record: '.$flag);
                }

				return $this->api_exec([
					'flag' => $flag,
					'msg' => $msg
				]);

		    } catch (Exception $e) {
		    	$fr->fb($e->getMessage());
				return $this->api_exec([
					'flag' => 'NotOk',
					'msg' => $e->getMessage()
				]);
		    }	
         }

        /** doImportIdiom()
         *
         * @param() - array - usual collection of arguments
         * @return - array - AJAS flag and message
         **/
         function doImportIdiom(array $args)
         {
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                
                // Set values and variables to be used
                 $cfg = F::get('cfg'); 
                 $this->idioms = $cfg['site']['idioms'];
                 $this->lcd = $args['idiom'];
                 $rq = $args['request'];
                 if( (!is_array($rq)) or (count($rq) < 1) ) {
                    throw new Exception("No request array");
                 }    
                 $rs = [];           
                 $this->displaytype = $rq['displaytype'];

                // This section deals with the uploaded file
                // it may become a separatemethod
                 if(isset($_FILES)) {

                    $file_name = $_FILES['inputfilename']['name'];
                    $file_size =$_FILES['inputfilename']['size'];
                    $file_tmp =$_FILES['inputfilename']['tmp_name'];
                    $file_type=$_FILES['inputfilename']['type'];
                    $file_ext = strtolower(end(explode('.', $file_name)));

                    $extensions = ["csv", "txt"];

                    if(in_array($file_ext, $extensions) === false) {
                        throw new Exception("Extension not allowed, must be CSV or TXT: ".$_FILES);
                    }

                    if($file_size > 2097152) {
                        throw new Exception("File must be less than 2mb");
                    }

                    // No errors generated so far
                    $success = move_uploaded_file($file_tmp, SITE_PATH."public/uploads/".$file_name);

                 } else {
                    throw new Exception('No $_FILES array');
                 }

                // File has been written to disk successfully, convert the CSV contents to an array
                 // "reference", "text", "title", "summary"
                 // "str(0)", "string", "", ""
                 $fpath = SITE_PATH."public/uploads/".$file_name;
                 ini_set('auto_detect_line_endings',TRUE);
                 $fp = fopen($fpath, 'r'); $i = 0;
                 while (($line = fgetcsv($fp, 0, $rq['fielddelimiter'], $rq['fieldencloser'], $rq['escapecharacter'])) !== false) 
                 {
                    if (empty($line)) {
                        continue;
                    }
                    mb_convert_variables('UTF-8', 'SJIS', $line);
                    if ($header == null) {
                        $rs[] = $line;
                    } elseif ($i === 0) {
                        $header = $line;
                    } else {
                        $rs[] = array_combine($header, $line);
                    }
                    ++$i;
                 }; fclose($fp);

                 if(count($header < 1)) {
                    $header = $rs[0];
                    unset($rs[0]);
                    $rs = array_values($rs);
                 }

                // $rs is our input array
                $data = [];
                for($r = 0; $r < count($rs); $r++) {
                    $row = [];
                    $row[$rs[$r][0]] = [
                        'd_text' => $rs[$r][1],
                        'd_title' => $rs[$r][2],
                        'd_summary' => $rs[$r][3],
                    ];
                    $data[] = $row; unset($row);
                }

                $result = $this->docLang('import',  $rq['lcdcode'], $data);

                return [
                    'flag' => $result['flag'],
                    'msg' => $result['msg']
                ];

            } catch (Exception $e) {
                $err = [
                    'error' => true,
                    'method' => $method,
                    'errmsg' => $e->getMessage()
                ];
                bdump($err); // log exception
                return $err;
            }  
         }	      
         
        /** doExportIdiom()
         *
         * @param() - array - usual collection of arguments
         * @return - array - Headers to force file download
         **/
         function doExportIdiom(array $args)
         {
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                
                $cfg = F::get('cfg'); $lcd = $args['idiom'];
                $idioms = $cfg['site']['idioms'];
                $rq = $args['request'];

                $result = $this->docLang('export', $lcd);
                // $result = ['flag'='', 'data' = array, msg' = '']
                if($result['flag'] == 'Ok') {

                    /*
                    // Data will be an array as below
                    [
                        'str(0)' => [
                            'c_common' => 'Login',
                            'd_text' => 'string',
                            'd_title' => 'string',
                            'd_summary' => ''
                        ],
                        'str(1)' => [
                            'c_common' => 'Username',
                            'd_text' => 'string',
                            'd_title' => 'string',
                            'd_summary' => ''
                        ]
                    ]
                    // and needs to look like below 

                    "reference", "common", text", "title", "summary"
                    "str(0)", "Login", "string", "", ""

                    // then be written to an ouput file
                    */
                    $data = $result['data'];
                    $inputstring = '"reference", "common", "text", "title", "summary";';
                    for($d = 0; $d < count($data); $d++) {
                        foreach($data[$d] as $ref => $vals) {
                            $inputstring .= '"'.$ref.'", "'.$vals['c_common'].'", "'.$vals['d_text'].'", "'.$vals['d_title'].'", "'.$vals['d_summary'].'"';
                        }
                    };

                    // Write inputstring to file
                    $fp = "idiom_export_".$lcd.".csv";
                    Files::writeFile($fp, $inputstring);
                    F::echoDownload($fp);

                } else {
                    return [
                        'flag' => $result['flag'],
                        'msg' => $result['msg']
                    ];
                }

            } catch (Exception $e) {
                $err = [
                    'error' => true,
                    'method' => $method,
                    'errmsg' => $e->getMessage()
                ];
                bdump($err); // log exception
                return $err;
            } 
         }

        /** docLang() - Add new language to most Document types or remove
         * Not called directly
         * @param() - string - action = export, import, delete
         * @param() - string - 2 character language code
         * 
         * @return - array with two entries - flag and message
         * */
         protected function docLang(string $action = 'export', string $lcdcode = 'en', array $data = []) 
         {
            try {
                // Possible docfields = d_title, d_text, d_summary,
                $docflds = ['d_text', 'd_title', 'd_summary'];
                // possible tables = dbcollection, dbitem - until dbcatalog is added and others
                $tables = ['dbcollection', 'dbitem'];

                $lastmod = Cliq::lastMod(); $whomod = Cliq::whoMod(); $res = 0; $data = [];

                foreach($tables as $t => $tbl) {
                    $sql = "SELECT id, c_reference, c_common, c_document FROM ".$tbl." ORDER BY id ASC";
                    $rs = R::getAll($sql);
                    for($r = 0; $r < count($rs); $r++) {
                        $json = $rs[$r]['c_document'];
                        $doc = json_decode($json, true);
                        $recid = $rs[$r]['id'];
                        $ref = $rs[$r]['c_reference'];
                        $updb = R::load($tbl, $recid);

                        foreach($docflds as $f => $fld) {
                            switch($action) {

                                case "import":
                                    // $data should consist of an array in the form
                                    /*
                                    [
                                        'str(0)' => [
                                            'd_text' => 'new string',
                                            'd_title' => 'newstring',
                                            'd_summary' => ''
                                        ],
                                        'str(1)' => [
                                            'd_text' => 'new string',
                                            'd_title' => 'newstring',
                                            'd_summary' => ''
                                        ]
                                    ]
                                    */
                                    $doc[$fld][$lcdcode] = $data[$ref][$fld];
                                break;                                

                                case "export":
                                    $data[$r][$ref][$fld] = $doc[$fld][$lcdcode];
                                break;

                                case "delete":
                                    unset($doc[$fld][$lcdcode]);
                                break; 
          
                            }                            
                        }
    
                        if($action !== 'export') {
                            $json = json_encode($doc);
                            $updb->c_document = $json;      
                            $updb->c_lastmodified = $lastmod;
                            $updb->c_whomodified = $whomod;
                            $res + R::store($updb);                            
                        }
                    }
                }

                if(is_numeric($res)) {
                    return [
                        'flag' => 'Ok',
                        'data' => $data,
                        'msg' => Cliq::cStr('370:Record updated successfully')
                    ];
                } else {
                    return [
                        'flag' => 'NotOk',
                        'msg' => Cliq::cStr('495:Record was not successfully written to database')
                    ];
                }

            } catch (Exception $e) {
                $err = [
                    'flag' => 'NotOk',
                    'msg' => $e->getMessage()
                ];
                return $err;
            }
         }

        /** checkMissing()
         *
         * @param() - array - usual collection of arguments
         * @return - array - Data to populate the CheckMissing table in maintainIdiom()
         **/
         function checkMissing(array $args)
         {
		    $fr = FirePHP::getInstance(true);	
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                
                $cfg = F::get('cfg'); 
                $rq = $args['request'];
                $idioms = $cfg['site']['idioms'];

                // Possible docfields = d_title, d_text, d_summary,
                $docflds = ['d_text', 'd_title', 'd_summary', 'd_common'];
                // possible tables = dbcollection, dbitem - until dbcatalog is added and others
                $tables = ['dbcollection', 'dbitem'];

                $res = 0; $data = [];
				$allflds = F::stdModel('fieldlist', '', '');

                $records = [];
                foreach($tables as $t => $tbl) {
                    $sql = "SELECT id, c_reference, c_type, c_document FROM ".$tbl." ORDER BY id ASC";
                    $rs = R::getAll($sql);

                    for($r = 0; $r < count($rs); $r++) {
                        $json = $rs[$r]['c_document'];
                        $doc = json_decode($json, true);
                        $row[$tbl][$r]['table'] = $tbl;
                        $row[$tbl][$r]['type'] = $rs[$r]['c_type'];                        
                        $row[$tbl][$r]['recid'] = $rs[$r]['id'];
                        $row[$tbl][$r]['reference'] = $rs[$r]['c_reference'];

                        // Is the field used in the model            
                        $useflds = $allflds[$tbl];
                        $type = $rs[$r]['c_type'];
                        $array = explode(',', $useflds[$type]);  
                        $checkrow = ""; 

                        foreach($docflds as $f => $fld) {
                            if(in_array($fld, $array) != false) {

								// Type 'list' is different layout
								if( ($type == 'list') and ($f == 'd_text') ) {
									foreach($fld as $key => $ar) {
	                                	foreach($idioms as $c => $n) {
		                                    if(!is_set($c, $ar[$fld])) {
		                                        $checkrow .= '['.$c.']';
		                                    }     
		                                }								
									}
								} else {
                                	foreach($idioms as $c => $n) {
	                                    if(!is_set($c, $doc[$fld])) {
	                                        $checkrow .= '['.$c.']';
	                                    }     
	                                }
								}

                            }
                        }

						$row[$tbl][$r]['checkrow'] = $checkrow;
                    }

                    if($checkrow != "") {
                        $fr->fb($checkrow);                    	
                    	$records = array_merge($records, $row[$tbl]);
                    }

                    unset($checkrow);
                }         

                if(count($records > 0)) {
					return $this->api_exec([
                        'rows' => $records,
                        'total' => count($records),
                        'totalNotFiltered' => count($records),
					]);          	

                } else {
					return $this->api_exec([
                        'flag' => 'NotOk',
                        'msg' => Cliq::cStr('176:No data available in table')
					]);
                }
    
		    } catch (Exception $e) {
				return $this->api_exec([
					'flag' => 'NotOk',
					'msg' => $e->getMessage()
				]);
		    }	
         }        		 
}
