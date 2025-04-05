import React, { useEffect, useState } from "react";

// This component displays the attendance range table
export const AttendanceRangeTable = ({ attendanceData }) => {
  const [formattedData, setFormattedData] = useState({});

  useEffect(() => {
    const transformedData = {};

    attendanceData.forEach(({ attendanceDate, sessions }) => {
      if (!transformedData[attendanceDate]) {
        transformedData[attendanceDate] = {};
      }

      sessions.forEach(({ session, status }) => {
        transformedData[attendanceDate][session] = status;
      });
    });
    setFormattedData(transformedData);
  }, [attendanceData]);

  const sessions = [
    "9 AM - 10 AM",
    "10 AM - 11 AM",
    "11 AM - 12 PM",
    "1 PM - 2 PM",
    "2 PM - 3 PM",
    "3 PM - 4 PM",
    "4 PM - 5 PM",
  ];

  const sortedDates = Object.keys(formattedData).sort();

  if (!attendanceData || attendanceData.length === 0) {
    return <p className="text-gray-400 text-center">No attendance data available.</p>;
  }

  return (
    <div className="overflow-x-auto mt-6 rounded-xl border border-gray-700 shadow-lg">
      <table className="w-full min-w-max text-sm bg-gray-900 text-white border border-gray-700">
        <thead className="bg-emerald-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left">Date</th>
            {sessions.map((session, index) => (
              <th key={index} className="px-4 py-3 text-center">
                {session}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedDates.map((date, index) => {
            const sessionData = formattedData[date];
            return (
              <tr key={index} className="even:bg-gray-800 odd:bg-gray-900">
                <td className="px-4 py-3 text-emerald-300 font-semibold">{formatDate(date)}</td>
                {[1, 2, 3, 4, 5, 6, 7].map((sessionNum) => {
                  const status = sessionData[sessionNum];
                  return (
                    <td
                      key={sessionNum}
                      className={`px-4 py-3 text-center font-medium ${
                        status === "present"
                          ? "text-green-400 bg-green-900"
                          : status === "absent"
                          ? "text-red-400 bg-red-900"
                          : "text-gray-400 bg-gray-800"
                      }`}
                    >
                      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "-"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to format the date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// This component displays the session-wise attendance table
export const AttendanceTable = ({ attendanceData }) => {
  if (!attendanceData || attendanceData.length === 0) {
    return <p className="text-gray-400 text-center">No attendance data available.</p>;
  }

  return (
    <div className="overflow-x-auto mt-6 rounded-xl border border-gray-700 shadow-lg">
      <table className="w-full min-w-max text-sm bg-gray-900 text-white border border-gray-700">
        <thead className="bg-emerald-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left">Session</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((record, index) => (
            <tr
              key={index}
              className={`${
                record.status === "present"
                  ? "bg-green-900"
                  : "bg-red-900"
              }`}
            >
              <td className="px-4 py-3">
                {(() => {
                  switch (String(record.session)) {
                    case "1":
                      return "9 AM - 10 AM";
                    case "2":
                      return "10 AM - 11 AM";
                    case "3":
                      return "11 AM - 12 PM";
                    case "4":
                      return "12 PM - 1 PM";
                    case "5":
                      return "1 PM - 2 PM";
                    case "6":
                      return "2 PM - 3 PM";
                    case "7":
                      return "3 PM - 4 PM";
                    case "8":
                      return "4 PM - 5 PM";
                    default:
                      return "Unknown Session";
                  }
                })()}
              </td>
              <td
                className={`px-4 py-3 font-medium ${
                  record.status === "present"
                    ? "text-green-300"
                    : "text-red-300"
                }`}
              >
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
