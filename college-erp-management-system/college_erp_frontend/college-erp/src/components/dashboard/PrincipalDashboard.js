import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Dashboard from "../principal/pages/Dashboard";
import FacultyList from "../principal/pages/Faculty/FacultyList";
import StudentList from "../principal/pages/Students/StudentList";
import { motion } from "framer-motion";
import Navbar from "../principal/components/layout/Navbar";
import Marquee from "../common/Marquee";
import Footer from "../common/footer/Footer";

const PrincipalDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const location = useLocation();

  const data = location.state?.data;

  const handleDeptClick = (dept, tab) => {
    setSelectedDept(dept);
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "faculty":
        return <FacultyList department={selectedDept} />;
      case "students":
        return <StudentList initialDepartment={selectedDept} />;
      default:
        return <Dashboard onDeptClick={handleDeptClick} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-white font-sans">
      <Navbar data={data} />

      <Marquee />

      {/* Tab Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mt-6 border-b border-gray-700 px-2 sm:px-6">
        <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2 sm:space-x-6 w-full">
          {["dashboard", "faculty", "students"].map((tab) => (
            <button
              key={tab}
              className={`capitalize text-sm sm:text-lg px-3 sm:px-5 py-2 transition-all font-medium rounded-t-md flex-1 sm:flex-none
                ${activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <main className="flex-grow container mx-auto px-3 sm:px-6 py-4 sm:py-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-xl overflow-x-auto">
          {renderContent()}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PrincipalDashboard;
