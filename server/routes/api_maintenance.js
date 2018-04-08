/**
 * Developed by Rafael Castro
 * Handles everything related to the maintenance of the server
 */
const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var options = {
  host: 'sql9.freemysqlhosting.net',
  port: '3306',
  user: 'sql9214195',
  password: '2ddXZXDT3m',
  database: 'sql9214195'
};
var connection = mysql.createConnection(options);



router.get('/', function (req, res) {
  res.send('Maintenance API  works!');
});


//Check connection to scrawler db
connection.connect(function (error) {
  if (!error) {
    console.log('Connected to DB scrawlers!')
  } else {
    console.log('There was an error connecting to the database');
  }
});


/**
 * Gets the last time the db was maintained
 */
router.get('/last_maintenance', function (req, res) {

  console.log('SELECT last_maintenance FROM versions ');
  connection.query('SELECT last_maintenance FROM versions', function (err, rows) {
    if (err) console.log('There was an error ' + err);
    else {
      //If result is empty
      if (rows.length === 0) {
        res.json();
      }
      else {
        //Return the number of times it failed to load
        res.json({'last_maintenance': rows[0].last_maintenance});
      }
    }
  });
});


/**
 * Cleans the proxies table by removing locked proxies and failures to load
 */
var cleanProxiesTable = function (callback) {
  //Marks all the proxies that are currently locked, but that have more than 1 failure to load (aka they were
  // unlocked at one point) as unlock and resets failures to load to 1
  connection.query('UPDATE proxies SET unlocked = 1, failed_to_load = 1 WHERE cookies = "" AND unlocked = 0 AND ' +
    'failed_to_load > 0', function (err, results, fields) {
    if (err) {
      callback(false);
    }
    else {

      //Reset counter of unlocked proxies to 1 for all the proxies that are unlocked and have more than 2 failures
      connection.query('UPDATE proxies SET unlocked = 1, failed_to_load = 1 WHERE unlocked = 1 AND ' +
        'failed_to_load > 1', function (err, results, fields) {
        if (err) {
          callback(false);
        }
        else {
          console.log(results.affectedRows + ' Affected rows');
          callback(true);
        }
      });
    }
  });
};

/**
 * Updates the last time the db was maintained
 */
var updateMaintenanceTime = function (callback) {
  var currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  connection.query('UPDATE versions SET last_maintenance = ? ', [currentDate], function (err, results, fields) {
    if (err) {
      callback(false);
    }
    else {

      console.log(results.affectedRows + ' Affected rows');
      callback(true);
    }
  });
};


//Todo: Clean crawlers


/**
 * Execute an automatic maintenance of the db every 24 hours
 */
setInterval(function () {
  // Clean proxies table
  cleanProxiesTable(function (cleaned) {
    if (cleaned) {
      console.log('Proxies table has been cleaned!');
      //Update maintenance time
      updateMaintenanceTime(function (updated) {
        if (updated) {
          console.log('Maintenance time has been updated!');
        }
      })
    }
  });
}, 1000 * 60 * 60 * 24);

module.exports = router;
