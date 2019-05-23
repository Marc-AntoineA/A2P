const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const settings = require('./settings.json');

const applicantRoutes = require('./routes/applicant');
const superviserRoutes = require('./routes/superviser');

const app = express();

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/administration/static-superviser/', express.static(path.join(__dirname, '../superviser-frontend/dist/static-superviser')));
app.get('/administration*', function(req, res) {
  // TODO also go on /administration (without / at the end)
  res.sendFile(path.join(__dirname, '../superviser-frontend/dist', 'index.html'));
});

app.use('/static-applicant/', express.static(path.join(__dirname, '../applicant-frontend/build')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../applicant-frontend/build', 'index.html'));
});

if (typeof(PhusionPassenger) == 'undefined') {
  let MONGODB_URL = 'mongodb+srv://' + settings.DB_USERNAME + ':';
  MONGODB_URL += settings.DB_PASSWORD + '@';
  MONGODB_URL += settings.DB_HOST + '/';
  MONGODB_URL += settings.DB_NAME + '?retryWrites=true';

  mongoose.connect(MONGODB_URL, { useNewUrlParser: true })
    .then(() => {
      console.log('Successfully connected to MongoDB!');

      app.use('/applicant-api/', applicantRoutes);
      app.use('/superviser-api/', superviserRoutes);

    })
    .catch((error) => {
      console.log('Unable to connect to MongoDB!');
      console.error(error)
    });
  }

module.exports = app;
