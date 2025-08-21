import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  BuildingOfficeIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

export default function Contact() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: "Address",
      details: [
        '"Sanjay Gandhi Polytechnic"',
        'Ballari - 583104,',
        'Karnataka State'
      ],
      color: "text-emerald-400"
    },
    {
      icon: PhoneIcon,
      title: "Phone Numbers",
      details: [
        "08392 266331",
        "08392 267833",
        "9008066235",
        "8197778607"
      ],
      color: "text-blue-400"
    },
    {
      icon: EnvelopeIcon,
      title: "Email",
      details: ["sgpbellary@gmail.com"],
      color: "text-purple-400",
      isEmail: true
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <header className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white py-6 px-6 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src="/logo128.png"
              alt="SGP Logo"
              className="w-14 h-14 rounded-lg shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                Sanjay Gandhi Polytechnic
              </h1>
              <p className="text-emerald-200 text-sm opacity-90">Get in Touch with Us</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-6 bg-gradient-to-r from-emerald-900/20 to-blue-900/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
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
          animate="visible"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-emerald-500/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 group-hover:from-emerald-600 group-hover:to-emerald-500 transition-all duration-300`}>
                  <info.icon className={`w-6 h-6 ${info.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white">{info.title}</h3>
              </div>
              <div className="space-y-2">
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-300 group-hover:text-white transition-colors">
                    {info.isEmail ? (
                      <a 
                        href={`mailto:${detail}`} 
                        className="hover:text-emerald-400 transition-colors underline"
                      >
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
          className="grid md:grid-cols-2 gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-emerald-900/40 to-blue-900/40 p-8 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center gap-4 mb-6">
              <BuildingOfficeIcon className="w-8 h-8 text-emerald-400" />
              <h3 className="text-2xl font-bold text-white">Visit Our Campus</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Come and explore our state-of-the-art facilities, laboratories, and campus infrastructure. 
              Our doors are always open for prospective students and their families.
            </p>
            <div className="flex items-center gap-2 text-emerald-400">
              <ClockIcon className="w-5 h-5" />
              <span className="text-sm">Campus visits available Monday - Saturday, 9 AM - 5 PM</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-center gap-4 mb-6">
              <EnvelopeIcon className="w-8 h-8 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Get Quick Responses</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              For admissions, course information, or general inquiries, reach out to us via phone or email. 
              Our team is ready to assist you with all your questions.
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

      {/* Footer */}
      <footer className="mt-20 bg-gradient-to-r from-gray-900 to-black py-8 px-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Sanjay Gandhi Polytechnic. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
