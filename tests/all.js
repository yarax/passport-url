var Strategy = require('../strategy');
var passport = require('passport');


describe('Strategy', function() {
    
  it('should be named url', function() {
    var strategy = new Strategy(function(){});
    strategy.name.should.equal('url');
  });
  
  it('should throw if constructed without a verify callback', function() {
    (function() {
      var s = new Strategy();
    }).should.throw('UrlStrategy requires a verify callback');
  });

  it('handling with access url', function (done) {

    var strategy = new Strategy({
        failRedirect : "/login",
        varName : "secret"
    }, function(secret, next){
        secret.should.be.equal("foo");
        next();
    });

    strategy.success = done;

    strategy.authenticate({
        query : {secret: "foo"}
    });

  });

  it('handling with failure url', function (done) {

    var strategy = new Strategy({
        failRedirect : "/login",
        varName : "secret"
    }, function(secret, next){
        next(secret == 'foo' ? null : 'wrong');
    });

    strategy.redirect = function () {
        done();
    }

    strategy.authenticate({
        query : {secret: "bar"}
    });

  });
  
});