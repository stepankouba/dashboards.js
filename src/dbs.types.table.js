/**
 * @file dbs.types.table.js
 * @version 0.1.0
 * @author Štěpán Kouba
 * @license MIT
 *
 * @name DBS.Charts.Table
 * @namespace
 * 
 * @description
 * This file covers manipulation with Table chart
 * 
 * Configuration object attributes of Table chart
 * @example
 * { 
 *	data: [{value: XXX, ...} ,...],
 *  on: {
 * 		mouseover: function
 *		click: function
 *  },
 *	thresholds: [
 *		{className: '', minVal: xxx, maxVal: xxx},
 * 		{className: '', minVal: xxx, maxVal: xxx},
 *		],
 *  title: XXXX,
 * 	width: XXX,
 *  height: XXX,
 *  params: []
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
	chart.name = 'table';
	chart._svg = false;
		

	/**
	 * TODO comment
	 */
	chart._extractData = function(data) {
		var array = [];

		if (data.length === 0)
			return [];

		data.forEach(function(el, key){
			var a = [];
			for (var i in el) {
				if (el.hasOwnProperty(i))
					a.push(el[i]);
			}
			array.push(a);
		});

		return array;
	};

	/**
	 *
	 */
	chart._extractColumns = function(data) {
		return data.length > 0 ? Object.keys(data[0]) : [];
	};

	/** TODO comment */
	chart.init = function(conf) {
		this.w = conf.width || null;
		this.h = conf.height || null;
		this._title = conf.title;
		this._params = conf.params;

		this.data = this._extractData(conf.data);
		this._columns = this._extractColumns(conf.data);

		this._thresholds.set(conf.thresholds || []);

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
			.append('div')
			.attr('class', this.initClassName())
		    .append('table');
		this._thead = this._table.append('thead');
		this._tbody = this._table.append('tbody');


		this._draw(this._columns, this.data);
		

		// draw title
		this._drawTitle();
	};

	/** TODO comment custom update method */
	chart.update = function(data) {
		this.data = this._extractData(data);
		this._columns = this._extractColumns(data);

		if (this.data.length > 0) {
			this._thead = this._thead.data(this._columns);
			this._thead.exit().remove();

			this._rows = this._rows.data(this.data);
			this._rows.exit().remove();
		}
	};

	/** TODO comment */
	chart._draw = function(columns, values) {
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