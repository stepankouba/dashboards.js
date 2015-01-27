'use strict';
/**
 *	DBS example app
 */

// Declare app level module which depends on filters, and services
angular.module('dbsApp.services.rest', ['ngResource']).
factory('RestAPI', ['$rootScope', '$resource', function($rootScope, $resource){
	return {
		server: 'localhost',
		port: '8080',
		apiVersion: '0.1.0',
		get url() {
			return 'http://' + this.server + ':' + this.port + '/api/' + this.apiVersion;
		},
		
		openIssuesBy: function(by) {
			return $resource(
					this.url + '/dashboard/open-issues/by/tracker',
					{},
					{'get': {method: 'GET', isArray: true}});
		}
	};
}]);