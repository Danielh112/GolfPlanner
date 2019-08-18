/* Start and end of current day */
let calendarEl;
let calendar;

let startDate = new Date(new Date().setHours(0, 0, 0, 0));
let endDate = new Date(new Date().setHours(24, 0, 0, 0));

$(document).ready(function() {

  initialise();

  $('#addEventBtn').click(function() {
    $('#addEventModal').modal('show');
  });

  $('#addEventSubmit').click(function() {
    addEvent();
    event.preventDefault();
  });

  $('#eventDateInput').val(new Date().toDateInputValue());
});

function initialise() {
  displayCalendar();
}

function displayCalendar() {
  calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    height: 550,
    plugins: ['timeGrid', 'dayGrid'],
    defaultView: 'timeGridDay',
    minTime: "07:00:00",
    maxTime: "20:00:00",
    events: getEvents(startDate.toISOString(), endDate.toISOString()),
  });

  calendar.render();
}

/* Retrieve a list of all events between a set time period */
function getEvents(start, end) {
  $.ajax({
    url: '../api/calendar',
    type: 'get',
    data: {
      start: start,
      end: end
    },
    dataType: 'json',
    success: function(response) {
      calendar.addEventSource(response);
      return response;
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function addEvent() {
  formData = {};

  $.each($('#addEventForm').serializeArray(), function() {
    formData[this.name] = this.value;
  });

  start = new Date(Date.parse(formData.eventDateInput + ':' + formData.startTimeInput)).toISOString();
  end = new Date(Date.parse(formData.eventDateInput + ':' + formData.endTimeInput)).toISOString();
  $.ajax({
    url: '../api/calendar/addEvent',
    type: 'post',
    data: {
      title: formData.title,
      lessonType: formData.lessonType,
      start: start,
      end: end
    },
    dataType: 'json',
    success: function(response) {
      return response;
    },
    error: function(err) {
      console.log(err);
    }
  });
  $('#addEventModal').modal('hide');
}

Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
});

function modifyEvent() {

}

function removeEvent() {

}
