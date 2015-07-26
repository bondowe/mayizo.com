'use strict'
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon'); 
let util = require('util');
let compression = require('compression');
let connectMongo = require('connect-mongo');
let bodyParser = require('body-parser');
let wwwRedirect = require("./middlewares/www-redirect-middleware")
let session = require("./middlewares/session-middleware")
let sass = require('./middlewares/sass-middleware');
let helmet = require("./middlewares/helmet-middleware")
let passwordless = require('passwordless');
let passwordlessHelper = require('./util/passwordless-helper');
let appLocalsHelper = require('./util/appLocalsHelper');
let requestHelpers = require('./middlewares/request-helpers-middleware');
let requestLocals = require("./middlewares/request-locals-middleware")
let errorHandlers = require("./middlewares/error-handlers-middleware")
let requestLogger = require('morgan');
let config = require('./config');
let mongoose = require('mongoose');
let csrf = require('csurf');
let dateUtils = require('date-utils');
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
    app.get('*', wwwRedirect());
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

appLocalsHelper.init(app);
passwordlessHelper.init(app);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 180 }));
app.use(requestLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(session(db));
app.use(passwordless.sessionSupport());
app.use(csrf());
app.use(sass());
app.use(requestHelpers());
app.use(requestLocals());
app.use('/', routes);
app.use('/account', account);
app.use('/admin', passwordless.restricted({ failureRedirect: '/account/login', originField: 'returnUrl'}), admin);
app.use(errorHandlers(isProduction));

module.exports = app;

