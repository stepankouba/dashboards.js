/**
 * DBS.create(
 * 	id: element id
 * );
 */

'use strict';

var DBS = DBS || {};

(function(global){
	/** TODO private init function */
	DBS._init = function(conf) {
		var obj = {
			_id: conf.id,
			_root: null,
			_width: conf.width,
			_height: conf.height,
			get root() {
				return this._root;
			},
			set root(val) {
				this._root = val;
			}
		};

		if (conf.svg !== false) {
			obj._svg = true;

			if (!conf.width || !conf.height)
				throw Error('DBS: Can not init DBS for SVG usage withou specifying width and hieght of SVG element');

			obj.root = d3.select('#' + obj._id)
						.append('svg')
						.attr('width', obj._width)
						.attr('height', obj._height);

		} else {
			obj.root = d3.select('#' + obj._id);
		}

		return obj;
	};

	/*
	 * create chart from predefined types
	 * @param Object definition of general related configuration (id, width, height)
	 * @param Object definition of type related configuration (type, title, thresholds,...)
	 */
	DBS.create = function(conf, g) {
		var typeName = g.type,
			c = Object.create(DBS.Charts.getType(typeName));
		
		// get chart option for using SVG (by default)
		conf.svg = c._svg;

		// init DBS
		c.dbs = DBS._init(conf);

		// set width 
		g.width = this._width;
		g.height = this._height;

		// init chart
		c.init(g);
		
		// return created chart object
		return c;
	};

})();