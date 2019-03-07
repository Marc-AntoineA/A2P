const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const Process = require('../models/process').model;

const settings = require('../settings.json');
const processExample = require('./process.json');
/*
  POPULATE DATABASE -- create default process
*/

let MONGODB_URL = 'mongodb+srv://' + settings.DB_USERNAME + ':';
MONGODB_URL += settings.DB_PASSWORD + '@';
MONGODB_URL += settings.DB_HOST + '/';
MONGODB_URL += settings.DB_NAME + '?retryWrites=true';

mongoose.connect(MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('Population...');
    console.log(processExample);

    const process = new Process(processExample);
    console.log(process);
    process.save()
      .then(() => {
        console.log('population done');
      })
      .catch((error) => {
        console.log('Error during population: ', error);
      });
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB!');
    console.error(error);
  });
