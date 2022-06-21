const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync')

const Campground=require('../models/campground')
const campgrounds=require('../controllers/campgrounds')
const {storage}=require('../cloudinary/index')
const campground = require('../models/campground');
const {validateCampground,isAuthor,isLoggedIn}=require('../middleware')
const multer=require('multer');
const upload=multer({storage});

router.get('/',catchAsync(campgrounds.index));

router.get('/new',isLoggedIn,campgrounds.new);

router.get('/:id/edit',catchAsync(campgrounds.edit));

router.post('/new',isLoggedIn,upload.array('camground[image]'),validateCampground, catchAsync(campgrounds.madenew));


router.get('/:id',isLoggedIn,catchAsync(campgrounds.show));

router.put('/edit/:id',isLoggedIn,isAuthor,upload.array('camground[image]'),validateCampground, catchAsync(campgrounds.editcamp));

router.delete('/:id/delete',catchAsync(campgrounds.deletecamp));

module.exports=router;