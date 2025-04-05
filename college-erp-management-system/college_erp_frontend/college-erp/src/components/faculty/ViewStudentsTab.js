import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Api";

const ViewStudentsTab = () => {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.get(
        `/student/all?department=${department}&semester=${semester}&section=${section}`,
        null,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      setStudents(response.data.data);
    } catch (error) {
      setStudents([]);
      if (error.response) {
        if (error.response.status === 404) {
          alert(
            `Error ${error.response.status}: ${error.response.data.message}`
          );
        } else {
          alert(`Error ${error.response.status}: ${error.response.data}`);
          console.log(
            `Error ${error.response.status}: ${error.response.data.trace}`
          );
        }
      } else {
        console.log("Network error or server not responding.");
      }
    }
  };

  const handleView = (data) => {
    console.log("Student Data:", data);
    navigate("/dashboard", { state: { student: data } });
  };

  return (
    <div className="overflow-x-auto bg-gray-800 p-6 rounded-md shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400">View Students</h2>

      <div className="mb-6 flex flex-wrap md:flex-nowrap gap-4 items-center">
        <select
          className="border border-emerald-500 px-4 py-2 rounded bg-gray-600 text-black w-full md:w-1/4"
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          <option value="dcs">DCS</option>
          <option value="deee">DEEE</option>
          <option value="dme">DME</option>
          <option value="dce">DCE</option>
          <option value="dmt">DMT</option>
        </select>
        <select
          className="border border-emerald-500 px-4 py-2 rounded bg-gray-600 text-black w-full md:w-1/4"
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">Select Semester</option>
          {[...Array(6)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{`${i + 1}`}</option>
          ))}
        </select>
        <select
          className="border border-emerald-500 px-4 py-2 rounded bg-gray-600 text-black w-full md:w-1/4"
          onChange={(e) => setSection(e.target.value)}
        >
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <button
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition w-full md:w-auto"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-700 rounded-md shadow-md">
        <thead className="bg-emerald-700 text-black">
          <tr>
            <th className="py-2 px-4 border border-gray-600">Registration Number</th>
            <th className="py-2 px-4 border border-gray-600">Name</th>
            <th className="py-2 px-4 border border-gray-600">Department</th>
            <th className="py-2 px-4 border border-gray-600">Semester</th>
            <th className="py-2 px-4 border border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="odd:bg-gray-700 even:bg-gray-600 text-white">
              <td className="py-2 px-4 border border-gray-600 text-center">
                {String(student.registrationNumber).toUpperCase()}
              </td>
              <td className="py-2 px-4 border border-gray-600 text-center">
                {String(student.name).toUpperCase()}
              </td>
              <td className="py-2 px-4 border border-gray-600 text-center">
                {String(student.department).toUpperCase()}
              </td>
              <td className="py-2 px-4 border border-gray-600 text-center">
                {student.sem}
              </td>
              <td className="py-2 px-4 border border-gray-600 text-center">
                <button
                  className="bg-blue-500 text-white px-5 py-1 rounded hover:bg-blue-700 transition"
                  onClick={() => handleView(student)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewStudentsTab;
