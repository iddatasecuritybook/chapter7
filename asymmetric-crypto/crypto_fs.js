var fs = require('fs');
var path = require('path');
var ursa = require('ursa');
var mkdirp = require('mkdirp');

//make direction and generate private / public keys for sender / receiver
var rootpath = './keys';
makekeys(rootpath, 'sender');
makekeys(rootpath, 'receiver');

//generate sender private and public keys
var senderprivkey = ursa.createPrivateKey(fs.readFileSync(path.join(rootpath, 'sender', 'private.pem')));
var senderpubkey = ursa.createPublicKey(fs.readFileSync(path.join(rootpath, 'sender', 'public.pem')));

//generate recipient private and public keys
var recipientprivkey = ursa.createPrivateKey(fs.readFileSync(path.join(rootpath, 'receiver', 'private.pem')));
var recipientpubkey = ursa.createPublicKey(fs.readFileSync(path.join(rootpath, 'receiver', 'public.pem')));

//prepare JSON message to send
var msg = { 'user':'Nikola Tesla',
            'address':'W 40th St, New York, NY 10018',
            'state':'active' };
            
msg = JSON.stringify(msg);

//encrypt with recipient public key, and sign with sender private key
var encrypted = recipientpubkey.encrypt(msg, 'utf8', 'base64');
var signed = senderprivkey.hashAndSign('sha256', msg, 'utf8', 'base64');

//decrypt message with recipient private key
var decryptedmsg = recipientprivkey.decrypt(encrypted, 'base64', 'utf8');

//verify message with sender private key
bufferedmsg = new Buffer(decryptedmsg).toString('base64');
if (!senderpubkey.hashAndVerify('sha256', bufferedmsg, signed, 'base64')){
    throw new Error("invalid signature");
} else {
    console.log('decrypted message verified:', decryptedmsg);
}

function makekeys(rootpath, subpath){
    try {
        mkdirp.sync(path.join(rootpath, subpath));
    } catch (err) {
        console.error(err);
    }
    
    var key = ursa.generatePrivateKey(1024, 65537);
    var privatepem = key.toPrivatePem();
    var publicpem = key.toPublicPem();
    
    try {
        fs.writeFileSync(path.join(rootpath, subpath, 'private.pem'), privatepem, 'ascii');
        fs.writeFileSync(path.join(rootpath, subpath, 'public.pem'), publicpem, 'ascii');
    } catch (err) {
        console.error(err);
    }
}