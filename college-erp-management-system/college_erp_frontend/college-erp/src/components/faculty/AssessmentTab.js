import React, { useState } from "react";
import Alert from "./Alert";

const departments = ["DCS", "DEEE", "DME", "DCE", "DMT"];
const semesters = [1, 2, 3, 4, 5];
const sections = ["A", "B", "C", "D"];
const assessments = [
  "IA - 1",
  "IA - 2",
  "IA - 3",
  "IA - 4",
  "IA - 5",
  "Skill Test - 1",
  "Skill Test - 2",
];

function AssessmentTab() {
  // Keep states if you want later, but they won’t matter for now
  const [alert] = useState({ show: false, message: "", type: "" });

  return (
    <div className="bg-[#2d2f36] p-6 rounded-md shadow-md text-white relative">
      <h2 className="text-2xl font-bold mb-6 text-emerald-300">
        Internal Assessment (IA) Marks Entry
      </h2>

      {/* Overlay for under progress */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-20 rounded-md">
        <p className="text-emerald-400 text-xl font-bold animate-pulse">
          🚧 This module is under progress 🚧
        </p>
      </div>

      {/* Filters (disabled) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 opacity-50 pointer-events-none">
        <select className="bg-gray-800 text-white p-2 rounded-md border border-emerald-500" disabled>
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select className="bg-gray-800 text-white p-2 rounded-md border border-emerald-500" disabled>
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>Semester {sem}</option>
          ))}
        </select>

        <select className="bg-gray-800 text-white p-2 rounded-md border border-emerald-500" disabled>
          <option value="">Select Section</option>
          {sections.map((sec) => (
            <option key={sec} value={sec}>Section {sec}</option>
          ))}
        </select>

        <select className="bg-gray-800 text-white p-2 rounded-md border border-emerald-500 col-span-1 md:col-span-2" disabled>
          <option value="">Select Subject</option>
        </select>

        <select className="bg-gray-800 text-white p-2 rounded-md border border-emerald-500" disabled>
          <option value="">Select IA Type</option>
          {assessments.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Disabled Table */}
      <div className="overflow-x-auto opacity-50 pointer-events-none">
        <table className="w-full border-collapse my-6">
          <thead>
            <tr>
              <th className="bg-emerald-800 p-3 text-left rounded-tl-md">Registration No.</th>
              <th className="bg-emerald-800 p-3 text-left">Name</th>
              <th className="bg-emerald-800 p-3 text-left">Marks</th>
              <th className="bg-emerald-800 p-3 text-left rounded-tr-md">Max Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#3a3b41]">
              <td className="p-3">--</td>
              <td className="p-3">--</td>
              <td className="p-3">
                <input type="number" className="bg-gray-800 text-white p-2 rounded-md w-full" disabled />
              </td>
              <td className="p-3">--</td>
            </tr>
          </tbody>
        </table>
        <button className="bg-emerald-600 py-2 px-4 rounded-md text-white" disabled>
          Save IA Marks
        </button>
      </div>

      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default AssessmentTab;
