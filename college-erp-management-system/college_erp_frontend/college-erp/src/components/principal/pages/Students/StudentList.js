import React, { useState, useMemo, useEffect } from "react";
import Api from "../../../../Api";
import DataTable from "../../components/tables/DataTable";
import AddStudentsTab from "../../components/tabs/AddStudentsTab";
import DragDropCSVUpload from "../../../DragDropFileUpload";
import EditStudentModal from "./EditStudentModal";
import BulkEditStudentsModal from "./BulkEditStudentsModal";

const StudentList = ({ initialDepartment = "" }) => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState(initialDepartment || "ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState("registrationNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/student/all-students");
      const studentsData = (response.data?.data || []).map((s) => ({
        ...s,
        department: s.department ? s.department.toUpperCase() : "UNKNOWN",
      }));
      setStudents(studentsData);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (initialDepartment && initialDepartment !== "ALL") {
      setDepartment(initialDepartment.toUpperCase());
      setCurrentPage(1); // Reset to first page when department changes
    } else {
      setDepartment("ALL");
    }
  }, [initialDepartment]);

  // Debug: Log department changes
  useEffect(() => {
    console.log("Department filter changed to:", department);
    console.log("Total students:", students.length);
  }, [department, students.length]);

  const getUniqueDepartments = () => {
    const departments = [...new Set(students.map((s) => s.department))];
    return departments.sort();
  };

  const columns = [
    "Registration Number",
    "Name",
    "Department",
    "Semester",
    "Section",
    "Actions",
  ];

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter((s) => {
      // Search for register number only as requested
      const matchesSearch = (s.registrationNumber || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      // Department filtering - ensure proper comparison
      const studentDept = (s.department || "").toUpperCase().trim();
      const filterDept = (department || "ALL").toUpperCase().trim();

      const matchesDepartment =
        filterDept === "ALL" ||
        filterDept === "" ||
        studentDept === filterDept;

      return matchesSearch && matchesDepartment;
    });

    return filtered.sort((a, b) => {
      let aVal = (a[sortBy] || "").toString().toLowerCase();
      let bVal = (b[sortBy] || "").toString().toLowerCase();
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [students, searchTerm, sortBy, sortOrder, department]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * studentsPerPage;
    return filteredAndSortedStudents.slice(start, start + studentsPerPage);
  }, [filteredAndSortedStudents, currentPage, studentsPerPage]);

  const totalPages = Math.ceil(
    filteredAndSortedStudents.length / studentsPerPage
  );

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.name}?`)) return;
    try {
      const response = await Api.delete(
        `/student/delete?registrationNumber=${student.registrationNumber}`
      );
      if (response.status === 200) {
        alert("Student deleted successfully!");
        window.location.reload(); // Refresh to update list
      }
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
      await Api.post("/student/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("CSV uploaded successfully!");
      window.location.reload();
    } catch {
      alert("Upload failed.");
    } finally {
      setUploading(false);
      setCsvFile(null);
    }
  };

  const DownloadStudentCSV = () => {
    const link = document.createElement("a");
    link.href = "/csv files/studentcsv.csv";
    link.download = "studentcsv.csv";
    link.click();
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

  const handleBulkEdit = () => {
    if (filteredAndSortedStudents.length === 0) {
      alert("No students to edit. Please adjust your filters.");
      return;
    }
    setShowBulkEditModal(true);
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
      <div className="flex flex-wrap justify-center items-center gap-2 mt-12">
        {[
          ["First", 1, currentPage === 1],
          ["Prev", currentPage - 1, currentPage === 1],
        ].map(([text, page, disabled]) => (
          <button
            key={text}
            onClick={() => setCurrentPage(page)}
            disabled={disabled}
            className="px-4 py-2 bg-emerald-500/5 text-emerald-700 rounded-xl hover:bg-emerald-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold uppercase tracking-widest transition-all duration-300 border border-emerald-500/10 shadow-sm"
          >
            {text}
          </button>
        ))}
        {pages.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-4 py-2 rounded-xl text-base font-bold transition-all duration-300 ${currentPage === num
              ? "bg-emerald-500 text-white shadow-lg"
              : "bg-white text-gray-500 hover:text-emerald-600 border border-gray-100 shadow-sm"
              }`}
          >
            {num}
          </button>
        ))}
        {[
          ["Next", currentPage + 1, currentPage === totalPages],
          ["Last", totalPages, currentPage === totalPages],
        ].map(([text, page, disabled]) => (
          <button
            key={text}
            onClick={() => setCurrentPage(page)}
            disabled={disabled}
            className="px-4 py-2 bg-emerald-500/5 text-emerald-700 rounded-xl hover:bg-emerald-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold uppercase tracking-widest transition-all duration-300 border border-emerald-500/10 shadow-sm"
          >
            {text}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="p-4 sm:p-10 max-w-7xl mx-auto text-gray-900">
        {showAddStudent ? (
          <AddStudentsTab onClose={() => setShowAddStudent(false)} />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-center sm:text-left text-emerald-600 classic-heading">
                Student <span className="font-light italic text-gray-400">Registry</span>
              </h1>
              <div className="flex gap-3">
                <button
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95"
                  onClick={handleBulkEdit}
                >
                  📝 Bulk Edit Students
                </button>
                <button
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-95"
                  onClick={() => setShowOptions(true)}
                >
                  Enroll Student
                </button>
              </div>
            </div>


            {showOptions && (
              <div className="mb-10 p-8 glass rounded-[2.5rem] flex flex-col items-center gap-5 w-full sm:w-[28rem] mx-auto shadow-2xl animate-float">
                <p className="text-base font-bold text-emerald-600 classic-heading">
                  Intake Mode
                </p>
                <button
                  className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 w-full text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-95"
                  onClick={() => {
                    setShowAddStudent(true);
                    setShowOptions(false);
                  }}
                >
                  Direct Enrollment
                </button>
                <div className="w-full text-center">
                  <DragDropCSVUpload
                    onChange={(file) =>
                      setCsvFile(file.target ? file.target.files[0] : file)
                    }
                  />
                  <button
                    onClick={DownloadStudentCSV}
                    className="mt-4 mb-2 text-base font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>📥</span> Download Academic Manifest Template
                  </button>
                  {csvFile && (
                    <div className="mt-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-700 flex justify-between items-center">
                      <span className="text-base font-bold truncate pr-3">{csvFile.name}</span>
                      <button
                        className="text-red-500 hover:text-red-700 font-bold"
                        onClick={() => setCsvFile(null)}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {csvFile && (
                    <button
                      className="mt-3 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 w-full text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Injest Registry"}
                    </button>
                  )}
                </div>
                <button
                  className="px-6 py-3 text-gray-400 hover:text-emerald-600 text-base font-bold uppercase tracking-widest transition-all"
                  onClick={() => setShowOptions(false)}
                >
                  Decline
                </button>
              </div>
            )}

            {/* Department Filter Section */}
            <div className="mb-8 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-base">🏢</span>
                </div>
                <label
                  htmlFor="departmentFilter"
                  className="text-base font-bold text-gray-400 uppercase tracking-[0.2em]"
                >
                  Filter by Department
                </label>
              </div>
              <div className="flex-grow flex items-center gap-4">
                <select
                  id="departmentFilter"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-grow sm:flex-grow-0 px-6 py-3 bg-white border border-emerald-500/10 rounded-xl text-gray-700 font-bold text-base uppercase tracking-widest focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none min-w-[200px] shadow-sm cursor-pointer"
                >
                  <option value="ALL">All Departments</option>
                  {getUniqueDepartments().map((dept) => (
                    <option key={dept} value={dept}>
                      {dept ? dept.toUpperCase() : "UNKNOWN"}
                    </option>
                  ))}
                </select>
                <span className="text-base font-bold text-emerald-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">
                  {filteredAndSortedStudents.length} Records
                </span>
              </div>
            </div>

            <div className="bg-emerald-500/5 rounded-[2rem] p-10 mb-12 shadow-sm border border-emerald-500/10">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-base font-bold text-emerald-700 uppercase tracking-[0.3em] mb-6">
                  Institutional Student Search
                </h3>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search by Registration Number only..."
                    className="w-full pl-6 pr-6 py-5 bg-white text-gray-900 border border-emerald-500/20 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all placeholder:text-gray-300 text-base shadow-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="h-6 w-[1px] bg-gray-200" />
                    <span className="text-base font-bold text-emerald-500 uppercase tracking-widest pl-2">Reg ID</span>
                  </div>
                </div>
                <p className="mt-4 text-base text-gray-400 font-medium uppercase tracking-tight">
                  Displaying records matching secure identification
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-10 pt-8 border-t border-gray-100 gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-base font-bold text-gray-400 uppercase tracking-widest">Sort Manifest</span>
                <div className="flex gap-2">
                  {[
                    ["name", "Name"],
                    ["registrationNumber", "Reg No"],
                  ].map(([field, label]) => (
                    <button
                      key={field}
                      onClick={() => handleSort(field)}
                      className={`text-base uppercase font-bold tracking-widest px-4 py-2 rounded-lg transition-all duration-300 ${sortBy === field
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                      {label}
                      {sortBy === field && (
                        <span className="ml-2">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-base font-bold text-gray-400 uppercase tracking-widest">
                Listing {paginatedStudents.length} of{" "}
                {filteredAndSortedStudents.length} Students
              </div>
            </div>

            {students.length > 0 && (
              <div className="overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={paginatedStudents.map((s) => ({
                    registrationnumber: s.registrationNumber,
                    name: s.name,
                    department: s.department.toUpperCase(),
                    semester: `Sem ${s.sem}`,
                    section: `Sec ${s.section}`,
                    actions: (
                      <div className="flex gap-1 sm:gap-2 justify-center">
                        <button
                          className="px-3 py-1.5 bg-amber-500/5 hover:bg-amber-500 text-amber-600 hover:text-white rounded-lg text-base font-bold uppercase tracking-widest border border-amber-500/10 transition-all duration-300"
                          onClick={() => handleEdit(s)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1.5 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-base font-bold uppercase tracking-widest border border-red-500/10 transition-all duration-300"
                          onClick={() => handleDelete(s)}
                        >
                          Delete
                        </button>
                      </div>
                    ),
                  }))}
                />
                {renderPagination()}
              </div>
            )}

            {students.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-base mb-2">
                  No students loaded
                </div>
                <div className="text-gray-500">
                  Select department, semester and section, then click "Load
                  Students"
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {showModal && (
        <EditStudentModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onUpdate={fetchStudents}
          student={selectedStudent}
        />
      )}
      {showBulkEditModal && (
        <BulkEditStudentsModal
          show={showBulkEditModal}
          onClose={() => setShowBulkEditModal(false)}
          onUpdate={fetchStudents}
          students={filteredAndSortedStudents}
        />
      )}
    </>
  );
};

export default StudentList;




