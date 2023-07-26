const PORT = process.env.PORT || 5000;

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBw9rbZs31b9UM50qYMMuaxajqZOGSYacA",
//   authDomain: "signup-signin-5966f.firebaseapp.com",
//   projectId: "signup-signin-5966f",
//   storageBucket: "signup-signin-5966f.appspot.com",
//   messagingSenderId: "69770450332",
//   appId: "1:69770450332:web:40e322541ab4296b27e459",
//   measurementId: "G-W75CRBDFRW"
// };

// Initialize Firebase
// const apps = initializeApp(firebaseConfig);
// const analytics = getAnalytics(apps);
















require('dotenv').config();
const express=require("express");
// const md5=require("md5");
const bodyparser=require("body-parser");
const  mongoose  = require("mongoose");

// session and cookies and authentication using 
// passport(
const session = require('express-session');
const passport =require('passport');
// const passportlocalmongoose=require('passport-local-mongoose');
  // )
const encrypt=require('mongoose-encryption');
const alert=require("alert");
const bcrypt=require('bcrypt');
const saltrounds=0;
//oauth
// const GoogleStrategy=require('passport-google-oauth20').Strategy
// passport.use(new GoogleStrategy({
//   clientID: process.env.client_id,
//   clientSecret: process.env.client_secret,
//   callbackURL: "http://localhost:3000/auth/google/signin"
// },
// function(accessToken, refreshToken, profile, cb) {
//   User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     return cb(err, user);
//   });
// }
// ));


const app=express();
 
app.set('view engine','ejs')
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"));
// const u=process.env.uri;
// console.log(u);


// app.use(session({
//   secret: 'our little secret',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))
// app.use(passport.session());

mongoose.connect(process.env.uri+"usersdata")


const dataschema=new mongoose.Schema({
    username:String,
    emailid:String,
    password:String
})
// const GoogleStrategy=require('passport-google-oauth20').Strategy
// passport.use(new GoogleStrategy({
//   clientID: process.env.client_id,
//   clientSecret: process.env.client_secret,
//   callbackURL: "http://www.example.com/auth/google/callback"
// },
// function(accessToken, refreshToken, profile, cb) {
//   User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     return cb(err, user);
//   });
// }
// ));
// dataschema.plugin(passportlocalmongoose);
const secret=process.env.secret;
dataschema.plugin(encrypt,{secret:secret,encryptedFields:['password']});
const userdata= mongoose.model("user",dataschema);
app.get("/",function(req,res){
  res.sendFile(__dirname+"/home.html");
})
app.get("/signuphtml",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})
app.post("/signup",function(req,res){
    uname=req.body.username;
    email=req.body.emailid;
//     // pass= md5(req.body.password);
    pass=req.body.password;
    // bcrypt.hash(pass,saltrounds,function(err,hash){
      const data=userdata({
        username:uname,
    emailid:email,
    password:pass
    })
    userdata.findOne({emailid:email}).then((user)=>{
     if (user){
    res.render('error',{emailid:email})

  }
        else{
    data.save().then((data)=>{
      if(data){
        console.log("data saved");
        res.redirect("/signup"); 
      }
      else{
        console.log("error");
      }
    });}
    
})
    // })
 })
app.get("/signup",function(req,res){
  res.render('data',{process:"successfully signedup"});
})
let password="";
app.post("/signin",function(req,res){
    email=req.body.emailid;
    pass=req.body.password;
    console.log(pass);
  userdata.findOne({emailid:email}).then((user)=>{
    if (user){
         password=user.password;
         console.log(password);
         if(pass==password){
            res.redirect("/signin");
          }
        else{
            res.send("unsuccessful"); 
        }



      //   bcrypt.compare(pass, password, function(err, result) {
      //    if(result){
      //     res.redirect("/signin");
      //    }
      //     else{
      //           res.send("unsuccessful");
      //           console.log(result); 
      //       }
      // });
       
    }
  })
  
});

app.get("/signinhtml",function(req,res){
    res.sendFile(__dirname+"/signin.html");
})
app.get("/signin",function(req,res){
  res.render('data',{process:"successfully signedin"});
})
app.listen(PORT,function(req,res){
    console.log("server 3000 started");
})






// console.log(md5("12"))

