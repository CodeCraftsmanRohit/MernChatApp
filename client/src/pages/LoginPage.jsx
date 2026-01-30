import React, { useState, useContext } from "react";
import assets from "../assets/assets.js";
import { AuthContext } from "../../context/AuthContext.jsx";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const credentials = currState === "Sign up"
      ? { fullName, email, password, bio }
      : { email, password };

    login(currState === "Sign up" ? "signup" : "login", credentials);
  };

  const toggleState = () => {
    setCurrState(currState === "Sign up" ? "Login" : "Sign up");
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <img src={assets.logo_big} alt="logo" className="w-[min(30vw,250px)]" />
      <form onSubmit={handleSubmit} className="border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          <img
            src={assets.arrow_icon}
            className="w-5 cursor-pointer"
            onClick={toggleState}
            alt="toggle"
          />
        </h2>

        {currState === "Sign up" && (
          <input
            value={fullName}
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none text-white bg-transparent"
            placeholder="Full Name"
            required
          />
        )}

        <input
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-gray-500 rounded-md focus:outline-none text-white bg-transparent"
          placeholder="Email"
          required
        />

        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border border-gray-500 rounded-md focus:outline-none text-white bg-transparent"
          placeholder="Password"
          required
        />

        {currState === "Sign up" && (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none text-white bg-transparent"
            placeholder="Write a short bio about yourself"
            required
          />
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
        >
          {currState === "Sign up" ? "Create Account" : "Login"}
        </button>

        {currState === "Sign up" && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" required />
            <p>Agree to terms and conditions & privacy policy.</p>
          </div>
        )}

        <div className="text-sm">
          {currState === "Sign up" ? (
            <p>
              Already have an account?{" "}
              <span className="text-purple-400 cursor-pointer" onClick={toggleState}>
                Login
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span className="text-purple-400 cursor-pointer" onClick={toggleState}>
                Sign up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;