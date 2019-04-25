var Event = require('./event')

var assert = require('assert');

describe('Array', function() {

  beforeEach(function() {
    Event.prototype.clear();
  });

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

	it('getOpenSlots', function(){
		var fullSlots = [ new Date('2016-07-04'),
     									new Date('2016-07-05'),
     									new Date('2016-07-06'),
     									new Date('2016-07-07'),
     									new Date('2016-07-08'),
     									new Date('2016-07-09'),
     									new Date('2016-07-10') ];

		var recurringOpen = {
			'2': { startDate: new Date('2016-06-21T08:30:00.000Z'), endDate: new Date('2016-06-21T12:00:00.000Z') },
			'5': { startDate: new Date('2016-07-01T08:30:00.000Z'), endDate: new Date('2016-07-01T12:00:00.000Z') },
		}

		var openInterList = [];
		var results = Event.prototype.getOpenSlots(fullSlots, recurringOpen, openInterList)
		var expectedResults = [
			{ startDate: new Date('2016-07-05T08:30:00.000Z'), endDate: new Date('2016-07-05T12:00:00.000Z')},
			{ startDate: new Date('2016-07-08T08:30:00.000Z'), endDate: new Date('2016-07-08T12:00:00.000Z')}
		]

		assert.equal(results[0].startDate.getTime() === expectedResults[0].startDate.getTime(), true)
		assert.equal(results[0].endDate.getTime() === expectedResults[0].endDate.getTime(), true)
	})

	it('mergeBusyRecurringSlots should return true', function(){
		var fullSlots = [
			{ startDate: new Date('2016-07-05T08:30:00.000Z'), endDate: new Date('2016-07-05T12:00:00.000Z')},
			{ startDate: new Date('2016-07-08T08:30:00.000Z'), endDate: new Date('2016-07-08T12:00:00.000Z')}
		]

		var recurringBusy = {
			'2': { startDate: new Date('2016-06-14T08:30:00.000Z'), endDate: new Date('2016-06-14T10:00:00.000Z') },
		}

		var results = Event.prototype.mergeBusyRecurringSlots(fullSlots, recurringBusy)
		var expectedResults = [
			{ startDate: new Date('2016-07-05T10:00:00.000Z'), endDate: new Date('2016-07-05T12:00:00.000Z')},
			{ startDate: new Date('2016-07-08T08:30:00.000Z'), endDate: new Date('2016-07-08T12:00:00.000Z')}
		]


		assert.equal(results[0].startDate.getTime() === expectedResults[0].startDate.getTime(), true)
		assert.equal(results[0].endDate.getTime() === expectedResults[0].endDate.getTime(), true)
	})

	it('mergeBusyInterventSlots should return true', function(){
		var fullSlots = [
			{ startDate: new Date('2016-07-05T10:00:00.000Z'), endDate: new Date('2016-07-05T12:00:00.000Z')},
			{ startDate: new Date('2016-07-08T08:30:00.000Z'), endDate: new Date('2016-07-08T12:00:00.000Z')}
		]

		var busyInterList = [{ startDate: new Date('2016-07-08T09:30:00.000Z'), endDate: new Date('2016-07-08T10:30:00.000Z')}]

		var results = Event.prototype.mergeBusyInterventSlots(fullSlots, busyInterList);
		results = Event.prototype.flat(results);

		var expectedResults = [
			{ startDate: new Date('2016-07-05T10:00:00.000Z'), endDate: new Date('2016-07-05T12:00:00.000Z')},
			{ startDate: new Date('2016-07-08T08:30:00.000Z'), endDate: new Date('2016-07-08T09:30:00.000Z')},
			{ startDate: new Date('2016-07-08T10:30:00.000Z'), endDate: new Date('2016-07-08T12:00:00.000Z')}
		]

		assert.equal(results[0].startDate.getTime() === expectedResults[0].startDate.getTime(), true)
		assert.equal(results[0].endDate.getTime() === expectedResults[0].endDate.getTime(), true)
	})

	it('availabilities should return true', function(){
		var fromDate = new Date(2016,6,4,10,00); // July 4th 10:00
		var toDate = new Date(2016,6,10,10,00); // July 10th 10:00

		var startDate1 = new Date(2016,6,1,10,30); // July 1st, 10:30
		var endDate1 = new Date(2016,6,1,14,00); // July 1st, 14:00

		new Event(true, true, startDate1, endDate1); // weekly recurring opening in calendar

		var startDate2 = new Date(2016, 5, 21, 10,30); // June 21st, 10:30
		var endDate2 = new Date(2016, 5, 21, 14,00); // June 21st, 14:00

		new Event(true, true, startDate2, endDate2); //

		var startDate3 = new Date(2016, 5, 14, 10,30); // June 14th 10:30
		var endDate3 = new Date(2016, 5, 14, 12,00); // June 14th 12:30

		new Event(false, true, startDate3, endDate3); //

		var startDate4 = new Date(2016, 6, 8, 11, 30); // July 8th 11:30
		var endDate4 = new Date(2016, 6, 8, 12, 30); // July 8th 12:30
		new Event(false, false, startDate4, endDate4); // intervention scheduled

		var fromDate = new Date(2016,6,4,10,00); // July 4th 10:00
		var toDate = new Date(2016,6,10,10,00); // July 10th 10:00

		var results = Event.prototype.availabilities(fromDate, toDate);
		results = Event.prototype.flat(results);

		var expectedResults = [
			{ startDate: new Date('2016-07-05T10:00:00.000Z'), endDate: new Date('2016-07-05T12:00:00.000Z')},
			{ startDate: new Date('2016-07-08T08:30:00.000Z'), endDate: new Date('2016-07-08T09:30:00.000Z')},
			{ startDate: new Date('2016-07-08T10:30:00.000Z'), endDate: new Date('2016-07-08T12:00:00.000Z')}
		]

		assert.equal(results[0].startDate.getTime() === expectedResults[0].startDate.getTime(), true)
		assert.equal(results[0].endDate.getTime() === expectedResults[0].endDate.getTime(), true)
	});

	it('failing case 1', function() {
    var fromDate = new Date('2016-07-05T13:00:00.000Z');
    var toDate = new Date('2016-07-05T19:00:00.000Z');
    new Event(true, false, new Date('2016-07-05T12:00:00.000Z'), new Date('2016-07-05T16:00:00.000Z'));
    var results = Event.prototype.availabilities(fromDate, toDate);
    assert.deepEqual(results, [{
      startDate: new Date('2016-07-05T13:00:00.000Z'),
      endDate: new Date('2016-07-05T16:00:00.000Z')
    }])
	});

  it('failing case 2', function() {
    var fromDate = new Date('2016-07-05T08:00:00.000Z');
    var toDate = new Date('2016-07-05T19:00:00.000Z');
    new Event(true, true, new Date('2016-06-27T12:00:00.000Z'), new Date('2016-06-28T16:00:00.000Z'));
    var results = Event.prototype.availabilities(fromDate, toDate);
    assert.deepEqual(results, [{
      startDate: new Date('2016-07-05T12:00:00.000Z'),
      endDate: new Date('2016-07-05T16:00:00.000Z')
    }])
  });

});
