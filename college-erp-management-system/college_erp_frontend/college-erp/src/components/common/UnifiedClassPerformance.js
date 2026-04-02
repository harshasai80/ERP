import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Api from "../../Api";

const UnifiedClassPerformance = ({ department, semester, section }) => {
    const [performanceData, setPerformanceData] = useState({}); // { studentId: { iaType: { subjectId: { marks: {}, att: {} } } } }
    const [loading, setLoading] = useState(true);
    const [subjectsList, setSubjectsList] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [activeMilestone, setActiveMilestone] = useState("IA - 1");

    const fetchClassPerformance = useCallback(async () => {
        if (!department || !semester || !section) return;
        setLoading(true);
        // Reset lists to prevent "ghost data" from previous selection on error
        setStudentsList([]);
        setSubjectsList([]);
        setPerformanceData({});

        try {
            // 1. Fetch Students
            const studentRes = await Api.get("/student/all", {
                params: { department, semester, section }
            });
            const students = studentRes.data?.data || [];
            setStudentsList(students);

            // 2. Fetch Subjects
            const subRes = await Api.get(`/subjects/department/${department}/semester/${semester}`);
            const subjects = subRes.data?.data || [];
            // Filter unique subjects by code to avoid duplicate columns
            const uniqueSubjects = subjects.reduce((acc, current) => {
                const x = acc.find(item => item.subjectCode === current.subjectCode);
                if (!x) return acc.concat([current]);
                else return acc;
            }, []);
            setSubjectsList(uniqueSubjects);

            // 3. Fetch All IA Marks for Class
            const marksRes = await Api.get("/iamarks/class", {
                params: { department, semester, section }
            });
            const allMarks = marksRes.data?.data || [];

            // 4. Fetch All Attendance for Class
            const attendanceRes = await Api.get("/students/class-attendance", {
                params: { department, semester, section }
            });
            const allAttendance = attendanceRes.data?.data || [];

            // 5. Calculate Attendance Stats
            const attMap = {};
            allAttendance.forEach(day => {
                const regNo = day.student?.registrationNumber;
                if (!regNo) return;
                try {
                    const sessions = JSON.parse(day.sessions || "[]");
                    sessions.forEach(s => {
                        const sId = s.subjectId;
                        if (!sId) return;
                        if (!attMap[regNo]) attMap[regNo] = {};
                        if (!attMap[regNo][sId]) attMap[regNo][sId] = { attended: 0, total: 0 };
                        attMap[regNo][sId].total += 1;
                        if (s.status === "present") attMap[regNo][sId].attended += 1;
                    });
                } catch (e) { }
            });

            // 6. Consolidate
            const consolidated = {};
            const iaMilestones = ["IA - 1", "IA - 2", "IA - 3", "IA - 4", "IA - 5", "Skill Test - 1", "Skill Test - 2"];
            
            students.forEach(student => {
                const regNo = student.registrationNumber;
                consolidated[regNo] = {};
                iaMilestones.forEach(iaType => {
                    consolidated[regNo][iaType] = {};
                    subjects.forEach(subject => {
                        const markRec = allMarks.find(m => 
                            m.student?.registrationNumber === regNo && m.subject?.subjectId === subject.subjectId
                        );
                        const marksJson = JSON.parse(markRec?.iaMarks || "{}");
                        const attStats = (attMap[regNo] && attMap[regNo][subject.subjectId]) || { attended: 0, total: 0 };
                        const attendancePct = attStats.total > 0 ? Math.round((attStats.attended / attStats.total) * 100) : null;

                        consolidated[regNo][iaType][subject.subjectId] = {
                            co1: marksJson[`${iaType}_CO1`] || marksJson[iaType] || 0,
                            co2: marksJson[`${iaType}_CO2`] || 0,
                            total: marksJson[iaType] || 0,
                            att: attendancePct
                        };
                    });
                });
            });
            setPerformanceData(consolidated);
        } catch (error) {
            console.error("Error fetching class records", error);
        } finally {
            setLoading(false);
        }
    }, [department, semester, section]);

    useEffect(() => {
        fetchClassPerformance();
    }, [fetchClassPerformance]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-14 h-14 border-4 border-academic/10 border-t-academic rounded-full animate-spin" />
                <span className="text-sm font-black uppercase tracking-widest text-academic">Loading Master Sheet...</span>
            </div>
        );
    }

    const milestones = ["IA - 1", "IA - 2", "IA - 3", "IA - 4", "IA - 5", "Skill Test - 1", "Skill Test - 2"];

    return (
        <div className="w-full space-y-4">
            {/* Milestone Controller */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex gap-2">
                    {milestones.map(ia => (
                        <button
                            key={ia}
                            onClick={() => setActiveMilestone(ia)}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black tracking-widest transition-all uppercase ${
                                activeMilestone === ia ? "bg-academic text-white shadow-xl" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                        >
                            {ia}
                        </button>
                    ))}
                </div>
                <div className="px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
                     <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active Register: {activeMilestone}</span>
                </div>
            </div>

            {/* Master Table Scroll Container */}
            <div className="bg-white border-2 border-gray-800 rounded-sm overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto excel-table-container max-h-[70vh]">
                    <table className="w-full border-collapse text-[11px] font-bold text-gray-800">
                        <thead className="sticky top-0 z-40 bg-white">
                            {/* Primary Header Row */}
                            <tr className="border-b-2 border-gray-800">
                                <th rowSpan="2" className="border-r-2 border-gray-800 px-2 py-4 text-center min-w-[40px] sticky left-0 z-50 bg-gray-100">SL</th>
                                <th rowSpan="2" className="border-r-2 border-gray-800 px-4 py-4 text-left min-w-[120px] sticky left-[40px] z-50 bg-gray-100">REG NO</th>
                                <th rowSpan="2" className="border-r-2 border-gray-800 px-4 py-4 text-left min-w-[200px] sticky left-[160px] z-50 bg-gray-100">STUDENT NAME</th>
                                {subjectsList.map(sub => (
                                    <th key={sub.subjectId} colSpan="2" className="border-r-2 border-gray-800 px-2 py-3 text-center bg-gray-50 uppercase tracking-tight text-academic border-b">
                                        {sub.subjectName}
                                    </th>
                                ))}
                                <th rowSpan="2" className="px-6 py-4 text-center bg-gray-100 min-w-[100px]">STATUS</th>
                            </tr>
                            {/* Secondary Column Labels Row */}
                            <tr className="border-b-2 border-gray-800">
                                {subjectsList.map((sub, sIdx) => (
                                    <React.Fragment key={`sub-cols-${sIdx}`}>
                                        <th className="border-r border-gray-300 px-2 py-1.5 text-center bg-blue-50 text-[9px] min-w-[40px]">TOT</th>
                                        <th className="border-r-2 border-gray-800 px-2 py-1.5 text-center bg-teal-50 text-[9px] min-w-[45px]">ATT%</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {studentsList.map((student, idx) => {
                                const regNo = student.registrationNumber;
                                const studentPerformance = performanceData[regNo]?.[activeMilestone];
                                
                                return (
                                    <tr key={regNo} className="hover:bg-blue-50/30 transition-colors border-b-2 border-gray-200">
                                        <td className="border-r-2 border-gray-800 px-2 py-4 text-center sticky left-0 z-30 bg-white group-hover:bg-inherit">{idx + 1}</td>
                                        <td className="border-r-2 border-gray-800 px-4 py-4 text-academic font-black tracking-widest sticky left-[40px] z-30 bg-white group-hover:bg-inherit uppercase">{regNo}</td>
                                        <td className="border-r-2 border-gray-800 px-4 py-4 font-black uppercase tracking-tighter text-gray-900 sticky left-[160px] z-30 bg-white group-hover:bg-inherit truncate max-w-[200px]">{student.name}</td>
                                        {subjectsList.map(sub => {
                                            const data = studentPerformance?.[sub.subjectId] || { co1: 0, co2: 0, total: 0, att: null };
                                            const isAbsent = data.total === 0 && data.co1 === 0;

                                            return (
                                                <React.Fragment key={`data-${sub.subjectId}`}>
                                                    <td className={`border-r border-gray-300 px-1 py-4 text-center font-black ${Number(data.total) < 10 && !isAbsent ? 'text-red-500 bg-red-50' : 'text-academic'}`}>
                                                        {isAbsent ? 0 : data.total}
                                                    </td>
                                                    <td className={`border-r-2 border-gray-800 px-1 py-4 text-center font-black ${Number(data.att) < 75 && data.att !== null ? 'text-orange-500' : 'text-teal-600'}`}>
                                                        {data.att !== null ? `${data.att}%` : '-'}
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                        <td className="px-4 py-4 text-center font-black uppercase tracking-widest text-[8px] text-gray-400">
                                            Satisfactory
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .excel-table-container::-webkit-scrollbar {
                    height: 12px;
                    width: 12px;
                }
                .excel-table-container::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                .excel-table-container::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border: 3px solid #f1f5f9;
                    border-radius: 6px;
                }
                .excel-table-container::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                .shadow-r-bold {
                    box-shadow: 4px 0 10px rgba(0,0,0,0.15);
                }
            `}} />
        </div>
    );
};

export default UnifiedClassPerformance;
