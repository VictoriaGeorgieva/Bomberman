/**
 * Created by Victoria on 1/31/2016.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/TestBomberman');

var routes = require('./routes/index');
var user = require('./routes/user');
var chat = require('./routes/chat');
var game = require('./routes/game');
var statistics = require('./routes/statistics');

var app = new express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/user', user);
app.use('/chat', chat);
app.use('/game', game);
app.use('/statistics', statistics);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;