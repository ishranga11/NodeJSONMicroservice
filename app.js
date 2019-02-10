var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
var verifyToken = require('./middleware/checkAuth');
var imageFunc = require('./middleware/imageDownload');
var jsonpatch = require('json-patch');

dotenv.config();
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api',(req,res) => {
  res.json({
      message: 'Welcome to the API'
  })
});

// app.post('/api/posts', verifyToken, (req,res) => {
//   res.json({
//       out: req.userId
//   });
// });

app.post('/api/jsonpatch', verifyToken, (req,res) => {
    jsonpatch.apply(req.body.jsonObject,req.body.jsonPatch);
    res.json({
        Patched: req.body.jsonObject
    });
});

app.post('/api/image', verifyToken, imageFunc, (req,res) => {
});

app.post('/api/login', (req,res) => {
  const user = {
      username : req.body.username,
      password : req.body.password
  };
  jwt.sign({user},process.env.JWT_KEY, (err,token) => {
    res.json({
        token
    });
  });
});

app.listen(6000, ()=> console.log('Server running on port 5000'));

module.exports = app;
