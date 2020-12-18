const jwt= require('jsonwebtoken');

module.exports= (req, res, next)=>{
    const token= req.headers.token
    if(!token)  
    {
        res.status(401).status('Access deined')
    }
    try{
        const verified= jwt.verify(token, process.env.TOKEN_SECRET)
        req.user= verified
        next()
    }
    catch(err){
        res.status(400).send('Invalid Request')
    }
}