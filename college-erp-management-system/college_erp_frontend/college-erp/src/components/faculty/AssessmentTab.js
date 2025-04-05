import React, { useState } from "react";
import { students } from "./Data/demoData";
import Alert from "./Alert";

function AssessmentTab() {
  const [classId, setClassId] = useState("");
  const [iaType, setIaType] = useState("");
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [marksData, setMarksData] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const loadStudentsForIA = () => {
    if (!classId || !iaType) {
      showAlert("Please select a class and assessment type", "error");
      return;
    }

    setStudentsLoaded(true);

    if (students[classId]) {
      const initialMarks = students[classId].map((student) => ({
        studentId: student.rollNo,
        marks: "",
        maxMarks: "100",
      }));
      setMarksData(initialMarks);
    }
  };

  const handleMarksChange = (index, value) => {
    const updatedMarks = [...marksData];
    updatedMarks[index].marks = value;
    setMarksData(updatedMarks);
  };

  const handleMaxMarksChange = (index, value) => {
    const updatedMarks = [...marksData];
    updatedMarks[index].maxMarks = value;
    setMarksData(updatedMarks);
  };

  const saveIAMarks = () => {
    let isValid = true;
    marksData.forEach((data) => {
      if (!data.marks.trim()) {
        isValid = false;
      }
    });

    if (!isValid) {
      showAlert("Please enter marks for all students", "error");
      return;
    }

    showAlert(
      `IA marks saved for ${marksData.length} students in ${classId} for ${iaType}`,
      "success"
    );

    setClassId("");
    setIaType("");
    setStudentsLoaded(false);
    setMarksData([]);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 5000);
  };

  return (
    <div className="bg-[#2d2f36] p-6 rounded-md shadow-md text-white">
      <h2 className="text-2xl font-bold mb-6 text-emerald-300">
        Internal Assessment (IA) Marks
      </h2>

      <div className="mb-4">
        <label htmlFor="ia-class" className="block mb-2 text-sm">
          Select Class:
        </label>
        <select
          id="ia-class"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="w-full p-2.5 bg-gray-800 text-white border border-emerald-500 rounded-md"
        >
          <option value="">Select a class</option>
          <option value="cse101">CSE101 - Introduction to Computing</option>
          <option value="cse201">CSE201 - Data Structures</option>
          <option value="cse301">CSE301 - Database Systems</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="ia-type" className="block mb-2 text-sm">
          Assessment Type:
        </label>
        <select
          id="ia-type"
          value={iaType}
          onChange={(e) => setIaType(e.target.value)}
          className="w-full p-2.5 bg-gray-800 text-white border border-emerald-500 rounded-md"
        >
          <option value="">Select assessment type</option>
          <option value="quiz1">Quiz 1</option>
          <option value="midterm">Midterm Exam</option>
          <option value="assignment">Assignment</option>
          <option value="project">Project</option>
          <option value="quiz2">Quiz 2</option>
        </select>
      </div>

      <button
        onClick={loadStudentsForIA}
        className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition"
      >
        Load Students
      </button>

      {studentsLoaded && students[classId] && (
        <div>
          <table className="w-full border-collapse my-6">
            <thead>
              <tr>
                <th className="bg-emerald-800 text-white p-3 text-left rounded-tl-md">
                  Roll No
                </th>
                <th className="bg-emerald-800 text-white p-3 text-left">
                  Student Name
                </th>
                <th className="bg-emerald-800 text-white p-3 text-left">
                  Marks Obtained
                </th>
                <th className="bg-emerald-800 text-white p-3 text-left rounded-tr-md">
                  Max Marks
                </th>
              </tr>
            </thead>
            <tbody>
              {students[classId].map((student, index) => (
                <tr
                  key={student.rollNo}
                  className={index % 2 === 0 ? "bg-[#3a3b41]" : "bg-[#2d2f36]"}
                >
                  <td className="p-3">{student.rollNo}</td>
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marksData[index]?.marks || ""}
                      onChange={(e) => handleMarksChange(index, e.target.value)}
                      className="w-full p-2 bg-gray-800 text-white border border-gray-500 rounded-md"
                    />
                  </td>
                  <td className="p-3">
                    <select
                      value={marksData[index]?.maxMarks || "100"}
                      onChange={(e) =>
                        handleMaxMarksChange(index, e.target.value)
                      }
                      className="w-full p-2 bg-gray-800 text-white border border-gray-500 rounded-md"
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={saveIAMarks}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition"
          >
            Save IA Marks
          </button>
        </div>
      )}

      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default AssessmentTab;
