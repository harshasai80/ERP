// src/components/layout/Navbar.js
import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ name }) => {
  const navigate = useNavigate();
  return (
    <nav className="bg-blue-900 text-white py-0 px-5 h-16 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full w-full">
        <Link to="/" className="text-xl font-bold text-white">
          HOD Portal
        </Link>
        <div className="flex items-center">
          <span className="mr-4">{name}</span>
          <button
            className="bg-transparent text-white border border-white py-1 px-3 rounded-lg cursor-pointer hover:bg-white hover:bg-opacity-10"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
