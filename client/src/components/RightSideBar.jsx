import  { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])

  useEffect(() => {
    if (messages) {
      setMsgImages(
        messages.filter(msg => msg.image).map(msg => msg.image)
      )
    }
  }, [messages])

  return (
    selectedUser && (
      <div className={`bg-[#8185B2]/10 text-white w-full h-full overflow-y-auto ${selectedUser ? 'max-md:hidden' : ''}`}>
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 h-20 rounded-full object-cover"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {onlineUsers.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
            {selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto text-center">
            {selectedUser.bio}
          </p>
        </div>

        <hr className='border-[#ffffff50] my-4' />

        {msgImages.length > 0 && (
          <div className="px-5 text-xs">
            <p className="font-medium mb-2">Media</p>
            <div className="grid grid-cols-2 gap-2">
              {msgImages.map((img, index) => (
                <div key={index} className="cursor-pointer">
                  <img
                    src={img}
                    alt=""
                    className="w-full h-24 object-cover rounded-md hover:opacity-80 transition-opacity"
                    onClick={() => window.open(img, '_blank')}
                  />
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
    )
  );
};

export default RightSidebar;