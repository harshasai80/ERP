import React from "react";

export const DatePicker = ({ label, selected, onChange }) => {
  const handleDateChange = (event) => {
    onChange(new Date(event.target.value));
  };

  // Safely resolve the selected date — fall back to today if null/undefined/invalid
  const safeDate = selected instanceof Date && !isNaN(selected) ? selected : new Date();

  return (
    <div className="flex flex-col gap-1">
      <label className="text-white text-base font-medium pl-1">{label}</label>
      <input
        type="date"
        value={safeDate.toISOString().split("T")[0]}
        onChange={handleDateChange}
        className="bg-emerald-100 text-emerald-900 rounded-lg px-3 py-2 shadow-sm border border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
      />
    </div>
  );
};




