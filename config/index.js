var fs = require('fs');
var merge = require('merge-deep');

var config = {
    
    db: {
        options: {
            db: { native_parser: true },
            server: { poolSize: 5 }
        }
    },
    
    email: {
        from: {
            support: 'Mayizo Team <support@mayizo.com>'
        },
        server: {
            host: 'smtp.zoho.com',
            port: 587,
            auth: {
                user: 'support@mayizo.com',
                pass: 'zo19731103ZO'
            }
        }
    },
    
    crypto: {
        pbkdf2: {
            saltLength: 20,
            keyLength: 20,
            iterations: 10000,
            digest: 'sha256'
        }
    },
    
    sweetcaptcha: {
        appId: '234529',
        appKey: '643a878cf5b88824fc1178c09377ce0d',
        appSecret: '3eb08d9f8471847737b6c046c036e1a6'
    }
};

var envConfigFile = (process.env.NODE_ENV || 'development');
var envConfig = require('./env/' + envConfigFile);


module.exports = merge(config, envConfig);
