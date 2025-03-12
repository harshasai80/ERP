import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddStudentsTab = () => {
  const [student, setStudent] = useState({
    name: "",
    registerNumber: "",
    department: "",
    semester: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Data Submitted:", student);
    // You can add API call logic here to store student data
    alert("Student added successfully!");
    navigate("/faculty-dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Register Number</label>
            <input
              type="text"
              name="registerNumber"
              value={student.registerNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Department</label>
            <input
              type="text"
              name="department"
              value={student.department}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Semester</label>
            <input
              type="number"
              name="semester"
              value={student.semester}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#9569D8] hover:bg-[#6f48a3] text-white p-2 rounded mt-4"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentsTab;
