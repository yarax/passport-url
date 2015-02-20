var express = require('express');
var app = express();
var passport = require("passport");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Local = require('passport-local');


app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());


// put you storage logic here
passport.serializeUser(function(user, done) {
	console.log(arguments);
 	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	done(null, {id: "bar"});
});

// URL STRATEGY

var UrlStrategy = function (options, verify) {
	if (typeof options == 'function') {
		verify = options;
		options = {};
	}
	if (!verify) { throw new TypeError('LocalStrategy requires a verify callback'); }

	passport.Strategy.call(this);
	this.name = 'url';
	this._verify = verify;
	this._passReqToCallback = false;
	this.failRedirect = options.failRedirect;
	this.varName = options.varName;

}

UrlStrategy.prototype.authenticate = function(req, options) {
	var self = this;

	function verified(err, user, info) {
	    if (err) { return self.redirect(self.failRedirect); }
	    self.success(user, info);
	}
    
	this._verify(req.query[this.varName], verified);
};

// URL STRATEGY

var url = new UrlStrategy({
	failRedirect : "/login",
	varName : "secret"
}, function (secret, done) {
	if (secret == 'foo') done(null, {id:'bar'});
	else done("wrong");
});

passport.use(url);

app.get('/', 
  passport.authenticate('url', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/authed');
  });

app.get('/authed', function (req, res) {
	console.log("authed", req.isAuthenticated());
	res.end("AUTHED");
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});
