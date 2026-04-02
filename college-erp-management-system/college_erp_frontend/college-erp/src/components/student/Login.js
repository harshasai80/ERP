import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Api";
import { motion } from "framer-motion";
import Marquee from "../common/Marquee";
import Footer from "../common/footer/Footer";
import LoginNavbar from "../common/navbars/LoginNavbar";

const Login = () => {
  const [regNo, setRegNo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedRegNo = regNo.toUpperCase().trim();
      // Use the proper login endpoint that accepts registrationNumber as a param
      const studentResponse = await Api.post(`/student/login?registrationNumber=${formattedRegNo}`);
      
      const studentData = studentResponse.data.data;
      if (studentData) {
        navigate("/dashboard", { state: { student: studentData } });
      } else {
        alert("Student record found but data is empty.");
      }
    } catch (error) {
      alert("Invalid registration number or student record missing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-mesh text-academic overflow-hidden flex flex-col font-sans">
      <LoginNavbar />
      <Marquee />

      <div className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-center px-6 py-12 gap-12 md:gap-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-academic/[0.03] blur-[150px] rounded-full -z-10" />

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
             <h3 className="text-3xl font-black text-academic italic text-emerald-600">SGP Heritage</h3>
             <p className="text-base font-bold text-faded-ink uppercase tracking-[0.4em] max-w-xs leading-relaxed">
               Open Student Registry • MMXXIV
             </p>
           </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-sm sm:max-w-md bg-white border-b-8 border-emerald-600 p-10 text-center shadow-2xl relative"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-academic classic-heading uppercase tracking-tighter">
              Student <span className="text-emerald-600">Portal</span>
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 px-10">Login with Registration Number</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="text-left space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">
                Official Registry Number
              </label>
              <input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. 459CS21001"
                className="w-full px-5 py-5 bg-gray-50 border-2 border-gray-100 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-lg font-black tracking-widest text-academic shadow-inner"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-academic text-white text-base font-black tracking-[0.5em] shadow-2xl hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50">
              {loading ? "VERIFYING..." : "ENTER PORTAL"}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-50">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              Authorized Institutional Access Only
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;




