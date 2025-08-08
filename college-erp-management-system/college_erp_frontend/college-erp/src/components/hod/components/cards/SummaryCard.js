// src/components/cards/SummaryCard.js

const SummaryCard = ({ title, value, icon, className = '' }) => {
  return (
    <div className={`bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center text-white ${className}`}>
      <div className="w-12 h-12 flex items-center justify-center bg-emerald-600 rounded-full mr-6 text-xl">
        {icon}
      </div>
      <div className="card-content">
        <h3 className="text-sm text-gray-300 mb-1">{title}</h3>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;