'use strict';
let config = require('../config');
let security = require('../util/security');
let crypto = require('crypto');
let util = require('util');
let express = require('express');
let User = require('../models/user');
let PendingUser = require('../models/pendingUser');
let passwordless = require('passwordless');
let sweetcaptcha = new require('sweetcaptcha');
let captcha = sweetcaptcha(config.sweetcaptcha.appId, config.sweetcaptcha.appKey, config.sweetcaptcha.appSecret);

let router = express.Router();

/* registration page. */
router.route('/register')
      .get((req, res) => {
            captcha.api('get_html', (err, html) => {
                let usr = { 
                    username: '',
                    name: { first: '', last: ''},
                    dateOfBirth: '',
                    email: ''             
                };
                res.render('account/register', { user:usr, csrfToken: req.csrfToken(), pageTitle: 'Inscription', captcha: html });
            });
      })
      .post((req, res) => {   
            let usr = req.body.user;
            let renderView = (errMsg) => {
                errMsg = errMsg || 'Une erreur est survenue lors du traitement de votre requête. Veuillez reéssayer.';
                captcha.api('get_html', (err, html) => {
                    res.render('account/register', { user: usr, csrfToken: req.csrfToken(), pageTitle: 'Inscription', errorMessage: errMsg, captcha: html });
                });
            };      
            if (usr.password !== usr.passwordConfirmation) {
                return renderView('Les deux mots de passe fournis ne sont pas pareil.');
            }
            captcha.api('check', {sckey: req.body.sckey, scvalue: req.body.scvalue}, (err, response) => {
                if (err) {
                    util.log(err);
                    return renderView();
                }    
                if (response !== 'true') {
                    return renderView ('Êtes-vous humain? Veuillez le confirmer au bas du formulaire.');
                }    
                let user = new User({
                    username: usr.username,
                    name: {
                        first: usr.name.first,
                        last: usr.name.last
                    },
                    gender: usr.gender,
                    dateOfBirth: usr.dateOfBirth,
                    email: usr.email
                });     
                security.pbkdf2(usr.password, (err, key, salt) => {             
                    if (err) {
                        util.log(err);
                        return renderView();
                    }
                    user.password = key;
                    user.passwordSalt = salt;
                    user.save((err, user) => {
                        if (err) {
                            return res.send(err);   
                        }
                        req.session.currentUser = user;   
                        res.redirect('/');
                    });
                });
            });
      });

router.route('/login')
      .get(passwordless.logout(), (req, res) => {
            delete req.session.currentUser;
            res.render(res.view(), { user: '', csrfToken: req.csrfToken(), pageTitle: 'Connexion', failed: req.query.failed, returnUrl: req.query.returnUrl });
      })
     .post(
          passwordless.requestToken(
              (user, delivery, callback, req) => {
                    User.findByEmail(user).then(usr => {
                        if (usr) {
                            return Promise.resolve(usr);
                        }
                        return PendingUser.findByEmail(user);
                    }).then(usr => {
                        if(usr) {
                            return callback(null, usr.id)
                        }
                        return callback(null, null);
                    }).catch(err => {
                        return callback(err, null); 
                    });
                }, {
                    failureRedirect: '/account/login?failed=yes',
                    originField: 'returnUrl'
                }),     
          (req, res) => {
                res.render(res.view('../loginTokenSent'), { pageTitle: 'Connexion' });
          }
);

router.route('/connect').get(passwordless.acceptToken({ enableOriginRedirect: true }));

router.get('/logout', passwordless.logout(), (req, res) => {
    delete req.session.currentUser;
    return res.redirect('/');
});

module.exports = router;
