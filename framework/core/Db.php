<?php
/**
 * Cliq Framework - Database - all initialise, write and read functions
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
use \core\Html as H;
use \Framework as F;
use \Firephp;
use \R;

class Db extends Cliq {

	const THISCLASS = "Db";
	const CLIQDOC = "c_document";

	// $this->db will be available
	
	function __construct() {}
	function __destruct() {}

	/** getRecords()
	 * Gets a Collection from the database and manipulates it to create a usable recordset
	 * @param - array - arguments
	 * @return - Data or Error
	 * */
	 function getRecords(array $args)
	 {
		/*
			'table' => $table,
			'filter => ['c_type', 'value'],
			'orderby' => ['c_reference', 'ASC'],
			'idiom' => false or language code
		*/
		$fp = FirePHP::getInstance(true);
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

			$cfg = F::get('cfg'); $lcd = $args['idiom'];
			$sql = "SELECT * FROM ".$args['table'];
			
			$vals = [];

			// Where
			if(array_key_exists('filter', $args)) {
				$filter = ''; 
				foreach($args['filter'] as $fld => $val) {
					$filter = $fld.' = ? AND ';
					$vals[] = $val;
				}

				$sql .= " WHERE ".$filter;
				$sql = rtrim($sql, ' AND ');
			}

			// Order By - can improve for multiples if needed
			if(array_key_exists('orderby', $args)) {
				$sql .= ' ORDER BY '.$args['orderby'][0].' '.$args['orderby'][1];
			}

			$rawset = R::getAll($sql, $vals);

			$rs = [];
			for($r = 0; $r < count($rawset); $r++) {
				$row = [];
				// $doc = json string
				$doc = $rawset[$r]['c_document'];
				$docarray = json_decode($doc, true);

				// May need refining
				foreach($docarray as $dfld => $dval) {
					if(is_array($dval) and $args['idiom'] != false) {
						$docarray[$dfld] = $dval[$args['idiom']];
					} else {
						$docarray[$dfld] = $dval;
					}
				}
				$row = array_merge($rawset[$r], $docarray);
				unset($row['c_document']);
				$rs[] = $row; unset($row);
			}

			return [
				'flag' => 'Ok',
				'data' => $rs,
			];

	    } catch (Exception $e) {
			return [
				'flag' => 'NotOk',
				'msg' => $e->getMessage(),
			];
	    }
	 }

	/** getRecordset()
	 * Gets a Recordset from the database and manipulates it to create a usable recordset
	 * @param - array - arguments
	 * @return - Data or Error
	 * */
	 function getRecordset(array $args, array $flds = [])
	 {

		/*
			'model' => $mdl
			'table' => $table,
			'filter' => ['c_type' =>  $mdl['database']['type']],
			'orderby' => [$mdl['database']['orderby'], 'ASC'],
			'idiom' => false or language code
			// 'limit' => [10, 0], - // limit, offset
		*/
		$fp = FirePHP::getInstance(true);
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

			$cfg = F::get('cfg'); $lcd = $args['idiom'];
			$sql = "SELECT * FROM ".$args['table'];
			
			$vals = [];

			// Where
			if(array_key_exists('filter', $args)) {
				$filter = ''; 
				foreach($args['filter'] as $fld => $val) {
					$filter = $fld.' = ? AND ';
					$vals[] = $val;
				}

				$sql .= " WHERE ".$filter;
				$sql = rtrim($sql, ' AND ');
			}

			// Order By - can improve for multiples if needed
			if(array_key_exists('orderby', $args)) {
				$sql .= ' ORDER BY '.$args['orderby'][0].' '.$args['orderby'][1];
			}

			// Limit
			if(array_key_exists('limit', $args)) {
				$sql .= ' LIMIT '.$args['limit'][0].' OFFSET '.$args['limit'][1];
			}

			$rawset = R::getAll($sql, $vals);

			$rs = [];
			for($r = 0; $r < count($rawset); $r++) {
				$row = [];
				// $doc = json string
				$doc = $rawset[$r]['c_document'];
				$docarray = json_decode($doc, true);

				// May need refining
				foreach($docarray as $dfld => $dval) {
					if(is_array($dval) and $args['idiom'] != false) {
						$docarray[$dfld] = $dval[$args['idiom']];
					} else {
						$docarray[$dfld] = $dval;
					}
				}
				$rawrow = array_merge($rawset[$r], $docarray);

				// Only where formatting is required for a Grid or Table etc.
				if(count($flds) > 0) {
					foreach($flds as $fldid => $type) {
						$data = [
							'row' => $rawrow,
							'mdl' => $flds,
							'value' => $rawrow[$fldid],
							'fldid' => $fldid
						];
						$row[$fldid] = $this->_dispFormatByField($data);					
					}
				
				} else {
					$row = $rawrow;
				}

				$rs[] = $row;
				unset($row);
			}

			// And format the data according to the Model

			return [
				'flag' => 'Ok',
				'data' => $rs,
			];

	    } catch (Exception $e) {
			return [
				'flag' => 'NotOk',
				'msg' => $e->getMessage(),
			];
	    }
	 }

	/** getRowSet()
	 * Gets a row from the database and manipulates it to create a usable row
	 * @param - array - arguments
	 * @return - Data or Error
	 * */
	 function getRowSet($args)
	 {
		/*
			'table' => $table,
			'filter' => ['id' => 0]
			'idiom' => false or language code
			'flds' => model with fields that are needed and need formatting
		*/
		$fp = FirePHP::getInstance(true);
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

			$cfg = F::get('cfg'); $lcd = $args['idiom'];
			$sql = "SELECT * FROM ".$args['table'];

			$vals = [];
			// Where
			if(array_key_exists('filter', $args)) {
				$filter = ''; 
				foreach($args['filter'] as $fld => $val) {
					$filter .= $fld.' = ? AND ';
					$vals[] = $val;
				}

				$sql .= " WHERE ".$filter;
				$sql = rtrim($sql, ' AND ');
			}

			$rawrow = R::getRow($sql, $vals);

			// $doc = json string
			$doc = $rawrow['c_document'];	
			$docarray = json_decode($doc, true);
			foreach($docarray as $dfld => $dval) {
				if(is_array($dval) and $args['idiom'] != false) {
					$docarray[$dfld] = $dval[$args['idiom']];
				} else {
					$docarray[$dfld] = $dval;
				}
			}

			$rowset = array_merge($rawrow, $docarray);

			$row = [];
			foreach($args['flds'] as $fldid => $props) {

				$data = [
					'row' => $rowset,
					'mdl' => $props,
					'value' => $rowset[$fldid],
					'fldid' => $fldid
				];
				$row[$fldid] = $this->_dispFormatByField($data);					
			}

			if(array_key_exists('test', $args)) {
				$fp->fb($sql, 'SQL: ');
				$fp->fb($vals, 'Vals: ');
				$fp->fb($rawrow, 'Rawrow: ');
				$fp->fb($rowset, 'Rowset: ');
				$fp->fb($row, 'Final row:');				
			}			

			return [
				'flag' => 'Ok',
				'data' => $row,
			];

	    } catch (Exception $e) {
			return [
				'flag' => 'NotOk',
				'msg' => $e->getMessage(),
			];
	    }
	 }

	/** getRow()
	 * Gets a row from the database and manipulates it to create a usable row
	 * @param - array - arguments
	 * @return - Data or Error
	 * */
	 function getRow($args)
	 {
		/*
			'table' => $table,
			'filter' => ['c_type' =>  $mdl['database']['type'], 'c_reference' = 'str(0)'],
			'idiom' => false or language code
		*/
		$fp = FirePHP::getInstance(true);
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

			$cfg = F::get('cfg'); $lcd = $args['idiom'];
			$sql = "SELECT * FROM ".$args['table'];

			$vals = [];
			// Where
			if(array_key_exists('filter', $args)) {
				$filter = ''; 
				foreach($args['filter'] as $fld => $val) {
					$filter .= $fld.' = ? AND ';
					$vals[] = $val;
				}

				$sql .= " WHERE ".$filter;
				$sql = rtrim($sql, ' AND ');
			}

			$rawrow = R::getRow($sql, $vals);

			if(array_key_exists('test', $args)) {
				$fp->fb($sql);
				$fp->fb($vals);
				$fp->fb($rawrow);				
			}

			// $doc = json string
			$doc = $rawrow['c_document'];	
			$docarray = json_decode($doc, true);
			foreach($docarray as $dfld => $dval) {
				if(is_array($dval) and $args['idiom'] != false) {
					$docarray[$dfld] = $dval[$args['idiom']];
				} else {
					$docarray[$dfld] = $dval;
				}
			}

			$row = array_merge($rawrow, $docarray);

			return [
				'flag' => 'Ok',
				'data' => $row,
			];

	    } catch (Exception $e) {
			return [
				'flag' => 'NotOk',
				'msg' => $e->getMessage(),
			];
	    }
	 }

	/** getVal()
	 * Gets a value from the database
	 * @param - array - arguments
	 * @return - Data or Error
	 * */
	 function getVal($args)
	 {
		/*
			'table' => $table,
			'filter' => ['c_type' =>  $mdl['database']['type'], 'c_reference' => '' OR 'id' => 0],
			'field' => 'c_field, or a d_field'
			'idiom' => true / false
		*/

		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

			$result = $this->getRow($args);
			if($result['flag'] == 'Ok') {
				return [
					'flag' => 'Ok',
					'data' => $result['data'][$args['field']],
				];
			} else {
				return [
					'flag' => 'NotOk',
					'msg' => $result['msg'],
				];
			}

	    } catch (Exception $e) {
			return [
				'flag' => 'NotOk',
				'msg' => $e->getMessage(),
			];
	    }
	 }

    /** writeRow() - generic row writer
     * @param - string - table name
     * @param - int - Record ID (optional)
     * @param - array - data to write to database
     * @return - result
     */
     public function writeRow($table = "dbcollection", $id = 0, $row)
     {

		$fp = FirePHP::getInstance(true);
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

            // Verify activity
            if(!is_array($row)) {
                throw new \Exception("No request array");
            } 

            $updb = R::load($table, $id);

            $model = new Model(); 
            $mdl = $model->stdModel('form', $table, $row['c_type']);                

            // C_fields
            foreach($row as $key => $val) {
                $chk = strtolower(substr($key, 0, 2));  
                switch($chk) {
                    case "c_": $updb->$key = $val; break;
                    case "d_": $doc[$key] = $val; break;  
                    default: false; break;  // throws anything else away
                }
            }

            // d_fields
            // Load old and merge/replace

            $updb->c_document = json_encode($doc);

            // Write record
            $result = R::store($updb);
            if(is_numeric($result)) {
                return $result;
            } else {
                throw new \Exception($result);
            }

	    } catch (\Exception $e) {
			return $e->getMessage();
	    }
     }

    /** writeVal() - generic value writer
     *
     * @param - string - table
     * @param - string - record number
     * @param - string - new value
     * @param - string fieldname
     * @return - record number or error message
     **/
     function writeVal(string $table, string $recid, $val, string $fld, bool $encode = false, $s = false) 
     {
		$fp = FirePHP::getInstance(true);
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {

            if(substr($fld, 0, 2) == 'd_') {
                $sql = "SELECT c_document FROM ".$table." WHERE id = ?";
                $jdoc = R::getCell($sql, [$recid]);
                $cdoc = json_decode($jdoc, true);
                $cdoc[$fld] = $val;
                $strval = json_encode($cdoc);
                $thisfld = 'c_document';
            } else {
                $thisfld = $fld;
                // Maybe have to serialize or json_encode here
                if($encode == true) {
                    if($s == true) {
                        $strval = serialize($val);
                    } else {
                        $strval = json_encode($val);
                    }
                } else {
                    $strval = $val;
                }
            }

            $updb = R::load($table, $recid);
            $old = $updb;
            $updb->$thisfld = $strval;
            $result = R::store($updb);
            if(is_numeric($result)) {
                return $result;
            } else {
                throw new \Exception($result);
            }

	    } catch (\Exception $e) {
			return $e->getMessage();
	    }             
     } 

	/** deleterecord() Ok 
	 *
	 * @param - array - arguments
	 * @param - array - to be converted to JSON
	 **/
	 function deleterecord(array $args)
	 {
		$fp = FirePHP::getInstance(true);
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {	

            $table = $args['table'];
            $rq = $args['request'];

            if(!array_key_exists('recid', $rq)) {
            	throw new \Exception('No valid Record Id');
            }
            $recid = $rq['recid'];

            /*
            // Authorise
            if(!A::getAuth("delete", $this->table, $this->tabletype, '')) {
                throw new Exception("Not authorised based on table > tabletype > fields");
            };
            */		    	
		
			$sql = "DELETE FROM ".$table." WHERE id = ?";    
			$delete = R::exec($sql, [$recid]);    

            if(!is_numeric($delete)) {
                throw new \Exception("No result has been created! ".$delete);
            }  

			$result = [
				'action' => $rq['action'],
				'id' => $recid
			];

			return [
				'type' => 'json',
				'code' => 200,
				'body' => ['flag' => 'Ok', 'data' => $result],
				'encode' => true
			];

	    } catch (Exception $e) {
			return [
				'type' => 'json',
				'code' => 500,
				'body' => ['flag' => 'NotOk', 'msg' => $e->getMessage()],
				'encode' => true
			];
	    }
	 }

	// _dispFormatByField()
	/**
	 * 
	 * @param - array - 
	 * @return - formatted value
	 * */
	 function _dispFormatByField(array $data)
	 {
	    $fp = FirePHP::getInstance(true);	 	
	 	$method = self::THISCLASS.'->'.__FUNCTION__.'()';
	 	try {

	 		switch($data['fldid']) {

	 			// Nothing yet, maybe c_password
	 			case "c_document":
	 				$result = false;
	 			break;

	 			default:
	 				$result = $this->_dispFormatByType($data);
	 			break;
	 		}

			return $result;

	    } catch (Exception $e) {
			$fp->fb($e->getMessage());
			return false;
	    }
	 }

	// _dispFormatByType()
	/**
	 * 
	 * @param - array - 
	 * @return - formatted value
	 * */
	 function _dispFormatByType(array $data)
	 {
	 	
	 	$fp = FirePHP::getInstance(true);
	 	$method = self::THISCLASS.'->'.__FUNCTION__.'()';
	 	try {
	 		
	 		$val = $data['value'];
	 		$fldid = $data['fldid'];
	 		$row = $data['row'];
			$props = $data['mdl'][$fldid];

	 		array_key_exists('type', $props) ? $type = $props['type'] : $type = "string" ;
		 	$cfg = F::get('cfg');
		 	$idioms = $cfg['site']['idiomflags'];

	 		switch($type) {

	 			case "icon":
	 				$result = H::img(['src' => $props['subdir'].$val.'.png', 'class' => '', 'style' => 'height: 40px;']);
	 			break;

	 			case "image":
	 				$result = H::img(['src' => $val, 'class' => '', 'style' => 'height: 50px;']);
	 			break;

	 			case "file":
	 			case "url":
	 				$result = H::a(['href' => $props['subdir'].$val, 'target' => '_blank'], $val);
	 			break;

                case "password":
                    $result = false;
                break;

                case "boolean":
                    if($val == false || $val == 'false' || $val == '' || $val = 0 || $val = '0') {
                        $result = '0';
                    } else {
                        $result = '1';
                    }
                break;

                case "number":
                    $result = Cliq::fNum($val);
                break;
                
                case "date":
                    $result = Cliq::fDate($val);
                break;

                case "datetime":
                    $result = Cliq::fDateTime($val);
                break;
                
                case "noupdate":
                    $result = false;
                break;

                // $val must become an array
                case "json":
                	$result = H::pre(['style' => 'font-size: 10pt;'], json_encode($val, JSON_PRETTY_PRINT));
                break;

                case "fullname": $result = Cliq::fullName($row); break;

                case "fulladdress": $result = Cliq::fullAddress($row); break;

                case "titlesummary":
                	$result = H::span(['class' => 'font-weight-bold'], $val).'&nbsp;'.$row['d_summary'];
                break;

                case "select":

                	switch($props['listtype']) {

                		case "dynamic":
                			$result = Cliq::fListName($props['list'], $val);
                		break;

                		case "static":

					 		$listarray = Cliq::strToArray($props['list']);
					 		foreach($listarray as $optval => $lbl) {
					 			if($val == $optval) {
					 				$result = Cliq::cStr($lbl);
					 			}
					 		}

                		break;

                		case "staticwithimage":
                		case "staticnotrans":

					 		$listarray = Cliq::strToArray($props['list']);
					 		foreach($listarray as $optval => $lbl) {
					 			if($val == $optval) {
					 				$result = $lbl;
					 			}
					 		}

                		break;

                	}
                break;

	 			case "idiomtext":
	 				$result = "";
	 				foreach($idioms as $lcdcode => $flag) {
	 					$result .= H::div([],
	 						H::img(['src' => '/public/flags/'.$flag, 'class' => '', 'style' => 'height: 20px;']),
	 						H::span(['class' => ''], $data['value'][$lcdcode])
	 					);
	 				}
	 			break;

	 			case "radiochk":
	 				// Should be an array of key value pairs
	 				$result = "";
	 				foreach($data['value'] as $key => $val) {
	 					// Little table
	 				}
	 			break;                

                case "toml":
                case "encoded":
                    $result = rawurldecode($val);
                break;              

                default:
                case "string":
                    $result = $val;
                break;
	 		}

			return $result;

	    } catch (Exception $e) {
			$fp->fb($e->getMessage());
			return false;
	    }
	 }

	// _dbFormatByField()
	/**
	 * 
	 * @param - array - 
	 * @return - formatted value
	 * */
	 function _dbFormatByField(array $data)
	 {
	    
	    $fp = FirePHP::getInstance(true);	 	
	 	$method = self::THISCLASS.'->'.__FUNCTION__.'()';
	 	try {

	 		switch($data['fldid']) {

				case "c_document":
					$result = false;
				break;

				// Other field exceptions here, both c_* and d_*

	 			default:
	 				$result = $this->_dbFormatByType($data);
	 			break;
	 		}

			return $result;

	    } catch (Exception $e) {
			$fp->fb($e->getMessage());
			return false;
	    }
	 }

	// _dbFormatByType()
	/**
	 * 
	 * @param - array - 
	 * @return - formatted value
	 * */
	 function _dbFormatByType(array $data)
	 {
	 	
	    $fp = FirePHP::getInstance(true);
	 	$method = self::THISCLASS.'->'.__FUNCTION__.'()';
	 	try {

	 		$props = $data['props'];
	 		$val = $data['fldval'];
	 		$fldid = $data['fldid'];	

	 		switch($props['dbtype']) {

                case "password":
                    $result = Cliq::encryptData($val);
                break;

                case "boolean":
                    if($val == false || $val == 'false' || $val == '' || $val = 0 || $val = '0') {
                        $result = '0';
                    } else {
                        $result = '1';
                    }
                break;

                case "number":
                    $result = Cliq::dbNum($val);
                break;
                
                case "date":
                    $result = Cliq::dbDate($val);
                break;

                case "datetime":
                    $result = Cliq::dbDateTime($val);
                break;
                
                case "noupdate":
                    $result = false;
                break;

                case "slugify":
                    $result = Cliq::slugify($rawref, 0);
                break;

                // $val must become an array
                case "jsoneditor":
                case "json":
                    $type = gettype($val);
                    switch($type) {

                        case "array": $result = $val; break;
                        case "object": $result = Cliq::object_to_array($val); break;
                        case "string":
                            $val = urldecode($val);
                            // If it is a badly formatted string
                            $qrepl = ['"{', '}"', '&quot;'];
                            $qwith = ['{', '}', '"'];
                            $val = str_replace($qrepl, $qwith, $val);
                            // Now convert the JSON string to an array
                            $result = json_decode($val, true);
                        break;
                        case "NULL": $result = ['false']; break;
                        default: $result = [$val]; break;

                    }
                break;

                case "toml":
                case "encoded":
                    $result = rawurldecode($val);
                break;              

                default:
                case "string":
                    $result = $val;
                break;
	 		}

			return $result;

	    } catch (Exception $e) {
			$fp->fb($e->getMessage());
			return false;
	    }
	 }

	// saveValue()
	/**
	 * 
	 * 
	 * 
	 * */
	 function saveValue(array $args)
	 {

	 	$fp = FirePHP::getInstance(true);
		$method = self::THISCLASS.'->'.__FUNCTION__.'()';
		try {	

            $table = $args['table'];
            $rq = $args['request'];

            if(!array_key_exists('recid', $rq)) {
            	throw new \Exception('No valid Record Id');
            }

	 		$result = $this->writeVal($table, $rq['recid'], $rq['value'], $rq['field'], false, false); 

            if(!is_numeric($result)) {
                throw new \Exception("No result has been created! ".$result);
            }  

			return [
				'type' => 'json',
				'code' => 200,
				'body' => ['flag' => 'Ok', 'msg' => Cliq::cStr('81:Updated')],
				'encode' => true
			];

	    } catch (Exception $e) {
			return [
				'type' => 'json',
				'code' => 500,
				'body' => ['flag' => 'NotOk', 'msg' => Cliq::cStr('82:Not updated').': '.$e->getMessage()],
				'encode' => true
			];
	    }
	 }

}





	