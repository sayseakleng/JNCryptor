JNCryptor 
========

JNCryptor is considered a secure library for a symmetric data encryption base on AES 256 Bits. It was ported to JavaScript from the [RNCryptor](https://github.com/RNCryptor/RNCryptor) library for iOS and [JNCryptor](https://github.com/RNCryptor/JNCryptor) library for Java/Android



Getting JNCryptor
-----------------
From your HTML files

```xml
<head>
	...
	<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js" integrity="sha256-6rXZCnFzbyZ685/fMsqoxxZz/QZwMnmwHg+SsNe+C/w=" crossorigin="anonymous"></script>
	<script type="text/javascript" src="./AES256JNCryptor.js"></script>
</head>
````

Using JNCryptor
----------------

A quick example is shown below:

```java
const aes256JNCryptor = new AES256JNCryptor();
aes256JNCryptor.setPBKDFIterations(1000);

// Encrypt
var ciphertext = aes256JNCryptor.encryptData(message, password);
console.log("Encrypt AES256v3Cipher:", ciphertext);

// Decrypt
var plainText = aes256JNCryptor.decryptData(ciphertext, password)
console.log("Decrypt AES256v3Cipher:", plainText);

```

Follow my [guide](https://github.com/sayseakleng/JNCryptor/tree/master/JNCryptor/src/main/resources/aes.html)

Iterations
----------

JNCryptor supports changing the number of PBKDF2 iterations performed by the library. Unfortunately, the number of iterations is not currently encoded in the data format, which means that both sides of the conversation need to know how many iterations have been used.


Data Format
------------

A proprietary data format is used that stores the IV, salt values (if applicable), ciphertext and HMAC value in a compact fashion. Methods are offered to encrypt data based on either an existing key, or a password. In the latter case, a key is derived from the password using a key derivation function, with 10,000 iterations and a salt value. Below is how we construct AES256v3Cipher cipher data.

```java
| version | options | encryption salt | HMAC salt |   IV   | ... ciphertext ... |     HMAC    |

|    0    |    1    |       2->9      |   10->17  | 18->33 | <-      ...     -> | (n-32) -> n |
```

See [the spec documents online](https://github.com/RNCryptor/RNCryptor-Spec/blob/master/RNCryptor-Spec-v3.md).

