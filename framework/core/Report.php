<?php
/**
 * Cliq Framework - Reports and Views
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
use \core\Engine as Cliq;
use \Framework as F;
use \Firephp;
use \R;

class Report extends \Framework {

	const THISCLASS = "Report";
	const CLIQDOC = "c_document";

	public $viewhtml = "";
	public $viewfields = "";
	public $fieldhtml = "";
	public $idioms = [];
	public $lcd = "";

	function __construct() {
        parent::__construct();
    }
	function __destruct() {}

	/** Display and publish a view
	 * 
	 * winview() - generates an array containing view html, options and data to be rendered by Vue, all in a popup window
	 * winReport()
	 * publishview() - generates an array containing view html, options and data to be rendered by Vue
	 * displayHelp()
	 * viewArticle() 
	 *
	 * ******************************************************************************************************************************************/

		// Winview()
		/**
		 * View definition in a Window
		 * @param - array - primarily the request
		 * @return - Any HTML plus JSON to create a Datagrid
		 * */
		 function winview(array $args)
		 {
		    
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $this->lcd = $args['idiom'];
	            $table = $args['table'];
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $this->idioms = $cfg['site']['idioms'];

				$mdl = $this->stdModel('view', $table, $tabletype);
				$fields = array_orderby($mdl['fields'], 'order', SORT_ASC);

				$arr = $this->readRow($args, $mdl);
				if($arr['flag'] == 'NotOk') {
					throw new \Exception('Reading a row generated an error: '.$arr['msg']);
				}; 
				$row = $arr['data'];
				$db = new Db();

				$tbody = "";
				foreach($fields as $fldid => $props) {

					array_key_exists('viewclass', $props) ? $vc = $props['viewclass'] : $vc = '' ;

					$tbody .= H::div(['class' => 'clqtable-row'],
						H::div(['class' => 'clqtable-label'], Cliq::cStr($props['label'])),
						H::div(['class' => 'clqtable-cell '.$vc], $db->_dispFormatByField([
							'value' => $row[$fldid],
							'type' => $props['type'],
							'fldid' => $fldid,
							'mdl' => $fields,
							'row' => $row
						]))
					);
				}

				$table = H::div(['id' => 'dataview', 'class' => 'clqtable m-3 p-3'],
					H::div(['class' => 'clqtable-caption'], Cliq::cStr($mdl['title'])),
					$tbody
				);
				$data = [
					'html' => $table,
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

		// Winreport()

		// displayhelp()
		/**
		 * 
		 * @param - array - usual arguments
		 * @return - HTML to put in the Window
		 * */
		 function displayhelp(array $args) 
		 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $this->lcd = $args['idiom'];
	            $table = $args['table'];
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $this->idioms = $cfg['site']['idioms'];
	            $rq = $args['request'];

	            $sql = "SELECT c_document FROM ".$table." WHERE c_type = ? AND c_reference = ?";
	            $doc = R::getCell($sql, [$tabletype, $rq['helpref']]);

	            if($doc != "") {
	            	$docarray = json_decode($doc, true);
	            	$html = H::div(['id' => 'dataview', 'class' => 'p-2'],
						H::div(['class' => 'h5'], $docarray['d_title'][$this->lcd]),
						H::p(['class' => ''], nl2br2($docarray['d_text'][$this->lcd]))
	            	);
	            } else {
	            	$html = H::div(['id' => 'dataview', 'class' => 'h5 p-2'], Cliq::cStr('63:Help not available for').':&nbsp;'.$rq['helpref']);
	            }

				$data = [
					'html' => $html,
	                'options' => ['width' => 500, 'height' => 600]
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

		// viewArticle()
		/**
		 * 
		 * 
		 * 
		 * */
		 function viewArticle(array $args) 
		 {

		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom']; // Only local
	            $table = $args['table'];
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $this->idioms = $cfg['site']['idiomflags'];
	            $rq = $args['request'];


	            $sql = "SELECT * FROM ".$table." WHERE id = ?";
	            $rawrow = R::getRow($sql, [$rq['recid']]);
	            $doc = $rawrow['c_document'];
	            $docarray = json_decode($doc, true);
	            unset($rawrow['c_document']);
	            $row = array_merge($rawrow, $docarray);

	            $panels = ""; $flags = "";
	            foreach($this->idioms as $lcdcode => $flag) {

		            $panels .= H::div(['class' => 'row collapse', 'id' => 'idiom_'.$lcdcode], 
		            	// Title
		            	H::div(['class' => 'h3'], $row['d_title'][$lcdcode]),
		            	// Text
		            	H::div(['class' => ''], $row['d_text'][$lcdcode])
		            );

		            $flags .= H::img(['src' => '/public/flags/'.$flag, 'class' => 'ml-2 right cursor-pointer', 'style' => 'height: 24px; align: right;', 'data-toggle' => 'collapse', 'data-target' => '#idiom_'.$lcdcode]);

	            }

	            $html = H::div(['id' => 'dataview', 'class' => 'container p-3'],
	            	// Image
	            	H::div(['class' => 'row', 'style' => 'background: url('.$row['d_image'].'); background-position: center; background-size: cover; background-repeat: no-repeat; height: 200px; cursor:pointer;'], $flags),

	            	// Attributes
	            	H::div(['class' => 'row'],
	            		H::p(['class' => 'text-muted text-sm'], 'Ref: '.$row['c_reference'].', '.Cliq::cStr('72:Author').': '.$row['d_author'].', '.Cliq::cStr('73:Date').': '.Cliq::fDate($row['d_date']).', '.Cliq::cStr('76:Tags').': '.$row['d_tags'].', '.Cliq::cStr('77:Status').': '.$row['d_status'])
	            	),
	            	$panels
	        	);

				$data = [
					'html' => $html,
	                'options' => [ 'width' => 600, 'height' => 600]
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

	/** Utilities
	 * 
	 * _setAttributes()	 
	 * _renderReport()
	 * _setFields()
	 * _getFields()
	 * _clearFields()
	 * _setReportHTML()
	 * _getReportHTML()
	 * 
	 * ******************************************************************************************************************************************/

		/** setAttributes()
		 * 
		 * 
		 * */
		 protected function _setAttributes(array $props)
		 {
			
		    $fp = FirePHP::getInstance(true);
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {	

				$genprops = [];
				foreach($props as $key => $val) {

					// Each $prop is a key and a value
					// $key = key($prop); $first = array_values($prop); $val = $first[0];

					switch($key) {

						// Attributes to be ignored
						case "label":
						case "list":
						case "listtype":
						case "fieldclass": break;


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
				$fp->fb($e->getMessage()); 	
		    	$err = 'Method: '.$method.', Error message: '.$e->getMessage();
		    	$fp->fb($err);
		        $this->_setViewHTML($err);
		    }
		 }

		/** renderReport()
		 * 
		 * @param - array - properties of the form header
		 * */
		 function _renderReport(array $props = [])
		 {
		 	
		 	array_key_exists('title', $props) ? $tt = H::div(['class' => 'row h5 ml-4'], $props['title']) : null ;
		 	$html = H::div(['class' => 'p-2 text-small'], $tt, H::table($props, $this->_getFields()));
		 	$this->_setReportHTML($html);
		 	return $this->_getReportHTML();
		 }

		/** setFields()
		 * 
		 * @param - string - the Html to be stored
		 * */
		 protected function _setFields(string $html = "")
		 {
			if($html != "") {
				$this->viewfields .= $html.PHP_EOL;
			};
			return true;
		 }

		/** getFields()
		 * 
		 * 
		 * */
		 protected function _getFields()
		 {
			return $this->viewfields;
		 }

		/** clearFields()
		 * 
		 * 
		 * */
		 protected function _clearFields()
		 {
			$this->viewfields = '';
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

		/** setReportHTML()
		 * 
		 * @param - string - the Html to be stored
		 * */
		 protected function _setReportHTML(string $html)
		 {
			if($html != "") {
				$this->viewhtml .= $html.PHP_EOL;
			};
			return true;
		 }
		 
		/** getReportHTML()
		 * */
		 protected function _getReportHtml()
		 {
			return $this->viewhtml;
		 }

	/** Data retrieval
	 * 
	 * readSet()
	 * readRow() - only used internally
	 *
	 * ******************************************************************************************************************************************/

		// readSet() - for reports

		// readRow() - for view
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

            	// Get a row
            	$vars = [
					'table' => $table,
					'filter' => ['id' => $recid],
					'idiom' => false,
					// 'test' => 'test'
            	];
            	$db = new Db();
            	$result = $db->getRow($vars);
            	$row = $result['data'];

            	// Only the fields that are necessary - compare keys 	            	
            	// $row = array_intersect_key($rowset, $mdl['fields']);

	            // Test OK for $md
		    	// $fp = FirePHP::getInstance(true); $fp->fb($row);            
	                       
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


}

