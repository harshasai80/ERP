import React, { useState, useEffect, useCallback } from "react";
import Alert from "./Alert";
import Api from "../../Api";
import HourDropdown from "./HourDropDown";

function AttendanceTab({ faculty }) {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [batch, setBatch] = useState("");
  const [subjectType, setSubjectType] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [students, setStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await Api.get(`/subjects/all?facultyId=${faculty.id}`);
      const data = response.data?.data || [];

      const subjectsAsSemester = data.filter(
        (subject) => subject.subject?.semester === parseInt(semester)
      );
      setSubjects(subjectsAsSemester);
    } catch (error) {
      console.error("Error fetching subjects", error);
      setSubjects([]);
      showAlert("Failed to load subjects", "error");
    }
  }, [faculty.id, semester]);

  useEffect(() => {
    if (department && semester) {
      fetchSubjects();
    }
  }, [department, semester, fetchSubjects]);

  useEffect(() => {
    if (subjectId) {
      const selected = subjects.find((s) => s.id.toString() === subjectId);
      if (selected) {
        setSubjectType(selected.subjectType);
        setAvailableBatches(selected.batches || []);
        if (selected.subjectType === "LAB" && selected.batches?.length === 0) {
          showAlert("No batches assigned for selected lab subject", "error");
        }
      }
    }
  }, [subjectId, subjects]);

  const fetchStudents = async (selectedBatch = null) => {
    try {
      const selectedSubject = subjects.find(
        (s) => s.id.toString() === subjectId
      );
      let url = `/student/all?department=${department}&semester=${semester}&section=${
        selectedSubject?.section || ""
      }`;
      if (selectedBatch) {
        const [startRegNo, endRegNo] = selectedBatch.split(",");
        if (startRegNo && endRegNo) {
          url += `&startRegNo=${startRegNo}&endRegNo=${endRegNo}`;
        }
      }

      const response = await Api.get(url);
      const data = response.data?.data || [];
      setStudents(data);
      setAbsentStudents([]);
    } catch (error) {
      console.error("Fetch students failed", error);
      setStudents([]);
      showAlert("Failed to load students", "error");
    }
  };

  const handleAttendanceChange = (e, rollNo) => {
    if (e.target.checked) {
      setAbsentStudents((prev) => [...prev, rollNo]);
    } else {
      setAbsentStudents((prev) => prev.filter((id) => id !== rollNo));
    }
  };

  const predefinedSessions = [
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "12:00", end: "13:00" },
    { start: "13:00", end: "14:00" },
    { start: "14:00", end: "15:00" },
    { start: "15:00", end: "16:00" },
    { start: "16:00", end: "17:00" },
  ];

  const collegeEndTimes = {
    1: "16:00",
    2: "17:00",
    3: "17:00",
    4: "17:00",
    5: "17:00",
    6: "17:00",
  };

  const saveAttendance = async () => {
    if (!date || !startTime || !endTime || !semester || !subjectId) {
      showAlert("Please fill all fields", "error");
      return;
    }

    const selectedSubject = subjects.find((s) => s.id.toString() === subjectId);
    if (!selectedSubject) {
      showAlert("Invalid subject selected", "error");
      return;
    }

    const selectedStartTime = new Date(`${date}T${startTime}`);
    const selectedEndTime = new Date(`${date}T${endTime}`);
    const collegeEndTime = collegeEndTimes[semester];

    let selectedSessions = [];

    predefinedSessions.forEach((session, index) => {
      const sessionStart = new Date(`${date}T${session.start}`);
      const sessionEnd = new Date(`${date}T${session.end}`);

      if (collegeEndTime && sessionEnd > new Date(`${date}T${collegeEndTime}`))
        return;

      if (sessionStart >= selectedStartTime && sessionEnd <= selectedEndTime) {
        selectedSessions.push({
          session: index + 1,
          start: session.start,
          end: session.end,
        });
      }
    });

    const attendanceData = students.map((student) => {
      const sessions = selectedSessions.map((session) => ({
        session: session.session,
        status: absentStudents.includes(student.registrationNumber)
          ? "absent"
          : "present",
      }));

      return {
        registrationNumber: student.registrationNumber,
        date,
        semester: semester,
        subjectId: selectedSubject.subject.subjectId,
        batch: selectedSubject.subjectType === "LAB" ? batch : null,
        sessions,
      };
    });

    try {
      await Api.post("/students/add-attendance", attendanceData);
      showAlert("Attendance saved successfully!", "success");
    } catch (error) {
      let message;
      if (error.response?.status === 403) {
        message = "Duplicate entry found. Failed to save attendance";
      } else {
        message = "Failed to save attendance";
      }
      showAlert(message, "error");
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  // Toggle all students present/absent
  const toggleAllStudents = () => {
    if (absentStudents.length === students.length) {
      setAbsentStudents([]);
    } else {
      setAbsentStudents(students.map(s => s.registrationNumber));
    }
  };

  return (
    <div className="bg-gray-800 p-3 sm:p-6 rounded-md shadow-md mt-5 text-white max-w-full">
      {/* Header */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-emerald-400 text-center sm:text-left">
        Mark Student Attendance
      </h2>

      {/* Filters Section */}
      <div className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Department */}
          <div className="w-full">
            <label className="block text-xs sm:text-sm text-gray-300 mb-1">
              Department:
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="">Select Department</option>
              <option value="DCS">DCS</option>
              <option value="DEEE">DEEE</option>
              <option value="DME">DME</option>
              <option value="DMT">DMT</option>
              <option value="DCE">DCE</option>
            </select>
          </div>

          {/* Semester */}
          <div className="w-full">
            <label className="block text-xs sm:text-sm text-gray-300 mb-1">
              Semester:
            </label>
            <select
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
              }}
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="">Select Semester</option>
              {[...Array(6)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{`${i + 1}`}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="w-full sm:col-span-2 lg:col-span-1">
            <label className="block text-xs sm:text-sm text-gray-300 mb-1">
              Subject:
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subject.subjectName} ({s.subject.subjectCode}) - Sec{" "}
                  {s.section}{" "}
                  {s.subjectType === "LAB" && s.batches.length > 0
                    ? `- Batches ${s.batches.length}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Batch (only for LAB subjects) */}
          {subjectType === "LAB" && (
            <div className="w-full sm:col-span-2 lg:col-span-3">
              <label className="block text-xs sm:text-sm text-gray-300 mb-1">
                Batch:
              </label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="">Select Batch</option>
                {availableBatches.map((b) => (
                  <option key={b} value={b}>
                    {b[0]} ({b[1]} - {b[2]})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Date and Time Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Date */}
          <div className="w-full">
            <label className="block mb-1 text-xs sm:text-sm text-white">
              Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Start Time */}
          <div className="w-full">
            <HourDropdown
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              startTime={null}
              isEndTime={false}
              semester={semester}
            />
          </div>

          {/* End Time */}
          <div className="w-full sm:col-span-2 lg:col-span-1">
            <HourDropdown
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              startTime={startTime}
              isEndTime={true}
              semester={semester}
            />
          </div>
        </div>
      </div>

      {/* Students Section */}
      {students.length > 0 && (
        <div className="mb-6">
          {/* Header with bulk actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h3 className="text-base font-semibold text-emerald-400">
              Students ({students.length})
            </h3>
            <div className="flex gap-3 items-center">
              <button
                onClick={toggleAllStudents}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white transition-colors text-sm">
                {absentStudents.length === students.length ? "Mark All Present" : "Mark All Absent"}
              </button>
              <div className="text-sm text-gray-300">
                Present: <span className="text-emerald-400 font-semibold">{students.length - absentStudents.length}</span> | 
                Absent: <span className="text-red-400 font-semibold">{absentStudents.length}</span>
              </div>
            </div>
          </div>

          {/* Clean Student Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 max-h-80 overflow-y-auto">
            {students.map((student) => {
              const isAbsent = absentStudents.includes(student.registrationNumber);
              
              return (
                <div
                  key={student.registrationNumber}
                  className={`flex items-center p-2 rounded border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isAbsent
                      ? "bg-red-900 border-red-500 hover:bg-red-800"
                      : "bg-gray-700 border-emerald-500 hover:bg-gray-600"
                  }`}
                  onClick={() =>
                    handleAttendanceChange(
                      { target: { checked: !isAbsent } },
                      student.registrationNumber
                    )
                  }>
                  
                  {/* Status Checkbox */}
                  <div className="flex-shrink-0 mr-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isAbsent 
                        ? "bg-red-600 border-red-400" 
                        : "bg-emerald-600 border-emerald-400"
                    }`}>
                      {isAbsent ? (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate leading-tight" title={student.name}>
                      {student.name}
                    </div>
                    <div className="text-xs text-gray-300 font-mono leading-tight" title={student.registrationNumber}>
                      {student.registrationNumber}
                    </div>
                  </div>

                  {/* Hidden checkbox for accessibility */}
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleAttendanceChange(e, student.registrationNumber)
                    }
                    checked={isAbsent}
                    className="sr-only"
                    tabIndex={-1}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => fetchStudents(subjectType === "LAB" ? batch : null)}
          disabled={!department || !semester || !subjectId}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-md transition-colors text-xs sm:text-sm font-medium">
          Load Students
        </button>

        <button
          onClick={saveAttendance}
          disabled={students.length === 0}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-md transition-colors text-xs sm:text-sm font-medium">
          Save Attendance
        </button>
      </div>

      {/* Alert */}
      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default AttendanceTab;