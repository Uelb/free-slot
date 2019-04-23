var Event = require('./event')

var startDate = new Date(2016,6,1,10,30); // July 1st, 10:30
var endDate = new Date(2016,6,1,14,00); // July 1st, 14:00

new Event(true, true, startDate, endDate); // weekly recurring opening in calendar

var startDate = new Date(2016, 5, 21, 10,30); // June 21st, 10:30
var endDate = new Date(2016, 5, 21, 14,00); // June 21st, 14:00

new Event(true, true, startDate, endDate); //

var startDate = new Date(2016, 5, 14, 10,30); // June 14th 10:30
var endDate = new Date(2016, 5, 14, 12,00); // June 14th 12:30

new Event(false, true, startDate, endDate); //

startDate = new Date(2016, 6, 8, 11, 30); // July 8th 11:30
endDate = new Date(2016, 6, 8, 12, 30); // July 8th 12:30
new Event(false, false, startDate, endDate); // intervention scheduled

var fromDate = new Date(2016,6,4,10,00); // July 4th 10:00
var toDate = new Date(2016,6,10,10,00); // July 10th 10:00

var availabilities = Event.prototype.availabilities(fromDate, toDate);

console.log(availabilities)

/*
[ { startDate: 2016-07-05T10:00:00.000Z,
   endDate: 2016-07-05T12:00:00.000Z },
 { startDate: 2016-07-08T08:30:00.000Z,
   endDate: 2016-07-08T09:30:00.000Z },
 { startDate: 2016-07-08T10:30:00.000Z,
   endDate: 2016-07-08T12:00:00.000Z } ]
 */
