var crypto = require('crypto');

var text = "Encryption Testing AES";
var key = crypto.randomBytes(32);       //256 bit shared secret
var iv = crypto.randomBytes(16);        //initialization vector - 16 bytes
var algorithm = 'aes-256-ctr';          //cypher and mode of operation

//encrypt
var cipher = crypto.createCipher(algorithm, key, iv);
var encrypted = cipher.update(text, 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log("Encrypted: " + encrypted);
 
//decrypt
var decipher = crypto.createDecipher(algorithm, key, iv);
var decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log("Decrypted: " + decrypted);