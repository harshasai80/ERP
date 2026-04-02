import React, { useState, useEffect } from "react";
import Api from "../../Api";
import { motion } from "framer-motion";
import Navbar from "../principal/components/layout/Navbar"; // Reusing Principal's navbar
import Footer from "../common/footer/Footer";

const AdminDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await Api.get("/logs/all");
                setLogs(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-mesh text-academic font-sans">
            <Navbar data={{ name: "System Administrator", role: "ADMIN" }} />
            
            <main className="flex-grow container max-w-[1400px] mx-auto px-8 py-12">
                <div className="bg-white border border-gray-100 shadow-2xl p-10 rounded-sm">
                    <div className="mb-10 flex justify-between items-center">
                        <div>
                            <h2 className="text-4xl font-black text-academic uppercase tracking-tighter">
                                System <span className="text-burgundy">Audit Trail</span>
                            </h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
                                Real-time activity monitoring across all departments
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <span className="bg-emerald-50 text-emerald-600 px-4 py-2 text-xs font-black rounded-full border border-emerald-100 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
                                Live Monitoring
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-academic/10">
                                    <th className="py-5 px-4 text-xs font-black uppercase tracking-widest text-academic">Timestamp</th>
                                    <th className="py-5 px-4 text-xs font-black uppercase tracking-widest text-academic">Actor</th>
                                    <th className="py-5 px-4 text-xs font-black uppercase tracking-widest text-academic">Action Type</th>
                                    <th className="py-5 px-4 text-xs font-black uppercase tracking-widest text-academic">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="py-12 text-center text-gray-400 font-black uppercase animate-pulse">
                                            Retrieving audit logs...
                                        </td>
                                    </tr>
                                ) : logs.map((log, i) => (
                                    <motion.tr 
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-5 px-4 font-bold text-xs text-gray-400 font-mono">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="py-5 px-4 text-sm font-black text-academic">
                                            {log.actorEmail}
                                        </td>
                                        <td className="py-5 px-4">
                                            <span className={`px-3 py-1 text-[10px] font-black rounded-sm border ${
                                                log.actionType.includes("PUBLISHED") ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                log.actionType.includes("SAVED") ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                "bg-gray-100 text-gray-600 border-gray-200"
                                            }`}>
                                                {log.actionType}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4 text-sm font-bold text-faded-ink italic">
                                            {log.description}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
