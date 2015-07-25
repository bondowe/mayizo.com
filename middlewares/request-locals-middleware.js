'use strict'
let markdown= require('../util/markdown');
let User = require('../models/user')

module.exports = () => {
	return (req, res, next) => {
		res.locals.markdown = markdown;
	    if (req.user) {
	        res.locals.isAuthenticated = true;
			if(!req.session.user) {
				User.getById(req.user).then(user => {
					req.session.user = user;
					return next();	
				}).catch(err => {
					console.log(err);
					return next(err);	
				});
			}
	    } else {
			return next();
		}
	};	
}
