import React from "react";
import { motion } from "framer-motion";

const Profile = ({ user }) => {
    const name = user?.name || "User";
    const email = user?.email || "N/A";
    const role = user?.role || "Staff";
    const department = user?.department || "General";

    return (
        <div className="space-y-12">
            {/* Header / Hero Section */}
            <div className="flex flex-col lg:flex-row items-center gap-12 pb-12 border-b-2 border-academic/10">
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-gold to-academic rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                    <div className="relative w-48 h-48 bg-academic flex items-center justify-center text-white text-7xl font-black rounded-full border-8 border-white shadow-2xl overflow-hidden">
                        {name.charAt(0)}
                    </div>
                </div>

                <div className="text-center lg:text-left space-y-4">
                    <div className="space-y-1">
                        <span className="px-4 py-1.5 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-gold/20">
                            OFFICIAL IDENTITY
                        </span>
                        <h2 className="text-6xl font-black text-academic classic-heading tracking-tight italic">
                            Prof. {name}
                        </h2>
                    </div>
                    
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">
                         <div className="px-6 py-2 bg-academic/5 border border-academic/10 rounded-sm">
                            <span className="text-[10px] font-black text-faded-ink uppercase tracking-widest block mb-1">Administrative Designation</span>
                            <span className="text-academic font-bold uppercase tracking-widest">{role}</span>
                         </div>
                         <div className="px-6 py-2 bg-gold/5 border border-gold/10 rounded-sm">
                            <span className="text-[10px] font-black text-faded-ink uppercase tracking-widest block mb-1">Departmental Division</span>
                            <span className="text-gold font-bold uppercase tracking-widest">{department}</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Contact Statistics */}
                <div className="space-y-6 bg-gray-50/50 p-10 rounded-sm border border-gray-100">
                    <h3 className="text-xl font-black text-academic uppercase tracking-widest border-b border-gray-200 pb-4">
                        Primary Credentials
                    </h3>
                    <div className="space-y-8">
                        <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Network Correspondence</span>
                            <span className="text-lg font-bold text-academic border-b-2 border-gold/30 pb-1">{email}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Academic Standing</span>
                            <span className="text-base font-bold text-academic uppercase tracking-widest bg-white px-4 py-2 border border-gray-200 shadow-sm inline-block">PERMANENT FACULTY</span>
                        </div>
                        <div className="pt-4">
                             <button className="px-10 py-4 bg-academic text-white font-black uppercase tracking-widest text-xs hover:bg-academic/90 transition-all shadow-lg shadow-academic/20">
                                Official Digital Signature 🖋️
                             </button>
                        </div>
                    </div>
                </div>

                {/* Status Dashboard */}
                <div className="space-y-6 bg-academic p-10 rounded-sm text-white">
                    <h3 className="text-xl font-black uppercase tracking-widest border-b border-white/10 pb-4">
                        Institutional Analytics
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                            <span className="text-[42px] font-black block leading-none mb-2 text-gold">85%</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Class Engagement</span>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                            <span className="text-[42px] font-black block leading-none mb-2 text-emerald-400">12</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Research Credits</span>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                            <span className="text-[42px] font-black block leading-none mb-2">4.8</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Student Rating</span>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                             <span className="text-[42px] font-black block leading-none mb-2 text-blue-400">#1</span>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Department Rank</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-white border-4 border-academic p-12 text-center relative overflow-hidden">
                <div className="absolute top-4 left-4 opacity-10 text-8xl transition-transform group-hover:scale-110">"</div>
                <p className="text-3xl font-black text-academic italic classic-heading tracking-tight relative z-10 leading-relaxed max-w-4xl mx-auto">
                    "Commited to fostering an environment of excellence, rigorous academic discipline, and transformative educational leadership within the {department} Department."
                </p>
            </div>
        </div>
    );
};

export default Profile;
