/**
 * Developed by Rafael Castro
 */
const express = require('express');
const router = express.Router();
var mysql = require('mysql');
// Todo: This should change to be depending on the user settings
var options = {
  host: 'sql9.freemysqlhosting.net',
  port: '3306',
  user: 'sql9214195',
  password: '2ddXZXDT3m',
  database: 'sql9214195'
};
var connection = mysql.createConnection(options);

const Scrawler = require('../models/scrawler');

router.get('/', function (req, res) {
  res.send('sCrawler APi  works!');
});


//Check connection to scrawler db
connection.connect(function (error) {
  if (!error) {
    console.log('Connected to DB scrawlers!')
  } else {
    console.log('There was an error connecting to the database');
  }
});

//To get all active crawlers
router.get('/all', function (req, res) {
  console.log('Getting all scrawlers');
  var query = 'SELECT * from scrawlers';

  console.log(query);
  connection.query(query, function (err, rows, fields) {
    if (err) console.log('There was an error ' + err);
    else {
      //res.json(rows[0].id);
      let queryAns = [];
      for (var i = 0; i < rows.length; i++) {
        let scrawler = new Scrawler(rows[i].id, rows[i].location, rows[i].missing_papers, rows[i].operation,
          rows[i].effectiveness_rate, rows[i].download_rate, rows[i].last_updated, rows[i].started);
        queryAns.push(scrawler);

      }
      res.json(queryAns);
    }
  });
});

//Gets a crawler
router.get('/scrawler/:id', function (req, res) {
  console.log('Getting an specific crawler');
  let id = req.params.id;
  var query = 'SELECT * from scrawlers WHERE id = ' + id;

  console.log(query);
  connection.query(query, function (err, rows, fields) {
    if (err) console.log('There was an error ' + err);
    else {
      var scrawler = new Scrawler(rows[0].id, rows[0].location, rows[0].missing_papers, rows[0].operation,
        rows[0].effectiveness_rate, rows[0].download_rate, rows[0].last_updated, rows[0].started);
      res.json(scrawler);
    }
  });
});

//Add operation to crawler
router.post('/operation', function (req, res) {
  console.log('Adding command to a crawler');
  var operation = req.body.operation;
  var scrawlerID = req.body.id;
  var query = 'UPDATE scrawlers SET operation = ' + operation + ' WHERE id = ' + scrawlerID;
  console.log(query);
  connection.query(query, function (err, rows, fields) {
    if (err) console.log('There was an error ' + err);
    else {
      res.json(rows);
    }
  });
});


/**
 * Handles the backend when we lose connection to the database
 */
function handleDisconnect() {
  connection = mysql.createConnection(options); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

module.exports = router;
