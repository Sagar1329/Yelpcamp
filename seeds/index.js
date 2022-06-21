
const mongoose=require('mongoose');
const Campground=require('../models/campground') ;
const cities =require('./cities')
const {places,descriptors}=require('./seedHelper')
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
useNewUrlParser:true,

useUnifiedTopology:true});


const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connectedddddd")
});
 
const sample=(array=>{
     return array[Math.floor(Math.random()*array.length)];
 });


const seedDB=async ()=>{
    await Campground.deleteMany({});
    console.log("DELTED")
 for(let i=0;i<500;i++){
 const random100=Math.floor(Math.random()*1000);
 const newcamp=new Campground({
    author:'62a3915a9446b53e378b0123',
    title:`${sample(descriptors)}  ${sample(places)}`, 
    location:`${cities[random100].city} ${cities[random100].state}`,
    images:{
        url: 'https://res.cloudinary.com/dqhfwzvja/image/upload/v1655016816/Yelpcamp/mzrk2gg15meetrmhscaf.jpg',
      filename: 'Yelpcamp/mzrk2gg15meetrmhscaf'
    },
    geometry:{
        type:'Point',
        coordinates:[cities[random100].longitude,cities[random100].latitude]
    }
    ,
    price:random100,
     description:`Rank: ${cities[random100].rank} \nPopulation: ${cities[random100].population}`})
await newcamp.save();


}
}



seedDB().then(()=>{
    mongoose.connection.close();
})