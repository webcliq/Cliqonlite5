<?php
/**
 * Cliq Framework - Routes
 *
 * @category   Web application framework
 * @package    Cliq
 * @author     Original Author <support@cliqon.com>
 * @copyright  2020 Webcliq
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    Release: 1.0.1
 * @link       http://webcliq.com
 ***/
 
 /*
; file is converted to $routes by Config and flipped
;
; "/" => "SplashHandler",
; "/catalog/page/([0-9]+)" => "CatalogHandler",
; "/product/([a-zA-Z0-9-_]+)" => "ProductHandler",
; "/manufacturer/([a-zA-Z]+)" => "ManufacturerHandler"
;
; class ExampleHandler {
; 	function get() {}
; 	function post() {}
; 	function get_xhr() {}
; 	function post_xhr() {}
; }
;
; ':string' => '([a-zA-Z]+)',
; ':number' => '([0-9]+)',
; ':alpha'  => '([a-zA-Z0-9-_]+)',
; ':idiom' => '([a-z]{2})',   

*/

$routes = [

	"/install/([a-zA-Z]+)" => "Controller",
	"/" => "Controller"
]

?>