/**
 * @file dbs.types.number.js
 * @version 0.1.0
 * @author Štěpán Kouba
 * @license MIT
 *
 * @name DBS.Charts.Number
 * @namespace
 * 
 * @description
 * This file covers manipulation with Number.
 * 
 * Configuration object attributes of Number
 * @example
 * { 
 *	data: [{value: XXX}],
 *  on: {
 * 		mouseover: function,
 *		click: function,
 *		...
 *  },
 *	title: XXX,
 *  params: [xxx,xxxx,...]
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
	chart.name = 'number';
	chart._svg = false;

	/**
	 * define needle and it's drawing functions
	 */
	chart.init = function(conf) {
		this.data = conf.data;
		this._title = conf.title;
		this._params = conf.params;

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
			.append('span')
		    .attr('class', this.initClassName());

		this._draw(this.data);

		// append title below graph
		this._drawTitle();
	};
	
	/** TODO comment */
	chart._drawTitle = function() {
		this.dbs.root.append('span')
			.attr('class', this.getClassName('title'))
			.text(this._title);
	};

	/** TODO comment */
	chart._draw = function(data) {
		var s, link,
			self = this;

		s = this._chart.selectAll('span')
			.data(data);

		link = s.enter()
			.append('span')
			.attr('class', this.getClassName('value'));
		
		s.text(function(d){
				return d.value;
			})
			.transition()
		    .delay(100)
			.ease('in')
			.duration(1500)
			.tween('text', function(d) {
	            var i = d3.interpolate(0, d.value),
	                prec = d.value.toString().split('.'),
	                round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

	            return function(t) {
	                this.textContent = Math.round(i(t) * round) / round;
	            };
	        });

	    if (this._onclick) {
	    	link.classed(this.getClassName('clickable'), true);
	    	link.on('click', function(){
				window.open(self._onclick(null, self._params), '_blank');
			});
	    }
	};

	// add type
	CT.addType(chart);
})();