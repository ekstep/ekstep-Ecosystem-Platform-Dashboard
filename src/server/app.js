var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var requestLogger = require('./lib/requestLogger');
var auth = require('./lib/auth');
var appHeaders = require('./lib/appHeaders');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require( 'express-session' );
var config = require('./config');
var passport = require('passport' );
var UniqueTokenStrategy = require('passport-unique-token').Strategy;
var SHA256 = require("crypto-js/sha256");
var request = require('request');
var url = require('url') ;
var querystring = require('querystring');

// var SECRET = '5f4dcc3b5aa765d61d8327deb882cf99';
// var COMMUNITY_PORTAL_ENDPOINT = "http://sandbox-community.ekstep.org";
// var COMMUNITY_PORTAL_SSO_REQUESTT = "/index.php?option=com_api&app=sso&resource=sso&format=raw";
// var COMMUNITY_PORTAL_LOGIN_ENDPOINT = "http://sandbox-community.ekstep.org/index.php?option=com_ekcontent&view=dashboard&layout=operational";

var SECRET = '{{ community_portal_sso_secret }}'
var COMMUNITY_PORTAL_ENDPOINT = "{{ community_portal_endpoint }}";
var COMMUNITY_PORTAL_SSO_REQUESTT = "{{ community_portal_sso_requestt }}";
var COMMUNITY_PORTAL_LOGIN_ENDPOINT = "{{ community_portal_login_endpoint }}"

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new UniqueTokenStrategy(
  function (token, done) {
    if(token){
      var sha256Token = SHA256(token, SECRET);
      return request.post(
          COMMUNITY_PORTAL_ENDPOINT + COMMUNITY_PORTAL_SSO_REQUESTT + '&hash=' + sha256Token + '&client_id:' + null,
          null,
          function (error, response, body) {
              if (!error &&
                body.responseCode === "OK" &&
                body.params.status === "successful") {
                console.log('auth successful');
                return done(null, true);
              } else {
                console.log('auth failed, response: ' + JSON.stringify(response));
                return done(null, false);
              }
          }
      );
    } else {
      console.log('No token, failing authentication');
      return done(null, false);
    }
  }
));

var routes = require('./routes/index');
var proxy = require('./routes/proxy');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('x-powered-by', false);

app.use(requestLogger());
app.use(auth());
app.use(appHeaders());
app.use(favicon(path.join(config.public_folder, 'styles', 'theme', 'elk.ico')));

if (app.get('env') === 'development') {
  require('./dev')(app);
}

// The proxy must be set up before all the other middleware.
// TODO: WE might want to move the middleware to each of the individual routes
// so we don't have weird conflicts in the future.
app.use('/elasticsearch', proxy);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(session({
  secret: 'random secret'
}));
app.use( passport.initialize());
app.use( passport.session());
app.use(ensureAuthenticated);
app.use(express.static(config.public_folder));
if (config.external_plugins_folder)
  app.use('/plugins', express.static(config.external_plugins_folder));

app.get( '/login',
  passport.authenticate( 'token', {
    successRedirect: '/',
    failureRedirect: COMMUNITY_PORTAL_LOGIN_ENDPOINT
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  //throw new Error(req.isAuthenticated());
  if (req.path === "/login" || req.path.indexOf("/auth") > -1  || req.path.indexOf('/oauth2callback') > -1 ) {
    return next();
  }
  var queryString = url.parse(req.url,true).query;
  var login_url = "/login";
  if(querystring.stringify(queryString) !== "" ||
    querystring.stringify(queryString) != undefined) {
    login_url = "/login?"+ querystring.stringify(queryString);
  }
  res.redirect(login_url);
}

module.exports = app;
