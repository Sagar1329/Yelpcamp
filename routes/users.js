const express=require('express')
const router=express.Router();
const catchAsync=require('../utils/catchAsync')
const User=require('../models/user');
const { reviewSchema } = require('../schemas');
const passport=require('passport')
const users=require('../controllers/users')



router.get('/register',users.register)
router.post('/register',catchAsync(users.adduser));
router.get('/login',users.login);
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/user/login'}),users.loginnow)

router.get('/logout',users.logout)
module.exports=router;