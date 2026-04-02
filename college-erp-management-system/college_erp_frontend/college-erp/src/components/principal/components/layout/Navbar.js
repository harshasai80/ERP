// src/components/layout/Navbar.js
import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ data, onProfileClick }) => {
  const navigate = useNavigate();
  const name = data?.name || "Principal";
  const email = data?.email || "";

  return (
    <nav className="glass sticky top-0 z-[100] border-b border-emerald-500/10 py-4 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Logo + Branding */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full animate-pulse" />
            <img
              src="/logo192.png"
              alt="SGP Logo"
              className="relative h-12 w-12 group-hover:rotate-[360deg] transition-transform duration-700"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-[0.2em] text-emerald-600 classic-heading">SGP ERP</span>
            <span className="text-base uppercase tracking-[0.4em] text-gray-400 font-bold">Institutional Admin</span>
          </div>
        </Link>

        {/* Center: Identity */}
        <div 
          className="flex flex-col items-center cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all"
          onClick={onProfileClick}
        >
          <h2 className="text-gray-900 font-bold text-base classic-heading">Welcome, {name}</h2>
          {email && <p className="text-emerald-600 text-base font-bold tracking-widest uppercase opacity-70">{email}</p>}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            className="px-5 py-2.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500 text-emerald-700 hover:text-white transition-all duration-300 text-base font-bold uppercase tracking-widest border border-emerald-500/10 shadow-sm active:scale-95"
            onClick={() => navigate("/reset-password", { state: { data } })}
          >
            Reset
          </button>
          <button
            onClick={() => navigate("/faculty-dashboard", { state: { data } })}
            className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white transition-all duration-300 text-base font-bold uppercase tracking-widest shadow-lg active:scale-95"
          >
            Switch
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-300 text-base font-bold uppercase tracking-widest shadow-lg active:scale-95 shadow-emerald-500/20"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




