import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Api from "../../Api";

const UnifiedPerformance = ({ student }) => {
    const [performanceData, setPerformanceData] = useState({}); // { iaType: { subjectId: { marks: {}, att: {} } } }
    const [loading, setLoading] = useState(true);
    const [subjectsList, setSubjectsList] = useState([]);
    const [activeMilestone, setActiveMilestone] = useState("IA - 1");

    const fetchPerformance = useCallback(async () => {
        if (!student?.registrationNumber) return;
        setLoading(true);
        try {
            // 1. Fetch Subjects for the student's context
            const subRes = await Api.get(`/subjects/department/${student.department}/semester/${student.sem}`);
            const subjects = subRes.data?.data || [];
            setSubjectsList(subjects);

            // 2. Fetch All IA Marks
            const marksRes = await Api.get(`/iamarks/student/${student.registrationNumber}`);
            const rawMarks = marksRes.data?.data || [];

            // 3. Fetch All Attendance
            const attendanceRes = await Api.get("/students/all-attendance", {
                params: { registerNo: student.registrationNumber }
            });
            const allAttendance = attendanceRes.data?.data || [];

            // 4. Calculate Attendance Stats Subject-wise
            const attMap = {};
            allAttendance.forEach(day => {
                try {
                    const sessions = JSON.parse(day.sessions || "[]");
                    sessions.forEach(s => {
                        const sId = s.subjectId;
                        if (!sId) return;
                        if (!attMap[sId]) attMap[sId] = { attended: 0, total: 0 };
                        attMap[sId].total += 1;
                        if (s.status === "present") {
                            attMap[sId].attended += 1;
                        }
                    });
                } catch (e) { }
            });

            // 5. Organize into IA Milestone View
            const consolidated = {};
            const iaTypes = ["IA - 1", "IA - 2", "IA - 3", "IA - 4", "IA - 5", "Skill Test - 1", "Skill Test - 2", "Average"];
            
            iaTypes.forEach(iaType => {
                consolidated[iaType] = {};
                subjects.forEach(subject => {
                    const markRec = rawMarks.find(m => m.subject?.subjectId === subject.subjectId);
                    const marksJson = JSON.parse(markRec?.iaMarks || "{}");
                    const stats = attMap[subject.subjectId] || { attended: 0, total: 0 };
                    const attendancePct = stats.total > 0 
                        ? Math.round((stats.attended / stats.total) * 100) 
                        : null;

                    consolidated[iaType][subject.subjectId] = {
                        co1: marksJson[`${iaType}_CO1`] || marksJson[iaType] || 0,
                        co2: marksJson[`${iaType}_CO2`] || 0,
                        total: marksJson[iaType] || 0,
                        att: attendancePct
                    };
                });
            });

            setPerformanceData(consolidated);
            
            // Set first available milestone as active
            const milestones = iaTypes.filter(ia => 
                subjects.some(s => {
                    const d = consolidated[ia][s.subjectId];
                    return d?.total > 0 || d?.co1 > 0;
                })
            );
            if (milestones.length > 0) setActiveMilestone(milestones[0]);
            
        } catch (error) {
            console.error("Error fetching unified records", error);
        } finally {
            setLoading(false);
        }
    }, [student]);

    useEffect(() => {
        fetchPerformance();
    }, [fetchPerformance]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                <span className="text-base font-bold uppercase tracking-widest text-emerald-500/50">Synchronizing Evaluation Matrices...</span>
            </div>
        );
    }

    const availableMilestones = Object.keys(performanceData).filter(ia => 
        subjectsList.some(s => {
            const d = performanceData[ia][s.subjectId];
            return d?.total > 0 || d?.co1 > 0;
        })
    );

    if (availableMilestones.length === 0) {
        return (
            <div className="bg-white/50 backdrop-blur-xl border-2 border-dashed border-gray-200 p-20 text-center rounded-[2.5rem] mt-10">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📭</div>
                <h3 className="text-xl font-bold text-gray-800 classic-heading mb-2">Registry Empty</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-base">No performance analytics have been published for this student record</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-10 px-4 mt-6">
            {/* Milestone Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                {availableMilestones.map(ia => (
                    <button
                        key={ia}
                        onClick={() => setActiveMilestone(ia)}
                        className={`px-8 py-3 rounded-2xl font-black text-base uppercase tracking-widest transition-all ${
                            activeMilestone === ia 
                            ? "bg-academic text-white shadow-xl shadow-academic/20 scale-105" 
                            : "bg-white text-gray-400 hover:text-academic border border-gray-100"
                        }`}
                    >
                        {ia}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeMilestone}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden border border-gray-200 bg-white shadow-2xl rounded-xl"
                >
                    <div className="flex justify-between items-center p-6 border-b-2 border-gray-800 bg-gray-50/30">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-10 bg-academic" />
                            <div>
                                <h3 className="text-xl font-black text-academic uppercase tracking-widest">Performance Matrix</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Academic Session Registry • 2024</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest">
                             <span className="text-gray-400">Class: <span className="text-academic">{student.sem} Sem</span></span>
                             <span className="bg-academic text-white px-4 py-2 rounded-lg shadow-lg">{activeMilestone} Report</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto excel-table-container">
                        <table className="w-full border-collapse text-[11px] font-bold text-gray-800">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-800">
                                    <th rowSpan="2" className="border-r border-gray-800 px-4 py-5 text-center w-12 bg-gray-100">Sl</th>
                                    <th rowSpan="2" className="border-r border-gray-800 px-6 py-5 text-left w-36 bg-gray-100">Registration</th>
                                    <th rowSpan="2" className="border-r border-gray-800 px-6 py-5 text-left w-60 bg-gray-100">Student Identity</th>
                                    {subjectsList.map(sub => (
                                        <th key={sub.subjectId} colSpan="2" className="border-r border-gray-800 px-4 py-3 text-center bg-gray-50 uppercase tracking-tight text-academic border-b">
                                            {sub.subjectName}
                                        </th>
                                    ))}
                                    <th rowSpan="2" className="px-8 py-5 text-center bg-gray-100 w-40">Status Remarks</th>
                                </tr>
                                <tr className="bg-gray-50 border-b border-gray-800">
                                    {subjectsList.map((sub, sIdx) => (
                                        <React.Fragment key={`sub-cols-${sIdx}`}>
                                            <th className="border-r border-gray-300 px-1 py-1 text-[9px] text-center bg-blue-100/30 text-blue-800">TOTAL</th>
                                            <th className="border-r border-gray-800 px-1 py-1 text-[9px] text-center bg-teal-100/30 text-teal-800">ATT%</th>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-academic/[0.02] transition-colors border-b border-gray-100">
                                    <td className="border-r border-gray-800 px-4 py-6 text-center text-gray-400">01</td>
                                    <td className="border-r border-gray-800 px-6 py-6 text-academic font-black tracking-widest">{student.registrationNumber}</td>
                                    <td className="border-r border-gray-800 px-6 py-6 font-black uppercase tracking-tighter text-gray-900">{student.name}</td>
                                    {subjectsList.map(sub => {
                                        const data = performanceData[activeMilestone][sub.subjectId];
                                        const isAbsent = data.total === 0 && data.co1 === 0;

                                        return (
                                            <React.Fragment key={`data-cols-${sub.subjectId}`}>
                                                <td className={`border-r border-gray-300 px-1 py-6 text-center font-black ${Number(data.total) < 10 ? 'text-red-500 bg-red-50/50' : 'text-academic bg-blue-50/30'}`}>
                                                    {isAbsent ? 0 : data.total}
                                                </td>
                                                <td className={`border-r border-gray-800 px-1 py-6 text-center font-black ${Number(data.att) < 75 ? 'text-orange-600' : 'text-teal-600'}`}>
                                                    {data.att !== null ? `${data.att}%` : '-'}
                                                </td>
                                            </React.Fragment>
                                        );
                                    })}
                                    <td className="px-6 py-6 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[10px] font-black uppercase text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">Satisfactory</span>
                                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Active Standing</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="bg-gray-50/50 text-[9px] opacity-60">
                                    <td colSpan="3" className="border-r border-gray-800 px-6 py-2 text-right font-black text-gray-400 uppercase tracking-widest">Registry Target (60%)</td>
                                    {subjectsList.map(sub => (
                                        <React.Fragment key={`target-${sub.subjectId}`}>
                                            <td className="border-r border-gray-300 text-center font-black">15</td>
                                            <td className="border-r border-gray-800 text-center">75%</td>
                                        </React.Fragment>
                                    ))}
                                    <td className="bg-gray-100/50"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: `
                .excel-table-container::-webkit-scrollbar {
                    height: 8px;
                }
                .excel-table-container::-webkit-scrollbar-track {
                    background: transparent;
                }
                .excel-table-container::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .excel-table-container::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}} />
        </div>
    );
};

export default UnifiedPerformance;
