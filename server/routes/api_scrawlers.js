/**
 * Developed by Rafael Castro
 */
const express = require('express');
const router = express.Router();
var mysql = require('mysql');
// Todo: This should change to be depending on the user settings
var connection = mysql.createConnection({
  host: 'sql9.freemysqlhosting.net',
  port: '3306',
  user: 'sql9214195',
  password: '2ddXZXDT3m',
  database: 'sql9214195'
});
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

module.exports = router;
