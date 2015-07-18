'use strict'
let markdown= require('../util/markdown');

module.exports = () => {
	return (req, res, next) => {
		res.locals.markdown = markdown;
	    if (req.session.user) {
	        res.locals.isAuthenticated = true;
	        res.locals.user = req.session.user;
	    }
		return next();	
	};	
}
