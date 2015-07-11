"use strict";
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon'); 
let util = require('util');
let compression = require('compression');
let session = require('express-session');
let connectMongo = require('connect-mongo');
let bodyParser = require('body-parser');
let sassMiddleware = require('node-sass-middleware');
let helmet = require('helmet');
let requestLogger = require('morgan');
let config = require('./config');
let mongoose = require('mongoose');
let markdown= require('./util/markdown');
let csrf = require('csurf');
let dateUtils = require('date-utils');

let debuglog = util.debuglog('mayizo:app');

let routes = require('./routes/index');
let account = require('./routes/account');
let admin = require('./routes/admin');

mongoose.connect(config.db.uri, config.db.options);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback) => {
  util.log('Mongo database connection opened: ' + config.db.uri);
});
let app = express();
let isProduction = ((app.get('env') === 'production'));
if (isProduction) {
    app.enable('trust proxy');
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (isProduction) {
    // non-www to www redirect
    app.get('/*', function(req, res, next) {
        if (req.headers.host.match(/^www/) == null) {
            res.redirect('http://www.' + req.headers.host + req.url, 301);
        } else {
            next();
        }
    });
}
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(compression());
app.use(requestLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.csp({
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
}));
app.use(helmet.xssFilter());
app.use(helmet.xframe());
app.use(helmet.hidePoweredBy({ setTo: 'Electricity' }));
let MongoStore = connectMongo(session);
app.use(session({
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
}));
app.use(csrf());
app.use(
  sassMiddleware({
    src: path.join(__dirname, '/sass'),
    dest: path.join(__dirname, '/public/stylesheets'),
    prefix:  '/stylesheets',
    debug: false,
  })
);
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.isAuthenticated = true;
        res.locals.user = req.session.user;
    }
    res.cacheFor = (seconds) => {
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
    res.locals.markdown = markdown;
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 180 }));
app.use('/', routes);
app.use('/account', account);
app.use('/admin', mustAuthenticate, admin);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function mustAuthenticate(req, res, next) {
    if (! req.session.user) {
        return res.redirect('/account/login?returnUrl=' + req.originalUrl);
    }
    next();
}

module.exports = app;

