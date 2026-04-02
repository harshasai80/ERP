import React, { useState } from "react";
import Api from "../../../../Api";

const AddFacultyTab = ({ department, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: department || "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "department" || name === "role") {
      formattedValue = value.toUpperCase();
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Faculty Data:", formData);

    try {
      const response = await Api.post("/faculty/add", formData, {
        "Content-Type": "application/json",
      });

      const result = await response.data;
      console.log("Faculty added:", result);
      alert("Faculty added successfully!");

      onClose();
    } catch (error) {
      console.error("Error adding faculty:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong while submitting the form.";
      alert(errorMessage);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl text-white relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">Add New Faculty</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-base font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-base font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-base font-medium">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded disabled:opacity-70 disabled:cursor-not-allowed"
            required
            disabled={!!department}
          >
            <option value="">Select Department</option>
            <option value="DCS">Computer Science</option>
            <option value="DEEE">Electrical Engineering</option>
            <option value="DME">Mechanical Engineering</option>
            <option value="DCE">Civil Engineering</option>
            <option value="DMT">Metallurgical Engineering</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-base font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
            required
          >
            <option value="">Select Role</option>
            <option value="HOD">Head of Department</option>
            <option value="FACULTY">Faculty</option>
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Add Faculty
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFacultyTab;




