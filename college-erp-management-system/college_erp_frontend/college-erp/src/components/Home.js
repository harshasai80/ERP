import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [gifSrc, setGifSrc] = useState("/home.gif"); // GIF source state

  const handleHoverStart = () => {
    setGifSrc("/home-static.gif"); // Set to a static version (or a placeholder)
    setTimeout(() => {
      setGifSrc("/home.gif"); // Reset to the animated GIF
    }, 1); // Delay before restarting the animation
  };

  const handleHoverEnd = () => {
    setGifSrc("/home.gif"); // Optionally reset to a specific GIF after hover ends
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-gradient-to-r from-emerald-500/60 to-emerald-700/60 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.img
              src="/logo128.png"
              alt="SGP Logo"
              className="h-12 w-12 cursor-pointer"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-extrabold tracking-wide text-white">
                <span className="hidden sm:inline">
                  Sanjay Gandhi Polytechnic
                </span>
                <span className="inline sm:hidden">SGP</span> ERP System
              </h1>
            </motion.div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/role-based-login"
              className="hover:bg-emerald-800 px-4 py-2 rounded-full border border-emerald-300 transition duration-300 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/login/student"
              className="hover:bg-emerald-800 px-4 py-2 rounded-full border border-emerald-300 transition duration-300 text-sm font-medium"
            >
              Student Search
            </Link>
          </div>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden px-4 pt-2 pb-4 space-y-3 bg-emerald-700/80 backdrop-blur-lg shadow-xl rounded-b-2xl mx-4 mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {[
                { label: "Login", to: "/role-based-login" },
                { label: "Student Search", to: "/login/student" },
              ].map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-white text-sm text-center bg-emerald-800 hover:bg-emerald-900 transition-colors duration-300 px-4 py-2 rounded-full border border-emerald-300 shadow"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow container mx-auto px-6 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left */}
          <div className="flex flex-col justify-center items-center">
            <motion.h2
              className="text-3xl sm:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200 leading-tight text-center md:text-left"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to <br /> Sanjay Gandhi Polytechnic <br /> ERP System
            </motion.h2>
            <motion.img
              src={gifSrc}
              alt="ERP Illustration"
              className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-contain rounded-3xl shadow-2xl"
              initial={{ rotateY: 20 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 1 }}
              onMouseEnter={handleHoverStart} // Start animation on hover
              onMouseLeave={handleHoverEnd} // Reset animation on hover end
            />
          </div>

          {/* Right */}
          <div className="text-center flex flex-col justify-center items-center">
            <div className="grid grid-cols-1 gap-6 w-full max-w-md">
              {[
                {
                  title: "Student Management",
                  desc: "Access and manage student records effortlessly.",
                  action: "Access",
                  route: "/role-based-login",
                  icon: "👨‍🎓",
                },
                {
                  title: "Attendance Tracking",
                  desc: "Track attendance with intuitive tools.",
                  action: "Track",
                  route: "/login/student",
                  icon: "🕒",
                },
                {
                  title: "Results Portal",
                  desc: "Manage and publish student results securely.",
                  action: "Results",
                  route: "/login/student",
                  icon: "📊",
                },
              ].map(({ title, desc, action, route, icon }, i) => (
                <motion.div
                  key={i}
                  className="bg-gradient-to-tr from-gray-800 to-gray-700 p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1 text-left"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="text-lg font-bold mb-1 text-emerald-300">
                    {title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm">{desc}</p>
                  <button
                    onClick={() => navigate(route)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {action}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h4 className="text-lg font-semibold text-emerald-300">
                Sanjay Gandhi Polytechnic Ballari
              </h4>
              <p className="text-sm text-gray-400">
                Excellence in Technical Education
              </p>
            </div>
            <div className="flex space-x-6">
              {["Contact", "About", "Privacy Policy"].map((item, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <p className="text-center mt-6 text-xs text-gray-500">
            © 2025 Sanjay Gandhi Polytechnic. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
