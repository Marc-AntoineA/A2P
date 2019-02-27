const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const settings = require('./settings.json');
const applicantRoutes = require('./routes/applicant');

const app = express();

let MONGODB_URL = 'mongodb://' + settings.DB_USERNAME + ':';
MONGODB_URL += settings.DB_PASSWORD + '@';
MONGODB_URL += settings.DB_HOST + ':';
MONGODB_URL += settings.DB_PORT + '/';
MONGODB_URL += settings.DB_NAME;

mongoose.connect(MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to MongoDB!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB!');
    console.error(error);
  });

const port = settings.PORT;

app.all('*', function(req, res, next) {
     var origin = req.get('origin');
     res.header('Access-Control-Allow-Origin', 'origin');
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/applicant-api/', applicantRoutes);

app.listen(port);

module.exports = app;
