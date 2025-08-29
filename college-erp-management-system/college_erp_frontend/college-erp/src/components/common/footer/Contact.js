import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Footer from "./Footer";
import Marquee from "../Marquee";

export default function Contact() {
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

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: "Address",
      details: [
        '"Sanjay Gandhi Polytechnic"',
        "Ballari - 583104,",
        "Karnataka State",
      ],
      color: "text-emerald-400",
    },
    {
      icon: PhoneIcon,
      title: "Phone Numbers",
      details: ["08392 266331", "08392 267833", "9008066235", "8197778607"],
      color: "text-blue-400",
    },
    {
      icon: EnvelopeIcon,
      title: "Email",
      details: ["sgpbellary@gmail.com"],
      color: "text-purple-400",
      isEmail: true,
    },
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
            Contact Us
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}>
            We're here to help you with any questions or information you need
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-16">
        {/* Contact Information */}
        <motion.section
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 group-hover:from-emerald-600 group-hover:to-emerald-500 transition-all duration-300`}>
                  <info.icon className={`w-6 h-6 ${info.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {info.title}
                </h3>
              </div>
              <div className="space-y-2">
                {info.details.map((detail, i) => (
                  <p
                    key={i}
                    className="text-gray-300 group-hover:text-white transition-colors">
                    {info.isEmail ? (
                      <a
                        href={`mailto:${detail}`}
                        className="hover:text-emerald-400 transition-colors underline">
                        {detail}
                      </a>
                    ) : (
                      detail
                    )}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8">
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-emerald-900/40 to-blue-900/40 p-8 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <BuildingOfficeIcon className="w-8 h-8 text-emerald-400" />
              <h3 className="text-2xl font-bold text-white">
                Visit Our Campus
              </h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Come and explore our state-of-the-art facilities, laboratories,
              and campus infrastructure. Our doors are always open for
              prospective students and their families.
            </p>
            <div className="flex items-center gap-2 text-emerald-400">
              <ClockIcon className="w-5 h-5" />
              <span className="text-sm">
                Campus visits available Monday - Saturday, 9 AM - 5 PM
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <EnvelopeIcon className="w-8 h-8 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">
                Get Quick Responses
              </h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              For admissions, course information, or general inquiries, reach
              out to us via phone or email. Our team is ready to assist you with
              all your questions.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                Admissions
              </span>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                Course Info
              </span>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                General Queries
              </span>
            </div>
          </motion.div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
