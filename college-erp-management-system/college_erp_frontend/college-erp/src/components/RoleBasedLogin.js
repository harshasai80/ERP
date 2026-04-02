import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiEyeClosedBold, PiEyeBold } from "react-icons/pi";
import { motion } from "framer-motion";
import Api from "../Api";
import Marquee from "./common/Marquee";
import Footer from "./common/footer/Footer";
import LoginNavbar from "./common/navbars/LoginNavbar";

export default function RoleBasedLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    let finalEmail = email;
    if (!finalEmail.includes("@")) {
      finalEmail = finalEmail + "@gmail.com";
    }

    try {
      const response = await Api.post(
        `/auth/login?email=${finalEmail}&password=${password}`,
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
      else if (role === "ADMIN") navigate("/admin-dashboard", { state: { data } });
      else alert("Invalid credentials");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-mesh text-academic overflow-hidden font-sans">
      <LoginNavbar />
      <Marquee />

      {/* Main Administrative Entry Workspace */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-center flex-grow px-6 py-12 gap-12 md:gap-32 relative">
        {/* Academic Decoration */}
        <div className="absolute top-1/4 -left-12 w-80 h-80 bg-academic/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-burgundy/5 rounded-full blur-[120px] -z-10" />

        {/* Left: Academic Showcase */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center max-w-xl text-center space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gold/10 blur-xl rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src={require("../assets/images/college-campus.png")}
              alt="SGP Campus"
              className="relative w-full h-[400px] object-cover shadow-2xl border-b-[8px] border-gold rounded-sm hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-academic/10 pointer-events-none" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-academic italic">Est. 1994</h3>
            <p className="text-base font-bold text-faded-ink uppercase tracking-[0.4em] max-w-xs leading-relaxed">
              Legacy of Excellence in Technical Education and Academic Governance.
            </p>
          </div>
        </motion.div>

        {/* Login Sanctuary Card */}
        <motion.div
          className="w-full max-w-sm sm:max-w-md bg-white border-b-8 border-academic p-10 sm:p-14 shadow-2xl relative z-10"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>

          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-6 bg-gold" />
              <h4 className="text-base font-bold text-gold uppercase tracking-[0.5em]">
                Secure Entry Terminal
              </h4>
              <div className="h-[1px] w-6 bg-gold" />
            </div>
            <h2 className="text-4xl font-black text-academic classic-heading uppercase tracking-tighter">
              Staff <span className="text-burgundy">Directorate</span>
            </h2>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-burgundy/5 border-l-4 border-burgundy rounded-sm flex items-center gap-4">
              <span className="text-burgundy text-base">⚠️</span>
              <p className="text-burgundy text-base font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-base font-black text-faded-ink uppercase tracking-[0.3em] ml-1 opacity-60">Official Registry Email</label>
              <div className="relative group">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="w-full px-5 py-4 bg-paper-white border border-gray-100 focus:border-gold focus:ring-4 focus:ring-gold/5 focus:outline-none transition-all text-base font-semibold tracking-tight shadow-inner"
                  placeholder="id@registry.institute"
                  required
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 text-academic text-base">✒️</span>
              </div>
            </div>

            <div className="space-y-3 relative">
              <label className="text-base font-black text-faded-ink uppercase tracking-[0.3em] ml-1 opacity-60">Administrative Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-paper-white border border-gray-100 focus:border-gold focus:ring-4 focus:ring-gold/5 focus:outline-none transition-all text-base font-semibold tracking-tight shadow-inner"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-faded-ink hover:text-academic transition-colors p-1"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <PiEyeClosedBold size={20} /> : <PiEyeBold size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-6 py-5 text-base shadow-2xl relative overflow-hidden group">
              <span className="relative z-10 tracking-[0.3em]">Authorize Login</span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-gray-100 text-center">
            <p className="text-base font-bold text-faded-ink uppercase tracking-[0.5em] opacity-40">
              Institution MMXXIV • Security Protocol v9.0
            </p>
          </div>
        </motion.div>

        {/* Institutional Identity */}
        <motion.div
          className="relative group hidden md:block"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}>
          <div className="absolute inset-0 bg-academic/5 blur-[100px] rounded-full" />
          <div className="relative bg-white border border-gray-100 p-6 shadow-2xl skew-y-1 group-hover:skew-y-0 transition-transform duration-700">
            <img
              src="/login.gif"
              alt="Digital Governance"
              className="w-[450px] h-[550px] object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute -bottom-8 -left-8 p-10 bg-academic text-white shadow-2xl flex flex-col items-center">
              <span className="text-4xl mb-2">🏛️</span>
              <span className="text-base font-bold text-gold uppercase tracking-[0.4em]">Directorate</span>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}




