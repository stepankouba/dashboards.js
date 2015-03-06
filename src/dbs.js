/**
 * @file Dashboards.js
 * @version 0.1.0
 * @author Štěpán Kouba
 * @license MIT
 */

'use strict';

/**
 * @name DBS
 * @namespace
 * 
 * @description
 * This creates the general object DBS for the library. A chart is initiated as follows:
 * @public
 * @example
 * 
 * var c = DBS.create({
 * 	id: 'element-id-1',
 * 	width: 300,
 * 	height: 300	
 * },{
 *	// chart related configuration
 *	type: 'bar' // bar chart
 * });
 *  
 */
var DBS = DBS || {};

(function(global){
	/**
	 * DBSRoot object for covering basic Root configuratin
	 * 
	 * @name DBS.Root
	 * @constructor
	 * @param {Object} conf object with following attributes set
	 * @param {String} conf.id element id, where the chart should be append
	 * @param {Number} conf.width width of the chart
	 * @param {Number} conf.height height of the chart
	 * @param {Boolean} conf.svg  set if SVG element should be created fot a chart
	 */
	DBS.Root = function(conf) {
		this._id = conf.id;
		this._root = null;
		this._width = conf.width;
		this._height = conf.height;
		this._svg = conf.svg ? true : undefined;
		this.root = null;
	};

	/**
	 * This method is used to initiate root node for the chart
	 * 
	 * @name DBS._init
	 * @kind function
	 * @param {Object} conf object with following attributes set
	 * @returns {DBS.Root} DBS Root object
	 * @private
	 */
	DBS._init = function(conf) {
		var obj = new DBS.Root(conf);

		if (obj._svg) {
			if (!conf.width || !conf.height)
				throw Error('DBS: Can not init DBS for SVG usage withou specifying width and height of SVG element');

			obj.root = d3.select('#' + obj._id)
						.append('svg')
						.attr('width', obj._width)
						.attr('height', obj._height);

		} else {
			obj.root = d3.select('#' + obj._id);
		}

		return obj;
	};

	/** 
	 * This method initiate create a new chart based on the list of type
	 *
	 * @name DBS.create
	 * @kind function
	 * @param {Object} definition general related configuration {@link DBS._init}
	 * @param {Object} definition of chart related configuration (type, title, thresholds,...)
	 *
	 * @returns {DBS.Chart} returns DBS chart object {@link DBS.Chart}  
	 */
	DBS.create = function(conf, g) {
		var typeName = g.type,
			c = Object.create(DBS.Charts.getType(typeName));
		
		// get chart option for using SVG (by default)
		conf.svg = c._svg;

		// init DBS
		c.dbs = DBS._init(conf);

		// set width 
		g.width = c.dbs._width;
		g.height = c.dbs._height;

		// init chart using CHart's init method
		try {
			c.init(g);
		} catch(e) {
			console.log('Error during initiating chart', e);
			throw e;
		}
		
		// return created chart object
		return c;
	};

})();