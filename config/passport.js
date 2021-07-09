const jwtStrategy = require('passport-jwt').Strategy;
const Extractjwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const keys = require('./keys')
var cookieExtracter = function(req){
    var token ="";
    if(req,req.cookies){
        token = req.cookies['access-token']
    }
    return token;
};
const opts={};

opts.jwtFromRequest = cookieExtracter;
opts.secretOrKey = keys.secretOrKey;
console.log(opts.secretOrKey);

module.exports = (passport) => {
    passport.use(new jwtStrategy(opts,(jwt_payload,done) => {
        //console.log(jwt_payload);
        User.findOne({username:jwt_payload.username},(err,user)=>{
            if(user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        });
    }));
}

