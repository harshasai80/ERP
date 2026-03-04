import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";
import Marquee from "../Marquee";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const courses = [
    ["Diploma in Computer Science & Engineering", "6 Semesters", "120", "1992"],
    ["Diploma in Mechanical Engineering", "6 Semesters", "240", "1994"],
    [
      "Diploma in Electrical & Electronics Engineering",
      "6 Semesters",
      "240",
      "1994",
    ],
    ["Diploma in Metallurgy", "6 Semesters", "60", "2006"],
    ["Diploma in Civil Engineering", "6 Semesters", "60", "2008"],
  ];

  const commitments = [
    "Become a centre of excellence in Engineering & Technology",
    "Enhance industry-institute interface",
    "Strengthen the teaching/learning process by training/developing staff",
    "Modernize/upgrade laboratories",
    "Establish Alumni Network",
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
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
                src="/logo192.png"
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
              <h1 className="text-base md:text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent">
                  Sanjay Gandhi Polytechnic
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className="text-emerald-200/90 text-base md:text-base font-medium tracking-wide">
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
                className="relative text-base"
                whileHover={{ x: -2 }}
                transition={{ duration: 0.2 }}>
                ←
              </motion.span>
              <span className="relative text-base md:text-base">
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

      <Marquee />

      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-6 bg-gradient-to-r from-emerald-900/20 to-blue-900/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            About SGP
          </motion.h1>
          <motion.p
            className="text-base text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}>
            Pioneering technical education since 1992
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-16">
        {/* About Content */}
        <motion.section
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-emerald-400">
                Our Story
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300 text-base">
                Sanjay Gandhi Polytechnic, Ballari was the first premier private
                co-educational Polytechnic established in the year{" "}
                <span className="text-emerald-400 font-semibold">1992</span> to
                provide quality technical education, affording young men and
                women the opportunity to equip themselves for employment.
              </p>
              <p className="leading-relaxed text-gray-300 text-base">
                The Institute is recognised by the Government of Karnataka, the
                All India Council for Technical Education (AICTE), New Delhi and
                is affiliated to the Directorate of Technical Education,
                Bangalore.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-emerald-900/30 to-blue-900/30 p-8 rounded-2xl shadow-2xl border border-emerald-500/20">
              <h3 className="text-2xl font-semibold mb-6 text-emerald-400">
                Our Commitment
              </h3>
              <div className="space-y-4">
                {commitments.map((commitment, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 group-hover:bg-emerald-300 transition-colors"></div>
                    <p className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                      {commitment}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Courses Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Courses Offered
            </h2>
            <p className="text-gray-400 text-base">
              Comprehensive technical education programs
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
                    <th className="p-4 text-left font-semibold">Programme</th>
                    <th className="p-4 text-left font-semibold">Duration</th>
                    <th className="p-4 text-left font-semibold">
                      Intake Capacity
                    </th>
                    <th className="p-4 text-left font-semibold">
                      Year Started
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((row, i) => (
                    <motion.tr
                      key={i}
                      className="hover:bg-gray-700/50 border-b border-gray-700 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}>
                      <td className="p-4 font-medium text-emerald-300">
                        {row[0]}
                      </td>
                      <td className="p-4 text-gray-300">{row[1]}</td>
                      <td className="p-4 text-gray-300 font-semibold">
                        {row[2]}
                      </td>
                      <td className="p-4 text-blue-400 font-semibold">
                        {row[3]}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="grid md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          {[
            {
              number: `${new Date().getFullYear() - 1992}+`,
              label: "Years of Excellence",
            },
            { number: "5", label: "Engineering Programs" },
            { number: "720", label: "Total Intake Capacity" },
            { number: "1992", label: "Established" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-br from-emerald-900/40 to-blue-900/40 p-6 rounded-xl text-center border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
              <h3 className="text-3xl font-bold text-emerald-400 mb-2">
                {stat.number}
              </h3>
              <p className="text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}




