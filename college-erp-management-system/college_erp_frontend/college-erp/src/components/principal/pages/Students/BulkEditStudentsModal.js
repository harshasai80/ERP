import React, { useState, useEffect } from "react";
import Api from "../../../../Api";

const BulkEditStudentsModal = ({ show, onClose, onUpdate, students }) => {
    const [editableStudents, setEditableStudents] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (students && students.length > 0) {
            setEditableStudents(
                students.map((s) => ({
                    id: s.id,
                    registrationNumber: s.registrationNumber,
                    name: s.name,
                    department: s.department,
                    sem: s.sem,
                    section: s.section,
                }))
            );
        }
    }, [students]);

    const handleFieldChange = (index, field, value) => {
        const updated = [...editableStudents];
        updated[index][field] = value;
        setEditableStudents(updated);
    };

    const handleSave = async () => {
        if (!window.confirm(`Save changes for ${editableStudents.length} students?`)) {
            return;
        }

        setSaving(true);
        try {
            const response = await Api.put("/student/bulk-update", editableStudents);
            if (response.status === 200) {
                alert("Students updated successfully!");
                onUpdate();
                onClose();
            }
        } catch (error) {
            console.error("Failed to update students", error);
            alert("Failed to update students. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold classic-heading">
                                Bulk Edit Students
                            </h2>
                            <p className="text-emerald-100 text-base mt-1">
                                Editing {editableStudents.length} student records
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-emerald-50 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-left text-base font-bold text-emerald-700 uppercase tracking-wider border-b-2 border-emerald-200">
                                        #
                                    </th>
                                    <th className="px-4 py-3 text-left text-base font-bold text-emerald-700 uppercase tracking-wider border-b-2 border-emerald-200">
                                        Registration Number
                                    </th>
                                    <th className="px-4 py-3 text-left text-base font-bold text-emerald-700 uppercase tracking-wider border-b-2 border-emerald-200">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-base font-bold text-emerald-700 uppercase tracking-wider border-b-2 border-emerald-200">
                                        Department
                                    </th>
                                    <th className="px-4 py-3 text-left text-base font-bold text-emerald-700 uppercase tracking-wider border-b-2 border-emerald-200">
                                        Semester
                                    </th>
                                    <th className="px-4 py-3 text-left text-base font-bold text-emerald-700 uppercase tracking-wider border-b-2 border-emerald-200">
                                        Section
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {editableStudents.map((student, index) => (
                                    <tr
                                        key={student.id}
                                        className="border-b border-gray-100 hover:bg-emerald-50/30 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-base text-gray-500 font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={student.registrationNumber}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        index,
                                                        "registrationNumber",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-base font-medium"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={student.name}
                                                onChange={(e) =>
                                                    handleFieldChange(index, "name", e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-base"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={student.department}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        index,
                                                        "department",
                                                        e.target.value.toUpperCase()
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-base uppercase"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={student.sem}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        index,
                                                        "sem",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-base"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                                    <option key={sem} value={sem}>
                                                        Sem {sem}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={student.section}
                                                onChange={(e) =>
                                                    handleFieldChange(index, "section", e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-base"
                                            >
                                                {["A", "B", "C", "D"].map((sec) => (
                                                    <option key={sec} value={sec}>
                                                        Sec {sec}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
                    <p className="text-base text-gray-600">
                        💡 <span className="font-semibold">Tip:</span> You can edit registration numbers, names, departments, semesters, and sections
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-base font-bold uppercase tracking-widest transition-all duration-300"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-base font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkEditStudentsModal;




