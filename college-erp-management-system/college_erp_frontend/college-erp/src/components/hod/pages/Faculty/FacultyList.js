import React, { useState } from "react";
import Api from "../../../../Api";
import DataTable from "../../components/tables/DataTable";

const FacultyList = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleView = (facultyId) => {
    alert(`View details for faculty ID: ${facultyId}`);
  };

  const handleEdit = (facultyId) => {
    alert(`Edit faculty with ID: ${facultyId}`);
  };

  const handleDelete = (facultyId) => {
    alert(`Delete faculty with ID: ${facultyId}`);
  };

  const columns = [
    "ID",
    "Name",
    "Department",
    "Position",
    "Contact",
    "Actions",
  ];

  const facultyData = [
    {
      id: "F001",
      name: "Dr. John Smith",
      department: "Mathematics",
      position: "Senior Professor",
      contact: "john.smith@school.edu",
      actions: (
        <div className="flex gap-2 justify-center">
          <button
            className="px-2 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => handleView("F001")}
          >
            View
          </button>
          <button
            className="px-2 py-1 text-black bg-yellow-400 rounded hover:bg-yellow-500"
            onClick={() => handleEdit("F001")}
          >
            Edit
          </button>
          <button
            className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
            onClick={() => handleDelete("F001")}
          >
            Delete
          </button>
        </div>
      ),
    },
    {
      id: "F002",
      name: "Prof. Sarah Johnson",
      department: "Science",
      position: "HOD",
      contact: "sarah.j@school.edu",
      actions: (
        <div className="flex gap-2 justify-center">
          <button
            className="px-2 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => handleView("F002")}
          >
            View
          </button>
          <button
            className="px-2 py-1 text-black bg-yellow-400 rounded hover:bg-yellow-500"
            onClick={() => handleEdit("F002")}
          >
            Edit
          </button>
          <button
            className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
            onClick={() => handleDelete("F002")}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleAddFaculty = () => {
    setShowUpload(true);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await Api.post("/faculty/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data);
        alert(`File uploaded successfully: ${response.data}`);
      } catch (error) {
        alert(
          `Upload failed: ${error.response?.data?.message || error.message}`
        );
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Faculty List</h1>
        <button
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
          onClick={handleAddFaculty}
        >
          Add New Faculty
        </button>
      </div>

      {showUpload && (
        <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Upload Faculty CSV</h2>
          <input
            type="file"
            accept=".csv"
            className="p-2 bg-gray-900 border border-gray-600 rounded w-full text-white"
            onChange={handleFileChange}
          />
          {selectedFile && (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              onClick={handleUpload}
            >
              Upload
            </button>
          )}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search faculty..."
          className="flex-1 p-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-400"
        />
        <select className="p-2 bg-gray-900 border border-gray-600 rounded text-white">
          <option value="">All Departments</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
          <option value="History">History</option>
          <option value="Computer Science">Computer Science</option>
        </select>
      </div>

      <DataTable columns={columns} data={facultyData} />
    </div>
  );
};

export default FacultyList;