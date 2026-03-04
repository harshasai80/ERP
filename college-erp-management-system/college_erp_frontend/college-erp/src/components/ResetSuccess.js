import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function ResetSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.data?.role;
  const data = location.state?.data;

  const handleContinue = () => {
    // Redirect based on role
    if (userRole === "PRINCIPAL")
      navigate("/principal-dashboard", { state: { data } });
    else if (userRole === "ADMIN")
      navigate("/admin-dashboard", { state: { data } });
    else if (userRole === "FACULTY")
      navigate("/faculty-dashboard", { state: { data } });
    else if (userRole === "HOD")
      navigate("/hod-dashboard", { state: { data } });
    else navigate("/role-based-login"); // fallback
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh text-gray-900 font-sans p-6">
      {/* Decorative Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="lux-card glass-gold p-12 sm:p-16 max-w-md text-center shadow-2xl relative overflow-hidden"
      >
        <div className="mb-8">
          <div className="w-20 h-20 bg-emerald-50 rounded-full mx-auto flex items-center justify-center text-emerald-500 shadow-inner border border-emerald-100">
            <CheckCircle2 size={40} />
          </div>
        </div>

        <div className="mb-10">
          <h4 className="text-base font-bold text-emerald-600 uppercase tracking-[0.4em] mb-3">
            Authorization Restored
          </h4>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent classic-heading uppercase leading-tight">
            Password Reset <br /> <span className="font-light italic text-gray-400 text-base">Successful</span>
          </h2>
          <div className="w-12 h-1 bg-emerald-500/20 mx-auto mt-6 rounded-full" />
        </div>

        <p className="text-gray-500 text-base font-medium mb-10 leading-relaxed">
          Your administrative credentials have been securely updated. You may now proceed to your designated workspace.
        </p>

        <button
          onClick={handleContinue}
          className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all duration-300 active:scale-95 text-base uppercase tracking-[0.2em] shadow-xl shadow-gray-900/10 group relative overflow-hidden"
        >
          <span className="relative z-10">Proceed to Dashboard</span>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <div className="mt-12 pt-8 border-t border-emerald-500/10">
          <p className="text-base font-bold text-gray-400 uppercase tracking-[0.3em]">
            SGP Secure Governance Protocol
          </p>
        </div>
      </motion.div>
    </div>
  );
}




