import React, { useState } from "react";
import { students } from "./Data/demoData";
import Alert from "./Alert";

function AttendanceTab() {
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState("");
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const loadStudents = () => {
    if (!classId || !date) {
      showAlert("Please select a class and date", "error");
      return;
    }

    setStudentsLoaded(true);
    setAbsentStudents([]);
  };

  const handleAttendanceChange = (e, rollNo) => {
    if (e.target.checked) {
      setAbsentStudents([...absentStudents, rollNo]);
    } else {
      setAbsentStudents(absentStudents.filter((id) => id !== rollNo));
    }
  };

  const saveAttendance = () => {

    // In a real app, you would send this data to the server
    showAlert(
      `Attendance saved for ${absentStudents.length} students in ${classId} on ${date}`,
      "success"
    );

    // Reset form
    setClassId("");
    setDate("");
    setStudentsLoaded(false);
    setAbsentStudents([]);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });

    // Hide alert after 5 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 5000);
  };

  return (
    <div className="bg-white p-5 rounded-md shadow-md mt-5">
      <h2 className="text-xl font-bold mb-4">Mark Student Attendance</h2>

      <div className="mb-4">
        <label htmlFor="attendance-class" className="block mb-2">
          Select Class:
        </label>
        <select
          id="attendance-class"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-md"
        >
          <option value="">Select a class</option>
          <option value="cse101">CSE101 - Introduction to Computing</option>
          <option value="cse201">CSE201 - Data Structures</option>
          <option value="cse301">CSE301 - Database Systems</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="attendance-date" className="block mb-2">
          Date:
        </label>
        <input
          type="date"
          id="attendance-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-md"
        />
      </div>

      <button
        onClick={loadStudents}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
      >
        Load Students
      </button>

      {studentsLoaded && students[classId] && (
        <div id="student-list">
          <table className="w-full border-collapse my-5">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 bg-gray-700 text-white text-left">
                  Roll No
                </th>
                <th className="border border-gray-300 p-3 bg-gray-700 text-white text-left">
                  Student Name
                </th>
                <th className="border border-gray-300 p-3 bg-gray-700 text-white text-left">
                  Absent
                </th>
              </tr>
            </thead>
            <tbody>
              {students[classId].map((student) => (
                <tr
                  key={student.rollNo}
                  className={student.rollNo % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="border border-gray-300 p-3">
                    {student.rollNo}
                  </td>
                  <td className="border border-gray-300 p-3">{student.name}</td>
                  <td className="border border-gray-300 p-3">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleAttendanceChange(e, student.rollNo)
                      }
                      checked={absentStudents.includes(student.rollNo)}
                      className="mr-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={saveAttendance}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Save Attendance
          </button>
        </div>
      )}

      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default AttendanceTab;
