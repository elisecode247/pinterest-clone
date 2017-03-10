'use strict';

var express = require('express');
var routes = require('./routes.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var path = require('path');
var port = process.env.PORT || 8080;
var fs = require('fs');
var app = express();

if (fs.existsSync('.env')){ // for development only
	require('dotenv').load();
}
require('./authentication/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/views', express.static(process.cwd() + '/views'));
app.use('/controllers', express.static(process.cwd() + '/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));

app.use(session({
	secret: 'secretPinterest',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');


routes(app, passport);


app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});