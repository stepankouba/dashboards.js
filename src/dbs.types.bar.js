/**
 * @file dbs.types.bar.js
 * @version 0.1.0
 * @author Štěpán Kouba
 * @license MIT
 *
 * @name DBS.Charts.Bar
 * @namespace
 * 
 * @description
 * This file covers manipulation with Bar chart
 * 
 * Configuration object attributes of Bar chart
 * @example
 * { 
 *	data: [{value: XXX},...],
 *  on: {
 * 		mouseover: function
 *		click: function
 *  },
 *	thresholds: [
 *		{className: '', minVal: xxx, maxVal: xxx},
 * 		{className: '', minVal: xxx, maxVal: xxx},
 *		],
 *	margin: {
 *		left: XXX,
 * 		right: XXX,
 *		top: XXX,
 *		bottom: XXX	
 *  },
 * 	width: XXX,
 *  height: XXX,
 *  params: []
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
		this.h = (conf.height) || this.dbs._height;
		this._params = conf.params;
			
		if (conf.margin) {
			this.h = this.h - conf.margin.top - conf.margin.bottom;
			this.w = this.w - conf.margin.left - conf.margin.right;
			this.margin = conf.margin;
		}

		// no implementation using thresholds so far
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

		// TODO - remove this part and replace with proper implementation in DBS.Charts.Chart object
		if (this.margin) {
			this.dbs.root
				.attr('width', this.w + this.margin.left + this.margin.right)
				.attr('height', this.h + this.margin.top + this.margin.bottom);

			this._chart
				.attr('transform', 'translate('+ this.margin.left + ', '+ this.margin.top +')');
		}

		this._drawAxis(this.data);
		
		this._draw(this.data);
	};
	
	/** TODO comment */
	chart._drawAxis = function(values) {
		var w = this.w,
			h = this.h;

		this._x = d3.scale.ordinal()
					.rangeRoundBands([0, w], .1, 0);
		this._y = d3.scale.linear()
					.range([h, 0])
					.domain([0, d3.max(values, function(d){return d.value})]);

		this._xAxis = d3.svg.axis()
    					.scale(this._x)
    					.orient('bottom');
    	this._yAxis = d3.svg.axis()
			    	    .scale(this._y)
			    	    .orient('left')
			    	    .tickFormat(d3.format('.0 MD'));
				
	};

	/** TODO */
	chart.update = function(values){
		return;
	};

	/** TODO */
	chart._draw = function(values) {
		var yAxis = this._yAxis,
			xAxis = this._xAxis,
			w = this.w,
			h = this.h,
			y = this._y,
			x = this._x,
			r,
			self = this;

		x.domain(values.map(function(d){ return d.text }));

		this._chart
			.append('g')
		    .attr('class', this.getClassName('x-axis'))
		    .attr('transform', 'translate(0,' + (h)+ ')')
		    .call(xAxis);

		this._chart
			.append('g')
		    .attr('class', this.getClassName('y-axis'))
		    .call(yAxis)
		    .append('text')
		    	.attr('transform', 'rotate(-90)')
		    	.attr('y', 6)
		    	.attr('dy', '.71em')
		    	.text('MDs');

		r = this._chart.selectAll('rect')
			.data(values)
			.enter()
			.append('rect')
			.attr('class', this.getClassName('value'))
			.attr('x', function(d, i){
				return x(d.text);
			})
			.attr('width', x.rangeBand())
			.attr('y', function(d){ return y(d.value); })
			.attr('height', function(d){ console.log(h, y(d.value)); return h - y(d.value); })
			.attr('transform', 'translate(0, 0)');

		// r.transition()
		// 	.delay(100)
		// 	.duration(500)
		// 	.attr('y', function(d){
		// 		return h - y(d.value);
		// 	})
		// 	.attr('height', function(d){return yAxis(d.value)});
	};

	// add type
	CT.addType(chart);
})();