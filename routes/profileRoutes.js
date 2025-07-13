const route = require('express').Router();
const Profile = require("../models/profile");


route.get('/:id', async(req,res)=>{
    const {id} =req.params;
    const user = await User.findOne({id});
    res.json(user);
})



module.exports = route;