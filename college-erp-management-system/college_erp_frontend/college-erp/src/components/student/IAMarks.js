import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Api from "../../Api";

function IAMarks({ student, isDark = false }) {
  const [iaMarks, setIaMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await Api.get(`/iamarks/student/${student.registrationNumber}`);
        setIaMarks(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching IA marks", error);
      } finally {
        setLoading(false);
      }
    };
    if (student?.registrationNumber) {
      fetchMarks();
    }
  }, [student?.registrationNumber]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header section */}
      <div className="mb-10 text-center">
        <h2 className={`text-base font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"} uppercase tracking-[0.4em] mb-3`}>
          Institutional Evaluation
        </h2>
        <h1 className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${isDark ? "from-emerald-300 to-emerald-500" : "from-emerald-600 to-emerald-800"} bg-clip-text text-transparent classic-heading`}>
          Academic <span className={`font-light italic ${isDark ? "text-gray-400" : "text-gray-400"}`}>Records</span>
        </h1>
        <div className={`w-16 h-1 ${isDark ? "bg-emerald-500/10" : "bg-emerald-500/20"} mx-auto mt-6 rounded-full`} />
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className={`w-10 h-10 border-4 ${isDark ? "border-emerald-500/10" : "border-emerald-500/20"} border-t-emerald-500 rounded-full animate-spin`} />
        </div>
      ) : iaMarks.length === 0 ? (
        <div className={`lux-card ${isDark ? "bg-white/5 border-white/5" : "glass-gold"} p-14 text-center`}>
          <div className="text-4xl mb-4 opacity-20">📋</div>
          <p className={`text-base font-bold ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-widest`}>No performance records found in registry</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {iaMarks.map((rec, index) => {
            const marksData = JSON.parse(rec.iaMarks || "{}");
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`lux-card ${isDark ? "!bg-[#111318] !border-white/10" : "glass"} p-8 border hover:!border-emerald-500/40 transition-all group relative overflow-hidden`}
              >
                {/* Subtle card glow */}
                {isDark && <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />}

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-gray-800"} group-hover:text-emerald-400 transition-colors tracking-tight`}>
                      {rec.subject.subjectName}
                    </h3>
                    <p className={`text-base font-bold ${isDark ? "text-gray-500" : "text-gray-400"} uppercase tracking-[0.2em] mt-2`}>
                      {rec.subject.subjectCode} <span className="mx-2 opacity-20">|</span> SEM {rec.subject.semester}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${isDark ? "bg-white/5" : "bg-emerald-500/5"} rounded-2xl flex items-center justify-center text-2xl text-emerald-500 border ${isDark ? "border-white/10" : "border-emerald-500/10"} shadow-inner group-hover:scale-110 transition-transform`}>
                    📊
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  {Object.entries(marksData).map(([iaType, mark], idx) => (
                    <div key={idx} className={`flex justify-between items-center p-4 ${isDark ? "bg-white/[0.03] border border-white/5" : "bg-gray-50 border border-gray-100/50"} rounded-2xl hover:bg-white/[0.05] transition-colors`}>
                      <span className={`text-base font-bold ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-widest`}>{iaType}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-base font-black ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{mark}</span>
                        <span className={`text-base ${isDark ? "text-gray-600" : "text-gray-300"} font-bold`}>/ 25</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bar for visualization (average) */}
                <div className={`mt-8 pt-6 border-t ${isDark ? "border-white/5" : "border-emerald-500/5"} relative z-10`}>
                  <div className="flex justify-between items-center mb-3 px-1">
                    <span className={`text-base font-black ${isDark ? "text-emerald-500/50" : "text-emerald-600"} uppercase tracking-[0.2em]`}>Subject Proficiency</span>
                    <span className={`text-base font-black ${isDark ? "text-white/80" : "text-gray-400"} tracking-wider`}>
                      {Math.round((Object.values(marksData).reduce((a, b) => a + Number(b), 0) / (Object.values(marksData).length * 25)) * 100)}%
                    </span>
                  </div>
                  <div className={`w-full ${isDark ? "bg-white/10 border-white/5" : "bg-gray-100 border-gray-200/50"} rounded-full h-2 overflow-hidden border`}>
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000"
                      style={{ width: `${(Object.values(marksData).reduce((a, b) => a + Number(b), 0) / (Object.values(marksData).length * 25)) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default IAMarks;




