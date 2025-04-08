import React, { useState, useEffect } from "react";
import Alert from "./Alert";
import Api from "../../Api";

function AttendanceTab({faculty}) {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
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

  useEffect(() => {
    if (department && semester && section) {
      fetchSubjects();
    }
  }, [department, semester, section]);

  const fetchSubjects = async () => {
    try {
      const response = await Api.get(
        `/subjects/all?facultyId=${faculty.id}`
      );
      const data = response.data?.data || [];
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects", error);
      setSubjects([]);
      showAlert("Failed to load subjects", "error");
    }
  };

  useEffect(() => {
    if (subjectId) {
      const selected = subjects.find((s) => s.subject.subjectId.toString() === subjectId);
      if (selected) {
        setSubjectType(selected.subjectType);
        setAvailableBatches(selected.batches || []);
        if (selected.subjectType === "LAB" && selected.batches.length === 0) {
          showAlert("No batches assigned for selected lab subject", "error");
        }
        fetchStudents(selected.subjectType === "LAB" ? selected.batches[0] : null);
      }
    }
  }, [subjectId]);

  useEffect(() => {
    if (subjectType === "LAB" && batch) {
      fetchStudents(batch);
    }
  }, [batch]);

  const fetchStudents = async (selectedBatch = null) => {
    try {
      let url = `/student/all?department=${department}&semester=${semester}&section=${section}`;
      if (selectedBatch) {
        url += `&batch=${selectedBatch}`;
      }
      const response = await Api.get(url);
      const data = response.data?.data || [];
      setStudents(data);
      setAbsentStudents([]);
    } catch (error) {
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

  const lunchBreaks = {
    1: { start: "12:00", end: "13:00" },
    2: { start: "13:00", end: "14:00" },
    3: { start: "13:00", end: "14:00" },
    4: { start: "13:00", end: "14:00" },
    5: { start: "13:00", end: "14:00" },
    6: { start: "13:00", end: "14:00" },
  };

  const collegeEndTimes = {
    1: "16:00",
    2: "17:00",
    3: "17:00",
    4: "17:00",
    5: "17:00",
    6: "17:00",
  };

// Inside saveAttendance function:

const saveAttendance = async () => {
  if (!date || !startTime || !endTime || !semester || !subjectId) {
    showAlert("Please fill all fields", "error");
    return;
  }

  const selectedStartTime = new Date(`${date}T${startTime}`);
  const selectedEndTime = new Date(`${date}T${endTime}`);
  const lunchBreak = lunchBreaks[semester];
  const collegeEndTime = collegeEndTimes[semester];

  let selectedSessions = [];

  predefinedSessions.forEach((session, index) => {
    const sessionStart = new Date(`${date}T${session.start}`);
    const sessionEnd = new Date(`${date}T${session.end}`);

    if (collegeEndTime && sessionEnd > new Date(`${date}T${collegeEndTime}`)) return;

    if (lunchBreak) {
      const lunchStart = new Date(`${date}T${lunchBreak.start}`);
      const lunchEnd = new Date(`${date}T${lunchBreak.end}`);
      if (sessionStart >= lunchStart && sessionEnd <= lunchEnd) return;
    }

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
      subjectId: parseInt(subjectId),
      batch: subjectType === "LAB" ? batch : null,
      sessions,
    };
  });

  try {
    await Api.post("/students/add-attendance", attendanceData);
    showAlert("Attendance saved successfully!", "success");
  } catch (error) {
    showAlert("Failed to save attendance", "error");
  }
};

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-md shadow-md mt-5 text-white">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400">Mark Student Attendance</h2>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300">Department:</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2.5 border border-emerald-500 rounded bg-gray-700 text-white"
          >
            <option value="">Select Department</option>
            <option value="DCS">DCS</option>
            <option value="DEEE">DEEE</option>
            <option value="DME">DME</option>
            <option value="DMT">DMT</option>
            <option value="DCE">DCE</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-300">Semester:</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full p-2.5 border border-emerald-500 rounded bg-gray-700 text-white"
          >
            <option value="">Select Semester</option>
            {[...Array(6)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{`${i + 1}`}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-300">Section:</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full p-2.5 border border-emerald-500 rounded bg-gray-700 text-white"
          >
            <option value="">Select Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-300">Subject:</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full p-2.5 border border-emerald-500 rounded bg-gray-700 text-white"
          >
            <option value="">Select Subject</option>
            {Array.isArray(subjects) &&
              subjects.map((s) => (
                <option key={s.id} value={s.subject.subjectId}>
                  {s.subject.subjectName} ({s.subject.subjectCode})
                </option>
              ))}
          </select>
        </div>
        {subjectType === "LAB" && (
          <div>
            <label className="text-sm text-gray-300">Batch:</label>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full p-2.5 border border-emerald-500 rounded bg-gray-700 text-white"
            >
              <option value="">Select Batch</option>
              {availableBatches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2.5 border border-emerald-500 rounded bg-gray-700 text-white"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="p-2.5 border border-emerald-500 rounded bg-gray-700 text-white"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="p-2.5 border border-emerald-500 rounded bg-gray-700 text-white"
        />
      </div>

      {students.length > 0 && (
        <table className="w-full border-collapse bg-gray-700 rounded overflow-hidden mb-6">
          <thead>
            <tr className="bg-emerald-700 text-white">
              <th className="p-3 text-left">Roll No</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Absent</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.registrationNumber}
                className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
              >
                <td className="p-3">{student.registrationNumber}</td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    onChange={(e) => handleAttendanceChange(e, student.registrationNumber)}
                    checked={absentStudents.includes(student.registrationNumber)}
                    className="w-4 h-4 text-emerald-500 border-gray-600 focus:ring-emerald-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={saveAttendance}
        className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors"
      >
        Save Attendance
      </button>

      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default AttendanceTab;
