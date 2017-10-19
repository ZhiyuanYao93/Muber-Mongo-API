const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test'){
  mongoose.connect('mongodb://localhost/muber');
}

app.use(bodyParser.json());

routes(app);

app.use((err,req,res,next)=>{
  res.status(422).send({error:err._message});
});

module.exports = app;
