import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {generateToken} from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup=async()=>{
    // Signup logic here

    const {fullname,email,password,bio}=req.body;

    try {
        if(!fullname || !email || !password || !bio){
            return res.json({success:false,message:"All fields are required"});
        }

        const user=await User.findOne({email});
        if(user){
            return res.json({success:false,message:"User already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await User.create({
            fullname,
            email,
            password:hashedPassword,
            bio
        });

        const token=generateToken(newUser._id);

        res.json({success:true,message:"User created successfully",data:{user:newUser,token}});

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:"Error in signup",error:error.message});
    }


}

//controller to login a user

export const login=async(req,res)=>{

    try {

        const {email,password}=req.body;

        if(!email || !password){
            return res.json({success:false,message:"All fields are required"});
        }

        const userData=await User.findOne({email});

        if(!userData){
            return res.json({success:false,message:"User not found"});
        }

        const isPasswordValid=await bcrypt.compare(password,userData.password);

        if(!isPasswordValid){
            return res.json({success:false,message:"Invalid password"});
        }

        const token=generateToken(userData._id);

        res.json({success:true,message:"Login successful",userData,token});

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:"Error in login",error:error.message});
    }


}

// controller to update profile details

export const updateProfile=async (req,res)=>{

try {
  const { profilePic, bio, fullName } = req.body;
  const userId = req.user._id;

  let updatedUser;

  if(!profilePic){
    updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        bio,
        fullName
      },
      { new: true }
    );
  }

  // Otherwise — new profile picture file needs to be uploaded
  else {
    const upload = await cloudinary.uploader.upload(profilePic);

    updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: upload.secure_url,
        bio,
        fullName
      },
      { new: true }
    );
  }

  // You can send the updated user back
  res.json({success: true, message: "Profile updated successfully", user: updatedUser});

} catch (error) {
  console.error(error);
  res.json({success:false, message: "Server error", error: error.message });
}

}