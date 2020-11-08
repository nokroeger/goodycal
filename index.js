
const express = require('express');
const morgan = require('morgan');
const moment = require('moment');
const fs = require('fs');

const app = express();



app.use(morgan('common'));
app.use(express.static('src/static'));

app.set('views', './src/views')
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.redirect('/show')
});

app.get('/show', function (req, res) {
  res.render('calendar', { title: "Musikalischer\nAdventskalender", subtitle: "der St. Petri Gemeinde in Melle", text1: "Bläsermusik und Texte", text2: "mit den Posaunenchören und der evangelischen Jugend.", calendar_days: generateCalendarDays()})
});

app.get('/healthz', function (req, res) {
  res.send('I am happy and healthy\n');
});

function calculateNumberOfDaysOnCalendar(start_date, end_date) {
  return moment(end_date).diff(moment(start_date), "days") + 1
}

function dayBeganInThePast(check_date) {
  return check_date <= moment();
}

function dayIsToday(check_date) {
  let now = moment();
  console.log(check_date)
  console.log(now)
  return check_date.isSame(now, 'day');
}

function calculateDoorState(check_date) {
  if (dayBeganInThePast(check_date)){
    if (dayIsToday(check_date)){
      return "unlocked today"
    }
    else{
      return "unlocked"
    }
    
  }
  else{
    return "locked"
  }
}

function generateCalendarDays(){
  var calendar = JSON.parse(fs.readFileSync('src/data/calendar.json', 'utf-8'))
  var the_day = moment(calendar.start_date)
  const number_of_days = calculateNumberOfDaysOnCalendar(calendar.start_date, calendar.end_date)
  var calendar_days = []
  for (i = 0; i < number_of_days; i++){
    calendar_days[i] = {"doordate": the_day.format("YYYY-MM-DD"), "doorclass": calculateDoorState(the_day), "goody": calendar.goodies[the_day.format("YYYY-MM-DD")]}
    the_day.add(1, "day")
  }
  return calendar_days;

}

module.exports = app;
