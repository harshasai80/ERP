import React, { useEffect, useState } from 'react';
import SummaryCard from '../components/cards/SummaryCard';
import { motion } from 'framer-motion';
import Api from "../../../Api"; // Make sure this path matches your project structure

const Dashboard = ({ department }) => {
  const [facultyCount, setFacultyCount] = useState(0);

  useEffect(() => {
    const fetchFacultyCount = async () => {
      try {
        const response = await Api.get("/faculty/all", {
          params: { department },
        });
        setFacultyCount(response.data.data.length || 0);
      } catch (error) {
        console.error("Failed to fetch faculty data:", error);
      }
    };

    fetchFacultyCount();
  }, [department]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="p-8 max-w-7xl mx-auto bg-gradient-to-b from-gray-900 to-black min-h-screen flex flex-col items-center text-white"
    >
      <h1 className="text-4xl font-extrabold mb-10 text-center text-white drop-shadow-xl">
        HOD Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 w-full max-w-3xl justify-center">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
          <SummaryCard 
            title="Total Faculty" 
            value={facultyCount.toString()} 
            icon="👨‍🏫" 
            className="shadow-md p-6 rounded-2xl bg-gray-800 hover:shadow-lg transition text-white" 
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
          <SummaryCard 
            title="Total Students" 
            value="1,250" 
            icon="👨‍🎓" 
            className="shadow-md p-6 rounded-2xl bg-gray-800 hover:shadow-lg transition text-white" 
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
