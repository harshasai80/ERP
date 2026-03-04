"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Rohan() {
  const [activeTab, setActiveTab] = useState("about");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSkill, setCurrentSkill] = useState(0);
  const containerRef = useRef(null);

  const projects = [
    {
      title: "Info SGP Bellary",
      url: "info.sgpbellary.com",
      description:
        "Comprehensive information portal for Sanjay Gandhi Polytechnic, providing students with easy access to academic resources and institutional updates.",
      tech: ["React", "Spring Boot", "MySQL"],
      type: "Educational Platform",
      icon: "🎓",
    },
    {
      title: "Noor Al Mufaza",
      url: "nooralmufaza.com",
      description:
        "Modern, responsive website showcasing elegant design principles and user-centric functionality.",
      tech: ["React", "CSS3", "JavaScript"],
      type: "Business Website",
      icon: "🌟",
    },
  ];

  const skills = [
    { name: "React", level: 90, icon: "⚛️" },
    { name: "JavaScript", level: 85, icon: "🟨" },
    { name: "Spring Boot", level: 80, icon: "🍃" },
    { name: "MySQL", level: 75, icon: "🗄️" },
    { name: "CSS3", level: 88, icon: "🎨" },
    { name: "Node.js", level: 70, icon: "🟢" },
  ];

  const hobbies = [
    {
      name: "Art",
      icon: "🎨",
      description: "Digital & Traditional",
    },
    {
      name: "Photography",
      icon: "📸",
      description: "Landscape & Portrait",
    },
    {
      name: "Music",
      icon: "🎵",
      description: "Composition & Performance",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkill((prev) => (prev + 1) % skills.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [skills.length]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900/20 text-white relative overflow-hidden"
    >
      {/* Mouse Follower */}
      <div
        className="fixed w-4 h-4 bg-emerald-400/20 rounded-full pointer-events-none z-50 blur-sm transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 8}px, ${mousePosition.y - 8
            }px)`,
        }}
      />

      {/* Back Button */}
      <Link to="/team">
        <div className="fixed top-6 left-6 z-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

            <button className="relative flex items-center gap-3 bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 hover:from-emerald-500 hover:to-emerald-400 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 border border-emerald-500/30 backdrop-blur-sm">
              <span className="text-base">←</span>
              <span>Back to Team</span>
            </button>
          </motion.div>
        </div>
      </Link>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-80 h-80 bg-emerald-400/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-72 h-72 bg-emerald-500/6 rounded-full blur-2xl"
          animate={{
            scale: [1, 0.8, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 px-6 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Section */}
        <motion.div
          className="max-w-6xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Profile Picture */}
          <div className="mb-8 flex justify-center">
            <motion.div className="relative group" whileHover={{ scale: 1.05 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

              <div className="relative w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-gray-800/60 to-gray-700/40 rounded-3xl border-2 border-emerald-400/30 group-hover:border-emerald-400/50 transition-all duration-500 backdrop-blur-xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                  <img
                    src="/pictures/Rohan-pic.jpg"
                    alt="Profile"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4 border-emerald-400/50"
                  />
                </div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>

              <div className="absolute -inset-4 border border-emerald-400/20 rounded-3xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
            </motion.div>
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
              <span className="text-emerald-400 text-base font-light tracking-widest uppercase">
                Full Stack Developer
              </span>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-emerald-400"></div>
            </div>
            <p className="text-gray-300 text-base md:text-base max-w-3xl mx-auto leading-relaxed">
              Passionate Computer Science Engineering student crafting digital
              experiences with modern web technologies. Currently pursuing BE
              CSE at RVCE Bangalore, bringing creative solutions to life through
              code.
            </p>
          </div>

          {/* Skills Showcase */}
          <div className="flex justify-center items-center mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSkill}
                className="flex items-center gap-4 bg-gray-800/60 backdrop-blur-xl rounded-2xl px-6 py-4 border border-emerald-400/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-2xl">{skills[currentSkill].icon}</span>
                <div>
                  <div className="text-emerald-300 font-semibold">
                    {skills[currentSkill].name}
                  </div>
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${skills[currentSkill].level}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex justify-center gap-2 bg-gray-800/40 backdrop-blur-xl rounded-2xl p-2 border border-gray-700/30">
            {["about", "projects", "hobbies"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 rounded-xl font-semibold text-base uppercase tracking-wide transition-all duration-300 ${activeTab === tab
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === tab && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl shadow-lg"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* About Section */}
            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                      My Journey
                    </span>
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 text-base leading-relaxed mb-6">
                      I'm a passionate Computer Science Engineering student with
                      a strong foundation in web development and a keen eye for
                      creating intuitive digital experiences. My journey in tech
                      started during my diploma years, where I discovered the
                      power of code to transform ideas into reality.
                    </p>
                    <p className="text-gray-300 text-base leading-relaxed">
                      Beyond programming, I'm deeply passionate about art,
                      photography, and music - creative outlets that influence
                      my approach to problem-solving and design. I believe in
                      the intersection of technology and creativity, where
                      innovation meets aesthetic excellence.
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {skills.slice(0, 4).map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base">{skill.icon}</span>
                          <div className="flex-1">
                            <div className="text-white font-semibold text-base">
                              {skill.name}
                            </div>
                            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1">
                              <motion.div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{
                                  duration: 1,
                                  delay: index * 0.1 + 0.3,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-emerald-300 mb-6">
                    Education Timeline
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        title: "BE in Computer Science Engineering",
                        institution: "RV College of Engineering, Bangalore",
                        period: "2025 - Present",
                        status: "current",
                      },
                      {
                        title: "Diploma in Computer Science",
                        institution: "Sanjay Gandhi Polytechnic, Ballari",
                        period: "2022 - 2025",
                        status: "completed",
                      },
                      {
                        title: "Secondary Education (CBSE)",
                        institution: "Srikari Public School, Hospete",
                        period: "2022 Graduate",
                        status: "completed",
                      },
                    ].map((education, index) => (
                      <motion.div
                        key={index}
                        className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-emerald-400/30 transition-all duration-300 group"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${education.status === "current"
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-emerald-600/60"
                              }`}
                          />
                          <div>
                            <h4 className="text-base font-semibold text-white mb-1">
                              {education.title}
                            </h4>
                            <p className="text-emerald-300 font-medium mb-2">
                              {education.institution}
                            </p>
                            <p className="text-gray-400 text-base">
                              {education.period}
                            </p>
                          </div>

                          {education.status === "current" && (
                            <div className="bg-emerald-500/20 text-emerald-300 text-base font-semibold px-2 py-1 rounded-full border border-emerald-400/30">
                              Current
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Projects Section */}
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                      Featured Projects
                    </span>
                  </h2>
                  <p className="text-gray-400 text-base">
                    Crafted with passion and precision
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {projects.map((project, index) => (
                    <motion.div
                      key={index}
                      className="group bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-500 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                    >
                      <div className="relative">
                        {/* Project header */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">{project.icon}</span>
                          <div className="inline-block bg-emerald-500/20 text-emerald-300 text-base font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
                            {project.type}
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors duration-300">
                          {project.title}
                        </h3>

                        <div className="text-emerald-400 font-mono text-base mb-4 bg-gray-900/50 px-3 py-2 rounded-lg border border-emerald-500/20">
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

                        {/* Tech stack */}
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 text-emerald-200 text-base font-medium px-3 py-1 rounded-full border border-emerald-400/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Hover effect decoration */}
                        <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Hobbies Section */}
            {activeTab === "hobbies" && (
              <motion.div
                key="hobbies"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                      Creative Pursuits
                    </span>
                  </h2>
                  <p className="text-gray-400 text-base">
                    Where passion meets creativity
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {hobbies.map((hobby, index) => (
                    <motion.div
                      key={index}
                      className="group bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-500 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
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
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <div className="text-center mt-12">
                  <div className="inline-block bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl px-8 py-6 border border-gray-700/30">
                    <p className="text-gray-300 text-base italic">
                      "Creativity is intelligence having fun - and I love having
                      fun with code, colors, and compositions."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Simple Footer */}
        <motion.div
          className="max-w-4xl mx-auto mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
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
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
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
                    style={{ animationDelay: `${(i + 5) * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

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




