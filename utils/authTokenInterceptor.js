'use strict';
const Config = require('../config.js');
let jwt = require('jsonwebtoken');
let MongoClient = require('mongodb').MongoClient;
let mongoDbUrl = Config.mongoDbUrl;

module.exports = (req, res, next) => {
  let token = req.headers['access-token'];
  if (token) {
    MongoClient.connect(mongoDbUrl, (err, db) => {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        throw err;
      }
      db.collection('tokens').findOne({ token: token }, (err, doc) => {
        if (err) {
          throw err;
        }
        if (doc !== null) {
          return res.status(405).send({
            message: 'this token has been revoked.'
          });
        } else {
          // verifying token
          jwt.verify(token, Config.secret, function (err, decoded) {
            if (err) {
              return res.status(406).send({ message: 'Invalid token.' });
            } else {
              //saving decoded information in request object which can be used in other routes
              req.decoded = decoded;
              next();
            }
          });
        }
      });
    });
  } else {
    // if there is no token check wether the api endoint is present in jwtExcludeEndpoints array
    let flag = false;
    for (let endpoint of Config.jwtExcludeEndpoints) {
      if (req.url.indexOf(endpoint) !== -1) {
        flag = true;
        break;
      }
    }
    if (flag) {
      next();
    } else {
      return res.status(403).send({
        message: 'missing authentication token in the headers.'
      });
    }
  }
}