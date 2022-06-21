const User=require('../models/user');


module.exports.register=(req,res)=>{
    res.render('users/register'); 
}

module.exports.adduser=async (req,res)=>{
    try{
    const {email,username,password}=req.body.user;
    const newUser= new User({email,username});
    const result=await User.register(newUser,password);

    
    req.login(newUser,err=>{
        if(err) return next(err)
        req.flash('success',"Welcome to Yelp Camp!!!!!!");

        res.redirect('/') 
    })
      
}catch(e){
        req.flash('error',e.message)
        res.redirect('/user/register')
    }
  
}


module.exports.login=(req,res)=>{
    res.render('users/login');
}
module.exports.loginnow=(req,res)=>{
    req.flash("success","Succesfullly LOGGED in ")
    
    
    res.redirect('/');
}
module.exports.logout=(req,res)=>{
    //This callback fumction is due to new update
    req.logOut(()=>{
        req.flash('success',"GOODBY tika muchkond hogole")
        res.redirect('/')
    });
   
}