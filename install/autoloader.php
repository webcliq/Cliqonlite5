<?php

define('BASE_PATH', realpath(dirname(__FILE__)).'\\');

class Autoloader {
    static public function loader($className) {
        // $filename = "framework/" . str_replace("\\", DS, $className) . ".php";
        $filename = str_replace("\\", '/', BASE_PATH.$className) . ".php";
        if (file_exists($filename)) {
            include($filename);
            if (class_exists($className)) {
                return TRUE;
            }
        }
        return FALSE;
    }
}
spl_autoload_register('Autoloader::loader');
