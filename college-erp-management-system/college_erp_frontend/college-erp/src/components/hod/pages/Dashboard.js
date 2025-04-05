import React from 'react';
import SummaryCard from '../components/cards/SummaryCard';
import { motion } from 'framer-motion';

const Dashboard = () => {
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
            value="45" 
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
