import React, { useState } from "react";
import Api from "../../Api";

const ViewStudentsTab = () => {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [students, setStudents] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.get(
        `/student/all?department=${department}&semester=${semester}`,
        null,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      setStudents(response.data.data);
    } catch (error) {
        setStudents([]);
        if (error.response) {
            if (error.response.status === 404) {
                alert(`Error ${error.response.status}: ${error.response.data.message}`)
            } else{

            }
        } else {
            console.log("Network error or server not responding.")
        }
      
    }
  };

  const handleDelete = (id) => {
    console.log(`Student with ID ${id} deleted.`);
    // Implement delete logic here (e.g., API call)
  };

  const handleView = (id) => {
    console.log(`Viewing details for student ID ${id}`);
    // Implement view logic here (e.g., navigation or modal)
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">View Students</h2>

      <div className="mb-4 flex gap-4">
        <select
          className="border px-4 py-2 rounded w-1/3"
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
          className="border px-4 py-2 rounded w-1/3"
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">Select Semester</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg">
        <thead className="bg-[#3D3A63] text-white">
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Registration Number</th>
            <th className="py-2 px-4 border">Department</th>
            <th className="py-2 px-4 border">Semester</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="odd:bg-white even:bg-gray-100">
              <td className="py-2 px-4 border text-center">{student.id}</td>
              <td className="py-2 px-4 border">{student.name}</td>
              <td className="py-2 px-4 border">{student.registrationNumber}</td>
              <td className="py-2 px-4 border">{student.department}</td>
              <td className="py-2 px-4 border text-center">{student.sem}</td>
              <td className="py-2 px-4 border text-center">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                  onClick={() => handleView(student.id)}
                >
                  View
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
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
