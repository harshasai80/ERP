import React, { useState } from "react";
import Api from "../../../../Api";
import DataTable from "../../components/tables/DataTable";
import DragDropCSVUpload from "../../../DragDropFileUpload";
import AddFacultyTab from "../../components/tabs/AddFacultyTab";

const FacultyList = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showAddFaculty, setShowAddFaculty] = useState(false);

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

  const handleFileUpload = (file) => {
    if (file.target) {
      setSelectedFile(file.target.files[0]);
    } else {
      setSelectedFile(file);
    }
    console.log("Selected file:", file.target ? file.target.files[0] : file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await Api.post("/faculty/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload success:", response.data);
      alert("CSV file uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload CSV file.");
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      {showAddFaculty ? (
        <AddFacultyTab onClose={() => setShowAddFaculty(false)} />
      ) : (
        <>
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
            <div className="mb-5 p-5 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg rounded-xl flex flex-col items-center gap-3 w-96 mx-auto">
              <p className="text-lg font-semibold text-white">Choose an option:</p>
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full"
                onClick={() => {
                  setShowAddFaculty(true);
                  setShowUpload(false);
                }}
              >
                Add Individually
              </button>

              <div className="w-full text-center">
                <DragDropCSVUpload onChange={handleFileUpload} />

                {selectedFile && (
                  <div className="mt-2 p-2 bg-gray-800 border border-gray-700 rounded text-white flex justify-between items-center">
                    <span>{selectedFile.name}</span>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => setSelectedFile(null)}
                    >
                      ×
                    </button>
                  </div>
                )}

                {selectedFile && (
                  <button
                    className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload File"}
                  </button>
                )}
              </div>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </button>
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
        </>
      )}
    </div>
  );
};

export default FacultyList;