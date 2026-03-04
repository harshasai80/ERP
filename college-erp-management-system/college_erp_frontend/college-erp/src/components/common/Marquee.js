import React, { memo } from "react";
import { motion } from "framer-motion";

function Marquee() {
  return (
    <div className="bg-emerald-700/40 backdrop-blur-sm py-2 overflow-hidden relative">
      <motion.div
        className="whitespace-nowrap text-base font-bold uppercase tracking-widest text-emerald-100"
        animate={{ x: ["100%", "-150%"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      >
      </motion.div>
    </div>
  );
}

// ✅ Wrapped with memo to avoid unnecessary re-renders
export default memo(Marquee);




