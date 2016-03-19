var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsmate = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');


/*var http = require('http');*/
/*
var io = require('socket.io');

*/



var secret = require('./config/secret');
var User = require('./models/user');
var Category = require('./models/category');

var app = express();

/*
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'));
var io = require('socket.io').listen(app.listen(secret.port));*/



mongoose.connect(secret.database, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database");
    }
});

//Middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({
        url: secret.database,
        autoReconnect: true
    })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//make the user available on all pages
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use(function (req, res, next) {
    Category.find({},

        function (err, categories) {
            if (err) return next(err);
            res.locals.categories = categories;
            next();
        });

});

/*
SOCKET IO CHAT*/

/*app.get('/', function(req, res){
  res.sendFile(__dirname + '/chat');
});*/
/*app.get('/', function (req, res) {
    res.sendfile('/chat');
});*/
/*io.on('connection', function (socket) {
    console.log('a user connected');
});*/

/*New Route for socket*/
app.use(express.static(__dirname + '/public'));


/*Template engine*/
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./api/api');

app.use(mainRoutes);
/*Can also do it this way, where hello is the parent, and mainRoutes are the child, 
For example, /hello/about */
/*app.use('/hello', mainRoutes);*/
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);


/*
app.get('/', function (req, res) {
    var name = "Eileen";
    res.json("My name is " + name);
});

app.get('/shop', function (req, res) {
    res.json("Welcome to my shop");
});
*/

/*app.post()
app.put()
app.delete()*/

app.listen(secret.port, function (err) {
    if (err) throw err;
    console.log("Server is Running on Port " + secret.port);
});