const express = require('express');
const cors = require('cors');
require('express-async-errors');
const bodyParser = require("body-parser");
const postgres = require('../routes/postgresConnection')
const calendar = require('../routes/calendar')
const clients = require('../routes/clients')
const path = require('path');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(cors());
  app.use('/api/db', postgres.router);
  app.use('/api/calendar', calendar.router);
  app.use('/api/clients', clients.router);
  app.use(error);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.set('view engine', 'ejs');
  app.get('/', function (req, res) {
	res.render('index');
  })
  app.get('/clients', function (req, res) {
  res.render('clients');
  })
}
