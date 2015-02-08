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

	chart.name = 'arcone';
	chart._radius = null;

	/** TODO comment */
	chart.init = function(conf) {
		this.data = conf.data;
		this.w = conf.width || 150;
		this.h = conf.height || 150;
		this._radius = conf.radius || 50;
		this._params = conf._params;

		if (!conf.thresholds)
			throw Error('DBS: initiating arcOne graph without thresholds');
		
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
		    .append('g')
		    .attr('class', this.initClassName())
		    .attr('transform', 'translate('+ this.w / 2 +', ' + this.h / 2 + ')');

		this._drawAxis();
		
		this._draw(this.data);
	};
	
	/** TODO comment */
	chart._drawAxis = function() {
		var r = this._radius, //radius of the arcOne my arc will follow
			startAngle = 0,
			arc = d3.svg.arc()
		    .startAngle(0)
		    .endAngle(Math.PI * 2)
		    .innerRadius(this._radius - 5)
		    .outerRadius(this._radius);			    


		this._chart
			.append('path')
		    .attr('d', arc)
		    .attr('class', this.getClassName('axis'));
	};

	/** TODO */
	chart._draw = function(value) {
		// arc function
		var t = this._thresholds,
			v, arc,
			self = this;

		arc = d3.svg.arc()
		    .startAngle(0)
		    .endAngle(function(d){ return d.value * Math.PI * 2 ;})
		    .innerRadius(this._radius - 5)
		    .outerRadius(this._radius);			    

		v = this._chart.selectAll('path.' + this.getClassName('value'))
			.data(value)
			.enter()
		    .append('path')
		    .attr('class', function(d) { 
		    	for(var i = 0; i < t.length; i++) {
		    		if (d.value > t[i].minVal && d.value <= t[i].maxVal)
		    			return self.getClassName(t[i].className);
		    	}

		    })
		    .transition()
		    .delay(100)
			.ease('in')
			.duration(2000)
			.attrTween('d', tweenArc({ value : 0 })); // initial value

		function tweenArc(b) {
		    return function(a) {
		    	//console.log(b);
		        var i = d3.interpolate(b, a);
		        //for (var key in b) a[key] = b[key]; // update data
		        a.value = b.value
		        return function(t) {
		              return arc(i(t));
		        };     
			}
		}

	};

	// add type
	CT.addType(chart);
})();