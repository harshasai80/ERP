import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; // lucide-react is tree-shakable and smallish
import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="backdrop-blur-md bg-gradient-to-r from-emerald-500/60 to-emerald-700/60 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.img
            src="/logo192.png"
            alt="Sanjay Gandhi Polytechnic Logo"
            className="h-12 w-12 cursor-pointer"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
            loading="eager" // small logo; eager is OK
            width={48}
            height={48}
          />
          <motion.div className="cursor-pointer" whileHover={{ scale: 1.05 }}>
            <h1 className="text-2xl font-extrabold tracking-wide text-white">
              <span className="hidden sm:inline">
                Sanjay Gandhi Polytechnic
              </span>
              <span className="inline sm:hidden">SGP</span> ERP System
            </h1>
          </motion.div>
        </div>

        <div className="hidden md:flex space-x-4">
          <Link
            to="/role-based-login"
            aria-label="Go to role based login"
            className="hover:bg-emerald-800 px-4 py-2 rounded-full border border-emerald-300 transition duration-300 text-sm font-medium">
            Login
          </Link>
          <Link
            to="/login/student"
            aria-label="Go to student search"
            className="hover:bg-emerald-800 px-4 py-2 rounded-full border border-emerald-300 transition duration-300 text-sm font-medium">
            Student Search
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden px-4 pt-2 pb-4 space-y-3 bg-emerald-700/80 backdrop-blur-lg shadow-xl rounded-b-2xl mx-4 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}>
            {[
              { label: "Login", to: "/role-based-login" },
              { label: "Student Search", to: "/login/student" },
            ].map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}>
                <Link
                  to={link.to}
                  aria-label={`Go to ${link.label}`}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-white text-sm text-center bg-emerald-800 hover:bg-emerald-900 transition-colors duration-300 px-4 py-2 rounded-full border border-emerald-300 shadow">
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
