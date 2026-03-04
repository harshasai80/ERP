import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Api from "../../../../Api";
import DataTable from "../../components/tables/DataTable";
import DragDropCSVUpload from "../../../DragDropFileUpload";
import AddFacultyTab from "../../components/tabs/AddFacultyTab";
import EditFacultyModal from "./EditFacultyModal";

const FacultyList = ({ department }) => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("ALL"); // New state for department filter

  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showAddFaculty, setShowAddFaculty] = useState(false);

  const [showSubjectUpload, setShowSubjectUpload] = useState(false);
  const [subjectFile, setSubjectFile] = useState(null);
  const [uploadingSubject, setUploadingSubject] = useState(false);

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (department && department !== "ALL") {
      setSelectedDepartment(department);
    }
    fetchFaculties();
  }, [department]);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/faculty/all-faculties");
      const HodFaculties = response.data.data
        .filter((faculty) => faculty.department !== "SGP")
        .map((faculty) => ({
          ...faculty,
          department: faculty.department
            ? faculty.department.toUpperCase()
            : "UNKNOWN",
        }));
      setFaculties(HodFaculties);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      alert("Failed to fetch faculty data.");
    } finally {
      setLoading(false);
    }
  };

  // Get unique departments for the dropdown
  const getUniqueDepartments = () => {
    const departments = [...new Set(faculties.map(faculty => faculty.department))];
    return departments.sort();
  };

  // Filter faculties based on selected department
  const getFilteredFaculties = () => {
    if (selectedDepartment === "ALL") {
      return faculties;
    }
    return faculties.filter(faculty => faculty.department === selectedDepartment);
  };

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

  const columns = [
    { name: "Name", center: true },
    { name: "Email", center: true },
    { name: "Department", center: true },
    { name: "Actions", center: true },
  ];

  // Use filtered faculties for the table data
  const filteredFaculties = getFilteredFaculties();
  const facultyData = filteredFaculties.map((faculty) => ({
    name: faculty.name.toUpperCase(),
    email: faculty.email,
    department: faculty.department.toUpperCase(),
    actions: (
      <div className="flex flex-row gap-1 justify-center items-center">
        <button
          className="px-2 py-1 text-base text-black bg-yellow-400 rounded hover:bg-yellow-500 min-w-[45px]"
          onClick={() => handleEdit(faculty)}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 text-base text-white bg-red-600 rounded hover:bg-red-700 min-w-[50px]"
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
    <div className="p-4 sm:p-10 max-w-7xl mx-auto text-gray-900">
      {showAddFaculty ? (
        <AddFacultyTab onClose={() => setShowAddFaculty(false)} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-center sm:text-left text-emerald-600 classic-heading">
              Faculty <span className="font-light italic text-gray-400">Directorate</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-95"
                onClick={handleAddFaculty}
              >
                Enroll Faculty
              </button>
              <button
                className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95"
                onClick={handleAddSubjects}
              >
                Provision Subjects
              </button>
            </div>
          </div>

          {/* Institutional Filters */}
          <div className="mb-10 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <span className="text-base">🏢</span>
              </div>
              <label htmlFor="departmentFilter" className="text-base font-bold text-gray-400 uppercase tracking-[0.2em]">
                Filter by Faculty Department
              </label>
            </div>
            <div className="flex-grow flex items-center gap-4">
              <select
                id="departmentFilter"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="flex-grow sm:flex-grow-0 px-6 py-3 bg-white border border-emerald-500/10 rounded-xl text-gray-700 font-bold text-base uppercase tracking-widest focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none min-w-[200px] shadow-sm cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                {getUniqueDepartments().map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.toUpperCase()}
                  </option>
                ))}
              </select>
              <span className="text-base font-bold text-emerald-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">
                {filteredFaculties.length} Records
              </span>
            </div>
          </div>

          {/* Action Modals / Panels */}
          {showUpload && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12 p-8 glass rounded-[2.5rem] flex flex-col items-center gap-6 w-full max-w-md mx-auto shadow-2xl animate-float"
            >
              <p className="text-base font-bold text-emerald-600 classic-heading">
                Faculty Intake
              </p>
              <button
                className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 w-full text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-95"
                onClick={() => {
                  setShowAddFaculty(true);
                  setShowUpload(false);
                }}
              >
                Direct Entry
              </button>

              <div className="w-full text-center">
                <DragDropCSVUpload onChange={handleFileUpload} />
                {selectedFile && (
                  <div className="mt-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-700 flex justify-between items-center text-base font-bold">
                    <span className="truncate pr-2">{selectedFile.name}</span>
                    <button
                      className="text-red-500 hover:text-red-700 font-bold"
                      onClick={() => setSelectedFile(null)}
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    className="px-6 py-3 text-gray-400 hover:text-emerald-600 text-base font-bold uppercase tracking-widest transition-all"
                    onClick={DownloadFacultyCSV}
                  >
                    Download Manifest Template
                  </button>
                  {selectedFile && (
                    <button
                      className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 w-full text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Injest Faculty CSV"}
                    </button>
                  )}
                </div>
              </div>

              <button
                className="px-6 py-2 text-red-500 hover:text-red-700 text-base font-bold uppercase tracking-widest"
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </button>
            </motion.div>
          )}

          {showSubjectUpload && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12 p-8 glass rounded-[2.5rem] flex flex-col items-center gap-6 w-full max-w-md mx-auto shadow-2xl animate-float"
            >
              <p className="text-base font-bold text-emerald-600 classic-heading text-center">
                Provision Academic Subjects
              </p>
              <DragDropCSVUpload onChange={handleSubjectFileUpload} />
              {subjectFile && (
                <div className="mt-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-indigo-700 flex justify-between items-center w-full text-base font-bold">
                  <span className="truncate pr-2">{subjectFile.name}</span>
                  <button
                    className="text-red-500 hover:text-red-700 font-bold"
                    onClick={() => setSubjectFile(null)}
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-4 w-full">
                <button
                  className="px-6 py-3 text-gray-400 hover:text-indigo-600 text-base font-bold uppercase tracking-widest transition-all"
                  onClick={DownloadSubjectCSV}
                >
                  Download Subject Template
                </button>
                {subjectFile && (
                  <button
                    className="px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 w-full text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95"
                    onClick={handleSubjectUpload}
                    disabled={uploadingSubject}
                  >
                    {uploadingSubject ? "Uploading..." : "Provision Records"}
                  </button>
                )}
              </div>
              <button
                className="px-6 py-2 text-red-500 hover:text-red-700 text-base font-bold uppercase tracking-widest"
                onClick={() => setShowSubjectUpload(false)}
              >
                Cancel
              </button>
            </motion.div>
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
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
              <p className="mt-4 text-base font-bold text-gray-400 uppercase tracking-widest">Consulting Faculty Register...</p>
            </div>
          ) : (
            <DataTable columns={columns} data={facultyData} />
          )}
        </>
      )}
    </div>
  );
};

export default FacultyList;




