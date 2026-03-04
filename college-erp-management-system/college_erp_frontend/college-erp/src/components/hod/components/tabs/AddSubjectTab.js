import React, { useState } from "react";
import Api from "../../../../Api";

const AddSubjectTab = ({ onClose }) => {
    const [formData, setFormData] = useState({
        subjectName: "",
        subjectCode: "",
        department: "",
        semester: "",
        maxMarks: "",
        value: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Convert semester, maxMarks, and value to numbers
        const payload = {
            ...formData,
            semester: parseInt(formData.semester),
            maxMarks: parseInt(formData.maxMarks),
            value: parseInt(formData.value),
            department: formData.department.toUpperCase(),
            subjectCode: formData.subjectCode.toUpperCase(),
        };

        try {
            const response = await Api.post("/subjects/add", payload);
            if (response.status === 201 || response.status === 200) {
                alert("Subject added successfully!");
                onClose();
            }
        } catch (error) {
            console.error("Error adding subject:", error);
            alert(error.response?.data?.message || "Failed to add subject. Please check if Subject Code already exists.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl text-white relative border border-gray-700">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
            >
                &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-emerald-400 text-center">Add New Subject</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-base font-medium text-gray-300">Subject Name</label>
                        <input
                            type="text"
                            name="subjectName"
                            placeholder="e.g. Data Structures"
                            value={formData.subjectName}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-base font-medium text-gray-300">Subject Code</label>
                        <input
                            type="text"
                            name="subjectCode"
                            placeholder="e.g. 20CS31T"
                            value={formData.subjectCode}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 text-base font-medium text-gray-300">Department</label>
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        required
                    >
                        <option value="">Select Department</option>
                        <option value="DCS">Computer Science (DCS)</option>
                        <option value="DEEE">Electrical Engineering (DEEE)</option>
                        <option value="DME">Mechanical Engineering (DME)</option>
                        <option value="DCE">Civil Engineering (DCE)</option>
                        <option value="DMT">Metallurgical Engineering (DMT)</option>
                        <option value="COMMON">Common Subjects</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 text-base font-medium text-gray-300">Semester</label>
                        <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            required
                        >
                            <option value="">Select</option>
                            {[1, 2, 3, 4, 5, 6].map((s) => (
                                <option key={s} value={s}>
                                    Sem {s}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-base font-medium text-gray-300">Max Marks</label>
                        <input
                            type="number"
                            name="maxMarks"
                            placeholder="e.g. 100"
                            value={formData.maxMarks}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-base font-medium text-gray-300">Value (Credits)</label>
                        <input
                            type="number"
                            name="value"
                            placeholder="e.g. 4"
                            value={formData.value}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            "Add Subject"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSubjectTab;




