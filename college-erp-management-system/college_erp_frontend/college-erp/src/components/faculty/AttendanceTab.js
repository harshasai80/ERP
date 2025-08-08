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
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects", error);
      setSubjects([]);
      showAlert("Failed to load subjects", "error");
    }
  }, [faculty.id]);

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
        const [batchName, startRegNo, endRegNo] = selectedBatch.split(",");
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
    const lunchBreak = lunchBreaks[semester];
    const collegeEndTime = collegeEndTimes[semester];

    let selectedSessions = [];

    predefinedSessions.forEach((session, index) => {
      const sessionStart = new Date(`${date}T${session.start}`);
      const sessionEnd = new Date(`${date}T${session.end}`);

      if (collegeEndTime && sessionEnd > new Date(`${date}T${collegeEndTime}`))
        return;

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

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-md shadow-md mt-5 text-white">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-emerald-400">
        Mark Student Attendance
      </h2>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300">Department:</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-sm"
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
            className="w-full p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-sm"
          >
            <option value="">Select Semester</option>
            {[...Array(6)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{`${i + 1}`}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-300">Subject:</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-sm"
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
        {subjectType === "LAB" && (
          <div>
            <label className="text-sm text-gray-300">Batch:</label>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-sm"
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

      {/* Date and Time */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 text-sm text-white">Date: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-sm"
          />
        </div>
        <HourDropdown
          label="Start Time"
          value={startTime}
          onChange={setStartTime}
          startTime={null}
          isEndTime={false}
          semester={semester}
        />
        <HourDropdown
          label="End Time"
          value={endTime}
          onChange={setEndTime}
          startTime={startTime}
          isEndTime={true}
          semester={semester}
        />
      </div>

      {/* Students Table */}
      {students.length > 0 && (
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse bg-gray-700 rounded overflow-hidden min-w-[400px]">
            <thead>
              <tr className="bg-emerald-700 text-white text-sm">
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
                  <td className="p-3 text-sm">{student.registrationNumber}</td>
                  <td className="p-3 text-sm">{student.name}</td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleAttendanceChange(e, student.registrationNumber)
                      }
                      checked={absentStudents.includes(
                        student.registrationNumber
                      )}
                      className="w-4 h-4 text-emerald-500 border-gray-600 focus:ring-emerald-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => fetchStudents(subjectType === "LAB" ? batch : null)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors text-sm"
        >
          Load Students
        </button>

        <button
          onClick={saveAttendance}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors text-sm"
        >
          Save Attendance
        </button>
      </div>

      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default AttendanceTab;
