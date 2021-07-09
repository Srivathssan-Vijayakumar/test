exports.isUser = function(req,res,next){
    if(req.user){
        next();
    }
    else{
        req.flash('danger',"Please Log in to continue.");
        res.redirect("/login");
    }
}