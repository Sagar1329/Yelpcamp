const Campground=require('../models/campground');
const Review=require('../models/reviews');

module.exports.addreview=async (req,res)=>{
    const {id}=req.params;
    const camp= await Campground.findById(id).populate('author');
    const newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save()
    req.flash("success","Succesfully added the review");
    res.redirect(`/campground/${camp.id}`)
    }

module.exports.deletereview=async(req,res)=>{
    const {id,reviewid}=req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviewid}})
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Succesfully deleted the review");
    res.redirect(`/campground/${id}`);
    };