'use strict';
/**
 *	DBS example app
 */

// Declare app level module which depends on filters, and services
angular.module('dbsApp.directives.chart', ['dbsApp.directives']).

directive('dbsappChart', ['$log', function($log) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div><div class="dbsapp-chart-settings"><span ng-click="settingsClick()" class="fa fa-cog"></span></div></div>',
		scope: {
			data: '=',
			conf: '=',
			dbsappId: '@',
			load: '@',
			settingsClick: '&'
		},
		// TODO comment
		link: function($scope, elem, attr) {
			var w = $scope.conf.width,
				h = $scope.conf.height;

			elem.attr('id', 'container-for-' + $scope.dbsappId);
			elem.find('div').attr('id', $scope.dbsappId);

			// load chart
			$scope.chart = DBS.create({
				id: $scope.dbsappId,
				width: w,
				height: h
			},{
				type: $scope.conf.type,
				title: $scope.conf.title,
				data: $scope.data,
				thresholds: $scope.conf.thresholds,
				xProp: $scope.conf.xProp,
				groupBy: $scope.conf.groupBy,
			});

			if ($scope.load === 'true')
				$scope.chart.load();



			// show editor on click
			/*elem.find('span').bind('click', function(e){
				angular.element(document.querySelectorAll('.dbsapp-chart-editor')[0]).toggleClass('dbsapp-visible');
				angular.element(document.querySelectorAll('.dbsapp-chart-editor-replace')[0]).toggleClass('dbsapp-visible');
			});*/
		},
		// TODO comment
		controller: function($scope) {
			
		}
	}
}]);