import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Api";
import { motion } from "framer-motion";
import Marquee from "../common/Marquee";

const Login = () => {
  const [formData, setFormData] = useState("");
  const [circleAnimKey, setCircleAnimKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger re-render of animated circles on typing
    setCircleAnimKey((prev) => prev + 1);
  }, [formData]);

  const handleChange = (e) => {
    setFormData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post(
        `/student/login?registrationNumber=${formData}`,
        null,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      const data = await response.data;
      if (response.status === 200) {
        navigate("/dashboard", { state: { student: data } });
      } else {
        alert("Invalid registration number. Try again!");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Unauthorized: Invalid credentials.");
        } else if (error.response.status === 404) {
          alert("Student not found. Check your registration number.");
        } else {
          alert(`Error ${error.response.status}: ${error.response.statusText}`);
        }
      } else {
        alert("Network error or server not responding.");
      }
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden flex flex-col">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`${circleAnimKey}-${i}`}
            className="absolute rounded-full bg-emerald-600 opacity-20 blur-3xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4,
            }}
            style={{
              width: `${100 + Math.random() * 100}px`,
              height: `${100 + Math.random() * 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: `rgba(52, 211, 153, ${Math.min(0.2 + formData.length * 0.02, 0.6)})`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="relative z-10 backdrop-blur-md bg-gradient-to-r from-emerald-500/60 to-emerald-700/60 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.img
              src="/logo128.png"
              alt="Logo"
              className="h-10 w-10 sm:h-12 sm:w-12"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide text-white leading-tight">
                <span className="hidden sm:inline">Sanjay Gandhi Polytechnic</span>
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

      {/* Login Form */}
      <div className="relative z-10 flex-grow flex items-center justify-center px-4 py-10 sm:py-16">
        <motion.form
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm sm:max-w-md bg-gray-900/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700 text-center"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-6 tracking-wide">
            Student Login
          </h2>
          <div className="mb-5 text-left">
            <label className="text-gray-300 block mb-2 text-sm sm:text-base">
              Registration Number
            </label>
            <input
              type="text"
              onChange={handleChange}
              placeholder="Enter Reg. No"
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-100 text-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 sm:py-2.5 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition duration-300 text-sm sm:text-base"
          >
            Submit
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
