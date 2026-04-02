// src/components/layout/Navbar.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, User, LogOut, Key, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ data, onProfileClick }) => {
  const navigate = useNavigate();
  const name = data?.name || "User";
  const role = data?.role || "HOD";
  const [isOpen, setIsOpen] = useState(false);
  const [isNotFaculty] = useState(
    data?.role.toUpperCase() === "HOD" ||
    data?.role.toUpperCase() === "PRINCIPAL"
  );

  const handleNavigation = (path, state = null) => {
    navigate(path, state ? { state } : {});
    setIsOpen(false);
  };

  return (
    <nav className="relative z-[100] glass border-b-2 border-gold py-4 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Academic Branding */}
          <Link to="/" className="flex items-center gap-5 group">
            <div className="relative">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gold/20 blur-sm rounded-full" />
              <motion.img
                src="/logo192.png"
                alt="SGP Logo"
                className="relative h-12 w-12 group-hover:rotate-[360deg] transition-transform duration-1000"
                whileHover={{ scale: 1.1 }}
              />
            </div>
            <div>
              <h1 className="text-base sm:text-2xl font-bold tracking-[0.2em] text-academic classic-heading uppercase leading-tight">
                SGP <span className="text-gold">Registry</span>
              </h1>
              <p className="text-base uppercase font-bold tracking-[0.4em] text-faded-ink">
                Administrative Directorate
              </p>
            </div>
          </Link>

          {/* Right: Desktop Actions */}
          <div className="hidden lg:flex items-center gap-8">
            {/* User Identity Card */}
            <div 
              className="flex items-center gap-5 border-r border-gray-100 pr-8 cursor-pointer hover:bg-gray-50/50 transition-all rounded-sm"
              onClick={onProfileClick}
            >
              <div className="text-right">
                <p className="text-base font-bold text-academic classic-heading tracking-tight">
                  Prof. {name}
                </p>
                <div className="flex items-center justify-end gap-2 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="text-base font-black text-academic uppercase tracking-[0.2em]">
                    {role}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 bg-academic flex items-center justify-center text-white font-bold text-base shadow-lg">
                {name.charAt(0)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                className="px-6 py-2.5 text-academic text-base font-bold uppercase tracking-widest border border-academic hover:bg-academic/5 transition-all active:scale-95"
                onClick={() => handleNavigation("/reset-password", { data })}>
                Security Reset
              </button>

              <button
                onClick={() =>
                  handleNavigation("/faculty-dashboard", {
                    data: data,
                    isNotFaculty: isNotFaculty,
                  })
                }
                className="btn-primary py-2.5 px-6 text-base">
                Faculty Role
              </button>

              <button
                className="px-6 py-2.5 bg-burgundy text-white text-base font-bold uppercase tracking-widest hover:bg-burgundy/90 transition-all active:scale-95 shadow-lg shadow-burgundy/20"
                onClick={() => handleNavigation("/")}>
                Logout
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-academic p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Identity Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden mt-6 overflow-hidden border-t border-gray-100"
            >
              <div className="py-8 space-y-6">
                <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-sm">
                  <div className="w-12 h-12 bg-academic text-white flex items-center justify-center text-base font-bold">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-academic classic-heading">Prof. {name}</p>
                    <p className="text-base font-black text-gold uppercase tracking-widest">{role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button
                    className="w-full px-6 py-4 text-academic text-base font-extrabold uppercase tracking-widest border border-academic text-center"
                    onClick={() => handleNavigation("/reset-password", { data })}>
                    Security Reset
                  </button>

                  <button
                    onClick={() =>
                      handleNavigation("/faculty-dashboard", {
                        data: data,
                        isNotFaculty: isNotFaculty,
                      })
                    }
                    className="btn-primary w-full py-4 text-base text-center">
                    Switch to Faculty
                  </button>

                  <button
                    className="w-full px-6 py-4 bg-burgundy text-white text-base font-extrabold uppercase tracking-widest text-center"
                    onClick={() => handleNavigation("/")}>
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;




