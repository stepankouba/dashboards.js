/**
 *	data: [],
 *  on {
 * 		mouseover: function
 *		click: function
 *  }
 *	thresholds: [
 *		{pattern: xxx, className: '', minVal: xxx, maxVal: xxx}
 *	]
 * 	}
 *	width:
 *  height:
 *  needle: {
 * 		length:
 * 		radius:	
 * }
 */

 'use strict';

(function(global){
	var D = DBS;
	var CT = D.Charts,
		chart = Object.create(CT.Chart);

	
	chart.name = 'bar';

	chart._yAxis = null;
	chart._xAxis = null;
		
	/** TODO comment */
	chart.init = function(conf) {
		this.data = conf.data;
		this.w = conf.width || this.dbs._width;
		this.h = conf.height || this.dbs._height;
		
		this._thresholds = conf.thresholds || [];

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

		this._xAxis = d3.scale.ordinal()
					.domain(d3.range(this._data.length))
					.rangeRoundBands([0,w], 0.05);
		this._yAxis = d3.scale.linear()
					.domain([0, d3.max(this.data, function(d){return d.value})])
					.range([0, h]);
	};

	/** TODO */
	chart._draw = function(values) {
		var yAxis = this._yAxis,
			xAxis = this._xAxis,
			w = this._w,
			h = this._h,
			r,
			self = this;


		r = this._chart.selectAll('rect')
			.data(values)
			.enter()
			.append('rect')
			.attr('class', this.getClassName('value'))
			.attr('x', function(d, i){
				return xAxis(i);
			})
			.attr('width', xAxis.rangeBand())
			.attr('y', h)
			.attr('height', 0);

		r.transition()
			.delay(100)
			.duration(500)
			.attr('y', function(d){
				return h - yAxis(d.value);
			})
			.attr('height', function(d){return yAxis(d.value)});
	};

	// add type
	CT.addType(chart);
})();