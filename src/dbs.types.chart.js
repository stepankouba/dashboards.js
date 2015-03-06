/**
 * @file Dashboards.js
 * @version 0.1.0
 * @author Štěpán Kouba
 * @license MIT
 */
'use strict';

/**
 * @name DBS.Charts.Chart
 * @namespace
 * 
 * @description
 * predecessor for all chart objects, which defines all common functionality
 */
DBS.Charts.Chart = (function(){

	/**
	 * Threshoolds object
	 * @name DBS.Charts.Chart.Thresholds
	 * @class
	 * @private
	 */
	var thresholds = {
			/**
			 * list of tresholds
			 * @name DBS.Charts.Chart.Thresholds._values
			 * @private
			 */
			_values: [],

			/**
			 * returns all values or just if specified
			 * @name DBS.Charts.Chart.Thresholds.get
			 * @kind function 
			 * @returns {Array|Object}
			 */
			get: function(i) {
				if (i !== undefined)
					return this._values[i];
				
				return this._values;
			},
			/**
			 * sets the valus
			 * @name DBS.Charts.Chart.Thresholds.get
			 * @kind function
			 * @param {Array} array of Objects {minVal, maxVal, className}
			 */
			set: function(val) {
				this._values = val;
			},
			/**
			 * sort values by minVal
			 */
			sort: function() {
				this._values.sort(function(a, b) {
					if (a.minVal > b.minVal)
						return 1;
					if (a.minVal < b.minVal)
						return -1;

					return 0;
				});
			},
			/**
			 * get minimal value. The values may not be sorted
			 * @returns {Number}
			 */
			getMin: function() {
				this.sort();
				
				return this._values[0].minVal;
			},
			/**
			 * get max value
			 * @returns {Number}
			 */
			getMax: function() {
				this.sort();

				return this._values[this._values.length - 1].maxVal;
			},

			/**
			 * get the count
			 * @returns {Number}
			 */
			count: function() {
				return this._values.length;
			}
		};

	return {
		/** 
		 * Name of the chart type
		 * 
		 * @name DBS.Charts.Chart.name
		 * @kind member
		 * @type {String}
		 */
		name: null,

		/**
		 * Handles, whether chart uses svg
		 *
		 * @name DBS.Charts.Chart._svg
		 * @kind member
		 * @type {Boolean}
		 * @private
		 */
		_svg: true,

		/**
		 * Handler for onclick function for a chart (only supports one function)
		 *
		 * @name DBS.Charts.Chart._onclick
		 * @kind member
		 * @type {Function}
		 * @private
		 */
		_onclick: null,

		/**
		 * Handler for onmouse over function for a chart (only supports one function)
		 *
		 * @name DBS.Charts.Chart._onmouseover
		 * @kind member
		 * @type {Function}
		 * @private
		 */
		_onmouseover: null, 

		/**
		 * Handler for onmouse out function for a chart (only supports one function)
		 *
		 * @name DBS.Charts.Chart._onmouseout
		 * @kind member
		 * @type {Function}
		 * @private
		 */
		_onmouseout: null,

		/**
		 * Object implementing functionality over thresholds
		 * @name DBS.Charts.Chart._thresholds
		 * @type {DBS.Charts.Chart.Thresholds}
		 * @private
		 */
		_thresholds: thresholds,
		
		_chart: null,
		_title: null,
		_params: null, // additonal params
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
		data: null,

		/** TODO  comment */
		w: null,

		/** TODO  comment */
		h: null,

		/** TODO comment */		
		params: null,

		margin: {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		},

		/** TODO comment */
		getWidth: function(type) {
			var val;

			if (type === undefined)
				throw new Error('DBS.Charts: can not get dimension without specifying type');

			switch(type) {
				case 'width':
					val = this.w + this.margin.left + this.margin.right;
					break;
				case 'height':
					val = this.h + this.margin.top + this.margin.bottom;
					break;
				default:
					val = undefined;
			}

			return val;
		},

		/** TODO comment */
		setWidth: function(type, value, margin) {
			if (type === undefined)
				throw new Error('DBS.Charts: can not get dimension without specifying type');

			if (margin !== undefined && Object.prototype.toString.call(margin) === '[object Object]')
				this.margin = margin;

			switch(type) {
				case 'width':
					this.w = value - this.margin.left - this.margin.right;
					break;
				case 'height':
					this.h = value - this.margin.top - this.margin.bottom;
					break;
				default:
					console.log('DBS.Charts: set none');
			}
		}
	};
})();