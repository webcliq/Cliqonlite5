<?php
/**
 * Cliq Framework - Engine - all the shared system stuff
 *
 * @category   Web application framework
 * @package    Cliq
 * @author     Original Author <support@cliqon.com>
 * @copyright  2020 Webcliq
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    Release: 1.0.1
 * @link       http://webcliq.com
 */

namespace core;

use \core\Html as H;
use \core\Db as Db;
use \Framework as F;
use \Firephp;
use \R;
use \Exception;

class Engine extends \Framework {

	const THISCLASS = "Engine";
	const CLIQDOC = "c_document";
    const SESS_CIPHER = 'aes-128-cbc';

    public static $lcd = 'en';
	
	function __construct() {
        parent::__construct();
    }
	function __destruct() {}


    /** Main Engine Functions
     *
     * cStr()
     * uStr()
     * lstr() - create Javascript strings
     * extend()
     * cfg()
     *
     *
     *
     *****************************************************  Methods  ************************************************/

        // cStr()
        /**
         * Admin multi-lingual string translation
         * @param - string
         * @return - text
         * */
         public static function cStr(string $str, string $table = 'dbcollection')
         {
            $fp = FirePHP::getInstance(true);
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                // Temporary
                if(!is_numeric(substr($str, 0, 1))) {
                    return $str;
                }

                // Explode string into parts
                $p = explode(':', $str);
                $num = $p[0]; 
                $default = $p[1];
                if(count($p) > 2) {
                    $attr = $p[2];
                    $useattr = true;
                } else {
                    $useattr = false;
                };

                if($table == 'dbitem') {
                    $ref = "ustr(".$num.")"; 
                } else {
                    $ref = "str(".$num.")"; 
                }

                // If in development and no value for String yet set, then use check for $num = 9999 and return default
                if($num === '9999') {
                    $val = $default;
                } else {
   
                    $db = new Db();
                    $vars = [
                        'table' => $table,
                        'filter' => ['c_type' => 'string', 'c_reference' => $ref],
                        'idiom' => self::$langcd
                    ];

                    $result = $db->getRow($vars);
    
                    $row = $result['data'];
                    $val = $row['d_text'];
                } 

                return $val;      

            } catch (\Exception $e) {
                $fp = FirePHP::getInstance(true);
                $fp->fb($e->getMessage());
            }      
         }

        // uStr()
        /**
         * Front-end multi-lingual string translation
         * @param - string
         * @return - text
         * */
         public static function uStr($ref)
         {
             return self::cStr($ref, "dbitem");     
         }

        // lstr
        /**
         * Javascript multi-lingual string translation
         * @param - string
         * @return - text
         * */
         public static function lstr()
         {
            
            $fp = FirePHP::getInstance(true);            
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {

                $db = new Db();
                $vars = [
                    'table' => 'dbcollection',
                    'tabletype' => 'string',
                    'filter' => ['c_type' => 'string'],
                    'orderby' => ['c_reference', 'ASC'],
                    'idiom' => self::$langcd
                ];

                $result = $db->getRecordset($vars);
                $rawset = $result['data'];

                $rs = [];
                for($r = 0; $r < count($rawset); $r++) {
                    $num = filter_var($rawset[$r]['c_reference'], FILTER_SANITIZE_NUMBER_INT);       
                    $rs[$num] = $rawset[$r]['d_text'];
                }

                return $rs;

            } catch (\Exception $e) {
                $fp->fb($e->getMessage());
            }              
         } 

        // Extend
        /**
         * 
         * @param - array the model o be converted
         * @param - string the field which contains the text to be extended
         * @return - the extended model
         * */
         static function extend(array $mdl, string $fld = 'text')
         {
            foreach($mdl as $key => $valarray) {
                $mdl[$key][$fld] = self::cStr($valarray[$fld]);
            } 
            return $mdl;
         }

        // cfg
        /**
         * Especially for use by the front end
         * Gets a config value from the config file but checks to see if it has an override value from the database
         * Assumes site. unless specifically set
         * @param - string
         * @return - text
         * */
         public static function cfg(string $ref = '', string $key = 'site')
         {
            $fp = FirePHP::getInstance(true);            
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {

                $db = new Db();
                $vars = [
                    'table' => 'dbitem',
                    'filter' => ['c_type' => 'config', 'c_reference' => $key.'.'.$ref],
                    'idiom' => self::$langcd
                ];

                $result = $db->getRow($vars);

                $row = $result['data'];
                $val = $row['d_text'];

                if($val == '') {
                    $cfg = F::getCfg();
                    $val = $cfg[$key][$ref];
                }

                return $val;

            } catch (\Exception $e) {
                $fp->fb($e->getMessage());
            }              
         }            

    /** Framework utility Functions
     *
     * publishTpl() Publish component Template
     * page_exec()
     * api_exec()
     * checkFlag()
     * idFromRef()
     * toOrderStr()
     * getTranslation()
     * - getToken()
     * makeAVatar()
     * strToArray()
     * textLimit()
     * - wordLimit()
     * getRelativePath()
     * cCountries()
     *
     *****************************************************  Utilities  ************************************************/

        /** publishTpl();
         * Common Template publishing function
         * 
         * @param - string - name of template
         * @param - array - variables for the template that will be mounted on the template before it is converted to an HTML string
         * @return - Array - Consisting of three elements - an Ok flag, Html as a string to be rendered into the ID Admin Content 
         * and Data to be consumed by any Vue JS template functions
         **/
         public function publishTpl($tpl, $vars, $tpldir = "views", $cachedir = "cache")
         {
            // Template engine
            $razr = new \template\Engine(new \template\FilesystemLoader([SITE_PATH.$tpldir, SITE_PATH.'install', SITE_PATH.'admin']), SITE_PATH.$cachedir);
            return $razr->render($tpl, $vars);
         }

        /** api_exec();
         * The shared return function for an AJAX call 
         * 
         * @param - string - language
         * @param - array - variables to be added to the array
         * @return - array - Consisting of three elements - an Ok flag and Data to be consumed by any template functions
         *
         **/
         function api_exec(array $body)
         {    
            $array = [
                'type' => 'json',
                'body' => $body,
                'code' => 200,
                'encode' => true,
            ];
            return $array;
         }

        /** page_exec();
         * The shared return function for any call that displays a page
         * 
         * @param - string - language
         * @param - string - name of the template
         * @param - array - variables for the template that will be mounted on the template before it is converted to an HTML string
         * @return - array - Consisting of three elements - an Ok flag and Data to be consumed by any Vue JS template functions
         *
         **/
         function page_exec(string $idiom, string $page, array $morevars = [])
         {
            self::$lcd = $idiom;
            $vars = [
                'protocol' => PROTOCOL,
                'basedir' => SITE_PATH,
                'viewpath' => HOST_PATH.'views/',
                'cfg' => F::get('cfg'),
                'title' => F::get('cfg')['site']['name'],
                'idiom' => $idiom,
                'page' => $page,
                'jwt' => ''
            ];

            $vars = array_replace($vars, $morevars);

            $tpl = $page.'.tpl';    
            // Load Template Engine - $vars only apply to outside template!!
            return $this->publishTpl($tpl, $vars, "views", "cache");
         }

        /** checkFlag();
         * Checks flag for error and if error, returns error message
         * 
         * @param - array - object to check
         * @return - array - 
         *
         **/      
         protected function checkFlag($obj)
         {
            
            if(!array_key_exists('flag', $obj)) {
                return 'Not valid object';
            } else {
                if($obj['flag'] == 'Ok') {
                    return $obj['data'];
                } else {
                    return $obj['msg'];
                }                
            }
         }

        /** idFromRef()
         *
         * @param - string - table name
         * @param - string - tabletype, type of record
         * @param - string - reference
         * @return - number Id of record
         **/
         public static function idFromRef($table, $tabletype, $ref)
         {
            $sql = "SELECT id FROM $table WHERE c_type = ? AND c_reference = ?";
            $id = R::getCell($sql, [$tabletype, $ref]);
            return $id;
         }

        /** toOrderStr()
         * Converts a Number to 2 character Order
         * @param - number
         * @return - string 2 character string eg "aa" or "az"
         **/
         function toOrderStr($number) {
            
            /*
            $r = (+$q/26);
            $letters = range('a','z');
            return $letters[$r].$letters[$q];
            */

            $alphabet = range('a', 'z');
            $number--;
            $count = count($alphabet);
            if($number <= $count)
                return 'a'.$alphabet[$number+1];
            while($number > 1){
                $modulo     = ($number + 1) % $count;
                $alpha      = $alphabet[$modulo].$alpha;
                $number     = floor((($number - $modulo) / $count));
            };
            return $alpha;
         } 

        /** getTranslation()
         * Bing Translation in PHP
         *
         * @param - string - 2 character language code from eg "en"
         * @param - string - 2 character language code to es "es"
         * @param - string - text to be translated
         * @return - string translated text
         * subrouties =
         *  - getToken()
         *  - curlRequest() 
         *
         **/
         function getTranslation($vars) {

            $rq = $vars['rq'];
            $fromlcd = $rq['fromlcd'];
            $tolcd = $rq['tolcd'];
            $text = $rq['original'];

            $accessToken = self::getToken($this->azure_key);
            $params = "text=" . urlencode($text) . "&to=" . $tolcd . "&from=" . $fromlcd . "&appId=Bearer+" . $accessToken;
            $translateUrl = "http://api.microsofttranslator.com/v2/Http.svc/Translate?$params";
            $curlResponse = self::curlRequest($translateUrl);
            $translatedStr = simplexml_load_string($curlResponse);
            return $translatedStr;
         }

            // Get the AZURE token
            protected static function getToken()
            {
                global $clq;
                $url = 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken';
                $ch = curl_init();
                $data_string = json_encode('{body}');
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                        'Content-Type: application/json',
                        'Content-Length: ' . strlen($data_string),
                        'Ocp-Apim-Subscription-Key: ' . $clq->get('cfg')['site']['bingkey']
                    )
                );
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_HEADER, false);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
                $strResponse = curl_exec($ch);
                curl_close($ch);
                return $strResponse;
            }
             
            // Request the translation
            public static function curlRequest($url)
            {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_HTTPHEADER, "Content-Type: text/xml");
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, False);
                $curlResponse = curl_exec($ch);
                curl_close($ch);
                return $curlResponse;
            }

        /** makeAvatar()
         * This function takes the first letter of a name and generates an Avatar from it
         * the function checks to see if the PNG already exists
         * so gradually the function will cease to create new images
         *
         * @var String such as Company name
         * @var Subdirectory of /public, default is /cologos = Company Logos
         * @var Size of avatar, default is 60
         *
         * @return Image filename such as "avatar_C60.png"
         **/
         function makeAvatar($str, $size = 70, $fontFile = "consola.ttf") 
         {
            $l = substr($str, 0, 1).$size;
            $filename = "avatar_".$l.".png";
            if(!is_file(SITE_PATH."public/images/".$filename)) {
                $la = new LetterAvatar();
                $la->setFontFile($clq->get('basedir').'includes/'.$fontFile);
                $la->generate($l, $size)->saveAsPng(SITE_PATH."public/images/".$filename);
            }
            return $filename;
         }      
         
        /* strToArray()
         * Converts a string in the format 'en|Text,es|Texto' or with language codes
         * to an array
         **/
         static function strToArray(string $str, bool $idiom = false)
         {
            $a1 = explode(',', $str);
            $array = [];
            foreach($a1 as $n => $b) {
                $a2 = explode('|', $b);
                $key = trim($a2[0]);
                if($idiom == false) {
                    $array[$key] = trim($a2[1]);
                } else {
                    $array[$key] = self::cStr(trim($a2[1]));
                }
            }
            return $array;
         }

        /** textLimit()
         * Limit the quantity of characters or words in a display box
         */
         function textLimit($text, $wds = 20) {
            $text = preg_replace(
            array(
            // Remove invisible content
            '@<head[^>]*?>.*?</head>@siu',
            '@<style[^>]*?>.*?</style>@siu',
            '@<script[^>]*?.*?</script>@siu',
            '@<object[^>]*?.*?</object>@siu',
            '@<embed[^>]*?.*?</embed>@siu',
            '@<applet[^>]*?.*?</applet>@siu',
            '@<noframes[^>]*?.*?</noframes>@siu',
            '@<noscript[^>]*?.*?</noscript>@siu',
            '@<noembed[^>]*?.*?</noembed>@siu',
            // Add line breaks before and after blocks
            '@</?((address)|(blockquote)|(center)|(del))@iu',
            '@</?((div)|(h[1-9])|(ins)|(isindex)|(p)|(pre))@iu',
            '@</?((dir)|(dl)|(dt)|(dd)|(li)|(menu)|(ol)|(ul))@iu',
            '@</?((table)|(th)|(td)|(caption))@iu',
            '@</?((form)|(button)|(fieldset)|(legend)|(input))@iu',
            '@</?((label)|(select)|(optgroup)|(option)|(textarea))@iu',
            '@</?((frameset)|(frame)|(iframe))@iu',
            ),
            array(' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',"$0", "$0", "$0", "$0", "$0", "$0","$0", "$0",), $text);

            // you can exclude some html tags here, in this case B and A tags        
            $unlimited = strip_tags( $text , '<b><a>' );

            return self::wordLimit($unlimited, $wds)." .....";           
         } 

         // Part of text limit
         function wordLimit($string, $wl) {
            $words = explode(" ",$string);
            return implode(" ",array_splice($words,0,$wl));
         }

        /** getRelativePath()
         * Clean up a path, removing any unnecessary elements such as /./, // or redundant ../ segments.
         * If the path starts with a "/", it is deemed an absolute path and any /../ in the beginning is stripped off.
         * The returned path will not end in a "/".
         *
         * @param String $path The path to clean up
         * @return String the clean path
         */
         public function getRelativePath($path) {
            $path = preg_replace("#/+\.?/+#", "/", str_replace("\\", "/", $path));
            $dirs = explode("/", rtrim(preg_replace('#^(\./)+#', '', $path), '/'));
                    
            $offset = 0;
            $sub = 0;
            $subOffset = 0;
            $root = "";

            if (empty($dirs[0])) {
                $root = "/";
                $dirs = array_splice($dirs, 1);
            } else if (preg_match("#[A-Za-z]:#", $dirs[0])) {
                $root = strtoupper($dirs[0]) . "/";
                $dirs = array_splice($dirs, 1);
            } 

            $newDirs = array();
            foreach ($dirs as $dir) {
                if ($dir !== "..") {
                    $subOffset--;    
                    $newDirs[++$offset] = $dir;
                } else {
                    $subOffset++;
                    if (--$offset < 0) {
                        $offset = 0;
                        if ($subOffset > $sub) {
                            $sub++;
                        } 
                    }
                }
            }

            if (empty($root)) {
                $root = str_repeat("../", $sub);
            } 
            return $root . implode("/", array_slice($newDirs, 0, $offset));
         } 

        /** Static function to display list of countries
         *
         * return - array - country list 
         **/
         public function cCountries()
         {
            $countries = [
                0 => ['value' => '', 'text' => 'Please select']
            ];
            $txtlist = "Afghanistan, Åland Islands, Albania, Algeria, American Samoa, Andorra, Angola, Anguilla, Antarctica, Antigua & Barbuda, Argentina, Armenia, Aruba, Ascension Island, Australia, Austria, Azerbaijan, Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bermuda, Bhutan, Bolivia, Bosnia & Herzegovina, Botswana, Brazil, British Indian Ocean Territory, British Virgin Islands, Brunei, Bulgaria, Burkina Faso, Burundi, Cambodia, Cameroon, Canada, Canary Islands, Cape Verde, Caribbean Netherlands, Cayman Islands, Central African Republic, Ceuta & Melilla, Chad, Chile, China, Christmas Island, Cocos (Keeling) Islands, Colombia, Comoros, Congo - Brazzaville, Congo - Kinshasa, Cook Islands, Costa Rica, Côte d’Ivoire, Croatia, Cuba, Curaçao, Cyprus, Czechia, Denmark, Diego Garcia, Djibouti, Dominica, Dominican Republic, Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Estonia, Ethiopia, Eurozone, Falkland Islands, Faroe Islands, Fiji, Finland, France, French Guiana, French Polynesia, French Southern Territories, Gabon, Gambia, Georgia, Germany, Ghana, Gibraltar, Greece, Greenland, Grenada, Guadeloupe, Guam, Guatemala, Guernsey, Guinea, Guinea-Bissau, Guyana, Haiti, Honduras, Hong Kong SAR China, Hungary, Iceland, India, Indonesia, Iran, Iraq, Ireland, Isle of Man, Israel, Italy, Jamaica, Japan, Jersey, Jordan, Kazakhstan, Kenya, Kiribati, Kosovo, Kuwait, Kyrgyzstan, Laos, Latvia, Lebanon, Lesotho, Liberia, Libya, Liechtenstein, Lithuania, Luxembourg, Macau SAR China, Macedonia, Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Marshall Islands, Martinique, Mauritania, Mauritius, Mayotte, Mexico, Micronesia, Moldova, Monaco, Mongolia, Montenegro, Montserrat, Morocco, Mozambique, Myanmar (Burma), Namibia, Nauru, Nepal, Netherlands, New Caledonia, New Zealand, Nicaragua, Niger, Nigeria, Niue, Norfolk Island, North Korea, Northern Mariana Islands, Norway, Oman, Pakistan, Palau, Palestinian Territories, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Pitcairn Islands, Poland, Portugal, Puerto Rico, Qatar, Réunion, Romania, Russia, Rwanda, Samoa, San Marino, São Tomé & Príncipe, Saudi Arabia, Senegal, Serbia, Seychelles, Sierra Leone, Singapore, Sint Maarten, Slovakia, Slovenia, Solomon Islands, Somalia, South Africa, South Georgia & South Sandwich Islands, South Korea, South Sudan, Spain, Sri Lanka, St. Barthélemy, St. Helena, St. Kitts & Nevis, St. Lucia, St. Martin, St. Pierre & Miquelon, St. Vincent & Grenadines, Sudan, Suriname, Svalbard & Jan Mayen, Swaziland, Sweden, Switzerland, Syria, Taiwan, Tajikistan, Tanzania, Thailand, Timor-Leste, Togo, Tokelau, Tonga, Trinidad & Tobago, Tristan da Cunha, Tunisia, Turkey, Turkmenistan, Turks & Caicos Islands, Tuvalu, U.S. Outlying Islands, U.S. Virgin Islands, Uganda, Ukraine, United Arab Emirates, United Kingdom, United Nations, United States, Uruguay, Uzbekistan, Vanuatu, Vatican City, Venezuela, Vietnam, Wallis & Futuna, Western Sahara, Yemen, Zambia, Zimbabwe";
            $list = explode(',', $txtlist);

            foreach($list as $n => $c) {
                $row = [];
                $row['value'] = trim($c);
                $row['text'] = trim($c);
                $countries[] = $row; unset($row);
            } 
            return $countries;        
         }                               

    /** Caching
     * cacheRead()
     * cacheWrite()
     * cacheDelete()
     * - getPath()
     *
     *****************************************************  Caching  ************************************************/

        /** cacheRead()
         * @desc Function read retrieves value from cache
         * @param $fileName - name of the cache file
         * Usage: Cache::read('fileName.extension')
         * @return - array - read single value by $result[0]
         */
         static function cacheRead($fn) 
         {
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                $string = ""; $cp = "";

                $cp = self::getPath();
                $fn = $cp.$fn;
                if (file_exists($fn)) {
                    $handle = fopen($fn, 'rb');
                    $string = fread($handle, filesize($fn));
                    fclose($handle);
                    return unserialize($string);
                } else {
                    return false;
                }

            } catch (\Exception $e) {
                $fp = FirePHP::getInstance(true);
                $fp->fb($e->getMessage());
                return false;
            }
         }

        /** cacheWrite()
         * @desc Function for writing key => value to cache
         * @param $fn - name of the cache file (key)
         * @param $variable - value
         * @return - boolean - true or false
         * Usage: Cache::write('fileName.extension', value)
         */
         static function cacheWrite($fn, $array) 
         {
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {

                $string = ""; $cp = "";
                $cp = self::getPath();
                $fn = $cp.$fn;
                $handle = fopen($fn, 'a');
                $string = serialize($array);
                fwrite($handle, $string);
                fclose($handle);
                return true;

            } catch (\Exception $e) {
                $fp = FirePHP::getInstance(true);
                $fp->fb($e->getMessage());
                return false;
            }
         }

        /** cacheDelete()
         * @desc Function for deleteing cache file
         * @param $fn - name of the cache file (key)
         * Usage: Cache::delete('fileName.extension')
         **/
         static function cacheDelete($fn) 
         {
            
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                $cp = self::getPath();
                $fp = $cp.$fn;
                @unlink($fp);
                return "Ok";
            } catch(\Exception $e) {
                $fp = FirePHP::getInstance(true);
                $fp->fb($e->getMessage());
                return false;
            }      
         }

        /** getPath()
         * Get a path
         * @param - string - the name of the path to find - for example cache
         * @return - string - a path
         */ 
         private static function getPath(bool $abs = false)
         {
            $cfg = F::get('cfg');
            array_key_exists('activity', $cfg) ? $activity = $cfg['activity'] : $activity = 'notdefined' ; // and therefore default
            switch($activity) {
                case "admin": $cp = 'admin/cache'; break;
                case "views": $cp = 'cache'; break;
                case "mobile": $cp = 'mobile/cache'; break;
                case "install": $cp = 'install/cache'; break;

                default: $cp = 'cache'; break;
            }
            if($abs === false) {
                return str_replace('//', '/', SITE_PATH.$cp.'/');
            } else {
                return str_replace('//', '/', ROOT_PATH.$cp.'/');
            }
         }

    /** Format for display
     *
     * fDate()
     * fTime()
     * fDateTime()
     * fList()
     * fListName()
     * fullName()
     * fullAddress()
     * fAvatar()
     *
     *
     *********************************************************************************************************************************/

        // fDate()
         static function fDate(string $date = 'now')
         {
            $fp = FirePHP::getInstance(true);            
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {

                $cfg = F::get('cfg');
                date_default_timezone_set($cfg['site']['timezone']);
                $dt = new \DateTime($date); 
                return $dt->format($cfg['site']['dateformat']);

            } catch (\Exception $e) {
                $fp->fb($e->getMessage());
                return false;
            }           
         }

        // fTime()
         static function fTime(string $datetime = 'now')
         {
            $fp = FirePHP::getInstance(true);            
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {

                $cfg = F::get('cfg');
                date_default_timezone_set($cfg['site']['timezone']);
                $dt = new \DateTime($datetime); 
                return $dt->format($cfg['site']['timeformat']);

            } catch (\Exception $e) {
                $fp->fb($e->getMessage());
                return false;
            }              
         }

        // fDateTime()
         static function fDateTime(string $datetime = 'now')
         {
            $fp = FirePHP::getInstance(true);
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {

                $cfg = F::get('cfg');
                date_default_timezone_set($cfg['site']['timezone']);
                $dt = new \DateTime($datetime); 
                return $dt->format($cfg['site']['dateformat'].' '.$cfg['site']['timeformat']);

            } catch (\Exception $e) {
                $fp->fb($e->getMessage());
                return false;
            }           
         }

        // fList()
         static function fList(string $tablename, string $listname)
         {
            $fp = FirePHP::getInstance(true);
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {

                $sql = "SELECT DISTINCT c_document FROM ".$tablename." WHERE c_type = ? AND c_reference = ?";
                $doc = R::getCell($sql, ['list', $listname]);
                // $doc is JSON string
                $docarray = json_decode($doc, true);

                $list = [];

                foreach($docarray['d_text'] as $key => $arr) {
                    $list[$key] = $arr[self::$lcd];
                }

                return $list;

            } catch (\Exception $e) {
                $fp->fb($e->getMessage());
                return false;
            }           
         }

        // fListName() - list name and val
         static function fListName(string $listname, string $value)
         {
            $fp = FirePHP::getInstance(true);
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {

                $sql = "SELECT DISTINCT c_document FROM dbcollection WHERE c_type = ? AND c_reference = ?";
                $doc = R::getCell($sql, ['list', $listname]);
                // $doc is JSON string
                $docarray = json_decode($doc, true);
                $name = $docarray['d_text'][$value][self::$lcd];
                if( (!is_string($name)) or ($name = "") ) {
                    return $value;
                } else {
                    return $name;
                }

            } catch (\Exception $e) {
                $fp->fb($e->getMessage());
                return false;
            }           
         }

        // fullName()
         static function fullName(array $row)
         {
            $fp = FirePHP::getInstance(true);
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {

                    $result = "";
                    // array_key_exists('d_title', $row) ? $result .= ' '.$row['d_title'] : null ;
                    array_key_exists('d_firstname', $row) ? $result .= ' '.$row['d_firstname'] : null ;
                    array_key_exists('d_midname', $row) ? $result .= ' '.$row['d_midname'] : null ;
                    array_key_exists('d_lastname', $row) ? $result .= ' '.$row['d_lastname'] : null ;
                    ltrim($result);

                    return $result;

            } catch (\Exception $e) {
                $fp->fb($e->getMessage());
                return false;
            }           
         }

        // fullAddress()
         static function fullAddress(array $row)
         {
            $fp = FirePHP::getInstance(true);
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {

                $result = "";
                array_key_exists('d_addr1', $row) ? $result .= ' '.$row['d_addr1'] : null ;
                array_key_exists('d_addr2', $row) ? $result .= ' '.$row['d_addr2'] : null ;
                array_key_exists('d_suburb', $row) ? $result .= ' '.$row['d_suburb'] : null ;
                // Needs localisation
                array_key_exists('d_postcode', $row) ? $result .= ' '.$row['d_postcode'] : null ;
                array_key_exists('d_city', $row) ? $result .= ' '.$row['d_city'] : null ;
                array_key_exists('d_region', $row) ? $result .= ' '.$row['d_region'] : null ;
                array_key_exists('d_country', $row) ? $result .= ' '.$row['d_country'] : null ;
                ltrim($result);

                return $result;

            } catch (\Exception $e) {
                $fp->fb($e->getMessage());
                return false;
            }           
         }

        // fAvatar()
         static function fAvatar(string $user = 'admin')
         {
            $fp = FirePHP::getInstance(true);
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {

                $sql = "SELECT c_document FROM dbuser WHERE c_username = ?";
                $json = R::getCell($sql, [$user]);
                $doc = json_decode($json, true);
                $avatar = $doc['d_image'];
                return $avatar;
                
            } catch (\Exception $e) {
                $fp->fb($e->getMessage());
                return false;
            }               
         }

    /** Format for database entry
     *
     * dbDate()
     * dbDateTime()
     * dbUser()
     * dbNum()
     * slugify()
     * dNextRef()
     *
     *****************************************************  Format for Database  ***************************************/

        /** dbDate()
         * Return a database formatted date - if no date provide, returns current date
         * @param - date - optional
         * @return - date
         *
         **/
         static function dbDate($str = "")
         {
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {            
                $cfg = F::get('cfg');
                date_default_timezone_set($cfg['site']['timezone']);
                if($str != "") {
                    $date = new \DateTime($str);
                } else {
                    $date = new \DateTime('now');
                }
                $dbate = $date->format('Y-m-d '); 
                return $dbate;  
            } catch (\Exception $e) {
                return $e->getMessage();
            }          
         }    

        /** dbDateTime()
         * Return a database formatted date - if no date provide, returns current date
         * @param - date - optional
         * @return - date
         *
         **/
         static function dbDateTime($str = "")
         {
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {            
                $cfg = F::get('cfg');
                date_default_timezone_set($cfg['site']['timezone']);
                if($str != "") {

                    // Assumption .....
                    // If String only contains numbers, it is a Unix DateTime stamp
                    if( preg_match('/^\d+$/',$str) ) {
                        // is number
                        $date = new \DateTime();
                        $date->setTimestamp($str/1000);
                    } else {
                        $date = new \DateTime($str);
                    }
                    
                } else {
                    $date = new \DateTime('now');
                }
                $dbate = $date->format('Y-m-d H:i'); 
                return $dbate;  
            } catch (\Exception $e) {
                return $e->getMessage();
            }          
         }   

        /** dbDatePlus()
         * Return a database formatted date - Add or subtract number of days 
         * @param - number of days to add or subtract 

         * @return - date
         *
         **/
         static function dbDatePlus($plus, $str = "") 
         {
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {            
                $cfg = F::get('cfg');
                date_default_timezone_set($cfg['site']['timezone']);   
                if($str != "") {
                    $date = new \DateTime($str);
                } else {
                    $date = new \DateTime();
                }
                $diff = $plus."D";
                $date->add(new \DateInterval('P'.$diff));
                $dbdate = $date->format('Y-m-d'); 
                return $dbdate; 
            } catch (\Exception $e) {
                return $e->getMessage();
            }   
         }                

        /** dbNum()
         * Format a number for the database
         * @param - string - value
         * @return - string - database value
         * */
         function dbNum($d)
         {
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                $cfg = F::get('cfg');
                // $d = str_replace(".", "", $d);
                $d = str_replace(",", ".", $d);
                $d = str_replace("€", "", $d);
                $d = str_replace("£", "", $d);
                $d = str_replace("&euro;", "", $d);
                $d = str_replace("&pound;", "", $d);
                $d = str_replace(" ", "", $d);  
                $d = trim($d);
                return $d;     
            } catch (\Exception $e) {
                return $e->getMessage();
            } 
 
         } 

        /** slugify()
         * Converts the string into an URL slug. This includes replacing non-ASCII
         * characters with their closest ASCII equivalents, removing remaining
         * non-ASCII and non-alphanumeric characters, and replacing whitespace with
         * $replacement. The replacement defaults to a single dash, and the string
         * is also converted to lowercase.
         * */
         function slugify($text, $num = true)
         {
            $method = self::THISCLASS.'->'.__FUNCTION__.'()';
            try {
                // Strip html tags
                $text=strip_tags($text);
                // Replace non letter or digits by -
                $text = preg_replace('~[^\pL\d]+~u', '-', $text);
                // Transliterate
                setlocale(LC_ALL, 'en_US.utf8');
                $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
                // Remove unwanted characters
                $text = preg_replace('~[^-\w]+~', '', $text);
                // Trim
                $text = trim($text, '-');
                // Remove duplicate -
                $text = preg_replace('~-+~', '-', $text);
                // Lowercase
                $text = strtolower($text);
                // Check if it is empty
                if (empty($text)) { return 'n-a'; }
                // Return result
                return $text;
            } catch (\Exception $e) {
                return $e->getMessage();
            }      
         }   

         public static function normalizeString($str = '')
         {
            $str = strip_tags($str); 
            $str = preg_replace('/[\r\n\t ]+/', ' ', $str);
            $str = preg_replace('/[\"\*\/\:\<\>\?\'\|]+/', ' ', $str);
            $str = strtolower($str);
            $str = html_entity_decode( $str, ENT_QUOTES, "utf-8" );
            $str = htmlentities($str, ENT_QUOTES, "utf-8");
            $str = preg_replace("/(&)([a-z])([a-z]+;)/i", '$2', $str);
            $str = str_replace(' ', '-', $str);
            $str = rawurlencode($str);
            $str = str_replace('%', '-', $str);
            return $str;
         }    

        /** dbNextRef() 
         * Get next reference
         * @param - string - table
         * @param - string - tabletype
         * @param - string - reference format
         * @param - string - reference field, defaults to c_reference
         * @return - string - next reference
         **/
         public static function dbNextRef(string $table, string $tabletype = "", $defref = 'str(0)', $fld = 'c_reference') 
         {
            
            if($tabletype != "") {
                $sql = "SELECT ".$fld." FROM ".$table." WHERE c_type = ? ORDER BY id DESC LIMIT 1";
                $lastref = R::getCell($sql, [$tabletype]);
            } else {
                $sql = "SELECT ".$fld." FROM ".$table." ORDER BY id DESC LIMIT 1";
                $lastref = R::getCell($sql);
            }

            // If this was the first time this Reference had ever been needed, then a last record would not exist
            if(!$lastref) {
                $nextref = $defref;        
            } else {
                $a = explode("(", $lastref);
                $lastnum = filter_var($lastref, FILTER_SANITIZE_NUMBER_INT);            
                $nextnum = (int)$lastnum + 1;
                $nextref = $a[0].'('.$nextnum.')';
            }   
            return $nextref;  
         }

    /** Encryption
     * 
     * encryptData()
     * decryptData()
     * 
     ******************************************************************************************************************************/

        /**
           * Encrypts a string and returns it as a base 64 encoded string.
           *
           * @param $session_id
           * @return string
           */
          public function encryptData(string $str, string $salt = '') {
            // Get the MD5 hash salt as a key.
            $key = $this->_getSalt($salt);
            // For an easy iv, MD5 the salt again.
            $iv = $this->_getIv($salt);
            // Encrypt the session ID.
            $ciphertext = openssl_encrypt($str, self::SESS_CIPHER, $key, $options = OPENSSL_RAW_DATA, $iv);
            // Base 64 encode the encrypted session ID.
            $encryptedstr = base64_encode($ciphertext);
            // Return it.
            return $encryptedstr;
          }

        /**
           * Decrypts a base 64 encoded encrypted session ID back to its original form.
           *
           * @param $encryptedSessionId
           * @return string
           */
          public function decryptData(string $encryptedstr) {
            // Get the Drupal hash salt as a key.
            $key = $this->_getSalt('');
            // Get the iv.
            $iv = $this->_getIv('');
            // Decode the encrypted session ID from base 64.
            $decoded = base64_decode($encryptedstr, TRUE);
            // Decrypt the string.
            $decryptedstr = openssl_decrypt($decoded, self::SESS_CIPHER, $key, $options=OPENSSL_RAW_DATA, $iv);
            // Trim the whitespace from the end.
            $str = rtrim($decryptedstr, '\0');
            // Return it.
            return $str;
          }

          public function _getIv(string $salt) {
            $ivlen = openssl_cipher_iv_length(self::SESS_CIPHER);
            return substr(md5($this->_getSalt($salt)), 0, $ivlen);
          }

          public function _getSalt(string $salt) {
            if($salt != '') {
                return $salt;
            } else {
                $cfg = F::get('cfg');
                return $cfg['site']['secret'];
            }
          }

}

# alias +q+ class
if(!class_exists("Q")){ class_alias('core\Engine', 'Q'); };


