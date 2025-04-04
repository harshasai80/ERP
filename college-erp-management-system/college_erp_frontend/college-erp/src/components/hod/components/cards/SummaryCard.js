// src/components/cards/SummaryCard.js
import React from 'react';

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center mb-4">
      <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-4">
        {icon}
      </div>
      <div className="card-content">
        <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
