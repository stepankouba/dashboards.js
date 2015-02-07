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
                    pageTitle: 'Quality dashboard',
                    visible: true,
                    gridRows: [
                        {row: 1, cells: 1},
                        {row: 2, cells: 3}
                    ],
                    params: {
                        project: 1
                    }
                },
                {
                    page: 1,
                    pageTitle: 'Glossary dashboard',
                    visible: true,
                    gridRows: [
                        {row: 1, cells: 1},
                        {row: 2, cells: 3}
                    ],
                    params: {
                        project: 2
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
            self = this;
        /**
         * function for updating the obj
         */
        console.log(obj);
        var resp = RestAPI[obj.method].apply(RestAPI, obj.params.concat([this._params.fixedInVersionIds]));

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

        this._params.fixedInVersionIds = [];
        this._params.project = params.project;
        this._params.page = params.page;
        
        // get the version based on the selected grid
        versAPI = RestAPI.getValidVersions(this._params.project);

        versAPI.get(function(s){
            // get ids of versions
            s.forEach(function(el){
                self._params.fixedInVersionIds.push(el.id);
            });

            self._update();
        }, function(e){
            console.log(e);
            this._defer.reject(e);
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
                    }                    
                },
                data: [],
                method: 'openIssuesBy',
                params: ['tracker'],
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
                    title: 'Σ of Critical and Major issues'
                },
                data: [],
                method: 'openIssuesWithSeverity',
                params: [[4,3]],
                response: null
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 2,
                cell: 2,
                row: 2,
                page: 0,
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
                id: 3,
                cell: 3,
                row: 2,
                page: 0,
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
            },
            // GLOSSARY DBS
            {
                uuid: DBS.Utils.uuid(),
                id: 4,
                cell: 1,
                row: 1,
                page: 1,
                conf: {
                    type: 'stackedbar',
                    width: 600,
                    height: 380,
                    xProp: 'status',
                    groupBy: 'tracker',
                    title: 'GL Issues per status and tracker for project',
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
                id: 5,
                cell: 1,
                row: 2,
                page: 1,
                conf: {
                    type: 'number',
                    title: 'GL MDs spent in this week'
                },
                data: [{value: 76.8}],
                response: 'ok'
            },
            {
                uuid: DBS.Utils.uuid(),
                id: 6,
                cell: 2,
                row: 2,
                page: 1,
                conf: {
                    type: 'gauge',
                    title: 'GL % of open bugs / features',
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
                id: 7,
                cell: 3,
                row: 2,
                page: 1,
                conf: {
                    type: 'pie',
                    width: 300,
                    height: 180,
                    title: 'GL bugs distributions per assignee',
                    on: {
                        click: function(d, params){
                            return RedmineURL.getURL('bugsPerAssignee',[d.data.id].concat(  params));
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

        return Cells;
}]);
