<?php
// Sets Root Directory and calls Startup
if( isset($_SERVER['HTTPS']) && !empty($_SERVER['HTTPS']) ) {
	define('PROTOCOL', 'https://');
} else {
	define('PROTOCOL', 'http://');
};
// Directory separator is set up here because separators are different on Linux and Windows operating systems
define("STATUS", "DEVELOPMENT"); // PRODUCTION
define('DS', DIRECTORY_SEPARATOR);
define('ROOT', dirname(dirname(__FILE__)));
define('SITE_PATH', $_SERVER['DOCUMENT_ROOT']);
define('ROOT_PATH', __DIR__);
define('HOST_PATH', PROTOCOL.$_SERVER['SERVER_NAME'].'/');

if(file_exists('config/config.cfg')){
	require_once 'framework/bootstrap.php';
} else {
	define("LCD", "en"); // Used by Install only
	require_once 'install/install.php';
}
