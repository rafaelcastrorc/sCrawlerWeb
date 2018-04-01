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
 * Checks the login credentials of a sCrawler instance. Does not create a session
 */
router.post('/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  connection.query('SELECT id, password, first_name, last_name FROM users WHERE email = ?', [username], function (err, results, fields) {
    if (err) {
      return res.send({success: false, message: err});
    }
    //If there is no user with this email
    if (results.length === 0) {
      return res.send({success: false, message: 'There is no user with such email'});

    } else {
      //Get the hashed password in the db
      const hash = results[0].password.toString();
      console.log(hash);
      //Verify if password matches
      bcrypt.compare(password, hash, function (err, response) {
        //If they match, return the user id
        if (response === true) {
          //Pass the id, the first and last name of the user
          return res.send({success: true, message: 'success'});
        }
        else {
          console.log('Passwords do not match');
          return res.send({success: false, message: 'Passwords do not match'});
        }
      });

    }
  })
});

/**
 * Checks the login credentials of a sCrawler instance. Does not create a session
 */
function auth(username, password) {
  connection.query('SELECT id, password FROM users WHERE email = ?', [username], function (err, results, fields) {
    if (err) {
      return false;
    }
    //If there is no user with this email
    if (results.length === 0) {
      return false;

    } else {
      //Get the hashed password in the db
      const hash = results[0].password.toString();
      console.log(hash);
      //Verify if password matches
      bcrypt.compare(password, hash, function (err, response) {
        //If they match, return the user id
        return response === true;
      });

    }
  })
}

/**
 * Get all unlocked proxies
 */
router.get('/unlockedCookies', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (!auth(username, password)) {
    res.status(400);
    res.send('You are not authorized');
  }
  console.log('Getting all unlocked proxies');
  var query = 'SELECT * FROM proxies WHERE unlocked';

  console.log(query);
  connection.query(query, function (err, rows, fields) {
    if (err) console.log('There was an error ' + err);
    else {
      let queryAns = [];
      for (var i = 0; i < rows.length; i++) {
        let proxy = new Proxy(rows[i].ip, rows[i].port, rows[i].cookies, rows[i].search_engine);
        queryAns.push(proxy);

      }
      res.json(queryAns);
    }
  });
});


module.exports = router;
