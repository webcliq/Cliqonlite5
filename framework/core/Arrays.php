<?php
/**
 * @author   Muhammad Umer Farooq <lablnet01@gmail.com>
 * @author   profile https://www.facebook.com/Muhammadumerfarooq01/
 *
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 * @license MIT
 */

namespace core;

use \core\Engine as Cliq;
use \core\Html as H;
use \core\Db as Db;
use \Framework as F;
use \core\Files as Files;
use \Firephp;
use \R;

class Arrays
{

    /**
     * @var  arr  $defaults  The find() method default values.
     */
    public static $defaults = array(
        'where'         => array(),
        'limit'         => 0,
        'offset'        => 0,
        'sort_key'      => null,
        'sort_order'    => 'ASC'
    );

    /**
     * @var  str  $key_split  The string to split keys when checking a deep multidimensional array value.
     */
    public static $key_split = '.';

    /**
     * @var  arr  $operators  A list of valid operators for comparisons.
     */
    public static $operators = array('==', '===', '!=', '!==', '>', '<', '>=', '<=', '~', '!~');

    /**
     * Determine is given value is really, array?.
     *
     * @param mixed $value Value to be checked.
     * @return bool
     */
    public static function isReallyArray($value)
    {
        return is_array($value) && count($value) !== 0;
    }

    /**
     * Determine array is (sequential).
     *
     * @param array $array Value to be check.
     * @return bool
     */
    public static function isSequential($array) :bool
    {
        return is_array($array) && !self::isAssoc($array) && !self::isMulti($array);
    }

    /**
     * Determine array has numbered keys.
     *
     * @param array $array Value to be check.
     * @return bool
     */
    public static function hasNumericKeys($array) :bool
    {
        if(!is_array($array)) {
            return false;
        } else {
            $onlykeys = array_keys($array);
            $flip = array_flip($onlykeys);
            $sum = array_sum($flip);
            if((int)$sum > 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Determine array is Assoc.
     *
     * @param array $value Value to be check.
     * @return bool
     */
    public static function isAssoc(array $array) :bool
    {
        return array_keys($array) !== range(0, count($array) - 1) && !self::isMulti($array);
    }

    /**
     * Determine array is multi-dimensional.
     *
     * @param array $value Value to be check.
     * @return bool
     */
    public static function isMulti(array $array) :bool
    {
        sort($array, SORT_REGULAR);

        return isset($array[0]) && is_array($array[0]);
    }

    /**
     * Get type of array.
     *
     * @param array $array The array to work on.
     * @return mixed
     */
    public static function getType(array $array)
    {
        if (self::isReallyArray($array)) {
            if (self::isSequential($array)) {
                $type = 'indexes';
            } elseif (self::isAssoc($array)) {
                $type = 'assoc';
            } elseif (self::isMulti($array)) {
                $type = 'multi';
            }

            return isset($type) ? $type : false;
        }

        throw new \InvalidArgumentException('The given array should not be empty', 500);
    }

    /**
     * Add an element to an array using "dot" notation if it doesn't exist.
     *
     * @param array  $array Array to be evaluated
     * @param string $key   Key
     * @param string $opr   Notation like 'dot'
     * @param
     * @return array
     */
    public static function add($array, $key, $value, $opr = null)
    {
        if (!self::has($array, $key, $opr)) {
            self::set($array, $key, $value, $opr);
        }
        return $array;
    }

    /**
     * Set an array item to a given value using "operator" notation.
     *
     * @param array  $array Array to be evaluated.
     * @param string $key   Key
     * @param mixed  $value Value
     * @param string $opr   Notation like 'dot'
     * @return array
     */
    public static function set(&$array, $key = null, $value = null, $opr = null)
    {
        if (null === $value) {
            return $array;
        }
        if (null === $key) {
            return $array = $value;
        }
        if (null === $opr) {
            return $array[$key] = $value;
        }

        $keys = explode($opr, $key);
        foreach ($keys as $key) {
            if (!isset($array[$key]) || !is_array($array[$key])) {
                $array[$key] = [];
            }

            $array = &$array[$key];
        }

        $array = $value;

        return $array;
    }

    /**
     * Get an item from an array using "operator" notation.
     *
     * @param array        $array Default array.
     * @param array|string $keys  Keys to search.
     * @param string       $opr   Operator notaiton.
     * @return array
     */
    public static function get($array, $key = null, $default = null, $opr = null)
    {
        if (!self::isReallyArray($array)) {
            return $default;
        }
        if (null === $key) {
            return $array;
        }
        if (array_key_exists($key, $array)) {
            return $array[$key];
        }

        if (null !== $opr) {
            if (strpos($key, $opr) === false) {
                return $array[$key] ?? $default;
            }

            foreach (explode($opr, $key) as $k) {
                if (self::isReallyArray($array) && array_key_exists($k, $array)) {
                    $array = $array[$k];
                } else {
                    return $default;
                }
            }

            return $array;
        }

        return $default;
    }

    /**
     * Determine if an item or items exist in an array using 'Operator' notation.
     *
     * @param array        $array Default array.
     * @param array|string $keys  Keys to search.
     * @param string       $opr   Operator notaiton.
     * @return bool
     */
    public static function has($array, $keys = null, $opr = null)
    {
        $keys = (array) $keys;

        if (count($keys) === 0) {
            return false;
        }

        foreach ($keys as $key) {
            $get = self::get($array, $key, null, $opr);
            if (self::isReallyArray($get) || $get === null) {
                return false;
            }
        }

        return true;
    }

    /**
     * Convert a multi-dimensional array to assoc.
     *
     * @param array $array Value to be converted.
     * @return array
     */
    public static function multiToAssoc(array $arrays)
    {
        $results = [];
        foreach ($arrays as $key => $value) {
            if (self::isReallyArray($value) === true) {
                $results = array_merge($results, self::multiToAssoc($value));
            } else {
                $results[$key] = $value;
            }
        }

        return $results;
    }

    /**
     * Converted a multi-dimensional associative array with `dot`.
     *
     * @param array $arrays Arrays.
     * @return bool
     */
    public static function dot(array $arrays)
    {
        return self::multiToAssocWithSpecificOpr($arrays, '.');
    }

    /**
     * Converted a multi-dimensional associative array with `operator`.
     *
     * @param array  $arrays Arrays.
     * @param string $opr    Operator.
     * @return array
     */
    public static function multiToAssocWithSpecificOpr(array $arrays, $opr = null)
    {
        $results = [];
        foreach ($arrays as $key => $value) {
            if (self::isReallyArray($value) === true) {
                $results = array_merge($results, self::multiToAssocWithSpecificOpr($value, $key.$opr));
            } else {
                $key = $opr.$key;
                $key = ($key[0] === '.' || $key[0] === '@' ? substr($key, 1) : $key);
                $results[$key] = $value;
            }
        }

        return $results;
    }

    /**
     * Push an item onto the beginning of an array.
     *
     * @param array $array Dafult array.
     * @param mixed $value Value to be append.
     * @param mixed $key   Key.
     * @return array
     */
    public static function prepend($array, $value, $key = null)
    {
        if ($key === null) {
            array_unshift($array, $value);
        } else {
            $array = array_merge([$key => $value], $array);
        }

        return $array;
    }

    /**
     * Push an item onto the end of an array.
     *
     * @param array $array Dafult array, where value to append.
     * @param mixed $value Value to be append.
     * @param mixed $key   Key.
     * @return array
     */
    public static function append($array, $value, $key = null)
    {
        return array_merge($array, [$key => $value]);
    }

    /**
     * Get the unique elements from array.
     *
     * @param array $array Array ot evaulated
     * @return array
     */
    public static function unique($array)
    {
        $results = [];
        if (self::isMulti($array)) {
            $array = self::multiToAssoc($array);
            foreach ($array as $key => $value) {
                $results[] = $value;
            }

            return array_unique($array);
        }

        return array_unique($array);
    }

    /**
     * Get a subset of the items from the given array.
     *
     * @param array $array Array to be evaulated.
     * @param mixed $keys  Keys
     * @return array
     */
    public static function subSetOfArray(array $array, $keys)
    {
        return array_intersect_key($array, array_flip((array) $keys));
    }

    /**
     * Remove one or many array items from a given array using "operator" notation.
     *
     * @param array        $array Array to be evaluated.
     * @param array|string $keys  Keys.
     *
     * Note: Adapted from laravel\framework.
     *
     * @see https://github.com/laravel/framework/blob/5.8/LICENSE.md
     *
     * @return mixed
     */
    public static function forget(&$array, $keys, $opr = null)
    {
        $original = &$array;

        $keys = (array) $keys;

        if (count($keys) === 0) {
            return false;
        }
        foreach ($keys as $key) {
            // if the exact key exists in the top-level, remove it
            if (array_key_exists($key, $array)) {
                unset($array[$key]);
                continue;
            }

            if (null !== $opr) {
                $parts = explode($opr, $key);

                // clean up before each pass
                $array = &$original;

                while (count($parts) > 1) {
                    $part = array_shift($parts);

                    if (isset($array[$part]) && is_array($array[$part])) {
                        $array = &$array[$part];
                    } else {
                        continue 2;
                    }
                }

                unset($array[array_shift($parts)]);
            }
        }
    }

    /**
     * Get all of the given array except for a specified array of keys.
     *
     * @param array        $array Default array.
     * @param array|string $keys  Keys
     * @return array
     */
    public static function except($array, $keys)
    {
        self::forget($array, $keys);
        return $array;
    }

    /**
     * Get a value from the array, and remove it.
     *
     * @param array  $array   Default Array.
     * @param string $key     Keys
     * @param mixed  $default Default value
     * @return mixed
     */
    public static function pull(&$array, $key, $default = null, $opr = null)
    {
        $value = self::get($array, $key, $default, $opr);
        self::forget($array, $key);

        return $value;
    }

    /**
     * Changes the case of all keys in an array.
     *
     * @param array  $array The array to work on.
     * @param string $case  Either CASE_UPPER or CASE_LOWER (default).
     * @return array
     */
    public static function arrayChangeCaseKey($array, $case = CASE_LOWER)
    {
        return array_map(function ($item) use ($case) {
            if (is_array($item)) {
                $item = self::arrayChangeCaseKey($item, $case);
            }

            return $item;
        }, array_change_key_case($array, $case));
    }

    /**
     * Changes the case of all values in an array.
     *
     * @param array  $array The array to work on.
     * @param string $case  Either CASE_UPPER or CASE_LOWER (default).
     * @return array
     */
    public static function arrayChangeCaseValue($array, $case = CASE_LOWER)
    {
        $return = [];
        foreach ($array as $key => $value) {
            if (self::isReallyArray($value)) {
                $results = array_merge($results, self::arrayChangeCaseValue($value, $case));
            } else {
                $array[$key] = ($case == CASE_UPPER) ? strtoupper($array[$key]) : strtolower($array[$key]);
            }
        }

        return $array;
    }

    /**
     * Remove duplicate values from array.
     *
     * @param array      $array The array to work on.
     * @param string|int $key   Key that need to evaulate.
     * @return array
     */
    public static function removeDuplicates(array $array, $key = '')
    {
        if (!self::isReallyArray($array)) {
            return false;
        }
        if (self::isSequential($array) || self::isAssoc($array)) {
            return array_unique($array);
        }
        if (self::isMulti($array) && empty($key)) {
            return false;
        }
        $dataSet = [];
        $i = 0;
        $keys = [];
        foreach ($array as $k) {
            if (in_array($k[$key], $keys)) {
                continue;
            } else {
                $keys[$i] = $k[$key];
                $dataSet[$i] = $k;
            }

            $i++;
        }

        return $dataSet;
    }

    /**
     * Get the most|least occurring value from array.
     *
     * @param string     $type  The type most|least
     * @param array      $array The array to work on.
     * @param string|int $key   Key that need to evaulate.
     * @return array
     */
    private static function mostOrLeastOccurring(string $type, array $array, $key = '')
    {
        $occurring = [];

        if (self::isAssoc($array) || self::isMulti($array)) {
            $values = array_count_values(array_column($array, $key));
        } else {
            $values = array_count_values($array);
        }

        $tmp = $type === 'most' ? current($values) : current($values);
        unset($values[$tmp]);
        foreach ($values as $key => $value) {
            if ($type === 'most') {
                if ($tmp <= $value) {
                    $tmp = $key;
                    $occurring[] = $key;
                }
            } elseif ($type === 'least') {
                if ($tmp > $value) {
                    $tmp = $key;
                    $occurring[] = $key;
                }
            }
        }

        return $occurring;
    }

    /**
     * Get the most occurring value from array.
     *
     * @param array      $array The array to work on.
     * @param string|int $key   Key that need to evaulate.
     * @return array
     */
    public static function mostOccurring(array $array, $key = '')
    {
        return self::mostOrLeastOccurring('most', $array, $key);
    }

    /**
     * Get the least occurring value from array.
     *
     * @param array      $array The array to work on.
     * @param string|int $key   Key that need to evaulate.
     * @return array
     */
    public static function leastOccurring(array $array, $key = '')
    {
        return self::mostOrLeastOccurring('least', $array, $key);
    }

    /**
     * Convert the array into a query string.
     *
     * @param array $array The array to work on.
     * @return string
     */
    public static function query($array)
    {
        return http_build_query($array, null, '&', PHP_QUERY_RFC3986);
    }

    /**
     * Filter the array using the given callback.
     *
     * @param array    $array    The array to work on.
     * @param callable $callback Callback function.
     * @return array
     */
    public static function where(array $array, callable $callback)
    {
        return array_filter($array, $callback, ARRAY_FILTER_USE_BOTH);
    }

    /**
     * Shuffle the given array for associative arrays, preserves key=>value pairs.
     * THIS METION WILL NOT WORKS WITH MULTIDIMESSIONAL ARRAY.
     *
     * @param array $array The array to work on.
     * @return bool
     */
    public static function shuffle(array &$array)
    {
        $dataSet = [];

        $keys = array_keys($array);

        shuffle($keys);

        foreach ($keys as $key) {
            $dataSet[$key] = $array[$key];
        }

        $array = $dataSet;

        return true;
    }

    /**
     * Get one or a specified number of random values from an array.
     *
     * @param array    $array The array to work on.
     * @param int|null $i     Specifies how many entries should be picked.
     * @return mixed
     */
    public static function random(array $array, int $i = null)
    {
        (int) $i = $i ?? 1;
        $countElement = count($array);

        if ($countElement < $i) {
            throw new \OutOfBoundsException("You requested {$i} items, but there are only {$countElement} items available.", 500);
        }
        if ($i === 0) {
            throw new \OutOfBoundsException('Second argument has to be between 1 and the number of elements in the array', 500);
        }

        $keys = array_rand($array, $i);
        $dataSet = [];

        foreach ((array) $keys as $key) {
            $dataSet[] = $array[$key];
        }

        return $dataSet;
    }

    /**
     * Get multiple values of same keys from multi-dimessional array.
     *
     * @param array $array The array to work on.
     * @param mixed $key   The specific key to search/get values.
     * @return mixed
     */
    public static function pluck(array $array, $key)
    {
        if (self::isMulti($array)) {
            $dataSet = [];
            array_walk_recursive($array, function ($value, $k) use (&$dataSet, $key) {
                if ($k == $key) {
                    $dataSet[] = $value;
                }
            });

            return $dataSet;
        }

        throw new \InvalidArgumentException('The array given should be multi-dimensional array, '.self::getType($array).' given', 500);
    }

    /**
     * This method combines the functionality of the where() and sort() methods,
     * with additional limit and offset parameters. Returns an array of matching
     * array items. Will only sort if a sort key is set.
     * 
     * @param   arr    $data      The array of objects or associative arrays to search.
     * @param   arr    $options   The query options, see Arrch::$defaults.
     * @param   misc   $key       An item's key or index value.
     * @return  arr    The result array.
     */
    public static function find(array $data, array $options = array(), $key = 'all')
    {
        $options = static::merge(static::$defaults, $options);
        $data = static::where($data, $options['where']);
        $data = $options['sort_key'] ? static::sort($data, $options['sort_key'], $options['sort_order']) : $data;
        $data = array_slice($data, $options['offset'], ($options['limit'] == 0) ? null : $options['limit'], true);
        switch ($key) {
            case 'all':
                return $data;
                break;
            case 'first':
                return array_shift($data);
                break;
            case 'last':
                return array_pop($data);
                break;
            default:
                return isset($data[$key]) ? $data[$key] : null;
                break;
        }
    }

    /**
     * Sorts an array of objects by the specified key.
     * 
     * @param   arr   $data    The array of objects or associative arrays to sort.
     * @param   str   $key     The object key or key path to use in sort evaluation.
     * @param   str   $order   ASC or DESC.
     * @return  arr   The result array.
     */
    public static function sort(array $data, $key, $order = null)
    {
        uasort($data, function ($a, $b) use ($key) {
            $a_val = Arrch::extractValues($a, $key);
            $b_val = Arrch::extractValues($b, $key);

            // Strings
            if (is_string($a_val) && is_string($b_val)) {
                return strcasecmp($a_val, $b_val);
            } else {
                if ($a_val == $b_val) {
                    return 0;
                } else {
                    return ($a_val > $b_val) ? 1 : -1;
                }
            }
        });

        if (strtoupper($order ?: Arrch::$defaults['sort_order']) == 'DESC') {
            $data = array_reverse($data, true);
        }

        return $data;
    }

    /**
     * Evaluates an object based on an array of conditions
     * passed into the function, formatted like so...
     * 
     *      array('city', 'arlington');
     *      array('city', '!=', 'arlington');
     * 
     * @param   arr   $data         The array of objects or associative arrays to search.
     * @param   arr   $conditions   The conditions to evaluate against.
     * @return  arr   The result array.
     */
    public static function wheres(array $data, array $conditions = array())
    {
        foreach ($conditions as $condition) {
            if (!is_array($condition)) {
                trigger_error('Condition '.var_export($condition, true).' must be an array!', E_USER_ERROR);
            } else {
                array_map(function ($item, $key) use (&$data, $condition) {
                    $return = 0;
                    $operator = array_key_exists(2, $condition) ? $condition[1] : '===';
                    $search_value = array_key_exists(2, $condition) ? $condition[2] : $condition[1];
                    if (is_array($condition[0])) {
                        // array of keys
                        if (is_array($search_value)) {
                            // array of values
                            foreach ($condition[0] as $prop) {
                                $value = Arrch::extractValues($item, $prop);
                                foreach ($search_value as $query_val) {
                                    $return += Arrch::compare(array($value, $operator, $query_val)) ? 1 : 0;
                                }
                            }
                        } else {
                            // single value
                            foreach ($condition[0] as $prop) {
                                $value = Arrch::extractValues($item, $prop);
                                $return += Arrch::compare(array($value, $operator, $search_value)) ? 1 : 0;
                            }
                        }
                    } elseif (is_array($search_value)) {
                        // single key, array of query values
                        $value = Arrch::extractValues($item, $condition[0]);
                        $c = 0;
                        foreach ($search_value as $query_val) {
                            $c += Arrch::compare(array($value, $operator, $query_val)) ? 1 : 0;
                        }
                        // Negate options that don't pass all negative assertions
                        if (in_array($operator, array('!==', '!=', '!~')) && $c < count($search_value)) {
                            $c = 0;
                        }
                        $return += $c;
                    } else {
                        // single key, single value
                        $value = Arrch::extractValues($item, $condition[0]);
                        $return = Arrch::compare(array($value, $operator, $search_value));
                    }

                    // Unset
                    if (!$return) {
                        unset($data[$key]);
                    }
                }, $data, array_keys($data));
            }
        }
        return $data;
    }

    /**
     * Finds the requested value in a multidimensional array or an object and
     * returns it.
     * 
     * @param    mixed   $item   The item containing the value.
     * @param    str     $key    The key or key path to the desired value.
     * @return   mixed   The found value or null.
     */
    public static function extractValues($item, $key)
    {
        // Array of results
        $results = array();

        // Cast as array if object
        $item = is_object($item) ? (array) $item : $item;

        // Array of keys
        $keys = strstr($key, static::$key_split) ? explode(static::$key_split, $key) : array($key);
        $keys = array_filter($keys);

        // Key count
        $key_count = count($keys);

        // key count > 0
        if ($key_count > 0) {

                $curr_key = array_shift($keys);
                $arrayValues = array_values($item);
                $child = is_array($item) ? array_shift($arrayValues) : null;

                // it's an array
                if (is_array($item)) {
                    // Clean non-ASCII keys
                    foreach ($item as $k => $v) {
                        $sanitized = preg_replace('/[^(\x20-\x7F)]*/','', $k);
                        if ($sanitized !== $k) {
                            $item[$sanitized] = $v;
                            unset($item[$k]);
                        }
                    }

                    // it has the keys
                    if (array_key_exists($curr_key, $item)) {
                        $results = array_merge($results, static::extractValues($item[$curr_key], implode(static::$key_split, $keys)));
                    // else it's child has the key
                    } elseif ((is_array($child) || is_object($child))) {
                        if (array_key_exists($curr_key, $child)) {
                            foreach ($item as $child) {
                                $results = array_merge($results, static::extractValues($child, $key));
                            }
                        }
                    }
                }

        // no key
        } else {
            $results[] = $item;
        }
        return $results;
    }

    /**
     * Runs comparison operations on an array of values formatted like so...
     * 
     *      e.g. array($value, $operator, $value)
     * 
     * Returns true or false depending on the outcome of the requested
     * comparative operation (<, >, =, etc..).
     * 
     * @param   arr   $array  The comparison array.
     * @return  bool  Whether the operation evaluates to true or false.
     */
    public static function compare(array $array)
    {
        $return = 0;
        foreach ($array[0] as $value) {
            if ($array[1] === '~') {
                // Check if variables loosely match right away
                if ($value != $array[2]) {
                    if (is_string($value) && is_string($array[2])) {
                        $return += stristr($value, $array[2]) ? 1 : 0;
                    } elseif (is_null($value) && is_null($array[2])) {
                        $return += 1;
                    } elseif (is_array($value) || is_object($value)) {
                        $return += stristr(var_export($value, true), $array[2]) ? 1 : 0;
                    }
                } else {
                    $return += 1;
                }
            } elseif ($array[1] === '!~') {
                if (is_string($value) && is_string($array[2])) {
                    $return += !stristr($value, $array[2]) ? 1 : 0;
                } elseif (is_null($value) && is_null($array[2])) {
                    $return += 0;
                } elseif (is_array($value) || is_object($value)) {
                    $return += !stristr(var_export($value, true), $array[2]) ? 1 : 0;
                }
            } else {
                if (is_array($value) || is_object($value)) {
                    trigger_error('Cannot compare object of type '.strtoupper(gettype($value)).' with the "'.$array[1].'" operator.', E_USER_WARNING);
                }

                if (!in_array($array[1], static::$operators)) {
                    trigger_error('Operator "'.$array[1].'" is not valid.', E_USER_ERROR);
                } else {
                    switch ($array[1]) {
                        case '==':
                            $return += ($value == $array[2]) ? 1 : 0;
                            break;
                        case '===':
                            $return += ($value === $array[2]) ? 1 : 0;
                            break;
                        case '!=':
                            $return += ($value != $array[2]) ? 1 : 0;
                            break;
                        case '!==':
                            $return += ($value !== $array[2]) ? 1 : 0;
                            break;
                        case '>':
                            $return += ($value > $array[2]) ? 1 : 0;
                            break;
                        case '<':
                            $return += ($value < $array[2]) ? 1 : 0;
                            break;
                        case '>=':
                            $return += ($value >= $array[2]) ? 1 : 0;
                            break;
                        case '<=':
                            $return += ($value <= $array[2]) ? 1 : 0;
                            break;
                    }
                }
            }
        }
        return $return;
    }

    /**
     * Recursive array merge for options arrays to eliminate duplicates
     * in a smart manner using a variable number of array arguments.
     * 
     * @param   arr  Various options arrays.
     * @return  arr  The merged array.
     */
    public static function merge()
    {
        $args = func_get_args();
        $where = array();
        $options = array();
        foreach ($args as $o) {
            $options = array_merge($options, $o);
            if (isset($o['where'])) {
                if (count($where) === 0) {
                    $where = $o['where'];
                } else {
                    foreach ($o['where'] as $oc) {
                        $matches = 0;
                        foreach ($where as $wc) {
                            if ($oc == $wc) {
                                $matches += 1;
                            }
                        }
                        if ($matches === 0) {
                            $where[] = $oc;
                        }
                    }
                }
            }
        }
        $options['where'] = $where;
        return $options;
    }
}
