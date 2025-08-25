import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { DatePicker } from "./Date-picker";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Api from "../../Api";

// Helper function to format the date
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper to convert session number to time
const getSessionTime = (session) => {
  const map = {
    1: "9:00 AM - 10:00 AM",
    2: "10:00 AM - 11:00 AM",
    3: "11:00 AM - 12:00 PM",
    4: "12:00 PM - 1:00 PM",
    5: "1:00 PM - 2:00 PM",
    6: "2:00 PM - 3:00 PM",
    7: "3:00 PM - 4:00 PM",
    8: "4:00 PM - 5:00 PM",
  };
  return map[String(session)] || "Unknown Session";
};

// Combined Attendance Table Component
const AttendanceTable = ({ attendanceData, mode, selectedDate }) => {
  const [formattedData, setFormattedData] = useState({});

  useEffect(() => {
    if (mode === "range") {
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
    }
  }, [attendanceData, mode]);

  const sessions = [
    "9-10 AM",
    "10-11 AM",
    "11-12 PM",
    "12-1 PM",
    "1-2 PM",
    "2-3 PM",
    "3-4 PM",
    "4-5 PM",
  ];

  // Check if data is empty - different logic for single vs range
  const isEmpty =
    mode === "range"
      ? !attendanceData || attendanceData.length === 0
      : !attendanceData || attendanceData.length === 0;

  if (isEmpty) {
    return (
      <div className="text-gray-400 text-center py-12">
        <div className="mb-6">
          <div className="bg-gray-700/30 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl text-gray-400">📋</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No Records Found
        </h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          {mode === "range"
            ? 'Select a date range and click "Search Records" to view your attendance data'
            : 'Select a date and click "Search Records" to view your attendance data'}
        </p>
      </div>
    );
  }

  // Range Mode - Show multiple dates
  if (mode === "range") {
    const sortedDates = Object.keys(formattedData).sort();

    return (
      <div className="mt-8">
        <div className="flex items-center mb-6 pb-4 border-b border-gray-600/50">
          <div className="bg-blue-600/20 p-2 rounded-lg mr-3">
            <span className="text-lg">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-blue-300">
            Attendance Records ({sortedDates.length} days)
          </h3>
        </div>

        {/* Mobile Card View for Range */}
        <div className="block md:hidden space-y-4">
          {sortedDates.map((date, dateIndex) => {
            const sessionData = formattedData[date];
            return (
              <div
                key={dateIndex}
                className="bg-gray-800/50 rounded-xl border border-gray-600/30 overflow-hidden shadow-lg">
                <div className="bg-emerald-600/20 px-4 py-3 border-b border-gray-600/30">
                  <h4 className="text-white font-semibold text-base">
                    {formatDate(date)}
                  </h4>
                </div>
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sessionNum) => {
                    const status = sessionData[sessionNum];
                    return (
                      <div
                        key={sessionNum}
                        className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-700/30">
                        <span className="text-gray-300 font-medium text-sm">
                          {sessions[sessionNum - 1]}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            status === "present"
                              ? "text-green-300 bg-green-900/50 border border-green-700/50"
                              : status === "absent"
                              ? "text-red-300 bg-red-900/50 border border-red-700/50"
                              : "text-gray-400 bg-gray-700/50 border border-gray-600/50"
                          }`}>
                          {status
                            ? status.charAt(0).toUpperCase() + status.slice(1)
                            : "N/A"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View for Range */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-600/30">
          <table className="min-w-full text-sm bg-gray-800/30 text-white rounded-xl">
            <thead className="bg-emerald-600/20 text-white">
              <tr>
                <th className="px-4 py-3 text-left sticky left-0 bg-emerald-600/20 z-10 min-w-[120px]">
                  Date
                </th>
                {sessions.map((session, index) => (
                  <th
                    key={index}
                    className="px-3 py-3 text-center whitespace-nowrap min-w-[80px]">
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
                    className="even:bg-gray-700/20 odd:bg-gray-800/20 border-t border-gray-600/30 hover:bg-gray-600/20 transition-colors">
                    <td className="px-4 py-3 text-emerald-300 font-semibold sticky left-0 bg-inherit backdrop-blur-sm z-10 whitespace-nowrap">
                      {formatDate(date)}
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sessionNum) => {
                      const status = sessionData[sessionNum];
                      return (
                        <td
                          key={sessionNum}
                          className={`px-3 py-3 text-center font-medium whitespace-nowrap ${
                            status === "present"
                              ? "text-green-400"
                              : status === "absent"
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}>
                          <span
                            className={`inline-block w-full py-1 px-2 rounded ${
                              status === "present"
                                ? "bg-green-900/30"
                                : status === "absent"
                                ? "bg-red-900/30"
                                : "bg-gray-700/30"
                            }`}>
                            {status
                              ? status.charAt(0).toUpperCase() + status.slice(1)
                              : "-"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Single Mode - Show single date in horizontal table format
  const allSessions = [1, 2, 3, 4, 5, 6, 7, 8];
  const sessionStatusMap = {};

  // Create a map of session statuses from the attendance data
  // attendanceData is an array of objects like [{session: 1, status: "present"}, ...]
  if (Array.isArray(attendanceData)) {
    attendanceData.forEach((record) => {
      sessionStatusMap[record.session] = record.status;
    });
  }

  return (
    <div className="mt-8">
      <div className="flex items-center mb-6 pb-4 border-b border-gray-600/50">
        <div className="bg-blue-600/20 p-2 rounded-lg mr-3">
          <span className="text-lg">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-blue-300">
          Daily Session Records
        </h3>
      </div>

      {/* Mobile Card View for Single */}
      <div className="block md:hidden space-y-3">
        {allSessions.map((sessionNum) => {
          const status = sessionStatusMap[sessionNum] || null;
          return (
            <div
              key={sessionNum}
              className={`rounded-xl border overflow-hidden shadow-lg ${
                status === "present"
                  ? "bg-green-900/10 border-green-700/30"
                  : status === "absent"
                  ? "bg-red-900/10 border-red-700/30"
                  : "bg-gray-800/30 border-gray-600/30"
              }`}>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Session</p>
                    <p className="text-white font-semibold text-base">
                      {getSessionTime(sessionNum)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-sm font-medium">Status</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-bold mt-1 ${
                        status === "present"
                          ? "text-green-300 bg-green-900/50 border border-green-700/50"
                          : status === "absent"
                          ? "text-red-300 bg-red-900/50 border border-red-700/50"
                          : "text-gray-400 bg-gray-700/50 border border-gray-600/50"
                      }`}>
                      {status
                        ? status.charAt(0).toUpperCase() + status.slice(1)
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View for Single - Horizontal like Range */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-600/30">
        <table className="min-w-full text-sm bg-gray-800/30 text-white rounded-xl">
          <thead className="bg-emerald-600/20 text-white">
            <tr>
              <th className="px-4 py-3 text-left sticky left-0 bg-emerald-600/20 z-10 min-w-[120px]">
                Date
              </th>
              {sessions.map((session, index) => (
                <th
                  key={index}
                  className="px-3 py-3 text-center whitespace-nowrap min-w-[80px]">
                  {session}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-800/20 border-t border-gray-600/30 hover:bg-gray-600/20 transition-colors">
              <td className="px-4 py-3 text-emerald-300 font-semibold sticky left-0 bg-inherit backdrop-blur-sm z-10 whitespace-nowrap">
                {selectedDate
                  ? formatDate(format(selectedDate, "yyyy-MM-dd"))
                  : formatDate(format(new Date(), "yyyy-MM-dd"))}
              </td>
              {allSessions.map((sessionNum) => {
                const status = sessionStatusMap[sessionNum] || null;
                return (
                  <td
                    key={sessionNum}
                    className={`px-3 py-3 text-center font-medium whitespace-nowrap ${
                      status === "present"
                        ? "text-green-400"
                        : status === "absent"
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}>
                    <span
                      className={`inline-block w-full py-1 px-2 rounded ${
                        status === "present"
                          ? "bg-green-900/30"
                          : status === "absent"
                          ? "bg-red-900/30"
                          : "bg-gray-700/30"
                      }`}>
                      {status
                        ? status.charAt(0).toUpperCase() + status.slice(1)
                        : "-"}
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Attendance Component
const Attendance = () => {
  const [mode, setMode] = useState("single");
  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const registerNo =
    location.state?.student?.data?.registrationNumber ||
    location.state?.student?.registrationNumber ||
    JSON.parse(localStorage.getItem("student"))?.registrationNumber;

  const handleDateChange = (date) => setDate(date);
  const handleStartDateChange = (date) => {
    setDateRange((prev) => {
      const newRange = { ...prev, start: date };
      // If end date is more than 15 days from start, adjust it
      const diffTime = Math.abs(newRange.end - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 15) {
        const newEndDate = new Date(date);
        newEndDate.setDate(newEndDate.getDate() + 15);
        newRange.end = newEndDate;
      }
      return newRange;
    });
  };

  const handleEndDateChange = (date) => {
    setDateRange((prev) => {
      const newRange = { ...prev, end: date };
      // If end date is more than 15 days from start, adjust start
      const diffTime = Math.abs(date - newRange.start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 15) {
        const newStartDate = new Date(date);
        newStartDate.setDate(newStartDate.getDate() - 15);
        newRange.start = newStartDate;
      }
      return newRange;
    });
  };

  const handleSearch = async () => {
    if (!registerNo) {
      alert("Student data not found!");
      return;
    }

    // Validate date range for range mode
    if (mode === "range") {
      const diffTime = Math.abs(dateRange.end - dateRange.start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 15) {
        alert(
          "Date range cannot exceed 15 days. Please select a shorter range."
        );
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "range") {
        const response = await Api.get(`/students/${registerNo}/range`, {
          params: {
            startDate: format(dateRange.start, "yyyy-MM-dd"),
            endDate: format(dateRange.end, "yyyy-MM-dd"),
          },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const data = response.data;
        const fetchedAttendanceData = data.data.map(
          ({ attendanceDate, sessions }) => ({
            attendanceDate,
            sessions: JSON.parse(sessions),
          })
        );

        setAttendanceData(fetchedAttendanceData);
      } else {
        const response = await Api.get(`/students/${registerNo}/date`, {
          params: { date: format(date, "yyyy-MM-dd") },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const data = response.data;
        // Make sure we're getting the sessions data correctly
        const sessionData = data.data[0]?.sessions;
        const parsedSessions = sessionData ? JSON.parse(sessionData) : [];

        console.log("Single date response:", data); // Debug log
        console.log("Parsed sessions:", parsedSessions); // Debug log

        setAttendanceData(parsedSessions);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401)
          alert("Unauthorized: Invalid credentials.");
        else if (error.response.status === 404)
          alert("Attendance not found. Enter a valid date.");
        else
          alert(`Error ${error.response.status}: ${error.response.statusText}`);
      } else {
        alert("Network error or server not responding.");
      }
      console.error(
        "Error fetching attendance:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 py-4 sm:px-6 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
              Attendance Dashboard
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-2">
              Track your attendance records
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Both Single and Range Mode - Single Unified Container */}
        <motion.div
          className="w-full max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/30 overflow-hidden">
            {/* Header Section */}
            <div className="p-6 sm:p-8 border-b border-gray-600/30 bg-gradient-to-r from-gray-800/50 to-gray-700/50">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-emerald-600/20 p-3 rounded-full mr-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-emerald-300">
                  Attendance Lookup
                </h2>
              </div>

              {/* Mode Selection Tabs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
                {[
                  { key: "single", icon: "📍", label: "Single Date" },
                  { key: "range", icon: "📆", label: "Date Range" },
                ].map(({ key, icon, label }) => (
                  <motion.button
                    key={key}
                    className={`flex-1 px-6 py-4 rounded-xl font-medium text-base transition-all duration-300 border-2 ${
                      mode === key
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20"
                        : "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:border-gray-500"
                    }`}
                    onClick={() => {
                      setMode(key);
                      setAttendanceData([]);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-xl">{icon}</span>
                      <span>{label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Date Selection */}
              <div className="mb-8">
                {mode === "single" ? (
                  <div className="max-w-sm mx-auto space-y-2">
                    <label className="text-sm font-medium text-gray-300 block text-center">
                      Select Date
                    </label>
                    <DatePicker
                      selected={date}
                      onChange={handleDateChange}
                      className="w-full"
                    />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block text-center">
                          Start Date
                        </label>
                        <DatePicker
                          selected={dateRange.start}
                          onChange={handleStartDateChange}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block text-center">
                          End Date
                        </label>
                        <DatePicker
                          selected={dateRange.end}
                          onChange={handleEndDateChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mt-2">
                        Maximum range: 15 days
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <motion.button
                  className={`px-10 py-4 rounded-xl font-semibold text-base flex items-center justify-center space-x-3 shadow-lg transition-all duration-300 min-w-[200px] ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-emerald-500/30"
                  } border border-emerald-400/30`}
                  onClick={handleSearch}
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.05 } : {}}
                  whileTap={!loading ? { scale: 0.95 } : {}}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🔍</span>
                      <span>Search Records</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Results Section */}
            <div className="p-6 sm:p-8">
              <motion.div
                key={attendanceData.length}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}>
                <AttendanceTable
                  attendanceData={attendanceData}
                  mode={mode}
                  selectedDate={date}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Attendance;
