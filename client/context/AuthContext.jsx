import { createContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const connectSocket = useCallback((userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);
  }, [socket]);

  const checkAuth = async () => {
    try {
      const { data } = await axios.post("/api/auth/check", {}, {
        headers: { token: localStorage.getItem("token") }
      });
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch {
      setAuthUser(null);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        axios.defaults.headers.common["token"] = data.token;
        localStorage.setItem("token", data.token);
        setAuthUser(data.userData || data.user);
        connectSocket(data.userData || data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["token"];
    socket?.disconnect();
    setAuthUser(null);
    setSocket(null);
    setOnlineUsers([]);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await axios.post("/api/auth/update-profile", profileData, {
        headers: { token: localStorage.getItem("token") }
      });
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      }
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ authUser, onlineUsers, login, logout, updateProfile, socket }}
    >
      {children}
    </AuthContext.Provider>
  );
};