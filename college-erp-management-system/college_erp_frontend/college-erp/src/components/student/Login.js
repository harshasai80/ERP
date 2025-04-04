import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Api";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState("");
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Navbar with emerald gradient */}
      <nav className="backdrop-blur-md bg-gradient-to-r from-emerald-500/60 to-emerald-700/60 shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.img
              src="/logo128.png"
              alt="Logo"
              className="h-12 w-12"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-white">
                <span className="hidden sm:inline">Sanjay Gandhi Polytechnic</span>
                <span className="inline sm:hidden">SGP</span> ERP System
              </h1>
            </motion.div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="hover:bg-emerald-800 px-4 py-2 rounded-full border border-emerald-300 transition duration-300 text-sm font-medium"
          >
            Home
          </button>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex flex-grow justify-center items-center">
        <form
          className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-80"
          onSubmit={handleSubmit}
        >
          <h2 className="text-white text-xl font-bold mb-4">Student Login</h2>
          <div className="mb-4 text-left">
            <label className="text-gray-200 block pl-1 mb-1">Reg. No</label>
            <input
              type="text"
              onChange={handleChange}
              placeholder="Enter Reg. No"
              className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <button className="w-full py-2 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition duration-200">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
