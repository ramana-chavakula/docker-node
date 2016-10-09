'use strict';
const Config = require('../config.js');
let mongodb = require('mongodb');
let counter = require('../utils/counter.js');
let MongoClient = mongodb.MongoClient;
let mongoDbUrl = Config.mongoDbUrl;

class Posts {
  getPosts(req, res) {
    MongoClient.connect(mongoDbUrl, (err, db) => {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        throw err;
      }
      /*
        default return value of find is cursor and we use cursor.each((err, doc)=>{}) to iterate the cursor untill we read all the records say until doc is null.
        we use toArray which will return an array of documments
      */
      db.collection('posts').find({}).toArray((err, docs) => {
        if (err) {
          throw err;
        }
        db.close();
        res.send(docs);
      });
    });
  }
  getPost(req, res) {
    let id = req.params.id;
    MongoClient.connect(mongoDbUrl, (err, db) => {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        throw err;
      }
      let query = { _id: id };
      db.collection('posts').findOne(query, (err, doc) => {
        if (err) {
          throw err;
        }
        console.log(doc);
        db.close();
        res.send(doc);
      });
    });
  }
  addPost(req, res) {
    let data = req.body;
    MongoClient.connect(mongoDbUrl, (err, db) => {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        throw err;
      }
      counter.getNextId(db, 'post', (err, id) => {
        data['_id'] = id;
        if (err) {
          throw err;
        }
        db.collection('posts').insert(data, (err, result) => {
          if (err) {
            throw err;
          }
          db.close();
          res.send(result);
        });
      });
    });
  }
  deletePost(req, res) {
    let id = req.params.id;
    MongoClient.connect(mongoDbUrl, (err, db) => {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        throw err;
      }
      let query = { _id: id };
      db.collection('posts').remove(query, (err, doc) => {
        if (err) {
          throw err;
        }
        db.close();
        res.send(doc);
      });
    });
  }
}
module.exports = new Posts();