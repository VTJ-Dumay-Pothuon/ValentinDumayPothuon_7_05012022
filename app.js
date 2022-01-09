const express = require('express');
const helmet = require("helmet");
const mysql = require('mysql');
const path = require('path');
const app = express();

const userRoutes = require('./routes/user');


require("dotenv").config();

var con = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "1234"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Express app secure toolset
app.use(helmet());

app.use('/api/auth', userRoutes);

// Required by multer to save pictures on the server
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', function (req, res){
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('<br><br><br><h1 style="text-align:center">SERVEUR OPÉRATIONNEL</h1>');
});

module.exports = app;