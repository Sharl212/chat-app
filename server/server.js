const path = require('path');
const express = require('express');
const publicPath = path.join(__dirname, '../public');
var app = express();

app.use(express.static(publicPath))
app.get('/', function (req, res, next){
  res.render('index.html')
});

app.listen(3000,
  console.log('server is up on localhost:3000')
);
