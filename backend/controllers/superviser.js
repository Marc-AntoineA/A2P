'using strict';

const bcrypt = require('bcrypt');
const BCRYPT_SALTROUNDS = require('../settings.json').BCRYPT_SALTROUNDS;
const jwt = require('jsonwebtoken');
const TOKEN_RANDOM_SECRET = require('../settings.json').TOKEN_RANDOM_SECRET;

const Superviser = require('../models/superviser').model;

exports.createSuperviser = (req, res, next) => {
  const body = req.body;
  const username = body.username;
  const password = body.password;
  if (username === undefined || password === undefined) {
    res.status(500).json({
      error: { message: 'Please provide one username and password'}
    });
  }

  bcrypt.hash(password, BCRYPT_SALTROUNDS).then((hash) => {
    const superviser = new Superviser({
      username: username,
      password: hash
    });
    superviser.save().then(() => {
      res.status(201).json({
        message: 'Superviser created successfully'
      });
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    })
  }).catch((error) => {
    res.status(503).json({
      error: { message: 'An unknow error occured. Please contact the admnistrator of this website' }
    });
  });
};

// 401 Unauthorized error
exports.loginSuperviser = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  Superviser.findOne({
    username: username
  }).then((superviser) => {
    if (!superviser) {
      return res.status(401).json({
        error: {message: 'User or password is incorrect'}
      });
    }
    bcrypt.compare(password, superviser.password).then((valid) => {
      if (!valid) {
        return res.status(401).json({
          error: {message: 'User or password is incorrect'}
        });
      }
      const token = jwt.sign({ superviserId: superviser._id }, TOKEN_RANDOM_SECRET, { expiresIn: '24h' });
      res.status(200).json({
        id: superviser._id,
        token: token
      });
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
  }).catch((error) => {
    res.status(500).json({
      error: error
    });
  });
};
