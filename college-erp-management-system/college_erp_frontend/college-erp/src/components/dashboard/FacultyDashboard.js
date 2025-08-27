import { useState } from "react";
import AttendanceTab from "../faculty/AttendanceTab";
import AssessmentTab from "../faculty/AssessmentTab";
import SyllabusTab from "../faculty/SyllabusTab";
import ViewStudentsTab from "../faculty/ViewStudentsTab";
import AddSubjectTab from "../faculty/AddSubjectTab";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Marquee from "../common/Marquee";
import Footer from "../common/Footer";

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state?.data;
  const facultyName = data?.name || "Faculty";
  const facultyRole = data?.role || "Role";

  const tabs = [
    { id: "attendance", label: "Attendance", icon: "📋" },
    { id: "assessment", label: "Internal Assessment", icon: "📝" },
    { id: "syllabus", label: "Syllabus", icon: "📚" },
    { id: "view-students", label: "View Students", icon: "👥" },
    { id: "add-subject", label: "Add Subject", icon: "➕" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white shadow-md px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left - Logo + Title */}
          <div className="flex items-center gap-3 cursor-pointer">
            <motion.img
              src="/logo192.png"
              alt="SGP Logo"
              className="h-10 w-10 sm:h-12 sm:w-12"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-wide leading-tight">
                Sanjay Gandhi Polytechnic ERP
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Faculty Dashboard
              </p>
            </div>
          </div>

          {/* Right - User Info + Buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold truncate max-w-[140px]">
                {facultyName}
              </p>
              <p className="text-xs text-emerald-100 truncate max-w-[140px]">
                {facultyRole}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-md text-white text-sm font-medium transition"
                onClick={() => navigate("/reset-password", { state: { data } })}
              >
                Reset Password
              </button>
              <button
                className="bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-md text-white text-sm font-medium transition"
                onClick={() => navigate("/")}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Right - Mobile Hamburger */}
          <div className="sm:hidden">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="p-2 rounded-md bg-emerald-600 hover:bg-emerald-700 transition"
            >
              {userMenuOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {userMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden mt-3 bg-emerald-800 rounded-lg shadow-lg p-4 flex flex-col gap-3"
          >
            <div className="text-center border-b border-emerald-700 pb-2 mb-2">
              <p className="text-sm font-semibold">{facultyName}</p>
              <p className="text-xs text-emerald-100">{facultyRole}</p>
            </div>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-md text-white text-sm font-medium transition"
              onClick={() => {
                navigate("/reset-password", { state: { data } });
                setUserMenuOpen(false);
              }}
            >
              Reset Password
            </button>
            <button
              className="bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-md text-white text-sm font-medium transition"
              onClick={() => {
                navigate("/");
                setUserMenuOpen(false);
              }}
            >
              Logout
            </button>
          </motion.div>
        )}
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-[#273036] shadow-md relative">
        {/* Mobile */}
        <div className="sm:hidden px-3 py-2">
          <button
            className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium text-sm flex items-center justify-between transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="flex items-center gap-2">
              <span>{tabs.find((tab) => tab.id === activeTab)?.icon}</span>
              <span>{tabs.find((tab) => tab.id === activeTab)?.label}</span>
            </span>
            <motion.span
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </button>

          {/* Dropdown */}
          <motion.div
            initial={false}
            animate={{
              height: mobileMenuOpen ? "auto" : 0,
              opacity: mobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-[#1f2937] rounded-lg shadow-lg">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white"
                      : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
                  } ${index === 0 ? "rounded-t-lg" : ""} ${
                    index === tabs.length - 1 ? "rounded-b-lg" : ""
                  }`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Desktop */}
        <div className="hidden sm:block py-2 px-6">
          <ul className="flex gap-3 md:gap-5 justify-center">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm md:text-base whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-emerald-600 shadow-md text-white"
                      : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
                  }`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span className="hidden md:inline">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <Marquee />

      {/* Main */}
      <main className="flex-1 p-3 sm:p-4 md:p-6">
        <motion.div
          className="max-w-7xl mx-auto bg-[#2d2f36] rounded-lg p-3 sm:p-4 md:p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          key={activeTab}
        >
          <div className="overflow-x-auto">
            {activeTab === "attendance" && <AttendanceTab faculty={data} />}
            {activeTab === "assessment" && <AssessmentTab faculty={data} />}
            {activeTab === "syllabus" && <SyllabusTab />}
            {activeTab === "view-students" && <ViewStudentsTab />}
            {activeTab === "add-subject" && <AddSubjectTab faculty={data} />}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyDashboard;
