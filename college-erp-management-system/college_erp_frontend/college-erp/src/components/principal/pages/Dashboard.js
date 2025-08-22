import React, { useEffect, useState } from "react";
import SummaryCard from "../components/cards/SummaryCard";
import { motion } from "framer-motion";
import Api from "../../../Api";

const Dashboard = () => {
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

        const departmentCounts = {};

        faculties.forEach((f) => {
          if (!departmentCounts[f.department]) {
            departmentCounts[f.department] = { faculty: 0, students: 0 };
          }
          departmentCounts[f.department].faculty += 1;
        });

        students.forEach((s) => {
          if (!departmentCounts[s.department]) {
            departmentCounts[s.department] = { faculty: 0, students: 0 };
          }
          departmentCounts[s.department].students += 1;
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 250 }}
          >
            <SummaryCard
              title={dept}
              value={`👨‍🏫 ${deptData[dept].faculty} | 👨‍🎓 ${deptData[dept].students}`}
              icon="🏫"
              className="p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-white/10 
                bg-gradient-to-br from-gray-800/90 to-gray-900/90 hover:shadow-gray-700/50 
                text-white transition"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
