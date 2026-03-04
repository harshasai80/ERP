import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="glass border-b-2 border-gold py-5 px-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gold/20 blur-sm rounded-full" />
            <motion.img
              src="/logo192.png"
              alt="Logo"
              className="relative h-12 w-12 group-hover:rotate-[360deg] transition-transform duration-1000"
              whileHover={{ scale: 1.1 }}
            />
          </div>
          <div>
            <h1 className="text-base sm:text-2xl font-bold tracking-[0.2em] text-academic classic-heading uppercase leading-none">
              SGP <span className="text-gold">Registry</span>
            </h1>
            <p className="text-base uppercase font-bold tracking-[0.5em] text-faded-ink mt-1">
              Directorate of Academics
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-academic text-white text-base font-bold uppercase tracking-widest hover:bg-academic/90 transition-all active:scale-95 shadow-lg shadow-academic/10">
          Institutional Home
        </button>
      </div>
    </nav>
  );
}




