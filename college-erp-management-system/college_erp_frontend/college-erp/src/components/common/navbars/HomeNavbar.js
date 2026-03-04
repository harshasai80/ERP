import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; // lucide-react is tree-shakable and smallish
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="glass border-b-2 border-gold sticky top-0 z-50 py-6 bg-white/95">
      <div className="container mx-auto px-10 flex items-center justify-between">
        <div className="flex items-center space-x-7 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gold/20 blur-sm rounded-full" />
            <motion.img
              src="/logo192.png"
              alt="Samba Polytechnic"
              className="relative h-16 w-16 group-hover:rotate-[360deg] transition-transform duration-1000"
              whileHover={{ scale: 1.05 }}
              width={64}
              height={64}
            />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black tracking-[0.22em] text-academic classic-heading uppercase leading-none">
              SGP <span className="text-gold">Registry</span>
            </h1>
            <p className="text-base uppercase font-bold tracking-[0.55em] text-faded-ink">
              Institutional Administration
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/role-based-login"
            className="text-base font-bold uppercase tracking-widest text-academic hover:text-gold transition-colors">
            Staff Portal
          </Link>
          <Link
            to="/login/student"
            className="btn-primary py-3 px-10 text-base">
            Student Register
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-academic focus:outline-none p-2"
            aria-label={isOpen ? "Close menu" : "Open menu"}>
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden px-8 pt-4 pb-10 space-y-6 bg-paper-white border-t-2 border-gold shadow-2xl absolute w-full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}>
            {[
              { label: "Administrative Access", to: "/role-based-login", primary: false },
              { label: "Student Registry", to: "/login/student", primary: true },
            ].map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}>
                <Link
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full text-base font-bold text-center px-8 py-5 uppercase tracking-widest transition-all duration-300 ${link.primary
                    ? "btn-primary"
                    : "text-academic border border-academic hover:bg-academic/5"
                    }`}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}




