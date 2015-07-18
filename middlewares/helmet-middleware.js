'use strict'

let helmet = require('helmet');

module.exports = () => {
	return [
		helmet.csp({
		  defaultSrc: ["'self'"],
		  scriptSrc: [
		      "'self'", "'unsafe-inline'", '*.googleapis.com', '*.google-analytics.com', '*.bootstrapcdn.com', '*.maxcdn.com', 
		      'mayizocom.disqus.com', '*.disquscdn.com', '*.sweetcaptcha.com', '*.jquery.com', 'https://code.jquery.com'
		  ],
		  styleSrc: ["'self'", "'unsafe-inline'", '*.googleapis.com', '*.bootstrapcdn.com', '*.disquscdn.com'],
		  imgSrc: ["'self'", '*.youtube.com', 'sweetcaptcha.s3.amazonaws.com', 'i.ytimg.com', 'data:', '*.google-analytics.com', '*.disqus.com', 'i2.wp.com', '*.wp.com'],
		  connectSrc: ["'self'"],
		  fontSrc: ["'self'", '*.gstatic.com', '*.bootstrapcdn.com'],
		  objectSrc: ["'self'", '*.youtube.com'],
		  mediaSrc: ["'self'", '*.youtube.com'],
		  frameSrc: ["'self'", 'https://www.youtube.com', 'http://www.youtube.com', '*.youtube.com', 'disqus.com']
		}),
		helmet.xssFilter(),
		helmet.xframe(),
		helmet.hidePoweredBy({ setTo: 'Electricity' })
	];
}
