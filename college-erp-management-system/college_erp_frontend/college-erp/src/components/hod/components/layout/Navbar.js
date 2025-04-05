// src/components/layout/Navbar.js
import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ name }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-4 px-6 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo + Title */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo128.png"
            alt="SGP Logo"
            className="h-10 w-10 hover:rotate-12 transition-transform duration-300"
          />
          <span className="text-2xl font-bold tracking-wide">SGP ERP</span>
        </Link>

        {/* Center: Page title */}
        <div className="hidden md:block text-lg font-semibold tracking-wide text-white">
          HOD Portal
        </div>

        {/* Right: Welcome + Logout */}
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline-block font-medium text-white">
            Welcome, {name || "User"}
          </span>
          <button
            onClick={() => navigate("/")}
            className="bg-black/60 hover:bg-black text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
