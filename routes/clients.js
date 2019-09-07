const express = require('express');
const postgres = require('./postgresConnection.js');
const router = express.Router();
const config = require('../config/config');
const connectionDetails = config.connectionDetails;
const qs = require('querystring');

/* Retrieve client('s) */
router.get('/', async (req, res, next) => {
  console.log('Retrieving list of clients (limit:' + req.query.limit + ')');

  const query = {
    text: 'SELECT customer_id, full_name AS fullName, credit, last_lesson_date AS lastLessonDate FROM clients',
  }

  if (req.query.fullName && req.query.partialMatch) {
    query.text = 'SELECT full_name AS fullName, credit, last_lesson_date AS lastLessonDate FROM clients WHERE full_name CONTAINS $1';
    query.values = [req.query.name];
  } else if(req.query.fullName) {
    query.text = 'SELECT full_name AS fullName, credit, last_lesson_date AS lastLessonDate FROM clients WHERE full_name = $1';
    query.values = [req.query.name];
  }

  const result = await postgres.query(query, next);
  res.status(200).send(
    result.rows
  );
});

/* Add a client */
router.post('/', async (req, res, next) => {
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
      text: 'INSERT INTO clients(customer_id, full_name, credit, last_lesson_date) VALUES($1, $2, $3, $4)',
      values: [qp.customerId, qp.fullName, qp.credit, qp.last_lesson_date],
    }

    console.log('Adding client ' + qp.fullName);
    const result = await postgres.query(query, next);
    res.status(200).send(
      result
    );
  });
});

/* Charge Client */
router.post('/charge', async (req, res, next) => {
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
      //UPDATE films SET kind = 'Dramatic' WHERE kind = 'Drama';
      text: 'UPDATE clients set credit = credit - $1 WHERE full_name = $2',
      values: [qp.charge, qp.name],
    }

    const result = await postgres.query(query, next);
    res.status(200).send(
      result
    );
  });
});

module.exports = {
  router: router
}
