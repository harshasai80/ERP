import React, { useState, useEffect } from "react";
import UnifiedClassPerformance from "../../common/UnifiedClassPerformance";
import Api from "../../../Api";

const HODAnalytics = ({ department }) => {
    const [semester, setSemester] = useState(null);
    const [section, setSection] = useState("A");
    const [activeSemesters, setActiveSemesters] = useState([]);
    const [loadingSems, setLoadingSems] = useState(true);

    const sections = ["A", "B", "C", "D"];
    const semesters = [1, 2, 3, 4, 5, 6];

    useEffect(() => {
        // We still fetch students to check for active sems, but we won't hide buttons now.
        const fetchActiveSems = async () => {
            try {
                setLoadingSems(true);
                const res = await Api.get(`/student/department?department=${department}`);
                const students = res.data?.data || [];
                const sems = [...new Set(students.map(s => s.sem))].filter(s => s !== null && s > 0).sort((a, b) => a - b);
                setActiveSemesters(sems);
                
                if (sems.length > 0 && !semester) {
                    setSemester(sems[0]);
                } else if (!semester) {
                    setSemester(1);
                }
            } catch (error) {
                console.error("Error fetching departmental student distribution", error);
            } finally {
                setLoadingSems(false);
            }
        };
        fetchActiveSems();
    }, [department, semester]);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b-2 border-gray-800">
                <div className="space-y-2">
                    <h2 className="text-5xl font-black text-academic uppercase tracking-tighter">
                        Departmental <span className="text-gold">Intelligence</span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-academic text-white text-[10px] font-black uppercase tracking-widest">{department} Registry</span>
                        <div className="h-1 w-1 bg-gold rounded-full" />
                        <span className="text-faded-ink font-bold uppercase tracking-widest text-[10px]">Active Academic Cycles Only</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <div className="flex gap-1 pr-4 border-r border-gray-300">
                        {semesters.map(s => (
                            <button
                                key={s}
                                onClick={() => setSemester(s)}
                                className={`px-4 py-2.5 text-[10px] font-black transition-all rounded-lg uppercase tracking-widest ${semester === s ? 'bg-academic text-white shadow-xl scale-110' : activeSemesters.includes(s) ? 'text-gray-900 bg-white border border-gray-200 shadow-sm' : 'text-gray-300 hover:text-academic'}`}
                            >
                                Sem {s}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1 pl-2">
                        {sections.map(sec => (
                            <button
                                key={sec}
                                onClick={() => setSection(sec)}
                                className={`px-4 py-2.5 text-[10px] font-black transition-all rounded-lg uppercase tracking-widest ${section === sec ? 'bg-gold text-white shadow-xl scale-110' : 'text-gray-400 hover:text-gold'}`}
                            >
                                Sec {sec}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Analytics Sheet */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-academic" />
                    <div>
                        <h3 className="text-xl font-black text-academic uppercase tracking-widest">Collective Assessment Matrix</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Filtering results for active departmental enrolments</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm">
                    {semester ? (
                        <UnifiedClassPerformance 
                            department={department} 
                            semester={semester} 
                            section={section} 
                        />
                    ) : (
                        <div className="p-20 text-center text-gray-400 italic font-black uppercase tracking-widest">
                            {loadingSems ? "Identifying Student cohorts..." : "No Students found in your department archives"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HODAnalytics;
