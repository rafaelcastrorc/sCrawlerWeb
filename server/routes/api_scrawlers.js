/**
 * Developed by Rafael Castro
 * Handles all request between an sCrawler instance and the server
 */
const express = require('express');
const router = express.Router();
var mysql = require('mysql');
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
const ListOfProxies = require('../models/list_of_proxies');


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


/**
 * Checks the login credentials of a sCrawler instance. Does not create a session
 */
router.post('/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  connection.query('SELECT id, password, first_name, last_name FROM users WHERE email = ?', [username],
    function (err, results, fields) {
      if (err) {
        return res.send({success: false, message: err});
      }
      //If there is no user with this email
      if (results.length === 0) {
        return res.send({success: false, message: 'There is no user with such email'});

      } else {
        //Get the hashed password in the db
        const hash = results[0].password.toString();
        //Verify if password matches
        bcrypt.compare(password, hash, function (err, response) {
          //If they match, return the user id
          if (response === true) {
            //Pass the id, the first and last name of the user
            return res.send({success: true, message: 'success'});
          }
          else {
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
    if (isAuth) {
      var query = 'SELECT * FROM proxies WHERE unlocked';

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
  var query = 'SELECT * FROM versions ';

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
    if (isAuth) {
      connection.query('SELECT cookies FROM proxies WHERE ip = ? AND port = ? AND search_engine = ?',
        [ip, parseInt(port), search_engine], function (err, rows, fields) {
          let cookie = {cookie: ""};
          if (err) console.log('There was an error ' + err);
          else {
            //Get the cookies for the proxy
            for (var i = 0; i < rows.length; i++) {
              cookie = {'cookies': rows[i].cookies};
            }
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
 * Sets into the db the number of proxies found in a website
 */
router.post('/set_number_of_proxies', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var numberOfProxies = req.body.numberOfProxies;
  var website = req.body.website;

  authentication(username, password, function (isAuth) {
    if (isAuth) {
      connection.query('UPDATE list_of_websites SET numOfProxiesFound = ? WHERE website = ? ',
        [parseInt(numberOfProxies), website], function (err, result) {
          if (err) {
            res.json({'success': false, 'message': err.code});
          }
          else {
            //Send message saying the number of rows modified
            res.json({'success': true, 'message': result.affectedRows + " record(s) updated"});
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
 * Sets into the db the last time a website was visited
 */
router.post('/set_website_time', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var website = req.body.website;
  var visited = req.body.visited;

  authentication(username, password, function (isAuth) {
    if (isAuth) {
      connection.query('UPDATE list_of_websites SET visited = ? WHERE website = ?',
        [visited, website], function (err, result) {
          if (err) {
            res.json({'success': false, 'message': err.code});
          }
          else {
            //Send message saying the number of rows modified
            res.json({'success': true, 'message': result.affectedRows + " record(s) updated"});
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
 * Adds a proxy into the list of proxies
 */
router.post('/add_to_list_of_proxies', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var ip = req.body.ip;
  var port = parseInt(req.body.port);
  var time = req.body.time;

  authentication(username, password, function (isAuth) {
    if (isAuth) {
      connection.query('INSERT INTO list_of_proxies (ip, port, time) VALUES (?, ?, ?)',
        [ip, port, time], function (err, result) {
          if (err) {
            res.json({'success': false, 'message': err.code});
          }
          else {
            //Send message saying the number of rows modified
            res.json({'success': true, 'message': result.affectedRows + " record(s) added"});
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
 * Delete from list of proxies
 */
router.post('/delete_from_list_of_proxies', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var ip = req.body.ip;
  var port = parseInt(req.body.port);

  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
      connection.query('DELETE FROM list_of_proxies WHERE ip = ? AND port = ?', [ip, port], function (err, result) {
        if (err) {
          res.json({'success': false, 'message': err.code});
        }
        else {
          //Send message saying the number of rows modified
          res.json({'success': true, 'message': result.affectedRows + " record(s) deleted"});
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
 * Sets to True that this instance is currently download
 */
router.post('/is_downloading', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var id = req.body.id;

  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
      console.log('This instance is downloading');
      console.log('UPDATE scrawlers SET is_downloading = ? WHERE id = ?', [true, id]);
      connection.query('UPDATE scrawlers SET is_downloading = ? WHERE id = ?', [true, id], function (err, result) {
        if (err) {
          res.json({'success': false, 'message': err.code});
        }
        else {
          //Send message saying the number of rows modified
          res.json({'success': true, 'message': result.affectedRows + " record(s) modified"});
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
 * Adds a crawler instance
 */
router.post('/add_instance', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var id = req.body.id;
  var location = req.body.location;
  var started = req.body.started;


  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
      connection.query('INSERT INTO scrawlers (id, location, last_updated, started) VALUES (?, ?, ?, ?)', [id, location, started, started],
        function (err, result) {
          if (err) {
            res.json({'success': false, 'message': err.code});
          }
          else {
            //Associate instance to user
            connection.query('INSERT INTO user_to_instance (user_id, instance, is_owner) VALUES ( (SELECT id FROM' +
              ' users WHERE email = ?), ?, ?)', [username, id, true],
              function (err, result) {
                if (err) {
                  res.json({'success': false, 'message': err.code});
                }
                else {
                  //Send message saying the number of rows modified
                  res.json({'success': true, 'message': result.affectedRows + " record(s) added"});
                }
              });
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
 * Removes a crawler instance
 */
router.post('/remove_instance', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var id = req.body.id;


  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
      connection.query('SELECT ip, port FROM scrawler_to_proxy WHERE scrawler_id = ? ', [id], function (err, rows) {
        if (err) {
          console.log('There was an error getting all previously unlocked proxies' + err);
          res.json({'success': false, 'message': err.code});
        }
        else {
          console.log(rows);
          //Decrease counter of each proxy
          for (var i = 0; i < rows.length; i++) {
            connection.query('UPDATE proxies SET num_of_instances = num_of_instances - 1 WHERE ip = ?  ' +
              'AND port = ? AND num_of_instances > 0', [rows[i].ip, rows[i].port], function (err, rows) {
              if (err) {
                console.log('There was an error decreasing counter ' + err);
                res.json({'success': false, 'message': err.code});
              }
              else {
                console.log('Decreased counter for proxy : ' + i);
              }
            });
          }
          //Remove instance
          connection.query('DELETE FROM scrawlers WHERE id = (?)', [id], function (err, result) {
            if (err) {
              console.log('There was an error removing instance counter ' + err);
              res.json({'success': false, 'message': err.code});
            }
            else {
              console.log('Instance deleted : ' + id);
              res.json({'success': true, 'message': result.affectedRows + " record(s) modified"});
            }
          });
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
 * Adds a proxy to an instance
 */
router.post('/add_proxy_to_instance', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var id = req.body.id;
  var ip = req.body.ip;
  var port = parseInt(req.body.port);

  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
      console.log('Adding a new proxy to an instance');
      console.log('INSERT INTO scrawler_to_proxy (scrawler_id, ip, port) VALUES (?, ?, ?)', [id, ip, port]);
      connection.query('INSERT INTO scrawler_to_proxy (scrawler_id, ip, port) VALUES (?, ?, ?)', [id, ip, port],
        function (err, result) {
          if (err) {
            console.log('There was an error ' + err);
            res.json({'success': false, 'message': err.code});
          }
          else {
            //Increase the count of crawlers using this proxy
            connection.query('UPDATE proxies SET num_of_instances = num_of_instances + 1, unlocked = TRUE WHERE ip = ?  ' +
              'AND port = ?', [ip, port], function (err, result) {
              if (err) {
                console.log('There was an error ' + err);
                res.json({'success': false, 'message': err.code});
              } else {
                console.log('UPDATE proxies SET num_of_instances = num_of_instances + 1, unlocked = TRUE WHERE ip = ?  ' +
                  'AND port = ?', [ip, port]);
                //Send message saying the number of rows modified
                res.json({'success': true, 'message': result.affectedRows + " record(s) modified"});
              }
            })
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
 * Adds an unlocked proxy into the db
 */
router.post('/add_unlocked_proxy', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var ip = req.body.ip;
  var port = parseInt(req.body.port);
  var cookies = req.body.cookies;
  var search_engine = req.body.search_engine;


  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
      console.log('Adding a new unlocked proxy');
      console.log('INSERT INTO proxies (ip, port, unlocked, cookies, search_engine, failed_to_load) ' +
        'VALUES (?, ?, ?, ?, ?, ?)',
        [ip, port, true, cookies, search_engine, 0]);
      connection.query('INSERT INTO proxies (ip, port, unlocked, cookies, search_engine) VALUES (?, ?, TRUE, ?, ?)',
        [ip, port, cookies, search_engine], function (err, result) {
          if (err) {
            //If this happens, record already exist so we update it instead
            if (err.code === ('ER_DUP_ENTRY')) {
              //Increase the count of crawlers using this proxy
              connection.query('UPDATE proxies SET cookies = ?, search_engine = ?, unlocked = TRUE WHERE ip = ? AND ' +
                'port = ?', [cookies, search_engine, ip, port], function (err, result) {
                if (err) {
                  console.log('There was an error ' + err);
                  res.json({'success': false, 'message': err.code});
                } else {
                  console.log('Duplicate found, so just updating values');
                  res.json({'success': true, 'message': result.affectedRows + " record(s) modified"});
                }
              });
            } else {
              console.log('There was an error ' + err);
              res.json({'success': false, 'message': err.code});
            }
          }
          else {
            res.json({'success': true, 'message': result.affectedRows + " record(s) modified"});
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
 * Adds an locked proxy into the db
 */
router.post('/add_locked_proxy', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var ip = req.body.ip;
  var port = parseInt(req.body.port);


  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
      console.log('Adding a new locked proxy');
      console.log('UPDATE proxies SET cookies = "", unlocked = FALSE, num_of_instances = 0 WHERE ip = ?  AND port = ?',
        [ip, port]);
      connection.query('UPDATE proxies SET cookies = "", unlocked = FALSE, num_of_instances = 0 WHERE ip = ?  AND port = ?',
        [ip, port], function (err, result) {
          if (err) {
            console.log('There was an error ' + err);
            res.json({'success': false, 'message': err.code});
          }
          else {
            //Remove it from the instance using it
            connection.query('DELETE FROM scrawler_to_proxy WHERE ip = ? AND port = ? ', [ip, port], function (err, result) {
              if (err) {
                console.log('There was an error ' + err);
                res.json({'success': false, 'message': err.code});
              } else {
                res.json({'success': true, 'message': result.affectedRows + " record(s) modified"});
              }
            });
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
 * Adds an error into the erros table
 */
router.post('/add_error', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var scrawler_id = req.body.scrawler_id;
  var location = req.body.location;
  var time = req.body.time;
  var error = req.body.error;

  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
      console.log('Adding a new error');
      console.log('INSERT INTO errors (scrawler_id, location, error, time) VALUES(?,?,?,?)', [scrawler_id, location, error, time]);
      connection.query('INSERT INTO errors (scrawler_id, location, error, time) VALUES(?,?,?,?)', [scrawler_id, location, error, time],
        function (err, result) {
          if (err) {
            console.log('There was an error ' + err);
            res.json({'success': false, 'message': err.code});
          }
          else {
            //Send message saying the number of rows modified
            res.json({'success': true, 'message': result.affectedRows + " record(s) added"});
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
 * Adds a failure to load to a proxy
 */
router.post('/add_failure', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var ip = req.body.ip;
  var port = parseInt(req.body.port);
  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
      console.log('Adding a new failure to load');
      console.log('UPDATE proxies SET failed_to_load = failed_to_load + 1 WHERE ip = ?  AND port = ?', [ip, port]);
      connection.query('UPDATE proxies SET failed_to_load = failed_to_load + 1 WHERE ip = ?  AND port = ?', [ip, port],
        function (err, result) {
          if (err) {
            console.log('There was an error ' + err);
            res.json({'success': false, 'message': err.code});
          }
          else {
            //Send message saying the number of rows modified
            res.json({'success': true, 'message': result.affectedRows + " record(s) added"});
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
 * Adds the current download rate of an instance
 */
router.post('/add_download_rate', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var id = req.body.id;
  var last_updated = req.body.last_updated;
  var download_rate = parseFloat(req.body.download_rate);
  var effectiveness_rate = parseFloat(req.body.effectiveness_rate);
  var missing_papers = parseInt(req.body.missing_papers);


  authentication(username, password, function (isAuth) {
    console.log(isAuth);
    if (isAuth) {
      console.log('Adding download rate');
      console.log('UPDATE scrawlers SET download_rate = ?, last_updated = ?, effectiveness_rate = ?, missing_papers =? ' +
        'WHERE id = ?', [download_rate, last_updated, effectiveness_rate, missing_papers, id]);
      connection.query('UPDATE scrawlers SET download_rate = ?, last_updated = ?, effectiveness_rate = ?, missing_papers =? ' +
        'WHERE id = ?', [download_rate, last_updated, effectiveness_rate, missing_papers, id],
        function (err, result) {
          if (err) {
            console.log('There was an error ' + err);
            res.json({'success': false, 'message': err.code});
          }
          else {
            //Send message saying the number of rows modified
            res.json({'success': true, 'message': result.affectedRows + " record(s) added"});
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
  connection.query('SELECT unlocked, num_of_instances FROM proxies WHERE ip=? AND port=?', [ip, port],
    function (err, rows, fields) {
      if (err) console.log('There was an error ' + err);
      else {
        //If result is empty
        if (rows.length === 0) {
          res.json({'unlocked': null, 'num_of_instances': null});
        }
        else {
          //Send object
          var ans = false;
          if (rows[0].unlocked  === 1) {
            ans = true;
          }
          res.json({'unlocked': ans, 'num_of_instances': rows[0].num_of_instances});
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
  connection.query('SELECT scrawler_id FROM scrawler_to_proxy WHERE ip=? AND port=?', [ip, port],
    function (err, rows, fields) {
      if (err) console.log('There was an error ' + err);
      else {
        //If result is empty
        if (rows.length === 0) {
          res.json({'scrawler_id': null});
        }
        else {
          //Send object
          res.json({'scrawler_id': rows[0].scrawler_id});
        }
      }
    });
});

/**
 * Gets all the proxy compiling websites
 */
router.get('/list_of_websites', function (req, res) {
  console.log('Retrieving all the websites');
  connection.query('SELECT website, visited FROM list_of_websites ', function (err, rows) {
    if (err) console.log('There was an error ' + err);
    else {
      //If result is empty
      if (rows.length === 0) {
        res.json({'website': null, 'visited': null});
      }
      else {
        let queryAns = [];
        for (var i = 0; i < rows.length; i++) {
          let website = {'website': rows[i].website, 'visited': rows[i].visited};
          queryAns.push(website);
        }
        res.json(queryAns);
      }
    }
  });
});

/**
 * Gets all the proxy compiling websites
 */
router.get('/list_of_proxies', function (req, res) {
  console.log('Retrieving all the current proxies');
  connection.query('SELECT * FROM list_of_proxies', function (err, rows) {
    if (err) console.log('There was an error ' + err);
    else {
      //If result is empty
      if (rows.length === 0) {
        res.json([]);
      }
      else {
        let queryAns = [];
        for (var i = 0; i < rows.length; i++) {
          let proxy = new ListOfProxies(rows[i].ip, rows[i].port, rows[i].time);
          queryAns.push(proxy);
        }
        res.json(queryAns);
      }
    }
  });
});


/**
 * Gets all the proxy compiling websites
 */
router.get('/failure_to_load/:ip/:port', function (req, res) {
  var ip = req.params.ip;
  var port = parseInt(req.params.port);

  console.log('Retrieving the number of times a proxy has failed to load');
  connection.query('SELECT failed_to_load  FROM proxies  WHERE ip = ?  AND port = ?', [ip, port], function (err, rows) {
    if (err) console.log('There was an error ' + err);
    else {
      //If result is empty
      if (rows.length === 0) {
        res.json({'failed_to_load': null});
      }
      else {
        //Return the number of times it failed to load
        res.json({'failed_to_load': rows[0].failed_to_load});
      }
    }
  });
});



module.exports = router;
