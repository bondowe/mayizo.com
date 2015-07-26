'use strict';
let util = require('util');
let express = require('express');
let articles = require('./articles');
let authors = require('./authors');
let users = require('./users');
let pendingUsers = require('./pendingUsers');

let app = express();

app.on('mount', parent => {
	app.locals = parent.locals;
});

app.use('/articles', articles);
app.use('/authors', authors);
app.use('/users', users);
app.use('/pendingUsers', pendingUsers);

module.exports = app;
