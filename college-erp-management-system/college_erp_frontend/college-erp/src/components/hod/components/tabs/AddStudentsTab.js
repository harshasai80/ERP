import { useState } from "react";
import Api from "../../../../Api";

const AddStudentsTab = ({ department, onClose }) => {
  const [student, setStudent] = useState({
    name: "",
    registrationNumber: "",
    section: "",
    department: department || "",
    sem: 0,
    parentPhone: "",
    parentEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: name === "sem" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirm = window.confirm(
      `Are you sure you want to add:\nName: ${student.name},\nRegister Number: ${student.registrationNumber},\nDepartment: ${student.department},\nSemester: ${student.sem}\n?`
    );
    try {
      if (confirm) {
        const response = await Api.post("/student/add", student);
        alert("Student added successfully!");
        console.log(JSON.stringify(response.data));
        onClose?.(); // optional chaining in case onClose is not provided
      }
    } catch (error) {
      if (error.response) {
        alert(`Error ${error.response.status}: ${error.response.data.message}`);
      } else {
        alert("Network error or server not responding.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white">
      <div className="bg-gray-900 shadow-xl rounded-2xl border border-gray-700 w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-emerald-400">Add Student</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-base font-bold">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium">Register Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={student.registrationNumber}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium">Section</label>
            <select
              name="section"
              value={student.section}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded mt-1 text-white"
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 font-medium">Department</label>
            <select
              name="department"
              value={student.department}
              onChange={handleChange}
              required
              disabled={!!department}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded mt-1 text-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <option value="">Select Department</option>
              <option value="DCS">Computer Science</option>
              <option value="DCE">Civil Engineering</option>
              <option value="DEEE">Electrical and Electronics Engineering</option>
              <option value="DME">Mechanical Engineering</option>
              <option value="DMT">Metallurgy</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 font-medium">Semester</label>
            <select
              name="sem"
              value={student.sem}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded mt-1 text-white"
            >
              <option value="">Select Semester</option>
              {[...Array(6).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 font-medium">Parent Mobile Number</label>
            <input
              type="text"
              name="parentPhone"
              value={student.parentPhone}
              onChange={handleChange}
              placeholder="Ex: +919012345678"
              required
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium">Parent Email</label>
            <input
              type="email"
              name="parentEmail"
              value={student.parentEmail}
              onChange={handleChange}
              placeholder="Ex: parent@example.com"
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded mt-4 transition"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentsTab;




