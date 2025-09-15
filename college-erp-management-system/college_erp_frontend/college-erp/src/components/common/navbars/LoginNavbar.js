import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginNavbar() {
  const navigate = useNavigate();

  return (
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
            transition={{ duration: 0.3 }}>
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
          className="hover:bg-emerald-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-emerald-300 transition duration-300 text-xs sm:text-sm font-medium">
          Home
        </button>
      </div>
    </nav>
  );
}
