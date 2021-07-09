const mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    username :{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

var User = module.exports = mongoose.model("users",userSchema);