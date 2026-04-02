import React, { useState, useEffect } from "react";
import Api from "../../Api";
import { motion } from "framer-motion";

const departments = ["DCS", "DEEE", "DME", "DCE", "DMT"];
const semesters = [1, 2, 3, 4, 5, 6];
const sections = ["A", "B", "C", "D"];

function MarksAnalytics({ faculty }) {
    const [filters, setFilters] = useState({
        department: faculty?.department || "DCS",
        semester: "",
        section: "",
        subjectId: "",
    });
    const [subjects, setSubjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            if (filters.department && filters.semester) {
                try {
                    const response = await Api.get(`/subjects/department/${filters.department}/semester/${filters.semester}`);
                    setSubjects(response.data?.data || []);
                } catch (error) {
                    console.error("Error fetching subjects", error);
                }
            }
        };
        fetchSubjects();
    }, [filters.department, filters.semester]);

    const calculateStats = async () => {
        if (!filters.department || !filters.semester || !filters.section || !filters.subjectId) return;
        
        try {
            setLoading(true);
            const res = await Api.get(`/iamarks/filter?department=${filters.department}&semester=${filters.semester}&section=${filters.section}&subjectId=${filters.subjectId}`);
            const marks = res.data?.data || [];
            
            if (marks.length === 0) {
                setStats(null);
                return;
            }

            const processed = marks.map(m => JSON.parse(m.iaMarks || "{}"));
            
            const ia1 = processed.map(p => Number(p["IA - 1"] || 0)).filter(m => m > 0);
            const ia2 = processed.map(p => Number(p["IA - 2"] || 0)).filter(m => m > 0);
            const ia3 = processed.map(p => Number(p["IA - 3"] || 0)).filter(m => m > 0);

            const getAvg = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : 0;
            const getMax = (arr) => arr.length ? Math.max(...arr) : 0;
            const getMin = (arr) => arr.length ? Math.min(...arr) : 0;

            setStats({
                count: marks.length,
                ia1: { avg: getAvg(ia1), max: getMax(ia1), min: getMin(ia1) },
                ia2: { avg: getAvg(ia2), max: getMax(ia2), min: getMin(ia2) },
                ia3: { avg: getAvg(ia3), max: getMax(ia3), min: getMin(ia3) },
            });
        } catch (error) {
            console.error("Error calculating stats", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-inner">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-black text-faded-ink uppercase tracking-widest">Dept</label>
                    <select 
                        className="bg-white p-4 rounded-xl border border-gray-200 focus:border-gold outline-none"
                        value={filters.department}
                        onChange={e => setFilters({...filters, department: e.target.value})}
                    >
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-black text-faded-ink uppercase tracking-widest">Sem</label>
                    <select 
                        className="bg-white p-4 rounded-xl border border-gray-200 focus:border-gold outline-none"
                        value={filters.semester}
                        onChange={e => setFilters({...filters, semester: e.target.value})}
                    >
                        <option value="">Select Sem</option>
                        {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-black text-faded-ink uppercase tracking-widest">Section</label>
                    <select 
                        className="bg-white p-4 rounded-xl border border-gray-200 focus:border-gold outline-none"
                        value={filters.section}
                        onChange={e => setFilters({...filters, section: e.target.value})}
                    >
                        <option value="">Select Section</option>
                        {sections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-black text-faded-ink uppercase tracking-widest">Subject</label>
                    <select 
                        className="bg-white p-4 rounded-xl border border-gray-200 focus:border-gold outline-none"
                        value={filters.subjectId}
                        onChange={e => setFilters({...filters, subjectId: e.target.value})}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>)}
                    </select>
                </div>
            </div>

            <button 
                onClick={calculateStats}
                className="btn-primary px-10 py-4 w-full sm:w-auto"
            >
                Generate Intelligence Report
            </button>

            {loading && <div className="text-center p-20 animate-pulse text-gold uppercase font-black tracking-widest">Crunching Performance Data...</div>}

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(num => (
                        <motion.div 
                            key={num}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 border-b-4 border-academic shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-black">IA{num}</div>
                            <h3 className="text-xl font-black text-academic mb-6 uppercase tracking-tighter">Internal Assessment {num}</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                    <span className="text-sm font-bold text-faded-ink uppercase">Average Score</span>
                                    <span className="text-3xl font-black text-gold">{stats[`ia${num}`].avg}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                    <span className="text-sm font-bold text-faded-ink uppercase">Highest Score</span>
                                    <span className="text-3xl font-black text-academic">{stats[`ia${num}`].max}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-faded-ink uppercase">Lowest Score</span>
                                    <span className="text-3xl font-black text-burgundy">{stats[`ia${num}`].min}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MarksAnalytics;
