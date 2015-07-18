'use strict'
let session = require('express-session');
let connectMongo = require('connect-mongo');

module.exports = (db) => {
	let MongoStore = connectMongo(session);
	return session({
	    name: 'mayizo.com',
	    secret: '5!8523Q45FGHFKUhtki23"£4HLhpo' ,
	    resave: false,
	    saveUninitialized: false,
	    store: new MongoStore({ 
	        mongooseConnection: db, 
	        ttl: 24 * 60 * 60,
	        autoRemove: 'interval',
	        autoRemoveInterval: 10, // In minutes.
	        touchAfter: 4 * 3600 // time period in seconds
	    })
	});
}
