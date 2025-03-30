import React from 'react';
import SummaryCard from '../components/cards/SummaryCard';

const Dashboard = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">HOD Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 w-full max-w-3xl justify-center">
        <SummaryCard title="Total Faculty" value="45" icon="👨‍🏫" className="shadow-md p-6 rounded-xl bg-white hover:shadow-lg transition" />
        <SummaryCard title="Total Students" value="1,250" icon="👨‍🎓" className="shadow-md p-6 rounded-xl bg-white hover:shadow-lg transition" />
      </div>
    </div>
  );
};

export default Dashboard;