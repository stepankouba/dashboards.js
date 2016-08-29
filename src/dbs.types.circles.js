/**
 * @file dbs.types.circles.js
 * @version 0.1.0
 * @author Štěpán Kouba
 * @license MIT
 *
 * @name DBS.Charts.Circles
 * @namespace
 * 
 * @description
 * This file covers manipulation with Circles chart (i.e. Venn's diagram)
 * 
 * Configuration object attributes of Circles chart (i.e. Venn's diagram)
 * @example
 * { 
 *	data: [{value: XXX, ...} ,...],
 *  on: {
 * 		mouseover: function
 *		click: function
 *  },
 *  title: XXXX,
 * 	width: XXX,
 *  height: XXX,
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
	chart.name = 'circles';

	/** TODO comment */
	chart.init = function(conf) {
		this.w = conf.width || null;
		this.h = conf.height || null;
		this._title = conf.title;
		// this._params = conf.params;

		this.data = conf.data;
		
		if (conf.on) {
			this._onclick = conf.on.click || null;
			this._onmouseout = conf.on.mouseout || null;
			this._onmouseover = conf.on.mouseover || null;
		}
	};

	/** TODO comment */
	chart.load = function() {
		// create table
		this._table = this.dbs.root
			.attr('class', this.initClassName())
		    .append('g')
		    .attr('transform', 'translate(' + (this.dbs._width / 2) + ',' + (this.dbs._height / 2) + ')');

		this._draw(this.data);
		

		// draw title
		this._drawTitle();
	};

	/** TODO comment custom update method */
	chart.update = function(data) {
		// this.data = this._extractData(data);
		// this._columns = this._extractColumns(data);

		// if (this.data.length > 0) {
		// 	this._thead = this._thead.data(this._columns);
		// 	this._thead.exit().remove();

		// 	this._rows = this._rows.data(this.data);
		// 	this._rows.exit().remove();
		// }
	};

	/** TODO comment */
	chart._draw = function(values) {
		var self = this,
			th, tb, cells, rows;

		// append the header row
	   	this._thead = this._thead.append('tr')
	       	.selectAll('th')
	       	.data(columns)
	       	.enter()
	       	.append('th');

	    this._thead
	       	.text(function(d) { return d; });
	    

	   	// create a row for each object in the data
	  	this._rows = this._tbody.selectAll('tr')
	       	.data(values)
	       	.enter()
	       	.append('tr');

	  	// create a cell in each row for each column
	   	cells = this._rows.selectAll('td')
	       	.data(function(row) {
	        	return row;
	       })
	       .enter()
	       .append('td')
	           .text(function(d) { return d; });

	};

	/** TODO comment */
	chart._drawTitle = function() {
		this.dbs.root
			.append('div')
			.attr('class', this.getClassName('title'))
			.text(this._title);
	};

	// add type
	CT.addType(chart);
})();