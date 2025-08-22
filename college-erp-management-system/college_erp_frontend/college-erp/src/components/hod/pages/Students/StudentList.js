import React, { useState, useMemo } from "react";
import Api from "../../../../Api";
import DataTable from "../../components/tables/DataTable";
import AddStudentsTab from "../../components/tabs/AddStudentsTab";
import DragDropCSVUpload from "../../../DragDropFileUpload";
import EditStudentModal from "./EditStudentModal";

const StudentList = ({ department }) => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ semester: "", section: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState("registrationNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const columns = ["Registration Number", "Name", "Department", "Semester", "Section", "Actions"];

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aVal = (a[sortBy] || "").toString().toLowerCase();
      let bVal = (b[sortBy] || "").toString().toLowerCase();
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [students, searchTerm, sortBy, sortOrder]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * studentsPerPage;
    return filteredAndSortedStudents.slice(start, start + studentsPerPage);
  }, [filteredAndSortedStudents, currentPage, studentsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / studentsPerPage);

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.name}?`)) return;
    try {
      await Api.delete(`/student/delete?registrationNumber=${student.registrationNumber}`);
      alert("Student deleted successfully!");
      fetchStudents();
    } catch {
      alert("Failed to delete student.");
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleUpload = async () => {
    if (!csvFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", csvFile);
    try {
      await Api.post("/student/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("CSV uploaded successfully!");
      fetchStudents();
    } catch {
      alert("Upload failed.");
    } finally {
      setUploading(false);
      setCsvFile(null);
    }
  };

  const fetchStudents = async () => {
    if (!filters.semester && !filters.section) {
      alert("Select semester and section.");
      return;
    }
    setLoading(true);
    try {
      const response = await Api.get("/student/all", {
        params: { department, semester: parseInt(filters.semester), section: filters.section }
      });
      setStudents(response.data?.data || []);
      setCurrentPage(1);
    } catch {
      alert("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
        {[
          ["First", 1, currentPage === 1],
          ["Prev", currentPage - 1, currentPage === 1]
        ].map(([text, page, disabled]) => (
          <button key={text} onClick={() => setCurrentPage(page)} disabled={disabled}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
            {text}
          </button>
        ))}
        {pages.map(num => (
          <button key={num} onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded text-sm ${currentPage === num ? "bg-emerald-600 text-white" : "bg-gray-700 text-white hover:bg-gray-600"}`}>
            {num}
          </button>
        ))}
        {[
          ["Next", currentPage + 1, currentPage === totalPages],
          ["Last", totalPages, currentPage === totalPages]
        ].map(([text, page, disabled]) => (
          <button key={text} onClick={() => setCurrentPage(page)} disabled={disabled}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
            {text}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="p-3 sm:p-5 max-w-7xl mx-auto text-white">
        {showAddStudent ? (
          <AddStudentsTab onClose={() => setShowAddStudent(false)} />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Student Management</h1>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm sm:text-base"
                onClick={() => setShowOptions(true)}>Add New Student</button>
            </div>

            {showOptions && (
              <div className="mb-6 p-4 sm:p-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex flex-col items-center gap-3 w-full sm:w-96 mx-auto shadow-lg">
                <p className="text-base sm:text-lg font-semibold text-center">Choose an option:</p>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full text-sm sm:text-base"
                  onClick={() => { setShowAddStudent(true); setShowOptions(false); }}>Add Individually</button>
                <div className="w-full text-center">
                  <DragDropCSVUpload onChange={(file) => setCsvFile(file.target ? file.target.files[0] : file)} />
                  {csvFile && (
                    <div className="mt-2 p-2 bg-gray-700 border border-gray-600 rounded text-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-sm break-all">{csvFile.name}</span>
                      <button className="text-red-500 hover:text-red-700 text-lg sm:ml-2" onClick={() => setCsvFile(null)}>×</button>
                    </div>
                  )}
                  {csvFile && (
                    <button className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full text-sm sm:text-base"
                      onClick={handleUpload} disabled={uploading}>{uploading ? "Uploading..." : "Upload File"}</button>
                  )}
                </div>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full text-sm sm:text-base"
                  onClick={() => { const l = document.createElement("a"); l.href = "/csv files/studentcsv.csv"; l.download = "studentcsv.csv"; l.click(); }}>
                  Download Sample CSV
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full text-sm sm:text-base"
                  onClick={() => setShowOptions(false)}>Cancel</button>
              </div>
            )}

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 sm:p-5 mb-6 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {[
                  ["Semester", "semester", [...Array(6)].map((_, i) => [`Semester ${i+1}`, i+1])],
                  ["Section", "section", ["A", "B", "C", "D"].map(s => [`Section ${s}`, s])]
                ].map(([label, key, options]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2">{label}</label>
                    <select className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-emerald-500 focus:outline-none"
                      value={filters[key]} onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value }))}>
                      <option value="">All {label}s</option>
                      {options.map(([text, val]) => <option key={val} value={val}>{text}</option>)}
                    </select>
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-2">Search Students</label>
                  <input type="text" placeholder="Name, Reg Number, Department..." 
                    className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-emerald-500 focus:outline-none"
                    value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                </div>
                <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
                  onClick={fetchStudents} disabled={loading}>{loading ? "Loading..." : "Load Students"}</button>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 pt-4 border-t border-gray-700 gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-300">Sort by:</span>
                  {[["name", "Name"], ["registrationNumber", "Reg No"]].map(([field, label]) => (
                    <button key={field} onClick={() => handleSort(field)}
                      className={`text-xs px-2 py-1 rounded ${sortBy === field ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                      {label}{sortBy === field && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-300">
                  Showing {paginatedStudents.length} of {filteredAndSortedStudents.length} students
                  {searchTerm && ` (filtered from ${students.length} total)`}
                </div>
              </div>
            </div>

            {students.length > 0 && (
              <div className="overflow-x-auto">
                <DataTable columns={columns} data={paginatedStudents.map(s => ({
                  registrationnumber: s.registrationNumber,
                  name: s.name,
                  department: s.department.toUpperCase(),
                  semester: `Sem ${s.sem}`,
                  section: `Sec ${s.section}`,
                  actions: (
                    <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                      <button className="text-xs sm:text-sm px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
                        onClick={() => handleEdit(s)}>Edit</button>
                      <button className="text-xs sm:text-sm px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                        onClick={() => handleDelete(s)}>Delete</button>
                    </div>
                  )
                }))} />
                {renderPagination()}
              </div>
            )}

            {students.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No students loaded</div>
                <div className="text-gray-500">Select semester and section, then click "Load Students"</div>
              </div>
            )}
          </>
        )}
      </div>
      {showModal && (
        <EditStudentModal show={showModal} onClose={() => setShowModal(false)} 
          onUpdate={fetchStudents} student={selectedStudent} />
      )}
    </>
  );
};

export default StudentList;