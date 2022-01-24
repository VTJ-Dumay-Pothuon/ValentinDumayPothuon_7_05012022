const express = require('express');
const helmet = require("helmet");
const mysql = require('mysql');
const path = require('path');
const cors = require("cors");
const app = express();

const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const likeRoutes = require('./routes/like');


require("dotenv").config();

const con = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', "http://localhost:8080");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  next();
});

app.use(helmet());
app.use(cookieParser());

app.use(cors({origin: "http://localhost:8080", credentials: true}));

app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like', likeRoutes);

// Required by multer to save pictures on the server
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;