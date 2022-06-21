const express=require('express');
const router=express.Router({mergeParams:true}); //merparams is used to mere=ge the id presetn in app.js with this file
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campground');
const Review=require('../models/reviews');
const {campgroundSchema,reviewSchema}=require('../schemas')
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware')
const reviews=require('../controllers/reviews')






router.post('/',isLoggedIn,validateReview,catchAsync(reviews.addreview));

    
router.delete('/:reviewid',isLoggedIn,isReviewAuthor,catchAsync(reviews.deletereview));
    
module.exports=router;