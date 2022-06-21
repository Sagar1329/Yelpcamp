const {campgroundSchema,reviewSchema}=require('./schemas')
const ExpressError=require('./utils/ExpressError');
const Campground=require('./models/campground')
const Review=require('./models/reviews');
const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        
        
        
        req.flash("error","You must be loginned")
        return res.redirect('/user/login')
     }
     next();
}

const validateCampground=(req,res,next)=>{
    const results=campgroundSchema.validate(req.body);
    if(results.error){
        const msg=results.error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
        res.send('eroor')
    } else{
        next();
    }
}
const validateReview=(req,res,next)=>{
    const results=reviewSchema.validate(req.body);
    if(results.error){
        const msg=results.error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    } else{
        next();
    }
}


const isAuthor=async(req,res,next)=>{
    const {id}=req.params
    const camground=await Campground.findById(id);
    if(!camground.author.equals(req.user._id)){
        req.flash('error',"NIN CAMPGROUND JOTHE ENADRU MADKO BERE AVRDU YAKE UNAK BARTYA")
        return res.redirect(`/campground/${id}`);
    }
    next();
}
const isReviewAuthor=async(req,res,next)=>{
    const {id,reviewid}=req.params;
    const camground=await Campground.findById(id);
    const review=await Review.findById(reviewid).populate('author');
    if((!review.author.equals(req.user._id))&&(!camground.author.equals(req.user._id))){
        req.flash('error',"NIN CAMPGROUND JOTHE ENADRU MADKO BERE AVRDU YAKE UNAK BARTYA")
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports={isLoggedIn,validateCampground,isAuthor,validateReview,isReviewAuthor};