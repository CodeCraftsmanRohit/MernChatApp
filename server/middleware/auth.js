

export const protectRoute = async (req, res, next) => {

    try {

        const token=req.headers.token;

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const user= await User.findById(decoded._id).select("-password");

        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        req.user=user;
        next();


    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:"Auth Error",error:error.message});

    }

}

//controller to check if user is authenticated
export const checkAuth=(req,res)=>{
    res.json({success:true,message:"Auth successful",user:req.user});
}
