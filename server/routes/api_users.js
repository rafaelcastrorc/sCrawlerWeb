/**
 * Developed by Rafael Castro
 * Handles everything related to user management
 */
const express = require('express');
const router = express.Router();

//For hashing the password
var bcrypt = require('bcrypt');
const saltRounds = 10;

var expressValidator= require('express-validator');
router.use(expressValidator());

//To handle user sessions once they are logged in
var session = require('express-session');
router.use(session({
  secret: 'JlNyXZDRfW8bKhZT9oR5',
  resave: false,
  saveUninitialized : false,
  cookie: {secure: true}
}));

var mysql = require('mysql');
// Todo: This should change to be depending on the user settings
var connection = mysql.createConnection({
  host: 'sql9.freemysqlhosting.net',
  port: '3306',
  user: 'sql9214195',
  password: '2ddXZXDT3m',
  database: 'sql9214195'
});

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


// router.post('login', function (req, res) {
//   var email = 'req.body.email';
//   var password = 'req.body.password';
//   connection.query(query, function (err, rows, fields) {
//   }
// }


//To get all active crawlers
router.post('/register', function (req, res) {
  console.log('Registering user');
  //Validate
  req.checkBody('firstname').notEmpty();
  req.checkBody('lastname').notEmpty();
  req.checkBody('email').notEmpty();
  req.checkBody('password').notEmpty();
  req.checkBody('email').isEmail();

  const errors = req.validationErrors();
  if (errors) {
    console.log('One or more fields are not correct');
    res.status(400);
    res.send('One or more fields are not correct');
  }
  else {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var myPlaintextPassword = req.body.password;
    var password = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    // Store hash in your password DB.
    connection.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [firstname, lastname, email, password], function (error, results, fields) {
        if (error) {
          console.log(error.message);
          //Specifies that there is an error
          res.status(400);
          //Send the error message
          res.send(error.message);

        }
        else {
          console.log('Registration successful!');
        }
      })
  }
});

module.exports = router;
