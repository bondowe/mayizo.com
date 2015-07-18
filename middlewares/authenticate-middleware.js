'use strict'

module.exports = () => {
	return (req, res, next) => {
	    if (! req.session.user) {
	        return res.redirect('/account/login?returnUrl=' + req.originalUrl);
	    }
	    next();	
	};	
}
