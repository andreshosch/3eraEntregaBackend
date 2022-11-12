const express=require("express");
const mongoose=require("mongoose")
const{Server:http}=require ("http");
const {Server:ioServer}=require ("socket.io");
const User=require("..//../src/schema/schemaUser.js")
const {saveMsjs, getMsjs}=require ("../../src/controllers/mensajes.js")
const session =require("express-session")
const MongoStore=require("connect-mongo");
const LocalStrategy = require('passport-local').Strategy;
const passport = require("passport");
const { comparePassword, hashPassword } = require("../../utils.js")
// const {connect} = require('./src/config/dbConfig.js');
const { Types } = require("mongoose");

const nodemailer= require('nodemailer');
const { argv0 } = require("process");
const { db } = require("..//..//src/schema/schemaProducts.js");
const CarritoDaoMongo = require("../dao/cartDao.js");
const { captureRejectionSymbol } = require("events");

const app = express();
const httpserver = http(app)
const io = new ioServer(httpserver)

module.exports=class userMongoController {
    constructor(collection, schema) {
        this.collection = mongoose.model(collection, schema);
    }
}



//LOGUEO DE USUARIO

passport.use("login", new LocalStrategy(async (mail, password, done) => {
    const user = await User.findOne({ mail });
    if (user){
  const  passHash = user.password;
    if (!user || !comparePassword(password, passHash)) {
      return done(null, null, { message: "Invalid username or password" });
    }
  }
   return done(null, user);
 }));

 //REGISTRO DE USUARIO
passport.use("signup", new LocalStrategy({
    passReqToCallback: true
  }, async (req, mail, password, done) => {
    const user = await User.findOne({ mail });  
    countUser=await db.collection("users").countDocuments()
    if (user) {
     return done(new Error("El usuario ya existe!"),
     null);
    }
    if(countUser===0)
    {  
    const id=1;  
    const address = req.body.address;
    const name = req.body.names;
    const direction = req.body.direction;
    const age = req.body.age;
    const phone = req.body.phone;
    const avatar =`../public/images/${req.body.avatar}` ;
    const hashedPassword = hashPassword(password);
    const newUser = new User({ id, mail, password: hashedPassword , address,name,direction,age,phone,avatar });
    await newUser.save();
    send(newUser);
    return done(null, newUser);
  }
  else{
    const id=countUser+1;  
    const address = req.body.address;
    const name = req.body.names;
    const direction = req.body.direction;
    const age = req.body.age;
    const phone = req.body.phone;
    const avatar =`../public/images/${req.body.avatar}` ;
    const hashedPassword = hashPassword(password);
    const newUser = new User({ id,mail, password: hashedPassword , address,name,direction,age,phone,avatar });
    await newUser.save();
    sendMailUser(newUser);
    return done(null, newUser);
  }
  }));

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
      id = Types.ObjectId(id);
      const user = await User.findById(id);
      done(null, user);
    });
  
     
 
  
  async function sendMailUser(user) {
    try {
      await transporter.sendMail({
        to:"retete2854@sopulit.com",
        from:"iva12@ethereal.email",
        subject:"Nuevo Usuario Registrado",
        html:`${user}`
    });
    } catch (err) {
      console.log(err);
    }
  }
  // MANDAR MAIL AL CREAR USUARIO NUEVO

  const transporter = nodemailer.createTransport({
    service:"gmail",
    host: 'smtp.gmail.email',
    port: 587,
    auth: {
        user: 'andreshosch114@gmail.com',
        pass: "pripxpboynmzhqev"
    }
  });
  
  