const express = require('express');
const router = express.Router();
const postgres = require('./postgresConnection.js');
const config = require('../config/config');
const connectionDetails = config.connectionDetails;
const qs = require('querystring');

router.post('/addEvent', async (req, res, next) => {
  let body = '';
  req.on('data', function(data) {
    body += data;
    if (body.length > 1e6) {
      req.connection.destroy();
    }
  });
  req.on('end', async function() {

    const qp = qs.parse(body);
    const query = {
      text: 'INSERT INTO calendar(full_name, lesson_type, start_date, end_date) VALUES($1, $2, $3, $4) RETURNING customed_id AS customerId',
      values: [qp.fullName, qp.eventType, qp.start, qp.end],
    }

    const result = await postgres.query(query, next);
    console.log('Event Added between ' + qp.start + ' and ' + qp.end);
    res.status(200).send({
      response: result
    });
  });
});

/* Retrieve calendar events */
router.get('/', async (req, res, next) => {
  console.log('Retrieving calendar events between ' + req.query.start + ' and ' + req.query.end);
  const query = {
    text: 'SELECT full_name AS title, lesson_type, start_date as start, end_date as end FROM calendar WHERE (start_date, end_date) OVERLAPS ($1::TIMESTAMP, $2::TIMESTAMP)',
    values: [req.query.start, req.query.end],
  }

  const result = await postgres.query(query, next);
  res.status(200).send(
    result.rows
  );
});

module.exports = {
  router: router
}
