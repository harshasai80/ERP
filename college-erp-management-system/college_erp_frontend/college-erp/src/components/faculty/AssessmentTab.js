import React, { useState, useEffect, useCallback } from "react";
import Api from "../../Api";
import Alert from "./Alert";

const departments = ["DCS", "DEEE", "DME", "DCE", "DMT"];
const semesters = [1, 2, 3, 4, 5, 6];
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
  const [filters, setFilters] = useState({
    department: "",
    semester: "",
    section: "",
    subjectId: "",
    iaType: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({}); // registrationNumber -> marks
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const fetchSubjects = useCallback(async () => {
    if (!faculty?.id) return;
    try {
      const response = await Api.get(`/subjects/all?facultyId=${faculty.id}`);
      const data = response.data?.data || [];
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects", error);
    }
  }, [faculty?.id]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const fetchStudents = async () => {
    if (!filters.department || !filters.semester || !filters.section || !filters.subjectId) {
      return;
    }
    try {
      setLoading(true);
      const url = `/student/all?department=${filters.department}&semester=${filters.semester}&section=${filters.section}`;
      const response = await Api.get(url);
      const studentData = response.data?.data || [];
      setStudents(studentData);

      // Load existing marks for these students
      const marksMap = {};
      for (const student of studentData) {
        try {
          const mRes = await Api.get(`/iamarks/student/${student.registrationNumber}/subject/${filters.subjectId}`);
          if (mRes.data?.data?.length > 0) {
            const existing = mRes.data.data[0];
            const iaData = JSON.parse(existing.iaMarks || "{}");
            marksMap[student.registrationNumber] = iaData[filters.iaType] || "";
          }
        } catch (e) {
          // No marks found, ignore
        }
      }
      setMarks(marksMap);
    } catch (error) {
      showAlert("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters.department, filters.semester, filters.section, filters.subjectId, filters.iaType]);

  const handleMarkChange = (regNo, value) => {
    setMarks((prev) => ({ ...prev, [regNo]: value }));
  };

  const handleSave = async () => {
    if (!filters.iaType) return showAlert("Please select IA Type", "error");

    try {
      setLoading(true);
      const selectedSubject = subjects.find(s => s.id.toString() === filters.subjectId);

      const payloadList = students.map((student) => {
        // Fetch existing marks if any to update the JSON
        let existingMarks = {};
        // Note: In a real app, you'd fetch all at once or handle on backend.
        // For now, we'll just send the current one.
        existingMarks[filters.iaType] = marks[student.registrationNumber] || 0;

        return {
          student: { registrationNumber: student.registrationNumber },
          subject: { subjectId: selectedSubject.subject.subjectId },
          iaMarks: JSON.stringify(existingMarks),
          dept: filters.department
        };
      });

      await Api.post("/iamarks/add-bulk", payloadList);
      showAlert("IA Marks saved successfully", "success");
    } catch (error) {
      showAlert("Failed to save marks", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  return (
    <div className="bg-[#2d2f36] p-6 rounded-3xl shadow-2xl text-white relative border border-emerald-500/20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-emerald-300 classic-heading">
            Internal <span className="font-light italic text-gray-400">Assessment</span>
          </h2>
          <p className="text-base uppercase font-bold tracking-[0.4em] text-emerald-500/60 mt-2">
            Academic Performance Registry
          </p>
        </div>
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl border border-emerald-500/20 shadow-inner">
          📝
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <select
          className="bg-gray-800 text-white p-3 rounded-xl border border-emerald-500/30 focus:border-emerald-500 outline-none text-base transition-all"
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
          <option value="">Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          className="bg-gray-800 text-white p-3 rounded-xl border border-emerald-500/30 focus:border-emerald-500 outline-none text-base transition-all"
          value={filters.semester}
          onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
        >
          <option value="">Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>Semester {sem}</option>
          ))}
        </select>

        <select
          className="bg-gray-800 text-white p-3 rounded-xl border border-emerald-500/30 focus:border-emerald-500 outline-none text-base transition-all"
          value={filters.section}
          onChange={(e) => setFilters({ ...filters, section: e.target.value })}
        >
          <option value="">Section</option>
          {sections.map((sec) => (
            <option key={sec} value={sec}>Section {sec}</option>
          ))}
        </select>

        <select
          className="bg-gray-800 text-white p-3 rounded-xl border border-emerald-500/30 focus:border-emerald-500 outline-none text-base transition-all"
          value={filters.subjectId}
          onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
        >
          <option value="">Subject</option>
          {subjects
            .filter(s => s.subject.department === filters.department && s.subject.semester === parseInt(filters.semester))
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.subject.subjectName} ({s.section})
              </option>
            ))}
        </select>

        <select
          className="bg-gray-800 text-white p-3 rounded-xl border border-emerald-500/30 focus:border-emerald-500 outline-none text-base transition-all underline decoration-emerald-500"
          value={filters.iaType}
          onChange={(e) => setFilters({ ...filters, iaType: e.target.value })}
        >
          <option value="">Select IA Type</option>
          {assessments.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-900/50 rounded-2xl border border-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-emerald-900/20 text-emerald-400">
              <th className="p-4 text-left text-base font-bold uppercase tracking-widest border-b border-emerald-500/10">Registration No.</th>
              <th className="p-4 text-left text-base font-bold uppercase tracking-widest border-b border-emerald-500/10">Name</th>
              <th className="p-4 text-left text-base font-bold uppercase tracking-widest border-b border-emerald-500/10">Marks Entry</th>
              <th className="p-4 text-left text-base font-bold uppercase tracking-widest border-b border-emerald-500/10">Max Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-500 italic text-base">
                  {loading ? "Loading academic records..." : "Select all filters to load student list"}
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.registrationNumber} className="hover:bg-emerald-500/5 transition-all border-b border-gray-800 last:border-0 font-medium">
                  <td className="p-4 text-base font-mono text-emerald-400">{student.registrationNumber}</td>
                  <td className="p-4 text-base">{student.name}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      className="bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-emerald-500 outline-none w-24 text-center transition-all"
                      value={marks[student.registrationNumber] || ""}
                      onChange={(e) => handleMarkChange(student.registrationNumber, e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="p-4 text-base opacity-40">25</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={students.length === 0 || loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:opacity-50 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 text-base uppercase tracking-[0.2em]"
        >
          {loading ? "Processing..." : "Commit Performance Data"}
        </button>
      </div>

      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default AssessmentTab;




