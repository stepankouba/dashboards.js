/**
 *
 */
'use strict';

DBS.Charts = DBS.Charts || {};

(function(global){
	var CT = DBS.Charts;

	/**
	 * General Chart object
	 * predecessor for all chart objects
	 */
	CT.Chart = {
		name: null,
		_svg: true, // default value
		_data: null,
		_onclick: null, // TODO implement onlcick
		_onmouseover: null, // TODO implement onmouseover
		_onmouseout: null, // TODO implement onmouseout
		_thresholds: null,
		_chart: null,
		_title: null,
		/**
		 * create a chart like class name for any part of the 
		 */
		getClassName: function(optName) {
			optName = optName ? '-' + optName : '';

			return 'dbs-chart-' + this.name + optName;
		},
		/**
		 * use for CSS like selects using class name for any part of the 
		 */
		byClassName: function(optName) {
			return '.' + this.getClassName(optName);
		},
		/**
		 *	creates initial classes for a chart
		 */
		initClassName: function() {
			return 'dbs-chart dbs-chart-' + this.name ;
		},

		/** TODO  general update method*/
		update: function(data) {
			this.data = data;

			if (this.data.length > 0)
				this._draw(this.data);
		},

		/** TODO  comment */
		set data(values) {
			this._data = values;
		},

		/** TODO  comment */
		get data() {
			return this._data;
		},

		/** TODO  comment */
		get w() {
			return this._w;
		},

		/** TODO  comment */
		set w(val) {
			this._w = val;
		},

		/** TODO  comment */
		get h() {
			return this._h;
		},

		/** TODO  comment */
		set h(val) {
			this._h = val;
		},

		/** TODO comment */		
		get params() {
			return this._params;
		},

		/** TODO comment */		
		set params(val) {
			this._params = val;
		},		

	};

	/** TODO comment */
	CT._types = {};

	/** TODO create function */
	CT.addType = function(type) {
		if (this._types[type.name])
			throw Error('DBS: type ' + type.name + ' already existing');

		this._types[type.name] = type;
	};

	/** TODO get Type function */
	CT.getType = function(name) {
		if (this._types[name] === undefined)
			throw Error('DBS: cannot get chart type: ' + name);

		return this._types[name];
	};

	/** TODO get Types function */
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