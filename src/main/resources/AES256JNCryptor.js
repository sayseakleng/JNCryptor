/**
 *
 * @source: https://github.com/sayseakleng
 *
 * Copyright (C) 2020  Seakleng Say (sayseakleng@gmail.com)
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 */
function AES256JNCryptor() {
    this.iterations 	= 10000;
    this.aesKeyLength 	= 256;
    this.saltLength 	= 8;
    this.aesBlockLength = 16;
    this.hmacLength 	= 32;
}

AES256JNCryptor.prototype.setPBKDFIterations = function(iterations) {
	this.iterations = iterations;
}

AES256JNCryptor.prototype.encryptData = function(plaintext, password) {
	var salt = CryptoJS.lib.WordArray.random(this.saltLength);
	var encryptionKey = CryptoJS.PBKDF2(password, salt, {
	  keySize: this.aesKeyLength / 32,
	  iterations: this.iterations
	});
	
	var hmacSalt = CryptoJS.lib.WordArray.random(this.saltLength);
	var hmacKey = CryptoJS.PBKDF2(password, hmacSalt, {
	  keySize: this.aesKeyLength / 32,
	  iterations: this.iterations
	});
	
	
	var iv = CryptoJS.lib.WordArray.random(this.aesBlockLength);
	var encrypt = CryptoJS.AES.encrypt(plaintext, encryptionKey, {iv: iv})
	
	
	//| version | options | encryption salt | HMAC salt |   IV   | ... ciphertext ... |     HMAC    |
	//|    0    |    1    |       2->9      |   10->17  | 18->33 | <-      ...     -> | (n-32) -> n |
	var aes256v3CipherData = CryptoJS.lib.WordArray.create(new  Uint8Array([3, 1]))
				.concat(salt)
				.concat(hmacSalt)
				.concat(iv)
				.concat(encrypt.ciphertext);
	
	var hmac = CryptoJS.HmacSHA256(aes256v3CipherData, hmacKey);
	
	return aes256v3CipherData
		.concat(hmac)
		.toString(CryptoJS.enc.Base64); 
}

AES256JNCryptor.prototype.decryptData = function(ciphertext, password) {
	var aes256v3CipherData 		= CryptoJS.enc.Base64.parse(ciphertext);
	var aes256v3CipherDataWord 	= aes256v3CipherData.toString(CryptoJS.enc.Latin1);
	var aes256v3CipherDataHex 	= aes256v3CipherData.toString(CryptoJS.enc.Hex);
	var dataToHMAC 				= aes256v3CipherDataWord.slice(0, aes256v3CipherDataWord.length - this.hmacLength);
	var version 				= aes256v3CipherDataHex.slice(0, 2);
	var option 					= aes256v3CipherDataHex.slice(2, 4);
	var hmac 					= aes256v3CipherDataWord.slice(dataToHMAC.length);
	var encrypted				= dataToHMAC.slice(34);
	
	
	if(version !== "03"){
		throw "Expected version 3 but found " + version.slice(1);
	}
	
	if(option !== "01"){
		throw "Ciphertext was not encrypted with a password";
	}
	
	var hmacSalt = CryptoJS.enc.Latin1.parse(dataToHMAC.slice(10, 18));
	var hmacKey = CryptoJS.PBKDF2(password, hmacSalt, {
	  keySize: this.aesKeyLength / 32,
	  iterations: this.iterations
	});
	
	if(hmac !== CryptoJS.HmacSHA256(CryptoJS.enc.Latin1.parse(dataToHMAC), hmacKey).toString(CryptoJS.enc.Latin1)) {
		throw "Invalid MAC";
	}
	
	var salt = CryptoJS.enc.Latin1.parse(dataToHMAC.slice(2, 10));
	var encryptionKey = CryptoJS.PBKDF2(password, salt, {
		keySize: this.aesKeyLength / 32,
		iterations: this.iterations
	});
	
	var iv = CryptoJS.enc.Latin1.parse(dataToHMAC.slice(18, 34));
	
	return CryptoJS.AES.decrypt(
		{
			ciphertext: CryptoJS.enc.Latin1.parse(encrypted),
		    salt: ""
		}
		, encryptionKey, {iv: iv}).toString(CryptoJS.enc.Utf8);
}
