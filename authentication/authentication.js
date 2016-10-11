'use strict';
const Config = require('../config.js');
let jwt = require('jsonwebtoken');
let MongoClient = require('mongodb').MongoClient;
let mongoDbUrl = Config.mongoDbUrl;

class Authentication {
  signup(req, res) {
    let data = req.body;
    MongoClient.connect(mongoDbUrl, (err, db) => {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        throw err;
      }
      db.collection('users').findOne({ userName: data.userName }, (err, result) => {
        if (err) {
          throw err;
        }
        if (result !== null) {
          res.status(500).send({
            message: 'user name already exists'
          });
        } else {
          db.collection('users').insert(data, (err, result) => {
            if (err) {
              throw err;
            }
            db.close();
            res.send({ message: 'Signed up successfully' });
          });
        }
      });
    });
  }
  login(req, res) {
    let data = req.body;
    MongoClient.connect(mongoDbUrl, (err, db) => {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        throw err;
      }
      db.collection('users').findOne({ userName: data.userName }, (err, user) => {
        if (err) {
          throw err;
        }
        if (user === null) {
          res.status(500).send({
            message: `user name doesn't exists`
          })
        } else {
          if (user.password != data.password) {
            // if user is found and password is wrong
            res.status(500).json({ message: 'Authentication failed. Wrong password.' });
          } else {
            // if user is found and password is right
            // create a token
            let payload = {
              userName: user.userName,
              issuedTimeStamp: Date.now()
            };
            let token = jwt.sign(payload, Config.secret, {
              expiresIn: Config.expiresIn //1440 => expires in 24 hours
            });
            // return the information including token as JSON
            res.json({
              token: token
            });
          }
        }
      });
    });
  }
  revoke(req, res) {
    let token = req.headers['access-token'];
    let issuedTimeStamp = req.decoded.issuedTimeStamp;
    MongoClient.connect(mongoDbUrl, (err, db) => {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        throw err;
      }
      let doc = { token, issuedTimeStamp };
      db.collection('tokens').insert(doc, (err, result) => {
        if (err) {
          throw err;
        }
        res.send({
          message: 'token revoked successfully'
        });
      });
    });
  }
  removeExpiredTokens() {
    MongoClient.connect(mongoDbUrl, (err, db) => {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        throw err;
      }
      let expiredTimeStamp = Date.now() - (Config.expiresIn * 1000);
      db.collection('tokens').remove({issuedTimeStamp: {$lt: expiredTimeStamp}}, (err, result) => {
        if (err) {
          throw err;
        }
      });
    });
  }
}
module.exports = new Authentication();