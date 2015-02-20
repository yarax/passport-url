var express = require('express');
var app = express();
var passport = require("passport");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var UrlStrategy = require('./strategy');

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());


// put you storage logic here
passport.serializeUser(function(user, done) {
 	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	done(null, {id: "bar"});
});

var url = new UrlStrategy({
	failRedirect : "/login",
	varName : "secret"
}, function (secret, done) { // put your check logic here
	if (secret == 'foo') done(null, {id:'bar'});
	else done("wrong");
});

passport.use(url);

app.get('/', 
  passport.authenticate('url'),
  function(req, res) {
    res.redirect('/authed');
  });

app.get('/authed', function (req, res) {
	if (req.isAuthenticated()) {
        res.end("Authed");
    } else {
        res.redirect("/login");
    }
});

app.get('/login', function (req, res) {
    res.set('Content-Type', 'text/html');
    res.end("Access link <a href='/?secret=foo'>/?secret=foo</a><br/>Failure link <a href='/?secret=bar'>/?secret=bar</a><br/>");
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s/login', host, port)

});
