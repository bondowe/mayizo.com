var util = require('util');
var debuglog = util.debuglog('mayizo:admin');
var express = require('express');

var app = express();

var articles = require('./articles');
var authors = require('./authors');

app.use('/articles', articles);
app.use('/authors', authors);

module.exports = app;
