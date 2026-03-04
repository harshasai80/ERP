import { useState } from "react";
import AttendanceTab from "../faculty/AttendanceTab";
import IAMarksTab from "../faculty/IAMarksTab";
import ViewStudentsTab from "../faculty/ViewStudentsTab";
import AssigningSubjects from "../faculty/AssigningSubjects";

import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Marquee from "../common/Marquee";
import Footer from "../common/footer/Footer";

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("assigning-subjects");
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state?.data;
  const facultyName = data?.name || "Faculty";
  const facultyRole = data?.role || "Role";

  const isNotFaculty = data?.role === "HOD" || data?.role === "PRINCIPAL" || data?.role === "ADMIN";

  const tabs = [
    { id: "attendance", label: "Attendance", icon: "📋" },
    { id: "assessment", label: "Internal Assessment", icon: "📝" },

    { id: "view-students", label: "View Students", icon: "👥" },
    { id: "assigning-subjects", label: "Subject Management", icon: "🔗" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-mesh text-academic font-sans overflow-hidden">
      {/* Premium Administrative Header */}
      <header className="glass sticky top-0 z-[100] border-b-2 border-gold py-7 px-10">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          {/* Left: Academic Branding */}
          <div className="flex items-center gap-6 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gold/20 blur-sm rounded-full" />
              <img
                src="/logo192.png"
                alt="SGP Logo"
                className="relative h-16 w-16 group-hover:rotate-[360deg] transition-transform duration-1000"
              />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black tracking-[0.22em] text-academic classic-heading uppercase">
                SGP <span className="text-gold">Registry</span>
              </h1>
              <p className="text-base uppercase font-bold tracking-[0.45em] text-faded-ink">
                Directorate of Academics
              </p>
            </div>
          </div>

          {/* Center: Identity */}
          <div className="flex flex-col items-center border-x border-gray-100 px-12">
            <h2 className="text-2xl font-black text-academic classic-heading tracking-tight italic">Prof. {facultyName}</h2>
            <div className="flex items-center gap-2.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-base uppercase font-black text-academic tracking-[0.25em]">
                {facultyRole} {data?.department && data.department !== "ALL" ? ` - ${data.department}` : ""}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <button
              className="px-6 py-3 text-academic text-base font-bold uppercase tracking-widest border border-academic hover:bg-academic/5 transition-all active:scale-95"
              onClick={() => navigate("/reset-password", { state: { data } })}>
              Security Reset
            </button>
            {isNotFaculty && (
              <button
                onClick={() => {
                  let path = "/hod-dashboard";
                  if (data?.role === "PRINCIPAL") path = "/principal-dashboard";
                  if (data?.role === "ADMIN") path = "/admin";
                  navigate(path, { state: { data } });
                }}
                className="btn-primary py-3 px-6 text-base">
                Shift Role
              </button>
            )}
            <button
              className="px-6 py-3 bg-burgundy text-white text-base font-bold uppercase tracking-widest hover:bg-burgundy/90 transition-all active:scale-95 shadow-lg shadow-burgundy/20"
              onClick={() => navigate("/")}>
              Terminate Session
            </button>
          </div>
        </div>
      </header>

      {/* Modern Navigation Tabs */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-[105px] z-[90]">
        <div className="max-w-[1500px] mx-auto px-10 py-6">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-5 bg-gray-50 p-2.5 rounded-lg w-fit border border-gray-200 shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`relative px-9 py-4 rounded-md text-base font-black uppercase tracking-[0.15em] transition-all duration-300
                        ${activeTab === tab.id
                    ? "text-white shadow-xl"
                    : "text-faded-ink hover:text-academic hover:bg-white"}`}
                onClick={() => handleTabChange(tab.id)}>
                <span className="relative z-20 flex items-center gap-3.5">
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="facultyTabUnderlay"
                    className="absolute inset-0 bg-academic z-0"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <Marquee />

      {/* Administrative Task Area */}
      <main className="flex-grow p-8 sm:p-14 max-w-[1500px] mx-auto w-full">
        <motion.div
          className="w-full bg-white border border-gray-100 shadow-[0_20px_100px_rgba(0,0,0,0.06)] p-10 sm:p-16 rounded-sm"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          key={activeTab}>
          {activeTab === "attendance" && <AttendanceTab faculty={data} />}
          {activeTab === "assessment" && <IAMarksTab faculty={data} />}

          {activeTab === "view-students" && <ViewStudentsTab faculty={data} />}
          {activeTab === "assigning-subjects" && <AssigningSubjects faculty={data} />}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyDashboard;




