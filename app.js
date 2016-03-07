var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');

var path = require('path');
var port = process.env.PORT || 80;

var mongoose = require('mongoose');
var Category = require('./models/category');
mongoose.connect('mongodb://localhost/blogs');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'study',
    store: new mongoStore({
        url: 'mongodb://localhost/blogs',
        collection: 'sessions'
    })
}));

app.listen(port);
app.locals.moment = require('moment');
app.locals.pretty = true;
console.log(port + " is running...");

app.use(function (req, res, next) {
    var _account = req.session.account;
    app.locals.account = _account;
    next();
});

app.get('/', function (req, res) {
    // 取4个栏目，且栏目中博客数量>=4的
    Category
        .find({
            'blogs.0': {
                $exists: true
            }
        })
        .limit(4)
        .populate({
            path: 'blogs',
            options: {
                limit: 4
            }
        })
        .exec(function (err, cates) {
            res.render('index', {
                title: 'index',
                categories: cates
            });
        })
});

require('./config/route')(app);