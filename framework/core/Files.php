<?php
/**
 * Files Class
 *
 * handles all functions and activities related reading and writing files
 *
 * @category   Web application framework
 * @package    Cliqon
 * @author     Original Author <conkascom@gmail.com>
 * @copyright  2016 Conkas cb
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    Release: 4.1.0
 * @link       http://cliqon.com
 */

namespace core;

use \core\Engine as Cliq;
use \core\Html as H;
use \Framework as F;
use \Firephp;
use \Exception;

class Files
{
	 public $thisclass = "Files";
	 public $root;

	 public function __construct() {}

	 public static function setRoot()
	 {
		  return $_SERVER['DOCUMENT_ROOT']."/";
	 }

     public static function setPath(string $fp)
     {
          $fp = str_replace('/', DS, ROOT_PATH.DS.$fp);
          return $fp;
     }

    /** File system functions
     *
     * copyFile()
     * openFile()
     * createFile()
     * readFile()
     * existsFile()
     * writeFile()
     * appendFile()
     * closeFile()
     * deleteFile()
     * deleteDirectory()
     * renameFile()
     * listFiles()
     *
     *************************************************************************************************************/

        /** Get file size 
         * 
         * @param - object - file pointer
         * @param - boolean - is it readable
         * @param - numeric - number of decimals or precision
         * @return - numeric - size of file
         * @todo - 
         **/
         public static function fileSize($fp, $readable = false, $decimals = 2)
         {
            $sp = self::setRoot();
            $mf = $sp.$fp;
            $size = filesize($mf);
          
            if($readable == true) {
              $sz = 'BKMGTP';
              $factor = floor((strlen($size) - 1) / 3);
              $size = sprintf("%.{$decimals}f", $size / pow(1024, $factor)) . @$sz[$factor];
            }

          return $size;
         }

        /** Get file size and date last modified
         * 
         * @param - object - file pointer
         * @return - array - size of file
         * @todo - 
         **/
         public static function fileInfo(string $fp)
         {
            try {

                $mf = self::openFile($fp);
                $stat = fstat($mf);
                $size = $stat['size'];
                $date = $stat['mtime'];
                $dbdate = Cliq::dbDateTime($date);

                return [
                    'filepath' => $mf,
                    'size' => $size,
                    'date' => $dbdate,
                    'flag' => 'Ok',
                ];

            } catch (Exception $e) {
                return [
                    'flag' => 'NotOk',
                    'msg' => $e->getMessage()
                ];
            }          
         }

        /** Copy file 
         * 
         * @param - string - URL of file
         * @param - string - file name
         * @return - boolean - true / false
         * @todo - 
         **/       
         public static function copyFile($url, $filename)
         {
          $file = fopen($url,"rb");
          if(!$file) {
            return false;
          } else {
            $fc=fopen($filename,"wb");
            while(!feof($file)) {
              $line=fread($file,1028);
              fwrite($fc,$line);
            }
            fclose($fc);
            return true;
          }
         }

        /** Open file 
         * 
         * @param - object - file pointer 
         * @param - string - with attribute or read or write
         * @return - object - handle
         * @todo - 
         **/
         public static function openFile($fp, $op = "r") 
         {
            try {
                $sp = self::setRoot();
                $mf = $sp.$fp;
                $handle = fopen($mf, $op); //implicitly creates file
                return $handle;
            } catch(Exception $e) {
                return "Open File : ".$e->getMessage();
            }
         }

        /** Create a file
         * 
         * @param - object - file pointer 
         * @return - object - handle
         * @todo - 
         **/
         public static function createFile($fp) 
         {
            try {
                $handle = self::openFile($fp, 'w');
                return $handle;
            } catch(Exception $e) {
                echo "Create File : ".$e->getMessage();
            }
         }

        /** Read file
         * 
         * @param - object - file pointer 
         * @return - string - content of file
         * @todo - 
         **/
         public static function readFile($fp) 
         {
            try {
                $sp = self::setRoot();
                $mf = $sp.$fp;
                $handle = self::openFile($fp, 'r');
                $data = fread($handle, filesize($mf));
                fclose($handle);
                return $data;
            } catch(Exception $e) {
                return "Read File : ".$e->getMessage();
            }
         }

        /** Does file exist ??  
         * 
         * @param - object - file pointer 
         * @return - boolean - true / false or error message
         * @todo - 
         **/
         public static function existsFile($fp)
         {
            try {
                $sp = self::setRoot();
                $mf = $sp.$fp;
                if(is_readable($mf) === true ) {
                    return true;
                } else {
                    return false;
                }
            } catch(Exception $e) {
                return "Read File : ".$e->getMessage();
            }    
         }

        /** Write data to file - replace existing 
         * 
         * @param - object - file pointer 
         * @param - string - data to be written
         * @return - string - Flag or Error
         * @todo - 
         **/
         public static function writeFile($fp, $data) 
         {
            try {
                $handle = self::openFile($fp, 'w');
                fwrite($handle, $data);
                self::closeFile($handle);
                $newdata = self::readFile($fp);
                if($newdata == $data){
                    return "Ok";
                } else {
                    return "NotOk";
                };
            } catch(Exception $e) {
                echo "Write File : ".$e->getMessage();
            }
         }

        /** Write to a file - append to end of existing
         * 
         * @param - object - file pointer 
         * @param - string - data to be written
         * @return - object - handle
         * @todo - 
         **/
         public static function appendFile($fp, $data) 
         {
          try {
            $sp = self::setRoot();
            $mf = $sp.$fp;
            $olddata = self::readFile($fp);
            $newdata = $olddata.PHP_EOL.$data;
            return self::writeFile($fp, $newdata);
          } catch(Exception $e) {
              echo "Append to File : ".$e->getMessage();
          }
         }

        /** Close file
         * 
         * @param - object - handle
         * @return - boolean - true / false
         * @todo - 
         **/
         public static function closeFile($handle) 
         {
            return fclose($handle);
         }

        /** Delete file
         * 
         * @param - object - file pointer 
         * @return - string - Flag or Error
         * @todo - 
         **/
         public static function deleteFile($fp) 
         {
            try {
                $sp = self::setRoot();
                $mf = $sp.$fp;
                unlink($mf);
                if(!file_exists($mf)){
                    return "OK";
                } else {
                    return "NotOk";
                };
            } catch(Exception $e) {
                echo "Delete File : ".$e->getMessage();
            }
         }

        /** Rename existing file
         * 
         * @param - string - old name
         * @param - string - new name
         * @return - string - Ok or NotOk flage or error message
         * @todo - 
         **/
         public static function renameFile($fp1, $fp2) 
         {
            try {
                $sp = self::setRoot();
                $of = $sp.$fp1;
                $nf = $sp.$fp2;    
                if(!rename($of, $nf)) {
                    return "NotOk";
                } else {
                    return "Ok";
                };   
            } catch(Exception $e) {
                echo "Delete File : ".$e->getMessage();
            }
         }

        /** Move file from directory to another
         *
         * @param - string - filename
         * @param - string - current directory
         * @param - string - new directory
         * @return - boolean true or error
         **/
         public static function moveFile($fn, $currdir, $newdir)
         {
            try {
                $sp = self::setRoot();
                $of = str_replace('//', '/', $sp.$currdir.'/'.$fn);
                $nf = str_replace('//', '/', $sp.$newdir.'/'.$fn);
                if(!rename($of, $nf)) {
                    return "NotOk";
                } else {
                    return "Ok";
                };   
            } catch(Exception $e) {
                echo "Delete File : ".$e->getMessage();
            }    
         }

        /** List files in a directory  
         * 
         * @param - string - filepath and name of directory
         * @param - string - restrict to this extension, defaults to all
         * @return - array of files that match params
         **/
         public static function listFiles($fp, $ext = "*")
         {
            try {

                $files = [] ;
                $files[0] = Cliq::cStr('39:Please select file');
                $search = SITE_PATH.$fp.$ext;
                foreach(glob($search) as $f => $file) {
                $file = str_replace(SITE_PATH.$fp, "", $file);
                $files[] = $file;
            };
            if(count($files > 1)) {
                unset($files[0]);
            };
            return $files;
            } catch (Exception $e) {
                return [$e->getMessage()];
            }
         }

        /** Create a directory
         * 
         * @param - string - new directory name
         * @return - string - Ok or NotOk flage or error message
         * @todo - 
         **/
         public static function makeDir($dir)
         {
            try {
                // Make sure the receiving directory exists
                $pp = pathinfo($mf);
                if(!mkdir($pp['dirname'], 0777, true)) {
                    throw new Exception("Receiving subdirectory:".$sp.$dir." does not exist and could not be created");
                };
                return ['flag' => 'NotOk', 'html' => ''];
            } catch(Exception $e) {
                return ['flag' => 'NotOk', 'html' => $e->getMessage()];
            }
         }

        /** Delete a directory and contents
         * 
         * @param - string - new directory name
         * @return - string - Ok or NotOk flage or error message
         * @todo - 
         **/
         public static function deleteDirectory($d)
         {
            
            $sp = self::setRoot();
            $path = $sp.$d;
            if(is_dir($path) == TRUE) {
                $rootFolder = scandir($path);
                if(sizeof($rootFolder) > 2){
                    foreach($rootFolder as $folder){
                        if($folder != "." && $folder != "..") {
                            //Pass the subfolder to function
                            self::deleteDirectory($path."/".$folder);
                        }
                    }
                    //On the end of foreach the directory will be cleaned, and you will can use rmdir, to remove it
                    @rmdir($path);
                }
            } else {
                if(file_exists($path) == TRUE) {
                    unlink($path);
                }
            }
         }

        /** Folder tree helper function
         * 
         * @param - string - path
         * @param - string - pattern
         * @return - string - Ok or NotOk flage or error message
         * @todo - 
         **/
         public static function folderTree($path = '', $pattern = '*') {
            
            $tree = [];
         
            $files = scandir($_SERVER['DOCUMENT_ROOT'].$path);
            $difflist = "cache,tmp,archive,js,includes,img,partials,css,public,_errorpages,apps,assets,docs,framework,install,log,controllers";
            $diff = explode(',', $difflist);

            foreach($files as $f => $file) {
                if (!in_array($file, array(".",".."))) {
                    if (is_dir($file)) {
                        if(!in_array($file, $diff)) {
                            $tree[] = ['name' => $file, 'children' => self::folderTree($path.DIRECTORY_SEPARATOR.$file)];
                        } 
                    } else {
                        if(stristr($file, 'cfg')) {
                            $path = str_replace('//','/',$path);
                            $tree[] = ['id' => $path, 'name' => $file];
                        }
                    } 
                }
            };
            return $tree;
         }    

        /** Reads a TOML formatted file and returns it as both JSON and TOML
         * 
         * @param - array - args containing file name plus path
         * @return - string - Ok or NotOk flag plus data or error message
         * @todo - 
         **/
         function convertFile($vars)
         {
            try {

                $fp = self::exists($vars['rq']['filepath']);

                $array = C::cfgReadFile($_SERVER['DOCUMENT_ROOT'].$fp);
                $json = json_encode($array);
                
                $val = self::readFile($fp);
                // $val = preg_replace("/\t/", " ", $val); // tabs with spaces
                // $val = preg_replace("/\s+/", " ", $val); // Multiple spaces with single space
                $toml = preg_replace("/\r\n/", "\n", $val); // Carriage return and newline
                $data = [
                    'json' => $json,
                    'toml' => $toml
                ];
                return ['flag' => 'Ok', 'data' => $data];
            } catch(Exception $e) {
                return ['flag' => 'NotOk', 'html' => $e->getMessage()];
            } 
         }

    /** File Editor functions
     *
     * displayFileEditor()
     *
     ******************************************************************************************************************/

        /** Display the file editor
         * for a popup window
         * @param - array - arguments 
         * @return - array - containing a Ok or NotOk flag and HTML or error message
         * @todo - 
         **/
         function displayFileEditor($vars)
         {

            try {

                global $clq;
                $table = $vars['table'];
                $tabletype = $vars['tabletype'];
                $rq = $vars['rq'];
                $ref = $rq['ref'];
                $idiom = $clq->get('idiom'); 
                
                // Do we read in a file
                if($ref != "") {
                    $ro = ['readonly' => 'true'];
                    $fp = '/models/'.$table.'.'.$ref.'.cfg';
                    $val = self::readFile($fp);
                    // $val = preg_replace("/\t/", " ", $val); // tabs with spaces
                    // $val = preg_replace("/\s+/", " ", $val); // Multiple spaces with single space
                    $val = preg_replace("/\r\n/", "\n", $val); // Carriage return and newline (not respected by CodeEditor display) with just Newline
                } else {
                    $ro = [];
                    $val = "";
                    $fp = '/models/'.$table.'.{collection}.cfg';
                }             

                $frm = H::div(['class' => 'col mr10 pad'],
                    H::form(['class' => '', 'action' => '/api/'.$idiom.'//', 'method' => 'POST', 'name' => 'popupform', 'id' => 'popupform'],
   
                        H::div(['class' => 'form-group'],
                            H::label(['class' => '', 'for' => 'filename'], Cliq::cStr('186:File name')),
                            H::input(['class' => 'form-control', 'id' => 'filename', 'name' => 'filename', 'required' => 'required', 'value' => $fp, 'style' => 'width:80%;', $ro]),
                            H::button(['type' => 'submit','class' => 'btn btn-sm btn-primary', 'style' => 'width:16%; float:right; margin-top: -34px;'], Cliq::cStr('105:Submit'))
                        ),                          

                        H::style('.CodeMirror{border: 1px solid #ccc; height: 540px;}'),

                        H::div(['class' => 'form-group'],
                            H::label(['class' => '', 'for' => 'filecontent'], Cliq::cStr('7:File content')),
                            H::textarea(['class' => 'form-control h500', 'id' => 'filecontent', 'name' => 'filecontent'], $val)
                        )                        
                    )
                );
                return [
                    'flag' => "Ok",
                    'html' => $frm
                ];

            } catch (Exception $e) {
                return [
                    'flag' => "NotOk",
                    'html' => $e->getMessage()
                ];
            }               
         }


    /** Input and Output functions for arrays and recordsets
     *
     * outputCsv()
     *
     ******************************************************************************************************************/

        /** outputCsv()
         * Takes in a filename and an array associative data array and outputs a csv file
         * @param string $fileName
         * @param array $rs     
         */
         public static function outputCsv($rs, $fs)
         {        
            $fp = self::openFile($fs, "w") ; 
            foreach($rs as $values){
                // fputcsv($fp, $values, $rq['fielddelimiter'], $rq['fieldencloser'], $rq['escapecharacter']);
                fputcsv($fp, $values);
            }
            self::closeFile($fp);
         }

        /** putArray()
         * Takes in a filename and an array associative data array and outputs a file that can be read by getArray()
         * @param string $fileName
         * @param array $rs     
         * @return - confirmation of success or failure
         */    
         public static function putArray(array $rs, string $fs)
         {
            
            $fr = FirePHP::getInstance(true);
            try {
                
                self::deleteFile($fs);
                $sp = self::setRoot();
                $mf = $sp.$fs;
                $f = fopen($mf, "a+");

                for($r = 0; $r < count($rs); $r++) {
                    $row = $rs[$r];
                    unset($row['c_document']);
                    $str = json_encode($row).$rs[$r]['c_document'];
                    $str = str_replace('}{', ', "c_document":{', $str).'}' ;
                    fputs($f, PHP_EOL.$str); 
                }
                fclose($f);

                $newrs = self::getArray($fs);

                if(serialize($rs) == serialize($newrs)) {
                    return "Ok";
                } else {

                    return "NotOk";
                }

            } catch(Exception $e) {
                Return "NotOk ".$e->getMessage();
            }
         }

        /** getArray()
         * Reads a file containing a complex array
         * @param string $fileName
         * @return array $rs     
         */    
         public static function getArray(string $fs)
         {
            
            $fr = FirePHP::getInstance(true);
            try {
                
                $sp = self::setRoot();
                $mf = $sp.$fs;
                $d = fopen($mf, "r");
                if($d) {
                    $newrs = [];
                    while(($str = fgets($d, 4000096)) !== false) {
                        $row = [];
                        $tmp = json_decode($str, true);
                        if(array_key_exists('c_document', $tmp)) {
                            $row['c_document'] = json_encode($tmp['c_document']);
                            unset($tmp['c_document']);
                            $row = array_merge($tmp, $row);
                        } else {
                            $row = $tmp;
                        }
                        $newrs[] = $row; unset($row); unset($tmp);
                    }
                    if (!feof($d)) {
                        throw new Exception("Error: unexpected fgets() fail\n");
                    }
                    fclose($d);
                }

                return $newrs;

            } catch(Exception $e) {
                Return "NotOk ".$e->getMessage();
            }       
         }

} // Class ends
