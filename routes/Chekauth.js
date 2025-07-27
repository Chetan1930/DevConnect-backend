const { ensureAuth } = require('../middlewares/protectRoute.js');
const router = require('express').Router();

router.get('/', ensureAuth, (req, res) => {
  console.log("logged in user , i'm inside checkauth:",req.user._id);
  res.send("<h1>App Login ke baad Protected Route ke andar ho bhai 👊</h1>");
});

module.exports = router;
