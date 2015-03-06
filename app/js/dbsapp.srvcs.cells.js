'use strict';
/**
 *	DBS example app
 */

// Declare app level module which depends on filters, and services
angular.module('dbsApp.services.cells', [])
.factory('Grid', [function(){
	return [
                {
                    page: 0,
                    pageTitle: 'Quality',
                    visible: true,
                    gridRows: [
                        {row: 1, cells: 1},
                        {row: 2, cells: 4}
                    ],
                    params: {
                        project: 1
                    }
                },
                {
                    page: 1,
                    pageTitle: 'Glossary',
                    visible: true,
                    gridRows: [
                        {row: 1, cells: 1},
                        {row: 2, cells: 4}
                    ],
                    params: {
                        project: 2
                    }
                },
                {
                    page: 2,
                    pageTitle: 'Common framework',
                    visible: true,
                    gridRows: [
                        {row: 1, cells: 1},
                        {row: 2, cells: 4}
                    ],
                    params: {
                        project: 3
                    }
                },
                {
                    page: 3,
                    pageTitle: 'Timesheets',
                    visible: true,
                    gridRows: [
                        {row: 1, cells: 1},
                        {row: 2, cells: 3}
                    ],
                    params: {
                        project: [1,2,3]
                    }
                }
            ];
}])
.factory('Cells', ['RestAPI', '$q', function(RestAPI, $q){
	var Cells = {};

    Cells._params = {};
    Cells._defer = undefined;

    /**
     * TODO description
     */
    Cells._callRest = function(obj, key) {
        var def = $q.defer(),
            self = this,
            fixedInVersions = [];
        
        // automatically add fixed in version parameters if required
        obj.fixedInProjectVersions.forEach(function(el,key){
            fixedInVersions.push(self._params.fixedInVersionIds[el]);
        });
        obj.params = fixedInVersions.length > 0 ?
                 obj.params.concat([fixedInVersions]) : obj.params;

        /**
         * function for updating the obj
         * automatically add fixedInVersionIds in the call
         */
        var resp = RestAPI[obj.method].apply(RestAPI, obj.params);

        resp.get(function(s){
            obj.data = s;
            obj.response = 'ok';
            
            self.data[obj.id] = obj;
            return def.resolve(true);
        }, function(e){
            obj.response = 'error';
            console.log('Error:', e);

            this.data[obj.id] = obj;
            return def.reject(e);
        });

        return def.promise;
    };

    /**
     * private update cells
     */
    Cells._update = function() {
        var promises = [],
            self = this;

        angular.forEach(this.getData(), function(cell, key){
            // method prop defines 
            if (cell.method !== undefined)
                promises.push(self._callRest(cell, key));
        });

        $q.all(promises)
            .then(function(){
                return self._defer.resolve(self.getData());
            }, function(e){
                console.log(e);
            });
    };

    /**
     * update Cells
     */
    Cells.update = function() {
        this._defer = $q.defer();

        this._update();

        return this._defer.promise;
    };

    /**
     *  grid params as param
     */
    Cells.setParams = function(params) {
        var versAPI,
            self = this;
        
        this._defer = $q.defer();

        // structure of this is {project_id:}
        this._params.fixedInVersionIds = {};
        this._params.project = params.project;
        this._params.page = params.page;
        
        // get the version based on the selected grid
        versAPI = RestAPI.getValidVersions(this._params.project);

        versAPI.get(function(s){
            // get ids of versions
            s.forEach(function(el){
                self._params.fixedInVersionIds[el.project_id] = el.id;
            });

            self._update();
        }, function(e){
            console.log(e);
            self._defer.reject(e);
        });

        return this._defer.promise;

    };

    /**
     * TODO
     */
    Cells.getData = function() {
        var self = this;

        if (this._params.page === undefined)
            throw new Error('DBS.APP.Cells.getData: selected page not set');

        return this.data.filter(function(el){return el.page === self._params.page});
    }; 

    Cells.data = [
            // QUALITY DBS
            {
                uuid: DBS.Utils.uuid(),
                id: 0,
                cell: 1,
                row: 1,
                page: 0,
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
                    },
                    params: function() { return [Cells._params.fixedInVersionIds['1']]; }
                },
                data: [],
                method: 'openIssuesBy',
                params: ['tracker'],
                fixedInProjectVersions: ['1'],
                response: null

            },
            {
                uuid: DBS.Utils.uuid(),
                id: 1,
                cell: 1,
                row: 2,
                page: 0,
                conf: {
                    type: 'number',
                    title: 'Σ of Critical and Major issues',
                    on: {
                        click: function(d, params) {
                            return RedmineURL.getURL('issuesBySeverity', params);
                        }
                    },
                    params: function() { return [Cells._params.fixedInVersionIds['1']]; }
                },
                data: [],
                method: 'openIssuesWithSeverity',
                params: [[4,3]], // id of critical and major severities
                fixedInProjectVersions: ['1'],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 2,
                cell: 2,
                row: 2,
                page: 0,
                conf: {
                    type: 'number',
                    title: 'required average FTE till the end'
                    // width: 300,
                    // height: 180,
                    // thresholds: [
                    //     {className: 'green', minVal: 0, maxVal: 1.5},
                    //     {className: 'orange', minVal: 1.5, maxVal: 1.8},
                    //     {className: 'red', minVal: 1.8, maxVal: 4},
                    // ]
                },
                data: [],
                method: 'mdsToDoAverageForVersion',
                params: [],
                fixedInProjectVersions: ['1'],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 3,
                cell: 3,
                row: 2,
                page: 0,
                conf: {
                    type: 'pie',
                    width: 300,
                    height: 180,
                    radius: 80,
                    title: 'bugs distributions per assignee',
                    on: {
                        click: function(d, params){
                        	return RedmineURL.getURL('bugsPerAssignee',[d.data.id].concat(params));
                        }
                    },
                    params: function() { return [Cells._params.fixedInVersionIds['1']]; } 
                },
                // data: [{value: 20, title: 'Lukas'},
                //     {value: 35, title: 'Stepan'},],
                // response: 'ok'
                data:[],
                method: 'openIssuesBy',
                params: ['assignee'],
                fixedInProjectVersions: ['1'],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 4,
                cell: 4,
                row: 2,
                page: 0,
                conf: {
                    type: 'number',
                    title: 'MDs till the end',
                },
                data: [],
                method: 'mdsToDoForVersion',
                params: [],
                fixedInProjectVersions: ['1'],
                response: null
            },
            // ************************
            // GLOSSARY DBS
            // ************************
            {
                uuid: DBS.Utils.uuid(),
                id: 5,
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
                    },
                    params: function() { return [Cells._params.fixedInVersionIds['2']]; }                    
                },
                data: [],
                method: 'openIssuesBy',
                params: ['tracker'],
                fixedInProjectVersions: ['2'],
                response: null

            },
            {
                uuid: DBS.Utils.uuid(),
                id: 6,
                cell: 1,
                row: 2,
                page: 1,
                conf: {
                    type: 'number',
                    title: 'Σ of Critical and Major issues',
                    on: {
                        click: function(d, params) {
                            return RedmineURL.getURL('issuesBySeverity', params);
                        }
                    },
                    params: function() { return [Cells._params.fixedInVersionIds['2']]; }
                },
                data: [],
                method: 'openIssuesWithSeverity',
                params: [[4,3]], // id of critical and major severities
                fixedInProjectVersions: ['2'],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 7,
                cell: 2,
                row: 2,
                page: 1,
                conf: {
                    type: 'number',
                    title: 'required average FTE till the end'
                    // width: 300,
                    // height: 180,
                    // thresholds: [
                    //     {className: 'green', minVal: 0, maxVal: 1.5},
                    //     {className: 'orange', minVal: 1.5, maxVal: 1.8},
                    //     {className: 'red', minVal: 1.8, maxVal: 4},
                    // ]
                },
                data: [],
                method: 'mdsToDoAverageForVersion',
                params: [],
                fixedInProjectVersions: ['2'],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 8,
                cell: 3,
                row: 2,
                page: 1,
                conf: {
                    type: 'pie',
                    width: 300,
                    height: 180,
                    radius: 80,
                    title: 'bugs distributions per assignee',
                    on: {
                        click: function(d, params){
                            return RedmineURL.getURL('bugsPerAssignee',[d.data.id].concat(  params));
                        }
                    },
                    params: function() { [Cells._params.fixedInVersionIds['2']]; } 
                },
                // data: [{value: 20, title: 'Lukas'},
                //     {value: 35, title: 'Stepan'},],
                // response: 'ok'
                data:[],
                method: 'openIssuesBy',
                params: ['assignee'],
                fixedInProjectVersions: ['2'],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 9,
                cell: 4,
                row: 2,
                page: 1,
                conf: {
                    type: 'number',
                    title: 'MDs till the end'
                },
                data: [],
                method: 'mdsToDoForVersion',
                params: [],
                fixedInProjectVersions: ['2'],
                response: null
            },
            // ************************
            // COMMON FRAMEWORK DBS
            // ************************
            {
                uuid: DBS.Utils.uuid(),
                id: 10,
                cell: 1,
                row: 1,
                page: 2,
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
                    },
                    params: function() { return [Cells._params.fixedInVersionIds['3']]; }         
                },
                data: [],
                method: 'openIssuesBy',
                params: ['tracker'],
                fixedInProjectVersions: ['3'],
                response: null

            },
            {
                uuid: DBS.Utils.uuid(),
                id: 11,
                cell: 1,
                row: 2,
                page: 2,
                conf: {
                    type: 'number',
                    title: 'Σ of Critical and Major issues',
                    on: {
                        click: function(d, params) {
                            return RedmineURL.getURL('issuesBySeverity', params);
                        }
                    },
                    params: function() { return [Cells._params.fixedInVersionIds['3']]; } 
                },
                data: [],
                method: 'openIssuesWithSeverity',
                params: [[4,3]], // id of critical and major severities
                fixedInProjectVersions: ['3'],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 12,
                cell: 2,
                row: 2,
                page: 2,
                conf: {
                    type: 'number',
                    title: 'required average FTE till the end'
                    // width: 300,
                    // height: 180,
                    // thresholds: [
                    //     {className: 'green', minVal: 0, maxVal: 1.5},
                    //     {className: 'orange', minVal: 1.5, maxVal: 1.8},
                    //     {className: 'red', minVal: 1.8, maxVal: 4},
                    // ]
                },
                data: [],
                method: 'mdsToDoAverageForVersion',
                params: [],
                fixedInProjectVersions: ['3'],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 13,
                cell: 3,
                row: 2,
                page: 2,
                conf: {
                    type: 'pie',
                    width: 300,
                    height: 180,
                    radius: 80,
                    title: 'bugs distributions per assignee',
                    on: {
                        click: function(d, params){
                            return RedmineURL.getURL('bugsPerAssignee',[d.data.id].concat(  params));
                        }
                    },
                    params: function() { return [Cells._params.fixedInVersionIds['3']]; } 
                },
                // data: [{value: 20, title: 'Lukas'},
                //     {value: 35, title: 'Stepan'},],
                // response: 'ok'
                data:[],
                method: 'openIssuesBy',
                params: ['assignee'],
                fixedInProjectVersions: ['3'],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 14,
                cell: 4,
                row: 2,
                page: 2,
                conf: {
                    type: 'number',
                    title: 'MDs till the end',
                    params: function() { return Cells._params.fixedInVersionIds; } 
                },
                data: [],
                method: 'mdsToDoForVersion',
                params: [],
                fixedInProjectVersions: ['3'],
                response: null
            },
            // ************************
            // All projects effort
            // ************************
            {
               uuid: DBS.Utils.uuid(),
                id: 15,
                cell: 1,
                row: 1,
                page: 3,
                conf: {
                    type: 'bar',
                    width: 600,
                    height: 380,
                    margin: {top: 10, left: 30, right: 0, bottom: 30},
                    title: 'Time log entries for last 5 days based on Redmine activity',
                    thresholds: [
                        {className: 'red', minVal: 0, maxVal: 3},
                        {className: 'orange', minVal: 3, maxVal: 4},
                        {className: 'green', minVal: 4, maxVal: 10}
                    ]
                },
                data: [],
                method: 'mdsFivedaysActive',
                params: [[1,2,3]], //projects ids
                fixedInProjectVersions: [],
                response: null

            },
            {
                uuid: DBS.Utils.uuid(),
                id: 16,
                cell: 1,
                row: 2,
                page: 3,
                conf: {
                    type: 'number',
                    title: 'Σ of MDs from start'
                },
                data: [],
                method: 'mdsFromStart',
                params: [[1,2,3]], //projects ids
                fixedInProjectVersions: [],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 17,
                cell: 2,
                row: 2,
                page: 3,
                conf: {
                    type: 'number',
                    title: 'Σ of MDs logged last week',
                },
                data: [],
                method: 'mdsFromLastWeek',
                params: [[1,2,3]], // projects ids
                fixedInProjectVersions: [],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 18,
                cell: 3,
                row: 2,
                page: 3,
                conf: {
                    type: 'gauge',
                    title: 'Avg resolved per day',
                    width: 300,
                    height: 200,
                    thresholds: [
                        //{className: 'red', minVal: 0, maxVal: 2},
                        {className: 'orange', minVal: 2, maxVal: 2.8},
                        {className: 'green', minVal: 2.8, maxVal: 8},
                        {className: 'red', minVal: 0, maxVal: 2},
                    ]
                },
                data: [],
                method: 'avgIssueChangedToStatus',
                params: [3, [1,2,3]], //status, projects ids
                fixedInProjectVersions: [],
                response: null
            }
        ];

        return Cells;
}]);
