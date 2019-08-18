const mongodb = require('mongodb')
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const mongoDBConnection = require('./mongoDBConnection.js');
const config = require('../config/config');
const connectionDetails = config.connectionDetails;

/* Retrieve a list of clients */
router.get('/', async (req, res, next) => {
  console.log('Retrieving list of clients (limit:' + req.query.limit + ')');
  const client = await mongoDBConnection.establishConn();
  const db = client.db(connectionDetails.database);
  /* Same format as full calendar API */
  db.collection(connectionDetails.calendarCollection).find({}).toArray(function(err, result) {
    if (err) throw err;
    res.status(200).send(
      result
    );
  });
});

module.exports = {
  router: router
}
