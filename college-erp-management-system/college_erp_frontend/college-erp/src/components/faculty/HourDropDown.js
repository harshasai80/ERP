import React from "react";

const lunchBreaks = {
  1: { start: 12, end: 13 },
  2: { start: 13, end: 14 },
  3: { start: 13, end: 14 },
  4: { start: 13, end: 14 },
  5: { start: 13, end: 14 },
  6: { start: 13, end: 14 },
};

const HourDropdown = ({
  value,
  onChange,
  label,
  startTime,
  isEndTime,
  semester,
}) => {
  const now = new Date();
  const currentHour = now.getHours();
  const minHour = 9;

  const lunch = lunchBreaks[semester] || { start: 13, end: 14 };
  const parsedStart = startTime ? parseInt(startTime.split(":")[0]) : null;

  const options = [];
  for (let hour = minHour; hour <= 18; hour++) {
    const isFuture = hour > currentHour;
    const isLunch = hour >= lunch.start && hour < lunch.end;
    const isBeforeStart =
      isEndTime && parsedStart !== null && hour <= parsedStart;

    const time = isLunch
      ? `${String(hour).padStart(2, "0")}:00`
      : `${String(hour).padStart(2, "0")}:00`;

    // Only disable lunch for startTime
    const isDisabled = isFuture || isBeforeStart || (!isEndTime && isLunch);

    options.push(
      <option key={time} value={time} disabled={isDisabled}>
        {time}
      </option>
    );
  }

  return (
    <div>
      {label && (
        <label className="block mb-1 text-sm text-white">{label}</label>
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
