import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNavbar from "./BottomNavBar";
import Attendance from "../student/Attendance";
import IAMarks from "../student/IAMarks";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state?.student?.data || location.state?.student;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-gradient-to-r from-emerald-500/60 to-emerald-700/60 shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.img
              src="/logo128.png"
              alt="Logo"
              className="h-12 w-12"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-white">
                Sanjay Gandhi Polytechnic
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-white text-3xl" />
              <div className="text-sm text-right leading-tight">
                <p className="font-semibold">
                  {student?.name?.toUpperCase() || "N/A"}
                </p>
                <p className="text-gray-300">
                  Reg: {student?.registrationNumber?.toUpperCase() || "N/A"}
                  <br />
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
        </div>
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
