'use strict'
let markdown= require('../util/markdown');
let User = require('../models/user')

module.exports = () => {
	return (req, res, next) => {
	    if (req.user) {
	        res.locals.isAuthenticated = true;
			if(!req.session.currentUser) {
				User.getById(req.user).then(user => {
					req.session.currentUser = user;
					res.locals.currentUser = user;
					return next();	
				}).catch(err => {
					console.log(err);
					return next(err);	
				});
			}
			return next();
	    } else {
			return next();
		}
	};	
}
