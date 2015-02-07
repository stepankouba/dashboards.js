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
		getValidVersions: function(project) {
			return $resource(
					this.url + '/dashboard/versions/valid/' + project,
					{},
					{'get': {method: 'GET', isArray: true}});
		},
		
		openIssuesBy: function(by, fixedInVersionIds) {

			if (!by)
				throw new Error('RestAPI.openIssuesBy: parameter not specified');

			return $resource(
					this.url + '/dashboard/issues/open/' + by + '/' + fixedInVersionIds.join(),
					{},
					{'get': {method: 'GET', isArray: true}});
		},

		openIssuesWithSeverity: function(severity, fixedInVersionIds) {

			if (!severity)
				throw new Error('RestAPI.openIssuesWithSeverity: parameter not specified');

			return $resource(
					this.url + '/dashboard/issues/open/severity/' + severity.join() + '/' + fixedInVersionIds.join(),
					{},
					{'get': {method: 'GET', isArray: true}});
		}
	};
}]);