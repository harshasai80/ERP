"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Rohan() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const projects = [
    {
      title: "Info SGP Bellary",
      url: "info.sgpbellary.com",
      description:
        "Comprehensive information portal for Sanjay Gandhi Polytechnic, providing students with easy access to academic resources and institutional updates.",
      tech: ["React", "Spring Boot", "MySQL"],
      type: "Educational Platform",
    },
    {
      title: "Noor Al Mufaza",
      url: "nooralmufaza.com",
      description:
        "Modern, responsive website showcasing elegant design principles and user-centric functionality.",
      tech: ["React", "CSS3", "JavaScript"],
      type: "Business Website",
    },
  ];

  const hobbies = [
    { name: "Art", icon: "🎨", description: "Digital & Traditional" },
    { name: "Photography", icon: "📸", description: "Landscape & Portrait" },
    { name: "Music", icon: "🎵", description: "Composition & Performance" },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900/20 text-white relative overflow-hidden">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative group">
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>

          <Link
            to="/team"
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
            <span className="relative text-sm md:text-base">Back to Team</span>

            {/* Button accent */}
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-300/60 rounded-full group-hover:bg-emerald-200 transition-colors duration-300"></div>
          </Link>
        </motion.div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-40 right-20 w-80 h-80 bg-emerald-500/8 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-300/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}></div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10 px-6 py-16">
        {/* Hero Section */}
        <motion.div
          className={`max-w-6xl mx-auto text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          {/* Profile Picture */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-gray-800/60 to-gray-700/40 rounded-3xl border-2 border-emerald-400/30 group-hover:border-emerald-400/50 transition-all duration-500 backdrop-blur-xl overflow-hidden">
                {/* Placeholder for your photo */}
                <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                  <div className="text-6xl md:text-7xl font-bold text-emerald-300/80">
                    <img
                      src="/pictures/Rohan-pic.jpg"
                      alt="Profile"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4 border-emerald-400/50"
                    />
                  </div>
                </div>
                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              {/* Floating ring */}
              <div className="absolute -inset-4 border border-emerald-400/20 rounded-3xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
            </div>
          </div>

          {/* Name and Title */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
                D Rohan Samuel
              </span>
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-emerald-400"></div>
              <span className="text-emerald-400 text-xl font-light tracking-widest uppercase">
                Full Stack Developer
              </span>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-emerald-400"></div>
            </div>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Passionate Computer Science Engineering student crafting digital
              experiences with modern web technologies. Currently pursuing BE
              CSE at RVCE Bangalore, bringing creative solutions to life through
              code.
            </p>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex justify-center gap-2 bg-gray-800/40 backdrop-blur-xl rounded-2xl p-2 border border-gray-700/30">
            {["about", "projects", "hobbies"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          {activeTab === "about" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                    My Journey
                  </span>
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    I'm a passionate Computer Science Engineering student with a
                    strong foundation in web development and a keen eye for
                    creating intuitive digital experiences. My journey in tech
                    started during my diploma years, where I discovered the
                    power of code to transform ideas into reality.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Beyond programming, I'm deeply passionate about art,
                    photography, and music - creative outlets that influence my
                    approach to problem-solving and design. I believe in the
                    intersection of technology and creativity, where innovation
                    meets aesthetic excellence.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-emerald-300 mb-6">
                  Education Timeline
                </h3>
                <div className="space-y-6">
                  {/* Education cards */}
                  <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-emerald-400/30 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">
                          BE in Computer Science Engineering
                        </h4>
                        <p className="text-emerald-300 font-medium mb-2">
                          RV College of Engineering, Bangalore
                        </p>
                        <p className="text-gray-400 text-sm">2025 - Present</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-emerald-400/30 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">
                          Diploma in Computer Science
                        </h4>
                        <p className="text-emerald-300 font-medium mb-2">
                          Sanjay Gandhi Polytechnic, Ballari
                        </p>
                        <p className="text-gray-400 text-sm">2022 - 2025</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-emerald-400/30 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">
                          Secondary Education (CBSE)
                        </h4>
                        <p className="text-emerald-300 font-medium mb-2">
                          Srikari Public School, Hospete
                        </p>
                        <p className="text-gray-400 text-sm">2022 Graduate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects Section */}
          {activeTab === "projects" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                    Featured Projects
                  </span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Crafted with passion and precision
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-400/10">
                    <div className="relative">
                      {/* Project type badge */}
                      <div className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-emerald-400/30">
                        {project.type}
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors duration-300">
                        {project.title}
                      </h3>

                      <div className="text-emerald-400 font-mono text-sm mb-4 bg-gray-900/50 px-3 py-2 rounded-lg border border-emerald-500/20">
                        {project.url}
                      </div>

                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 text-emerald-200 text-xs font-medium px-3 py-1 rounded-full border border-emerald-400/30">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Hover effect decoration */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Hobbies Section */}
          {activeTab === "hobbies" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                    Creative Pursuits
                  </span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Where passion meets creativity
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {hobbies.map((hobby, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-500 hover:transform hover:scale-105 text-center">
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {hobby.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors duration-300">
                      {hobby.name}
                    </h3>
                    <p className="text-emerald-400 font-medium">
                      {hobby.description}
                    </p>

                    {/* Progress bar effect */}
                    <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300 mx-auto rounded-full transition-all duration-700 delay-200 mt-4"></div>
                  </div>
                ))}
              </div>

              {/* Additional info */}
              <div className="text-center mt-12">
                <div className="inline-block bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl px-8 py-6 border border-gray-700/30">
                  <p className="text-gray-300 text-lg italic">
                    "Creativity is intelligence having fun - and I love having
                    fun with code, colors, and compositions."
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Contact/Social Footer */}
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                Let's Connect
              </span>
            </h3>
            <p className="text-gray-300 mb-6">
              Always excited to collaborate on innovative projects and creative
              endeavors.
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
                Ready to Create
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

      {/* Custom CSS for animations */}
      <style jsx>{`
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

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
