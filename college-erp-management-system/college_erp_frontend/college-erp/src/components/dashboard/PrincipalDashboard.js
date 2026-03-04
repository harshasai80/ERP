import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Dashboard from "../principal/pages/Dashboard";
import FacultyList from "../principal/pages/Faculty/FacultyList";
import StudentList from "../principal/pages/Students/StudentList";
import { motion } from "framer-motion";
import Navbar from "../principal/components/layout/Navbar";
import Marquee from "../common/Marquee";
import Footer from "../common/footer/Footer";
import IAMarksTab from "../faculty/IAMarksTab";

const PrincipalDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const location = useLocation();

  const data = location.state?.data;

  const handleDeptClick = (dept, tab) => {
    setSelectedDept(dept.toUpperCase());
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "faculty":
        return <FacultyList department={selectedDept} />;
      case "students":
        return <StudentList initialDepartment={selectedDept} />;
      case "ia-marks":
        return <IAMarksTab faculty={{ department: selectedDept }} isHOD={true} />;
      default:
        return <Dashboard onDeptClick={handleDeptClick} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-mesh text-academic overflow-hidden font-sans">
      <Navbar data={data} />
      <Marquee />

      {/* Modern Navigation Tabs */}
      <div className="sticky top-[85px] z-[40] bg-white/80 backdrop-blur-md border-b-2 border-gold pb-px">
        <div className="max-w-[1400px] mx-auto px-10 py-6">
          <div className="flex justify-center sm:justify-start items-center gap-4 bg-gray-50 p-2.5 rounded-lg w-fit border border-gray-200 shadow-inner">
            {["dashboard", "faculty", "students", "ia-marks"].map((tab) => (
              <button
                key={tab}
                className={`relative px-10 py-3.5 rounded-md text-base font-black uppercase tracking-[0.18em] transition-all duration-300
                  ${activeTab === tab
                    ? "text-white shadow-xl"
                    : "text-faded-ink hover:text-academic hover:bg-white"}`}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab !== "students" && tab !== "faculty") {
                    setSelectedDept("ALL");
                  }
                }}>
                <span className="relative z-20">{tab}</span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabUnderlay"
                    className="absolute inset-0 bg-academic z-0"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Administrative Content */}
      <main className="flex-grow container max-w-[1400px] mx-auto px-8 sm:px-12 py-12">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full h-full bg-white border border-gray-100 shadow-[0_20px_80px_rgba(0,0,0,0.06)] p-12 rounded-sm">
          {renderContent()}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PrincipalDashboard;




