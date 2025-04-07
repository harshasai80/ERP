import { useState } from "react";
import AttendanceTab from "../faculty/AttendanceTab";
import AssessmentTab from "../faculty/AssessmentTab";
import SyllabusTab from "../faculty/SyllabusTab";
import ViewStudentsTab from "../faculty/ViewStudentsTab";
import AddSubjectTab from "../faculty/AddSubjectTab";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const navigate = useNavigate();

  const tabs = [
    { id: "attendance", label: "Attendance" },
    { id: "assessment", label: "Internal Assessment" },
    { id: "syllabus", label: "Syllabus Management" },
    { id: "view-students", label: "View Students" },
    { id: "add-subject", label: "Add Subject" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-5 px-4 sm:px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <motion.img
            src="/logo128.png"
            alt="SGP Logo"
            className="h-12 w-12 cursor-pointer"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="cursor-pointer hidden sm:block"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-extrabold tracking-wide text-white">
              Sanjay Gandhi Polytechnic ERP
            </h1>
            <p className="text-emerald-100 text-sm">Faculty Dashboard</p>
          </motion.div>
        </div>
        <button
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md text-white font-medium text-sm transition"
          onClick={() => navigate("/")}
        >
          Log Out
        </button>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-[#273036] py-3 shadow-md px-2 sm:px-6 overflow-x-auto">
        <ul className="flex justify-center flex-wrap gap-2 sm:gap-4">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
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
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto bg-[#2d2f36] rounded-lg p-6 shadow-lg">
          {activeTab === "attendance" && <AttendanceTab />}
          {activeTab === "assessment" && <AssessmentTab />}
          {activeTab === "syllabus" && <SyllabusTab />}
          {activeTab === "view-students" && <ViewStudentsTab />}
          {activeTab === "add-subject" && <AddSubjectTab />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 py-6 mt-auto text-center text-gray-500 text-sm">
        © 2025 Sanjay Gandhi Polytechnic. All rights reserved.
      </footer>
    </div>
  );
};

export default FacultyDashboard;
