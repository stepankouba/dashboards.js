/**
 * @file Server routes definition
 * portion of this code is inspired by http://www.frederiknakstad.com/authentication-in-single-page-applications-with-angular-js/
 * Copyright (c) 2013 Frederik Nakstad
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
module.exports = {
    // default values
    port: 8080,
    db: {
        host: '192.168.10.54',
        user: 'search',
        password: '-123search',
        database: 'redmine'
    },
    apiVersion: '0.1.0',
    commandLine: function() {
    	// check for cl parameters
    	if (process.argv.length > 2) {
    	    if (process.argv.length === 4) {
    	    	this.port = process.argv[2];
    	        this.db = process.argv[3]
    	    }// if
    	}// if
    },// commandLine
    getURL: function() {
    	return 'http://' + this.server + ':' + this.port + '/api/' + this.apiVersion + '/';
    }// getURL
};