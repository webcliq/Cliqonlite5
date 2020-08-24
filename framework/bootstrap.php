<?php
/**
 * Cliq Framework - Bootstrap
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
if (!file_exists(SITE_PATH.'log')) {
    mkdir(SITE_PATH.'log', 0777, true);
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

require_once 'autoloader.php';
require_once 'functions.php';
require_once 'Firephp.php';
$f = new Framework();

require_once 'database.php';

$f->start();

// self::log($exception, self::EXCEPTION);