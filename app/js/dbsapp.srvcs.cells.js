'use strict';
/**
 *	DBS example app
 */

// Declare app level module which depends on filters, and services
angular.module('dbsApp.services.cells', [])
.factory('Grid', [function(){
	return [
                {
                    page: 1,
                    pageTitle: 'Quality product dashboard',
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
            ];
}])
.factory('Cells', [function(){
	return [
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
                    title: 'Issues per status and tracker for project',
                    on: {
                        click: function(d, params){
                        	return RedmineURL.getURL('trackersPerStatus',[d.trackerId, d.statusId].concat(params));
                        }
                    }                    
                },
                data: [],
                method: 'openIssuesBy',
                params: ['tracker'],
                response: null

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
                data: [{value: 76.8}],
                response: 'ok'
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
                data: [{value: Math.random()}],
                response: 'ok'
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
                    title: 'bugs distributions per assignee',
                    on: {
                        click: function(d, params){
                        	return RedmineURL.getURL('bugsPerAssignee',[d.data.id].concat(	params));
                        }
                    }
                },
                // data: [{value: 20, title: 'Lukas'},
                //     {value: 35, title: 'Stepan'},],
                // response: 'ok'
                data:[],
                method: 'openIssuesBy',
                params: ['assignee'],
                response: null
            }
        ];
}]);
