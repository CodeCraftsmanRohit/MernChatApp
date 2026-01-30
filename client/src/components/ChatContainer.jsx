import React, { useEffect, useContext, useState, useRef } from "react";
import assets from "../assets/assets.js";
import formatMessageTime from "../lib/utils.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, sendMessage, getMessages, setSelectedUser } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (scrollEnd.current && messages.length > 0) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 h-8 rounded-full object-cover" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>

      {/* Chat messages */}
      <div className="flex flex-col h-[calc(100%-102px)] overflow-y-auto p-3 pb-6">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex items-end gap-2 ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}
          >
            {msg.senderId !== authUser._id && (
              <img
                src={selectedUser?.profilePic || assets.avatar_icon}
                alt=""
                className="w-7 h-7 rounded-full"
              />
            )}

            <div className={`max-w-[70%] ${msg.senderId === authUser._id ? "order-1" : "order-2"}`}>
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[200px] border border-gray-700 rounded-lg overflow-hidden"
                />
              ) : (
                <p className={`p-2 md:text-sm font-light rounded-lg break-all ${
                  msg.senderId === authUser._id
                    ? "bg-violet-500/30 text-white rounded-br-none"
                    : "bg-gray-700/30 text-white rounded-bl-none"
                }`}>
                  {msg.text}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>

            {msg.senderId === authUser._id && (
              <img
                src={authUser?.profilePic || assets.avatar_icon}
                alt=""
                className="w-7 h-7 rounded-full"
              />
            )}
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom area */}
      <div className="flex items-center gap-3 p-3 border-t border-stone-500 bg-[#181A2A]">
        <div className="flex items-center flex-1 bg-gray-100/12 rounded-full px-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
            className="flex-1 text-sm p-3 bg-transparent outline-none text-white placeholder-gray-400"
          />
          <input onChange={handleSendImage} type="file" id="image" accept="image/*" hidden />
          <label htmlFor="image" className="cursor-pointer">
            <img src={assets.gallery_icon} alt="" className="w-6 mr-2" />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 h-full">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;