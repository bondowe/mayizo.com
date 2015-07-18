'use strict'
let util = require('util');
let express = require('express');
let articles = require('./articles');
let authors = require('./authors');
let users = require('./users');

let app = express();

app.use('/articles', articles);
app.use('/authors', authors);
app.use('/users', users);

module.exports = app;
