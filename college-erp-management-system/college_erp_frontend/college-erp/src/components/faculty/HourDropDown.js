import React from "react";

const HourDropdown = ({ value, onChange, label, startTime, isEndTime }) => {
  const minHour = 9;
  const maxHour = 18;
  const parsedStart = startTime ? parseInt(startTime.split(":")[0]) : null;

  // Function to convert 24h -> 12h AM/PM format
  const format12Hour = (hour) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12 < 10 ? "0" + hour12 : hour12}:00 ${suffix}`;
  };

  const options = [];
  for (let hour = minHour; hour <= maxHour; hour++) {
    const isBeforeStart =
      isEndTime && parsedStart !== null && hour <= parsedStart;

    const value24 = `${String(hour).padStart(2, "0")}:00`;

    options.push(
      <option key={value24} value={value24} disabled={isBeforeStart}>
        {format12Hour(hour)}
      </option>
    );
  }

  return (
    <div>
      {label && (
        <label className="block mb-1 text-base text-white">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 border border-emerald-500 rounded bg-gray-700 text-white"
      >
        <option value="">Select Time</option>
        {options}
      </select>
    </div>
  );
};

export default HourDropdown;




