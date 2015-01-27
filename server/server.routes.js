/**
 * @file Server routes definition
 * portion of this code is inspired by http://www.frederiknakstad.com/authentication-in-single-page-applications-with-angular-js/
 * Copyright (c) 2013 Frederik Nakstad
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
var _ = require('underscore');
    conf = require('./server.conf.js'),
    api = require('./server.api.js');
 
var routes = [
    {
        path: '/api/' + conf.apiVersion + '/dashboard/open-issues/by/tracker',
        httpMethod: 'GET',
        middleware: [api.openIssuesByTracker]
    },
    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/app/*',
        httpMethod: 'GET',
        middleware: [function(req, res, next) {
            console.log('static');
            //res.render('../app/index.html');
            next();
        }]
    }
];

module.exports = {
    createRoutes: function apiCreateRoutes(app){
        _.each(routes, function(route) {
            
            var args = _.flatten([route.path, route.middleware]),
                method = route.httpMethod.toUpperCase();

            if (method == 'GET')
                app.get.apply(app, args);
            else if (method == 'POST')
                app.post.apply(app, args);
            else if (method == 'PUT')
                app.put.apply(app, args);
            else if (method == 'DELETE')
                app.delete.apply(app, args);
            else
                throw new Error('Invalid HTTP method specified for route ' + route.path);
        });
    }
};