<?php
/**
 * Cliq Framework - Install
 *
 * @category   Web application framework
 * @package    Cliq
 * @author     Original Author <support@cliqon.com>
 * @copyright  2020 Webcliq
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    Release: 1.0.1
 * @link       http://webcliq.com
 */

// If PHP7, you may declare
declare(strict_types = 1);

// Create Log and Log Directory
if (!file_exists(ROOT_PATH.'log')) {
    mkdir(ROOT_PATH.'log', 0777, true);
};

// Setup Session with Security
session_start();
if(isset($_SESSION['HTTP_USER_AGENT'])) {
	if($_SESSION['HTTP_USER_AGENT'] != md5($_SERVER['HTTP_USER_AGENT'])) {
		session_regenerate_id();
		$_SESSION['HTTP_USER_AGENT'] = md5($_SERVER['HTTP_USER_AGENT']);
	}
} else {
	$_SESSION['HTTP_USER_AGENT'] = md5($_SERVER['HTTP_USER_AGENT']);
}

require_once SITE_PATH.'framework/autoloader.php';
require_once SITE_PATH.'framework/functions.php';
require_once SITE_PATH.'framework/Firephp.php';

require_once SITE_PATH.'install/routes.php';
require_once SITE_PATH.'install/Router.php';
require_once SITE_PATH.'install/Controller.php';

Router::serve($routes);