var config = require('../config');
var util = require('util');
var express = require('express');
var router = express.Router();

var sweetcaptcha = new require('sweetcaptcha');
var captcha = sweetcaptcha(config.appId, config.appKey, config.appSecret);

var User = require('../models/user');

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('account/login', { pageTitle: 'Connexion' });
});

/* login page. */
router.route('/register')
      .get(function(req, res) {
            //get sweetcaptcha html
            captcha.api('get_html', function(err, html){
                //Send the guts of the captcha to your template
                res.render('account/register', { pageTitle: 'Inscription', captcha: html });
            });
      })
      .post(function(req, res) {
    
            var usr = req.body.user;
            var errMsg;
            
            if(usr.password !== usr.passwordConfirmation) {
                errMsg = 'Les deux mots de passe fournis ne sont pas pareil';
            } else { 
                //Validate captcha
                captcha.api('check', {sckey: req.body["sckey"], scvalue: req.body["scvalue"]}, function(err, response) {

                    if (err) {
                        util.log(err);
                    } else if (response === 'true') {

                        var user = new User({
                            username: usr.username,
                            name: {
                                first: usr.name.first,
                                last: usr.name.last
                            },
                            gender: usr.gender,
                            dateOfBirth: usr.dateOfBirth,
                            emailAddress: usr.emailAddress,
                            password: usr.password
                        });

                        return res.json(usr);
                    }
                });

                errMsg = errMsg || 'Une erreur est survenue lors du traitement de votre requête. Veuillez reéssayer.';

                res.render('account/register', { user: usr, pageTitle: 'Inscription', errorMessage: errMsg, captcha: html, user: usr });
            };
      });

module.exports = router;
