'use strict';

// reload conts
var PAGE_RELOAD = 60000;
var COUNTER_INIT_VALUE = PAGE_RELOAD / 1000;

// redmine path
var RedmineURL = {
	// TODO - URLs are not prepared to handle multiple projects / versions in one request
	// TODO - need to solve handling non-public versions (versions not shared within whole tree of projects)
	getURL: function(url, params) {
		var str = this[url],
			replaced;

		if (!str) 
			throw new Error('RedmineUrl: url not specified');

		if (!angular.isArray(params))
			throw new Error('RedmineUrl: params not an array');			

		replaced = str.replace(/\{\{(\d)\}\}/g, function(f, s) {
			var index = parseInt(s);
			return params[index];
		});

		return encodeURI(replaced);
	},
	_visibleColumns: 'c[]=project&c[]=tracker&c[]=status&c[]=priority&c[]=subject&c[]=assigned_to&c[]=updated_on&group_by=', 

	_bugsPerAssignee: 'https://project.simplity.eu/projects/products/issues?utf8=✓&set_filter=1&f[]=assigned_to_id&op[assigned_to_id]==&v[assigned_to_id][]={{0}}&f[]=fixed_version_id&op[fixed_version_id]==&v[fixed_version_id][]={{1}}&v[fixed_version_id][]={{2}}&',
	get bugsPerAssignee() {
		return this._bugsPerAssignee + this._visibleColumns;
	},

	_trackersPerStatus: 'https://project.simplity.eu/projects/products/issues?utf8=✓&set_filter=1&f[]=tracker_id&op[tracker_id]==&v[tracker_id][]={{0}}&f[]=status_id&op[status_id]==&v[status_id][]={{1}}&f[]=fixed_version_id&op[fixed_version_id]==&v[fixed_version_id][]={{2}}&v[fixed_version_id][]={{3}}&',
	get trackersPerStatus() {
		return this._trackersPerStatus + this._visibleColumns;	
	},

	_issuesBySeverity: 'https://project.simplity.eu/projects/products/issues?utf8=✓&set_filter=1&f[]=fixed_version_id&op[fixed_version_id]==&v[fixed_version_id][]={{0}}&f[]=priority_id&op[priority_id]==&v[priority_id][]=4&f[]=priority_id&op[priority_id]==&v[priority_id][]=3&',
	get issuesBySeverity() {
		return this._issuesBySeverity + this._visibleColumns;		
	}
};
