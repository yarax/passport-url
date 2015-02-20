# passport-url

Url strategy for passport. Allow to authenticate user by some hash string giving by GET query.

## Install

```
npm install passport-url
```

## Usage

#### Configure Strategy

```
var url = new UrlStrategy({
    failRedirect : "/login",
    varName : "secret"
}, function (secret, done) { // put your check logic here
    if (secret == 'foo') done(null, {id:'bar'});
    else done("wrong");
});

passport.use(url);
```

varName is a argument in your query e.g http://example.com/?secret=foo


failRedirect url for redirecting, when your verify function return callback with error

For full example please see [https://github.com/yarax/passport-url/blob/master/example.js]

#### Tests
```
npm test
```