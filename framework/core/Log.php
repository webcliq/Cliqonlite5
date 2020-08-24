<?php
/**
 * Cliq Framework - Logging
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

use \core\Engine as Cliq;
use \Framework as F;
use \Firephp;
use \R;

class Log extends Cliq {

    const THISCLASS = "Log";
    
    function __construct() {}
    function __destruct() {}

    /** wLog()
     *
     * @param - array - args
     * @return - bool - true or false
     **/
     public static function wLog(array $args)
     {
        /*
            'user' => optional, if nothing provided, user "admin"
            'table' => table,
            'type' => tabletype
            'category'  => read, write, access, delete,
            'text' => string of appropriate text
            'notes' => (optional)
        */
        $fp = FirePHP::getInstance(true);
        $method = self::THISCLASS.'->'.__FUNCTION__.'()';
        try {

            $upd = R::dispense('dblog');

            // C_ Fields
            $upd->c_reference = Cliq::dbNextRef('dblog', '', 'log(0)');
                array_key_exists('table', $args) ? $table = $args['table']: $table = "dbcollection";
                array_key_exists('tabletype', $args) ? $type = $args['tabletype'] : $type = "string";
            $upd->c_type = $table.':'.$type;
            array_key_exists('category', $args) ? $upd->c_category = $args['category'] : $upd->c_category = "access";
            array_key_exists('notes', $args) ? $upd->c_notes = $args['notes'] : $upd->c_notes = Cliq::cStr('143:No additional notes');   
            
            // D_ Fields
            $doc = [];
                array_key_exists('user', $args) ? $doc['d_user'] = $args['user'] : $doc['d_user'] = "admin";
                array_key_exists('text', $args) ? $doc['d_text'] = $args['text'] : $doc['d_text'] = "";
                $doc['d_date'] = Cliq::dbDateTime();
                // If we need more, we can add them here
                // array_key_exists('', $args) ? $doc['d_'] = $args[''] : $doc['d_'] = "";
            $upd->c_document = json_encode($doc);

            $result = R::store($upd);

            return true;

        } catch (Exception $e) {
            return $e->getMessage();
        }

     }

    /** deleteBefore()
     *
     * @param - array - arguments - date, type etc.
     * @return - array - containing flag and message
     **/
     public function deleteBefore(array $args)
     {
        
        /*
            $args will contain:

            'type' = type, datebefore, user, category, 
            if type = c_type
            if user = d_user tbd
            if category = c_category
            if deletebefore = d_date

        */

        $fp = FirePHP::getInstance(true);   
        $method = self::THISCLASS.'->'.__FUNCTION__.'()';
        try {

            $cfg = F::get('cfg'); $lcd = $args['idiom'];
            $rq = $args['request'];

            switch($rq['type']) {


                case "deletebefore":

                    // Get the recordset
                    $db = new Db();
                    $opts = [
                        'table' => 'dblog',
                        'idiom' => $args['idiom'],    // this language code or false = all language recs as an array          
                    ];
                    $flds = ['id', 'c_document'];
                    $res = $db->getRecordset($opts, $flds);

                    if($res['flag'] == 'NotOk') {
                        throw new \Exception('Database error: '.$res['msg']);
                    }
                    $rs = $res['data']; 

                    $ddate = strtotime($rq['d_date']);
                    for($r = 0; $r < count($rs); $r++) {

                        $rdate = strtotime($rs[$r]['d_date']);
                        $id = strtotime($rs[$r]['id']);

                        if($rdate < $ddate) {
                            $sql = "DELETE FROM dblog WHERE id = ?";
                            $result = R::exec($sql, [$id]); 

                            if(!is_numeric($result)) {
                                throw new \Exception('Log entry delete error: '.$result);
                            }
                        }
                    } 

                break;

                case "type":
                    $sql = "DELETE FROM dblog WHERE c_type = ?";
                    $result = R::exec($sql, [$rq['c_type']]);
                break;

                case "category":
                    $sql = "DELETE FROM dblog WHERE c_category = ?";
                    $result = R::exec($sql, [$rq['c_category']]);
                break;

                default: break;

            }

            return [
                'type' => 'json',
                'code' => 200,
                'body' => ['flag' => 'Ok', 'action' => 'deletebefore', 'msg' => Cliq::cStr('144:Log entries deleted')],
                'encode' => true
            ];

        } catch(Exception $e) {
            return [
                'type' => 'json',
                'code' => 500,
                'body' => ['flag' => 'NotOk', 'action' => 'deletebefore', 'msg' => $e->getMessage()],
                'encode' => true
            ];
        }           
     }








} // Ends Log Class
