// src/components/layout/Navbar.js
import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ data }) => {
  const navigate = useNavigate();
  const name = data.name;

  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-4 px-6 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Left: Logo + Title */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo128.png"
            alt="SGP Logo"
            className="h-10 w-10 hover:rotate-12 transition-transform duration-300"
          />
          <span className="text-2xl font-bold tracking-wide">SGP ERP</span>
        </Link>

        {/* Center: Page title - Absolutely centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold tracking-wide text-white hidden md:block">
          Principal Portal
        </div>

        {/* Right: Welcome, Reset Password, Logout */}
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="hidden sm:inline-block font-medium text-white">
            Welcome, {name || "User"}
          </span>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-white font-medium text-sm transition"
            onClick={() => navigate("/reset-password", { state: { data } })}
          >
            Reset Password
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-black/60 hover:bg-black text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/faculty-dashboard", { state: { data } })}
            className="bg-black/60 hover:bg-black text-white px-4 py-2 rounded-md transition"
          >
            Shift to Faculty
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
