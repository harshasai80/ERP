import React, { useState, useEffect } from "react";
import Api from "../../../../Api";
import DataTable from "../../components/tables/DataTable";
import DragDropCSVUpload from "../../../DragDropFileUpload";
import AddFacultyTab from "../../components/tabs/AddFacultyTab";
import AddSubjectTab from "../../components/tabs/AddSubjectTab";
import EditFacultyModal from "./EditFacultyModal";

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

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);

  useEffect(() => {
    const fetchFaculties = async () => {
      setLoading(true);
      try {
        const response = await Api.get("/faculty/all", {
          params: { department },
        });
        const nonHodFaculties = response.data.data.filter(
          (faculty) => faculty.role !== "HOD"
        );
        setFaculties(nonHodFaculties || []);
      } catch (error) {
        console.error("Error fetching faculties:", error);
        alert("Failed to fetch faculty data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, [department]);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/faculty/all", {
        params: { department },
      });
      const nonHodFaculties = response.data.data.filter(
        (faculty) => faculty.role !== "HOD"
      );
      setFaculties(nonHodFaculties || []);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      alert("Failed to fetch faculty data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = () => {
    setShowSubjectUpload(false); // close subject panel
    setShowUpload(true);
  };

  const handleAddSubjects = () => {
    setShowUpload(false); // close faculty panel
    setShowAddFaculty(false); // in case AddFacultyTab is open
    setShowAddSubject(false); // in case AddSubjectTab is open
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
      await Api.post("/subjects/upload", formData, {
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

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    console.log("Edit faculty:", faculty);
    setShowModal(true);
  };

  const handleDelete = async (faculty) => {
    alert(`Do You want to delete "${faculty.name}"?`);
    try {
      const response = await Api.delete(
        `/faculty/delete?email=${faculty.email}`
      );
      if (response.status === 200) {
        alert("Faculty deleted successfully!");
        fetchFaculties();
      }
    } catch (error) {
      alert("Failed to delete faculty.");
    }
  };
  const handleDeleteAllSubjects = async () => {
    if (!window.confirm(`Are you sure you want to delete ALL subjects for ${department.toUpperCase()}? This action cannot be undone.`)) {
      return;
    }
    try {
      const response = await Api.delete(`/subjects/delete/all?department=${department}`);
      if (response.status === 200) {
        alert("All subjects deleted successfully!");
        setShowSubjectUpload(false);
      }
    } catch (error) {
      console.error("Failed to delete subjects:", error);
      alert("Failed to delete subjects. It might be because subjects are assigned to faculty or marks exist.");
    }
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
      <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
        <button
          className="px-2 py-1 text-base sm:text-base text-black bg-yellow-400 rounded hover:bg-yellow-500"
          onClick={() => handleEdit(faculty)}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 text-base sm:text-base text-white bg-red-600 rounded hover:bg-red-700"
          onClick={() => handleDelete(faculty)}
        >
          Delete
        </button>
      </div>
    ),
  }));

  const DownloadFacultyCSV = () => {
    const link = document.createElement("a");
    link.href = "/csv files/facultycsv.csv"; // Adjust path as needed
    link.download = "facultycsv.csv";
    link.click();
  };
  const DownloadSubjectCSV = () => {
    const link = document.createElement("a");
    link.href = "/csv files/subjectcsv.csv"; // Adjust path as needed
    link.download = "subjectcsv.csv";
    link.click();
  };

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto text-white">
      {showAddFaculty ? (
        <AddFacultyTab department={department} onClose={() => setShowAddFaculty(false)} />
      ) : showAddSubject ? (
        <AddSubjectTab onClose={() => setShowAddSubject(false)} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
              Faculty List
            </h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="px-4 sm:px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-base sm:text-base"
                onClick={handleAddFaculty}
              >
                Add New Faculty
              </button>
              <button
                className="px-4 sm:px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-base sm:text-base"
                onClick={handleAddSubjects}
              >
                Add Subjects (CSV)
              </button>
            </div>
          </div>

          {/* Upload Faculty CSV / Add Individually Options */}
          {showUpload && (
            <div className="mb-5 p-4 sm:p-5 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg rounded-xl flex flex-col items-center gap-3 w-full sm:w-96 mx-auto">
              <p className="text-base sm:text-base font-semibold text-white text-center">
                Choose an option:
              </p>
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full text-base sm:text-base"
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
                  <div className="mt-2 p-2 bg-gray-800 border border-gray-700 rounded text-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-base break-all">
                      {selectedFile.name}
                    </span>
                    <button
                      className="text-red-500 hover:text-red-700 text-base sm:ml-2"
                      onClick={() => setSelectedFile(null)}
                    >
                      ×
                    </button>
                  </div>
                )}
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full text-base sm:text-base"
                  onClick={DownloadFacultyCSV}
                >
                  Download Sample CSV
                </button>
                {selectedFile && (
                  <button
                    className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full text-base sm:text-base"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload File"}
                  </button>
                )}
              </div>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full text-base sm:text-base"
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Upload Subject CSV Only */}
          {showSubjectUpload && (
            <div className="mb-5 p-4 sm:p-5 bg-gray-900 shadow-lg rounded-xl flex flex-col items-center gap-3 w-full sm:w-96 mx-auto">
              <p className="text-base sm:text-base font-semibold text-center">
                Choose an option:
              </p>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full text-base sm:text-base font-semibold"
                onClick={() => {
                  setShowAddSubject(true);
                  setShowSubjectUpload(false);
                }}
              >
                Add Individually
              </button>
              <div className="w-full h-[1px] bg-gray-700 my-1"></div>
              <DragDropCSVUpload onChange={handleSubjectFileUpload} />
              {subjectFile && (
                <div className="mt-2 p-2 bg-gray-800 border border-gray-700 rounded text-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
                  <span className="text-base break-all">{subjectFile.name}</span>
                  <button
                    className="text-red-500 hover:text-red-700 text-base sm:ml-2"
                    onClick={() => setSubjectFile(null)}
                  >
                    ×
                  </button>
                </div>
              )}
              {subjectFile && (
                <button
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full text-base sm:text-base"
                  onClick={handleSubjectUpload}
                  disabled={uploadingSubject}
                >
                  {uploadingSubject ? "Uploading..." : "Upload File"}
                </button>
              )}
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full text-base sm:text-base font-semibold"
                onClick={DownloadSubjectCSV}
              >
                Download Sample CSV
              </button>
              <button
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full text-base sm:text-base font-bold shadow-lg"
                onClick={handleDeleteAllSubjects}
              >
                Delete All Subjects
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full text-base sm:text-base"
                onClick={() => setShowSubjectUpload(false)}
              >
                Cancel
              </button>
            </div>
          )}

          {showModal && (
            <EditFacultyModal
              show={showModal}
              faculty={selectedFaculty}
              onUpdate={fetchFaculties}
              onClose={() => setShowModal(false)}
            />
          )}

          {loading ? (
            <p className="text-center text-gray-300">Loading faculty data...</p>
          ) : (
            <div className="overflow-x-auto">
              <DataTable columns={columns} data={facultyData} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FacultyList;




