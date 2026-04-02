import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Api from "../../Api";
import Alert from "./Alert";
import { motion, AnimatePresence } from "framer-motion";
import IndividualIAMarks from "../student/IAMarks";
import UnifiedClassPerformance from "../common/UnifiedClassPerformance";

const departments = ["DCS", "DEEE", "DME", "DCE", "DMT"];
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

function IAMarksTab({ faculty, isHOD: propIsHOD }) {
    const isHOD = propIsHOD !== undefined ? propIsHOD : (faculty?.role?.toUpperCase() === "HOD" || faculty?.role?.toUpperCase() === "PRINCIPAL" || faculty?.role?.toUpperCase() === "ADMIN");

    const [viewMode, setViewMode] = useState("master"); // "input" or "master"
    const [activeSemesters, setActiveSemesters] = useState([]);
    const [filters, setFilters] = useState({
        department: (faculty?.department && faculty.department !== "ALL") ? faculty.department : (faculty?.department || "DCS"),
        semester: "",
        section: "",
        subjectId: "",
        iaType: "IA - 1",
    });

    // Synchronize department filter whenever faculty prop changes (e.g. after login/role shift)
    useEffect(() => {
        if (faculty?.department && faculty.department !== "ALL") {
            setFilters(prev => ({ ...prev, department: faculty.department }));
        }
    }, [faculty?.department]);
    const [maxMarks, setMaxMarks] = useState(25);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({}); // registrationNumber -> marks
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Dynamic Semester Detection
    useEffect(() => {
        const fetchActiveSems = async () => {
            try {
                const res = await Api.get(`/student/department?department=${filters.department}`);
                const allStudents = res.data?.data || [];
                const sems = [...new Set(allStudents.map(s => s.sem))].filter(s => s !== null && s > 0).sort((a, b) => a - b);
                setActiveSemesters(sems);
                
                // If current selected semester is not in active list, or no semester selected yet
                if (sems.length > 0 && !sems.includes(Number(filters.semester))) {
                    setFilters(f => ({ ...f, semester: sems[0] }));
                }
            } catch (error) {
                console.error("Error detecting active semesters", error);
            }
        };
        fetchActiveSems();
    }, [filters.department]);

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
                    let fetchedData = response.data?.data || [];
                    
                    // Filter subjects by selected semester/department locally for faculty
                    if (filters.semester || filters.department) {
                        fetchedData = fetchedData.filter(item => {
                            const sub = item.subject;
                            const semMatch = filters.semester ? String(sub?.semester) === String(filters.semester) : true;
                            const deptMatch = filters.department ? (sub?.department === filters.department || sub?.department?.toUpperCase() === "COMMON") : true;
                            return semMatch && deptMatch;
                        });
                    }
                    setSubjects(fetchedData);
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

            // Fetch marks for all students in this section/subject at once
            const mRes = await Api.get(`/iamarks/filter?department=${filters.department}&semester=${filters.semester}&section=${filters.section}&subjectId=${filters.subjectId}`);
            const allMarks = mRes.data?.data || [];

            const marksMap = {};
            studentData.forEach(student => {
                const existing = allMarks.find(m => m.student?.id === student.id);
                if (existing) {
                    const iaData = JSON.parse(existing.iaMarks || "{}");
                    marksMap[student.registrationNumber] = iaData[filters.iaType] || "";
                }
            });
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

            const mRes = await Api.get(`/iamarks/filter?department=${filters.department}&semester=${filters.semester}&section=${filters.section}&subjectId=${subjectId}`);
            const allMarks = mRes.data?.data || [];

            const payloadList = students.map(student => {
                const existing = allMarks.find(m => m.student?.id === student.id);
                let currentIAData = existing ? JSON.parse(existing.iaMarks || "{}") : {};
                currentIAData[filters.iaType] = Number(marks[student.registrationNumber]) || 0;

                const iaScores = [
                    Number(currentIAData["IA - 1"] || 0),
                    Number(currentIAData["IA - 2"] || 0),
                    Number(currentIAData["IA - 3"] || 0)
                ].filter(s => s > 0);

                if (iaScores.length > 0) {
                    const sorted = [...iaScores].sort((a, b) => b - a);
                    const bestTwo = sorted.slice(0, 2);
                    const avg = bestTwo.reduce((a, b) => a + b, 0) / bestTwo.length;
                    currentIAData["Average"] = avg.toFixed(2);
                    currentIAData["BestTwoTotal"] = bestTwo.reduce((a, b) => a + b, 0);
                }

                const payload = {
                    student: { id: student.id },
                    subject: { subjectId: subjectId },
                    iaMarks: JSON.stringify(currentIAData),
                    dept: filters.department
                };
                if (existing) payload.id = existing.id;
                return payload;
            });

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
                // Remove UTF-8 BOM if present
                const text = event.target.result.replace(/^\uFEFF/, "");
                const lines = text.split(/\r?\n/).filter(l => l.trim());
                if (lines.length < 2) return showAlert("CSV file must have a header row and at least one student record.", "error");

                // Auto-detect delimiter (most frequent among common delimiters)
                const firstLine = lines[0];
                const delimiter = [',', ';', '\t'].reduce((a, b) => 
                    firstLine.split(a).length > firstLine.split(b).length ? a : b
                );

                const headers = firstLine.split(delimiter).map(h => h.trim().toLowerCase());
                
                // Flexible header identification
                const regIdx = headers.findIndex(h => h.includes('reg') || h.includes('id') || h.includes('roll') || h.includes('num'));
                const markIdx = headers.findIndex(h => h.includes('mark') || h.includes('score') || h.includes('ia') || h.includes('point'));

                if (regIdx === -1 || markIdx === -1) {
                    return showAlert("Format Error: Unable to locate 'Registration Number' or 'Mark' columns. Please use the Template button for the correct format.", "error");
                }

                const newMarks = { ...marks };
                let matchedCount = 0;
                let totalRows = 0;

                lines.slice(1).forEach(line => {
                    const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
                    if (values.length <= Math.max(regIdx, markIdx)) return;

                    const regNo = values[regIdx]?.toUpperCase();
                    // Use identified index, or handle shifted columns due to commas in names
                    const rawMark = (markIdx === headers.length - 1 && values.length > headers.length) 
                        ? values[values.length - 1] 
                        : values[markIdx];
                    
                    if (regNo && rawMark !== undefined && rawMark !== "") {
                        // Normalize the mark to a number string
                        const cleanMark = rawMark.toString().replace(/[^0-9.]/g, '');
                        if (cleanMark !== "") {
                            newMarks[regNo] = cleanMark;
                            totalRows++;
                            if (students.some(s => s.registrationNumber.toUpperCase() === regNo)) {
                                matchedCount++;
                            }
                        }
                    }
                });

                setMarks(newMarks);
                
                if (matchedCount > 0) {
                    showAlert(`Success: Imported ${matchedCount} marks for displayed students.`, "success");
                } else if (totalRows > 0) {
                    showAlert(`Warning: Imported ${totalRows} entries, but none match the current student filter. Verify Registration IDs.`, "warning");
                } else {
                    showAlert("No valid student data found in the CSV file.", "error");
                }
            } catch (err) {
                console.error("CSV Import Critical Error:", err);
                showAlert("Internal Error: Failed to process the CSV file.", "error");
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    const downloadTemplate = () => {
        const headers = "Registration Number,Name,Mark\n";
        // Sort students if available for a better template experience
        const sortedStudents = [...students].sort((a, b) => a.registrationNumber.localeCompare(b.registrationNumber));
        const rows = sortedStudents.length > 0 
            ? sortedStudents.map(s => `${s.registrationNumber},"${s.name}",`).join("\n") 
            : "459CS21001,Student Name,";
        
        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `IA_Marks_Import_Template_${filters.iaType}_Sem${filters.semester}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
    };

    const handleNotify = async () => {
        if (!filters.department || !filters.semester || !filters.section || !filters.subjectId) return showAlert("Please select all filters first", "error");
        try {
            setLoading(true);
            await Api.post(`/iamarks/notify?department=${filters.department}&semester=${filters.semester}&section=${filters.section}&subjectId=${filters.subjectId}&iaType=${filters.iaType}`);
            showAlert("Notifications sent successfully", "success");
        } catch (error) { showAlert("Failed to send notifications", "error"); } finally { setLoading(false); }
    };

    const handleExport = () => {
        if (students.length === 0) return showAlert("No data to export", "error");
        const headers = ["Registration Number", "Name", filters.iaType, "Average", "Total"];
        const rows = students.map(student => [student.registrationNumber, student.name, marks[student.registrationNumber] || 0, "", ""]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Marks_Report_Sem${filters.semester}.csv`);
        link.click();
    };

    return (
        <div className="bg-[#2d2f36] p-4 sm:p-8 rounded-[2rem] shadow-2xl text-white relative border border-emerald-500/10 backdrop-blur-3xl">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-10 gap-6">
                <div className="text-center lg:text-left">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent classic-heading">
                        Academic <span className="font-light italic text-gray-400">Registry</span>
                    </h2>
                    <p className="text-base uppercase font-bold tracking-[0.5em] text-emerald-500/60 mt-3">
                        Filtering results for active departmental enrolments {isHOD ? "(Admin)" : ""}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    <div className="flex bg-white/5 p-1 rounded-2xl mr-4 border border-white/5">
                        <button onClick={() => setViewMode("input")} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "input" ? "bg-emerald-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}>Input Mode</button>
                        <button onClick={() => setViewMode("master")} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "master" ? "bg-emerald-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}>Master Sheet</button>
                    </div>
                </div>
            </div>

            {/* Premium Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
                <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-500 uppercase tracking-widest ml-1">Dept</label>
                    <select className="bg-gray-800/50 text-white p-4 rounded-2xl border border-white/5 outline-none disabled:opacity-50" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} disabled={isHOD && faculty?.department && faculty?.department !== "ALL"}>
                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-500 uppercase tracking-widest ml-1">Semester</label>
                    <select className="bg-gray-800/50 text-white p-4 rounded-2xl border border-white/5 outline-none" value={filters.semester} onChange={(e) => setFilters({ ...filters, semester: e.target.value })}>
                        <option value="">Select Sem</option>
                        {[1, 2, 3, 4, 5, 6].map(sem => (
                            <option key={sem} value={sem}>
                                Sem {sem} {activeSemesters.includes(sem) ? "• (Active)" : ""}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-500 uppercase tracking-widest ml-1">Section</label>
                    <select className="bg-gray-800/50 text-white p-4 rounded-2xl border border-white/5 outline-none" value={filters.section} onChange={(e) => setFilters({ ...filters, section: e.target.value })}>
                        <option value="">Select Section</option>
                        {sections.map(sec => <option key={sec} value={sec}>Section {sec}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                    <select className="bg-gray-800/50 text-white p-4 rounded-2xl border border-white/5 outline-none" value={filters.subjectId} onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}>
                        <option value="">Select Subject</option>
                        {subjects.map(s => {
                            const displayId = isHOD ? s.subjectId : s.subject?.subjectId;
                            const name = isHOD ? s.subjectName : s.subject?.subjectName;
                            return <option key={displayId} value={displayId}>{name}</option>;
                        })}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-500 uppercase tracking-widest ml-1">IA Category</label>
                    <select className="bg-gray-800/50 text-white p-4 rounded-2xl border border-white/5 outline-none font-bold text-emerald-400" value={filters.iaType} onChange={(e) => setFilters({ ...filters, iaType: e.target.value })}>
                        {assessments.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            </div>

            <div className="min-h-[400px]">
                {viewMode === "input" ? (
                    <>
                        <div className="overflow-x-auto bg-black/20 rounded-[1.5rem] border border-white/5 shadow-inner">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-emerald-500/5 text-emerald-500/70">
                                        <th className="p-5 text-left text-base font-bold uppercase tracking-[0.2em] border-b border-white/5">Registration</th>
                                        <th className="p-5 text-left text-base font-bold uppercase tracking-[0.2em] border-b border-white/5">Candidate Name</th>
                                        <th className="p-5 text-center text-base font-bold uppercase tracking-[0.2em] border-b border-white/5">Score Entry</th>
                                        <th className="p-5 text-center text-base font-bold uppercase tracking-[0.2em] border-b border-white/5">Status</th>
                                        <th className="p-5 text-center text-base font-bold uppercase tracking-[0.2em] border-b border-white/5">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.02]">
                                    {students.length === 0 ? (
                                        <tr><td colSpan="5" className="p-20 text-center text-gray-500 italic text-base">{loading ? "Synchronizing Records..." : "No student records found for this selection"}</td></tr>
                                    ) : (
                                        students.map((student) => {
                                            const currentMark = Number(marks[student.registrationNumber]) || 0;
                                            const isPassing = (currentMark / maxMarks) * 100 >= 35;
                                            return (
                                                <tr key={student.registrationNumber} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-5 text-base font-mono text-emerald-400/80">{student.registrationNumber}</td>
                                                    <td className="p-5"><span className="text-base font-semibold text-gray-300 group-hover:text-white transition-colors">{student.name}</span></td>
                                                    <td className="p-5"><div className="flex items-center justify-center gap-3"><input type="number" className="bg-black/30 text-emerald-400 px-4 py-2 rounded-xl border border-white/5 outline-none w-20 text-center font-bold" value={marks[student.registrationNumber] || ""} onChange={(e) => handleMarkChange(student.registrationNumber, e.target.value)} max={maxMarks} /><span>/ {maxMarks}</span></div></td>
                                                    <td className="p-5 text-center"><span className={`px-4 py-1 rounded-full text-base font-black uppercase border ${isPassing ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-red-500/5 text-red-400 border-red-500/20'}`}>{isPassing ? 'Qualifying' : 'Review'}</span></td>
                                                    <td className="p-5 text-center"><button onClick={() => setSelectedStudent(student)} className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 transition-all shadow-lg border border-transparent hover:border-emerald-500/30">👁️</button></td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10 flex flex-wrap justify-end gap-4 items-center">
                            <button onClick={downloadTemplate} disabled={students.length === 0 || loading} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all flex items-center gap-2">📄 Template</button>
                            <label className={`bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all cursor-pointer flex items-center gap-2 ${students.length === 0 || loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                                📥 Import
                                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} disabled={students.length === 0 || loading} />
                            </label>
                            <button onClick={handleExport} disabled={students.length === 0 || loading} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all">📑 Export</button>
                            <button onClick={handleNotify} disabled={students.length === 0 || loading} className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all">🔔 Notify</button>
                            <button onClick={handleSave} disabled={students.length === 0 || loading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-2xl font-black uppercase border border-emerald-400/20 tracking-widest shadow-2xl transition-all">{loading ? "Syncing..." : "Finalize Records"}</button>
                        </div>
                    </>
                ) : (
                    <UnifiedClassPerformance department={filters.department} semester={filters.semester} section={filters.section} />
                )}
            </div>
            {selectedStudent && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedStudent(null)} />
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-[#0a0c10] rounded-[2.5rem] shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-12 border border-white/5">
                        <button onClick={() => setSelectedStudent(null)} className="absolute top-10 right-10 text-white text-2xl font-black">✕</button>
                        <IndividualIAMarks student={selectedStudent} isDark={true} />
                    </motion.div>
                </div>, document.body
            )}
            {alert.show && <Alert message={alert.message} type={alert.type} />}
        </div>
    );
}

export default IAMarksTab;
