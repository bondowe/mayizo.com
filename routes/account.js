"use strict"
let config = require('../config');
let security = require('../util/security');
let crypto = require('crypto');
let util = require('util');
let express = require('express');
let router = express.Router();

let sweetcaptcha = new require('sweetcaptcha');
let captcha = sweetcaptcha(config.sweetcaptcha.appId, config.sweetcaptcha.appKey, config.sweetcaptcha.appSecret);

let User = require('../models/user');

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
                        req.session.user = user;   
                        res.redirect('/');
                    });
                });
            });
      });

/* login page. */
router.route('/login')
      .get((req, res) => {
            let usr = { email: '' };
            res.render('account/login', { user: usr, csrfToken: req.csrfToken(), pageTitle: 'Connexion', returnUrl: req.query.returnUrl });
      })
      .post((req, res) => {
            let usr = req.body.user;
            let renderView = (errMsg) => {
                delete req.session.user;
                errMsg = errMsg || 'Une erreur est survenue lors du traitement de votre requête. Veuillez reéssayer.';
                res.render('account/login', { user: usr, csrfToken: req.csrfToken(), pageTitle: 'Connexion', returnUrl: req.body.returnUrl, errorMessage: errMsg });
            };      
            User.findOne({ email: usr.email }, (err, user) => {
                if (err) {
                    return renderView();   
                }
                let incorrectCredentialsMessage = 'Email ou mot de passe incorrect.';
                if (!user) {
                    return renderView(incorrectCredentialsMessage);   
                }
                security.verifyPbkdf2(usr.password, user.passwordSalt, user.password, (err, success) => {
                    if (err) {
                        return renderView();
                    }    
                    if (!success) {
                        return renderView (incorrectCredentialsMessage);
                    }
                    req.session.user = user;         
                    let returnUrl = (req.body.returnUrl && req.body.returnUrl != 'undefined')
                                ? req.body.returnUrl 
                                : '/';    
                    res.redirect(returnUrl);
                });
            }); 
      });

/* login page. */
router.get('/logout', (req, res) => {
    delete req.session.user;
    return res.redirect('/');
});

module.exports = router;
