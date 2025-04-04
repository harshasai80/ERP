import { motion } from "framer-motion";

export default function BottomNavBar({ activeTab, setActiveTab }) {
  const tabs = ["Dashboard", "Attendance", "Results"];

  return (
    <div className="bg-gray-900 border-t border-gray-800 py-3 md:py-4 flex justify-center gap-6 md:gap-12 text-sm md:text-base font-semibold text-white">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg relative overflow-hidden transition-all duration-300 ${
              isActive
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-gray-800 text-gray-300 hover:bg-emerald-700 hover:text-white"
            }`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: isActive ? 1.02 : 1.05 }}
          >
            {tab}
          </motion.button>
        );
      })}
    </div>
  );
}
