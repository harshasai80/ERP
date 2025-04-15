import React, { useState, useEffect } from "react";
import Api from "../../Api";
import Alert from "./Alert";

const departments = ["DCS", "DEEE", "DME", "DCE", "DMT"];
const semesters = [1, 2, 3, 4, 5];
const sections = ["A", "B", "C", "D"];
const assessments = [
  "IA - 1",
  "IA - 2",
  "IA - 3",
  "IA - 4",
  "IA - 5",
  "Skill Test - 1",
  "Skill Test - 2",
];

function AssessmentTab({ faculty }) {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [assessmentType, setAssessmentType] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [marksData, setMarksData] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (department && semester) {
      Api.get(`/subjects/all?facultyId=${faculty.id}`)
        .then((res) => {
          setSubjects(res.data.data || []);
        })
        .catch((err) => console.error(err));
    }
  }, [department, semester]);

  useEffect(() => {
    if (department && semester && section) {
      Api.get(`/student/all`, {
        params: {
          department,
          semester,
          section,
        },
      })
        .then((res) => {
          setStudents(res.data.data || []);
          const initialMarks = res.data.data.map((student) => ({
            registrationNumber: student.registrationNumber,
            name: student.name,
            marks: "",
            maxMarks: "100",
          }));
          setMarksData(initialMarks);
        })
        .catch((err) => console.error(err));
    }
  }, [department, semester, section]);

  const handleMarksChange = (index, value) => {
    const updated = [...marksData];
    updated[index].marks = value;
    setMarksData(updated);
  };

  const handleMaxMarksChange = (index, value) => {
    const updated = [...marksData];
    updated[index].maxMarks = value;
    setMarksData(updated);
  };

  const handleSave = () => {
    if (
      !selectedSubjectId ||
      !assessmentType ||
      !department ||
      !semester ||
      !section
    ) {
      showAlert("Please fill all fields before saving", "error");
      return;
    }

    const incomplete = marksData.some((m) => m.marks.trim() === "");
    if (incomplete) {
      showAlert("Please enter marks for all students", "error");
      return;
    }

    console.log("Saving", {
      subjectId: selectedSubjectId,
      assessmentType,
      marksData,
    });

    showAlert("IA marks saved successfully!", "success");
  };

  const handleSubjectChange = (subjectId) => {
    setSelectedSubjectId(subjectId);

    const subjectIdNum = parseInt(subjectId); // convert to number
    const selected = subjects.find((s) => s.subject.subjectId === subjectIdNum);

    if (selected) {
      const max = selected.subject.maxMarks || 100;
      const updatedMarksData = marksData.map((entry) => ({
        ...entry,
        maxMarks: max.toString(),
      }));
      setMarksData(updatedMarksData);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 4000);
  };

  return (
    <div className="bg-[#2d2f36] p-6 rounded-md shadow-md text-white">
      <h2 className="text-2xl font-bold mb-6 text-emerald-300">
        Internal Assessment (IA) Marks Entry
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md border border-emerald-500"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md border border-emerald-500"
        >
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>

        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md border border-emerald-500"
        >
          <option value="">Select Section</option>
          {sections.map((sec) => (
            <option key={sec} value={sec}>
              Section {sec}
            </option>
          ))}
        </select>

        <select
          value={selectedSubjectId}
          onChange={(e) => handleSubjectChange(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md border border-emerald-500 col-span-1 md:col-span-2"
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.subject.subjectId}>
            {s.subject.subjectName} ({s.subject.subjectCode}) - Section {s.section}
          </option>
          ))}
        </select>

        <select
          value={assessmentType}
          onChange={(e) => setAssessmentType(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md border border-emerald-500"
        >
          <option value="">Select IA Type</option>
          {assessments.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse my-6">
            <thead>
              <tr>
                <th className="bg-emerald-800 p-3 text-left rounded-tl-md">
                  Registration No.
                </th>
                <th className="bg-emerald-800 p-3 text-left">Name</th>
                <th className="bg-emerald-800 p-3 text-left">Marks</th>
                <th className="bg-emerald-800 p-3 text-left rounded-tr-md">
                  Max Marks
                </th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((student, idx) => (
                <tr
                  key={student.registrationNumber}
                  className={idx % 2 === 0 ? "bg-[#3a3b41]" : "bg-[#2d2f36]"}
                >
                  <td className="p-3">{student.registrationNumber}</td>
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      value={student.marks}
                      onChange={(e) => handleMarksChange(idx, e.target.value)}
                      className="bg-gray-800 text-white p-2 rounded-md w-full"
                    />
                  </td>
                  <td className="p-3">{student.maxMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md"
          >
            Save IA Marks
          </button>
        </div>
      ) : (
        <div className="text-center text-red-400 font-semibold mt-6">
          No students available for the selected filters.
        </div>
      )}

      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default AssessmentTab;
