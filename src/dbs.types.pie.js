/**
 *	data: [],
 *  on {
 * 		mouseover: function
 *		click: function
 *  }
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

	chart.name = 'pie';
	chart._radius = null;

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
		this.w = conf.width || 150;
		this.h = conf.height || 150;
		this._radius = conf.radius || Math.min(this.w, this.h) / 2;
		this._title = conf.title;

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
		    .attr('class', this.initClassName())
		    .attr('transform', 'translate('+ this.dbs._width / 2 +', ' + (this.dbs._height / 3 + 10) + ')');

		if (this.data.length > 0)
			this._draw(this.data);

		this._drawTooltip();

		this._drawTitle();
	};

	/** TODO */
	chart._draw = function(data) {
		// arc function
		var pie, v, arc, arcHover, color,
			self = this;

		color = d3.scale.ordinal()
		    .range(this._colors);

		arc = d3.svg.arc()
		    .innerRadius(this._radius - 40)
		    .outerRadius(this._radius - 15);			    

		arcHover = d3.svg.arc()
		    .innerRadius(this._radius - 40)
		    .outerRadius(this._radius - 10);

		pie = d3.layout.pie()
			.padAngle(.03) // specify pie padding
		    .sort(null)
		    .value(function(d) { return d.value; });

		v = this._chart.selectAll(this.getClassName('arc'))
		    .data(pie(data))
		    .enter().append('g')
		    .attr('class', this.getClassName('arc'));

		// mouse events
		v.append('path')
		    .attr('d', arc)
		    .attr('class', function(d) { return color(d.data.text); })
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
		        	.html(d.data.text + ' (' + d.value + ' issues)')
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
		
		if (this._onclick) {
			v.on('click', function(d){
				window.open(self._onclick(d, self.params), '_blank');
			});
		}

	};

	/** TODO */
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