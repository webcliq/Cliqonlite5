<?php
/**
 * Cliq Framework - Controller
 *
 * @category   Web application framework
 * @package    Cliq
 * @author     Original Author <support@cliqon.com>
 * @copyright  2020 Webcliq
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    Release: 1.0.1
 * @link       http://webcliq.com
 */

use \core\Files as Files;
use \core\Toml as Toml;
use \core\Engine as Cliq;

class Controller {
 	
 	const THISCLASS = "Controller";

	function __construct() {}
	function __destruct() {}

	// The only get will be the Install Page 
 	 function get() {

 		$fr = FirePHP::getInstance(true);	
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

			$fr->fb('Install loaded');			// Check it is working

			$vars = [
			    'protocol' => PROTOCOL,
			    'basedir' => SITE_PATH,
			    'viewpath' => HOST_PATH.'install/',
			    'idiom' => LCD,
			    'data' => $this->getData()
			];
			$tpl = 'install.tpl';   
			// Template engine
			$razr = new \template\Engine(new \template\FilesystemLoader([SITE_PATH.'install', SITE_PATH.'install', SITE_PATH.'admin']), SITE_PATH.'install/cache');
			echo $razr->render($tpl, $vars);

	    } catch (Exception $e) {
	    	$fr->fb($e->getMessage(), 'Get controller');
	    }
 	 }


 	function post() {
 		echo json_encode($this->dispatcher());
 	}

 	function get_xhr() {
 		echo json_encode($this->dispatcher());
 	}

 	function post_xhr() {
 		echo json_encode($this->dispatcher());
 	}

 	/** dispatcher()
 	 * 
 	 * */
 	 function dispatcher() {

 		// Depend on action in the request
 	 	$rq = $_REQUEST;
 	 	switch($rq['action']) {

 	 		case "checkdirectories": return $this->checkDirs($rq); break;
 	 		case "dbcreate": return $this->dbCreate($rq); break;
 	 		case "setidioms": return $this->idiomsCreate($rq); break;
 	 		case "adminuser": return $this->userCreate($rq); break;
 	 		case "getconfig": return $this->loadConfig(); break;
 	 		case "setconfig": return $this->saveConfig($rq); break;
 	 		case "complete": return $this->completeInstall($rq); break;
 	 	}
 	 }

	/** getData()
	 * 
	 * @return - array - data
	 * */
	 protected function getData()
	 {
	 	$fr = FirePHP::getInstance(true);
		try{

			// Read in and decode config file
	        $te = new core\TomlEncoder(); 
	        $fp = "install/i18n/data_".LCD.".toml";
	        $tomlstr = Files::readFile($fp);
	        $dta = $te->toml_decode($tomlstr, '');
	        if(!count($dta) > 0) {
	        	throw new Exception('No Toml');
	        }
			return $dta;

		} catch(Exception $e) {
			$fr->fb($e->getMessage());
		}
	 }

	/** checkDirs()
	 * 
	 * @return - array - data
	 * */
	 protected function checkDirs(array $rq) 
	 { 

	 	$fr = FirePHP::getInstance(true);
		try {

			$html = "";
			$dirs = ['config', 'cache', 'data', 'docs', 'log', 'models', 'public/uploads', 'tmp'];
			foreach($dirs as $dir) {

				$html .= 'The directory ' . $dir .'/';

				if(is_dir(SITE_PATH.$dir) == true) {

					$html .= ' exists ';
					if(is_writeable(SITE_PATH.$dir) == true) {
						$html .= ' <span style="color: green;" >and is writeable</span>';
					} else {
						$html .= ' <span style="color: red;" >but is not writeable</span>';
					}

				} else {
					$html .= ' <span style="color: red;" >does not exists ! </span>';
				}

				$html .= '<br>';
			}

			return ['flag' => 'Ok', 'msg' => $html];

		} catch(Exception $e) {
			$fr->fb($e->getMessage());			
			return ['flag' => 'NotOk', 'msg' => $e->getMessage()];
		}
	 }	

	/** dbCreate()
	 * 
	 * @return - array - data
	 * */
	 protected function dbCreate(array $rq) 
	 { 

	 	$fr = FirePHP::getInstance(true);
		try{

		 	$dbcfg = [
		 		'type' => $rq['connectiontype'],
		 		'dbname' => $rq['dbname'],
		 		'username' => $rq['dbuser'],
		 		'password' => $rq['dbpassword'],
		 		'server' => $rq['dbserver'],
		 		'port' => $rq['dbport']
		 	];	

			require_once SITE_PATH.'framework/Rb.php';

			switch($dbcfg['type']){
			    
			    case"mysql":
			    case"pgsql":    

			        R::setup($dbcfg['type'].':host='.$dbcfg['server'].';dbname='.$dbcfg['dbname'],$dbcfg['username'],$dbcfg['password']);
			        R::useWriterCache(true); 
			        R::useJSONFeatures(true);

			        $toml = "
		        		charset = 'utf8'
		        		type = '".$dbcfg['type']."'
		        		dbname = '".$dbcfg['dbname']."'
		        		username = '".$dbcfg['username']."'
		        		password = '".$dbcfg['password']."'
		        		server = '".$dbcfg['server']."'
		        		port = '".$dbcfg['port']."'
			        ";

					// R::debug(true);
					// Setup the tables

					$tbls = ['dbcollection', 'dbitem', 'dbuser', 'dblog', 'dbtransaction', 'dbindex', 'dbcatalog', 'dbcompany', 'dbcontact', 'dbadvert', 'dbbanner'];
					foreach($tbls as $tbl) {
						
						$fr->fb($tbl);
						// Got to SQLite

							R::addDatabase( 'SQLITE', 'sqlite:/install/data/cliqonlite.sqlite', 'usr', 'pss');
							R::selectDatabase('SQLITE');

							$sql = "SELECT FROM ".$tbl;
							$rs = R::getAll($sql);

						// Go back to default

							R::selectDatabase('default');

						// Then write the records to the new database

							for($r = 0; $r < count($rs); $r++) {
								$row = $rs[$r];
								$upd = R::dispense($tbl);
								foreach($row as $fld => $val) {
									$upd->$fld = $val;
								}
								$id = R::store($upd);
							}
					}

					// R::debug(false);
					
			    break;

			    case"sqlite":

			    	if(R::hasDatabase($dbcfg['dbname']) != true) {
				    	R::addDatabase($dbcfg['dbname'], 'sqlite:'.SITE_PATH.'data/'.$dbcfg['dbname'].'.sqlite'); 
				    	R::selectDatabase($dbcfg['dbname']);
			    	}

			        R::setup('sqlite:'.SITE_PATH.'data/'.$dbcfg['dbname'].'.sqlite');

			        $toml = "
		        		type = 'sqlite'
		        		dbname = '".$dbcfg['dbname']."'
			        ";

			        $fn = $dbcfg['dbname'].'.sqlite';
			        $currdir = "install/data/";
			        $newdir = "data/";
			        Files::moveFile($fn, $currdir, $newdir);			        

			    break;
			}

			// Write the connection to disk

				$fp = 'config/db.cfg';
				$status = Files::writeFile($fp, $toml);
				$fr->fb($status);

			return ['flag' => 'Ok', 'msg' => 'Tables created in database'];

		} catch(Exception $e) {
			$fr->fb($e->getMessage());			
			return ['flag' => 'NotOk', 'msg' => $e->getMessage()];
		}
	 }

	/** idiomsCreate()
	 * 
	 * @return - array - data
	 * */
	 protected function idiomsCreate(array $rq) 
	 { 

	 	$fr = FirePHP::getInstance(true);
		try {

			// Read in the Config.Txt and convert to an array
				$cfg = Toml::parseFile(SITE_PATH.'install/config.txt');

			// Update the config array with the Idioms
				foreach($rq as $n => $str) {
					if($n != 'action') { // And therefore is definitely is a language
						$idm = json_decode($str, true);
						$fr->fb($idm);
						$cfg['site']['idioms'][$idm['idmcode']] = $idm['idmname'];
						$cfg['site']['idiomflags'][$idm['idmcode']] = $idm['idmflag'];
					}
				}

			// Convert the $cfg array back to TOML
				$te = new core\TomlEncoder(); 
				$toml = $te->toml_encode($cfg);

			// Write the languages to Config.Txt
				$fp = 'install/config.txt';
				$status = Files::writeFile($fp, $toml);
				$fr->fb($status);
			
			return ['flag' => 'Ok', 'msg' => 'Config updated with Languages'];

		} catch(Exception $e) {
			$fr->fb($e->getMessage());			
			return ['flag' => 'NotOk', 'msg' => $e->getMessage()];
		}
	 }	

	/** userCreate()
	 * 
	 * @return - array - data
	 * */
	 protected function userCreate(array $rq) 
	 { 

	 	$fr = FirePHP::getInstance(true);
		try {

			// Read in the Config.Txt and convert to an array
				$cfg = Toml::parseFile(SITE_PATH.'install/config.txt');
				$cfg['site']['secret'] = $rq['sitesecret'];

			// Convert the $cfg array back to TOML
				$te = new core\TomlEncoder(); 
				$toml = $te->toml_encode($cfg);		

			// Write the Secret key to Config.Txt
				$fp = 'install/config.txt';
				$status = Files::writeFile($fp, $toml);
				$fr->fb($status);

			// Now admin user written to the database

				require_once SITE_PATH.'framework/Rb.php';
				$dbcfg = Toml::parseFile(SITE_PATH.'config/db.cfg');

				switch($dbcfg['type']){
				    
				    case"mysql":
				    case"pgsql":
				    	
				        R::setup($dbcfg['type'].':host='.$dbcfg['server'].';dbname='.$dbcfg['dbname'],$dbcfg['username'],$dbcfg['password']);
				        R::useWriterCache(true); 
				        R::useJSONFeatures(TRUE);
				    break;

				    case"sqlite":
				    	if(R::hasDatabase($dbcfg['dbname']) != true) {
					    	R::addDatabase($dbcfg['dbname'], 'sqlite:'.SITE_PATH.'data/'.$dbcfg['dbname'].'.sqlite'); 
					    	R::selectDatabase($dbcfg['dbname']);
				    	}
				        R::setup('sqlite:'.SITE_PATH.'data/'.$dbcfg['dbname'].'.sqlite');
				    break;

				}

				$q = new Cliq();

				$doc = [
					'd_username' => 'Administrator',
					'd_comments' => 'Created automatically',
					'd_email' => $rq['admemail'],
					'd_apikey' => $rq['sitesecret']
				];
				$json = json_encode($doc);

				$upd = R::dispense('dbuser');
				$upd->c_username = $rq['admuser'];
				$upd->c_password = $q->encryptData($rq['admpassword'], $rq['sitesecret']);
				$upd->c_category = 'webmaster';
				$upd->c_type = 'admin';
				$upd->c_document = $json;
				$upd->c_notes = 'Created by the Install process';

				$result = R::store($upd);

			return ['flag' => 'Ok', 'msg' => 'Admin user and Secret key created: '.$result];

		} catch(Exception $e) {
			$fr->fb($e->getMessage());			
			return ['flag' => 'NotOk', 'msg' => $e->getMessage()];
		}
	 }	

	/** loadConfig()
	 *
	 * @return
	 **/
	 protected function loadConfig()
	 {
	 	$fr = FirePHP::getInstance(true);
		try {

			$fp = 'install/config.txt';
			$txt = Files::readFile($fp);
			return ['flag' => 'Ok', 'msg' => $txt];

		} catch(Exception $e) {
			$fr->fb($e->getMessage());			
			return ['flag' => 'NotOk', 'msg' => $e->getMessage()];
		}			
	 }

	/** saveConfig()
	 *
	 * @return
	 **/
	 protected function saveConfig(array $rq)
	 {
	 	$fr = FirePHP::getInstance(true);
		try {

			// Write the Configuration file to Config.Txt in /install
				$fp = 'install/config.txt';
				$status = Files::writeFile($fp, $rq['configuration']);
				$fr->fb($status);

			return ['flag' => 'Ok', 'msg' => 'Configuration file saved: '.$status];

		} catch(Exception $e) {
			$fr->fb($e->getMessage());			
			return ['flag' => 'NotOk', 'msg' => $e->getMessage()];
		}	
	 }

	/** completeInstall()
	 *
	 * @return
	 **/
	 protected function completeInstall(array $rq)
	 {
	 	$fr = FirePHP::getInstance(true);
		try {

			// Write the Configuration file to Config.Cfg in /config
				$fp = 'config/config.cfg';
				$status = Files::writeFile($fp, $rq['configuration']);
				$fr->fb($status);

			return ['flag' => 'Ok', 'msg' => 'Production Configuration file created: '.$status];

		} catch(Exception $e) {
			$fr->fb($e->getMessage());			
			return ['flag' => 'NotOk', 'msg' => $e->getMessage()];
		}	
	 }

}

