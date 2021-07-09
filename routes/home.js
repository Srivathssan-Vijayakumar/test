const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const validateToken = require('../jwt')
const {body,validationResult} = require('express-validator');
const passport = require('passport')
const isUser = require('../config/auth')
const secretkey = process.env.JSON_SECRET_KEY;

router.get('/',(req,res)=>{
    var errors = "";
    if(req.session.errors){
        errors = req.session.errors;
    }
    res.render("profile",{
        errors:errors,
        username:""
    })
})
router.get('/register',(req,res)=>{
    if(req.session.errors){
        var errors=req.session.errors;
    }
    req.session.errors=null;
    res.render("register",{errors:errors});
});

router.post('/register',body('username').notEmpty().withMessage("Username must be specified"),body('password').isLength({min:5}).withMessage("Password must be atleast 5 Characters long."),(req,res)=>{
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        req.session.errors = errors.array();
        res.redirect("/register");
    }
    else{
        let username = req.body.username;
        let password = req.body.password; 
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,(err,hashed)=>{
                if(err){console.log(err)};
                user = new User({
                    username:username,
                    password:hashed
                });
                user.save((err)=>{
                    if(err){
                        console.log(err);
                    }
                    req.flash('success','User Registered !.');
                    res.redirect("/login");
                });
            });
        }); 
    }
});



router.get("/login",(req,res)=>{
    if(req.session.errors){
        var errors=req.session.errors;
    }
    req.session.errors=null;
    res.render("login",{
        errors:errors
    });
});
//Authorize User
router.post('/login',body('username').notEmpty().withMessage('No Username Entered'),body('password').notEmpty().withMessage('No Password Entered.'),(req,res)=>{
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        req.session.errors = errors.array();
        res.redirect('/login')
    }
    else{
        let username = req.body.username;
        let password = req.body.password; 
        User.findOne({username:username},(err,user)=>{
            if(err){
                console.log(err);
            }
            if(!user){
                req.flash("danger","No Username Found.")
                res.redirect('/login');
            }
            else{
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err){
                        console.log(err);
                    }
                    if(!isMatch){
                        req.flash("danger","Wrong Username or Password");
                        res.redirect('/login');
                    }
                    else{
                        const token = jwt.sign({username},secretkey);
                        res.cookie('access-token',token,{
                            maxAge:60*60*24*5*1000,
                            httpOnly:true,
                        });
                        req.flash("success","User Authenticated");
                        res.redirect('/profile');
                    }
                });
            }
        });
    }
});



router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res)=>{
    var errors ="";
    if(req.session.errors){
        errors = req.session.errors;    
    }
    if(req.user){
        res.render("profile",{
            errors:errors,
            username:req.user.username
        });
    }
    else{
        req.flash("danger","Please Log In to continue.");
        res.render("login",{
            errors:errors
        });
    }
});

router.get("/logout",(req,res)=>{
    res.clearCookie('access-token');
    req.flash("success","You have Logged Out");
    res.redirect("/");
})

module.exports = router