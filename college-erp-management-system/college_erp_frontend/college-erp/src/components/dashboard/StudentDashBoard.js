import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavbar from "./BottomNavBar";
import Attendance from "../student/Attendance";
import IAMarks from "../student/IAMarks";
import Marquee from "../common/Marquee";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const student =
    location.state?.student?.data ||
    location.state?.student ||
    JSON.parse(localStorage.getItem("student"));

  return (
    <div className="min-h-screen w-full bg-mesh text-academic flex flex-col relative overflow-hidden font-sans">
      {/* Premium Institutional Header */}
      <nav className="relative z-10 glass border-b-2 border-gold py-7 px-10">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          {/* Left: Branding */}
          <div className="flex items-center gap-6 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gold/20 blur-sm rounded-full" />
              <img
                src="/logo192.png"
                alt="Logo"
                className="relative h-16 w-16 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black tracking-[0.22em] text-academic classic-heading uppercase">
                SGP <span className="text-gold">Portal</span>
              </h1>
              <p className="text-base uppercase font-bold tracking-[0.55em] text-faded-ink">
                Student Registry
              </p>
            </div>
          </div>

          {/* Right: Academic Identity & Actions */}
          <div className="hidden sm:flex items-center gap-12">
            <div className="flex items-center gap-6 text-right border-r border-gray-100 pr-12">
              <div>
                <p className="text-base font-black text-academic classic-heading tracking-tight underline decoration-gold/30 underline-offset-4">
                  {student?.name?.toUpperCase() || "N/A"}
                </p>
                <p className="text-base font-black text-gold uppercase tracking-[0.25em] mt-2">
                  REG NO: {student?.registrationNumber?.toUpperCase() || "N/A"}
                </p>
              </div>
              <div className="w-14 h-14 bg-academic flex items-center justify-center text-white font-black text-3xl shadow-xl">
                {student?.name?.charAt(0) || "S"}
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3.5 bg-burgundy text-white text-base font-black uppercase tracking-widest hover:bg-burgundy/90 transition-all active:scale-95 shadow-xl shadow-burgundy/20"
            >
              Terminate Session
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center gap-5">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 bg-burgundy text-white text-base font-bold uppercase tracking-widest active:scale-95"
            >
              Logout
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-academic text-2xl p-2"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Identity Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden px-10 pb-8 border-t border-gray-100 mt-5 overflow-hidden"
            >
              <div className="pt-6 flex items-center gap-6">
                <div className="w-14 h-14 bg-academic text-white flex items-center justify-center text-2xl font-black">
                  {student?.name?.charAt(0) || "S"}
                </div>
                <div className="text-base">
                  <p className="font-black text-academic classic-heading">
                    {student?.name?.toUpperCase() || "N/A"}
                  </p>
                  <p className="text-base font-bold text-gold uppercase tracking-widest">
                    REG: {student?.registrationNumber?.toUpperCase() || "N/A"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <Marquee />

      {/* Primary Dashboard Workspace */}
      <main className="flex-grow flex flex-col items-center justify-center px-8 py-24 relative">
        <div className="absolute inset-0 bg-academic/[0.02] -z-10" />

        {activeTab === "Dashboard" && (
          <motion.div
            className="w-full max-w-3xl"
            initial={{ opacity: 0, scale: 0.98, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="bg-white border-b-[10px] border-academic p-20 text-center relative shadow-[0_40px_120px_rgba(0,0,0,0.1)]">
              {/* Academic Crest Watermark */}
              <div className="absolute top-0 right-0 p-10 opacity-[0.04]">
                <img src="/logo192.png" alt="" className="w-40 h-40" />
              </div>

              <div className="mb-12 relative">
                <div className="w-32 h-32 bg-paper-white mx-auto flex items-center justify-center text-6xl shadow-inner border border-gray-100">
                  🏛️
                </div>
              </div>

              <div className="space-y-7">
                <div className="flex items-center justify-center gap-5">
                  <div className="h-[2px] w-10 bg-gold" />
                  <h2 className="text-base font-black text-gold uppercase tracking-[0.5em]">
                    Institutional Membership
                  </h2>
                  <div className="h-[2px] w-10 bg-gold" />
                </div>

                <h1 className="text-6xl font-black text-academic classic-heading leading-tight italic">
                  {student?.name?.toUpperCase() || "N/A"}
                </h1>

                <div className="w-28 h-1.5 bg-academic/10 mx-auto" />
              </div>

              <div className="grid grid-cols-2 gap-px bg-gray-100 mt-16 border border-gray-100 shadow-sm">
                <div className="p-10 bg-white hover:bg-gray-50 transition-colors">
                  <p className="text-base font-black text-faded-ink uppercase tracking-[0.35em] mb-3">Registration ID</p>
                  <p className="text-2xl font-black text-academic tracking-tighter">{student?.registrationNumber?.toUpperCase() || "N/A"}</p>
                </div>
                <div className="p-10 bg-white hover:bg-gray-50 transition-colors">
                  <p className="text-base font-black text-faded-ink uppercase tracking-[0.35em] mb-3">Academic Standing</p>
                  <p className="text-2xl font-black text-academic tracking-tighter">{student?.sem || "N/A"} Sem | {student?.section || "N/A"} Section</p>
                </div>
              </div>

              <div className="mt-14 text-base font-black text-faded-ink uppercase tracking-[0.55em] opacity-40">
                Official Student Record • MMXXIV
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "Attendance" && <Attendance student={student} />}
        {activeTab === "Results" && <IAMarks student={student} />}
      </main>

      {/* Bottom Academic Navigator */}
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}




