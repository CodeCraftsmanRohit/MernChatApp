import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap } from "../server.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    // Count number of messages not seen
    const unseenMessages = {};

    for (const user of filteredUsers) {
      const count = await Message.countDocuments({
        senderId: user._id,
        receiverId: userId,
        seen: false
      });
      if (count > 0) {
        unseenMessages[user._id] = count;
      }
    }

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error in fetching users for sidebar",
      error: error.message,
    });
  }
};

//get all msges for selected user

export const getMessages=async(req,res)=>{

    try {
         const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:"Error in fetching messages",error:error.message});
    }

}

//api to mark message  as seen using message ids

export const markMessagesAsSeen=async(req,res)=>{

    try {
        const {id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true,message:"Message marked as seen"});


    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:"Error in marking messages as seen",error:error.message});

    }

}


export const sendMessage=async(req,res)=>{

  try {

    const {text,image}=req.body;
    const receiverId=req.params.id;
    const senderId=req.user._id;

  let imageUrl;
  if(image){
    const uploadResponse =await cloudinary.uploader.upload(image)
    imageUrl=uploadResponse.secure_url;

  }

  const newMessage= await Message.create({
    senderId,
    receiverId,
    text,
    image:imageUrl
  });

  const receiverSocketId=userSocketMap[receiverId];

  if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage);
  }

  res.json({success:true,message:"Message sent successfully",data:newMessage});
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:"Error in sending message",error:error.message});

  }

}