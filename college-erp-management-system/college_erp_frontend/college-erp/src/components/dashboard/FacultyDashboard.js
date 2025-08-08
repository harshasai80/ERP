import { useState } from "react";
import AttendanceTab from "../faculty/AttendanceTab";
import AssessmentTab from "../faculty/AssessmentTab";
import SyllabusTab from "../faculty/SyllabusTab";
import ViewStudentsTab from "../faculty/ViewStudentsTab";
import AddSubjectTab from "../faculty/AddSubjectTab";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state?.data;
  const facultyName = data?.name || "Faculty";
  const facultyRole = data?.role || "Role";

  const tabs = [
    { id: "attendance", label: "Attendance" },
    { id: "assessment", label: "Internal Assessment" },
    { id: "syllabus", label: "Syllabus" },
    { id: "view-students", label: "View Students" },
    { id: "add-subject", label: "Add Subject" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-4 px-3 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 shadow-md">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <motion.img
            src="/logo128.png"
            alt="SGP Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 cursor-pointer flex-shrink-0"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-lg sm:text-2xl font-extrabold tracking-wide text-white leading-tight">
              Sanjay Gandhi Polytechnic ERP
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm">
              Faculty Dashboard
            </p>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-end sm:justify-start">
          {/* Name & Role */}
          <div className="text-right sm:text-left">
            <p className="text-sm font-semibold text-white">{facultyName}</p>
            <p className="text-xs text-emerald-100">{facultyRole}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1.5 rounded-md text-white text-xs sm:text-sm font-medium transition w-full sm:w-auto"
              onClick={() => navigate("/reset-password", { state: { data } })}
            >
              Reset Password
            </button>
            <button
              className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md text-white text-xs sm:text-sm font-medium transition w-full sm:w-auto"
              onClick={() => navigate("/")}
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-[#273036] py-2 px-2 sm:px-6 shadow-md overflow-x-auto">
        <ul className="flex gap-2 sm:gap-4 min-w-max justify-center">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={`px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-emerald-600 shadow-md text-white"
                    : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-6">
        <div className="max-w-6xl mx-auto bg-[#2d2f36] rounded-lg p-4 sm:p-6 shadow-lg">
          {activeTab === "attendance" && <AttendanceTab faculty={data} />}
          {activeTab === "assessment" && <AssessmentTab faculty={data} />}
          {activeTab === "syllabus" && <SyllabusTab />}
          {activeTab === "view-students" && <ViewStudentsTab />}
          {activeTab === "add-subject" && <AddSubjectTab faculty={data} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 py-4 text-center text-gray-500 text-xs sm:text-sm mt-auto">
        © 2025 Sanjay Gandhi Polytechnic. All rights reserved.
      </footer>
    </div>
  );
};

export default FacultyDashboard;
