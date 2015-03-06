/**
 *	data: [],
 *  on {
 * 		mouseover: function
 *		click: function
 *  }
 *	thresholds: [
 *		{className: '', minVal: xxx, maxVal: xxx}
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
	var D = DBS,
		CT = D.Charts,
		chart = Object.create(CT.Chart);

	/**
	 * Define chart type and name
	 */
	chart.name = 'gauge';

	/**
	 * define needle and it's drawing functions
	 */
	chart._needle = {
		length: 40,
		radius: 5,
		/** TODO comment */
		// TODO - remake pointer according to http://bl.ocks.org/msqr/3202712
		draw: function(el, value) {
			if (value === undefined || isNaN(value)) {
				el.append('circle')
					.attr('class', chart.getClassName('needle-center'))
					.attr('cx', 0)
					.attr('cy', 0)
					.attr('r', this.radius);

				el.append('path')
					.attr('d', this._drawPointer(0))
					.attr('class', chart.getClassName('needle'))
					.attr('transform', 'rotate(90)');
			} else {
				this._animatePointer(el, value);
			}
		},
		_drawPointer: function(perc) {
			// code inspired by: http://codepen.io/jaketrent/pen/eloGk
			var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
			thetaRad = perc * Math.PI;
			centerX = 0
			centerY = 0;
			topX = centerX - this.length * Math.cos(thetaRad);
			topY = centerY - this.length * Math.sin(thetaRad);
			leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
			leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
			rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
			rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
			return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
		},
		_animatePointer: function(el, perc) {
			// code inspired by: http://codepen.io/jaketrent/pen/eloGk
			var self = this,
				tempD3 = d3;

			return el.transition()
				.delay(700)
				.ease('elastic')
				.duration(2000)
				.selectAll(chart.byClassName('needle'))
				.tween('progress', function() {
					return function(percentOfPercent) {
						var progress;

						progress = percentOfPercent * perc;
						return tempD3.select(this).attr('d', self._drawPointer(progress));
				};
			});
		}
	};
		
	/** TODO comment */
	chart.init = function(conf) {
		this.data = conf.data[0].value;
		this.w = conf.width || 200;
		this.h = conf.height || 150;
		this._title = conf.title;
		this._params = conf._params;

		if (!conf.thresholds)
			throw Error('DBS: initiating gauge graph without thresholds');
		
		this._thresholds.set(conf.thresholds);
		this._thresholds.sort();

		if (conf.on) {
			this._onclick = conf.on.click || null;
			this._onmouseout = conf.on.mouseout || null;
			this._onmouseover = conf.on.mouseover || null;
		}

		if (conf.needle) {
			this._needle.length = conf.needle.length || 90;
			this._needle.radius = conf.needle.radius || 15;
		}
	};

	/** TODO comment */
	chart.load = function() {
		// create _chart
		this._chart = this.dbs.root
			.attr('class', this.initClassName())
		    .append('g')
		    .attr('transform', 'translate(' + (this.dbs._width / 2) + ',' + (this.dbs._height / 3 * 2) + ') rotate(-90)');

		this._drawAxis();

		// init needle
		this._drawNeedle();

		if (this.data !== undefined) {
			// draw the value
			this._drawNeedle(this.data);
		}

		this._drawTooltip();

		// draw title
		this._drawTitle();
	};

	/** TODO comment custom update method */
	chart.update = function(data) {
		this.data = data[0].value;

		this._drawNeedle(this.data);
	};

	/** TODO comment */
	chart._drawAxis = function() {
		var r = Math.min(this.w, this.h) / 1.5, //radius of the circle the arc will follow
			s = .09,
			startAngle = 0,
			arc, arcHover,
			thresholds = this._thresholds;
			self = this;
		var label;

		// sets the half circle
		//this._range = 180;

		this._scale = d3.scale.linear()
			.range([0,1])
			.domain([thresholds.getMin(), thresholds.getMax()]);

		// transform thresholds to %
		this._ticks = this._scale.ticks(thresholds.count());
		this._tickData = d3.range(thresholds.count()).map(function() {return 1 / thresholds.count();});
		
		// arc function
		arc = d3.svg.arc()
			.padAngle(.03) 
		    .startAngle(function(d, i) {
		    	return self._scale(d.minVal) * Math.PI;
		    })
		    .endAngle(function(d, i) {
		    	return self._scale(d.maxVal) * Math.PI;
		    })
		    .innerRadius(function(d) { return r; })
			.outerRadius(function(d) { return (.5 + s) * r; });

		arcHover = d3.svg.arc()
			.padAngle(.03) 
		    .startAngle(function(d, i) {
		    	return self._scale(d.minVal) * Math.PI;
		    })
		    .endAngle(function(d, i) {
		    	return self._scale(d.maxVal) * Math.PI;
		    })
		    .innerRadius(function(d) { return r + 5; })
			.outerRadius(function(d) { return (.5 + s) * r; });

		this._chart.selectAll('path')
		    .data(thresholds.get())
		    .enter().append('path')
		    .attr('class', function(d) { return (d.className) ? self.getClassName(d.className) : ''})
		    .attr('d', arc)
		    .on('mouseover', function(d) {
		    	var m;
		        var el = d3.select(this)     
		        	.transition()
		        	.duration(200)
		        	.attr('d', arcHover);

		        self._tooltip
		        	.transition()
		        	.duration(200)
		        	.style('opacity', 0.9);

		        self._tooltip
		        	.html(d.minVal + ' - ' + d.maxVal + ' Resolved issues per day')
		        	.style('left', (d3.event.pageX) + 'px')			 
					.style('top', (d3.event.pageY - 28) + 'px');

		    })
		    .on('mouseout', function(d) {
		    	var el = d3.select(this)
		        	.transition()
		        	.duration(200)
		        	.attr('d', arc);

		        self._tooltip
		        	.style('opacity', 0);
		        
		        self._tooltip
		        	.style('left','-999px')			 
					.style('top', '-999px');

		    });

		// label = this._chart.append('g')
		// 	.attr('class', this.getClassName('label'))
		// 	//.attr('transform', 'translate(' + (this.dbs._width / 2) + ',' + (this.dbs._height / 3 * 2) + ') rotate(-90)')
		// 	;

		// label.selectAll('text')
		// 	.data(this._ticks)
		// 	.enter().append('text')
		// 	.attr('transform', function(d, i) {
		// 		console.log(self._scale(thresholds.get(i).minVal));

		// 		var angle = self._scale(thresholds.get(i).minVal) * Math.PI;

		// 		angle = 0;

		// 		return 'rotate(' + angle + ') translate(0,' + (-r) + ')';
		// 	})
		// 	.text(d3.format(',g'));


	};

	/** TODO comment */
	chart._drawNeedle = function(value) {
		this._needle.draw(this._chart, this._scale(value));
	};

	/** TODO comment */
	chart._drawTitle = function() {
		this.dbs.root
			.append('text')
			.attr('class', this.getClassName('title'))
			.text(this._title)
			.attr('y', this.dbs._height - 20)
			.attr('x', this.dbs._width / 2);
	};

	chart._drawTooltip = function() {
		this._tooltip = d3.select('body')
			.append('span')
			.attr('class', this.getClassName('tooltip'))
			.style('opacity', 0);
	}

	// add type
	CT.addType(chart);
})();