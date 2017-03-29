'use strict';
let router = require('express').Router();

router.get('/fast', (req, res) => {
  res.send(`hello from pid-${process.pid}`);
});
router.get('/delay/:seconds', (req, res) => {
  let milliSeconds = (req.params.seconds || 60 ) * 1000;
  setTimeout(() => {
    res.send(`pid-${process.pid} delayed response`);
  }, milliSeconds);
});
router.get('/longrunning', (req, res) => {
  for(let i = 0; i < 1e10; i++);
  res.send(`pid-${process.pid} at last completed the long running task :)`);
});

module.exports = router;