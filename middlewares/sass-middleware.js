'use strict'
let path = require('path');
let sassMiddleware = require('node-sass-middleware');

module.exports = () => {
	return sassMiddleware({
	    src: path.join(__dirname, '/sass'),
	    dest: path.join(__dirname, '/public/stylesheets'),
	    prefix:  '/stylesheets',
	    debug: false,
	  });
}
