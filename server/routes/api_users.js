/**
 * Developed by Rafael Castro
 * Handles everything related to user registration and logging in/out
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
// router.use(expressSession({
//   secret: 'JlNyXZDRfW8bKhZT9oR5XYZ',
//   resave: false,
//   saveUninitialized: false,
//   store: sessionStore,
//   //Todo: change this
//   cookie: {secure: false}
// }));
// router.use(passport.initialize());
// router.use(passport.session());



router.get('/', function (req, res) {
  res.send('User API  works!');
});


//Check connection to scrawler db
connection.connect(function (error) {
  if (!error) {
    console.log('Connected to DB users!')
  } else {
    console.log('There was an error connecting to the database');
  }
});

//To register
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
    res.send(JSON.stringify({ message: errors[0].param }));
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
          res.send(JSON.stringify({ message: message }));

        }
        else {
          //To tell front-end that it worked
          connection.query('SELECT LAST_INSERT_ID() AS user_id', function (error, results, fields) {
            if (error) {
              console.log(error);
              res.send(JSON.stringify({ message: error.message }));
            }
            else {
              //If everything works logging in, get the user_id
              const user_id = results[0].user_id;
              //This goes to serializedUser (part of passport)
              req.login(user_id, function (err) {
                if (err) throw err;
                res.status(200);
                console.log('User successfully logged in from register: ' + req.user);
                res.send(JSON.stringify({ message: "success"}));
                });
            }
          });
        }
      })
  }
});


passport.serializeUser(function (user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
  done(null, user_id);
});

/**
 * Verify if user is logged in
 */
router.get('/getauth', function (req, res, next) {
  console.log('User Trying to authenticate: '+  req.user);
  console.log('Is Authenticated '+  req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log('valid user');
    res.send(JSON.stringify({ status: true }));
  } else {
    console.log('Invalid user');
    res.send(JSON.stringify({ status: false }));

  }
});


/**
 * Handles the backend when we lose connection to the database
 */
function handleDisconnect() {
  console.log("Trying to reconnect");
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
