import { motion } from "framer-motion";

export default function BottomNavBar({ activeTab, setActiveTab }) {
  const tabs = ["Dashboard", "Attendance", "Results"];

  return (
    <div className="bg-academic border-t-2 border-gold py-6 flex justify-center gap-8 text-base font-bold uppercase tracking-[0.2em] text-white shadow-2xl z-[50]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-10 py-3 rounded-sm relative transition-all duration-500 ${isActive
                ? "bg-gold text-academic shadow-xl"
                : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: isActive ? 1.02 : 1.05 }}
          >
            <span className="relative z-10">{tab}</span>
          </motion.button>
        );
      })}
    </div>
  );
}




