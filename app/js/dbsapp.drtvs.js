'use strict';
/**
 *	DBS example app
 */

// Declare app level module which depends on filters, and services
angular.module('dbsApp.directives', []).
directive('draggableCell', ['$log', 'DragDrop', function($log, DragDrop) {
	return {
		restrict: 'A',
		replace: true,
		link: function(scope, elem, attr, ctrl) {

			elem.attr('draggable', 'true');
			elem.bind('dragstart', function(e){
				$log.debug('dragging started');
				this.classList.add('dbsapp-dragging');

				DragDrop.source = e.target;
				e.stopPropagation();
				return true;
			});
			elem.bind('dragend', function(e){
				$log.debug('dragging ended');
				this.classList.remove('dbsapp-dragging');
				return true;
			});
		}
	}
}]).
directive('dragoverArea', ['$log', function($log) {
	return {
		restrict: 'A',
		replace: true,
		link: function($scope, elem, attr, ctrl) {
			// TODO - handle correctly the dragg over events
			elem.bind('dragenter', function(e){

				this.classList.add('dbsapp-dragged-over');

				return true;
			});
			elem.bind('dragover', function(e){
				e.preventDefault();

				//this.classList.remove('dbsapp-dragged-over');

				return true;
			});
			elem.bind('dragleave', function(e){
				this.classList.remove('dbsapp-dragged-over');
			});
		}
	}
}]).
directive('droppableArea', ['$log', 'DragDrop', function($log, DragDrop) {
	return {
		restrict: 'A',
		replace: true,
		scope: {
			dropHandler: '&'
		},
		link: function($scope, elem, attr, ctrl) {

			// TODO comment
			function swapDivs(source, target) {
				var sourceElm, targetElm, sourceNext, sourceRow;

				targetElm = target.getNode();
				sourceElm = source.getNode();

				$log.debug(source);

				sourceNext = sourceElm.nextSibling;
				sourceRow = sourceElm.parentNode;

				targetElm.parentNode.replaceChild(sourceElm, targetElm);
				sourceRow.insertBefore(targetElm, sourceNext);
			}

			elem.bind('drop', function(e){

				//do not drop cells with different width
				//var targetClass = angular.element(e.target).attr('class').match(/(col-md-\d)/g).toString(),
				//	sourceClass = DragDrop.source.element.attr('class').match(/(col-md-\d)/g).toString();

				// check cells width and if different, do not drop
				//if (targetClass !== sourceClass)
				//	return false;

				//  TODO comment - find proper DIV as target
				function findTarget(el) {
					for (; el; el = el.parentNode) {
						if (el.tagName === 'DIV' && angular.element(el).hasClass('dbsapp-cell')) {
							return el;
						}// if
					}

					return false;
				};

				// get proper target
				DragDrop.target = findTarget(e.target);

				// handle changes in data
				$scope.$apply(function(scope) {
					var fn = $scope.dropHandler();
					if ('undefined' !== typeof fn) {
						fn(DragDrop.source, DragDrop.target);
					}
				});

				// change the DIVs in the tree
				swapDivs(DragDrop.source, DragDrop.target);

				// delete the source and the target
				DragDrop.source = null;
				DragDrop.target = null;

				return true;
			});
		}
	}
}]);