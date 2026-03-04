import React, { useState, useEffect } from "react";
import Api from "../../Api";
import Alert from "./Alert";
import { motion, AnimatePresence } from "framer-motion";
import DragDropCSVUpload from "../DragDropFileUpload";

function AssigningSubjects({ faculty }) {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });

    // Selection state
    const [filters, setFilters] = useState({
        department: faculty?.department === "ALL" ? "DCS" : (faculty?.department || "DCS"),
        semester: "1"
    });
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [section, setSection] = useState("");
    const [subjectType, setSubjectType] = useState("THEORY");
    const [assigning, setAssigning] = useState(false);

    // CSV Mode state
    const [showCSVUpload, setShowCSVUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Dynamic departments based on faculty role/dept
    const facultyDept = faculty?.department || "";
    const isRestricted = facultyDept && facultyDept !== "ALL";
    const departments = isRestricted
        ? [facultyDept]
        : ["DCS", "DEEE", "DME", "DCE", "DMT", "COMMON"];
    const semesters = [1, 2, 3, 4, 5, 6];
    const sections = ["A", "B", "C", "D"];

    const fetchSubjects = async () => {
        if (!filters.department || !filters.semester) return;

        setLoading(true);
        try {
            const response = await Api.get(`/subjects/department/${filters.department}/semester/${filters.semester}`);
            setSubjects(response.data?.data || []);
            setSelectedSubjectId("");
        } catch (error) {
            console.error("Error fetching subjects:", error);
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, [filters.department, filters.semester]);

    const handleAssign = async () => {
        if (!selectedSubjectId || !section || !subjectType) {
            return showAlert("Please select subject, section and type", "error");
        }

        const selectedSub = subjects.find(s => String(s.subjectId) === String(selectedSubjectId));
        if (!selectedSub) return;

        setAssigning(true);
        try {
            const payload = {
                section: section,
                subject: {
                    subjectId: selectedSub.subjectId,
                    subjectName: selectedSub.subjectName,
                    subjectCode: selectedSub.subjectCode,
                    department: selectedSub.department,
                    semester: selectedSub.semester,
                    maxMarks: selectedSub.maxMarks,
                    value: selectedSub.value
                },
                faculty: faculty,
                subjectType: subjectType,
                batches: [] // Logic for batches can be added if it's a LAB
            };

            await Api.post("/faculty/assign-subject", payload);
            showAlert(`Successfully assigned ${selectedSub.subjectName} - Section ${section}`, "success");
            // Optional: Redirect or clear selection
        } catch (error) {
            console.error("Assignment error:", error);
            showAlert(error.response?.data?.message || "Failed to assign subject duty", "error");
        } finally {
            setAssigning(false);
        }
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
    };

    const handleFileUpload = (file) => {
        setSelectedFile(file);
    };

    const handleCSVSubmit = async () => {
        if (!selectedFile) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            await Api.post("/subjects/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            showAlert("Subject CSV uploaded successfully!", "success");
            setSelectedFile(null);
            setShowCSVUpload(false);
        } catch (error) {
            console.error("Upload failed:", error);
            showAlert("Failed to upload subject CSV.", "error");
        } finally {
            setUploading(false);
        }
    };

    const DownloadSampleCSV = () => {
        const link = document.createElement("a");
        link.href = "/csv files/subjectcsv.csv";
        link.download = "subjectcsv.csv";
        link.click();
    };

    const selectedSubject = subjects.find(s => String(s.subjectId) === String(selectedSubjectId));

    return (
        <div className="bg-white/80 backdrop-blur-3xl p-8 rounded-3xl shadow-2xl border border-emerald-500/10 text-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent classic-heading">
                        Subject <span className="font-light italic text-gray-400">Management</span>
                    </h2>
                    <p className="text-base uppercase font-bold tracking-[0.4em] text-gray-400 mt-2">
                        Configure Academic Portfolio Repository
                    </p>
                </div>
                <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
                    <button
                        onClick={() => setShowCSVUpload(false)}
                        className={`px-8 py-3 rounded-xl text-base font-black uppercase tracking-widest transition-all duration-300 ${!showCSVUpload ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
                    >
                        Individual
                    </button>
                    <button
                        onClick={() => setShowCSVUpload(true)}
                        className={`px-8 py-3 rounded-xl text-base font-black uppercase tracking-widest transition-all duration-300 ${showCSVUpload ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
                    >
                        CSV Deployment
                    </button>
                </div>
            </div>

            {showCSVUpload ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="bg-emerald-50/50 p-10 rounded-[2.5rem] border border-emerald-100 border-dashed">
                        <p className="text-base font-black text-emerald-600 uppercase tracking-[0.3em] mb-6 text-center">Batch Subject Enrollment Engine</p>
                        <DragDropCSVUpload onChange={handleFileUpload} />

                        {selectedFile && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 p-5 bg-white border border-emerald-200 rounded-3xl flex items-center justify-between shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">📄</div>
                                    <div className="min-w-0">
                                        <p className="text-base font-black text-gray-800 truncate">{selectedFile.name}</p>
                                        <p className="text-base text-emerald-600 font-bold uppercase tracking-wider">{(selectedFile.size / 1024).toFixed(1)} KB • READY TO DEPLOY</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedFile(null)} className="w-8 h-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors text-base">×</button>
                            </motion.div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                        <button
                            onClick={DownloadSampleCSV}
                            className="flex items-center justify-center gap-4 py-5 px-8 bg-white hover:bg-gray-50 border border-gray-200 rounded-[2rem] text-base font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                        >
                            <span className="text-base">📥</span> Download Standard Template
                        </button>
                        <button
                            onClick={handleCSVSubmit}
                            disabled={!selectedFile || uploading}
                            className="flex items-center justify-center gap-4 py-5 px-8 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-[2rem] text-base font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                        >
                            {uploading ? "Deploying..." : "Initialize Database Deployment"}
                        </button>
                    </div>

                    <p className="text-base text-center text-gray-400 font-bold uppercase tracking-[0.2em] italic">
                        * Ensure the CSV data structure conforms to the Directorate's academic inventory schema.
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {/* Department Filter */}
                        <div className="space-y-2">
                            <label className="text-base font-black text-emerald-600 uppercase tracking-widest ml-1">Department</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-base font-bold transition-all outline-none disabled:opacity-70 disabled:bg-gray-100"
                                value={filters.department}
                                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                disabled={isRestricted && departments.length === 1}
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        {/* Semester Filter */}
                        <div className="space-y-2">
                            <label className="text-base font-black text-emerald-600 uppercase tracking-widest ml-1">Semester</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-base font-bold transition-all outline-none"
                                value={filters.semester}
                                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                            >
                                {semesters.map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>

                        {/* Section Selection */}
                        <div className="space-y-2">
                            <label className="text-base font-black text-emerald-600 uppercase tracking-widest ml-1">Assign Section</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-base font-bold transition-all outline-none"
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                            >
                                <option value="">Select Section</option>
                                {sections.map(sec => (
                                    <option key={sec} value={sec}>Section {sec}</option>
                                ))}
                            </select>
                        </div>

                        {/* Type Selection */}
                        <div className="space-y-2">
                            <label className="text-base font-black text-emerald-600 uppercase tracking-widest ml-1">Subject Type</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-base font-bold transition-all outline-none"
                                value={subjectType}
                                onChange={(e) => setSubjectType(e.target.value)}
                            >
                                <option value="THEORY">THEORY</option>
                                <option value="LAB">LABORATORY</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-10">
                        <label className="text-base font-bold text-emerald-600 uppercase tracking-widest ml-1 mb-2 block">Available Subjects</label>
                        <div className="relative">
                            <select
                                className="w-full bg-emerald-50 border border-emerald-200 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-base font-bold text-emerald-800 transition-all outline-none appearance-none"
                                value={selectedSubjectId}
                                onChange={(e) => setSelectedSubjectId(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">{loading ? "Searching Repository..." : "Select the subject you want to teach..."}</option>
                                {subjects.map((s) => (
                                    <option key={s.subjectId} value={s.subjectId}>
                                        {s.subjectName} ({s.subjectCode})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
                                ▼
                            </div>
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        {selectedSubject ? (
                            <motion.div
                                key={selectedSubject.subjectId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gradient-to-br from-emerald-50 via-white to-gray-50 p-8 rounded-[2.5rem] border border-emerald-100 shadow-xl overflow-hidden relative mt-6"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-6xl italic pointer-events-none">
                                    {selectedSubject.subjectCode}
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                                    <div>
                                        <span className="px-3 py-1 bg-emerald-600 text-base font-black text-white rounded-full uppercase tracking-widest">
                                            Academic Portfolio
                                        </span>
                                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{selectedSubject.subjectName}</h3>
                                        <div className="flex gap-4 mt-2">
                                            <p className="text-emerald-600 font-mono text-base tracking-widest">{selectedSubject.subjectCode}</p>
                                            {section && <p className="text-emerald-800 font-bold text-base tracking-widest border-l pl-4 border-emerald-200 uppercase">SECTION {section}</p>}
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="text-center bg-white px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
                                            <p className="text-base font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Credits</p>
                                            <p className="text-base font-black text-emerald-600">{selectedSubject.value}</p>
                                        </div>
                                        <div className="text-center bg-white px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
                                            <p className="text-base font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Marks</p>
                                            <p className="text-base font-black text-emerald-600">{selectedSubject.maxMarks}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 w-full">
                                    <div className="flex flex-wrap gap-6 mt-2 flex-grow">
                                        <div className="flex items-center gap-3 text-base">
                                            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-base">🎓</div>
                                            <div>
                                                <p className="text-base font-bold text-gray-400 uppercase">Stream</p>
                                                <p className="text-base font-bold leading-tight">{selectedSubject.department}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-base">
                                            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-base">🗓️</div>
                                            <div>
                                                <p className="text-base font-bold text-gray-400 uppercase">Term</p>
                                                <p className="text-base font-bold leading-tight">Sem {selectedSubject.semester}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-base">
                                            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-base">💼</div>
                                            <div>
                                                <p className="text-base font-bold text-gray-400 uppercase">Type</p>
                                                <p className="text-base font-bold leading-tight">{subjectType}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 md:pt-0 w-full md:w-auto">
                                        <button
                                            className="w-full md:w-auto px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-base font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                            onClick={handleAssign}
                                            disabled={assigning || !section}
                                        >
                                            {assigning ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Syncing...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-base">🏛️</span>
                                                    Confirm & Assign Duty
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-center p-10 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 mt-6">
                                <div className="text-5xl mb-4 opacity-20">📚</div>
                                <p className="text-base font-bold text-gray-400 uppercase tracking-widest max-w-[300px]">
                                    Select a subject and define your section to initialize the assignment
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            {alert.show && <Alert message={alert.message} type={alert.type} />}
        </div>
    );
}

export default AssigningSubjects;




