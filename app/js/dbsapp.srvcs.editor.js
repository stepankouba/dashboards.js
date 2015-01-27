'use strict';
/**
 *	DBS example app
 */

// Declare app level module which depends on filters, and services
angular.module('dbsApp.services.editor', []).
provider('Editor', function(){
	
	/**
	 * show method
	 * close 
	 * cancel
	 * remove
	 * config {templateUrl: , controller:, }
	 */
	 

	function EditorModal() {
		this._chart = null;
		this._root = 'body';
		this._templateUrl = 'partials/dbsapp.editor.html';
	}

	// get ID of the chart

	// recieve config with type definition

	// based on the type load editor.*.html

	// save, cancel, remove functions
	
	this.$get = ['$document', '$http', '$templateCache', '$compile', '$rootScope', '$controller', '$q',
		function($document, $http, $templateCache, $compile, $rootScope, $controller, $q){
		
		var Editor = {
			_templateUrl: 'partials/dbsapp.editor.html',
			_element: null,
			_scope: null,
			_defer: null,
			_promise: null
		};

		/**
		 * append new editor to the DOM tree
		 */
		Editor.appendToHTML = function(html) {
			this._element = $compile(angular.element(html))(this._scope);

			$document.find('body').eq(0).append(this._element);

			$controller(this._ctrl, { $scope: this._scope });			
		};

		/**
		 * close editor
		 */
		Editor.close = function() {
			//
			this._defer.resolve('success');

			this._scope.$destroy();
			this._element.remove();
		}

		/**
		 * cancel editor
		 */
		Editor.dismiss = function() {
			//
			this._defer.reject('fail');

			this._scope.$destroy();
			this._element.remove();
		}

		/**
		 * show editor
		 */
		Editor.show = function(chart, config) {
			var template,
				self = this,
				instance;

			this._defer = $q.defer(),
			this._promise = this._defer.promise;

			// create scope for editor
			this._scope = $rootScope.$new();
			this._scope.edited = chart;

			// editor instance returning result value
			instance = {
				result: this._promise
			};

			this._ctrl = config.controller;

			template = $http.get(this._templateUrl).then(function(resp){
				return resp.data
			});

			template.then(function(html){
				self.appendToHTML(html);
			});

			// return instance
			return instance;
		};

		return Editor;
	}];
});
