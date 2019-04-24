var Event = require('./event')

var assert = require('assert');

describe('Array', function() {

  it('isBetween should return true', function() {
		var fromDate = new Date(2016,6,4,10,00); // July 4th 10:00
		var toDate = new Date(2016,6,10,10,00); // July 10th 10:00
		var date = {
			startDate: new Date(2016, 6, 8, 11, 30), // July 8th 11:30
			endDate: new Date(2016, 6, 8, 12, 30), // July 8th 12:30
		}
    assert.equal(Event.prototype.isBetween(date, fromDate, toDate), true);
  });

	it('getDatesBetween should return 5 dates', function(){
		var startDate = new Date(2019, 3, 24, 10, 00); // April 24th 10:00;
		var endDate = new Date(2019, 3, 28, 10, 00); // April 28th 10:00;
		assert.equal(Event.prototype.getDatesBetween(startDate, endDate).length, 5);
	});

	
});
