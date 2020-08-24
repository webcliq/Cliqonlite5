<?php
/**
 * Cliq Framework - Admin
 *
 * @category   Web application framework
 * @package    Cliq
 * @author     Original Author <support@cliqon.com>
 * @copyright  2020 Webcliq
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    Release: 1.0.1
 * @link       http://webcliq.com
 */


namespace app;

use \core\Engine as Cliq;
use \core\Html as H;
use \core\Db as Db;
use \core\User as Usr;
use \Framework as F;
use \core\Files as Files;
use \core\Toml as Toml;
use \core\Arrch as Arrch;
use \Firephp;
use \R;

class Admin extends Cliq {

	const THISCLASS = "Admin";
	const CLIQDOC = "c_document";
	
	function __construct() {
		// parent::__construct();
	}
	function __destruct() {}

	/** Main data retrieval and display functions
	 * 
	 * desktop() - dashboard
	 * datagrid() - uses Bootstrap-Table
	 * datatree() - uses fancytree
	 * datatable() - uses ordinary Bootstrap List Group with TWBS pagination
	 * datacard() - uses ordinary Bootstrap Card Group with Isotope and TWBS pagination
	 * calendar() - uses FullCalendar (Adam Shaw)
	 * gallery() - uses Galleria
	 *
	 *************************************************************************************************************************************/

		/** desktop()
		 * Main Desktop background page
		 * All menus and 
		 * @param - array - primarily the request
		 * @return - just HTML page from template
		 * */
		 function desktop($args)
		 {
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$mdl = $this->getModel('configs/desktop');

				// Extend for each on language - breadcrumbs - text and buttons	- text	
				$mdl['breadcrumbs']	= Cliq::extend($mdl['breadcrumbs']);
				$mdl['buttons']	= Cliq::extend($mdl['buttons']);

				$usr = new Usr();
				$sidemenu = $usr->menuAuth($args['username'], $mdl['sidemenu'], 'sidemenu');
				$ftrmenu = $usr->menuAuth($args['username'], $mdl['footermenu'], 'footermenu');				

				return [
					'type' => 'html',
					'body' => $this->page_exec($args['idiom'], 'desktop', [
						'desktop' => $mdl['desktop'],			// Static structure for page
						'usermenu' => $mdl['usermenu'],			// ""
						'sidemenu' => $sidemenu,			// ""
						'footermenu' => $ftrmenu,		// ""
						'component' => json_encode([
							'breadcrumbs' => $mdl['breadcrumbs'],
							'buttons' => $mdl['buttons'],
							'dashboard' => $mdl['dashboard']
						]),										// Current component
						'jwt' => $args['request']['token'],		// From user record
						'action' => 'dashboard',				// Name of the component
						'cfg' => F::get('cfg'),					// Pass copy of config file to Javascript
						'lstr' => Cliq::lstr(),					// Pass copy of language translations to Javascript
						'username' => $args['username'],		// Admin username e.g. admin
						'avatar' => Cliq::fAvatar($args['username'])
					]),
					'code' => 200,
				];

		    } catch (Exception $e) {
				return $this->api_exec([
					'html' => $e->getMessage(),
					'action' => 'error',
				]);
		    }
		 }

		/** datagrid()
		 * Datagrid
		 * Loads a Bootstrap-Table-Vue
		 * @param - array - primarily the request
		 * @return - Any HTML plus JSON to create a Datagrid
		 * */
		 function datagrid($args)
		 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            isset($args['table']) ? $table = $args['table'] : $table = "" ;
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $idioms = $cfg['site']['idioms'];

				$mdl = F::stdModel('datagrid', $table, $tabletype);

				// Extend for each on language - breadcrumbs - text and buttons	- text	etc.
				$mdl['breadcrumbs']	= Cliq::extend($mdl['breadcrumbs']);
				$mdl['buttons']	= Cliq::extend($mdl['buttons']);
				$mdl['columns']	= Cliq::extend($mdl['columns'], 'title');
				$mdl['contextmenu']	= Cliq::extend($mdl['contextmenu'], 'name');

				// Bootstrap-table-Vue Component Template
				$html = '<bootstrap-table id="datagrid"  v-bind:columns="columns" v-bind:data="data" v-bind:options="options"></bootstrap-table>';

				// Recordset
				$db = new Db();
				$opts = [
					'table' => $table,	// the table - dbcollection or dbitem etc
					'idiom' => $lcd, 	// this language code or false = all language recs as an array			
				];
				array_key_exists('type', $mdl['database']) ? $opts['filter'] = ['c_type' => $mdl['database']['type']]: null ; // single or multiple filter
				array_key_exists('orderby', $mdl['database']) ? $opts['orderby'] = [$mdl['database']['orderby'], 'ASC']: null ; // only single so far supported, not sure if two will ever be needed ....
				// 'limit' => [10, 0], 	// limit, offset

				$flds = [];
				foreach($mdl['columns'] as $n => $fld) {
					$flds[$fld['field']] = $fld;
				}
				$res = $db->getRecordset($opts, $flds);

				if($res['flag'] == 'NotOk') {
					throw new Exception('Database error: '.$res['msg']);
				}
				$rs = $res['data'];

				$data = [
					'columns' => $mdl['columns'],
					'options' => $mdl['options'],
					'data' => $rs,
					'cmenu' => $mdl['contextmenu']
				];

				return $this->api_exec([
					'html' => $html,							// Html for component
					'component' => [							// Current component structure
						'breadcrumbs' => $mdl['breadcrumbs'],
						'buttons' => $mdl['buttons'],
					],	
					'options' => $mdl,							
					'data' => $data,							// Data for the component
					'action' => 'datagrid',						// Name of the component
				]);

		    } catch (Exception $e) {
				return $this->api_exec([
					'html' => $e->getMessage(),
					'action' => 'error',
				]);
		    }
		 }

		/** datatree()
		 * Implements the treegrid extension to Bootstrap-Tables
		 * @param - array - primarily the request
		 * @return - Any HTML plus JSON to create a Datagrid
		 * */
		 function datatree($args)
		 {

			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            isset($args['table']) ? $table = $args['table'] : $table = "" ;
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $idioms = $cfg['site']['idioms'];

				$mdl = F::stdModel('datatree', $table, $tabletype);

				$mdl['data'] = [];

				return $this->api_exec([
					'html' => '',
					'data' => $mdl,
					'xtras' => [],
					'action' => 'datatree',
				]);

		    } catch (Exception $e) {
				return $this->api_exec([
					'html' => $e->getMessage(),
					'action' => 'error',
				]);
		    }
		 }

		/** datatable()
		 * Implements the Datatables.Net Datatable
		 * Loads a Datatable and the data is fetched by AJAX
		 * @param - array - primarily the request
		 * @return - Any HTML plus JSON to create a Datagrid
		 * */
		 function datatable($args)
		 {

		 	$fp = FirePHP::getInstance(true);
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            isset($args['table']) ? $table = $args['table'] : $table = "" ;
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $idioms = $cfg['site']['idioms'];

				$mdl = F::stdModel('datatable', $table, $tabletype);

				// Extend for each on language - breadcrumbs - text and buttons	- text	etc.
				$mdl['breadcrumbs']	= Cliq::extend($mdl['breadcrumbs']);
				$mdl['buttons']	= Cliq::extend($mdl['buttons']);

				$itembuttons = "";
				foreach($mdl['itembuttons'] as $action => $label) {
					$itembuttons .= H::button(['class' => 'btn btn-link btn-sm ml-0 pl-0', 'type' => 'button', 'v-on:click' => $action.'($event, itm)'], Cliq::cStr($label));
				}

				$html = H::div(['class' => 'container-fluid', 'id' => 'datatable'], 
					// ?? Search box??

					// This will be the Vue repeating row
					H::div(['class' => 'd-flex row'],
						H::ul(['class' => 'list-group w-100'],
							// list-group-item-primary
							H::li(['class' => 'list-group-item mb-2 list-group-item-action flex-column align-items-start w-100', 'v-for' => '(itm, idx) in rows'],
								H::div(['class' => 'd-flex w-100 justify-content-between'],

									// Left
									H::div(['class' => 'd-flex'],
										// Left - Image
										H::div(['class' => 'col-sm-3'],
											H::img(['v-bind:src' => 'itm.d_image', 'class' => 'ml-0 mr-2', 'style' => 'max-height: 140px; max-width: 160px;'])
										),
										// Right - Text
										H::div(['class' => 'col-sm-9'],
											H::h5(['class' => ''], '{{itm.d_title}}'),
											H::p(['class' => ''], '{{itm.d_summary}}')
										)

									),

									// Right
									H::div(['class' => 'ml-2'],
										H::div(['class' => 'btn-group', 'role' => 'group', 'aria-label' => 'News article actions'], $itembuttons),
										H::p(['class' => 'text-muted text-sm'], 'Ref: {{itm.c_reference}}, '.Cliq::cStr('72:Author').': {{itm.d_author}}, '.Cliq::cStr('73:Date').': {{itm.d_date}}, '.Cliq::cStr('76:Tags').': {{itm.d_tags}}')
									)
								)
							)
						)
					),

					$this->paginationRow($mdl) 
                );

				return $this->api_exec([
					'html' => $html,							// Html for component
					'component' => [
						'breadcrumbs' => $mdl['breadcrumbs'],
						'buttons' => $mdl['buttons'],
					],	
					'options' => $mdl,							// Current component structure
					'data' => [],								// Empty Data for the component
					'action' => 'datatable',					// Name of the component
				]);

		    } catch (\Exception $e) {
				return $this->api_exec([
					'html' => $e->getMessage(),
					'action' => 'error',
				]);
		    }
		 }

		/** datacard()
		 * Implements a Bootstrap Cards/Panels display for data, animated with Vue
		 * @param - array - primarily the request
		 * @return - Any HTML plus JSON to create a Datagrid
		 * */
		 function datacard($args)
		 {

			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            isset($args['table']) ? $table = $args['table'] : $table = "" ;
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $idioms = $cfg['site']['idioms'];

				$mdl = F::stdModel('datacard', $table, $tabletype);


				// $this->paginationRow($mdl) 


				$mdl['data'] = [];

				return $this->api_exec([
					'html' => '',
					'data' => $mdl,
					'xtras' => [],
					'action' => 'datacard',
				]);

		    } catch (Exception $e) {
				return $this->api_exec([
					'html' => $e->getMessage(),
					'action' => 'error',
				]);
		    }
		 }

		/** calendar()
		 * Implements either the Fullcalendar or DHTMLXScheduler
		 * @param - array - primarily the request
		 * @return - Any HTML plus JSON to create a Datagrid
		 * */
		 function calendar($args)
		 {

		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            isset($args['table']) ? $table = $args['table'] : $table = "" ;
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $idioms = $cfg['site']['idioms'];

				$mdl = F::stdModel('calendar', $table, $tabletype);

				// Extend for each on language - breadcrumbs - text and buttons	- text	etc.
				$mdl['breadcrumbs']	= Cliq::extend($mdl['breadcrumbs']);
				$mdl['buttons']	= Cliq::extend($mdl['buttons']);
				$mdl['eventbuttons']	= Cliq::extend($mdl['eventbuttons'], 'name');

				$calendar = H::div(['id' => 'fullcalendar', 'class' => '', 'style' => 'position:relative; z-index: 1;']);

				return $this->api_exec([
					'html' => $calendar,						// Html for component
					'component' => [
						'breadcrumbs' => $mdl['breadcrumbs'],
						'buttons' => $mdl['buttons']
					],											// Current component structure
					'options' => $mdl,							// Data for the component
					'action' => 'calendar',						// Name of the component
				]);

		    } catch (Exception $e) {
				return $this->api_exec([
					'html' => $e->getMessage(),
					'action' => 'error',
				]);
		    }
		 }

		/** gallery()
		 * Implements Bootstrap Card Columns
		 * @param - array - primarily the request
		 * @return - Any HTML plus JSON to create a Datagrid
		 * */
		 function gallery($args)
		 {

		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            isset($args['table']) ? $table = $args['table'] : $table = "" ;
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $idioms = $cfg['site']['idioms'];

				$mdl = F::stdModel('gallery', $table, $tabletype);

				// Extend for each on language - breadcrumbs - text and buttons	- text	etc.
				$mdl['breadcrumbs']	= Cliq::extend($mdl['breadcrumbs']);
				$mdl['buttons']	= Cliq::extend($mdl['buttons']);
				$mdl['contextmenu']	= Cliq::extend($mdl['contextmenu'], 'name');

                $html = '
                <style>
					.card-columns {

					  	@include media-breakpoint-only(sm) {
					    	column-count: 3;
					  	}
					  	@include media-breakpoint-only(md) {
					    	column-count: 6;
					  	}						
					  	@include media-breakpoint-only(lg) {
					    	column-count: 9;
					  	}
					  	@include media-breakpoint-only(xl) {
					    	column-count: 12;
					  	}
					}
                </style>
                ';

				$html .= H::div(['class' => 'container-fluid', 'id' => 'datagallery'], 
					// ?? Search box??
					
					H::div(['class' => 'd-flex'],
						H::div(['class' => 'card-columns'],
							H::div(['class' => 'card', 'v-for' => '(itm, idx) in rows', 'v-bind:id' => 'itm.id'],
								H::img(['class' => 'card-img-top', 'v-bind:src' => 'itm.d_image', 'v-bind:alt' => 'itm.d_title']),
								H::div(['class' => 'card-body'],
									H::h5(['class' => 'card-title'], '{{itm.d_title}}'),
									H::p(['class' => 'card-text'], '{{itm.d_summary}}'),
									H::p(['class' => 'card-text'],
										H::small(['class' => 'text-muted'], 'Id: {{itm.id}}'),
										H::small(['class' => 'text-muted'], 'Reference: {{itm.c_reference}}'),
									)
								)
							)
						)
					),

					$this->paginationRow($mdl) 
                );

				$data = [
					'cmenu' => $mdl['contextmenu']
				];

				return $this->api_exec([
					'html' => $html,							// Html for component
					'component' => [
						'breadcrumbs' => $mdl['breadcrumbs'],
						'buttons' => $mdl['buttons'],
					],	
					'options' => $mdl,									// Current component structure
					'data' => $data,								// Empty Data for the component
					'action' => 'gallery',					// Name of the component
				]);

		    } catch (\Exception $e) {
				return $this->api_exec([
					'html' => $e->getMessage(),
					'action' => 'error',
				]);
		    }
		 }

	/** Other Admin data display functions
	 * 
	 * textEditor() - uses Summernote
	 * jsonEditor() - uses JSONEditor
	 * codeEditor() - uses CodeMirror
	 * model() - uses Fancytree and CodeMirror
	 *
	 *************************************************************************************************************************************/

		/** textEditor()
		 * @param - array - primarily the request
		 * @return - Any HTML plus JSON
		 * */
		 function textEditor(array $args)
		 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            isset($args['table']) ? $table = $args['table'] : $table = "" ;
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $idioms = $cfg['site']['idioms'];
	            $rq = $args['request'];

	            // $html is a tabset by language with a textarea and content for each language

            	$sql = "SELECT * FROM ".$table." WHERE id = ?";
                $row = R::getRow($sql, [$rq['recid']]);
                $doc = $row['c_document'];
                $docarray = json_decode($doc, true);
                $title = $docarray['d_title'][$lcd];
                $txt = $docarray['d_text'];

                $tabs = ""; $content = "";
                foreach($idioms as $lcdcode => $lcdname) {
					
					// Tab
					if($lcdcode === $lcd) {
						$tabs .= H::a(['class' => 'nav-item nav-link active', 'id' => 'nav-'.$lcdcode.'-tab', 'data-toggle' => 'tab', 'href' => '#nav-'.$lcdcode, 'role' => 'tab', 'aria-controls' => 'nav-'.$lcdcode, 'aria-selected' => 'true'], $lcdname);

						// Content
						$content .= H::a(['class' => 'tab-pane fade show active', 'id' => 'nav-'.$lcdcode, 'role' => 'tabpanel', 'aria-labelledby' => 'nav-'.$lcdcode.'-tab'], 
							H::textarea(['class' => 'form-control maxwidth maxheight', 'id' => 'texteditor_'.$lcdcode], $txt[$lcdcode])
						);
					} else {
						$tabs .= H::a(['class' => 'nav-item nav-link', 'id' => 'nav-'.$lcdcode.'-tab', 'data-toggle' => 'tab', 'href' => '#nav-'.$lcdcode, 'role' => 'tab', 'aria-controls' => 'nav-'.$lcdcode], $lcdname);

						// Content
						$content .= H::a(['class' => 'tab-pane fade', 'id' => 'nav-'.$lcdcode, 'role' => 'tabpanel', 'aria-labelledby' => 'nav-'.$lcdcode.'-tab'], 
							H::textarea(['class' => 'form-control maxwidth maxheight', 'id' => 'texteditor_'.$lcdcode], $txt[$lcdcode])
						);
					}
	
                }

                $html = H::nav([],
                	H::div(['class' => 'nav nav-tabs', 'id' => 'nav-tab', 'role' => 'tablist'], $tabs)
                );

                $html .= H::div(['class' => 'tab-content', 'id' => 'nav-tabContent'], $content);


				$data = [
					'html' => $html,
					'title' => $title
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

	 	/** saveContent()
	 	 *
	 	 * @param - array - usual arguments
	 	 * @return - Ok plus HTML or NotOk plus msg
	 	 **/
	 	 function saveContent(array $args)
	 	 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            isset($args['table']) ? $table = $args['table'] : $table = "" ;
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
                $idioms = $cfg['site']['idioms'];
                $rq = $args['request'];

                $fp->fb($rq);

                if( (!is_array($rq)) or (count($rq) < 1) ) {
                    throw new Exception("No request array: ".printf($args));
                }  

                $db = new Db();
                $fld = $rq['field'];

                if($rq['useidiom'] == '1') {
					$val = [];
                	foreach($idioms as $lcdcode => $lcdname) {
                		$val[$lcdcode] = $rq[$fld.'_'.$lcdcode];
                	}
                } else {
                	$val = $rq[$fld];
                }
 
	 			$result = $db->writeVal($table, $rq['recid'], $val, $fld, false, false);

	 			if(is_numeric($result) and $result > 0) {
					return [
						'type' => 'json',
						'code' => 200,
						'body' => ['flag' => 'Ok', 'msg' => Cliq::cStr('81:Record updated successfully')],
						'encode' => true
					];	 				
	 			} else {
	 				throw new Exception(Cliq::cStr('82:Record was not successfully written to database').': '.$result);
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

	 	/** codeEditor() - needs converting
	 	 *
	 	 * @param - array usual arguments
	 	 * @return - Ok plus HTML or NotOk plus msg
	 	 **/
	 	 function codeEditor(array $args)
	 	 {
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                
                $cfg = F::get('cfg'); $lcd = $args['idiom'];
                $idioms = $cfg['site']['idioms'];
                $this->rq = $args['request'];
                if( (!is_array($this->rq)) or (count($this->rq) < 1) ) {
                    throw new Exception("No request array: ".printf($args));
                }  
                $this->lcd = $args['idiom'];

                $sql = "SELECT * FROM ".$this->rq['table']." WHERE id = ?";
                $row = R::getRow($sql, [$this->rq['recid']]);
                $doc = $row['c_document'];
                $docarray = json_decode($doc, true);
                $hlp = $docarray['d_text'];
                $html = $hlp[$this->lcd];

                if($html == '') {
                	return [
                		'flag' => 'Ok',
                		'html' => H::div(['class' => 'p-3 h5'], Cliq::cStr('')),
                		'title' => $this->rq['recid']
                	];
                } else {
                	return [
                		'flag' => 'Ok',
                		'html' => H::div(['class' => 'p-2'], 
                			H::textarea(['class' => 'form-control maxwidth maxheight'], $html)
                		),
                		'title' => $row['c_reference']
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

	 	/** jsonEditor() - needs converting
	 	 *
	 	 * @param - array usual arguments
	 	 * @return - Ok plus HTML or NotOk plus msg
	 	 **/
	 	 function jsonEditor(array $args)
	 	 {
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                
                $cfg = F::get('cfg'); $lcd = $args['idiom'];
                $idioms = $cfg['site']['idioms'];
                $this->rq = $args['request'];
                if( (!is_array($this->rq)) or (count($this->rq) < 1) ) {
                    throw new Exception("No request array: ".printf($args));
                }  
                $this->lcd = $args['idiom'];

                $sql = "SELECT * FROM ".$this->rq['table']." WHERE id = ?";
                $row = R::getRow($sql, [$this->rq['recid']]);
                $doc = $row['c_document'];
                $docarray = json_decode($doc, true);
                $json = json_encode($docarray['d_text']);

                if($json == '') {
                	return [
                		'flag' => 'Ok',
                		'html' => H::div(['class' => 'p-3 h5'], Cliq::cStr('570::Errow with activity')),
                		'title' => $this->rq['recid']
                	];
                } else {
                	return [
                		'flag' => 'Ok',
                		'html' => H::div(['id' => 'jsoneditor']),
                		'data' => $json,
                		'title' => $row['c_reference']
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

		/** model()
		 * Filetree amd Codeeditor
		 * @param - array - primarily the request
		 * @return - Any HTML plus JSON to create a Datagrid
		 * */
		 function model($args)
		 {

		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            $idioms = $cfg['site']['idioms'];

				$mdl = F::stdModel('model', '', '');
				// Extend for each on language - breadcrumbs - text and buttons	- text	etc.
				$mdl['breadcrumbs']	= Cliq::extend($mdl['breadcrumbs']);
				$mdl['buttons']	= Cliq::extend($mdl['buttons']);

				$data = [
					'filetree' => $mdl['filetree'],
					'codeeditor' => $mdl['codeeditor']
				];

				$html = H::div(['class' => 'container-fluid'], 
					H::div(['class' => 'row'],
						H::div(['class' => 'col-sm-4'],
							H::div(['class' => '', 'id' => 'filetree'], 
								H::h5(['class' => 'mb-2'],Cliq::cStr('58:List of config files'))
							)
						),
						H::div(['class' => 'col-sm-8'],
							H::div(['class' => ''],
								H::textarea(['id' => 'codeeditor', 'class' => 'form-control', 'style' => 'border: 0; resize:none;'])
							)
						)
					)
				);

				return $this->api_exec([
					'html' => $html,							// Html for component
					'component' => [
						'breadcrumbs' => $mdl['breadcrumbs'],
						'buttons' => $mdl['buttons'],
					],											// Current component structure
					'data' => $data,							// Data for the component
					'action' => 'model',						// Name of the component
				]);

		    } catch (Exception $e) {
				return $this->api_exec([
					'html' => $e->getMessage(),
					'action' => 'error',
				]);
		    }
		 }

		 /** fileTree()
		  * fileTree for model
		  *
		  * @param - array usual $args
		  * @return - array of data suitable for a fancy tree
		  **/
		 function fileTree($args)
		 {

		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            $idioms = $cfg['site']['idioms'];
				$result = $this->listModelFiles('models', '.cfg');

				return [
					'type' => 'json',
					'code' => 200,
					'body' => $result,
					'encode' => true
				];

		    } catch (Exception $e) {
				return [
					'type' => 'json',
					'code' => 500,
					'body' => $e->getMessage(),
					'encode' => true
				];
		    }
		 }

	        /** listModelFiles()
	         * 
	         * @param - string - path
	         * @param - string - pattern
	         * @return - string - Ok or NotOk flage or error message
	         * @todo - 
	         **/
	         function listModelFiles($path = '', $pattern = '*') {
	            
	            $tree = [];
	         	$fp = FirePHP::getInstance(true);	
	            $files = scandir($_SERVER['DOCUMENT_ROOT'].$path);
	            foreach($files as $f => $file) {
	                if (!in_array($file, array(".",".."))) {
	                    if(is_dir($path.DS.$file)) {
	                        $tree[] = ['title' => $file, 'key' => $file, 'folder' => true, 'children' => $this->listModelFiles($path.DS.$file, $pattern)];
	                    } else {
	                        if(stristr($file, 'cfg')) {
	                            $path = str_replace('//','/',$path);
	                            $tree[] = ['title' => $file, 'key' => $path.DS.$file];
	                        }
	                    } 
	                }
	            };
	            return $tree;
	         } 

			/** getModelFile()
			  * 
			  *
			  * @param - array usual $args
			  * @return - array of data suitable for a fancy tree
			  **/
			 function getModelFile($args)
			 {

			    $fr = FirePHP::getInstance(true);	
				$method = self::THISCLASS.'->'.__FUNCTION__.'()';
				try {

					$rq = $args['request'];
					$fn = $rq['filename'];
					$result = Files::readFile($fn);

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
						'body' => ['flag' => 'Ok', 'msg' => $e->getMessage()],
						'encode' => true
					];
			    }
			 }

			/** saveModelFile()
			  * 
			  *
			  * @param - array usual $args
			  * @return - array of data suitable for a fancy tree
			  **/
			 function saveModelFile($args)
			 {

			    $fp = FirePHP::getInstance(true);	
				$method = self::THISCLASS.'->'.__FUNCTION__.'()';
				try {

					$rq = $args['request'];
					$fdata = $rq['filedata'];

					// Saving an existing filetree derived file automatically includes 'models/', 
					// whereas we do not expect it with a new filename
					if(stristr($rq['filename'], 'models/') == false) {
						$fn = 'models/'.$rq['filename'];
					} else {
						$fn = $rq['filename'];
					}

					// Add an extension if one has not already been added
					if(stristr($fn, '.cfg') == false) {
						$fn .= '.cfg';
					}

					$result = Files::writeFile($fn, $fdata);

					$chkarray = Toml::parseFile($fn);

					if(is_array($chkarray)) {
						$msg = Cliq::cStr('65:Successfully saved the file to disk');
					} else {
						throw new \Exception($result);
					}

					return [
						'type' => 'json',
						'code' => 200,
						'body' => ['flag' => 'NotOk', 'msg' => $msg],
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

			/** checkModelFile()
			  * 
			  *
			  * @param - array usual $args
			  * @return - array of data suitable for a fancy tree
			  **/
			 function checkModelFile($args)
			 {

			    $fp = FirePHP::getInstance(true);	
				$method = self::THISCLASS.'->'.__FUNCTION__.'()';
				try {

					$rq = $args['request'];
					$fdata = $rq['filedata'];
					$fn = $rq['filename'];
					$chkarray = Toml::parse($fdata);

					if(is_array($chkarray)) {
						$msg = Cliq::cStr('64:TOML produces a valid array');
					} else {
						throw new \Exception($chkarray);
					}
					return [
						'type' => 'json',
						'code' => 200,
						'body' => ['flag' => 'NotOk', 'msg' => $msg],
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

	/** Data retrieval and dispatch methods
	 * 
	 * fetchData()
	 * fetchEvents()
	 * fetchRow()
	 *
	 *************************************************************************************************************************************/

	 	/** fetchData() - used by datatable, gallery 
	 	 *
	 	 * @param - array 
	 	 * @return - recordset
	 	 **/
	 	 function fetchData(array $args)
	 	 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            isset($args['table']) ? $table = $args['table'] : $table = "" ;
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $idioms = $cfg['site']['idioms'];
	            $rq = $args['request'];

	            $mdl = F::stdModel($rq['displaytype'], $table, $tabletype);

                // Include the orderby instruction
                if($rq['orderby'] != '') {
                    $ord = explode('|', $rq['orderby']);
                } else {
                    $ord = explode('|', $mdl['orderby']);
                }              

				// Collection by type
				$db = new Db();
				$opts = [
					'table' => $table,	// the table - dbcollection or dbitem etc
					'idiom' => $lcd, 	// this language code or false = all language recs as an array			
				];
				array_key_exists('type', $mdl['database']) ? $opts['filter'] = ['c_type' => $mdl['database']['type']]: null ; 

				$flds = [];
				foreach($mdl['columns'] as $n => $fld) {
					$flds[$fld['field']] = $fld;
				}
				$res = $db->getRecordset($opts, $flds);

				if($res['flag'] == 'NotOk') {
					throw new \Exception('Database error: '.$res['msg']);
				}
				$rs = $res['data'];       

                // Now we start to process this array 

                // Get total
                $tot = count($rs);

                // Include the search from the request
                $searchvals = [];
                if($rq['search'] != '') {
                    $s = explode('|', $rq['search']);
                    $searchvals[] = [$s[0], $s[1]];
                }; 
                $dta = Arrch::find(
                    $rs, // array of multidimensional arrays
                    $options = [
                        'where' => $searchvals
                    ],
                    $key = 'all' 
                ); 

				// Count the filtered result
                $filtr = count($dta);

                // Filter the recordset
                $recordset = Arrch::find(
                    $rs, // array of multidimensional arrays
                    $options =[
                        'where'         => $searchvals,
                        'limit'         => $rq['limit'],
                        'offset'        => $rq['offset'],
                        'sort_key'      => $ord[0], // dot notated array key or object property
                        'sort_order'    => strtoupper($ord[1]) // 'ASC' or 'DESC'
                    ],
                    $key = 'all' // 'all', 'first', 'last', an index of the $data array
                );

                if(count($recordset) <= 0) {
                	$recordset[] = $mdl['model'];
                	$tot = 1;
                	$filtr = 1;
                } // May need to improve result here

                $offset = +$rq['offset']+1;


                $records = [
                    'rows' => $recordset,
                    'records' => [
                        'offset' => $offset,		// say 10
                        'limit' => $rq['limit'], 	// say 20
                        'total' => $tot,			// say 50 - counts the original recordset
                        'filtered' => $filtr 		// say 40 - counts the recordset after it has been filtered by the Arrch find
                    ],
                    'search' => $rq['search'],
                    'where' => $searchvals,
                    'orderby' => $ord[0].'|'.$ord[1]
                ];

				return [
					'type' => 'json',
					'code' => 200,
					'body' => $records,
					'encode' => true
				];

		    } catch (Exception $e) {
				return [
					'type' => 'json',
					'code' => 500,
					'body' => $e->getMessage(),
					'encode' => true
				];
		    }
		 } 

		/** fetchEvents() - used by calendar 
		 *
		 * @param - array - usual args
		 * @return - recordset formatted in Full Calendar format
		 **/
		 function fetchEvents(array $args)
		 {
		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            isset($args['table']) ? $table = $args['table'] : $table = "" ;
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $idioms = $cfg['site']['idioms'];
	            $rq = $args['request'];

	            $mdl = F::stdModel('calendar', $table, $tabletype);

	            // Start the Calendar / Events specific SQL
	            $sql = "SELECT id, c_reference, c_category, c_document FROM ".$table." WHERE c_type = ?";
	            $collection = R::getAll($sql, [$tabletype]);

	            $evset = [];
	            for($c = 0; $c < count($collection); $c++) {
	            	$json = $collection[$c]['c_document'];
	            	$doc = json_decode($json, true);
	            	unset($collection[$c]['c_document']);
	            	$doc['d_datefrom'] = strtotime($doc['d_datefrom']);
	            	$doc['d_dateto'] = strtotime($doc['d_dateto']);
	            	$row = array_merge($collection[$c], $doc);
	            	$evset[$collection[$c]['id']] = $row;
	            }

	            // Test
	            // $fp->fb($evset);

	            // Now $evset is an extended array of all events in the system, now we have to use Arrch to filter the result
	            $rs = array_values(Arrch::find(
	            	$evset, [
	            		'where' => [
	            			['d_datefrom', '>=', strtotime($rq['d_datefrom'])],
	            			['d_dateto', '<=', strtotime($rq['d_dateto'])]
	            		],
	            		'limit' => 0,
	            		'offset' => 0,
	            		'sort_key' => 'd_datefrom',
	            		'sort_order' => 'ASC'
	            	], 'all'
	            ));

	            // Test
				// $fp->fb($rs);

				$records = [];
	            for($r = 0; $r < count($rs); $r++) {
	            	$row = [];

	            	$row['id'] = $rs[$r]['id'];
	            	$row['ref'] = $rs[$r]['c_reference'];
	            	$row['url'] = $rs[$r]['d_url'];	
	            	$row['location'] = $rs[$r]['d_location'];	            	

	            	$row['title'] = $rs[$r]['d_title'][$lcd];
	            	$row['summary'] = $rs[$r]['d_summary'][$lcd];  // goes to extended properties hash

	            	// All day 
	            	if($rs[$r]['d_dateto'] != $rs[$r]['d_datefrom']) {	
		            	$row['start'] = date('Y-m-d H:i', $rs[$r]['d_datefrom']);
		            	$row['end'] = date('Y-m-d H:i', $rs[$r]['d_dateto']);
	            	} else {
		            	$row['start'] = date('Y-m-d', $rs[$r]['d_datefrom']);
		            	$row['allDay'] = true;	            		
	            	}

					// Colours
	            	foreach($mdl['colors'] as $id => $colors) {
	            		if($rs[$r]['c_category'] == $id) {
							$row['backgroundColor'] = $colors['color'];
							$row['borderColor'] = $colors['color'];
							$row['textColor'] = $colors['textColor'];
	            		}
	            	}
	            	
					$records[] = $row; unset($row);            	
	            }

	            // test
	            $fp->fb($records);
				
				return [
					'type' => 'json',
					'code' => 200,
					'body' => $records,
					'encode' => true
				];

		    } catch (Exception $e) {
				return [
					'type' => 'json',
					'code' => 500,
					'body' => $e->getMessage(),
					'encode' => true
				];
		    }	 	
		 } 

		/** fetchRow()
		 *
		 * @param - array - usual args
		 * @return - formatted row of data
		 **/
		 function fetchRow(array $args) 
		 {

		    $fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			try {

				$cfg = F::get('cfg'); $lcd = $args['idiom'];
	            isset($args['table']) ? $table = $args['table'] : $table = "" ;
	            isset($args['tabletype']) ? $tabletype = $args['tabletype'] : $tabletype = "" ;
	            $idioms = $cfg['site']['idioms'];
	            $rq = $args['request'];

				// Row has to be formatted according to the Model before it can be sent back
				$dt = $this->stdModel($rq['displaytype'], $table, $tabletype);
				$flds = [];
				foreach($dt['columns'] as $n => $fld) {
					$flds[$fld['field']] = $fld;
				}				// Numeric array with 
				$vars = [
					'table' => $table,
					'filter' => ['id' => $rq['recid']],
					'idiom' => $lcd,
					'flds'	=> $flds
				];

				$db = new Db();
				$ret = $db->getRowSet($vars);

				if($ret['flag'] == 'Ok') {

					$result = [
						'action' => $action,
						'row' => $ret['data']
					];
					            
					return [
						'type' => 'json',
						'code' => 200,
						'body' => ['flag' => 'Ok', 'data' => $result],
						'encode' => true
					];

				} else {
					throw new \Exception('Reading a formatted row generated an error: '.$ret['msg']);
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

	/** Common and related utility functions
	 * 
	 * paginationRow()
	 *
	 *************************************************************************************************************************************/

		/** paginationRow()
		 *
		 * @param - array - Model
		 * @return - string - snippet of HTML
		 **/
		 protected function paginationRow(array $mdl) 
		 {

            // The pagelength dropdown
            $pageLengthOptions = "";
            foreach(explode(',',$mdl['lengthoptions']) as $q => $n) {
            	if($mdl['pagelength'] == $n) {
            		$pageLengthOptions .= H::option(['class' => '', 'selected' => true], $n);
            	} else {
            		$pageLengthOptions .= H::option(['class' => ''], $n);
            	}
            }

        	// Pagination row
        	return H::div(['class' => 'row d-flex', 'v-if' => 'records.filtered >= '.$mdl['pagelength']], // col-sm-12 col-md-3
        		H::div(['class' => 'col-sm-4', 'style' => 'display:inline;'], 
        			H::p(['class' => 'd-flex', 'style' => 'vertical-align: middle;'], 
        				Cliq::cStr('136:Records')
        				.'&nbsp;'
        				.H::select(['class' => 'form-control', 'id' => 'pageselect', 'style' => 'width: 80px;'], $pageLengthOptions)
        				.'&nbsp;'.Cliq::cStr('137:per page')
        			)
        		),
        		H::div(['class' => 'col-sm-4'], Cliq::cStr('138:Records {{records.offset}} to {{records.limit}} of {{records.filtered}} from {{records.total}}')),
        		H::div(['class' => 'col-sm-4'], 
        			H::nav(['aria-label' => 'Page navigation'],
        				H::ul(['class' => 'pagination pagination-sm justify-content-end', 'v-if' => 'pagination.totalPages > 1'],
        					
        					H::li([
        						'class' => 'page-item',
        						'v-if' => 'pagination.currentPage > 1',
        						], H::a(['class' => 'page-link', 'href' => '#'], '<<')
        					),
        					H::li([
        						'class' => 'page-item',
        						'v-if' => 'pagination.currentPage > 1',
        						], H::a(['class' => 'page-link', 'href' => '#'], '<')
        					),
        					H::li([
        						'v-for' => 'num in pagination.pages',
        						'class' => 'page-item',
        						':class' => '{active: (pagination.currentPage == num)}',  
        						'v-on:click' => 'changePage(num, pagination.currentPage)'
        						], H::a([
        							'class' => 'page-link', 
        							'href' => '#',
        							], '{{num}}')
        					),
        					H::li([
        						'class' => 'page-item',
        						'v-if' => 'pagination.endPage != pagination.currentPage',
        						], H::a(['class' => 'page-link', 'href' => '#'], '>')
        					),
        					H::li([
        						'class' => 'page-item',
								'v-if' => 'pagination.endPage != pagination.currentPage',
        						], H::a(['class' => 'page-link', 'href' => '#'], '>>')
        					)
        				)
        			)
        		)
        	);		 	
		 }

}

/*
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
*/
