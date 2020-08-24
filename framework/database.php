<?php
/**
Database handling
; type = 'mysql'
; server = 'localhost'
; dbname = ''
; username = ''
; password = ''
; port = '3306'
; charset = 'utf8'
*/
try {

	// Load the file
	require_once SITE_PATH.'framework/core/Toml.php';	
	$td = new core\Toml();
	$dbcfg = $td->parseFile(SITE_PATH.'config/db.cfg');
	require_once SITE_PATH.'framework/Rb.php';	

	switch($dbcfg['type']){
	    
	    case"mysql":
	    case"pgsql":
	    	
	        R::setup($dbcfg['type'].':host='.$dbcfg['server'].';dbname='.$dbcfg['dbname'],$dbcfg['username'],$dbcfg['password']);
	        R::useWriterCache(true); 
	        R::useJSONFeatures(TRUE);
	    break;

	    case"sqlite":
	    	if(R::hasDatabase($dbcfg['dbname']) != true) {
		    	R::addDatabase($dbcfg['dbname'], 'sqlite:'.SITE_PATH.'data/'.$dbcfg['dbname'].'.sqlite'); 
		    	R::selectDatabase($dbcfg['dbname']);
	    	}
	        R::setup('sqlite:'.SITE_PATH.'data/'.$dbcfg['dbname'].'.sqlite');
	    break;

	    case "firebird":
	        $dsn = ['firebird:host='.$dbcfg['server'].';dbname='.$dbcfg['dbname'],$dbcfg['username'],$dbcfg['password']];
	        Framework::set('dsn', $dsn);
	    break;	    
	    case "odbc":
	        $dsn = 'odbc:'.$dbcfg['dbname'];
	        Framework::set('dsn', $dsn);
	    break;	    
	}

	// Add callers for plugins here

	R::ext('performMysqlBackup', function($outputFolder, $backupName = "auto") {
	    return RedBean_MysqlBackup::performMysqlBackup($outputFolder, $backupName);
	});

	R::ext('createRevisionSupport', function(RedBean_OODBBean $bean) {
	    $rebeanPlugin = new RedBean_ReBean();
	    $rebeanPlugin->createRevisionSupport($bean);
	});

	/** Short Query Notation Library
	 *
	 * SQN is a small library that allows you to write
	 * convention based SQL queries using a short notation.
	 * SQL is a very flexible and powerful language. Since SQL
	 * does not rely on assumptions you have to specify a lot.
	 * The SQN-library uses some basic assumptions regarding
	 * naming conventions and in return it gives you a shorter notation.
	 *
	 * Usage:
	 *
	 * R::sqn('shop<product<price'); - left joins shop, product and price
	 * R::sqn('book<<tag'); - doubly left joins book, and tag using book_tag
	 *
	 * SQN assumes id fields follow the following conventions:
	 *
	 * Primary key: id
	 * Foreign key: {table}_id
	 * No table prefix.
	 *
	 * SQN can also generate additional aliases:
	 *
	 * R::sqn( ..., 'area/x,y;place/x,y' ) - area_x area_y place_x place_y
	 *
	 * @author  Gabor de Mooij
	 * @license BSD/GPLv2
	 *
	 * @copyright
	 * copyright (c) G.J.G.T. (Gabor) de Mooij
	 * This source file is subject to the BSD License that is bundled
	 * with this source code in the file license.txt.
	 */
	 R::ext('sqn', function( $query, $aliases = null, $q = '`' ) {
		$map = [
			'|'  => 'INNER JOIN',
			'||' => 'INNER JOIN',
			'>'  => 'RIGHT JOIN',
			'>>' => 'RIGHT JOIN',
			'<'  => 'LEFT JOIN',
			'<<' => 'LEFT JOIN',
		];
		$select = [];
		$from   = '';
		$joins  = [];
		$prev   = '';
		$ents   = preg_split( '/[^\w_]+/', $query );
		$tokens = preg_split( '/[\w_]+/', $query );
		array_pop($tokens);
		foreach( $ents as $i => $ent ) {
			$select[] = " {$q}{$ent}{$q}.* ";
			if (!$i) {
				$from = $ent;
				$prev = $ent;
				continue;
			}
			if ( $tokens[$i] == '<' || $tokens[$i] == '>' || $tokens[$i] == '|') {
				$join[] = " {$map[$tokens[$i]]} {$q}{$ent}{$q} ON {$q}{$ent}{$q}.{$prev}_id = {$q}{$prev}{$q}.id ";
			}
			if ( $tokens[$i] == '<<' || $tokens[$i] == '>>' || $tokens[$i] == '||') {
				$combi = [$prev, $ent];
				sort( $combi );
				$combi = implode( '_', $combi );
				$select[] = " {$q}{$combi}{$q}.* ";
				$join[] = " {$map[$tokens[$i]]} {$q}{$combi}{$q} ON {$q}{$combi}{$q}.{$prev}_id = {$q}{$prev}{$q}.id ";
				$join[] = " {$map[$tokens[$i]]} {$q}{$ent}{$q} ON {$q}{$combi}{$q}.{$ent}_id = {$q}{$ent}{$q}.id ";
			}
			$prev = $ent;
		}
		if (!is_null($aliases)) {
			$aliases = explode(';', $aliases);
			foreach($aliases as $alias) {
				list($table, $cols) = explode('/', $alias);
				$cols = explode(',', $cols);
				foreach($cols as $col) {
					$select[] = " {$q}{$table}{$q}.{$q}{$col}{$q} AS {$q}{$table}_{$col}{$q} ";
				}
			}
		}
		$selectSQL = implode( ",\n", $select );
		$joinSQL   = implode( "\n", $join );
		return "SELECT{$selectSQL}\n FROM {$q}{$from}{$q}\n{$joinSQL}";
	 });


} catch (PDOException $e) {
	bdump('PDO Error: '.$e->getMessage());
	Debugger::log('PDO Error: '.$e->getMessage());
};

/**
 * Support functions for RedBeanPHP.
 * Additional convenience shortcut functions for RedBeanPHP.
 *
 * @file    RedBeanPHP/Functions.php
 * @author  Gabor de Mooij and the RedBeanPHP community
 * @license BSD/GPLv2
 *
 * @copyright
 * copyright (c) G.J.G.T. (Gabor) de Mooij and the RedBeanPHP Community.
 * This source file is subject to the BSD/GPLv2 License that is bundled
 * with this source code in the file license.txt.
 */

/**
 * Convenience function for ENUM short syntax in queries.
 *
 * Usage:
 *
 * <code>
 * R::find( 'paint', ' color_id = ? ', [ EID('color:yellow') ] );
 * </code>
 *
 * If a function called EID() already exists you'll have to write this
 * wrapper yourself ;)
 *
 * @param string $enumName enum code as you would pass to R::enum()
 *
 * @return mixed
 */
if (!function_exists('EID')) {

	function EID($enumName)
	{
		return \RedBeanPHP\Facade::enum( $enumName )->id;
	}

}

/**
 * Prints the result of R::dump() to the screen using
 * print_r.
 *
 * @param mixed $data data to dump
 *
 * @return void
 */
if ( !function_exists( 'dmp' ) ) {

	function dmp( $list )
	{
		print_r( \RedBeanPHP\Facade::dump( $list ) );
	}
}

/**
 * Function alias for R::genSlots().
 */
if ( !function_exists( 'genslots' ) ) {

	function genslots( $slots, $tpl = NULL )
	{
		return \RedBeanPHP\Facade::genSlots( $slots, $tpl );
	}
}

/**
 * Function alias for R::flat().
 */
if ( !function_exists( 'array_flatten' ) ) {

	function array_flatten( $array )
	{
		return \RedBeanPHP\Facade::flat( $array );
	}
}

/**
 * RedBean ReBean (Revision Bean)
 *
 * @file    ReBean.php
 * @desc    Revisionplugin to support each bean with custom revision tables and triggers
 * @author  Zewa
 *
 */
class RedBean_ReBean 
{
  /**
   * Creates the revision support for the given Bean
   *
   * @param  RedBean_OODBBean $bean          The bean-type to be revision supported
   */
  public function createRevisionSupport(RedBean_OODBBean $bean)
  {
    // check if the bean already has revision support
    if(R::getWriter()->tableExists("revision" . $bean->getMeta('type')))
    {
      throw new ReBean_Exception("The given Bean has already revision support");
    }

    $export = $bean->export();
    $duplicate = R::dispense("revision" . $bean->getMeta('type'));
    $duplicate->action = "";                                 // real enum needed
    $duplicate->original_id = $bean->id;
    $duplicate->import($export);
    $duplicate->lastedit = date('Y-m-d h:i:s');
    $duplicate->setMeta('cast.action','string');
    $duplicate->setMeta('cast.lastedit','datetime');
    RedBean_Facade::store($duplicate);

    $this->createTrigger($bean, $duplicate);
  }

  private function getRevisionColumns(RedBean_OODBBean $bean)
  {
    return implode(",",
      array_filter(                                              // remove nulls
        array_map(                                               // transform values instead foreach
          function($val) {
            if($val == "id")
            {
              return "original_id";
            }
            else
            {
              return (empty($val) || $val == null) ? null : $val;
            }
          },
          array_keys($bean->getProperties())                     // use the array_key to get the colName
        )
      )
    );
  }

  private function getOriginalColumns(RedBean_OODBBean $bean, $prefix)
  {
    $self = $this;
    return implode(",",
      array_filter(
        array_map(
          function($col) use ($prefix) {
            return $prefix . $col;
          },
          array_keys($bean->getProperties())
        )
      )
    );
  }

  private function createTrigger(RedBean_OODBBean $bean, RedBean_OODBBean $duplicate)
  {
    RedBean_Facade::$adapter->exec("DROP TRIGGER IF EXISTS `trg_" . $bean->getMeta('type') . "_AI`;");
    RedBean_Facade::$adapter->exec("CREATE TRIGGER `trg_" . $bean->getMeta('type') . "_AI` AFTER INSERT ON `" . $bean->getMeta('type') . "` FOR EACH ROW BEGIN
    \tINSERT INTO " . $duplicate->getMeta('type') . "(`action`, `lastedit`, " . $this->getRevisionColumns($bean) . ") VALUES ('insert', NOW(), " . $this->getOriginalColumns($bean, 'NEW.') . ");
    END;");

    RedBean_Facade::$adapter->exec("DROP TRIGGER IF EXISTS `trg_" . $bean->getMeta('type') . "_AU`;");
    RedBean_Facade::$adapter->exec("CREATE TRIGGER `trg_" . $bean->getMeta('type') . "_AU` AFTER UPDATE ON `" . $bean->getMeta('type') . "` FOR EACH ROW BEGIN
    \tINSERT INTO " . $duplicate->getMeta('type') . "(`action`, `lastedit`, " . $this->getRevisionColumns($bean) . ") VALUES ('update', NOW(), " . $this->getOriginalColumns($bean, 'NEW.') . ");
    END;");

    RedBean_Facade::$adapter->exec("DROP TRIGGER IF EXISTS `trg_" . $bean->getMeta('type') . "_AD`;");
    RedBean_Facade::$adapter->exec("CREATE TRIGGER `trg_" . $bean->getMeta('type') . "_AD` AFTER DELETE ON `" . $bean->getMeta('type') . "` FOR EACH ROW BEGIN
    \tINSERT INTO " . $duplicate->getMeta('type') . "(`action`, `lastedit`, " . $this->getRevisionColumns($bean) . ") VALUES ('delete', NOW(), " . $this->getOriginalColumns($bean, 'OLD.') . ");
    END;");
  }
}

class ReBean_Exception extends Exception
{
  public function __construct($message, $code = 0, Exception $previous = null) {
    parent::__construct($message, $code, $previous);
  }
}

/**
 * RedBean Mysql Backup
 *
 * @file    RedBeanMysqlBackup.php
 * @desc    Generates a backup file of your database
 * @author  Zewa666
 *
 */
class RedBean_MysqlBackup 
{
	/**
	* Creates a file backup of all tables from the connected Database
	*
	* @param  string $outputFolder              The folder where to put the newly created backup-file
	* @param  string $backupName = 'auto'       The name of the new backup file
	*/
	public static function performMysqlBackup($outputFolder, $backupName = "auto")
	{
		if(!(R::getWriter() instanceof RedBean_QueryWriter_MySQL))
		{
	  	throw new Exception("This plugin only supports MySql.");
	}

	if(!file_exists($outputFolder))
	{
	  throw new Exception("Outputfolder does not exist, please create it manually.");
	}

	$write = "";
	$tables = R::inspect();

	foreach($tables as $table)
	{
	  $pdo = R::getDatabaseAdapter()->getDatabase()->getPDO();
	  $query = $pdo->prepare('SELECT * FROM '.$table);
	  $query->execute();
	  /*$result = $query->fetchAll();*/
	  $fields = R::inspect($table);
	  $num_fields = count($fields);

	  $write .= 'DROP TABLE '.$table.';';
	  $row2 = R::getRow('SHOW CREATE TABLE '.$table);
	  $write .= "\n\n".$row2['Create Table'].";\n\n";


	  /*foreach($result as $row)*/
	  do
	  {
	    $write .= 'INSERT INTO '.$table.' VALUES(';
	    $parts = array();
	    foreach($fields as $key => $field)
	    {
	      if($row[$key] == null)
	        $parts[] = 'NULL';
	      else
	        $parts[] = '"'.$row[$key].'"';
	    }

	    $write .=  implode(",", $parts) . ");\n";
	  } while ($row = $query->fetch());

	  $write .="\n\n\n";
	}

	if($backupName == "auto")
	  $handle = fopen($outputFolder . '/db-backup-'.time().'-'.(md5(implode(',',$tables))).'.sql','w+');
	else
	  $handle = fopen($outputFolder . "/" . $backupName,'w+');
	fwrite($handle,$write);
	fclose($handle);
	}
}