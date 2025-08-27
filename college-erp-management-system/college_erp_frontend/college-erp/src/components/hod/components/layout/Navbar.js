// src/components/layout/Navbar.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // hamburger + close icons

const Navbar = ({ data }) => {
  const navigate = useNavigate();
  const name = data?.name || "User";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-4 px-6 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Left: Logo + Title */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo192.png"
            alt="SGP Logo"
            className="h-10 w-10 hover:rotate-12 transition-transform duration-300"
          />
          <span className="text-xl sm:text-2xl font-bold tracking-wide">
            SGP ERP
          </span>
        </Link>

        {/* Center: Page title (only visible on md+) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-base md:text-lg font-semibold tracking-wide hidden md:block">
          HOD Portal
        </div>

        {/* Right: Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 sm:gap-6">
          <span className="hidden sm:inline-block font-medium">
            Welcome, {name}
          </span>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-sm font-medium transition"
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

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 bg-emerald-700 rounded-lg shadow-md p-4 space-y-3">
          <p className="font-medium">Welcome, {name}</p>
          <button
            className="w-full bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-sm font-medium transition"
            onClick={() => {
              navigate("/reset-password", { state: { data } });
              setIsOpen(false);
            }}
          >
            Reset Password
          </button>
          <button
            onClick={() => {
              navigate("/");
              setIsOpen(false);
            }}
            className="w-full bg-black/60 hover:bg-black px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
          <button
            onClick={() => {
              navigate("/faculty-dashboard", { state: { data } });
              setIsOpen(false);
            }}
            className="w-full bg-black/60 hover:bg-black px-4 py-2 rounded-md transition"
          >
            Shift to Faculty
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
