'use strict';
let router = require('express').Router();
let posts = require('./posts.js');

router.get('/', posts.getPosts);
router.get('/:id', posts.getPost);
router.post('/', posts.addPost);
router.delete('/:id', posts.deletePost);

module.exports = router;