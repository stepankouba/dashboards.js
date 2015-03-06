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
		},

		avgIssueChangedToStatus: function(status, projects) {
			return $resource(
					this.url + '/dashboard/issues/avarage/' + status + '/' + projects.join(),
					{},
					{'get': {method: 'GET', isArray: true}});
		},

		mdsToDoAverageForVersion: function(fixedInVersionIds) {
			return $resource(
					this.url + '/dashboard/mds/perday/' + fixedInVersionIds.join(),
					{},
					{'get': {method: 'GET', isArray: true}});	
		},

		mdsToDoForVersion: function(fixedInVersionIds) {
			return $resource(
					this.url + '/dashboard/mds/todo/' + fixedInVersionIds.join(),
					{},
					{'get': {method: 'GET', isArray: true}});	
		},
		mdsFromStart: function(projects) {
			return $resource(
					this.url + '/dashboard/mds/from/start/' + projects.join(),
					{},
					{'get': {method: 'GET', isArray: true}});	
		},
		mdsFromLastWeek: function(projects) {
			return $resource(
					this.url + '/dashboard/mds/from/lastweek/' + projects.join(),
					{},
					{'get': {method: 'GET', isArray: true}});	
		},
		mdsFivedaysActive: function(projects) {
			return $resource(
					this.url + '/dashboard/mds/fivedays/' + projects.join(),
					{},
					{'get': {method: 'GET', isArray: true}});	
		}
	};
}]);