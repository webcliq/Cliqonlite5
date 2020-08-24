<?php
function print_p($a) {
    return '<pre>'.print_r($a, 1).'</pre>';
}

/** 
* Recursively computes the intersection of arrays using keys for comparison.
* 
* @param   array $array1 The array with master keys to check.
* @param   array $array2 An array to compare keys against.
* @return  array associative array containing all the entries of array1 which have keys that are present in array2.
**/
function array_intersect_key_recursive(array $array1, array $array2) {
    $array1 = array_intersect_key($array1, $array2);
    foreach ($array1 as $key => &$value) {
        if (is_array($value) && is_array($array2[$key])) {
            $value = array_intersect_key_recursive($value, $array2[$key]);
        }
    }
    return $array1;
}

function arrayRecursiveDiff($aArray1, $aArray2) {
    $aReturn = array();
  
    foreach ($aArray1 as $mKey => $mValue) {
        if (array_key_exists($mKey, $aArray2)) {
            if (is_array($mValue)) {
                $aRecursiveDiff = arrayRecursiveDiff($mValue, $aArray2[$mKey]);
                if (count($aRecursiveDiff)) { $aReturn[$mKey] = $aRecursiveDiff; }
            } else {
                if ($mValue != $aArray2[$mKey]) {
                    $aReturn[$mKey] = $mValue;
                }
            }
        } else {
            $aReturn[$mKey] = $mValue;
        }
    }
  
    return $aReturn;
} 

function array_to_string(array $input) {
  $output = implode(', ', array_map(
    function ($v, $k) {
        if(is_array($v)){
            return $k.'[]='.implode('&'.$k.'[]=', $v);
        }else{
            return $k.'='.$v;
        }
    }, 
    $input, 
    array_keys($input)
  ));
}


function array_orderby() {
    $args = func_get_args();
    $data = array_shift( $args );
    if ( ! is_array( $data ) ) {
        return array();
    }
    $multisort_params = array();
    foreach ( $args as $n => $field ) {
        if ( is_string( $field ) ) {
            $tmp = array();
            foreach ( $data as $row ) {
                $tmp[] = $row[ $field ];
            }
            $args[ $n ] = $tmp;
        }
        $multisort_params[] = &$args[ $n ];
    }
    $multisort_params[] = &$data;
    call_user_func_array( 'array_multisort', $multisort_params );
    return end( $multisort_params );
}     

/**
 * Returns the first element in an array.
 *
 * @param  array $array
 * @return mixed
 */
function array_first(array $array)
{
    return reset($array);
}

/**
 * Returns the last element in an array.
 *
 * @param  array $array
 * @return mixed
 */
function array_last(array $array)
{
    return end($array);
}

/**
 * Returns the first key in an array.
 *
 * @param  array $array
 * @return int|string
 */
function array_first_key(array $array)
{
    reset($array);
    return key($array);
}

/**
 * Returns the last key in an array.
 *
 * @param  array $array
 * @return int|string
 */
function array_last_key(array $array)
{
    end($array);
    return key($array);
}

/**
 * Flatten a multi-dimensional array into a one dimensional array.
 *
 * Contributed by Theodore R. Smith of PHP Experts, Inc. <http://www.phpexperts.pro/>
 *
 * @param  array   $array         The array to flatten
 * @param  boolean $preserve_keys Whether or not to preserve array keys.
 *                                Keys from deeply nested arrays will
 *                                overwrite keys from shallowy nested arrays
 * @return array
 */
function array_flatten(array $array, $preserve_keys = true)
{
    $flattened = array();

    array_walk_recursive($array, function ($value, $key) use (&$flattened, $preserve_keys) {
        if ($preserve_keys && !is_int($key)) {
            $flattened[$key] = $value;
        } else {
            $flattened[] = $value;
        }
    });

    return $flattened;
}


/**
 * Sort an array by the value stored in a key
 * eg. Sort a menu array or a set of form fields by order
 * @return the reordered array
 **/
function array_order_by($array, $orderby = '', $order = 'SORT_ASC', $children = false) {
    
    if($orderby == null) {
        return $array;
    }
    
    $key_value = $new_array = [];
    foreach($array as $k => $v) {
        $key_value[$k] = $v[$orderby];
    }

    if($order == 'SORT_DESC') {
        arsort($key_value);
    } else {
        asort($key_value);
    }

    reset($key_value);
    foreach($key_value as $k => $v) {
        $new_array[$k] = $array[$k];
        // children
        if($children && isset($new_array[$k][$children])) {
            $new_array[$k][$children] = array_orderby($new_array[$k][$children], $orderby, $order, $children);
        }
    }

    $new_array = array_values($new_array); 
    $array = $new_array;
    return $new_array;
 }



/**
 * Accepts an array, and returns an array of values from that array as
 * specified by $field. For example, if the array is full of objects
 * and you call util::array_pluck($array, 'name'), the function will
 * return an array of values from $array[]->name.
 *
 * @param  array   $array            An array
 * @param  string  $field            The field to get values from
 * @param  boolean $preserve_keys    Whether or not to preserve the
 *                                   array keys
 * @param  boolean $remove_nomatches If the field doesn't appear to be set,
 *                                   remove it from the array
 * @return array
 */
function array_pluck(array $array, $field, $preserve_keys = true, $remove_nomatches = true)
{
    $new_list = array();

    foreach ($array as $key => $value) {
        if (is_object($value)) {
            if (isset($value->{$field})) {
                if ($preserve_keys) {
                    $new_list[$key] = $value->{$field};
                } else {
                    $new_list[] = $value->{$field};
                }
            } elseif (!$remove_nomatches) {
                $new_list[$key] = $value;
            }
        } else {
            if (isset($value[$field])) {
                if ($preserve_keys) {
                    $new_list[$key] = $value[$field];
                } else {
                    $new_list[] = $value[$field];
                }
            } elseif (!$remove_nomatches) {
                $new_list[$key] = $value;
            }
        }
    }

    return $new_list;
}

/**
 * Searches for a given value in an array of arrays, objects and scalar
 * values. You can optionally specify a field of the nested arrays and
 * objects to search in.
 *
 * @param  array   $array  The array to search
 * @param  scalar  $search The value to search for
 * @param  string  $field  The field to search in, if not specified
 *                         all fields will be searched
 * @return boolean|scalar  False on failure or the array key on success
 */
function array_search_deep(array $array, $search, $field = false)
{
    // *grumbles* stupid PHP type system
    $search = (string) $search;

    foreach ($array as $key => $elem) {
        // *grumbles* stupid PHP type system
        $key = (string) $key;

        if ($field) {
            if (is_object($elem) && $elem->{$field} === $search) {
                return $key;
            } elseif (is_array($elem) && $elem[$field] === $search) {
                return $key;
            } elseif (is_scalar($elem) && $elem === $search) {
                return $key;
            }
        } else {
            if (is_object($elem)) {
                $elem = (array) $elem;

                if (in_array($search, $elem)) {
                    return $key;
                }
            } elseif (is_array($elem) && in_array($search, $elem)) {
                return $key;
            } elseif (is_scalar($elem) && $elem === $search) {
                return $key;
            }
        }
    }

    return false;
}

/**
 * Merges two arrays recursively and returns the result.
 *
 * @param   array   $dest               Destination array
 * @param   array   $src                Source array
 * @param   boolean $appendIntegerKeys  Whether to append elements of $src
 *                                      to $dest if the key is an integer.
 *                                      This is the default behavior.
 *                                      Otherwise elements from $src will
 *                                      overwrite the ones in $dest.
 * @return  array
 */
function array_merge_deep(array $dest, array $src, $appendIntegerKeys = true)
{
    foreach ($src as $key => $value) {
        if (is_int($key) and $appendIntegerKeys) {
            $dest[] = $value;
        } elseif (isset($dest[$key]) and is_array($dest[$key]) and is_array($value)) {
            $dest[$key] = array_merge_deep($dest[$key], $value, $appendIntegerKeys);
        } else {
            $dest[$key] = $value;
        }
    }
    return $dest;
}

/** Clean / Sanitise an array 
 * synonym for array_filter
 * @param - array - the input array
 * @return - array - the cleaned array
 **/
 function array_clean(array $array)
 {
    return array_filter($array);
 }

/** Recursively search an array by key 
 * Recursively searches a multidimensional array for a key and optional value and returns the path as a string representation or subset of the array or a value.
 *
 * @author  Akin Williams <aowilliams@arstropica.com>
 *
 * @param   int|string $needle Key
 * @param   array $haystack Array to be searched
 * @param   bool $strict Optional, limit to keys of the same type. Default false.
 * @param   string $output Optional, output key path as a string representation or array subset, ('array'|'string'|'value'). Default array.
 * @param   bool $count Optional, append number of matching elements to result. Default false.
 * @param   int|string $value Optional, limit results to keys matching this value. Default null.
 * 
 * @return  array Array containing matching keys and number of matches
 **/
 function multi_array_key_search($needle, $haystack, $strict = false, $output = 'array', $count = false, $value = null) 
 {
    // Sanity Check
    if(!is_array($haystack))
        return false;

    $resIdx='matchedIdx';
    $prevKey = "";
    $keys = array();
    $num_matches = 0;

    $numargs = func_num_args();
    if ($numargs > 6){
        $arg_list = func_get_args();
        $keys = $arg_list[6];
        $prevKey = $arg_list[7];
    }

    $keys[$resIdx] = isset($keys[$resIdx]) ? $keys[$resIdx] : 0;

    foreach($haystack as $key => $val) {
        if(is_array($val)) {
            if ((($key === $needle) && is_null($value)) || (($key === $needle) && ($val[$key] == $value) && $strict === false) || (($key === $needle) && ($val[$key] === $value) && $strict === true)){
                if ($output == 'value'){
                    $keys[$keys[$resIdx]] = $val;
                } else {
                    $keys[$keys[$resIdx]] = $prevKey . (isset($keys[$keys[$resIdx]]) ? $keys[$keys[$resIdx]] : "") . "[$key]";
                }
                $keys[$resIdx] ++;
            }
            $passedKey = $prevKey . "[$key]";;
            $keys = multi_array_key_search($needle, $val, $strict, $output, true, $value, $keys, $passedKey);
        } else {
            if ((($key === $needle) && is_null($value)) || (($key === $needle) && ($val == $value) && $strict === false) || (($key === $needle) && ($val === $value) && $strict === true)){
                if ($output == 'value'){
                    $keys[$keys[$resIdx]] = $val;
                } else {
                    $keys[$keys[$resIdx]] = $prevKey . (isset($keys[$keys[$resIdx]]) ? $keys[$keys[$resIdx]] : "") . "[$key]";
                }
                $keys[$resIdx] ++;
            }
        }
    }
    if ($numargs < 7){
        $num_matches = (count($keys) == 1) ? 0 : $keys[$resIdx];
        if ($count) $keys['num_matches'] = $num_matches;
        unset($keys[$resIdx]);
        if (($output == 'array') && $num_matches > 0){
            if (is_null($value)) {
                $replacements = multi_array_key_search($needle, $haystack, $strict, 'value', false);
            }
            $arrKeys = ($count) ? array('num_matches' => $num_matches) : array();
            for ($i=0; $i < $num_matches; $i ++){
                $keysArr = explode(',', str_replace(array('][', '[', ']'), array(',', '', ''), $keys[$i]));
                $json = "";
                foreach($keysArr as $nestedkey){
                    $json .= "{" . $nestedkey . ":";
                }
                if (is_null($value)){
                    $placeholder = time();
                    $json .= "$placeholder";
                } else {
                    $json .= "$value";
                }
                foreach($keysArr as $nestedkey){
                    $json .= "}";
                }
                $arrKeys[$i] = json_decode($json, true);
                if (is_null($value)) {
                    array_walk_recursive($arrKeys[$i], function (&$item, $key, &$userdata) {
                        if($item == $userdata['placeholder'])
                            $item = $userdata['replacement'];
                    }, array('placeholder' => $placeholder, 'replacement' => $replacements[$i]));
                }
            }
            $keys = $arrKeys;
        }
    }
    return $keys;
 }

function serialize_array_values($arr){
    foreach($arr as $key=>$val){
        sort($val);
        $arr[$key]=serialize($val);
    }
    return $arr;
}

function array_intersect_other(array $array1, array $array2) {
  foreach ($array1 as $key=>$value){
      if (!in_array($value,$array2)){
          unset($array1[$key]);
      }
  }
  return $array1;
}

function array_intersect_value($array1, $array2) {
    $result = array();
    foreach ($array1 as $val) {
      if (($key = array_search($val, $array2, TRUE))!==false) {
         $result[] = $val;
         unset($array2[$key]);
      }
    }
    return $result;
} 

function filterBy($rs, $key, $val, $sort = "c_reference", $dirn = "ASC", $offset = 0, $limit = 0)
{

  $newrs = [];
  for($d = 0; $d < count($rs); $d++) {
    $rs[$d][$key] == $val ? $newrs[] = $rs[$d] : null ;
  }

  usort($newrs, function($item1, $item2) {
    global $sort; global $dirn;
    if($dirn === 'ASC') {
      return @$item1[$sort] <=> @$item2[$sort];
    } else {
      return @$item2[$sort] <=> @$item1[$sort];
    }
  });

  if($limit !== 0) {
    return array_slice($newrs, $offset, $limit);
  } else {
    return $newrs;
  }

}

function strtobool($val) {
	if($val === 'false') {
		return false;
	} else if($val === 'true') {
		return true;
	} else {
		return $val;
	}
}

function convert_to_object($array) {
    $object = new stdClass();
    foreach ($array as $key => $value) {
        if (is_array($value)) {
            $value = convert_to_object($value);
        }
        $object->$key = $value;
    }
    return $object;
}

function array_map_deep($callback, $array) {
    
    $new = [];
    if(is_array($array)) {
      foreach ($array as $key => $val) {
          if (is_array($val)) {
              $new[$key] = array_map_deep($callback, $val);
          } else {
              $new[$key] = call_user_func($callback, $val);
          }
      }
    }
  
    return $new;
}

function starts_with($haystack, $needle)
{
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}

function ends_with($haystack, $needle)
{
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

function n($n)
{
    $n = str_replace(',','.',$n);
    $n = floatval($n);
    return $n; 
}

function get_sum(float $a, float $b)
{
    return $a + $b;
}


function object_encode($a) {
   return json_encode(object_to_array($a), JSON_FORCE_OBJECT);
}

// This will retrieve the "intended" request method.  Normally, this is the
// actual method of the request.  Sometimes, though, the intended request method
// must be hidden in the parameters of the request.  For example, when attempting to
// delete a file using a POST request. In that case, "DELETE" will be sent along with
// the request in a "_method" parameter.
function get_request_method() {
    global $HTTP_RAW_POST_DATA;

    if(isset($HTTP_RAW_POST_DATA)) {
        parse_str($HTTP_RAW_POST_DATA, $_POST);
    }

    if (isset($_POST["_method"]) && $_POST["_method"] != null) {
        return $_POST["_method"];
    }

    return $_SERVER["REQUEST_METHOD"];
}


/*
 * Inserts a new key/value before the key in the array.
 *
 * @param $key
 *   The key to insert before.
 * @param $array
 *   An array to insert in to.
 * @param $new_key
 *   The key to insert.
 * @param $new_value
 *   An value to insert.
 *
 * @return
 *   The new array if the key exists, FALSE otherwise.
 *
 * @see array_insert_after()
 */
function array_insert_before($key, array &$array, $new_key, $new_value) {
  if (array_key_exists($key, $array)) {
    $new = array();
    foreach ($array as $k => $value) {
      if ($k === $key) {
        $new[$new_key] = $new_value;
      }
      $new[$k] = $value;
    }
    return $new;
  }
  return FALSE;
}

/*
 * Inserts a new key/value after the key in the array.
 *
 * @param $key
 *   The key to insert after.
 * @param $array
 *   An array to insert in to.
 * @param $new_key
 *   The key to insert.
 * @param $new_value
 *   An value to insert.
 *
 * @return
 *   The new array if the key exists, FALSE otherwise.
 *
 * @see array_insert_before()
 */
function array_insert_after($key, array &$array, $new_key, $new_value) {
  if (array_key_exists($key, $array)) {
    $new = array();
    foreach ($array as $k => $value) {
      $new[$k] = $value;
      if ($k === $key) {
        $new[$new_key] = $new_value;
      }
    }
    return $new;
  }
  return FALSE;
}

function is_json($string)
{
    $result = json_decode($string, true);
    switch (json_last_error()) {
        case JSON_ERROR_NONE:
           return $result; 
        break;
        case JSON_ERROR_DEPTH:
        case JSON_ERROR_STATE_MISMATCH:
        case JSON_ERROR_CTRL_CHAR:
        case JSON_ERROR_SYNTAX:
        case JSON_ERROR_UTF8:
        default:
            return $string;
        break;
    }
}


// Does not support flag GLOB_BRACE        
function glob_recursive($pattern, $flags = 0)
{
  $files = glob($pattern, $flags);
  foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir) {
    $files = array_merge($files, glob_recursive($dir.'/'.basename($pattern), $flags));
  }
  return $files;
}


function normalize_files_array($files = []) 
{
    $normalized_array = [];
    foreach($files as $index => $file) {

        if (!is_array($file['name'])) {
            $normalized_array[$index][] = $file;
            continue;
        }

        foreach($file['name'] as $idx => $name) {
            $normalized_array[$index][$idx] = [
                'name' => $name,
                'type' => $file['type'][$idx],
                'tmp_name' => $file['tmp_name'][$idx],
                'error' => $file['error'][$idx],
                'size' => $file['size'][$idx]
            ];
        }

    }
    return $normalized_array;
}

function is_true($key, $array)
{
  if(array_key_exists($key, $array) and $array[$key] == 'true') {
    return true;
  } else if (array_key_exists($key, $array) and $array[$key] == true) {
    return true;
  } else {
    return false;
  }
}

function is_set($key, $array)
{
  if(array_key_exists($key, $array) and $array[$key] != "") {
    return true;
  } else {
    return false;
  }
}

function is_assoc(array $arr)
{
    if (array() === $arr) return false;
    return array_keys($arr) !== range(0, count($arr) - 1);
}

function nltobr($data) {
  $newrow = [];
  foreach($data as $lbl => $val) {
      $newrow[$lbl] = str_replace(',,', ',', preg_replace("/\r\n|\r|\n/",',',$val));
  }
  return $newrow;
}

/**
 * All of the Defines for the classes below.
 * @author S.C. Chen <me578022@gmail.com>
 */
define('HDOM_TYPE_ELEMENT', 1);
define('HDOM_TYPE_COMMENT', 2);
define('HDOM_TYPE_TEXT',  3);
define('HDOM_TYPE_ENDTAG',  4);
define('HDOM_TYPE_ROOT',  5);
define('HDOM_TYPE_UNKNOWN', 6);
define('HDOM_QUOTE_DOUBLE', 0);
define('HDOM_QUOTE_SINGLE', 1);
define('HDOM_QUOTE_NO',  3);
define('HDOM_INFO_BEGIN',   0);
define('HDOM_INFO_END',  1);
define('HDOM_INFO_QUOTE',   2);
define('HDOM_INFO_SPACE',   3);
define('HDOM_INFO_TEXT',  4);
define('HDOM_INFO_INNER',   5);
define('HDOM_INFO_OUTER',   6);
define('HDOM_INFO_ENDSPACE',7);
define('DEFAULT_TARGET_CHARSET', 'UTF-8');
define('DEFAULT_BR_TEXT', "\r\n");
define('DEFAULT_SPAN_TEXT', " ");
define('MAX_FILE_SIZE', 600000);
// helper functions
// -----------------------------------------------------------------------------
// get html dom from file
// $maxlen is defined in the code as PHP_STREAM_COPY_ALL which is defined as -1.
function file_get_html(
    $url, 
    $use_include_path = false, 
    $context = null, 
    $offset = -1, 
    $maxLen = -1, 
    $lowercase = true, 
    $forceTagsClosed = true, 
    $target_charset = DEFAULT_TARGET_CHARSET, 
    $stripRN = true, 
    $defaultBRText = DEFAULT_BR_TEXT, 
    $defaultSpanText=DEFAULT_SPAN_TEXT
)
{
    // We DO force the tags to be terminated.
    $dom = new Htmldom(null, $lowercase, $forceTagsClosed, $target_charset, $stripRN, $defaultBRText, $defaultSpanText);
    // For sourceforge users: uncomment the next line and comment the retreive_url_contents line 2 lines down if it is not already done.
    $contents = file_get_contents($url, $use_include_path, $context, $offset);
    // Paperg - use our own mechanism for getting the contents as we want to control the timeout.
    //$contents = retrieve_url_contents($url);
    if (empty($contents) || strlen($contents) > MAX_FILE_SIZE)
    {
      return false;
    }
    // The second parameter can force the selectors to all be lowercase.
    $dom->load($contents, $lowercase, $stripRN);
    return $dom;
}

// get html dom from string
function str_get_html(
    $str, 
    $lowercase=true, 
    $forceTagsClosed=true, 
    $target_charset = DEFAULT_TARGET_CHARSET, 
    $stripRN=true, 
    $defaultBRText=DEFAULT_BR_TEXT, 
    $defaultSpanText=DEFAULT_SPAN_TEXT
)
{
  $dom = new Htmldom(null, $lowercase, $forceTagsClosed, $target_charset, $stripRN, $defaultBRText, $defaultSpanText);
  if (empty($str) || strlen($str) > MAX_FILE_SIZE)
  {
    $dom->clear();
    return false;
  }
  $dom->load($str, $lowercase, $stripRN);
  return $dom;
}

// dump html dom tree
function dump_html_tree($node, $show_attr=true, $deep=0)
{
  $node->dump($node);
}

/*
function exception_error_handler($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        // This error code is not included in error_reporting
        return;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
}
set_error_handler("exception_error_handler");
*/

function object_to_array($obj) {
    if(is_object($obj)) $obj = (array) dismount($obj);
    if(is_array($obj)) {
        $new = array();
        foreach($obj as $key => $val) {
            $new[$key] = object_to_array($val);
        }
    }
    else $new = $obj;
    return $new;
  } 
function dismount($object) {
    $reflectionClass = new ReflectionClass(get_class($object));
    $array = array();
    foreach ($reflectionClass->getProperties() as $property) {
        $property->setAccessible(true);
        $array[$property->getName()] = $property->getValue($object);
        $property->setAccessible(false);
    }
    return $array;
}

function singletonize(\Closure $func)
{
    $singled = new class($func)
    {
        // Hold the class instance.
        private static $instance = null;
        public function __construct($func = null)
        {
            if (self::$instance === null) {
                self::$instance = $func();
            }
            return self::$instance;
        }
        // The singleton decorates the class returned by the closure
        public function __call($method, $args)
        {
            return call_user_func_array([self::$instance, $method], $args);
        }
        private function __clone(){}
        private function __wakeup(){}
    };
    return $singled;
}

function generateRandomString($length = 10) 
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}

function strToHex($string){
    $hex = '';
    for ($i=0; $i<strlen($string); $i++){
        $ord = ord($string[$i]);
        $hexCode = dechex($ord);
        $hex .= substr('0'.$hexCode, -2);
    }
    return strToUpper($hex);
}
function hexToStr($hex){
    $string='';
    for ($i=0; $i < strlen($hex)-1; $i+=2){
        $string .= chr(hexdec($hex[$i].$hex[$i+1]));
    }
    return $string;
}

function slugify($string, $replace = array(), $delimiter = '-') {
  // https://github.com/phalcon/incubator/blob/master/Library/Phalcon/Utils/Slug.php
  if (!extension_loaded('iconv')) {
    throw new Exception('iconv module not loaded');
  }
  // Save the old locale and set the new locale to UTF-8
  $oldLocale = setlocale(LC_ALL, '0');
  setlocale(LC_ALL, 'en_US.UTF-8');
  $clean = iconv('UTF-8', 'ASCII//TRANSLIT', $string);
  if (!empty($replace)) {
    $clean = str_replace((array) $replace, ' ', $clean);
  }
  $clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
  $clean = strtolower($clean);
  $clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
  $clean = trim($clean, $delimiter);
  // Revert back to the old locale
  setlocale(LC_ALL, $oldLocale);
  return $clean;
}

function base64_image_content($base64_image_content,$path = '../tmp/'){
  if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64_image_content, $result)) {
    $type = $result[2];
    $new_file = $path."/".date('Ymd',time())."/";
    $basePutUrl = C('UPLOAD_IMG_BASE64_URL').$new_file;

    if(!file_exists($basePutUrl)){
      //Check if there is a folder, if not, create it and grant the highest authority.
      mkdir($basePutUrl, 0700);
    }
    $ping_url = genRandomString(8).time().".{$type}";
    $ftp_image_upload_url = $new_file.$ping_url;
    $local_file_url = $basePutUrl.$ping_url;

    if (file_put_contents($local_file_url, base64_decode(str_replace($result[1], '', $base64_image_content)))){
      ftp_upload(C('REMOTE_ROOT').$ftp_image_upload_url,$local_file_url);
      return $ftp_image_upload_url;
    }else{
      return false;
    }
  }else{
    return 'No regex';
  }
}

function nl2br2($string) {
$string = str_replace(array("\r\n", "\r", "\n"), "<br />", $string);
return $string;
} 

function scan_recursively($source_dir, $authorized_ext, $folder_prefix, $directory_depth = 5, $hidden = false)
{
    if ($fp = @opendir($source_dir)) {
        $filedata   = array();
        $new_depth  = $directory_depth - 1;
        $source_dir = rtrim($source_dir, '/').'/';
        $parent_folder = null;

        while (false !== ($file = readdir($fp))) {
            // Remove '.', '..', and hidden files [optional]
            if (! trim($file, '.') or ($hidden == false && $file[0] == '.')) {
                continue;
            }

            if (($directory_depth < 1 or $new_depth > 0) && @is_dir($source_dir.$file)) {
                $filedata[$folder_prefix . $file] = scan_recursively($source_dir.$file.'/', $authorized_ext, $folder_prefix, $new_depth, $hidden);
            } else if(is_authorized($file, $authorized_ext)) {
                $filedata[] = array(
                    'ext'  => pathinfo($file, PATHINFO_EXTENSION),
                    'name' => $file,
                    'size' => filesize($source_dir.$file)
                );
            }
        }

        closedir($fp);
        return $filedata;
    }
        echo 'can not open dir';
        return false;
}

function is_authorized($file, $authorized_ext) {
    $ext = '.' . pathinfo($file, PATHINFO_EXTENSION);
    if ($authorized_ext[0] === '.*' || in_array($ext, $authorized_ext)) {
        return true;
    }

    return false;
}

function file_get_contents_custom($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_REFERER, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION , 1);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; U; Linux; i686; en-US; rv:1.6) Gecko Debian/1.6-7'); 
    $data = curl_exec($ch); 
    curl_close($ch);
    return $data;
}

