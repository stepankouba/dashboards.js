'use strict';
/**
 *	DBS example app
 */

// Declare app level module which depends on filters, and services
angular.module('dbsApp', [
    'ngRoute',
    'dbsApp.services', // services
    'dbsApp.services.rest',
    'dbsApp.services.cells',
    'dbsApp.services.local',
    'dbsApp.services.editor',
    'dbsApp.controllers', // controlers
    'dbsApp.directives', 
    'dbsApp.directives.chart'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard/:pageId', {templateUrl: 'partials/dbsapp.main.html', controller: 'MainCtrl'});
    $routeProvider.otherwise({redirectTo: '/dashboard/0'});
}])
.run(['$rootScope', 'RestAPI', function($rootScope, RestAPI){

    // setting rootScope variables in the name of simplicity (might use Services instead in future)
	$rootScope.editorVisible = false;
    //$rootScope.selectedPage = 0;
}]);