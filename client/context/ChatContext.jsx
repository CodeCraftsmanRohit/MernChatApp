import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "./AuthContext.jsx";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, authUser } = useContext(AuthContext);

  const getUsers = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/messages/users", {
        headers: { token: localStorage.getItem("token") }
      });
      if (data?.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, []);

  const getMessages = useCallback(async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`, {
        headers: { token: localStorage.getItem("token") }
      });
      if (data?.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, []);

  const sendMessage = async (messageData) => {
    try {
      if (!selectedUser) {
        toast.error("No user selected");
        return;
      }
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
        {
          headers: { token: localStorage.getItem("token") }
        }
      );
      if (data?.success) {
        setMessages(prev => [...prev, data.data]);
        // Don't emit socket event here - backend will handle it
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (selectedUser &&
          (newMessage.senderId === selectedUser._id ||
           newMessage.receiverId === selectedUser._id)) {
        setMessages(prev => [...prev, newMessage]);

        // If message is from selected user, mark as seen
        if (newMessage.senderId === selectedUser._id) {
          axios.put(`/api/messages/mark/${newMessage._id}`, {}, {
            headers: { token: localStorage.getItem("token") }
          });
        }
      } else if (newMessage.senderId !== authUser?._id) {
        // Update unseen count for other users
        setUnseenMessages(prev => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, authUser]);

  // Get users when authUser changes
  useEffect(() => {
    if (authUser) {
      getUsers();
    }
  }, [authUser, getUsers]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};