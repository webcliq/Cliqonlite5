<?php
/**
 * Cliq Framework - Framework
 *
 * @category   Web application framework
 * @package    Cliq
 * @author     Original Author <support@cliqon.com>
 * @copyright  2020 Webcliq
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    Release: 1.0.1
 * @link       http://webcliq.com
 */


use \Firephp as Firephp;
use \framework\R as R;

class Framework {

	/**
	 * Variables
	 * 
	 ***************************************************************************************************************************/ 

	    /**
	     * @property object $instance used for mapped objects
	     */
		protected static $instance;
	    /**
	     * Registered classes.
	     *
	     * @var array
	     */
	    protected $classes;
	    private static $instances = [];

	    /**
	     * @property array $store for shared data
	     */
		public static $store = array();

	    /**
	     * @var The request
	     */
		public $rq;	

		public $user;

	    /**
	     * @var string URL being requested
	     */
	    public $url;

	    /**
	     * @var string Parent subdirectory of the URL
	     */
	    public $base;

	    /**
	     * @var string Request method (GET, POST, PUT, DELETE)
	     */
	    public $method;

	    /**
	     * @var string Referrer URL
	     */
	    public $referrer;

	    /**
	     * @var string IP address of the client
	     */
	    public $ip;

	    /**
	     * @var bool Whether the request is an AJAX request
	     */
	    public $ajax;

	    /**
	     * @var string Server protocol (http, https)
	     */
	    public $scheme;

	    /**
	     * @var string Browser information
	     */
	    public $user_agent;

	    /**
	     * @var string Content type
	     */
	    public $type;

	    /**
	     * @var int Content length
	     */
	    public $length;

	    /**
	     * @var Query string parameters
	     */
	    public $query;

	    /**
	     * @var Post parameters
	     */
	    public $data;

	    /**
	     * @var  Cookie parameters
	     */
	    public $cookies;

	    /**
	     * @var Uploaded files
	     */
	    public $files;

	    /**
	     * @var bool Whether the connection is secure
	     */
	    public $secure;

	    /**
	     * @var string HTTP accept parameters
	     */
	    public $accept;

	    /**
	     * @var string Proxy IP address of the client
	     */
	    public $proxy_ip;

	    /**
	     * @var string HTTP host name
	     */
	    public $host;

	    /**
	     * @var Controller
	     */
	    private $handler ='Controller';

	    /**
	     * @var Matches
	     */
	    private $matches = [];

	    /**
	     * @var int HTTP status
	     */
	    protected $status = 200;

	    /**
	     * @var array HTTP headers
	     */
	    protected $headers = array();

	    /**
	     * @var string HTTP response body
	     */
	    protected $body;

	    public static $langcd = 'en';

	    /**
	     * @var bool HTTP response sent
	     */
	    protected $sent = false;

	    /**
	     * @var array HTTP status codes
	     */
	     public static $codes = array(
	        100 => 'Continue',
	        101 => 'Switching Protocols',
	        102 => 'Processing',

	        200 => 'OK',
	        201 => 'Created',
	        202 => 'Accepted',
	        203 => 'Non-Authoritative Information',
	        204 => 'No Content',
	        205 => 'Reset Content',
	        206 => 'Partial Content',
	        207 => 'Multi-Status',
	        208 => 'Already Reported',

	        226 => 'IM Used',

	        300 => 'Multiple Choices',
	        301 => 'Moved Permanently',
	        302 => 'Found',
	        303 => 'See Other',
	        304 => 'Not Modified',
	        305 => 'Use Proxy',
	        306 => '(Unused)',
	        307 => 'Temporary Redirect',
	        308 => 'Permanent Redirect',

	        400 => 'Bad Request',
	        401 => 'Unauthorized',
	        402 => 'Payment Required',
	        403 => 'Forbidden',
	        404 => 'Not Found',
	        405 => 'Method Not Allowed',
	        406 => 'Not Acceptable',
	        407 => 'Proxy Authentication Required',
	        408 => 'Request Timeout',
	        409 => 'Conflict',
	        410 => 'Gone',
	        411 => 'Length Required',
	        412 => 'Precondition Failed',
	        413 => 'Payload Too Large',
	        414 => 'URI Too Long',
	        415 => 'Unsupported Media Type',
	        416 => 'Range Not Satisfiable',
	        417 => 'Expectation Failed',

	        422 => 'Unprocessable Entity',
	        423 => 'Locked',
	        424 => 'Failed Dependency',

	        426 => 'Upgrade Required',

	        428 => 'Precondition Required',
	        429 => 'Too Many Requests',

	        431 => 'Request Header Fields Too Large',

	        500 => 'Internal Server Error',
	        501 => 'Not Implemented',
	        502 => 'Bad Gateway',
	        503 => 'Service Unavailable',
	        504 => 'Gateway Timeout',
	        505 => 'HTTP Version Not Supported',
	        506 => 'Variant Also Negotiates',
	        507 => 'Insufficient Storage',
	        508 => 'Loop Detected',

	        510 => 'Not Extended',
	        511 => 'Network Authentication Required'
	    );

	function __construct() {
		$this->classes = array();
	}

	function __destruct() {

	}

	function start()
	{
		self::getCfg();

		// Test Configuration loaded
		$fp = FirePHP::getInstance(true);
		$fp->fb('Framework started');

		// Request
		$this->request();

		// Router
		$this->route();

		// Dispatcher
		$this->dispatch();
	}

	/* Registry for data and objects
	 *
	 ******************************************************************************************************************************************/

		/**
		 * Static Instance initialise
		 * 
		 * 
		 * */
		public static function RegInit()
		{
		    if (self::$instance == null) {
		      	self::$instance = new self;
		    }
		    return self::$instance;
		}

		/**
		* Static setter method
		* @method add
		* @param string $key The name of the index being set in the register.
		* @param mixed $value The value being assigned to the index ($key)
		*/
		public static function add($key, $value)
		{
			$instance = self::RegInit();
			$instance->classes[$key] = $value;
		}

		/**
		* Static getter method
		* @method load
		* @param string $key Name of the index being retrieved from the register.
		* @return mixed
		*/
		public static function load($key)
		{
			$instance = self::RegInit();
			return $instance->classes[$key];
		}

		/**
		* Static property check method
		* @method classesd
		* @param string $key Name of the index being checked
		* @return boolean
		*/
		public static function classesd($key)
		{
			$instance = self::RegInit();
			return isset($instance->classes[$key]);
		}

		/**
		* Static unset property method
		* @method remove
		* @param string $key Name of the index being removed
		*/
		public static function remove($key)
		{
			$instance = self::RegInit();
			unset($instance->classes[$key]);
		}

		/**
		* Get a nicely formatted output of objects currently in the register
		* @method output
		*/
		public static function output()
		{
			$instance = self::RegInit();
			return get_object_vars($instance);
		}

		/** Sleep method for data serialization */
		private function __sleep()
		{
			$this->classes = serialize($this->classes);
		}

		/** Wake method for unserialization of the data */
		private function __wakeup()
		{
			$this->classes = unserialize($this->classes);
		}

	    /**
	     * Maps a callback to a framework method.
	     *
	     * @param string $name Method name
	     * @param callback $callback Callback function
	     * @throws \Exception If trying to map over a framework method
	     */
		function map($name, $callback) {
	        if(method_exists($this, $name)) {
	            throw new Exception('Cannot override an existing framework method.');
	        }
	        $this->instance->$name = $callback;
		}

		/**
		 * Shared Data store initialise
		 * 
		 * 
		 * */
		static function StoreInit()
		{
			if(!isset(self::$store)) {
				self::$store = array();
			}
		}

		/**
		 * Shared Data - Get
		 * 
		 * 
		 * */
		static function get(string $key)
		{
    		self::storeInit();
    		return self::$store[$key];
		}

		/**
		 * Shared Data  - Set
		 * @param - string - Registry key
		 * @param - any - value to store
		 * @return - bool 
		 * */
		static function set(string $key, $val)
		{
			self::storeInit();
    		self::$store[$key] = $val;
		}

		/**
		 * Store - Delete
		 * @param - string - Registry key
		 * @return - bool - 
		 * */
		static function delete(string $key)
		{
    		unset(self::$store[$key]);
		}

		/**
		 * Registry - Has
		 * @param - string - Registry key
		 * @return - value or boolean false
		 * */
		static function has(string $key)
		{
    		self::storeInit();
    		return isset(self::$store[$key]);
		}

	/* Request
	 *
	 ******************************************************************************************************************************************/

		/**
		 * The Request class represents an HTTP request. Data from
		 * all the super globals $_GET, $_POST, $_COOKIE, and $_FILES
		 * are stored and accessible via the Request object.
		 *
		 * The default request properties are:
		 *   url - The URL being requested
		 *   base - The parent subdirectory of the URL
		 *   method - The request method (GET, POST, PUT, DELETE)
		 *   referrer - The referrer URL
		 *   ip - IP address of the client
		 *   ajax - Whether the request is an AJAX request
		 *   protocol - The server protocol (http, https)
		 *   user_agent - Browser information
		 *   type - The content type
		 *   length - The content length
		 *   query - Query string parameters
		 *   data - Post parameters
		 *   cookies - Cookie parameters
		 *   files - Uploaded files
		 *   secure - Connection is secure
		 *   accept - HTTP accept parameters
		 *   proxy_ip - Proxy IP address of the client
		 * 
		 * @return - the Request is now broken down into a recognised format
		 * */
		function request()
		{
        	
			if($this->getVar('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest') {
				$ajax = true;
			} else {
				$ajax = false;
			}
        	// Default properties
	        if (empty($config)) {
	            $config = array(
	                'url' => 		str_replace('@', '%40', $this->getVar('REQUEST_URI', '/')),
	                'base' => 		str_replace(array('\\',' '), array('/','%20'), dirname($this->getVar('SCRIPT_NAME'))),
	                'method' => 	$this->getMethod(),
	                'referrer' => 	$this->getVar('HTTP_REFERER'),
	                'ip' => 		$this->getVar('REMOTE_ADDR'),
	                'ajax' => 		$ajax,
	                'scheme' => 	$this->getScheme(),
	                'user_agent' => $this->getVar('HTTP_USER_AGENT'),
	                'type' => 		$this->getVar('CONTENT_TYPE'),
	                'length' => 	$this->getVar('CONTENT_LENGTH', 0),
	                'secure' => 	$this->getScheme() == 'https',
	                'accept' => 	$this->getVar('HTTP_ACCEPT'),
	                'proxy_ip' => 	$this->getProxyIpAddress(),
	                'host' => 		$this->getVar('HTTP_HOST'),
	                'query' => 		$this->getCollection('get'),
	                'data' => 		$this->getCollection('post'),
	                'cookies' => 	$this->getCollection('cookie'),
	                'files' => 		$this->getCollection('files'),
	                'request' => 	$_REQUEST,
	            );
	        }
	        $this->rq = $config;
	        $this->init($config);
		}

	    /**
	     * Initialize request properties.
	     *
	     * @param array $properties Array of request properties
	     */
	    function init(array $properties = []) {

	    	$fr = FirePHP::getInstance(true);	
	    	// $fr->fb($properties);

	        // Set all the defined properties
	        foreach ($properties as $name => $value) {
	            $this->$name = $value;
	        }

	        // Get the requested URL without the base directory
	        if ($this->base != '/' && strlen($this->base) > 0 && strpos($this->url, $this->base) === 0) {
	            $this->url = substr($this->url, strlen($this->base));
	        }

	        // Default url
	        if(empty($this->url)) {
	            $this->url = '/';
	        } 

	        // Now data stuff
	        // Not sure about the necessity for this
	        if($this->method == 'GET') {
	        	// Merge URL query parameters with $_GET
	            $_GET += $this->parseQuery($this->url);
	            $this->setData($_GET);
	        } elseif($this->method == 'POST') {
	        	// If Method == POST and we used Formdata, then $this->data will be an empty array but $this->query will be a populated array
	        	if( (!is_array($this->data)) and (count($this->data) <= 1) ) {
		        	if( count($this->query) > 1 ) {
		        		$this->setData($this->query);
		        	} else {
			        	if(strpos($this->type, 'application/json') === 0) {
				            $body = $this->getBody();
				            if ($body != '') {
				                $data = json_decode($body, true);
				                if ($data != null) {
				                	$this->setData($data);
				                }
				            }
				        }			        		
		        	}
	        	}
	        } else {
        		if( count($this->request) > 1 ) {
	        		$this->setData($this->request);
	        	} 
	        }


	    }

	    function getCollection(string $type = '')
	    {
	    	switch($type) {

	    		case "delete":
	    		case "get":
					$r = $this->cleanInputs($_GET);
					if(!$r) {
						$rq = $this->cleanInputs($_REQUEST);
					} else {
						$rq = $r;
					}	
	    		break;

	    		case "put":
	    		case "post":

					$r = file_get_contents('php://input');

					if(is_array($r)) {
						// How many elements
						$q = count($r);
						if($q == 1) {
							$q = array_keys($r);
							$rq = is_json($q[0]);							
						} else {
							$rq = $r;
						}			
					} elseif (is_string($r)) {
						$rq = is_json($r);
					} else {
						$rq = $r;
					}

	    		break;

	    		case "cookie":
	    			$rq = $_COOKIE;
	    		break;

	    		case "files":
	    			$rq = $_FILES;
	    		break;

	    		default:
	    			$rq = $_REQUEST;
	    		break;
	    	}

	    	return $rq;

	    }

	    /**
	     * Gets the body of the request.
	     *
	     * @return string Raw HTTP request body
	     */
	    function getBody() {
	        static $body;

	        if (!is_null($body)) {
	            return $body;
	        }

	        $method = $this->getMethod();

	        if ($method == 'POST' || $method == 'PUT' || $method == 'PATCH') {
	            $body = file_get_contents('php://input');
	        }

	        return $body;
	    }

	    /**
	     * Gets the request method.
	     *
	     * @return string
	     */
	    function getMethod() {
	        $method = $this->getVar('REQUEST_METHOD', 'GET');

	        if (isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) {
	            $method = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'];
	        }
	        elseif (isset($_REQUEST['_method'])) {
	            $method = $_REQUEST['_method'];
	        }

	        return strtoupper($method);
	    }

	    /**
	     * Gets the real remote IP address.
	     *
	     * @return string IP address
	     */
	    function getProxyIpAddress() {
	        static $forwarded = array(
	            'HTTP_CLIENT_IP',
	            'HTTP_X_FORWARDED_FOR',
	            'HTTP_X_FORWARDED',
	            'HTTP_X_CLUSTER_CLIENT_IP',
	            'HTTP_FORWARDED_FOR',
	            'HTTP_FORWARDED'
	        );

	        $flags = \FILTER_FLAG_NO_PRIV_RANGE | \FILTER_FLAG_NO_RES_RANGE;

	        foreach ($forwarded as $key) {
	            if (array_key_exists($key, $_SERVER)) {
	                sscanf($_SERVER[$key], '%[^,]', $ip);
	                if (filter_var($ip, \FILTER_VALIDATE_IP, $flags) !== false) {
	                    return $ip;
	                }
	            }
	        }

	        return '';
	    }

	    /**
	     * Gets a variable from $_SERVER using $default if not provided.
	     *
	     * @param string $var Variable name
	     * @param string $default Default value to substitute
	     * @return string Server variable value
	     */
	    function getVar($var, $default = '') {
	        return isset($_SERVER[$var]) ? $_SERVER[$var] : $default;
	    }

	    /**
	     * Parse query parameters from a URL.
	     *
	     * @param string $url URL string
	     * @return array Query parameters
	     */
	    function parseQuery($url) {
	        $params = array();

	        $args = parse_url($url);
	        if (isset($args['query'])) {
	            parse_str($args['query'], $params);
	        }

	        return $params;
	    }

	    function getScheme() {
	        if (
	            (isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) === 'on')
	            ||
	            (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
	            ||
	            (isset($_SERVER['HTTP_FRONT_END_HTTPS']) && $_SERVER['HTTP_FRONT_END_HTTPS'] === 'on')
	            ||
	            (isset($_SERVER['REQUEST_SCHEME']) && $_SERVER['REQUEST_SCHEME'] === 'https')
	        ) {
	            return 'https';
	        }
	        return 'http';
	    }

		function is_xhr_request()
	    {
	        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest';
	    }

		protected function cleanInputs($data)
		{
			$clean_input = array();
			if(is_array($data)) {
				foreach($data as $k => $v){
					$clean_input[$k] = self::cleanInputs($v);
				}
			} else {
				$data = htmlentities($data);
				$clean_input = trim($data);
			}
			return $clean_input;
		}

	/* Routing and Dispatcher
	 *
	 ******************************************************************************************************************************************/

		/** route() - Creates a usable array for use for the Dispatcher
	     * 
	     * */
	     function route() {

	        try {	

	        	// Or load from routes.cfg

	        	$routes = [

	        		// For an extended parameter routing, add more patterns here in reverse order

	        		// Action (required) / Language (required) / The rest are optional       		
	        		'/:string/:idiom/:string/:string/number/',	// Action, Idiom, Table, Tabletype, Record ID
	        		'/:string/:idiom/:string/:string/',			// Action, Idiom, Table, Tabletype
	        		'/:string/:idiom/:string/',					// Action, Idiom, Table
	        		'/:string/:idiom/', 						// Page, Idiom
	        		'/'											// Or Default		
	        	];

		        $path_info = '/';

		        if (! empty($_SERVER['PATH_INFO'])) {
		            $path_info = $_SERVER['PATH_INFO'];
		        } elseif (! empty($_SERVER['ORIG_PATH_INFO']) && $_SERVER['ORIG_PATH_INFO'] !== '/index.php') {
		            $path_info = $_SERVER['ORIG_PATH_INFO'];
		        } else {
		            if (! empty($_SERVER['REQUEST_URI'])) {
		                $path_info = (strpos($_SERVER['REQUEST_URI'], '?') > 0) ? strstr($_SERVER['REQUEST_URI'], '?', true) : $_SERVER['REQUEST_URI'];
		            }
		        }

	            $tokens = array(
	                ':string' => '([a-zA-Z]+)',
	                ':number' => '([0-9]+)',
	                ':alpha'  => '([a-zA-Z0-9-_]+)',
	                ':idiom'  => '([a-z]{2})'
	            );

	            foreach ($routes as $n => $pattern) {
	                $pattern = strtr($pattern, $tokens);
	                if(preg_match('#^/?'.$pattern.'/?$#', $path_info, $matches, PREG_UNMATCHED_AS_NULL)) {
	                    $this->matches = &$matches;
	                    break;
	                }
	            }

	            return true;

	        } catch(Exception $e) {
	        	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage());
	        }
	     }
		
		/** dispatch() - Routing to the Controller
	     * 
	     * */
	     function dispatch() {
	   
	        $fp = FirePHP::getInstance(true);     
	        try {	

	        	$handler = 'app\\'.$this->handler;	// app\Controller
	            $h = new $handler();				// new app\Controller
	            $cfg = self::get('cfg');

	            // When not the default, method is found in matches[1],
	            $this->matches[0] == '/' ? $method = 'defaultpage' : $method = $this->matches[1];

				// $fp->fb($this->data);

	            if($method != 'defaultpage') {
		            $args = [
		            	'url' => $this->matches[0],
		            	'action' => $this->matches[1],
		            	'idiom' => $this->matches[2],
		            	'request' => $this->data
		            ]; 

		            isset($this->matches[3]) ? $args['table'] = $this->matches[3] : null;
		            isset($this->matches[4]) ? $args['tabletype'] = $this->matches[4] : null;
		            isset($this->matches[5]) ? $args['recid'] = $this->matches[5] : null;

		            // For an extended parameter routing, add more ternaries here

		            self::$langcd = $this->matches[2];

	            	// Check ACL here - because we can change $this->handler and $method at this point            

	            } else {
	            	// Get a default idiom
	            	$idm = $this->get_browser_language($cfg['site']['idioms'], 'en');
		            $args = ['request' => $this->data, 'idiom' => $idm, 'cfg' => $cfg]; 
		            self::$langcd = $idm;
	            }

	            // This will execute the main executables in the system and the response need to be routed to Response   
	        	$handler = 'app\\'.$this->handler;	// app\Controller
	            $h = new $handler(); 				// new core\Controller     
	            $obj = ($h->$method($args));	    // Example $h->login($args)		

	        	// We can do some basic determination based upon the Request Method and if it as an Ajax request
	        	// $obj will be an array containing instructions how to display/send/render

	        	if(is_array($obj)) {
	        		switch($obj['type']) {

		        		case "json":
		        			$this->_json($obj['body'], $obj['code'], $obj['encode']);
		        		break;

		        		case "jsonp":
		        			$this->_jsonp($obj['body'], $obj['code'], $obj['encode']);
		        		break;   

		        		case "image":
		        			$this->_jsonp($obj['body'], $obj['type']);
		        		break;   

		        		case "application":
		        			$this->_app($obj['body'], $obj['type']);
		        		break;   

						case "html":
		        		default:
		        			$this->_html($obj['body'], $obj['code']);
		        		break; 		
		        	}
		        } else {
		        	$this->_html($obj);
		        }

	        } catch(\Exception $e) {
				$fp->fb($e->getMessage());
	        }
	     }

	/* Response
	 *
	 ******************************************************************************************************************************************/

	    /**
	     * Sets the HTTP status of the response.
	     *
	     * @param int $code HTTP status code.
	     * @return object|int Self reference
	     * @throws \Exception If invalid status code
	     */
	    public function status($code = null) {
	        if ($code === null) {
	            return $this->status;
	        }

	        if (array_key_exists($code, self::$codes)) {
	            $this->status = $code;
	        }
	        else {
	            throw new \Exception('Invalid status code.');
	        }

	        return $this;
	    }

	    /**
	     * Adds a header to the response.
	     *
	     * @param string|array $name Header name or array of names and values
	     * @param string $value Header value
	     * @return object Self reference
	     */
	    public function header($name, $value = null) {
	        if (is_array($name)) {
	            foreach ($name as $k => $v) {
	                $this->headers[$k] = $v;
	            }
	        }
	        else {
	            $this->headers[$name] = $value;
	        }

	        return $this;
	    }

	    /**
	     * Returns the headers from the response
	     * @return array
	     */
	    public function headers() {
	        return $this->headers;
	    }

	    /**
	     * Writes content to the response body.
	     *
	     * @param string $str Response content
	     * @return object Self reference
	     */
	    public function write($str) {
	        $this->body .= $str;
	        return $this;
	    }

	    /**
	     * Clears the response.
	     *
	     * @return object Self reference
	     */
	    public function clear() {
	        $this->status = 200;
	        $this->headers = array();
	        $this->body = '';

	        return $this;
	    }

	    /**
	     * Sets caching headers for the response.
	     *
	     * @param int|string $expires Expiration time
	     * @return object Self reference
	     */
	    public function cache($expires) {
	        if ($expires === false) {
	            $this->headers['Expires'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
	            $this->headers['Cache-Control'] = array(
	                'no-store, no-cache, must-revalidate',
	                'post-check=0, pre-check=0',
	                'max-age=0'
	            );
	            $this->headers['Pragma'] = 'no-cache';
	        }
	        else {
	            $expires = is_int($expires) ? $expires : strtotime($expires);
	            $this->headers['Expires'] = gmdate('D, d M Y H:i:s', $expires) . ' GMT';
	            $this->headers['Cache-Control'] = 'max-age='.($expires - time());
	            if (isset($this->headers['Pragma']) && $this->headers['Pragma'] == 'no-cache'){
	                unset($this->headers['Pragma']);
	            }
	        }
	        return $this;
	    }

	    /**
	     * Sends HTTP headers.
	     *
	     * @return object Self reference
	     */
	    public function sendHeaders() {
	        // Send status code header
	        if (strpos(php_sapi_name(), 'cgi') !== false) {
	            header(
	                sprintf(
	                    'Status: %d %s',
	                    $this->status,
	                    self::$codes[$this->status]
	                ),
	                true
	            );
	        }
	        else {
	            header(
	                sprintf(
	                    '%s %d %s',
	                    (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.1'),
	                    $this->status,
	                    self::$codes[$this->status]),
	                true,
	                $this->status
	            );
	        }

	        // Send other headers
	        foreach ($this->headers as $field => $value) {
	            if (is_array($value)) {
	                foreach ($value as $v) {
	                    header($field.': '.$v, false);
	                }
	            }
	            else {
	                header($field.': '.$value);
	            }
	        }

	        // Send content length
	        $length = $this->getContentLength();

	        if ($length > 0) {
	            header('Content-Length: '.$length);
	        }

	        return $this;
	    }

	    /**
	     * Gets the content length.
	     *
	     * @return string Content length
	     */
	    public function getContentLength() {
	        return extension_loaded('mbstring') ?
	            mb_strlen($this->body, 'latin1') :
	            strlen($this->body);
	    }

	    /**
	     * Gets whether response was sent.
	     */
	    public function sent() {
	        return $this->sent;
	    }

	    /**
	     * Sends a HTTP response.
	     */
	    public function send() {
	        
	        if (ob_get_length() > 0) {
	            ob_end_clean();
	        }

	        if (!headers_sent()) {
	            $this->sendHeaders();
	        }
	        echo $this->body;
	        $this->sent = true;
	    }

	    /**
	     * Sends an HTML response.
	     *
	     * @param mixed $data HTML
	     * @param int $code HTTP status code
	     * @param string $charset Charset
	     * @throws \Exception
	     */  
	    public function _html(
	        $data,
	        $code = 200,
	        $charset = 'utf-8'
	    ) {
	        echo $data;
	    }	    

	    /**
	     * Sends an Image response.
	     *
	     * @param string - filepath
	     * @param int $code HTTP status code
	     * @param string type
	     * @throws \Exception
	     */  
	    public function _image(
	        $filepath,
	        $type = 'jpeg', // gif, png, x-icon,
	        $code = 200
	    ) {
	        $this
	        	->status($code)
	            ->header('Content-type: image/'.$type)
	            ->write(file_get_contents($filepath))
	            ->send();
	    }   

	    /**
	     * Sends an Application response - not JSON
	     *
	     * @param string - filepath
	     * @param int $code HTTP status code
	     * @param string type
	     * @throws \Exception
	     */  
	    public function _app(
	        $path,
	        $type = 'pdf', // javascript, octet-stream, zip, 
	        $code = 200
	    ) {
	        $this
	        	->status($code)
	            ->header('Content-type: application/'.$path)
	            ->write(file_get_contents($data))
	            ->send();
	    }  

	    /**
	     * Sends a JSON response.
	     *
	     * @param mixed $data JSON data
	     * @param int $code HTTP status code
	     * @param bool $encode Whether to perform JSON encoding
	     * @param string $charset Charset
	     * @param int $option Bitmask Json constant such as JSON_HEX_QUOT
	     * @throws \Exception
	     */
	    public function _json(
	        $data,
	        $code = 200,
	        $encode = true,
	        $charset = 'utf-8',
	        $option = 0
	    ) {
	        $json = ($encode) ? json_encode($data, $option) : $data;

	        $this->status($code)
	            ->header('Content-Type', 'application/json; charset='.$charset)
	            ->write($json)
	            ->send();
	    }
		
	    /**
	     * Sends a JSONP response.
	     *
	     * @param mixed $data JSON data
	     * @param string $param Query parameter that specifies the callback name.
	     * @param int $code HTTP status code
	     * @param bool $encode Whether to perform JSON encoding
	     * @param string $charset Charset
	     * @param int $option Bitmask Json constant such as JSON_HEX_QUOT
	     * @throws \Exception
	     */
	    public function _jsonp(
	        $data,
	        $param = 'jsonp',
	        $code = 200,
	        $encode = true,
	        $charset = 'utf-8',
	        $option = 0
	    ) {
	        $json = ($encode) ? json_encode($data, $option) : $data;

	        $callback = $this->request()->query[$param];

	        $this->status($code)
	            ->header('Content-Type', 'application/javascript; charset='.$charset)
	            ->write($callback.'('.$json.');')
	            ->send();
	    }

	    /**
	     * Handles ETag HTTP caching.
	     *
	     * @param string $id ETag identifier
	     * @param string $type ETag type
	     */
	    public function _etag($id, $type = 'strong') {
	        $id = (($type === 'weak') ? 'W/' : '').$id;

	        $this->header('ETag', $id);

	        if (isset($_SERVER['HTTP_IF_NONE_MATCH']) &&
	            $_SERVER['HTTP_IF_NONE_MATCH'] === $id) {
	            $this->halt(304);
	        }
	    }

	    /**
	     * Handles last modified HTTP caching.
	     *
	     * @param int $time Unix timestamp
	     */
	    public function _lastModified($time) {
	        $this->response()->header('Last-Modified', gmdate('D, d M Y H:i:s \G\M\T', $time));

	        if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) &&
	            strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) === $time) {
	            $this->halt(304);
	        }
	    }

	/* Loading
	 *
	 ******************************************************************************************************************************************/

		/**
	     * Load a single named executable file
	     * 
	     * */
	    function loadFile(string $file) {
	        try {
	            $fp = SITE_PATH.$file;
	                if(!is_readable($fp)) {
	                     throw new Exception("File does not exist at: ".$fp);
	                }
	                require_once $fp;
	                return true;
	        } catch(Exception $e) {
	           	$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage());
	        }
	    }

		/**
	     * Load a class and register it with a framework handler
	     * 
	     * */
	    function resolve(
	    	string $hn, 		// Handler name
	    	string $cn, 	// Class name
	    	string $dir = ''	// Directory	    	
	    ) {
	        try {
	        	if($dir != '') {
	        		$class = $dir.'\\'.$cn;
	        		$newinst = new $class();
	        	} else {
	        		$newinst = new $cn();
	        	}
	        	// Check it is callable
	        	if(is_callable($newinst)) {
	        		$this->set($hn, $newinst);
	        	} else {
	        		throw new Exception($class.' is not callable');
	        	}

	        } catch(Exception $e) {
	            $fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage());
	        }
	    }   

	    /**
	     * Instantiate a registered class.
	     *
	     * @param string $name Method name
	     * @param bool $shared Shared instance
	     * @return object Class instance
	     * @throws \Exception
	     */
	    function instantiate($name, $shared = true) {
	        $obj = null;

	        if (isset($this->classes[$name])) {
	            list($class, $params, $callback) = $this->classes[$name];

	            $exists = isset($this->instances[$name]);

	            if ($shared) {
	                $obj = ($exists) ?
	                    $this->getInstance($name) :
	                    $this->newInstance($class, $params);
	                
	                if (!$exists) {
	                    $this->instances[$name] = $obj;
	                }
	            }
	            else {
	                $obj = $this->newInstance($class, $params);
	            }

	            if ($callback && (!$shared || !$exists)) {
	                $ref = array(&$obj);
	                call_user_func_array($callback, $ref);
	            }
	        }

	        return $obj;
	    }

	    function existsFile($file)
	    {
	        try {
	        global $basedir;
	            $fp = $basedir.$file;
	            if(!is_readable($fp)) {
	                 throw new Exception("File does not exist at: ".$fp);
	            }
	            return true;
	        } catch(Exception $e) {
	            return false;
	            $fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage().' at line'.$e->getLine());
	        }
	    }

	/* Collection
	 *
	 ******************************************************************************************************************************************/

		function collection(array $data = []) {
        	$this->data = $data;
    	}

	    /**
	     * Gets an item at the offset.
	     *
	     * @param string $offset Offset
	     * @return mixed Value
	     */
	    function offsetGet($offset) {
	        return isset($this->data[$offset]) ? $this->data[$offset] : null;
	    }

	    /**
	     * Sets an item at the offset.
	     *
	     * @param string $offset Offset
	     * @param mixed $value Value
	     */
	    function offsetSet($offset, $value) {
	        if (is_null($offset)) {
	            $this->data[] = $value;
	        }
	        else {
	            $this->data[$offset] = $value;
	        }
	    }

	    /**
	     * Checks if an item exists at the offset.
	     *
	     * @param string $offset Offset
	     * @return bool Item status
	     */
	    function offsetExists($offset) {
	        return isset($this->data[$offset]);
	    }

	    /**
	     * Removes an item at the offset.
	     *
	     * @param string $offset Offset
	     */
	    function offsetUnset($offset) {
	        unset($this->data[$offset]);
	    }

	    /**
	     * Resets the collection.
	     */
	    function rewind() {
	        reset($this->data);
	    }
	 
	    /**
	     * Gets current collection item.
	     *
	     * @return mixed Value
	     */ 
	    function current() {
	        return current($this->data);
	    }
	 
	    /**
	     * Gets current collection key.
	     *
	     * @return mixed Value
	     */ 
	    function key() {
	        return key($this->data);
	    }
	 
	    /**
	     * Gets the next collection value.
	     *
	     * @return mixed Value
	     */ 
	    function next() 
	    {
	        return next($this->data);
	    }
	 
	    /**
	     * Checks if the current collection key is valid.
	     *
	     * @return bool Key status
	     */ 
	    function valid()
	    {
	        $key = key($this->data);
	        return ($key !== NULL && $key !== FALSE);
	    }

	    /**
	     * Gets the size of the collection.
	     *
	     * @return int Collection size
	     */
	    function count() {
	        return sizeof($this->data);
	    }

	    /**
	     * Gets the item keys.
	     *
	     * @return array Collection keys
	     */
	    function keys() {
	        return array_keys($this->data);
	    }

	    /**
	     * Gets the collection data.
	     *
	     * @return array Collection data
	     */
	    function getData() {
	        return $this->data;
	    }

	    /**
	     * Sets the collection data.
	     *
	     * @param array $data New collection data
	     */
	    function setData(array $data) {
	        $this->data = $data;
	    }

	    /**
	     * Removes all items from the collection.
	     */
	    function clearData() {
	        $this->data = array();
	    }

	/* Error trapping, logging and handling
	 * Extends FirePHP
	 *
	 ******************************************************************************************************************************************/

		/*
			$fp = FirePHP::getInstance(true);
			$fp->fb($msg);
		*/

	/* Utilities
	 *
	 * getCfg()
	 * stdModel()
	 * - getModel()
	 *
	 *
	 *
	 ******************************************************************************************************************************************/

		/** getCfg()
		 * 
		 * @return - bool - Config array is set
		 * */
		static function getCfg()
		{
			try{

				// Read in and decode config file
		        $file = new core\Files();
		        $te = new core\TomlEncoder(); 
		        $fp = "config/config.cfg";
		        $tomlstr = $file->readFile($fp);
		        $cfg = $te->toml_decode($tomlstr, '');
		        if(!count($cfg) > 0) {
		        	throw new Exception('No CFG');
		        }
		        self::set('cfg', $cfg);
				return true;

			} catch(Exception $e) {
				$fp = FirePHP::getInstance(true);
				$fp->fb($e->getMessage());
			}
		}

		/** stdModel()
		 *
		 * @param - string - service
		 * @param - string - table 
		 * @param - string - tabletype (optional)
		 * @return - array - or error message
		 **/
		static function stdModel(string $srv = 'datagrid', string $table = '', string $tabletype = '')
		{
			$fr = FirePHP::getInstance(true);	
			$mdl = self::getModel('service/'.$srv);
			if($table != '') {
				$t = self::getModel('collection/'.$table);
				is_array($t) ? $mdl = array_replace_recursive($mdl, $t[$srv]) : null ; 				
			}

			if($tabletype != '') {
				$tt = self::getModel('model/'.$table.'.'.$tabletype);
				is_array($tt) ? $mdl = array_replace_recursive($mdl, $tt[$srv]) : null ; 				
			}
			return $mdl;
		}

		/** getModel()
		 * 
		 * @param - string - name of model file including subdir
		 * @return - array - 
		 * */
		static function getModel(string $fl)
		{
	        $fr = FirePHP::getInstance(true);			
			try{

				// Read in and decode config file
		        $file = new core\Files();
		        $te = new core\TomlEncoder(); 
		        $fp = "models/".$fl.'.cfg';
		        $tomlstr = $file->readFile($fp);
		        if($tomlstr == '' ) {
		        	throw new Exception('No readable file at: '.$fp);
		        }

		        $qrepl = ['{lcd}'];
		        $qwith = [self::$langcd];
		        $tomlstr = str_replace($qrepl, $qwith, $tomlstr);

		        $cfg = $te->toml_decode($tomlstr, '');
		        if(!count($cfg) > 0) {
		        	throw new Exception('No usable CFG at: '.$fp);
		        }
				return $cfg;

			} catch(Exception $e) {
				$fr->fb($e->getMessage());
			}
		}

	    public static function getInstance(): Singleton
	    {
	        $cls = static::class;
	        if (!isset(self::$instances[$cls])) {
	            self::$instances[$cls] = new static;
	        }

	        return self::$instances[$cls];
	    }
	
		/**
		 * Get browser language, given an array of available languages.
		 * 
		 * @param  [array]   $availableLanguages  Avalaible languages for the site
		 * @param  [string]  $default             Default language for the site
		 * @return [string]                       Language code/prefix
		 */
		function get_browser_language( $available = [], $default = 'en' ) {
			if ( isset( $_SERVER[ 'HTTP_ACCEPT_LANGUAGE' ] ) ) {

				$langs = explode( ',', $_SERVER['HTTP_ACCEPT_LANGUAGE'] );

		    if ( empty( $available ) ) {
		      return $langs[ 0 ];
		    }

				foreach ( $langs as $lang ){
					$lang = substr( $lang, 0, 2 );
					if( in_array( $lang, $available ) ) {
						return $lang;
					}
				}
			}
			return $default;
		}

		function prefered_language(array $available_languages) {

		    $available_languages = array_flip($available_languages);

		    $langs;
		    preg_match_all('~([\w-]+)(?:[^,\d]+([\d.]+))?~', strtolower($_SERVER["HTTP_ACCEPT_LANGUAGE"]), $matches, PREG_SET_ORDER);
		    foreach($matches as $match) {

		        list($a, $b) = explode('-', $match[1]) + array('', '');
		        $value = isset($match[2]) ? (float) $match[2] : 1.0;

		        if(isset($available_languages[$match[1]])) {
		            $langs[$match[1]] = $value;
		            continue;
		        }

		        if(isset($available_languages[$a])) {
		            $langs[$a] = $value - 0.1;
		        }

		    }
		    arsort($langs);

		    return $langs;
		}

}

class stdObject {
    public function __construct(array $arguments = array()) {
        if (!empty($arguments)) {
            foreach ($arguments as $property => $argument) {
                $this->{$property} = $argument;
            }
        }
    }

    public function __call($method, $arguments) {
        $arguments = array_merge(array("stdObject" => $this), $arguments); // Note: method argument 0 will always referred to the main class ($this).
        if (isset($this->{$method}) && is_callable($this->{$method})) {
            return call_user_func_array($this->{$method}, $arguments);
        } else {
            throw new Exception("Fatal error: Call to undefined method stdObject::{$method}()");
        }
    }
}