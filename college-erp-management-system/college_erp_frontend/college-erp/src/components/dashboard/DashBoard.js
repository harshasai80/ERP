import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavbar from "./BottomNavBar";
import Attendance from "../student/Attendance";
import IAMarks from "../student/IAMarks";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const navigate = useNavigate();
  const location = useLocation();

  // Improved Student Data Handling
  const student = location.state?.student?.data || location.state?.student;

  return (
    <div className="h-screen w-full bg-gray-300 flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#2D2A43] text-white flex justify-between items-center px-4 md:px-6 py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <img
            src="/logo128.png"
            alt="College Logo"
            className="h-8 md:h-10 w-auto"
          />
          <div className="text-sm md:text-lg font-semibold">
            Sanjay Gandhi Polytechnic
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 md:gap-6 px-10">
            <FaUserCircle className="text-gray-300 text-2xl md:text-3xl" />
            <div className="text-white text-xs md:text-sm">
              <p className="font-semibold">
                {student?.name?.toUpperCase() || "N/A"}
              </p>
              <p className="text-gray-300">
                Reg: {student?.registrationNumber?.toUpperCase() || "N/A"}{" "}
                <br /> {student?.sem || "N/A"} Sem | {student?.section || "N/A"}{" "}
                Sec
              </p>
            </div>
          </div>
          <button
            className="bg-[#9569D8] hover:bg-[#ac3131] px-3 md:px-4 py-1 md:py-2 rounded text-white font-medium text-xs md:text-sm"
            onClick={() => navigate("/login/student")}
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow px-4 md:px-0">
        {activeTab === "Dashboard" && (
          <div
            className="bg-[#2D2A43] p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-sm md:max-w-md flex flex-col items-center transform hover:scale-105 transition-transform duration-300"
            style={{ boxShadow: "0 10px 25px rgba(149, 105, 216, 0.4)" }}
          >
            <div className="bg-[#2D2A43] p-4 md:p-6 rounded-full mb-4 shadow-inner">
              <FaUserCircle className="text-gray-400 text-6xl md:text-8xl" />
            </div>
            <div className="w-full bg-[#c4c3ce] p-4 md:p-6 rounded-lg text-center shadow-md">
              <h2 className="text-lg md:text-xl font-semibold text-black">
                Name: {student?.name?.toUpperCase() || "N/A"}
              </h2>
              <p className="text-black mt-1 md:mt-2">
                Reg: {student?.registrationNumber?.toUpperCase() || "N/A"}
              </p>
              <p className="text-black">Sem: {student?.sem || "N/A"} Sem</p>
              <p className="text-black">Sec: {student?.section || "N/A"} Sec</p>
            </div>
          </div>
        )}

        {activeTab === "Attendance" && <Attendance student={student} />}
        {activeTab === "Results" && <IAMarks student={student} />}
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
