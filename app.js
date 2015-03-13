var express = require('express');
var path = require('path');
var favicon = require('serve-favicon'); 
var util = require('util');
var session = require('express-session');
var connectMongo = require('connect-mongo');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var helmet = require('helmet');
var requestLogger = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var marked= require('marked');
var dateUtils = require('date-utils');

var debuglog = util.debuglog('mayizo:app');

var routes = require('./routes/index');
var account = require('./routes/account');
var admin = require('./routes/admin');

mongoose.connect(config.db.uri, config.db.options);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  util.log('Mongo database connection opened: ' + config.db.uri);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.markdown= marked;

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(requestLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.csp({
  defaultSrc: ["'self'"],
  scriptSrc: [
      "'self'", "'unsafe-inline'", '*.googleapis.com', '*.bootstrapcdn.com', '*.maxcdn.com', 
      'mayizocom.disqus.com', '*.disquscdn.com', '*.jquery.com', '*.sweetcaptcha.com'
  ],
  styleSrc: ["'self'", "'unsafe-inline'", '*.googleapis.com', '*.bootstrapcdn.com'],
  imgSrc: ["'self'", '*.youtube.com', 'sweetcaptcha.s3.amazonaws.com'],
  connectSrc: ["'self'"],
  fontSrc: ["'self'", '*.gstatic.com', '*.bootstrapcdn.com'],
  objectSrc: ["'self'", '*.youtube.com'],
  mediaSrc: ["'self'", '*.youtube.com'],
  frameSrc: ['*.youtube.com', 'disqus.com']
}));
app.use(helmet.xssFilter());
app.use(helmet.xframe());
app.use(helmet.hidePoweredBy({ setTo: 'Electricity' }));
var MongoStore = connectMongo(session);
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
app.use(
  sassMiddleware({
    src: path.join(__dirname, '/sass'),
    dest: path.join(__dirname, '/public/stylesheets'),
    prefix:  '/stylesheets',
    debug: true,
  })
);
app.use(function (req, res, next) {
    if (req.session.user) {
        res.locals.isAuthenticated = true;
        res.locals.user = req.session.user;
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/account', account);
app.use('/admin', mustAuthenticate, admin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
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

