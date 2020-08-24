<?php
/**
 * Cliq Framework - Plugin
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

class Plugin extends Engine {

	const THISCLASS = "Plugin";
	const CLIQDOC = "c_document";
	
	function __construct() {
		parent::__construct();
	}
	function __destruct() {}


}
