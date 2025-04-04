import React, { useState } from "react";
import Navbar from "../hod/components/layout/Navbar";
import Dashboard from "../hod/pages/Dashboard";
import FacultyList from "../hod/pages/Faculty/FacultyList";
import StudentList from "../hod/pages/Students/StudentList";
import { useLocation } from "react-router-dom";

const HodDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const location = useLocation();

  const data = location.state?.data;

  console.log(data);

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar stretches full width */}
      <div className="w-full bg-white shadow-md py-4">
        <Navbar name={data?.name} />
      </div>

      <main className="flex-1 p-5 bg-gray-100">
        {/* Centered Tabs Navigation */}
        <div className="flex justify-center mb-4 border-b">
          <div className="flex space-x-4">
            <button
              className={`py-2 px-4 ${
                activeTab === "dashboard"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "faculty"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("faculty")}
            >
              Faculty
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "students"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("students")}
            >
              Students
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default HodDashboard;
