/**
 * @file Dashboards.js
 * @version 0.1.0
 * @author Štěpán Kouba
 * @license MIT
 */
'use strict';

/**
 * @name DBS.Charts.Chart
 * @class
 * 
 * @description
 * predecessor for all chart objects, which defines all common functionality
 */
DBS.Charts.Chart = (function(){

	/**
	 * Threshoolds class
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
			 * sets the values
			 * @name DBS.Charts.Chart.Thresholds.get
			 * @kind function
			 * @param {Array} array of Objects {minVal, maxVal, className}
			 */
			set: function(val) {
				this._values = val;

				// always sort after set
				// TODO implement binary array find, which keeps data sorted (~)
				this.sort();
			},
			/**
			 * sort the threshold values
			 * @name DBS.Charts.Chart.Thresholds.sort
			 * @kind function
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
			 * get minimal value of the threshold
			 * @name DBS.Charts.Chart.Thresholds.getMin
			 * @kind function
			 * @returns {Number} 
			 */
			getMin: function() {
				return this._values[0].minVal;
			},
			/**
			 * get maximal value of the threshold
			 * @name DBS.Charts.Chart.Thresholds.getMax
			 * @kind function
			 * @returns {Number} 
			 */
			getMax: function() {
				return this._values[this._values.length - 1].maxVal;
			},

			/**
			 * cound of set thresholds
			 * @name DBS.Charts.Chart.Thresholds.count
			 * @kind function
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
		
		/**
		 * dbs object holding main properties for a DBS chart. Created by {@link DBS.create}
		 *
		 * @name DBS.Charts.Chart.dbs
		 * @kind member
		 * @type {DBS.Root}
		 */
		dbs: null,

		/**
		 * D3 object covering the whole DOM element. THis is used to create and modify the chart.
		 * See charts implementations
		 *
		 * @name DBS.Charts.Chart._onmouseout
		 * @kind member
		 * @type {Object}
		 * @private
		 */
		_chart: null,

		/**
		 * Title of the chart
		 *
		 * @name DBS.Charts.Chart._title
		 * @kind member
		 * @type {String}
		 * @private
		 */
		_title: null,

		/**
		 * Additional parameters of the chart. Should only be used with _onclick and other event handlers.
		 * This attribute has no special order.
		 *
		 * @name DBS.Charts.Chart._params
		 * @kind member
		 * @type {Array}
		 * @private
		 */
		_params: null,

		/**
		 * data to be displayed by the chart
		 *
		 * @name DBS.Charts.Chart.data
		 * @kind member
		 * @type {Array}
		 */
		data: [],

		/**
		 * width of the chart
		 *
		 * @name DBS.Charts.Chart.w
		 * @kind member
		 * @type {Number}
		 */
		w: null,

		/**
		 * height of the chart
		 *
		 * @name DBS.Charts.Chart.h
		 * @kind member
		 * @type {Number}
		 */
		h: null,

		/** @obsolete */		
		//params: null,

		/**
		 * Margin object to be used for proper width and height calculation.
		 * !! THIS IS NOT FULLY SUPPORTED YET !!
		 * !! SO FAR USED ONLY ON BAR CHART !!
		 *
		 * @name DBS.Charts.Chart.margin
		 * @kind member
		 * @type {Object}
		 */
		margin: {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		},

		/**
		 * Init method, which is automatically called during creating a chart {@link DBS.create}. It creates all the
		 * necessary configuration settings for a chart.
		 *
		 * @name DBS.Charts.Chart.init
		 * @kind member
		 * @type {Function}
		 * @param {Object} conf configuration object. See details of a chart type
		 */
		init: function(conf){},

		/**
		 * Load method, which displays the chart. Usually calls _draw and _drawAxis methods.
		 * Load method also prepares al the necessary internal functions, D3 objects, etc.
		 *
		 * @name DBS.Charts.Chart.load
		 * @kind member
		 * @type {Function}
		 */
		load: function(){},

		/**
		 * Ensures to draw a chart (based on the passed values). This method is called either by load method or 
		 * update method.
		 *
		 * @name DBS.Charts.Chart._draw
		 * @kind member
		 * @type {Function}
		 * @param {Array} values data to be displayed (usualy using {@link DBS.Charts.Chart.data})
		 * @private
		 */
		_draw: function(values){},

		/**
		 * Ensures to draw what ever is needed for the chart in terms of axis
		 *
		 * @name DBS.Charts.Chart._drawAxis
		 * @kind member
		 * @type {Function}
		 * @private
		 */
		_drawAxis: function(){},

		/**
		 * Ensures to draw title
		 *
		 * @name DBS.Charts.Chart._drawTitle
		 * @kind member
		 * @type {Function}
		 * @private
		 */
		_drawTitle: function(){},

		/**
		 * Ensures to draw legend
		 *
		 * @name DBS.Charts.Chart._drawLegend
		 * @kind member
		 * @type {Function}
		 * @private
		 */
		_drawLegend: function(){},

		/**
		 * Ensures to draw tooltip
		 *
		 * @name DBS.Charts.Chart._drawTooltip
		 * @kind member
		 * @type {Function}
		 * @private
		 */
		_drawTooltip: function(){},

		/**
		 * Get proper class name for a chart. The class name has following structure:
		 *  dbs-chart-CHART_NAME-ADDITIONAL_OPTIONS
		 * See examples:
		 *	dbs-chart-stackedbar-axis
		 *  dbs-chart-gauge-needle-center
		 *
		 * @name DBS.Charts.Chart.getClassName
		 * @kind member
		 * @type {Function}
		 * @param {String?} optName optional addendum to the class name
		 * @returns {String} full class name
		 */
		getClassName: function(optName) {
			optName = optName ? '-' + optName : '';

			return 'dbs-chart-' + this.name + optName;
		},

		/**
		 * Get proper class name to be used fo CSS like XPATH searches. I.e. it uses {@link DBS.Charts.Chart.getClassName}
		 * and adds . (dot) at the beginning
		 *
		 * @name DBS.Charts.Chart.byClassName
		 * @kind member
		 * @type {Function}
		 * @param {String?} optName optional addendum to the class name
		 * @returns {String} full class name
		 */
		byClassName: function(optName) {
			return '.' + this.getClassName(optName);
		},

		/**
		 * Init class name of newly created chart. This has to be used when creating new chart.
		 *
		 * @name DBS.Charts.Chart.initClassName
		 * @kind member
		 * @type {Function}
		 * @returns {String} full class name
		 */
		initClassName: function() {
			return 'dbs-chart dbs-chart-' + this.name ;
		},

		/**
		 * If not defined otherwise, this general method will be used to perform update of a chart.
		 * It is simple and therefore expected to be ovewritten
		 *
		 * @name DBS.Charts.Chart.update
		 * @kind member
		 * @type {Function}
		 * @param {Array} data to be used for udpate
		 */
		update: function(data) {
			this.data = data;

			if (this.data.length > 0)
				this._draw(this.data);
		},

		/**
		 * Calculate the width of the chart when using margins
		 * !! THIS IS NOT FULLY IMPLEMENTED YET !!
		 * !! DO NOT USE !!
		 *
		 * @name DBS.Charts.Chart.getWidth
		 * @kind member
		 * @type {Function}
		 * 
		 */
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

		/**
		 * Set the width of the chart when using margins
		 * !! THIS IS NOT FULLY IMPLEMENTED YET !!
		 * !! DO NOT USE !!
		 *
		 * @name DBS.Charts.Chart.setWidth
		 * @kind member
		 * @type {Function}
		 * 
		 */
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