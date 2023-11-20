const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Subuswain';

const fetchuser = (req,res,next)=>{
    let success = false;
    const token = req.header ('auth-token');
    if(!token){
        return res.status(401).send({success,error:"please authenticate with valid token"});
    }
    try{
        const data = jwt.verify(token, JWT_SECRET);
        if(!data){
            return res.status(401).send({success,error:"please authenticate with valid token"});
        }
        req.user = data.user;
        next();
    }
    catch(error){
        return res.status(401).send({success,error:"please authenticate with valid token"});
    }
}

module.exports = fetchuser;