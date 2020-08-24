<?php
/**
 * Cliq Framework - Base Controller
 * 
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
use \core\Db as Db;
use \core\Jwt as Jwt;
use \core\Log as Log;
use \Framework as F;
use \Firephp;
use \R;

class Controller extends \Framework {
	
	public $params;
	const THISCLASS = 'Controller';

	// Modules executed in Class Admin
	public $admmodules = [
		'desktop', 'datatable', 'datagrid', 'model', 'filetree', 'getmodelfile', 'savemodelfile', 'checkmodelfile', 'texteditor', 'codeeditor', 'jsoneditor', 'fetchdata', 'savecontent', 'calendar', 'fetchevents', 'gallery', 'fetchimages', 'fetchrow'
	];

	// Modules executed in Class User
	public $usrmodules = [
		'login', 'dologin', 'currentuser', 'changepassword',
	];

	// Modules executed by the App Class
	public $appmodules = [
		'',  
	];

	// Functions executed in Database Class
	public $dbmodules = [
		'doimportdata', 'deleterecord','getvalue', 'savevalue'
	];

	// Functions executed in Utility Class
	public $utilitymodules = [
		'clearcache', 'settings', 'iframe', 'importstrings', 'updateacl', 'updateapikey', 'maintainidiom', 'deleteidiom', 'addnewidiom', 'checkmissing', 'doimportidiom', 'doexportidiom', 'doimportdata', 'doexportdata', 'dodumpdata',
	];

	// Functions executed in Form Class
	public $formmodules = [
		'winform', 'inlineform', 'columnform', 'pageform', 'postform', 'getnextref', 'isunique', 'getnextid', 'getnextentry', 'autocomplete'
	];

	// Functions executed in Report Class, covering View as well in Cliqonlite
	public $reportmodules = [
		'publishreport', 'publishview', 'winview', 'displayhelp', 'viewarticle',
	];

	// Functions executed in Log Class
	public $logmodules = [
		'deletelogrecords', 'deletelogbefore', 'clearlogs', 'datalog', 'logdata',
	];

	public $pluginmodules = [
		'hook', 
	];

	function __construct() {
		parent::__construct();
	}

	/** Api magic methods and module display functions
	 * 
	 * __call()
	 * __callStatic()
	 *
	 ****************************************************************************************************************/

		/**
		 * Cheating supreme to reduce number of individual execs
		 * The advantage being that we can use this "override" to allow for a number of classes plus plugins
		 * @param - string - name of called function, in our case the name of the controller
		 * @param - arguments to pass on
		 * */
		public function __call($name, $args) 
		{
			$fp = FirePHP::getInstance(true);	
			$method = self::THISCLASS.'->'.__FUNCTION__.'()';
			$vars = $args[0];

			try {

				// if($name == 'str') {	return self::notag($tag, $args); };

				// Testing
				if(array_key_exists('token', $vars['request'])) {
					$token = $vars['request']['token'];
					$cfg = F::get('cfg');
					$secret = $cfg['site']['secret'];
					$username = Jwt::decode($token, $secret, ['HS256']);
					$this->user = $username;
					$vars['username'] = $username;
				}

				// Return Mixed
				$adms = array_flip($this->admmodules);		// Administration
				$usrs = array_flip($this->usrmodules);		// User login, logout registration etc.
				$frms = array_flip($this->formmodules);		//
				$rpts = array_flip($this->reportmodules);	//
				$logs = array_flip($this->logmodules);		//	
				$plugins = array_flip($this->pluginmodules);		//				
				$apps = array_flip($this->appmodules);		// 
				$dbs = array_flip($this->dbmodules);		// 
				$utls = array_flip($this->utilitymodules);	// 

				$lcd = $vars['idiom'];

				// App
				if(array_key_exists($name, $apps)) {
					$app = new \app\App();
					$arr = $app->$name($vars);	
				// User
				} else if(array_key_exists($name, $usrs)) {
					$usr = new \core\User();
					$arr = $usr->$name($vars);	
				// Admin
				} else if(array_key_exists($name, $adms)) {
					$adm = new \app\Admin();
					$arr = $adm->$name($vars);	
				// Database
				} else if(array_key_exists($name, $dbs)) {
					$db = new \core\Db($lcd);
					$arr = $db->$name($vars);	
				// Any Plugin
				} else if(array_key_exists($name, $plugins)) {
					$plg = new \app\Plugin();
					$arr = $plg->$name($vars);	
				// Utilities					
				} else if(array_key_exists($name, $utls)) {
					$util = new \core\Utility();
					$arr = $util->$name($vars);	
				// Form
				} else if(array_key_exists($name, $frms)) {
					$frm = new \core\Form();
					$arr = $frm->$name($vars);	
				// Report and View
				} else if(array_key_exists($name, $rpts)) {
					$rpt = new \core\Report();
					$arr = $rpt->$name($vars);
				// Log
				} else if(array_key_exists($name, $logs)) {
					$log = new \core\Log();
					$arr = $log->$name($vars);
				} else if($name == 'img') {
					$img = new \core\Media();
					$arr = $img->get($vars);
				} else {
					// 404
					$msg = new \app\App();
					return $msg->notfound($name, $vars);	
				}

				if(!array_key_exists('error', $arr)) {
					return $arr;
				} else {
					throw new Exception($arr['method']." produced error: ".$arr['errmsg']);
				}				

		    } catch (Exception $e) {
				$err = new \app\App();
				return $err->errorpage( $e->getMessage() );	
	        }
	    }

	/** A couple of defaults
	 * not handled by the dynamic _call();
	 * defaultpage()
	 * error()
	 * notfound()
	 *
	 ****************************************************************************************************************/

		function defaultpage($vars)
		{
			try {
				$app = new \app\App();
				return [
					'type' => 'html',
					'body' => $app->defaultpage($vars),
					'code' => 200,
				];
		    } catch (Exception $e) {
				return [
					'type' => 'html',
					'body' => $e->getMessage(),
					'code' => 200,
				];
	        }
		}	

		function errorpage($vars)
		{
			$app = new \app\App();
			return [
				'type' => 'html',
				'body' => $app->errorpage($vars),
				'code' => 200,
			];
			
		}	

		function notfound($vars)
		{
			$app = new \app\App();
			return [
				'type' => 'html',
				'body' => $app->notfound($vars),
				'code' => 200,
			];
			
		}
}