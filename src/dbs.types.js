/**
 * @file Dashboards.js
 * @version 0.1.0
 * @author Štěpán Kouba
 * @license MIT
 */
'use strict';

/**
 * @name DBS.Charts
 * @namespace
 * 
 * @description
 * DBS.Charts covers basic functionality over supported charts and provides DBS.Chart object, which is predecessor for all supported charts.
 * Besides this, basic operations with list of charts is provided by methods.
 * 
 * @public
 */
DBS.Charts = DBS.Charts || {};

(function(){
	var CT = DBS.Charts;

	/**
	 * Map of available chart types. Each type contains {@link DBS.Charts.Chart}
	 *
	 * @name DBS.Charts._types
	 * @kind member
	 * @private
	 */
	CT._types = {};

	/** 
	 * Add new type
	 * 
	 * @name DBS.Charts.addType
	 * @kind function
	 * @throws Error if type is already in the _types
	 * @param {DBS.Charts.Chart} type
	 */
	CT.addType = function(type) {
		if (this._types[type.name])
			throw Error('DBS: type ' + type.name + ' already existing');

		this._types[type.name] = type;
	};

	/**
	 * get particular type. If not exists, throw error
	 * 
	 * @name DBS.Charts.getType
	 * @kind function
	 * @throws Error if the type does not exist
	 * @returns {DBS.Charts.Chart}
	 */
	CT.getType = function(name) {
		if (this._types[name] === undefined)
			throw Error('DBS: cannot get chart type: ' + name);

		return this._types[name];
	};

	/**
	 * Get list of all available types
	 *
	 * @name DBS.Charts.getAvailableTypes
	 * @kind function
	 * @returns {Array}
	 */
	CT.getAvailableTypes = function() {
		var types = [];

		for (var t in this._types) {
			if (this._types.hasOwnProperty(t))
				types.push(t);
		}

		return types;
	}

	// TODO - add support for touches
})();