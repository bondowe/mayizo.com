var express = require('express');
var router = express.Router();

var sweetcaptcha = new require('sweetcaptcha');
var captcha = sweetcaptcha('234529', '643a878cf5b88824fc1178c09377ce0d', '3eb08d9f8471847737b6c046c036e1a6');

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('accounts/login', { pageTitle: 'Connexion' });
});

/* login page. */
router.route('/register')
      .get(function(req, res) {
            //get sweetcaptcha html
            captcha.api('get_html', function(err, html){
                //Send the guts of the captcha to your template
                res.render('accounts/register', { pageTitle: 'Inscription', captcha: html });
            });
      })
      .post(function(req, res) {
            //Validate captcha
            captcha.api('check', {sckey: req.body["sckey"], scvalue: req.body["scvalue"]}, function(err, response){
                if (err) {
                    return console.log(err);
                }
                if (response === 'true') {
                    // valid captcha
                    res.send("Thanks! We have sent your message.");
                }
                if (response === 'false'){
                    // invalid captcha
                    res.send("Try again");
                }
            });
      });

module.exports = router;
