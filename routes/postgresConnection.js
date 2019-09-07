const {  Pool, Client } = require('pg')
const express = require('express');
const router = express.Router();
const config = require('../config/config');
const connectionDetails = config.connectionDetails;
const map = config.defaultMapConnection;

/* Move connection details out*/
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'golf_planner',
  password: 'password',
  port: 5432,
})

/* Test a MongoDB database connection
  - Check whether a connection is able to successfully be made
  - Validate that more than one collection exists within the connected database
*/
router.get('/test-connection', async (req, res, next) => {

  const result = await query('SELECT NOW()', next);
  var response = {
    status: 200,
    success: 'Connection successfully established'
  }
  res.end(JSON.stringify(response));
});

async function query(query, next) {
  const client = await pool.connect()
  let response;
  try {
    await client.query('BEGIN');
    try {
      res = await client.query(query);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      next(err);
    }
  } finally {
    client.release();
  }
  return res;
}

module.exports = {
  router: router,
  query: query
}
