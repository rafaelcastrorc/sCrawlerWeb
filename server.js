const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const apiScrawlers = require('./server/routes/api_scrawlers');
const apiUsers = require('./server/routes/api_users');


var port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api_scrawlers', apiScrawlers);
app.use('/api_users', apiUsers);

//Default page is index
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});


app.listen(port, function () {
  console.log("Server running on localhost: "+ port);
});
