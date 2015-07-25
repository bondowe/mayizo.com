
'use strict';
let nodemailer = require('nodemailer');
let config = require('../config');

let transporter = nodemailer.createTransport(config.email.server);

function send(to, subject, html) {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from:    config.email.from.support, 
            to:      to,
            subject: subject,
            html:    html
        }, (err, message) => { 
            if(err) {
                return reject(err);
            }
            return resolve();
        });       
    });
}

module.exports = {
    send: send
};
