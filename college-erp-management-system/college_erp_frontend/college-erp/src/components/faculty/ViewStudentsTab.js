import React, { useState, useMemo } from "react";
import Api from "../../Api";

const ViewStudentsTab = () => {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("registrationNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(20);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!department || !semester || !section) {
      alert("Please select all fields");
      return;
    }
    
    setLoading(true);
    try {
      const response = await Api.get(
        `/student/all?department=${department}&semester=${semester}&section=${section}`
      );
      setStudents(response.data.data || []);
      setCurrentPage(1);
    } catch (error) {
      setStudents([]);
      const message = error.response?.data?.message || "Failed to fetch students";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleView = (data) => {
  // Save student data in localStorage
  localStorage.setItem("student", JSON.stringify(data));

  // Open dashboard in new tab
  window.open("/dashboard", "_blank");
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
      <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
        {[["First", 1, currentPage === 1], ["Prev", currentPage - 1, currentPage === 1]].map(([text, page, disabled]) => (
          <button key={text} onClick={() => setCurrentPage(page)} disabled={disabled}
            className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">
            {text}
          </button>
        ))}
        {pages.map(num => (
          <button key={num} onClick={() => setCurrentPage(num)}
            className={`px-2 py-1 rounded text-xs sm:text-sm ${currentPage === num ? "bg-emerald-600 text-white" : "bg-gray-700 text-white hover:bg-gray-600"}`}>
            {num}
          </button>
        ))}
        {[["Next", currentPage + 1, currentPage === totalPages], ["Last", totalPages, currentPage === totalPages]].map(([text, page, disabled]) => (
          <button key={text} onClick={() => setCurrentPage(page)} disabled={disabled}
            className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">
            {text}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-3 sm:p-6 rounded-md shadow-lg text-white max-w-full">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-emerald-400 text-center sm:text-left">
        View Students
      </h2>

      {/* Filters Form */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-3 sm:p-4 mb-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 border border-emerald-500 rounded bg-gray-600 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Department</option>
                <option value="dcs">DCS</option>
                <option value="deee">DEEE</option>
                <option value="dme">DME</option>
                <option value="dce">DCE</option>
                <option value="dmt">DMT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-2 border border-emerald-500 rounded bg-gray-600 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Semester</option>
                {[...Array(6)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{`${i + 1}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-2 border border-emerald-500 rounded bg-gray-600 text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Search by name or registration number..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="flex-1 p-2 bg-gray-600 text-white border border-gray-500 rounded focus:border-emerald-500 focus:outline-none text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition disabled:opacity-50 text-xs sm:text-sm font-medium"
            >
              {loading ? "Loading..." : "Load Students"}
            </button>
          </div>

          {/* Sort Controls */}
          {students.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t border-gray-600 gap-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-300">Sort by:</span>
                {[["name", "Name"], ["registrationNumber", "Reg No"]].map(([field, label]) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => handleSort(field)}
                    className={`text-xs px-2 py-1 rounded ${
                      sortBy === field ? "bg-emerald-600 text-white" : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    }`}
                  >
                    {label}{sortBy === field && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-300">
                Showing {paginatedStudents.length} of {filteredAndSortedStudents.length} students
                {searchTerm && ` (filtered from ${students.length} total)`}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Students Display */}
      {paginatedStudents.length > 0 && (
        <div>
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {paginatedStudents.map((student) => (
                <div key={student.id} className="bg-gray-700 p-3 rounded border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {String(student.name).toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Roll: {String(student.registrationNumber).toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {String(student.department).toUpperCase()} • Sem {student.sem}
                      </div>
                    </div>
                    <button
                      className="ml-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs"
                      onClick={() => handleView(student)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="table-auto w-full min-w-[600px] border-collapse border border-gray-700 rounded-md shadow-md">
              <thead className="bg-emerald-700 text-black">
                <tr>
                  <th className="py-2 px-3 border border-gray-600 text-xs sm:text-sm">Registration Number</th>
                  <th className="py-2 px-3 border border-gray-600 text-xs sm:text-sm">Name</th>
                  <th className="py-2 px-3 border border-gray-600 text-xs sm:text-sm">Department</th>
                  <th className="py-2 px-3 border border-gray-600 text-xs sm:text-sm">Semester</th>
                  <th className="py-2 px-3 border border-gray-600 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="odd:bg-gray-700 even:bg-gray-600 text-white">
                    <td className="py-2 px-3 border border-gray-600 text-center text-xs sm:text-sm">
                      {String(student.registrationNumber).toUpperCase()}
                    </td>
                    <td className="py-2 px-3 border border-gray-600 text-center text-xs sm:text-sm">
                      {String(student.name).toUpperCase()}
                    </td>
                    <td className="py-2 px-3 border border-gray-600 text-center text-xs sm:text-sm">
                      {String(student.department).toUpperCase()}
                    </td>
                    <td className="py-2 px-3 border border-gray-600 text-center text-xs sm:text-sm">
                      {student.sem}
                    </td>
                    <td className="py-2 px-3 border border-gray-600 text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs sm:text-sm"
                        onClick={() => handleView(student)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {renderPagination()}
        </div>
      )}

      {/* Empty State */}
      {students.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-base sm:text-lg mb-2">No students found</div>
          <div className="text-gray-500 text-sm">Select department, semester, and section, then click "Load Students"</div>
        </div>
      )}
    </div>
  );
};

export default ViewStudentsTab;