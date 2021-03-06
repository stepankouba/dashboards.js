/**
 * @file dbs.types.semaphore.js
 * @version 0.1.0
 * @author Štěpán Kouba
 * @license MIT
 *
 * @name DBS.Charts.Semaphore
 * @namespace
 * 
 * @description
 * This file covers manipulation with Semaphore chart
 * 
 * Configuration object attributes of Semaphore chart. Except of standard configuration, there is also a display value.
 * 
 * @example
 * { 
 *	data: [{value: XXX}],
 *  on: {
 * 		mouseover: function
 *		click: function
 *  },
 *	thresholds: [
 *		{className: '', minVal: xxx, maxVal: xxx},
 * 		{className: '', minVal: xxx, maxVal: xxx},
 *		],
 * 	display: either 'full' or 'single'
 * 	width: XXX,
 *  height: XXX,
 *  radius:	XXX,
 *  opacity: value in decimal (0 not visible, 1 fully visible)
 *  params: [],
 *  needle: {
 * 		length: XXX,
 *		radius: XXX,	
 *	} 
 * }
 */

 'use strict';

(function(global){
	var D = DBS;
	var CT = D.Charts,
		chart = Object.create(CT.Chart);


	/**
	 * Define chart type and name
	 */
	chart.name = 'semaphore';

	/**
	 * TODO comment
	 */
	chart._display = null;
	chart._radius = null;
	
	/** TODO comment */
	chart.init = function(conf) {
		this.data = conf.data[0].value;
		this.w = conf.width || 20;
		this.h = conf.height || 100;
		this._display = conf.display || 'full';
		this._radius = conf.radius || 15;
		this._opac = conf.opacity || .3; // for not visible
		this._params = conf.params;

		if (!conf.thresholds)
			throw Error('DBS: initiating semaphore graph without thresholds');

		this._thresholds.set(conf.thresholds);

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

		this._draw(this.data);
	};

	/** TODO comment */
	chart._draw = function(data) {
		var t = this._thresholds.get(),
			r = this._radius,
			o = this._opac,
			c,
			self = this;

		if (this._display === 'single') {
			c = this._chart
				.selectAll('circle')
				.data([data])
				.enter()
				.append('circle');

			c.attr('cx', this._radius / 2 + 10)
				.attr('cy', this._radius / 2 + 10)
				.attr('r', this._radius)
				.attr('class', function(d){
					for(var i = 0; i < t.length; i++) {
						if (d >= t[i].minVal && d < t[i].maxVal)
							return (t[i].className) ? self.getClassName(t[i].className) : '';
					}// for
				});
		} else {
			c = this._chart
				.selectAll('circle')
				.data(t)
				.enter()
				.append('circle');

			c.attr('cx', r / 2 + 10)
				.attr('cy', function(d, i){
					return (i + 1) * (r + 20);
				})
				.attr('r', r)
				.style('fill-opacity', function(d) {
					return (data >= d.minVal && data < d.maxVal) ? 1 : o;
				})
				.attr('class', function(d){
					return (d.className) ? self.getClassName(d.className) : '';
				});

		}// else
	};

	// add type
	CT.addType(chart);
})();