'use strict';
/**
 *	DBS example app
 */

// Declare app level module which depends on filters, and services
angular.module('dbsApp.controllers', []).
controller('MainCtrl', ['$scope', '$rootScope', 'Editor', 'RestAPI',
    function($scope, $rootScope, Editor, RestAPI) {
        var grid = [
                {
                    page: 1,
                    pageTitle: 'Effort dashboard',
                    visible: true,
                    gridRows: [
                        {row: 1, cells: 1},
                        {row: 2, cells: 3}
                    ] 
                },
                {
                    page: 2,
                    pageTitle: 'MD dashboard',
                    visible: true,
                    gridRows: [
                        {row: 1, cells: 1}
                    ] 
                }
            ],
            cells = [
            {
                uuid: DBS.Utils.uuid(),
                id: 1,
                cell: 1,
                row: 1,
                page: 1,
                conf: {
                    type: 'stackedbar',
                    width: 600,
                    height: 380,
                    xProp: 'status',
                    groupBy: 'tracker',
                    title: 'MDs per user in this week'
                },
                data: [
                    {value: 20, user: 'karel', activity: 'PM'},
                    {value: 50, user: 'pepa', activity: 'PM'},
                    {value: 100, user: 'honza', activity: 'PM'},
                    {value: 40, user: 'karel', activity: 'test'},
                    {value: 80, user: 'pepa', activity: 'test'},
                    {value: 5, user: 'karel', activity: 'analysis'},
                    {value: 80, user: 'pepa', activity: 'analysis'},
                    {value: 5, user: 'honza', activity: 'analysis'},
                    {value: 80, user: 'honza', activity: 'test'},
                    {value: 40, user: 'karel', activity: 'Devel'},
                    {value: 80, user: 'pepa', activity: 'Devel'},
                    {value: 5, user: 'honza', activity: 'Devel'}
                ],
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 3,
                cell: 1,
                row: 2,
                page: 1,
                conf: {
                    type: 'number',
                    title: 'MDs spent in this week'
                },
                data: [{value: 76.8}]
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 4,
                cell: 2,
                row: 2,
                page: 1,
                conf: {
                    type: 'gauge',
                    title: '% of open bugs / features',
                    width: 300,
                    height: 180,
                    thresholds: [
                        {className: 'green', minVal: 0, maxVal: .25},
                        {className: 'orange', minVal: .25, maxVal: .7},
                        {className: 'red', minVal: .7, maxVal: 1},
                    ]
                },
                data: [Math.random()]
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 5,
                cell: 3,
                row: 2,
                page: 1,
                conf: {
                    type: 'pie',
                    width: 300,
                    height: 180,
                    title: 'bugs distributions per assignee'
                },
                data: [
                    {value: 15, text: 'Jan Jeřábek'},
                    {value: 75, text: 'Štěpán Kouba'},
                    {value: 5, text: 'Petr Mahdalíček'},
                    {value: 77, text: 'Lukáš Kosina'},
                    {value: 22, text: 'Ladislav Kaiser'}
                ]
            }
        ];

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

        var r = RestAPI.openIssuesBy();
        r.get(function(s){
            var a = [];
            s.forEach(function(v, k){
                a.push({value: v.value, status: v.status, tracker: v.tracker});
            });

            //console.log('data', cells[0].data);
            //console.log('rest', a[0]);

            cells[0].data = a;

            $scope.cells = cells;
            $scope.grid = grid;
        }, function(e){
            console.log(e);
        });
}]).
controller('ViewCtrl', ['$scope', '$rootScope', '$log',
    function($scope, $rootScope, $log) {
		$scope.dragged = null;

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
]).
controller('MenuCtrl', ['$scope', '$rootScope', '$log',
    function($scope, $rootScope, $log) {
        $scope.showDropdown = false;

        $scope.selectPage = function(page) {
            $rootScope.selectedPage = page;
            $scope.showDropdown = false;
        }
    }
]).

controller('EditorCtrl', ['$scope', '$rootScope', '$log', 'Editor',
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




