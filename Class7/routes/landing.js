const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('landing', { message: 'Testing... testing...!' });
});

module.exports = router;