import React, { useState, useEffect, useMemo, useCallback } from "react";
import Api from "../../../../Api";
import AddSubjectTab from "../../components/tabs/AddSubjectTab";
import { motion, AnimatePresence } from "framer-motion";

const SubjectList = ({ department }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchSubjects = useCallback(async () => {
    if (!department) return;
    setLoading(true);
    try {
      const response = await Api.get(`/subjects/department/${department}`);
      setSubjects(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading(false);
    }
  }, [department]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleDelete = async (subjectId, subjectName) => {
    if (!window.confirm(`Are you sure you want to delete "${subjectName}"?`)) {
      return;
    }
    try {
      const response = await Api.delete(`/subjects/${subjectId}`);
      if (response.status === 200) {
        alert("Subject deleted successfully!");
        fetchSubjects();
      }
    } catch (error) {
      console.error("Failed to delete subject:", error);
      alert("Failed to delete subject. It might be assigned to faculty or have marks entered.");
    }
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const nameMatch = s.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
      const codeMatch = s.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
      const semMatch = selectedSemester ? String(s.semester) === String(selectedSemester) : true;
      return (nameMatch || codeMatch) && semMatch;
    });
  }, [subjects, searchTerm, selectedSemester]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-6 rounded-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-md focus:border-gold outline-none w-full sm:w-64 font-bold text-academic"
          />
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-md focus:border-gold outline-none font-bold text-academic bg-white"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6].map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-academic text-white px-8 py-2.5 rounded-md font-black uppercase tracking-widest hover:bg-academic/90 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <span>+ Add Subject</span>
        </button>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-academic text-white">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em]">Code</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em]">Subject Name</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-center">Semester</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-center">Max Marks</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-center">Credits</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-faded-ink italic font-bold">
                      Fetching subject records...
                    </td>
                  </tr>
                ) : filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-faded-ink italic font-bold">
                      No matching subjects found in the database.
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((subject) => (
                    <motion.tr
                      key={subject.subjectId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 text-base font-black text-academic">{subject.subjectCode}</td>
                      <td className="px-6 py-4 text-base font-bold text-gray-700">{subject.subjectName}</td>
                      <td className="px-6 py-4 text-base font-black text-academic text-center">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">Sem {subject.semester}</span>
                      </td>
                      <td className="px-6 py-4 text-base font-bold text-academic text-center">{subject.maxMarks}</td>
                      <td className="px-6 py-4 text-base font-bold text-academic text-center">{subject.value}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(subject.subjectId, subject.subjectName)}
                          className="bg-red-50 text-red-600 px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-all border border-red-100"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-academic/60 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-xl"
            >
              <AddSubjectTab onClose={() => {
                setShowAddModal(false);
                fetchSubjects();
              }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubjectList;
