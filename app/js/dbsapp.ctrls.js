'use strict';
/**
 *	DBS example app
 */

// Declare app level module which depends on filters, and services
angular.module('dbsApp.controllers', [])
.controller('MainCtrl', ['$scope', '$rootScope', '$interval', 'Editor', 'RestAPI', 'Cells', 
    function($scope, $rootScope, $interval, Editor, RestAPI, Cells) {
        $rootScope.countdown = COUNTER_INIT_VALUE;
        var versAPI;

        /**
         * TODO desc
         */
        $scope.showEditor = function(id) {
            var EditorInstance;

            if (id !== null) {
                EditorInstance = Editor.show(
                    $scope.cells.filter(function(x){ return x.uuid === id; })[0],
                    {controller:'EditorCtrl'});

                EditorInstance.result.then(function(item){
                    console.log(item);
                }, function(){
                    console.log('no result');
                });
                
            } else {

            }   

            $rootScope.editorVisible = !$rootScope.editorVisible;
        };

        /**
         * TODO description
         */
        $scope.callRest = function(obj, key) {
            /**
             * function for updating the obj
             */
            function updateCells(o, k) {
                $scope.cells[k] = o;

            }

            var resp = RestAPI[obj.method](obj.params);

            resp.get(function(s){
                obj.data = s;
                obj.response = 'ok';
                
                updateCells(obj, key);
            }, function(e){
                obj.response = 'error';
                console.log('Error:', e);
                //updateObj(obj);
            });
        };

        $scope.updateCharts = function(){
            angular.forEach(Cells, function(cell, key){

                // method prop defines 
                if (cell.method && angular.isArray(cell.params)) {
                    $scope.callRest(cell, key);
                } else {
                    $scope.cells[key] = cell;
                }
            });
        };

        // get the versions and start the queries
        versAPI = RestAPI.getValidVersions();
        versAPI.get(function(s){
            // get ids of versions
            s.forEach(function(el){
                RestAPI.fixedInVersionIds.push(el.id);
            });

            $scope.cells = Cells;
            $scope.updateCharts();

            /**
             *  countdown and reload
             */
            $interval(function(){
                if ($rootScope.countdown === 1) {
                    var val = Math.random() * 200;

                    Cells[1].data = [{value: val.toFixed(1)}];
                    $scope.cells.splice(1,1,Cells[1]);
                        
                    $rootScope.countdown = COUNTER_INIT_VALUE;
                }
                else
                    $rootScope.countdown--;
            }, 1000);

        }, function(e){
            console.log(e);
        });
}])
.controller('ViewCtrl', ['$scope', '$rootScope', '$log', 'Grid',
    function($scope, $rootScope, $log, Grid) {
		$scope.dragged = null;
        $scope.grid = Grid;

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
.controller('MenuCtrl', ['$scope', '$rootScope', '$interval', 'Grid',
    function($scope, $rootScope, $interval, Grid) {
        $scope.showDropdown = false;
        $scope.grid = Grid;
        
        $scope.selectPage = function(page) {
            $rootScope.selectedPage = page;
            $scope.showDropdown = false;
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




