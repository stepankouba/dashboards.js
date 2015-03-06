'use strict';

describe('DBS.js init', function(){
	var conf, chart;

	beforeEach(function(){
		conf = {
			id: 'id1',
			width: 100,
			height: 100
		};

		chart = {
			type: 'arcone',
			thresholds: [
				{className: 'class1', minVal: 0, maxVal: .5},
				{className: 'class1', minVal: .5, maxVal: 1},
			]
		};
	});


	it('should create basic framework methods and objects', function(){
		expect(DBS).toBeDefined();
		expect(DBS.Charts).toBeDefined();
		expect(DBS.Charts.Chart).toBeDefined();
		expect(DBS.Charts.addType).toBeDefined();
		expect(DBS.Charts.getType).toBeDefined();
		expect(DBS.Charts.getAvailableTypes).toBeDefined();
		expect(DBS.Utils).toBeDefined();
		expect(DBS.Utils.uuid).toBeDefined();
	});

	it('should privately init (_init)', function(){
		// expect error to be thrown
		expect(function(){ DBS._init({svg: true}); })
			.toThrow(new Error('DBS: Can not init DBS for SVG usage withou specifying width and hieght of SVG element'));
	});

	it('should create list of chart types', function(){
		var listOfTypes = ['arcone', 'bar', 'gauge', 'indicator', 'line', 'number', 'pie', 'semaphore', 'stackedbar', 'table'],
			list = DBS.Charts.getAvailableTypes();

		expect(list).toEqual(listOfTypes);
	});
});