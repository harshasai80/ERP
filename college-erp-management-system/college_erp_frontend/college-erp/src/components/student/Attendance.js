import React, { useState } from "react";
import { format } from "date-fns";
import { DatePicker } from "./Date-picker";
import { useLocation } from "react-router-dom";
import { AttendanceTable, AttendanceRangeTable } from "./AttendanceRangeTable";
import { motion } from "framer-motion";
import Api from "../../Api";

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
    location.state?.student?.registrationNumber;

  const handleDateChange = (date) => setDate(date);
  const handleStartDateChange = (date) =>
    setDateRange((prev) => ({ ...prev, start: date }));
  const handleEndDateChange = (date) =>
    setDateRange((prev) => ({ ...prev, end: date }));

  const handleSearch = async () => {
    if (!registerNo) {
      alert("Student data not found!");
      return;
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
        const parsedSessions = Array.isArray(JSON.parse(data.data[0]?.sessions))
          ? JSON.parse(data.data[0]?.sessions)
          : [];

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
    <div className="p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white rounded-lg">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">
          Student Attendance Dashboard
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <motion.div 
          className="bg-gradient-to-tr from-gray-800 to-gray-700 rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-lg font-bold text-emerald-300 mb-4 flex items-center">
            <span className="mr-2">📅</span> Attendance Lookup
          </h3>

          {/* Mode Selection Tabs */}
          <div className="flex mb-4 space-x-3">
            {["range", "single"].map((m) => (
              <motion.button
                key={m}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                  mode === m
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-emerald-300/30"
                }`}
                onClick={() => {
                  setMode(m);
                  setAttendanceData([]);
                }}
                whileHover={{ scale: 1.05 }}
              >
                {m === "range" ? "📆 Date Range" : "📍 Single Date"}
              </motion.button>
            ))}
          </div>

          {/* Date Pickers */}
          <div className="mb-4">
            {mode === "range" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePicker
                  label="Start Date"
                  selected={dateRange.start}
                  onChange={handleStartDateChange}
                />
                <DatePicker
                  label="End Date"
                  selected={dateRange.end}
                  onChange={handleEndDateChange}
                />
              </div>
            ) : (
              <DatePicker
                label="Select Date"
                selected={date}
                onChange={handleDateChange}
                className="w-full"
              />
            )}
          </div>

          {/* Search Button */}
          <motion.button
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium flex items-center justify-center shadow-md w-full border border-emerald-300/50 text-sm"
            onClick={handleSearch}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">🔍</span> {loading ? "Searching..." : "Search Records"}
          </motion.button>
        </motion.div>

        {/* Attendance Table Section */}
        <motion.div 
          className="bg-gradient-to-tr from-gray-800 to-gray-700 rounded-2xl shadow-lg p-6 overflow-auto max-h-96"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-lg font-bold text-emerald-300 mb-4 flex items-center">
            <span className="mr-2">📊</span> Attendance Records
          </h3>
          
          {attendanceData.length > 0 ? (
            mode === "single" ? (
              <AttendanceTable attendanceData={attendanceData} />
            ) : (
              <AttendanceRangeTable attendanceData={attendanceData} />
            )
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No attendance data to display</p>
              <p className="text-sm mt-2">Select a date and click search</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Attendance;