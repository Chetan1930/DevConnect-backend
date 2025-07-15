const { ensureAuth } = require('../middleware/protectRoute.js');
const router = require('express').Router();

router.get('/', ensureAuth, (req, res) => {
  res.send("<h1>App Login ke baad Protected Route ke andar ho bhai 👊</h1>");
});

module.exports = router;
