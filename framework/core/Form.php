<?php
/**
 * Cliq Framework - Form - all the forms stuff
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

use \core\Html as H;
use \core\Db as Db;
use \core\Auth as Auth;
use \core\Engine as Cliq;
use \Framework as F;
use \Firephp;
use \R;

class Form extends \Framework {

	const THISCLASS = "Form";
	const CLIQDOC = "c_document";
	public $formhtml = "";
	public $formfields = "";
	public $fieldhtml = "";
	public $idioms = [];
	public $lcd = "";
	public $submit = [];
	public $doc = [];
	public $rcw = 'col-lg-8';
	public $lcw = 'col-lg-4';
	public $formtype = "window"; // inline, column, window, page

	function __construct() {
        parent::__construct();
    }
	function __destruct() {}

	/** Display and publish a form
	 * 
	 * winform() - generates an array containing form html, options and data to be rendered by Vue, all in a popup window
	 * inlineForm() - generates an array containing form html, options and data to be rendered by Vue, 
	 * columnForm() - tbd - planned to be as above to fit in a column next to a grid or table
	 * pageForm() - tbd - generates a form from a model which will display as a section
	 * postForm() - virtually all forms post through this fdrm processor
	 * ******************************************************************************************************************************************/

		// winForm()
		/**
		 * Form definition in a Window
		 * @param - array - primarily the request
		 * @return - Any HTML plus JSON to create a Datagrid
		 * */
		 function winForm($args)
		 {

			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$this->formtype = "window";
				$cfg = F::get('cfg'); $this->lcd = $args['idiom'];
	            $table = $args['table'];
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $this->idioms = $cfg['site']['idioms'];
	            $rq = $args['request'];
	            $recid = $rq['recid'];
	            $recid == 0 ? $action = 'add' : $action = 'edit' ;

				$mdl = $this->stdModel('form', $table, $tabletype);
				$this->rcw = $mdl['rightcolwidth'];
				$this->lcw = $mdl['leftcolwidth'];
				$fields = array_orderby($mdl['fields'], 'order', SORT_ASC);

				foreach($fields as $fldid => $props) {

					if( (array_key_exists('insertonly', $props)) and ($action == 'edit') ) {
						continue;
					} else {
						$props['id'] = $fldid;
						switch($props['type']) {

							case "input":
							case "textarea":
								$this->field($props, $props['type']);
							break;

							case "radio":
							case "checkbox":
								$this->radiochk($props, $props['type']);
							break;

							case "file":
							case "image":
								$this->file($props, $props['type']);
							break;

							default:
								$method = $props['type'];
								$this->$method($props);
							break;

						}						
					}
				}

				$this->buttons($mdl['buttons']);

				// model data will come from model for new record or existing record

				$arr = $this->readRow($args, $mdl);
				if($arr['flag'] == 'NotOk') {
					throw new \Exception('Reading a row generated an error: '.$arr['msg']);
				}

				$row = $arr['data'];

				// Check for any overrides - will happen with Calendar
				// Walk through all the values in $rq
				foreach($rq as $key => $value) {	
					$chk = strtolower(substr($key, 0, 2));	
					switch($chk) {
						case "c_": $row[$key] = $value; break;
						case "d_": $row[$key] = $value; break;	
						default: false; break;	// throws anything else in the REQUEST away
					}
				};	

				foreach($row as $fld => $val) {
					$row[$fld] = html_entity_decode($val);
				}

				$data = [
					'html' => $this->_renderForm(['id' => 'dataform', 'role' => 'form', 'class' => 'form', 'autocomplete' => 'off', 'title' => Cliq::cStr($mdl['title']), 'instructions' => Cliq::cStr($mdl['instructions'])]),
	                'model' => $row,
	                'options' => [ 'width' => $mdl['width'], 'height' => $mdl['height'] ]
				];

				return [
					'type' => 'json',
					'code' => 200,
					'body' => ['flag' => 'Ok', 'data' => $data],
					'encode' => true
				];

		    } catch (Exception $e) {
				return [
					'type' => 'json',
					'code' => 500,
					'body' => ['flag' => 'NotOk', 'msg' => $e->getMessage()],
					'encode' => true
				];
		    }
		 }

		// inlineForm()
		/**
		 * Form definition to be displayed, accordion like, below the list item
		 * @param - array - primarily the request
		 * @return - Any HTML plus JSON to create a Datagrid
		 * */
		 function inlineForm($args)
		 {

			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$this->formtype = "inline";
				$cfg = F::get('cfg'); $this->lcd = $args['idiom'];
	            $table = $args['table'];
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $this->idioms = $cfg['site']['idioms'];

				$mdl = $this->stdModel('form', $table, $tabletype);
				$this->rcw = "";
				$this->lcw = "";
				$fields = array_orderby($mdl['fields'], 'order', SORT_ASC);

				foreach($fields as $fldid => $props) {
					$props['id'] = $fldid;
					switch($props['type']) {

						case "input":
						case "textarea":
							$this->field($props, $props['type']);
						break;

						case "radio":
						case "checkbox":
							$this->radiochk($props, $props['type']);
						break;

						case "file":
						case "image":
							$this->file($props, $props['type']);
						break;

						default:
							$method = $props['type'];
							$this->$method($props);
						break;

					}
				}
				
				$this->buttons($mdl['buttons']);

				// model data will come from model for new record or existing record

				$arr = $this->readRow($args, $mdl);
				if($arr['flag'] == 'NotOk') {
					throw new \Exception('Reading a row generated an error: '.$arr['msg']);
				}

				$row = $arr['data'];

				$data = [
					'html' => $this->_renderForm(['id' => 'dataform', 'role' => 'form', 'class' => 'form-row form-inline', 'autocomplete' => 'off']),
	                'model' => $row
				];

				return [
					'type' => 'json',
					'code' => 200,
					'body' => ['flag' => 'Ok', 'data' => $data],
					'encode' => true
				];

		    } catch (Exception $e) {
				return [
					'type' => 'json',
					'code' => 500,
					'body' => ['flag' => 'NotOk', 'msg' => $e->getMessage()],
					'encode' => true
				];
		    }
		 }

		// columnForm()

		// pageForm()

		// Postform
		/** postForm() Ok 
		 *
		 * @param - array - arguments
		 * @param - array - to be converted to JSON
		 *
		 * tbd - add an Auth check
		 * tbd - add a PHP validation
		 **/
		 function postForm(array $args)
		 {
			$fp = FirePHP::getInstance(true);
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				$cfg = F::get('cfg'); 
				$this->idioms = $cfg['site']['idioms'];
				$this->lcd = $args['idiom'];
                $table = $args['table'];
                array_key_exists('tabletype', $args) ? $tabletype = $args['tabletype'] : $tabletype = "";
		    	$rq = $args['request'];
		    	$db = new Db();

				// Check we have valid Request array
				if( (!is_array($rq)) or (count($rq) < 1) ) {
					throw new \Exception("No request array");
				} 	

				// Setup variables	    	
		    	$displaytype = $rq['displaytype']; $recid = (int)$rq['id'];
				$rqc = []; $rqd = []; $submit = []; $test = []; $result = ''; $ref = '';	

				// Is it an Insert or an Update
				$action = "insert";
				if($recid > 0) { // Insert is already set
					$action = "update";
				};

				/*
				// Insert ACL here - is this User allowed to Create or Edit this record - see level
				if(!A::getAuth($this->action, $this->table, $this->tabletype, '')) {
					throw new Exception("Not authorised based on table > tabletype > fields");
				} 
				*/

				// Deal with a file import here
				// Under the new regime, using File Reader, the contents of a file is just ordinary data
				if(array_key_exists('d_file', $rq)) {
					// Then we have a file upload in the Request
					$filename = $rq['d_file'];
					$qrepl = [' ', '.'];
					$mapname = str_replace($qrepl, '_', $filename);
					$tmpname = $_FILES[$mapname]['tmp_name'];
					$uploaddir = 'public/uploads/';
					$fn = SITE_PATH.$uploaddir.$filename;
					if(!move_uploaded_file($tmpname, $fn)) {
					    throw new \Exception('File not written to disk: '.$fn);
					}					
				}

				// Walk through all the values in $rq
				foreach($rq as $key => $value) {	
					$chk = strtolower(substr($key, 0, 2));	
					switch($chk) {
						case "c_": $rqc[$key] = $value; break;
						case "d_": $rqd[$key] = $value; break;	
						default: false; break;	// throws anything else in the REQUEST away
					}
				};	

				// Get the Model
				$mdl = $this->stdModel('form', $table, $tabletype);

				if(!is_array($mdl)) {
					throw new \Exception("No model array returned based on table > tabletype > fields");
				} 

				// The fields in the request will not match the fields in the model because of multifield
				// For the purposes of writing to the database we need the request fields and not the model
				$fields = array_orderby($mdl['fields'], 'order', SORT_ASC);
				foreach($fields as $fld => $props) {
					if(array_key_exists('subids', $props)) {
						$subarray = explode(',', $props['subids']);
						$xarray = [];
						foreach($subarray as $n => $fid) {
							// This means the field has '$props'
							$xarray[$fid] = [
								'type' => 'input',
								'subtype' => 'text',
								'order' => 'zz'
							];
						}
						$fields = array_merge($fields, $xarray);
						unset($fields[$fld]);
					}
				}

				// We need to set a dbtype for each field
				
				foreach($fields as $fld => $props) {
					// Firstly we set dbtype the same as type
					if(array_key_exists('type', $props)) {
						$fields[$fld]['dbtype'] = $props['type'];

					// Some fields will need a dbtype different to type, example would be select
					// though to some extent we can expect most types such as select, radio and checkbox to be always string 
					// and this is the default in dbFormatByType
					} else if(array_key_exists('dbtype', $props)) {
						$fields[$fld]['dbtype'] = $props['dbtype'];

					// However, fields that we have added dynamicall in the last foreach will have to be set to string by default
					} else {
						$fields[$fld]['dbtype'] = 'string';
					}
				}

				// Prepare the data for writing
				// Send $vals for formatting
				foreach($rqc as $fldc => $valc) {
					if(array_key_exists($fldc, $fields)) {
						$props = $fields[$fldc];
						$data = [
							'fldid' => $fldc,
							'fldval' => $valc, 
							'props' => $props,
						];
						$submit[$fldc] = $db->_dbFormatByField($data);
					}
				}
				
				// Do we have a valid d_ array to save into c_document
				if(count($rqd) > 0) {
					
					// If action equals insert, all we need to is write d_values to c_document
					if($action == 'insert') {

						$doc = [];
						// Send $doc for formatting

						foreach($rqd as $fldd => $vald) {
							$isidm = explode('_', $fldd);
							if(count($isidm) == 3) {
								$fldname = $isidm[0].'_'.$isidm[1];
								$thislcd = $isidm[2];
								$props = $fields[$fldname];
								$data = [
									'fldid' => $fldname,
									'fldval' => $vald, 
									'props' => $props,
								];
								$doc[$fldname][$thislcd] = $db->_dbFormatByField($data);
							} else {
								$props = $fields[$fldd];
								$data = [
									'fldid' => $fldd,
									'fldval' => $vald, 
									'props' => $props,
								];
								$doc[$fldd] = $db->_dbFormatByField($data);
							}
						}

						$submit['c_document'] = json_encode($doc);						
					}

					if($action == 'update') {

						// call up the existing record if it exists
						$sql = "SELECT c_document FROM ".$table." WHERE id = ?";
						$cell = R::getCell($sql, [$recid]);
						$doc = json_decode($cell, true);

						if(!is_array($doc)) {
							throw new \Exception("The 'existing' array has not been created from c_document!");
						} 

						foreach($rqd as $fldd => $vald) {
							$isidm = explode('_', $fldd);
							if(count($isidm) == 3) {
								$fldname = $isidm[0].'_'.$isidm[1]; // d_text
								$thislcd = $isidm[2]; // _en
								$props = $fields[$fldname];
								$data = [
									'fldid' => $fldname,
									'fldval' => $vald, 
									'props' => $props,
								];
								$doc[$fldname][$thislcd] = $db->_dbFormatByField($data);
							} else {
								$props = $fields[$fldd];
								$data = [
									'fldid' => $fldd,
									'fldval' => $vald, 
									'props' => $props,
								];								
								$doc[$fldd] = $db->_dbFormatByField($data);
							}
						}				
						$submit['c_document'] = json_encode($doc);	
					}
				}

				// If it failed to produce a usable array of keys, exit here
				if(!is_array($submit)) {
					throw new \Exception("The values array has not been created!");
				} 

				$data = [
					'table' => $table,
					'tabletype' => $tabletype,
					'recid' => $recid,
					'values' => $submit,
					'displaytype' => $displaytype
				];

				$result = [
					'row' => $this->writeRow($data),
					'action' => $action,
					'msg' => Cliq::cStr('81:Record successfully updated')
				];
					            
				return [
					'type' => 'json',
					'code' => 200,
					'body' => ['flag' => 'Ok', 'data' => $result],
					'encode' => true
				];

		    } catch (\Exception $e) {
				return [
					'type' => 'json',
					'code' => 500,
					'body' => ['flag' => 'NotOk', 'msg' => $e->getMessage()],
					'encode' => true
				];
		    }
		 }

	/** Fields
	 * 
	 * hidden() - a hidden input field that occupies no space
	 * field() - any single input field that occupies a row includes all types of input and textarea
	 * file() - a file or image field involving upload
	 * select() - any dropdown select - dynamic or static
	 * radiochk() - radio or checkbox
	 * multifld() - tbd
	 * idiomtext() - tabbed textarea or input filed to handle small amounts of multi-lingual text
	 * buttons() - buttons in a button group
	 *
	 * 
	 * ******************************************************************************************************************************************/

		// hidden() Ok
		/** 
		 * Standard hidden field, no display considerations
		 * @param - array - properties of the form field
		 * */
		 function hidden(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

			 	$attributes = $this->_setAttributes($props);
			 	if(!is_array($attributes)) {
			 		throw new \Exception('Converting $props for '.$props['id'].' produced an error: '.$attributes);
			 	}
			 	$attributes['type'] = 'hidden';
			 	$html = H::input($attributes);
			 	$this->_setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }

		// field() Ok
		/** 
		 * Can handle any standard type of Form field including input (type text, email, url etc.) and textarea
		 * @param - string - the Html to be stored
		 * */
		 function field(array $props, $type = 'input')
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				// Modify field properties before setting them into attributes

			 	array_key_exists('fieldclass', $props) ? $props['class'] = 'form-control '. $props['fieldclass'] : $props['class'] = 'form-control' ; 

			 	$help = "";
			 	if(array_key_exists('help', $props)) {
			 		$props['aria-describedby'] = $props['id'].'_help';
			 		$help = $this->_setHelp($props);
			 	} 
			 	
			 	$attributes = $this->_setAttributes($props);
			 	array_key_exists('subtype', $props) ? $attributes['type'] = $props['subtype'] : null;
			 	array_key_exists('tags', $props) ? $attributes['data-role'] = "tagsinput" : null;
			 	if(!is_array($attributes)) {
			 		throw new \Exception('Converting $props for '.$props['id'].' produced an error: '.$attributes);
			 	}	

			 	$label = $this->_setLabel($props);

			 	// Setting up the interior of the field div 	
			 	if(array_key_exists('pricon', $props)) {
			 		$intfield = H::div(['class' => 'input-group'],
			 			H::div(['class' => 'input-group-prepend'],
			 				H::div(['class' => 'input-group-text'], H::i(['class' => 'pointer fas fa-'.$props['pricon'], 'v-on:click' => $props['action'].'($event)']))
			 			),
			 			H::$type($attributes).$help		 			
			 		);
			 	} else if (array_key_exists('sficon', $props)) {
			 		$intfield = H::div(['class' => 'input-group'],
			 			H::$type($attributes),
			 			H::div(['class' => 'input-group-append'],
			 				H::div(['class' => 'input-group-text'], H::i(['class' => 'pointer fas fa-'.$props['sficon'], 'v-on:click' => $props['action'].'($event)']))
			 			).$help
			 		);
			 	} else {
			 		$intfield = H::$type($attributes).$help;
			 	}

			 	if($this->formtype == "window") {
			 		$field = H::div(['class' => $this->rcw], $intfield);
					$html = H::div(['class' => 'form-group row'], $label.$field);
				 	$this->_setFields($html);
				 	return true;			 		
			 	} elseif($this->formtype == "inline") {
					$html = H::div(['class' => 'form-group col-sm-4'], $label.$intfield);
				 	$this->_setFields($html);
				 	return true;
			 	}
	

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }

		// select() Ok
		/** 
		 * Handles a select with either a dynamic or static list
		 * @param - string - the Html to be stored
		 * */
		 function select(array $props)
		 {
			
			$fp = FirePHP::getInstance(true);
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				// Modify field properties before setting them into attributes

			 	array_key_exists('fieldclass', $props) ? $props['class'] = 'form-control '. $props['fieldclass'] : $props['class'] = 'form-control' ; 

			 	$help = "";
			 	if(array_key_exists('help', $props)) {
			 		$props['aria-describedby'] = $props['id'].'_help';
			 		$help = $this->_setHelp($props);
			 	} 
			 	
			 	$attributes = $this->_setAttributes($props);
			 	if(!is_array($attributes)) {
			 		throw new \Exception('Converting $props for '.$props['id'].' produced an error: '.$attributes);
			 	}	

			 	$label = $this->_setLabel($props);

			 	// Options
			 	$options = "";
			 	if($props['listtype'] == 'static') {

			 		// $props['list'] will be a string in the format admin|27:Admin, operator|38:Operator, ........
			 		$listarray = Cliq::strToArray($props['list']);
			 		foreach($listarray as $val => $lbl) {
			 			$options .= H::option(['value' => $val], Cliq::cStr($lbl));
			 		}

			 	} else if($props['listtype'] == 'staticnotrans') {
			 		// $props['list'] will be a string with label already transalated in the format admin|Admin, operator|Operator, ........ 
			 		$listarray = Cliq::strToArray($props['list']);
			 		foreach($listarray as $val => $lbl) {
			 			$options .= H::option(['value' => $val], $lbl);
			 		}		

			 	} else if($props['listtype'] == 'staticwithimages') {
			 		// $props['list'] will be a string with label already transalated in the format admin|Admin, operator|Operator, ........ 
			 		$listarray = Cliq::strToArray($props['list']);
			 		foreach($listarray as $val => $lbl) {	
			 			$src = $props['subdir'].$val.'.'.$props['extn'];
			 			$img = H::img(['src' => $src, 'class' => '', 'style' => '']).'&nbsp;'.$lbl;
			 			$options .= H::option(['value' => $val], H::span($img));
			 		}		 		

			 	} else if($props['listtype'] == 'dynamic') {

			 		// $props['list'] will be an array in the form ['dbcollection', 'listname']
			 		$opts = Cliq::dList($props['list'][0], $props['list'][1], $this->lcd); 
			 		foreach($opts as $val => $lbl) {
			 			$options .= H::option(['value' => $val], $lbl);
			 		}

			 	} else {
			 		$options = H::option(['value' => 'notused'], Cliq::cStr('144:No records available'));
			 	}

			 	// Setting up the interior of the field div 	
			 	$intfield = H::select($attributes, $options);	 	

			 	if($this->formtype == "window") {
			 		$field = H::div(['class' => $this->rcw], $intfield);
					$html = H::div(['class' => 'form-group row'], $label.$field);
				 	$this->_setFields($html);
				 	return true;			 		
			 	} elseif($this->formtype == "inline") {
					$html = H::div(['class' => 'form-group col-sm-4'], $label.$intfield);
				 	$this->_setFields($html);
				 	return true;
			 	}

		    } catch (Exception $e) {
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }		 

		// radiochkbox() Ok
		/** 
		 * Handles a checkbox group
		 * @param - string - the Html to be stored
		 * */
		 function radiochkbox(array $props, $type = 'checkbox')
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				// Modify field properties before setting them into attributes

			 	array_key_exists('fieldclass', $props) ? $props['class'] = 'form-control '. $props['fieldclass'] : $props['class'] = 'form-control' ; 

			 	$help = "";
			 	if(array_key_exists('help', $props)) {
			 		$props['aria-describedby'] = $props['id'].'_help';
			 		$help = $this->_setHelp($props);
			 	} 
			 	
			 	$attributes = $this->_setAttributes($props);
			 	if(!is_array($attributes)) {
			 		throw new \Exception('Converting $props for '.$props['id'].' produced an error: '.$attributes);
			 	}	

			 	$label = $this->_setLabel($props);

			 	if(array_key_exists('fieldlabelclass', $props)) {
			 		$lblclass = $props['fieldlabelclass'];
			 	} else {
			 		$lblclass = 'form-check-label';
			 	}	

				// Input
				$checkboxes = "";
		 		foreach($props['list'] as $val => $lbl) {
		 			if($type == 'checkbox') {
			 			$checkboxes .= H::div(['class' => 'form-check p-1'],
			 				H::input(['class' => 'form-check-input css-checkbox', 'type' => 'checkbox', 'v-model' => $val, 'id' => $val]),
			 				H::label(['class' => 'form-check-label css-label', 'for' => $val], Cliq::cStr($lbl))
			 			);
				 	} else { // Radiogroup
			 			$checkboxes .= H::div(['class' => 'form-check p-1 ml-1'], // form-check-input
			 				H::input(['class' => 'magic-radio', 'type' => 'radio', 'v-model' => $props['id'], 'value' => $val, 'id' => $val]),
			 				H::label(['class' => $lblclass, 'for' => $val], Cliq::cStr($lbl))
			 			);
				 	}
			 	}

			 	// Setting up the interior of the field div 	
			 	if($this->formtype == "window") {
			 		$intfield = H::div(['class' => 'col-sm-9'], $checkboxes);
			 		$field = H::div(['class' => $this->rcw], $intfield);
					$html = H::div(['class' => 'form-group row'], $label.$field);
				 	$this->_setFields($html);
				 	return true;			 		
			 	} elseif($this->formtype == "inline") {
					$html = H::div(['class' => 'form-group col-sm-4'], $label.$checkboxes);
				 	$this->_setFields($html);
				 	return true;
			 	}

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }

		// idiomtext() Ok
		/** 
		 * Handles a multi-lingual text input or textarea
		 * @param - string - the Html to be stored
		 * */
		 function idiomtext(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				// Modify field properties before setting them into attributes
			 	array_key_exists('fieldclass', $props) ? $props['class'] = 'form-control '. $props['fieldclass'] : $props['class'] = 'form-control' ; 

			 	$help = "";
			 	if(array_key_exists('help', $props)) {
			 		$props['aria-describedby'] = $props['id'].'_help';
			 		$help = $this->_setHelp($props);
			 	} 

			 	$label = $this->_setLabel($props);

			 	// Setting up the interior of the field div 

	           	// Language tabs
	           	// href must point to outer div of text input or textarea with language added
	           	$tabs = ""; $idmcode = []; $did = $props['id'];
				foreach($this->idioms as $lcdcode => $lcdname) {
					if($lcdcode == $this->lcd) {
						$c = ' active';
						$a = 'true';
					} else {
						$c = '';
						$a = 'false';
					}
					$tabs .= H::li(['class' => 'nav-item'],
						H::a(['class' => 'nav-link'.$c, 'data-target' => '#'.$did.'_div_'.$lcdcode, 'data-toggle' => 'tab', 'role' => 'tab', 'aria-selected' => $a, 'href' => '#'.$did.'_div_'.$lcdcode], $lcdname)
					);
					$idmcode[] = $lcdcode; unset($c); unset($a);
				};

				// Add translate icon
	           	if($props['class'] !== 'form-control tiny') {
	           		$tabs .= H::i(['class' => 'fa fa-lg fa-language pointer translatebutton float-right ml-2 mt-2', 'data-id' => $did, 'data-idioms' => implode('|', $idmcode)]);
	           	};

	           	$content = ""; $w = '100%';           	

				foreach($this->idioms as $lcdcode => $lcdname) {
					
					$attrs['v-model'] = $did.'_'.$lcdcode;
					$attrs['id'] = $did.'_'.$lcdcode;
					if($lcdcode == $this->lcd) {
						$c = ' show active';
					} else {
						$c = '';
					}	

					// Textarea
					if($props['subtype'] == 'textarea') {
						$attrs['style'] = 'width:100%; border:0; padding: 0 10px; border-left: 1px solid #e9ecef; border-right: 1px solid #e9ecef; ';
						$attrs['class'] = $props['fieldclass'];
						$attrs['rows'] = $props['rows'];
						$pane = H::textarea($attrs);

					// Ordinary input field
					} elseif($props['subtype'] == 'text') { // Text
						$attrs['style'] = 'width:100%;';
						$attrs['class'] = $props['class'];
						$pane = H::input($attrs);

					// Something more standard but still idiomtext
					} else {
						// temporary
						$pane = H::input($attrs);
					};	

					// Content div
					$content .= H::div(
						['class' => 'tab-pane form-inline '.$c, 'id' => $did.'_div_'.$lcdcode, 'role' => 'tabpanel', 'style' => 'border:0; padding:0; background: #E0E0E0;'], $pane
					);
					unset($c);
				};      	

           		$intfield = H::div(['class' => ''], 
					// Tab header - language
					H::ul(['class' => 'nav nav-tabs tabssm', 'id' => $did, 'role' => 'tablist'], $tabs),
					// Tab content - language
					H::div(['class' => 'tab-content', 'id' => 'tabbedcontent'], $content)
           		);

			 	if($this->formtype == "window") {
			 		$field = H::div(['class' => $this->rcw], $intfield);
					$html = H::div(['class' => 'form-group row'], $label.$field);
				 	$this->_setFields($html);
				 	return true;			 		
			 	} elseif($this->formtype == "inline") {
					$html = H::div(['class' => 'form-group col-sm-4'], $label.$intfield);
				 	$this->_setFields($html);
				 	return true;
			 	}

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }							

		// file() Ok
		/** 
		 * Designed to upload a file
		 * @param - string - the Html to be stored
		 * */
		 function file(array $props, string $type)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				// Modify field properties before setting them into attributes

			 	$help = "";
			 	if(array_key_exists('help', $props)) {
			 		$props['aria-describedby'] = $props['id'].'_help';
			 		$help = $this->_setHelp($props);
			 	} 
			 	
			 	$attributes = $this->_setAttributes($props);
			 	if(!is_array($attributes)) {
			 		throw new \Exception('Converting $props for '.$props['id'].' produced an error: '.$attributes);
			 	}	

			 	$label = $this->_setLabel($props);

			 	// Setting up the interior of the field div 	
			 	$intfield = H::$type($attributes).$help;

			 	$id = $props['id'];
	
			 	// Image or File field
			 	if($type == 'image') {

           			$fld = H::div(['class' => ''],
           				H::div(['v-if' => '!'.$id],
           					H::input(['type' => 'file', 'class' => 'form-control', 'data-fldid' => $id, 'v-on:change' => 'onImageChange'])
           				),
           				H::div(['v-else' => ''],
           					H::img([':src' => $id, 'class' => $props['imgclass']]),
           					H::button(['type' => 'button', 'class' => 'btn btn-sm btn-danger text-right', 'v-on:click' => 'removeImage', 'data-fldid' => $id], Cliq::cStr('37:Remove image'))
           				)
           			);

			 	} else { // File
           			
           			$fld = H::div(['class' => 'input-group'],

           				H::div(['class' => 'input-group-prepend'],
           					H::div(['class' => 'input-group-text'],
           						H::i(['class' => 'fas fa-trash pointer text-danger', 'title' => Cliq::cStr('38:Remove the file'), 'v-on:click' => 'removeFile', 'data-fldid' => $id]),
           						H::i(['class' => 'ml-1 fas fa-upload pointer text-warning', 'title' => Cliq::cStr('39:Please select file'), 'v-on:click' => 'removeFile', 'data-fldid' => $id])
           					)
           				),      				

           				H::input(['v-if' => '!'.$id, 'type' => 'file', 'class' => 'form-control form-control-file', 'data-fldid' => $id, 'v-on:change' => 'onFileChange']),

           				H::input(['v-else' => '', 'v-bind:value' => $id.'.name', 'class' => 'form-control form-control-file filefield', 'data-fldid' => $id, 'readonly' => true])
         				
           			);
			 	} 	

				// Input - including before and after icons
			 	$intfield = H::div(['class' => 'ml-2'], $fld);

			 	if($this->formtype == "window") {
			 		$field = H::div(['class' => $this->rcw], $intfield);
					$html = H::div(['class' => 'form-group row'], $label.$field);
				 	$this->_setFields($html);
				 	return true;			 		
			 	} elseif($this->formtype == "inline") {
					$html = H::div(['class' => 'form-group col-sm-4'], $label.$intfield);
				 	$this->_setFields($html);
				 	return true;
			 	}

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }






		 }	 

		// multifield() Ok
		/** 
		 * A series of fields, usually horizontal and inline
		 * currently supports HTML5 inputs, textarea, selects and button
		 * @return - string - the Html to be stored
		 * */
		 function multifield(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				foreach($props as $f => $fld) {

					switch($fld['type']) {

						case "input":
							$field = H::input([
								'type' => $fld['subtype'],
								'class' => 'form-control '.$fld['fldclass'],
								'v-model' => $fld['v-model']
							]);
						break;

						case "select":

							$options = H::option(['value' => ''], Cliq::cStr('164:Select an option'));

							switch($props['subtype']) {

								case "static":
							 		foreach($fld['list'] as $val => $lbl) {
							 			$options .= H::option(['value' => $val], Cliq::cStr($lbl));
							 		}
								break;

								case "staticnotrans":
							 		foreach($fld['list'] as $val => $lbl) {
							 			$options .= H::option(['value' => $val], $lbl);
							 		}	
								break;

								case "dynamic":
							 		$opts = Cliq::dList($fld['list'][0], $fld['list'][1], $this->lcd); 
							 		foreach($opts as $val => $lbl) {
							 			$options .= H::option(['value' => $val], $lbl);
							 		}
								break;
							}

							$field = H::select([
								'class' => 'form-control '.$fld['fldclass'],
								'v-model' => $fld['v-model']
							], $options);
						break;

						case "textarea":
							$field = H::textarea([
								'class' => 'form-control '.$fld['fldclass'],
								'v-model' => $fld['v-model']
							]);
						break;

						case "button":
							$field = H::button([
								'class' => 'btn btn-sm btn-danger '.$fld['fldclass'],
							], H::i(['class' => 'fas fa-'.$fld['icon']]));
						break;
					}

					$intfield .= H::div(['class' => 'form-group '.$fld['class']], H::label(['for' => $f], Cliq::cStr($fld['label'])).$field);
				}

			 	$label = $this->_setLabel($props);

			 	if($this->formtype == "window") {
			 		$field = H::div(['class' => $this->rcw], $intfield);
					$html = H::div(['class' => 'form-group row'], $label.$field);
				 	$this->_setFields($html);
				 	return true;			 		
			 	} elseif($this->formtype == "inline") {
					$html = H::div(['class' => 'form-group'], $label.$intfield);
				 	$this->_setFields($html);
				 	return true;
			 	}

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }				

		// slider()

		// boolean()

		// daterange() - from - to

		// jsoneditor()
		/** 
		 * 
		 * @param - string - the Html to be stored
		 **/
		 function jsoneditor(array $props)
		 {

			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

			 	$label = $this->_setLabel($props);

			 	// Setting up the interior of the field div 	
			 	$intfield = H::div(['class' => 'ml-1', 'data-type' => 'jsoneditor', 'id' => $props['id']]);

			 	$field = H::div(['class' => $this->rcw], $intfield);
				$html = H::div(['class' => 'form-group row'], $label.$field);
			 	$this->_setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }

		// codeeditor() - textarea with Ace
		/** 
		 * 
		 * @param - string - the Html to be stored
		 **/
		 function codeeditor(array $props)
		 {

			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

			 	$label = $this->_setLabel($props);

			 	// Setting up the interior of the field div 	
			 	$intfield = H::div(['class' => 'ml-1', 'data-type' => 'codeeditor', 'id' => $props['id']]);

			 	$field = H::div(['class' => $this->rcw], $intfield);
				$html = H::div(['class' => 'form-group row'], $label.$field);
			 	$this->_setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }

		// level()

		// fullname()
		/** 
		 * 
		 * @param - string - the Html to be stored
		 **/
		 function fullname(array $props)
		 {

			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

			 	$label = $this->_setLabel($props);

			 	$rq = H::span(['class' => 'ml-1 bold text-large text-danger'], '*');

			 	$titles = H::option(['value' => ''], Cliq::cStr('48:Please select'));
			 	$salutations = Cliq::fList('dbcollection', 'salutations');
			 	foreach($salutations as $val => $lbl) {
			 		$titles .= H::option(['value' => $val], $lbl);
			 	}

			 	$idx = explode(',', $props['subids']);

			 	// Setting up the interior of the field div 	
			 	$intfield = H::div(

			 		// First row - d_title, d_firstname

				 	H::div(['class' => 'form-row'],
				 		H::div(['class' => 'form-group col-md-5'],
				 			H::label(['class' => '', 'for' => $idx[0]], Cliq::cStr('49:Title')),
				 			H::select(['class' => 'form-control', 'id'  => $idx[0], 'v-model' => $idx[0]], $titles)
				 		),		 		
				 		H::div(['class' => 'form-group col-md-7'],
				 			H::label(['class' => '', 'for' => $idx[1]], Cliq::cStr('32:Christian name').$rq),
				 			H::input(['type' => 'text', 'class' => 'form-control', 'id'  => $idx[1], 'v-model' => $idx[1], 'required' => 'required'])
				 		)
				 	),

				 	// Second row - d_midname, d_lastname
				 	H::div(['class' => 'form-row'],
				 		H::div(['class' => 'form-group col-md-7'],
				 			H::label(['class' => '', 'for' => $idx[2]], Cliq::cStr('33:Middle name')),
				 			H::input(['type' => 'text', 'class' => 'form-control', 'id'  => $idx[2], 'v-model' => $idx[2]])
				 		),
				 		H::div(['class' => 'form-group col-md-5'],
				 			H::label(['class' => '', 'for' => $idx[3]], Cliq::cStr('34:Last name').$rq),
				 			H::input(['type' => 'text', 'class' => 'form-control', 'id'  => $idx[3], 'v-model' => $idx[3], 'required' => 'required'])
				 		)
				 	),
				);

			 	$field = H::div(['class' => $this->rcw], $intfield);
				$html = H::div(['class' => 'form-group row'], $label.$field);
			 	$this->_setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }

		// fulladdress()
		/** 
		 * Full or complete address
		 * @param - string - the Html to be stored
		 **/
		 function fulladdress(array $props)
		 {

			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

			 	$label = $this->_setLabel($props);

			 	$rq = H::span(['class' => 'ml-1 bold text-large text-danger'], '*');

			 	$regions = H::option(['value' => ''], Cliq::cStr('48:Please select'));
			 	$countries = H::option(['value' => ''], Cliq::cStr('48:Please select'));

			 	$idx = explode(',', $props['subids']);

			 	// Setting up the interior of the field div 	
			 	$intfield = H::div(

			 		// First Row - d_addr1 and d_addr2
			 		H::div(['class' => 'form-row'],
				 		H::div(['class' => 'form-group col-md-6'],
				 			H::label(['class' => '', 'for' => $idx[0]], Cliq::cStr('41:Line 1').$rq),
				 			H::input(['type' => 'text', 'class' => 'form-control', 'v-model' => $idx[0], 'id' => $idx[0] ])
				 		),
				 		H::div(['class' => 'form-group col-md-6'],
				 			H::label(['class' => '', 'for' => $idx[1]], Cliq::cStr('42:Line 2')),
				 			H::input(['type' => 'text', 'class' => 'form-control', 'v-model' => $idx[1], 'id' => $idx[1] ])
				 		)
				 	),

			 		// Second Row - d_subburb and d_city
			 		H::div(['class' => 'form-row'],
				 		H::div(['class' => 'form-group col-md-6'],
				 			H::label(['class' => '', 'for' => $idx[2]], Cliq::cStr('43:Suburb')),
				 			// Autocomplete ???
				 			H::input(['type' => 'text', 'class' => 'form-control', 'v-model' => $idx[2], 'id' => $idx[2] ])
				 		),
				 		H::div(['class' => 'form-group col-md-6'],
				 			H::label(['class' => '', 'for' => $idx[3]], Cliq::cStr('44:Town/City').$rq),
				 			H::input(['type' => 'text', 'class' => 'form-control', 'v-model' => $idx[3], 'id' => $idx[3] ])
				 		)
				 	),

			 		// Auto complete on town could provide lists for the last two/three
			 		// Third row - d_postcode, d_region
			 		H::div(['class' => 'form-row'],
				 		H::div(['class' => 'form-group col-md-4'],
				 			H::label(['class' => '', 'for' => $idx[4]], Cliq::cStr('45:Post code').$rq),
				 			H::input(['type' => 'text', 'class' => 'form-control', 'v-model' => $idx[4], 'id' => $idx[4]])
				 		),
				 		H::div(['class' => 'form-group col-md-6'],
				 			H::label(['class' => '', 'for' => $idx[5]], Cliq::cStr('46:County')),
				 			H::select(['class' => 'form-control', 'v-model' => $idx[5], 'id' => $idx[5]],
				 				$regions
				 			)
				 		)
				 	),

			 		// Fourth row - d_country
			 		H::div(['class' => 'form-row'],
				 		H::div(['class' => 'form-group col-md-6'],
				 			H::label(['class' => '', 'for' => $idx[6]], Cliq::cStr('47:Country')),
				 			H::select(['class' => 'form-control', 'v-model' => $idx[6], 'id' => $idx[6]],
				 				$countries
				 			)
				 		)
				 	)
			 	);

			 	$field = H::div(['class' => $this->rcw], $intfield);
				$html = H::div(['class' => 'form-group row'], $label.$field);
			 	$this->_setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }

		// identity()
		/** 
		 * 
		 * @param - string - the Html to be stored
		 **/
		 function identity(array $props)
		 {

			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

			 	$label = $this->_setLabel($props);

			 	$idx = explode(',', $props['subids']);
			 	$opts = explode(',', $props['options']);
			 	$options = "";
			 	foreach($opts as $n => $opt) {
			 		$options .= H::option(['value' => strtolower($opt)], $opt);
			 	}

			 	// Setting up the interior of the field div 	
			 	$intfield = H::div(['class' => 'form-row'],
			 		H::div(['class' => 'form-group col-md-6'],
			 			H::label(['class' => '', 'for' => $idx[0]], Cliq::cStr('36:Document number')),
			 			H::input(['type' => 'text', 'class' => 'form-control', 'v-model' => $idx[0], 'id' => $idx[0] ])
			 		),
			 		H::div(['class' => 'form-group col-md-4'],
			 			H::label(['class' => '', 'for' => $idx[1]], Cliq::cStr('2:Type')),
			 			H::select(['class' => 'form-control', 'v-model' => $idx[1], 'id' => $idx[1] ], $options)
			 		)
			 	);

			 	$field = H::div(['class' => $this->rcw], $intfield);
				$html = H::div(['class' => 'form-group row'], $label.$field);
			 	$this->_setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }

		// daterange()

		// level()

		// password()
		/** 
		 * Password with confirm 
		 * @param - string - the Html to be stored
		 **/
		 function password(array $props)
		 {

			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

			 	$label = $this->_setLabel($props);

			 	// Setting up the interior of the field div 	
			 	$intfield = H::div(['class' => 'form-row'],
			 		H::div(['class' => 'form-group col-md-6'],
			 			H::label(['class' => '', 'for' => $props['id'].'_confirm'], Cliq::cStr('2:Password')),
			 			H::input(['type' => 'password', 'class' => 'form-control', 'id' => $props['id'].'_confirm', 'required' => 'true', 'minlength' => 8, 'maxlength' => 12, 'value' => '********'])
			 		),
			 		H::div(['class' => 'form-group col-md-6'],
			 			H::label(['class' => '', 'for' => $props['id']], Cliq::cStr('31:Confirm password')),
			 			H::input(['type' => 'password', 'data-hook' => 'confirmpassword', 'class' => 'form-control', 'v-model' => $props['id'], 'id' => $props['id'], 'required' => 'true' ])
			 		)
			 	);

			 	$field = H::div(['class' => $this->rcw], $intfield);
				$html = H::div(['class' => 'form-group row'], $label.$field);
			 	$this->_setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }

		// fieldset - group

		// buttons() Ok
		/** buttons()
		 * Handles a button group
		 * @param - string - the Html to be stored
		 * */
		 function buttons(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				// Label
				$label = $this->_setLabel([
					'id' => "buttongroup",
					'label' => ''
				]);

				// Buttons
				$buttons = ""; // v-on:click.once
				foreach($props as $action => $btn) {	// Where $btn is an array
					$buttons .= H::a(['class' => 'btn pointer pt-2 pb-2 btn-sm ml-1 btn-'.$btn['class'], 'href' => '#', 'data-action' => $action, 'v-on:click' => 'clickButton($event)'], 
						H::i(['class' => 'fas fa-fw fa-'.$btn['icon']])
						.Cliq::cStr($btn['text'])
					);
				}

			 	if($this->formtype == "window") {
					$html = H::div(['class' => 'form-group row'], $label.$buttons);
				 	$this->_setFields($html);
				 	return true;
			 	} elseif($this->formtype == "inline") {
					$html = H::div(['class' => 'form-group col-sm-4'], $buttons);
				 	$this->_setFields($html);
				 	return true;
			 	}

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }

	/** Utilities
	 * 
	 * _setLabel() - set the label for any field
	 * _setHelp() _ set helpline for any field
	 * _renderForm()
	 * _setFields()
	 * _getFields()
	 * _clearFields()
	 * _setFormHTML()
	 * _getFormHTML()
	 * _setAttributes()
	 * 
	 * ********************************************************************************************************************************/

		/** _setLabel()
		 * 
		 * @param - array - properties of the label
		 * */
		 protected function _setLabel(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$txt = Cliq::cStr($props['label']);
			 	if($this->formtype == "window") {
 					$c = 'col-form-label form-control-label text-right '.$this->lcw;
			 	} elseif($this->formtype == "inline") {
 					$c = '';
			 	}

 				if(array_key_exists('required', $props) ) {
 					$txt .= H::span(['class' => 'ml-1 bold text-large text-danger'], '*');
			 		$label = H::label(['class' => $c, 'for' => $props['id']], $txt);
 				} else {
			 		$label = H::label(['class' => $c, 'for' => $props['id']], $txt);
 				}			 	

			 	return $label;

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    } 		
		 }

		/** _setHelp()
		 * 
		 * @param - array - properties of the helptext
		 * */
		 protected function _setHelp(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

 				if(array_key_exists('helptext', $props)) {
	 				return H::small(['id' => $props['id'].'_help', 'class' => 'text-muted ml-3'], Cliq::cStr($props['helptext']));
 				} else {
 					return "";
 				}

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    } 	
		 }

		/** setAttributes()
		 * 
		 * 
		 * */
		 protected function _setAttributes(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				$genprops = [];
				foreach($props as $key => $val) {

					// Each $prop is a key and a value
					// $key = key($prop); $first = array_values($prop); $val = $first[0];

					switch($key) {

						// Attributes to be ignored
						case "label":
						case "help":
						case "sficon":
						case "pricon": 
						case "list":
						case "listtype":
						case "subtype":
						case "fieldclass": break;
	
						case "name":	
						case "v-model":
							$genprops['v-model'] = $val;
						break;

						case "id":
							if(!array_key_exists('v-model', $props)) {
								$genprops['v-model'] = $val;
							}
							$genprops['id'] = $val;
						break;

						case "style":
							// Style needs to be array
							if(is_array($val)) {
								$stylestring = "";
								foreach($val as $n => $str) {
									$st = explode(':', $str);
									$stylestring .= $st[0].':'.$st[1].';';
								}
								$genprops['style'] = $stylestring;
							} else {
								$genprops['style'] = $val;
							}
						break;

						case "placeholder":
						case "value":
							if(stristr($val, 'x|')) {
								$genprops[$key] = $val;
							} else {
								$genprops[$key] = Cliq::cStr($val);
							}
						break;

						default:
							if(stristr($val, 'v|')) {
								$genprops[$key] = $val;
							} else {
								$genprops[$key] = $val;
							}
						break;
					}
				}

				return $genprops;

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }

		/** renderForm()
		 * 
		 * @param - array - properties of the form header
		 * */
		 function _renderForm(array $props = [])
		 {
		 	
		 	array_key_exists('title', $props) ? $tt = H::div(['class' => 'row h5 ml-4'], $props['title']) : null ;
		 	array_key_exists('instructions', $props) ? $ti = H::small(['class' => 'row ml-4 text-muted'], $props['instructions']) : null ;
		 	$er = H::error(['class' => 'row text-danger ml-4 mb-4', 'id' => 'errorblock']);

		 	if($this->formtype == "window") {
		 		$html = H::div(['class' => 'p-2 text-small'], 
			 		$tt.$ti.$er,
			 		H::form($props, $this->_getFields())
			 	);
		 	} elseif($this->formtype == "inline") {
		 		$html = H::form($props, $this->_getFields());
		 	}
	
		 	$this->_setFormHTML($html);
		 	return $this->_getFormHTML();
		 }

		/** setFields()
		 * 
		 * @param - string - the Html to be stored
		 * */
		 protected function _setFields(string $html = "")
		 {
			if($html != "") {
				$this->formfields .= $html.PHP_EOL;
			};
			return true;
		 }

		/** getFields()
		 * 
		 * 
		 * */
		 protected function _getFields()
		 {
			return $this->formfields;
		 }

		/** clearFields()
		 * 
		 * 
		 * */
		 protected function _clearFields()
		 {
			$this->formfields = '';
		 }

		/** setFormHTML()
		 * 
		 * @param - string - the Html to be stored
		 * */
		 protected function _setFormHTML(string $html)
		 {
			if($html != "") {
				$this->formhtml .= $html.PHP_EOL;
			};
			return true;
		 }
		 
		/** getFormHTML()
		 * */
		 protected function _getFormHtml()
		 {
			return $this->formhtml;
		 }

		/** setFieldHTML()
		 * 
		 * @param - string - the Html to be stored
		 * */
		 protected function _setFieldHTML(string $html)
		 {
			if($html != "") {
				$this->fieldhtml .= $html.PHP_EOL;
			};
			return true;
		 }
		 
		/** getFieldHTML()
		 * */
		 protected function _getFieldHTML()
		 {
			return $this->fieldhtml;
		 }

		/** clearFieldHTML()
		 * */
		 protected function _clearFieldHTML()
		 {
			$this->fieldhtml = "";
		 }

	/** Data retrieval and saving
	 * 
	 * readRow() - only used internally
	 * writeRow() - probably need a post routine first
	 * deleteRow() - ditto
	 *
	 * *******************************************************************************************************************************/

		// readRow()
		/**
		 * 
		 * @param - array - original arguments - need these for table, tabletype and record id
		 * @param - array - model, need these for fields and defaults
		 * @return - row of data
		 * */
		 function readRow(array $args, array $mdl)
		 {
		 	
		    $fp = FirePHP::getInstance(true);
		 	$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		 	try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            $table = $args['table'];
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $idioms = $cfg['site']['idioms'];
	            $rq = $args['request'];

	            if(!array_key_exists('recid', $rq)) {
	            	throw new \Exception('No valid Record Id');
	            }
	            $recid = $rq['recid'];

	            // Existing record
	            if($recid != 0) {
	            	// Get a row
	            	$vars = [
						'table' => $table,
						'filter' => ['id' => $recid],
						'idiom' => false,
						// 'test' => 'test'
	            	];
	            	$db = new Db();
	            	$result = $db->getRow($vars);
	            	$rowset = $result['data'];

	            	// Only the fields that are necessary - compare keys 
	            	// $mdl['fields'] and $rowset becomes $rawrow	            	
	            	// $rawrow = array_intersect_key($rowset, $mdl['fields']);

	            	$row = [];
	            	foreach($rowset as $fldid => $fldval) {
	            		if($mdl['fields'][$fldid]['type'] == 'idiomtext') {
	            			foreach($idioms as $lcdcode => $lcdname) {
	            				$row[$fldid.'_'.$lcdcode] = $fldval[$lcdcode];
	            			}
	            		} else {
	            			$row[$fldid] = $fldval;
	            		}
	            	}

	            } else {

	            	// Use model
	            	$rawrow = $mdl['model'];

		            // Then sort out language fields
		            // Do a foreach on the rawrow, if the field is idiomtext, then flatten
		            // $this->_idiomField(fieldname, row value as an array)
	            	foreach($rawrow as $fldid => $fldval) {
	            		// It is possible that fields in model do not have an entry in fields - eg multitext fields
	            		// Merge flattened with non flattened to create a final row	
	            		if( (array_key_exists($fldid, $mdl['fields'])) and ($mdl['fields'][$fldid]['type'] == 'idiomtext') ) {
	            			foreach($idioms as $lcdcode => $lcdname) {
	            				$row[$fldid.'_'.$lcdcode] = $fldval;
	            			}
	            		} else {
	            			$row[$fldid] = $fldval;
	            		}
	            	}	            	
	            }         
	                       
				return [
					'flag' => 'Ok', 
					'data' => $row
				];
		    } catch (Exception $e) {
				$fp->fb($e->getMessage());
				return [
					'flag' => 'NotOk', 
					'msg' => $e->getMessage()
				];
		    }
		 }

		// writeRow()
		/**
		 * Write a row of data to the database
		 * @param - array - 
		 * @return - the new row of data
		 * */
		 function writeRow(array $data)
		 {
		 	
		    $fp = FirePHP::getInstance(true);
		 	$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		 	try {

                $table = $data['table'];
                $tabletype = $data['tabletype'];		

		 		if((int)$data['recid'] == 0) {
		 			$updb = R::dispense($table);
		 		} else {
		 			$updb = R::load($table, $data['recid']);
		 		}

		 		foreach($data['values'] as $fld => $val) {
		 			$updb->$fld = $val;
		 		}

		 		$id = R::store($updb);

		 		if(is_numeric($id)) {

					// Row has to be formatted according to the Model before it can be sent back
					$dt = $this->stdModel($data['displaytype'], $table, $tabletype);
					$flds = [];
					foreach($dt['columns'] as $n => $props) {
						$flds[$props['field']] = $props;
					}	
					$vars = [
						'table' => $table,
						'filter' => ['id' => $id],
						'idiom' => $this->lcd,
						'flds'	=> $flds,
						// 'test' => 'test'	
					];

					$db = new Db();
					$ret = $db->getRowSet($vars);

					if($ret['flag'] == 'Ok') {				            
						return $ret['data'];
					} else {
						throw new \Exception('Inserting/Updating a Record did not work and reading the formatted Row back, generated an error: '.$ret['msg']);
					}

		 		} else {
		 			throw new \Exception('Error writing row to database: '.$id);
		 		}

		    } catch (Exception $e) {
				$fp->fb($e->getMessage());
				return false;
		    }
		 }

		// deleteRow()
		/**
		 * 
		 * @param - array - 
		 * @return - row of data
		 * */
		 function deleteRow(array $args)
		 {
		 	
		    $fp = FirePHP::getInstance(true);
		 	$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		 	try {

				return [
					'flag' => 'Ok', 
					'msg' => $res
				];
		    } catch (Exception $e) {
				$fp->fb($e->getMessage());
				return [
					'flag' => 'NotOk', 
					'msg' => $e->getMessage()
				];
		    }
		 }

	/** Data modification
	 * 
	 * _renderTestForm()
	 * nextRef()
	 * nextIndex()
	 * 
	 * *******************************************************************************************************************************/

		// A test Bootstrap form for testing purposes
		/**
		 * 
		 * */
		 protected function _renderTestForm($a)
		 {

			$form = '
			<div class="p-2 text-small">

				<div class="row h5 ml-4">Title</div>
				<small class="row ml-4 text-muted">Instructions</small>
				<error id="errorblock" class="row text-danger ml-4 mb-4"></error>

				<form class="form" role="form" autocomplete="off">
					<div class="form-group row">
						<label class="col-lg-4 col-form-label form-control-label text-right">
							First name
							<required class="ml-1 bold text-large text-danger">*</required>
						</label>
						<div class="col-lg-8">
							<input class="form-control" type="text" value="Jane">
							<small class="text-muted ml-3">Help on this subject</small>
						</div>
					</div>
					<div class="form-group row">
						<label class="col-lg-4 col-form-label form-control-label text-right">Last name</label>
						<div class="col-lg-8">
							<input class="form-control" type="text" value="Bishop">
						</div>
					</div>
					<div class="form-group row">
						<label class="col-lg-4 col-form-label form-control-label text-right">Email</label>
						<div class="col-lg-8">
							<div class="input-group">
								<div class="input-group-prepend">
									<div class="input-group-text">@</div>
								</div>
								<input class="form-control" type="email" value="email@gmail.com">
							</div>
							<small class="text-muted ml-3">Help on this subject</small>
						</div>
					</div>
					<div class="form-group row">
						<label class="col-lg-4 col-form-label form-control-label text-right">Company</label>
						<div class="col-lg-8">
							<div class="input-group">
								<input class="form-control" type="text" value="">
								<div class="input-group-append">
									<div class="input-group-text">@</div>
								</div>
							</div>
							<small class="text-muted ml-3">Help on this subject</small>
						</div>
					</div>
					<div class="form-group row">
						<label class="col-lg-4 col-form-label form-control-label text-right">Website</label>
						<div class="col-lg-8">
							<input class="form-control" type="url" value="">
						</div>
					</div>
					<div class="form-group row">
						<label class="col-lg-4 col-form-label form-control-label text-right">Time Zone</label>
						<div class="col-lg-8">
							<select id="user_time_zone" class="form-control" size="0">
								<option value="Hawaii">(GMT-10:00) Hawaii</option>
								<option value="Alaska">(GMT-09:00) Alaska</option>
								<option value="Pacific Time (US &amp; Canada)">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
								<option value="Arizona">(GMT-07:00) Arizona</option>
								<option value="Mountain Time (US &amp; Canada)">(GMT-07:00) Mountain Time (US &amp; Canada)</option>
								<option value="Central Time (US &amp; Canada)" selected="selected">(GMT-06:00) Central Time (US &amp; Canada)</option>
								<option value="Eastern Time (US &amp; Canada)">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
								<option value="Indiana (East)">(GMT-05:00) Indiana (East)</option>
							</select>
						</div>
					</div>
					<div class="form-group row">
						<label class="col-lg-4 col-form-label form-control-label text-right">Username</label>
						<div class="col-lg-8">
							<input class="form-control" type="text" value="janeuser">
						</div>
					</div>
					<div class="form-group row">
						<label class="col-lg-4 col-form-label form-control-label text-right">Comments</label>
						<div class="col-lg-8">
							<textarea class="form-control" rows="3">Comments</textarea>
							<small class="text-muted ml-3">Help on this subject</small>
						</div>
					</div>
					<div class="form-group row">
						<label class="col-lg-4 col-form-label form-control-label text-right">Password</label>
						<div class="col-lg-8">
							<input class="form-control" type="password" value="11111122333">
						</div>
					</div>
					<div class="form-group row">
						<label class="col-lg-4 col-form-label form-control-label text-right">Confirm</label>
						<div class="col-lg-8">
							<input class="form-control" type="password" value="11111122333">
						</div>
					</div>
					<div class="form-group row">
						<label class="col-lg-4 col-form-label form-control-label text-right"></label>
						<div class="col-lg-8">
							<input type="reset" class="btn btn-secondary btn-sm" value="Cancel">
							<input type="button" class="btn btn-primary btn-sm" value="Save Changes">
						</div>
					</div>
				</form>
				</div>
			';

			return $form;
		 }

		/** getnextref() Ok 
		 *
		 * @param - array - arguments
		 * @param - array - to be converted to JSON
		 **/
		 function getnextref(array $args)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				$cfg = F::get('cfg'); 
				$this->idioms = $cfg['site']['idioms'];
				$this->lcd = $args['idiom'];
                $this->table = $args['table'];
                $this->tabletype = $args['tabletype'];
		    	$this->rq = $args['request'];
		
		    	if($this->tabletype == '') {
		    		$sql = "SELECT id, ".$this->rq['fld']." FROM ".$this->table." ORDER BY id DESC LIMIT 1"; $row = R::getRow($sql);
		    		$this->tabletype  = $this->table;
		    	} else {
			    	$sql = "SELECT id, ".$this->rq['fld']." FROM ".$this->table." WHERE c_type = ? ORDER BY id DESC LIMIT 1"; $row = R::getRow($sql, [$this->tabletype]);
		    	}

		    	if(array_key_exists($this->rq['fld'], $row)) {
		    		$lastref = $row[$this->rq['fld']];
		    	} else {
		    		$lastref = null;
		    	}

				// If this was the first time this Reference had ever been needed, then a last record would not exist
				if(!$lastref) {
					$nextref = $this->rq['currval'];		
				} else {
					$a = explode("(", $lastref);
					$lastnum = filter_var($lastref, FILTER_SANITIZE_NUMBER_INT);            
					$nextnum = (int)$lastnum + 1;
					$nextref = $a[0].'('.$nextnum.')';
				}	
				
				$result = (trim(str_replace(",", "", $nextref)));  		
				            
				return [
					'type' => 'json',
					'code' => 200,
					'body' => ['flag' => 'Ok', 'data' => $result],
					'encode' => true
				];

		    } catch (Exception $e) {
				return [
					'type' => 'json',
					'code' => 500,
					'body' => ['flag' => 'NotOk', 'msg' => $e->getMessage()],
					'encode' => true
				];
		    }
		 }

		/** getnextentry() Ok 
		 *
		 * @param - array - arguments
		 * @param - array - to be converted to JSON
		 **/
		 function getnextentry(array $args)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				$cfg = F::get('cfg'); 
				$this->idioms = $cfg['site']['idioms'];
				$this->lcd = $args['idiom'];
                $this->table = $args['table'];
                $this->tabletype = $args['tabletype'];
		    	$this->rq = $args['request'];

		    	$sql = "SELECT id, ".$this->rq['fld']." FROM ".$this->table." WHERE c_type = ? ORDER BY id DESC LIMIT 1";
				$row = R::getRow($sql, [$this->tabletype]);

		    	if(array_key_exists($this->rq['fld'], $row)) {
		    		$lastref = $row[$this->rq['fld']];
		    	} else {
		    		$lastref = null;
		    	}
				
				// If this was the first time this Reference had ever been needed, then a last record would not exist
				if(!$lastref) {
					$nextref = $this->rq['currval'];		
				} else {
					$lastnum = filter_var($lastref, FILTER_SANITIZE_NUMBER_INT);            
					$nextnum = (int)$lastnum + 1;
					$result = $this->rq['prefix'].$nextnum; 
				}		
			
				return [
					'type' => 'json',
					'code' => 200,
					'body' => ['flag' => 'Ok', 'data' => $result],
					'encode' => true
				];

		    } catch (Exception $e) {
				return [
					'type' => 'json',
					'code' => 500,
					'body' => ['flag' => 'NotOk', 'msg' => $e->getMessage()],
					'encode' => true
				];
		    }		 	
		 }

		/** isunique()
		 *
		 * @param - array - arguments
		 * @param - array - to be converted to JSON
		 **/
		 function isunique(array $args)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				$this->lcd = $args['idiom'];
                $this->table = $args['table'];
                $this->tabletype = $args['tabletype'];
		    	$this->rq = $args['request'];

		    	$sql = "SELECT ".$this->rq['fld']." FROM ".$this->table." WHERE c_type = ? AND ".$this->rq['fld']." = ? LIMIT 1";
				$val = R::getCell($sql, [$this->tabletype, $this->rq['currval']]);
				
				if($val == '') {
					return [
						'type' => 'json',
						'code' => 200,
						'body' => ['flag' => 'Ok'],
						'encode' => true
					];
				} else {
					return [
						'type' => 'json',
						'code' => 200,
						'body' => ['flag' => 'Ok', 'data' => $val],
						'encode' => true
					];
				}	

		    } catch (Exception $e) {
				return [
					'type' => 'json',
					'code' => 500,
					'body' => ['flag' => 'NotOk', 'msg' => $e->getMessage()],
					'encode' => true
				];
		    } 	
		 }

} // Ends Class

/* Template

		/** 
		 * 
		 * @param - string - the Html to be stored

		 function (array $props, string $type)
		 {

			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

			 	$label = $this->_setLabel($props);

			 	// Setting up the interior of the field div 	
			 	$intfield = H::div(['class' => 'form-row'],
			 		H::div(['class' => 'form-group col-md-6'],
			 			H::label(['class' => '', 'for' => ''], Cliq::cStr(':')),
			 			H::input(['type' => '', 'class' => ''])
			 		),
			 		H::div(['class' => 'form-group col-md-6'],
			 			H::label(['class' => '', 'for' => ''], Cliq::cStr(':')),
			 			H::input(['type' => '', 'class' => ''])
			 		)
			 	);

			 	$field = H::div(['class' => $this->rcw], $intfield);
				$html = H::div(['class' => 'form-group row'], $label.$field);
			 	$this->_setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }


			 	if($this->formtype == "window") {
			 		$field = H::div(['class' => $this->rcw], $intfield);
					$html = H::div(['class' => 'form-group row'], $label.$field);
				 	$this->_setFields($html);
				 	return true;			 		
			 	} elseif($this->formtype == "inline") {
					$html = H::div(['class' => 'form-group col-sm-4'], $label.$intfield);
				 	$this->_setFields($html);
				 	return true;
			 	}
	

		    } catch (Exception $e) {
		    	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->_setFormHTML($err);
		    }
		 }
*/