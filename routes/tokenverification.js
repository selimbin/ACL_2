const jwt= require('jsonwebtoken');

module.exports= (req, res, next)=>{
    try{
        const token= req.headers.token
        if(!token)  
        {
            res.status(401).status('Access deined')
        }
        const verified= jwt.verify(token, process.env.TOKEN_SECRET)
        if(!verified){
            return res.status(401).json({msg:"unauthorized"});
        }
        req.user= verified
        next()
    }
    catch(err){
        res.status(500).json({error:error.message});
    }
}