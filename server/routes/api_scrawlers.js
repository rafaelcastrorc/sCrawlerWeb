/**
 * Developed by Rafael Castro
 */
const express = require('express');
const router = express.Router();
var mysql = require('mysql');
// Todo: This should change to be depending on the user settings
var bcrypt = require('bcrypt');

var options = {
  host: 'sql9.freemysqlhosting.net',
  port: '3306',
  user: 'sql9214195',
  password: '2ddXZXDT3m',
  database: 'sql9214195'
};
var connection = mysql.createConnection(options);

const Scrawler = require('../models/scrawler');
const Proxy = require('../models/proxy');


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
  console.log(username);
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
var authentication = function (username, password, callback) {
  connection.query('SELECT id, password FROM users WHERE email = ?', [username], function (err, results, fields) {
    if (err) {
      callback(false);

    }
    //If there is no user with this email
    else if (results.length === 0) {
      callback(false);
    } else {
      //Get the hashed password in the db
      const hash = results[0].password.toString();
      console.log(hash);
      //Verify if password matches
      bcrypt.compare(password, hash, function (err, response) {
        //If they match, return the user id

        callback(response === true);

      });

    }
  });
};

/**
 * Get all unlocked proxies
 */
router.post('/unlocked_proxies', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
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
    } else {
      res.status(400);
      res.send('You are not authorized');

    }

  })
});

/**
 * Get latest version
 */
router.get('/version', function (req, res) {
  console.log('Getting latest version');
  var query = 'SELECT * FROM versions ';

  console.log(query);
  connection.query(query, function (err, rows, fields) {
    if (err) console.log('There was an error ' + err);
    else {
      console.log(rows[0]);
      res.json(rows[0]);
    }
  });
});

/**
 * Gets the cookie associated to an unlocked proxy
 */
router.post('/unlocked_cookie', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var ip = req.body.ip;
  var port = parseInt(req.body.port);
  var search_engine = req.body.search_engine;

  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
      console.log('Getting cookie');
      console.log('SELECT cookies FROM proxies WHERE ip = ? AND port = ? AND search_engine = ?', [ip, parseInt(port), search_engine]);
      connection.query('SELECT cookies FROM proxies WHERE ip = ? AND port = ? AND search_engine = ?', [ip, parseInt(port), search_engine], function (err, rows, fields) {
        let cookie = {cookie: ""};
        if (err) console.log('There was an error ' + err);
        else {
          //Get the cookies for the proxy
          for (var i = 0; i < rows.length; i++) {
            cookie = {'cookie': rows[i].cookies};
          }
          console.log(cookie);
          res.json(cookie);

        }
      })
    }
    else {
      res.status(400);
      res.send('You are not authorized');
    }

  })
});


/**
 * Checks if proxy is not locked
 */
router.get('/is_unlocked/:ip/:port', function (req, res) {
  var ip = req.params.ip;
  var port = parseInt(req.params.port);
  console.log('Checking if proxy is unlocked');
  console.log('SELECT cookies FROM proxies WHERE ip = ? AND port = ?', [ip, port]);
  connection.query('SELECT unlocked, num_of_instances FROM proxies WHERE ip=? AND port=?', [ip, port], function (err, rows, fields) {
    if (err) console.log('There was an error ' + err);
    else {
      //If result is empty
      if (rows.length === 0) {
        res.json();
      }
      else {
        //Send object
        res.json({'unlocked': rows[0].unlocked, 'num_of_instances': rows[0].num_of_instances});
      }
    }
  });
});


/**
 * Checks if this instance is already using the proxy
 */
router.get('/is_using_proxy/:ip/:port', function (req, res) {
  var ip = req.params.ip;
  var port = parseInt(req.params.port);

  console.log('Checking if instance is already using proxy');
  console.log('SELECT scrawler_id FROM scrawler_to_proxy WHERE ip=? AND port=?', [ip, port]);
  connection.query('SELECT scrawler_id FROM scrawler_to_proxy WHERE ip=? AND port=?', [ip, port], function (err, rows, fields) {
    if (err) console.log('There was an error ' + err);
    else {
      //If result is empty
      if (rows.length === 0) {
        res.json();
      }
      else {
        //Send object
        res.json({'scrawler_id': rows[0].scrawler_id});
      }
    }
  });
});


module.exports = router;
