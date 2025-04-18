import React, { useState, useEffect } from "react";
import Api from "../../../../Api";
import DataTable from "../../components/tables/DataTable";
import DragDropCSVUpload from "../../../DragDropFileUpload";
import AddFacultyTab from "../../components/tabs/AddFacultyTab";

const FacultyList = ({ department }) => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showAddFaculty, setShowAddFaculty] = useState(false);

  const [showSubjectUpload, setShowSubjectUpload] = useState(false);
  const [subjectFile, setSubjectFile] = useState(null);
  const [uploadingSubject, setUploadingSubject] = useState(false);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/faculty/all", {
        params: { department },
      });
      setFaculties(response.data.data || []);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      alert("Failed to fetch faculty data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, [department]);

  const handleAddFaculty = () => {
    setShowSubjectUpload(false); // close subject panel
    setShowUpload(true);
  };

  const handleAddSubjects = () => {
    setShowUpload(false); // close faculty panel
    setShowAddFaculty(false); // in case AddFacultyTab is open
    setShowSubjectUpload(true);
  };

  const handleFileUpload = (file) => {
    if (file.target) {
      setSelectedFile(file.target.files[0]);
    } else {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await Api.post("/faculty/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("CSV file uploaded successfully!");
      fetchFaculties();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload CSV file.");
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const handleSubjectFileUpload = (file) => {
    if (file.target) {
      setSubjectFile(file.target.files[0]);
    } else {
      setSubjectFile(file);
    }
  };

  const handleSubjectUpload = async () => {
    if (!subjectFile) return;
    setUploadingSubject(true);
    const formData = new FormData();
    formData.append("file", subjectFile);
    try {
      await Api.post("/subject/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Subject CSV uploaded successfully!");
    } catch (error) {
      console.error("Subject upload failed:", error);
      alert("Failed to upload subject CSV.");
    } finally {
      setUploadingSubject(false);
      setSubjectFile(null);
    }
  };

  const handleEdit = (facultyId) => {
    alert(`Edit faculty with ID: ${facultyId}`);
  };

  const handleDelete = (facultyId) => {
    alert(`Delete faculty with ID: ${facultyId}`);
  };

  const columns = [
    { name: "Name", center: true },
    { name: "Email", center: true },
    { name: "Department", center: true },
    { name: "Actions", center: true },
  ];

  const facultyData = faculties.map((faculty) => ({
    name: faculty.name.toUpperCase(),
    email: faculty.email,
    department: faculty.department.toUpperCase(),
    actions: (
      <div className="flex gap-2 justify-center">
        <button
          className="px-2 py-1 text-black bg-yellow-400 rounded hover:bg-yellow-500"
          onClick={() => handleEdit(faculty.id)}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
          onClick={() => handleDelete(faculty.id)}
        >
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      {showAddFaculty ? (
        <AddFacultyTab onClose={() => setShowAddFaculty(false)} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Faculty List</h1>
            <div className="flex gap-3">
              <button
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
                onClick={handleAddFaculty}
              >
                Add New Faculty
              </button>
              <button
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
                onClick={handleAddSubjects}
              >
                Add Subjects (CSV)
              </button>
            </div>
          </div>

          {/* Upload Faculty CSV / Add Individually Options */}
          {showUpload && (
            <div className="mb-5 p-5 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg rounded-xl flex flex-col items-center gap-3 w-96 mx-auto">
              <p className="text-lg font-semibold text-white">
                Choose an option:
              </p>
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

          {/* Upload Subject CSV Only */}
          {showSubjectUpload && (
            <div className="mb-5 p-5 bg-gray-900 shadow-lg rounded-xl flex flex-col items-center gap-3 w-96 mx-auto">
              <p className="text-lg font-semibold">Upload Subject CSV</p>
              <DragDropCSVUpload onChange={handleSubjectFileUpload} />
              {subjectFile && (
                <div className="mt-2 p-2 bg-gray-800 border border-gray-700 rounded text-white flex justify-between items-center w-full">
                  <span>{subjectFile.name}</span>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => setSubjectFile(null)}
                  >
                    ×
                  </button>
                </div>
              )}
              {subjectFile && (
                <button
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full"
                  onClick={handleSubjectUpload}
                  disabled={uploadingSubject}
                >
                  {uploadingSubject ? "Uploading..." : "Upload File"}
                </button>
              )}
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
                onClick={() => setShowSubjectUpload(false)}
              >
                Cancel
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-300">Loading faculty data...</p>
          ) : (
            <DataTable columns={columns} data={facultyData} />
          )}
        </>
      )}
    </div>
  );
};

export default FacultyList;
