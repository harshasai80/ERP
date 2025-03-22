import React, { useState, useEffect } from "react";
import Alert from "./Alert";
import Api from "../../Api";

function AttendanceTab() {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [students, setStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (department && semester && section) {
      fetchStudents();
    }
  }, [department, semester, section]);

  const fetchStudents = async () => {
    try {
      const response = await Api.get(
        `/student/all?department=${department}&semester=${semester}&section=${section}`
      );
      const data = await response.data.data;
      setStudents(data);
      setAbsentStudents([]);
    } catch (error) {
      setStudents([]);
      console.log("Error fetching students:", error);
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
    { start: "16:00", end: "17:00" }, // For students with college till 5 PM
  ];

  // Define lunch breaks for different semesters and departments
  const lunchBreaks = {
    1: { start: "12:00", end: "13:00" },
    2: { start: "13:00", end: "14:00" },
    3: { start: "13:00", end: "14:00" },
    4: { start: "13:00", end: "14:00" },
    5: { start: "13:00", end: "14:00" },
    6: { start: "13:00", end: "14:00" },
  };

  const collegeEndTimes = {
    1: "16:00", // Ends at 4 PM
    2: "17:00", // Ends at 5 PM
    3: "17:00", // Ends at 5 PM
    4: "17:00", // Ends at 5 PM
    5: "17:00", // Ends at 5 PM
    6: "17:00", // Ends at 5 PM
  };

  const saveAttendance = async () => {
    if (!date || !startTime || !endTime || !semester) {
      showAlert("Please fill all fields", "error");
      return;
    }

    const lunchBreak = lunchBreaks[semester];
    const collegeEndTime = collegeEndTimes[semester];

    const selectedStartTime = new Date(`${date}T${startTime}`);
    const selectedEndTime = new Date(`${date}T${endTime}`);

    let selectedSessions = [];

    predefinedSessions.forEach((session, index) => {
      const sessionStart = new Date(`${date}T${session.start}`);
      const sessionEnd = new Date(`${date}T${session.end}`);

      if (sessionEnd > new Date(`${date}T${collegeEndTime}`)) return;

      // Check if session is during lunch break
      if (lunchBreak) {
        const lunchStart = new Date(`${date}T${lunchBreak.start}`);
        const lunchEnd = new Date(`${date}T${lunchBreak.end}`);
        if (sessionStart >= lunchStart && sessionEnd <= lunchEnd) {
          return; // 🔥 Skip this session (does NOT affect numbering)
        }
      }

      // Select sessions within the given time range
      if (sessionStart >= selectedStartTime && sessionEnd <= selectedEndTime) {
        selectedSessions.push({
          session: index + 1, // ✅ Keeps the correct session number
          start: session.start,
          end: session.end,
        });
      }
    });
    console.log(selectedSessions);
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
        sessions,
      };
    });

    console.log(attendanceData); // Debugging

    try {
      const response = await Api.post(
        "/students/add-attendance",
        attendanceData
      );
      console.log(response.data);
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
    <div className="bg-white p-5 rounded-md shadow-md mt-5">
      <h2 className="text-xl font-bold mb-4">Mark Student Attendance</h2>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label>Department:</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2 border"
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
          <label>Semester:</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full p-2 border"
          >
            <option value="">Select Semester</option>
            {[...Array(6)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{`${i + 1}`}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Section:</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full p-2 border"
          >
            <option value="">Select Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="p-2 border"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="p-2 border"
        />
      </div>
      {students.length > 0 && (
        <table className="w-full border-collapse my-5">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Absent</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.registrationNumber}>
                <td>{student.registrationNumber}</td>
                <td>{student.name}</td>
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleAttendanceChange(e, student.registrationNumber)
                    }
                    checked={absentStudents.includes(
                      student.registrationNumber
                    )}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={saveAttendance}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
      >
        Save Attendance
      </button>
      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default AttendanceTab;
