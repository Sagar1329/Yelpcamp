const Campground=require('../models/campground')
const {cloudinary}=require('../cloudinary');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geoCoder=mbxGeocoding({ accessToken:mapBoxToken})
module.exports.index=async (req,res)=>{
    const camp=await Campground.find({})
    res.render('campgrounds/index',{camp})
}
module.exports.new=(req,res)=>{
   
    res.render('campgrounds/new');
}

module.exports.edit=async (req,res)=>{
    const {id}=req.params
    const camp=await Campground.findById(id)
    res.render('campgrounds/edit',{camp})
}
module.exports.madenew=async (req,res,next)=>{
    //if(!req.bod.camground) throw new ExpressError("Invalid data",400);
  const geoData=await geoCoder.forwardGeocode({
    query:req.body.camground.location,
    limit:1
  }).send()
 
  const {title,location,description,price,image}=req.body.camground;
    const newcamp=new Campground({title:title,location:location,description:description,price:price,images:image})
    
 newcamp.geometry= geoData.body.features[0].geometry;

    newcamp.images=  req.files.map(f=>({
        url:f.path,filename:f.filename
    }));
    newcamp.author=req.user._id;
    const rew=await newcamp.save();
    console.log(rew)
    req.flash('success',"Succesfully made a new Campground");
    res.redirect('/campground');
  
}

module.exports.show=async (req,res,next)=>{
    
    const {id} =req.params;
    const camp=await Campground.findById(id)
    .populate({
        path:'reviews',
        populate:{
            path:'author'
        }
}).populate('author');

    if(!camp){
        req.flash('error',"Campground Not Found:(");
        res.redirect('/campground')
    }
    res.render('campgrounds/show',{camp});
  
}

module.exports.editcamp=async (req,res)=>{
    const {id}=req.params; 
    const geoData=await geoCoder.forwardGeocode({
        query:req.body.camground.location,
        limit:1
      }).send()
    const edcamp=await Campground.findByIdAndUpdate(id,{...req.body.camground});
    const imgs=req.files.map(f=>({
        url:f.path,filename:f.filename
    }))
    edcamp.images.push(...imgs);
   edcamp.geometry= geoData.body.features[0].geometry;
    await edcamp.save();
    if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await  cloudinary.uploader.destroy(filename)
    }
        await edcamp.updateOne({$pull: {images:{filename:{$in:req.body.deleteImages }}}});
     } 
     
    
    req.flash('success',"Succesfully Updated Campground")
    res.redirect(`/campground/${id}`)
}

module.exports.deletecamp= async(req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error',"NIN CAMPGROUND JOTHE ENADRU MADKO BERE AVRDU YAKE UNAK BARTYA")
        return res.redirect(`/campground/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success',"Successfully Delelted")
    res.redirect("/campground")
}