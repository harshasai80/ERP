import { useState } from "react";
import Api from "../../Api";

const AddStudentsTab = () => {
  const [student, setStudent] = useState({
    name: "",
    registrationNumber: "",
    department: "",
    sem: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirm = window.confirm(`Are you sure you want to add: \nName: ${student.name},\nRegister Number: ${student.registrationNumber},\nDepartment: ${student.department},\nSemester: ${student.sem}\n?`)
    console.log("Student Data Submitted:", student);
    try{
      if (confirm) {
        const response=await Api.post(
          "/student/add",student
        )
        alert("Student added successfully!");
        console.log(JSON.stringify(response.data));

      }
      
    }
    catch(error){
      if (error.response) {
        // ✅ Check HTTP status from error response
        alert(`Error ${error.response.status}: ${error.response.statusText}`);
      } else {
        alert("Network error or server not responding.");
      }
    };
  }
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
              name="registrationNumber"
              value={student.registrationNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Department</label>
            <select
              name="department"
              value={student.department}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1"
            >
              <option value="">Select Department</option>
              <option value="DCS">Computer Science</option>
              <option value="DCE">Civil Engineering</option>
              <option value="DEEE">Electrical and electronics Engineering</option>
              <option value="DME">Mechanical Engineering</option>
              <option value="DMT">Metallurgy</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Semester</label>
            <input
              type="number"
              name="sem"
              value={student.sem}
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
