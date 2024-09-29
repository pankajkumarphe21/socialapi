import jwt from 'jsonwebtoken'

const isLoggedIn=(req,res,next)=>{
    if(req.cookies.token===undefined){
        res.redirect('/login');
    }
    else if(req.cookies.token===""){
        res.redirect('/login');
    }
    else{
        let data=jwt.verify(req.cookies.token,process.env.SECRET || 'shhhhhh');
        req.user=data;
        next();
    }
}

export default isLoggedIn;