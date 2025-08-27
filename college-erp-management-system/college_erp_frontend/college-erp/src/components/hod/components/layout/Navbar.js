// src/components/layout/Navbar.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, User, LogOut, Key, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ data }) => {
  const navigate = useNavigate();
  const name = data?.name || "User";
  const role = data?.role || "HOD";
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isNotFaculty] = useState(
    data?.role.toUpperCase() === "HOD" ||
      data?.role.toUpperCase() === "PRINCIPAL"
  );

  const handleNavigation = (path, state = null) => {
    navigate(path, state ? { state } : {});
    setIsOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white shadow-xl sticky top-0 z-50 border-b border-emerald-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img
              src="/logo192.png"
              alt="SGP Logo"
              className="h-10 w-10 sm:h-12 sm:w-12"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-bold tracking-wide leading-tight">
                Sanjay Gandhi Polytechnic ERP
              </span>
              <span className="text-xs sm:text-sm text-emerald-100 font-medium">
                HOD Portal
              </span>
            </div>
          </Link>

          {/* Right: Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* User Info Card */}
            <div className="bg-emerald-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-emerald-600/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold truncate max-w-[120px]">
                    {name}
                  </p>
                  <p className="text-xs text-emerald-100">{role}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all shadow-lg flex items-center gap-2"
                onClick={() => handleNavigation("/reset-password", { data })}
              >
                <Key size={16} />
                <span className="hidden xl:inline">Reset Password</span>
                <span className="xl:hidden">Reset</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleNavigation("/faculty-dashboard", {
                    data: data,
                    isNotFaculty: isNotFaculty,
                  })
                }
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all shadow-lg flex items-center gap-2"
              >
                <RefreshCw size={16} />
                <span className="hidden xl:inline">Switch to Faculty</span>
                <span className="xl:hidden">Faculty</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/")}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all shadow-lg flex items-center gap-2"
              >
                <LogOut size={16} />
                <span className="hidden xl:inline">Logout</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile/Tablet User Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Mobile User Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold truncate max-w-[100px]">
                  {name}
                </p>
                <p className="text-xs text-emerald-100">{role}</p>
              </div>
            </div>

            {/* Hamburger Menu */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden mt-4 bg-emerald-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-emerald-600/30 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {/* Mobile User Info */}
                <div className="sm:hidden text-center pb-3 border-b border-emerald-600/30">
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-emerald-100">{role}</p>
                </div>

                {/* Mobile Action Buttons */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 px-4 py-3 rounded-lg text-white text-sm font-medium transition-all shadow-lg flex items-center gap-3"
                  onClick={() => handleNavigation("/reset-password", { data })}
                >
                  <Key size={18} />
                  <span>Reset Password</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    handleNavigation("/faculty-dashboard", {
                      data: data,
                      isNotFaculty: isNotFaculty,
                    })
                  }
                  className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg text-white text-sm font-medium transition-all shadow-lg flex items-center gap-3"
                >
                  <RefreshCw size={18} />
                  <span>Switch to Faculty</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation("/")}
                  className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg text-white text-sm font-medium transition-all shadow-lg flex items-center gap-3"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
