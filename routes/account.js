var config = require('../config');
var security = require('../util/security');
var crypto = require('crypto');
var util = require('util');
var express = require('express');
var router = express.Router();

var sweetcaptcha = new require('sweetcaptcha');
var captcha = sweetcaptcha(config.sweetcaptcha.appId, config.sweetcaptcha.appKey, config.sweetcaptcha.appSecret);

var User = require('../models/user');

/* registration page. */
router.route('/register')
      .get(function (req, res) {
            captcha.api('get_html', function(err, html) {
                var usr = { 
                    username: '',
                    name: { first: '', last: ''},
                    dateOfBirth: '',
                    email: ''             
                };
                res.render('account/register', { user:usr, pageTitle: 'Inscription', captcha: html });
            });
      })
      .post(function (req, res) {   
            var usr = req.body.user;
            var renderView = function (errMsg) {
                errMsg = errMsg || 'Une erreur est survenue lors du traitement de votre requête. Veuillez reéssayer.';
                captcha.api('get_html', function(err, html) {
                    res.render('account/register', { user: usr, pageTitle: 'Inscription', errorMessage: errMsg, captcha: html });    
                });
            };      
            if (usr.password !== usr.passwordConfirmation) {
                return renderView('Les deux mots de passe fournis ne sont pas pareil.');
            }
            captcha.api('check', {sckey: req.body.sckey, scvalue: req.body.scvalue}, function(err, response) {
                if (err) {
                    util.log(err);
                    return renderView();
                }    
                if (response !== 'true') {
                    return renderView ('Êtes-vous humain? Veuillez le confirmer au bas du formulaire.');
                }    
                var user = new User({
                    username: usr.username,
                    name: {
                        first: usr.name.first,
                        last: usr.name.last
                    },
                    gender: usr.gender,
                    dateOfBirth: usr.dateOfBirth,
                    email: usr.email
                });     
                security.pbkdf2(usr.password, function (err, key, salt) {             
                    if (err) {
                        util.log(err);
                        return renderView();
                    }
                    user.password = key;
                    user.passwordSalt = salt;
                    user.save(function (err, user) {
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
      .get(function (req, res) {
            var usr = { email: '' };
            res.render('account/login', { user: usr, pageTitle: 'Connexion', returnUrl: req.query.returnUrl });
      })
      .post(function (req, res) {
            var usr = req.body.user;
            var renderView = function (errMsg) {
                delete req.session.user;
                errMsg = errMsg || 'Une erreur est survenue lors du traitement de votre requête. Veuillez reéssayer.';
                res.render('account/login', { user: usr, pageTitle: 'Connexion', returnUrl: req.body.returnUrl,  errorMessage: errMsg });   
            };      
            User.findOne({ email: usr.email }, function (err, user) {
                if (err) {
                    return renderView();   
                }
                var incorrectCredentialsMessage = 'Email ou mot de passe incorrect.';
                if (!user) {
                    return renderView(incorrectCredentialsMessage);   
                }
                security.verifyPbkdf2(usr.password, user.passwordSalt, user.password, function (err, success) {
                    if (err) {
                        return renderView();
                    }    
                    if (!success) {
                        return renderView (incorrectCredentialsMessage);
                    }
                    req.session.user = user;         
                    var returnUrl = (req.body.returnUrl && req.body.returnUrl != 'undefined')
                                ? req.body.returnUrl 
                                : '/';    
                    res.redirect(returnUrl);
                });
            }); 
      });

/* login page. */
router.get('/logout', function (req, res) {
    delete req.session.user;
    return res.redirect('/');
});

module.exports = router;
