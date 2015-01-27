'use strict';
/**
 *	DBS example app
 */

// Declare app level module which depends on filters, and services
angular.module('dbsApp.services', []).
factory('DragDrop', ['$log', function($log){
	
	// TOOD comment
	function DragDropElement(el){
		var s = angular.element(el);

		this.id = s.attr('id');
		this.row = s.attr('data-dbsapp-row');
		this.cell = s.attr('data-dbsapp-cell');
		this.element = s;
	};
	DragDropElement.prototype.getNode = function() {
		return document.querySelector('#' + this.id);
	};

	return {
		_target: null,
		_source: null,
		
		// TODO comment
		set source(el) {
			
			if (el)
				this._source = new DragDropElement(el);
			else
				this._source = null;
		},
		// TODO comment
		get source() {
			return this._source;
		},
		// TODO comment
		set target(el) {
			if (el)
				this._target = new DragDropElement(el);
			else
				this._target = null;
		},
		// TODO comment
		get target() {
			return this._target;
		}
	};
}]);
