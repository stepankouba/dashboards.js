/**
 * @file Server routes definition
 * portion of this code is inspired by http://www.frederiknakstad.com/authentication-in-single-page-applications-with-angular-js/
 * Copyright (c) 2013 Frederik Nakstad
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */

// load NodeJS modules
var express = require('express'),
	mysql = require('mysql'),
	conf = require('./server/server.conf.js'),
	router = require('./server/server.routes.js'),
	server = express();

// sets
//server.set('views', '../app');
//console.log('dirname',__dirname + '/../app');
server.use('/app', express.static(__dirname + '/app'));
server.use('/src', express.static(__dirname + '/src'));
server.use('/bower_components', express.static(__dirname + '/bower_components'));

server.use('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

server.use(function(err, req, res, next){
	console.log('Error is here: ', err.stack);
});

// use body parser
//server.use(express.bodyParser());
//server.use(express.methodOverride());
// use gzip compression
//server.use(express.compress());
//server.use(express.static(__dirname + '/app', {maxAge: c.cache}));

// handle commandline arguments
conf.commandLine();

// create routes
router.createRoutes(server);

server.listen(conf.port);

console.log('server.js: Server started');