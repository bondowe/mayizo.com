var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { pageTitle: 'Acceuil' });
});

/* GET article page. */
router.get('/article/:id', function(req, res) {
  res.render('article', { pageTitle: 'Article' });
});

module.exports = router;
