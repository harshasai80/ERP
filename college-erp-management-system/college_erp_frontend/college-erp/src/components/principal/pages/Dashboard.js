import React from 'react';
import SummaryCard from '../components/cards/SummaryCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Principal Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Faculty" value="45" icon="👨‍🏫" />
        <SummaryCard title="Total Students" value="1,250" icon="👨‍🎓" />
        <SummaryCard title="Departments" value="8" icon="🏢" />
        <SummaryCard title="Attendance Rate" value="92%" icon="📊" />
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
        <ul className="list-none p-0 m-0">
          <li className="py-2 border-b border-gray-200">New academic report available for Science Department</li>
          <li className="py-2 border-b border-gray-200">Mathematics Department meeting scheduled for tomorrow</li>
          <li className="py-2 border-b border-gray-200">5 student absence reports require review</li>
          <li className="py-2">End of semester evaluation due in 2 weeks</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
