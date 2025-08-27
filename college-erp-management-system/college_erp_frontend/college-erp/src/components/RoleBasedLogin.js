import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiEyeClosedBold, PiEyeBold } from "react-icons/pi";
import { motion } from "framer-motion";
import Api from "../Api";
import Marquee from "./common/Marquee";
import Footer from "./common/Footer";

export default function RoleBasedLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await Api.post(
        `/auth/login?email=${
          email.includes("@gmail.com") === false ? email + "@gmail.com" : email
        }&password=${password}`,
        null,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      const data = response.data?.data;
      const role = data.role;

      if (role === "HOD") navigate("/hod-dashboard", { state: { data } });
      else if (role === "FACULTY")
        navigate("/faculty-dashboard", { state: { data } });
      else if (role === "PRINCIPAL")
        navigate("/principal-dashboard", { state: { data } });
      else if (role === "ADMIN") navigate("/admin", { state: { data } });
      else alert("Invalid credentials");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-gradient-to-r from-emerald-500/60 to-emerald-700/60 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.img
              src="/logo192.png"
              alt="Logo"
              className="h-10 w-10 sm:h-12 sm:w-12"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide text-white leading-tight">
                <span className="hidden sm:inline">
                  Sanjay Gandhi Polytechnic
                </span>
                <span className="inline sm:hidden">SGP</span> ERP System
              </h1>
            </motion.div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="hover:bg-emerald-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-emerald-300 transition duration-300 text-xs sm:text-sm font-medium"
          >
            Home
          </button>
        </div>
      </nav>
      <Marquee />

      {/* Main Content */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-center flex-grow px-4 py-10 gap-10 md:gap-16">
        {/* Login Box */}
        <motion.div
          className="w-full max-w-sm sm:max-w-md bg-gradient-to-tr from-gray-800 to-gray-700 p-6 sm:p-8 rounded-2xl shadow-2xl"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-emerald-300 mb-4">
            Role-Based Login
          </h2>
          {error && <p className="text-red-400 text-center mb-3">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6 relative">
              <label className="block text-gray-300 text-sm mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute top-[55%] right-3 text-white text-lg"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <PiEyeClosedBold /> : <PiEyeBold />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition duration-300"
            >
              Login
            </button>
          </form>
        </motion.div>

        {/* Illustration */}
        <motion.img
          src="/login.gif"
          alt="Login Illustration"
          className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] md:w-[420px] md:h-[420px] object-contain rounded-xl shadow-xl"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <Footer />
    </div>
  );
}
