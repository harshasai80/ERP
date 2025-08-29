// Home.lazyed.jsx  (replace your current Home with this)
import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HomeNavbar from "./common/navbars/HomeNavbar";
// Lazy-load heavy components so they don't inflate the initial bundle
const Marquee = React.lazy(() => import("./common/Marquee"));
const Footer = React.lazy(() => import("./common/footer/Footer"));

const Home = () => {
  const navigate = useNavigate();
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
      <HomeNavbar />

      {/* Lazy-loaded marquee */}
      <Suspense fallback={<div aria-hidden className="h-8" />}>
        <Marquee />
      </Suspense>

      <main className="flex-grow container mx-auto px-6 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <div className="flex flex-col justify-center items-center">
            <motion.h2
              className="text-3xl sm:text-5xl pb-3 font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200 leading-tight text-center md:text-left"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}>
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
                  whileHover={{ scale: 1.02 }}>
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="text-lg font-bold mb-1 text-emerald-300">
                    {title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm">{desc}</p>
                  <button
                    onClick={() => navigate(route)}
                    aria-label={`${action} - ${title}`}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
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
