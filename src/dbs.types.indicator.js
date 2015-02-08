/**
 *	data: [
 *		{value: xxx, text: xxx}
 *	],
 *  on {
 * 		mouseover: function
 *		click: function
 *  }
 *	thresholds: [
 *		{icon: xxx, className: xxx, minVal: xxx, maxVal: xxx}
 *	]
 *	
 *  
 */

 'use strict';

(function(global){
	var D = DBS;
	var CT = D.Charts,
		chart = Object.create(CT.Chart);

	/**
	 * Define chart type and name
	 */
	chart.name = 'indicator';
	chart._svg = false; // not using SVG container

	/**
	 * define needle and it's drawing functions
	 */
	chart.init = function(conf) {
		this.data = conf.data;
		this._params = conf._params;
		
		if (!conf.thresholds)
			throw Error('DBS: initiating indicator without thresholds');

		this._thresholds = conf.thresholds;

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
	};
	
	/** TODO comment */
	chart._draw = function(data) {
		var s,
			t = this._thresholds,
			self = this;

		s = this._chart.selectAll('span')
			.data(data)
			.enter();

		s.append('i')
			.attr('class', function(d){
				var c = 'fa ';
				for (var i = 0; i < t.length; i++) {
					if (d.value >= t[i].minVal && d.value < t[i].maxVal) {
						c += t[i].icon;
						c += (t[i].className) ? ' ' + self.getClassName(t[i].className) : '';
						break;	
					}
					
				}

				return c;
			});
		s.append('span')
			.attr('class', function(d){
				var c = 'fa ';
				for (var i = 0; i < t.length; i++) {
					if (d >= t[i].minVal && d < t[i].maxVal) {
						c += t[i].icon;
						c += (t[i].className) ? ' ' + self.getClassName(t[i].className) : '';

						return c;	
					}
					
				}
			})
			.text(function(d){return d.text})
	};

	// add type
	CT.addType(chart);
})();