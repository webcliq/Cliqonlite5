<?php
/**
 * Cliq Framework - User
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
use \core\Jwt as Jwt;
use \core\Log as Log;
use \Framework as F;
use \Firephp;
use \R;

class User  extends Cliq {

	const THISCLASS = "User";
	const CLIQDOC = "c_document";
	
	function __construct() {}
	function __destruct() {}

	/** login()
	 * Login page
	 * @param - array - primarily the request
	 * @return - HTML page using login template
	 * */
	 function login($args)
	 {	
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

			return [
				'type' => 'html',
				'body' => $this->page_exec($args['idiom'], 'login', [
					'idiom' => $args['idiom'],
					'component' => [],
					'jwt' => '',						// Empty at the moment
					'action' => 'login',				// Name of the component
					'cfg' => F::get('cfg'),				// Pass copy of config file to Javascript
					'lstr' => Cliq::lstr(),				// Pass copy of language translations to Javascript
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

	/** doLogin()
	 * Login page
	 * @param - array - primarily the request
	 * @return - JSON with success or failure
	 * */
	 function doLogin($args)
	 {	
	    $fp = FirePHP::getInstance(true);	
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

			$cfg = F::get('cfg'); $lcd = $args['idiom'];
            $rq = $args['request'];
            $sql = "SELECT c_password FROM dbuser WHERE c_username = ?";
            $rawuserpassword = R::getCell($sql, [$rq['username']]);
            $fp->fb($rawuserpassword);
            $userpassword = Cliq::decryptData($rawuserpassword);
             $fp->fb($userpassword);
            if($userpassword == $rq['password']) {
				// No error with login, so generate a token
				$token = Jwt::encode($rq['username'], $cfg['site']['secret']);
				return [
					'type' => 'json',
					'code' => 200,
					'body' => ['data' => ['flag' => 'Ok', 'token' => $token, 'msg' => $rq['username']]],
					'encode' => true
				];
            } else {
            	// Error with Login
				return [
					'type' => 'json',
					'code' => 200,
					'body' => ['data' => ['flag' => 'NotOk', 'msg' => Cliq::cStr('209:Login failed')]],
					'encode' => true
				];            	
            }
	
	    } catch (Exception $e) {
			return [
				'type' => 'json',
				'code' => 500,
				'body' => ['data' => ['flag' => 'NotOk', 'msg' => $e->getMessage()]],
				'encode' => true
			];
	    }
	 }

	/** currentUser()
	 * User settings - form displayed in a popup window
	 * @param - array - primarily the request
	 * @return - JSON for a user settings form
	 * */
	 function currentUser($args)
	 {	

	    $fp = FirePHP::getInstance(true);	
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

			$cfg = F::get('cfg'); $lcd = $args['idiom'];
            $idioms = $cfg['site']['idioms'];
            $tbl = $args['table'];		// dbuser
            $rq = $args['request'];
            $token = $rq['token'];
            $user = $rq['user'];

            // Current user form
            $frm = new Qform($lcd);
            $frm->str(['text' => '201:You may make some modifications to your own Account profile']);

            $frm->hidden([
                'id' => 'id', 'v-model' => 'id',
            ]);  

            $frm->field([
                'id' => 'd_email', 'type' => 'text', 'required' => 'true', 'fieldclass' => 'col-sm-10', 'v-model' => 'd_email',
                'label' => ['labelclass' => '', 'text' => '22:Email address']
            ], 'input');

            $frm->field([
                'id' => 'd_firstname', 'type' => 'text', 'required' => 'true', 'fieldclass' => 'col-sm-8', 'v-model' => 'd_firstname',
                'label' => ['labelclass' => '', 'text' => '32:First name']
            ], 'input');

            $frm->field([
                'id' => 'd_midname', 'type' => 'text', 'fieldclass' => 'col-sm-8', 'v-model' => 'd_midname',
                'label' => ['labelclass' => '', 'text' => '33:Middle name']
            ], 'input');

            $frm->field([
                'id' => 'd_lastname', 'type' => 'text', 'required' => 'true', 'fieldclass' => 'col-sm-8', 'v-model' => 'd_lastname',
                'label' => ['labelclass' => '', 'text' => '34:Last name']
            ], 'input');

            $frm->file([
                'id' => 'd_image', 'fieldclass' => 'col-sm-10',
                'label' => ['labelclass' => '', 'text' => '26:Avatar']
            ], 'image');

            $frm->field([
                'id' => 'd_comments', 'fieldclass' => 'col-sm-10', 'v-model' => 'd_comments',
                'label' => ['labelclass' => '', 'text' => '29:Comments'],
                'help' => ['helpclass' => '', 'text' => '203:Comments are optional']
            ], 'textarea');

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

            // Model data
            $db = new Db();
            $vars = [
				'table' => $tbl,
				'filter' => ['c_username' => $user],
				'idiom' => $lcd
            ];
			$result = $db->getRow($vars);
			if($result['flag'] != 'Ok') {
				throw new \Exception('Problem with getting row of User data: '.$result['msg']); 
			}

			/*
			id = 0
			d_email = 'user@domain.com'
			d_firstname = ''
			d_midname = ''
			d_lastname = ''
			d_image = 'myavatar.png'
			d_comments = ''
			*/

			$row = [];
			foreach($result['data'] as $fld => $val) {
				$row[$fld] = html_entity_decode($val);
			}
			unset($row['c_document']);

			$html = H::div(['class' => 'm-2 ml-4'],
				$frm->renderForm(['id' => 'dataform', 'role' => 'form', 'class' => 'form', 'autocomplete' => 'off', 'title' => Cliq::cStr('200:Modify current user')]),
			);

			$data = [
				'html' => $html,
                'model' => $row,
                'options' => [ 'width' => 580, 'height' => 540]
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

	/** changePassword()
	 *
	 * @param - array - usual array of arguments
	 * @return - array - contain success or failure message
	 **/
	 function changePassword(array $args) 
	 {

	    $fp = FirePHP::getInstance(true);	
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

			$cfg = F::get('cfg'); $lcd = $args['idiom'];
            $idioms = $cfg['site']['idioms'];
            $tbl = $args['table'];		// dbuser
            $rq = $args['request'];
            $token = $rq['token'];
            $user = $rq['user'];

            // Encrypt the password
            $newpassword = Cliq::encryptData($rq['password']);
            $sql = "UPDATE dbuser SET c_password = '".$newpassword."' WHERE c_username = ?";
            $result = R::exec($sql, [$user]);

			return [
				'type' => 'json',
				'code' => 200,
				'body' => ['flag' => 'Ok', 'msg' => Cliq::cStr('81:Record updated successfully')],
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

	/** menuAuth()
	 *
	 * @param - string, Username
	 * @param - array - Usermenu array or Footer Menu
	 * @param - string - Type (optional) defaults to 'sidemenu'
	 * @return - array - revised Menu
	 *
	 **/
	 function menuAuth(string $usrname, array $menu, string $type = 'sidemenu')
	 {
	    $fp = FirePHP::getInstance(true);	
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

			// To which group does the user belong
			$sql = "SELECT c_type FROM dbuser WHERE c_username = ?";
			$group = R::getCell($sql, [$usrname]);

			$sqlb = "SELECT c_document FROM dbcollection WHERE c_type = ? AND c_reference = ?";
			$json = R::getCell($sqlb, ['setting', 'acl']);
			$matrix = json_decode($json, true);

			$revised = [];

			switch ($type) {

				case "sidemenu":
					foreach($menu as $idx => $props) {
						$key = $idx.'_'.$group;
						$result = $matrix[$key];
						$row = [];						
						if($result == true) { // Hide or not hide
							// We have work to do to constitute the menu

							foreach($props as $lbl => $val) {
								if(!is_array($val)) {
									$row[$lbl] = $val;
								} else {
									$bkey = $lbl.'_'.$group;
									$bresult = $matrix[$bkey];		
									if($bresult == true) { // Hide or not hide																
										$brow = [];
										foreach($val as $blbl => $bprop) {
											$brow[$blbl] = $bprop;
										}
										$row[$lbl] = $brow; unset($brow);
									}
								}
							}

						}

						if(count($row) > 0) {					
							$revised[$idx] = $row;
						}
						unset($row);
					}
				break;

				case "footermenu":
					$key = 'footer_'.$group;
					if($matrix[$key] == true) {
						$revised = $menu;
					} else {
						$revised = [];
					}
				break;
			}

			// Temp
			// $revised = $menu;
			return $revised;

	    } catch (Exception $e) {
	    	$fp->fb($e->getMessage());
	    	return $e->getMessage();
	    }			
	 }


} // Ends Class User
