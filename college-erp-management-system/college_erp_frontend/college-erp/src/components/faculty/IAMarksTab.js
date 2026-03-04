import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Api from "../../Api";
import Alert from "./Alert";
import { motion, AnimatePresence } from "framer-motion";
import IndividualIAMarks from "../student/IAMarks";

const departments = ["DCS", "DEEE", "DME", "DCE", "DMT"];
const semesters = [1, 2, 3, 4, 5, 6];
const sections = ["A", "B", "C", "D"];
const assessments = [
    "IA - 1",
    "IA - 2",
    "IA - 3",
    "IA - 4",
    "IA - 5",
    "Skill Test - 1",
    "Skill Test - 2",
];

function IAMarksTab({ faculty, isHOD }) {
    const [filters, setFilters] = useState({
        department: isHOD ? (faculty?.department === "ALL" ? "DCS" : (faculty?.department || "DCS")) : faculty?.department || "DCS",
        semester: "",
        section: "",
        subjectId: "",
        iaType: "IA - 1",
    });
    const [maxMarks, setMaxMarks] = useState(25);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({}); // registrationNumber -> marks
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const fetchSubjects = useCallback(async () => {
        try {
            if (isHOD) {
                if (filters.department && filters.semester) {
                    const response = await Api.get(`/subjects/department/${filters.department}/semester/${filters.semester}`);
                    setSubjects(response.data?.data || []);
                }
            } else {
                if (faculty?.id) {
                    const response = await Api.get(`/subjects/all?facultyId=${faculty.id}`);
                    setSubjects(response.data?.data || []);
                }
            }
        } catch (error) {
            console.error("Error fetching subjects", error);
        }
    }, [faculty?.id, isHOD, filters.department, filters.semester]);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const fetchStudents = async () => {
        if (!filters.department || !filters.semester || !filters.section || !filters.subjectId) {
            return;
        }
        try {
            setLoading(true);
            const url = `/student/all?department=${filters.department}&semester=${filters.semester}&section=${filters.section}`;
            const response = await Api.get(url);
            const studentData = response.data?.data || [];
            setStudents(studentData);

            const selectedSub = subjects.find(s => String(s.subjectId || s.subject?.subjectId) === String(filters.subjectId));
            const subjectName = isHOD ? selectedSub?.subjectName : selectedSub?.subject?.subjectName;

            const marksMap = {};
            for (const student of studentData) {
                try {
                    const mRes = await Api.get(`/iamarks/student/${student.registrationNumber}/subject/${subjectName}`);
                    if (mRes.data?.data?.length > 0) {
                        const existing = mRes.data.data.find(m => (m.subject?.subjectName === subjectName));
                        if (existing) {
                            const iaData = JSON.parse(existing.iaMarks || "{}");
                            marksMap[student.registrationNumber] = iaData[filters.iaType] || "";
                        }
                    }
                } catch (e) { }
            }
            setMarks(marksMap);
        } catch (error) {
            showAlert("Failed to load students", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [filters.department, filters.semester, filters.section, filters.subjectId, filters.iaType]);

    const handleMarkChange = (regNo, value) => {
        setMarks((prev) => ({ ...prev, [regNo]: value }));
    };

    const handleSave = async () => {
        if (!filters.iaType) return showAlert("Please select IA Type", "error");

        try {
            setLoading(true);
            const selectedSub = subjects.find(s => String(s.subjectId || s.subject?.subjectId) === String(filters.subjectId));
            const subjectId = isHOD ? selectedSub?.subjectId : selectedSub?.subject?.subjectId;

            const payloadList = await Promise.all(students.map(async (student) => {
                let existingMarks = {};
                let existingId = null;
                try {
                    const subjectName = isHOD ? selectedSub?.subjectName : selectedSub?.subject?.subjectName;
                    const mRes = await Api.get(`/iamarks/student/${student.registrationNumber}/subject/${subjectName}`);
                    if (mRes.data?.data?.length > 0) {
                        const existing = mRes.data.data[0];
                        existingMarks = JSON.parse(existing.iaMarks || "{}");
                        existingId = existing.id;
                    }
                } catch (e) { }

                existingMarks[filters.iaType] = marks[student.registrationNumber] || 0;

                const payload = {
                    student: { id: student.id },
                    subject: { subjectId: subjectId },
                    iaMarks: JSON.stringify(existingMarks),
                    dept: filters.department
                };

                if (existingId) {
                    payload.id = existingId;
                }

                return payload;
            }));

            await Api.post("/iamarks/add-bulk", payloadList);
            showAlert("IA Marks saved successfully", "success");
        } catch (error) {
            showAlert("Failed to save marks", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target.result;
                const lines = text.split('\n').filter(l => l.trim());
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

                const data = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.trim());
                    const obj = {};
                    headers.forEach((h, i) => {
                        const key = h.includes('reg') ? 'registrationNumber' :
                            h.includes('mark') ? 'mark' : h;
                        obj[key] = values[i];
                    });
                    return obj;
                });

                const newMarks = { ...marks };
                data.forEach(item => {
                    if (item.registrationNumber) {
                        newMarks[item.registrationNumber] = item.mark || 0;
                    }
                });
                setMarks(newMarks);
                showAlert(`Successfully imported ${data.length} records`, "success");
            } catch (err) {
                showAlert("Failed to parse CSV file", "error");
            }
        };
        reader.readAsText(file);
        e.target.value = null; // Reset input
    };

    const downloadTemplate = () => {
        const headers = "Registration Number,Name,Mark\n";
        const rows = students.length > 0
            ? students.map(s => `${s.registrationNumber},${s.name},`).join("\n")
            : "459CS21001,Student Name,";

        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `IA_Marks_Template_${filters.iaType}.csv`;
        a.click();
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
    };

    return (
        <div className="bg-[#2d2f36] p-4 sm:p-8 rounded-[2rem] shadow-2xl text-white relative border border-emerald-500/10 backdrop-blur-3xl">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-10 gap-6">
                <div className="text-center lg:text-left">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent classic-heading">
                        Academic <span className="font-light italic text-gray-400">Registry</span>
                    </h2>
                    <p className="text-base uppercase font-bold tracking-[0.5em] text-emerald-500/60 mt-3">
                        Internal Assessment Performance Data {isHOD ? "(Administrator Access)" : ""}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={downloadTemplate}
                        className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-base font-bold uppercase tracking-widest border border-white/10 transition-all hover:border-emerald-500/30 active:scale-95 shadow-lg"
                    >
                        📥 CSV Template
                    </button>
                    <label className="px-6 py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white text-base font-bold uppercase tracking-widest border border-emerald-500/20 cursor-pointer transition-all active:scale-95 shadow-lg shadow-emerald-500/5">
                        📤 Import Performance
                        <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    </label>
                </div>
            </div>

            {/* Premium Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
                <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-500 uppercase tracking-widest ml-1">Department</label>
                    <select
                        className="bg-gray-800/50 text-white p-4 rounded-2xl border border-white/5 focus:border-emerald-500/50 outline-none text-base transition-all backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        value={filters.department}
                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                        disabled={isHOD && faculty?.department && faculty?.department !== "ALL"}
                    >
                        <option value="">Select Dept</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-500 uppercase tracking-widest ml-1">Semester</label>
                    <select
                        className="bg-gray-800/50 text-white p-4 rounded-2xl border border-white/5 focus:border-emerald-500/50 outline-none text-base transition-all"
                        value={filters.semester}
                        onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                    >
                        <option value="">Select Sem</option>
                        {semesters.map((sem) => (
                            <option key={sem} value={sem}>Sem {sem}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-500 uppercase tracking-widest ml-1">Section</label>
                    <select
                        className="bg-gray-800/50 text-white p-4 rounded-2xl border border-white/5 focus:border-emerald-500/50 outline-none text-base transition-all"
                        value={filters.section}
                        onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                    >
                        <option value="">Select Section</option>
                        {sections.map((sec) => (
                            <option key={sec} value={sec}>Section {sec}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                    <select
                        className="bg-gray-800/50 text-white p-4 rounded-2xl border border-white/5 focus:border-emerald-500/50 outline-none text-base transition-all"
                        value={filters.subjectId}
                        onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map((s) => {
                            const displayId = isHOD ? s.subjectId : s.subject?.subjectId;
                            const name = isHOD ? s.subjectName : s.subject?.subjectName;
                            const subSection = isHOD ? "" : ` (${s.section})`;
                            return (
                                <option key={displayId} value={displayId}>
                                    {name}{subSection}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-500 uppercase tracking-widest ml-1">IA Category</label>
                    <select
                        className="bg-gray-800/50 text-white p-4 rounded-2xl border border-white/5 focus:border-emerald-500/50 outline-none text-base transition-all font-bold text-emerald-400"
                        value={filters.iaType}
                        onChange={(e) => setFilters({ ...filters, iaType: e.target.value })}
                    >
                        {assessments.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-500 uppercase tracking-widest ml-1">Maximum Marks</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={maxMarks}
                            onChange={e => setMaxMarks(Number(e.target.value))}
                            className="bg-gray-800/50 text-white p-4 rounded-2xl border border-white/5 focus:border-emerald-500/50 outline-none text-base transition-all w-full font-bold"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-gray-600 font-black">PTS</span>
                    </div>
                </div>
            </div>

            {/* Performance Ledger */}
            <div className="overflow-x-auto bg-black/20 rounded-[1.5rem] border border-white/5 shadow-inner">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-emerald-500/5 text-emerald-500/70">
                            <th className="p-5 text-left text-base font-bold uppercase tracking-[0.2em] border-b border-white/5">Registration</th>
                            <th className="p-5 text-left text-base font-bold uppercase tracking-[0.2em] border-b border-white/5">Candidate Name</th>
                            <th className="p-5 text-center text-base font-bold uppercase tracking-[0.2em] border-b border-white/5">Score Entry</th>
                            <th className="p-5 text-center text-base font-bold uppercase tracking-[0.2em] border-b border-white/5">Evaluation Status</th>
                            <th className="p-5 text-center text-base font-bold uppercase tracking-[0.2em] border-b border-white/5">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-20 text-center text-gray-500 italic text-base">
                                    {loading ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-8 h-8 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                                            <span className="text-base uppercase tracking-widest font-bold">Synchronizing Records...</span>
                                        </div>
                                    ) : "Filter by Department, Sem, Section and Subject to display students"}
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => {
                                const currentMark = Number(marks[student.registrationNumber]) || 0;
                                const percentage = (currentMark / maxMarks) * 100;
                                const isPassing = percentage >= 35;

                                return (
                                    <tr key={student.registrationNumber} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 text-base font-mono text-emerald-400/80">{student.registrationNumber}</td>
                                        <td className="p-5">
                                            <span className="text-base font-semibold text-gray-300 group-hover:text-white transition-colors">{student.name}</span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center justify-center gap-3">
                                                <input
                                                    type="number"
                                                    className="bg-black/30 text-emerald-400 px-4 py-2 rounded-xl border border-white/5 focus:border-emerald-500/50 outline-none w-20 text-center text-base font-bold transition-all"
                                                    value={marks[student.registrationNumber] || ""}
                                                    onChange={(e) => handleMarkChange(student.registrationNumber, e.target.value)}
                                                    placeholder="0"
                                                    max={maxMarks}
                                                />
                                                <span className="text-base text-gray-600 font-bold">/ {maxMarks}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`px-4 py-1 rounded-full text-base font-black uppercase tracking-widest border ${isPassing ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-red-500/5 text-red-400 border-red-500/20'}`}>
                                                {isPassing ? 'Qualifying' : 'Needs Review'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <button
                                                onClick={() => setSelectedStudent(student)}
                                                className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/30"
                                            >
                                                👁️
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-10 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={students.length === 0 || loading}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-600 px-12 py-5 rounded-2xl text-base font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 border border-emerald-400/20"
                >
                    {loading ? "Syncing..." : "Finalize Performance Records"}
                </button>
            </div>

            {/* Individual Student Analytics Modal - Portaled to Body to escape overflow/transform constraints */}
            {selectedStudent && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 lg:p-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedStudent(null)}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="relative bg-[#0a0c10] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] w-full max-w-6xl max-h-[95vh] overflow-y-auto p-8 sm:p-14 border border-white/5 custom-scrollbar"
                    >
                        {/* Decorative background glow */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />

                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-base hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all border border-white/5 z-10"
                        >
                            ✕
                        </button>

                        <div className="mb-12 relative z-10">
                            <span className="text-base font-black text-emerald-400 uppercase tracking-[0.5em] mb-4 block opacity-70">Institutional Dossier</span>
                            <h1 className="text-4xl sm:text-5xl font-bold text-white classic-heading tracking-tight">{selectedStudent.name}</h1>
                            <div className="flex items-center gap-4 mt-3">
                                <p className="text-base font-mono text-emerald-500/60 uppercase tracking-widest">{selectedStudent.registrationNumber}</p>
                                <div className="h-1 w-1 bg-white/20 rounded-full" />
                                <p className="text-base font-light text-gray-500 uppercase tracking-[0.2em]">{selectedStudent.department} Department</p>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <IndividualIAMarks student={selectedStudent} isDark={true} />
                        </div>

                        <div className="mt-16 flex justify-center sticky bottom-0 pt-6 pb-2 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10] to-transparent z-20">
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="px-12 py-5 rounded-2xl bg-white/5 text-white text-base font-black uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-2xl border border-white/10 hover:border-emerald-500/30 active:scale-95"
                            >
                                Close Dossier
                            </button>
                        </div>
                    </motion.div>
                </div>,
                document.body
            )}

            {alert.show && <Alert message={alert.message} type={alert.type} />}
        </div>
    );
}

export default IAMarksTab;




