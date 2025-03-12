import { useState } from "react";
import AddStudentsTab from "../faculty/AddStudentsTab";
import AttendanceTab from "../faculty/AttendanceTab";
import AssessmentTab from "../faculty/AssessmentTab";
import SyllabusTab from "../faculty/SyllabusTab";
import { useNavigate } from "react-router-dom";

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-[#2D2A43] text-white py-5 px-6 flex items-center justify-between">
        <div className="text-center flex-grow">
          <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
          <p className="text-gray-300 text-sm">
            Manage Attendance, Assessments, and Syllabus
          </p>
        </div>
        <button
          className="bg-[#9569D8] hover:bg-[#ac3131] px-4 py-2 rounded text-white font-medium text-sm"
          onClick={() => navigate("/")}
        >
          Log Out
        </button>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-[#3D3A63] py-3 shadow-lg flex justify-center items-center px-6 relative">
        <ul className="flex space-x-6">
          {["attendance", "assessment", "syllabus"].map((tab) => (
            <li key={tab}>
              <a
                href="#"
                className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                  activeTab === tab
                    ? "bg-[#9569D8] shadow-md"
                    : "hover:bg-gray-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab);
                }}
              >
                {tab === "attendance" && "Attendance"}
                {tab === "assessment" && "Internal Assessment"}
                {tab === "syllabus" && "Syllabus Management"}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="bg-[#9569D8] hover:bg-[#6f48a3] px-4 py-2 rounded text-white font-medium text-sm absolute right-6"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("add-students");
          }}
        >
          Add Students
        </button>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-8 flex-1 bg-white shadow-md rounded-lg mt-6">
        {activeTab === "attendance" && <AttendanceTab />}
        {activeTab === "assessment" && <AssessmentTab />}
        {activeTab === "syllabus" && <SyllabusTab />}
        {activeTab === "add-students" && <AddStudentsTab />}
      </div>
    </div>
  );
};

export default FacultyDashboard;
