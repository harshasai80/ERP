import React, { useState, useEffect } from "react";
import Api from "../../../../Api";
import DataTable from "../../components/tables/DataTable";
import AddStudentsTab from "../../components/tabs/AddStudentsTab";
import DragDropCSVUpload from "../../../DragDropFileUpload";

const StudentList = ({ department }) => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [students, setStudents] = useState([]);

  // Simulate HOD info (replace this with real data from auth or API)
  const [hodInfo, setHodInfo] = useState({ department: "CSE" });

  const [filters, setFilters] = useState({
    semester: "",
    section: "",
  });

  const columns = ["Registration Number", "Name", "Department", "Semester", "Section"];

  useEffect(() => {
    // Fetch HOD info if from an API or global context
    // Example: setHodInfo(authContext.user);
  }, []);

  const handleFileUpload = (file) => {
    if (file.target) {
      setCsvFile(file.target.files[0]);
    } else {
      setCsvFile(file);
    }
  };

  const handleUpload = async () => {
    if (!csvFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      await Api.post("/student/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("CSV file uploaded successfully!");
    } catch (error) {
      alert("Failed to upload CSV file.");
    } finally {
      setUploading(false);
      setCsvFile(null);
    }
  };

  const fetchStudents = async () => {
    const { semester, section } = filters;

    if (!semester || !section) {
      alert("Please select semester and section.");
      return;
    }

    try {
      const response = await Api.get("/student/all", {
        params: {
          department: department,
          semester: parseInt(semester),
          section,
        },
      });
      const result = response.data?.data || [];
      setStudents(result);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to fetch student data.");
    }
  };

  return (
    <div className="p-5 max-w-6xl mx-auto text-white">
      {showAddStudent ? (
        <AddStudentsTab onClose={() => setShowAddStudent(false)} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Student List</h1>
            <button
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              onClick={() => setShowOptions(true)}
            >
              Add New Student
            </button>
          </div>

          {showOptions && (
            <div className="mb-5 p-5 bg-gray-800 rounded-xl flex flex-col items-center gap-3 w-96 mx-auto shadow-lg">
              <p className="text-lg font-semibold">Choose an option:</p>
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full"
                onClick={() => {
                  setShowAddStudent(true);
                  setShowOptions(false);
                }}
              >
                Add Individually
              </button>

              <div className="w-full text-center">
                <DragDropCSVUpload onChange={handleFileUpload} />

                {csvFile && (
                  <div className="mt-2 p-2 bg-gray-700 border border-gray-600 rounded text-white flex justify-between items-center">
                    <span>{csvFile.name}</span>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => setCsvFile(null)}
                    >
                      ×
                    </button>
                  </div>
                )}

                {csvFile && (
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
                onClick={() => setShowOptions(false)}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Filter Section (no department input) */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5 items-center">
            <select
              className="p-2 bg-gray-800 text-white border border-gray-700 rounded"
              value={filters.semester}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, semester: e.target.value }))
              }
            >
              <option value="">Semester</option>
              {[1, 2, 3, 4, 5, 6].map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
            <select
              className="p-2 bg-gray-800 text-white border border-gray-700 rounded"
              value={filters.section}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, section: e.target.value }))
              }
            >
              <option value="">Section</option>
              {["A", "B", "C", "D"].map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
            <button
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              onClick={fetchStudents}
            >
              Search
            </button>
          </div>

          <DataTable
            columns={columns}
            data={students.map((s) => ({
              "Registration Number": s.registrationNumber,
              Name: s.name,
              Department: s.department,
              Semester: s.sem,
              Section: s.section,
            }))}
          />
        </>
      )}
    </div>
  );
};

export default StudentList;
