import React, { useState, useMemo } from "react";
import Api from "../../Api";

const ViewStudentsTab = ({ faculty }) => {
  const [department, setDepartment] = useState(
    faculty?.department === "ALL" ? "DCS" : faculty?.department || "DCS"
  );
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("registrationNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(20);

  // Bulk edit state
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [editedStudents, setEditedStudents] = useState([]);

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
      const data = response.data.data || [];
      setStudents(data);
      setEditedStudents(data.map((s) => ({ ...s }))); // keep editable copy
      setCurrentPage(1);
    } catch (error) {
      setStudents([]);
      setEditedStudents([]);
      const message =
        error.response?.data?.message || "Failed to fetch students";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.sort((a, b) => {
      let aVal = (a[sortBy] || "").toString().toLowerCase();
      let bVal = (b[sortBy] || "").toString().toLowerCase();
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [students, searchTerm, sortBy, sortOrder]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * studentsPerPage;
    return filteredAndSortedStudents.slice(start, start + studentsPerPage);
  }, [filteredAndSortedStudents, currentPage, studentsPerPage]);

  const totalPages = Math.ceil(
    filteredAndSortedStudents.length / studentsPerPage
  );

  const handleView = (data) => {
    // Save student data in localStorage
    localStorage.setItem("student", JSON.stringify(data));

    // Open dashboard in new tab
    window.open("/dashboard", "_blank");
  };

  // handle input change for bulk editing
  const handleBulkChange = (id, field, value) => {
    setEditedStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // send bulk update request
  const handleBulkSave = async () => {
    try {
      await Api.put("/students/bulk-update", editedStudents);
      alert("Bulk update successful!");
      setBulkEditMode(false);
      // Reload students after successful update
      handleSubmit({ preventDefault: () => { } });
    } catch {
      alert("Bulk update failed.");
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
      <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
        {[
          ["First", 1, currentPage === 1],
          ["Prev", currentPage - 1, currentPage === 1],
        ].map(([text, page, disabled]) => (
          <button
            key={text}
            onClick={() => setCurrentPage(page)}
            disabled={disabled}
            className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-base"
          >
            {text}
          </button>
        ))}
        {pages.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-2 py-1 rounded text-base sm:text-base ${currentPage === num
              ? "bg-emerald-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
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
            className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-base"
          >
            {text}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-3 sm:p-6 rounded-md shadow-lg text-white max-w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-base sm:text-base md:text-2xl font-bold text-emerald-400 text-center sm:text-left">
          View Students
        </h2>
        {students.length > 0 && (
          <button
            onClick={() => setBulkEditMode(!bulkEditMode)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-base sm:text-base"
          >
            {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
          </button>
        )}
      </div>

      {/* Save button if in edit mode */}
      {bulkEditMode && (
        <div className="mb-4">
          <button
            onClick={handleBulkSave}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-base sm:text-base"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Filters Form */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-3 sm:p-4 mb-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-base sm:text-base font-medium mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={faculty?.department && faculty?.department !== "ALL" && (faculty?.role?.toUpperCase() === "HOD" || faculty?.role?.toUpperCase() === "FACULTY")}
                className="w-full p-2 border border-emerald-500 rounded bg-gray-600 text-white text-base sm:text-base focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <label className="block text-base sm:text-base font-medium mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-2 border border-emerald-500 rounded bg-gray-600 text-white text-base sm:text-base focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Semester</option>
                {[...Array(6)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{`${i + 1}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base sm:text-base font-medium mb-1">
                Section
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-2 border border-emerald-500 rounded bg-gray-600 text-white text-base sm:text-base focus:ring-2 focus:ring-emerald-500"
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 p-2 bg-gray-600 text-white border border-gray-500 rounded focus:border-emerald-500 focus:outline-none text-base sm:text-base"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition disabled:opacity-50 text-base sm:text-base font-medium"
            >
              {loading ? "Loading..." : "Load Students"}
            </button>
          </div>

          {/* Sort Controls */}
          {students.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t border-gray-600 gap-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-base text-gray-300">Sort by:</span>
                {[
                  ["name", "Name"],
                  ["registrationNumber", "Reg No"],
                ].map(([field, label]) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => handleSort(field)}
                    className={`text-base px-2 py-1 rounded ${sortBy === field
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                      }`}
                  >
                    {label}
                    {sortBy === field && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="text-base text-gray-300">
                Showing {paginatedStudents.length} of{" "}
                {filteredAndSortedStudents.length} students
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
              {(bulkEditMode ? editedStudents : paginatedStudents).map(
                (student) => (
                  <div
                    key={student.id}
                    className="bg-gray-700 p-3 rounded border border-gray-600"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 space-y-2">
                        {bulkEditMode ? (
                          <>
                            <input
                              value={student.name}
                              onChange={(e) =>
                                handleBulkChange(
                                  student.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="w-full text-base font-medium px-2 py-1 rounded text-black"
                              placeholder="Name"
                            />
                            <input
                              value={student.registrationNumber}
                              onChange={(e) =>
                                handleBulkChange(
                                  student.id,
                                  "registrationNumber",
                                  e.target.value
                                )
                              }
                              className="w-full text-base px-2 py-1 rounded text-black"
                              placeholder="Registration Number"
                            />
                            <div className="flex gap-2">
                              <input
                                value={student.department}
                                onChange={(e) =>
                                  handleBulkChange(
                                    student.id,
                                    "department",
                                    e.target.value
                                  )
                                }
                                className="flex-1 text-base px-2 py-1 rounded text-black"
                                placeholder="Department"
                              />
                              <input
                                type="number"
                                value={student.sem}
                                onChange={(e) =>
                                  handleBulkChange(
                                    student.id,
                                    "sem",
                                    e.target.value
                                  )
                                }
                                className="w-16 text-base px-2 py-1 rounded text-black"
                                placeholder="Sem"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-base font-medium text-white truncate">
                              {String(student.name).toUpperCase()}
                            </div>
                            <div className="text-base text-gray-400 mt-1">
                              Roll:{" "}
                              {String(student.registrationNumber).toUpperCase()}
                            </div>
                            <div className="text-base text-gray-400">
                              {String(student.department).toUpperCase()} • Sem{" "}
                              {student.sem}
                            </div>
                          </>
                        )}
                      </div>
                      {!bulkEditMode && (
                        <button
                          className="ml-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-base"
                          onClick={() => handleView(student)}
                        >
                          View
                        </button>
                      )}
                      {bulkEditMode && (
                        <span className="ml-3 text-gray-400 text-base">
                          Editing
                        </span>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="table-auto w-full min-w-[600px] border-collapse border border-gray-700 rounded-md shadow-md">
              <thead className="bg-emerald-700 text-black">
                <tr>
                  <th className="py-2 px-3 border border-gray-600 text-base sm:text-base">
                    Registration Number
                  </th>
                  <th className="py-2 px-3 border border-gray-600 text-base sm:text-base">
                    Name
                  </th>
                  <th className="py-2 px-3 border border-gray-600 text-base sm:text-base">
                    Department
                  </th>
                  <th className="py-2 px-3 border border-gray-600 text-base sm:text-base">
                    Semester
                  </th>
                  <th className="py-2 px-3 border border-gray-600 text-base sm:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {(bulkEditMode ? editedStudents : paginatedStudents).map(
                  (student) => (
                    <tr
                      key={student.id}
                      className="odd:bg-gray-700 even:bg-gray-600 text-white"
                    >
                      <td className="py-2 px-3 border border-gray-600 text-center text-base sm:text-base">
                        {bulkEditMode ? (
                          <input
                            value={student.registrationNumber}
                            onChange={(e) =>
                              handleBulkChange(
                                student.id,
                                "registrationNumber",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 rounded text-black text-base sm:text-base"
                          />
                        ) : (
                          String(student.registrationNumber).toUpperCase()
                        )}
                      </td>
                      <td className="py-2 px-3 border border-gray-600 text-center text-base sm:text-base">
                        {bulkEditMode ? (
                          <input
                            value={student.name}
                            onChange={(e) =>
                              handleBulkChange(
                                student.id,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 rounded text-black text-base sm:text-base"
                          />
                        ) : (
                          String(student.name).toUpperCase()
                        )}
                      </td>
                      <td className="py-2 px-3 border border-gray-600 text-center text-base sm:text-base">
                        {bulkEditMode ? (
                          <input
                            value={student.department}
                            onChange={(e) =>
                              handleBulkChange(
                                student.id,
                                "department",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 rounded text-black text-base sm:text-base"
                          />
                        ) : (
                          String(student.department).toUpperCase()
                        )}
                      </td>
                      <td className="py-2 px-3 border border-gray-600 text-center text-base sm:text-base">
                        {bulkEditMode ? (
                          <input
                            type="number"
                            value={student.sem}
                            onChange={(e) =>
                              handleBulkChange(
                                student.id,
                                "sem",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 rounded text-black text-base sm:text-base"
                          />
                        ) : (
                          student.sem
                        )}
                      </td>
                      <td className="py-2 px-3 border border-gray-600 text-center">
                        {bulkEditMode ? (
                          <span className="text-gray-400 text-base">Editing</span>
                        ) : (
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-base sm:text-base"
                            onClick={() => handleView(student)}
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {renderPagination()}
        </div>
      )}

      {/* Empty State */}
      {students.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-base sm:text-base mb-2">
            No students found
          </div>
          <div className="text-gray-500 text-base">
            Select department, semester, and section, then click "Load Students"
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudentsTab;




