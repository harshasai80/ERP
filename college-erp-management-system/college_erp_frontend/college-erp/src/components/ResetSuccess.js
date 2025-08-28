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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#2d2f36] p-10 rounded-xl shadow-2xl max-w-md text-center"
      >
        <CheckCircle2 className="text-emerald-400 mx-auto mb-4" size={60} />
        <h2 className="text-2xl font-bold mb-2">Password Reset Successful!</h2>
        <p className="text-sm text-gray-300 mb-6">
          Your password has been changed. You can continue to your dashboard.
        </p>
        <button
          onClick={handleContinue}
          className="bg-emerald-600 hover:bg-emerald-700 transition px-6 py-2 rounded-md font-medium text-white"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}
