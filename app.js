/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    News = require('./routes/movie'),
    http = require('http'),
    path = require('path'),
    swig = require('swig'),
    SessionStore = require("session-mongoose")(express);

var store = new SessionStore({
    url: "mongodb://localhost/BnjlbDb",
    interval: 120000 // expiration check worker run interval in millisec (default: 60000)
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

//todo:if cache html
app.set('view cache',false);

////todo:¼ÌÐø×ö
////set swig config
//swig.setDefaults({
//    // To disable Swig's cache, do the following:
//    cache: false,
//    //ÐÞ¸Ä×óÓÒ±ß½ç·ûºÅ
//    tagControls: ['{{', '}}'],
//    varControls: ['{{=', '}}'],
//    locals: {
//        config: appConfig
//    }
//});
//
////set customFilters to swig
//bindCustomFilter.bind(swig);
//
////set customTags to swig
//bindCustomTag.bind(swig);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'www.bnjlb.com'}));
app.use(express.session({
    secret: 'www.bnjlb.com',
    store: store,
    cookie: {maxAge: 900000} // expire session in 15 min or 900 seconds
}));
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//basic
app.get('/', routes.index);

//app.all('/login', notAuthentication);
//app.get('/login', routes.login);
//app.post('/login', routes.doLogin);
//
//app.get('/logout', authentication);
//app.get('/logout', routes.logout);
//
//app.get('/home', authentication);
//app.get('/home', routes.home);


//mongo
app.get('/news/add', News.movieAdd);
app.post('/news/add', News.doMovieAdd);
app.get('/news/:name', News.movieAdd);
app.get('/news/json/:name', News.movieJSON);


app.get('/news', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


function authentication(req, res, next) {
    if (!req.session.user) {
        req.session.error = 'ÇëÏÈµÇÂ½';
        return res.redirect('/login');
    }
    next();
}

function notAuthentication(req, res, next) {
    if (req.session.user) {
        req.session.error = 'ÒÑµÇÂ½';
        return res.redirect('/');
    }
    next();
}