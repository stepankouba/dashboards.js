/**
 * @file dbs.types.line.js
 * @version 0.1.0
 * @author Štěpán Kouba
 * @license MIT
 *
 * @name DBS.Charts.Line
 * @namespace
 * 
 * @description
 * This file covers manipulation with Line chart.
 * !! Line chart is not fully implemented yet. STILL PROOF OF CONCEPT !!
 * 
 * Configuration object attributes of Line chart
 * @example
 * { 
 *	data: [{value: XXX},...],
 *  on: {
 * 		mouseover: function
 *		click: function
 *  },
 * 	width: XXX,
 *  height: XXX,
 *  _params: []
 * }
 */

 'use strict';

(function(global){
	var D = DBS;
	var CT = D.Charts,
		chart = Object.create(CT.Chart);

	chart.name = 'line';

	chart._yAxis = null;
	chart._xAxis = null;

	/** TODO comment */
	chart.init = function(conf) {
		this.data = conf.data;
		this.w = conf.width || 290;
		this.h = conf.height || 190;
		this._params = conf._params;
		
		// this._thresholds.set(conf.thresholds);

		if (conf.on) {
			this._onclick = conf.on.click || null;
			this._onmouseout = conf.on.mouseout || null;
			this._onmouseover = conf.on.mouseover || null;
		}
	};

	/** TODO comment */
	chart.load = function() {
		// create _chart
		this._chart = this.dbs.root
		    .append('g')
		    .attr('class', this.initClassName());

		this._drawAxis();
		
		this._draw(this.data);
	};

	/** TODO comment */
	chart._drawAxis = function() {
		var w = this.w,
			h = this.h;

		this._xAxis = d3.scale.linear()
					.domain([0, this.data.length])
					.range([0,w]);
		this._yAxis = d3.scale.linear()
					.domain([0, 100])
					.range([h, 0]);
	};

	/** TODO */
	chart._draw = function(values) {
		var yAxis = this._yAxis,
			xAxis = this._xAxis,
			lineFunc,
			l, totalLength;

		lineFunc = d3.svg.line()
			.interpolate('cardinal')
			.x(function(d, i){ return xAxis(i);})
			.y(function(d){ return yAxis(d.value);});

		l = this._chart
			.append('path')
			.attr('d', lineFunc(values))
			.attr('class', this.getClassName('value'));

		totalLength = l.node().getTotalLength();
		
		l.attr("stroke-dasharray", totalLength + " " + totalLength)
  			.attr("stroke-dashoffset", totalLength)
  			.transition()
			.duration(2000)
			.ease('linear')
			.attr("stroke-dashoffset", 0);
	};

	// add type
	CT.addType(chart);
})();