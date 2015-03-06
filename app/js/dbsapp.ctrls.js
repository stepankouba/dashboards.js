'use strict';
/**
 *	DBS example app
 */

// Declare app level module which depends on filters, and services
angular.module('dbsApp.controllers', [])
.controller('MainCtrl', ['$scope', '$rootScope', '$interval', '$routeParams','Editor', 'RestAPI', 'Cells', 'Grid',
    function($scope, $rootScope, $interval, $routeParams, Editor, RestAPI, Cells, Grid) {
        $rootScope.countdown = COUNTER_INIT_VALUE;
        $rootScope.selectedPage = parseInt($routeParams.pageId);
        var versAPI, reload;

        /**
         * TODO desc
         */
        $scope.showEditor = function(id) {
            var EditorInstance;

            if (id) {
                EditorInstance = Editor.show(
                    $scope.cells.filter(function(x){ return x.uuid === id; })[0],
                    {controller:'EditorCtrl'});

                EditorInstance.result.then(function(item){
                    console.log(item);
                }, function(){
                    console.log('no result');
                });
                
            } else {
                // something
            }   

            $rootScope.editorVisible = !$rootScope.editorVisible;
        };


        // prepare cells for being displayed
        Cells.setParams({
            project: Grid[$rootScope.selectedPage].params.project,
            page: $rootScope.selectedPage
        }).then(function(cells){
            $scope.cells = cells;            

            /**
             *  countdown and reload
             */
            reload = $interval(function(){
                if ($rootScope.countdown === 1) {
                    // update
                    Cells.update()
                        .then(function(cells){
                            $scope.cells = cells;
                        });

                    $rootScope.countdown = COUNTER_INIT_VALUE;
                }
                else
                    $rootScope.countdown--;
            }, 1000);

            $scope.$on('$destroy', function(){
                $interval.cancel(reload);
                reload = undefined;
            });       
        });
}])
.controller('ViewCtrl', ['$scope', '$rootScope', '$log', 'Grid',
    function($scope, $rootScope, $log, Grid) {
		$scope.dragged = null;
        $scope.grid = Grid[$rootScope.selectedPage];

		/** TODO comment */
		$scope.dropHandler = function (source, target) {
			// TODO check for source and target properties

			// find source, set target row and cell
			angular.forEach($scope.cells, function(value, key){
				if (value.id === source.id) {
					value.row = target.row;
					value.cell = target.cell;
				} else if (value.id === target.id) {
					value.row = source.row;
					value.cell = source.cell;
				}
			});
		};

    }// controller function
])
.controller('MenuCtrl', ['$scope', '$rootScope', '$interval', '$location', '$route', 'Grid',
    function($scope, $rootScope, $interval, $location, $route, Grid) {
        $scope.showDropdown = false;
        $scope.grid = Grid;

        $scope.selectPage = function(page) {
            $rootScope.countdown = COUNTER_INIT_VALUE;
            $scope.showDropdown = false;
            $location.path('dashboard/' + page);
        }
    }
])
.controller('EditorCtrl', ['$scope', '$rootScope', '$log', 'Editor',
    function($scope, $rootScope, $log, Editor) {
        $scope.chart = {};
        $scope.template = $scope.edited.conf.type;

        // general editor values
        $scope.types = DBS.Charts.getAvailableTypes();
        console.log(DBS.Charts.getAvailableTypes());


        $scope.dismiss = function() {
            Editor.dismiss();
        }

        $scope.close = function() {
            Editor.close();
        }
    }
]);




