"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ExplorerProfile() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentView, setCurrentView] = useState("terminal");
  const [terminalText, setTerminalText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const fullTerminalText = `
> whoami
Syed Mohammed Zuber
Explorer • Learner • Innovator

> cat education.txt
├── SSLC (2022) - Modern English High School, Ballari
├── Diploma CSE (2022-2025) - Sanjay Gandhi Polytechnic, Ballari  
└── BE CSE (Current) - MSRIT, Bangalore

> ls projects/
info.sgpbellary.com/    nooralmufaza.com/

> echo $INTERESTS
Exploring • Learning • Experimenting

> status
Ready to innovate...
_`;

  const projects = [
    {
      title: "Info SGP Bellary",
      url: "info.sgpbellary.com",
      description:
        "Revolutionary academic portal transforming how students interact with institutional resources.",
      tech: ["React", "Spring Boot", "MySQL", "REST API"],
      complexity: "Advanced",
      impact: "High",
    },
    {
      title: "Noor Al Mufaza",
      url: "nooralmufaza.com",
      description:
        "Cutting-edge web solution showcasing modern development practices and seamless user experience.",
      tech: ["React", "CSS3", "JavaScript", "Responsive Design"],
      complexity: "Intermediate",
      impact: "Medium",
    },
  ];

  const skills = [
    {
      category: "Frontend",
      items: ["React", "JavaScript", "CSS3", "HTML5"],
      level: 85,
    },
    {
      category: "Backend",
      items: ["Node.js", "MySQL", "REST APIs"],
      level: 75,
    },
    {
      category: "Tools",
      items: ["Git", "VS Code", "Chrome DevTools"],
      level: 80,
    },
    {
      category: "Learning",
      items: ["Machine Learning", "Cloud Computing", "DevOps"],
      level: 60,
    },
  ];

  const explorationAreas = [
    {
      icon: "🔬",
      title: "Research",
      description: "Diving deep into emerging technologies",
      status: "Active",
    },
    {
      icon: "⚡",
      title: "Innovation",
      description: "Experimenting with cutting-edge solutions",
      status: "Ongoing",
    },
    {
      icon: "🌐",
      title: "Web Technologies",
      description: "Exploring modern development frameworks",
      status: "Advanced",
    },
    {
      icon: "🤖",
      title: "AI & ML",
      description: "Understanding artificial intelligence concepts",
      status: "Learning",
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    // Terminal typing effect
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullTerminalText.length) {
        setTerminalText(fullTerminalText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    // Cursor blinking
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [fullTerminalText]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-emerald-900/30 text-white relative overflow-hidden">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>

          <Link
            to="/team"
            className="relative flex items-center gap-3 bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 hover:from-emerald-500 hover:to-emerald-400 px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 border border-emerald-500/30 hover:border-emerald-400/50 backdrop-blur-sm overflow-hidden"
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            {/* Button content */}
            <motion.span
              className="relative text-lg"
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              ←
            </motion.span>
            <span className="relative text-sm md:text-base">Back to Team</span>

            {/* Button accent */}
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-300/60 rounded-full group-hover:bg-emerald-200 transition-colors duration-300"></div>
          </Link>
        </motion.div>
      </div>

      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900/80 via-slate-800/80 to-emerald-900/20" />

      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["{ }", "< />", "[ ]", "= >", "&&", "||"].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-emerald-400/20 font-mono text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      <div className="relative z-10 px-6 py-12">
        {/* Hero Title Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Name Title */}
          <div className="mb-6">
            <motion.h1
              className="text-5xl md:text-7xl font-black mb-4 leading-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent animate-gradient">
                Syed Mohammed Zuber
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              className="flex items-center justify-center gap-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-emerald-400"></div>
              <span className="text-emerald-400 text-xl md:text-2xl font-light tracking-widest uppercase">
                Tech Explorer & Innovator
              </span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-emerald-400"></div>
            </motion.div>

            {/* Profile tagline */}
            <motion.p
              className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Passionate Computer Science student at MSRIT Bangalore, constantly
              exploring new technologies and experimenting with innovative
              solutions to real-world problems.
            </motion.p>
          </div>

          {/* Decorative elements */}
          <motion.div
            className="flex justify-center items-center space-x-6 text-emerald-400/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="font-mono text-sm">Ready to innovate</span>
            <div
              className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </motion.div>
        </motion.div>

        {/* Header Navigation */}
        <motion.div
          className="max-w-6xl mx-auto mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="flex justify-center gap-4 bg-gray-800/40 backdrop-blur-xl rounded-2xl p-2 border border-gray-700/30">
            {[
              { id: "terminal", label: "$ Terminal", icon: "⚡" },
              { id: "projects", label: "Projects", icon: "🚀" },
              { id: "skills", label: "Skills", icon: "⚙️" },
              { id: "explore", label: "Explore", icon: "🔬" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  currentView === tab.id
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Terminal View */}
          {currentView === "terminal" && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
                {/* Terminal Header */}
                <div className="bg-gray-800/80 px-4 py-3 border-b border-gray-700/50 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-400 text-sm font-mono ml-4">
                    explorer@innovator:~$
                  </span>
                </div>

                {/* Terminal Content */}
                <div className="p-6 font-mono text-sm">
                  <pre className="text-green-400 whitespace-pre-wrap leading-relaxed">
                    {terminalText}
                    {showCursor && (
                      <span className="bg-green-400 text-gray-900">_</span>
                    )}
                  </pre>
                </div>
              </div>

              {/* Profile Summary Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-300">
                  <div className="text-3xl mb-3">🎓</div>
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">
                    Academic Explorer
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Currently pursuing BE CSE at MSRIT Bangalore, building on
                    strong foundations from SGP Ballari.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-300">
                  <div className="text-3xl mb-3">💡</div>
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">
                    Knowledge Seeker
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Passionate about learning new technologies and experimenting
                    with innovative solutions.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-300">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">
                    Tech Innovator
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Creating impactful web solutions and exploring the
                    boundaries of modern development.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects View */}
          {currentView === "projects" && (
            <motion.div
              key="projects"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                    Innovation Lab
                  </span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Where ideas transform into digital reality
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group relative bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-500 overflow-hidden"
                  >
                    {/* Animated background element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="relative z-10">
                      {/* Project badges */}
                      <div className="flex gap-2 mb-4">
                        <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
                          {project.complexity}
                        </span>
                        <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30">
                          Impact: {project.impact}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors duration-300">
                        {project.title}
                      </h3>

                      <div className="text-emerald-400 font-mono text-sm mb-4 bg-gray-900/50 px-3 py-2 rounded-lg border border-emerald-500/20">
                        <span className="text-gray-400">https://</span>
                        <a
                          href={
                            project.url.startsWith("http")
                              ? project.url
                              : `https://${project.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.url}
                        </a>
                      </div>

                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech stack with animated bars */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-emerald-300 mb-3">
                          Technology Stack
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {project.tech.map((tech, techIndex) => (
                            <div
                              key={techIndex}
                              className="bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 text-emerald-200 text-xs font-medium px-3 py-2 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300"
                            >
                              {tech}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Skills View */}
          {currentView === "skills" && (
            <motion.div
              key="skills"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                    Skill Matrix
                  </span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Continuous learning and improvement
                </p>
              </div>

              <div className="space-y-8">
                {skills.map((skillGroup, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-emerald-300">
                        {skillGroup.category}
                      </h3>
                      <span className="text-emerald-400 font-mono text-sm">
                        {skillGroup.level}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-700/50 rounded-full h-2 mb-4">
                      <motion.div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skillGroup.level}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>

                    {/* Skills list */}
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-gray-700/50 text-gray-300 text-sm px-3 py-1 rounded-lg border border-gray-600/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Explore View */}
          {currentView === "explore" && (
            <motion.div
              key="explore"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                    Exploration Zones
                  </span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Pushing boundaries and discovering new frontiers
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {explorationAreas.map((area, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-500 text-center"
                  >
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {area.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-200 transition-colors duration-300">
                      {area.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {area.description}
                    </p>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        area.status === "Active"
                          ? "bg-green-500/20 text-green-300 border border-green-400/30"
                          : area.status === "Ongoing"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                          : area.status === "Advanced"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                      }`}
                    >
                      {area.status}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Learning Philosophy */}
              <div className="mt-12 text-center">
                <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30">
                  <h3 className="text-2xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                      Learning Philosophy
                    </span>
                  </h3>
                  <p className="text-gray-300 text-lg italic mb-6">
                    "The capacity to learn is a gift; the ability to learn is a
                    skill; the willingness to learn is a choice."
                  </p>
                  <div className="flex justify-center items-center gap-6 text-sm text-emerald-400">
                    <span>🚀 Explore</span>
                    <span>→</span>
                    <span>🧠 Learn</span>
                    <span>→</span>
                    <span>⚡ Experiment</span>
                    <span>→</span>
                    <span>🎯 Innovate</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
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
          animation: float linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }

        .bg-grid-white/[0.02] {
          background-image: linear-gradient(
              to right,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px
            );
        }
      `}</style>
    </div>
  );
}
