import { useState } from "react";
import Api from "../../../../Api";

const AddStudentsTab = () => {
  const [student, setStudent] = useState({
    name: "",
    registrationNumber: "",
    section: "",
    department: "",
    sem: 0,
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-lg border border-gray-300 w-[500px]">
        <h2 className="text-2xl font-bold text-center bg-[#9569D8] text-white p-3 rounded-t-lg">
          Add Student
        </h2>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1 focus:ring focus:ring-[#9569D8]"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Register Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={student.registrationNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1 focus:ring focus:ring-[#9569D8]"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Section</label>
            <select
              name="section"
              value={student.section}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1 focus:ring focus:ring-[#9569D8]"
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Department</label>
            <select
              name="department"
              value={student.department}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1 focus:ring focus:ring-[#9569D8]"
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
            <label className="block text-gray-700 font-medium">Semester</label>
            <select
              name="sem"
              value={student.sem}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1 focus:ring focus:ring-[#9569D8]"
            >
              <option value="">Select Semester</option>
              {[...Array(6).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#9569D8] hover:bg-[#6f48a3] text-white p-2 rounded mt-4 transition"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentsTab;