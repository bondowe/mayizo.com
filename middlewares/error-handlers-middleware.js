'use strict'

// catch 404 and forward to error handler
let _404_Handler = (req, res, next) => {
    res.statusCode = 404;
    return res.render('error-404', { pageTitle: 'Page introuvable' });
};
let stackTraceHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
};
let catchAllHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
};

module.exports = (isProduction) => {	
	var handlers = [];
	handlers.push(_404_Handler);
	if(!isProduction) {	
	// development error handler
	// will print stacktrace
		handlers.push(stackTraceHandler);
	}
	handlers.push(catchAllHandler);
	return handlers;
}
