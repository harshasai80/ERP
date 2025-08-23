import { motion } from "framer-motion";
export default function Marquee() {
  return (
    <div className="bg-emerald-700/40 backdrop-blur-sm py-2 overflow-hidden relative">
      <motion.div
        className="whitespace-nowrap text-sm md:text-base font-medium text-emerald-500"
        animate={{ x: ["100%", "-140%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
        🚀 This ERP System is made by SGP DCS batch 2022-25 students "
        <big className="text-emerald-300">
          Syed Mohammed Zuber, D Rohan Samuel
        </big>
        , M MD Abrar, Mohammed Nawaz, Anushka Reddy, Kamala Bai, Tania
        Khandelwal, Yaseen, J Mohammed Sahil, K A Harshita, K Sana Begum, Hafiza
        Muskan" 🚀
      </motion.div>
    </div>
  );
}
