if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
 
 
}
console.log("changes")
const express =require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate');
const Joi=require('joi');
const Review=require('./models/reviews');
const {campgroundSchema,reviewSchema}=require('./schemas');
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const Campground=require('./models/campground');
const User=require('./models/user');
const methodoverride=require('method-override');
const camproutes=require('./routes/campground');
const reviewRoutes=require('./routes/reviews');
const userRoutes=require('./routes/users');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const isLoggedIn=require('./middleware');
const mongoSanitize=require('express-mongo-sanitize')
const helmet=require('helmet')

const dbURL=process.env.DB_URL
//'mongodb://localhost:27017/yelp-camp'
const localdbURL='mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbURL,{
useNewUrlParser:true,
useUnifiedTopology:true});
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connectedddddd")
});
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
const scriptSrcUrls = [
    "https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js",
    "https://cdn.jsdelivr.net/npm/bs-custom-file-input/dist/bs-custom-file-input.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    'https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css',
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dqhfwzvja/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method'));
app.use(mongoSanitize())
app.use(express.static(path.join(__dirname,'public')));

const secret=process.env.SECRET ||'thisshouldbeabettersecret!'
const store=new MongoStore({
    mongoUrl:dbURL,
    secret:secret,
    touchAfter:24*60*60
});
store.on("error",function(e){
    console.log("SESSION  STORE ERROR",e)  
})
                                  

const sessionConfig={
    store:store,
    name:"FuckYOuWeb",
    secret:"ThisisSecret",
    resave:false,
    //store:MongoStore.create(),
    saveUninitialized:true,
    cookie:{
httpOnly:true,
//secure:true,
    expires:Date.now()+ 1000*60*60*24*7,
    maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
});
app.get('/',(req,res)=>{
    res.render('campgrounds/home')
});

app.use('/campground',camproutes);
app.use('/campground/:id/reviews',reviewRoutes);
app.use('/user',userRoutes);

const port=process.env.PORT ||3000;
app.listen(port,()=>{
    console.log("SErving on 3000")
});

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found',404))
});

app.use((err,req,res,next)=>{
    const {statusCode=500,message="Fuck SOmething is wrong"}=err;
    if(!err.message) err.message="Fuck YOu"
    res.status(statusCode).render('error',{err});
    res.send("Something went wrong")
});
