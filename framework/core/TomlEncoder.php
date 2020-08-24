<?php
/**
 * TomlEncoder Class
 *
 * handles functions and activities related to converting a Toml formatted string to an array and creating Toml files from an array
 *
 * @category   Web application framework
 * @package    Toml
 * @author     Original Author <conkascom@gmail.com>
 * @copyright  2016 Conkas cb
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    Release: 1.0.1
 * @link       http://cliqon.com
 */

namespace core;

use \Framework as F;
use \core\Files as Files;
use \core\Arrays as Arrays;
use \core\TomlBuilder as TomlBuilder;
use \Firephp;
use \Exception;

class TomlEncoder extends Toml
{
	const THISCLASS = "TomlEncoder";

    /** toml_decode(string or file)
     *  
     * @param - string - String presumed to contain TOML
     * @param - string - filepath (optional)
     * @return - array - Toml string converted to an array
     * */
     public static function toml_decode(string $tomlstr, string $fp) {
        
        $method = self::THISCLASS.'->'.__FUNCTION__.'()';
        try {

            if($fp != '') {
                // Read in a file
                if(file_exists($fp)) {
                    $array = self::parseFile(SITE_PATH.$fp);
                } else {
                    throw new Exception('File not found');
                }     
            } else {
                // Convert string
                $array = self::parse($tomlstr);
            }

            return $array;

        } catch (Exception $e) {
            return $e->getMessage();
        }   
     }

    /** toml_encode(array and file)
     *  
     * @param - string - Array
     * @param - string - filepath (optional)
     * @return - array - Toml string 
     * */
     public static function toml_encode(array $array, string $fp = '') {
        
        $fr = FirePHP::getInstance(true);   
        $method = self::THISCLASS.'->'.__FUNCTION__.'()';
        try {

            // Is the input array, actually an array
            $ary = new Arrays();
            if(!$ary->isReallyArray($array)) {
                throw new Exception('Input array was not an array: '.$array);
            }

            // Start process
            $tb = new TomlBuilder();  
            $err = self::sub($array, $tb);

            if(is_string($err)) {
                throw new Exception('First call to sub() returned an error: '.$err);
            }

            $tomlstr = $tb->getTomlString();
        
            if($fp != '') {
                return Files::writeFile($fp, $tomlstr);
            } else {
                return $tomlstr;
            }

        } catch (Exception $e) {
            $fr->fb($e->getMessage());
            return $e->getMessage();
        }  
     }

    // Sub
     protected static function sub($array, $tb, $prev = '')
     {
        $method = self::THISCLASS.'->'.__FUNCTION__.'()';
        try {

            $ary = new Arrays();
            foreach($array as $idx => $val) {
                if(is_array($val)) {
                    if($ary->isAssoc($val) == true) {

                    	if($prev == '') {
                    		$tb->addTable($idx);
                    		$key = $idx;
                    	} else {
                    		$tb->addTable($prev.'.'.$idx);
                    		$key = $prev.'.'.$idx;
                    	}
                        
                        self::sub($val, $tb, $key);  

                    } else if($ary::hasNumericKeys($val) == true) {

                    	if($prev == '') {
                    		$tb->addArrayOfTable($idx);
                    		$key = $idx;
                    	} else {
                    		$tb->addTable('['.$idx.']');
                    		$key = '['.$idx.']';
                    	}
                        
                        self::sub($val, $tb, $idx);

                    } else {
                        throw new Exception('Sub could not identify the type of array: '.$val);
                    }
                } else {
                    $tb->addvalue($idx, $val);
                }
            }

            return false;

        } catch (Exception $e) {
            return $e->getMessage();
        }        
     }
}
