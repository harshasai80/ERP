import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Api";
import { motion } from "framer-motion";
import Marquee from "../common/Marquee";
import Footer from "../common/footer/Footer";
import LoginNavbar from "../common/navbars/LoginNavbar";

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
    <div className="relative min-h-screen bg-mesh text-academic overflow-hidden flex flex-col font-sans">
      <LoginNavbar />
      <Marquee />

      {/* Student Entry Sanctuary */}
      <div className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-center px-6 py-12 gap-12 md:gap-32 relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-academic/[0.03] blur-[150px] rounded-full -z-10" />

        {/* Left: Campus Life Showcase */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center max-w-xl text-center space-y-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}>
          <div className="relative group">
            <div className="absolute -inset-4 bg-academic/5 blur-2xl rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src={require("../../assets/images/college-campus.png")}
              alt="SGP Registry"
              className="relative w-full h-[400px] object-cover shadow-2xl border-b-[8px] border-academic rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-academic italic">SGP Heritage</h3>
            <p className="text-base font-bold text-faded-ink uppercase tracking-[0.4em] max-w-xs leading-relaxed">
              Your Gateway to Academic Success and Professional Growth.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-sm sm:max-w-md bg-white border-b-8 border-academic p-12 sm:p-16 text-center shadow-2xl relative"
        >
          {/* Institutional Branding Icon */}
          <div className="mb-12 relative">
            <div className="w-24 h-24 bg-paper-white mx-auto flex items-center justify-center text-4xl shadow-inner border border-gray-100">
              🎓
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-6 bg-gold" />
              <h4 className="text-base font-bold text-gold uppercase tracking-[0.5em]">
                Student Registry Access
              </h4>
              <div className="h-[1px] w-6 bg-gold" />
            </div>
            <h2 className="text-4xl font-black text-academic classic-heading uppercase tracking-tighter">
              Identity <span className="text-burgundy">Verification</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="text-left space-y-4">
              <label className="text-base font-black text-faded-ink uppercase tracking-[0.3em] ml-1 opacity-60">
                Official Registration Number
              </label>
              <div className="relative group">
                <input
                  type="text"
                  onChange={handleChange}
                  placeholder="Enter Reg. ID"
                  className="w-full px-5 py-4 bg-paper-white border border-gray-100 focus:border-gold focus:ring-4 focus:ring-gold/5 focus:outline-none transition-all text-base font-semibold tracking-tight shadow-inner"
                  required
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 text-academic text-base">🆔</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-5 text-base shadow-2xl relative overflow-hidden group">
              <span className="relative z-10 tracking-[0.3em]">Authorize Session</span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </form>

          <div className="mt-14 pt-10 border-t border-gray-100">
            <p className="text-base font-bold text-faded-ink uppercase tracking-[0.5em] opacity-40">
              Official SGP Academic Portal MMXXIV
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;




