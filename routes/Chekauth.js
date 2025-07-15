const { protectRoute } = require('../middleware/protectRoute');

const route = require('express').Router();



route.get('/',protectRoute ,(req,res)=>{
    res.send("<h1>App Login kre hue Route ke Ander ho Bhai</h1>");
});




module.exports = route;