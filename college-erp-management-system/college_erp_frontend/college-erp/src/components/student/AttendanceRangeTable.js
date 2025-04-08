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
    "12 PM - 1 PM",
    "1 PM - 2 PM",
    "2 PM - 3 PM",
    "3 PM - 4 PM",
    "4 PM - 5 PM",
  ];

  const sortedDates = Object.keys(formattedData).sort();

  if (!attendanceData || attendanceData.length === 0) {
    return (
      <p className="text-gray-400 text-center py-4">
        No attendance data available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mt-6 rounded-2xl border border-gray-700 shadow-lg">
      <table className="min-w-[800px] w-full text-sm sm:text-base bg-gray-900 text-white border border-gray-700 rounded-xl">
        <thead className="bg-emerald-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left sticky left-0 bg-emerald-700 z-10">
              Date
            </th>
            {sessions.map((session, index) => (
              <th
                key={index}
                className="px-4 py-3 text-center whitespace-nowrap"
              >
                {session}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedDates.map((date, index) => {
            const sessionData = formattedData[date];
            return (
              <tr
                key={index}
                className="even:bg-gray-800 odd:bg-gray-900 border-t border-gray-700"
              >
                <td className="px-4 py-3 text-emerald-300 font-semibold sticky left-0 bg-inherit backdrop-blur-sm z-10 whitespace-nowrap">
                  {formatDate(date)}
                </td>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sessionNum) => {
                  const status = sessionData[sessionNum];
                  return (
                    <td
                      key={sessionNum}
                      className={`px-4 py-3 text-center font-medium whitespace-nowrap rounded ${
                        status === "present"
                          ? "text-green-400 bg-green-900"
                          : status === "absent"
                          ? "text-red-400 bg-red-900"
                          : "text-gray-400 bg-gray-800"
                      }`}
                    >
                      {status
                        ? status.charAt(0).toUpperCase() + status.slice(1)
                        : "-"}
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
    return (
      <p className="text-gray-400 text-center py-4">
        No attendance data available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mt-6 rounded-2xl border border-gray-700 shadow-lg">
      <table className="min-w-[500px] w-full text-sm sm:text-base bg-gray-900 text-white border border-gray-700 rounded-xl">
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
                  : record.status === "absent"
                  ? "bg-red-900"
                  : "bg-gray-800"
              }`}
            >
              <td className="px-4 py-3 whitespace-nowrap">
                {getSessionTime(record.session)}
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

// Helper to convert session number to time
const getSessionTime = (session) => {
  const map = {
    1: "9 AM - 10 AM",
    2: "10 AM - 11 AM",
    3: "11 AM - 12 PM",
    4: "12 PM - 1 PM",
    5: "1 PM - 2 PM",
    6: "2 PM - 3 PM",
    7: "3 PM - 4 PM",
    8: "4 PM - 5 PM",
  };
  return map[String(session)] || "Unknown Session";
};
