import React, { useEffect, useState } from "react";
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

        const requiredDepts = ["DCS", "DME", "DCE", "DMT"];
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
      className="max-w-7xl mx-auto flex flex-col items-center text-gray-900"
    >
      {/* Institutional Analytics Header */}
      <div className="text-center mb-16">
        <h2 className="text-base font-bold text-emerald-600 uppercase tracking-[0.4em] mb-4">
          Institutional Overview
        </h2>
        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent classic-heading">
          Departmental <span className="font-light italic text-gray-400">Insight</span>
        </h1>
        <div className="w-24 h-1 bg-emerald-500 mx-auto mt-6 rounded-full opacity-20" />
      </div>

      {/* Department Wise Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {Object.keys(deptData).map((dept) => (
          <motion.div
            key={dept}
            whileHover={{ y: -10 }}
            className="lux-card glass-gold p-10 flex flex-col items-center relative overflow-hidden group"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-8xl font-black classic-heading">{dept[0]}</span>
            </div>

            <div className="bg-emerald-500/5 p-5 rounded-full mb-6 border border-emerald-500/10">
              <span className="text-4xl">🏛️</span>
            </div>

            <h2 className="text-3xl font-bold mb-2 tracking-[0.1em] text-emerald-600 classic-heading uppercase">{dept}</h2>
            <div className="w-12 h-0.5 bg-emerald-500/20 mb-6" />

            <div className="flex flex-col gap-3 mb-8 w-full">
              <div className="flex justify-between items-center px-4 py-2 bg-white/50 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-base font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-base">👨‍🏫</span> Faculty
                </span>
                <span className="text-base font-bold text-gray-700">{deptData[dept].faculty}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-2 bg-white/50 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-base font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-base">👨‍🎓</span> Students
                </span>
                <span className="text-base font-bold text-gray-700">{deptData[dept].students}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-auto">
              <button
                onClick={() => onDeptClick(dept, "faculty")}
                className="px-4 py-3 bg-white hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl text-base font-bold uppercase tracking-widest border border-emerald-500/10 transition-all duration-300 shadow-sm"
              >
                Faculty
              </button>
              <button
                onClick={() => onDeptClick(dept, "students")}
                className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-emerald-500/20"
              >
                Students
              </button>
            </div>
            <button
              onClick={() => onDeptClick(dept, "ia-marks")}
              className="w-full mt-3 px-4 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg"
            >
              📊 Internal Assessment Marks
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;




