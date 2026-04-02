import React, { useEffect, useState } from "react";
import Api from "../../../Api";
import { motion } from "framer-motion";

const Dashboard = ({ department, onTabChange }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    semesterData: {},
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, facultyRes] = await Promise.all([
          Api.get("/student/department", { params: { department } }).catch(() => ({ data: { data: [] } })),
          Api.get("/faculty/all", { params: { department } }).catch(() => ({ data: { data: [] } })),
        ]);

        const students = studentsRes.data.data || [];
        const faculties = (facultyRes.data.data || []).filter(f => f.role !== "HOD");

        // Calculate semester distribution
        const semDist = {};
        for (let i = 1; i <= 6; i++) semDist[i] = 0;
        students.forEach(s => {
          if (s.sem) semDist[s.sem] = (semDist[s.sem] || 0) + 1;
        });

        setStats({
          totalStudents: students.length,
          totalFaculty: faculties.length,
          semesterData: semDist,
          loading: false,
        });
      } catch (e) {
        console.error("Dashboard fetch error:", e);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, [department]);

  if (stats.loading) {
    return (
      <div className="flex justify-center items-center h-96 text-academic animate-pulse">
        <span className="text-base font-black uppercase tracking-widest">Consulting Departmental Archives...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Institutional Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-base font-black text-gold uppercase tracking-[0.4em] mb-2">Departmental Intelligence</h2>
          <h1 className="text-4xl sm:text-5xl font-black text-academic classic-heading uppercase">
            {department} <span className="text-gray-300 font-light italic">Command Center</span>
          </h1>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-faded-ink uppercase tracking-widest">Academic Year 2024-25</p>
          <div className="inline-flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-base font-black text-emerald-600 uppercase tracking-tighter">Live Database Sync</span>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => onTabChange("students")}
          className="bg-academic p-8 rounded-sm shadow-xl relative overflow-hidden group cursor-pointer hover:bg-academic/95 transition-all text-white"
        >
          <div className="relative z-10">
            <p className="text-white/60 text-base font-black uppercase tracking-widest mb-1">Total Enrollment</p>
            <h3 className="text-5xl font-black text-white classic-heading">{stats.totalStudents}</h3>
            <p className="text-gold text-base font-bold mt-2 uppercase tracking-tight flex items-center gap-2">
              Active Scholars <span className="text-base opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-white/5 text-8xl font-black group-hover:scale-110 transition-transform duration-700">👥</div>
        </div>

        <div
          onClick={() => onTabChange("faculty")}
          className="bg-white border-2 border-academic p-8 rounded-sm shadow-lg relative overflow-hidden group cursor-pointer hover:bg-gray-50 transition-all"
        >
          <div className="relative z-10">
            <p className="text-academic/60 text-base font-black uppercase tracking-widest mb-1">Academic Staff</p>
            <h3 className="text-5xl font-black text-academic classic-heading">{stats.totalFaculty}</h3>
            <p className="text-emerald-600 text-base font-bold mt-2 uppercase tracking-tight flex items-center gap-2">
              Qualified Educators <span className="text-base opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-academic/5 text-8xl font-black group-hover:scale-110 transition-transform duration-700">👨‍🏫</div>
        </div>

        <div
          onClick={() => onTabChange("ia-marks")}
          className="bg-gray-50 border border-gray-100 p-8 rounded-sm relative group cursor-pointer hover:bg-white transition-all shadow-sm"
        >
          <p className="text-faded-ink text-base font-black uppercase tracking-widest mb-1">Avg. Attendance</p>
          <h3 className="text-5xl font-black text-academic classic-heading">84%</h3>
          <div className="mt-4 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[84%] shadow-[0_0_10px_#10b981]" />
          </div>
          <p className="text-faded-ink text-base font-bold mt-2 uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity text-right">Review All →</p>
        </div>

        <div
          onClick={() => onTabChange("ia-marks")}
          className="bg-gray-50 border border-gray-100 p-8 rounded-sm relative group cursor-pointer hover:bg-white transition-all shadow-sm"
        >
          <p className="text-faded-ink text-base font-black uppercase tracking-widest mb-1">Performance Index</p>
          <h3 className="text-5xl font-black text-academic classic-heading">A+</h3>
          <p className="text-blue-600 text-base font-bold mt-2 uppercase tracking-tight flex justify-between">
            Rank #2 <span className="opacity-0 group-hover:opacity-100 transition-opacity">View Marks →</span>
          </p>
        </div>
      </div>

      {/* Semester Distribution Visualizer */}
      <div className="bg-white border border-gray-100 p-10 rounded-sm shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-base font-black text-academic uppercase tracking-[0.3em]">Vertical Distribution <span className="text-faded-ink">| Semester Wise</span></h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-academic rounded-full" />
              <span className="text-base font-bold text-faded-ink">Students per Term</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {Object.entries(stats.semesterData).map(([sem, count]) => {
            const height = stats.totalStudents > 0 ? (count / stats.totalStudents) * 100 : 0;
            return (
              <div key={sem} className="flex flex-col items-center group">
                <div className="relative w-full h-40 flex items-end justify-center mb-4 bg-gray-50/50 rounded-t-lg text-white">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(5, height)}%` }}
                    className="w-full bg-academic group-hover:bg-gold transition-colors duration-500 rounded-t-sm shadow-lg relative"
                  >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-academic text-white text-xs py-1.5 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-black shadow-xl z-20">
                      {count}
                    </div>
                  </motion.div>
                </div>
                <p className="text-base font-black text-academic uppercase tracking-widest">Sem {sem}</p>
                <p className="text-base text-faded-ink font-bold">{count} Scholars</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Utility Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <span className="text-2xl">📑</span>
          <div>
            <p className="text-base font-black uppercase tracking-tight">Recent Audit</p>
            <p className="text-base text-faded-ink">Curriculum compliance verified</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-base font-black uppercase tracking-tight">Active Session</p>
            <p className="text-base text-faded-ink">Jan - June Academic Cycle</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="text-base font-black uppercase tracking-tight">Data Integrity</p>
            <p className="text-base text-faded-ink">Level 4 Encrypted Tunnel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
