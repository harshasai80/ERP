import React, { useEffect, useState } from "react";
import SummaryCard from "../components/cards/SummaryCard";
import { motion } from "framer-motion";
import Api from "../../../Api";

const Dashboard = ({ onDeptClick }) => {
  const [deptData, setDeptData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facultyRes = await Api.get("/faculty/all-faculties");
        const faculties = facultyRes.data.data.filter(
          (f) => f.department !== "SGP"
        );

        const studentRes = await Api.get("/student/all-students");
        const students = studentRes.data.data;

        const requiredDepts = ["DCS", "DEEE", "DME", "DCE", "DMT"];
        const departmentCounts = {};

        // Initialize required departments with 0 values
        requiredDepts.forEach((dept) => {
          departmentCounts[dept] = { faculty: 0, students: 0 };
        });

        faculties.forEach((f) => {
          const dept = f.department ? f.department.toUpperCase() : "UNKNOWN";
          if (!departmentCounts[dept]) {
            departmentCounts[dept] = { faculty: 0, students: 0 };
          }
          departmentCounts[dept].faculty += 1;
        });

        students.forEach((s) => {
          const dept = s.department ? s.department.toUpperCase() : "UNKNOWN";
          if (!departmentCounts[dept]) {
            departmentCounts[dept] = { faculty: 0, students: 0 };
          }
          departmentCounts[dept].students += 1;
        });

        setDeptData(departmentCounts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-7xl mx-auto bg-gradient-to-b from-gray-950 via-gray-900 to-black min-h-screen flex flex-col items-center text-white"
    >
      {/* Dashboard Title */}
      <h1 className="text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
        Principal Dashboard
      </h1>

      {/* Department Wise Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
        {Object.keys(deptData).map((dept) => (
          <motion.div
            key={dept}
            whileHover={{ scale: 1.02 }}
            className="p-8 rounded-2xl shadow-lg border border-white/10 
                bg-gradient-to-br from-gray-800/90 to-gray-900/90 hover:shadow-emerald-500/20 
                text-white transition flex flex-col items-center"
          >
            <div className="text-4xl mb-4">🏫</div>
            <h2 className="text-2xl font-bold mb-2 uppercase text-emerald-300">{dept}</h2>
            <div className="flex gap-4 mb-6 text-gray-300">
              <span className="flex items-center gap-1">👨‍🏫 {deptData[dept].faculty} Faculty</span>
              <span className="flex items-center gap-1">👨‍🎓 {deptData[dept].students} Students</span>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => onDeptClick(dept, "faculty")}
                className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-bold transition"
              >
                View Faculty
              </button>
              <button
                onClick={() => onDeptClick(dept, "students")}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold transition"
              >
                View Students
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
