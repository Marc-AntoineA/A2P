'use strict';

const settings = require('../settings.json');
const mongoose = require('mongoose');

mongoose.connect(settings.DATABASE, {'useNewUrlParser': true});

const db = mongoose.connection;
