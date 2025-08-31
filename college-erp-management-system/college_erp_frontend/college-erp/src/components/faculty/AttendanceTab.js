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
      setAbsentStudents(students.map((s) => s.registrationNumber));
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
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
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
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
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
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
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
                className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
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

      {/* Students Grid */}
      {students.length > 0 && (
        <div className="mb-6">
          {/* Header with bulk actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-emerald-400">
              Students ({students.length})
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 text-xs">
              <button
                onClick={toggleAllStudents}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-white transition-colors"
              >
                {absentStudents.length === students.length
                  ? "Mark All Present"
                  : "Mark All Absent"}
              </button>
              <div className="text-gray-300 self-center">
                Present: {students.length - absentStudents.length} | Absent:{" "}
                {absentStudents.length}
              </div>
            </div>
          </div>

          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 max-h-96 overflow-y-auto p-1">
            {students.map((student) => (
              <div
                key={student.registrationNumber}
                className={`relative p-2 sm:p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                  absentStudents.includes(student.registrationNumber)
                    ? "bg-red-900 border-red-600 shadow-red-500/20"
                    : "bg-gray-700 border-gray-600 hover:border-emerald-500 shadow-gray-500/10"
                } shadow-lg hover:shadow-xl`}
                onClick={() =>
                  handleAttendanceChange(
                    {
                      target: {
                        checked: !absentStudents.includes(
                          student.registrationNumber
                        ),
                      },
                    },
                    student.registrationNumber
                  )
                }
              >
                {/* Status indicator */}
                <div
                  className={`absolute top-1 right-1 w-3 h-3 rounded-full ${
                    absentStudents.includes(student.registrationNumber)
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  }`}
                ></div>

                {/* Student Info */}
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-medium text-white mb-1 truncate">
                    {student.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    {student.registrationNumber}
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      absentStudents.includes(student.registrationNumber)
                        ? "bg-red-700 text-red-200"
                        : "bg-emerald-700 text-emerald-200"
                    }`}
                  >
                    {absentStudents.includes(student.registrationNumber)
                      ? "Absent"
                      : "Present"}
                  </div>
                </div>

                {/* Hidden checkbox for accessibility */}
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleAttendanceChange(e, student.registrationNumber)
                  }
                  checked={absentStudents.includes(student.registrationNumber)}
                  className="sr-only"
                  tabIndex={-1}
                />
              </div>
            ))}
          </div>

          {/* Mobile-specific compact view for very small screens */}
          <div className="block xs:hidden mt-4">
            <div className="text-xs text-gray-400 mb-2">
              Tap students to mark absent/present
            </div>
            <div className="flex flex-wrap gap-1">
              {students.map((student) => (
                <button
                  key={student.registrationNumber}
                  onClick={() =>
                    handleAttendanceChange(
                      {
                        target: {
                          checked: !absentStudents.includes(
                            student.registrationNumber
                          ),
                        },
                      },
                      student.registrationNumber
                    )
                  }
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    absentStudents.includes(student.registrationNumber)
                      ? "bg-red-700 text-red-200"
                      : "bg-emerald-700 text-emerald-200"
                  }`}
                >
                  {student.registrationNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Summary for larger screens */}
          <div className="hidden xs:block mt-4 text-xs sm:text-sm text-gray-300 text-center bg-gray-700 p-2 rounded">
            <div className="flex justify-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Present: {students.length - absentStudents.length}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Absent: {absentStudents.length}
              </span>
              <span>Total: {students.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => fetchStudents(subjectType === "LAB" ? batch : null)}
          disabled={!department || !semester || !subjectId}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-md transition-colors text-xs sm:text-sm font-medium"
        >
          Load Students
        </button>

        <button
          onClick={saveAttendance}
          disabled={students.length === 0}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-md transition-colors text-xs sm:text-sm font-medium"
        >
          Save Attendance
        </button>
      </div>

      {/* Alert */}
      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default AttendanceTab;
