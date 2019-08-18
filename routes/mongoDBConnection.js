const mongodb = require('mongodb')
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('../config/config');
const connectionDetails = config.connectionDetails;
const map = config.defaultMapConnection;

/* Test a MongoDB database connection
  - Check whether a connection is able to successfully be made
  - Validate that more than one collection exists within the connected database
*/
router.get('/test-connection', async (req, res, next) => {
  const client = await establishConn();
  const db = client.db(connectionDetails.database);

  db.listCollections().toArray(function(err, collections) {
    if (collections.length < 1) {
      next({
        message: 'No database exists with that name or no collections exist in the database'
      });
    }

    console.log('connected to ' + req.url);
    var response = {
      status: 200,
      success: 'Connection successfully established'
    }
    res.end(JSON.stringify(response));
  });
});

/* Used to establish an inital connectiont to a MongoDB instance */
function establishConn() {

  let url = connectionDetails.url;
  let username = connectionDetails.username;
  let password = connectionDetails.password;
  let database = connectionDetails.database;

  /*  Auth or no Auth */
  if (username !== '' & password !== '') {
    url = 'mongodb://' + username + ':' + password + '@' + url + '/' + database;
  } else {
    url = 'mongodb://' + url + '/';
  }

  return new Promise((resolve, reject) => {
    MongoClient.connect(decodeURIComponent(url), {
      useNewUrlParser: true
    }, function(err, client) {
      if (err) {
        console.log('Error ' + err);
        reject(err);
      } else {
        resolve(client);
      }
    })
  });
}

module.exports = {
  router: router,
  establishConn: establishConn
}
