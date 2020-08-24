<?php
/**
 * Crypt functions
 *
 * Copyright 2001 Nicolas Chalanset <nicocha@free.fr>
 * Copyright 2001 Olivier Cahagne <cahagn_o@epita.fr>
 * Copyright 2005 Arnaud Boudou <goddess_skuld@users.sourceforge.net>
 * Copyright 2008-2011 Tim Gerundt <tim@gerundt.de>
 *
 * This file is part of NOCC. NOCC is free software under the terms of the
 * GNU General Public License. You should have received a copy of the license
 * along with NOCC.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @package    NOCC
 * @subpackage Utilities
 * @license    http://www.gnu.org/licenses/ GNU General Public License
 * @version    SVN: $Id: crypt.php 2835 2019-11-15 16:15:51Z oheil $
 */

function encrXOR($string, $key) {
    for ($i=0; $i<strlen($string); $i++) {
        for ($j=0; $j<strlen($key); $j++) {
            $string[$i] = $string[$i]^$key[$j];
        }
    }
    return $string;
}

function decrXOR($string, $key) {
    for ($i=0; $i<strlen($string); $i++) {
        for ($j=0; $j<strlen($key); $j++) {
            $string[$i] = $key[$j]^$string[$i];
        }
    }
    return $string;
}

/**
 * Returns encrypted password
 * @param string $passwd Password
 * @param string $rkey Master key
 * @return string Encrypted password
 */
function encpass($passwd, $rkey) {
	if( extension_loaded("openssl") && function_exists("openssl_encrypt") && function_exists("openssl_decrypt")
		&& extension_loaded("hash") && function_exists("hash")
		&& in_array("sha256",hash_algos())
		&& in_array("AES256",openssl_get_cipher_methods(true))
	) {
		$key=hash("SHA256",$rkey,true);
		$iv_size=openssl_cipher_iv_length("AES256");
		$iv=openssl_random_pseudo_bytes($iv_size);
		$encpasswd=openssl_encrypt($passwd,"AES256",$key,$options=0,$iv);
		$encpasswd=base64_encode($iv.$encpasswd);
	}
	else if( extension_loaded("mcrypt") && function_exists("mcrypt_encrypt") && function_exists("mcrypt_decrypt")
		&& extension_loaded("hash") && function_exists("hash")
		&& in_array("sha256",hash_algos())
		&& in_array("rijndael-128",mcrypt_list_algorithms())
	) {
		$key=hash("SHA256",$rkey,true);
		$iv_size=mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128,MCRYPT_MODE_CBC);
		$iv=mcrypt_create_iv($iv_size,MCRYPT_RAND);
		$encpasswd=base64_encode($iv.mcrypt_encrypt(MCRYPT_RIJNDAEL_128,$key,$passwd,MCRYPT_MODE_CBC,$iv));
	}
	else {
		$encpasswd = encrXOR(bin2hex($passwd), $rkey);
	}
	return $encpasswd;
}

/**
 * Returns decrypted password
 * @param string $cipher Cipher
 * @param string $rkey Master key
 * @return string Decrypted password
 */
function decpass($cipher, $rkey) {
	if( extension_loaded("openssl") && function_exists("openssl_encrypt") && function_exists("openssl_decrypt")
		&& extension_loaded("hash") && function_exists("hash")
		&& in_array("sha256",hash_algos())
		&& in_array("AES256",openssl_get_cipher_methods(true))
	) {
		$key=hash("SHA256",$rkey,true);
		$iv_size=openssl_cipher_iv_length("AES256");
		$ciphertext_dec=base64_decode($cipher);
		$iv_dec=substr($ciphertext_dec,0,$iv_size);
		$ciphertext_dec=substr($ciphertext_dec,$iv_size);
		$decpasswd=openssl_decrypt($ciphertext_dec,"AES256",$key,$options=0,$iv_dec);
	}
	else if( extension_loaded("mcrypt") && function_exists("mcrypt_encrypt") && function_exists("mcrypt_decrypt")
		&& extension_loaded("hash") && function_exists("hash")
		&& in_array("sha256",hash_algos())
		&& in_array("rijndael-128",mcrypt_list_algorithms())
	) {
		$key=hash("SHA256",$rkey,true);
		$iv_size=mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128,MCRYPT_MODE_CBC);
		$ciphertext_dec=base64_decode($cipher);
		$iv_dec=substr($ciphertext_dec,0,$iv_size);
		$ciphertext_dec=substr($ciphertext_dec,$iv_size);
		$decpasswd=mcrypt_decrypt(MCRYPT_RIJNDAEL_128,$key,$ciphertext_dec,MCRYPT_MODE_CBC,$iv_dec);
	}
	else {
		$dechexpasswd = decrXOR($cipher, $rkey);
  
		$decpasswd = '';
		for ($i=0; $i<strlen($dechexpasswd)/2; $i++) {
			$decpasswd .= chr(base_convert(substr($dechexpasswd, $i * 2, 2), 16, 10));
		}
	}
	return $decpasswd;
}
