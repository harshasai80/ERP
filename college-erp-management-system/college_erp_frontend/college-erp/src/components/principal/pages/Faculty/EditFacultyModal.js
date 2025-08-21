import React, { useState } from "react";
import { toast } from "react-toastify";
import Api from "../../../../Api";

const EditFacultyModal = ({ show, onClose, onUpdate, faculty }) => {
  const [name, setName] = useState(faculty.name);
  const [email, setEmail] = useState(faculty.email);
  const [department, setDepartment] = useState(faculty.department);
  const [role, setRole] = useState(faculty.role);

  const handleSave = async () => {
    try {
      const response = await Api.put(`/faculty/update?email=${faculty.email}`, {
        name,
        email,
        department,
        role,
      });

      if (response.status === 200) {
        toast.success("✅ Faculty updated successfully!");
        onUpdate();
        onClose();
      } else {
        toast.error("❌ Failed to update faculty.");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("❌ Error updating faculty.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg shadow-2xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-white hover:text-red-400 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-emerald-300 text-2xl font-semibold mb-4">
          Edit Faculty
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-emerald-200 mb-1">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-emerald-200 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-emerald-200 mb-1">
              Department
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-emerald-500"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-emerald-200 mb-1">Role</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-emerald-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md text-white font-medium transition"
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button
            className="bg-gray-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-medium transition ease-in-out duration-500"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFacultyModal;
