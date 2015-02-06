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
		/**
		 * in which version to look
		 */
		fixedInVersionIds: [],
		/**
		 * in which projects
		 */
		projects: [1, 3],
		get url() {
			return 'http://' + this.server + ':' + this.port + '/api/' + this.apiVersion;
		},
		getValidVersions: function() {
			return $resource(
					this.url + '/dashboard/versions/valid/' + this.projects.join(),
					{},
					{'get': {method: 'GET', isArray: true}});
		},
		
		openIssuesBy: function(by) {

			if (!by)
				throw new Error('RestAPI.openIssuesBy: parameter not specified');

			return $resource(
					this.url + '/dashboard/open-issues/by/' + by + '/' + this.fixedInVersionIds.join(),
					{},
					{'get': {method: 'GET', isArray: true}});
		}
	};
}]);