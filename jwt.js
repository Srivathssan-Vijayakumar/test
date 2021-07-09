const jwt = require('jsonwebtoken');
var validateToken=(req,res,next)=>{
    const accessToken = req.cookies['access-token']
    if(!accessToken){
        console.log('User Not Authenticated');
        return res.sendStatus(403).redirect('/login');
    }
    else{
        try{
            const validToken = jwt.verify(accessToken,process.env.JSON_SECRET_KEY);
        if(validToken){
            console.log('Authenticated');
            req.authenticated = true;
            next();
        }
        }
        catch(err){
            return res.sendStatus(400).json({error:err});
        }
    }
}
module.exports =validateToken;
