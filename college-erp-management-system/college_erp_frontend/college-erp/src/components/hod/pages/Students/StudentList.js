import React, { useState, useMemo, useEffect, useCallback } from "react";
import Api from "../../../../Api";
import AddStudentsTab from "../../components/tabs/AddStudentsTab";
import DragDropCSVUpload from "../../../DragDropFileUpload";
import EditStudentModal from "./EditStudentModal";

/* ----------------- Helpers ----------------- */
const toYMD = (d) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const da = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
};

const formatPrettyDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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

/* ----------------- AttendanceTable ----------------- */
const AttendanceTable = ({ attendanceData, mode, selectedDate }) => {
  const [formattedData, setFormattedData] = useState({});
  const sessions = [
    "9-10 AM",
    "10-11 AM",
    "11-12 AM",
    "12-1 PM",
    "1-2 PM",
    "2-3 PM",
    "3-4 PM",
    "4-5 PM",
  ];

  useEffect(() => {
    if (mode === "range") {
      const transformed = {};
      (Array.isArray(attendanceData) ? attendanceData : []).forEach(
        ({ attendanceDate, sessions }) => {
          if (!transformed[attendanceDate]) transformed[attendanceDate] = {};
          (Array.isArray(sessions) ? sessions : []).forEach(
            ({ session, status }) => {
              transformed[attendanceDate][session] = status;
            }
          );
        }
      );
      setFormattedData(transformed);
    }
  }, [attendanceData, mode]);

  const isEmpty = !attendanceData || attendanceData.length === 0;

  if (isEmpty) {
    return (
      <div className="text-gray-400 text-center py-8">
        <div className="mb-4">
          <div className="bg-gray-700/30 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl text-gray-400">📋</span>
          </div>
        </div>
        <h3 className="text-base font-semibold text-gray-300 mb-1">
          No Records Found
        </h3>
        <p className="text-gray-400 text-base">
          No attendance data available for the selected date(s).
        </p>
      </div>
    );
  }

  if (mode === "range") {
    const sortedDates = Object.keys(formattedData).sort();
    return (
      <div className="mt-4">
        {/* Mobile cards */}
        <div className="block md:hidden space-y-3">
          {sortedDates.map((date) => {
            const sessionData = formattedData[date];
            return (
              <div
                key={date}
                className="bg-gray-800/50 rounded-xl border border-gray-600/30 overflow-hidden shadow-lg">
                <div className="bg-emerald-600/20 px-4 py-3 border-b border-gray-600/30">
                  <h4 className="text-white font-semibold text-base">
                    {formatPrettyDate(date)}
                  </h4>
                </div>
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sNum) => {
                    const status = sessionData[sNum];
                    return (
                      <div
                        key={sNum}
                        className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-700/30">
                        <span className="text-gray-300 font-medium text-base">
                          {sessions[sNum - 1]}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-base font-semibold ${status === "present"
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

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-600/30">
          <table className="min-w-full text-base bg-gray-800/30 text-white rounded-xl">
            <thead className="bg-emerald-600/20 text-white">
              <tr>
                <th className="px-4 py-3 text-left sticky left-0 bg-emerald-600/20 z-10 min-w-[120px]">
                  Date
                </th>
                {sessions.map((s, i) => (
                  <th
                    key={i}
                    className="px-3 py-3 text-center whitespace-nowrap min-w-[80px]">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedDates.map((date) => {
                const sessionData = formattedData[date];
                return (
                  <tr
                    key={date}
                    className="even:bg-gray-700/20 odd:bg-gray-800/20 border-t border-gray-600/30 hover:bg-gray-600/20">
                    <td className="px-4 py-3 text-emerald-300 font-semibold sticky left-0 bg-inherit backdrop-blur-sm z-10 whitespace-nowrap">
                      {formatPrettyDate(date)}
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sNum) => {
                      const status = sessionData[sNum];
                      return (
                        <td
                          key={sNum}
                          className={`px-3 py-3 text-center font-medium whitespace-nowrap ${status === "present"
                            ? "text-green-400"
                            : status === "absent"
                              ? "text-red-400"
                              : "text-gray-400"
                            }`}>
                          <span
                            className={`inline-block w-full py-1 px-2 rounded ${status === "present"
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

  // Single mode
  const allSessions = [1, 2, 3, 4, 5, 6, 7, 8];
  const sessionStatusMap = {};
  (Array.isArray(attendanceData) ? attendanceData : []).forEach((rec) => {
    sessionStatusMap[rec.session] = rec.status;
  });

  return (
    <div className="mt-4">
      {/* Mobile cards */}
      <div className="block md:hidden space-y-3">
        {allSessions.map((sNum) => {
          const status = sessionStatusMap[sNum] || null;
          return (
            <div
              key={sNum}
              className={`rounded-xl border overflow-hidden shadow-lg ${status === "present"
                ? "bg-green-900/10 border-green-700/30"
                : status === "absent"
                  ? "bg-red-900/10 border-red-700/30"
                  : "bg-gray-800/30 border-gray-600/30"
                }`}>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-300 text-base font-medium">Session</p>
                    <p className="text-white font-semibold text-base">
                      {getSessionTime(sNum)}
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

      {/* Desktop horizontal table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-600/30">
        <table className="min-w-full text-base bg-gray-800/30 text-white rounded-xl">
          <thead className="bg-emerald-600/20 text-white">
            <tr>
              <th className="px-4 py-3 text-left sticky left-0 bg-emerald-600/20 z-10 min-w-[120px]">
                Date
              </th>
              {sessions.map((s, i) => (
                <th
                  key={i}
                  className="px-3 py-3 text-center whitespace-nowrap min-w-[80px]">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-800/20 border-t border-gray-600/30 hover:bg-gray-600/20">
              <td className="px-4 py-3 text-emerald-300 font-semibold sticky left-0 bg-inherit backdrop-blur-sm z-10 whitespace-nowrap">
                {formatPrettyDate(selectedDate ? selectedDate : new Date())}
              </td>
              {allSessions.map((sNum) => {
                const status = sessionStatusMap[sNum] || null;
                return (
                  <td
                    key={sNum}
                    className={`px-3 py-3 text-center font-medium whitespace-nowrap ${status === "present"
                      ? "text-green-400"
                      : status === "absent"
                        ? "text-red-400"
                        : "text-gray-400"
                      }`}>
                    <span
                      className={`inline-block w-full py-1 px-2 rounded ${status === "present"
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

/* ----------------- InlineAttendance ----------------- */
const InlineAttendance = ({ registerNo }) => {
  const [mode, setMode] = useState("single");
  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedToday, setHasLoadedToday] = useState(false);

  const handleSearch = useCallback(async (isAutoLoad = false) => {
    if (!registerNo) {
      if (!isAutoLoad) alert("Student data not found!");
      return;
    }

    if (mode === "range") {
      const diffTime = Math.abs(dateRange.end - dateRange.start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 7) {
        if (!isAutoLoad)
          alert(
            "Date range cannot exceed 7 days. Please select a shorter range."
          );
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "range") {
        const response = await Api.get(`/students/${registerNo}/range`, {
          params: {
            startDate: toYMD(dateRange.start),
            endDate: toYMD(dateRange.end),
          },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const data = response.data;
        const fetched = (Array.isArray(data.data) ? data.data : []).map(
          ({ attendanceDate, sessions }) => ({
            attendanceDate,
            sessions: Array.isArray(JSON.parse(sessions))
              ? JSON.parse(sessions)
              : [],
          })
        );
        setAttendanceData(fetched);
      } else {
        const response = await Api.get(`/students/${registerNo}/date`, {
          params: { date: toYMD(date) },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const data = response.data;
        const sessionData = data.data?.[0]?.sessions;
        const parsed = Array.isArray(sessionData ? JSON.parse(sessionData) : [])
          ? JSON.parse(sessionData)
          : [];
        setAttendanceData(parsed);
      }
    } catch (error) {
      if (!isAutoLoad) {
        if (error.response) {
          if (error.response.status === 401)
            alert("Unauthorized: Invalid credentials.");
          else if (error.response.status === 404)
            alert("Attendance not found. Enter a valid date.");
          else
            alert(
              `Error ${error.response.status}: ${error.response.statusText}`
            );
        } else {
          alert("Network error or server not responding.");
        }
      }
      console.error(
        "Error fetching attendance:",
        error.response?.data || error.message
      );

      if (isAutoLoad) setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  }, [registerNo, mode, date, dateRange]);

  useEffect(() => {
    if (registerNo && !hasLoadedToday) {
      handleSearch(true);
      setHasLoadedToday(true);
    }
  }, [registerNo, handleSearch, hasLoadedToday]);

  return (
    <div className="bg-gray-900/70 rounded-xl border border-gray-700 p-4 sm:p-6">
      {/* Show today's date prominently */}
      <div className="mb-4 text-center">
        {mode === "single" ? (
          <>
            <h3 className="text-base font-semibold text-emerald-300">
              Attendance for {formatPrettyDate(date)}
            </h3>
            <p className="text-base text-gray-400">
              Showing today's attendance. Use controls below to view other
              dates.
            </p>
          </>
        ) : (
          <h3 className="text-base font-semibold text-emerald-300">
            Attendance for {formatPrettyDate(dateRange.start)} to{" "}
            {formatPrettyDate(dateRange.end)}
          </h3>
        )}
      </div>

      {/* Initial loading state */}
      {loading && hasLoadedToday && (
        <div className="text-center py-8">
          <div className="text-gray-300">Loading today's attendance...</div>
        </div>
      )}

      {/* Attendance Table shown in same place for single or range mode */}
      {!loading && (
        <div className="mb-6">
          <AttendanceTable
            attendanceData={attendanceData}
            mode={mode}
            selectedDate={mode === "single" ? date : null}
          />
        </div>
      )}

      {/* Controls for different searches */}
      <div className="border-t border-gray-700 pt-6">
        <h4 className="text-md font-medium text-gray-300 mb-4">
          Search Other Dates
        </h4>
        <div className="flex flex-col lg:flex-row lg:items-end gap-3 lg:gap-6">
          <div className="flex gap-2">
            {[
              { key: "single", label: "Single Date" },
              { key: "range", label: "Date Range" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setMode(key);
                  setAttendanceData([]);
                }}
                className={`px-3 py-2 rounded-lg text-base border ${mode === key
                  ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                  : "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
                  }`}>
                {label}
              </button>
            ))}
          </div>

          {mode === "single" ? (
            <div className="flex items-center gap-2">
              <label className="text-base text-gray-300">Date</label>
              <input
                type="date"
                value={toYMD(date)}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-base text-gray-300">Start</label>
                <input
                  type="date"
                  value={toYMD(dateRange.start)}
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    setDateRange((prev) => {
                      const newRange = { ...prev, start: d };
                      const diff = Math.ceil(
                        Math.abs(newRange.end - d) / (1000 * 60 * 60 * 24)
                      );
                      if (diff > 7) {
                        const newEnd = new Date(d);
                        newEnd.setDate(newEnd.getDate() + 7);
                        newRange.end = newEnd;
                      }
                      return newRange;
                    });
                  }}
                  className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-base text-gray-300">End</label>
                <input
                  type="date"
                  value={toYMD(dateRange.end)}
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    setDateRange((prev) => {
                      const newRange = { ...prev, end: d };
                      const diff = Math.ceil(
                        Math.abs(d - newRange.start) / (1000 * 60 * 60 * 24)
                      );
                      if (diff > 7) {
                        const newStart = new Date(d);
                        newStart.setDate(newStart.getDate() - 7);
                        newRange.start = newStart;
                      }
                      return newRange;
                    });
                  }}
                  className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
                />
              </div>
              <p className="text-base text-gray-400">Maximum range: 7 days</p>
            </div>
          )}

          <button
            onClick={() => handleSearch(false)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium border ${loading
              ? "bg-gray-700 text-gray-300 cursor-not-allowed border-gray-600"
              : "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-500"
              }`}>
            {loading ? "Searching..." : "Search Records"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------- Main: StudentList ----------------- */
const StudentList = ({ department }) => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ semester: "", section: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState("registrationNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Bulk edit state
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [editedStudents, setEditedStudents] = useState([]);
  const [bulkSemester, setBulkSemester] = useState(""); // New state for bulk semester change

  // row expansion
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  // Fetch all students in department on mount
  useEffect(() => {
    if (department) {
      const fetchAllDepartmentStudents = async () => {
        setLoading(true);
        try {
          const response = await Api.get("/student/department", {
            params: { department },
          });
          const data = response.data?.data || [];
          setStudents(data);
          setEditedStudents(data.map((s) => ({ ...s })));
        } catch (error) {
          console.error("Failed to fetch department students", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAllDepartmentStudents();
    }
  }, [department]);

  const columns = [
    "Registration Number",
    "Name",
    "Department",
    "Semester",
    "Section",
    "Actions",
  ];

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aVal = (a[sortBy] || "").toString().toLowerCase();
      let bVal = (b[sortBy] || "").toString().toLowerCase();
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [students, searchTerm, sortBy, sortOrder]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * studentsPerPage;
    return filteredAndSortedStudents.slice(start, start + studentsPerPage);
  }, [filteredAndSortedStudents, currentPage, studentsPerPage]);

  const totalPages = Math.ceil(
    filteredAndSortedStudents.length / studentsPerPage
  );

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.name}?`)) return;
    try {
      await Api.delete(
        `/student/delete?registrationNumber=${student.registrationNumber}`
      );
      alert("Student deleted successfully!");
      fetchStudents();
    } catch {
      alert("Failed to delete student.");
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleUpload = async () => {
    if (!csvFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", csvFile);
    try {
      await Api.post("/student/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("CSV uploaded successfully!");
      fetchStudents();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Upload failed. Please ensure you are using a CSV file and following the template.";
      alert(errMsg);
    } finally {
      setUploading(false);
      setCsvFile(null);
    }
  };

  const fetchStudents = async () => {
    if (!filters.semester && !filters.section) {
      alert("Select semester and section.");
      return;
    }
    setLoading(true);
    try {
      const response = await Api.get("/student/all", {
        params: {
          department,
          semester: parseInt(filters.semester),
          section: filters.section,
        },
      });
      const data = response.data?.data || [];
      setStudents(data);
      setEditedStudents(data.map((s) => ({ ...s }))); // keep editable copy
      setCurrentPage(1);
    } catch {
      alert("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkChange = (id, field, value) => {
    setEditedStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // New function to handle bulk semester change
  const handleBulkSemesterChange = () => {
    if (!bulkSemester) {
      alert("Please select a semester to apply to all students.");
      return;
    }

    if (
      !window.confirm(
        `Change all students' semester to ${bulkSemester}? This will affect ${editedStudents.length} students.`
      )
    ) {
      return;
    }

    setEditedStudents((prev) =>
      prev.map((s) => ({ ...s, sem: parseInt(bulkSemester) }))
    );

    alert(`All students' semester changed to ${bulkSemester}`);
  };

  const handleBulkSave = async () => {
    try {
      await Api.put("/student/bulk-update", editedStudents);
      alert("Bulk update successful!");
      setBulkEditMode(false);
      fetchStudents();
    } catch {
      alert("Bulk update failed.");
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const toggleExpand = (id) => {
    setExpandedStudentId((prev) => (prev === id ? null : id));
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
        {[
          ["First", 1, currentPage === 1],
          ["Prev", currentPage - 1, currentPage === 1],
        ].map(([text, page, disabled]) => (
          <button
            key={text}
            onClick={() => setCurrentPage(page)}
            disabled={disabled}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-base">
            {text}
          </button>
        ))}

        {pages.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded text-base ${currentPage === num
              ? "bg-emerald-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
              }`}>
            {num}
          </button>
        ))}

        {[
          ["Next", currentPage + 1, currentPage === totalPages],
          ["Last", totalPages, currentPage === totalPages],
        ].map(([text, page, disabled]) => (
          <button
            key={text}
            onClick={() => setCurrentPage(page)}
            disabled={disabled}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-base">
            {text}
          </button>
        ))}
      </div>
    );
  };

  const renderMobileStudentCard = (student) => (
    <div
      key={student.id}
      className="bg-gray-800/50 rounded-lg border border-gray-600/30 shadow-lg overflow-hidden">
      {/* Student Info Header */}
      <div className="bg-emerald-600/20 px-4 py-3 border-b border-gray-600/30">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-semibold text-base truncate">
              {student.name}
            </h3>
            <p className="text-emerald-300 text-base font-medium">
              {student.registrationNumber}
            </p>
          </div>
          <div className="text-right text-base text-gray-300">
            <p>{student.department.toUpperCase()}</p>
            <p>
              Sem {student.sem}, Sec {student.section}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          <button
            className="flex-1 min-w-[80px] px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-base font-medium"
            onClick={() => handleEdit(student)}>
            Edit
          </button>
          <button
            className="flex-1 min-w-[80px] px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-base font-medium"
            onClick={() => handleDelete(student)}>
            Delete
          </button>
          <button
            className="flex-1 min-w-[120px] px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-base font-medium"
            onClick={() => toggleExpand(student.id)}>
            {expandedStudentId === student.id
              ? "Hide Attendance"
              : "View Attendance"}
          </button>
        </div>
      </div>

      {/* Expanded Attendance Section */}
      {expandedStudentId === student.id && (
        <div className="border-t border-gray-600/30 bg-gray-900/50">
          <InlineAttendance registerNo={student.registrationNumber} />
        </div>
      )}
    </div>
  );

  const renderMobileBulkEditCard = (student) => (
    <div
      key={student.id}
      className="bg-gray-800/50 rounded-lg border border-gray-600/30 shadow-lg overflow-hidden">
      {/* Bulk Edit Header */}
      <div className="bg-blue-600/20 px-4 py-3 border-b border-gray-600/30">
        <h3 className="text-white font-semibold text-base">
          Editing: {student.name}
        </h3>
      </div>

      {/* Bulk Edit Form */}
      <div className="p-4 space-y-3">
        <div>
          <label className="block text-base font-medium text-gray-300 mb-1">
            Registration Number
          </label>
          <input
            value={student.registrationNumber}
            onChange={(e) =>
              handleBulkChange(student.id, "registrationNumber", e.target.value)
            }
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-base font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            value={student.name}
            onChange={(e) =>
              handleBulkChange(student.id, "name", e.target.value)
            }
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-base font-medium text-gray-300 mb-1">
            Department
          </label>
          <input
            value={student.department}
            onChange={(e) =>
              handleBulkChange(student.id, "department", e.target.value)
            }
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-base font-medium text-gray-300 mb-1">
              Semester
            </label>
            <input
              type="number"
              value={student.sem}
              onChange={(e) =>
                handleBulkChange(student.id, "sem", e.target.value)
              }
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-300 mb-1">
              Section
            </label>
            <input
              value={student.section}
              onChange={(e) =>
                handleBulkChange(student.id, "section", e.target.value)
              }
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="p-3 sm:p-5 max-w-7xl mx-auto text-white">
        {showAddStudent ? (
          <AddStudentsTab department={department} onClose={() => setShowAddStudent(false)} />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
                Student Management
              </h1>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-base sm:text-base"
                  onClick={() => setShowOptions(true)}>
                  Add New Student
                </button>
                {students.length > 0 && (
                  <button
                    onClick={() => setBulkEditMode(!bulkEditMode)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-base sm:text-base">
                    {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
                  </button>
                )}
              </div>
            </div>

            {/* Bulk Edit Controls */}
            {bulkEditMode && (
              <div className="mb-6 p-4 sm:p-5 bg-gradient-to-br from-blue-800/20 to-blue-900/20 rounded-xl border border-blue-600/30 shadow-lg">
                <h3 className="text-base font-semibold text-blue-300 mb-4">
                  Bulk Edit Controls
                </h3>

                {/* Minimalistic Bulk Semester Change */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/40 rounded-lg border border-gray-600/40">
                  <span className="text-base text-gray-300">
                    Change all to semester:
                  </span>
                  <select
                    value={bulkSemester}
                    onChange={(e) => setBulkSemester(e.target.value)}
                    className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded text-base focus:border-emerald-500 focus:outline-none min-w-[100px]">
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6].map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleBulkSemesterChange}
                    className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!bulkSemester}>
                    Apply ({editedStudents.length})
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleBulkSave}
                    className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
                    Save All Changes
                  </button>
                  <button
                    onClick={() => {
                      setBulkEditMode(false);
                      setBulkSemester("");
                      setEditedStudents(students.map((s) => ({ ...s })));
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                    Cancel & Reset
                  </button>
                </div>
              </div>
            )}

            {/* Options: add / csv */}
            {showOptions && (
              <div className="mb-6 p-4 sm:p-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex flex-col items-center gap-3 w-full sm:w-96 mx-auto shadow-lg">
                <p className="text-base sm:text-base font-semibold text-center">
                  Choose an option:
                </p>
                <button
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full text-base sm:text-base"
                  onClick={() => {
                    setShowAddStudent(true);
                    setShowOptions(false);
                  }}>
                  Add Individually
                </button>
                <div className="w-full text-center">
                  <DragDropCSVUpload
                    onChange={(file) =>
                      setCsvFile(file.target ? file.target.files[0] : file)
                    }
                  />
                  {csvFile && (
                    <>
                      <div className="mt-2 p-2 bg-gray-700 border border-gray-600 rounded text-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-base break-all">
                          {csvFile.name}
                        </span>
                        <button
                          className="text-red-500 hover:text-red-700 text-base sm:ml-2"
                          onClick={() => setCsvFile(null)}>
                          ×
                        </button>
                      </div>
                      <button
                        className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full text-base sm:text-base"
                        onClick={handleUpload}
                        disabled={uploading}>
                        {uploading ? "Uploading..." : "Upload File"}
                      </button>
                    </>
                  )}
                </div>
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full text-base sm:text-base"
                  onClick={() => {
                    const l = document.createElement("a");
                    l.href = "/csv files/studentcsv.csv";
                    l.download = "studentcsv.csv";
                    l.click();
                  }}>
                  Download Sample CSV
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full text-base sm:text-base"
                  onClick={() => setShowOptions(false)}>
                  Cancel
                </button>
              </div>
            )}

            {/* Filters / Search */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 sm:p-5 mb-6 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {[
                  [
                    "Semester",
                    "semester",
                    [...Array(6)].map((_, i) => [`Semester ${i + 1}`, i + 1]),
                  ],
                  [
                    "Section",
                    "section",
                    ["A", "B", "C", "D"].map((s) => [`Section ${s}`, s]),
                  ],
                ].map(([label, key, options]) => (
                  <div key={key}>
                    <label className="block text-base font-medium mb-2">
                      {label}
                    </label>
                    <select
                      className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-emerald-500 focus:outline-none"
                      value={filters[key]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }>
                      <option value="">-- Select --</option>
                      {options.map(([text, val]) => (
                        <option key={val} value={val}>
                          {text}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <div>
                  <label className="block text-base font-medium mb-2">
                    Search Students
                  </label>
                  <input
                    type="text"
                    placeholder="Name, Reg Number, Department..."
                    className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-emerald-500 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <button
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
                  onClick={fetchStudents}
                  disabled={loading}>
                  {loading ? "Loading..." : "Load Students"}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 pt-4 border-t border-gray-700 gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-base text-gray-300">Sort by:</span>
                  {[
                    ["name", "Name"],
                    ["registrationNumber", "Reg No"],
                  ].map(([field, label]) => (
                    <button
                      key={field}
                      onClick={() => handleSort(field)}
                      className={`text-base px-2 py-1 rounded ${sortBy === field
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}>
                      {label}
                      {sortBy === field && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="text-base text-gray-300">
                  Showing {paginatedStudents.length} of{" "}
                  {filteredAndSortedStudents.length} students
                  {searchTerm && ` (filtered from ${students.length} total)`}
                </div>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="block lg:hidden">
              {students.length > 0 && (
                <div className="space-y-4">
                  {/* Mobile bulk edit cards */}
                  {bulkEditMode ? (
                    <div className="space-y-4">
                      {editedStudents.map(renderMobileBulkEditCard)}
                    </div>
                  ) : (
                    /* Regular mobile cards */
                    <div className="space-y-4">
                      {paginatedStudents.map(renderMobileStudentCard)}
                    </div>
                  )}
                  {renderPagination()}
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              {students.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800/30 rounded-lg overflow-hidden">
                    <thead>
                      <tr>
                        {columns.map((col, idx) => (
                          <th
                            key={idx}
                            className="px-4 py-3 text-left text-base font-semibold text-gray-200 bg-gray-700">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(bulkEditMode ? editedStudents : paginatedStudents).map(
                        (s) => (
                          <React.Fragment key={s.id}>
                            <tr className="border-b border-gray-700">
                              <td className="px-4 py-2">
                                {bulkEditMode ? (
                                  <input
                                    value={s.registrationNumber}
                                    onChange={(e) =>
                                      handleBulkChange(
                                        s.id,
                                        "registrationNumber",
                                        e.target.value
                                      )
                                    }
                                    className="px-2 py-1 rounded text-black"
                                  />
                                ) : (
                                  s.registrationNumber
                                )}
                              </td>
                              <td className="px-4 py-2">
                                {bulkEditMode ? (
                                  <input
                                    value={s.name}
                                    onChange={(e) =>
                                      handleBulkChange(
                                        s.id,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    className="px-2 py-1 rounded text-black"
                                  />
                                ) : (
                                  s.name
                                )}
                              </td>
                              <td className="px-4 py-2">
                                {bulkEditMode ? (
                                  <input
                                    value={s.department}
                                    onChange={(e) =>
                                      handleBulkChange(
                                        s.id,
                                        "department",
                                        e.target.value
                                      )
                                    }
                                    className="px-2 py-1 rounded text-black"
                                  />
                                ) : (
                                  s.department.toUpperCase()
                                )}
                              </td>
                              <td className="px-4 py-2">
                                {bulkEditMode ? (
                                  <input
                                    type="number"
                                    value={s.sem}
                                    onChange={(e) =>
                                      handleBulkChange(
                                        s.id,
                                        "sem",
                                        e.target.value
                                      )
                                    }
                                    className="px-2 py-1 rounded text-black w-20"
                                  />
                                ) : (
                                  `Sem ${s.sem}`
                                )}
                              </td>
                              <td className="px-4 py-2">
                                {bulkEditMode ? (
                                  <input
                                    value={s.section}
                                    onChange={(e) =>
                                      handleBulkChange(
                                        s.id,
                                        "section",
                                        e.target.value
                                      )
                                    }
                                    className="px-2 py-1 rounded text-black w-20"
                                  />
                                ) : (
                                  `Sec ${s.section}`
                                )}
                              </td>
                              <td className="px-4 py-2">
                                {bulkEditMode ? (
                                  <span className="text-gray-400 text-base">
                                    Editing
                                  </span>
                                ) : (
                                  <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                                    <button
                                      className="text-base sm:text-base px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
                                      onClick={() => handleEdit(s)}>
                                      Edit
                                    </button>
                                    <button
                                      className="text-base sm:text-base px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                                      onClick={() => handleDelete(s)}>
                                      Delete
                                    </button>
                                    <button
                                      className="text-base sm:text-base px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-700"
                                      onClick={() => toggleExpand(s.id)}>
                                      {expandedStudentId === s.id
                                        ? "Hide Attendance"
                                        : "View Attendance"}
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>

                            {/* Expanded Row */}
                            {expandedStudentId === s.id && (
                              <tr className="border-b border-gray-800">
                                <td colSpan={6} className="bg-gray-900 p-4">
                                  <InlineAttendance
                                    registerNo={s.registrationNumber}
                                  />
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      )}
                    </tbody>
                  </table>

                  {renderPagination()}
                </div>
              )}
            </div>

            {students.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-base mb-2">
                  No students loaded
                </div>
                <div className="text-gray-500">
                  Select semester and section, then click "Load Students"
                </div>
              </div>
            )}
          </>
        )}

        {showModal && (
          <EditStudentModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onUpdate={fetchStudents}
            student={selectedStudent}
          />
        )}
      </div>
    </>
  );
};

export default StudentList;




