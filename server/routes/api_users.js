/**
 * Developed by Rafael Castro
 * Handles everything related to user actions. Logging in, sending request to server, etc
 */
const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
//For hashing the password
const saltRounds = 10;
//For validating user input
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var options = {
  host: 'sql9.freemysqlhosting.net',
  port: '3306',
  user: 'sql9214195',
  password: '2ddXZXDT3m',
  database: 'sql9214195'
};
var connection = mysql.createConnection(options);
// var sessionStore = new MySQLStore({}, connection);
var passport = require('passport');

router.use(expressValidator());
router.use(cookieParser('JlNyXZDRfW8bKhZT9oR5XYZ'));
router.use(bodyParser());


router.get('/', function (req, res) {
  res.send('User API  works!');
});


/**
 * Verifies connection to db
 */
connection.connect(function (error) {
  if (!error) {
    console.log('Connected to DB users!')
  } else {
    console.log('There was an error connecting to the database');
  }
});

/**
 * Registers user in the db
 */
router.post('/register', function (req, res) {
  console.log('Registering user');
  //Validate
  req.checkBody('firstname').notEmpty();
  req.checkBody('lastname').notEmpty();
  req.checkBody('email').notEmpty();
  req.checkBody('password').notEmpty();
  req.checkBody('password').isLength({min: 6});
  req.checkBody('email').isEmail();

  const errors = req.validationErrors();
  if (errors) {
    console.log(errors[0].param);
    res.send(JSON.stringify({message: errors[0].param}));
  }
  else {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var myPlaintextPassword = req.body.password;
    var password = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    // Store hash in your password DB.
    connection.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [firstname, lastname, email, password], function (error) {
        if (error) {
          console.log(error.message);
          var message = error.message;
          //Send the error message
          if (message.includes("ER_DUP_ENTRY:")) {
            message = 'You have already registered. If you forgot your password, go to the login page and click ' +
              'the Forgot my password button.'
          }
          res.send(JSON.stringify({message: message}));

        }
        else {
          //To tell front-end that it worked
          connection.query('SELECT LAST_INSERT_ID() AS user_id', function (error, results, fields) {
            if (error) {
              console.log(error);
              res.send(JSON.stringify({message: error.message}));
            }
            else {
              //If everything works logging in, get the user_id
              const user_id = results[0].user_id;
              //This goes to serializedUser (part of passport)
              req.login(user_id, function (err) {
                if (err) throw err;
                res.status(200);
                console.log('User successfully logged in from register: ' + req.user);
                res.send(JSON.stringify({message: "success"}));
              });
            }
          });
        }
      })
  }
});


/**
 * Logs in the user into de db
 */
router.post('/login', function (req, res, next) {
  //Using custom callback
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      //This happens if there was an error finding the user at all
      return res.send({success: false, message: err});
    }
    else if (!user) {
      //If the passwords did not match
      return res.send({success: false, message: 'Your password is incorrect!'});
    } else {
      //Manually log user in since we are using a custom callback
      //This goes to the serializedUser function (part of passport)
      req.login(user.user_id, function (err) {
        if (err) throw err;
        res.status(200);
        console.log(user);
        console.log('User successfully logged in from register: ' + req.user);
        return res.send({success: true, message: 'success', firstName: user.first_name, lastName: user.last_name});
      });
    }
  })(req, res, next);
});

/**
 * Logs out the user
 */
router.get('/logout', function (req, res) {
  //Logout user
  console.log("Logging out");
  req.logout();
  //Clear session
  req.session.destroy();
  res.send({success: true})
});


passport.serializeUser(function (user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
  done(null, user_id);
});


/**
 * Verifies if user is logged in
 */
router.get('/getauth', function (req, res, next) {
  console.log('User Trying to authenticate: ' + req.user);
  console.log('Is Authenticated ' + req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log('valid user');
    res.send(JSON.stringify({status: true}));
  } else {
    console.log('Invalid user');
    res.send(JSON.stringify({status: false}));

  }
});


/**
 * Allows the user to perform an operation on an instance
 */
router.post('/perform_operation', function (req, res) {
  var operation = req.body.operation;
  var id = req.body.id;

  //Check if user is auth
  if (req.isAuthenticated()) {
    // Perform operation only if user has this instance
    connection.query('UPDATE scrawlers SET operation = ? ' +
      'WHERE id = ? AND EXISTS(SELECT * FROM user_to_instance WHERE user_id = ? AND instance = ?) ',
      [operation, id, req.user, id], function (err, result) {
        if (err) {
          res.json({'success': false, 'message': err.code});
        }
        else {
          //Send message saying the number of rows modified
          res.json({'success': true, 'message': result.affectedRows + " record(s) updated"});
        }
      });

  } else {
    res.send(JSON.stringify({status: false, message: 'You are not authenticated!'}));

  }


});


/**
 * Get all instances that the user owns
 */
router.get('/instances', function (req, res) {
  console.log('Getting all scrawlers that is user has');
  var query = 'SELECT id, location FROM scrawlers S JOIN user_to_instance U ON U.instance = S.id WHERE U.user_id = ?';

  console.log(query);
  connection.query(query, [req.user], function (err, rows, fields) {
    if (err) console.log('There was an error ' + err);
    else {
      let queryAns = [];
      for (var i = 0; i < rows.length; i++) {
        let scrawler = ({'id': rows[i].id, 'location': rows[i].location});
        queryAns.push(scrawler);
      }
      console.log(queryAns);
      res.json(queryAns);
    }
  });
});


/**
 * Get a counter of the number of instances available globally
 */
router.get('/all_instances', function (req, res) {
  console.log('Getting all scrawlers globally');
  var query = 'SELECT COUNT(*) AS counter FROM scrawlers';

  console.log(query);
  connection.query(query, function (err, rows, fields) {
    if (err) console.log('There was an error ' + err);
    else {
      res.json({'count': rows[0].counter});
    }
  });
});


/**
 * Gets all the proxies available
 */
router.get('/proxies', function (req, res) {
  console.log('Getting all proxies');
  var query = 'SELECT * FROM list_of_proxies';

  console.log(query);
  connection.query(query, function (err, rows, fields) {
    if (err) console.log('There was an error ' + err);
    else {
      let queryAns = [];
      for (var i = 0; i < rows.length; i++) {
        //Convert the date from timestamp to local time
        var newDate = new Date();
        newDate.setTime(rows[i].time - (newDate.getTimezoneOffset() * 60 * 1000));
        let dateString = newDate.toUTCString();

        let proxy = ({'ip': rows[i].ip, 'port': rows[i].port, 'updated': dateString});
        queryAns.push(proxy);
      }
      res.json(queryAns);
    }
  });
});
module.exports = router;
