const { login, register } = require('../controllers/authControllers');

const route=require('express').Router();

route.post('/login',login);
route.post('/register',register);



module.exports = route;