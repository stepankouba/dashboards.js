/**
 *	data: [
 *		{value:, groupByValue:, property defined as xProp to be on x axis}
 *	],
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
 *  xProp: // defined property, that is on x value
 *  groupBy: by which value to group values 
 */

 'use strict';

(function(global){
	var D = DBS;
	var CT = D.Charts,
		chart = Object.create(CT.Chart);

	
	chart.name = 'stackedbar';

	chart._yAxis = null;
	chart._xAxis = null;

	// initial
	chart._stacked = true;

	/** TODO comment */
	chart._colors = [
		chart.getClassName('fill-one'),
		chart.getClassName('fill-two'),
		chart.getClassName('fill-three'),
		chart.getClassName('fill-four'),
		chart.getClassName('fill-five'),
		chart.getClassName('fill-six'),
		chart.getClassName('fill-seven'),
		chart.getClassName('fill-eight'),
		chart.getClassName('fill-nine'),
		chart.getClassName('fill-ten')
	];
		
	/** TODO comment */
	chart.init = function(conf) {
		this.data = conf.data;
		this.w = conf.width || this.dbs._width;
		this.h = conf.height || this.dbs._height;
		this._title = conf.title;

		if (!conf.xProp)
			throw Error('DBS: initiating stackedbar graph without defining xProp');

		this._xProp = conf.xProp;
		this._groupBy = conf.groupBy;

		if (conf.on) {
			this._onclick = conf.on.click || null;
			this._onmouseout = conf.on.mouseout || null;
			this._onmouseover = conf.on.mouseover || null;
		}
	};

	/** TODO comment */
	chart.load = function() {
		var self = this;

		// create _chart
		this._chart = this.dbs.root
		    .append('g')
		    .attr('class', this.initClassName())
		    ;

		// prepare axis
		this._drawAxis();
		
		// draw the chart
		if (this.data.length > 0)
			this._draw(this.data);

		// draw title
		this._drawTitle();

		// draw legend
		this._drawLegend();
	};
	
	/** TODO comment */
	chart._drawAxis = function() {
		var w = this.w,
			h = this.h,
			xProp = this._xProp,
			groupBy = this._groupBy;

		// standard x scale
		this._x = d3.scale.ordinal()
					.rangeRoundBands([0, w], .1, 0);
		
		// set default y (y0) and y for separated stacks
		this._y0 = d3.scale.ordinal()
					.rangeRoundBands([h, 0], .2);
		this._y1 = d3.scale.linear();

		this._xAxis = d3.svg.axis()
    					.scale(this._x)
    					.orient('bottom');
    					//.tickFormat(formatDate);

    	// prepare nest function for data
    	this._nest = d3.nest()
    					.key(function(d) { return d[groupBy]; });

    	this._stack = d3.layout.stack()
    					.values(function(d) { return d.values; })
    					.x(function(d) { return d[xProp]; })
    					.y(function(d) { return d.value; })
    					.out(function(d, y0) { d.valueOffset = y0; });

    	this._color = d3.scale.ordinal()
		    .range(this._colors);
	};

	/** TODO  general update method*/
	chart.update = function(data) {
		this.data = data;

		if (this._group === undefined && this.data.length > 0) {
			this._draw(this.data);
			this._drawLegend();
		} else if (this.data.length > 0) {
			this._chart.selectAll(this.byClassName('group')).remove();
			this._draw(this.data);
			// set default values
			this._group = undefined;
			this._stacked = true;
		}
	},

	/** TODO */
	chart._draw = function(values) {
		var self = this,
			dataByGroup, group, color,
			xProp = this._xProp,
			groupBy = this._groupBy,
			y0 = this._y0,
			y1 = this._y1,
			x = this._x,
			color = this._color,
			r;

		dataByGroup = this._nest.entries(values);

		this._stack(dataByGroup);

		x.domain(dataByGroup[0].values.map(function(d) { return d[xProp]; }));
		y0.domain(dataByGroup.map(function(d) { return d.key; }));
		y1.domain([0, d3.max(values, function(d) { return d.value; })])
			.range([y0.rangeBand(), 0]);

		// create g tags per groups
		group = this._chart.selectAll(this.byClassName('group'))
		    .data(dataByGroup)
		    .enter().append('g')
		    .attr('class', this.getClassName('group'))
		    .attr('transform', function(d) { return 'translate(0,' + y0(y0.domain()[0]) + ')'; })
		    ;

		// create rectangles per data
		r = group.selectAll('rect')
		    .data(function(d) { return d.values; })
		    .enter().append('rect');

		r.attr('x', function(d) { return x(d[xProp]); })
		    .attr('y', function(d) { return y1(d.value + d.valueOffset); })
		    .attr('class', function(d){ return color(d[groupBy]);})
		    .attr('width', x.rangeBand())
		    .attr('height', function(d) { return y0.rangeBand() - y1(d.value); });

		if (this._onclick) {
			r.on('click', function(d){
				window.open(self._onclick(d, self.params), '_blank');
			});
		}

		// append text group labels
		/*group.append('text')
		      .attr('class', this.getClassName('group-label'))
		      .attr('x', -6)
		      .attr('y', function(d) { return y1(d.values[0].value / 2); })
		      .attr('dy', '.35em')
		      .text(function(d) { return 'pokus'; });*/


		group.filter(function(d, i) { return !i; })
			.append('g')
		    .attr('class', this.getClassName('axis'))
		    .attr('transform', 'translate(0,' + (y0.rangeBand() + 3 )+ ')')
		    .call(this._xAxis)
		    .on('click', function(e){

		    	var t = self._chart.transition().duration(750),
		    	 	g;

		    	self._stacked = !self._stacked;

		    	if (!self._stacked) {
		    		g = t.selectAll(self.byClassName('group'))
		    			.attr('transform', function(d) { return 'translate(0,' + y0(d.key) + ')'; });

		    		g.selectAll('rect').attr('y', function(d) { return y1(d.value); });
		    	} else {
		    		g = t.selectAll(self.byClassName('group'))
		    			.attr('transform', function(d) { return 'translate(0,' + y0(y0.domain()[0]) + ')'; });
		    		
		    		g.selectAll('rect').attr('y', function(d) { return y1(d.value + d.valueOffset); });
		    	}	
			});

		this._group = group;
	};

	/** TODO */
	chart._drawTitle = function() {
		this.dbs.root
			.append('text')
			.attr('class', this.getClassName('title'))
			.text(this._title)
			.attr('y', 20)
			.attr('x', this.dbs._width / 2);
	};

	// 
	chart._drawLegend = function() {
		var color = this._color,
			groupBy = this._groupBy;

		var legend = this._chart.selectAll(this.byClassName('legend'))
		    .data(color.domain().slice().reverse())
		    .enter().append('g')
		    .attr('class', this.getClassName('legend'))
		    .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')'; });

		legend.append('rect')
		    .attr('x', this.w - 18)
		    .attr('y', 20)
		    .attr('width', 18)
		    .attr('height', 18)
		    .attr('class', color);

		legend.append('text')
		    .attr('x', this.w - 24)
		    .attr('y', 29)
		    .attr('dy', '.35em')
		    .text(function(d) { return d; });
	};

	// add type
	CT.addType(chart);
})();