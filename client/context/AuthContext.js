import { Children, createContext, use } from "react";
import toast from "react-hot-toast";
import { connect, io } from "socket.io-client";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.default.baseURL = backendUrl;

export const AuthContext = createContext();




export const AuthProvider = ({ Children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);


const updateProfile=async(body)=>{
    try {

        const {data}=await axios.put("/api/auth/update-profile",body);
        if(data.success){
            setAuthUser(data.updatedUser);
            toast.success(data.message);
        }else{
            toast.error(data.message);
        }

    } catch (error) {
        toast.error(error.message || "Something went wrong");
    }
}


  const checkAuth = async () => {
  try {
    const { data } = await axios.get("/api/auth/check");
    if (data.success) {
      setAuthUser(data.user);
      connectSocket(data.user);
    }
  } catch (error) {
    toast.error(error.message || "Something went wrong");
  }
};


const login=async(state,credentials)=>{
    try {
        const {data}=await axios.post(`/api/auth/${state}`,credentials);
        if(data.success){
            setAuthUser(data.userData);
            connectSocket(data.userData);
            axios.defaults.headers.common["token"]=data.token;
            setToken(data.token);
            localStorage.setItem("token",data.token);
            toast.success(data.message);
        }else{
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message || "Something went wrong");

    }
}

const logout=async()=>{

    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"]=null;
    toast.success("Logged out successfully");
    socket.disconnect();
    setSocket(null);

}


const connectSocket=(userData)=>{
    if(!userData || socket?.connected) return;
    const newSocket=io(backendUrl,{
        auth:{
            userId:userData._id
        }
    });
    new
Socket.on("connect",()=>{
        console.log("Socket connected");
    });
    newSocket.on("online-users",(usersList)=>{
        setOnlineUsers(usersList);
    });
}


  useEffect(() => {
    if (token) {
      axios.default.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };
  return <AuthContext.Provider value={value}>{Children}</AuthContext.Provider>;
};
