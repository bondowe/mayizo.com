'use strict';
let config = require('../config');
let email = require('./email');
let passwordless = require('passwordless');
let MongoStore = require('passwordless-mongostore');

function init(app) {
    passwordless.init(new MongoStore(config.db.uri));
    passwordless.addDelivery(
        (tokenToSend, uidToSend, recipient, callback) => {
            var locals = {
                host: 'http://localhost:3000',
                tokenToSend: tokenToSend,
                uidToSend: encodeURIComponent(uidToSend)
            };
            app.render('account/loginTokenEmail', locals, (err, html) => {
                if (err) {
                    return callback(err);
                }
                email.send(recipient, 'Connexion', html);
                return callback();                
            });
        }
    ); 
}

module.exports = {
    init: init
}