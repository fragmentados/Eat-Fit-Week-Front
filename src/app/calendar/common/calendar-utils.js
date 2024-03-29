var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};
export var DAYS_OF_WEEK;
(function (DAYS_OF_WEEK) {
  DAYS_OF_WEEK[DAYS_OF_WEEK["SUNDAY"] = 0] = "SUNDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["MONDAY"] = 1] = "MONDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["TUESDAY"] = 2] = "TUESDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["WEDNESDAY"] = 3] = "WEDNESDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["THURSDAY"] = 4] = "THURSDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["FRIDAY"] = 5] = "FRIDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["SATURDAY"] = 6] = "SATURDAY";
})(DAYS_OF_WEEK || (DAYS_OF_WEEK = {}));
var DEFAULT_WEEKEND_DAYS = [
  DAYS_OF_WEEK.SUNDAY,
  DAYS_OF_WEEK.SATURDAY
];
/*var DEFAULT_MEAL_NAMES = [*/
  /*"DESAYUNO",*/
  /*"MEDIA MAÑANA",*/
  /*"COMIDA",*/
  /*"MERIENDA",*/
  /*"CENA"*/
/*];*/

var DAYS_IN_WEEK = 7;
/*var MEALS_IN_DAY = DEFAULT_MEAL_NAMES.length;*/
var MINUTES_IN_HOUR = 60;
export var SECONDS_IN_DAY = 60 * 60 * 24;
function getExcludedSeconds(dateAdapter, _a) {
  var startDate = _a.startDate, seconds = _a.seconds, excluded = _a.excluded, _b = _a.precision, precision = _b === void 0 ? 'days' : _b;
  if (excluded.length < 1) {
      return 0;
  }
  var addSeconds = dateAdapter.addSeconds, getDay = dateAdapter.getDay, addDays = dateAdapter.addDays;
  var endDate = addSeconds(startDate, seconds - 1);
  var dayStart = getDay(startDate);
  var dayEnd = getDay(endDate);
  var result = 0; // Calculated in seconds
  var current = startDate;
  var _loop_1 = function () {
      var day = getDay(current);
      if (excluded.some(function (excludedDay) { return excludedDay === day; })) {
          result += calculateExcludedSeconds(dateAdapter, {
              dayStart: dayStart,
              dayEnd: dayEnd,
              day: day,
              precision: precision,
              startDate: startDate,
              endDate: endDate
          });
      }
      current = addDays(current, 1);
  };
  while (current < endDate) {
      _loop_1();
  }
  return result;
}
function calculateExcludedSeconds(dateAdapter, _a) {
  var precision = _a.precision, day = _a.day, dayStart = _a.dayStart, dayEnd = _a.dayEnd, startDate = _a.startDate, endDate = _a.endDate;
  var differenceInSeconds = dateAdapter.differenceInSeconds, endOfDay = dateAdapter.endOfDay, startOfDay = dateAdapter.startOfDay;
  if (precision === 'minutes') {
      if (day === dayStart) {
          return differenceInSeconds(endOfDay(startDate), startDate) + 1;
      }
      else if (day === dayEnd) {
          return differenceInSeconds(endDate, startOfDay(endDate)) + 1;
      }
  }
  return SECONDS_IN_DAY;
}
function getWeekViewEventSpan(dateAdapter, _a) {
  var event = _a.event, offset = _a.offset, startOfWeekDate = _a.startOfWeekDate, excluded = _a.excluded, _b = _a.precision, precision = _b === void 0 ? 'days' : _b, totalDaysInView = _a.totalDaysInView;
  var max = dateAdapter.max, differenceInSeconds = dateAdapter.differenceInSeconds, addDays = dateAdapter.addDays, endOfDay = dateAdapter.endOfDay, differenceInDays = dateAdapter.differenceInDays;
  var span = SECONDS_IN_DAY;
  var begin = max(event.start, startOfWeekDate);
  if (event.end) {
      switch (precision) {
          case 'minutes':
              span = differenceInSeconds(event.end, begin);
              break;
          default:
              span =
                  differenceInDays(addDays(endOfDay(event.end), 1), begin) *
                      SECONDS_IN_DAY;
              break;
      }
  }
  var offsetSeconds = offset * SECONDS_IN_DAY;
  var totalLength = offsetSeconds + span;
  // the best way to detect if an event is outside the week-view
  // is to check if the total span beginning (from startOfWeekDay or event start) exceeds the total days in the view
  var secondsInView = totalDaysInView * SECONDS_IN_DAY;
  if (totalLength > secondsInView) {
      span = secondsInView - offsetSeconds;
  }
  span -= getExcludedSeconds(dateAdapter, {
      startDate: begin,
      seconds: span,
      excluded: excluded,
      precision: precision
  });
  return span / SECONDS_IN_DAY;
}
export function getWeekViewEventOffset(dateAdapter, _a) {
  var event = _a.event, startOfWeekDate = _a.startOfWeek, _b = _a.excluded, excluded = _b === void 0 ? [] : _b, _c = _a.precision, precision = _c === void 0 ? 'days' : _c;
  var differenceInDays = dateAdapter.differenceInDays, startOfDay = dateAdapter.startOfDay, differenceInSeconds = dateAdapter.differenceInSeconds;
  if (event.start < startOfWeekDate) {
      return 0;
  }
  var offset = 0;
  switch (precision) {
      case 'days':
          offset =
              differenceInDays(startOfDay(event.start), startOfWeekDate) *
                  SECONDS_IN_DAY;
          break;
      case 'minutes':
          offset = differenceInSeconds(event.start, startOfWeekDate);
          break;
  }
  offset -= getExcludedSeconds(dateAdapter, {
      startDate: startOfWeekDate,
      seconds: offset,
      excluded: excluded,
      precision: precision
  });
  return Math.abs(offset / SECONDS_IN_DAY);
}
function isEventIsPeriod(dateAdapter, _a) {
  var event = _a.event, periodStart = _a.periodStart, periodEnd = _a.periodEnd;
  var isSameSecond = dateAdapter.isSameSecond;
  var eventStart = event.start;
  var eventEnd = event.end || event.start;
  if (eventStart > periodStart && eventStart < periodEnd) {
      return true;
  }
  if (eventEnd > periodStart && eventEnd < periodEnd) {
      return true;
  }
  if (eventStart < periodStart && eventEnd > periodEnd) {
      return true;
  }
  if (isSameSecond(eventStart, periodStart) ||
      isSameSecond(eventStart, periodEnd)) {
      return true;
  }
  if (isSameSecond(eventEnd, periodStart) ||
      isSameSecond(eventEnd, periodEnd)) {
      return true;
  }
  return false;
}
export function getEventsInPeriod(dateAdapter, _a) {
  var events = _a.events, periodStart = _a.periodStart, periodEnd = _a.periodEnd;
  return events.filter(function (event) {
      return isEventIsPeriod(dateAdapter, { event: event, periodStart: periodStart, periodEnd: periodEnd });
  });
}
function getWeekDay(dateAdapter, _a) {
  var date = _a.date, _b = _a.weekendDays, weekendDays = _b === void 0 ? DEFAULT_WEEKEND_DAYS : _b;
  var startOfDay = dateAdapter.startOfDay, isSameDay = dateAdapter.isSameDay, getDay = dateAdapter.getDay;
  var today = startOfDay(new Date());
  var day = getDay(date);
  return {
      date: date,
      day: day,
      isPast: date < today,
      isToday: isSameDay(date, today),
      isFuture: date > today,
      isWeekend: weekendDays.indexOf(day) > -1
  };
}
export function getWeekViewHeader(dateAdapter, _a) {
  var viewDate = _a.viewDate, weekStartsOn = _a.weekStartsOn, _b = _a.excluded, excluded = _b === void 0 ? [] : _b, weekendDays = _a.weekendDays, _c = _a.viewStart, viewStart = _c === void 0 ? dateAdapter.startOfWeek(viewDate, { weekStartsOn: weekStartsOn }) : _c, _d = _a.viewEnd, viewEnd = _d === void 0 ? dateAdapter.addDays(viewStart, DAYS_IN_WEEK) : _d;
  var addDays = dateAdapter.addDays, getDay = dateAdapter.getDay;
  var days = [];
  var date = viewStart;
  while (date < viewEnd) {
      if (!excluded.some(function (e) { return getDay(date) === e; })) {
          days.push(getWeekDay(dateAdapter, { date: date, weekendDays: weekendDays }));
      }
      date = addDays(date, 1);
  }
  return days;
}
export function getDifferenceInDaysWithExclusions(dateAdapter, _a) {
  var date1 = _a.date1, date2 = _a.date2, excluded = _a.excluded;
  var date = date1;
  var diff = 0;
  while (date < date2) {
      if (excluded.indexOf(dateAdapter.getDay(date)) === -1) {
          diff++;
      }
      date = dateAdapter.addDays(date, 1);
  }
  return diff;
}
function getAllDayWeekEvents(dateAdapter, _a) {
  var events = _a.events, excluded = _a.excluded, precision = _a.precision, absolutePositionedEvents = _a.absolutePositionedEvents, viewStart = _a.viewStart, viewEnd = _a.viewEnd, eventsInPeriod = _a.eventsInPeriod;
  var differenceInSeconds = dateAdapter.differenceInSeconds, differenceInDays = dateAdapter.differenceInDays;
  var maxRange = getDifferenceInDaysWithExclusions(dateAdapter, {
      date1: viewStart,
      date2: viewEnd,
      excluded: excluded
  });
  var totalDaysInView = differenceInDays(viewEnd, viewStart) + 1;
  var eventsMapped = eventsInPeriod
      .filter(function (event) { return event.allDay; })
      .map(function (event) {
      var offset = getWeekViewEventOffset(dateAdapter, {
          event: event,
          startOfWeek: viewStart,
          excluded: excluded,
          precision: precision
      });
      var span = getWeekViewEventSpan(dateAdapter, {
          event: event,
          offset: offset,
          startOfWeekDate: viewStart,
          excluded: excluded,
          precision: precision,
          totalDaysInView: totalDaysInView
      });
      return { event: event, offset: offset, span: span };
  })
      .filter(function (e) { return e.offset < maxRange; })
      .filter(function (e) { return e.span > 0; })
      .map(function (entry) { return ({
      event: entry.event,
      offset: entry.offset,
      span: entry.span,
      startsBeforeWeek: entry.event.start < viewStart,
      endsAfterWeek: (entry.event.end || entry.event.start) > viewEnd
  }); })
      .sort(function (itemA, itemB) {
      var startSecondsDiff = differenceInSeconds(itemA.event.start, itemB.event.start);
      if (startSecondsDiff === 0) {
          return differenceInSeconds(itemB.event.end || itemB.event.start, itemA.event.end || itemA.event.start);
      }
      return startSecondsDiff;
  });
  var allDayEventRows = [];
  var allocatedEvents = [];
  eventsMapped.forEach(function (event, index) {
      if (allocatedEvents.indexOf(event) === -1) {
          allocatedEvents.push(event);
          var rowSpan_1 = event.span + event.offset;
          var otherRowEvents = eventsMapped
              .slice(index + 1)
              .filter(function (nextEvent) {
              if (nextEvent.offset >= rowSpan_1 &&
                  rowSpan_1 + nextEvent.span <= totalDaysInView &&
                  allocatedEvents.indexOf(nextEvent) === -1) {
                  var nextEventOffset = nextEvent.offset - rowSpan_1;
                  if (!absolutePositionedEvents) {
                      nextEvent.offset = nextEventOffset;
                  }
                  rowSpan_1 += nextEvent.span + nextEventOffset;
                  allocatedEvents.push(nextEvent);
                  return true;
              }
          });
          var weekEvents = [event].concat(otherRowEvents);
          var id = weekEvents
              .filter(function (weekEvent) { return weekEvent.event.id; })
              .map(function (weekEvent) { return weekEvent.event.id; })
              .join('-');
          allDayEventRows.push(__assign({ row: weekEvents }, (id ? { id: id } : {})));
      }
  });
  return allDayEventRows;
}
function getWeekViewHourGrid(dateAdapter, _a) {
  var events = _a.events, viewDate = _a.viewDate, hourSegments = _a.hourSegments, dayStart = _a.dayStart, dayEnd = _a.dayEnd, weekStartsOn = _a.weekStartsOn, excluded = _a.excluded, weekendDays = _a.weekendDays, segmentHeight = _a.segmentHeight, viewStart = _a.viewStart, viewEnd = _a.viewEnd, mealsInWeek = _a.mealsInWeek;
  var dayViewHourGrid = getDayViewHourGrid(dateAdapter, {
      viewDate: viewDate,
      hourSegments: hourSegments,
      dayStart: dayStart,
      dayEnd: dayEnd,
      mealsInWeek: mealsInWeek
  });
  var weekDays = getWeekViewHeader(dateAdapter, {
      viewDate: viewDate,
      weekStartsOn: weekStartsOn,
      excluded: excluded,
      weekendDays: weekendDays,
      viewStart: viewStart,
      viewEnd: viewEnd
  });
  var setHours = dateAdapter.setHours, setMinutes = dateAdapter.setMinutes, getHours = dateAdapter.getHours, getMinutes = dateAdapter.getMinutes;
  return weekDays.map(function (day) {
      var dayView = getDayView(dateAdapter, {
          events: events,
          viewDate: day.date,
          hourSegments: hourSegments,
          dayStart: dayStart,
          dayEnd: dayEnd,
          segmentHeight: segmentHeight,
          eventWidth: 1
      });
      var meals = dayViewHourGrid.map(function (hour) {
          var segments = hour.segments.map(function (segment) {
              var date = setMinutes(setHours(day.date, getHours(segment.date)), getMinutes(segment.date));
              return __assign({}, segment, { date: date });
          });
          return __assign({}, hour, { segments: segments });
      });
      function getColumnCount(allEvents, prevOverlappingEvents) {
          var columnCount = Math.max.apply(Math, prevOverlappingEvents.map(function (iEvent) { return iEvent.left + 1; }));
          var nextOverlappingEvents = allEvents
              .filter(function (iEvent) { return iEvent.left >= columnCount; })
              .filter(function (iEvent) {
              return (getOverLappingDayViewEvents(prevOverlappingEvents, iEvent.top, iEvent.top + iEvent.height).length > 0);
          });
          if (nextOverlappingEvents.length > 0) {
              return getColumnCount(allEvents, nextOverlappingEvents);
          }
          else {
              return columnCount;
          }
      }
      var mappedEvents = dayView.events.map(function (event) {
          var columnCount = getColumnCount(dayView.events, getOverLappingDayViewEvents(dayView.events, event.top, event.top + event.height));
          var width = 100 / columnCount;
          return __assign({}, event, { left: event.left * width, width: width });
      });
      return {
          meals: meals,
          date: day.date,
          events: mappedEvents.map(function (event) {
              var overLappingEvents = getOverLappingDayViewEvents(mappedEvents.filter(function (otherEvent) { return otherEvent.left > event.left; }), event.top, event.top + event.height);
              if (overLappingEvents.length > 0) {
                  return __assign({}, event, { width: Math.min.apply(Math, overLappingEvents.map(function (otherEvent) { return otherEvent.left; })) - event.left });
              }
              return event;
          })
      };
  });
}
export function getWeekView(dateAdapter, _a) {
  var _b = _a.events, events = _b === void 0 ? [] : _b, viewDate = _a.viewDate, weekStartsOn = _a.weekStartsOn, _c = _a.excluded, excluded = _c === void 0 ? [] : _c, _d = _a.precision, precision = _d === void 0 ? 'days' : _d, _e = _a.absolutePositionedEvents, absolutePositionedEvents = _e === void 0 ? false : _e, hourSegments = _a.hourSegments, dayStart = _a.dayStart, dayEnd = _a.dayEnd, weekendDays = _a.weekendDays, segmentHeight = _a.segmentHeight, _f = _a.viewStart, viewStart = _f === void 0 ? dateAdapter.startOfWeek(viewDate, { weekStartsOn: weekStartsOn }) : _f, _g = _a.viewEnd, viewEnd = _g === void 0 ? dateAdapter.endOfWeek(viewDate, { weekStartsOn: weekStartsOn }) : _g;
  var mealsInWeek = _a.mealsInWeek;
  if (!events) {
      events = [];
  }
  var startOfDay = dateAdapter.startOfDay, endOfDay = dateAdapter.endOfDay;
  viewStart = startOfDay(viewStart);
  viewEnd = endOfDay(viewEnd);
  var eventsInPeriod = getEventsInPeriod(dateAdapter, {
      events: events,
      periodStart: viewStart,
      periodEnd: viewEnd
  });
  var header = getWeekViewHeader(dateAdapter, {
      viewDate: viewDate,
      weekStartsOn: weekStartsOn,
      excluded: excluded,
      weekendDays: weekendDays,
      viewStart: viewStart,
      viewEnd: viewEnd
  });
  return {
      allDayEventRows: getAllDayWeekEvents(dateAdapter, {
          events: events,
          excluded: excluded,
          precision: precision,
          absolutePositionedEvents: absolutePositionedEvents,
          viewStart: viewStart,
          viewEnd: viewEnd,
          eventsInPeriod: eventsInPeriod
      }),
      period: {
          events: eventsInPeriod,
          start: header[0].date,
          end: endOfDay(header[header.length - 1].date)
      },
      hourColumns: getWeekViewHourGrid(dateAdapter, {
          events: events,
          viewDate: viewDate,
          hourSegments: hourSegments,
          dayStart: dayStart,
          dayEnd: dayEnd,
          weekStartsOn: weekStartsOn,
          excluded: excluded,
          weekendDays: weekendDays,
          segmentHeight: segmentHeight,
          viewStart: viewStart,
          viewEnd: viewEnd,
          mealsInWeek: mealsInWeek
      })
  };
}

function getOverLappingDayViewEvents(events, top, bottom) {
  return events.filter(function (previousEvent) {
      var previousEventTop = previousEvent.top;
      var previousEventBottom = previousEvent.top + previousEvent.height;
      if (top < previousEventBottom && previousEventBottom < bottom) {
          return true;
      }
      else if (top < previousEventTop && previousEventTop < bottom) {
          return true;
      }
      else if (previousEventTop <= top && bottom <= previousEventBottom) {
          return true;
      }
      return false;
  });
}
export function getDayView(dateAdapter, _a) {
  var _b = _a.events, events = _b === void 0 ? [] : _b, viewDate = _a.viewDate, hourSegments = _a.hourSegments, dayStart = _a.dayStart, dayEnd = _a.dayEnd, eventWidth = _a.eventWidth, segmentHeight = _a.segmentHeight;
  if (!events) {
      events = [];
  }
  var setMinutes = dateAdapter.setMinutes, setHours = dateAdapter.setHours, startOfDay = dateAdapter.startOfDay, startOfMinute = dateAdapter.startOfMinute, endOfDay = dateAdapter.endOfDay, differenceInMinutes = dateAdapter.differenceInMinutes;
  var startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
  var endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
  var previousDayEvents = [];
  var eventsInPeriod = getEventsInPeriod(dateAdapter, {
      events: events.filter(function (event) { return !event.allDay; }),
      periodStart: startOfView,
      periodEnd: endOfView
  });
  var dayViewEvents = eventsInPeriod
      .sort(function (eventA, eventB) {
      return eventA.start.valueOf() - eventB.start.valueOf();
  })
      .map(function (event) {
      var eventStart = event.start;
      var eventEnd = event.end || eventStart;
      var startsBeforeDay = eventStart < startOfView;
      var endsAfterDay = eventEnd > endOfView;
      var hourHeightModifier = (hourSegments * segmentHeight) / MINUTES_IN_HOUR;
      var top = 0;
      if (eventStart > startOfView) {
          top += differenceInMinutes(eventStart, startOfView);
      }
      top *= hourHeightModifier;
      var startDate = startsBeforeDay ? startOfView : eventStart;
      var endDate = endsAfterDay ? endOfView : eventEnd;
      var height = differenceInMinutes(endDate, startDate);
      if (!event.end) {
          height = segmentHeight;
      }
      else {
          height *= hourHeightModifier;
      }
      var bottom = top + height;
      var overlappingPreviousEvents = getOverLappingDayViewEvents(previousDayEvents, top, bottom);
      var left = 0;
      while (overlappingPreviousEvents.some(function (previousEvent) { return previousEvent.left === left; })) {
          left += eventWidth;
      }
      var dayEvent = {
          event: event,
          height: height,
          width: eventWidth,
          top: top,
          left: left,
          startsBeforeDay: startsBeforeDay,
          endsAfterDay: endsAfterDay
      };
      previousDayEvents.push(dayEvent);
      return dayEvent;
  });
  var width = Math.max.apply(Math, dayViewEvents.map(function (event) { return event.left + event.width; }));
  var allDayEvents = getEventsInPeriod(dateAdapter, {
      events: events.filter(function (event) { return event.allDay; }),
      periodStart: startOfDay(startOfView),
      periodEnd: endOfDay(endOfView)
  });
  return {
      events: dayViewEvents,
      width: width,
      allDayEvents: allDayEvents,
      period: {
          events: eventsInPeriod,
          start: startOfView,
          end: endOfView
      }
  };
}
function sanitiseHours(hours) {
  return Math.max(Math.min(23, hours), 0);
}
function sanitiseMinutes(minutes) {
  return Math.max(Math.min(59, minutes), 0);
}
export function getDayViewHourGrid(dateAdapter, _a) {
  var viewDate = _a.viewDate, hourSegments = _a.hourSegments, dayStart = _a.dayStart, dayEnd = _a.dayEnd;
  var DEFAULT_MEAL_NAMES = _a.mealsInWeek;
  var MEALS_IN_DAY = DEFAULT_MEAL_NAMES.length;
  var setMinutes = dateAdapter.setMinutes, setHours = dateAdapter.setHours, startOfDay = dateAdapter.startOfDay, startOfMinute = dateAdapter.startOfMinute, endOfDay = dateAdapter.endOfDay, addMinutes = dateAdapter.addMinutes, addHours = dateAdapter.addHours;
  var hours = [];
  var startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
  var endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
  var segmentDuration = MINUTES_IN_HOUR / hourSegments;
  var startOfViewDay = startOfDay(viewDate);
  for (var i = 0; i < MEALS_IN_DAY; i++) {
      var segments = [];
      for (var j = 0; j < hourSegments; j++) {
          var date = addMinutes(addHours(startOfViewDay, i), j * segmentDuration);
          if (date >= startOfView && date < endOfView) {
              segments.push({
                  date: date,
                  name: DEFAULT_MEAL_NAMES[i],
                  isStart: j === 0
              });
          }
      }
      if (segments.length > 0) {
          hours.push({ segments: segments });
      }
  }
  return hours;
}
export var EventValidationErrorMessage;
(function (EventValidationErrorMessage) {
  EventValidationErrorMessage["NotArray"] = "Events must be an array";
  EventValidationErrorMessage["StartPropertyMissing"] = "Event is missing the `start` property";
  EventValidationErrorMessage["StartPropertyNotDate"] = "Event `start` property should be a javascript date object. Do `new Date(event.start)` to fix it.";
  EventValidationErrorMessage["EndPropertyNotDate"] = "Event `end` property should be a javascript date object. Do `new Date(event.end)` to fix it.";
  EventValidationErrorMessage["EndsBeforeStart"] = "Event `start` property occurs after the `end`";
})(EventValidationErrorMessage || (EventValidationErrorMessage = {}));
export function validateEvents(events, log) {
  var isValid = true;
  function isError(msg, event) {
      log(msg, event);
      isValid = false;
  }
  if (!Array.isArray(events)) {
      log(EventValidationErrorMessage.NotArray, events);
      return false;
  }
  events.forEach(function (event) {
      if (!event.start) {
          isError(EventValidationErrorMessage.StartPropertyMissing, event);
      }
      else if (!(event.start instanceof Date)) {
          isError(EventValidationErrorMessage.StartPropertyNotDate, event);
      }
      if (event.end) {
          if (!(event.end instanceof Date)) {
              isError(EventValidationErrorMessage.EndPropertyNotDate, event);
          }
          if (event.start > event.end) {
              isError(EventValidationErrorMessage.EndsBeforeStart, event);
          }
      }
  });
  return isValid;
}
//# sourceMappingURL=calendar-utils.js.map
