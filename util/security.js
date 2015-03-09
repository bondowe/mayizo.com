var config = require('../config');
var crypto = require('crypto');
var util = require('util');

var pbkdf2Config = config.crypto.pbkdf2;

function pbkdf2 (password, salt, callback) {
    if (callback == undefined && util.isFunction(salt)) {
        callback = salt;
        salt = null;
    }
    var fn = function (salt) {
        return crypto.pbkdf2(password, salt, pbkdf2Config.iterations, pbkdf2Config.keyLength, pbkdf2Config.digest, function (err, buf) {
            var key = buf.toString('hex');
            return callback(err, key, salt);
        });  
    }   
    if(salt) {
        return fn(salt);   
    }  
    crypto.pseudoRandomBytes(pbkdf2Config.saltLength, function (err, buf) {
        if (err) {
            return callback(err);   
        }
        var salt = buf.toString('hex');
        return fn(salt);
    });
}

function verifyPbkdf2 (password, salt, key, callback) {
    pbkdf2(password, salt, function (err, key2) { 
        var success = (key == key2);
        return callback(err, success);
    });
}

module.exports = {
    pbkdf2: pbkdf2,
    verifyPbkdf2: verifyPbkdf2
};