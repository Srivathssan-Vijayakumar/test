const express = require('express')
const mongoose = require('mongoose')
const path =require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const app =express()
const { access } = require('fs')
const session = require('express-session')
const passport = require('passport')


mongoose.connect("mongodb://localhost:27017/jwt",{
useNewUrlParser:true,
useUnifiedTopology:true
});
const db =mongoose.connection;
db.on('error',(err)=>{
    console.log(err);
});

db.once('open',()=>{
    console.log('Connected to DB');
});
require('dotenv').config();
console.log('commit to  dev');
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
}))


app.use(require('connect-flash')());
app.use(function(req,res,next){
    res.locals.messages = require('express-messages')(req,res);
    next();
});

app.use(passport.initialize());
require('./config/passport')(passport);

var Home = require('./routes/home')
app.use("/",Home);

const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log('Listening on the Port : '+PORT);
});