"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";

export default function Team() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const contributors = [
    { name: "Syed Mohammed Zuber", role: "Backend Developer", route: "/zuber" },
    { name: "D Rohan Samuel", role: "Backend Developer", route: "/rohan" },
    { name: "M MD Abrar", role: "Database Administrator" },
    { name: "Mohammed Nawaz", role: "UI/UX Designer" },
    { name: "Anushka Reddy", role: "API Integration" },
    { name: "Kamala Bai", role: "Frontend Developer" },
    { name: "Tania Khandelwal", role: "Frontend Developer" },
    { name: "Yaseen", role: "API Integration" },
    { name: "J Mohammed Sahil", role: "Database Administrator" },
    { name: "K A Harshita", role: "Frontend Developer" },
    { name: "K Sana Begum", role: "API Integration" },
    { name: "Hafiza Muskan", role: "UI/UX Designer" },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getRandomDelay = (index) => {
    return `${index * 0.15 + Math.random() * 0.3}s`;
  };

  const handleCardClick = (contributor) => {
    if (contributor.route) {
      navigate(contributor.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900/20 text-white relative overflow-hidden">
      {/* Navbar */}
      <header className="relative bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-emerald-900/95 text-white py-4 px-6 shadow-2xl sticky top-0 z-50 backdrop-blur-md border-b border-emerald-500/20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-emerald-400/5 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/3 w-24 h-24 bg-emerald-500/8 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          {/* Left side - Logo and title */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}>
            {/* Enhanced logo container */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              <motion.img
                src="/logo128.png"
                alt="SGP Logo"
                className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl shadow-xl border border-emerald-400/30 group-hover:border-emerald-400/50 transition-all duration-300"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              {/* Corner accent */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </motion.div>

            {/* Enhanced text content */}
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent">
                  Sanjay Gandhi Polytechnic
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className="text-emerald-200/90 text-xs md:text-sm font-medium tracking-wide">
                  Get in Touch with Us
                </p>
                <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-400/60 to-transparent rounded-full"></div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Enhanced back button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>

            <Link
              to="/"
              className="relative flex items-center gap-3 bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 hover:from-emerald-500 hover:to-emerald-400 px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 border border-emerald-500/30 hover:border-emerald-400/50 backdrop-blur-sm overflow-hidden">
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* Button content */}
              <motion.span
                className="relative text-lg"
                whileHover={{ x: -2 }}
                transition={{ duration: 0.2 }}>
                ←
              </motion.span>
              <span className="relative text-sm md:text-base">
                Back to Home
              </span>

              {/* Button accent */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-300/60 rounded-full group-hover:bg-emerald-200 transition-colors duration-300"></div>
            </Link>
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/20 rounded-full animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + Math.sin(i) * 20}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${2 + i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </header>

      {/* Dynamic background with multiple layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-60 right-40 w-80 h-80 bg-emerald-500/8 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-300/6 rounded-full blur-3xl animate-float-slow"></div>

        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 px-6 py-16">
        {/* Hero Section */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-emerald-400"></div>
              <span className="text-emerald-400 text-lg font-light tracking-widest uppercase">
                About
              </span>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-emerald-400"></div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent animate-gradient">
              ERP System
            </span>
            <br />
            <span className="text-3xl md:text-4xl font-light text-gray-300">
              Built with Passion
            </span>
          </h1>

          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
              <span className="inline-block animate-bounce-slow text-3xl mr-3">
                🚀
              </span>
              Crafted by the brilliant minds of{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent font-bold text-2xl">
                  SGP DCS Batch 2022–25
                </span>
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400/0 via-emerald-400 to-emerald-400/0 animate-pulse"></div>
              </span>{" "}
              to revolutionize academic management
              <span className="inline-block animate-bounce-slow text-3xl ml-3">
                ✨
              </span>
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                Meet the Dream Team
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              The architects of innovation
            </p>
          </div>

          {/* Contributors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {contributors.map((contributor, index) => (
              <div
                key={index}
                className={`group relative transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                } ${contributor.route ? "cursor-pointer" : ""}`}
                style={{ transitionDelay: getRandomDelay(index) }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCardClick(contributor)}>
                {/* Card */}
                <div
                  className={`relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-500 group-hover:transform group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-emerald-400/10 ${
                    contributor.route
                      ? "hover:border-emerald-300/70 hover:shadow-emerald-300/20"
                      : ""
                  }`}>
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Clickable indicator for D Rohan Samuel */}
                  {contributor.route && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-6 h-6 bg-emerald-400/20 rounded-full flex items-center justify-center border border-emerald-400/40">
                        <span className="text-emerald-300 text-xs">👆</span>
                      </div>
                    </div>
                  )}

                  {/* Avatar */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 rounded-2xl flex items-center justify-center border border-emerald-400/20 group-hover:border-emerald-400/40 transition-all duration-500">
                        <span className="text-2xl font-bold text-emerald-300 group-hover:text-emerald-200 transition-colors duration-300">
                          {getInitials(contributor.name)}
                        </span>
                      </div>
                    </div>

                    {/* Floating ring */}
                    <div className="absolute -inset-2 border border-emerald-400/20 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 rotate-12"></div>
                  </div>

                  {/* Content */}
                  <div className="text-center relative z-10">
                    <h3
                      className={`text-lg font-semibold text-white mb-2 group-hover:text-emerald-200 transition-colors duration-300 ${
                        contributor.route ? "group-hover:text-emerald-100" : ""
                      }`}>
                      {contributor.name}
                      {contributor.route && (
                        <span className="ml-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          →
                        </span>
                      )}
                    </h3>
                    <p className="text-emerald-400/80 text-sm font-medium mb-3">
                      {contributor.role}
                    </p>

                    {/* Progress bar effect */}
                    <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300 mx-auto rounded-full transition-all duration-700 delay-200"></div>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-emerald-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`text-center mt-20 transition-all duration-1000 delay-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}>
            <div className="inline-block bg-gradient-to-r from-gray-800/50 to-gray-700/30 backdrop-blur-xl rounded-2xl px-8 py-6 border border-gray-700/30">
              <p className="text-gray-300 text-lg italic mb-4">
                "Transforming education through collaborative innovation"
              </p>
              <div className="flex justify-center items-center space-x-3">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
                <span className="text-emerald-400 font-semibold">
                  SGP DCS 2025
                </span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${(i + 5) * 0.2}s` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles - Add these to your global CSS or as a style tag */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(90deg);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(16, 185, 129, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
      <Footer />
    </div>
  );
}
