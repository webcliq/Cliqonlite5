<?php
/**
 * Cliqon Framework - Quikform
 *
 * @category   Web application framework
 * @package    Cliqon
 * @author     Original Author <support@cliqon.com>
 * @copyright  2019 Webcliq
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    Release: 5.1.0
 * @link       http://cliqon.com
 */

namespace core;

use \core\Engine as Cliq;
use \core\Html as H;
use \core\Files as Y;
use \Framework as F;
use \Firephp;
use \R;

interface iQuikform
{
	/*
	public static function qRow(
    	string $table, 	// Table name
    	int $id 	// Record number
	);
	*/
}

class Quikform extends Cliq implements iQuikform {

	const THISCLASS = "Quikform";
	public $formhtml = "";
	public $formfields = "";
	public $fieldhtml = "";
	public $idioms = [];

	function __construct($idm) {
		self::$lcd = $idm;
	}
    function __destruct() {}

	/** Form fields
	 * hidden();
	 * str()
	 * field() - text, textarea, email, url, date, datetime etc.
	 * file() - file or image
	 * select()
	 * checkbox() - or radio
	 * buttons()
	 * fieldset() - not yet implemented
	 *
	 * ** Common
	 * - setLabel()
	 * - setHelp()
	 *
	 ********************************************************************************************************/

		/** hidden()
		 * 
		 * @param - array - properties of the form field
		 * */
		 function hidden(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

			 	$attributes = $this->setAttributes($props);
			 	if(!is_array($attributes)) {
			 		throw new Exception('Converting $props for '.$props['id'].' produced an error: '.$attributes);
			 	}
			 	$attributes['type'] = 'hidden';
			 	$html = Html::input($attributes);
			 	$this->setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        
		        $this->setFormHTML($err);
		    }
		 }

		/** str()
		 * Can handle any type of textual rendering in a row
		 * @param - array - [text] required
		 **/
		 function str(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				if(!array_key_exists('text', $props)) {
					throw new Exception('A text string is required');
				}

				if(stristr('x|', $props['text'])) {
					$text = $props['text'];
				} else {
					$text = Cliq::cStr($props['text']);
				}
				unset($props['text']);

				$html = Html::div(['class' => 'form-group row'], 
					Html::span($props, $text)
				);
			 	$this->setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        
		        $this->setFormHTML($err);
		    }
		 }

		/** field()
		 * Can handle any standard type of Form field including input (type text, email, url etc.) and textarea
		 * @param - string - the Html to be stored
		 * */
		 function field(array $props, $type = 'input')
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				// Label
				$label = $this->setLabel($props);

				// Modify field properties before setting them into attributes

			 	if(array_key_exists('fieldclass', $props)) {
			 		$props['class'] = 'form-control '. $props['fieldclass'];
			 		unset($props['fieldclass']);
			 	} else {
			 		$props['class'] = 'form-control';
			 	}		

			 	if(array_key_exists('help', $props)) {
			 		$props['aria-describedby'] = $props['id'].'_help';
			 	} 

			 	$attributes = $this->setAttributes($props);
			 	if(!is_array($attributes)) {
			 		throw new Exception('Converting $props for '.$props['id'].' produced an error: '.$attributes);
			 	}

				// Input - including before and after icons

			 	if(array_key_exists('sficon', $props)) {
			 		$field = Html::div(['class' => 'input-group col-sm-8'],
			 			Html::div(['class' => 'input-group-prepend'],
			 				Html::div(['class' => 'input-group-text'], Html::i(['class' => 'fas fa-'.$props['sficon'], 'v-on:click' => $props['action'].'($event)']))

			 			),
			 			Html::$type($attributes)			 			
			 		);
			 	} else if (array_key_exists('pricon', $props)) {
			 		$field = Html::div(['class' => 'input-group col-sm-8'],
			 			Html::$type($attributes),
			 			Html::div(['class' => 'input-group-append'],
			 				Html::div(['class' => 'input-group-text'], Html::i(['class' => 'fas fa-'.$props['sficon'], 'v-on:click' => $props['action'].'($event)']))
			 			)
			 		);
			 	} else {
			 		$field = Html::div(['class' => 'col-sm-8'], Html::$type($attributes));
			 	}


			 	// Help
			 	$help = $this->setHelp($props);

				$html = Html::div(['class' => 'form-group row'], $label.$field.$help);
			 	$this->setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        $this->setFormHTML($err);
		    }
		 }

		/** file()
		 * Designed to upload a file
		 * @param - string - the Html to be stored
		 * */
		 function file(array $props, string $type)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				// Label
				$label = $this->setLabel($props);

				// Modify field properties before setting them into attributes

				$props['type'] = 'file';
				$id = $props['id'];

			 	if(array_key_exists('fieldclass', $props)) {
			 		$props['class'] = 'form-control'. $props['fieldclass'];
			 		unset($props['fieldclass']);
			 	} else {
			 		$props['class'] = 'form-control pb-5';
			 	}		

			 	if(array_key_exists('help', $props)) {
			 		$props['aria-describedby'] = $props['id'].'_help';
			 	} 

			 	$attributes = $this->setAttributes($props);
			 	if(!is_array($attributes)) {
			 		throw new Exception('Converting $props for '.$props['id'].' produced an error: '.$attributes);
			 	}

			 	// Image or File field
			 	if($type == 'image') {

           			$field = Html::div(['class' => ''],
           				Html::div(['v-if' => '!'.$id],
           					Html::input(['type' => 'file', 'class' => 'form-control', 'data-fldid' => $id, 'v-on:change' => 'onImageChange'])
           				),
           				Html::div(['v-else' => ''],
           					Html::img([':src' => $id, 'class' => $props['imgclass']]),
           					Html::button(['type' => 'button', 'class' => 'btn btn-sm btn-danger text-right', 'v-on:click' => 'removeImage', 'data-fldid' => $id], Cliq::cStr('37:Remove image'))
           				)
           			);

			 	} else { // File

           			$field = Html::div(['class' => 'input-group col-sm-8'],

           				Html::div(['class' => 'input-group-prepend'],
           					Html::div(['class' => 'input-group-text'],
           						Html::i(['class' => 'fas fa-trash pointer', 'title' => Cliq::cStr('38:Remove the file'), 'v-on:click' => 'removeFile', 'data-fldid' => $id]),
           						Html::i(['class' => 'ml-1 fas fa-upload pointer', 'title' => Cliq::cStr('39:Please select file'), 'v-on:click' => 'removeFile', 'data-fldid' => $id])
           					)
           				),      				

           				Html::input(['v-if' => '!'.$id, 'type' => 'file', 'class' => $props['class'] , 'data-fldid' => $id, 'v-on:change' => 'onFileChange']),

           				Html::input(['v-else' => '', 'v-bind:value' => $id.'.name', 'class' => $props['class'] .' filefield', 'data-fldid' => $id, 'readonly' => true])
         				
           			);

           		}

			 	// Help
			 	$help = $this->setHelp($props);

				$html = Html::div(['class' => 'form-group row'], $label.$field.$help);
			 	$this->setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();  
		        $this->setFormHTML($err);
		    }
		 }	 

		/** select()
		 * Handles a select with either a dynamic or static list
		 * @param - string - the Html to be stored
		 * */
		 function select(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				// Label
				$label = $this->setLabel($props);

				// Modify field properties before setting them into attributes

			 	if(array_key_exists('fieldclass', $props)) {
			 		$props['class'] = 'form-control '. $props['fieldclass'];
			 	} else {
			 		$props['class'] = 'form-control';
			 	}		

			 	if(array_key_exists('help', $props)) {
			 		$props['aria-describedby'] = $props['id'].'_help';
			 	} 

			 	$attributes = $this->setAttributes($props);
			 	if(!is_array($attributes)) {
			 		throw new Exception('Converting $props for '.$props['id'].' produced an error: '.$attributes);
			 	}

			 	// Options
			 	$options = "";
			 	switch($props['listtype']) {

			 		case "static":
				 		// $props['list'] will be an array
				 		foreach($props['list'] as $val => $lbl) {
				 			$options .= H::option(['value' => $val], Cliq::cStr($lbl));
				 		}
			 		break;

			 		case "staticnotrans":
				 		// $props['list'] will be an array with label already translated
				 		foreach($props['list'] as $val => $lbl) {
				 			$options .= H::option(['value' => $val], $lbl);
				 		}	
			 		break;

			 		case "dynamic":
				 		// $props['list'] will be an array in the form ['dbcollection', 'listname']
				 		$opts = Cliq::fList($props['list'][0], $props['list'][1], self::$lcd); 
				 		foreach($opts as $val => $lbl) {
				 			$options .= H::option(['value' => $val], $lbl);
				 		}
			 		break;

			 		case "idiomflags":
			 			// $props['list'] will be subdirectory in which the flags can be found /public/flags
			 			$opts = Y::listFiles($props['list']);
				 		foreach($opts as $o => $lbl) {
				 			$options .= H::option(['value' => $lbl], $lbl);
				 		}
			 		break;

			 		default:
						$options = H::option(['value' => 'notused'], Cliq::cStr('176:No records available'));
			 		break;

			 	}

				// Input
			 	$field = Html::div(['class' => 'col-sm-8'], 
			 		Html::select($attributes, $options)
			 	);

			 	// Help
			 	$help = $this->setHelp($props);

				$html = Html::div(['class' => 'form-group row'], $label.$field.$help);
			 	$this->setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        
		        $this->setFormHTML($err);
		    }
		 }

		/** radiochkbox())
		 * Handles a checkbox group
		 * @param - string - the Html to be stored
		 * */
		 function radiochkbox(array $props, $type = 'checkbox')
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				// Label
				$label = $this->setLabel($props);

			 	if(array_key_exists('fieldlabelclass', $props)) {
			 		$lblclass = $props['fieldlabelclass'];
			 	} else {
			 		$lblclass = 'form-check-label';
			 	}	

				// Input
				$checkboxes = "";
		 		foreach($props['list'] as $val => $lbl) {
		 			if($type == 'checkbox') {
			 			$checkboxes .= Html::div(['class' => 'form-check p-1'],
			 				Html::input(['class' => 'form-check-input css-checkbox', 'type' => 'checkbox', 'v-model' => $val, 'id' => $val]),
			 				Html::label(['class' => 'form-check-label css-label', 'for' => $val], Cliq::cStr($lbl))
			 			);
				 	} else { // Radiogroup
			 			$checkboxes .= Html::div(['class' => 'form-check p-1 ml-1'], // form-check-input
			 				Html::input(['class' => 'magic-radio', 'type' => 'radio', 'v-model' => $props['id'], 'value' => $val, 'id' => $val]),
			 				Html::label(['class' => $lblclass, 'for' => $val], Cliq::cStr($lbl))
			 			);
				 	}
			 	}

			 	$field = Html::div(['class' => 'col-sm-8'], $checkboxes);

				$html = Html::div(['class' => 'form-group row'], $label.$field);
			 	$this->setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        
		        $this->setFormHTML($err);
		    }
		 }

		/** multifield()
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
							$field = Html::input([
								'type' => $fld['subtype'],
								'class' => 'form-control '.$fld['fldclass'],
								'v-model' => $fld['v-model']
							]);
						break;

						case "select":

							$options = Html::option(['value' => ''], Cliq::cStr('164:Select an option'));

							switch($props['subtype']) {

								case "static":
							 		foreach($fld['list'] as $val => $lbl) {
							 			$options .= Html::option(['value' => $val], Cliq::cStr($lbl));
							 		}
								break;

								case "staticnotrans":
							 		foreach($fld['list'] as $val => $lbl) {
							 			$options .= Html::option(['value' => $val], $lbl);
							 		}	
								break;

								case "dynamic":
							 		$opts = Cliq::dList($fld['list'][0], $fld['list'][1], self::$lcd); 
							 		foreach($opts as $val => $lbl) {
							 			$options .= Html::option(['value' => $val], $lbl);
							 		}
								break;
							}

							$field = Html::select([
								'class' => 'form-control '.$fld['fldclass'],
								'v-model' => $fld['v-model']
							], $options);
						break;

						case "textarea":
							$field = Html::textarea([
								'class' => 'form-control '.$fld['fldclass'],
								'v-model' => $fld['v-model']
							]);
						break;

						case "button":
							$field = Html::button([
								'class' => 'btn btn-sm btn-danger '.$fld['fldclass'],
							], Html::i(['class' => 'fas fa-'.$fld['icon']]));
						break;
					}

					$fields .= Html::div(['class' => 'form-group '.$fld['class']], Html::label(['for' => $f], Cliq::cStr($fld['label'])).$field);
				}

				$html = Html::div(['class' => 'form-row d-flex'], $fields);
			 	$this->setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        
		        $this->setFormHTML($err);
		    }
		 }				

		/** buttons()
		 * Handles a button group
		 * @param - string - the Html to be stored
		 * */
		 function buttons(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				// Label
				$label = $this->setLabel($props);

				// Buttons
				$buttons = ""; // v-on:click.once
				foreach($props['buttons'] as $action => $btn) {	// Where $btn is an array
					$buttons .= Html::a(['class' => 'btn pointer pt-2 pb-2 btn-sm ml-2 btn-'.$btn['class'], 'href' => '#', 'v-on:click' => 'clickButton($event, \''.$action.'\')'], 
						Html::i(['class' => 'mr-1 fas fa-fw fa-'.$btn['icon']])
						.Cliq::cStr($btn['text'])
					);
				}

				$html = Html::div(['class' => 'form-group row'], $label.$buttons);
			 	$this->setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        
		        $this->setFormHTML($err);
		    }
		 }

		/** fieldset() 
		 * Bootstrap variant for radio, check boxes etc.
		 * @param - string - the Html to be stored
		 * */
		 function fieldset(array $props, $type = 'radio')
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				/*
				  <fieldset class="form-group">
				    <div class="row">
				      <legend class="col-form-label col-sm-2 pt-0">Radios</legend>
				      <div class="col-sm-10">
				        <div class="form-check">
				          <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" checked>
				          <label class="form-check-label" for="gridRadios1">
				            First radio
				          </label>
				        </div>
				        <div class="form-check">
				          <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2">
				          <label class="form-check-label" for="gridRadios2">
				            Second radio
				          </label>
				        </div>
				        <div class="form-check disabled">
				          <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios3" value="option3" disabled>
				          <label class="form-check-label" for="gridRadios3">
				            Third disabled radio
				          </label>
				        </div>
				      </div>
				    </div>
				  </fieldset>

				*/

			 	$this->setFields($html);
			 	return true;

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        
		        $this->setFormHTML($err);
		    }
		 }

		/** setLabel()
		 * 
		 * @param - array - properties of the label
		 * */
		 protected function setLabel(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				array_key_exists('labelclass', $props) ? $c = $props['labelclass'] : $c = 'col-sm-4';
				array_key_exists('id', $props) ? $id = $props['id'] : $id = 'fld';
 				$lbl = $props['label'];				
 				
 				if(array_key_exists('required', $props) ) {
 					$r = Html::span(['class' => 'mr-1 text-danger font-weight-bold h4'], '*');
			 		$label = Html::label(['class' => 'text-right col-form-label '.$c, 'for' => $id], $r.Cliq::cStr($lbl['text']));
 				} else {
 					if( (array_key_exists('text', $lbl) ) and ($lbl['text'] != '') ) {
 						$txt = Cliq::cStr($lbl['text']);
 					} else {$txt = '';}
					$label = Html::label(['class' => 'text-right col-form-label '.$c, 'for' => $id], $txt);
 				}
			 		
			 	return $label;

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        
		        $this->setFormHTML($err);
		    } 		
		 }

		/** setHelp()
		 * 
		 * @param - array - properties of the helptext
		 * */
		 protected function setHelp(array $props)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {
 				
 				if(array_key_exists('help', $props)) {

	 				$hlp = $props['help'];
	 				$help = Html::small(['id' => $props['id'].'_help', 'class' => 'form-text text-muted ml-3 helpclass '.$hlp['helpclass']], Cliq::cStr($hlp['text']));
				 	return $help;
 				} else {
 					return "";
 				}

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        
		        $this->setFormHTML($err);
		    } 	
		 }

	/** Form getters and setters
	 *
	 * renderForm()
	 * setFields()
	 * getFields()
	 * clearFields()
	 * setFormHTML()
	 * getFormHTML()
	 * setAttributes()
	 *
	 ********************************************************************************************************/

		/** renderForm()
		 * 
		 * @param - array - properties of the form header
		 * */
		 function renderForm(array $props)
		 {
		 	$html = Html::form($props, $this->getFields());
		 	$this->setFormHTML($html);
		 	return $this->getFormHTML();
		 }

		/** setFields()
		 * 
		 * @param - string - the Html to be stored
		 * */
		 protected function setFields(string $html)
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
		 protected function getFields()
		 {
			return $this->formfields;
		 }

		/** clearFields()
		 * 
		 * 
		 * */
		 protected function clearFields()
		 {
			$this->formfields = '';
		 }

		/** setFormHTML()
		 * 
		 * @param - string - the Html to be stored
		 * */
		 protected function setFormHTML(string $html)
		 {
			if($html != "") {
				$this->formhtml .= $html.PHP_EOL;
			};
			return true;
		 }
		 
		/** getFormHTML()
		 * 
		 * 
		 * */
		 protected function getFormHtml()
		 {
			return $this->formhtml;
		 }

		/** setFieldHTML()
		 * 
		 * @param - string - the Html to be stored
		 * */
		 protected function setFieldHTML(string $html)
		 {
			if($html != "") {
				$this->fieldhtml .= $html.PHP_EOL;
			};
			return true;
		 }
		 
		/** getFieldHTML()
		 * 
		 * 
		 * */
		 protected function getFieldHTML()
		 {
			return $this->fieldhtml;
		 }

		/** clearFieldHTML()
		 * 
		 * 
		 * */
		 protected function clearFieldHTML()
		 {
			$this->fieldhtml = "";
		 }

		/** setAttributes()
		 * 
		 * 
		 * */
		 protected function setAttributes(array $props)
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

						break;
	
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
							if(stristr('x|', $val)) {
								$genprops[$key] = $val;
							} else {
								$genprops[$key] = Cliq::cStr($val);
							}
						break;

						default:
							if(stristr('v|', $val)) {
								$genprops[$key] = $val;
							} else {
								$genprops[$key] = $val;
							}
						break;
					}
				}

				return $genprops;

		    } catch (Exception $e) {
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		        
		        $this->setFormHTML($err);
		    }
		 }

} // Class Ends
