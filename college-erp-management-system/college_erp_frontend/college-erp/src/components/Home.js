// Home.lazyed.jsx  (replace your current Home with this)
import React, { useState, useEffect, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; // lucide-react is tree-shakable and smallish
// Lazy-load heavy components so they don't inflate the initial bundle
const Marquee = React.lazy(() => import("./common/Marquee"));
const Footer = React.lazy(() => import("./common/Footer"));

const Home = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  // Start without gifSrc; only fetch it on mount for md+ screens
  const [gifSrc, setGifSrc] = useState(null);

  useEffect(() => {
    // Only load the GIF after first paint / on large screens
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      // small delay to avoid blocking LCP
      const t = setTimeout(() => {
        setGifSrc("/home.gif");
      }, 300); // 300ms after mount
      return () => clearTimeout(t);
    }
  }, []);

  const handleHoverStart = () => {
    // Toggle to static GIF to restart if you want; only if gif is loaded
    if (gifSrc) {
      setGifSrc("/home-static.gif");
      setTimeout(() => setGifSrc("/home.gif"), 50);
    }
  };
  const handleHoverEnd = () => gifSrc && setGifSrc("/home.gif");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
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
              className="hover:bg-emerald-800 px-4 py-2 rounded-full border border-emerald-300 transition duration-300 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/login/student"
              aria-label="Go to student search"
              className="hover:bg-emerald-800 px-4 py-2 rounded-full border border-emerald-300 transition duration-300 text-sm font-medium"
            >
              Student Search
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
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
                    aria-label={`Go to ${link.label}`}
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

      {/* Lazy-loaded marquee */}
      <Suspense fallback={<div aria-hidden className="h-8" />}>
        <Marquee />
      </Suspense>

      <main className="flex-grow container mx-auto px-6 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col justify-center items-center">
            <motion.h2
              className="text-3xl sm:text-5xl pb-3 font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200 leading-tight text-center md:text-left"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to <br /> Sanjay Gandhi Polytechnic <br /> ERP System
            </motion.h2>

            {/* Only render img tag if gifSrc is set (so it won't be requested before LCP) */}
            {gifSrc && (
              <motion.img
                src={gifSrc}
                alt="ERP system illustration"
                className="hidden md:block w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-contain rounded-3xl shadow-2xl"
                initial={{ rotateY: 20 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 1 }}
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverEnd}
                loading="lazy"
                width={500}
                height={500}
              />
            )}
          </div>

          <div className="text-center flex flex-col justify-center items-center">
            <div className="grid grid-cols-1 gap-6 w-full max-w-md">
              {[
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
                {
                  title: "Student Management",
                  desc: "Access and manage student records effortlessly.",
                  action: "Access",
                  route: "/role-based-login",
                  icon: "👨‍🎓",
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
                    aria-label={`${action} - ${title}`}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {action}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <Suspense fallback={<div aria-hidden className="h-10" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Home;
