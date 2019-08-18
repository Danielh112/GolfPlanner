const mongodb = require('mongodb')
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const mongoDBConnection = require('./mongoDBConnection.js');
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

    let query = qs.parse(body);

    const client = await mongoDBConnection.establishConn();
    const db = client.db(connectionDetails.database);

    let event = {
      title: query.title,
      lessonType: query.lessonType,
      start: query.start,
      end: query.end
    }

    db.collection(connectionDetails.calendarCollection).insertOne(event, function(err, result) {
      if (err) {
        next(err);
      } else {
        console.log('Event Added between ' + query.start + ' and ' + query.end);
        res.status(200).send({
          response: result
        });
      }
    });
  });
});

/* Retrieve calendar events */
router.get('/', async (req, res, next) => {
  console.log('Retrieving calendar events between ' + req.query.start + ' and ' + req.query.end);
  const client = await mongoDBConnection.establishConn();
  const db = client.db(connectionDetails.database);
  /* Same format as full calendar API */
  db.collection(connectionDetails.calendarCollection).find({
    $and: [ {
      'start': {
      $gte: req.query.start}
    },
    {
      'end': {
        $lt: req.query.end,
      }
    }]
  }).toArray(function(err, result) {
    if (err) throw err;
    res.status(200).send(
      result
    );
  });
});

module.exports = {
  router: router
}
