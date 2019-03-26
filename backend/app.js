const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const settings = require('./settings.json');

const applicantRoutes = require('./routes/applicant');
const superviserRoutes = require('./routes/superviser');

const app = express();

let MONGODB_URL = 'mongodb+srv://' + settings.DB_USERNAME + ':';
MONGODB_URL += settings.DB_PASSWORD + '@';
MONGODB_URL += settings.DB_HOST + '/';
MONGODB_URL += settings.DB_NAME + '?retryWrites=true';

mongoose.connect(MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to MongoDB!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB!');
    console.error(error);
  });

const port = settings.PORT;
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/applicant-api/', applicantRoutes);
app.use('/superviser-api/', superviserRoutes);

app.listen(port);

module.exports = app;
