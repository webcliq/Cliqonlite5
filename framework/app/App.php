<?php
/**
 * Cliq Framework - App - anything that displays a page
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

use \core\Engine as Engine;
use \Framework as F;

class App extends Engine {

	const THISCLASS = "App";
	const CLIQDOC = "c_document";
	
	function __construct() {
		parent::__construct();
	}
	function __destruct() {}

	/**
	 * Default website page
	 * @param - array - primarily the request
	 * @return - just HTML page from template
	 * */
	function defaultpage($args)
	{
		return $this->page_exec($args['idiom'], 'index', [
			'test' => 'Test text'
		]);
	}

	/**
	 * Error
	 * @param - array - primarily the request
	 * @return - just HTML page from template
	 * */
	function errorpage($args)
	{
		return $this->page_exec($args['idiom'], 'error', []);
	}

	/**
	 * 404
	 * @param - string - controller + action name, not found anywhere
	 * @param - array - primarily the request
	 * @return - just HTML page from template
	 * */
	function notfound(string $name, array $args)
	{
		return $this->page_exec($args['idiom'], 'notfound', []);
	}

}