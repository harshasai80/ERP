import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PiEyeClosedBold, PiEyeBold } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import Api from "../Api";

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state.data;
  const email = data.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    } else if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    } else if (oldPassword === newPassword) {
      setError("New password cannot be the same as the old password");
      return;
    }

    try {
      const response = await Api.post(
        `/auth/reset-password?email=${email}&newPassword=${newPassword}&oldPassword=${oldPassword}`,
        null,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const res = await response.data;

      if (res.status !== 200) {
        setError(res.message || "Failed to reset password");
      } else {
        navigate("/reset-success", { state: { data } });
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh text-gray-900 font-sans p-6">
      {/* Decorative Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md lux-card glass-gold p-10 sm:p-14 shadow-2xl relative overflow-hidden">

        {/* Institutional Cancel Action */}
        <button
          type="button"
          className="absolute top-6 right-6 p-2 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all duration-300 border border-red-500/10 active:scale-95"
          onClick={() => navigate(-1)}
        >
          <IoClose size={20} />
        </button>

        <div className="mb-10 text-center">
          <h4 className="text-base font-bold text-emerald-600 uppercase tracking-[0.4em] mb-3">
            Credential Management
          </h4>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent classic-heading uppercase">
            Reset <span className="font-light italic text-gray-400">Secure</span>
          </h2>
          <div className="w-12 h-1 bg-emerald-500/20 mx-auto mt-6 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Old Password */}
          <div className="space-y-2 relative">
            <label className="text-base font-bold text-gray-400 uppercase tracking-widest ml-1">
              Current Administrative Password
            </label>
            <div className="relative group">
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all text-base font-medium shadow-sm group-hover:border-emerald-500/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors p-1"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <PiEyeClosedBold size={18} /> : <PiEyeBold size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2 relative">
            <label className="text-base font-bold text-gray-400 uppercase tracking-widest ml-1">
              New Institutional Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all text-base font-medium shadow-sm group-hover:border-emerald-500/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <PiEyeClosedBold size={18} /> : <PiEyeBold size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-base font-bold text-gray-400 uppercase tracking-widest ml-1">
              Confirm Authorization Key
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-5 pr-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all text-base font-medium shadow-sm group-hover:border-emerald-500/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-600 text-base font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-900/10 transition-all duration-300 active:scale-95 text-base uppercase tracking-[0.2em] relative overflow-hidden group">
            <span className="relative z-10">Confirm Reset</span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-emerald-500/10 text-center">
          <p className="text-base font-bold text-gray-400 uppercase tracking-[0.3em]">
            SGP Secure Governance Protocol
          </p>
        </div>
      </motion.div>
    </div>
  );
}




