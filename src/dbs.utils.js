/**
 *
 */
'use strict';

DBS.Utils = DBS.Utils || {};

(function(global){
	var Ut = DBS.Utils;

	/** TODO comment */
	Ut.uuid = function() {
		var d = Date.now();
		var uuid = 'xxxxxxx-xxxx-4xxx-yxxxxxx'.replace(/[xy]/g, function(c){
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
		});

		return uuid.toString();
	};

	/** TODO http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/ */
})();