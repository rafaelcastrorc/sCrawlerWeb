const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const apiScrawlers = require('./server/routes/api_scrawlers');
const apiUsers = require('./server/routes/api_users');
//////////
var mysql = require('mysql');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
//To start a session
var expressSession = require('express-session');
var MySQLStore = require('express-mysql-session')(expressSession);
var options = {
  host: 'sql9.freemysqlhosting.net',
  port: '3306',
  user: 'sql9214195',
  password: '2ddXZXDT3m',
  database: 'sql9214195'
};
var connection = mysql.createConnection(options);
var sessionStore = new MySQLStore({}, connection);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//////////////


var port = process.env.PORT || 3000;

var app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



///////////////////
//To check syntax
app.use(expressValidator());
//To read cookies with our secret
app.use(cookieParser('JlNyXZDRfW8bKhZT9oR5XYZ'));
//To configure our session that can be stored in the db
app.use(expressSession({
  secret: 'JlNyXZDRfW8bKhZT9oR5XYZ',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  //Todo: change this
  cookie: {secure: false}
}));
//To start passport
app.use(passport.initialize());
app.use(passport.session());
/////////////////////////////////////////


app.use('/api_scrawlers', apiScrawlers);
app.use('/api_users', apiUsers);



//Default page is index
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});


app.listen(port, function () {
  console.log("Server running on localhost: "+ port);
});


