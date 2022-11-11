const express=require("express");
 const {routerProducto,routerCarrito}=require("./src/routes/routes.js")
const{Server:http}=require ("http");
const {Server:ioServer}=require ("socket.io");
const User=require("./src/schema/schemaUser.js")
const {saveMsjs, getMsjs}=require ("./src/controllers/mensajes.js")
const session =require("express-session")
const MongoStore=require("connect-mongo");
const LocalStrategy = require('passport-local').Strategy;
const passport = require("passport");
const { comparePassword, hashPassword } = require("./utils")
// const {connect} = require('./src/config/dbConfig.js');
const { Types } = require("mongoose");

const nodemailer= require('nodemailer');
const { argv0 } = require("process");
const { db } = require("./src/schema/schemaProducts.js");

const app = express();
const httpserver = http(app)
const io = new ioServer(httpserver)

app.use("/public", express.static('./public/'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/productos', routerProducto);
app.use('/api/carritos', routerCarrito);

//CONEXION A DB MONGO

app.use(session({
    secret: 'STRING_TO_SIGN_SESSION_ID',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: 'mongodb+srv://andres:Dorian23@cluster0.ohq5xhd.mongodb.net/ecommerce?retryWrites=true&w=majority',
      retries: 0,
      ttl: 10 * 60 , // 10 min
    }),
  })
);


app.use(passport.initialize());
app.use(passport.session());


 //   //RECUPERO EL NOMBRE YA EN SESION INICIADA
 app.get('/loginEnv', (req, res) => {
  process.env.USER=req.user.name;
  process.env.avatar=req.user.avatar;
  const user = process.env.USER;
  const avatar=process.env.avatar;
  res.send({
      user,avatar
  })
  
})


//RECUPERO EL NOMBRE YA EN SESION INICIADA
app.get('/getUserNameEnv', (req, res) => {
  const user = process.env.USER;
  const avatar=process.env.avatar
    res.send({
      user,avatar
  })
})

app.get("/", (req,res)=>{

    try{
        if (req.session.user){
           res.sendFile(__dirname + ('/public/index.html'))
        }
        else
        {
            res.sendFile(__dirname + ('/views/login.html'))
        }
    }
    catch (error){
     console.log(error)
    }

})

io.on('connection', async (socket) => {
    console.log('Usuario conectado');
    socket.on('enviarMensaje', (msj) => {
        saveMsjs(msj);
    })

    socket.emit ('mensajes', await getMsjs());
})

// // DESLOGUEO DE USUARIO

app.get('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/logout');
            }
        })
    } catch (err) {
        console.log(err);
    }
})
app.get('/logoutMsj', (req, res) => {
    try {
        res.sendFile(__dirname + '/views/logout.html');
    }
    catch (err) {
        console.log(err);
    }
})
 
  app.get("/login", (req, res) => {
    const user=req.session.user;
    res.sendFile(__dirname + "/views/login.html");
  });

  app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/views/register.html");
  });

  app.get("/loginFail", (req, res) => {
    res.sendFile(__dirname + "/views/loginFail.html");
  });

  app.get("/signupFail", (req, res) => {
    res.sendFile(__dirname + "/views/signupFail.html");
  });


  app.post("/signup", passport.authenticate("signup", {
    failureRedirect: "/signupFail",
  }) , (req, res) => {  
    req.session.user = req.user;
    res.redirect("/login");
  });
  
  app.post("/login", passport.authenticate("login", {
    failureRedirect: "/loginFail",
  }) ,(req, res) => {
      req.session.user = req.user;
      res.redirect('/');
  });


  
const PORT = process.env.PORT || 8080;

const server = httpserver.listen(PORT, () => {
    console.log(`Server is running on port: ${server.address().port}`);
});
server.on('error', error => console.log(`error running server: ${error}`));

