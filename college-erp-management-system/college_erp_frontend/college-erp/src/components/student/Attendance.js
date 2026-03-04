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
const AttendanceTable = ({ attendanceData, mode, selectedDate, department, semester, summaryData, grandTotalStats }) => {
  const [formattedData, setFormattedData] = useState({});
  const [subjectsMap, setSubjectsMap] = useState({});

  useEffect(() => {
    if (department && semester) {
      Api.get(`/subjects/department/${department}/semester/${semester}`)
        .then(res => {
          const map = {};
          res.data?.data?.forEach(s => {
            map[s.subjectId] = s.subjectName;
          });
          setSubjectsMap(map);
        })
        .catch(err => console.error("Error fetching subjects map:", err));
    }
  }, [department, semester]);

  useEffect(() => {
    if (mode === "range") {
      const transformedData = {};
      attendanceData.forEach(({ attendanceDate, sessions }) => {
        if (!transformedData[attendanceDate]) {
          transformedData[attendanceDate] = {};
        }
        const sessionsArray = Array.isArray(sessions) ? sessions : (typeof sessions === 'string' ? JSON.parse(sessions) : []);
        sessionsArray.forEach(({ session, status }) => {
          transformedData[attendanceDate][session] = status;
        });
      });
      setFormattedData(transformedData);
    }
  }, [attendanceData, mode]);

  const calculateSummary = () => {
    const summaryMap = {};
    let grandAttended = 0;
    let grandTotal = 0;

    // We assume attendanceData in this component is the filtered/searched data
    // But if we want a cumulative summary, we should use allAttendanceData from the parent
    // However, the screenshot shows it at the top, likely overall.
    // To match the screenshot, I'll use the data provided to this component.

    // Actually, I'll define this component to take 'summaryData' as a prop instead
    // Or just use the attendanceData if it's the full set.
  };

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
        <h3 className="text-base font-semibold text-gray-300 mb-2">
          No Records Found
        </h3>
        <p className="text-gray-400 text-base max-w-md mx-auto">
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
            <span className="text-base">📊</span>
          </div>
          <h3 className="text-base font-semibold text-blue-300">
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
                className="bg-gray-800/50 rounded-xl border border-gray-600/30 overflow-hidden shadow-lg"
              >
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
                        className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-700/30"
                      >
                        <span className="text-gray-300 font-medium text-base">
                          {sessions[sessionNum - 1]}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-base font-semibold ${status === "present"
                            ? "text-green-300 bg-green-900/50 border border-green-700/50"
                            : status === "absent"
                              ? "text-red-300 bg-red-900/50 border border-red-700/50"
                              : "text-gray-400 bg-gray-700/50 border border-gray-600/50"
                            }`}
                        >
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
          <table className="min-w-full text-base bg-gray-800/30 text-white rounded-xl">
            <thead className="bg-emerald-600/20 text-white">
              <tr>
                <th className="px-4 py-3 text-left sticky left-0 bg-emerald-600/20 z-10 min-w-[120px]">
                  Date
                </th>
                {sessions.map((session, index) => (
                  <th
                    key={index}
                    className="px-3 py-3 text-center whitespace-nowrap min-w-[80px]"
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
                    className="even:bg-gray-700/20 odd:bg-gray-800/20 border-t border-gray-600/30 hover:bg-gray-600/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-emerald-300 font-semibold sticky left-0 bg-inherit backdrop-blur-sm z-10 whitespace-nowrap">
                      {formatDate(date)}
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sessionNum) => {
                      const status = sessionData[sessionNum];
                      return (
                        <td
                          key={sessionNum}
                          className={`px-3 py-3 text-center font-medium whitespace-nowrap ${status === "present"
                            ? "text-green-400"
                            : status === "absent"
                              ? "text-red-400"
                              : "text-gray-400"
                            }`}
                        >
                          <span
                            className={`inline-block w-full py-1 px-2 rounded ${status === "present"
                              ? "bg-green-900/30"
                              : status === "absent"
                                ? "bg-red-900/30"
                                : "bg-gray-700/30"
                              }`}
                          >
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
  const sessionSubjectMap = {};

  // Create a map of session statuses from the attendance data
  if (Array.isArray(attendanceData)) {
    attendanceData.forEach((record) => {
      sessionStatusMap[record.session] = record.status;
      sessionSubjectMap[record.session] = record.subjectId;
    });
  }

  // Summary logic (aggregated from full data if available, or current data)
  const summaryRecords = mode === "range" ? attendanceData : []; // Range mode shows aggregate in some views

  return (
    <div className="mt-8 space-y-12">
      {/* Semester Attendance Summary - MATCHING SCREENSHOT */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <span className="text-base">📊</span>
          </div>
          <h3 className="text-base font-semibold text-emerald-300 classic-heading uppercase tracking-widest">
            Semester Attendance Summary
          </h3>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-600/30 shadow-2xl">
          <table className="min-w-full text-base font-black text-gray-500 uppercase tracking-widest">
            <thead className="bg-[#5c6d8a]/20 text-slate-600">
              <tr>
                <th className="px-6 py-5 text-left border-r border-gray-600/10">Subject Name</th>
                <th className="px-6 py-5 text-center border-r border-gray-600/10">Attended</th>
                <th className="px-6 py-5 text-center border-r border-gray-600/10">Individual Class Attendance Count</th>
                <th className="px-6 py-5 text-center border-r border-gray-600/10">Total Held</th>
                <th className="px-6 py-5 text-center">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800/20">
              {Object.keys(subjectsMap).length > 0 ? (
                Object.entries(subjectsMap).map(([sId, sName], idx) => {
                  const stats = summaryData[sId] || { attended: 0, total: 0 };
                  const percentage = stats.total > 0 ? ((stats.attended / stats.total) * 100).toFixed(1) : "0.0";

                  return (
                    <tr key={idx} className="border-t border-gray-600/10 hover:bg-gray-600/5 transition-colors">
                      <td className="px-6 py-5 border-r border-gray-600/10 text-slate-800 font-black">{sName}</td>
                      <td className="px-6 py-5 text-center border-r border-gray-600/10 text-emerald-600 font-black">{stats.attended}</td>
                      <td className="px-6 py-5 text-center border-r border-gray-600/10 text-blue-600 font-black">{stats.attended}</td>
                      <td className="px-6 py-5 text-center border-r border-gray-600/10 text-emerald-600 font-black">{stats.total}</td>
                      <td className="px-6 py-5 text-center">
                        <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full border border-emerald-500/20 font-black">{percentage}%</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="border-t border-gray-600/20">
                  <td colSpan="5" className="px-6 py-10 text-center italic text-gray-500">Loading academic analytics...</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-emerald-600/10 text-emerald-800">
              <tr className="border-t-2 border-emerald-500/20">
                <td className="px-6 py-5 border-r border-gray-600/10 font-black">Total Aggregate</td>
                <td className="px-6 py-5 text-center border-r border-gray-600/10 font-black">{grandTotalStats.attended}</td>
                <td className="px-6 py-5 text-center border-r border-gray-600/10 font-black">{grandTotalStats.attended}</td>
                <td className="px-6 py-5 text-center border-r border-gray-600/10 font-black">{grandTotalStats.total}</td>
                <td className="px-6 py-5 text-center text-base font-black tracking-tighter">
                  {grandTotalStats.total > 0 ? ((grandTotalStats.attended / grandTotalStats.total) * 100).toFixed(2) : "0.00"}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-600/30">
        <div className="flex items-center mb-6 pb-4">
          <div className="bg-blue-600/20 p-2 rounded-lg mr-3">
            <span className="text-base">📅</span>
          </div>
          <h3 className="text-base font-semibold text-blue-300 classic-heading uppercase tracking-widest">
            Daily Attendance Details
          </h3>
        </div>
      </div>

      {/* Mobile Card View for Single */}
      <div className="block md:hidden space-y-3">
        {allSessions.map((sessionNum) => {
          const status = sessionStatusMap[sessionNum] || null;
          return (
            <div
              key={sessionNum}
              className={`rounded-xl border overflow-hidden shadow-lg ${status === "present"
                ? "bg-green-900/10 border-green-700/30"
                : status === "absent"
                  ? "bg-red-900/10 border-red-700/30"
                  : "bg-gray-800/30 border-gray-600/30"
                }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-300 text-base font-medium">Session</p>
                    <p className="text-white font-semibold text-base">
                      {getSessionTime(sessionNum)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-base font-medium">Status</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-base font-bold mt-1 ${status === "present"
                        ? "text-green-300 bg-green-900/50 border border-green-700/50"
                        : status === "absent"
                          ? "text-red-300 bg-red-900/50 border border-red-700/50"
                          : "text-gray-400 bg-gray-700/50 border border-gray-600/50"
                        }`}
                    >
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

      {/* Desktop Table View for Single - Horizontal matching screenshot */}
      <div className="bg-emerald-600/10 px-6 py-4 rounded-t-xl border border-gray-600/20 border-b-0">
        <h4 className="text-emerald-800 font-black uppercase tracking-widest text-base flex items-center justify-between">
          <span>{selectedDate
            ? formatDate(format(selectedDate, "yyyy-MM-dd"))
            : formatDate(format(new Date(), "yyyy-MM-dd"))}</span>
          <span className="text-base text-emerald-600/50">Daily Attendance Ledger</span>
        </h4>
      </div>
      <div className="hidden md:block overflow-x-auto rounded-b-xl border border-gray-600/20">
        <table className="min-w-full text-base bg-white text-gray-800 border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-500">
              <th className="px-4 py-4 text-left font-black text-base uppercase tracking-widest sticky left-0 bg-gray-100 z-10 border-r border-gray-600/10 min-w-[140px]">
                Time Slots
              </th>
              {sessions.map((session, index) => (
                <th
                  key={index}
                  className="px-4 py-4 text-center font-black text-base uppercase tracking-widest whitespace-nowrap border-r border-gray-600/10 last:border-r-0"
                >
                  {session}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-t border-gray-600/10">
              <td className="px-4 py-4 text-gray-400 font-bold text-base uppercase tracking-widest sticky left-0 bg-white z-10 border-r border-gray-600/10">
                Subject
              </td>
              {allSessions.map((sessionNum) => {
                const subjectId = sessionSubjectMap[sessionNum];
                const subjectName = subjectId ? subjectsMap[subjectId] : null;
                return (
                  <td
                    key={sessionNum}
                    className="px-4 py-4 text-center text-base font-black text-slate-700 whitespace-nowrap border-r border-gray-600/10 last:border-r-0"
                  >
                    {subjectName || "-"}
                  </td>
                );
              })}
            </tr>
            <tr className="bg-white border-t border-gray-600/10">
              <td className="px-4 py-4 text-gray-400 font-bold text-base uppercase tracking-widest sticky left-0 bg-white z-10 border-r border-gray-600/10">
                Status
              </td>
              {allSessions.map((sessionNum) => {
                const status = sessionStatusMap[sessionNum] || null;
                return (
                  <td
                    key={sessionNum}
                    className={`px-4 py-4 text-center whitespace-nowrap border-r border-gray-600/10 last:border-r-0`}
                  >
                    <span
                      className={`inline-block w-full py-1.5 px-3 rounded text-base font-black uppercase tracking-widest ${status === "present"
                        ? "bg-green-500/10 text-green-600 border border-green-500/20"
                        : status === "absent"
                          ? "bg-red-500/10 text-red-600 border border-red-500/20"
                          : "bg-gray-100 text-gray-400"
                        }`}
                    >
                      {status || "-"}
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
  const [summaryData, setSummaryData] = useState({});
  const [grandTotalStats, setGrandTotalStats] = useState({ attended: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const studentData =
    location.state?.student?.data ||
    location.state?.student ||
    JSON.parse(localStorage.getItem("student"));

  const registerNo = studentData?.registrationNumber;
  const department = studentData?.department;
  const semester = studentData?.sem;

  const handleDateChange = (date) => setDate(date);
  const handleStartDateChange = (date) => {
    setDateRange((prev) => {
      const newRange = { ...prev, start: date };
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

    if (mode === "range") {
      const diffTime = Math.abs(dateRange.end - dateRange.start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 15) {
        alert("Date range cannot exceed 15 days.");
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
        const sessionData = data.data[0]?.sessions;
        const parsedSessions = sessionData ? JSON.parse(sessionData) : [];
        setAttendanceData(parsedSessions);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFullSummary = async () => {
      if (!registerNo) return;
      try {
        const response = await Api.get("/students/all-attendance", {
          params: { registerNo }
        });
        const allData = response.data?.data || [];

        const summary = {};
        let gAtt = 0;
        let gTot = 0;

        allData.forEach(day => {
          try {
            const sessions = JSON.parse(day.sessions || "[]");
            sessions.forEach(s => {
              const sId = s.subjectId;
              if (!sId) return;
              if (!summary[sId]) summary[sId] = { attended: 0, total: 0 };
              summary[sId].total += 1;
              gTot += 1;
              if (s.status === "present") {
                summary[sId].attended += 1;
                gAtt += 1;
              }
            });
          } catch (e) { }
        });

        setSummaryData(summary);
        setGrandTotalStats({ attended: gAtt, total: gTot });
      } catch (err) {
        console.error("Failed to fetch full summary", err);
      }
    };
    fetchFullSummary();
  }, [registerNo]);

  return (
    <div className="min-h-screen bg-transparent text-gray-900">
      {/* Dynamic Header Section */}
      <div className="mb-12 text-center">
        <h2 className="text-base font-bold text-emerald-600 uppercase tracking-[0.4em] mb-4">
          Academic Accountability
        </h2>
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent classic-heading">
          Attendance <span className="font-light italic text-gray-400">Ledger</span>
        </h1>
        <div className="w-24 h-1 bg-emerald-500 mx-auto mt-6 rounded-full opacity-20" />
      </div>

      <div className="px-4 py-2 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="lux-card glass-gold overflow-hidden">
            {/* Lookup Controls */}
            <div className="p-8 sm:p-12 border-b border-emerald-500/10">
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {[
                  { key: "single", icon: "📍", label: "Daily View" },
                  { key: "range", icon: "📆", label: "Periodic View" },
                ].map(({ key, icon, label }) => (
                  <button
                    key={key}
                    className={`flex-1 px-8 py-5 rounded-2xl font-bold text-base uppercase tracking-widest transition-all duration-500 border-2 active:scale-95 ${mode === key
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-white border-gray-100 text-gray-500 hover:border-emerald-500/30 hover:text-emerald-600 shadow-sm"
                      }`}
                    onClick={() => {
                      setMode(key);
                      setAttendanceData([]);
                    }}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-base">{icon}</span>
                      <span>{label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Date Filters */}
              <div className="mb-10 p-8 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10">
                {mode === "single" ? (
                  <div className="max-w-md mx-auto space-y-4">
                    <label className="text-base font-bold text-gray-400 block text-center uppercase tracking-widest">
                      Select Specific Academic Date
                    </label>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                      <DatePicker
                        selected={date}
                        onChange={handleDateChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    <div className="space-y-4">
                      <label className="text-base font-bold text-gray-400 block text-center uppercase tracking-widest">
                        Commencement Date
                      </label>
                      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 uppercase">
                        <DatePicker
                          selected={dateRange.start}
                          onChange={handleStartDateChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-base font-bold text-gray-400 block text-center uppercase tracking-widest">
                        Conclusion Date
                      </label>
                      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 uppercase">
                        <DatePicker
                          selected={dateRange.end}
                          onChange={handleEndDateChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="flex justify-center">
                <button
                  className={`px-12 py-5 rounded-2xl font-bold text-base uppercase tracking-[0.2em] flex items-center justify-center space-x-4 transition-all duration-500 active:scale-95 ${loading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-black text-white shadow-xl"
                    }`}
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                      <span>Consulting Archives...</span>
                    </>
                  ) : (
                    <>
                      <span>🔍 Inquiry Register</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Results */}
            <div className="p-8 sm:p-12">
              <motion.div
                key={attendanceData.length + Object.keys(summaryData).length}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <AttendanceTable
                  attendanceData={attendanceData}
                  mode={mode}
                  selectedDate={date}
                  department={department}
                  semester={semester}
                  summaryData={summaryData}
                  grandTotalStats={grandTotalStats}
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




