import { useState } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavbar from "./BottomNavBar";
import Attendance from "../student/Attendance";
import IAMarks from "../student/IAMarks";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state?.student?.data || location.state?.student;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col relative overflow-hidden">
      {/* Floating Background Circles */}
      <div className="absolute inset-0 -z-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-500/20 blur-3xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, -10, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4,
            }}
            style={{
              width: `${80 + Math.random() * 80}px`,
              height: `${80 + Math.random() * 80}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="relative z-10 backdrop-blur-md bg-gradient-to-r from-emerald-500/60 to-emerald-700/60 shadow-md">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    {/* Left: Logo + Title */}
    <div className="flex items-center gap-3">
      <motion.img
        src="/logo128.png"
        alt="Logo"
        className="h-10 w-10 sm:h-12 sm:w-12"
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
      />
      <motion.h1
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide text-white"
      >
        <span className="hidden sm:inline">Sanjay Gandhi Polytechnic</span>
        <span className="inline sm:hidden">SGP ERP</span>
      </motion.h1>
    </div>

    {/* Right: User Info + Logout */}
    <div className="hidden sm:flex items-center gap-6">
      <div className="flex items-center gap-2 text-sm">
        <FaUserCircle className="text-white text-3xl" />
        <div className="text-right">
          <p className="font-semibold">{student?.name?.toUpperCase() || "N/A"}</p>
          <p className="text-gray-200 text-xs">
            Reg: {student?.registrationNumber?.toUpperCase() || "N/A"}<br />
            {student?.sem || "N/A"} Sem | {student?.section || "N/A"} Sec
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate("/login/student")}
        className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all"
      >
        Log Out
      </button>
    </div>

    {/* Mobile Hamburger + Logout */}
    <div className="flex sm:hidden items-center gap-4">
      <button
        onClick={() => navigate("/login/student")}
        className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all"
      >
        Log Out
      </button>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-white text-2xl"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </div>
  </div>

  {/* Mobile Dropdown: User Info */}
  <AnimatePresence>
    {menuOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="sm:hidden px-6 pb-4"
      >
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-white text-3xl" />
          <div className="text-sm">
            <p className="font-semibold">{student?.name?.toUpperCase() || "N/A"}</p>
            <p className="text-gray-300 text-xs">
              Reg: {student?.registrationNumber?.toUpperCase() || "N/A"}<br />
              {student?.sem || "N/A"} Sem | {student?.section || "N/A"} Sec
            </p>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</nav>


      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow px-4 py-10">
        {activeTab === "Dashboard" && (
          <motion.div
            className="bg-gradient-to-tr from-gray-800 to-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <FaUserCircle className="text-gray-400 text-6xl mx-auto" />
            </div>
            <div className="bg-gray-900 p-6 rounded-xl shadow-inner border border-gray-700">
              <h2 className="text-xl font-bold text-emerald-300 mb-2">
                {student?.name?.toUpperCase() || "N/A"}
              </h2>
              <p className="text-gray-300">
                Reg: {student?.registrationNumber?.toUpperCase() || "N/A"}
              </p>
              <p className="text-gray-300">
                Sem: {student?.sem || "N/A"} | Sec: {student?.section || "N/A"}
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "Attendance" && <Attendance student={student} />}
        {activeTab === "Results" && <IAMarks student={student} />}
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
