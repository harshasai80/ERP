import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dashboard from "../hod/pages/Dashboard";
import FacultyList from "../hod/pages/Faculty/FacultyList";
import StudentList from "../hod/pages/Students/StudentList";
import { motion } from "framer-motion";
import Navbar from "../hod/components/layout/Navbar";

const HodDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  const renderContent = () => {
    switch (activeTab) {
      case "faculty":
        return <FacultyList />;
      case "students":
        return <StudentList />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-white font-sans">
      <Navbar/>

      {/* Tab Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mt-6 border-b border-gray-700"
      >
        <div className="flex space-x-6">
          {["dashboard", "faculty", "students"].map((tab) => (
            <button
              key={tab}
              className={`capitalize text-lg px-5 py-2 transition-all font-medium rounded-t-md 
                ${
                  activeTab === tab
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <main className="flex-grow container mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 shadow-xl"
        >
          {renderContent()}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 py-6 text-center text-gray-400 mt-auto">
        <div className="container mx-auto px-6">
          <h3 className="text-xl font-semibold text-white">Sanjay Gandhi Polytechnic Ballari</h3>
          <p className="text-purple-300 mb-4">Excellence in Technical Education</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
          </div>
          <p className="mt-4 text-sm">© 2025 Sanjay Gandhi Polytechnic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HodDashboard;
