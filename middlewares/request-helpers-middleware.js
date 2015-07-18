'use strict'
let path = require('path');

module.exports = () => {
	return (req, res, next) => {
	    res.cacheFor = (seconds) => {
			let app = res.app;
	        if (app.get('env') === 'production') {
	            res.set('Cache-Control', 'public, max-age=' + seconds);
	            // res.set('Vary', 'Accept-Encoding');
	        }
	    };
	    res.view = (suffix) =>  {
	        let view = (req.baseUrl + req.path).substring(1);
	        if (suffix) {
	            view = path.join(view, suffix);
	        }
	        return view;
	    };
		return next();	
	};	
}
