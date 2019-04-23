var eventList = [];

var Event = function(opening, recurring, startDate, endDate){
  this.opening = opening;
  this.recurring = recurring;
  this.startDate = startDate;
  this.endDate = endDate;

  eventList.push(this);
};

Event.prototype.getDatesBetween = function(startDate, endDate) {
  var dates = [], currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

Event.prototype.isBetween = function(date, from, to) {
  if((date.endDate.getTime() <= to.getTime()
    && date.startDate.getTime() >= from.getTime())){
    return true;
  }
  return false;
};

Event.prototype.sorted = function(arr) {
    return arr
      .sort(function (a, b) { return a.startDate - b.startDate || a.endDate - b.endDate; })
      .reduce(function (r, a) {
        var last = r[r.length - 1] || [];
        if (last.startDate <= a.startDate && a.startDate <= last.endDate) {
            if (last.endDate < a.endDate) {
                last.endDate = a.endDate;
            }
            return r;
        }
        return r.concat(a);
    }, []);
}

Event.prototype.availabilities = function(fromDate, toDate){
  // sort slot and merge if overlap
  var sortedList = Event.prototype.sorted(eventList);

  // open list
  var openList = sortedList.filter(function(date){ return date.opening; })
  var openInterList = openList
    .filter(function(date){ return !date.recurring })
    .filter(function(date){ return Event.prototype.isBetween(date, fromDate, toDate)})

  // get recurring open dates
  var recurringOpen = openList
    .filter(function(date){ return date.recurring })
    .reduce(function(acc, date){
      var day = date.startDate.getDay() || date.endDate.getDay();
      if(!acc[day]){acc[day] = date ;}
      return acc;
    }, {});

  // get intervention
  var busyList = sortedList.filter(function(date){ return !date.opening; })
  var busyInterList = busyList
    .filter(function(date){ return !date.recurring })
    .filter(function(date){ return Event.prototype.isBetween(date, fromDate, toDate)})

  // get recurring busy dates
  var recurringBusy = busyList
    .filter(function(date){ return date.recurring })
    .reduce(function(acc, date){
      var day = date.startDate.getDay() || date.endDate.getDay();
      if(!acc[day]){acc[day] = date ;}
      return acc;
    }, {});

  // get free slot recurring between 2 dates
  var freeSlots = Event.prototype.getDatesBetween(fromDate, toDate).reduce(function(acc, openDate) {
    var daysOpen = Object.keys(recurringOpen);
    var currentDay = openDate.getDay().toString();

    if (daysOpen.includes(currentDay)){
      var recurr = recurringOpen[currentDay]

      var startDate = new Date(openDate)
      startDate.setHours(recurr.startDate.getHours())
      startDate.setMinutes(recurr.startDate.getMinutes())

      var endDate = new Date(openDate)
      endDate.setHours(recurr.endDate.getHours())
      endDate.setMinutes(recurr.endDate.getMinutes())

      acc.push({
        startDate : new Date(startDate),
        endDate : new Date(endDate)
      })
    };
    return acc;
  }, []).reduce(function(acc, inter){ // get intervention free slots

    if(!openInterList.length){
      acc = acc.concat(inter);
    }
    acc = acc.concat(openInterList);

    return acc;
  }, []).reduce(function(acc, openDate){ // get busy recurring

    var daysBusy = Object.keys(recurringBusy);
    var currentDay = openDate.startDate.getDay().toString();

    if (!daysBusy.includes(currentDay)) {
      return acc.concat(openDate);
    }
    else {
      var recurr = recurringBusy[currentDay]
      var startDate = new Date(openDate.startDate)
      startDate.setHours(recurr.startDate.getHours())
      startDate.setMinutes(recurr.startDate.getMinutes())

      var endDate = new Date(openDate.startDate)
      endDate.setHours(recurr.endDate.getHours())
      endDate.setMinutes(recurr.endDate.getMinutes())

      if(startDate >= openDate.startDate && endDate <= openDate.endDate){
        var isStartEqual = startDate.getTime() === openDate.startDate.getTime();
        var isEndEqual = endDate.getTime() === openDate.endDate.getTime();
        if( isStartEqual && isEndEqual ){
          acc = acc;
        }
        else if (isStartEqual){
          acc.push({ startDate: endDate, endDate: openDate.endDate })
        }
        else if (isEndEqual){
          acc.push({ startDate: openDate.startDate, endDate: start })
        }
        else {
          var firstSlot = {
            startDate: openDate.startDate,
            endDate: startDate,
          }
          var secondSlot = {
            startDate: endDate,
            endDate: openDate.endDate,
          }
          acc.push(firstSlot, secondSlot)
        }

      }

      return acc;
    }

  }, []).map(function(slot){ // merge with busy between fromDate and toDate

    if(!busyInterList.length){
      return slot;
    }
    var newSlots = [];
    busyInterList.map(function(busySlot){

      if(busySlot.startDate >= slot.startDate && busySlot.endDate <= slot.endDate){
        var isStartEqual = busySlot.startDate.getTime() === slot.startDate.getTime();
        var isEndEqual = busySlot.endDate.getTime() === slot.endDate.getTime();
        if( isStartEqual && isEndEqual ){
          newSlots = newSlots;
        }
        else if (isStartEqual){
          newSlots.push({ startDate: busySlot.endDate, endDate: slot.endDate })
        }
        else if (isEndEqual){
          newSlots.push({ startDate: slot.startDate, endDate: busySlot.startDate })
        }
        else {
          newSlots.push({
            startDate: slot.startDate,
            endDate: busySlot.startDate,
          }, {
            startDate: busySlot.endDate,
            endDate: slot.endDate,
          })
        }
      }
      else { newSlots.push(slot);}
    })

    return newSlots;
  })

  return Event.prototype.flat(freeSlots);
};


Event.prototype.flat = function(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? Event.prototype.flat(toFlatten) : toFlatten);
  }, []);
}

module.exports = Event
