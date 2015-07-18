'use strict'

module.exports = () => {
	return (req, res, next) => {
        if (req.headers.host.match(/^www/) == null) {
            return res.redirect(req.protocol + '://www.' + req.headers.host + req.url, 301);
        }
		return next();	
	};	
}
